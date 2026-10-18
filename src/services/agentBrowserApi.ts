export interface AgentBrowserTab {
  targetId: string;
  title: string;
  url: string;
  anchor: boolean;
}

export interface AgentBrowserInfo {
  agentId: string;
  instance: string;
  node: string;
  service: string;
  viewerUrl: string;
  profile: string;
  cdpReachable: boolean;
  profileWindowOpen: boolean;
  tabs: AgentBrowserTab[];
}

const bare = (agentId: string) => agentId.replace(/^bot:agent360:/i, "");

/** Browser identity of one agent (its own Selkies desktop + Chromium profile). */
export async function fetchAgentBrowser(agentId: string, signal?: AbortSignal): Promise<AgentBrowserInfo | null> {
  const res = await fetch(`/api/agents/${encodeURIComponent(bare(agentId))}/browser`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`browser ${res.status}`);
  return res.json();
}

/** Screenshot URL of the agent's own active tab (cache-busted). */
export function agentBrowserImageUrl(agentId: string, nonce: number): string {
  return `/api/agents/${encodeURIComponent(bare(agentId))}/browser/image.jpg?t=${nonce}`;
}

/** Raise the agent's own profile window on the shared desktop before showing it (same-origin only; the API rejects cross-site callers). */
export async function focusAgentBrowser(agentId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/agents/${encodeURIComponent(bare(agentId))}/browser/focus`, { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}
