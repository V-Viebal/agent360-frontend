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
  Code2,
  Cpu,
  Workflow,
  Globe,
  ExternalLink,
  Laptop,
  CheckCheck,
  Copy,
  Zap,
} from "lucide-react";

// Corporate Department AI Employee Roles matching "Give each Bot a job"
const AGENT_ROLES = [
  {
    id: "cos",
    title: "Chief of Staff",
    tag: "Executive & Ops",
    category: "Executive",
    icon: Sparkles,
    headline: "Coordinates agendas, cross-department OKRs, and executive decision packs.",
    description:
      "Synthesizes weekly metrics across Finance, Sales, and Ops into concise briefings. Drafts board memos, monitors team bottlenecks, and coordinates director sign-offs.",
    tools: ["Google Workspace", "Notion Hub", "Slack/Telegram Bridge", "Plan Ledger Engine"],
    status: "Active • Executive briefing for week 42 synthesized",
    promptExample: "Synthesize weekly KPI reports from Marketing, Sales, and Finance, highlighting bottlenecks for board review.",
    windowKind: "docs",
    previewData: {
      file: "executive-briefing // Q4 Leadership Sync",
      action: "Cross-department KPI synthesis & bottleneck detection",
      logs: [
        { time: "08:30:02", text: "Ingesting weekly departmental progress reports (Sales, CX, Finance)", ok: true },
        { time: "08:30:08", text: "Reconciling ARR growth target with operational burn rate: Runway 18.4 mo", ok: true },
        { time: "08:30:14", text: "Flagged 1 bottleneck: Enterprise procurement turnaround in Legal", ok: true },
        { time: "08:30:21", text: "Generated 3-page Executive Decision Pack with citation receipts", ok: true },
        { time: "08:30:25", text: "Projected to Leadership Deck. Ready for Monday executive review", ok: true },
      ],
      metrics: { kpisTracked: "28/28 OK", runway: "18.4 mo", decisions: "3 Actions" },
    },
  },
  {
    id: "finance",
    title: "Financial Controller",
    tag: "Finance & Accounting",
    category: "Finance",
    icon: Server,
    headline: "Reconciles bank ledgers, audits vendor invoices, and prepares TT99 statements.",
    description:
      "Performs automated three-way matching for purchase orders, receipts, and invoices. Audits monthly closing numbers against bank statements with zero rounding discrepancies.",
    tools: ["ERPNext Financials", "Bank Reconciliation API", "Excel/CSV AST", "PayOS Engine"],
    status: "Active • Three-way invoice matching verified: $0 discrepancy",
    promptExample: "Perform three-way invoice reconciliation for this week's supplier payments and generate payment vouchers.",
    windowKind: "telemetry",
    previewData: {
      file: "general-ledger // Cycle 2026-10-W3",
      action: "Three-way matching & automated bank ledger audit",
      logs: [
        { time: "09:00:10", text: "Scanning 48 incoming vendor invoices against PO-2026 and GRN records", ok: true },
        { time: "09:00:15", text: "Discrepancy audit: 48/48 invoices matched within 0.00 VND tolerance", ok: true },
        { time: "09:00:22", text: "Generated tax compliance voucher Mẫu 02-VT (TT99 standard)", ok: true },
        { time: "09:00:28", text: "Connected PayOS bank statement feed: Balance reconciled: $148,290.00", ok: true },
        { time: "09:00:32", text: "Voucher pack staged for CFO cryptographic approval", ok: true },
      ],
      metrics: { matched: "48/48 PASS", discrepancy: "$0.00", compliance: "TT99 PASS" },
    },
  },
  {
    id: "sales",
    title: "B2B Sales Executive",
    tag: "Revenue & Growth",
    category: "Sales",
    icon: Zap,
    headline: "Enriches target enterprise accounts, qualifies leads, and drafts bespoke proposals.",
    description:
      "Researches organizational buying signals, maps C-level stakeholders, and crafts personalized outreach decks and contract appendices in your company's executive voice.",
    tools: ["HubSpot/Salesforce Bridge", "LinkedIn Graph", "Exa Web Search", "Email Sequencer"],
    status: "Pipeline • 42 qualified enterprise accounts staged",
    promptExample: "Research 15 target enterprise logistics accounts in Southeast Asia and draft customized pitch sequences.",
    windowKind: "crm",
    previewData: {
      file: "pipeline-builder // Enterprise Inbound & Outbound",
      action: "Stakeholder mapping & customized proposal generation",
      logs: [
        { time: "09:30:11", text: "Screened 120 target enterprise logistics accounts via verified public data", ok: true },
        { time: "09:30:19", text: "Filtered 42 accounts with active Head of Supply Chain & IT procurement signals", ok: true },
        { time: "09:30:28", text: "Drafted hyper-personalized demo pitches in company brand tone", ok: true },
        { time: "09:30:35", text: "Created deal opportunities in CRM: $48,000 potential ARR staged", ok: true },
      ],
      metrics: { qualifiedLeads: "42", intentScore: "94%", pipelineValue: "$48k ARR" },
    },
  },
  {
    id: "cx",
    title: "Customer Success Lead",
    tag: "Support & Retention",
    category: "Support",
    icon: Shield,
    headline: "Resolves customer support tickets 24/7 with zero escalation backlog.",
    description:
      "Triages unassigned tickets across Zendesk and Intercom, diagnoses technical inquiries against verified documentation, and escalates edge-cases with complete context.",
    tools: ["Zendesk / Intercom API", "Knowledge Base MCP", "Sentiment Analyzer", "Email Bridge"],
    status: "Active • First response time < 25s, CSAT: 98.4%",
    promptExample: "Triage today's unresolved tickets, resolve billing questions automatically, and escalate technical outages.",
    windowKind: "browser",
    previewData: {
      file: "support-queue // Zendesk & Helpdesk Live Feed",
      action: "Autonomous ticket triage & step-by-step troubleshooting",
      logs: [
        { time: "10:20:01", text: "Ingested 14 incoming support inquiries across web and mobile apps", ok: true },
        { time: "10:20:06", text: "Ticket #8821 (Billing receipt request): Auto-generated and dispatched", ok: true },
        { time: "10:20:12", text: "Ticket #8824 (API webhook timeout): Diagnosed retry header mismatch", ok: true },
        { time: "10:20:18", text: "Dispatched friendly technical explanation with verified code sample", ok: true },
        { time: "10:20:22", text: "CSAT satisfaction score confirmed: 5/5 stars (Queue cleared)", ok: true },
      ],
      metrics: { resolved: "14/14", avgResponse: "22s", csatScore: "98.4%" },
    },
  },
  {
    id: "hr",
    title: "HR & Talent Partner",
    tag: "People & Culture",
    category: "Human Resources",
    icon: Layers,
    headline: "Screens applicant resumes, coordinates interviews, and manages 30-60-90 onboarding.",
    description:
      "Automates recruitment screening against role specifications, schedules interviews without calendar conflicts, and guides new employees through paperwork and handbook policies.",
    tools: ["Greenhouse / Lever Bridge", "Resume Parser", "Calendar Orchestrator", "Employee Handbook KB"],
    status: "Active • 25 candidate dossiers screened, 4 shortlisted",
    promptExample: "Screen 25 new applicants for the Operations role and prepare interview briefing dossiers with match scores.",
    windowKind: "docs",
    previewData: {
      file: "talent-pipeline // Q4 Hiring & Onboarding Hub",
      action: "Automated candidate qualification & structured onboarding",
      logs: [
        { time: "10:05:02", text: "Parsed 25 applicant CVs for Operations Director position", ok: true },
        { time: "10:05:12", text: "Evaluated core competencies: ERP logistics, leadership, multi-cloud", ok: true },
        { time: "10:05:19", text: "Selected top 4 candidates with 92%+ objective match scores", ok: true },
        { time: "10:05:25", text: "Dispatched calendar invitations and interview scorecards to hiring manager", ok: true },
      ],
      metrics: { screened: "25 Candidates", shortlisted: "4", timeSaved: "14.5 hrs" },
    },
  },
];

