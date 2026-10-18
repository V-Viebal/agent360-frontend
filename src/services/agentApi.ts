export function cleanModelDisplayName(rawModel: string): string {
  if (!rawModel) return "";
  let m = rawModel.trim();
  if (m.includes("/")) {
    m = m.split("/").pop()!;
  }
  return m;
}

import { InfraAgent, AgentSession, ChatMessage } from "../types/agent";

const API_BASE_URL = "/api";

export async function fetchInfraAgents(): Promise<InfraAgent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch agents: ${res.statusText}`);
    }
    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.agents || []);
    // Filter to load only enabled agents (handling both backend DTO and direct Skyer schema)
    const enabledOnly = rawList.filter((a: any) => a.enabled !== false && a.startup_status !== 'disabled');
    return enabledOnly.map((a: any) => {
      const idStr = (a.id || "").toLowerCase();
      const slugStr = (a.slug || "").toLowerCase();
      let nodeStr = a.node || "";

      let instanceKey = "node-3rd";
      let displayNode = a.node || "Node 3rd (Core) - ai.hmz.one";

      if (idStr.startsWith("gm-") || slugStr.startsWith("gm-") || nodeStr.includes("6th") || nodeStr.includes("gia mộc")) {
        instanceKey = "node-6th";
        displayNode = a.node || "Node 6th (Gia Mộc) - ai-gm.antares.vn";
      } else if (idStr.startsWith("climax-") || slugStr.startsWith("climax-") || idStr.startsWith("planthy-") || slugStr.startsWith("planthy-") || nodeStr.includes("5th")) {
        instanceKey = "node-5th";
        displayNode = a.node || "Node 5th (Isolated) - antares.vn";
      } else if (idStr.startsWith("agentteams-") || slugStr.startsWith("agentteams-") || idStr.includes("llm360") || idStr.includes("tsx") || nodeStr.includes("4th")) {
        instanceKey = "node-4th";
        displayNode = a.node || "Node 4th (Swarm & Inference) - hmz.one";
      } else if (nodeStr.includes("7th") || idStr.includes("control")) {
        instanceKey = "node-7th";
        displayNode = a.node || "Node 7th (Control) - control.hmz.one";
      } else if (nodeStr.includes("2nd")) {
        instanceKey = "node-2nd";
        displayNode = a.node || "Node 2nd (Platform) - api-agent360.antares.vn";
      }

      return {
        id: a.id,
        name: a.name || a.id,
        slug: a.slug || a.id,
        roleTag: a.roleTag || (a.pinned ? "Core" : "Operations"),
        node: displayNode,
        instanceId: instanceKey,
        status: a.status || (a.startup_status === "running" ? "active" : "idle"),
        model: cleanModelDisplayName((typeof a.model === "string" ? a.model : null) || a.active_model?.model || a.backend_model || "gpt-5.6-luna"),
        runtimeVersion: a.runtimeVersion || "Skyer v2.2",
        uptime: a.uptime || "Online (Private)",
        memoryUsageMb: a.memoryUsageMb || 256,
        description: a.description || "Active autonomous infrastructure agent",
        tools: a.tools || [],
        sessions: a.sessions || []
      };
    });
  } catch (err) {
    console.warn("Backend API not reachable, falling back to mock infra agents", err);
    const { MOCK_INFRA_AGENTS } = await import("../data/mockInfraAgents");
    return MOCK_INFRA_AGENTS;
  }
}

export async function fetchAgentChats(agentId?: string): Promise<AgentSession[]> {
  try {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const endpoint = cleanAgentId
      ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanAgentId)}/chats`
      : `${API_BASE_URL}/chats`;
    const res = await fetch(endpoint, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch chats: ${res.statusText}`);
    }
    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.chats || []);
    // Sort latest chats to the top (newest updated_at or created_at first)
    const sortedRaw = [...rawList].sort((a: any, b: any) => {
      const timeA = new Date(a.updated_at || a.last_finished_at || a.created_at || 0).getTime();
      const timeB = new Date(b.updated_at || b.last_finished_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });

    return sortedRaw.map((c: any) => {
      const displayTitle = c.name || c.title || c.topic || (c.session_id ? `Session ${c.session_id}` : `Chat ${c.id.slice(0, 8)}`);
      const snippet = c.last_message?.content || c.lastMessageSnippet || c.snippet || c.session_id || c.channel || "active dialogue";
      const updatedStr = c.updated_at
        ? new Date(c.updated_at).toLocaleDateString([], { month: "short", day: "numeric" })
        : "Recently";

      return {
        id: c.id,
        title: displayTitle,
        updatedAt: updatedStr,
        messageCount: c.message_count || c.messagesCount || 1,
        lastMessageSnippet: snippet,
        unread: false,
        name: displayTitle,
        session_id: c.session_id,
        agentId: cleanAgentId || c.agent_id || "default",
        _rawUpdatedAt: c.updated_at || c.last_finished_at || c.created_at || ""
      };
    });
  } catch (err) {
    console.warn("fetchAgentChats error, returning empty list instead of stale mocks", err);
    return [];
  }
}

export async function updateAgentActiveModel(agentId: string, providerId: string, model: string): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    // Fetch full current agent record first because Skyer API requires full payload on PUT
    const putRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/active-model`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ scope: "agent", agent_id: cleanId, provider_id: providerId, model }),
    });
    return putRes.ok;
  } catch (err) {
    console.warn("Failed to update agent active model:", err);
    return false;
  }
}

