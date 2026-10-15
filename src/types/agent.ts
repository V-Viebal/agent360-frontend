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
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
  timestamp: string;
  evidenceStatus?: "observed" | "inferred" | "unknown";
  toolCalls?: {
    tool: string;
    args: string;
    result?: string;
    exitCode?: number;
  }[];
}

export interface InfraAgent {
  id: string;
  name: string;
  slug: string;
  roleTag: "Engineering" | "Operations" | "Quality" | "Research" | "Security";
  node: string;
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
