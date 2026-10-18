import { authConfig } from "../config/authConfig";
import { initiateSkyerSignIn } from "./pkceAuth";

/**
 * Attach the Skyer (Logto) access token to same-origin /api/* calls. The backend requires it for workspace
 * files and chat history (Agent360:Security:RequireAuthForSensitiveReads). On 401 the token is refreshed once
 * with the stored refresh token. If token cannot be refreshed and there is no active session,
 * prompt user gently rather than aggressive instant redirects to avoid loops.
 */
const ACCESS = "skyer_access_token";
const REFRESH = "skyer_refresh_token";
let refreshing: Promise<string | null> | null = null;

function expired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return false;
  }
}

async function refreshToken(original: typeof fetch): Promise<string | null> {
  const rt = sessionStorage.getItem(REFRESH);
  if (!rt) return null;
  const isLocal = window.location.origin.includes("localhost");
  try {
    const res = await original(new URL("/oidc/token", authConfig.endpoint).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: isLocal ? authConfig.localAppId : authConfig.appId,
        refresh_token: rt,
        resource: authConfig.apiResource,
        scope: authConfig.apiScopes.join(" "),
      }).toString(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.access_token) return null;
    sessionStorage.setItem(ACCESS, data.access_token);
    if (data.refresh_token) sessionStorage.setItem(REFRESH, data.refresh_token);
    return data.access_token as string;
  } catch {
    return null;
  }
}

function getRefreshed(original: typeof fetch): Promise<string | null> {
  if (!refreshing) refreshing = refreshToken(original).finally(() => { refreshing = null; });
  return refreshing;
}

export function installAuthFetch(): void {
  if (typeof window === "undefined" || (window.fetch as any).__agent360Auth) return;
  const original = window.fetch.bind(window);
  const wrapped = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(raw, window.location.origin);
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/api/")) return original(input, init);

    // operatorFetch (inner) reads skyer_access_token from sessionStorage and attaches it, so a refresh only
    // needs to update storage; an explicitly provided Authorization header is respected.
    const withToken = (token: string | null) => {
      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
      return original(input, { ...init, headers });
    };

    let token = sessionStorage.getItem(ACCESS);
    if (token && expired(token)) token = (await getRefreshed(original)) ?? token;
    const res = await withToken(token);
    if (res.status !== 401 || !res.headers.get("WWW-Authenticate")?.startsWith("Bearer")) return res;

    const fresh = await getRefreshed(original);
    if (fresh) return withToken(fresh);

    // Only redirect if explicitly on a protected path that mandates auth and user hasn't already attempted auth
    const hasOperatorKey = (() => { try { return !!localStorage.getItem("agent360.a2a.operatorKey"); } catch { return false; } })();
    if (hasOperatorKey || sessionStorage.getItem(ACCESS) || window.location.pathname === "/callback") {
      return res;
    }

    return res;
  };
  (wrapped as any).__agent360Auth = true;
  window.fetch = wrapped as typeof window.fetch;
}
