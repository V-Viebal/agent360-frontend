import { InfraAgent, AgentSession, ChatMessage } from "../types/agent";

const API_BASE_URL = "/api/v1";

export async function fetchInfraAgents(): Promise<InfraAgent[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/agents`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch agents: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Backend API not reachable, falling back to mock infra agents", err);
    const { MOCK_INFRA_AGENTS } = await import("../data/mockInfraAgents");
    return MOCK_INFRA_AGENTS;
  }
}

export async function fetchAgentChats(): Promise<AgentSession[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chats`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch chats: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Backend API chats endpoint fallback", err);
    return [];
  }
}

export async function updateAgentActiveModel(
  agentId: string,
  providerId: string,
  model: string
): Promise<{ success: boolean; active_llm?: { provider_id: string; model: string } }> {
  try {
    const cleanId = agentId.replace("bot:agent360:", "");
    const res = await fetch(`${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/active-model`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        scope: "agent",
        agent_id: cleanId,
        provider_id: providerId,
        model: model
      })
    });
    if (!res.ok) {
      throw new Error(`Failed to update active model: ${res.statusText}`);
    }
    const data = await res.json();
    return { success: true, active_llm: data.active_llm };
  } catch (err) {
    console.error("Failed to update agent model slot", err);
    return { success: false };
  }
}

export interface WorkspaceTreeNode {
  kind: "directory" | "file";
  name: string;
  path: string;
  modified_at?: string;
  preview_kind?: string;
  size?: number | null;
}

export async function fetchWorkspaceTree(): Promise<WorkspaceTreeNode[]> {
  try {
    const res = await fetch("/api/workspace/tree", {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch workspace tree: ${res.statusText}`);
    }
    const data = await res.json();
    return data.entries || [];
  } catch (err) {
    console.warn("Failed to fetch workspace tree", err);
    return [];
  }
}

export async function fetchWorkspaceFileContent(filePath: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/workspace/file-content?path=${encodeURIComponent(filePath)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to read file: ${res.statusText}`);
    }
    const data = await res.json();
    return data.content || null;
  } catch (err) {
    console.warn(`Failed to fetch file content for ${filePath}`, err);
    return null;
  }
}

export async function fetchChatMessages(chatId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/chats/${encodeURIComponent(chatId)}`, {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch chat details: ${res.statusText}`);
    }
    const data = await res.json();
    const rawList = Array.isArray(data) ? data : (data.messages || []);
    
    // Group into coherent user and assistant turns
    const turns: ChatMessage[] = [];
    let currentAsst: ChatMessage | null = null;

    for (const m of rawList) {
      const mtype = m.type;
      const mrole = m.role || "assistant";
      const meta = m.metadata || {};
      const ts = meta.timestamp
        ? new Date(meta.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "recently";

      let textContent = "";
      if (typeof m.content === "string") {
        textContent = m.content;
      } else if (Array.isArray(m.content)) {
        textContent = m.content.map((c: any) => c?.text || "").filter(Boolean).join("
");
      }

      if (textContent.includes("# BOOTSTRAP MODE") && textContent.includes("---")) {
        const parts = textContent.split("---");
        textContent = parts[parts.length - 1].trim();
      }

      if (mrole === "user") {
        turns.push({
          id: m.id || String(Math.random()),
          role: "user",
          content: textContent.trim(),
          timestamp: ts,
          steps: []
        });
        currentAsst = null;
      } else {
        if (!currentAsst) {
          currentAsst = {
            id: m.id || `asst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            role: "assistant",
            content: "",
            timestamp: ts,
            evidenceStatus: "observed",
            steps: [],
            toolCalls: []
          };
          turns.push(currentAsst);
        }

        if (mtype === "reasoning") {
          const t = textContent.trim();
          if (t) {
            currentAsst.steps!.push({
              kind: "reasoning",
              id: m.id,
              text: t
            });
          }
        } else if (mtype === "plugin_call") {
          const contents = Array.isArray(m.content) ? m.content : [];
          for (const c of contents) {
            if (c?.type === "data" && c.data) {
              const d = c.data;
              const cid = d.call_id;
              const stepItem = {
                kind: "tool_call" as const,
                id: cid || m.id,
                call_id: cid,
                tool: d.name || "Tool Execution",
                args: typeof d.arguments === "string" ? d.arguments : JSON.stringify(d.arguments || {}),
                result: "",
                state: "calling" as const
              };
              currentAsst.steps!.push(stepItem);
              currentAsst.toolCalls!.push({
                id: cid || m.id,
                call_id: cid,
                tool: d.name || "Tool Execution",
                args: stepItem.args,
                result: "",
                state: "calling"
              });
            }
          }
        } else if (mtype === "plugin_call_output") {
          const contents = Array.isArray(m.content) ? m.content : [];
          for (const c of contents) {
            if (c?.type === "data" && c.data) {
              const d = c.data;
              const cid = d.call_id;
              let out = d.output ?? "";
              if (typeof out === "string" && out.startsWith("[{")) {
                try {
                  const parsed = JSON.parse(out);
                  if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].text) {
                    out = parsed[0].text;
                  }
                } catch {
                  // ignore
                }
              }
              const strOut = typeof out === "string" ? out : JSON.stringify(out, null, 2);
              const toolState = d.state === "error" ? "error" : "success";

              let matched = false;
              for (let i = currentAsst.steps!.length - 1; i >= 0; i--) {
                const s = currentAsst.steps![i];
                if (s.kind === "tool_call" && s.call_id === cid) {
                  s.result = strOut;
                  s.state = toolState;
                  matched = true;
                  break;
                }
              }
              if (!matched) {
                currentAsst.steps!.push({
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
          }
        } else if (mtype === "message" || !mtype) {
          const t = textContent.trim();
          if (t) {
            if (currentAsst.content) {
              currentAsst.content += "

" + t;
            } else {
              currentAsst.content = t;
            }
          }
          if (ts) {
            currentAsst.timestamp = ts;
          }
        }
      }
    }

    return turns.filter(t => t.content || (t.steps && t.steps.length > 0));
  } catch (err) {
    console.warn("fetchChatMessages fallback", err);
    return [];
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
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("fetchSkills fallback", err);
    return [];
  }
}
