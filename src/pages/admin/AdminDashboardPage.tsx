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
  HardDrive
} from "lucide-react";

export function AdminDashboardPage() {
  const [agentsCount, setAgentsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = sessionStorage.getItem("skyer_access_token");
        const res = await fetch("/api/v1/agents", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setAgentsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const stats = [
    { label: "Active Fleet Agents", value: loading ? "..." : agentsCount.toString(), change: "+3 this week", icon: Bot, color: "text-[#ff7a00]" },
    { label: "Registered Users", value: "2", change: "+1 today", icon: Users, color: "text-blue-400" },
    { label: "Infra VPS Nodes", value: "8 Nodes", change: "100% operational", icon: Server, color: "text-emerald-400" },
    { label: "Token Compute Load", value: "4.8M", change: "Daily usage", icon: Zap, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Infrastructure Overview</h1>
        <p className="text-xs text-neutral-400">
          Autonomous multi-bot control plane and cross-cluster resource allocations.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-[#14141a] border border-[#22222c] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-neutral-400 font-medium">{s.label}</span>
                <div className={`p-2 rounded-xl bg-white/5 ${s.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <span>{s.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cluster Health & Core Modules Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nodes Grid */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">VPS Fleet Node Status</h2>
            </div>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              ALL HEALTHY
            </span>
          </div>

          <div className="space-y-3">
            {[
              { node: "2nd Server (App & API)", role: "Agent360 API, Nginx, Temporal, VectorDB", status: "Online" },
              { node: "3rd Server (Core Workers)", role: "QwenPaw Core Runtime, Browser CDP Proxy", status: "Online" },
              { node: "4th Server (IAM & S3)", role: "Logto Dedicated OIDC, MinIO Dedicated S3", status: "Online" },
              { node: "6th Server (GM Enterprise)", role: "QwenPaw GM Enterprise Runtime, ERPNext", status: "Online" },
              { node: "7th Server (Planthy Cluster)", role: "Planthy AI Agent Node, Browser CDP", status: "Online" },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#181822] border border-[#262634]">
                <div>
                  <div className="text-xs font-semibold text-white">{n.node}</div>
                  <div className="text-[11px] text-neutral-400">{n.role}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & IAM Status */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-[#ff7a00]" />
              <h2 className="text-sm font-semibold text-white">Identity & Access Enforcement</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#181822] border border-[#262634]">
                <div className="flex items-center justify-between text-xs font-medium text-white mb-1">
                  <span>Logto Dedicated IAM Engine</span>
                  <span className="text-emerald-400 font-mono text-[10px]">AUTH-SKYER.HMZ.ONE</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Secured with Argon2i credentials, Google Social OAuth 2.0 and Resend SMTP verification.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181822] border border-[#262634]">
                <div className="flex items-center justify-between text-xs font-medium text-white mb-1">
                  <span>Infisical Vault Sync</span>
                  <span className="text-blue-400 font-mono text-[10px]">18 SECRETS LOCKED</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  All production secrets and environment variables are strictly managed under project slug <code>agent360-x5-o0</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181822] border border-[#262634]">
                <div className="flex items-center justify-between text-xs font-medium text-white mb-1">
                  <span>RBAC Agent Scoping Policy</span>
                  <span className="text-[#ff7a00] font-mono text-[10px]">ENFORCED</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Members load only assigned agents. Admin users inspect all fleet agents across the cluster.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#22222e] flex items-center justify-between text-xs text-neutral-400">
            <span>Last audit: Just now</span>
            <span className="text-emerald-400 font-medium">Compliance: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
