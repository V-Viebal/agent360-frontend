import type { ChatMessage, ChatStep, ToolCallItem } from "../types/agent";
import { API_BASE_URL, getAuthHeaders } from "./agentApi";

/**
 * Folds QwenPaw turn events (the same SSE protocol used by console/chat and by reconnect attach for any
 * channel) into one assistant ChatMessage. Console sends and live-attached channel turns share this reducer
 * so reasoning, every executed tool call, and the streamed answer render identically.
 */
export class TurnAccumulator {
  private readonly messageTypes = new Map<string, string>();
  private reasoningParts: string[] = [];
  private readonly reasoningById = new Map<string, string>();
  private readonly textById = new Map<string, string>();
  private readonly textOrder: string[] = [];
  private readonly tools: ToolCallItem[] = [];
  private readonly stepOrder: Array<{ kind: "reasoning"; id: string } | { kind: "tool_call"; callId: string }> = [];
  private readonly toolMsgToCall = new Map<string, string>();
  done = false;
  userText: string | null = null;

  constructor(private readonly messageId: string) {}

  ingest(event: any): boolean {
    if (!event || typeof event !== "object") return false;
    if (event.object === "response") {
      if (event.status === "completed" || event.status === "failed" || event.status === "canceled" || event.status === "cancelled") {
        this.done = true;
        return true;
      }
      return false;
    }
    if (event.object === "message") {
      const id = event.id as string;
      const type = event.type || "message";
      if (event.role === "user") {
        const text = (event.content || []).map((c: any) => c?.text || "").join("\n").trim();
        if (text) this.userText = text;
        return false;
      }
      this.messageTypes.set(id, type);
      if (type === "reasoning" && !this.reasoningById.has(id)) {
        this.reasoningById.set(id, "");
        this.stepOrder.push({ kind: "reasoning", id });
      }
      for (const part of event.content || []) this.ingestContent({ ...part, msg_id: part.msg_id || id }, event.status === "completed");
      return true;
    }
    if (event.object === "content") {
      this.ingestContent(event, event.status === "completed");
      return true;
    }
    return false;
  }

  private ingestContent(part: any, completed: boolean) {
    const msgId: string = part.msg_id || "";
    const msgType = this.messageTypes.get(msgId) || "message";
    if (part.type === "text") {
      const target = msgType === "reasoning" ? this.reasoningById : this.textById;
      if (msgType !== "reasoning" && !this.textById.has(msgId)) this.textOrder.push(msgId);
      const prev = target.get(msgId) || "";
      target.set(msgId, part.delta ? prev + (part.text || "") : (part.text || prev));
      return;
    }
    if (part.type !== "data" || !part.data) return;
    const d = part.data;
    const callId: string | undefined = d.call_id || this.toolMsgToCall.get(msgId);
    if (!callId) return;
    if (msgId) this.toolMsgToCall.set(msgId, callId);
    let tool = this.tools.find((t) => t.call_id === callId);
    if (!tool) {
      tool = { id: callId, call_id: callId, tool: d.name || "Tool", args: "", state: "calling" };
      this.tools.push(tool);
      this.stepOrder.push({ kind: "tool_call", callId });
    }
    if (d.name) tool.tool = d.name;
    if (d.arguments !== undefined) {
      const args = typeof d.arguments === "string" ? d.arguments : JSON.stringify(d.arguments);
      tool.args = part.delta && msgType === "plugin_call" ? (tool.args || "") + args : args;
    }
    if (msgType === "plugin_call_output" || d.output !== undefined) {
      if (d.output !== undefined && d.output !== "") {
        tool.result = typeof d.output === "string" ? d.output : JSON.stringify(d.output);
      }
      if (completed || part.status === "completed") {
        tool.state = d.state === "error" ? "error" : "success";
        tool.exitCode = tool.state === "error" ? 1 : 0;
      }
    }
  }

  get text(): string {
    return this.textOrder.map((id) => (this.textById.get(id) || "").trim()).filter(Boolean).join("\n\n");
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
    return {
      id: this.messageId,
      role: "assistant",
      timestamp: new Date().toISOString(),
      evidenceStatus: "observed",
      ...base,
      content: this.text,
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
  let lastEmit = 0;
  for await (const ev of readSseEvents(res.body, signal)) {
    if (ev?.object === "response") sawTurn = true;
    if (!acc.ingest(ev)) continue;
    const now = performance.now();
    if (acc.done || now - lastEmit > 80) {
      lastEmit = now;
      onUpdate(acc.snapshot(), acc.userText);
    }
  }
  if (sawTurn) onUpdate(acc.snapshot(), acc.userText);
  return sawTurn;
}
