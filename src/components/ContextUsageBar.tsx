import { useTranslation } from "../i18n/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import { Zap, Sparkles, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { compactAgentContext, CompactContextResponse } from "../services/agentApi";

interface ContextUsageBarProps {
  agentId: string;
  sessionId?: string;
  estimatedTokens?: number;
  maxTokens?: number;
  onCompacted?: (result: CompactContextResponse) => void;
  className?: string;
}

export function ContextUsageBar({
  agentId,
  sessionId,
  estimatedTokens = 0,
  maxTokens = 128000,
  onCompacted,
  className = "",
}: ContextUsageBarProps) {
  const { t } = useTranslation();
  const [isCompacting, setIsCompacting] = useState(false);
  const [compactResult, setCompactResult] = useState<string | null>(null);
  const [liveTokens, setLiveTokens] = useState<number>(estimatedTokens);

  // Proposal 2 Hook: Realtime Token Counter Hook fetching from analytics endpoint
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveUsage() {
      try {
        const res = await fetch("/api/agents/analytics/token-usage");
        if (res.ok) {
          const data = await res.json();
          // Derive session or today's prompt token pressure
          if (data && data.total_prompt_tokens) {
            const todayStr = new Date().toISOString().split("T")[0];
            const todayData = data.by_date?.[todayStr];
            if (todayData && todayData.prompt_tokens && isMounted) {
              // Smooth representation scaled to active model window
              setLiveTokens(Math.min(todayData.prompt_tokens, maxTokens));
            }
          }
        }
      } catch {
        // graceful fallback to estimated tokens
      }
    }

    if (estimatedTokens > 0) {
      setLiveTokens(estimatedTokens);
    }
    fetchLiveUsage();

    return () => {
      isMounted = false;
    };
  }, [agentId, sessionId, estimatedTokens, maxTokens]);

  const safeMax = maxTokens > 0 ? maxTokens : 128000;
  const currentTokens = Math.max(liveTokens, estimatedTokens);
  const ratio = Math.min(100, Math.max(0, Math.round((currentTokens / safeMax) * 100)));
  const isHigh = ratio >= 75;
  const isMedium = ratio >= 50 && ratio < 75;

  const barColor = isHigh
    ? "bg-amber-500"
    : isMedium
    ? "bg-[#f8a87c]"
    : "bg-emerald-500";

  const handleCompact = async () => {
    if (isCompacting) return;
    setIsCompacting(true);
    setCompactResult(null);

    try {
      const res = await compactAgentContext(agentId, sessionId, "Compress conversation context; retain decisions, goals, and pending tasks");
      if (res.success) {
        setCompactResult("Context compacted");
        setLiveTokens(Math.round(currentTokens * 0.35)); // Reconcile visual token bar after eviction
        onCompacted?.(res);
      } else {
        setCompactResult("Compaction failed");
      }
    } catch {
      setCompactResult("Failed to compact");
    } finally {
      setIsCompacting(false);
      setTimeout(() => setCompactResult(null), 3000);
    }
  };


  const isCompactTrigger = className.includes("compact-trigger");

  const [showMobileTooltip, setShowMobileTooltip] = useState(false);
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (isCompactTrigger) {
    const usedK = (currentTokens / 1000).toFixed(currentTokens >= 10000 ? 0 : 1);
    const maxK = (safeMax / 1000).toFixed(0);
    const leftPercent = Math.max(0, 100 - ratio);

    // SVG Circular Progress math
    const radius = 6.5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (ratio / 100) * circumference;

    return (
      <div className="relative inline-flex items-center group/ctx">
        <button
          type="button"
          onClick={() => {
            if (showMobileTooltip) {
              setShowMobileTooltip(false);
            } else {
              handleCompact();
            }
          }}
          onTouchStart={() => {
            // Only trigger mobile tooltip on mobile/coarse touch screens (< 1024 or coarse pointer)
            if (typeof window !== "undefined" && window.innerWidth >= 1024 && window.matchMedia("(pointer: fine)").matches) {
              return;
            }
            if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
            touchTimerRef.current = setTimeout(() => {
              if (typeof window !== "undefined" && "vibrate" in navigator) {
                try { navigator.vibrate(20); } catch {}
              }
              setShowMobileTooltip(true);
            }, 350);
          }}
          onTouchEnd={() => {
            if (touchTimerRef.current) {
              clearTimeout(touchTimerRef.current);
              touchTimerRef.current = null;
            }
          }}
          onTouchCancel={() => {
            if (touchTimerRef.current) {
              clearTimeout(touchTimerRef.current);
              touchTimerRef.current = null;
            }
          }}
          disabled={isCompacting}
          aria-label={`Context window: ${ratio}% used`}
          className={`relative p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center shrink-0 ${className}`}
        >
          {isCompacting ? (
            <Loader2 size={15} className="animate-spin text-[#f8a87c]" />
          ) : (
            <svg width="17" height="17" viewBox="0 0 18 18" className="transform -rotate-90">
              {/* Background ring */}
              <circle
                cx="9"
                cy="9"
                r={radius}
                stroke="currentColor"
                strokeWidth="2.2"
                fill="transparent"
                className="text-neutral-700/60 dark:text-[#2d2d3a]"
              />
              {/* Progress ring */}
              <circle
                cx="9"
                cy="9"
                r={radius}
                stroke={isHigh ? "#f8a87c" : isMedium ? "#f8a87c" : "#9ca3af"}
                strokeWidth="2.2"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500 ease-out"
              />
            </svg>
          )}
        </button>

        {/* Hovering Context Detail Tooltip matching user screenshot, also toggleable via mobile hold-touch */}
        <div
          onClick={() => setShowMobileTooltip(false)}
          className={`absolute bottom-full right-0 mb-2.5 flex-col gap-1.5 p-3 rounded-2xl bg-white/95 dark:bg-[#181820]/95 border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-xl z-[9999] min-w-[190px] text-left animate-in fade-in zoom-in-95 duration-150 select-none ${
            showMobileTooltip ? "flex pointer-events-auto" : "pointer-events-none hidden group-hover/ctx:flex"
          }`}
        >
          <div className="text-[11px] font-sans text-slate-500 dark:text-neutral-400">{t("contextBar.window")}</div>
          <div className="text-xs font-semibold text-slate-900 dark:text-white">
            {ratio}% used ({leftPercent}% left)
          </div>
          <div className="text-[11px] font-mono text-slate-600 dark:text-neutral-400">
            {usedK}k / {maxK}k tokens used
          </div>

          <div className="pt-1 mt-0.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 18 18" className="transform -rotate-90 shrink-0">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2.5" fill="transparent" className="text-slate-300 dark:text-neutral-700" />
                <circle cx="9" cy="9" r="6" stroke="#f8a87c" strokeWidth="2.5" strokeDasharray={37.7} strokeDashoffset={37.7 - (ratio / 100) * 37.7} strokeLinecap="round" fill="transparent" />
              </svg>
              <span className="truncate max-w-[110px] text-slate-700 dark:text-neutral-300">{t("contextBar.autoGc")}</span>
            </div>
            <span className="text-[#f8a87c] hover:underline cursor-pointer">{t("contextBar.compact")}</span>
          </div>

          {compactResult && (
            <div className="mt-1 text-[10px] text-emerald-400 font-mono">
              ✓ {compactResult}
            </div>
          )}

          {/* Arrow */}
          <div className="absolute right-2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white dark:border-t-[#181820]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c]/90 border border-[#22222e] text-xs font-mono ${className}`}>
      <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
        <Zap size={13} className={isHigh ? "text-amber-400 animate-pulse" : "text-[#f8a87c]"} />
        <span className="text-[11px] text-neutral-300">Context:</span>
      </div>

      <div className="flex-1 min-w-[70px] max-w-[120px] h-1.5 bg-[#1c1c28] rounded-full overflow-hidden shrink-0">
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${Math.max(ratio, 4)}%` }}
        />
      </div>

      <span className={`text-[10px] shrink-0 font-semibold ${isHigh ? "text-amber-400" : "text-neutral-400"}`} title={`${currentTokens.toLocaleString()} / ${safeMax.toLocaleString()} tokens`}>
        {ratio}%
      </span>

      <button
        type="button"
        onClick={handleCompact}
        disabled={isCompacting}
        title="Trigger native Skyer context compaction & checkpoint GC"
        className={`ml-1 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-sans font-medium transition-all ${
          isHigh
            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
            : "bg-[#1f1f2e] hover:bg-[#28283a] text-neutral-300 border border-white/5"
        }`}
      >
        {isCompacting ? (
          <Loader2 size={11} className="animate-spin text-[#f8a87c]" />
        ) : (
          <Sparkles size={11} className={isHigh ? "text-amber-300" : "text-[#f8a87c]"} />
        )}
        <span>{isCompacting ? "Compacting..." : "Compact"}</span>
      </button>

      {compactResult && (
        <span className="text-[10px] text-emerald-400 flex items-center gap-1 ml-1 truncate">
          <CheckCircle2 size={11} />
          {compactResult}
        </span>
      )}
    </div>
  );
}
