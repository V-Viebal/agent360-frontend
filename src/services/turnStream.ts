import type { ChatMessage, ChatStep, ToolCallItem } from "../types/agent";
import { API_BASE_URL, getAuthHeaders, isInternalRuntimeMessage, stripInternalExecutionArtifacts } from "./agentApi";

/**
 * Folds AgentCore turn events (the same SSE protocol used by console/chat and by reconnect attach for any
 * channel) into one assistant ChatMessage. Console sends and live-attached channel turns share this reducer
 * so reasoning, every executed tool call, and the streamed answer render identically.
 */
export class TurnAccumulator {
  private readonly messageTypes = new Map<string, string>();
  private readonly reasoningById = new Map<string, string>();
  private readonly textById = new Map<string, string>();
  private readonly textOrder: string[] = [];
  private readonly tools: ToolCallItem[] = [];
  private readonly stepOrder: Array<{ kind: "reasoning"; id: string } | { kind: "tool_call"; callId: string }> = [];
  private readonly toolMsgToCall = new Map<string, string>();
  private lastActiveMsgId: string | null = null;
  done = false;
  userText: string | null = null;
  hasSeenStructuredEvents = false;

  constructor(private readonly messageId: string) {}

  ingest(event: any): boolean {
    if (!event || typeof event !== "object") return false;
    if (event.object === "response") {
      if (event.status === "completed" || event.status === "failed" || event.status === "canceled" || event.status === "cancelled") {
        this.done = true;
      }
      return true;
    }
    if (event.object === "message") {
      const id = (event.id as string) || `msg-${this.stepOrder.length}`;
      const type = event.type || event.message_type || "message";
      if (isInternalRuntimeMessage(event)) {
        return false;
      }
      if (event.role === "user") {
        let text = typeof event.content === "string"
          ? event.content.trim()
          : (event.content || []).map((c: any) => c?.text || "").join("\n").trim();
        let roomCtxIdx = text.indexOf("[SHARED SESSION ROOM CONTEXT]");
        if (roomCtxIdx < 0) roomCtxIdx = text.indexOf("[AGENTTEAMS COLLABORATION ROOM");
        if (roomCtxIdx >= 0) {
          text = text.slice(0, roomCtxIdx).trimEnd();
        }
        if (text) {
          this.userText = text;
          return true;
        }
        return false;
      }
      this.hasSeenStructuredEvents = true;
      this.lastActiveMsgId = id;
      this.messageTypes.set(id, type);
      if ((type === "reasoning" || type === "thinking") && !this.reasoningById.has(id)) {
        this.reasoningById.set(id, "");
        this.stepOrder.push({ kind: "reasoning", id });
      }
      if (typeof event.content === "string" && event.content) {
        this.ingestContent({ type: "text", text: event.content, msg_id: id }, event.status === "completed");
      } else if (Array.isArray(event.content)) {
        for (const part of event.content) {
          this.ingestContent({ ...part, msg_id: part?.msg_id || id }, event.status === "completed");
        }
      }
      if ((type === "plugin_call" || type === "tool_call" || type === "function_call" || type === "tool" || type === "plugin_call_output" || type === "tool_result" || type === "function_result") && (event.data || event.payload)) {
        this.ingestContent({ type: "data", data: event.data || event.payload, msg_id: id, status: event.status }, event.status === "completed");
      }
      return true;
    }
    if (event.object === "content") {
      this.hasSeenStructuredEvents = true;
      this.ingestContent(event, event.status === "completed");
      return true;
    }
    return false;
  }