export interface ModelOption {
  providerId: string;
  providerName: string;
  model: string;
  name: string;
}

export async function fetchAvailableModels(): Promise<ModelOption[]> {
  try {
    // compact view: ids/names only (~a few KB) instead of the ~820 KB raw provider catalog
    let res = await fetch(`${API_BASE_URL}/agents/models?view=compact`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      res = await fetch(`${API_BASE_URL}/models`, {
        headers: { Accept: "application/json" }
      });
    }
    if (!res.ok) throw new Error(`Failed to fetch models: ${res.statusText}`);
    const providers = await res.json();
    const list: ModelOption[] = [];
    if (Array.isArray(providers)) {
      for (const p of providers) {
        const pModels = [
          ...(p.discovered_models || []),
          ...(p.extra_models || []),
          ...(p.models || [])
        ];
        for (const m of pModels) {
          if (m && m.id) {
            const cleanId = m.id.includes("/") ? m.id.split("/").pop()! : m.id;
            // Filter out non-chat / media generation models
            if (cleanId.includes("generate-preview") || cleanId.includes("imagen") || cleanId === "metadata_health") {
              continue;
            }
            if (!list.some(x => x.model === cleanId)) {
              list.push({
                providerId: p.id,
                providerName: "",
                model: cleanId,
                name: cleanId,
              });
            }
          }
        }
      }
    }
    return list;
  } catch (err) {
    console.warn("Failed to fetch available models, using default list:", err);
    return [
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "gpt-5.6-luna", name: "GPT-5.6 Luna" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "grok-4.7", name: "Grok 4.7" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "gpt-6-sol", name: "GPT-6 Sol" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "grok-4.6", name: "Grok 4.6" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "claude-opus-4.6-thinking", name: "Claude Opus 4.6" },
      { providerId: "llm360coding", providerName: "LLM360 Coding", model: "gemini-3.7-flash-tiered", name: "Gemini 3.7 Flash" },
    ];
  }
}

export interface WorkspaceTreeNode {
  name: string;
  path: string;
  kind: "file" | "directory";
  size?: number | null;
  children?: WorkspaceTreeNode[];
}

