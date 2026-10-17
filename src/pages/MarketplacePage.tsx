import { useTranslation } from "../i18n/LanguageContext";
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  Bot,
  Users,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  Download,
  Play,
  Layers,
  ArrowRight,
  BookOpen,
  X,
  Code2,
  Workflow,
  Check,
} from "lucide-react";
import { MARKETPLACE_AGENTS } from "../data/mockMarketplaceAgents";
import { AIOrgChart } from "../components/AIOrgChart";
import { AgentMarketplaceItem, AgentDepartment } from "../types/marketplace";


const COMPANY_SCALES = [
  { id: "all", label: "All Company Scales", desc: "Every tier" },
  { id: "startup", label: "Startup (<50)", desc: "Lean & Fast" },
  { id: "sme", label: "SME & Growth (50-250)", desc: "Scale Operations" },
  { id: "enterprise", label: "Enterprise (250+)", desc: "Air-Gapped & Compliance" },
];

const CATEGORIES: { label: string; filter: (item: AgentMarketplaceItem) => boolean }[] = [
  { label: "All Positions", filter: () => true },
  { label: "Executive & Ops", filter: (item) => item.department === "Executive & Ops" },
  { label: "Finance & Accounting", filter: (item) => item.department === "Finance & Accounting" },
  { label: "Sales & BizDev", filter: (item) => item.department === "Sales & BizDev" },
  { label: "Customer Support", filter: (item) => item.department === "Customer Support & Success" },
  { label: "Marketing & Growth", filter: (item) => item.department === "Marketing & Creative" },
  { label: "HR & Legal", filter: (item) => item.department === "HR & People" || item.department === "Legal & Compliance" },
  { label: "IT & Tech", filter: (item) => item.department === "Engineering & Tech" },
];

// Helper to render geometrical shapes like x.ai/bot/marketplace
function GeometricAvatar({
  shape,
  color,
  size = "md",
}: {
  shape: AgentMarketplaceItem["shape"];
  color: AgentMarketplaceItem["color"];
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-lg",
  }[size];

  const colorStyles = {
    orange: "from-[#ff7a00] to-amber-300 text-black shadow-[#ff7a00]/25",
    blue: "from-blue-500 to-cyan-300 text-white shadow-blue-500/25",
    emerald: "from-emerald-500 to-teal-300 text-black shadow-emerald-500/25",
    purple: "from-purple-500 to-indigo-300 text-white shadow-purple-500/25",
    rose: "from-rose-500 to-pink-300 text-white shadow-rose-500/25",
    amber: "from-amber-500 to-yellow-300 text-black shadow-amber-500/25",
    cyan: "from-cyan-500 to-blue-300 text-black shadow-cyan-500/25",
  }[color];

  const shapeClasses = {
    squircle: "rounded-[32%]",
    hex: "rounded-lg rotate-6",
    dome: "rounded-t-full rounded-b-xl",
    capsule: "rounded-full",
    crystal: "rounded-none rotate-45 scale-90",
    blob: "rounded-[40%_60%_70%_30%/40%_50%_60%_55%]",
    wedge: "rounded-tr-3xl rounded-bl-3xl rounded-tl-sm rounded-br-sm",
    tablet: "rounded-2xl",
  }[shape];

  return (
    <div
      className={`relative flex items-center justify-center font-mono font-bold bg-gradient-to-tr shadow-lg transition-transform duration-300 group-hover:scale-105 ${sizeClasses} ${colorStyles} ${shapeClasses}`}
    >
      <Bot size={size === "lg" ? 28 : size === "md" ? 20 : 16} />
    </div>
  );
}

