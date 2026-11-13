export const ACCESS = "skyer_access_token";
export const REFRESH = "skyer_refresh_token";
export const ID_TOKEN = "skyer_id_token";
export const USER_PROFILE = "skyer_user_profile";
export const RETURN_URL = "skyer_return_url";

/** JWT `exp` (seconds) or 0 when the value is not a decodable JWT. */
export function tokenExpiry(token: string | null): number {
  if (!token) return 0;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp : 0;
  } catch {
    return 0;
  }
}

/**
 * Single token read path. Another tab (or this tab's silent renew) may have renewed the shared localStorage copy;
 * Logto rotates refresh tokens, so a stale sessionStorage pair is revoked and its access token expires. Always
 * return the newer pair instead of blindly preferring sessionStorage.
 */
export function getStoredToken(key: string): string | null {
  try {
    const fromSession = sessionStorage.getItem(key);
    const fromLocal = localStorage.getItem(key);
    if (fromSession && fromLocal && fromSession !== fromLocal) {
      if (key === ACCESS || key === ID_TOKEN) return tokenExpiry(fromLocal) > tokenExpiry(fromSession) ? fromLocal : fromSession;
      if (key === REFRESH) return fromLocal;
    }
    return fromSession || fromLocal;
  } catch {
    return null;
  }
}

/** Current Logto access token (newest of the sessionStorage/localStorage copies). */
export function getAccessToken(): string | null {
  return getStoredToken(ACCESS);
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

export function clearCachedAgentAndChatData(): void {
  try {
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

export function clearAllSessionState(): void {
  removeStoredToken(ACCESS);
  removeStoredToken(REFRESH);
  removeStoredToken(ID_TOKEN);
  removeStoredToken(USER_PROFILE);
  clearCachedAgentAndChatData();
  try {
    sessionStorage.removeItem("skyer_last_exchanged_code");
    sessionStorage.removeItem("skyer_oidc_verifier");
    sessionStorage.removeItem("skyer_oidc_state");
    localStorage.removeItem("agent360.a2a.operatorKey");
    localStorage.removeItem("operator_token");
  } catch {}
}
