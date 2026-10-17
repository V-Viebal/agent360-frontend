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
    // Filter to load only enabled agents (handling both backend DTO and direct QwenPaw schema)
    const enabledOnly = rawList.filter((a: any) => a.enabled !== false && a.startup_status !== 'disabled');
    return enabledOnly.map((a: any) => {
      const idStr = (a.id || "").toLowerCase();
      const slugStr = (a.slug || "").toLowerCase();
      let nodeStr = a.node || "";

      // Ensure exact infra node assignment across all instances
      if (idStr.includes("mons") || slugStr.includes("mons") || idStr.includes("swe") || idStr.includes("vision")) {
        nodeStr = "node-6th";
      } else if (idStr.includes("ken") || slugStr.includes("ken") || idStr.includes("sre") || idStr.includes("control")) {
        nodeStr = "node-7th";
      } else if (idStr.includes("mkai") || slugStr.includes("mkai") || idStr.includes("browser")) {
        nodeStr = "node-4th";
      } else if (idStr.includes("zen") || slugStr.includes("zen") || idStr.includes("llm")) {
        nodeStr = "node-2nd";
      } else {
        nodeStr = "node-3rd";
      }

      return {
        id: a.id,
        name: a.name || a.id,
        slug: a.slug || a.id,
        roleTag: a.roleTag || (a.pinned ? "Core" : "Operations"),
        node: nodeStr,
        status: a.status || (a.startup_status === "running" ? "active" : "idle"),
        model: (typeof a.model === "string" ? a.model : null) || a.active_model?.model || a.backend_model || "gpt-5.6-luna",
        runtimeVersion: a.runtimeVersion || "QwenPaw v1.2",
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
    console.warn("Backend API not reachable, falling back to mock agent chats", err);
    const { MOCK_INFRA_AGENTS } = await import("../data/mockInfraAgents");
    const found = MOCK_INFRA_AGENTS.find((a) => a.id === agentId || a.slug === agentId);
    return found ? found.sessions : (MOCK_INFRA_AGENTS[0]?.sessions || []);
  }
}

export async function updateAgentActiveModel(agentId: string, providerId: string, model: string): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    // Fetch full current agent record first because QwenPaw API requires full payload on PUT
    const getRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      headers: { Accept: "application/json" }
    });
    if (!getRes.ok) throw new Error(`Failed to fetch agent ${cleanId}`);
    const agentData = await getRes.json();
    agentData.active_model = {
      provider_id: providerId,
      model: model,
    };
    const putRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(agentData),
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
    let res = await fetch(`${API_BASE_URL}/agents/models`, {
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
          if (m && m.id && !list.some(x => x.model === m.id)) {
            list.push({
              providerId: p.id,
              providerName: p.name || p.id,
              model: m.id,
              name: m.name || m.id,
            });
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

export async function fetchWorkspaceTree(agentId: string): Promise<WorkspaceTreeNode[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(agentId)}/files`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch workspace tree: ${res.statusText}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.files || []);
  } catch (err) {
    console.warn(`fetchWorkspaceTree fallback for ${agentId}:`, err);
    return [
      { name: "agent.json", path: "agent.json", kind: "file", size: 1024 },
      { name: "AGENTS.md", path: "AGENTS.md", kind: "file", size: 4096 },
      { name: "MEMORY.md", path: "MEMORY.md", kind: "file", size: 2048 },
      { name: "SOUL.md", path: "SOUL.md", kind: "file", size: 1536 },
      { name: "skills", path: "skills", kind: "directory" },
    ];
  }
}

export async function fetchWorkspaceFileContent(agentId: string, filePath: string): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(agentId)}/files/content?path=${encodeURIComponent(filePath)}`, {
      headers: { Accept: "text/plain, application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch file content: ${res.statusText}`);
    }
    return await res.text();
  } catch (err) {
    console.warn(`fetchWorkspaceFileContent fallback for ${filePath}:`, err);
    return `# Workspace File: ${filePath}\n\n[Live content preview not available]`;
  }
}

export async function fetchChatMessages(chatId: string, agentId?: string): Promise<ChatMessage[]> {
  try {
    const cleanAgentId = agentId ? agentId.replace(/^bot:agent360:/, "") : "";
    // Priority URLs: /api/agents/chats/:chatId (direct history endpoint on AgentFeaturesEndpoints)
    const urlsToTry = [
      `${API_BASE_URL}/agents/chats/${encodeURIComponent(chatId)}`,
      cleanAgentId ? `${API_BASE_URL}/agents/${encodeURIComponent(cleanAgentId)}/chats/${encodeURIComponent(chatId)}` : null,
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
    if (!res.ok) {
      throw new Error(`Failed to fetch messages: ${res.statusText}`);
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
    return filteredTurns;
  } catch (err) {
    console.warn("fetchChatMessages fallback to mock dialogues", err);
    const { MOCK_MESSAGES_BY_SESSION } = await import("../data/mockInfraAgents");
    return MOCK_MESSAGES_BY_SESSION[chatId] || [
      {
        id: "m-default-1",
        role: "user",
        content: "Status and readiness of agent session.",
        timestamp: "Just now"
      },
      {
        id: "m-default-2",
        role: "assistant",
        content: "Agent session active and listening on secure channel. All tools verified.",
        timestamp: "Just now",
        evidenceStatus: "observed"
      }
    ];
  }
}

export async function fetchSkills(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/skills`, {
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
    const res = await fetch(`${API_BASE_URL}/mcp`, {
      headers: {
        Accept: "application/json",
        "X-Agent-Id": agentId,
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
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) throw new Error("Failed to fetch agent profile");
    const data = await res.json();
    const channelsObj = data.channels || {};
    
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
    console.warn("fetchAgentChannels fallback", err);
    return [
      { name: "CONSOLE", enabled: true, type: "console" },
      { name: "TELEGRAM", enabled: true, type: "telegram" },
      { name: "DISCORD", enabled: false, type: "discord" },
      { name: "SLACK", enabled: false, type: "slack" },
      { name: "MATRIX", enabled: false, type: "matrix" },
    ];
  }
}

export async function toggleAgentChannel(agentId: string, channelType: string, enabled: boolean): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const getRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      headers: { Accept: "application/json" }
    });
    if (!getRes.ok) throw new Error("Failed to fetch agent profile");
    const data = await getRes.json();
    const channels = data.channels || {};
    if (!channels[channelType]) {
      channels[channelType] = { enabled: enabled };
    } else {
      channels[channelType].enabled = enabled;
    }
    const putRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, channels })
    });
    return putRes.ok;
  } catch (err) {
    console.warn("toggleAgentChannel error", err);
    return false;
  }
}

export async function fetchAgentSchedules(agentId?: string): Promise<AgentScheduleJob[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/cron/jobs`, {
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
    console.warn("fetchAgentSchedules fallback", err);
    return [
      {
        id: "cron-1",
        name: "Morning Intelligence Brief",
        enabled: true,
        cronExpr: "0 08 * * *",
        timezone: "Asia/Ho_Chi_Minh",
        targetChannel: "telegram",
        promptSnippet: "Summarize top critical alerts and unread notifications"
      },
      {
        id: "cron-2",
        name: "Evening Sync & Reconcile",
        enabled: true,
        cronExpr: "0 21 * * *",
        timezone: "Asia/Ho_Chi_Minh",
        targetChannel: "telegram",
        promptSnippet: "Perform daily health check and dispatch summary report"
      }
    ];
  }
}


export async function updateAgentChannelConfig(agentId: string, channelType: string, newConfig: Record<string, any>): Promise<boolean> {
  try {
    const cleanId = agentId.replace(/^bot:agent360:/, "");
    const getRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      headers: { Accept: "application/json" }
    });
    if (!getRes.ok) throw new Error("Failed to fetch agent profile");
    const data = await getRes.json();
    const channels = data.channels || {};
    channels[channelType] = {
      ...(channels[channelType] || {}),
      ...newConfig
    };
    const putRes = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, channels })
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
    const endpoint = isEdit ? `${API_BASE_URL}/cron/jobs/${encodeURIComponent(jobData.id)}` : `${API_BASE_URL}/cron/jobs`;
    const method = isEdit ? "PUT" : "POST";

    const payload = {
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

export async function deleteSchedule(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/cron/jobs/${encodeURIComponent(jobId)}`, {
      method: "DELETE",
      headers: { Accept: "application/json" }
    });
    return res.ok;
  } catch (err) {
    console.warn("deleteSchedule error", err);
    return false;
  }
}

export async function toggleScheduleStatus(jobId: string, currentEnabled: boolean): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/cron/jobs/${encodeURIComponent(jobId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ enabled: !currentEnabled })
    });
    return res.ok;
  } catch (err) {
    console.warn("toggleScheduleStatus error", err);
    return false;
  }
}
