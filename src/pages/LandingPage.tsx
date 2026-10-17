import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

// Distinct Agent Roles matching x.ai/bot "Give each Bot a job"
const AGENT_ROLES = [
  {
    id: "sales",
    title: "Sales Outbound",
    tag: "Revenue & Growth",
    icon: Sparkles,
    headline: "Generate pipeline overnight with intent scoring.",
    description:
      "Researches accounts, scores contacts with intent, drafts email and LinkedIn in your voice, and leaves a verified review list for you to approve.",
    tools: ["Apollo MCP", "LinkedIn Graph", "Gmail API", "CRM Sync"],
    status: "Active • 42 qualified accounts identified",
    promptExample: "Generate 20 qualified outbound leads in enterprise SaaS and draft hyper-personalized intro sequences.",
    terminalLog: [
      "[skyer:sales] Querying intent data across target accounts...",
      "[skyer:sales] Found 42 VP Engineering contacts with hiring signals.",
      "[skyer:sales] Drafting personalized cold email sequences in your voice.",
      "[skyer:sales] Staging review list in CRM: 42 drafts ready for your 1-click sign-off.",
    ],
  },
  {
    id: "swe",
    title: "Fullstack Engineer",
    tag: "Engineering",
    icon: Code2,
    headline: "Autonomously implement features, fix bugs, and verify diffs.",
    description:
      "Clones repositories, inspects AST, runs local test suites, captures live headless browser screenshots, and commits clean verified changes.",
    tools: ["Git CLI", "VS Code CDP", "Docker", "Vitest", "Postgres"],
    status: "Active • Running tests on branch codex/feature-auth",
    promptExample: "Implement OAuth Google login with Logto and verify headless login flow.",
    terminalLog: [
      "[skyer:swe] Pulling latest main branch...",
      "[skyer:swe] Applying diff to auth_provider.py & routes.ts",
      "[skyer:swe] Running Playwright E2E auth test: 14/14 PASS",
      "[skyer:swe] Screenshot artifact saved to .tmp/auth-verify.png (SHA256 verified)",
      "[skyer:swe] Ready for human code review.",
    ],
  },
  {
    id: "sre",
    title: "System Sentinel",
    tag: "Operations",
    icon: Server,
    headline: "Heals node failures, recovers crashed containers, audits resource pressure.",
    description:
      "Monitors Beszel, Guardian, and hypervisors 24/7. Detects D-state locks or memory saturation and executes graceful container restarts before downtime occurs.",
    tools: ["SSH Bridges", "Beszel Telemetry", "Coolify PaaS", "Systemd Sentinel"],
    status: "Active • Guarding production cluster nodes",
    promptExample: "Audit memory and mount pressure on target node and drain unhealthy sidecars.",
    terminalLog: [
      "[skyer:sre] Cluster health heartbeat: All production nodes connected.",
      "[skyer:sre] Node 6th RAM pressure warning: 89% detected in sidecar-eval.",
      "[skyer:sre] Executing graceful recycle of container qwenpaw-eval.",
      "[skyer:sre] Health probe HTTP 200 OK restored in 420ms.",
    ],
  },
  {
    id: "qa",
    title: "Vision QA & Accessibility",
    tag: "Quality Engineering",
    icon: Shield,
    headline: "Evaluates layout shifts, contrast ratios, and responsive viewports.",
    description:
      "Uses remote Chrome CDP sessions to inspect the live DOM, measure WCAG relative luminance contrast ratios, and verify layout pixel-settle without false positives.",
    tools: ["Playwright CDP", "WCAG 2.1 Engine", "Pixel Settle Gate"],
    status: "Active • Evaluating responsive routes on desktop & mobile",
    promptExample: "Verify contrast ratio and responsive layout of landing page on viewport 1440x900.",
    terminalLog: [
      "[skyer:qa] Navigating to http://127.0.0.1:4200/...",
      "[skyer:qa] Pixel settle check: delta < 0.01% over 400ms (settled).",
      "[skyer:qa] Contrast audit: 24 text nodes evaluated, 0 below 4.5:1 ratio.",
      "[skyer:qa] Epistemic status: OBSERVED (Authoritative visual report emitted).",
    ],
  },
  {
    id: "research",
    title: "Knowledge & Researcher",
    tag: "Research & Synthesis",
    icon: Layers,
    headline: "Extracts research, monitors releases, and updates Outline KB Hub.",
    description:
      "Conducts web investigations, reads API change logs, synthesizes technical documentation, and synchronizes project knowledge bases with verified readback tokens.",
    tools: ["Outline KB API", "Exa Web Search", "MinIO S3", "Deck Projector"],
    status: "Active • Reconciling architecture hub revision 422",
    promptExample: "Summarize recent API breaking changes and sync delivery state to KB Hub.",
    terminalLog: [
      "[skyer:research] Querying upstream QwenPaw release diffs v2.2.0 -> v2.2.1...",
      "[skyer:research] Identified 3 architectural enhancements in ReMe memory layer.",
      "[skyer:research] Updating canonical project documentation with readback token.",
      "[skyer:research] Synchronized KB Hub ID: cf602cb0-b8a3-479e-9868-29e194f05c49.",
    ],
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
    badge: "Maximum Performance",
    description: "Uncapped performance with earliest frontier model access.",
    features: [
      "Everything in Super",
      "12x Premium usage quota",
      "Earliest access to all products & models",
      "Multi-tenant IAM360 policy guardrails",
      "Dedicated persistent compute volume",
    ],
  },
];