export async function fetchWorkspaceTree(agentId?: string): Promise<WorkspaceTreeNode[]> {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  try {
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/workspace/tree`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch workspace tree: ${res.statusText}`);
    }
    const data = await res.json();
    const rawEntries = Array.isArray(data) ? data : (data.entries || data.files || []);
    return rawEntries.map((e: any) => ({
      name: e.name || e.path || "file",
      path: e.path || e.name || "",
      kind: e.kind === "directory" || e.type === "directory" ? "directory" : "file",
      size: typeof e.size === "number" ? e.size : null
    }));
  } catch (err) {
    console.warn(`fetchWorkspaceTree failed for ${cleanId}:`, err);
    return [];
  }
}

export async function fetchWorkspaceFileContent(agentId: string, filePath: string): Promise<string> {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  try {
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/workspace/file-content?path=${encodeURIComponent(filePath)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch file content: ${res.statusText}`);
    }
    const json = await res.json();
    return typeof json === "string" ? json : (json.content || "");
  } catch (err) {
    console.warn(`fetchWorkspaceFileContent failed for ${cleanId}/${filePath}:`, err);
    return `# ${filePath}\n\n[Unable to load live content]`;
  }
}

// Fast Client-Side Dialogue Session Cache for Instant Navigation
const _chatMessagesCache = new Map<string, { messages: ChatMessage[]; timestamp: number }>();

export function getCachedChatMessages(chatId: string, agentId?: string): ChatMessage[] | null {
  const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "default";
  const key = `${cleanAgentId}:${chatId}`;
  const cached = _chatMessagesCache.get(key);
  if (cached && cached.messages) {
    return cached.messages;
  }
  try {
    const raw = sessionStorage.getItem(`agent360_msgcache_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        _chatMessagesCache.set(key, { messages: parsed, timestamp: Date.now() });
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function setCachedChatMessages(chatId: string, messages: ChatMessage[], agentId?: string): void {
  const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "default";
  const key = `${cleanAgentId}:${chatId}`;
  _chatMessagesCache.set(key, { messages, timestamp: Date.now() });
  try {
    sessionStorage.setItem(`agent360_msgcache_${key}`, JSON.stringify(messages.slice(-50)));
  } catch {}
}

export async function fetchChatMessages(chatId: string, agentId?: string): Promise<ChatMessage[]> {
  // If this is a fresh client-generated session (e.g. session-xxxxxx), return immediately without network latency
  if (chatId.startsWith("session-")) {
    setCachedChatMessages(chatId, [], agentId);
    return [];
  }
  try {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    // Priority URLs: /api/agents/chats/:chatId (direct history endpoint on AgentFeaturesEndpoints)
    const urlsToTry = [
      cleanAgentId ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanAgentId)}/chats/${encodeURIComponent(chatId)}` : null,
      cleanAgentId ? `${API_BASE_URL}/agents/chats/${encodeURIComponent(chatId)}?agentId=${encodeURIComponent(cleanAgentId)}` : null,
      `${API_BASE_URL}/agents/chats/${encodeURIComponent(chatId)}`,
      `${API_BASE_URL}/chats/${encodeURIComponent(chatId)}`
    ].filter(Boolean) as string[];

    let res: Response | null = null;
    for (const u of urlsToTry) {
      try {
        const attempt = await fetch(u, { headers: { Accept: "application/json" } });
        if (attempt.ok) {
          res = attempt;
          break;
        }
      } catch {}
    }
    if (!res || !res.ok) {
      throw new Error(`Failed to fetch messages for chat ${chatId}`);
    }
    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.messages || []);
    
    const turns: ChatMessage[] = [];
    let currentAsst: ChatMessage | null = null;

    for (const m of rawList) {
      const role = m.role || "user";
      const mtype = m.type || m.message_type || "";
      const ts = m.metadata?.timestamp || m.created_at || (m.timestamp ? new Date(m.timestamp * 1000).toISOString() : new Date().toISOString());

      if (role === "user") {
        currentAsst = null;
        let userContent = "";
        if (typeof m.content === "string") {
          userContent = m.content;
        } else if (Array.isArray(m.content)) {
          userContent = m.content
            .filter((c: any) => c.type === "text" || !c.type)
            .map((c: any) => c.text || "")
            .join("\n");
        }
        turns.push({
          id: m.id || `msg-${Date.now()}-${Math.random()}`,
          role: "user",
          content: userContent || "(Empty user message)",
          timestamp: ts
        });
      } else if (role === "assistant") {
        if (!currentAsst) {
          currentAsst = {
            id: m.id || `asst-${Date.now()}-${Math.random()}`,
            role: "assistant",
            content: "",
            timestamp: ts,
            steps: [],
            toolCalls: [],
            reasoning: ""
          };
          turns.push(currentAsst);
        }

        let textContent = "";
        const callDatas: any[] = [];
        if (typeof m.content === "string") {
          textContent = m.content;
        } else if (Array.isArray(m.content)) {
          for (const item of m.content) {
            if (item && typeof item === "object") {
              if (item.type === "text" && item.text) {
                textContent += item.text + "\n";
              } else if (item.type === "data" && item.data) {
                callDatas.push(item.data);
              }
            }
          }
        }

        if (mtype === "reasoning" || mtype === "thinking") {
          const r = textContent.trim();
          if (r) {
            currentAsst.reasoning = currentAsst.reasoning ? currentAsst.reasoning + "\n" + r : r;
            currentAsst.steps!.push({
              kind: "reasoning",
              text: r
            });
          }
        } else if (mtype === "plugin_call" || mtype === "tool" || mtype === "tool_call" || mtype === "function_call") {
          const payload = m.payload || m.data || {};
          const toolCalls = payload.tool_calls || (payload.name ? [payload] : callDatas);
          for (const tc of toolCalls) {
            const stepItem = {
              kind: "tool_call" as const,
              id: tc.id || tc.call_id || m.id,
              call_id: tc.call_id || tc.id,
              tool: tc.function?.name || tc.name || "Tool Call",
              args: typeof tc.arguments === "string" ? tc.arguments : (typeof tc.function?.arguments === "string" ? tc.function.arguments : JSON.stringify(tc.function?.arguments || tc.args || {})),
              state: "calling" as const
            };
            currentAsst.steps!.push(stepItem);
            currentAsst.toolCalls!.push({
              id: stepItem.id,
              call_id: stepItem.call_id,
              tool: stepItem.tool,
              args: stepItem.args,
              state: "calling"
            });
          }
        } else if (mtype === "plugin_call_output" || mtype === "tool_result" || mtype === "function_result") {
          const payload = m.payload || m.data || {};
          const results = Array.isArray(payload) ? payload : (callDatas.length > 0 ? callDatas : [payload]);
          for (const d of results) {
            const cid = d.call_id || d.tool_call_id || d.id;
            const strOut = typeof d.output === "string" ? d.output : (typeof d.result === "string" ? d.result : JSON.stringify(d.output || d.result || d));
            const toolState = d.state === "success" || d.status === "completed" || (!d.error && d.status !== "error") ? "success" as const : "error" as const;
            
            if (currentAsst.steps) {
              let matched = false;
              for (const s of currentAsst.steps) {
                if (s.call_id && s.call_id === cid) {
                  s.result = strOut;
                  s.state = toolState;
                  matched = true;
                  break;
                }
              }
              if (!matched) {
                currentAsst.steps.push({
                  kind: "tool_call",
                  id: cid || m.id,
                  call_id: cid,
                  tool: d.name || "Tool Output",
                  args: "",
                  result: strOut,
                  state: toolState
                });
              }
            }

            if (currentAsst.toolCalls) {
              let matched = false;
              for (const tc of currentAsst.toolCalls) {
                if (tc.call_id && tc.call_id === cid) {
                  tc.result = strOut;
                  tc.state = toolState;
                  matched = true;
                  break;
                }
              }
              if (!matched) {
                currentAsst.toolCalls.push({
                  id: cid || m.id,
                  call_id: cid,
                  tool: d.name || "Tool Output",
                  args: "",
                  result: strOut,
                  state: toolState
                });
              }
            }
          }
        } else if (mtype === "message" || !mtype) {
          const t = textContent.trim();
          if (t) {
            if (t.startsWith("The user said ") || t.startsWith("According to my activation instructions")) {
              currentAsst.reasoning = currentAsst.reasoning ? currentAsst.reasoning + "\n" + t : t;
              currentAsst.steps!.push({
                kind: "reasoning",
                text: t
              });
            } else {
              if (currentAsst.content) {
                currentAsst.content += "\n\n" + t;
              } else {
                currentAsst.content = t;
              }
            }
          }
          if (ts) {
            currentAsst.timestamp = ts;
          }
        }
      }
    }

    const filteredTurns: ChatMessage[] = [];
    for (const t of turns) {
      if (t.role === "user") {
        if (t.content.includes("# 引导模式") || t.content.includes("BOOTSTRAP.md")) {
          continue;
        }
        const last = filteredTurns[filteredTurns.length - 1];
        if (last && last.role === "user" && last.content.trim() === t.content.trim()) {
          continue;
        }
      }
      // If assistant message already responded (has content or reasoning) or is historical turn,
      // reconcile any lingering "calling" tool states to "success" so it doesn't stay stuck on "calling..."
      if (t.role === "assistant") {
        if (t.content || t.reasoning || t.steps?.some(s => s.kind === "tool_call" && s.result)) {
          if (t.steps) {
            for (const s of t.steps) {
              if (s.kind === "tool_call" && s.state === "calling") {
                s.state = "success";
              }
            }
          }
          if (t.toolCalls) {
            for (const tc of t.toolCalls) {
              if (tc.state === "calling") {
                tc.state = "success";
              }
            }
          }
        }
      }

      if (t.content || (t.steps && t.steps.length > 0) || (t.toolCalls && t.toolCalls.length > 0) || t.reasoning) {
        filteredTurns.push(t);
      }
    }
    setCachedChatMessages(chatId, filteredTurns, agentId);
    return filteredTurns;
  } catch (err) {
    // If this is a fresh new session created on the client (starts with session-), return empty turns immediately
    if (chatId.startsWith("session-")) {
      return [];
    }
    console.warn("fetchChatMessages fallback to mock dialogues", err);
    const { MOCK_MESSAGES_BY_SESSION } = await import("../data/mockInfraAgents");
    return MOCK_MESSAGES_BY_SESSION[chatId] || [];
  }
}

