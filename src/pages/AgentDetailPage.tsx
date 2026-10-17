import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  Terminal,
  Workflow,
  Sparkles,
  Bot,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowUpRight,
  BookOpen,
  Check,
  Lock,
  GitBranch,
} from "lucide-react";
import { MARKETPLACE_AGENTS } from "../data/mockMarketplaceAgents";
import { AgentMarketplaceItem } from "../types/marketplace";

export function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [deployed, setDeployed] = useState(false);

  const agent = MARKETPLACE_AGENTS.find((a) => a.id === agentId) || MARKETPLACE_AGENTS[0];

  const handleDeploy = () => {
    setDeployed(true);
    setTimeout(() => {
      navigate(`/app?agent=${agent.id}`);
    }, 1200);
  };

  return (
    <div className="pt-24 pb-28 min-h-screen text-[var(--text-primary)] font-sans">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6 font-mono"
        >
          <ArrowLeft size={14} />
          <span>Back to Marketplace</span>
        </Link>

        {/* Main Agent Header Card */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7a00]/5 blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-start gap-5">
              {/* Large Geometry Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#ff7a00] to-amber-300 text-black flex items-center justify-center font-bold shadow-xl shadow-[#ff7a00]/20 shrink-0">
                <Bot size={36} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{agent.name}</h1>
                  {agent.verified && (
                    <span title="Verified Skyer Core Template">
                      <CheckCircle2 size={20} className="text-[#ff7a00]" />
                    </span>
                  )}
                </div>
                <div className="text-sm sm:text-base text-neutral-800 dark:text-neutral-700 dark:text-neutral-300 font-medium mt-1">
                  {agent.roleTitle}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  <span>Created by {agent.creatorName}</span>
                  <span>•</span>
                  <span className="text-[#ff7a00]">@{agent.handle}</span>
                  <span>•</span>
                  <span>{agent.installCount} active instances</span>
                  <span>•</span>
                  <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    {agent.department}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDeploy}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ff7a00] hover:bg-[#ff8f26] text-black px-7 py-3 text-sm font-semibold transition-all shadow-[0_0_24px_rgba(255,122,0,0.35)] cursor-pointer active:scale-95 shrink-0"
            >
              {deployed ? <Check size={16} /> : <Play size={16} fill="currentColor" />}
              <span>{deployed ? "Deploying to Workspace..." : "Deploy Teammate"}</span>
            </button>
          </div>

          {/* Description & AI Teammates Core Specifications */}
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] mb-2">
                Executive Overview
              </h2>
              <p className="text-sm sm:text-base text-neutral-800 dark:text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {agent.description}
              </p>
            </div>

            {/* AI Teammates Role, Goal & Backstory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-xs font-mono text-[#ff7a00] uppercase tracking-wider flex items-center gap-1.5">
                  <Workflow size={14} />
                  <span>Agent Role & Specific Goal</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                  {agent.goal}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-xs font-mono text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Backstory & Epistemic Standard</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-800 dark:text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                  {agent.backstory}
                </p>
              </div>
            </div>

            {/* Multi-Agent AI Team Configuration */}
            <div className="p-5 rounded-xl bg-black/50 border border-[var(--border-subtle)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="flex items-center gap-2">
                  <Cpu size={14} className="text-[#ff7a00]" />
                  Multi-Agent AI Teammates Orchestration
                </span>
                <span className="text-neutral-400">Mode: {agent.teamConfig.collaborationMode}</span>
              </div>
              <div className="text-neutral-700 dark:text-neutral-300">
                <span className="text-neutral-500">Autonomous Teammate Pipeline: </span>
                {agent.teamConfig.teammateRoles.join(" ⇄ ")}
              </div>
              <div className="text-neutral-400">
                <span className="text-neutral-500">Expected Authoritative Output: </span>
                {agent.teamConfig.expectedOutput}
              </div>
            </div>

            {/* Toolchain & Routines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div>
                <h3 className="text-neutral-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Lock size={13} className="text-[#ff7a00]" />
                  Provisioned Sandbox Toolchain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tools.map((t) => (
                    <span
                      key={t}
                      className="bg-white/5 border border-[var(--border-subtle)] px-3 py-1.5 rounded-lg text-neutral-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-neutral-400 font-semibold mb-3 flex items-center gap-1.5">
                  <GitBranch size={13} className="text-emerald-400" />
                  Continuous Autonomous Routines
                </h3>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  {agent.routines.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-[#ff7a00] font-bold">↳</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sample Request & Terminal Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-neutral-400 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-white font-semibold">
                  <Terminal size={14} className="text-[#ff7a00]" />
                  Authoritative Terminal Execution Trace
                </span>
                <span className="text-emerald-400">Exit Code: 0 (PASS)</span>
              </div>

              <div className="rounded-xl border border-[var(--border-subtle)] bg-black/80 p-5 font-mono text-xs space-y-2 text-neutral-700 dark:text-neutral-300 shadow-inner">
                {agent.terminalPreview.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-600 select-none">{idx + 1}</span>
                    <span
                      className={
                        line.includes("pass") ||
                        line.includes("healthy") ||
                        line.includes("MATCH") ||
                        line.includes("OBSERVED")
                          ? "text-emerald-400 font-medium"
                          : "text-neutral-700 dark:text-neutral-300"
                      }
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
