import { initiateSkyerSignIn } from "../services/pkceAuth";
import { authConfig } from "../config/authConfig";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { LandingCommandPalette, appTaskUrl } from "../components/LandingCommandPalette";
import { useTranslation } from "../i18n/LanguageContext";
import {
  Terminal,
  ArrowRight,
  Shield,
  Check,
  CheckCircle2,
  ChevronDown,
  Monitor,
  Layers,
  Bot,
  Sparkles,
  Server,
  Cpu,
  Workflow,
  Globe,
  ExternalLink,
  Zap,
  Play,
  RotateCcw,
  Lock,
  Database,
  FileText,
  Search,
  Activity,
  Network,
  Clock,
  Eye,
  MousePointerClick,
  GitBranch,
  HardDrive,
} from "lucide-react";

// Corporate Department AI Employee Roles - Ultra-lean copy & interactive visual canvas specs
const AGENT_ROLES = [
  {
    id: "cos",
    title: "Chief of Staff",
    tag: "Executive & Ops",
    category: "Executive",
    icon: Sparkles,
    headline: "Synthesizes cross-department OKRs & board packs.",
    promptExample: "Synthesize weekly KPI reports from Sales, CX, and Finance, flagging bottlenecks.",
    tools: ["Google Workspace", "Outline KB", "Telegram Bridge", "Plan Ledger"],
    metrics: [
      { label: "KPIs Synced", value: "28/28", status: "pass" },
      { label: "Runway", value: "18.4 mo", status: "neutral" },
      { label: "Bottlenecks", value: "1 Flagged", status: "warn" },
    ],
    previewData: {
      file: "executive-briefing // Q4 Board Sync",
      action: "OKR Synthesis",
      steps: [
        { label: "Ingest Dept Metrics", detail: "Sales, CX, Finance synced", time: "0.4s", icon: "db" },
        { label: "Burn Rate vs ARR", detail: "Runway verified: 18.4 mo", time: "0.8s", icon: "chart" },
        { label: "Bottleneck Radar", detail: "Legal SLA delay flagged", time: "1.1s", icon: "warn" },
        { label: "Board Pack Ready", detail: "3-page PDF + citations", time: "1.5s", icon: "check" },
      ],
      logs: [
        { time: "08:30:02", text: "Ingesting weekly departmental progress reports (Sales, CX, Finance)", ok: true },
        { time: "08:30:08", text: "Reconciling ARR growth target with operational burn rate: Runway 18.4 mo", ok: true },
        { time: "08:30:14", text: "Flagged 1 bottleneck: Enterprise procurement turnaround in Legal", ok: false },
        { time: "08:30:21", text: "Generated 3-page Executive Decision Pack with citation receipts", ok: true },
      ],
    },
  },
  {
    id: "finance",
    title: "Financial Controller",
    tag: "Finance & ERP",
    category: "Finance",
    icon: Server,
    headline: "3-way PO/Invoice matching & TT99 tax vouchers.",
    promptExample: "Reconcile 48 supplier invoices against PO records and stage TT99 payment vouchers.",
    tools: ["ERPNext", "Bank Feed API", "Excel AST", "PayOS"],
    metrics: [
      { label: "Invoices", value: "48/48 Match", status: "pass" },
      { label: "Variance", value: "$0.00", status: "pass" },
      { label: "Tax Standard", value: "TT99 02-VT", status: "neutral" },
    ],
    previewData: {
      file: "general-ledger // Cycle W42",
      action: "3-Way Matching",
      steps: [
        { label: "Scan 48 Invoices", detail: "Matched against PO & GRN", time: "0.6s", icon: "search" },
        { label: "Variance Audit", detail: "0.00 VND discrepancy", time: "1.0s", icon: "check" },
        { label: "TT99 Voucher Gen", detail: "Mẫu 02-VT compiled", time: "1.4s", icon: "doc" },
        { label: "CFO Sign-Off Gate", detail: "$148,290 staged", time: "1.8s", icon: "lock" },
      ],
      logs: [
        { time: "09:00:10", text: "Scanning 48 incoming vendor invoices against PO-2026 and GRN records", ok: true },
        { time: "09:00:15", text: "Discrepancy audit: 48/48 invoices matched within 0.00 VND tolerance", ok: true },
        { time: "09:00:22", text: "Generated tax compliance voucher Mẫu 02-VT (TT99 standard)", ok: true },
        { time: "09:00:28", text: "Voucher pack staged for CFO cryptographic approval", ok: true },
      ],
    },
  },
  {
    id: "sales",
    title: "B2B Sales Executive",
    tag: "Revenue & CRM",
    category: "Sales",
    icon: Zap,
    headline: "Enriches leads, maps C-level buyers & drafts pitches.",
    promptExample: "Screen 120 SEA logistics accounts and stage personalized outreach decks in CRM.",
    tools: ["HubSpot CRM", "LinkedIn Graph", "Exa Search", "Mail Sequencer"],
    metrics: [
      { label: "Qualified", value: "42 Accounts", status: "pass" },
      { label: "Intent Score", value: "94% Match", status: "pass" },
      { label: "Staged ARR", value: "$48,000", status: "neutral" },
    ],
    previewData: {
      file: "pipeline-engine // Outbound SEA",
      action: "Lead Enrichment",
      steps: [
        { label: "Screen 120 Accounts", detail: "SEA logistics segment", time: "0.5s", icon: "search" },
        { label: "Buyer Signal Filter", detail: "42 VP Supply Chain found", time: "0.9s", icon: "db" },
        { label: "Bespoke Deck Gen", detail: "Tailored ROI & case study", time: "1.3s", icon: "doc" },
        { label: "CRM Deal Staged", detail: "$48k ARR pipeline synced", time: "1.7s", icon: "check" },
      ],
      logs: [
        { time: "09:30:11", text: "Screened 120 target enterprise logistics accounts via verified public data", ok: true },
        { time: "09:30:19", text: "Filtered 42 accounts with active Head of Supply Chain procurement signals", ok: true },
        { time: "09:30:28", text: "Drafted hyper-personalized demo pitches in company brand tone", ok: true },
        { time: "09:30:35", text: "Created deal opportunities in CRM: $48,000 potential ARR staged", ok: true },
      ],
    },
  },
  {
    id: "cx",
    title: "Customer Success",
    tag: "24/7 Support",
    category: "Support",
    icon: Shield,
    headline: "Autonomous ticket triage & root-cause resolution.",
    promptExample: "Triage Zendesk queue, resolve billing inquiries, and debug webhook timeouts.",
    tools: ["Zendesk CDP", "Outline KB", "Log Inspector", "Mailer"],
    metrics: [
      { label: "Cleared", value: "14/14 Tickets", status: "pass" },
      { label: "Response SLA", value: "22 sec", status: "pass" },
      { label: "CSAT Score", value: "98.4%", status: "neutral" },
    ],
    previewData: {
      file: "support-queue // Zendesk Live",
      action: "Zero-Backlog Triage",
      steps: [
        { label: "Ingest 14 Tickets", detail: "Billing & API webhooks", time: "0.3s", icon: "db" },
        { label: "KB Grounding", detail: "Matched retry spec v2.4", time: "0.7s", icon: "search" },
        { label: "Dispatch Fixes", detail: "Code snippet + receipt", time: "1.2s", icon: "doc" },
        { label: "Queue Zeroed", detail: "5/5 CSAT verified", time: "1.5s", icon: "check" },
      ],
      logs: [
        { time: "10:20:01", text: "Ingested 14 incoming support inquiries across web and mobile apps", ok: true },
        { time: "10:20:06", text: "Ticket #8821 (Billing receipt request): Auto-generated and dispatched", ok: true },
        { time: "10:20:12", text: "Ticket #8824 (API webhook timeout): Diagnosed retry header mismatch", ok: true },
        { time: "10:20:22", text: "CSAT satisfaction score confirmed: 5/5 stars (Queue cleared)", ok: true },
      ],
    },
  },
  {
    id: "hr",
    title: "HR & Talent Partner",
    tag: "People Ops",
    category: "HR",
    icon: Layers,
    headline: "Screens CVs, books interviews & runs onboarding.",
    promptExample: "Screen 25 Operations Director CVs and schedule top 4 interviews.",
    tools: ["Greenhouse", "CV AST Parser", "Calendar MCP", "Handbook KB"],
    metrics: [
      { label: "Screened", value: "25 Dossiers", status: "neutral" },
      { label: "Shortlisted", value: "Top 4 (92%+)", status: "pass" },
      { label: "Time Saved", value: "14.5 hrs", status: "pass" },
    ],
    previewData: {
      file: "talent-hub // Q4 Hiring",
      action: "CV Competency Match",
      steps: [
        { label: "Parse 25 Resumes", detail: "Ops Director role", time: "0.4s", icon: "doc" },
        { label: "Competency Score", detail: "ERP + Multi-cloud rubric", time: "0.9s", icon: "chart" },
        { label: "Shortlist Top 4", detail: "92%+ objective match", time: "1.3s", icon: "check" },
        { label: "Calendar Sync", detail: "Invites & scorecards sent", time: "1.6s", icon: "check" },
      ],
      logs: [
        { time: "10:05:02", text: "Parsed 25 applicant CVs for Operations Director position", ok: true },
        { time: "10:05:12", text: "Evaluated core competencies: ERP logistics, leadership, multi-cloud", ok: true },
        { time: "10:05:19", text: "Selected top 4 candidates with 92%+ objective match scores", ok: true },
        { time: "10:05:25", text: "Dispatched calendar invitations and interview scorecards", ok: true },
      ],
    },
  },
];

