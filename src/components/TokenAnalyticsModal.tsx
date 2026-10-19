import { useState, useEffect } from "react";
import { TokenUsageReport, fetchTokenUsageReport } from "../services/metricsApi";
import { Modal } from "./ui/Modal";
import {
  BarChart3,
  Zap,
  Cpu,
  Layers,
  Database,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface TokenAnalyticsModalProps {
  onClose: () => void;
}

export function TokenAnalyticsModal({ onClose }: TokenAnalyticsModalProps) {
  const [report, setReport] = useState<TokenUsageReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTokenUsageReport();
      setReport(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    return num.toLocaleString();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Token Consumption & Cost Analytics"
      icon={<BarChart3 size={18} className="text-[#f8a87c]" />}
      maxWidth="2xl"
    >
      <div className="p-6 space-y-6 font-sans text-xs">
        {loading ? (
          <div className="text-center py-12 text-neutral-500 font-mono">
            Loading runtime token usage statistics...
          </div>
        ) : !report ? (
          <div className="text-center py-12 text-neutral-500 font-mono">
            No token usage metrics recorded on this node.
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="bg-slate-50 dark:bg-[#17120e] border border-slate-200 dark:border-[#2b241e] p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                  <TrendingUp size={11} className="text-[#f8a87c]" />
                  Total Invocations
                </span>
                <div className="text-base font-semibold text-slate-800 dark:text-white">
                  {formatNumber(report.total_calls)}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#17120e] border border-slate-200 dark:border-[#2b241e] p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                  <Zap size={11} className="text-amber-400" />
                  Cache Hit Rate
                </span>
                <div className="text-base font-semibold text-amber-400">
                  {report.cache_hit_rate.toFixed(1)}%
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#17120e] border border-slate-200 dark:border-[#2b241e] p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                  <Database size={11} className="text-blue-400" />
                  Cached Tokens
                </span>
                <div className="text-base font-semibold text-slate-800 dark:text-neutral-200">
                  {(report.total_cache_read_tokens / 1_000_000).toFixed(1)}M
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#17120e] border border-slate-200 dark:border-[#2b241e] p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                  <Cpu size={11} className="text-emerald-400" />
                  Prompt Tokens
                </span>
                <div className="text-base font-semibold text-emerald-400">
                  {(report.total_prompt_tokens / 1_000_000).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* By Model Breakdown */}
            {report.by_model && (
              <div className="space-y-3 font-mono">
                <div className="text-[11px] text-slate-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                  Consumption by Active Model Slot
                </div>
                <div className="space-y-2">
                  {Object.entries(report.by_model).map(([modelKey, m]) => (
                    <div
                      key={modelKey}
                      className="bg-slate-50 dark:bg-[#17120e] border border-slate-200 dark:border-[#26201a] p-3.5 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <span className="text-[#f8a87c]">●</span>
                          <span>{m.model || modelKey}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {formatNumber(m.call_count || 0)} calls • {m.provider_id || "direct"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {formatNumber(m.prompt_tokens + m.completion_tokens)} tkn
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {formatNumber(m.prompt_tokens)} in / {formatNumber(m.completion_tokens)} out
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 dark:bg-[#16120f] border-t border-slate-200 dark:border-[#2b241e] flex items-center justify-between">
        <button
          type="button"
          onClick={loadData}
          data-ux-target-min="24"
          aria-label="Refresh telemetry metrics"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#2b241e] bg-white dark:bg-[#0c0a08] text-slate-600 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          <span>Refresh Metrics</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-xl bg-[#f8a87c] text-black font-semibold text-xs hover:bg-[#f5935f] transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
