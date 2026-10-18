import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { authConfig } from "../config/authConfig";

export function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");
  const exchangedRef = useRef(false);

  useEffect(() => {
    if (exchangedRef.current) return;

    async function exchangeToken() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");
        const errorDesc = params.get("error_description");

        if (error) {
          setStatus("error");
          setErrorMsg(errorDesc || error);
          return;
        }

        if (!code) {
          navigate("/app", { replace: true });
          return;
        }

        // Deduplicate exchange in React 18 StrictMode
        if (sessionStorage.getItem("skyer_last_exchanged_code") === code) {
          setStatus("success");
          navigate("/app", { replace: true });
          return;
        }

        exchangedRef.current = true;
        sessionStorage.setItem("skyer_last_exchanged_code", code);

        const codeVerifier = sessionStorage.getItem("skyer_oidc_verifier");
        const isLocal = typeof window !== "undefined" && window.location.origin.includes("localhost");
        const clientId = isLocal ? authConfig.localAppId : authConfig.appId;
        const redirect = isLocal ? `${window.location.origin}/callback` : authConfig.redirectUri;

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
          if (sessionStorage.getItem("skyer_access_token")) {
            setStatus("success");
            navigate("/app", { replace: true });
            return;
          }
          setStatus("error");
          setErrorMsg(errData.message || errData.error_description || "Token exchange failed");
          return;
        }

        const tokenData = await res.json();
        if (tokenData.access_token) {
          sessionStorage.setItem("skyer_access_token", tokenData.access_token);
          if (tokenData.id_token) sessionStorage.setItem("skyer_id_token", tokenData.id_token);
          if (tokenData.refresh_token) sessionStorage.setItem("skyer_refresh_token", tokenData.refresh_token);
        }

        sessionStorage.removeItem("skyer_oidc_verifier");
        sessionStorage.removeItem("skyer_oidc_state");

        setStatus("success");
        setTimeout(() => {
          navigate("/app", { replace: true });
        }, 500);
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
