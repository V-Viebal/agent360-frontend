import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Terminal,
  ArrowRight,
  Users,
  GitPullRequest,
  Shield,
  Radio,
  Check,
  CheckCircle2,
  Play,
  Pause,
  ChevronDown,
  Monitor,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  GitBranch,
  Bot,
  Zap,
  Lock,
  Workflow,
  Sparkles,
  RefreshCw,
  Server,
  Code2,
} from "lucide-react";


// Enterprise-grade Hierarchical Process Storyboard
const HIERARCHY_STEPS = [
  {
    role: "Lead Manager Agent",
    type: "Planning & Delegation",
    badge: "Manager (Qwen 72B)",
    icon: Users,
    color: "text-[#ff7a00]",
    bg: "bg-[#ff7a00]/10",
    border: "border-[#ff7a00]/30",
    task: "Objective: 'Implement Multi-Tenant Row-Level Security for Postgres and verify with live penetration test.'",
    action: "Decomposes intent into 3 atomic workstreams; delegates tasks to specialized worker bots via ACP protocol.",
    receipt: "Plan Ledger Revision #4 signed (SHA256 verified)",
  },
  {
    role: "SWE Worker Agent",
    type: "Autonomous Code Mutation",
    badge: "Worker (DeepSeek-Coder)",
    icon: Code2,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    task: "Apply migration scripts for PostgreSQL RLS policies and update EF Core DbContext filters.",
    action: "Generates DDL SQL, runs dotnet ef migrations, and writes unit tests validating tenant isolation.",
    receipt: "12/12 isolation tests PASS on local sandbox",
  },
  {
    role: "Security QA Worker Agent",
    type: "Adversarial Penetration & Verification",
    badge: "Worker (Qwen 14B + Tools)",
    icon: Shield,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    task: "Attempt cross-tenant IDOR attack using simulated JWT tokens from unauthorized org.",
    action: "Executes 48 automated attack vectors against localhost API endpoints; confirms HTTP 403 Forbidden on all breaches.",
    receipt: "Audit pass: 0 data leakage vectors found",
  },
  {
    role: "Lead Manager Agent",
    type: "Synthesize & Sign-off Gate",
    badge: "Manager Review",
    icon: GitPullRequest,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    task: "Aggregate receipts, generate cryptographic delivery bundle, and request Human Principal authorization.",
    action: "Creates GitHub PR #42 with verifiable receipts; sends Telegram notification to tech lead for 1-click merge.",
    receipt: "Delivered to Human Gate with complete evidence",
  },
];

