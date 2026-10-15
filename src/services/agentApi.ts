import { InfraAgent, AgentSession } from "../types/agent";

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
