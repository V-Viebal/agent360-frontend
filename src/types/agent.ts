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

export interface SessionRoomParticipant {
  agent_id: string;
  display_name: string;
  role: "host" | "collaborator" | "manager" | "admin" | string;
  matrix_user_id: string;
  status: "idle" | "running" | "completed" | "awaiting_input" | string;
  joined_at: string;
}

export interface SessionRoomTurn {
  id: string;
  turn_no: number;
  author_id: string;
  author_name: string;
  author_role: "host" | "collaborator" | "manager" | "admin" | "user" | string;
  kind: "request" | "collaborator_progress" | "collaborator_reply" | "question" | "answer" | "manager_guard" | "synthesis" | string;
  text: string;
  target_agent_id?: string | null;
  created_at: string;
}

export interface SessionCollaborationRoom {
  room_id: string;
  matrix_room_id: string;
  element_room_url: string;
  host_agent_id: string;
  host_chat_id: string;
  host_session_id: string;
  participants: SessionRoomParticipant[];
  status: "idle" | "collaborator_running" | "awaiting_clarification" | "synthesizing" | "completed" | string;
  active_collaborator_id?: string | null;
  max_room_turns: number;
  current_turn_count: number;
  turns: SessionRoomTurn[];
  created_at: string;
  updated_at: string;
  room_title?: string | null;
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
  senderAgentId?: string;
  senderAgentName?: string;
  authorRole?: "host" | "collaborator" | "manager" | "admin" | string;
  roomId?: string;
  matrixRoomId?: string;
  elementRoomUrl?: string;
}

export interface InfraAgent {
  enabled?: boolean;
  id: string;
  name: string;
  slug: string;
  roleTag: "Engineering" | "Operations" | "Quality" | "Research" | "Security";
  node: string;
  instanceId?: string;
  status: "active" | "idle" | "evaluating" | "degraded" | "disabled";
  model: string;
  runtimeVersion: string;
  uptime: string;
  activeSessionId?: string;
  memoryUsageMb: number;
  description: string;
  tools: AgentTool[];
  sessions: AgentSession[];
  canToggle?: boolean;
  isRootAgent?: boolean;
}
