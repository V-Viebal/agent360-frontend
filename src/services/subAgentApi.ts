const API = "/api";

export type DelegationMode = "sync" | "async";

export interface SubAgentBinding {
  id: string;
  parent_agent_id: string;
  child_agent_id: string;
  runtime_instance_id: string;
  role: string;
  capabilities: string[];
  allowed_modes: DelegationMode[];
  max_depth: number;
  max_parallel_tasks: number;
  timeout_seconds: number;
  requires_human_approval: boolean;
  enabled: boolean;
  updated_at: string;
}

export interface SubAgentHealth {
  child_agent_id: string;
  binding_enabled: boolean;
  runtime_present: boolean;
  runtime_enabled: boolean;
  callable: boolean;
  active_tasks: number;
  accepted_tasks: number;
  failed_tasks: number;
}

export interface AcceptanceCheck {
  criterion: string;
  result: "pass" | "fail" | "unknown";
  evidence?: string | null;
}

export interface AcceptanceResult {
  decision: "accepted" | "rejected";
  score: number;
  checks: AcceptanceCheck[];
  reviewer: string;
  reason: string;
  created_at: string;
}

export interface DelegationTask {
  id: string;
  parent_run_id: string;
  parent_agent_id: string;
  child_agent_id: string;
  mode: DelegationMode;
  source: "agent360" | "native-tool-call";
  native_task_id?: string | null;
  session_id: string;
  objective: string;
  acceptance_criteria: string[];
  status: string;
  attempt: number;
  max_attempts: number;
  output?: string | null;
  error?: string | null;
  evidence: string[];
  acceptance?: AcceptanceResult | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

export const normalizeAgentId = (id: string) => (id.includes(":") ? id.split(":").pop()! : id);

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.detail || data?.error || data?.message || `HTTP ${res.status}`);
  return data as T;
}

const a = (id: string) => encodeURIComponent(normalizeAgentId(id));

export const subAgentApi = {
  list: (parent: string) => call<SubAgentBinding[]>(`/agents/${a(parent)}/subagents`),
  health: (parent: string) => call<SubAgentHealth[]>(`/agents/${a(parent)}/subagents/health`),
  upsert: (parent: string, child: string, body: Partial<SubAgentBinding>) =>
    call<SubAgentBinding>(`/agents/${a(parent)}/subagents/${a(child)}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (parent: string, child: string) =>
    call<{ removed: boolean }>(`/agents/${a(parent)}/subagents/${a(child)}`, { method: "DELETE" }),
  syncSkill: (parent: string) =>
    call<{ synced: boolean; content: string }>(`/agents/${a(parent)}/subagents/sync-skill`, { method: "POST" }),
  probe: (parent: string, child: string, prompt?: string) =>
    call<{ ok: boolean; output?: string; error?: string; session_id: string }>(
      `/agents/${a(parent)}/subagents/${a(child)}/probe`,
      { method: "POST", body: JSON.stringify({ prompt }) }
    ),
  delegations: (parent: string) => call<DelegationTask[]>(`/agents/${a(parent)}/delegations`),
  ingestNative: (parent: string) =>
    call<{ ingested: number; tasks: DelegationTask[] }>(`/agents/${a(parent)}/delegations/ingest-native`, { method: "POST" }),
  create: (body: {
    parent_agent_id: string;
    child_agent_id: string;
    mode: DelegationMode;
    objective: string;
    context?: string;
    expected_output?: string;
    acceptance_criteria?: string[];
  }) =>
    call<DelegationTask>(`/delegations`, {
      method: "POST",
      body: JSON.stringify({ ...body, parent_agent_id: normalizeAgentId(body.parent_agent_id) }),
    }),
  syncStatus: (id: string) => call<DelegationTask>(`/delegations/${id}/sync-native-status`, { method: "POST" }),
  review: (id: string, body: { decision?: string; reviewer: string; checks?: AcceptanceCheck[]; reason?: string }) =>
    call<DelegationTask>(`/delegations/${id}/review`, { method: "POST", body: JSON.stringify(body) }),
  retry: (id: string, feedback: string) =>
    call<DelegationTask>(`/delegations/${id}/retry`, { method: "POST", body: JSON.stringify({ feedback }) }),
  cancel: (id: string) => call<DelegationTask>(`/delegations/${id}/cancel`, { method: "POST" }),
};
