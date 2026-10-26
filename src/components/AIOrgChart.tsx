import { useTranslation } from "../i18n/LanguageContext";
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
    title: "Chief of Staff & Enterprise Orchestrator",
    department: "Executive & Ops",
    level: "c-level",
    model: "Skyer Reasoning 72B (Executive)",
    status: "Active • Synthesizing Weekly Cross-Department OKRs",
    mandate: "Coordinates strategic planning, allocates token budgets across corporate divisions, resolves cross-department blockers, and prepares board decision packs.",
    tools: ["Plan Ledger Engine", "Slack/Telegram Bridge", "Google Workspace", "Logto RBAC"],
    icon: Sparkles,
    color: "text-[#f8a87c]",
    bg: "bg-[#f8a87c]/15",
    border: "border-[#f8a87c]/40",
    directReports: ["fin-director", "sales-director", "cx-director", "hr-director"],
  },

  // Directors Layer (Corporate Departments)
  {
    id: "fin-director",
    name: "Devon",
    title: "VP of Corporate Finance & Controller",
    department: "Finance & Accounting",
    level: "director",
    model: "Skyer Finance 32B (Deterministic)",
    status: "Active • Three-way matching 48 vendor invoices",
    reportsTo: "gm-executive",
    mandate: "Oversees general ledger reconciliation, audit compliance (TT99/TT133), treasury runway, and zero-discrepancy accounts payable.",
    tools: ["ERPCore Financials", "Bank Reconciliation API", "PayOS Engine", "Excel/CSV AST"],
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    directReports: ["fin-audit", "legal-counsel"],
  },
  {
    id: "sales-director",
    name: "Marcus",
    title: "VP of Enterprise Revenue & BizDev",
    department: "Sales & BizDev",
    level: "director",
    model: "Skyer Revenue 32B",
    status: "Active • Qualifying 42 enterprise accounts",
    reportsTo: "gm-executive",
    mandate: "Drives B2B pipeline velocity, qualifies inbound enterprise prospects, drafts commercial proposals, and analyzes competitive contract renewal cycles.",
    tools: ["Salesforce/HubSpot Bridge", "LinkedIn Graph", "Exa Web Search", "Email Sequencer"],
    icon: TrendingUp,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    directReports: ["sales-ae"],
  },
  {
    id: "cx-director",
    name: "Elena",
    title: "Head of Customer Success & Support",
    department: "Customer Support & Success",
    level: "director",
    model: "Skyer Support 14B Multilingual",
    status: "Active • Queue cleared, CSAT: 98.4%",
    reportsTo: "gm-executive",
    mandate: "Maintains 24/7 SLA resolution, triage tickets under 30 seconds, analyzes customer sentiment, and escalates platform incidents with full context.",
    tools: ["Zendesk / Intercom API", "Knowledge Base MCP", "Sentiment Engine", "Slack Alerts"],
    icon: Shield,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    directReports: ["cx-triage"],
  },
  {
    id: "hr-director",
    name: "Harper",
    title: "Head of People & Workplace Culture",
    department: "HR & People",
    level: "director",
    model: "Skyer People 32B",
    status: "Active • Screening 25 candidate dossiers",
    reportsTo: "gm-executive",
    mandate: "Streamlines recruitment screening, automated onboarding schedules (30-60-90), employee pulse checks, and workplace handbook governance.",
    tools: ["Greenhouse / Lever Bridge", "Resume Parser", "Calendar Orchestrator", "Employee Handbook KB"],
    icon: Users,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    directReports: ["it-ops"],
  },

  // Specialists Layer (Execution Colleagues)
  {
    id: "fin-audit",
    name: "Invoice Auditor",
    title: "Three-Way Matching & Tax Specialist",
    department: "Finance & Accounting",
    level: "specialist",
    model: "Skyer Deterministic Math 14B",
    status: "Active • Matched PO-2026-891 ($0.00 discrepancy)",
    reportsTo: "fin-director",
    mandate: "Validates PO against goods receipt notes and tax invoices, generating compliant Mẫu 02-VT vouchers.",
    tools: ["ERPCore", "Tax TT99 Validator", "CSV Pipeline"],
    icon: Database,
    color: "text-emerald-400",
    bg: "bg-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    id: "legal-counsel",
    name: "Contract Counsel",
    title: "Corporate Agreements & Compliance Specialist",
    department: "Legal & Compliance",
    level: "specialist",
    model: "Skyer Legal 32B",
    status: "Active • Redlining SaaS Master Agreement v4.2",
    reportsTo: "fin-director",
    mandate: "Scans vendor NDAs/MSAs, flags uncapped liability and indemnity clauses, and drafts signature-ready appendices.",
    tools: ["Contract Diff Engine", "NDA Redline AST", "DocuSign Bridge"],
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-500/5",
    border: "border-purple-500/20",
  },
  {
    id: "sales-ae",
    name: "Outbound Specialist",
    title: "B2B Lead Enrichment & Proposal Builder",
    department: "Sales & BizDev",
    level: "specialist",
    model: "Skyer Revenue 14B",
    status: "Active • Staged 42 bespoke outreach emails",
    reportsTo: "sales-director",
    mandate: "Enriches accounts with stakeholder intelligence and crafts customized ROI calculators for enterprise prospects.",
    tools: ["Apollo MCP", "LinkedIn Graph", "Gmail API"],
    icon: TrendingUp,
    color: "text-cyan-400",
    bg: "bg-cyan-500/5",
    border: "border-cyan-500/20",
  },
  {
    id: "cx-triage",
    name: "Support Specialist",
    title: "Technical Support & Troubleshooting Agent",
    department: "Customer Support & Success",
    level: "specialist",
    model: "Skyer Support 14B",
    status: "Active • First response latency: 22s",
    reportsTo: "cx-director",
    mandate: "Diagnoses customer bugs against API documentation and provides step-by-step verified resolutions.",
    tools: ["Zendesk API", "Knowledge Base MCP", "DOM Inspector"],
    icon: Monitor,
    color: "text-blue-400",
    bg: "bg-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    id: "it-ops",
    name: "Workplace IT Specialist",
    title: "SSO Identity & Cloud Infrastructure Agent",
    department: "Engineering & Tech",
    level: "specialist",
    model: "Skyer Systems 14B",
    status: "Active • Provisioned 3 new onboarding accounts",
    reportsTo: "hr-director",
    mandate: "Sets up Google Workspace, Logto SSO credentials, VPN keys, and monitors internal tool uptime 24/7.",
    tools: ["Logto SSO", "Google Admin CLI", "Docker Engine", "Gatus Status"],
    icon: Server,
    color: "text-[#f8a87c]",
    bg: "bg-[#f8a87c]/5",
    border: "border-[#f8a87c]/20",
  },
];

