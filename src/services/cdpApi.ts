export interface BrowserCdpTarget {
  id: string;
  title?: string;
  type?: string;
  url?: string;
  devtoolsFrontendUrl?: string;
  webSocketDebuggerUrl?: string;
  faviconUrl?: string;
}

export interface BrowserCdpStatus {
  available: boolean;
  endpoint: string;
  browserVersion?: string;
  targetCount: number;
  targets: BrowserCdpTarget[];
}

export async function fetchBrowserCdpStatus(): Promise<BrowserCdpStatus> {
  try {
    const res = await fetch("/api/v1/agents/browser/cdp/status", {
      headers: { Accept: "application/json" }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch CDP status: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Browser CDP status fallback", err);
    return {
      available: false,
      endpoint: "http://100.76.185.111:19223",
      targetCount: 0,
      targets: []
    };
  }
}

export function getBrowserCdpStreamUrl(targetId?: string, fps: number = 2): string {
  const params = new URLSearchParams();
  if (targetId) params.set("targetId", targetId);
  params.set("fps", fps.toString());
  return `/api/v1/agents/browser/cdp/stream?${params.toString()}`;
}
