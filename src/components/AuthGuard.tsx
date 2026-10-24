import React, { useEffect, useState } from "react";
import { authConfig } from "../config/authConfig";
import { initiateSkyerSignIn } from "../services/pkceAuth";
import { getStoredToken, requestTokenRefresh } from "../services/authFetch";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  // Synchronously initialize auth state if token or operatorKey is already present (zero flash)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    try {
      const token = getStoredToken("skyer_access_token");
      const hasOperatorKey = !!localStorage.getItem("agent360.a2a.operatorKey");
      if (token || hasOperatorKey) return true;
    } catch {}
    return null;
  });

  useEffect(() => {
    if (isAuthenticated === true) return;
    let isCancelled = false;

    async function checkAuthSession() {
      // 1. Initial check
      let token = getStoredToken("skyer_access_token");
      let refreshToken = getStoredToken("skyer_refresh_token");
      const hasOperatorKey = (() => {
        try {
          return !!localStorage.getItem("agent360.a2a.operatorKey");
        } catch {
          return false;
        }
      })();

      if (hasOperatorKey || token) {
        if (!isCancelled) setIsAuthenticated(true);
        return;
      }

      // 2. If refresh token exists: attempt silent background token renewal first
      if (refreshToken) {
        const renewed = await requestTokenRefresh();
        if (renewed) {
          if (!isCancelled) setIsAuthenticated(true);
          return;
        }
      }

      // 3. Brief storage flush check (up to 400ms) in case callback just completed
      const start = Date.now();
      while (Date.now() - start < 400) {
        await new Promise((r) => setTimeout(r, 80));
        token = getStoredToken("skyer_access_token");
        if (token || hasOperatorKey) {
          if (!isCancelled) setIsAuthenticated(true);
          return;
        }
      }

      if (!isCancelled) {
        setIsAuthenticated(false);
        // Silently redirect to Logto OIDC sign-in
        initiateSkyerSignIn(authConfig).catch((err) => {
          console.error("[AuthGuard] Auto redirect failed:", err);
        });
      }
    }

    checkAuthSession();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated]);

  if (isAuthenticated !== true) {
    return <div className="min-h-screen bg-[#0c0c0e] select-none" aria-hidden="true" />;
  }

  return <>{children}</>;
}
