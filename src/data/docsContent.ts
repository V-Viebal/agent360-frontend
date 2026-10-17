export interface DocSection {
  id: string;
  title: string;
  category: string;
  badge?: string;
  summary: string;
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  keyTakeaways: string[];
  sandboxPrompt?: string;
  sandboxOutput?: string[];
}

export const DOCS_SECTIONS: DocSection[] = [
  // 1. Getting Started
  {
    id: "quickstart",
    title: "Quickstart & Overview",
    category: "Getting Started",
    badge: "Core",
    summary:
      "Get up and running with Skyer: an enterprise AI agent workstation that combines Skyer's sandboxed runtime with Enterprise-grade multi-agent orchestration.",
    content: `
### What is Skyer?
Skyer is an enterprise-grade autonomous AI workstation designed to build and operate long-lived AI Teammates. 
Unlike chat-only LLM wrappers, Skyer agents possess persistent Linux working environments, continuous file storage, tool permission guards, and multi-channel communication (Telegram, DingTalk, Feishu, Discord, Web).

### Key Architectural Pillars
- **Agent OS Environment:** Built on Skyer's kernel sandbox. Agents read/write real files, clone git repositories, run test suites, and inspect browser DOMs.
- **Hierarchical AI Workforce (Enterprise-grade):** High-level goals are assigned to Lead Manager Agents who plan sub-tasks, delegate work to specialized Worker Agents (SWE, QA, SRE), and enforce verification before human review.
- **No Fake Done (Integrity Contracts):** Agents are structurally blocked from claiming task completion without authoritative exit codes, pixel settlements, and SHA256 receipts.
- **Multi-Harness Execution:** Seamlessly select between Skyer native agents, OpenAI Codex sessions, or Qoder runners under a single unified governance plane.
    `,
    codeSnippet: {
      language: "bash",
      code: `# 1. Clone your project repository with Skyer overlay
git clone https://github.com/V-Viebal/agent360.git
cd agent360

# 2. Start Skyer API and Web Control Plane
docker compose up -d

# 3. Verify agent status via CLI
curl http://localhost:5000/api/agents/skills`,
    },
    keyTakeaways: [
      "Operates persistent Linux sandboxes per agent",
      "Hierarchical delegation inspired by AI Teammates",
      "Strict epistemic verification preventing fake completions",
    ],
    sandboxPrompt: "curl -s http://localhost:5000/api/agents/skills | jq .",
    sandboxOutput: [
      "[sandbox.connect] Connecting to Skyer kernel @ localhost:5000...",
      "[sandbox.skills] 14 verified skills registered in runtime",
      "[sandbox.check] Kernel status: Up (healthy) - 0 memory leaks detected",
      "[sandbox.receipt] Healthcheck response: HTTP 200 OK (latency 12ms)",
    ],
  },
  {
    id: "core-concepts",
    title: "Core Concepts",
    category: "Getting Started",
    badge: "Architecture",
    summary:
      "Understand the primary entities: Agents, AI Workforce, Tasks, Tools, ReMe Memory, and Evidence Receipts.",
    content: `
### The 6 Core Entities of Skyer

1. **AI Agent (Teammate):** An autonomous entity with an explicit persona, role, provisioned tools, and personal memory. Each agent owns an isolated working volume (\`/app/working\`).
2. **AI Team (Multi-Agent Team):** A collaborative collective of agents configured with a process mode:
   - *Sequential Process:* Workflows pass linearly from Agent A to Agent B to Agent C.
   - *Hierarchical Process:* A Manager Agent oversees workers, delegates tasks, and validates pull requests.
3. **Task & Mandate:** A concrete unit of work with clear inputs, expected deliverables, and strict acceptance criteria.
4. **Tool & MCP Gateway:** Safe bridges to filesystem, shell, databases, Chromium CDP, and Model Context Protocol (MCP) servers.
5. **Memory System (ReMe + Files):** Dual-tier memory. Core Markdown files (\`MEMORY.md\`, \`AGENTS.md\`, \`SOUL.md\`) provide prompt context; ReMe provides vector and Wikilink indexing.
6. **Integrity Receipt:** Cryptographic or empirical proof of completion (e.g. \`14/14 tests PASS\`, \`HTTP 200 OK\`, \`DOM screenshot hash\`).
    `,
    keyTakeaways: [
      "Explicit separation of Identity, Authority, and Execution Sandbox",
      "Process modes: Sequential vs Hierarchical",
      "Dual-layer memory combining local Markdown with ReMe indexing",
    ],
  },

  // 2. Core Components (AI Teammates Style)
  {
    id: "agents",
    title: "Agents & Roles",
    category: "Core Components",
    badge: "Specialization",
    summary:
      "How to configure specialized AI Teammates: system prompts, capabilities, backends, and permission models.",
    content: `
### Give Each Bot a Job
Rather than using a single mega-prompt for all company operations, Skyer enforces domain specialization.

#### Agent Definition Schema
\`\`\`yaml
agent_id: swe-lead
name: "Alex - Senior Fullstack Bot"
role: "Software Engineering & Architecture"
goal: "Autonomously implement clean code diffs, pass local test suites, and generate verifiable PRs."
backstory: "Senior architect with 10 years of experience in .NET, React, and PostgreSQL. Strict adherence to TDD and zero fake completions."
backend:
  runtime: "skyer-native" # or "codex", "qoder"
  model: "qwen-2.5-72b-instruct"
  temperature: 0.1
tools:
  - "shell_execution"
  - "git_cli"
  - "chrome_devtools_cdp"
  - "postgres_mcp"
memory:
  enabled: true
  persistence_path: "/app/working/swe-lead"
\`\`\`
    `,
    codeSnippet: {
      language: "typescript",
      code: `import { Agent } from "@agent360/core";

export const sweAgent = new Agent({
  role: "Fullstack Engineer",
  goal: "Implement features with verifiable Playwright E2E tests",
  tools: ["git", "docker", "cdp"],
  allowDelegation: false,
  verbose: true,
});`,
    },
    keyTakeaways: [
      "Role, Goal, and Backstory structure matching AI Teammates",
      "Bound to dedicated kernel sandboxes to protect host integrity",
      "Configurable backend execution adapters (Skyer, Codex, Qoder)",
    ],
    sandboxPrompt: "agent360 agent run swe-lead --prompt 'Verify Google OAuth with Logto'",
    sandboxOutput: [
      "[swe-lead] Loaded agent identity: Alex (Senior Fullstack Bot)",
      "[swe-lead] Launching Playwright CDP container @ :9222",
      "[swe-lead] Executing auth flow tests against local Logto provider...",
      "[swe-lead] Results: 14/14 tests PASS (0 regressions)",
      "[swe-lead] Screenshot artifact generated: .tmp/auth-verified.png (SHA256 verified)",
    ],
  },
  {
    id: "ai-teammates",
    title: "Multi-Agent Workforce",
    category: "Core Components",
    badge: "Collaboration",
    summary:
      "Orchestrate multi-agent teams with Sequential or Hierarchical processes, manager delegation, and feedback loops.",
    content: `
### Hierarchical Process Engine
In Hierarchical mode, a **Lead Manager Agent** automatically abstracts high-level requests into manageable task graphs:

\`\`\`
[ User Request ]
       ↓
[ Manager Agent (Qwen 72B) ]
       ├── [ Task 1: DDL & Migration ] → SWE Worker
       ├── [ Task 2: UI Implementation ] → Frontend Worker
       └── [ Task 3: Security & E2E ] → QA Sentinel Worker
       ↓ (Aggregate Receipts)
[ Sign-off & Human Review Gate ]
\`\`\`

#### Key Benefits
- **Autonomous Delegation:** Manager dynamically assigns tasks based on worker skill tags.
- **Iterative Review:** If QA Worker rejects a PR, the Manager re-opens the task and sends debug traces back to SWE Worker.
- **Fail-Closed Security:** Unverified claims fail closed before reaching production.
    `,
    codeSnippet: {
      language: "python",
      code: `from agent360 import AI Team, Process
from my_agents import manager, swe_agent, qa_agent

agent team = AI Team(
    agents=[swe_agent, qa_agent],
    manager_agent=manager,
    process=Process.hierarchical,
    memory=True,
    verbose=True
)

result = agent team.kickoff(inputs={
    "objective": "Deploy OAuth Google authentication with Logto and verify E2E flow"
})`,
    },
    keyTakeaways: [
      "Manager-worker hierarchy mirrors real enterprise engineering teams",
      "Automated task re-opening on failed QA verification",
      "Human-in-the-loop sign-off gate before production mutation",
    ],
    sandboxPrompt: "agent360 agent team kickoff --agent team hierarchical-swe --task 'Postgres RLS'",
    sandboxOutput: [
      "[manager] Goal registered: 'Implement Multi-Tenant Row-Level Security'",
      "[manager] Decomposed into 3 tasks: DDL Migration, API Unit Tests, Penetration QA",
      "[swe-worker] Applied PostgreSQL migration scripts & EF Core filters",
      "[qa-worker] Simulated unauthorized cross-tenant query: HTTP 403 Forbidden verified",
      "[manager] Signed off delivery bundle: PR #42 ready for human approval",
    ],
  },
  {
    id: "tasks",
    title: "Tasks & Verification",
    category: "Core Components",
    badge: "No Fake Done",
    summary:
      "Design rigorous tasks with strict input/output specifications and verifiable cryptographic receipts.",
    content: `
### The Task Specification
Tasks are the execution contracts between agents. A task must define:
1. **Description:** Exactly what needs to be completed.
2. **Expected Output:** The exact format and structure of the artifact.
3. **Required Receipts:** Empirical evidence needed before the task can be marked Done.

#### Example Task Contract
\`\`\`yaml
task_id: "task-402-auth"
assigned_to: "swe-agent"
description: "Configure Logto OAuth provider in Skyer.API and frontend SPA."
expected_output: "Clean git diff with passing contract tests and Playwright video capture."
verification_requirements:
  - "Exit code 0 from: dotnet test Skyer.API.ContractTests"
  - "Exit code 0 from: pnpm test:e2e"
  - "Non-empty screenshot at .tmp/auth-verified.png"
\`\`\`
    `,
    keyTakeaways: [
      "Every task mandates explicit verification receipts",
      "Guarantees absence of 'Fake Done' common in naive LLMs",
      "Audit trail preserved in append-only harness ledger",
    ],
  },

  // 3. Skyer capabilities
  {
    id: "Skyer-sandbox",
    title: "Kernel Sandbox & Security",
    category: "Skyer Runtime",
    badge: "Skyer",
    summary:
      "Deep dive into Skyer's rootless container sandboxing, File Guards, and Tool Permission escalation.",
    content: `
### Sandboxing & Host Isolation
Skyer inherits Skyer's containerized execution model:

- **Isolated Working Volumes:** Agents only have write permissions within their scoped \`/app/working\` directory.
- **Tool Guard Interceptors:** Commands like \`rm -rf /\`, \`drop database\`, or reading sensitive keys trigger human approval gates.
- **Read-Only System Root:** The host operating system and sensitive SSH bridges remain strictly read-only or air-gapped.
- **Rate-Limited Sub-processes:** Background tasks are guarded against CPU hogging and infinite loop executions.
    `,
    codeSnippet: {
      language: "bash",
      code: `# Skyer Docker Sandbox specification
docker run -d \\
  --name agent360-sandbox-worker \\
  --security-opt=no-new-privileges:true \\
  --cap-drop=ALL \\
  --pids-limit=100 \\
  -v /var/run/agent360/worker-1:/app/working \\
  agent360/worker-runtime:v2.2.1`,
    },
    keyTakeaways: [
      "Rootless container architecture with zero privilege escalation",
      "Proactive command filtering blocks destructive mutations",
      "Dedicated working volume isolation per worker agent",
    ],
  },
  {
    id: "Skyer-memory",
    title: "ReMe & Long-Term Memory",
    category: "Skyer Runtime",
    badge: "Skyer",
    summary:
      "How Skyer's ReMe engine turns conversations, diffs, and documents into permanent, reusable knowledge.",
    content: `
### The 6-Stage Memory Lifecycle
Skyer does not rely on transient chat logs. Instead, it follows Skyer's proven memory architecture:

1. **Record:** Captures operational preferences, architecture rules, and verified facts.
2. **Ingest:** Parses upstream pull requests, commit messages, and API schemas.
3. **Organize:** Distills daily interactions into structured Markdown files (\`MEMORY.md\`).
4. **Connect:** Establishes semantic links between files using Wikilinks (\`[[Architecture]]\`).
5. **Retrieve:** Dual-mode recall using keyword search + semantic vector embeddings.
6. **Expand:** Contextually hydrates agent prompts only with relevant memory fragments.
    `,
    keyTakeaways: [
      "Prevents agents from repeating mistakes or forgetting architecture rules",
      "Human-auditable plain Markdown storage format",
      "Vector search combined with semantic graph Wikilinks",
    ],
  },
  {
    id: "multi-channel",
    title: "Multi-Channel Connectivity",
    category: "Enterprise Integration",
    badge: "Channels",
    summary:
      "Connect Skyer teammates to 10+ enterprise channels: Telegram, Element, Discord, DingTalk, Feishu, and Web.",
    content: `
### Seamless Teammate Communication
Interact with your AI agent team on the tools your team already uses every day:

- **Telegram:** Interactive bot chats, group topic routing, confirmation action buttons.
- **Matrix / Element:** End-to-end encrypted chat for confidential infrastructure operations.
- **Discord & Slack:** Webhook notifications and command dispatching.
- **Web Console:** Real-time terminal streaming and interactive desktop workspace.

#### Topic-Aware Routing
In group chats with forum topics enabled, Skyer preserves separate thread contexts, ensuring tasks don't cross-contaminate.
    `,
    keyTakeaways: [
      "Communicate with agents directly from existing chat apps",
      "Preserves topic and sender boundaries for security",
      "Native support for mobile notifications and approvals",
    ],
  },
];
