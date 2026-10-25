import React, { useState, useEffect } from "react";
import {
  Smile,
  X,
  Bot,
  Settings,
  Layers,
  Network,
  Radio,
  Clock,
  Sparkles,
  Brain,
  Check,
  Search,
  Plus,
  SlidersHorizontal,
  ArrowUpRight,
  Power,
  PowerOff,
  Loader2,
  Camera,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { InfraAgent } from "../types/agent";
import { AgentAvatar } from "./AgentAvatar";
import { AgentConnectedAppsTab } from "./AgentConnectedAppsTab";
import { AgentSubAgentsTab } from "./AgentSubAgentsTab";
import { ExternalSubAgentsTab } from "./ExternalSubAgentsTab";
import { AgentMemoryTab } from "./AgentMemoryTab";
import { AgentChannelConfig, AgentScheduleJob, fetchAgentReactionSummary, MessageReactionSummaryDto } from "../services/agentApi";

export type AgentSettingsTab =
  | "general"
  | "apps_mcp"
  | "subagents"
  | "channels_cron"
  | "memory_skills"
  | "webhooks_a2a";

export interface AgentModelOption {
  providerId: string;
  providerName: string;
  model: string;
  name: string;
}

interface AgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AgentSettingsTab;
  agent: InfraAgent;
  allAgents: InfraAgent[];
  // Model switching
  availableModels: AgentModelOption[];
  isChangingModel: boolean;
  onSelectModel: (modelId: string) => void;
  // Avatar customization
  onOpenAvatarModal: () => void;
  // Enable / Disable agent
  togglingAgentId: string | null;
  onToggleAgentEnabled: (agent: InfraAgent, e: React.MouseEvent) => void;
  // Apps & MCP
  onOpenConnectModal: () => void;
  mcpRefreshTrigger: number;
  // Sub-Agents & Topology
  onOpenTopologyModal: () => void;
  // Channels & Schedules
  channels: AgentChannelConfig[];
  loadingChannels: boolean;
  onToggleChannel: (channelType: string, currentEnabled: boolean) => void;
  onConfigureChannel: (channel: AgentChannelConfig) => void;
  schedules: AgentScheduleJob[];
  loadingSchedules: boolean;
  onAddSchedule: () => void;
  onEditSchedule: (job: AgentScheduleJob) => void;
  // Telemetry & Metrics
  turnTelemetry?: {
    ttftMs?: number;
    tokensPerSec?: number;
    totalDurationMs?: number;
    estimatedCostUsd?: number;
    model?: string;
  } | null;
  // Skills
  skills: string[];
}

