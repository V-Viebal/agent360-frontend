import { fetchAgentBrowser, agentBrowserImageUrl } from "./agentBrowserApi";

export interface BrowserCdpTarget {
  id: string;
  title?: string;
  type?: string;
  url?: string;
}

export interface BrowserCdpStatus {
  available: boolean;
  /** Human label of the agent's browser (node · service); internal CDP endpoints never reach the client. */
  endpoint: string;
  node?: string;
  profile?: string;
  browserVersion?: string;
  targetCount: number;
  targets: BrowserCdpTarget[];
}

/** Status of one agent's own browser (its Chromium profile on its instance), resolved server-side over the internal network. */
export async function fetchBrowserCdpStatus(agentId: string, signal?: AbortSignal): Promise<BrowserCdpStatus> {
  try {
    const info = await fetchAgentBrowser(agentId, signal);
    if (!info) return { available: false, endpoint: "no browser mapped for this agent", targetCount: 0, targets: [] };
    const targets = info.tabs
      .filter((t) => !t.anchor)
      .map((t) => ({ id: t.targetId, title: t.title, url: t.url, type: "page" }));
    return {
      available: info.cdpReachable && info.profileWindowOpen,
      endpoint: `${info.node} · ${info.service}`,
      node: info.node,
      profile: info.profile,
      targetCount: targets.length,
      targets,
    };
  } catch (err) {
    console.warn("Agent browser status unavailable", err);
    return { available: false, endpoint: "unreachable", targetCount: 0, targets: [] };
  }
}

/** Cache-busted JPEG of the agent's tab; the backend shares one capture per tab per second across viewers. */
export function getBrowserCdpFrameUrl(agentId: string, targetId: string | undefined, nonce: number): string {
  const base = agentBrowserImageUrl(agentId, nonce);
  return targetId ? `${base}&pageId=${encodeURIComponent(targetId)}` : base;
}
