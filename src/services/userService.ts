import { authConfig } from "../config/authConfig";

export interface UserProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  avatar?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
}

export function parseJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Get the current user profile from Logto id_token or UserInfo endpoint
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  // 1. Try from cached profile in sessionStorage
  try {
    const cached = sessionStorage.getItem("skyer_user_profile");
    if (cached) return JSON.parse(cached);
  } catch {}

  // 2. Decode claims from id_token
  const idToken = sessionStorage.getItem("skyer_id_token");
  let user: UserProfile | null = null;
  if (idToken) {
    const payload = parseJwt(idToken);
    if (payload && payload.sub) {
      user = {
        sub: payload.sub,
        name: payload.name || payload.username || payload.email?.split("@")[0],
        email: payload.email,
        picture: payload.picture || payload.avatar,
        roles: Array.isArray(payload.roles) ? payload.roles : [],
      };
    }
  }

  // 3. Fallback or enrich via Logto /oidc/me using access_token
  const accessToken = sessionStorage.getItem("skyer_access_token");
  if (accessToken) {
    try {
      const res = await fetch(new URL("/oidc/me", authConfig.endpoint).toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        user = {
          sub: data.sub || user?.sub || "",
          name: data.name || user?.name || data.email?.split("@")[0] || "User",
          email: data.email || user?.email,
          picture: data.picture || user?.picture,
          roles: Array.isArray(data.roles) ? data.roles : (user?.roles || []),
        };
      }
    } catch (e) {
      console.warn("[User] Failed to fetch /oidc/me:", e);
    }
  }

  if (user) {
    try {
      sessionStorage.setItem("skyer_user_profile", JSON.stringify(user));
    } catch {}
  }

  return user;
}

/**
 * Update user display name and avatar (locally and via Logto /oidc/me patch if supported)
 */
export async function updateUserProfile(updates: { name?: string; picture?: string }): Promise<UserProfile | null> {
  const current = await getCurrentUserProfile();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    name: updates.name !== undefined ? updates.name : current.name,
    picture: updates.picture !== undefined ? updates.picture : current.picture,
  };

  try {
    sessionStorage.setItem('skyer_user_profile', JSON.stringify(updated));
    localStorage.setItem('skyer_user_profile', JSON.stringify(updated));
  } catch {}

  // Attempt to sync to Logto custom data / userinfo if available
  const accessToken = sessionStorage.getItem('skyer_access_token');
  if (accessToken && authConfig.endpoint) {
    try {
      await fetch(new URL('/api/users/me', authConfig.endpoint).toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updates),
      }).catch(() => {});
    } catch {}
  }

  return updated;
}