  private ingestContent(part: any, completed: boolean) {
    if (!part || typeof part !== "object") return;
    const msgId: string = part.msg_id || this.lastActiveMsgId || "default-msg";
    const msgType = this.messageTypes.get(msgId) || (part.type === "reasoning" || part.type === "thinking" ? "reasoning" : "message");
    if (part.type === "text" || part.type === "reasoning" || part.type === "thinking") {
      const isReasoning = msgType === "reasoning" || msgType === "thinking" || part.type === "reasoning" || part.type === "thinking";
      if (isReasoning && !this.reasoningById.has(msgId)) {
        this.reasoningById.set(msgId, "");
        if (!this.stepOrder.some((s) => s.kind === "reasoning" && s.id === msgId)) {
          this.stepOrder.push({ kind: "reasoning", id: msgId });
        }
      }
      const target = isReasoning ? this.reasoningById : this.textById;
      if (!isReasoning && !this.textById.has(msgId)) this.textOrder.push(msgId);
      const prev = target.get(msgId) || "";
      target.set(msgId, part.delta ? prev + (part.text || "") : (part.text || prev));
      return;
    }
    if (part.type !== "data" || !part.data) return;
    const d = part.data;
    const callId: string = d.call_id || d.tool_call_id || d.id || this.toolMsgToCall.get(msgId) || (msgId !== "default-msg" ? msgId : `call-${this.tools.length + 1}`);
    if (msgId && msgId !== "default-msg") this.toolMsgToCall.set(msgId, callId);
    let tool = this.tools.find((t) => t.call_id === callId);
    if (!tool) {
      tool = { id: callId, call_id: callId, tool: d.name || d.function?.name || "Tool", args: "", state: "calling" };
      this.tools.push(tool);
      this.stepOrder.push({ kind: "tool_call", callId });
    }
    if (d.name || d.function?.name) tool.tool = d.name || d.function?.name;
    const rawArgs = d.arguments !== undefined ? d.arguments : d.function?.arguments !== undefined ? d.function.arguments : d.args;
    if (rawArgs !== undefined) {
      const args = typeof rawArgs === "string" ? rawArgs : JSON.stringify(rawArgs);
      tool.args = part.delta && (msgType === "plugin_call" || msgType === "tool_call") ? (tool.args || "") + args : args;
    }
    const rawOutput = d.output !== undefined ? d.output : d.result;
    if (msgType === "plugin_call_output" || msgType === "tool_result" || msgType === "function_result" || rawOutput !== undefined) {
      if (rawOutput !== undefined && rawOutput !== "") {
        tool.result = typeof rawOutput === "string" ? rawOutput : JSON.stringify(rawOutput);
      }
      if (completed || part.status === "completed" || msgType === "plugin_call_output" || msgType === "tool_result" || rawOutput !== undefined) {
        tool.state = d.state === "error" || d.status === "error" || Boolean(d.error) ? "error" : "success";
        tool.exitCode = tool.state === "error" ? 1 : 0;
      }
    }
  }

  get textSegments(): string[] {
    return this.textOrder.map((id) => stripInternalExecutionArtifacts(this.textById.get(id) || "")).filter(Boolean);
  }

  get text(): string {
    return this.textSegments.join("\n\n");
  }

  snapshot(base: Partial<ChatMessage> = {}): ChatMessage {
    const steps: ChatStep[] = [];
    for (const s of this.stepOrder) {
      if (s.kind === "reasoning") {
        const text = (this.reasoningById.get(s.id) || "").trim();
        if (text) steps.push({ kind: "reasoning", id: s.id, text });
      } else {
        const t = this.tools.find((x) => x.call_id === s.callId);
        if (t) steps.push({ kind: "tool_call", ...t, state: this.done && t.state === "calling" ? "success" : t.state });
      }
    }
    const reasoning = steps.filter((s) => s.kind === "reasoning").map((s) => s.text).join("\n");
    const segs = this.textSegments;
    return {
      id: this.messageId,
      role: "assistant",
      timestamp: new Date().toISOString(),
      evidenceStatus: "observed",
      ...base,
      content: segs.join("\n\n"),
      textSegments: segs.length > 0 ? segs : undefined,
      reasoning,
      steps,
      toolCalls: steps.filter((s) => s.kind === "tool_call").map(({ kind, text, ...t }) => t as ToolCallItem),
    };
  }
}

/** Parses an SSE body and yields JSON events; ignores comments and keep-alives. */
export async function* readSseEvents(body: ReadableStream<Uint8Array>, signal?: AbortSignal): AsyncGenerator<any> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (!signal?.aborted) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const raw = trimmed.slice(5).trim();
        if (!raw || raw === "[DONE]") continue;
        try {
          yield JSON.parse(raw);
        } catch {}
      }
    }
  } finally {
    try { reader.releaseLock(); } catch {}
  }
}

/**
 * Attaches to the live turn of a chat on any channel. Resolves true when a turn was streamed, false when the
 * session was idle (empty body).
 */
export async function attachLiveTurn(
  agentId: string,
  chatId: string,
  onUpdate: (msg: ChatMessage, userText: string | null) => void,
  signal: AbortSignal
): Promise<boolean> {
  const cleanAgent = agentId.replace(/^bot:agent360:/, "");
  const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanAgent)}/chats/${encodeURIComponent(chatId)}/live`, {
    headers: { Accept: "text/event-stream", ...getAuthHeaders(cleanAgent) },
    signal,
  });
  if (!res.ok || !res.body) return false;
  const acc = new TurnAccumulator(`live-${chatId}`);
  let sawTurn = false;
  let emittedInitial = false;
  let lastEmit = 0;
  for await (const ev of readSseEvents(res.body, signal)) {
    if (ev?.object === "response" || ev?.object === "message" || ev?.object === "content") {
      sawTurn = true;
    }
    if (!acc.ingest(ev)) continue;
    const now = performance.now();
    const isStructuralEvent = ev?.object === "message" || (ev?.object === "content" && ev?.type === "data");
    if (!emittedInitial || isStructuralEvent || acc.done || now - lastEmit > 40) {
      emittedInitial = true;
      lastEmit = now;
      onUpdate(acc.snapshot(), acc.userText);
    }
  }
  if (sawTurn) onUpdate(acc.snapshot(), acc.userText);
  return sawTurn;
}
