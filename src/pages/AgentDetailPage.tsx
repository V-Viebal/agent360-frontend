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
import { useTranslation } from "../i18n/LanguageContext";

export function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <span>{t("detail.back")}</span>
        </Link>

        {/* Main Agent Header Card */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8a87c]/5 blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[var(--border-subtle)]">
            <div className="flex items-start gap-5">
              {/* Large Geometry Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#f8a87c] to-amber-300 text-black flex items-center justify-center font-bold shadow-xl shadow-[#f8a87c]/20 shrink-0">
                <Bot size={36} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{agent.name}</h1>
                  {agent.verified && (
                    <span title="Verified Skyer Core Template">
                      <CheckCircle2 size={20} className="text-[#f8a87c]" />
                    </span>
                  )}
                </div>
                <div className="text-sm sm:text-base text-neutral-800 dark:text-neutral-700 dark:text-neutral-300 font-medium mt-1">
                  {agent.roleTitle}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                  <span>Created by {agent.creatorName}</span>
                  <span>•</span>
                  <span className="text-[#f8a87c]">@{agent.handle}</span>
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
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8a87c] hover:bg-[#f5935f] text-black px-7 py-3 text-sm font-semibold transition-all shadow-[0_0_24px_rgba(248,168,124,0.35)] cursor-pointer active:scale-95 shrink-0"
            >
              {deployed ? <Check size={16} /> : <Play size={16} fill="currentColor" />}
              <span>{deployed ? t("detail.deploying") : t("detail.deploy")}</span>
            </button>
          </div>

          {/* Description & AI Teammates Core Specifications */}
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-widest text-[#f8a87c] mb-2">
                {t("detail.overview")}
              </h2>
              <p className="text-sm sm:text-base text-neutral-800 dark:text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {agent.description}
              </p>
            </div>

            {/* AI Teammates Role, Goal & Backstory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-xs font-mono text-[#f8a87c] uppercase tracking-wider flex items-center gap-1.5">
                  <Workflow size={14} />
                  <span>{t("detail.roleGoal")}</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                  {agent.goal}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-xs font-mono text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>{t("detail.backstory")}</span>
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
                  <Cpu size={14} className="text-[#f8a87c]" />
                  {t("detail.orchestration")}
                </span>
                <span className="text-neutral-400">Mode: {agent.teamConfig.collaborationMode}</span>
              </div>
              <div className="text-neutral-700 dark:text-neutral-300">
                <span className="text-neutral-500">{t("detail.teammatePipeline")} </span>
                {agent.teamConfig.teammateRoles.join(" ⇄ ")}
              </div>
              <div className="text-neutral-400">
                <span className="text-neutral-500">{t("detail.expectedOutput")} </span>
                {agent.teamConfig.expectedOutput}
              </div>
            </div>

            {/* Toolchain & Routines */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div>
                <h3 className="text-neutral-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Lock size={13} className="text-[#f8a87c]" />
                  {t("detail.toolchain")}
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
                  {t("detail.routines")}
                </h3>
                <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                  {agent.routines.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-[#f8a87c] font-bold">↳</span>
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
                  <Terminal size={14} className="text-[#f8a87c]" />
                  {t("detail.terminalTrace")}
                </span>
                <span className="text-emerald-400">{t("detail.exitCodePass")}</span>
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