// Lean Pricing Tiers
const PRICING_PLANS = [
  {
    name: "Premium",
    price: "$30",
    period: "/ mo",
    badge: "Starter",
    description: "1 dedicated Linux VM & daily workflow automation.",
    features: [
      "Persistent Linux container (/app/working)",
      "Headless Chromium CDP browser",
      "Scheduled cron routines",
      "Web, Desktop & Telegram access",
    ],
  },
  {
    name: "Super",
    price: "$100",
    period: "/ mo",
    badge: "Most Popular",
    description: "Parallel multi-bot teams & 3.5x compute quota.",
    features: [
      "Everything in Premium (3.5x quota)",
      "Multi-bot ACP supervision tree",
      "Priority frontier model routing",
      "Deterministic execution receipts",
    ],
  },
  {
    name: "Ultra",
    price: "$200",
    period: "/ mo",
    badge: "Scale",
    description: "12x compute, IAM360 governance & dedicated storage.",
    features: [
      "Everything in Super (12x quota)",
      "Multi-tenant IAM360 guardrails",
      "Dedicated NVMe workspace volume",
      "Earliest frontier model access",
    ],
  },
  {
    name: "On-Premise",
    price: "Custom",
    period: "Sovereign",
    badge: "Air-Gapped",
    description: "100% self-hosted on your hardware via App360.",
    features: [
      "1-Click App360 K8s / Bare-metal deploy",
      "Local GPU inference (vLLM / Ollama)",
      "Zero external egress (Decree 13 / GDPR)",
      "Dedicated SLA & custom MCP drivers",
    ],
  },
];

