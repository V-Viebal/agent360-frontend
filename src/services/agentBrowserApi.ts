import { operatorKey } from "./a2aApi";
import { authorizedFetch } from "./agentApi";

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

function bare(agentId: string): string { return agentId.replace(/^bot:agent360:/i, ""); }

// Agents without a mapped browser (404) are remembered for the session so polling never re-asks.
const noBrowser = new Set<string>();

/** True once the API has said this agent has no browser profile. */
export const hasNoBrowser = (agentId: string) => noBrowser.has(bare(agentId));

/** Browser identity of one agent (its own Selkies desktop + Chromium profile). */
export async function fetchAgentBrowser(agentId: string, signal?: AbortSignal): Promise<AgentBrowserInfo | null> {
  const id = bare(agentId);
  if (noBrowser.has(id)) return null;
  const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser`, {
    headers: { Accept: "application/json" },
    signal,
  }, id);
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
  const res = await authorizedFetch(url, { signal, headers: { Accept: "image/jpeg" } });
  if (!res.ok) throw new Error(`frame ${res.status}`);
  return URL.createObjectURL(await res.blob());
}

/** Raise the agent's own profile window on the shared desktop before showing it (same-origin only; the API rejects cross-site callers). */
export async function focusAgentBrowser(agentId: string): Promise<boolean> {
  try {
    const id = bare(agentId);
    const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/focus`, { method: "POST" }, id);
    return res.ok;
  } catch {
    return false;
  }
}


export interface BrowserInputPayload {
  action: "click" | "scroll" | "type" | "key";
  xRatio?: number;
  yRatio?: number;
  deltaX?: number;
  deltaY?: number;
  text?: string;
  key?: string;
}

/** Forward touch click, wheel scroll, or key input from Mobile Fast View directly into the agent's active CDP tab. */
export async function dispatchAgentBrowserInput(agentId: string, payload: BrowserInputPayload): Promise<boolean> {
  try {
    const id = bare(agentId);
    const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/input`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }, id);
    return res.ok;
  } catch {
    return false;
  }
}

export class DesktopAuthError extends Error {}

// Pre-warmed signed desktop URLs per agentId+mode so mobile & desktop reuse valid 8h tokens without re-requesting
const cachedSignedDesktopUrls = new Map<string, { url: string; expiresAt: number }>();

/**
 * Signed URL (`https://desktop/a360/{token}/`, 8 h) for the agent's Selkies desktop.
 * Reuses a valid pre-warmed token when available so mobile browsers connect immediately.
 */
export async function issueAgentDesktopUrl(agentId: string, mode: "control" | "watch" = "control"): Promise<string> {
  const id = bare(agentId);
  const cacheKey = `${id}:${mode}`;
  const cached = cachedSignedDesktopUrls.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  const key = operatorKey.get();
  const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/viewer?mode=${mode}`, {
    method: "POST",
    headers: { Accept: "application/json", ...(key ? { "X-Agent360-Operator-Token": key } : {}) },
  }, id);
  if (res.status === 401) throw new DesktopAuthError("Operator key required to open the agent desktop");
  if (!res.ok) throw new Error(`viewer ${res.status}`);
  const body = (await res.json()) as { url: string };
  cachedSignedDesktopUrls.set(cacheKey, { url: body.url, expiresAt: Date.now() + 7 * 3600 * 1000 });
  return body.url;
}

export async function prefetchAgentDesktopUrl(agentId: string, mode: "control" | "watch" = "control"): Promise<string | null> {
  try {
    return await issueAgentDesktopUrl(agentId, mode);
  } catch {
    return null;
  }
}

/** Opens the desktop in a new tab; uses pre-warmed URL on mobile when available so iOS Safari / Android Chrome never strand on about:blank. */
export function openAgentDesktopTab(agentId: string, hash = "#collab"): void {
  const mode = hash === "#shared" ? "watch" : "control";
  const cacheKey = `${bare(agentId)}:${mode}`;
  const cached = cachedSignedDesktopUrls.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    const w = window.open(cached.url + hash, "_blank", "noopener,noreferrer");
    if (!w) window.location.assign(cached.url + hash);
    return;
  }

  const w = window.open("about:blank", "_blank");
  issueAgentDesktopUrl(agentId, mode)
    .then((url) => {
      if (w && !w.closed) {
        w.opener = null;
        w.location.replace(url + hash);
      } else {
        window.location.assign(url + hash);
      }
    })
    .catch((e) => {
      try { w?.close(); } catch {}
      window.alert(e instanceof DesktopAuthError ? "Cần quyền truy cập hoặc operator key để mở desktop của agent." : `Không mở được desktop: ${e.message}`);
    });
}
