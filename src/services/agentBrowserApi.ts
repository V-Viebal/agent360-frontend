import { operatorKey } from "./a2aApi";

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

// Agents without a mapped browser (404) are remembered for the session so polling never re-asks.
const noBrowser = new Set<string>();

/** True once the API has said this agent has no browser profile. */
export const hasNoBrowser = (agentId: string) => noBrowser.has(bare(agentId));

/** Browser identity of one agent (its own Selkies desktop + Chromium profile). */
export async function fetchAgentBrowser(agentId: string, signal?: AbortSignal): Promise<AgentBrowserInfo | null> {
  const id = bare(agentId);
  if (noBrowser.has(id)) return null;
  const res = await fetch(`/api/agents/${encodeURIComponent(id)}/browser`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (res.status === 404) {
    noBrowser.add(id);
    return null;
  }
  if (!res.ok) throw new Error(`browser ${res.status}`);
  return res.json();
}

/** Screenshot URL of the agent's own active tab (cache-busted). */
export function agentBrowserImageUrl(agentId: string, nonce: number): string {
  return `/api/agents/${encodeURIComponent(bare(agentId))}/browser/image.jpg?t=${nonce}`;
}

/**
 * Fetch a screenshot through the authenticated fetch (an <img src> cannot carry the Skyer bearer token, and
 * the backend requires sign-in for agent screenshots). Returns an object URL; the caller revokes the previous one.
 */
export async function fetchAgentBrowserFrame(url: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(url, { signal, headers: { Accept: "image/jpeg" } });
  if (!res.ok) throw new Error(`frame ${res.status}`);
  return URL.createObjectURL(await res.blob());
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

export class DesktopAuthError extends Error {}

/**
 * Signed URL (`https://desktop/a360/{token}/`, 8 h) for the agent's Selkies desktop. The desktop hosts
 * only accept requests under that token path, so the operator key is required; without it the caller
 * should fall back to the screenshot preview.
 */
export async function issueAgentDesktopUrl(agentId: string, mode: "control" | "watch" = "control"): Promise<string> {
  const key = operatorKey.get();
  const res = await fetch(`/api/agents/${encodeURIComponent(bare(agentId))}/browser/viewer?mode=${mode}`, {
    method: "POST",
    headers: { Accept: "application/json", ...(key ? { "X-Agent360-Operator-Token": key } : {}) },
  });
  if (res.status === 401) throw new DesktopAuthError("Operator key required to open the agent desktop");
  if (!res.ok) throw new Error(`viewer ${res.status}`);
  const body = (await res.json()) as { url: string };
  return body.url;
}

/** Opens the desktop in a new tab; the tab is opened synchronously so popup blockers allow it. */
export function openAgentDesktopTab(agentId: string, hash = "#collab"): void {
  const w = window.open("about:blank", "_blank");
  issueAgentDesktopUrl(agentId, hash === "#shared" ? "watch" : "control")
    .then((url) => { if (w) { w.opener = null; w.location.href = url + hash; } })
    .catch((e) => {
      w?.close();
      window.alert(e instanceof DesktopAuthError ? "Cần operator key để mở desktop của agent." : `Không mở được desktop: ${e.message}`);
    });
}
