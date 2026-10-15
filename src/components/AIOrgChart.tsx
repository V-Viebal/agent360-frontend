import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Code2,
  Shield,
  Monitor,
  Terminal,
  Database,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronRight,
  GitBranch,
  TrendingUp,
  Server,
  Sparkles,
  Bot,
  Play,
} from "lucide-react";

interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  level: "c-level" | "director" | "lead" | "specialist";
  model: string;
  status: string;
  reportsTo?: string;
  directReports?: string[];
  mandate: string;
  tools: string[];
  icon: typeof Bot;
  color: string;
  bg: string;
  border: string;
}

const ORG_STRUCTURE: OrgNode[] = [
  // Executive Layer
  {
    id: "gm-executive",
    name: "Alex",
    title: "AI Chief Executive & Orchestrator",
    department: "Executive Command",
    level: "c-level",
    model: "Qwen 2.5 72B Instruct (Deep Reasoning)",
    status: "Active • Synthesizing Weekly OKR Progress",
    mandate: "Receives board/founder directives, plans multi-department roadmaps, allocates token budgets, and conducts final PR review gates.",
    tools: ["Plan Ledger Engine", "Slack/Telegram Bridge", "GitHub Org Governance", "Logto RBAC"],
    icon: Sparkles,
    color: "text-[#ff7a00]",
    bg: "bg-[#ff7a00]/15",
    border: "border-[#ff7a00]/40",
    directReports: ["eng-director", "ops-director", "sec-director", "mkt-director"],
  },

  // Directors Layer
  {
    id: "eng-director",
    name: "Devon",
    title: "VP of AI Software Engineering",
    department: "Engineering",
    level: "director",
    model: "DeepSeek-Coder 33B",
    status: "Active • Reviewing PR #42 diff",
    reportsTo: "gm-executive",
    mandate: "Decomposes engineering epics into atomic feature branches, assigns tasks to SWE specialists, and runs local test suites.",
    tools: ["Git CLI", "Docker Engine", "Postgres DDL", "Vitest Runner"],
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    directReports: ["swe-frontend", "swe-backend"],
  },
  {
    id: "ops-director",
    name: "Sentinel",
    title: "Director of Autonomous SRE & Fleet",
    department: "Operations & SRE",
    level: "director",
    model: "Qwen 2.5 14B Local",
    status: "Active • Monitoring 8 VPS nodes",
    reportsTo: "gm-executive",
    mandate: "24/7 hypervisor monitoring, out-of-memory prevention, zero-downtime rolling restarts, and WSL/9P mount pressure mitigation.",
    tools: ["SSH Bridges", "Beszel API", "Systemd D-Bus", "Coolify Ingress"],
    icon: Server,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    directReports: ["ops-db"],
  },
  {
    id: "sec-director",
    name: "Aegis",
    title: "Head of AI Security & QA Integrity",
    department: "Quality & Security",
    level: "director",
    model: "Qwen 2.5 14B + Tool Guards",
    status: "Active • Probing HTTP 403 on API routes",
    reportsTo: "gm-executive",
    mandate: "Penetration testing, automated IDOR attacks, WCAG 2.1 luminance audits, and blocking unverified completions ('No Fake Done').",
    tools: ["Chromium CDP", "OWASP Scanner", "WCAG Engine", "Pixel Diff"],
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    directReports: ["qa-accessibility"],
  },
  {
    id: "mkt-director",
    name: "Harper",
    title: "Head of AI Growth & Content Operations",
    department: "Marketing & Growth",
    level: "director",
    model: "Qwen 2.5 32B Multilingual",
    status: "Active • Scheduling product announcement",
    reportsTo: "gm-executive",
    mandate: "Analyzes social signals, crafts technical changelogs, schedules cross-platform distribution, and audits SEO/AEO indexation.",
    tools: ["Postiz API", "Search Console MCP", "Exa Research", "Analytics MCP"],
    icon: TrendingUp,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    directReports: ["mkt-social"],
  },

  // Specialists Layer
  {
    id: "swe-frontend",
    name: "Frontend Bot",
    title: "Senior UI/UX & React Specialist",
    department: "Engineering",
    level: "specialist",
    model: "DeepSeek-Coder 33B",
    status: "Active • Building Vite React SSR bundle",
    reportsTo: "eng-director",
    mandate: "Reconstructs accessible DOM, applies Tailwind 4 tokens, and eliminates CSS layout shifts.",
    tools: ["Vite", "Tailwind 4", "Playwright", "ESLint"],
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    id: "swe-backend",
    name: "Backend Bot",
    title: "Senior .NET 10 & PostgreSQL Specialist",
    department: "Engineering",
    level: "specialist",
    model: "Qwen 2.5 32B Instruct",
    status: "Active • Running EF Core migrations",
    reportsTo: "eng-director",
    mandate: "Builds DDD modular monoliths, enforces RLS policies, and generates OpenAPI 3.1 contracts.",
    tools: ["dotnet ef", "PostgreSQL", "Minimal APIs", "Logto Auth"],
    icon: Database,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    id: "ops-db",
    name: "DB Sentinel",
    title: "Database Reliability Specialist",
    department: "Operations & SRE",
    level: "specialist",
    model: "Qwen 2.5 7B Local",
    status: "Active • Replicating MinIO S3 bucket",
    reportsTo: "ops-director",
    mandate: "Automates pg_dump backups, audits index bloat, and manages MinIO disaster recovery sync.",
    tools: ["Postgres CLI", "MinIO Client", "Restic", "Gatus Probe"],
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    id: "qa-accessibility",
    name: "Vision QA Bot",
    title: "Accessibility & Pixel Diff Specialist",
    department: "Quality & Security",
    level: "specialist",
    model: "Qwen 2.5 14B Vision",
    status: "Active • Pixel settle check: delta < 0.01%",
    reportsTo: "sec-director",
    mandate: "Validates contrast ratios, audits keyboard focus rings, and detects unsettled CSS loaders.",
    tools: ["Chrome DevTools MCP", "axe-core", "Lighthouse"],
    icon: Monitor,
    color: "text-purple-400",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
  },
  {
    id: "mkt-social",
    name: "Social Bot",
    title: "Social Distribution & Postiz Specialist",
    department: "Marketing & Growth",
    level: "specialist",
    model: "Qwen 2.5 14B Instruct",
    status: "Active • Queued 4 posts on X & LinkedIn",
    reportsTo: "mkt-director",
    mandate: "Transforms release notes into engaging social snippets and coordinates publishing pipelines.",
    tools: ["Postiz MCP", "Canva API", "Discord Webhook"],
    icon: TrendingUp,
    color: "text-rose-400",
    bg: "bg-rose-500/5",
    border: "border-rose-500/20",
  },
];