export function MarketplacePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"catalog" | "orgchart">("catalog");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Positions");
  const [selectedScale, setSelectedScale] = useState<string>("all");
  const [selectedCompanyScale, setSelectedCompanyScale] = useState<"All" | "Startup" | "SME" | "Enterprise">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAgentModal, setActiveAgentModal] = useState<AgentMarketplaceItem | null>(null);
  const [deployedSuccess, setDeployedSuccess] = useState<string | null>(null);

  // Filter logic: Default to All Agents (no restrictive filter)
  const filteredAgents = useMemo(() => {
    const categoryConfig = CATEGORIES.find((c) => c.label === selectedCategory);
    return MARKETPLACE_AGENTS.filter((agent) => {
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "All" ||
        selectedCategory === "All Positions"
          ? true
          : categoryConfig
          ? categoryConfig.filter(agent)
          : agent.department === selectedCategory || agent.categories.includes(selectedCategory);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        agent.name.toLowerCase().includes(query) ||
        agent.roleTitle.toLowerCase().includes(query) ||
        agent.creatorName.toLowerCase().includes(query) ||
        agent.handle.toLowerCase().includes(query) ||
        agent.summary.toLowerCase().includes(query) ||
        agent.tools.some((t) => t.toLowerCase().includes(query));

      // Company scale matching
      const matchesScale =
        selectedCompanyScale === "All" ||
        (selectedCompanyScale === "Startup" && (agent.department === "Executive & Ops" || agent.department === "Customer Support & Success" || agent.department === "Sales & BizDev")) ||
        (selectedCompanyScale === "SME" && (agent.department === "Finance & Accounting" || agent.department === "Marketing & Creative" || agent.department === "HR & People")) ||
        (selectedCompanyScale === "Enterprise" && (agent.department === "Legal & Compliance" || agent.department === "Engineering & Tech" || agent.department === "Executive & Ops" || agent.department === "Finance & Accounting"));

      return matchesCategory && matchesSearch && matchesScale;
    });
  }, [selectedCategory, searchQuery, selectedCompanyScale]);

  const handleDeployAgent = (agent: AgentMarketplaceItem) => {
    setDeployedSuccess(agent.name);
    setTimeout(() => {
      setDeployedSuccess(null);
      // Navigate to active workspace
      navigate("/app");
    }, 1200);
  };

  return (
    <div className="pt-24 pb-28 min-h-screen text-[var(--text-primary)] font-sans">
      {/* Top Header Banner matching x.ai and ai-teammates style */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#ff7a00] mb-2">
              <Sparkles size={14} />
              <span>{t("marketplace.badge")}</span>
            </div>
            <h1 className="font-newsreader text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              {t("marketplace.title")}
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t("marketplace.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-white/5 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white/10 transition-colors"
            >
              <Cpu size={14} className="text-[#ff7a00]" />
              <span>{t("marketplace.activeControlPlane")}</span>
            </Link>
            <a
              href="https://github.com/agentscope-ai/QwenPaw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#ff7a00] px-4 py-2 text-xs font-medium text-black hover:bg-[#ff8f26] transition-colors shadow-[0_0_20px_rgba(255,122,0,0.3)]"
            >
              <span>{t("marketplace.buildCustomBot")}</span>
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* View Switcher: Catalog vs AI Organization Chart */}
        <div className="mt-8 flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-[var(--border-subtle)]">
            <button
              onClick={() => setActiveView("catalog")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === "catalog"
                  ? "bg-[#ff7a00] text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Bot size={14} />
              <span>{t("marketplace.catalogTab")}</span>
            </button>
            <button
              onClick={() => setActiveView("orgchart")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeView === "orgchart"
                  ? "bg-[#ff7a00] text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Users size={14} />
              <span>{t("marketplace.orgChartTab")}</span>
            </button>
          </div>

          <div className="text-xs font-mono text-neutral-400 hidden sm:block">
            {activeView === "catalog" ? "Browsing 12 Specialized AI Teammates" : "4 Department Supervision Hierarchy"}
          </div>
        </div>

        {activeView === "orgchart" ? (
          <div className="mt-8">
            <AIOrgChart />
          </div>
        ) : (
          <>
        {/* Search Bar & Category Filter Pills */}
        <div className="mt-8 space-y-5">
          {/* Search Box */}
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("marketplace.searchPlaceholder")}
              className="w-full rounded-full border border-[var(--border-subtle)] bg-white/[0.04] pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#ff7a00] focus:bg-white/[0.08] focus:outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

                    {/* Company Scale Selector (Startup / SME / Enterprise) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
            <span className="text-xs font-mono text-neutral-400 mr-1 flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-[#ff7a00]" />
              {t("marketplace.companyScale")}
            </span>
            {(["All", "Startup", "SME", "Enterprise"] as const).map((scale) => {
              const active = selectedCompanyScale === scale;
              const labels = {
                All: "All Scales",
                Startup: t("marketplace.startup"),
                SME: t("marketplace.sme"),
                Enterprise: t("marketplace.enterprise"),
              };
              return (
                <button
                  key={scale}
                  type="button"
                  onClick={() => setSelectedCompanyScale(scale)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all border cursor-pointer ${
                    active
                      ? "bg-white text-black font-semibold border-white shadow-xs"
                      : "bg-white/[0.03] text-neutral-400 hover:text-white border-white/[0.08] hover:bg-white/[0.06]"
                  }`}
                >
                  {labels[scale]}
                </button>
              );
            })}
          </div>

          {/* Categories Pill Navigation matching x.ai UI */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap cursor-pointer border ${
                    active
                      ? "bg-[#ff7a00] text-black font-semibold border-[#ff7a00] shadow-sm shadow-[#ff7a00]/25"
                      : "bg-white/[0.04] text-neutral-400 hover:bg-white/[0.08] hover:text-white border-white/[0.06]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Counts */}
        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <div>
            Showing <span className="text-white font-medium">{filteredAgents.length}</span> autonomous teammate templates
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{t("marketplace.strictEvidence")}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
              <span>{t("marketplace.multiAgentReady")}</span>
            </span>
          </div>
        </div>

        {/* Grid of Agent Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <motion.div
              layout
              key={agent.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-white dark:bg-[#0c1018]/90 hover:bg-neutral-50 dark:hover:bg-[#0e131d] border-neutral-200/90 dark:border-white/[0.08] shadow-sm dark:shadow-none hover:border-white/20 p-5 transition-all duration-200 shadow-lg hover:shadow-2xl"
            >
              <div>
                {/* Header: Geometry Avatar + Title + Department */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  <GeometricAvatar shape={agent.shape} color={agent.color} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white truncate group-hover:text-[#ff7a00] transition-colors">
                        {agent.name}
                      </h3>
                      {agent.verified && (
                        <span title="Verified Agent360 Core Template">
                          <CheckCircle2 size={14} className="text-[#ff7a00] shrink-0" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">{agent.roleTitle}</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono mt-0.5">
                      <span>by {agent.creatorName}</span>
                      <span>•</span>
                      <span className="text-neutral-400">@{agent.handle}</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-3 leading-relaxed mb-4">
                  {agent.summary}
                </p>

                {/* AI Teammates Orchestration Info */}
                <div className="rounded-lg bg-black/40 border border-[var(--border-subtle)] p-2.5 mb-4 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Workflow size={12} className="text-[#ff7a00]" />
                      <span>{agent.teamConfig.collaborationMode}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded">
                      {agent.authorityGate}
                    </span>
                  </div>
                  <div className="text-neutral-500 truncate">
                    AI Team: {agent.teamConfig.teammateRoles.join(", ")}
                  </div>
                </div>

                {/* Tools Chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {agent.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono bg-white/[0.04] border border-[var(--border-subtle)] px-2 py-0.5 rounded text-neutral-300"
                    >
                      {tool}
                    </span>
                  ))}
                  {agent.tools.length > 3 && (
                    <span className="text-[10px] font-mono text-neutral-500 px-1 py-0.5">
                      +{agent.tools.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveAgentModal(agent)}
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <BookOpen size={13} />
                  <span>{t("marketplace.inspectSpec")}</span>
                </button>

                <button
                  onClick={() => handleDeployAgent(agent)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-[#ff7a00] text-white hover:text-black px-3.5 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer active:scale-95"
                >
                  <Play size={12} fill="currentColor" />
                  <span>{t("marketplace.deployBot")}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[var(--border-subtle)] rounded-2xl mt-8">
            <Bot size={40} className="mx-auto text-neutral-600 mb-3" />
            <h3 className="text-base font-semibold text-white">{t("marketplace.noResultsTitle")}</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
              Try searching for "Finance", "Sales", "Support", "Marketing", or "HR".
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All Positions");
                setSelectedCompanyScale("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
          </>
        )}
      </div>

      {/* Detail Modal / Bot Inspector (Shows AI Teammates Backstory, Goal, Tools, and Terminal Log) */}
      <AnimatePresence>
        {activeAgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0b0e16] p-6 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveAgentModal(null)}
                className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-[var(--border-subtle)]">
                <GeometricAvatar
                  shape={activeAgentModal.shape}
                  color={activeAgentModal.color}
                  size="lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {activeAgentModal.name}
                    </h2>
                    {activeAgentModal.verified && (
                      <CheckCircle2 size={16} className="text-[#ff7a00]" />
                    )}
                  </div>
                  <div className="text-sm text-neutral-400 font-medium">
                    {activeAgentModal.roleTitle}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500 font-mono">
                    <span>Creator: {activeAgentModal.creatorName}</span>
                    <span>•</span>
                    <span className="text-[#ff7a00]">@{activeAgentModal.handle}</span>
                    <span>•</span>
                    <span>{activeAgentModal.installCount} active instances</span>
                  </div>
                </div>
              </div>

              {/* AI Teammates Specification Breakdown */}
              <div className="mt-6 space-y-6 text-xs sm:text-sm">
                {/* Goal & Backstory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="text-[11px] font-mono text-[#ff7a00] uppercase tracking-wider">
                      Role & Goal (AI Teammates Pattern)
                    </div>
                    <p className="text-neutral-200 leading-relaxed font-sans text-xs">
                      {activeAgentModal.goal}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-[var(--border-subtle)] space-y-1.5">
                    <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                      Backstory & Epistemic Stance
                    </div>
                    <p className="text-neutral-300 leading-relaxed font-sans text-xs">
                      {activeAgentModal.backstory}
                    </p>
                  </div>
                </div>

                {/* Multi-Agent AI Team Pipeline */}
                <div className="p-4 rounded-xl bg-black/40 border border-[var(--border-subtle)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white font-semibold flex items-center gap-1.5">
                      <Workflow size={14} className="text-[#ff7a00]" />
                      Multi-Agent Coordination Matrix
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Process: {activeAgentModal.teamConfig.collaborationMode}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-300">
                    <strong className="text-neutral-400 font-mono">{t("marketplace.teammateRoles")}</strong>{" "}
                    {activeAgentModal.teamConfig.teammateRoles.join(" ⇄ ")}
                  </div>
                  <div className="text-xs text-neutral-400">
                    <strong className="text-neutral-400 font-mono">{t("marketplace.expectedOutput")}</strong>{" "}
                    {activeAgentModal.teamConfig.expectedOutput}
                  </div>
                </div>

                {/* Provisioned Tools & Routines */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <div className="text-neutral-400 mb-2">{t("marketplace.allowedToolchain")}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAgentModal.tools.map((t) => (
                        <span
                          key={t}
                          className="bg-white/5 border border-[var(--border-subtle)] px-2.5 py-1 rounded text-neutral-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-400 mb-2">{t("marketplace.autonomousRoutines")}</div>
                    <ul className="space-y-1 text-neutral-300">
                      {activeAgentModal.routines.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-[#ff7a00]">↳</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Live Sandbox Execution Log Preview */}
                <div>
                  <div className="flex items-center justify-between text-neutral-400 font-mono text-xs mb-2">
                    <span className="flex items-center gap-1.5">
                      <Terminal size={13} className="text-[#ff7a00]" />
                      Authoritative Terminal Log Preview
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Strict Exit Codes Verified
                    </span>
                  </div>
                  <div className="rounded-xl border border-[var(--border-subtle)] bg-black/70 p-4 font-mono text-xs space-y-1.5 text-neutral-300">
                    {activeAgentModal.terminalPreview.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-neutral-600 select-none">{idx + 1}</span>
                        <span
                          className={
                            line.includes("pass") ||
                            line.includes("healthy") ||
                            line.includes("MATCH") ||
                            line.includes("OBSERVED")
                              ? "text-emerald-400 font-medium"
                              : "text-neutral-300"
                          }
                        >
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-neutral-400 font-mono">
                  Memory: <span className="text-white">{activeAgentModal.memoryType}</span> | Gate:{" "}
                  <span className="text-emerald-400">{activeAgentModal.authorityGate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveAgentModal(null)}
                    className="px-4 py-2 rounded-full border border-[var(--border-subtle)] text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      const agentToDeploy = activeAgentModal;
                      setActiveAgentModal(null);
                      handleDeployAgent(agentToDeploy);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-[#ff7a00] hover:bg-[#ff8f26] text-black px-6 py-2 text-xs font-semibold transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] cursor-pointer"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>{t("marketplace.deployThisTeammate")}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {deployedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-[#0a1510] px-4 py-3 text-xs text-emerald-300 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <Check size={16} className="text-emerald-400 shrink-0" />
          <span>
            Successfully deployed <strong>{deployedSuccess}</strong> to your workspace session!
          </span>
        </div>
      )}
    </div>
  );
}