export async function fetchSkills(agentId?: string): Promise<string[]> {
  try {
    const cleanId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    const res = await fetch(cleanId ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/skills` : `${API_BASE_URL}/agents/skills`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch skills: ${res.statusText}`);
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((s: any) => typeof s === "string" ? s : (s.name || JSON.stringify(s)));
    }
    return [];
  } catch (err) {
    console.warn("fetchSkills fallback", err);
    return [];
  }
}

export interface AgentMcpClient {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  transport: string;
  url?: string;
  command?: string;
  access_summary?: {
    default_effect: string;
    overrides_count: number;
  };
}

export async function fetchAgentMcpClients(agentId: string): Promise<AgentMcpClient[]> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await fetch(`${API_BASE_URL}/mcp?agentIdQuery=${encodeURIComponent(cleanId)}`, {
      headers: {
        Accept: "application/json",
        "X-Agent-Id": cleanId,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch MCP clients: ${res.statusText}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn(`fetchAgentMcpClients fallback for ${agentId}:`, err);
    return [];
  }
}


export interface AgentChannelConfig {
  name: string;
  enabled: boolean;
  type: string;
  details?: Record<string, any>;
}

export interface AgentScheduleJob {
  id: string;
  name: string;
  enabled: boolean;
  cronExpr: string;
  timezone?: string;
  targetChannel?: string;
  promptSnippet?: string;
}

export async function fetchAgentChannels(agentId: string): Promise<AgentChannelConfig[]> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/config/channels`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error("Failed to fetch agent channels");
    const channelsObj = await res.json();
    
    const list: AgentChannelConfig[] = [];
    for (const [key, val] of Object.entries<any>(channelsObj)) {
      list.push({
        name: key.toUpperCase(),
        enabled: Boolean(val?.enabled),
        type: key,
        details: val
      });
    }
    return list;
  } catch (err) {
    console.warn("fetchAgentChannels failed", err);
    return [];
  }
}

export async function toggleAgentChannel(agentId: string, channelType: string, enabled: boolean): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const channelPath = `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/config/channels/${encodeURIComponent(channelType)}`;
    const getRes = await fetch(channelPath, { headers: { Accept: "application/json" } });
    if (!getRes.ok) throw new Error("Failed to fetch channel config");
    const current = await getRes.json();
    const putRes = await fetch(channelPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...current, enabled })
    });
    return putRes.ok;
  } catch (err) {
    console.warn("toggleAgentChannel error", err);
    return false;
  }
}

function agentScopedPath(agentId: string | undefined, path: string): string {
  const cleanId = (agentId || "mons").replace(/^bot:agent360:/, "");
  return `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/${path.replace(/^\//, "")}`;
}

export async function fetchAgentSchedules(agentId?: string): Promise<AgentScheduleJob[]> {
  try {
    const res = await fetch(agentScopedPath(agentId, "cron/jobs"), {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error("Failed to fetch cron jobs");
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    return list.map((j: any) => ({
      id: j.id,
      name: j.name || "Scheduled Automation",
      enabled: j.enabled !== false,
      cronExpr: j.schedule?.cron || "0 0 * * *",
      timezone: j.schedule?.timezone || "Asia/Ho_Chi_Minh",
      targetChannel: j.dispatch?.channel || "console",
      promptSnippet: j.request?.input?.[0]?.content?.[0]?.text?.slice(0, 100) || "Routine automation run"
    }));
  } catch (err) {
    console.warn("fetchAgentSchedules failed", err);
    return [];
  }
}


export async function updateAgentChannelConfig(agentId: string, channelType: string, newConfig: Record<string, any>): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const channelPath = `${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/config/channels/${encodeURIComponent(channelType)}`;
    const getRes = await fetch(channelPath, { headers: { Accept: "application/json" } });
    if (!getRes.ok) throw new Error("Failed to fetch channel config");
    const current = await getRes.json();
    const putRes = await fetch(channelPath, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...current, ...newConfig })
    });
    return putRes.ok;
  } catch (err) {
    console.warn("updateAgentChannelConfig error", err);
    return false;
  }
}

