import React, { useState, useEffect } from "react";
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
    ? "bg-[#ff7a00]"
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

  if (isCompactTrigger) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={handleCompact}
          disabled={isCompacting}
          title={`Context: ${ratio}% (${currentTokens.toLocaleString()} / ${safeMax.toLocaleString()} tokens). Click to compact context & GC.`}
          className={`flex items-center justify-center h-7 w-7 rounded-full border transition-all cursor-pointer ${
            isHigh
              ? "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30"
              : isMedium
              ? "bg-[#ff7a00]/15 text-[#ff7a00] border-[#ff7a00]/30 hover:bg-[#ff7a00]/25"
              : "bg-[#1c1c26] text-neutral-400 border-[#2b2b3b] hover:text-white hover:bg-[#252536]"
          } ${className}`}
        >
          {isCompacting ? (
            <Loader2 size={13} className="animate-spin text-[#ff7a00]" />
          ) : (
            <Zap size={13} className={isHigh ? "animate-pulse" : ""} />
          )}
        </button>

        {compactResult && (
          <span className="absolute bottom-full mb-1.5 right-0 bg-[#0e0e14] border border-[#262636] text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
            {compactResult}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c]/90 border border-[#22222e] text-xs font-mono ${className}`}>
      <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
        <Zap size={13} className={isHigh ? "text-amber-400 animate-pulse" : "text-[#ff7a00]"} />
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
        title="Trigger native QwenPaw context compaction & checkpoint GC"
        className={`ml-1 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-sans font-medium transition-all ${
          isHigh
            ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
            : "bg-[#1f1f2e] hover:bg-[#28283a] text-neutral-300 border border-white/5"
        }`}
      >
        {isCompacting ? (
          <Loader2 size={11} className="animate-spin text-[#ff7a00]" />
        ) : (
          <Sparkles size={11} className={isHigh ? "text-amber-300" : "text-[#ff7a00]"} />
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
