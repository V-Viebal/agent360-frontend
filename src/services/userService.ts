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
 * Get the current user profile from Logto id_token or UserInfo endpoint and backend RBAC
 */
export async function getCurrentUserProfile(forceRefresh = false): Promise<UserProfile | null> {
  const accessToken = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("skyer_access_token") : null;
  const idToken = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("skyer_id_token") : null;

  // 1. Try from cached profile in sessionStorage (if not forcing refresh and has roles)
  if (!forceRefresh) {
    try {
      const cachedStr = sessionStorage.getItem("skyer_user_profile");
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (cached && Array.isArray(cached.roles) && cached.roles.length > 0) {
          return cached;
        }
      }
    } catch {}
  }

  // 2. Decode claims from id_token
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

  // 4. Enrich roles and permissions from backend /api/users/me (PostgreSQL database authority)
  if (accessToken) {
    try {
      const backendRes = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (backendRes.ok) {
        const backendData = await backendRes.json();
        const backendRoles = Array.isArray(backendData.roles)
          ? backendData.roles.map((r: any) => (typeof r === "string" ? r : r.code || r.name))
          : [];
        user = {
          sub: backendData.externalUserId || user?.sub || "",
          name: backendData.displayName || user?.name || `${backendData.firstName || ""} ${backendData.lastName || ""}`.trim() || "User",
          email: backendData.email || user?.email,
          picture: backendData.avatarUrl || user?.picture,
          roles: Array.from(new Set([...(user?.roles || []), ...backendRoles])),
          permissions: backendData.permissions || user?.permissions || [],
        };
      }
    } catch (e) {
      // Backend unavailable or network failure
    }
  }

  // Fallback: If still no user but accessToken exists, synthesize from sub
  if (!user && accessToken) {
    const payload = parseJwt(accessToken);
    if (payload && payload.sub) {
      user = {
        sub: payload.sub,
        name: "User",
        roles: Array.isArray(payload.roles) ? payload.roles : [],
      };
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
