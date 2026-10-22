import React, { useEffect, useState } from "react";
import { authConfig } from "../config/authConfig";
import { initiateSkyerSignIn } from "../services/pkceAuth";
import { getStoredToken, requestTokenRefresh } from "../services/authFetch";
import { Loader2 } from "lucide-react";
import { SkyerLogo } from "./SkyerLogo";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function checkAuthSession() {
      // 1. Initial check: check if token already in storage
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

      // 2. Storage synchronization grace period (up to 1500ms):
      // If user just arrived from /callback, allow storage write to flush
      const start = Date.now();
      while (Date.now() - start < 1500) {
        await new Promise((r) => setTimeout(r, 100));
        token = getStoredToken("skyer_access_token");
        refreshToken = getStoredToken("skyer_refresh_token");
        if (token || hasOperatorKey) {
          if (!isCancelled) setIsAuthenticated(true);
          return;
        }
      }

      // 3. If access token is absent or expired but refresh token exists: attempt silent refresh
      if (refreshToken) {
        const renewed = await requestTokenRefresh();
        if (renewed) {
          if (!isCancelled) setIsAuthenticated(true);
          return;
        }
      }

      if (!isCancelled) {
        setIsAuthenticated(false);
        // Automatically redirect to Logto OIDC sign-in
        initiateSkyerSignIn(authConfig).catch((err) => {
          console.error("[AuthGuard] Auto redirect failed:", err);
        });
      }
    }

    checkAuthSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white flex flex-col items-center justify-center p-4 font-sans select-none">
        <div className="max-w-sm w-full p-8 rounded-2xl bg-[#121216] border border-[#22222e] shadow-2xl flex flex-col items-center text-center">
          <div className="mb-4">
            <SkyerLogo size={36} showText={false} showBotBadge={false} />
          </div>
          <h2 className="text-base font-semibold text-white mb-1.5 flex items-center gap-1.5">
            <span>Agent360 Workspace</span>
            <span className="px-1.5 py-0.2 rounded-md bg-[#f8a87c]/20 text-[#f8a87c] text-[10px] font-mono uppercase font-bold">Secure</span>
          </h2>
          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Đang xác thực phiên làm việc an toàn... Vui lòng đăng nhập để tiếp tục.
          </p>

          <div className="flex items-center gap-2 text-xs text-[#f8a87c] font-medium bg-[#f8a87c]/10 px-4 py-2 rounded-xl border border-[#f8a87c]/20">
            <Loader2 className="w-4 h-4 animate-spin text-[#f8a87c]" />
            <span>Chuyển hướng đến Cổng đăng nhập...</span>
          </div>

          <button
            onClick={() => initiateSkyerSignIn(authConfig)}
            className="mt-5 text-[11px] text-neutral-500 hover:text-neutral-300 underline transition-colors cursor-pointer"
          >
            Bấm vào đây nếu trình duyệt không tự chuyển hướng
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
