// Agent360 external A2A (AgentTeams transport) client.
export interface ExternalAgent {
  agent_ref: string; display_name: string; runtime: string; instance_id: string; node: string | null;
  agentteams_worker_id: string; matrix_user_id: string | null; capabilities: string[];
  health: string; last_seen_at: string | null; enabled: boolean; source: string;
}
export interface ExternalBinding {
  id: string; parent_agent_ref: string; child_agent_ref: string; role: string; allowed_modes: string[];
  allowed_capabilities: string[]; max_depth: number; max_parallel_tasks: number; timeout_seconds: number;
  requires_human_approval_for_writes: boolean; enabled: boolean; matrix_room_id: string | null;
}
export interface Delegation {
  id: string; correlation_id: string; parent_agent_ref: string; child_agent_ref: string; transport: string;
  transport_message_id: string | null; status: string; attempt: number; max_attempts: number;
  objective: string; summary: string | null; output: string | null; acceptance_criteria: string[];
  evidence: { type: string; ref: string; summary: string }[]; self_check: { criterion: string; result: string }[];
  acceptance: { decision: string; reviewer?: string; reason?: string; feedback?: string } | null;
  created_at: string; updated_at: string; deadline_at: string | null; child_session_id: string | null;
  turn_count?: number; question_count?: number; awaiting_since?: string | null; question_deadline_at?: string | null;
}
export interface A2ATurn {
  turn_no: number; role: "parent" | "child" | "operator" | "system"; kind: string; text: string; options: string[];
  blocking: boolean; in_reply_to: number | null; author_ref: string | null; created_at: string;
}
export interface A2AThread {
  task_id: string; correlation_id: string; status: string; pending_question: A2ATurn | null; turns: A2ATurn[];
  conversation: { max_turns: number; max_questions: number; turn_count: number; question_count: number; on_question_timeout: string };
}
export interface A2AInboxItem {
  task_id: string; correlation_id: string; child_agent_ref: string; objective: string; question: A2ATurn;
  awaiting_since: string | null; question_deadline_at: string | null;
}

export interface A2AHealth { status: "ok" | "degraded"; reasons: string[]; enabled: boolean; agents: number; bound_children: string[] }
export interface A2AMetrics {
  window_hours: number; delegations_total: number; by_status: Record<string, number>;
  timeout_rate: number; failure_rate: number; retry_rate: number; acceptance_rate: number; policy_denied: number;
  latency_seconds_accepted: { p50: number | null; max: number | null }; active_by_child: Record<string, number>;
  matrix_last_sync_age_seconds: number | null; counters: Record<string, number>;
}

const B = "/api";
const KEY = "agent360.a2a.operatorKey";
const enc = (s: string) => encodeURIComponent(s);
export const operatorKey = {
  get: () => (typeof localStorage !== "undefined" ? localStorage.getItem(KEY) || "" : ""),
  set: (v: string) => (v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY)),
};
export class A2AAuthError extends Error {}
async function j<T>(path: string, init?: RequestInit): Promise<T> {
  const k = operatorKey.get();
  const r = await fetch(B + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(k ? { Authorization: `Bearer ${k}` } : {}), ...(init?.headers || {}) },
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) throw new A2AAuthError("Operator key required");
  if (!r.ok) throw new Error((d as any)?.error || `HTTP ${r.status}`);
  return d as T;
}
const bare = (agentId: string) => agentId.split(":").pop() as string;

export const a2aApi = {
  health: () => j<A2AHealth>("/a2a/health"),
  metrics: () => j<A2AMetrics>("/a2a/metrics"),
  agents: () => j<ExternalAgent[]>("/a2a/external-agents"),
  discover: () => j<{ discovered: number }>("/a2a/external-agents/discover", { method: "POST" }),
  probe: (ref: string) => j<{ health: string; matrix: string; runtime: string }>(`/a2a/external-agents/${enc(ref)}/probe`, { method: "POST" }),
  bindings: (agentId: string) => j<ExternalBinding[]>(`/agents/${enc(bare(agentId))}/external-subagents`),
  bind: (agentId: string, ref: string, body: Partial<ExternalBinding>) =>
    j<ExternalBinding>(`/agents/${enc(bare(agentId))}/external-subagents/${enc(ref)}`, { method: "PUT", body: JSON.stringify(body) }),
  unbind: (agentId: string, ref: string) => j(`/agents/${enc(bare(agentId))}/external-subagents/${enc(ref)}`, { method: "DELETE" }),
  syncSkill: (agentId: string) => j<{ status: number }>(`/agents/${enc(bare(agentId))}/external-subagents/sync-skill`, { method: "POST" }),
  delegations: (agentId: string) => j<Delegation[]>(`/agents/${enc(bare(agentId))}/a2a/delegations`),
  delegate: (body: Record<string, unknown>) => j<Delegation>("/a2a/delegations", { method: "POST", body: JSON.stringify(body) }),
  review: (id: string, decision: "accept" | "reject", feedback?: string) =>
    j<Delegation>(`/a2a/delegations/${enc(id)}/review`, { method: "POST", body: JSON.stringify({ decision, feedback, reviewer: "agent360-ui" }) }),
  cancel: (id: string) => j<Delegation>(`/a2a/delegations/${enc(id)}/cancel`, { method: "POST" }),
  // v2 multi-turn conversation
  thread: (id: string, after = 0, wait = 0) => j<A2AThread>(`/a2a/delegations/${enc(id)}/messages?after=${after}&wait=${wait}`),
  postMessage: (id: string, kind: "answer" | "followup" | "redirect" | "approval", text: string) =>
    j<{ task: Delegation }>(`/a2a/delegations/${enc(id)}/messages`, {
      method: "POST",
      body: JSON.stringify({ kind, text, author: "operator:agent360-ui", message_id: `ui-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }),
    }),
  inbox: (agentId: string) => j<A2AInboxItem[]>(`/agents/${enc(bare(agentId))}/a2a/inbox`),
};