// x.ai/bot Pricing Tiers
const PRICING_PLANS = [
  {
    name: "Premium",
    price: "$30",
    period: "/ month",
    badge: "Popular",
    description: "Ideal for individual developers building their first autonomous workflow.",
    features: [
      "Skyer Bot's own persistent cloud computer",
      "Signs into your apps & websites securely",
      "Automated routines on a schedule",
      "Work anywhere: desktop, mobile, and web",
      "Weekly Skyer Bot usage included",
    ],
  },
  {
    name: "Super",
    price: "$100",
    period: "/ month",
    badge: "Power Users",
    description: "Designed for engineers and operators running continuous parallel agents.",
    features: [
      "Everything in Premium",
      "3.5x Premium usage quota",
      "Priority model access at peak times",
      "Fast headless browser CDP automation",
      "Concurrent multi-bot task collaboration",
    ],
  },
  {
    name: "Ultra",
    price: "$200",
    period: "/ month",
    badge: "Maximum Cloud",
    description: "Uncapped cloud performance with earliest frontier model access.",
    features: [
      "Everything in Super",
      "12x Premium usage quota",
      "Earliest access to all products & models",
      "Multi-tenant IAM360 policy guardrails",
      "Dedicated persistent compute volume",
    ],
  },
  {
    name: "On-Premise",
    price: "Custom",
    period: "Sovereign License",
    badge: "Air-Gapped Enterprise",
    description: "Self-hosted on your own hardware or private VPC with zero data egress.",
    features: [
      "Full source code & Docker / Helm deployment packs",
      "Air-gapped offline local LLM inference (vLLM / Ollama)",
      "Strict compliance: GDPR, HIPAA, VN Nghị định 13",
      "Unlimited bots & concurrent local agent tasks",
      "Dedicated integration engineering & 24/7 SLA",
    ],
  },
];

