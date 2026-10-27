import { authConfig } from "../config/authConfig";
import { initiateSkyerSignIn } from "./pkceAuth";

/**
 * Robust session maintenance and token lifecycle manager matching monosbase design:
 * - SessionSecurityStorage across tabs (dual sessionStorage + localStorage sync).
 * - Automatic background token refresh (silent renew) when token approaches expiry (renewTimeBeforeTokenExpiresInSeconds: 60).
 * - Single-flight refresh mutex lock (useRefreshTokenLock) to prevent race conditions during concurrent API calls.
 * - On 401: transparent retry with fresh token. If refresh token fails/revoked: graceful session cleanup and auto redirect to sign-in re-auth.
 */
const ACCESS = "skyer_access_token";
const REFRESH = "skyer_refresh_token";
const ID_TOKEN = "skyer_id_token";
const USER_PROFILE = "skyer_user_profile";
const RETURN_URL = "skyer_return_url";

export function getStoredToken(key: string): string | null {
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStoredToken(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  } catch {}
}

export function removeStoredToken(key: string): void {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {}
}

export function clearAllSessionState(): void {
  removeStoredToken(ACCESS);
  removeStoredToken(REFRESH);
  removeStoredToken(ID_TOKEN);
  removeStoredToken(USER_PROFILE);
  try {
    sessionStorage.removeItem("skyer_last_exchanged_code");
    sessionStorage.removeItem("skyer_oidc_verifier");
    sessionStorage.removeItem("skyer_oidc_state");
    localStorage.removeItem("agent360.a2a.operatorKey");
    localStorage.removeItem("operator_token");
    for (const store of [sessionStorage, localStorage]) {
      const keysToRemove: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (
          k &&
          (k.startsWith("agent360_chats_cache_") ||
            k.startsWith("agent360_msgcache_") ||
            k.startsWith("agent360_last_chat") ||
            k === "agent360_last_agent_id" ||
            k === "agent360_recent_sessions_map" ||
            k === "agent360_unread_sessions")
        ) {
          keysToRemove.push(k);
        }
      }
      for (const k of keysToRemove) {
        store.removeItem(k);
      }
    }
  } catch {}
}

function tokenApproachingExpiry(token: string, thresholdSeconds = 60): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 < Date.now() + thresholdSeconds * 1000;
  } catch {
    return false;
  }
}

let refreshingPromise: Promise<string | null> | null = null;

export async function requestTokenRefresh(originalFetch: typeof fetch = window.fetch): Promise<string | null> {
  const rt = getStoredToken(REFRESH);
  if (!rt) return null;

  const isLocal = typeof window !== "undefined" && ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') || window.location.origin.includes("127.0.0.1") || window.location.origin.includes("192.168."));
  const clientId = isLocal ? authConfig.localAppId : authConfig.appId;

  try {
    const res = await originalFetch(new URL("/oidc/token", authConfig.endpoint).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: rt,
        resource: authConfig.apiResource,
        scope: ["openid", "profile", "email", "offline_access", ...authConfig.apiScopes].join(" "),
      }).toString(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // If refresh token is expired or revoked by Logto, clean up stale credentials
      if (err.error === "invalid_grant" || res.status === 401) {
        const at = getStoredToken(ACCESS);
        if (!at || tokenApproachingExpiry(at, 0)) {
          console.warn("[Auth] Refresh token expired or revoked and access token expired. Clearing stale session state.");
          clearAllSessionState();
        }
      }
      return null;
    }

    const data = await res.json();
    if (!data.access_token) return null;

    setStoredToken(ACCESS, data.access_token);
    if (data.refresh_token) {
      setStoredToken(REFRESH, data.refresh_token);
    }
    if (data.id_token) {
      setStoredToken(ID_TOKEN, data.id_token);
    }

    return data.access_token as string;
  } catch (err) {
    console.warn("[Auth] Network error during token refresh:", err);
    return null;
  }
}

/**
 * Deduplicated Single-flight Refresh Mutex Lock (equivalent to useRefreshTokenLock in monosbase)
 */
export function getOrRenewAccessToken(originalFetch: typeof fetch = window.fetch): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = requestTokenRefresh(originalFetch).finally(() => {
      refreshingPromise = null;
    });
  }
  return refreshingPromise;
}

