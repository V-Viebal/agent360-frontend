import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authConfig } from "../config/authConfig";
import { getCurrentUserProfile, parseJwt } from "../services/userService";
import { setStoredToken, getStoredToken } from "../services/sessionStorageHelpers";

// Module-level lock to survive React 18 StrictMode double-mount without race conditions
let activeExchangePromise: Promise<string | null> | null = null;
let lastProcessedCode: string | null = null;

export function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;

    async function handleCallback() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
          console.warn("[Auth] OIDC callback returned error:", error, params.get("error_description"));
          try {
            window.history.replaceState({}, document.title, "/");
          } catch {}
          if (!isCancelled) {
            navigate("/", { replace: true });
          }
          return;
        }

        // If no code in query params:
        if (!code) {
          const existingToken = getStoredToken("skyer_access_token");
          if (existingToken) {
            const target = sessionStorage.getItem("skyer_return_url") || "/app";
            sessionStorage.removeItem("skyer_return_url");
            navigate(target, { replace: true });
            return;
          }
          if (activeExchangePromise) {
            const target = await activeExchangePromise;
            if (!isCancelled && target) {
              navigate(target, { replace: true });
            }
            return;
          }
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

        // Silent background code exchange
        if (!activeExchangePromise) {
          activeExchangePromise = (async () => {
            lastProcessedCode = code;
            sessionStorage.setItem("skyer_last_exchanged_code", code);

            const codeVerifier = sessionStorage.getItem("skyer_oidc_verifier") || "";
            const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
            const clientId = isLocal ? authConfig.localAppId : authConfig.appId;
            const redirect = isLocal ? "http://localhost:3000/callback" : authConfig.redirectUri;

            // Strip query params immediately for a clean URL
            try {
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch {}

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
              console.warn("[Auth] Silent token exchange failed:", res.status, errData);
              if (getStoredToken("skyer_access_token")) {
                const target = sessionStorage.getItem("skyer_return_url") || "/app";
                sessionStorage.removeItem("skyer_return_url");
                return target;
              }
              return "/";
            }

            const tokenData = await res.json();
            if (!tokenData.access_token) {
              return "/";
            }

            // Write tokens to both sessionStorage and localStorage
            setStoredToken("skyer_access_token", tokenData.access_token);
            if (tokenData.id_token) {
              setStoredToken("skyer_id_token", tokenData.id_token);
              try {
                const p = parseJwt(tokenData.id_token);
                if (p && p.sub) {
                  const idEmail = p.email || p.primaryEmail;
                  const idName = p.name || p.username || p.preferred_username || (idEmail ? idEmail.split("@")[0] : undefined);
                  const initialProfile = {
                    sub: p.sub,
                    name: idName,
                    email: idEmail,
                    picture: p.picture || p.avatar,
                    roles: Array.isArray(p.roles) ? p.roles : [],
                  };
                  setStoredToken("skyer_user_profile", JSON.stringify(initialProfile));
                }
              } catch {}
            }
            if (tokenData.refresh_token) setStoredToken("skyer_refresh_token", tokenData.refresh_token);

            // Clean up transient PKCE state
            sessionStorage.removeItem("skyer_oidc_verifier");
            sessionStorage.removeItem("skyer_oidc_state");

            // Warm user profile in background without blocking navigation
            void getCurrentUserProfile(true).catch(() => {});

            const target = sessionStorage.getItem("skyer_return_url") || "/app";
            sessionStorage.removeItem("skyer_return_url");
            return target;
          })().finally(() => {
            setTimeout(() => {
              activeExchangePromise = null;
            }, 3000);
          });
        }

        const targetUrl = await activeExchangePromise;
        if (!isCancelled) {
          navigate(targetUrl || "/app", { replace: true });
        }
      } catch (e) {
        console.warn("[Auth] Silent callback exception:", e);
        if (!isCancelled) {
          const hasToken = !!getStoredToken("skyer_access_token");
          navigate(hasToken ? "/app" : "/", { replace: true });
        }
      }
    }

    handleCallback();

    return () => {
      isCancelled = true;
    };
  }, [navigate]);

  // Invisible / ultra-minimal seamless transition matching workspace background (no success/fail cards)
  return (
    <div className="min-h-screen bg-[#0c0c0e] select-none" aria-hidden="true" />
  );
}
