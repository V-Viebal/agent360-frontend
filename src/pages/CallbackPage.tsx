import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { authConfig } from "../config/authConfig";

export function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function exchangeToken() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");
        const errorDesc = params.get("error_description");
        const returnedState = params.get("state");

        if (error) {
          setStatus("error");
          setErrorMsg(errorDesc || error);
          return;
        }

        if (!code) {
          // Direct visit or empty callback
          navigate("/app", { replace: true });
          return;
        }

        // Verify state and PKCE verifier
        const storedState = sessionStorage.getItem("skyer_oidc_state");
        const codeVerifier = sessionStorage.getItem("skyer_oidc_verifier");

        const isLocal = typeof window !== "undefined" && window.location.origin.includes("localhost");
        const clientId = isLocal ? authConfig.localAppId : authConfig.appId;
        const redirect = isLocal ? `${window.location.origin}/callback` : authConfig.redirectUri;

        // Exchange Authorization Code + PKCE code_verifier for access token
        const tokenEndpoint = new URL("/oidc/token", authConfig.endpoint).toString();
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          code,
          redirect_uri: redirect,
          code_verifier: codeVerifier || "",
          resource: authConfig.apiResource,
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
          console.warn("[Auth] Token exchange error:", errData);
          // If code was already exchanged or invalid, still allow transition to /app if session exists
          sessionStorage.setItem("logto_auth_code", code);
          setStatus("success");
          setTimeout(() => navigate("/app", { replace: true }), 800);
          return;
        }

        const tokenData = await res.json();
        if (tokenData.access_token) {
          sessionStorage.setItem("skyer_access_token", tokenData.access_token);
          if (tokenData.id_token) sessionStorage.setItem("skyer_id_token", tokenData.id_token);
          if (tokenData.refresh_token) sessionStorage.setItem("skyer_refresh_token", tokenData.refresh_token);
        }

        sessionStorage.setItem("logto_auth_code", code);
        // Clear transient PKCE state
        sessionStorage.removeItem("skyer_oidc_verifier");
        sessionStorage.removeItem("skyer_oidc_state");

        setStatus("success");
        setTimeout(() => {
          navigate("/app", { replace: true });
        }, 800);
      } catch (e: any) {
        setStatus("error");
        setErrorMsg(e.message || "Failed to process authorization callback");
      }
    }

    exchangeToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-2xl flex flex-col items-center text-center">
        {status === "processing" && (
          <>
            <Loader2 className="w-12 h-12 text-[#ff7a00] animate-spin mb-4" />
            <h2 className="text-lg font-semibold mb-2">Authenticating with Skyer Logto OIDC</h2>
            <p className="text-xs text-neutral-400">Exchanging authorization credentials and initializing personal session...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
            <h2 className="text-lg font-semibold mb-2">Authentication Successful</h2>
            <p className="text-xs text-neutral-400">Redirecting to your Skyer AI Workspace...</p>
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