export function AIOrgChart() {
  const { t } = useTranslation();
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
          "[cluster:ready] 10/10 AI Teammate containers healthy and bound to Skyer ACP network. Mission ready."
        ]);
      }
    }, 400);
  };

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [scenarioFilter, setScenarioFilter] = useState<"eng-sre" | "mkt-exec" | "sec-audit">("eng-sre");

  const SCENARIO_CATALOG = {
    "eng-sre": {
      name: "Finance ⇄ Executive Burn Rate & Closing",
      messages: [
        {
          from: "Devon (VP Finance)",
          to: "Alex (Chief of Staff)",
          time: "09:15:02 AM",
          text: "Monthly ledger reconciliation completed. 48 supplier invoices matched with $0.00 discrepancy. Cash runway verified at 18.4 months.",
          receipt: "TT99 Voucher #402: RECONCILED",
          type: "proposal"
        },
        {
          from: "Alex (Chief of Staff)",
          to: "Devon (VP Finance)",
          time: "09:15:08 AM",
          text: "Audited against Q4 board budget allocation. Runway buffer meets governance threshold. Approved to disburse vendor payouts.",
          receipt: "Sign-off: Financial Ledger Signed",
          type: "approval"
        },
        {
          from: "Devon (VP Finance)",
          to: "Alex (Chief of Staff)",
          time: "09:15:14 AM",
          text: "Dispatched automated payment schedule via PayOS batch API. Bank confirmation receipts archived.",
          receipt: "Disbursement: 100% EXECUTED",
          type: "final"
        }
      ]
    },
    "mkt-exec": {
      name: "Sales ⇄ Legal Deal Redline & Proposal",
      messages: [
        {
          from: "Marcus (VP Revenue)",
          to: "Legal Counsel Bot",
          time: "02:30:10 PM",
          text: "Enterprise prospect ACME Logistics requested custom SLA terms on indirect liability caps. Need redline review for $48k ARR contract.",
          receipt: "Contract ID: #MSA-ACME-2026",
          type: "proposal"
        },
        {
          from: "Legal Counsel Bot",
          to: "Marcus (VP Revenue)",
          time: "02:30:15 PM",
          text: "Redline generated. Replaced unlimited liability with standard 12-month trailing revenue cap. Added mutual IP protection.",
          receipt: "Legal Review: PASSED (Zero High Risk)",
          type: "verification"
        },
        {
          from: "Marcus (VP Revenue)",
          to: "Alex (Chief of Staff)",
          time: "02:30:20 PM",
          text: "Clean redline delivered to ACME legal team. Signature invitation dispatched via DocuSign bridge.",
          receipt: "DocuSign Envelope #9921 Active",
          type: "final"
        }
      ]
    },
    "sec-audit": {
      name: "HR ⇄ IT Onboarding & Access Provisioning",
      messages: [
        {
          from: "Harper (Head of People)",
          to: "Workplace IT Bot",
          time: "11:05:00 AM",
          text: "New Senior Account Executive starting Monday. Signed contract on file. Requesting corporate SSO and hardware provisioning.",
          receipt: "Employee Onboarding Pack #EMP-884",
          type: "proposal"
        },
        {
          from: "Workplace IT Bot",
          to: "Harper (Head of People)",
          time: "11:05:04 AM",
          text: "Google Workspace identity created with forced 2FA. Assigned Logto RBAC groups (Sales & CRM access). VPN key minted.",
          receipt: "RBAC Provisioning: ACTIVE (2FA Enabled)",
          type: "verification"
        },
        {
          from: "Harper (Head of People)",
          to: "Alex (Chief of Staff)",
          time: "11:05:08 AM",
          text: "Onboarding checklist 100% complete in 8 seconds. Welcome credentials package delivered securely.",
          receipt: "Receipt: HR-ONBOARD-VERIFIED",
          type: "final"
        }
      ]
    }
  };

  const activeScenario = SCENARIO_CATALOG[scenarioFilter];

  const handleDownloadAuditJson = () => {
    const payload = {
      auditTimestamp: new Date().toISOString(),
      governanceModel: "AntaresOS / Skyer v2.2.1",
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
        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/20 px-3 py-1 rounded-full mb-3">
          <GitBranch size={13} className="text-[#f8a87c]" />
          <span>{t("orgChart.badge")}</span>
        </div>
        <h2 className="font-newsreader text-2xl sm:text-4xl font-semibold text-white">
          {t("orgChart.title")}
        </h2>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handleStartBatchDeploy}
            className="inline-flex items-center gap-2 rounded-full bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold px-5 py-2 text-xs transition-all shadow-[0_0_20px_rgba(248,168,124,0.35)] cursor-pointer active:scale-95"
          >
            <Rocket size={14} />
            <span>{t("orgChart.deployAll")}</span>
          </button>
        </div>
      </div>

      {/* Main Hierarchy Tree & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Diagram Canvas */}
        <div className="lg:col-span-8 space-y-8 bg-black/40 p-6 sm:p-8 rounded-2xl border border-white/[0.08] relative overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#f8a87c]/5 blur-3xl pointer-events-none -z-10" />

          {/* Level 1: C-Level Executive */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 font-semibold">
              {t("orgChart.tier1")}
            </div>
            <button
              onClick={() => setSelectedNodeId(executive.id)}
              className={`w-full max-w-md p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedNodeId === executive.id
                  ? "bg-[#f8a87c]/20 border-[#f8a87c] shadow-[0_0_25px_rgba(248,168,124,0.3)] scale-102"
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
                    <span className="text-[9px] font-mono uppercase bg-[#f8a87c] text-black px-1.5 py-0.2 rounded font-bold">
                      CHIEF ORCHESTRATOR
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 font-medium">{executive.title}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{executive.model}</div>
                </div>
              </div>
              <ChevronRight size={16} className={`text-neutral-500 transition-transform ${selectedNodeId === executive.id ? "rotate-90 text-[#f8a87c]" : ""}`} />
            </button>
          </div>

          {/* Flow Connector */}
          <div className="flex flex-col items-center justify-center text-neutral-500 text-xs font-mono">
            <div className="h-6 w-[2px] bg-gradient-to-b from-[#f8a87c] to-white/20" />
            <div className="text-[10px] font-mono uppercase text-[#f8a87c] px-3 py-0.5 bg-white/5 rounded-full border border-white/5 my-1">
              {t("orgChart.delegationFlow")}
            </div>
            <div className="h-6 w-[2px] bg-white/20" />
          </div>

          {/* Level 2: Department Directors */}
          <div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest text-center mb-3 font-semibold">
              {t("orgChart.tier2")}
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
              {t("orgChart.tier3")}
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
                <Radio size={14} className="text-[#f8a87c] animate-pulse" />
                <span className="text-xs font-mono font-semibold text-white">
                  {t("orgChart.interDeptComm")}
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
                        ? "bg-[#f8a87c] text-black font-semibold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {key === "eng-sre" ? "Finance ⇄ Exec" : key === "mkt-exec" ? "Sales ⇄ Legal" : "HR ⇄ IT Ops"}
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
                  <span>{t("orgChart.downloadAudit")}</span>
                </button>
                <button
                  onClick={handleStartSimulation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8a87c]/15 hover:bg-[#f8a87c]/25 border border-[#f8a87c]/30 text-[#f8a87c] text-xs font-mono transition-all cursor-pointer active:scale-95"
                >
                  <MessageSquare size={12} />
                  <span>{isSimulating ? t("orgChart.restartScenario") : t("orgChart.runScenario")}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-400">
              {t("orgChart.activeScenario")} <span className="text-[#f8a87c] font-semibold">{activeScenario.name}</span>
            </div>

            {isSimulating ? (
              <div className="space-y-2 bg-[#090c12] p-4 rounded-xl border border-white/10 font-mono text-xs">
                {activeScenario.messages.slice(0, simulationStep + 1).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border transition-all ${
                      msg.type === "approval"
                        ? "bg-[#f8a87c]/10 border-[#f8a87c]/30 text-neutral-200"
                        : msg.type === "verification"
                        ? "bg-purple-500/10 border-purple-500/30 text-neutral-200"
                        : msg.type === "final"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-neutral-200"
                        : "bg-blue-500/10 border-blue-500/30 text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span className="text-[#f8a87c]">{msg.from}</span>
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
                {t("orgChart.clickRunDesc")}
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Inspector Panel */}
        <aside className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0d111a] p-6 space-y-6 sticky top-24">
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#f8a87c] bg-[#f8a87c]/10 px-2 py-0.5 rounded">
                {selectedNode.department}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 capitalize">
                {t("orgChart.levelLabel")} {selectedNode.level}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{selectedNode.name}</span>
              <span className="text-xs text-neutral-400 font-normal">({selectedNode.title})</span>
            </h3>
            <div className="text-xs text-neutral-400 font-mono mt-1">
              {t("orgChart.modelLabel")} <span className="text-neutral-200">{selectedNode.model}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1">{t("orgChart.liveStatus")}</span>
              <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl font-mono flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{selectedNode.status}</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1">{t("orgChart.mandate")}</span>
              <p className="text-neutral-300 font-sans leading-relaxed text-xs bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                {selectedNode.mandate}
              </p>
            </div>

            {selectedNode.directReports && (
              <div>
                <span className="text-neutral-500 font-mono block text-[11px] mb-1.5">{t("orgChart.directReports")}</span>
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
                        <ArrowRight size={10} className="text-[#f8a87c]" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1.5">{t("orgChart.provisionedTools")}</span>
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold py-2.5 text-xs transition-all shadow-[0_0_20px_rgba(248,168,124,0.3)] active:scale-98"
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
                <div className="h-9 w-9 rounded-xl bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c]">
                  <Rocket size={18} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-white">{t("orgChart.clusterBatch")}</h4>
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
                <span className="text-neutral-400">{t("orgChart.deployProgress")}</span>
                <span className="text-[#f8a87c] font-bold">{batchProgress} / {ORG_STRUCTURE.length} Nodes</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#f8a87c] to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(batchProgress / ORG_STRUCTURE.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Terminal Container Stream */}
            <div className="space-y-1.5 bg-black/70 p-4 rounded-xl border border-white/10 font-mono text-xs max-h-60 overflow-y-auto">
              <div className="text-neutral-500 text-[11px] pb-2 border-b border-white/5 flex items-center justify-between">
                <span>{t("orgChart.kernelStream")}</span>
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
                    <span>{t("orgChart.allActive")}</span>
                  </span>
                ) : (
                  <span>Estimated remaining time: ~4s</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {batchComplete && (
                  <Link
                    to="/app"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold text-xs transition-all shadow-md"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>{t("orgChart.enterControl")}</span>
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
