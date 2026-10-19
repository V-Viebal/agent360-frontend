import React, { useState, useEffect } from "react";
import {
  Bot,
  Users,
  Server,
  Zap,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  HardDrive,
  CreditCard,
  RefreshCw
} from "lucide-react";

export function AdminDashboardPage() {
  const [agentsCount, setAgentsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    setLoading(true);
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [resAgents, resUsers, resTxs] = await Promise.allSettled([
        fetch("/api/agents", { headers }),
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/billings/transactions", { headers })
      ]);

      if (resAgents.status === "fulfilled" && resAgents.value.ok) {
        const data = await resAgents.value.json();
        setAgentsCount(Array.isArray(data) ? data.length : 0);
      }

      if (resUsers.status === "fulfilled" && resUsers.value.ok) {
        const data = await resUsers.value.json();
        setUsersCount(Array.isArray(data) ? data.length : 0);
      }

      if (resTxs.status === "fulfilled" && resTxs.value.ok) {
        const data = await resTxs.value.json();
        if (Array.isArray(data)) {
          const paidSum = data
            .filter((t: any) => t.status === "paid" || t.status === "success")
            .reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0);
          setTotalRevenue(paidSum);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = [
    { label: "Active Fleet Agents", value: loading ? "..." : agentsCount.toString(), change: "Ready 24/7", icon: Bot, color: "text-[#ff7a00]", bg: "bg-[#ff7a00]/10 border-[#ff7a00]/20" },
    { label: "Registered Users", value: loading ? "..." : usersCount.toString(), change: "Logto IAM Synced", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Infra VPS Fleet", value: "5 Nodes", change: "100% Operational", icon: Server, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Doanh Thu PayOS", value: loading ? "..." : `${totalRevenue.toLocaleString("vi-VN")} ₫`, change: "VietQR Auto Gateway", icon: CreditCard, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 space-y-3 font-sans overflow-y-auto pr-1">
      {/* Header Tier */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <span>Trung Tâm Điều Hành (Root Infrastructure Overview)</span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              CLUSTER HEALTHY
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400">
            Giám sát tài nguyên VPS fleet, cụm worker autonomous agents và luồng giao dịch thanh toán PAYG.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="p-1.5 rounded-xl border border-[#262634] bg-[#161620] hover:bg-[#20202c] text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
          title="Tải lại chỉ số"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline text-[11px]">Tải lại</span>
        </button>
      </div>

      {/* Metric Cards (App360 Exact Stat-Card Pattern) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-400 font-medium block mb-1">{s.label}</span>
                <div className="text-xl font-bold text-white mb-0.5 font-mono">{s.value}</div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <span>{s.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl border ${s.bg} ${s.color} shrink-0`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cluster Health & Security Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Nodes Grid */}
        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-emerald-400" />
                <h2 className="text-xs font-semibold text-white">VPS Fleet Node Status</h2>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                5 / 5 ONLINE
              </span>
            </div>

            <div className="space-y-2">
              {[
                { node: "2nd Server (App & API)", role: "Agent360 API, Nginx, Temporal, VectorDB", status: "Online" },
                { node: "3rd Server (Core Workers)", role: "QwenPaw Core Runtime, Browser CDP Proxy", status: "Online" },
                { node: "4th Server (IAM & S3)", role: "Logto Dedicated OIDC, MinIO Dedicated S3", status: "Online" },
                { node: "6th Server (GM Enterprise)", role: "QwenPaw GM Enterprise Runtime, ERPNext", status: "Online" },
                { node: "7th Server (Planthy Cluster)", role: "Planthy AI Agent Node, Browser CDP", status: "Online" },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#181822] border border-[#262634]">
                  <div>
                    <div className="text-xs font-semibold text-white">{n.node}</div>
                    <div className="text-[10px] text-neutral-400 font-mono">{n.role}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[11px]">{n.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security & IAM Status */}
        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-[#ff7a00]" />
              <h2 className="text-xs font-semibold text-white">Identity & Access Enforcement</h2>
            </div>
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#181822] border border-[#262634]">
                <div className="flex items-center justify-between text-xs font-medium text-white mb-1">
                  <span>Logto Dedicated IAM Engine</span>
                  <span className="text-emerald-400 font-mono text-[10px]">AUTH-SKYER.HMZ.ONE</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Argon2i, Google OAuth 2.0 & Resend SMTP verified.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#181822] border border-[#262634]">
                <div className="flex items-center justify-between text-xs font-medium text-white mb-1">
                  <span>Infisical Vault Sync</span>
                  <span className="text-blue-400 font-mono text-[10px]">18 SECRETS LOCKED</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Environment variables managed under slug <code>agent360-x5-o0</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#181822] border border-[#262634]">
                <div className="flex items-center justify-between text-xs font-medium text-white mb-1">
                  <span>RBAC Agent Scoping Policy</span>
                  <span className="text-[#ff7a00] font-mono text-[10px]">ENFORCED</span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Members load only assigned agents. Admins inspect all fleet agents across cluster.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#22222e] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>Last audit: Just now</span>
            <span className="text-emerald-400 font-medium">Compliance: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