export function AIOrgChart() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("gm-executive");
  const selectedNode = ORG_STRUCTURE.find((n) => n.id === selectedNodeId) || ORG_STRUCTURE[0];

  const executive = ORG_STRUCTURE.find((n) => n.level === "c-level")!;
  const directors = ORG_STRUCTURE.filter((n) => n.level === "director");
  const specialists = ORG_STRUCTURE.filter((n) => n.level === "specialist");

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-2xl border border-white/10 bg-[#0c1018] p-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#ff7a00] bg-[#ff7a00]/10 border border-[#ff7a00]/20 px-3 py-1 rounded-full mb-3">
          <GitBranch size={13} className="text-[#ff7a00]" />
          <span>Autonomous AI Workforce Structure</span>
        </div>
        <h2 className="font-newsreader text-2xl sm:text-4xl font-semibold text-white">
          AI Organization Chart
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          See how specialized AI teammates across Engineering, Operations, Security, and Marketing report progress upwards to the Lead Orchestrator with verified completion receipts.
        </p>
      </div>

      {/* Main Hierarchy Tree & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Diagram Canvas */}
        <div className="lg:col-span-8 space-y-8 bg-black/40 p-6 sm:p-8 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff7a00]/5 blur-3xl pointer-events-none -z-10" />

          {/* Level 1: C-Level Executive */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 font-semibold">
              Tier 1 • Strategic Command & Gatekeeper
            </div>
            <button
              onClick={() => setSelectedNodeId(executive.id)}
              className={`w-full max-w-md p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedNodeId === executive.id
                  ? "bg-[#ff7a00]/20 border-[#ff7a00] shadow-[0_0_25px_rgba(255,122,0,0.3)] scale-102"
                  : "bg-[#0d111a] border-white/10 hover:border-white/20 text-neutral-300"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`h-11 w-11 rounded-xl ${executive.bg} ${executive.color} border ${executive.border} flex items-center justify-center shrink-0`}>
                  <executive.icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{executive.name}</span>
                    <span className="text-[9px] font-mono uppercase bg-[#ff7a00] text-black px-1.5 py-0.2 rounded font-bold">
                      CHIEF ORCHESTRATOR
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">{executive.title}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{executive.model}</div>
                </div>
              </div>
              <ChevronRight size={16} className={`text-neutral-500 transition-transform ${selectedNodeId === executive.id ? "rotate-90 text-[#ff7a00]" : ""}`} />
            </button>
          </div>

          {/* Flow Connector */}
          <div className="flex flex-col items-center justify-center text-neutral-500 text-xs font-mono">
            <div className="h-6 w-[2px] bg-gradient-to-b from-[#ff7a00] to-white/20" />
            <div className="text-[10px] font-mono uppercase text-[#ff7a00] px-3 py-0.5 bg-white/5 rounded-full border border-white/5 my-1">
              Multi-Department ACP Delegation
            </div>
            <div className="h-6 w-[2px] bg-white/20" />
          </div>

          {/* Level 2: Department Directors */}
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest text-center mb-3 font-semibold">
              Tier 2 • Department Directors (Autonomous Planning & Review)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {directors.map((dir) => {
                const isSelected = selectedNodeId === dir.id;
                const Icon = dir.icon;
                return (
                  <button
                    key={dir.id}
                    onClick={() => setSelectedNodeId(dir.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-white/10 border-white/40 shadow-lg scale-102"
                        : "bg-[#0d111a] border-white/10 hover:border-white/20 text-neutral-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`h-8 w-8 rounded-lg ${dir.bg} ${dir.color} border ${dir.border} flex items-center justify-center`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-[9px] font-mono uppercase bg-white/5 text-neutral-400 px-1.5 py-0.5 rounded">
                          DIRECTOR
                        </span>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{dir.name}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-2 leading-tight">
                        {dir.title}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-neutral-500 truncate">
                      Dept: {dir.department}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level 3: Specialized Workers */}
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest text-center mb-3 font-semibold">
              Tier 3 • Execution Specialists (Sandboxed TDD & Operations)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {specialists.map((spec) => {
                const isSelected = selectedNodeId === spec.id;
                const Icon = spec.icon;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedNodeId(spec.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-white/15 border-white/50 shadow"
                        : "bg-[#0a0d14] border-white/5 hover:border-white/15 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`h-6 w-6 rounded-md ${spec.bg} ${spec.color} flex items-center justify-center shrink-0`}>
                        <Icon size={12} />
                      </div>
                      <span className="text-xs font-semibold text-white truncate">{spec.name}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">{spec.title}</div>
                    <div className="text-[9px] font-mono text-neutral-500 mt-2 truncate">
                      ↳ {spec.department.split(" ")[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Detail Inspector Panel */}
        <aside className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0d111a] p-6 space-y-6 sticky top-24">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded">
                {selectedNode.department}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 capitalize">
                Level: {selectedNode.level}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{selectedNode.name}</span>
              <span className="text-xs text-neutral-400 font-normal">({selectedNode.title})</span>
            </h3>
            <div className="text-xs text-neutral-400 font-mono mt-1">
              Backend Model: <span className="text-neutral-200">{selectedNode.model}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1">Live Operating Status:</span>
              <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl font-mono flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{selectedNode.status}</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1">Departmental Mandate:</span>
              <p className="text-neutral-300 font-sans leading-relaxed text-xs bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                {selectedNode.mandate}
              </p>
            </div>

            {selectedNode.directReports && (
              <div>
                <span className="text-neutral-500 font-mono block text-[11px] mb-1.5">Direct AI Subordinates:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.directReports.map((id) => {
                    const subordinate = ORG_STRUCTURE.find((n) => n.id === id);
                    if (!subordinate) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedNodeId(id)}
                        className="text-[11px] font-mono bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded text-neutral-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>{subordinate.name}</span>
                        <ArrowRight size={10} className="text-[#ff7a00]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1.5">Provisioned Toolchain:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                to="/workspace"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold py-2.5 text-xs transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] active:scale-98"
              >
                <Play size={12} fill="currentColor" />
                <span>Assign Task to {selectedNode.name}</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
