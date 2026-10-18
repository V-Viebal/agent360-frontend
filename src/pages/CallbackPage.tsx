import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export function CallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
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

      if (code) {
        // Store code/session indicator
        sessionStorage.setItem("logto_auth_code", code);
        setStatus("success");
        setTimeout(() => {
          navigate("/app", { replace: true });
        }, 1200);
      } else {
        // Fallback or direct visit
        navigate("/app", { replace: true });
      }
    } catch (e: any) {
      setStatus("error");
      setErrorMsg(e.message || "Failed to parse authorization callback");
    }
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
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition-all"
            >
              Back to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
