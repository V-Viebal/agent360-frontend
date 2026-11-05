import { operatorKey } from "./a2aApi";
import { authorizedFetch } from "./agentApi";

export interface AgentBrowserTab {
  targetId: string;
  title: string;
  url: string;
  anchor: boolean;
}

export interface AgentBrowserVpnStatus {
  enabled: boolean;
  mode: string;
  proxyUrl: string;
  server: string;
  region: string;
  publicIp: string;
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
  vpn?: AgentBrowserVpnStatus | null;
}

function bare(agentId: string): string { return agentId.replace(/^bot:agent360:/i, ""); }

// Agents without a mapped browser (404) are remembered briefly so polling does not hammer the API,
// but a browser MCP wired later (QwenPaw agent gains a binding) is picked up within NO_BROWSER_TTL_MS.
const NO_BROWSER_TTL_MS = 60_000;
const noBrowser = new Map<string, number>();
const isNoBrowser = (id: string) => {
  const until = noBrowser.get(id);
  if (until === undefined) return false;
  if (until > Date.now()) return true;
  noBrowser.delete(id);
  return false;
};

/** True while the API has recently said this agent has no browser profile. */
export const hasNoBrowser = (agentId: string) => isNoBrowser(bare(agentId));

/** Clear the negative browser cache for an agent (e.g. when Zalo Web channel is enabled). */
export const clearNoBrowserCache = (agentId: string) => {
  noBrowser.delete(bare(agentId));
};

/** Browser identity of one agent (its own Selkies desktop + Chromium profile). */
export async function fetchAgentBrowser(agentId: string, signal?: AbortSignal): Promise<AgentBrowserInfo | null> {
  const id = bare(agentId);
  if (isNoBrowser(id)) return null;
  const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser`, {
    headers: { Accept: "application/json" },
    signal,
  }, id);
  if (res.status === 404) {
    noBrowser.set(id, Date.now() + NO_BROWSER_TTL_MS);
    return null;
  }
  if (!res.ok) throw new Error(`browser ${res.status}`);
  return res.json();
}

/** Screenshot URL of the agent's own active tab (cache-busted). */
export function agentBrowserImageUrl(agentId: string, nonce: number, pageId?: string): string {
  const qs = new URLSearchParams({ t: String(nonce) });
  if (pageId) qs.set("pageId", pageId);
  return `/api/agents/${encodeURIComponent(bare(agentId))}/browser/image.jpg?${qs.toString()}`;
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
  action: "click" | "dblclick" | "rightclick" | "move" | "mousedown" | "mousemove_drag" | "mouseup" | "scroll" | "scroll_to" | "find" | "type" | "ime_commit" | "key" | "navigate" | "reload" | "back" | "forward" | "new_tab" | "close_tab" | "activate_tab" | "resize" | "quality" | "clipboard_copy" | "clipboard_paste";
  modifiers?: number;
  backspaces?: number;
  xRatio?: number;
  yRatio?: number;
  deltaX?: number;
  deltaY?: number;
  text?: string;
  key?: string;
  pageId?: string;
  width?: number;
  height?: number;
  isMobile?: boolean;
  deviceType?: "phone" | "tablet" | "desktop";
  reloadOnModeChange?: boolean;
}

export interface BrowserInputResult {
  ok: boolean;
  agentId?: string;
  targetId?: string;
  createdTargetId?: string | null;
  action?: string;
  tabs?: AgentBrowserTab[] | null;
}

/** Forward touch click, wheel scroll, or key input directly into the agent's active CDP tab. */
export async function dispatchAgentBrowserInput(agentId: string, payload: BrowserInputPayload): Promise<BrowserInputResult> {
  try {
    const id = bare(agentId);
    const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/input`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }, id);
    if (!res.ok) return { ok: false };
    const data = await res.json().catch(() => ({}));
    return { ok: true, ...data };
  } catch {
    return { ok: false };
  }
}


