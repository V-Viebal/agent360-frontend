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

export function isPlaceholderDisplayName(name?: string | null): boolean {
  if (!name) return true;
  const trimmed = name.trim().toLowerCase();
  return trimmed === "" || trimmed === "user" || trimmed === "user skyer" || trimmed === "skyer user";
}

export function isPlaceholderEmail(email?: string | null, sub?: string | null): boolean {
  if (!email) return true;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || trimmed === "authorized session") return true;
  if (trimmed.endsWith("@skyer.hmz.one")) {
    const localPart = trimmed.split("@")[0];
    if ((sub && localPart === sub.toLowerCase()) || /^[a-z0-9]{10,}$/i.test(localPart)) {
      return true;
    }
  }
  return false;
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

  // 1. Try from cached profile in sessionStorage / localStorage (if not forcing refresh, has roles, and is not a placeholder)
  if (!forceRefresh) {
    try {
      const cachedStr = sessionStorage.getItem("skyer_user_profile") || localStorage.getItem("skyer_user_profile");
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (
          cached &&
          Array.isArray(cached.roles) &&
          cached.roles.length > 0 &&
          !isPlaceholderDisplayName(cached.name) &&
          !isPlaceholderEmail(cached.email, cached.sub)
        ) {
          return cached;
        }
      }
    } catch {}
  }

  // 2. Decode real identity claims from Logto id_token (authoritative OIDC claims from Google/Email login)
  let idTokenUser: UserProfile | null = null;
  if (idToken) {
    const payload = parseJwt(idToken);
    if (payload && payload.sub) {
      const idEmail = payload.email || payload.primaryEmail || undefined;
      const idName =
        payload.name ||
        payload.username ||
        payload.preferred_username ||
        (idEmail && !isPlaceholderEmail(idEmail, payload.sub) ? idEmail.split("@")[0] : undefined);
      idTokenUser = {
        sub: payload.sub,
        name: idName,
        email: idEmail,
        picture: payload.picture || payload.avatar,
        roles: Array.isArray(payload.roles) ? payload.roles : [],
      };
    }
  }

  let user: UserProfile | null = idTokenUser ? { ...idTokenUser } : null;

  // 3. Fallback synthesis from access_token if id_token was missing
  if (!user && accessToken) {
    const payload = parseJwt(accessToken);
    if (payload && payload.sub) {
      user = {
        sub: payload.sub,
        name: undefined,
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

        const resolvedSub = backendData.externalUserId || user?.sub || "";
        const dbFullName = `${backendData.firstName || ""} ${backendData.lastName || ""}`.trim();
        const dbDisplayName = backendData.displayName || dbFullName;
        const dbEmail = backendData.email;
        const dbPicture = backendData.avatarUrl;

        // Prefer real non-placeholder values: if DB has a freshly-created placeholder ("User Skyer" or "{sub}@skyer.hmz.one"),
        // keep the real name/email/picture from id_token AND sync them back to the backend DB!
        const finalEmail = !isPlaceholderEmail(dbEmail, resolvedSub)
          ? dbEmail
          : !isPlaceholderEmail(idTokenUser?.email, resolvedSub)
          ? idTokenUser?.email
          : dbEmail || idTokenUser?.email;

        const finalName = !isPlaceholderDisplayName(dbDisplayName)
          ? dbDisplayName
          : !isPlaceholderDisplayName(idTokenUser?.name)
          ? idTokenUser?.name
          : finalEmail && !isPlaceholderEmail(finalEmail, resolvedSub)
          ? finalEmail.split("@")[0]
          : dbDisplayName || "Skyer Member";

        const finalPicture = dbPicture || idTokenUser?.picture || user?.picture;

        user = {
          sub: resolvedSub,
          name: finalName,
          email: finalEmail,
          picture: finalPicture,
          roles: Array.from(new Set([...(user?.roles || []), ...backendRoles])),
          permissions: backendData.permissions || user?.permissions || [],
        };

        // If DB still had placeholder name or email while id_token has real identity, self-heal DB via /api/users/me
        if (
          (isPlaceholderEmail(dbEmail, resolvedSub) && !isPlaceholderEmail(finalEmail, resolvedSub)) ||
          (isPlaceholderDisplayName(dbDisplayName) && !isPlaceholderDisplayName(finalName)) ||
          (!dbPicture && finalPicture)
        ) {
          void fetch("/api/users/me", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              email: finalEmail,
              displayName: finalName,
              avatarUrl: finalPicture,
            }),
          }).catch(() => {});
        }
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
 * Update user display name and avatar (locally, in PostgreSQL via /api/users/me, and via Logto)
 */
export async function updateUserProfile(updates: { name?: string; picture?: string; email?: string }): Promise<UserProfile | null> {
  const current = await getCurrentUserProfile();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    name: updates.name !== undefined ? updates.name : current.name,
    picture: updates.picture !== undefined ? updates.picture : current.picture,
    email: updates.email !== undefined ? updates.email : current.email,
  };

  try {
    sessionStorage.setItem("skyer_user_profile", JSON.stringify(updated));
    localStorage.setItem("skyer_user_profile", JSON.stringify(updated));
  } catch {}

  const accessToken = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
  if (accessToken) {
    try {
      await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          displayName: updated.name,
          email: updated.email,
          avatarUrl: updated.picture,
        }),
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
