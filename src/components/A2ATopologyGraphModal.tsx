import React, { useState } from "react";
import {
  X,
  Share2,
  Bot,
  ArrowRight,
  Sparkles,
  GitFork,
  Radio,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { InfraAgent } from "../types/agent";

interface A2ATopologyGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAgent: InfraAgent;
  allAgents: InfraAgent[];
  onSelectAgent: (agent: InfraAgent) => void;
}

export function A2ATopologyGraphModal({
  isOpen,
  onClose,
  currentAgent,
  allAgents,
  onSelectAgent,
}: A2ATopologyGraphModalProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(currentAgent.id);

  if (!isOpen) return null;

  // Categorize agents into functional topology roles
  const orchestrators = allAgents.filter(
    (a) =>
      a.id.includes("gateway") ||
      a.id.includes("mons") ||
      (a.roleTag && a.roleTag.toLowerCase().includes("lead")) ||
      a.name.toLowerCase().includes("gateway") ||
      a.name.toLowerCase().includes("orchestrator")
  );

  const workers = allAgents.filter(
    (a) =>
      !orchestrators.some((o) => o.id === a.id) &&
      (a.roleTag?.toLowerCase().includes("swe") ||
        a.roleTag?.toLowerCase().includes("sre") ||
        a.roleTag?.toLowerCase().includes("dev") ||
        a.roleTag?.toLowerCase().includes("data") ||
        a.roleTag?.toLowerCase().includes("qa") ||
        a.roleTag?.toLowerCase().includes("security"))
  );

  const specialists = allAgents.filter(
    (a) =>
      !orchestrators.some((o) => o.id === a.id) &&
      !workers.some((w) => w.id === a.id)
  );

  const activeSelectedAgent = allAgents.find((a) => a.id === selectedNodeId) || currentAgent;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] bg-[#0f0f15] border border-[#262638] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#222230] flex items-center justify-between bg-[#14141c]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Share2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Live A2A Autonomous Topology Graph</h3>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.2 rounded-full">
                  Multi-Agent Network
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Visual communication and cross-bot task delegation flow across active infrastructure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252538] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Graph Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#0a0a0f]">
          {/* Left 2 Cols: Interactive Topology Canvas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level 1: Orchestration Hub */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff7a00]">
                <Radio size={13} className="animate-pulse" />
                <span className="font-semibold uppercase tracking-wider">Level 1: Orchestrators & Gateways</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {orchestrators.map((ag) => {
                  const isCur = ag.id === currentAgent.id;
                  const isSel = ag.id === selectedNodeId;
                  return (
                    <div
                      key={ag.id}
                      onClick={() => setSelectedNodeId(ag.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSel
                          ? "bg-[#1c1c28] border-[#ff7a00] shadow-md shadow-[#ff7a00]/10"
                          : "bg-[#12121a] border-[#222230] hover:border-[#323246]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <Bot size={14} className="text-[#ff7a00]" />
                          <span className="text-xs font-semibold text-white truncate">{ag.name}</span>
                        </div>
                        {isCur && (
                          <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 mt-1 truncate">
                        {ag.node} • {ag.model}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Downward Delegation Arrow */}
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-500">
              <div className="h-[1px] bg-neutral-800 flex-1" />
              <span>A2A Delegation Protocol (ACP / JSON-RPC)</span>
              <div className="h-[1px] bg-neutral-800 flex-1" />
            </div>

            {/* Level 2: Execution Workers */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Cpu size={13} />
                <span className="font-semibold uppercase tracking-wider">Level 2: Autonomous SWE & SRE Workers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {workers.map((ag) => {
                  const isCur = ag.id === currentAgent.id;
                  const isSel = ag.id === selectedNodeId;
                  return (
                    <div
                      key={ag.id}
                      onClick={() => setSelectedNodeId(ag.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSel
                          ? "bg-[#1c1c28] border-cyan-400 shadow-md shadow-cyan-400/10"
                          : "bg-[#12121a] border-[#222230] hover:border-[#323246]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          <Bot size={14} className="text-cyan-400" />
                          <span className="text-xs font-semibold text-white truncate">{ag.name}</span>
                        </div>
                        {isCur && (
                          <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 mt-1 truncate">
                        {ag.roleTag || "Worker"} • {ag.model}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Level 3: Specialists */}
            {specialists.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Layers size={13} />
                  <span className="font-semibold uppercase tracking-wider">Level 3: Domain Specialists</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {specialists.map((ag) => {
                    const isCur = ag.id === currentAgent.id;
                    const isSel = ag.id === selectedNodeId;
                    return (
                      <div
                        key={ag.id}
                        onClick={() => setSelectedNodeId(ag.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSel
                            ? "bg-[#1c1c28] border-emerald-400 shadow-md shadow-emerald-400/10"
                            : "bg-[#12121a] border-[#222230] hover:border-[#323246]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate">{ag.name}</span>
                          {isCur && (
                            <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-400 mt-1 truncate">
                          {ag.roleTag || "Specialist"} • {ag.model}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Selected Node Telemetry & Delegation Handoff */}
          <div className="p-4 rounded-xl bg-[#12121a] border border-[#222230] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#ff7a00]">
                <Sparkles size={14} />
                <span className="font-semibold uppercase">Selected Agent Node</span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">{activeSelectedAgent.name}</h4>
                <div className="text-xs font-mono text-cyan-400 mt-0.5">{activeSelectedAgent.roleTag || "Autonomous Agent"}</div>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-neutral-400 pt-2 border-t border-[#1e1e28]">
                <div>Node: <span className="text-neutral-200">{activeSelectedAgent.node}</span></div>
                <div>Model: <span className="text-neutral-200">{activeSelectedAgent.model}</span></div>
                <div>Status: <span className="text-emerald-400">{activeSelectedAgent.status || "healthy"}</span></div>
                <div>ID: <span className="text-neutral-300 text-[11px] truncate block">{activeSelectedAgent.id}</span></div>
              </div>

              {activeSelectedAgent.description && (
                <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-2 border-t border-[#1e1e28]">
                  {activeSelectedAgent.description}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-[#1e1e28] space-y-2">
              <button
                type="button"
                onClick={() => {
                  onSelectAgent(activeSelectedAgent);
                  onClose();
                }}
                className="w-full py-2 px-3 rounded-lg bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>Switch Workspace to this Bot</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-[#0d0d12] border-t border-[#1c1c24] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Skyer Autonomous Multi-Agent Kernel</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Close Graph
          </button>
        </div>
      </div>
    </div>
  );
}
