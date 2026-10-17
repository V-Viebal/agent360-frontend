import { useState, useEffect } from "react";
import { TokenUsageReport, fetchTokenUsageReport } from "../services/metricsApi";
import {
  BarChart3,
  Zap,
  Cpu,
  Layers,
  Database,
  X,
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#120f0c] border border-[#d86f4c]/50 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1a1410] border-b border-[#2b241e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#d86f4c]">
            <BarChart3 size={18} />
            <h3 className="font-semibold text-sm text-white font-sans">
              Token Consumption & Cost Analytics
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-sans text-xs">
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
                <div className="bg-[#17120e] border border-[#2b241e] p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <TrendingUp size={11} className="text-[#d86f4c]" />
                    Total Invocations
                  </span>
                  <div className="text-base font-semibold text-white">
                    {formatNumber(report.total_calls)}
                  </div>
                </div>

                <div className="bg-[#17120e] border border-[#2b241e] p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <Zap size={11} className="text-amber-400" />
                    Cache Hit Rate
                  </span>
                  <div className="text-base font-semibold text-amber-400">
                    {report.cache_hit_rate.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-[#17120e] border border-[#2b241e] p-3 rounded-xl space-y-1">
                  <span className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
                    <Database size={11} className="text-blue-400" />
                    Cached Tokens
                  </span>
                  <div className="text-base font-semibold text-neutral-200">
                    {(report.total_cache_read_tokens / 1_000_000).toFixed(1)}M
                  </div>
                </div>

                <div className="bg-[#17120e] border border-[#2b241e] p-3 rounded-xl space-y-1">
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
                  <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                    Consumption by Active Model Slot
                  </div>
                  <div className="space-y-2">
                    {Object.entries(report.by_model).map(([modelKey, m]) => (
                      <div
                        key={modelKey}
                        className="bg-[#17120e] border border-[#26201a] p-3.5 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span className="text-[#d86f4c]">●</span>
                            <span>{m.model || modelKey}</span>
                            <span className="text-[10px] text-neutral-500">({m.provider_id})</span>
                          </div>
                          <div className="text-[10px] text-neutral-500">
                            {formatNumber(m.call_count)} calls • {formatNumber(m.completion_tokens)} completion tokens
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-neutral-200">
                            {formatNumber(m.prompt_tokens)} in
                          </div>
                          <div className="text-[10px] text-emerald-400">
                            Cache: {formatNumber(m.cache_read_tokens)}
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
        <div className="px-6 py-3 bg-[#17120e] border-t border-[#2b241e] flex justify-between items-center text-[11px] text-neutral-500 font-mono">
          <span>Realtime aggregated metrics from runtime adapter</span>
          <button
            onClick={onClose}
            className="hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