// FAQs faithfully aligned to x.ai/bot
const FAQS = [
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
  const [activeRole, setActiveRole] = useState(AGENT_ROLES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const roleScrollRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };


  // Auto-cycle through bot roles if not paused
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveRole((prev) => {
        const nextIdx = (AGENT_ROLES.findIndex((r) => r.id === prev.id) + 1) % AGENT_ROLES.length;
        return AGENT_ROLES[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="pt-16 overflow-x-hidden">
      {/* 1. Announcement Bar */}
      <div className="border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-4 py-2 sm:py-2.5 text-center text-xs tracking-wide text-neutral-400">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff7a00] animate-pulse shrink-0" />
          <strong className="font-semibold text-white">Skyer Bot is here</strong>
          <span className="text-neutral-500 hidden sm:inline">•</span>
          <span className="hidden md:inline">Next-gen autonomous AI teammates for enterprise infrastructure</span>
          <a href="#bots" className="font-medium text-[#ff7a00] hover:underline inline-flex items-center gap-0.5 ml-1">
            Explore Bots <ArrowRight size={12} />
          </a>
        </div>
      </div>

      {/* 2. Hero Section: Exactly like x.ai/bot */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 md:pt-32 md:pb-36 border-b border-white/[0.08]">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[600px] md:w-[1100px] h-[300px] sm:h-[450px] md:h-[550px] bg-gradient-to-b from-[#ff7a00]/12 via-transparent to-transparent blur-2xl sm:blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-32 right-1/4 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-blue-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-mono text-neutral-300 backdrop-blur-md mb-6 sm:mb-8 max-w-full truncate"
          >
            <span className="h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">Autonomous AI Teammates That Finish The Work</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-newsreader text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.12] sm:leading-[1.08]"
          >
            Meet <span className="italic text-[#ff7a00] font-normal">Skyer</span> Bot.
            <br />
            AI teammates you can give real work to.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-neutral-400 font-normal leading-relaxed px-2"
          >
            Bots can sign in to your tools, use them just like you do, collaborate in parallel 24/7, and come back with finished work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
          >
            <Link
              to="/app"
              className="w-full sm:w-auto inline-flex h-11 sm:h-12 items-center justify-center rounded-full bg-[#ff7a00] px-7 sm:px-8 text-sm font-semibold text-black transition-all hover:bg-[#ff8f26] hover:shadow-[0_0_28px_rgba(255,122,0,0.4)] active:scale-98"
            >
              Launch Skyer App
            </Link>
            <a
              href="#bots"
              className="w-full sm:w-auto inline-flex h-11 sm:h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 sm:px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-98"
            >
              Explore AI Teammates
            </a>
          </motion.div>
        </div>
      </section>

      {/* 3. Message Bots like teammates */}
      <section className="py-16 sm:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
                Natural Interaction
              </span>
              <h2 className="font-newsreader text-2xl sm:text-3xl md:text-4xl text-white font-semibold mt-3 sm:mt-4">
                Message Bots like teammates.
              </h2>
              <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
                Give tasks to Bots like you would a teammate on desktop or web. Your AI teammates take projects from start to end, keep context on how you work, and reach out only when approval or high-level decisions are needed.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#ff7a00] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-300">Continuous context retention across weeks of project iterations</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#ff7a00] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-300">Signs in to your apps (Zendesk, GitHub, Jira, Notion) automatically</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#ff7a00] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-300">Explicit human approval gates before critical production writes</span>
                </div>
              </div>
            </div>

            {/* Interactive Chat Bubble Preview */}
            <div className="lg:col-span-7 bg-[#0c0d14] border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-[#ff7a00] to-amber-400 p-[1px] shrink-0">
                    <div className="h-full w-full bg-[#07090e] rounded-[11px] flex items-center justify-center">
                      <Bot size={18} className="text-[#ff7a00]" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-white truncate">Skyer Lead Orchestrator</div>
                    <div className="text-[10px] sm:text-xs text-neutral-400 font-mono truncate">Status: Active • Working on your task</div>
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
                  • Online
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-neutral-300">
                  <span className="text-neutral-500 text-[10px] sm:text-xs block mb-1 font-mono">YOU:</span>
                  "Implement the new multi-tenant RLS migration, run the full isolation test suite, and stage the pull request for review."
                </div>

                <div className="bg-[#ff7a00]/10 border border-[#ff7a00]/25 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-neutral-200">
                  <span className="text-[#ff7a00] text-[10px] sm:text-xs block mb-1 font-mono font-semibold">SKYER BOT:</span>
                  I'm on it. I've partitioned the work across specialized teammates:
                  <div className="mt-2.5 sm:mt-3 space-y-1.5 font-mono text-[11px] sm:text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> SWE Worker generated Postgres RLS SQL migration
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Security QA confirmed 14/14 tenant isolation tests PASS
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Created GitHub PR #42 with cryptographic evidence bundle
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#ff7a00]/20 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-emerald-300 font-mono">
                    <span>Ready for your 1-click review.</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">0 Failures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Work with many Bots at once */}
      <section className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#05070c]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
              Parallel Execution
            </span>
            <h2 className="font-newsreader text-2xl sm:text-4xl md:text-5xl text-white font-semibold mt-3 sm:mt-4">
              Work with many Bots at once.
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base">
              Create a Bot, give it a task, and add another when the work grows—one on a project, one on outbound, one on systems. AI teammates work in parallel, collaborate where it makes sense, and keep working 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0e16] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 sm:mb-4">
                  <Code2 size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Bot on Code</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Fullstack SWE Bot works in isolated git worktrees, implements features, runs linters, and captures screenshot proof.
                </p>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] text-blue-400 bg-blue-500/10 p-2 sm:p-2.5 rounded-lg border border-blue-500/20">
                Active • 14 tests passing
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0e16] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 sm:mb-4">
                  <Server size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Bot on Systems</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Sentinel Bot monitors node resource saturation, cleans stale container replicas, and performs automated self-healing.
                </p>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] text-amber-400 bg-amber-500/10 p-2 sm:p-2.5 rounded-lg border border-amber-500/20">
                Guarding • 100% System Health
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#0c0e16] border border-white/10 flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3 sm:mb-4">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Bot on Outbound</h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  Sales Bot investigates target enterprise accounts, qualifies leads with intent signals, and stages emails in your tone.
                </p>
              </div>
              <div className="font-mono text-[10px] sm:text-[11px] text-purple-400 bg-purple-500/10 p-2 sm:p-2.5 rounded-lg border border-purple-500/20">
                Pipeline • 42 qualified leads
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Skyer Bot works where you work */}
      <section className="py-16 sm:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 bg-[#090b12] border border-white/10 rounded-2xl p-4 sm:p-6 relative overflow-hidden order-2 lg:order-1">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-mono text-neutral-400 flex items-center gap-1.5 sm:gap-2 truncate">
                  <Monitor size={14} className="text-[#ff7a00] shrink-0" />
                  <span className="truncate">Virtual Computer // Zendesk</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono bg-white/10 text-neutral-300 px-2 py-0.5 rounded shrink-0">
                  Headless Chrome
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3 font-mono text-[11px] sm:text-xs">
                <div className="text-neutral-500">{"// Skyer authenticates and executes browser actions"}</div>
                <div className="text-emerald-400 break-words">➜ Sign in to Zendesk so I can work the support queue.</div>
                <div className="text-neutral-400 break-words">
                  [browser:cdp] Session attached to tab #2 (support.zendesk.com)
                </div>
                <div className="text-neutral-400">
                  [browser:cdp] Triaged 8 unassigned tickets • 0 escalated
                </div>
                <div className="p-2.5 sm:p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300">
                  ✓ Support queue caught up. 8 customer responses sent.
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
                Native Tool Access
              </span>
              <h2 className="font-newsreader text-2xl sm:text-3xl md:text-4xl text-white font-semibold mt-3 sm:mt-4">
                Skyer Bot works where you work.
              </h2>
              <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base leading-relaxed">
                Log Skyer Bot in once. It uses your apps and websites just like you would, including the tools that are harder to navigate. With a dedicated virtual computer and persistent browser cookies, Bots operate inside real SaaS surfaces.
              </p>
              <div className="mt-5 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
                {["Zendesk", "GitHub", "Linear", "Jira", "Notion", "Postgres", "Telegram", "Figma"].map((tool) => (
                  <span key={tool} className="text-[11px] sm:text-xs font-mono bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-neutral-300">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Show a Bot how it's done & Bots get smarter over time */}
      <section className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#05070c]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Show a Bot how it's done */}
            <div className="p-5 sm:p-8 rounded-2xl bg-[#0c0e16] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#ff7a00] uppercase tracking-wider">Repeatable Routines</span>
                <h3 className="font-newsreader text-xl sm:text-2xl md:text-3xl text-white font-semibold mt-2 mb-3 sm:mb-4">
                  Show a Bot how it’s done.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5 sm:mb-6">
                  Ask a Bot to follow along as you complete a workflow once. It saves it as a routine and runs it on its own next time without requiring instruction.
                </p>
              </div>

              <div className="bg-[#07090e] border border-white/10 rounded-xl p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs text-neutral-300 space-y-2">
                <div className="flex items-center justify-between text-neutral-500 border-b border-white/5 pb-2">
                  <span className="truncate">Weekly Reporting</span>
                  <span className="text-[#ff7a00] shrink-0 text-[10px] sm:text-[11px]">Watching & learning</span>
                </div>
                <div className="text-neutral-400">Step 1: Pull Stripe MRR figures</div>
                <div className="text-neutral-400">Step 2: Generate PostHog active user cohort</div>
                <div className="text-emerald-400">✓ Routine created: Scheduled every Monday 9:00 AM</div>
              </div>
            </div>

            {/* Bots get smarter over time */}
            <div className="p-5 sm:p-8 rounded-2xl bg-[#0c0e16] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#ff7a00] uppercase tracking-wider">Shared Context</span>
                <h3 className="font-newsreader text-xl sm:text-2xl md:text-3xl text-white font-semibold mt-2 mb-3 sm:mb-4">
                  Bots get smarter over time.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-5 sm:mb-6">
                  Bots keep context and learn from each other. Show one a workflow today, hand off the project by Friday. Memory is persisted in your own Outline KB and local storage.
                </p>
              </div>

              <div className="bg-[#07090e] border border-white/10 rounded-xl p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs text-neutral-300 space-y-2">
                <div className="text-neutral-400 leading-relaxed">
                  "Acme replied on pricing, same thread as last quarter. I already had the context, so I answered without waiting on you."
                </div>
                <div className="text-emerald-400 pt-2 border-t border-white/5">
                  ✓ Updated shared memory for: Account Manager & Sales Bot
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Connect the Bots (Multi-Agent collaboration) */}
      <section id="hierarchy" className="py-16 sm:py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
              Multi-Agent Thread
            </span>
            <h2 className="font-newsreader text-2xl sm:text-4xl md:text-5xl text-white font-semibold mt-3 sm:mt-4">
              Connect the Bots.
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base">
              Put a few Bots in the same thread and they pass work between themselves. You watch them take action instead of approving every intermediate step.
            </p>
          </div>

          <div className="bg-[#090b12] border border-white/10 rounded-2xl p-4 sm:p-6 md:p-10 max-w-4xl mx-auto space-y-3 font-mono text-[11px] sm:text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" />
                <strong className="text-white shrink-0">Asking Research…</strong>
              </div>
              <span className="text-neutral-400 truncate">"Synthesizing market pricing comparison across top 5 vendors."</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400 shrink-0" />
                <strong className="text-white shrink-0">Looping in Comms…</strong>
              </div>
              <span className="text-neutral-400 truncate">"Drafting customer announcement memo based on research findings."</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-neutral-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <strong className="text-white shrink-0">Sending to Chief…</strong>
              </div>
              <span className="text-neutral-400 truncate">"Executive summary ready. Plan Ledger Revision #4 verified."</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Give each Bot a job (Interactive Role Showcase) */}
      <section id="bots" className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#05070c]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
              Specialized Roles
            </span>
            <h2 className="font-newsreader text-2xl sm:text-4xl md:text-5xl text-white font-semibold mt-3 sm:mt-4">
              Give each Bot a job.
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base">
              Don’t force one generic prompt to handle code, security, QA, and operations. Skyer provisions dedicated bots with specialized skills, specific tools, and separate memory.
            </p>
          </div>

          {/* Role Filter Pills: Touch-friendly horizontal scroll on mobile, flex-wrap on desktop */}
          <div
            ref={roleScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-0 sm:flex-wrap sm:justify-center mb-8 sm:mb-12 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {AGENT_ROLES.map((role) => {
              const active = role.id === activeRole.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    triggerHaptic(); setActiveRole(role);
                    setIsPlaying(false);
                  }}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                    active
                      ? "bg-[#ff7a00] text-black font-semibold shadow-[0_0_16px_rgba(255,122,0,0.3)]"
                      : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Role Card & Terminal Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <motion.div key={activeRole.id + "-card"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0d111a] p-5 sm:p-8">
              <div className="inline-block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-0.5 rounded-md mb-3 sm:mb-4">
                {activeRole.tag}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">{activeRole.title}</h3>
              <p className="text-xs sm:text-sm font-medium text-neutral-300 mb-3 sm:mb-4">{activeRole.headline}</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-5 sm:mb-6">{activeRole.description}</p>

              <div className="border-t border-white/10 pt-4 mb-5 sm:mb-6">
                <div className="text-[11px] sm:text-xs text-neutral-400 mb-2 font-mono">Provisioned Toolchain:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.tools.map((tool) => (
                    <span key={tool} className="text-[10px] sm:text-[11px] font-mono bg-white/5 border border-white/10 px-2 sm:px-2.5 py-1 rounded text-neutral-300">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 sm:p-3 text-[11px] sm:text-xs text-emerald-300 flex items-center gap-2 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">{activeRole.status}</span>
              </div>
            </motion.div>

            <motion.div key={activeRole.id + "-terminal"} initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#04060a] p-4 sm:p-6 font-mono text-[11px] sm:text-xs text-neutral-300 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-[10px] sm:text-[11px] text-neutral-500">
                <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                  <Terminal size={14} className="text-[#ff7a00] shrink-0" />
                  <span className="truncate">terminal // {activeRole.id}-stream.log</span>
                </div>
                <span className="text-[9px] sm:text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-mono shrink-0">
                  LIVE STREAM
                </span>
              </div>

              <div className="space-y-2 mb-5 sm:mb-6 overflow-x-auto">
                {activeRole.terminalLog.map((log, idx) => (
                  <div key={idx} className="leading-relaxed break-words">
                    <span className="text-neutral-500 select-none mr-2">{idx + 1}</span>
                    <span className={log.includes("PASS") || log.includes("OK") || log.includes("verified") ? "text-emerald-400" : ""}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-3 sm:pt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] sm:text-[11px] text-neutral-500">Live task execution</span>
                <Link
                  to="/app"
                  className="text-xs text-[#ff7a00] hover:underline flex items-center gap-1 font-sans font-medium"
                >
                  Assign to Bot in /app <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 9. Pricing Section: Faithful to x.ai/bot */}
      <section id="pricing" className="py-16 sm:py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
              Transparent Pricing
            </span>
            <h2 className="font-newsreader text-2xl sm:text-4xl md:text-5xl text-white font-semibold mt-3 sm:mt-4">
              Pricing for every team.
            </h2>
            <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base">
              Predictable subscription tiers with dedicated compute and weekly usage included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all ${
                  plan.name === "Super"
                    ? "bg-[#0d101a] border-[#ff7a00]/40 shadow-[0_0_30px_rgba(255,122,0,0.15)] relative"
                    : "bg-[#090b12] border-white/10"
                }`}
              >
                {plan.name === "Super" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff7a00] text-black text-[10px] font-mono font-bold uppercase px-3 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
                <div>
                  <div className="text-base sm:text-lg font-semibold text-white mb-1.5 sm:mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-neutral-500 font-mono">{plan.period}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-5 sm:mb-6 leading-relaxed">{plan.description}</p>

                  <div className="border-t border-white/10 pt-5 sm:pt-6 space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Check size={14} className="text-[#ff7a00] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/app"
                  className={`w-full py-2.5 sm:py-3 rounded-full text-xs font-semibold text-center transition-all ${
                    plan.name === "Super"
                      ? "bg-[#ff7a00] text-black hover:bg-[#ff8f26] shadow-[0_0_20px_rgba(255,122,0,0.3)]"
                      : "bg-white/10 text-white hover:bg-white/20"
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
      <section id="faq" className="py-16 sm:py-24 border-b border-white/[0.08] bg-[#05070c]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-1 rounded-md">
              Knowledge
            </span>
            <h2 className="font-newsreader text-2xl sm:text-3xl md:text-4xl text-white font-semibold mt-3 sm:mt-4">
              Frequently Asked Questions
            </h2>
            <p className="mt-2.5 sm:mt-3 text-neutral-400 text-xs sm:text-sm">
              Everything you need to know about Skyer architecture, safety, and cloud execution.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-white/10 bg-[#0d111a] overflow-hidden">
                  <button
                    onClick={() => { triggerHaptic(); setOpenFaq(isOpen ? null : idx); }}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-xs sm:text-sm font-medium text-white hover:text-[#ff7a00] transition-colors cursor-pointer gap-3"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className={`text-neutral-400 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#ff7a00]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-3">
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
      <section id="deploy" className="py-20 sm:py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff7a00]/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 relative z-10">
          <h2 className="font-newsreader text-2xl sm:text-4xl md:text-5xl text-white font-semibold">
            Meet your first Bot.
          </h2>
          <p className="mt-3 sm:mt-4 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto px-2">
            An AI teammate you can trust to get work done. Deploy in parallel 24/7 with verifiable execution receipts.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/app"
              className="w-full sm:w-auto inline-flex h-11 sm:h-12 items-center justify-center rounded-full bg-[#ff7a00] px-7 sm:px-8 text-sm font-semibold text-black transition-all hover:bg-[#ff8f26] hover:shadow-[0_0_30px_rgba(255,122,0,0.4)] active:scale-98"
            >
              Get started for free
            </Link>
            <Link
              to="/docs"
              className="w-full sm:w-auto inline-flex h-11 sm:h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 sm:px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-98"
            >
              Read Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