/** Build an authenticated WebSocket URL for real-time CDP screencast push (/api/agents/{id}/browser/stream). */
export function detectAdaptiveNetworkQuality(): number {
  try {
    const conn = typeof navigator !== "undefined" ? (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection : null;
    if (conn) {
      if (conn.saveData) return 58;
      const eff = String(conn.effectiveType || "").toLowerCase();
      if (eff === "slow-2g" || eff === "2g") return 56;
      if (eff === "3g") return 68;
      const dl = Number(conn.downlink || 10);
      const rtt = Number(conn.rtt || 50);
      if (dl < 2 || rtt > 250) return 64;
      if (dl < 6 || rtt > 120) return 78;
    }
  } catch {}
  return 90;
}

export function agentBrowserStreamWsUrl(agentId: string, maxWidth = 1920, pageId?: string, vw?: number, vh?: number, isMobileDevice = false): string {
  const cappedMaxW = Math.min(1920, Math.max(800, maxWidth));
  const id = bare(agentId);
  const proto = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
  const q = detectAdaptiveNetworkQuality();
  const qs = new URLSearchParams({ maxWidth: String(cappedMaxW), q: String(q), bin: "1" });
  if (pageId) qs.set("pageId", pageId);
  if (vw && vw >= 320) qs.set("vw", String(Math.round(vw)));
  if (vh && vh >= 240) qs.set("vh", String(Math.round(vh)));
  qs.set("mobile", isMobileDevice ? "1" : "0");
  qs.set("device", isMobileDevice ? "phone" : "desktop");
  try {
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || "";
    const opToken = operatorKey.get();
    if (token) {
      qs.set("access_token", token);
    } else if (opToken) {
      qs.set("operator_token", opToken);
    }
  } catch {}
  return `${proto}//${host}/api/agents/${encodeURIComponent(id)}/browser/stream?${qs.toString()}`;
}

export class DesktopAuthError extends Error {}

/** True only for Agent360-signed desktop URLs (`https://host/a360/{token}/`), the sole path that avoids the Selkies admin prompt. */
export function isSignedAgentDesktopUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /^\/a360\/[^/]+\/?$/.test(u.pathname);
  } catch {
    return false;
  }
}

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
  if (!isSignedAgentDesktopUrl(body.url)) throw new Error("viewer returned an unsigned desktop URL");
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

export interface AgentBrowserHistoryItem {
  id: number;
  title: string;
  url: string;
  isCurrent: boolean;
}

export async function fetchAgentBrowserHistory(agentId: string, pageId?: string): Promise<AgentBrowserHistoryItem[]> {
  try {
    const id = bare(agentId);
    const qs = new URLSearchParams();
    if (pageId) qs.set("pageId", pageId);
    const url = `/api/agents/${encodeURIComponent(id)}/browser/history${qs.toString() ? "?" + qs.toString() : ""}`;
    const res = await authorizedFetch(url, { headers: { Accept: "application/json" } }, id);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchAgentBrowserSuggestions(agentId: string, query: string): Promise<string[]> {
  try {
    const q = (query || "").trim();
    if (!q) return [];
    const id = bare(agentId);
    const qs = new URLSearchParams({ q });
    const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/suggest?${qs.toString()}`, {
      headers: { Accept: "application/json" },
    }, id);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}


export async function fetchAgentBrowserVpn(agentId: string): Promise<AgentBrowserVpnStatus | null> {
  try {
    const id = bare(agentId);
    const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/vpn`, {
      headers: { Accept: "application/json" },
    }, id);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function setAgentBrowserVpn(
  agentId: string,
  payload: { enabled: boolean; mode?: string; region?: string; proxyId?: number; proxyUrl?: string; rotate?: boolean }
): Promise<AgentBrowserVpnStatus | null> {
  try {
    const id = bare(agentId);
    const res = await authorizedFetch(`/api/agents/${encodeURIComponent(id)}/browser/vpn`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    }, id);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
