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
 * Get the current user profile from Logto id_token and backend PostgreSQL RBAC
 */
export async function getCurrentUserProfile(forceRefresh = false): Promise<UserProfile | null> {
  const accessToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token")
      : null;
  const idToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("skyer_id_token") || localStorage.getItem("skyer_id_token")
      : null;

  // 1. Try from cached profile in sessionStorage / localStorage (if not forcing refresh and has roles)
  if (!forceRefresh) {
    try {
      const cachedStr = sessionStorage.getItem("skyer_user_profile") || localStorage.getItem("skyer_user_profile");
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

  // 3. Fallback synthesis from access_token if id_token was missing
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

  // 4. Enrich roles, email and permissions from backend /api/users/me (PostgreSQL database authority)
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

  if (user) {
    try {
      const serialized = JSON.stringify(user);
      sessionStorage.setItem("skyer_user_profile", serialized);
      localStorage.setItem("skyer_user_profile", serialized);
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
  const accessToken = sessionStorage.getItem('skyer_access_token') || localStorage.getItem('skyer_access_token');
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

/**
 * Update the current user's password via backend Logto Management API integration
 */
export async function changeCurrentUserPassword(newPassword: string): Promise<{ ok: boolean; message?: string; error?: string }> {
  const accessToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token")
      : null;

  if (!accessToken) {
    return { ok: false, error: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại." };
  }

  try {
    const res = await fetch("/api/users/me/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error: data?.error || data?.detail || data?.title || "Không thể cập nhật mật khẩu. Vui lòng thử lại.",
      };
    }

    return {
      ok: true,
      message: data?.message || "Đã cập nhật mật khẩu thành công!",
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Lỗi kết nối máy chủ khi cập nhật mật khẩu.",
    };
  }
}

/**
 * Query whether the current user has a password set on Logto
 */
export async function getCurrentUserPasswordStatus(): Promise<boolean> {
  const accessToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token")
      : null;

  if (!accessToken) return false;

  try {
    const res = await fetch("/api/users/me/password", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return Boolean(data?.hasPassword);
    }
  } catch {}
  return false;
}
