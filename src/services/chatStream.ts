export interface StreamChunkEvent {
  type: "text" | "reasoning" | "tool_call" | "tool_result" | "error" | "done";
  content?: string;
  reasoning?: string;
  tool?: string;
  args?: string;
  result?: string;
}

export interface StreamRetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  onRetryAttempt?: (attempt: number, error: Error) => void;
  signal?: AbortSignal;
}

export async function sendConsoleChatMessageStream(
  sessionId: string,
  message: string,
  agentId?: string,
  onChunk?: (text: string) => void,
  onReasoning?: (reasoning: string) => void,
  onToolCall?: (tool: string, args: string, result?: string, state?: "calling" | "success" | "error") => void,
  options: StreamRetryOptions = {}
): Promise<{ text: string; reasoning?: string }> {
  const maxRetries = options.maxRetries ?? 2;
  const initialDelay = options.initialDelayMs ?? 1000;

  const targetAgent = (agentId || "mons").toLowerCase();

  // Format standard QwenPaw console input
  const payload = {
    user_id: "default",
    session_id: sessionId || `session-${Date.now()}`,
    agent_id: targetAgent,
    channel: "console",
    input: [
      {
        role: "user",
        type: "message",
        content: [{ type: "text", text: message }]
      }
    ]
  };

  let lastError: Error | null = null;
  let accumulatedText = "";
  let accumulatedReasoning = "";
  const activeToolCalls: Record<string, { tool: string; args: string; result?: string; state: "calling" | "success" | "error" }> = {};
  let lastActiveToolCallId: string | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        options.onRetryAttempt?.(attempt, lastError || new Error("Connection dropped"));
        await new Promise((res) => setTimeout(res, initialDelay * Math.pow(2, attempt - 1)));

        // Proposal 2: Streaming Fallback Reconnection
        // If a tool call was left running when connection dropped, attempt to reconnect directly to QwenPaw's tool-calls stream
        if (lastActiveToolCallId && sessionId) {
          try {
            console.log(`[chatStream] Attempting tool output stream reconnect for tool_call_id ${lastActiveToolCallId}`);
            const toolReceiptsRes = await fetch(`/api/agents/sessions/${encodeURIComponent(sessionId)}/tool-receipts?agentId=${encodeURIComponent(targetAgent)}`);
            if (toolReceiptsRes.ok) {
              const receipts = await toolReceiptsRes.json();
              const matching = receipts.find((r: any) => r.tool_call_id === lastActiveToolCallId);
              if (matching && matching.status === "succeeded") {
                onToolCall?.(matching.capability_id || "Tool", "", matching.output_hash || "Completed in background", "success");
              }
            }
          } catch (reconnectErr) {
            console.warn("[chatStream] Tool reconnect check failed, continuing normal chat retry:", reconnectErr);
          }
        }
      }

      const response = await fetch("/api/agents/console/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Agent-Id": targetAgent,
          Accept: "text/event-stream"
        },
        body: JSON.stringify(payload),
        signal: options.signal
      });

      if (!response.ok) {
        throw new Error(`Chat stream request failed: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No response body available for streaming");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(":")) continue;

          if (trimmed.startsWith("data:")) {
            const rawData = trimmed.replace(/^data:\s*/, "");
            if (rawData === "[DONE]") {
              return { text: accumulatedText, reasoning: accumulatedReasoning || undefined };
            }

            try {
              const parsed = JSON.parse(rawData);

              // 1. Text Delta Streaming
              if (parsed.object === "content" && parsed.type === "text") {
                if (parsed.delta && parsed.text) {
                  accumulatedText += parsed.text;
                  onChunk?.(accumulatedText);
                } else if (!parsed.delta && parsed.text && !accumulatedText) {
                  accumulatedText = parsed.text;
                  onChunk?.(accumulatedText);
                }
              }

              // 2. Direct message delta compatibility
              if (parsed.content && typeof parsed.content === "string") {
                accumulatedText += parsed.content;
                onChunk?.(accumulatedText);
              } else if (parsed.delta && typeof parsed.delta === "string") {
                accumulatedText += parsed.delta;
                onChunk?.(accumulatedText);
              }

              // 3. Reasoning / Thinking traces
              if (parsed.type === "reasoning" && parsed.content) {
                const textItem = parsed.content.find((c: any) => c.text);
                if (textItem?.text) {
                  accumulatedReasoning = textItem.text;
                  onReasoning?.(accumulatedReasoning);
                }
              }

              // 4. Plugin / Tool calls (calling state)
              if (parsed.type === "plugin_call") {
                const dataItem = parsed.content?.[0]?.data;
                if (dataItem) {
                  const callId = dataItem.call_id || "call-1";
                  lastActiveToolCallId = callId;
                  const toolName = dataItem.name || "Tool";
                  const args = dataItem.arguments || "";
                  activeToolCalls[callId] = {
                    tool: toolName,
                    args: args,
                    state: "calling"
                  };
                  onToolCall?.(toolName, args, undefined, "calling");
                }
              } else if (parsed.object === "content" && parsed.data?.name) {
                const callId = parsed.data.call_id || "call-1";
                lastActiveToolCallId = callId;
                const toolName = parsed.data.name;
                const args = parsed.data.arguments || "";
                activeToolCalls[callId] = {
                  tool: toolName,
                  args: args,
                  state: "calling"
                };
                onToolCall?.(toolName, args, undefined, "calling");
              }

              // 5. Plugin / Tool call outputs (result state)
              if (parsed.type === "plugin_call_output") {
                const dataItem = parsed.content?.[0]?.data;
                if (dataItem) {
                  const callId = dataItem.call_id || "call-1";
                  const resultStr = dataItem.output || "";
                  const state = dataItem.state === "error" ? "error" : "success";
                  const toolName = dataItem.name || activeToolCalls[callId]?.tool || "Tool";
                  const args = activeToolCalls[callId]?.args || "";
                  onToolCall?.(toolName, args, resultStr, state);
                }
              } else if (parsed.object === "content" && parsed.data && "output" in parsed.data) {
                const callId = parsed.data.call_id || "call-1";
                const resultStr = parsed.data.output || "";
                const state = parsed.data.state === "error" ? "error" : "success";
                const toolName = parsed.data.name || activeToolCalls[callId]?.tool || "Tool";
                const args = activeToolCalls[callId]?.args || "";
                onToolCall?.(toolName, args, resultStr, state);
              }
            } catch {
              // Non-JSON SSE payload: treat as raw text chunk
              if (rawData && !rawData.startsWith("{") && !rawData.startsWith("[")) {
                accumulatedText += rawData;
                onChunk?.(accumulatedText);
              }
            }
          }
        }
      }

      if (accumulatedText.length > 0) {
        return { text: accumulatedText, reasoning: accumulatedReasoning || undefined };
      }
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[chatStream] Attempt ${attempt + 1}/${maxRetries + 1} failed:`, lastError.message);

      if (accumulatedText.length > 20) {
        break;
      }
    }
  }

  if (accumulatedText) {
    return { text: accumulatedText, reasoning: accumulatedReasoning || undefined };
  }
  throw lastError || new Error(`Agent ${targetAgent} returned no response`);
}
