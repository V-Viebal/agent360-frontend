import { useState } from "react";
import { InfraAgent } from "../types/agent";
import { SkillPoolModal } from "./SkillPoolModal";
import { TokenAnalyticsModal } from "./TokenAnalyticsModal";
import { BrowserCdpViewerModal } from "./BrowserCdpViewerModal";
import { updateAgentActiveModel } from "../services/agentApi";
import {
  Server,
  Cpu,
  Clock,
  Wrench,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Check,
  BarChart3,
  Globe,
} from "lucide-react";

interface AgentProfileHeaderProps {
  agent: InfraAgent;
  onRefresh?: () => void;
  onModelChanged?: (newModel: string) => void;
}

const AVAILABLE_MODELS = [
  { providerId: "llm360coding", model: "skyer-4.7", label: "Skyer 4.7 (llm360)" },
  { providerId: "llm360coding", model: "skyer-4.6", label: "Skyer 4.6 (llm360)" },
  { providerId: "llm360coding", model: "gpt-5.6-luna", label: "GPT-5.6 Luna" },
  { providerId: "llm360", model: "claude-3-7-sonnet", label: "Claude 3.7 Sonnet" },
  { providerId: "llm360", model: "qwen2.5-coder-32b", label: "Qwen 2.5 Coder 32B" },
];

export function AgentProfileHeader({ agent, onRefresh, onModelChanged }: AgentProfileHeaderProps) {
  const [showSkillModal, setShowSkillModal] = useState<boolean>(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [showBrowserModal, setShowBrowserModal] = useState<boolean>(false);
  const [showModelDropdown, setShowModelDropdown] = useState<boolean>(false);
  const [switchingModel, setSwitchingModel] = useState<boolean>(false);

  const handleSelectModel = async (providerId: string, model: string) => {
    setShowModelDropdown(false);
    setSwitchingModel(true);
    try {
      const res = await updateAgentActiveModel(agent.id, providerId, model);
      if (res.success) {
        const fullModelName = `${providerId}/${model}`;
        onModelChanged?.(fullModelName);
        onRefresh?.();
      }
    } finally {
      setSwitchingModel(false);
    }
  };

  return (
    <header className="border-b border-[#26211d] bg-[#14100d] px-6 py-4 select-none shrink-0 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Agent Title & Status */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span>{agent.name}</span>
              <span className="text-xs font-mono font-normal text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                {agent.slug}
              </span>
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#d86f4c]/15 text-[#d86f4c] border border-[#d86f4c]/30">
              {agent.roleTag}
            </span>
          </div>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            {agent.description}
          </p>
        </div>

        {/* Right: Runtime Specs & Actions */}
        <div className="flex items-center gap-3 self-start md:self-center font-mono text-xs">
          <div className="flex items-center gap-3 bg-[#1c1713] border border-[#26211d] px-3.5 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Server size={13} className="text-[#d86f4c]" />
              <span className="text-neutral-400 text-[11px]">{agent.node}</span>
            </div>
            <div className="h-3 w-px bg-white/10" />

            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown((prev) => !prev)}
                disabled={switchingModel}
                className="flex items-center gap-1.5 text-neutral-200 hover:text-white transition-colors cursor-pointer"
                title="Switch Active Model Slot"
              >
                <Cpu size={13} className="text-emerald-400" />
                <span className="text-[11px] font-medium text-emerald-400">
                  {switchingModel ? "Switching..." : agent.model}
                </span>
                <ChevronDown size={11} className="text-neutral-500" />
              </button>

              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-[#17130f] border border-[#2b241e] shadow-2xl p-1.5 space-y-0.5 font-mono text-xs">
                  <div className="px-2.5 py-1 text-[10px] text-neutral-500 uppercase tracking-wider font-semibold border-b border-white/5 mb-1">
                    Select Active Model Slot
                  </div>
                  {AVAILABLE_MODELS.map((m) => {
                    const isSelected = agent.model.includes(m.model);
                    return (
                      <button
                        key={`${m.providerId}-${m.model}`}
                        onClick={() => handleSelectModel(m.providerId, m.model)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#d86f4c]/15 text-[#d86f4c] font-medium"
                            : "text-neutral-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{m.label}</span>
                        {isSelected && <Check size={12} className="text-[#d86f4c]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Clock size={13} className="text-amber-400" />
              <span className="text-neutral-400 text-[11px]">{agent.uptime}</span>
            </div>
          </div>

          {/* Browser CDP Live Stream Viewer Button */}
          <button
            onClick={() => setShowBrowserModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-medium transition-colors cursor-pointer"
            title="Inspect Agent Browser CDP Stream"
          >
            <Globe size={13} className="text-blue-400" />
            <span>Browser</span>
          </button>

          {/* Token Analytics Dashboard Button */}
          <button
            onClick={() => setShowAnalyticsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-medium transition-colors cursor-pointer"
            title="View Token Usage & Metrics"
          >
            <BarChart3 size={13} className="text-amber-400" />
            <span>Usage</span>
          </button>

          {/* Skills Catalog Button */}
          <button
            onClick={() => setShowSkillModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#d86f4c]/15 hover:bg-[#d86f4c]/25 border border-[#d86f4c]/40 text-[#d86f4c] font-medium transition-colors cursor-pointer"
            title="Browse Skills & Capabilities"
          >
            <Sparkles size={13} />
            <span>Skills</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-[#1c1713] border border-[#26211d] text-neutral-400 hover:text-white hover:border-[#d86f4c]/40 transition-colors cursor-pointer"
              title="Refresh Agent State"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Authorized Tools Bar */}
      <div className="mt-3.5 pt-3 border-t border-[#26211d]/60 flex items-center gap-2 overflow-x-auto text-[11px] font-mono no-scrollbar">
        <span className="text-neutral-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
          <Wrench size={11} className="text-[#d86f4c]" />
          Authorized Tools:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {agent.tools.map((tool) => (
            <span
              key={tool.name}
              title={tool.description}
              className="bg-[#1c1713] border border-[#26211d] hover:border-white/20 text-neutral-300 px-2 py-0.5 rounded text-[11px] cursor-help transition-colors"
            >
              {tool.name} <span className="text-neutral-500 text-[10px]">({tool.type})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Browser CDP Live Stream Viewer Modal */}
      {showBrowserModal && (
        <BrowserCdpViewerModal
          agentName={agent.name}
          onClose={() => setShowBrowserModal(false)}
        />
      )}

      {/* Skill Pool Catalog Modal */}
      {showSkillModal && (
        <SkillPoolModal
          agentName={agent.name}
          onClose={() => setShowSkillModal(false)}
        />
      )}

      {/* Token Analytics Dashboard Modal */}
      {showAnalyticsModal && (
        <TokenAnalyticsModal
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}
    </header>
  );
}