export async function createOrUpdateSchedule(jobData: any): Promise<boolean> {
  try {
    const isEdit = Boolean(jobData.id && !jobData.id.startsWith("new-"));
    const endpoint = isEdit
      ? agentScopedPath(jobData.agentId, `cron/jobs/${encodeURIComponent(jobData.id)}`)
      : agentScopedPath(jobData.agentId, "cron/jobs");
    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...(isEdit ? { id: jobData.id } : {}),
      name: jobData.name || "Automated Schedule",
      enabled: jobData.enabled !== false,
      schedule: {
        type: "cron",
        cron: jobData.cronExpr || "0 0 * * *",
        timezone: jobData.timezone || "Asia/Ho_Chi_Minh"
      },
      task_type: "agent",
      request: {
        input: [
          {
            role: "user",
            type: "message",
            content: [{ type: "text", text: jobData.promptSnippet || "Automated task execution" }]
          }
        ],
        session_id: `${jobData.targetChannel || "console"}:automated-${Date.now()}`,
        user_id: "agent360-scheduler"
      },
      dispatch: {
        type: "channel",
        channel: jobData.targetChannel || "console",
        target: { session_id: `${jobData.targetChannel || "console"}:automated` },
        mode: "final",
        silent: false
      },
      save_result_to_inbox: true,
      runtime: {
        max_concurrency: 1,
        timeout_seconds: 600,
        misfire_grace_seconds: 600
      }
    };

    const res = await fetch(endpoint, {
      method: method,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn("createOrUpdateSchedule error", err);
    return false;
  }
}

export interface TurnTelemetryPayload {
  agentId: string;
  sessionId: string;
  model: string;
  ttftMs: number;
  totalDurationMs: number;
  tokenCount: number;
  tokensPerSec: number;
  estimatedCostUsd: number;
  node: string;
}

export async function sendTurnTelemetryBeacon(payload: TurnTelemetryPayload): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents/analytics/turn-telemetry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn("Failed to dispatch turn telemetry beacon:", err);
    return false;
  }
}