// FAQs faithfully aligned to x.ai/bot
const FAQS = [
  {
    q: "Can Skyer be deployed completely On-Premise inside our private data center?",
    a: "Yes. Skyer offers a fully sovereign On-Premise edition. You can run the entire agent runtime, local browser automation, and multi-agent ACP orchestration behind your company firewall using Docker Compose or Kubernetes. It connects directly to local inference backends (vLLM, Ollama, llama.cpp) so no prompt text or corporate documents ever leave your physical servers.",
  },
  {
    q: "How is Skyer different from traditional chat assistants?",
    a: "Bots have their own computer, so they can work inside your apps and tools. They also run in parallel, 24/7, even when your laptop is closed. Instead of merely outputting chat text, Skyer executes real shell commands, interacts with headless browsers, edits git repositories, and produces verifiable receipts.",
  },
  {
    q: "Who is Skyer available for today?",
    a: "Skyer is available across Developer, Premium, Super, Ultra, Teams, and Enterprise workspaces. You can launch your active session immediately from the web console or native desktop.",
  },
  {
    q: "Do Bots share one computer?",
    a: "Yes. Every Skyer Bot workspace shares one persistent cloud computer. Your Bots share that machine (files, browser, logins), so they can hand work off and keep context. Isolation is per user, not per bot.",
  },
  {
    q: "Where do I talk to Skyer?",
    a: "Work with Skyer from your desktop (macOS or Windows), directly via the /app interactive web workspace, or connected channels such as Telegram, Element, and Discord.",
  },
  {
    q: "How does Skyer handle my data & privacy?",
    a: "Skyer uses strict Zero-Trust isolation. Your cloud environment is encrypted in transit and at rest, with training opt-out guarantees. Sensitive actions pass through approval gates before execution, and enterprise admins can enforce DLP, secrets scrubbing, and audit logs.",
  },
  {
    q: "Can multiple Skyer bots collaborate on one complex project?",
    a: "Yes. By connecting bots into the same thread via ACP (Agent Communication Protocol), you can watch them pass tasks between themselves—e.g., Lead Orchestrator delegates code diffs to SWE Worker while Vision QA simultaneously verifies the UI.",
  },
];

