import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { authConfig } from "../config/authConfig";
import { getCurrentUserProfile } from "../services/userService";
import { setStoredToken, getStoredToken } from "../services/sessionStorageHelpers";

// Module-level lock to survive React 18 StrictMode double-mount without race conditions
let activeExchangePromise: Promise<string | null> | null = null;
let lastProcessedCode: string | null = null;

export function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");
        const errorDesc = params.get("error_description");

        if (error) {
          if (!isCancelled) {
            setStatus("error");
            setErrorMsg(errorDesc || error);
          }
          return;
        }

        // If no code in query params:
        if (!code) {
          // If already authenticated, go to target
          const existingToken = getStoredToken("skyer_access_token");
          if (existingToken) {
            const target = sessionStorage.getItem("skyer_return_url") || "/app";
            sessionStorage.removeItem("skyer_return_url");
            navigate(target, { replace: true });
            return;
          }
          // If in the middle of an active exchange in another mount, wait for it
          if (activeExchangePromise) {
            const target = await activeExchangePromise;
            if (!isCancelled && target) {
              navigate(target, { replace: true });
            }
            return;
          }
          // No code and no session -> go to public home, NOT /app (to prevent redirect loop)
          navigate("/", { replace: true });
          return;
        }

        // Avoid re-exchanging if already processed in this page session
        if (lastProcessedCode === code && getStoredToken("skyer_access_token")) {
          const target = sessionStorage.getItem("skyer_return_url") || "/app";
          sessionStorage.removeItem("skyer_return_url");
          navigate(target, { replace: true });
          return;
        }

        // If another mount is already exchanging this code, await that promise
        if (!activeExchangePromise) {
          activeExchangePromise = (async () => {
            lastProcessedCode = code;
            sessionStorage.setItem("skyer_last_exchanged_code", code);

            const codeVerifier = sessionStorage.getItem("skyer_oidc_verifier") || "";
            const isLocal = typeof window !== "undefined" && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const clientId = isLocal ? authConfig.localAppId : authConfig.appId;
            const redirect = isLocal ? 'http://localhost:3000/callback' : authConfig.redirectUri;

            const tokenEndpoint = new URL("/oidc/token", authConfig.endpoint).toString();
            const body = new URLSearchParams({
              grant_type: "authorization_code",
              client_id: clientId,
              code,
              redirect_uri: redirect,
              code_verifier: codeVerifier,
              resource: authConfig.apiResource,
              scope: ["openid", "profile", "email", "offline_access", ...authConfig.apiScopes].join(" "),
            });

            const res = await fetch(tokenEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: body.toString(),
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              console.warn("[Auth] Token exchange failed:", res.status, errData);
              // If we already have a valid session in storage, fall back to it
              if (getStoredToken("skyer_access_token")) {
                const target = sessionStorage.getItem("skyer_return_url") || "/app";
                sessionStorage.removeItem("skyer_return_url");
                return target;
              }
              throw new Error(errData.message || errData.error_description || "Authentication token exchange failed");
            }

            const tokenData = await res.json();
            if (!tokenData.access_token) {
              throw new Error("No access_token returned by authorization server");
            }

            // Write tokens to both sessionStorage and localStorage
            setStoredToken("skyer_access_token", tokenData.access_token);
            if (tokenData.id_token) setStoredToken("skyer_id_token", tokenData.id_token);
            if (tokenData.refresh_token) setStoredToken("skyer_refresh_token", tokenData.refresh_token);

            // Clean up transient PKCE state
            sessionStorage.removeItem("skyer_oidc_verifier");
            sessionStorage.removeItem("skyer_oidc_state");

            // Strip the code parameter now that exchange succeeded
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch {}

            // Pre-fetch user profile
            try {
              await getCurrentUserProfile();
            } catch {}

            const target = sessionStorage.getItem("skyer_return_url") || "/app";
            sessionStorage.removeItem("skyer_return_url");
            return target;
          })().finally(() => {
            // Keep activeExchangePromise valid for 3 seconds to absorb any StrictMode remounts
            setTimeout(() => {
              activeExchangePromise = null;
            }, 3000);
          });
        }

        const targetUrl = await activeExchangePromise;
        if (!isCancelled && targetUrl) {
          setStatus("success");
          setTimeout(() => {
            navigate(targetUrl, { replace: true });
          }, 200);
        }
      } catch (e: any) {
        if (!isCancelled) {
          setStatus("error");
          setErrorMsg(e.message || "Failed to process authorization callback");
        }
      }
    }

    handleCallback();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl flex flex-col items-center text-center">
        {status === "processing" && (
          <>
            <Loader2 className="w-12 h-12 text-[#f8a87c] animate-spin mb-4" />
            <h2 className="text-lg font-semibold mb-2">Authenticating with Logto OIDC</h2>
            <p className="text-xs text-neutral-400">Exchanging credentials and initializing your authenticated session...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Authentication Successful</h2>
            <p className="text-xs text-neutral-400">Redirecting to your Agent360 Workspace...</p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2 text-rose-400">Authentication Failed</h2>
            <p className="text-xs text-neutral-400 mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate("/", { replace: true })}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
