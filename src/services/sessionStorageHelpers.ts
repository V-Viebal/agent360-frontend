export const ACCESS = "skyer_access_token";
export const REFRESH = "skyer_refresh_token";
export const ID_TOKEN = "skyer_id_token";
export const USER_PROFILE = "skyer_user_profile";
export const RETURN_URL = "skyer_return_url";

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
  } catch {}
}