// Distinct Agent Roles inspired by x.ai/bot "Give each Bot a job"
const AGENT_ROLES = [
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
      "[agent360:swe] Pulling latest main branch...",
      "[agent360:swe] Applying diff to auth_provider.py & routes.ts",
      "[agent360:swe] Running Playwright E2E auth test: 14/14 PASS",
      "[agent360:swe] Screenshot artifact saved to .tmp/auth-verify.png (SHA256 verified)",
      "[agent360:swe] Ready for human code review.",
    ],
  },
  {
    id: "sre",
    title: "SRE & Fleet Sentinel",
    tag: "Operations",
    icon: Server,
    headline: "Heals node failures, recovers crashed containers, audits disk pressure.",
    description:
      "Monitors Beszel, Guardian, and VPS hypervisors 24/7. Detects D-state locks or out-of-memory incidents and restarts isolated microservices before downtime occurs.",
    tools: ["SSH Bridges", "Beszel Agent", "Coolify API", "Systemd"],
    status: "Active • Monitoring 8 VPS nodes (1st–7th, storage1)",
    promptExample: "Audit memory and 9p mount pressure on node 6th and drain unhealthy sidecars.",
    terminalLog: [
      "[agent360:sre] Fleet health heartbeat: 8/8 nodes connected",
      "[agent360:sre] Node 6th RAM pressure warning: 89% detected in sidecar-eval",
      "[agent360:sre] Executing graceful recycle of container qwenpaw-eval",
      "[agent360:sre] Health probe HTTP 200 OK restored in 420ms.",
    ],
  },
  {
    id: "qa",
    title: "Vision QA & Accessibility",
    tag: "Quality Assurance",
    icon: Monitor,
    headline: "Pixel-level UI verification with WCAG luminance & settled motion checks.",
    description:
      "Drives dedicated Chromium CDP sidecars, inspects DOM computed styles, detects unsettled CSS loaders, audits color contrast ratios, and rejects fake completion.",
    tools: ["Chrome DevTools MCP", "WCAG 2.1 Engine", "Pixel Diff"],
    status: "Active • Evaluating responsive routes on desktop & mobile",
    promptExample: "Verify contrast ratio and responsive layout of landing page on viewport 1440x900.",
    terminalLog: [
      "[agent360:qa] Navigating to http://127.0.0.1:4200/...",
      "[agent360:qa] Pixel settle check: delta < 0.01% over 400ms (settled)",
      "[agent360:qa] Contrast audit: 24 text nodes evaluated, 0 below 4.5:1 ratio",
      "[agent360:qa] Epistemic status: OBSERVED (Authoritative visual report emitted)",
    ],
  },
  {
    id: "researcher",
    title: "Market & Knowledge Agent",
    tag: "Research",
    icon: Database,
    headline: "Synthesizes unstructured sources into single-source-of-truth knowledge bases.",
    description:
      "Reads live documentation, cross-examines GitHub PRs, distills technical specs, and projects synchronized card proposals to collaboration boards.",
    tools: ["KB MCP Server", "Exa Web Research", "MinIO S3"],
    status: "Active • Reconciling architecture hub revision 422",
    promptExample: "Summarize recent API breaking changes and sync delivery state to KB Hub.",
    terminalLog: [
      "[agent360:research] Querying upstream QwenPaw release diffs v2.2.0 -> v2.2.1...",
      "[agent360:research] Identified 3 architectural enhancements in ReMe memory layer",
      "[agent360:research] Updating canonical project documentation with readback token",
      "[agent360:research] Synchronized KB Hub ID: cf602cb0-b8a3-479e-9868-29e194f05c49",
    ],
  },
];

// Interactive Routine Steps (Show how it's done)
const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Natural Language Assignment",
    desc: "Instruct your bots via Web, Element, Telegram, or Discord just like senior teammates.",
    highlight: "Multi-channel Bridge",
  },
  {
    step: "02",
    title: "Autonomous ACP Dispatch",
    desc: "Lead orchestrator breaks the goal into specialized tasks and dispatches to SWE, QA, or SRE bots.",
    highlight: "Agent Communication Protocol",
  },
  {
    step: "03",
    title: "Evidence-Backed Execution",
    desc: "Bots execute in kernel sandboxes, producing terminal logs, DOM screenshots, and unit test receipts.",
    highlight: "Append-only Ledger",
  },
  {
    step: "04",
    title: "Human Gate & Rollback",
    desc: "Sensitive mutations trigger authorization gates. Work is only complete when verified by receipts.",
    highlight: "Fail-closed Security",
  },
];

// FAQs matching x.ai/bot enterprise standard
const FAQS = [
  {
    q: "How is Agent360 different from traditional chat assistants?",
    a: "Traditional AI assistants only output speculative text inside a chat container. Agent360 instances operate persistent sandboxed Linux environments, interact with real developer tools (terminals, browsers, databases), run in parallel 24/7, and never claim success without authoritative verification receipts.",
  },
  {
    q: "Can multiple Agent360 bots collaborate on one complex project?",
    a: "Yes. Using ACP (Agent Communication Protocol) and local event streaming, a Lead Architect Bot can delegate code modifications to a Fullstack SWE Bot while simultaneously dispatching a Vision QA Bot to test the UI and an SRE Sentinel Bot to audit server metrics.",
  },
  {
    q: "Where does Agent360 run and is proprietary data secured?",
    a: "Agent360 deploys entirely within your private infrastructure, on-premise servers, or isolated Coolify/Docker environments. All persistent memory is stored in local Markdown files and project-owned PostgreSQL databases—completely isolated from public AI training datasets.",
  },
  {
    q: "How does Agent360 enforce 'No Fake Done' (Integrity Discipline)?",
    a: "Agent360 implements strict epistemic contracts: claims must be marked as 'observed', 'inferred', or 'unknown'. An agent is structurally blocked from reporting completion unless supported by real exit codes, pixel-settled visual diffs, and health readback receipts.",
  },
  {
    q: "How does Agent360 integrate with IAM360 authority?",
    a: "Agent360 separates identity from execution. IAM360 manages Organization Cells, Identity Cells, policy decisions, and approvals. Agent360 references these policies via cryptographic hashes—if an Identity Cell is revoked, all active bot deployments halt automatically.",
  },
];

