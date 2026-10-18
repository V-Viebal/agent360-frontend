import { useTranslation } from "../i18n/LanguageContext";
import { useState, useEffect } from "react";
import {
  BrowserCdpStatus,
  BrowserCdpTarget,
  fetchBrowserCdpStatus,
  getBrowserCdpFrameUrl,
} from "../services/cdpApi";
import { fetchAgentBrowserFrame } from "../services/agentBrowserApi";
import {
  Globe,
  Radio,
  ExternalLink,
  RefreshCw,
  X,
  Play,
  Pause,
  AlertCircle,
  Eye,
} from "lucide-react";

interface BrowserCdpViewerModalProps {
  onClose: () => void;
  agentId: string;
  agentName: string;
}

export function BrowserCdpViewerModal({ onClose, agentId, agentName }: BrowserCdpViewerModalProps) {
  const { t } = useTranslation();
  const [cdpStatus, setCdpStatus] = useState<BrowserCdpStatus | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await fetchBrowserCdpStatus(agentId);
      setCdpStatus(data);
      if (data.targets && data.targets.length > 0 && !selectedTargetId) {
        const page = data.targets.find((t) => t.type === "page") || data.targets[0];
        setSelectedTargetId(page.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedTargetId(null);
    loadStatus();
  }, [agentId]);

  // ~1 fps frame polling of the agent's own tab (authenticated fetch -> object URL), paused while hidden.
  const [streamUrl, setStreamUrl] = useState<string>("");
  useEffect(() => {
    if (!isStreaming) return;
    let alive = true;
    let current = "";
    let busy = false;
    const ctrl = new AbortController();
    const tick = async () => {
      if (busy || document.hidden) return;
      busy = true;
      try {
        const next = await fetchAgentBrowserFrame(getBrowserCdpFrameUrl(agentId, selectedTargetId || undefined, Date.now()), ctrl.signal);
        if (!alive) { URL.revokeObjectURL(next); return; }
        if (current) URL.revokeObjectURL(current);
        current = next;
        setStreamUrl(next);
      } catch {
        /* keep the last frame */
      } finally {
        busy = false;
      }
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => { alive = false; ctrl.abort(); clearInterval(i); if (current) URL.revokeObjectURL(current); };
  }, [isStreaming, agentId, selectedTargetId]);

  const selectedTarget = cdpStatus?.targets.find((t) => t.id === selectedTargetId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#120f0c] border border-[#d86f4c]/50 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#1a1410] border-b border-[#2b241e] flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5 text-[#d86f4c]">
            <Globe size={18} />
            <div>
              <h3 className="font-semibold text-sm text-white font-sans flex items-center gap-2">
                <span>{t("browserCdp.title")}</span>
                <span className="text-[10px] font-mono font-normal text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStreaming((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#2b241e] bg-[#0c0a08] text-xs font-mono text-slate-700 dark:text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {isStreaming ? (
                <>
                  <Pause size={12} className="text-amber-400" />
                  <span>{t("browserCdp.pause")}</span>
                </>
              ) : (
                <>
                  <Play size={12} className="text-emerald-400" />
                  <span>{t("browserCdp.resume")}</span>
                </>
              )}
            </button>

            <button
              onClick={loadStatus}
              className="p-1.5 rounded-lg border border-[#2b241e] bg-[#0c0a08] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Targets"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Viewport Canvas & Tabs */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[450px]">
          {/* Main Stream Area */}
          <div className="flex-1 bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {isStreaming && cdpStatus?.available ? (
              <img
                src={streamUrl}
                alt="Live CDP Stream"
                className="max-h-[500px] w-auto object-contain rounded-lg border border-white/10 shadow-2xl"
                onError={(e) => {
                  // Fallback on image load drop
                  console.warn("CDP stream frame drop or pause", e);
                }}
              />
            ) : !cdpStatus?.available ? (
              <div className="text-center p-8 space-y-2 text-slate-500 dark:text-neutral-400 font-mono text-xs">
                <AlertCircle size={32} className="text-amber-400 mx-auto" />
                <p className="text-white font-semibold">{t("browserCdp.unreachable")}</p>
                <p className="text-neutral-500 max-w-sm">
                  {cdpStatus?.endpoint || "Resolving agent browser…"}
                </p>
              </div>
            ) : (
              <div className="text-center p-8 space-y-2 text-slate-500 dark:text-neutral-400 font-mono text-xs">
                <Pause size={32} className="text-neutral-500 mx-auto" />
                <p className="text-slate-700 dark:text-neutral-300">Stream paused. Click {t("browserCdp.resume")} to reconnect.</p>
              </div>
            )}

            {/* Target URL Badge */}
            {selectedTarget && (
              <div className="absolute bottom-3 left-4 right-4 bg-[#14100d]/90 backdrop-blur border border-[#2b241e] px-3 py-1.5 rounded-lg flex items-center justify-between text-[11px] font-mono text-slate-700 dark:text-neutral-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#d86f4c] font-semibold">URL:</span>
                  <span className="truncate text-white">{selectedTarget.url || "about:blank"}</span>
                </div>
                <span className="text-neutral-500 shrink-0">Tab ID: {selectedTarget.id.slice(0, 8)}</span>
              </div>
            )}
          </div>

          {/* Right: Target Tabs Selector */}
          <div className="w-full md:w-64 bg-[#16120f] border-t md:border-t-0 md:border-l border-[#2b241e] p-4 flex flex-col font-mono text-xs">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-3">
              Browser Tabs & Contexts ({cdpStatus?.targets.length || 0})
            </span>

            <div className="space-y-1.5 overflow-y-auto flex-1">
              {cdpStatus?.targets.map((target) => (
                <button
                  key={target.id}
                  onClick={() => setSelectedTargetId(target.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    selectedTargetId === target.id
                      ? "bg-[#d86f4c]/15 border-[#d86f4c]/40 text-white"
                      : "bg-[#0c0a08] border-[#2b241e] text-slate-500 dark:text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="font-semibold truncate text-[11px] mb-0.5">
                    {target.title || "Untitled Tab"}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate">{target.url}</div>
                  <div className="mt-1 flex items-center justify-between text-[9px] text-neutral-500 uppercase">
                    <span>{target.type}</span>
                    {selectedTargetId === target.id && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Eye size={10} /> Active
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#2b241e] text-[10px] text-neutral-500 space-y-1">
              <div>Profile: {cdpStatus?.profile || "—"}</div>
              <div>Browser: {cdpStatus?.endpoint || "—"}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#17120e] border-t border-[#2b241e] flex justify-between items-center text-[11px] text-neutral-500 font-mono">
          <span>Operated by {agentName} · agent-scoped browser profile</span>
          <button
            onClick={onClose}
            className="hover:text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