export async function deleteSchedule(jobId: string, agentId?: string): Promise<boolean> {
  try {
    const res = await fetch(agentScopedPath(agentId, `cron/jobs/${encodeURIComponent(jobId)}`), {
      method: "DELETE",
      headers: { Accept: "application/json" }
    });
    return res.ok;
  } catch (err) {
    console.warn("deleteSchedule error", err);
    return false;
  }
}

export async function toggleScheduleStatus(jobId: string, currentEnabled: boolean, agentId?: string): Promise<boolean> {
  try {
    const action = currentEnabled ? "pause" : "resume";
    const res = await fetch(agentScopedPath(agentId, `cron/jobs/${encodeURIComponent(jobId)}/${action}`), {
      method: "POST",
      headers: { Accept: "application/json" }
    });
    return res.ok;
  } catch (err) {
    console.warn("toggleScheduleStatus error", err);
    return false;
  }
}

import { InfraNodeInstance, BotDeploymentInstance } from "../types/instance";

export async function fetchInfraInstances(): Promise<InfraNodeInstance[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/instances`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch instances: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("fetchInfraInstances fallback:", err);
    return [];
  }
}

export async function fetchBotDeployments(botId: string): Promise<BotDeploymentInstance[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/bots/${encodeURIComponent(botId)}/deployments`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch bot deployments: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`fetchBotDeployments fallback for ${botId}:`, err);
    return [];
  }
}

