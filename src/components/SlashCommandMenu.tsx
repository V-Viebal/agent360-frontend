import React from "react";
import { Terminal, Shield, RefreshCw, Trash2, Cpu, FileText, CheckCircle, Sparkles } from "lucide-react";

export interface SlashCommand {
  command: string;
  label: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: "/health",
    label: "Check Cluster & Agent Health",
    description: "Verify node latency, container status, and memory consumption",
    prompt: "Please perform a comprehensive health audit of this agent and its host node. Report container status, tool bindings, and latency.",
    icon: <Shield size={14} className="text-emerald-400" />,
  },
  {
    command: "/git-status",
    label: "Inspect Git Status & Changes",
    description: "Run git status and inspect uncommitted files and diffs",
    prompt: "Execute non-mutating shell inspection: run `git status -s` and report active modified files in workspace.",
    icon: <Terminal size={14} className="text-[#ff7a00]" />,
  },
  {
    command: "/compact",
    label: "Compact Context & Free Tokens",
    description: "Summarize conversation history and purge obsolete checkpoint tokens",
    prompt: "Please compact our conversation context: preserve key architectural decisions and pending tasks, summarize past turns.",
    icon: <RefreshCw size={14} className="text-amber-400" />,
  },
  {
    command: "/clean",
    label: "Safe Clean Temporary Logs",
    description: "Audit and purge transient files under .tmp/ directory",
    prompt: "Inspect the `.tmp/` directory and list old build/log artifacts eligible for safe rotation without touching repository state.",
    icon: <Trash2 size={14} className="text-red-400" />,
  },
  {
    command: "/spec",
    label: "Explain System Constitution & Mandates",
    description: "Inspect active constitution mandates and safety guardrails",
    prompt: "Summarize the 3 Immutable Principles of this workspace and how you verify your own work before finishing a task.",
    icon: <Cpu size={14} className="text-cyan-400" />,
  },
];

interface SlashCommandMenuProps {
  query: string;
  onSelect: (cmd: SlashCommand) => void;
  onClose: () => void;
}

export function SlashCommandMenu({ query, onSelect, onClose }: SlashCommandMenuProps) {
  const cleanQuery = query.toLowerCase().replace(/^\//, "");
  const filtered = SLASH_COMMANDS.filter(
    (c) =>
      c.command.toLowerCase().includes(cleanQuery) ||
      c.label.toLowerCase().includes(cleanQuery) ||
      c.description.toLowerCase().includes(cleanQuery)
  );

  if (filtered.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 mb-2 w-full max-w-md bg-[#14141c] border border-[#2a2a3c] rounded-2xl p-1.5 shadow-2xl z-40 text-neutral-200 font-sans backdrop-blur-md animate-in fade-in zoom-in-95">
      <div className="px-3 py-1.5 border-b border-[#22222e] flex items-center justify-between text-[10px] font-mono text-neutral-400 select-none">
        <span className="flex items-center gap-1.5 text-[#ff7a00]">
          <Sparkles size={11} />
          <span>Quick Slash Commands</span>
        </span>
        <span>Select or continue typing</span>
      </div>
      <div className="max-h-56 overflow-y-auto space-y-0.5 mt-1 p-1">
        {filtered.map((cmd) => (
          <div
            key={cmd.command}
            onClick={() => onSelect(cmd)}
            className="p-2 rounded-xl hover:bg-[#1f1f2e] border border-transparent hover:border-[#2e2e42] flex items-center justify-between gap-3 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-[#181822] border border-[#282838] flex items-center justify-center shrink-0">
                {cmd.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-white group-hover:text-[#ff7a00] transition-colors">
                    {cmd.command}
                  </span>
                  <span className="text-xs text-neutral-300 truncate">{cmd.label}</span>
                </div>
                <span className="text-[10px] text-neutral-500 truncate">{cmd.description}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              ↵ Insert
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