export function LandingPage() {
  const [activeRole, setActiveRole] = useState(AGENT_ROLES[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeHierarchyStep, setActiveHierarchyStep] = useState(0);

  // Live API status check for Console Mockup
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [liveSkillsCount, setLiveSkillsCount] = useState<number | null>(null);

  useEffect(() => {
    // Check if local Agent360.API backend is reachable
    const checkLiveBackend = async () => {
      setIsConnecting(true);
      try {
        const res = await fetch("/api/agents/skills");
        if (res.ok) {
          const data = await res.json();
          setIsLiveConnected(true);
          setLiveSkillsCount(Array.isArray(data) ? data.length : 12);
        } else {
          setIsLiveConnected(false);
        }
      } catch {
        setIsLiveConnected(false);
      } finally {
        setIsConnecting(false);
      }
    };
    checkLiveBackend();
  }, []);

  // Auto-cycle roles if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveRole((curr) => {
        const nextIndex = (AGENT_ROLES.findIndex((r) => r.id === curr.id) + 1) % AGENT_ROLES.length;
        return AGENT_ROLES[nextIndex];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="pt-16 overflow-hidden">
      {/* Announcement Bar */}
      <div className="border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-4 py-2.5 text-center text-xs tracking-wide text-neutral-400">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#ff7a00] animate-pulse" />
          <strong className="font-semibold text-white">Agent360 v2.2.1 Control Plane</strong>
          <span className="text-neutral-500">•</span>
          <span>Next-gen autonomous AI teammates for enterprise infrastructure & engineering</span>
          <a href="#bots" className="ml-2 font-medium text-[#ff7a00] hover:underline inline-flex items-center gap-0.5">
            Explore Bots <ArrowRight size={12} />
          </a>
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-36 border-b border-white/[0.08]">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#ff7a00]/12 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-mono text-neutral-300 backdrop-blur-md mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Autonomous AI Teammates That Finish The Work</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-newsreader text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
          >
            Meet <span className="italic text-[#ff7a00] font-normal">Agent360</span>.
            <br />
            AI teammates you can give real work to.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-neutral-400 font-normal leading-relaxed"
          >
            Agent360 bots have their own persistent Linux environments, use developer tools just like you do, collaborate in parallel 24/7, and come back with verified finished work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#deploy"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff7a00] px-8 text-sm font-medium text-black transition-all hover:bg-[#ff8f26] hover:shadow-[0_0_28px_rgba(255,122,0,0.4)] active:scale-98"
            >
              Deploy Agent360 Bot
            </a>
            <a
              href="#architecture"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 active:scale-98"
            >
              View System Architecture
            </a>
          </motion.div>

          {/* Interactive Live Teammate Console Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-16 sm:mt-20 rounded-2xl border border-white/15 bg-[#0d111a]/95 backdrop-blur-xl p-2 sm:p-4 shadow-2xl text-left max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 text-neutral-300 font-sans font-medium">agent360-cluster-runtime // active session</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                  isLiveConnected
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-white/5 text-neutral-400 border-white/10"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isLiveConnected ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"}`} />
                  <span>{isLiveConnected ? `API Live (${liveSkillsCount} skills active)` : "Sandbox Mock Mode"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="hidden sm:inline">3 AI Teammates Working in Parallel</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-black/40 rounded-xl mt-2 font-mono text-xs">
              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-neutral-300"><Code2 size={13} className="text-[#ff7a00]" /> Fullstack SWE</span>
                  <span className="text-emerald-400 text-[11px] bg-emerald-400/10 px-1.5 py-0.5 rounded">running</span>
                </div>
                <div className="text-white font-medium truncate">auth/logto-integration.ts</div>
                <div className="text-neutral-500 mt-2 text-[11px]">Building bundle & running 18 tests...</div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-neutral-300"><Monitor size={13} className="text-blue-400" /> Vision QA</span>
                  <span className="text-blue-400 text-[11px] bg-blue-400/10 px-1.5 py-0.5 rounded">observing</span>
                </div>
                <div className="text-white font-medium truncate">Chromium CDP @ :9222</div>
                <div className="text-neutral-500 mt-2 text-[11px]">Checking WCAG 2.1 contrast (4.5:1 pass)</div>
              </div>

              <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between text-neutral-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-neutral-300"><Server size={13} className="text-amber-400" /> SRE Sentinel</span>
                  <span className="text-amber-400 text-[11px] bg-amber-400/10 px-1.5 py-0.5 rounded">guarding</span>
                </div>
                <div className="text-white font-medium truncate">Fleet Node 6th & 7th Health</div>
                <div className="text-neutral-500 mt-2 text-[11px]">WSL/9P pressure probe: normal</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section 1: Message Bots like teammates */}
      <section className="py-24 border-b border-white/[0.08] relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] mb-3">Human-in-the-loop</div>
            <h2 className="font-newsreader text-3xl sm:text-4xl text-white font-semibold leading-tight">
              Message Bots like teammates.
            </h2>
            <p className="mt-4 text-neutral-400 text-base leading-relaxed">
              Assign tasks to Agent360 just like you would a senior colleague on Telegram, Element, Discord, or desktop. AI teammates take entire projects from start to end, preserve contextual memory across weeks, and reach out only when approval or high-level decisions are required.
            </p>

            <ul className="mt-8 space-y-3.5 font-sans text-sm text-neutral-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#ff7a00] shrink-0 mt-0.5" />
                <span><strong>Persistent Memory (ReMe):</strong> Conversations and execution logs naturally distill into structured Markdown knowledge.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#ff7a00] shrink-0 mt-0.5" />
                <span><strong>Kernel-Level Sandbox:</strong> File Guards and Tool Guards block hazardous commands before execution.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#ff7a00] shrink-0 mt-0.5" />
                <span><strong>Parallel Execution 24/7:</strong> Keep work moving even when your laptop is completely closed.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-6 shadow-xl relative">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#ff7a00] to-amber-200 flex items-center justify-center text-black font-bold">
                360
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Agent360 Lead Orchestrator</div>
                <div className="text-xs text-neutral-500 font-mono">ACP Protocol • Connected to Telegram & Web</div>
              </div>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 text-neutral-300">
                <span className="text-neutral-500 font-semibold block mb-1 font-mono text-[10px]">YOU:</span>
                Please upgrade the landing page to support the new dark theme standard and verify there are no WCAG contrast failures.
              </div>

              <div className="p-3.5 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 text-neutral-200">
                <span className="text-[#ff7a00] font-semibold block mb-1 font-mono text-[10px]">AGENT360:</span>
                Got it. I have spawned <strong>SWE Agent</strong> to implement the Tailwind CSS palette and <strong>Vision QA</strong> to run automated headless contrast checks.
                <div className="mt-2.5 pt-2 border-t border-white/10 font-mono text-[11px] text-neutral-400 space-y-1">
                  <div>✓ Palette updated in index.css</div>
                  <div>✓ 181 runtime tests passed</div>
                  <div>✓ Visual report: 0 contrast violations observed</div>
                  <div className="text-emerald-400 font-medium">Ready for your final sign-off.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Give each Bot a job (Interactive Role Showcase) */}
      <section id="bots" className="py-24 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] mb-3">Role Specialization</div>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-white font-semibold">
              Give each Bot a specialized job.
            </h2>
            <p className="mt-4 text-neutral-400 text-base">
              Don’t force one generic prompt to handle code, security, QA, and operations. Agent360 provisions dedicated bots with specialized skills, specific tools, and separate memory.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {AGENT_ROLES.map((role) => {
              const active = role.id === activeRole.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role);
                    setIsPlaying(false);
                  }}
                  className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? "bg-[#ff7a00] text-black font-semibold shadow-[0_0_16px_rgba(255,122,0,0.3)]"
                      : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  <Icon size={14} />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Role Card & Terminal Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#0d111a] p-6 sm:p-8">
              <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/10 px-2.5 py-0.5 rounded-md mb-4">
                {activeRole.tag}
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">{activeRole.title}</h3>
              <p className="text-sm font-medium text-neutral-300 mb-4">{activeRole.headline}</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">{activeRole.description}</p>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="text-xs text-neutral-400 mb-2 font-mono">Provisioned Toolchain:</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.tools.map((tool) => (
                    <span key={tool} className="text-[11px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">{activeRole.status}</span>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#04060a] p-5 sm:p-6 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-neutral-500">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#ff7a00]" />
                  <span>runtime execution stream // {activeRole.id}.log</span>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                  title={isPlaying ? "Pause auto-cycle" : "Resume auto-cycle"}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  <span>{isPlaying ? "Pause cycle" : "Auto-cycle"}</span>
                </button>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-3 rounded-lg mb-4 text-neutral-400">
                <span className="text-neutral-500 block text-[10px] uppercase tracking-wider mb-1">Sample Request</span>
                <span className="text-white font-sans text-xs">"{activeRole.promptExample}"</span>
              </div>

              <div className="space-y-2 text-[12px] leading-relaxed min-h-[160px]">
                {activeRole.terminalLog.map((line, idx) => (
                  <div key={idx} className="text-neutral-300 font-mono flex items-start">
                    <span className="text-neutral-600 select-none mr-2 shrink-0">{idx + 1}</span>
                    <span className={
                      line.includes("PASS") || line.includes("200 OK") || line.includes("OBSERVED")
                        ? "text-emerald-400 font-semibold"
                        : line.includes("warning") || line.includes("warning:")
                        ? "text-amber-400"
                        : "text-neutral-300"
                    }>
                      {line}
                    </span>
                  </div>
                ))}
                {isLiveConnected && (
                  <div className="text-emerald-400/90 font-mono text-[11px] pt-2 border-t border-white/5 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SSE Event Channel: live dispatch connected to /api/agents/console/chat</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Routine & Multi-Agent Orchestration (Show how it's done) */}
      <section id="workflow" className="py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] mb-3">Workflow Automation</div>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-white font-semibold">
              Show a Bot how it’s done once.
            </h2>
            <p className="mt-4 text-neutral-400 text-base">
              Demonstrate a complex multi-step delivery pipeline once. Agent360 records the tools, evidence gates, and rollback policies, converting it into a repeatable routine that runs independently next time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.step} className="rounded-xl border border-white/10 bg-[#0d111a] p-6 hover:border-[#ff7a00]/40 transition-colors relative flex flex-col justify-between">
                <div>
                  <div className="text-2xl font-mono font-bold text-[#ff7a00] mb-3">{step.step}</div>
                  <h4 className="text-base font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/5 text-[11px] font-mono text-[#ff7a00]">
                  {step.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section id="architecture" className="py-24 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ff7a00] mb-3">Core Engineering</div>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-white font-semibold">
              Engineered for Enterprise Authority
            </h2>
            <p className="mt-4 text-neutral-400 text-base">
              A strict boundary model separating identity, execution, and runtime state.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-7 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
                <Cpu size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">Agent Kernel</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                The shared execution engine: planning loops, tool gateways, checkpoint managers, and telemetry. Kernel has no personal identity and is shared across all bot deployments.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-7 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">IAM360 Identity Cells</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every bot binds to an organization cell with clear mandates. Authority, policy evaluation, and revocation are managed strictly through IAM360.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d111a] p-7 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers size={20} />
              </div>
              <h3 className="text-lg font-semibold text-white">QwenPaw Runtime Adapter</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connects bots to lightweight 2B/4B/9B local models or external providers. Swappable runtime adapters ensure zero vendor lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Enterprise-grade Hierarchy Storyboard: Manager Agent & Autonomous AI Team */}
      <section id="hierarchy" className="py-24 border-b border-white/[0.08] bg-[#07090e]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#ff7a00] bg-[#ff7a00]/10 border border-[#ff7a00]/20 px-3 py-1 rounded-full mb-3">
              <Radio size={12} className="animate-pulse text-[#ff7a00]" />
              <span>Hierarchical Process Engine</span>
            </div>
            <h2 className="font-newsreader text-3xl sm:text-5xl text-white font-semibold">
              Manager Agents that lead, review, and verify.
            </h2>
            <p className="mt-4 text-neutral-400 text-base">
              In an autonomous AI workforce, you don’t micromanage individual bots. Assign your high-level goal to a <strong>Manager Agent</strong>, which plans sub-tasks, dispatches work to specialized worker bots, reviews pull requests, and guarantees no false completions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Steps Timeline Navigation */}
            <div className="lg:col-span-5 space-y-3">
              {HIERARCHY_STEPS.map((step, idx) => {
                const isSelected = activeHierarchyStep === idx;
                const Icon = step.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveHierarchyStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? "bg-white/[0.07] border-[#ff7a00]/60 shadow-[0_0_20px_rgba(255,122,0,0.15)]"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15 text-neutral-400 hover:text-white"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${step.bg} ${step.color} border ${step.border}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-medium text-neutral-400">PHASE 0{idx + 1}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${step.bg} ${step.color}`}>
                          {step.badge}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white truncate">{step.role}</div>
                      <div className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{step.type}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Detail Card & Verified Evidence Output */}
            <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#0d111a] p-6 sm:p-8">
              {(() => {
                const current = HIERARCHY_STEPS[activeHierarchyStep];
                const Icon = current.icon;
                return (
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${current.bg} ${current.color} border ${current.border}`}>
                          <Icon size={22} />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-neutral-500 uppercase">Execution Stage 0{activeHierarchyStep + 1}</div>
                          <div className="text-lg font-semibold text-white">{current.role}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-mono px-3 py-1 rounded-full border ${current.bg} ${current.color} ${current.border}`}>
                        {current.type}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">Delegated Scope</div>
                        <div className="text-sm text-neutral-200 leading-relaxed font-sans">{current.task}</div>
                      </div>

                      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                        <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1.5">Autonomous Action</div>
                        <div className="text-xs text-neutral-300 leading-relaxed font-mono">{current.action}</div>
                      </div>

                      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-xs text-emerald-300 font-mono">
                          <Check size={16} className="text-emerald-400 shrink-0" />
                          <span className="font-medium">Authoritative Receipt:</span>
                          <span className="text-emerald-200 truncate">{current.receipt}</span>
                        </div>
                        <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold shrink-0">
                          OBSERVED
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faq" className="py-24 border-b border-white/[0.08]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-newsreader text-3xl sm:text-4xl text-white font-semibold">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-neutral-400 text-sm">
              Everything you need to know about Agent360 architecture, safety, and deployment.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-white/10 bg-[#0d111a] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-medium text-white hover:text-[#ff7a00] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className={`text-neutral-400 transition-transform ${isOpen ? "rotate-180 text-[#ff7a00]" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section id="deploy" className="py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#ff7a00]/10 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 relative z-10">
          <h2 className="font-newsreader text-3xl sm:text-5xl text-white font-semibold">
            Ready to deploy your first AI teammate?
          </h2>
          <p className="mt-4 text-neutral-400 text-base max-w-xl mx-auto">
            Join engineering teams automating fullstack delivery, infrastructure operations, and QA verification with Agent360.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/agentscope-ai/QwenPaw"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#ff7a00] px-8 text-sm font-medium text-black transition-all hover:bg-[#ff8f26] hover:shadow-[0_0_30px_rgba(255,122,0,0.4)] active:scale-98"
            >
              Get Started with Agent360
            </a>
            <a
              href="#architecture"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-98"
            >
              Read Architecture Contract
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
