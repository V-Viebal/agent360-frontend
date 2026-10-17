import { useState } from "react";
import {
  Users,
  Code2,
  Shield,
  Monitor,
  Terminal,
  Database,
  ArrowDown,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronRight,
  GitBranch,
  Download,
  Copy,
  Check,
  FileCode,
} from "lucide-react";

interface TopologyNode {
  id: string;
  label: string;
  role: string;
  type: "manager" | "worker" | "tool";
  model?: string;
  status: string;
  description: string;
  tools?: string[];
}

const TOPOLOGY_NODES: TopologyNode[] = [
  {
    id: "manager",
    label: "Lead Manager Agent",
    role: "Orchestration & PR Gate",
    type: "manager",
    model: "Qwen 2.5 72B Instruct",
    status: "Active • Delegating Task Graph",
    description: "Evaluates human intent, plans dependency graphs, dispatches sub-tasks to workers, and blocks unverified completions.",
    tools: ["ACP Protocol", "Plan Ledger Engine", "GitHub Review API"],
  },
  {
    id: "worker-swe",
    label: "SWE Worker Agent",
    role: "Code Mutation & TDD",
    type: "worker",
    model: "DeepSeek-Coder 33B",
    status: "Active • Compiling AST Diff",
    description: "Executes code changes in dedicated working volume, generates migrations, and runs unit tests.",
    tools: ["Docker CLI", "Git CLI", "PostgreSQL DDL", "Vitest"],
  },
  {
    id: "worker-qa",
    label: "Security & QA Worker",
    role: "Penetration & Accessibility",
    type: "worker",
    model: "Qwen 2.5 14B + Tools",
    status: "Active • Probing HTTP 403",
    description: "Drives headless browser sidecars, performs automated IDOR attacks, and audits WCAG 2.1 contrast.",
    tools: ["Chromium CDP", "OWASP ZAP Runner", "WCAG Engine"],
  },
  {
    id: "worker-sre",
    label: "SRE Sentinel Worker",
    role: "System Recovery & Resource Guard",
    type: "worker",
    model: "Qwen 2.5 7B Local",
    status: "Active • Monitoring VPS 6th",
    description: "Monitors memory leaks, 9p mount pressure, and triggers zero-downtime microservice recycles.",
    tools: ["SSH Bridges", "Beszel API", "Systemd D-Bus"],
  },
];