export function AgentSettingsModal({
  isOpen,
  onClose,
  initialTab = "general",
  agent,
  allAgents,
  availableModels,
  isChangingModel,
  onSelectModel,
  onOpenAvatarModal,
  togglingAgentId,
  onToggleAgentEnabled,
  onOpenConnectModal,
  mcpRefreshTrigger,
  onOpenTopologyModal,
  channels,
  loadingChannels,
  onToggleChannel,
  onConfigureChannel,
  schedules,
  loadingSchedules,
  onAddSchedule,
  onEditSchedule,
  turnTelemetry,
  skills,
}: AgentSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<AgentSettingsTab>(initialTab);
  const [modelSearch, setModelSearch] = useState("");
  const [navSearch, setNavSearch] = useState("");
  const [reactionSummary, setReactionSummary] = useState<MessageReactionSummaryDto | null>(null);

  useEffect(() => {
    if (isOpen && agent?.id) {
      fetchAgentReactionSummary(agent.id).then((summary) => setReactionSummary(summary));
    }
  }, [isOpen, agent?.id]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !agent) return null;

  // Deduplicate available models cleanly
  const baseList: AgentModelOption[] =
    availableModels.length > 0
      ? availableModels
      : [
          { providerId: "llm360coding", providerName: "LLM360", model: "gpt-5.6-luna", name: "gpt-5.6-luna" },
          { providerId: "llm360coding", providerName: "LLM360", model: "grok-4.7", name: "grok-4.7" },
          { providerId: "llm360coding", providerName: "LLM360", model: "gpt-6-sol", name: "gpt-6-sol" },
          { providerId: "llm360coding", providerName: "LLM360", model: "grok-4.6", name: "grok-4.6" },
          { providerId: "llm360coding", providerName: "LLM360", model: "claude-opus-4.6-thinking", name: "claude-opus-4.6-thinking" },
          { providerId: "llm360coding", providerName: "LLM360", model: "gemini-3.7-flash-tiered", name: "gemini-3.7-flash-tiered" },
        ];

  const uniqueMap = new Map<string, AgentModelOption>();
  for (const m of baseList) {
    const clean = m.model.includes("/") ? m.model.split("/").pop()! : m.model;
    if (clean && !uniqueMap.has(clean) && clean !== "metadata_health") {
      uniqueMap.set(clean, { ...m, model: clean });
    }
  }
  const currentCleanModel = agent.model?.includes("/") ? agent.model.split("/").pop()! : agent.model;
  if (currentCleanModel && !uniqueMap.has(currentCleanModel)) {
    uniqueMap.set(currentCleanModel, {
      providerId: "llm360coding",
      providerName: "LLM360",
      model: currentCleanModel,
      name: currentCleanModel,
    });
  }

  const filteredModels = Array.from(uniqueMap.values()).filter((m) => {
    if (!modelSearch.trim()) return true;
    return m.model.toLowerCase().includes(modelSearch.toLowerCase());
  });

  const navItems: {
    id: AgentSettingsTab;
    label: string;
    subtitle: string;
    icon: React.ReactNode;
    group: "Cấu hình Cốt lõi" | "Mạng lưới & Tích hợp" | "Tri thức & Tự động hóa";
    badge?: string | number;
  }[] = [
    {
      id: "general",
      label: "Hồ sơ & Mô hình AI",
      subtitle: "Identity, LLM Model & Governance",
      icon: <Bot size={15} />,
      group: "Cấu hình Cốt lõi",
    },
    {
      id: "apps_mcp",
      label: "Ứng dụng & MCP",
      subtitle: "Connected Apps & Tool Schemas",
      icon: <Layers size={15} />,
      group: "Mạng lưới & Tích hợp",
    },
    {
      id: "subagents",
      label: "Đội ngũ & A2A",
      subtitle: "Sub-Agents & Swarm Topology",
      icon: <Network size={15} />,
      group: "Mạng lưới & Tích hợp",
    },
    {
      id: "channels_cron",
      label: "Kênh & Lịch tự động",
      subtitle: "Dispatch Channels & Cron Jobs",
      icon: <Radio size={15} />,
      group: "Tri thức & Tự động hóa",
      badge: channels.filter((c) => c.enabled).length + schedules.length || undefined,
    },
    {
      id: "webhooks_a2a",
      label: "Webhooks & Matrix",
      subtitle: "Inbound HMAC & Event Telemetry",
      icon: <Activity size={15} />,
      group: "Mạng lưới & Tích hợp",
      badge: "Realtime",
    },
    {
      id: "memory_skills",
      label: "Bộ nhớ & Kỹ năng",
      subtitle: "Long-term Memory & Live Skills",
      icon: <Brain size={15} />,
      group: "Tri thức & Tự động hóa",
      badge: skills.length || undefined,
    },
  ];

  const visibleNavItems = navItems.filter(
    (item) =>
      !navSearch.trim() ||
      item.label.toLowerCase().includes(navSearch.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(navSearch.toLowerCase())
  );

  const groups = ["Cấu hình Cốt lõi", "Mạng lưới & Tích hợp", "Tri thức & Tự động hóa"] as const;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[900px] md:w-[960px] h-[94dvh] sm:h-[90vh] max-h-[100dvh] sm:max-h-[680px] bg-white dark:bg-[#121218] border-t sm:border border-slate-200 dark:border-[#262634] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <AgentAvatar agent={agent} size="md" />
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-[#161620] ${
                  agent.status === "degraded" ? "bg-red-500" : "bg-emerald-400"
                }`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  Cấu hình Agent: {agent.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30 shrink-0">
                  {agent.roleTag || "AI Teammate"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono truncate">
                {agent.node} • {(agent.runtimeVersion || "Skyer v2.2.1").replace(/qwenpaw|agentcore/gi, "AgentCore")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1c1c28] hover:bg-slate-200 dark:hover:bg-[#252536] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Đóng cấu hình Agent"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body: 2-Column Split Design Pattern */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Navigation Rail */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-[#0f0f15] border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#20202c] p-2 sm:p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
            {/* Quick Filter in Left Nav */}
            <div className="hidden md:flex items-center gap-1.5 bg-white dark:bg-[#161620] border border-slate-200 dark:border-[#242432] rounded-xl px-2.5 py-1.5 mb-2">
              <Search size={13} className="text-neutral-400 shrink-0" />
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Tìm mục cấu hình..."
                className="w-full bg-transparent text-xs text-slate-800 dark:text-white placeholder-neutral-500 focus:outline-none font-sans"
              />
              {navSearch && (
                <button
                  type="button"
                  onClick={() => setNavSearch("")}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {groups.map((grp) => {
              const items = visibleNavItems.filter((i) => i.group === grp);
              if (items.length === 0) return null;
              return (
                <div key={grp} className="flex md:flex-col gap-1 md:mb-3 shrink-0">
                  <div className="hidden md:block px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-neutral-500 font-semibold">
                    {grp}
                  </div>
                  {items.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer shrink-0 md:w-full ${
                          isActive
                            ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 font-semibold shadow-xs"
                            : "text-slate-600 dark:text-neutral-400 hover:bg-slate-200/60 dark:hover:bg-[#181822] hover:text-slate-900 dark:hover:text-white border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={isActive ? "text-[#e0682b] dark:text-[#f8a87c]" : "text-neutral-400"}>
                            {item.icon}
                          </span>
                          <div className="truncate">
                            <div className="text-xs leading-tight truncate">{item.label}</div>
                            <div className="hidden md:block text-[10px] text-slate-400 dark:text-neutral-500 font-normal truncate mt-0.5">
                              {item.subtitle}
                            </div>
                          </div>
                        </div>
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-neutral-300 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 bg-white dark:bg-[#121218]">
            {/* TAB 1: GENERAL (Identity, LLM Model, Governance, Status) */}
            {activeTab === "general" && (
              <div className="space-y-5 max-w-2xl">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Hồ sơ & Mô hình Trí tuệ (Identity & LLM)</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Quản lý định danh, ảnh đại diện, mô hình ngôn ngữ đang hoạt động và trạng thái vận hành của {agent.name}.
                  </p>
                </div>

                {/* Agent Identity Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      onClick={onOpenAvatarModal}
                      className="relative group cursor-pointer shrink-0"
                      title="Bấm để thay đổi Avatar của Agent"
                    >
                      <AgentAvatar agent={agent} size="xl" className="shadow-md" />
                      <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Camera size={18} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-slate-900 dark:text-white">{agent.name}</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {agent.status === "disabled" || agent.enabled === false ? "Disabled" : "Active"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
                        ID: {agent.id} • Slug: {agent.slug}
                      </p>
                      <button
                        type="button"
                        onClick={onOpenAvatarModal}
                        className="text-[11px] font-mono text-[#e0682b] dark:text-[#f8a87c] hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                      >
                        <Camera size={12} />
                        <span>Đổi ảnh đại diện (Avatar)</span>
                      </button>
                    </div>
                  </div>

                  {/* Enable / Disable Agent Toggle */}
                  {agent.canToggle !== false && (
                    <button
                      type="button"
                      onClick={(e) => onToggleAgentEnabled(agent, e)}
                      disabled={togglingAgentId === agent.id}
                      className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all cursor-pointer shrink-0 ${
                        agent.enabled === false || agent.status === "disabled"
                          ? "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {togglingAgentId === agent.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : agent.enabled === false || agent.status === "disabled" ? (
                        <Power size={14} />
                      ) : (
                        <PowerOff size={14} />
                      )}
                      <span>
                        {agent.enabled === false || agent.status === "disabled" ? "Kích hoạt Agent" : "Vô hiệu hóa Agent"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Active LLM Model Switcher Card */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-[#f8a87c]" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        Mô hình Ngôn ngữ Hoạt động (Active LLM Model)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-[#e0682b] dark:text-[#f8a87c] bg-[#f8a87c]/10 px-2.5 py-0.5 rounded-full border border-[#f8a87c]/30 font-semibold">
                      {isChangingModel ? "Đang cập nhật..." : currentCleanModel}
                    </span>
                  </div>

                  {/* Search models */}
                  <div className="flex items-center gap-2 bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] rounded-xl px-3 py-1.5">
                    <Search size={13} className="text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Tìm mô hình (grok-4.7, gpt-5.6-luna, claude, gemini)..."
                      className="w-full bg-transparent text-xs font-mono text-slate-800 dark:text-white placeholder-neutral-500 focus:outline-none"
                    />
                    {modelSearch && (
                      <button
                        type="button"
                        onClick={() => setModelSearch("")}
                        className="text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {filteredModels.map((m) => {
                      const isCurrent = currentCleanModel === m.model;
                      return (
                        <button
                          key={m.model}
                          type="button"
                          disabled={isChangingModel}
                          onClick={() => onSelectModel(m.model)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border text-left ${
                            isCurrent
                              ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold shadow-xs"
                              : "bg-white dark:bg-[#121218] hover:bg-slate-100 dark:hover:bg-[#1c1c28] text-slate-700 dark:text-neutral-300 border-slate-200/80 dark:border-[#222230]"
                          }`}
                        >
                          <span className="truncate">{m.model}</span>
                          {isCurrent && <Check size={13} className="text-[#f8a87c] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* System Governance & Constitution Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <ShieldCheck size={15} className="text-emerald-400" />
                      <span>Hiến pháp & Quản trị Hệ thống (Persona & Governance)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Enforced (Pass)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed select-text">
                    {agent.description || "Chưa có mô tả chi tiết cho Agent này."}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230]">
                      <div className="text-[10px] text-neutral-500">Identity Profile</div>
                      <div className="text-slate-800 dark:text-neutral-200 font-semibold truncate mt-0.5">
                        SOUL.md ({agent.slug})
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230]">
                      <div className="text-[10px] text-neutral-500">Runtime Engine</div>
                      <div className="text-slate-800 dark:text-neutral-200 font-semibold truncate mt-0.5">
                        {(agent.runtimeVersion || "Skyer v2.2.1").replace(/qwenpaw|agentcore/gi, "AgentCore")}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230]">
                      <div className="text-[10px] text-neutral-500">Skills Bound</div>
                      <div className="text-[#e0682b] dark:text-[#f8a87c] font-semibold truncate mt-0.5">
                        {skills.length} available
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Turn Telemetry & System Latency */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity size={15} className="text-[#f8a87c]" />
                      <span>Hiệu năng & Telemetry Thời gian thực</span>
                    </span>
                    {turnTelemetry?.estimatedCostUsd !== undefined && (
                      <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ${turnTelemetry.estimatedCostUsd.toFixed(4)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] flex flex-col gap-0.5">
                      <span className="text-[10px] text-neutral-500">TTFT (Latency)</span>
                      <span className="text-amber-500 dark:text-amber-400 font-bold">{turnTelemetry?.ttftMs ? `${turnTelemetry.ttftMs}ms` : "Chưa có turn"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] flex flex-col gap-0.5">
                      <span className="text-[10px] text-neutral-500">Tốc độ sinh</span>
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">{turnTelemetry?.tokensPerSec ? `${turnTelemetry.tokensPerSec.toFixed(1)} t/s` : "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] flex flex-col gap-0.5">
                      <span className="text-[10px] text-neutral-500">Thời gian phản hồi</span>
                      <span className="text-slate-800 dark:text-neutral-300 font-bold">{turnTelemetry?.totalDurationMs ? `${(turnTelemetry.totalDurationMs / 1000).toFixed(1)}s` : "—"}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#222230] flex flex-col gap-0.5">
                      <span className="text-[10px] text-neutral-500">Model kiểm thử</span>
                      <span className="text-[#e0682b] dark:text-[#f8a87c] font-bold truncate" title={turnTelemetry?.model || agent.model}>
                        {(turnTelemetry?.model || agent.model).split("/").pop()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reaction Satisfaction & Implicit Evaluation Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Smile size={15} className="text-[#f8a87c]" />
                      <span>Đánh giá Phản hồi & Mức độ Hài lòng (Reactions Telemetry)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400">
                      Tổng {reactionSummary?.total_reactions || 0} lượt đánh giá
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-0.5">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Tích cực (Khen / Tốt)</span>
                      <span className="text-emerald-500 text-sm font-bold">{reactionSummary?.positive_count || 0}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col gap-0.5">
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">Cần cải thiện (Chưa hài lòng)</span>
                      <span className="text-rose-500 text-sm font-bold">{reactionSummary?.negative_count || 0}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col gap-0.5">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Trung tính / Góp ý</span>
                      <span className="text-amber-500 text-sm font-bold">{reactionSummary?.neutral_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPS & MCP */}
            {activeTab === "apps_mcp" && (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Ứng dụng Kết nối & Máy chủ MCP</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Quản lý các kết nối OAuth bên thứ ba (Composio) và danh sách công cụ MCP được gắn trực tiếp vào {agent.name}.
                  </p>
                </div>
                <AgentConnectedAppsTab
                  agentId={agent.id}
                  agentName={agent.name}
                  onOpenConnectModal={onOpenConnectModal}
                  onRefreshTrigger={mcpRefreshTrigger}
                />
              </div>
            )}

            {/* TAB 3: SUB-AGENTS & A2A TOPOLOGY */}
            {activeTab === "subagents" && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Đội ngũ Sub-Agents & Mạng lưới A2A</h4>
                    <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                      Cấu hình phân quyền uỷ thác tác vụ giữa {agent.name} và các Agent nội bộ hoặc liên cụm (External A2A).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTopologyModal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#f8a87c] hover:bg-[#f8a87c]/90 text-neutral-950 text-xs font-mono font-semibold shrink-0 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <Network size={13} />
                    <span>Mở Sơ đồ A2A</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 pt-1">
                  Internal Fleet Sub-Agents
                </div>
                <AgentSubAgentsTab agentId={agent.id} agentName={agent.name} allAgents={allAgents} />

                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 pt-3 border-t border-slate-200 dark:border-[#22222e]">
                  External Swarm (AgentTeams A2A)
                </div>
                <ExternalSubAgentsTab agentId={agent.id} agentName={agent.name} />
              </div>
            )}

            {/* TAB 4: CHANNELS & CRON SCHEDULES */}
            {activeTab === "channels_cron" && (
              <div className="space-y-5 max-w-2xl">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Kênh Giao tiếp & Lịch trình Tự động (Cron)</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Bật/tắt các cổng nhận tin nhắn (Telegram, Discord, Slack, Matrix, Console) và thiết lập công việc định kỳ.
                  </p>
                </div>

                {/* Integrated Dispatch Channels */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <Radio size={14} className="text-[#f8a87c]" />
                      <span>Kênh kết nối (Integrated Channels)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {channels.filter((c) => c.enabled).length} đang hoạt động
                    </span>
                  </div>

                  {loadingChannels ? (
                    <div className="space-y-2 py-1">
                      <div className="h-10 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                      <div className="h-10 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {channels
                        .filter((c) => ["console", "telegram", "discord", "slack", "matrix", "voice"].includes(c.type))
                        .map((ch) => (
                          <div
                            key={ch.type}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                              ch.enabled
                                ? "bg-white dark:bg-[#181824] border-slate-200 dark:border-[#2e2e42] text-slate-900 dark:text-white"
                                : "bg-slate-100/60 dark:bg-[#101016] border-slate-200/50 dark:border-[#1e1e28] text-neutral-500 opacity-75"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={`h-2 w-2 rounded-full shrink-0 ${
                                  ch.enabled ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                                }`}
                              />
                              <span className="font-mono text-xs font-medium uppercase tracking-wider truncate">
                                {ch.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onConfigureChannel(ch)}
                                className="p-1 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                                title={`Cấu hình thông số ${ch.name}`}
                              >
                                <SlidersHorizontal size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => onToggleChannel(ch.type, ch.enabled)}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                  ch.enabled
                                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25"
                                    : "bg-slate-200/70 dark:bg-white/5 border-slate-300 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                {ch.enabled ? "Enabled" : "Disabled"}
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Scheduled Tasks & Automation (Cron) */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock size={14} className="text-[#f8a87c]" />
                      <span>Lịch trình Tự động (Schedules & Cron)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {schedules.length} jobs
                      </span>
                      <button
                        type="button"
                        onClick={onAddSchedule}
                        className="flex items-center gap-1 bg-[#f8a87c]/15 hover:bg-[#f8a87c]/25 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
                      >
                        <Plus size={12} />
                        <span>Thêm lịch</span>
                      </button>
                    </div>
                  </div>

                  {loadingSchedules ? (
                    <div className="space-y-2 py-1">
                      <div className="h-14 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                    </div>
                  ) : schedules.length === 0 ? (
                    <div className="text-center py-6 text-neutral-500 font-mono text-xs border border-dashed border-slate-200 dark:border-[#22222e] rounded-xl">
                      Chưa có lịch trình tự động (cron schedule) nào cho Agent này.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {schedules.map((job) => (
                        <div
                          key={job.id}
                          onClick={() => onEditSchedule(job)}
                          className="p-3 rounded-xl bg-white dark:bg-[#181822] hover:bg-slate-100 dark:hover:bg-[#1f1f2e] border border-slate-200 dark:border-[#242432] space-y-1.5 shadow-xs cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                              {job.name}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {job.cronExpr}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-neutral-400 leading-snug line-clamp-2">
                            {job.promptSnippet}
                          </p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-slate-100 dark:border-white/5">
                            <span>Target: #{job.targetChannel}</span>
                            <span>{job.timezone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: MEMORY & LIVE SKILLS */}
            {activeTab === "memory_skills" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Bộ nhớ Dài hạn & Kỹ năng (Memory & Skills)</h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Quản lý các ghi nhớ bối cảnh của {agent.name} và danh sách kỹ năng chuyên môn (SKILL.md) đã nạp.
                  </p>
                </div>

                {/* Agent Memory Section */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] p-4">
                  <AgentMemoryTab
                    agentId={agent.id}
                    agentName={agent.name}
                    agentSlug={agent.slug}
                  />
                </div>

                {/* Live Skills Pool */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles size={14} className="text-[#f8a87c]" />
                      <span>Kỹ năng Hoạt động (Live Skills Pool)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30">
                      {skills.length} skills ready
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px] max-h-60 overflow-y-auto pr-1">
                    {skills.map((s) => (
                      <div
                        key={s}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121218] border border-slate-200/80 dark:border-[#20202a] text-slate-700 dark:text-neutral-300 flex items-center justify-between"
                      >
                        <span className="truncate">{s}</span>
                        <span className="text-[9px] text-emerald-500 dark:text-[#f8a87c] font-sans shrink-0 ml-2">
                          Ready
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
