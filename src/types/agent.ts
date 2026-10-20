export interface AgentTool {
  name: string;
  type: string;
  description: string;
}

export interface AgentSession {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  lastMessageSnippet: string;
  unread?: boolean;
  session_id?: string;
  agentId?: string;
  channel?: string;
  status?: string;
  is_running?: boolean;
  isRunning?: boolean;
}

export interface ToolCallItem {
  id?: string;
  call_id?: string;
  tool: string;
  args?: string;
  result?: string;
  state?: "calling" | "success" | "error";
  exitCode?: number;
}

export interface ChatStep {
  kind: "reasoning" | "tool_call";
  id?: string;
  call_id?: string;
  text?: string;
  tool?: string;
  args?: string;
  result?: string;
  state?: "calling" | "success" | "error";
  exitCode?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
  timestamp: string;
  evidenceStatus?: "observed" | "inferred" | "unknown";
  steps?: ChatStep[];
  toolCalls?: ToolCallItem[];
  metadata?: Record<string, any>;
}

export interface InfraAgent {
  enabled?: boolean;
  id: string;
  name: string;
  slug: string;
  roleTag: "Engineering" | "Operations" | "Quality" | "Research" | "Security";
  node: string;
  instanceId?: string;
  status: "active" | "idle" | "evaluating" | "degraded";
  model: string;
  runtimeVersion: string;
  uptime: string;
  activeSessionId?: string;
  memoryUsageMb: number;
  description: string;
  tools: AgentTool[];
  sessions: AgentSession[];
}