export function AgentTopologyVisualizer() {
  const [selectedNode, setSelectedNode] = useState<TopologyNode>(TOPOLOGY_NODES[0]);
  const [copiedYaml, setCopiedYaml] = useState(false);

  const generateWorkforceYaml = () => {
    return `# Skyer AI Workforce Hierarchy Specification
# Generated for: AntaresOS / Coolify Deployments
version: "2.2.1"
agent team:
  name: "enterprise-fullstack-agent team"
  process: "hierarchical"
  memory:
    enabled: true
    provider: "reme-markdown"
    persistence_root: "/app/working/agent team-memory"

  manager:
    id: "lead-manager"
    role: "Orchestration & PR Gate"
    model: "qwen-2.5-72b-instruct"
    backend: "qwenpaw-native"
    sandbox:
      working_dir: "/app/working/manager"
      read_only_root: true
      pids_limit: 100
    tools:
      - "acp_protocol"
      - "plan_ledger_engine"
      - "github_review_api"

  workers:
    - id: "swe-worker"
      role: "Code Mutation & TDD"
      model: "deepseek-coder-33b"
      backend: "qwenpaw-native"
      sandbox:
        working_dir: "/app/working/swe-worker"
      tools:
        - "docker_cli"
        - "git_cli"
        - "postgres_ddl"
        - "vitest"

    - id: "security-qa"
      role: "Penetration & Accessibility"
      model: "qwen-2.5-14b-instruct"
      backend: "qwenpaw-native"
      sandbox:
        working_dir: "/app/working/security-qa"
      tools:
        - "chromium_cdp"
        - "owasp_zap_runner"
        - "wcag_engine"

    - id: "sre-sentinel"
      role: "System Recovery & Resource Guard"
      model: "qwen-2.5-7b-local"
      backend: "qwenpaw-native"
      sandbox:
        working_dir: "/app/working/sre-sentinel"
      tools:
        - "ssh_bridges"
        - "beszel_api"
        - "systemd_dbus"
`;
  };

  const handleDownloadYaml = () => {
    const yaml = generateWorkforceYaml();
    const blob = new Blob([yaml], { type: "text/yaml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "agent360-agent-workforce-config.yaml");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyYaml = () => {
    const yaml = generateWorkforceYaml();
    navigator.clipboard.writeText(yaml);
    setCopiedYaml(true);
    setTimeout(() => setCopiedYaml(false), 2000);
  };


  return (
    <div className="rounded-xl border border-white/10 bg-[#07090e] p-5 sm:p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ff7a00] animate-pulse" />
            <h4 className="text-base font-semibold text-white">AI Workforce Hierarchy Topology</h4>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Interactive multi-agent supervision tree modeled after AI Teammates & QwenPaw sandboxes.
          </p>
        </div>
        <div className="text-[11px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded text-neutral-300">
          Process Mode: <span className="text-[#ff7a00] font-semibold">Hierarchical</span>
        </div>
      </div>

      {/* Visual Canvas Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6 bg-black/40 p-4 sm:p-6 rounded-xl border border-white/5">
          {/* Top Level: Manager */}
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedNode(TOPOLOGY_NODES[0])}
              className={`w-full max-w-sm p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedNode.id === "manager"
                  ? "bg-[#ff7a00]/15 border-[#ff7a00] shadow-[0_0_20px_rgba(255,122,0,0.2)]"
                  : "bg-[#0d111a] border-white/10 hover:border-white/20 text-neutral-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/20 border border-[#ff7a00]/40 flex items-center justify-center text-[#ff7a00]">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Lead Manager Agent</div>
                    <div className="text-[10px] text-neutral-500 font-mono">Qwen 2.5 72B</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-[#ff7a00]/20 text-[#ff7a00] px-2 py-0.5 rounded font-semibold">
                  SUPERVISOR
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono truncate">
                Dispatches tasks & verifies worker receipts
              </div>
            </button>
          </div>

          {/* Flow Indicator Down Arrow */}
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs font-mono">
            <div className="h-[1px] w-12 bg-white/10" />
            <div className="flex items-center gap-1 text-[#ff7a00] text-[11px]">
              <ArrowDown size={14} className="animate-bounce" />
              <span>Delegation & ACP Protocol</span>
            </div>
            <div className="h-[1px] w-12 bg-white/10" />
          </div>

          {/* Second Level: Worker Agents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TOPOLOGY_NODES.slice(1).map((worker) => {
              const isSelected = selectedNode.id === worker.id;
              const Icon = worker.id.includes("swe") ? Code2 : worker.id.includes("qa") ? Shield : Monitor;
              return (
                <button
                  key={worker.id}
                  onClick={() => setSelectedNode(worker)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-white/10 border-white/40 shadow-lg"
                      : "bg-[#0d111a] border-white/10 hover:border-white/20 text-neutral-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-200">
                        <Icon size={14} />
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        WORKER
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white truncate">{worker.label}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{worker.role}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-[9px] font-mono text-neutral-500 truncate">
                    {worker.model}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Node Detail Inspector */}
        <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#0d111a] p-5 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff7a00] mb-1">
              Inspecting Entity
            </div>
            <h5 className="text-base font-semibold text-white">{selectedNode.label}</h5>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">{selectedNode.role}</div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1">Operating Status:</span>
              <div className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg font-mono flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate">{selectedNode.status}</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-500 font-mono block text-[11px] mb-1">Runtime Specification:</span>
              <p className="text-neutral-300 font-sans leading-relaxed text-[11px]">
                {selectedNode.description}
              </p>
            </div>

            {selectedNode.tools && (
              <div>
                <span className="text-neutral-500 font-mono block text-[11px] mb-1.5">Provisioned Toolchain:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.tools.map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-neutral-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Export Agent Configuration Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
              <button
                onClick={handleDownloadYaml}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold text-xs transition-all shadow-sm cursor-pointer"
                title="Download agent360-agent-workforce-config.yaml"
              >
                <Download size={13} />
                <span>Export Agent Config</span>
              </button>

              <button
                onClick={handleCopyYaml}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs transition-all cursor-pointer"
                title="Copy YAML to clipboard"
              >
                {copiedYaml ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copiedYaml ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