/**
 * Background silent renew loop (runs every 30s to renew token before it expires)
 */
let silentRenewInterval: any = null;
export function startSilentRenewLoop(): void {
  if (typeof window === "undefined" || silentRenewInterval) return;
  silentRenewInterval = setInterval(async () => {
    const token = getStoredToken(ACCESS);
    if (token && tokenApproachingExpiry(token, 120)) {
      await getOrRenewAccessToken();
    }
  }, 30_000);
}

let redirectingToSignIn = false;
let sessionProbe: Promise<boolean> | null = null;

/** True only when the backend rejects the stored access token for the signed-in user itself. */
function sessionIsRejected(originalFetch: typeof fetch): Promise<boolean> {
  if (!sessionProbe) {
    sessionProbe = (async () => {
      const token = getStoredToken(ACCESS);
      if (!token) return true;
      try {
        const res = await originalFetch("/api/users/me", { headers: { Authorization: `Bearer ${token}` } });
        return res.status === 401;
      } catch {
        return false;
      }
    })().finally(() => {
      setTimeout(() => { sessionProbe = null; }, 5_000);
    });
  }
  return sessionProbe;
}

const REDIRECT_LOG = "skyer_signin_redirects";

/** Refuses a 3rd automatic sign-in redirect within 2 minutes so an auth fault can never loop forever. */
function signInLoopDetected(): boolean {
  try {
    const now = Date.now();
    const recent = (JSON.parse(localStorage.getItem(REDIRECT_LOG) || "[]") as number[]).filter((t) => now - t < 120_000);
    if (recent.length >= 2) return true;
    localStorage.setItem(REDIRECT_LOG, JSON.stringify([...recent, now]));
  } catch {}
  return false;
}

export function redirectToSignIn(): void {
  if (typeof window === "undefined" || redirectingToSignIn) return;
  if (window.location.pathname === "/callback" || window.location.pathname === "/") return;
  if (signInLoopDetected()) {
    console.error("[Auth] Sign-in redirect loop detected; staying on page instead of redirecting again.");
    return;
  }

  redirectingToSignIn = true;
  try {
    sessionStorage.setItem(RETURN_URL, window.location.pathname + window.location.search);
  } catch {}

  console.warn("[Auth] 401 Unauthorized encountered & refresh failed. Redirecting to sign in...");
  clearAllSessionState();
  initiateSkyerSignIn(authConfig).catch((err) => {
    console.error("[Auth] Redirect to sign in failed:", err);
    redirectingToSignIn = false;
  });
}

export function installAuthFetch(): void {
  if (typeof window === "undefined" || (window.fetch as any).__agent360Auth) return;
  const original = window.fetch.bind(window);

  startSilentRenewLoop();

  const wrapped = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    let url: URL;
    try {
      url = new URL(raw, window.location.origin);
    } catch {
      return original(input, init);
    }

    // Only intercept same-origin first-party API calls
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/api/")) {
      return original(input, init);
    }

    const withToken = (token: string | null) => {
      const headers = new Headers(init?.headers || (input instanceof Request ? input.headers : undefined));
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return original(input, { ...init, headers });
    };

    let token = getStoredToken(ACCESS);
    // Pre-emptive refresh if token expires within 30 seconds
    if (token && tokenApproachingExpiry(token, 30)) {
      token = (await getOrRenewAccessToken(original)) ?? token;
    }

    const response = await withToken(token);

    // On 401: only treat it as a session problem when the backend rejects our token for /api/users/me.
    // Agent runtime passthroughs can 401 for their own reasons; those must never refresh, wipe or eject.
    if (response.status === 401) {
      if (window.location.pathname === "/callback" || window.location.pathname === "/") return response;
      if (!url.pathname.includes("/users/me") && !(await sessionIsRejected(original))) return response;

      const freshToken = await getOrRenewAccessToken(original);
      if (freshToken) {
        return withToken(freshToken);
      }
      if (!url.pathname.includes("/users/me")) {
        redirectToSignIn();
      }
    }

    return response;
  };

  (wrapped as any).__agent360Auth = true;
  window.fetch = wrapped as typeof window.fetch;
}