export interface CompactContextResponse {
  success: boolean;
  agent_id: string;
  session_id?: string;
  action: string;
  details?: any;
}

export async function compactAgentContext(agentId: string, sessionId?: string, hint?: string): Promise<CompactContextResponse> {
  try {
    const cleanAgent = agentId.replace(/^bot:agent360:/, "").trim();
    const res = await fetch(`${API_BASE_URL}/agents/compact-context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        agent_id: cleanAgent,
        session_id: sessionId,
        hint: hint,
        clean_history_gc: true,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to compact context: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn("compactAgentContext error:", err);
    return {
      success: false,
      agent_id: agentId,
      session_id: sessionId,
      action: "error",
      details: { error: err.message },
    };
  }
}

export interface ToolCallReceipt {
  schema: string;
  tool_call_id: string;
  bot_id: string;
  bot_binding_id?: string;
  deployment_id?: string;
  run_id: string;
  capability_id: string;
  input_hash?: string;
  authorization_decision_id: string;
  policy_hash: string;
  status: "proposed" | "denied" | "awaiting_approval" | "running" | "succeeded" | "failed" | "cancelled";
  output_hash?: string;
  error?: string;
}

export async function fetchToolCallReceipts(sessionId: string, agentId?: string): Promise<ToolCallReceipt[]> {
  try {
    const cleanAgent = agentId ? agentId.replace(/^bot:agent360:/, "").trim() : "";
    const url = cleanAgent
      ? `${API_BASE_URL}/agents/sessions/${encodeURIComponent(sessionId)}/tool-receipts?agentId=${encodeURIComponent(cleanAgent)}`
      : `${API_BASE_URL}/agents/sessions/${encodeURIComponent(sessionId)}/tool-receipts`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch receipts: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("fetchToolCallReceipts fallback:", err);
    return [];
  }
}
