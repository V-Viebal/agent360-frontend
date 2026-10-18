import React, { useState, useEffect } from "react";
import { CreditCard, Zap, TrendingUp, DollarSign, RefreshCw } from "lucide-react";

interface BillingData {
  monthly_spend_usd: number;
  monthly_budget_usd: number;
  total_tokens_30d: number;
  plan_name: string;
  plan_tier: string;
  models: Array<{
    model: string;
    tokens: number;
    percentage: string;
    cost_usd: number;
  }>;
}

export function AdminBillingsPage() {
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadMetrics() {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("skyer_access_token");
      const res = await fetch("/api/v1/admin/metrics/billings", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Billings & Token Metrics</h1>
          <p className="text-xs text-neutral-400">
            Real compute utilization, token expenditure per model, and cluster quota limits from backend telemetry.
          </p>
        </div>
        <button
          onClick={loadMetrics}
          className="p-2 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-2 text-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center justify-between mb-3 text-neutral-400 text-xs">
            <span>Monthly Model Cost</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${data ? data.monthly_spend_usd.toFixed(2) : "0.00"}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">
            Within ${data ? data.monthly_budget_usd : "200"} allocated budget
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center justify-between mb-3 text-neutral-400 text-xs">
            <span>Inference Tokens (30d)</span>
            <Zap size={16} className="text-[#ff7a00]" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {data ? (data.total_tokens_30d / 1_000_000).toFixed(1) + "M" : "0M"}
          </div>
          <span className="text-[11px] text-neutral-500">Live tokens tracked across agents</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center justify-between mb-3 text-neutral-400 text-xs">
            <span>Cluster Deployment</span>
            <TrendingUp size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {data?.plan_tier || "Self-Hosted"}
          </div>
          <span className="text-[11px] text-blue-400 font-medium">
            {data?.plan_name || "Enterprise Dedicated Fleet"}
          </span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
        <h2 className="text-sm font-semibold text-white mb-4">Model Quota & Consumption Breakdown</h2>
        <div className="space-y-3">
          {data?.models?.map((m, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-[#181822] border border-[#262634] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">{m.model}</div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  {(m.tokens / 1_000_000).toFixed(2)}M tokens ({m.percentage})
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white">${m.cost_usd.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-400">Live Metered</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
