import { useState } from "react";
import { InfraAgent } from "../types/agent";
import {
  Server,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  ChevronRight,
  ShieldCheck,
  Code2,
  Database,
  Monitor,
} from "lucide-react";

interface InfraAgentsSidebarProps {
  agents: InfraAgent[];
  selectedAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

export function InfraAgentsSidebar({
  agents,
  selectedAgentId,
  onSelectAgent,
}: InfraAgentsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tags = ["All", "Engineering", "Operations", "Quality", "Research"];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.node.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || agent.roleTag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const getRoleIcon = (tag: string) => {
    switch (tag) {
      case "Engineering":
        return <Code2 size={14} className="text-[#d86f4c]" />;
      case "Operations":
        return <Server size={14} className="text-amber-500" />;
      case "Quality":
        return <Monitor size={14} className="text-emerald-500" />;
      case "Research":
        return <Database size={14} className="text-blue-500" />;
      default:
        return <Cpu size={14} className="text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: InfraAgent["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            live
          </span>
        );
      case "evaluating":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            eval
          </span>
        );
      case "idle":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-400 bg-neutral-400/10 px-1.5 py-0.5 rounded border border-neutral-400/20">
            idle
          </span>
        );
      case "degraded":
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
            degraded
          </span>
        );
    }
  };

  return (
    <aside className="w-80 h-full flex flex-col border-r border-[#26211d] bg-[#100d0b] text-[#f4f3ef] select-none shrink-0">
      {/* Top Infra Header */}
      <div className="p-3.5 border-b border-[#26211d] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#d86f4c]/15 border border-[#d86f4c]/30 flex items-center justify-center">
              <Server size={13} className="text-[#d86f4c]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#d86f4c] font-mono">
              Infra Agents
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full">
            {agents.length} nodes
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Filter by name, node, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#171310] border border-[#26211d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#f4f3ef] placeholder:text-neutral-500 focus:outline-none focus:border-[#d86f4c]/60 font-sans"
          />
        </div>

        {/* Role Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-[11px] font-mono px-2 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedTag === tag
                  ? "bg-[#d86f4c] text-white font-medium shadow-sm"
                  : "bg-[#171310] text-neutral-400 hover:text-white hover:bg-white/5 border border-[#26211d]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Agents List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredAgents.map((agent) => {
          const isSelected = agent.id === selectedAgentId;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? "bg-[#1c1713] border-[#d86f4c]/50 shadow-[0_2px_8px_rgba(216,111,76,0.15)] ring-1 ring-[#d86f4c]/30"
                  : "bg-[#14100d] border-[#26211d] hover:bg-[#181310] hover:border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-[#26211d]/60 shrink-0">
                    {getRoleIcon(agent.roleTag)}
                  </div>
                  <span className="text-xs font-medium text-white truncate">
                    {agent.name}
                  </span>
                </div>
                {getStatusBadge(agent.status)}
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mt-2">
                <span className="truncate max-w-[170px] text-neutral-500">
                  {agent.node}
                </span>
                <span className="text-[#d86f4c]/80 text-[10px]">
                  {agent.sessions.length} sessions
                </span>
              </div>
            </div>
          );
        })}

        {filteredAgents.length === 0 && (
          <div className="p-6 text-center text-xs text-neutral-500 font-mono">
            No agents found matching criteria.
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#26211d] bg-[#0c0a08] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck size={13} />
          <span>Infra Secure</span>
        </div>
        <span className="text-neutral-500">WSL/9P Safe</span>
      </div>
    </aside>
  );
}