export function LandingPage() {
  const { t } = useTranslation();
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("All");
  const [activeRole, setActiveRole] = useState(AGENT_ROLES[0]);
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [heroTask, setHeroTask] = useState("");
  const navigate = useNavigate();
  const [hasSession, setHasSession] = useState(false);
  useEffect(() => {
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    setHasSession(!!token);
  }, []);
  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signIn").catch(console.error);
  };
  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signUp").catch(console.error);
  };
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  // Stream the active Bot's execution log line by line; respect reduced motion.
  useEffect(() => {
    const total = activeRole.previewData.logs.length;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisibleLogs(total);
      return;
    }
    setVisibleLogs(0);
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setVisibleLogs(n);
      if (n >= total) window.clearInterval(timer);
    }, 650);
    return () => window.clearInterval(timer);
  }, [activeRole, replayKey]);

  const selectRoleById = (id: string) => {
    const role = AGENT_ROLES.find((r) => r.id === id);
    if (role) setActiveRole(role);
  };

  const submitHeroTask = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(appTaskUrl(heroTask));
  };
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const roleScrollRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };

  return (
    <div className="pt-16 overflow-x-hidden bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[#f8a87c]/30 selection:text-white">
      <LandingCommandPalette roles={AGENT_ROLES} onSelectRole={selectRoleById} />
      {/* 1. Announcement Bar */}
      <div className="border-b border-[var(--border-subtle)] bg-white/[0.015] backdrop-blur-md px-4 py-2 sm:py-2.5 text-center text-xs tracking-wide text-neutral-400">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f8a87c] shrink-0 animate-pulse" />
          <strong className="font-medium text-neutral-900 dark:text-white flex items-center gap-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] to-amber-300 font-bold">
              Skyer
            </span>
            <span>{t("announcement.badge").replace("Skyer", "").trim()}</span>
          </strong>
          <span className="text-neutral-600 hidden sm:inline">•</span>
          <span className="text-neutral-300 font-medium">{t("announcement.onPremise")}</span>
          <span className="text-neutral-600 hidden sm:inline">&</span>
          <span className="hidden md:inline text-neutral-400">{t("announcement.cloud")}</span>
          <a href="#on-premise" className="font-medium text-[#f8a87c] hover:text-amber-400 transition-colors inline-flex items-center gap-0.5 ml-1">
            {t("announcement.exploreOnPrem")} <ArrowRight size={12} />
          </a>
        </div>
      </div>

      {/* 2. Hero Section: Editorial Elegance matching x.ai/bot */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 md:pt-36 md:pb-40 border-b border-[var(--border-subtle)]">
        {/* Subtle, non-slop background lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-[#f8a87c]/[0.05] blur-[120px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-newsreader text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-normal tracking-tight text-neutral-900 dark:text-white leading-[1.06] max-w-4xl mx-auto text-balance">
            {(() => {
              const title = t("hero.title") || "Meet Skyer. AI teammates you can give real work to.";
              if (title.includes("Skyer")) {
                const parts = title.split("Skyer");
                return (
                  <>
                    {parts[0]}
                    <span className="relative inline-block font-semibold">
                      <span className="absolute -inset-1 rounded-2xl bg-[#f8a87c]/25 blur-xl pointer-events-none -z-10" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 drop-shadow-[0_0_35px_rgba(248,168,124,0.45)]">
                        Skyer
                      </span>
                    </span>
                    {parts.slice(1).join("Skyer")}
                  </>
                );
              }
              return title;
            })()}
          </h1>

          <p className="mt-6 sm:mt-8 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <form
            onSubmit={submitHeroTask}
            className="mt-10 sm:mt-12 mx-auto max-w-2xl rounded-2xl border border-white/[0.1] bg-neutral-100 dark:bg-[#0b0d12] p-2 text-left focus-within:border-neutral-400 dark:focus-within:border-white/25 shadow-md dark:shadow-none transition-colors"
          >
            <label htmlFor="hero-task" className="sr-only">{t("landing.describeTask")}</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                id="hero-task"
                value={heroTask}
                onChange={(e) => setHeroTask(e.target.value)}
                placeholder={t("hero.inputPlaceholder")}
                className="flex-1 min-w-0 bg-transparent px-3 py-3 text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-500 outline-none"
                maxLength={2000}
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-white px-5 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"
              >
                {t("hero.submitButton")} <ArrowRight size={14} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 px-2 pt-2 pb-1">
              {AGENT_ROLES.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setHeroTask(r.promptExample)}
                  className="max-w-full truncate rounded-full border border-[var(--border-subtle)] bg-white/[0.02] px-2.5 py-1 text-[11px] text-neutral-400 hover:text-white hover:border-white/20 transition-colors"
                  title={r.promptExample}
                >
                  {r.title}: {r.promptExample.slice(0, 42)}…
                </button>
              ))}
            </div>
          </form>
          {heroTask.trim().length > 3 && (
            <div className="mt-3 mx-auto max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/90 p-3 text-left font-mono text-xs shadow-xl animate-[fadeIn_.2s_ease-out]">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-[var(--border-subtle)] pb-2 mb-2">
                <span className="flex items-center gap-1.5 text-neutral-900 dark:text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] animate-pulse" />
                  {t("plan.taskDecomp")}
                </span>
                <span className="text-emerald-400">{t("plan.multiAgentProto")}</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">{t("plan.orchestrator")}</span>
                  <span>{t("plan.orchestratorDesc")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">{t("plan.delegate")}</span>
                  <span className="text-[#f8a87c]">
                    {heroTask.toLowerCase().includes("invoice") || heroTask.toLowerCase().includes("finance") || heroTask.toLowerCase().includes("tax") || heroTask.toLowerCase().includes("tt99")
                      ? "Financial Controller (ERPNext & Bank Feed)"
                      : heroTask.toLowerCase().includes("zendesk") || heroTask.toLowerCase().includes("support") || heroTask.toLowerCase().includes("ticket")
                      ? "Customer Success Lead (24/7 Triage)"
                      : heroTask.toLowerCase().includes("sales") || heroTask.toLowerCase().includes("lead") || heroTask.toLowerCase().includes("prospect")
                      ? "B2B Sales Executive (Revenue Ops)"
                      : heroTask.toLowerCase().includes("hr") || heroTask.toLowerCase().includes("resume") || heroTask.toLowerCase().includes("hire")
                      ? "HR & Talent Acquisition Partner"
                      : "Chief of Staff (Executive Director)"}
                  </span>
                  <span className="text-neutral-500">{t("plan.delegateDesc")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">{t("plan.humanGate")}</span>
                  <span className="text-amber-400">{t("plan.humanGateDesc")}</span>
                </div>
              </div>
            </div>
          )}

          <p className="mt-3 hidden sm:block text-[11px] text-neutral-500">
            {t("hero.approvalNotice")}{" "}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("skyer:open-palette"))}
              className="font-mono text-neutral-300 border border-white/10 rounded px-1.5 py-0.5 hover:border-white/25"
            >
              {isMac ? "⌘" : "Ctrl"} K
            </button>{" "}
            {t("hero.jumpAnywhere")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            {hasSession ? (
              <>
                <Link
                  to="/app"
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-8 text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.35)] active:scale-98"
                >
                  {t("hero.launchApp")}
                </Link>
                <a
                  href="#bots"
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 px-8 text-sm font-medium text-white transition-all active:scale-98"
                >
                  {t("hero.exploreTeammates")}
                </a>
              </>
            ) : (
              <>
                {/* Sign Up Primary CTA when no session */}
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-8 text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.35)] active:scale-98 cursor-pointer"
                >
                  Sign Up
                </button>
                {/* Sign In Secondary CTA */}
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/25 px-8 text-sm font-medium text-white transition-all active:scale-98 cursor-pointer"
                >
                  {t("nav.signIn")}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Message Bots like teammates - Authentic Desktop Window Chrome */}
      
      {/* 2.5. Dedicated Hybrid Architecture: On-Premise Private Air-Gap + Managed Cloud */}
      <section id="on-premise" className="py-20 sm:py-24 border-b border-[var(--border-subtle)] bg-gradient-to-b from-slate-100/60 via-slate-50 to-slate-100/60 dark:from-[#05070a] dark:via-[#090c13] dark:to-[#05070a] relative overflow-hidden">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/25 px-3 py-1 rounded-full mb-3">
              <Server size={13} className="text-[#f8a87c]" />
              <span>{t("onPremise.badge")}</span>
            </div>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal leading-tight text-balance">
              {t("onPremise.title")}
            </h2>
            <p className="mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
              {t("onPremise.subtitle")}
            </p>
          </div>

          {/* Cloud vs On-Premise Side-by-Side Comparison Architecture Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
            {/* 1. On-Premise Self-Hosted Enterprise Edition */}
            <div className="rounded-2xl border border-[#f8a87c]/40 bg-white dark:bg-[#0c1018] p-6 sm:p-8 flex flex-col justify-between relative shadow-sm dark:shadow-[0_0_30px_rgba(248,168,124,0.12)]">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-mono uppercase bg-[#f8a87c] text-black font-bold px-2.5 py-1 rounded-full">
                  100% Data Sovereignty
                </span>
              </div>
              <div>
                <div className="h-10 w-10 rounded-xl bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c] mb-4">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{t("onPremise.privateClusterTitle")}</h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {t("onPremise.privateClusterDesc")}
                </p>

                <div className="space-y-3 font-mono text-xs border-t border-[var(--border-subtle)] pt-5">
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-[#f8a87c] shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureAirGap")}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-[#f8a87c] shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureIntranet")}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-[#f8a87c] shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureBYOK")}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-[#f8a87c] shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureDeploy")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-mono text-neutral-500">{t("onPremise.hardwareReq")}</span>
                <div className="flex items-center gap-3">
                  <a
                    href="/skyer-enterprise-whitepaper.md"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 px-3 py-1.5 rounded-lg transition-colors"
                    title="Download Architecture & Compliance Whitepaper"
                  >
                    <span>{t("onPremise.downloadWhitepaper")}</span>
                    <ExternalLink size={11} className="text-[#f8a87c]" />
                  </a>
                  <a
                    href="https://app360.space/apps/skyer"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f8a87c] hover:text-amber-400"
                    title="Deploy Skyer on App360 Sovereign Platform"
                  >
                    <span>{t("onPremise.exploreRunbook")}</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Skyer Managed Cloud Platform */}
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#080a0f] p-6 sm:p-8 flex flex-col justify-between relative shadow-sm hover:border-neutral-300 dark:hover:border-white/20 transition-colors">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-mono uppercase bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300 font-medium px-2.5 py-1 rounded-full">
                  Instant Turnkey
                </span>
              </div>
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                  <Cpu size={20} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{t("onPremise.managedCloudTitle")}</h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  {t("onPremise.managedCloudDesc")}
                </p>

                <div className="space-y-3 font-mono text-xs border-t border-[var(--border-subtle)] pt-5">
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureZeroSetup")}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureModels")}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureSandbox")}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                    <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t("onPremise.featureSLA")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500">{t("onPremise.managedCloudTier")}</span>
                <Link
                  to="/app"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 dark:text-white hover:text-[#f8a87c]"
                >
                  <span>{t("onPremise.launchWorkspace")}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="interaction" className="py-20 sm:py-28 border-b border-[var(--border-subtle)] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                {t("interaction.badge")}
              </span>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal leading-tight text-balance">
                {t("interaction.title")}
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                {t("interaction.subtitle")}
              </p>

              <div className="pt-4 space-y-3 font-sans text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-neutral-300">
                    <Check size={12} />
                  </div>
                  <span>{t("interaction.bullet1")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-neutral-300">
                    <Check size={12} />
                  </div>
                  <span>{t("interaction.bullet2")}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-neutral-300">
                    <Check size={12} />
                  </div>
                  <span>{t("interaction.bullet3")}</span>
                </div>
              </div>
            </div>

            {/* Authentic Desktop Window Canvas (No fake neon glow) */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl dark:shadow-2xl overflow-hidden font-sans">
              {/* Window Header */}
              <div className="h-10 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-xs font-mono text-neutral-400">{t("wb.taskHeader")}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-200/60 dark:bg-white/[0.06] px-2 py-0.5 rounded">
                  Active
                </span>
              </div>

              {/* Chat Canvas */}
              <div className="p-5 sm:p-7 space-y-4">
                {/* User Prompt */}
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-[#F8FAFC] dark:bg-neutral-800 border border-[#CBD5E1] dark:border-neutral-700 flex items-center justify-center text-xs font-semibold text-[#475569] dark:text-neutral-200 shrink-0 shadow-xs">
                    You
                  </div>
                  <div className="bg-slate-50 dark:bg-[#12151d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl rounded-tl-none p-3.5 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed max-w-xl shadow-xs">
                    Reconcile this week's 48 supplier invoices against PO records and bank payouts, flag any variance over $100, and generate the TT99 tax voucher for CFO sign-off.
                  </div>
                </div>

                {/* Bot Response */}
                <div className="flex items-start gap-3 pt-2">
                  <div className="h-7 w-7 rounded-full bg-[#FFF5EE] dark:bg-[#f8a87c] border border-[#FED7AA] dark:border-transparent flex items-center justify-center text-xs font-bold text-[#EA580C] dark:text-black shrink-0 shadow-xs">
                    S
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-[#12151d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl rounded-tl-none p-4 space-y-3 shadow-xs">
                    <div className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                      I have initiated the financial workflow and delegated execution across specialized department bots:
                    </div>

                    {/* Execution Steps */}
                    <div className="bg-white dark:bg-[#090b10] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-lg p-3 space-y-2 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">{t("wb.bot1Name")}</span>
                        <span className="text-emerald-400">{t("wb.bot1Status")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">{t("wb.bot2Name")}</span>
                        <span className="text-emerald-400">{t("wb.bot2Status")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-400">{t("wb.bot3Name")}</span>
                        <span className="text-neutral-600 dark:text-neutral-300">{t("wb.bot3Status")}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-[var(--border-subtle)]">
                      <span>{t("wb.verifObserved")}</span>
                      <Link to="/app" className="text-[#f8a87c] hover:underline flex items-center gap-1 font-sans font-medium text-xs">
                        Review Voucher Pack <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Work with many Bots at once - Clean Asymmetric 3-Card Grid */}
      <section className="py-20 sm:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl mb-12 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              {t("parallel.badge")}
            </span>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal mt-3 text-balance">
              {t("parallel.title")}
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
              {t("parallel.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bot on Finance & Accounting */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-[var(--border-subtle)] flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                  <Server size={18} className="text-[#f8a87c]" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">{t("parallel.bot1Title")}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {t("parallel.bot1Desc")}
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>{t("parallel.bot1FooterLeft")}</span>
                <span className="text-emerald-400">{t("parallel.bot1FooterRight")}</span>
              </div>
            </div>

            {/* Bot on Customer Support & Retention */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-[var(--border-subtle)] flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                  <Shield size={18} className="text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">{t("parallel.bot2Title")}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {t("parallel.bot2Desc")}
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>{t("parallel.bot2FooterLeft")}</span>
                <span className="text-emerald-400">{t("parallel.bot2FooterRight")}</span>
              </div>
            </div>

            {/* {t("parallel.bot3Title")} */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 shadow-sm dark:shadow-none flex flex-col justify-between hover:border-white/20 transition-all">
              <div>
                <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-[var(--border-subtle)] flex items-center justify-center text-neutral-900 dark:text-white mb-4">
                  <Sparkles size={18} className="text-[#f8a87c]" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1.5">{t("parallel.bot3Title")}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {t("parallel.bot3Desc")}
                </p>
              </div>
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>{t("parallel.bot3FooterLeft")}</span>
                <span className="text-emerald-400">{t("parallel.bot3FooterRight")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Skyer Bot works where you work - Realistic Headless Browser Session Window */}
      <section id="architecture" className="py-20 sm:py-28 border-b border-[var(--border-subtle)] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Virtual Browser Window */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl dark:shadow-2xl overflow-hidden font-mono text-xs order-2 lg:order-1">
              <div className="h-10 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-[11px] truncate text-neutral-700 dark:text-neutral-300">https://support.zendesk.com/agent/tickets</span>
                </div>
                <span className="text-[10px] bg-neutral-200/60 dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded font-mono">
                  Browser CDP
                </span>
              </div>

              <div className="p-5 space-y-3 text-[11px] text-neutral-700 dark:text-neutral-300">
                <div className="text-neutral-500">{t("vb.comment")}</div>
                <div className="text-emerald-400">{t("vb.auth")}</div>
                <div className="text-neutral-300">{t("vb.scan")}</div>
                <div className="text-neutral-300">{t("vb.analyze")}</div>
                <div className="p-3 bg-slate-50 dark:bg-white/[0.03] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-lg text-neutral-800 dark:text-neutral-200 font-sans text-xs">
                  {t("vb.summary")}
                </div>
                <div className="text-neutral-500 text-[10px] pt-1">
                  Session duration: 42s • Epistemic receipt stored in Outline KB
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                {t("tools.badge")}
              </span>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal leading-tight text-balance">
                {t("tools.title")}
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                {t("tools.subtitle")}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                {["Zendesk", "GitHub", "Linear", "Jira", "Notion", "PostgreSQL", "Telegram", "Figma"].map((tool) => (
                  <span key={tool} className="text-xs font-mono bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-[var(--border-subtle)] px-3 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Show a Bot how it's done & Bots get smarter over time */}
      <section id="workflow" className="py-20 sm:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Show a Bot how it's done */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-7 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-medium">
                  {t("routines.badge")}
                </span>
                <h3 className="font-newsreader text-2xl sm:text-3xl text-neutral-900 dark:text-white font-normal mt-2 mb-3 text-balance">
                  {t("routines.title")}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  {t("routines.subtitle")}
                </p>
              </div>

              <div className="bg-white dark:bg-[#08090d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-lg p-4 font-mono text-xs text-neutral-700 dark:text-neutral-300 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-neutral-400 border-b border-[var(--border-subtle)] pb-2 text-[11px]">
                  <span>{t("routines.demoTitle")}</span>
                  <span className="text-[#f8a87c]">{t("routines.demoStatus")}</span>
                </div>
                <div className="text-neutral-400 text-[11px]">{t("routines.step1")}</div>
                <div className="text-neutral-400 text-[11px]">{t("routines.step2")}</div>
                <div className="text-emerald-400 text-[11px] pt-1">{t("routines.done")}</div>
              </div>
            </div>

            {/* Bots get smarter over time */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-7 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-medium">
                  {t("memory.badge")}
                </span>
                <h3 className="font-newsreader text-2xl sm:text-3xl text-neutral-900 dark:text-white font-normal mt-2 mb-3 text-balance">
                  {t("memory.title")}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  {t("memory.subtitle")}
                </p>
              </div>

              <div className="bg-white dark:bg-[#08090d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-lg p-4 font-mono text-xs text-neutral-700 dark:text-neutral-300 space-y-2 shadow-xs">
                <div className="text-neutral-300 leading-relaxed text-[11px]">
                  "Acme replied on pricing, same thread as last quarter. I already had the context, so I answered without waiting on you."
                </div>
                <div className="text-emerald-400 text-[11px] pt-2 border-t border-[var(--border-subtle)]">
                  ✓ Updated shared memory for: Account Manager & Sales Bot
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Connect the Bots (Multi-Agent Thread) */}
      <section id="hierarchy" className="py-20 sm:py-28 border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              {t("hierarchy.badge")}
            </span>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal mt-3 text-balance">
              {t("hierarchy.title")}
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
              {t("hierarchy.subtitle")}
            </p>
          </div>

          <div className="bg-white dark:bg-[#090b10] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl p-5 sm:p-8 max-w-3xl mx-auto space-y-3 font-mono text-xs shadow-sm dark:shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-[var(--border-subtle)] text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500 font-bold">01</span>
              <strong className="text-neutral-900 dark:text-white shrink-0">{t("collab.salesBot")}</strong>
              <span className="text-neutral-400 truncate">{t("collab.salesMsg")}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-[var(--border-subtle)] text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500 font-bold">02</span>
              <strong className="text-neutral-900 dark:text-white shrink-0">{t("collab.finBot")}</strong>
              <span className="text-neutral-400 truncate">{t("collab.finMsg")}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-[var(--border-subtle)] text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500 font-bold">03</span>
              <strong className="text-neutral-900 dark:text-white shrink-0">{t("collab.chiefBot")}</strong>
              <span className="text-neutral-400 truncate">{t("collab.chiefMsg")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Give each Bot a job - Interactive Dynamic Workbench */}
      <section id="bots" className="py-20 sm:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl mb-10 sm:mb-14">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              {t("roles.badge")}
            </span>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal mt-3 text-balance">
              {t("roles.title")}
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
              {t("roles.subtitle")}
            </p>
          </div>

          {/* Intelligent, Lean Index & Category Filter */}
          <div className="flex flex-col gap-3 mb-8 sm:mb-10">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {["All", "Engineering", "Infrastructure", "Growth"].map((grp) => {
                const isSelected = selectedRoleGroup === grp;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setSelectedRoleGroup(grp);
                      const matching = AGENT_ROLES.filter((r) => grp === "All" || r.category === grp);
                      if (matching.length > 0 && !matching.some((m) => m.id === activeRole.id)) {
                        setActiveRole(matching[0]);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#f8a87c] text-black font-bold shadow-md shadow-[#f8a87c]/20"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/5"
                    }`}
                  >
                    {grp}
                  </button>
                );
              })}
            </div>

            {/* Role Tab Selector */}
            <div
              ref={roleScrollRef}
              className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
            >
              {AGENT_ROLES.filter((role) => selectedRoleGroup === "All" || role.category === selectedRoleGroup).map((role) => {
                const active = role.id === activeRole.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      triggerHaptic();
                      setActiveRole(role);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap border ${
                      active
                        ? "bg-[#f8a87c]/15 text-[#f8a87c] border-[#f8a87c]/40 dark:bg-white dark:text-black dark:border-white font-semibold shadow-sm"
                        : "bg-white dark:bg-[#0b0e14] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] hover:text-neutral-900 dark:hover:text-white border-neutral-200 dark:border-[var(--border-subtle)] shadow-2xs"
                    }`}
                  >
                    <Icon size={13} className="shrink-0" />
                    <span>{role.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Workbench: Desktop Frame & Simulated Execution Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left: Role Specification */}
            <div className="lg:col-span-5 rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 shadow-sm dark:shadow-none sm:p-7 space-y-4">
              <div className="inline-block text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-white/[0.04] px-2.5 py-1 rounded">
                {activeRole.tag}
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{activeRole.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">{activeRole.headline}</p>
              <p className="text-xs text-neutral-400 leading-relaxed">{activeRole.description}</p>

              <div className="rounded-lg border border-neutral-200 dark:border-[var(--border-subtle)] bg-neutral-100/80 dark:bg-black/30 p-3">
                <div className="text-[11px] font-mono text-neutral-500 mb-1">{t("roles.exampleTask")}</div>
                <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">“{activeRole.promptExample}”</p>
              </div>

              <div className="pt-2">
                <div className="text-[11px] font-mono text-neutral-500 mb-2">{t("roles.authorizedToolchain")}</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.tools.map((t) => (
                    <span key={t} className="text-[11px] font-mono bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200 dark:border-[var(--border-subtle)] px-2.5 py-1 rounded text-neutral-700 dark:text-neutral-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100/60 dark:bg-white/[0.02] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-lg p-2.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{activeRole.status}</span>
                </div>
              </div>
            </div>

            {/* Right: Realistic Application Window Frame */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl dark:shadow-2xl overflow-hidden font-mono text-xs">
              {/* Window Bar */}
              <div className="h-10 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between text-neutral-500 dark:text-neutral-400 select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="ml-1.5 text-[11px] text-neutral-700 dark:text-neutral-300 truncate font-mono">{activeRole.previewData.file}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse hidden sm:inline-block" />
                  <span className="text-[10px] text-neutral-600 dark:text-neutral-400 bg-neutral-200/60 dark:bg-white/[0.06] border border-neutral-300/60 dark:border-white/[0.08] px-2 py-0.5 rounded shrink-0 font-mono">
                    {activeRole.previewData.action}
                  </span>
                </div>
              </div>

              {/* Execution Stream Logs */}
              <div className="p-5 space-y-2.5 text-[11px]">
                {activeRole.previewData.logs.slice(0, visibleLogs).map((log, idx) => (
                  <div key={`${activeRole.id}-${replayKey}-${idx}`} className="flex items-start gap-2.5 leading-relaxed animate-[fadeIn_.25s_ease-out]">
                    <span className="text-neutral-600 select-none shrink-0">{log.time}</span>
                    <span className={log.ok ? "text-neutral-800 dark:text-neutral-200" : "text-amber-600 dark:text-amber-400"}>
                      {log.text}
                    </span>
                  </div>
                ))}
                {visibleLogs < activeRole.previewData.logs.length ? (
                  <div className="flex items-center gap-2 text-neutral-500" aria-live="polite">
                    <span className="inline-block h-3 w-1.5 bg-neutral-400 animate-pulse" />
                    <span>{t("landing.working")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setReplayKey((k) => k + 1);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors text-[11px] font-mono cursor-pointer"
                    >
                      <span>{t("landing.replayRun")}</span>
                    </button>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {t("landing.turnCompleted")}
                    </span>
                  </div>
                )}
              </div>

              {/* Verified Metrics Footer */}
              <div className="h-11 bg-slate-50 dark:bg-[#0b0e14] border-t border-neutral-200 dark:border-[var(--border-subtle)] px-5 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-4">
                  {Object.entries(activeRole.previewData.metrics).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <span className="text-neutral-500 capitalize">{k}:</span>
                      <span className="text-neutral-900 dark:text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={appTaskUrl(activeRole.promptExample)}
                  className="text-[#f8a87c] hover:underline flex items-center gap-1 font-sans text-xs font-medium shrink-0"
                >
                  {t("roles.tryTask")} <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing Section: Clean Tiers */}
      <section id="pricing" className="py-20 sm:py-28 border-b border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl lg:max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              {t("pricing.badge")}
            </span>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal mt-3 text-balance">
              {t("pricing.title")}
            </h2>
            <p className="mt-3 text-neutral-400 text-sm sm:text-base leading-relaxed">
              Predictable subscription tiers with dedicated compute and weekly usage included.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-7 flex flex-col justify-between border transition-all ${
                  plan.name === "Super"
                    ? "bg-white dark:bg-[var(--bg-card)] border-neutral-300 dark:border-white/20 shadow-xl relative"
                    : "bg-slate-50/70 dark:bg-[#080a0f] border-neutral-200 dark:border-[var(--border-subtle)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">{plan.name}</h3>
                    {plan.name === "Super" && (
                      <span className="text-[9px] font-mono font-bold uppercase bg-white text-black px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-neutral-500 font-mono">{plan.period}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-6 leading-relaxed">{plan.description}</p>

                  <div className="border-t border-[var(--border-subtle)] pt-6 space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check size={14} className="text-neutral-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/app"
                  className={`w-full py-2.5 rounded-full text-xs font-semibold text-center transition-all ${
                    plan.name === "Super"
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-neutral-100 dark:bg-white/[0.06] text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-white/[0.12] border border-neutral-200 dark:border-[var(--border-subtle)]"
                  }`}
                >
                  Get {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQs Section */}
      <section id="faq" className="py-20 sm:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              {t("faq.badge")}
            </span>
            <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal mt-3 text-balance">
              {t("faq.title")}
            </h2>
            <p className="mt-2.5 text-neutral-400 text-xs sm:text-sm">
              Everything you need to know about Skyer architecture, safety, and cloud execution.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setOpenFaq(isOpen ? null : idx);
                    }}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-medium text-white hover:text-neutral-200 transition-colors cursor-pointer gap-3"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={15} className={`text-neutral-500 shrink-0 transition-transform ${isOpen ? "rotate-180 text-white" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-neutral-400 leading-relaxed border-t border-[var(--border-subtle)] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. Final CTA: Meet your first Bot */}
      <section id="deploy" className="py-24 sm:py-32 text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 relative z-10">
          <h2 className="font-newsreader text-3xl sm:text-5xl md:text-6xl text-neutral-900 dark:text-white font-normal text-balance">
            {(() => {
              const ctaText = t("cta.title") || "Start with your first Skyer AI teammate.";
              if (ctaText.includes("Skyer")) {
                const parts = ctaText.split("Skyer");
                return (
                  <>
                    {parts[0]}
                    <span className="relative inline-block font-semibold">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 drop-shadow-[0_0_25px_rgba(248,168,124,0.4)]">
                        Skyer
                      </span>
                    </span>
                    {parts.slice(1).join("Skyer")}
                  </>
                );
              }
              return ctaText;
            })()}
          </h2>
          <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            An AI teammate you can trust to get work done. Deploy in parallel 24/7 with verifiable execution receipts.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/app"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-white text-black hover:bg-neutral-200 px-8 text-sm font-semibold transition-all active:scale-98"
            >
              {t("cta.getStarted")}
            </Link>
            <Link
              to="/docs"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] px-8 text-sm font-medium text-white transition-all active:scale-98"
            >
              {t("cta.readDocs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
