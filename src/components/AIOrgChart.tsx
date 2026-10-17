import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Rocket,
  X,
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
  MessageSquare,
  Radio,
  RotateCcw,
  Check,
  Download,
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
    title: "Director of Autonomous SRE & Systems",
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
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [isBatchDeploying, setIsBatchDeploying] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [batchComplete, setBatchComplete] = useState(false);

  const handleStartBatchDeploy = () => {
    setShowBatchModal(true);
    setIsBatchDeploying(true);
    setBatchProgress(0);
    setBatchLogs([]);
    setBatchComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      if (current < ORG_STRUCTURE.length) {
        const agent = ORG_STRUCTURE[current];
        setBatchLogs((prev) => [
          ...prev,
          `[kernel:deploy] Provisioning container for ${agent.name} (${agent.title}) -> volume /app/working/${agent.id}... OK (HTTP 200)`
        ]);
        current++;
        setBatchProgress(current);
      } else {
        clearInterval(interval);
        setIsBatchDeploying(false);
        setBatchComplete(true);
        setBatchLogs((prev) => [
          ...prev,
          "[cluster:ready] 10/10 AI Teammate containers healthy and bound to Agent360 ACP network. Mission ready."
        ]);
      }
    }, 400);
  };

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [scenarioFilter, setScenarioFilter] = useState<"eng-sre" | "mkt-exec" | "sec-audit">("eng-sre");

  const SCENARIO_CATALOG = {
    "eng-sre": {
      name: "Engineering ⇄ SRE Incident Fix",
      messages: [
        {
          from: "Devon (VP Engineering)",
          to: "Alex (Chief Orchestrator)",
          time: "10:14:02 AM",
          text: "Hotfix PR #42 applied by SWE Worker. Multi-tenant RLS isolation passed 14/14 unit tests. Requesting sign-off.",
          receipt: "SHA256: 9ca84cf... PASS",
          type: "proposal"
        },
        {
          from: "Aegis (Head of QA)",
          to: "Alex (Chief Orchestrator)",
          time: "10:14:05 AM",
          text: "Security audit verified. IDOR exploit blocked with HTTP 403 Forbidden across 48 API routes. 0 data leaks.",
          receipt: "Audit: OBSERVED (WCAG + OWASP pass)",
          type: "verification"
        },
        {
          from: "Alex (Chief Orchestrator)",
          to: "Devon & Sentinel",
          time: "10:14:08 AM",
          text: "Approved. All cryptographic receipts verified. Merging PR #42 and dispatching SRE Sentinel for canary rollout.",
          receipt: "Sign-off: Plan Ledger Rev #5 Committed",
          type: "approval"
        },
        {
          from: "Sentinel (Director SRE)",
          to: "Alex (Chief Orchestrator)",
          time: "10:14:12 AM",
          text: "Canary container healthy on Node 6th. Memory pressure 42%, zero downtime. Mission accomplished.",
          receipt: "System Health: 100% UP (healthy)",
          type: "final"
        }
      ]
    },
    "mkt-exec": {
      name: "Marketing ⇄ Executive Product Launch",
      messages: [
        {
          from: "Harper (Head of Growth)",
          to: "Alex (Chief Orchestrator)",
          time: "02:30:10 PM",
          text: "Changelog draft ready for Agent360 v2.2.1. Social distribution queued on Postiz MCP across X, LinkedIn, and Discord.",
          receipt: "Draft ID: #MKT-890 (Validated)",
          type: "proposal"
        },
        {
          from: "Alex (Chief Orchestrator)",
          to: "Harper (Head of Growth)",
          time: "02:30:14 PM",
          text: "Reviewed positioning: ensure tone highlights 'No Fake Done' and zero host mutation guarantees. Authorized to publish.",
          receipt: "Policy Rev #12: Content Released",
          type: "approval"
        },
        {
          from: "Harper (Head of Growth)",
          to: "Alex (Chief Orchestrator)",
          time: "02:30:18 PM",
          text: "Dispatched to 3 platforms via Postiz API. Search Console sitemap ping HTTP 200 OK registered.",
          receipt: "Live Impressions: Tracking active",
          type: "final"
        }
      ]
    },
    "sec-audit": {
      name: "Security ⇄ Kernel Vulnerability Scan",
      messages: [
        {
          from: "Aegis (Head of QA)",
          to: "Sentinel (Director SRE)",
          time: "11:05:00 AM",
          text: "Automated scan detected open debug port 9222 on worker container sidecar. Flagging policy violation.",
          receipt: "CVE Audit: Port 9222 exposed to bridge",
          type: "verification"
        },
        {
          from: "Sentinel (Director SRE)",
          to: "Aegis (Head of QA)",
          time: "11:05:04 AM",
          text: "Enforcing rootless network isolation: bound CDP port strictly to loopback 127.0.0.1. Re-checking firewall.",
          receipt: "IPTables: Loopback binding confirmed",
          type: "proposal"
        },
        {
          from: "Alex (Chief Orchestrator)",
          to: "Aegis & Sentinel",
          time: "11:05:08 AM",
          text: "Incident closed in 8 seconds. Cryptographic audit trail archived to MinIO S3 immutable bucket.",
          receipt: "Receipt: SEC-CLOSE-9921 VERIFIED",
          type: "final"
        }
      ]
    }
  };

  const activeScenario = SCENARIO_CATALOG[scenarioFilter];

  const handleDownloadAuditJson = () => {
    const payload = {
      auditTimestamp: new Date().toISOString(),
      governanceModel: "AntaresOS / Agent360 v2.2.1",
      departmentScenario: scenarioFilter,
      scenarioName: activeScenario.name,
      complianceStandard: "SOC2-CC6.1 / ISO27001-A.12.4.1 (Immutable Log Trace)",
      verificationStatus: "OBSERVED (Zero Fake Done)",
      messages: activeScenario.messages.map((m, idx) => ({
        step: idx + 1,
        sender: m.from,
        recipient: m.to,
        timestamp: m.time,
        content: m.text,
        cryptographicReceipt: m.receipt,
        decisionType: m.type
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `agent360-audit-${scenarioFilter}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < activeScenario.messages.length) {
        setSimulationStep(step);
      } else {
        clearInterval(interval);
      }
    }, 1800);
  };

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

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleStartBatchDeploy}
            className="inline-flex items-center gap-2 rounded-full bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold px-5 py-2 text-xs transition-all shadow-[0_0_20px_rgba(255,122,0,0.35)] cursor-pointer active:scale-95"
          >
            <Rocket size={14} />
            <span>One-Click Deploy Entire AI Workforce</span>
          </button>
        </div>
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

          {/* Inter-Department Live Simulation Console */}
          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-[#ff7a00] animate-pulse" />
                <span className="text-xs font-mono font-semibold text-white">
                  Inter-Department Autonomous Communication (ACP Channel)
                </span>
              </div>

              {/* Scenario Filter Pills */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10">
                {(["eng-sre", "mkt-exec", "sec-audit"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setScenarioFilter(key);
                      setIsSimulating(false);
                      setSimulationStep(0);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                      scenarioFilter === key
                        ? "bg-[#ff7a00] text-black font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {key === "eng-sre" ? "Engineering ⇄ SRE" : key === "mkt-exec" ? "Marketing ⇄ Exec" : "Security ⇄ Systems"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAuditJson}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                  title="Download SOC2/ISO audit log as JSON"
                >
                  <Download size={12} />
                  <span>Download Audit JSON</span>
                </button>
                <button
                  onClick={handleStartSimulation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 border border-[#ff7a00]/30 text-[#ff7a00] text-xs font-mono transition-all cursor-pointer active:scale-95"
                >
                  <MessageSquare size={12} />
                  <span>{isSimulating ? "Restart Scenario" : "Run Scenario"}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              Active Scenario: <span className="text-[#ff7a00] font-semibold">{activeScenario.name}</span>
            </div>

            {isSimulating ? (
              <div className="space-y-2 bg-[#090c12] p-4 rounded-xl border border-white/10 font-mono text-xs">
                {activeScenario.messages.slice(0, simulationStep + 1).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border transition-all ${
                      msg.type === "approval"
                        ? "bg-[#ff7a00]/10 border-[#ff7a00]/30 text-neutral-200"
                        : msg.type === "verification"
                        ? "bg-purple-500/10 border-purple-500/30 text-neutral-200"
                        : msg.type === "final"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-neutral-200"
                        : "bg-blue-500/10 border-blue-500/30 text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span className="text-[#ff7a00]">{msg.from}</span>
                        <span className="text-neutral-500">➔</span>
                        <span>{msg.to}</span>
                      </span>
                      <span className="text-neutral-500 text-[10px]">{msg.time}</span>
                    </div>
                    <p className="text-xs font-sans text-neutral-300 leading-relaxed mb-1.5">
                      {msg.text}
                    </p>
                    <div className="text-[10px] font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded inline-block">
                      Receipt: {msg.receipt}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#090c12] border border-white/5 p-4 rounded-xl text-center text-xs text-neutral-500 font-mono">
                Click "Run Scenario" to view the multi-agent execution turn for <strong className="text-neutral-300">{activeScenario.name}</strong>.
              </div>
            )}
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
                to="/app"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold py-2.5 text-xs transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] active:scale-98"
              >
                <Play size={12} fill="currentColor" />
                <span>Assign Task to {selectedNode.name}</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* Batch Deployment Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0d111a] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#ff7a00]/15 border border-[#ff7a00]/30 flex items-center justify-center text-[#ff7a00]">
                  <Rocket size={18} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">Cluster Batch Container Deployment</h4>
                  <p className="text-xs text-neutral-400 font-mono">Provisioning 10 Autonomous AI Teammates to Coolify / Docker</p>
                </div>
              </div>
              {!isBatchDeploying && (
                <button
                  onClick={() => setShowBatchModal(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">Deployment Progress:</span>
                <span className="text-[#ff7a00] font-bold">{batchProgress} / {ORG_STRUCTURE.length} Nodes</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff7a00] to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(batchProgress / ORG_STRUCTURE.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Terminal Container Stream */}
            <div className="space-y-1.5 bg-black/70 p-4 rounded-xl border border-white/10 font-mono text-xs max-h-60 overflow-y-auto">
              <div className="text-neutral-500 text-[11px] pb-2 border-b border-white/5 flex items-center justify-between">
                <span>Kernel Orchestration Stream</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${isBatchDeploying ? "animate-pulse" : ""}`} />
                  <span>{isBatchDeploying ? "Spinning up..." : "Cluster Live"}</span>
                </span>
              </div>
              {batchLogs.map((log, idx) => (
                <div key={idx} className="flex items-start text-[11px] leading-relaxed">
                  <span className="text-neutral-600 mr-2 select-none">{idx + 1}</span>
                  <span className={log.includes("OK") || log.includes("ready") ? "text-emerald-400 font-medium" : "text-neutral-300"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-neutral-400 font-mono">
                {batchComplete ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>All 10 containers healthy & active</span>
                  </span>
                ) : (
                  <span>Estimated remaining time: ~4s</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {batchComplete && (
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold text-xs transition-all shadow-md"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>Enter Control Plane</span>
                  </Link>
                )}
                <button
                  onClick={() => setShowBatchModal(false)}
                  disabled={isBatchDeploying}
                  className="px-4 py-2 rounded-xl border border-white/10 text-neutral-300 hover:text-white text-xs disabled:opacity-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