// Lean FAQs
const FAQS = [
  {
    q: "Can Skyer run 100% On-Premise without internet egress?",
    a: "Yes. Skyer Enterprise deploys inside your private data center via App360 using Docker or Kubernetes, connecting directly to local vLLM/Ollama GPUs and intranet ERPs with zero external traffic.",
  },
  {
    q: "How is Skyer different from chat wrappers?",
    a: "Each Skyer Bot owns a persistent Linux computer, headless Chromium browser, and MCP tool drivers. They execute real work in parallel 24/7 and return cryptographic verification receipts.",
  },
  {
    q: "How do Human Approval Gates work?",
    a: "Read/research actions run autonomously. Before any production write (bank payout, DB mutation, external email), Skyer pauses and sends an interactive approval card to your web console or Telegram.",
  },
  {
    q: "Do multiple Bots share context and files?",
    a: "Yes. Bots in your workspace share a unified /app/working volume, browser sessions, and ReMe vector memory (`MEMORY.md`), allowing seamless task handoffs without re-prompting.",
  },
];

export function LandingPage() {
  const { t, language } = useTranslation();
  const isVi = language === "vi";
  const navigate = useNavigate();

  // Interactive States
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("All");
  const [activeRole, setActiveRole] = useState(AGENT_ROLES[0]);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [heroTask, setHeroTask] = useState("");
  const [hasSession, setHasSession] = useState(false);

  // Live Interactive Simulation States
  const [deployMode, setDeployMode] = useState<"onprem" | "cloud">("onprem");
  const [approvalState, setApprovalState] = useState<"pending" | "approved" | "executing">("pending");
  const [activeRoutineStep, setActiveRoutineStep] = useState<number>(0);
  const [activeBrowserStep, setActiveBrowserStep] = useState<number>(0);
  const [activeAcpStep, setActiveAcpStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const roleScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    setHasSession(!!token);
  }, []);

  // 1. Role Workbench Step & Log Animator
  useEffect(() => {
    const total = activeRole.previewData.logs.length;
    setVisibleLogs(0);
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setVisibleLogs(n);
      if (n >= total) window.clearInterval(timer);
    }, 550);
    return () => window.clearInterval(timer);
  }, [activeRole, replayKey]);

  // 2. Autonomous Routine & Browser & ACP Cyclic Animators
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRoutineStep((prev) => (prev + 1) % 4);
      setActiveBrowserStep((prev) => (prev + 1) % 4);
      setActiveAcpStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signIn").catch(console.error);
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signUp").catch(console.error);
  };

  const selectRoleById = (id: string) => {
    const role = AGENT_ROLES.find((r) => r.id === id);
    if (role) setActiveRole(role);
  };

  const submitHeroTask = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(appTaskUrl(heroTask));
  };

  const triggerApproveDemo = () => {
    setApprovalState("executing");
    setTimeout(() => {
      setApprovalState("approved");
    }, 900);
  };

  return (
    <div className="pt-16 overflow-x-hidden bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[#f8a87c]/30 selection:text-white">
      <LandingCommandPalette roles={AGENT_ROLES} onSelectRole={selectRoleById} />

      {/* 1. Compact Status Telemetry Bar */}
      <div className="border-b border-neutral-200/80 dark:border-[var(--border-subtle)] bg-slate-50/70 dark:bg-white/[0.015] backdrop-blur-md px-4 py-2 text-center text-xs text-neutral-600 dark:text-neutral-400">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f8a87c] shrink-0 animate-pulse" />
          <strong className="font-medium text-neutral-900 dark:text-white flex items-center gap-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] to-amber-400 font-bold">
              Skyer
            </span>
            <span>{isVi ? "Hệ điều hành Nhân viên AI" : "Autonomous AI Workforce"}</span>
          </strong>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span className="font-mono text-[11px] bg-neutral-200/70 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full">
            {isVi ? "Cloud & 100% On-Premise" : "Managed Cloud & Air-Gap On-Premise"}
          </span>
          <a
            href="#on-premise"
            className="font-medium text-[#f8a87c] hover:underline inline-flex items-center gap-0.5 ml-1"
          >
            <span>{isVi ? "Kiến trúc" : "Architecture"}</span>
            <ArrowRight size={11} />
          </a>
        </div>
      </div>

      {/* 2. Hero Section: Punchy Headline + Interactive Live Task Router */}
      <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-neutral-200 dark:border-[var(--border-subtle)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] md:w-[860px] h-[300px] bg-[#f8a87c]/[0.07] blur-[110px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Live Kernel Pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-[11px] font-mono text-neutral-600 dark:text-neutral-300 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AGENTCORE KERNEL v2.4</span>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <span className="text-[#f8a87c] font-semibold">NO FAKE DONE</span>
          </motion.div>

          <h1 className="font-newsreader text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-neutral-900 dark:text-white leading-[1.12] max-w-4xl mx-auto">
            <span className="block sm:inline">
              {isVi ? "Gặp gỡ " : "Meet "}
              <span className="relative inline-block font-semibold">
                <span className="absolute -inset-1 rounded-2xl bg-[#f8a87c]/25 blur-xl pointer-events-none -z-10" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 drop-shadow-[0_0_30px_rgba(248,168,124,0.4)]">
                  Skyer
                </span>
              </span>
              .
            </span>{" "}
            <span className="block mt-1 sm:mt-1.5 text-balance">
              {isVi ? (
                <>
                  <span className="whitespace-nowrap">Nhân viên AI</span>{" "}
                  <span className="whitespace-nowrap">thực sự</span>{" "}
                  <span className="whitespace-nowrap">hoàn thành</span>{" "}
                  <span className="whitespace-nowrap">công việc.</span>
                </>
              ) : (
                <>
                  <span className="whitespace-nowrap">AI teammates</span>{" "}
                  <span>that finish</span>{" "}
                  <span className="whitespace-nowrap">the work.</span>
                </>
              )}
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            {isVi
              ? "Mỗi Bot sở hữu máy trạm Linux riêng, trình duyệt thật và bộ nhớ dài hạn. Phối hợp song song 24/7 kèm biên nhận thực thi."
              : "Every Bot gets its own Linux computer, headless browser, and persistent memory. Working 24/7 in parallel with verifiable receipts."}
          </p>

          {/* Interactive Live Command Dispatcher */}
          <form
            onSubmit={submitHeroTask}
            className="mt-8 sm:mt-10 mx-auto max-w-2xl rounded-2xl border border-neutral-200 dark:border-white/[0.12] bg-white dark:bg-[#0b0d12] p-2 text-left focus-within:border-[#f8a87c] shadow-lg dark:shadow-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
                <Terminal size={16} className="text-[#f8a87c] shrink-0" />
                <input
                  id="hero-task"
                  value={heroTask}
                  onChange={(e) => setHeroTask(e.target.value)}
                  placeholder={
                    isVi
                      ? "Giao việc cho Bot: Đối soát 48 hóa đơn, xử lý ticket Zendesk..."
                      : "Assign a real task: Reconcile 48 invoices, triage Zendesk queue..."
                  }
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none font-sans"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#f8a87c] px-5 text-xs sm:text-sm font-semibold text-black hover:bg-[#f5935f] transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <span>{isVi ? "Giao việc ngay" : "Dispatch Bot"}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick Interactive Role Presets */}
            <div className="flex flex-wrap items-center gap-1.5 px-2 pt-2 pb-1 border-t border-neutral-100 dark:border-white/[0.06] mt-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 mr-1">
                {isVi ? "Mẫu thử nhanh:" : "Presets:"}
              </span>
              {AGENT_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setHeroTask(r.promptExample);
                    setActiveRole(r);
                  }}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition-all cursor-pointer ${
                    heroTask === r.promptExample
                      ? "bg-[#f8a87c]/20 border-[#f8a87c] text-[#f8a87c] font-semibold"
                      : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </form>

          {/* Animated Live Routing Simulation when typing or selecting a preset */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroTask || "default-flow"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-4 mx-auto max-w-2xl rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50/90 dark:bg-[#0d1017]/90 px-4 py-3 text-left font-mono text-[11px] shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-500 dark:text-neutral-400">ACP ROUTER:</span>
                  <span className="text-neutral-900 dark:text-white font-semibold">
                    {heroTask.toLowerCase().includes("invoice") || heroTask.toLowerCase().includes("finance")
                      ? "Financial Controller"
                      : heroTask.toLowerCase().includes("zendesk") || heroTask.toLowerCase().includes("ticket")
                      ? "Customer Success"
                      : heroTask.toLowerCase().includes("sales") || heroTask.toLowerCase().includes("sea")
                      ? "B2B Sales Executive"
                      : heroTask.toLowerCase().includes("cv") || heroTask.toLowerCase().includes("hire")
                      ? "HR & Talent Partner"
                      : activeRole.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    SANDBOX: /app/working
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30">
                    HUMAN GATE: ARMED
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Primary Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {hasSession ? (
              <Link
                to="/app"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-7 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.3)]"
              >
                <span>{t("hero.launchApp")}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-7 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.3)] cursor-pointer"
                >
                  <span>{isVi ? "Khởi tạo Workspace" : "Start Free Workspace"}</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.08] px-6 text-xs sm:text-sm font-medium text-neutral-800 dark:text-white transition-all cursor-pointer"
                >
                  {t("nav.signIn")}
                </button>
              </>
            )}
            <Link
              to="/marketplace"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/70 dark:bg-white/[0.02] hover:border-[#f8a87c]/50 px-5 text-xs font-mono text-neutral-600 dark:text-neutral-300 transition-all"
            >
              <Layers size={13} className="text-[#f8a87c]" />
              <span>{isVi ? "Chợ Nhân viên AI" : "Role Marketplace"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Section #bots: Interactive AI Employee Workbench (Minimal text, visual step flow + live terminal) */}
      <section id="bots" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c] mb-2">
                <Bot size={13} />
                <span>{isVi ? "MÔ PHỎNG VỊ TRÍ CHUYÊN BIỆT" : "INTERACTIVE ROLE WORKBENCH"}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
                {t("roles.title")}
              </h2>
            </div>

            {/* Lean Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {["All", "Executive", "Finance", "Sales", "Support", "HR"].map((grp) => {
                const isSelected = selectedRoleGroup === grp;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => {
                      setSelectedRoleGroup(grp);
                      const matching = AGENT_ROLES.filter((r) => grp === "All" || r.category === grp);
                      if (matching.length > 0 && !matching.some((m) => m.id === activeRole.id)) {
                        setActiveRole(matching[0]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#f8a87c] text-black font-bold shadow-xs"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5"
                    }`}
                  >
                    {grp}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Selector Bar */}
          <div
            ref={roleScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar"
          >
            {AGENT_ROLES.filter((role) => selectedRoleGroup === "All" || role.category === selectedRoleGroup).map((role) => {
              const active = role.id === activeRole.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap border ${
                    active
                      ? "bg-[#f8a87c]/15 text-[#f8a87c] border-[#f8a87c]/40 dark:bg-white dark:text-black dark:border-white font-semibold shadow-sm"
                      : "bg-white dark:bg-[#0b0e14] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] border-neutral-200 dark:border-[var(--border-subtle)]"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Visual Workbench Grid: Left = Animated Step Pipeline, Right = Live Execution Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-2">
            {/* Left: Visual Workflow Pipeline Card */}
            <div className="lg:col-span-5 rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-5 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/25 px-2.5 py-0.5 rounded-full font-semibold">
                    {activeRole.tag}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{activeRole.title}</h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{activeRole.headline}</p>

                {/* Animated Visual Step Pipeline (replaces heavy text paragraphs) */}
                <div className="mt-5 space-y-2.5">
                  {activeRole.previewData.steps.map((st, idx) => {
                    const isDone = idx < visibleLogs;
                    const isCurrent = idx === visibleLogs;
                    return (
                      <motion.div
                        key={`${activeRole.id}-step-${idx}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                          isDone
                            ? "bg-emerald-500/[0.04] border-emerald-500/25 text-neutral-900 dark:text-white"
                            : isCurrent
                            ? "bg-[#f8a87c]/10 border-[#f8a87c]/40 text-neutral-900 dark:text-white"
                            : "bg-slate-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/5 text-neutral-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-mono shrink-0 ${
                              isDone
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : isCurrent
                                ? "bg-[#f8a87c] text-black font-bold animate-pulse"
                                : "bg-neutral-200 dark:bg-white/5 text-neutral-500"
                            }`}
                          >
                            {isDone ? <Check size={12} /> : idx + 1}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-xs truncate">{st.label}</div>
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{st.detail}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-2">{st.time}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Authorized MCP Drivers */}
              <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-[var(--border-subtle)]">
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded text-neutral-700 dark:text-neutral-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Execution Stream + Telemetry Receipt HUD */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl overflow-hidden font-mono text-xs flex flex-col justify-between">
              <div>
                {/* Window Chrome */}
                <div className="h-10 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="ml-1.5 text-[11px] text-neutral-700 dark:text-neutral-300 truncate">
                      {activeRole.previewData.file}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setReplayKey((k) => k + 1)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-white/[0.06] hover:bg-[#f8a87c]/20 text-neutral-700 dark:text-neutral-300 text-[10px] cursor-pointer transition-colors"
                    >
                      <RotateCcw size={10} />
                      <span>Replay</span>
                    </button>
                  </div>
                </div>

                {/* Prompt Bar */}
                <div className="px-5 py-3 bg-slate-100/60 dark:bg-white/[0.02] border-b border-neutral-200 dark:border-white/5 flex items-center justify-between gap-2">
                  <div className="truncate text-[11px] text-neutral-700 dark:text-neutral-300 font-sans">
                    <span className="font-mono text-[#f8a87c] font-semibold mr-2">Task:</span>
                    “{activeRole.promptExample}”
                  </div>
                </div>

                {/* Animated Execution Stream */}
                <div className="p-5 space-y-2.5 min-h-[185px]">
                  {activeRole.previewData.logs.slice(0, visibleLogs).map((log, idx) => (
                    <motion.div
                      key={`${activeRole.id}-${replayKey}-${idx}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 leading-relaxed text-[11px]"
                    >
                      <span className="text-neutral-400 dark:text-neutral-600 select-none shrink-0">{log.time}</span>
                      <span className="text-emerald-500 shrink-0">✓</span>
                      <span className={log.ok ? "text-neutral-800 dark:text-neutral-200" : "text-amber-600 dark:text-amber-400 font-semibold"}>
                        {log.text}
                      </span>
                    </motion.div>
                  ))}
                  {visibleLogs < activeRole.previewData.logs.length && (
                    <div className="flex items-center gap-2 text-neutral-400 pt-1">
                      <span className="inline-block h-3 w-1.5 bg-[#f8a87c] animate-pulse" />
                      <span>Executing tool call in sandbox...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Metric Cards Footer */}
              <div className="bg-slate-50 dark:bg-[#0b0e14] border-t border-neutral-200 dark:border-[var(--border-subtle)] p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {activeRole.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center gap-2"
                    >
                      <span className="text-[10px] text-neutral-500">{m.label}:</span>
                      <span className="text-[11px] font-bold text-neutral-900 dark:text-white">{m.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={appTaskUrl(activeRole.promptExample)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#f8a87c] text-black font-sans font-semibold text-xs hover:bg-[#f5935f] transition-all shrink-0"
                >
                  <span>{t("roles.tryTask")}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section #on-premise: Interactive Topology Switcher (On-Premise Air-Gap vs Managed Cloud) */}
      <section
        id="on-premise"
        className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-gradient-to-b from-slate-100/60 via-slate-50 to-slate-100/60 dark:from-[#05070a] dark:via-[#090c13] dark:to-[#05070a] relative overflow-hidden"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/25 px-3 py-1 rounded-full mb-3">
                <Server size={12} />
                <span>{isVi ? "KIẾN TRÚC TRIỂN KHAI KÉP" : "HYBRID DEPLOYMENT TOPOLOGY"}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal text-balance leading-[1.15]">
                {isVi ? (
                  <>
                    <span className="whitespace-nowrap">100% On-Premise</span>{" "}
                    <span className="whitespace-nowrap">qua App360</span>{" "}
                    <span>hoặc </span>
                    <span className="whitespace-nowrap">Skyer Cloud.</span>
                  </>
                ) : (
                  "100% Air-Gapped On-Premise or Instant Cloud."
                )}
              </h2>
            </div>

            {/* Interactive Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-neutral-200/80 dark:bg-white/[0.05] border border-neutral-300/80 dark:border-white/10 self-start">
              <button
                type="button"
                onClick={() => setDeployMode("onprem")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  deployMode === "onprem"
                    ? "bg-[#f8a87c] text-black font-bold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Shield size={13} />
                <span>On-Premise (App360)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeployMode("cloud")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  deployMode === "cloud"
                    ? "bg-[#f8a87c] text-black font-bold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Globe size={13} />
                <span>Managed Cloud</span>
              </button>
            </div>
          </div>

          {/* Interactive Animated Architecture Diagram */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c1018] p-6 sm:p-8 shadow-md">
            <AnimatePresence mode="wait">
              {deployMode === "onprem" ? (
                <motion.div
                  key="onprem-diagram"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c]">
                        <Lock size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          Corporate Intranet / Private Data Center (Zero Egress)
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500">
                          Compliant with Decree 13/ND-CP, HIPAA, ISO-27001
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                      AIR-GAPPED FIREWALL ACTIVE
                    </span>
                  </div>

                  {/* Visual Node Flow */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Node 1: App360 Control Plane */}
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#f8a87c]">
                        <span>01. ORCHESTRATOR</span>
                        <Server size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">App360 Sovereign Node</div>
                      <div className="text-[11px] text-neutral-500">1-Click Helm / Docker rollout, health guardian & eBPF isolation</div>
                    </div>

                    {/* Node 2: AgentCore Runtime + Local GPU */}
                    <div className="p-4 rounded-xl border-2 border-[#f8a87c]/50 bg-[#f8a87c]/[0.05] space-y-2 relative">
                      <div className="flex items-center justify-between text-xs font-mono text-[#f8a87c]">
                        <span>02. LOCAL INFERENCE</span>
                        <Cpu size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">vLLM / Ollama / Qwen 72B</div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                        On-premise GPU cluster + local ReMe Vector DB
                      </div>
                    </div>

                    {/* Node 3: Internal Enterprise Systems */}
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
                        <span>03. INTRANET TOOLS</span>
                        <Database size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">SAP • ERPNext • GitLab</div>
                      <div className="text-[11px] text-neutral-500">Direct LAN MCP execution — 0 bytes leave your servers</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-[#f8a87c]" /> BYOK & Local Storage</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-[#f8a87c]" /> Rootless Containers</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-[#f8a87c]" /> Full Audit Ledger</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href="/skyer-enterprise-whitepaper.md"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10"
                      >
                        <FileText size={12} className="text-[#f8a87c]" />
                        <span>Whitepaper</span>
                      </a>
                      <a
                        href="https://app360.space/apps/skyer"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#f8a87c] text-black px-4 py-1.5 rounded-lg hover:bg-[#f5935f]"
                      >
                        <span>Deploy via App360</span>
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="cloud-diagram"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
                        <Globe size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          Skyer Managed Cloud (Instant Turnkey)
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500">
                          Ready in 10 seconds • Per-user microVM isolation
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold">
                      99.99% UPTIME SLA
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                        <span>01. MULTI-CHANNEL</span>
                        <Monitor size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">Web • Telegram • Slack</div>
                      <div className="text-[11px] text-neutral-500">Dispatch tasks from anywhere with real-time streaming</div>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-blue-500/40 bg-blue-500/[0.05] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                        <span>02. FRONTIER FLEET</span>
                        <Sparkles size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">Grok • Claude • GPT • Qwen</div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                        Auto-routed via LLM360 gateway with zero cold-start
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
                        <span>03. CLOUD SANDBOX</span>
                        <HardDrive size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">Persistent Linux & CDP</div>
                      <div className="text-[11px] text-neutral-500">Encrypted storage volume & authenticated browser sessions</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Zero DevOps</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Training Opt-Out</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Instant Scaling</span>
                    </div>
                    <Link
                      to="/app"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#f8a87c] text-black px-4 py-1.5 rounded-lg hover:bg-[#f5935f]"
                    >
                      <span>Launch Cloud Workspace</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. Section #interaction & #hierarchy: Interactive Human-in-the-Loop & Multi-Agent Handoff Simulator */}
      <section id="interaction" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Chat + Live Approval Gate */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c]">
                <CheckCircle2 size={13} />
                <span>{t("interaction.badge")}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
                {t("interaction.title")}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                {isVi
                  ? "Nhắn tin như đồng nghiệp. Bot tự động nghiên cứu và chuẩn bị sẵn biên bản, chỉ hỏi ý kiến bạn trước khi thực thi lệnh nhạy cảm."
                  : "Delegate like a colleague. Bots execute autonomously and pause at cryptographic Human Approval Gates before production writes."}
              </p>

              {/* Interactive Chat Simulation Card */}
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-lg overflow-hidden font-sans">
                <div className="h-9 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    <span className="ml-1 text-neutral-500">Skyer // Task #402</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                    Live Demo
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* User Message */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-800 dark:text-neutral-200 shrink-0">
                      You
                    </div>
                    <div className="bg-slate-50 dark:bg-[#12151d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl rounded-tl-none p-3 text-xs text-neutral-800 dark:text-neutral-200">
                      Reconcile 48 supplier invoices and wire $14,200 payout batch via PayOS.
                    </div>
                  </div>

                  {/* Bot Response + Interactive Approval Gate */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-[#f8a87c] flex items-center justify-center text-xs font-bold text-black shrink-0">
                      S
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-[#12151d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl rounded-tl-none p-3.5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400">✓ 48/48 Invoices Matched ($0.00 diff)</span>
                        <span className="text-neutral-400">TT99 02-VT</span>
                      </div>

                      {/* Interactive Human Gate Box */}
                      <div className="rounded-lg border border-[#f8a87c]/40 bg-white dark:bg-[#090b10] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-mono uppercase text-[#f8a87c] font-bold">
                              HUMAN APPROVAL GATE
                            </div>
                            <div className="text-xs font-semibold text-neutral-900 dark:text-white mt-0.5">
                              Execute PayOS Batch #402 ($14,200.00)
                            </div>
                          </div>

                          {approvalState === "pending" && (
                            <button
                              type="button"
                              onClick={triggerApproveDemo}
                              className="px-3 py-1.5 rounded-lg bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-xs animate-pulse"
                            >
                              <MousePointerClick size={13} />
                              <span>Approve</span>
                            </button>
                          )}
                          {approvalState === "executing" && (
                            <span className="text-xs font-mono text-[#f8a87c]">Signing tx...</span>
                          )}
                          {approvalState === "approved" && (
                            <button
                              type="button"
                              onClick={() => setApprovalState("pending")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={12} />
                              <span>Dispatched (Reset)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Section #hierarchy - Animated Multi-Agent ACP Pipeline */}
            <div id="hierarchy" className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c]">
                <Network size={13} />
                <span>{t("hierarchy.badge")}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
                {t("hierarchy.title")}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                {isVi
                  ? "Các Bot tự động bàn giao tác vụ qua giao thức ACP: Sales chốt hợp đồng → Tài chính xuất hóa đơn → Chánh văn phòng cập nhật KPI."
                  : "Bots pass work autonomously over ACP: Sales closes deal → Finance issues invoice → Chief of Staff updates board OKRs."}
              </p>

              {/* Animated Multi-Agent Mesh Visual */}
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] p-5 shadow-lg space-y-3 font-mono text-xs">
                {[
                  {
                    step: 0,
                    role: "Chief of Staff (Lead)",
                    badge: "DELEGATE",
                    msg: "Decomposed Q4 Enterprise Deal #88 into 3 department sub-tasks",
                    color: "text-[#f8a87c]",
                  },
                  {
                    step: 1,
                    role: "B2B Sales Bot",
                    badge: "CRM SYNC",
                    msg: "Signed MSA uploaded to Nextcloud • Deal stage → Closed Won ($48k)",
                    color: "text-blue-400",
                  },
                  {
                    step: 2,
                    role: "Financial Controller Bot",
                    badge: "ERPNEXT",
                    msg: "Generated VAT Invoice #INV-2026-88 & reconciled first wire transfer",
                    color: "text-emerald-400",
                  },
                  {
                    step: 3,
                    role: "Outline KB & Deck",
                    badge: "RECEIPT",
                    msg: " Epistemic receipt #b7a9 committed • Revenue ledger updated",
                    color: "text-purple-400",
                  },
                ].map((item, idx) => {
                  const isActive = activeAcpStep === idx;
                  return (
                    <div
                      key={item.role}
                      onClick={() => setActiveAcpStep(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#f8a87c]/[0.07] border-[#f8a87c]/50 shadow-xs scale-[1.01]"
                          : "bg-slate-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/5 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${item.color} flex items-center gap-1.5`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#f8a87c] animate-ping" : "bg-neutral-400"}`} />
                          {item.role}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-white/5 text-neutral-600 dark:text-neutral-300">
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-700 dark:text-neutral-300 font-sans pl-3">
                        {item.msg}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section #architecture & #workflow: Visual Browser CDP + Autonomous Routine & Memory Loop */}
      <section id="architecture" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Part A: Headless Browser CDP Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c]">
                <Eye size={13} />
                <span>{t("tools.badge")}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
                {t("tools.title")}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                {isVi
                  ? "Đăng nhập một lần. Bot thao tác trực tiếp trên giao diện web (Zendesk, ERPNext, Ngân hàng, Google) qua trình duyệt Chromium CDP cô lập."
                  : "Log in once. Bots navigate complex SaaS UIs directly via isolated Chromium CDP sessions with persistent cookies."}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {["Zendesk", "ERPNext", "GitHub", "Notion", "Google Workspace", "PayOS", "Telegram"].map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-mono bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 px-2.5 py-1 rounded-lg text-neutral-700 dark:text-neutral-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Animated Virtual Browser Viewport */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl overflow-hidden font-mono text-xs">
              <div className="h-9 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-[11px] truncate text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-white/5 px-2.5 py-0.5 rounded">
                    https://erp.company.vn/app/purchase-invoice
                  </span>
                </div>
                <span className="text-[10px] text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/30 px-2 py-0.5 rounded">
                  CDP: 60 FPS
                </span>
              </div>

              {/* Interactive Simulated DOM Targets */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: "1. Session Auth", desc: "SSO Cookie Vault mounted", status: "200 OK" },
                  { title: "2. DOM Selector", desc: "Clicked [data-action='reconcile']", status: "Matched" },
                  { title: "3. Form Prefill", desc: "Injected 48 PO line items", status: "0 Errors" },
                  { title: "4. Visual Receipt", desc: "Captured PNG hash #a94f2", status: "Verified" },
                ].map((bStep, idx) => {
                  const active = activeBrowserStep === idx;
                  return (
                    <div
                      key={bStep.title}
                      onClick={() => setActiveBrowserStep(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        active
                          ? "border-[#f8a87c] bg-[#f8a87c]/10"
                          : "border-neutral-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-neutral-900 dark:text-white">{bStep.title}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{bStep.status}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
                        {bStep.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Part B: Section #workflow - Repeatable Routines & ReMe Memory Graph */}
          <div id="workflow" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Card 1: Scheduled Cron Routine Simulator */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#f8a87c] bg-[#f8a87c]/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {t("routines.badge")}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                    <Clock size={12} className="text-[#f8a87c]" />
                    08:00 AM Daily
                  </span>
                </div>
                <h3 className="font-newsreader text-2xl text-neutral-900 dark:text-white font-normal">
                  {t("routines.title")}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 mb-4">
                  {isVi
                    ? "Hướng dẫn một lần, Bot lưu thành lịch trình tự động chạy mỗi sáng."
                    : "Show a workflow once; Skyer compiles it into a deterministic cron job."}
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090d] p-3.5 font-mono text-[11px] space-y-2">
                {["01. Pull bank & ERP ledger", "02. Flag variance > $100", "03. Post briefing to Telegram", "04. Archive receipt to KB"].map(
                  (rStep, idx) => (
                    <div
                      key={rStep}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded ${
                        activeRoutineStep === idx
                          ? "bg-[#f8a87c]/15 text-neutral-900 dark:text-white font-semibold"
                          : "text-neutral-500"
                      }`}
                    >
                      <span>{rStep}</span>
                      <span className={activeRoutineStep === idx ? "text-[#f8a87c]" : "text-emerald-500"}>
                        {activeRoutineStep === idx ? "● Running" : "✓"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Card 2: ReMe Persistent Memory & Self-Evolution */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {t("memory.badge")}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">ReMe Engine</span>
                </div>
                <h3 className="font-newsreader text-2xl text-neutral-900 dark:text-white font-normal">
                  {t("memory.title")}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 mb-4">
                  {isVi
                    ? "Bộ nhớ 2 tầng: File Markdown chuẩn (MEMORY.md, SOUL.md) kết hợp đồ thị tri thức Outline KB."
                    : "Dual-tier memory: Structured Markdown files (`MEMORY.md`) synced with Outline KB vector graph."}
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090d] p-3.5 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-neutral-200 dark:border-white/5">
                  <span className="text-neutral-900 dark:text-white font-bold">/app/working/MEMORY.md</span>
                  <span className="text-emerald-500 text-[10px]">Synced</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-[#f8a87c]">[[VendorPolicy]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">3-way match required</div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-blue-400">[[BrandVoice]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">Executive concise tone</div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-emerald-400">[[TT99Rules]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">Mẫu 02-VT template</div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-purple-400">[[EscalationSLA]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">Notify CFO &gt; $5,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section #pricing: Clean Tiers */}
      <section id="pricing" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#f8a87c] font-semibold">
              {t("pricing.badge")}
            </span>
            <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal mt-2">
              {t("pricing.title")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 flex flex-col justify-between border transition-all ${
                  plan.name === "Super"
                    ? "bg-white dark:bg-[var(--bg-card)] border-[#f8a87c] shadow-lg relative"
                    : "bg-slate-50/70 dark:bg-[#080a0f] border-neutral-200 dark:border-[var(--border-subtle)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{plan.name}</h3>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        plan.name === "Super"
                          ? "bg-[#f8a87c] text-black"
                          : "bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">{plan.description}</p>

                  <ul className="mt-5 space-y-2.5 border-t border-neutral-200 dark:border-[var(--border-subtle)] pt-4 text-xs text-neutral-700 dark:text-neutral-300">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-[#f8a87c] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.name === "On-Premise" ? "/docs" : "/app"}
                  className={`mt-6 w-full py-2.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    plan.name === "Super"
                      ? "bg-[#f8a87c] text-black hover:bg-[#f5935f]"
                      : "bg-neutral-200/70 dark:bg-white/[0.06] text-neutral-900 dark:text-white hover:bg-neutral-300/70 dark:hover:bg-white/[0.12]"
                  }`}
                >
                  {plan.name === "On-Premise" ? (isVi ? "Tài liệu On-Prem" : "Explore On-Prem") : `${t("pricing.getPlan")} ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Section #faq: Compact Accordion */}
      <section id="faq" className="py-16 sm:py-20 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-newsreader text-2xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
              {t("faq.title")}
            </h2>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-[var(--border-subtle)] border-t border-b border-neutral-200 dark:border-[var(--border-subtle)]">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-4 text-left text-xs sm:text-sm font-medium text-neutral-900 dark:text-white hover:text-[#f8a87c] transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{item.q}</span>
                    <ChevronDown
                      size={15}
                      className={`text-neutral-500 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#f8a87c]" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section id="deploy" className="py-20 text-center relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 relative z-10">
          <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal leading-[1.15] text-balance">
            {isVi ? (
              <>
                <span className="whitespace-nowrap">Khởi chạy</span>{" "}
                <span className="whitespace-nowrap">Nhân viên AI</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 font-semibold whitespace-nowrap">
                  Skyer
                </span>{" "}
                <span className="whitespace-nowrap">ngay hôm nay.</span>
              </>
            ) : (
              <>
                <span>Deploy your first </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 font-semibold">
                  Skyer
                </span>
                <span> teammate today.</span>
              </>
            )}
          </h2>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-8 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.35)]"
            >
              <span>{t("cta.getStarted")}</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/docs"
              className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.08] px-7 text-xs sm:text-sm font-medium text-neutral-800 dark:text-white transition-all"
            >
              {t("cta.readDocs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
