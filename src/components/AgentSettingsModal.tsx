import React, { useState, useEffect } from "react";
import {
  Smile,
  X,
  Pencil,
  Info,
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
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCheck,
  FileText,
  Cpu,
} from "lucide-react";
import { fetchWorkspaceFileContent } from "../services/agentApi";
import { Tooltip } from "./ui/Tooltip";
import { saveCustomAgentName } from "../services/avatarService";
import { InfraAgent } from "../types/agent";
import { AgentAvatar, getAgentColorTheme } from "./AgentAvatar";
import { AgentConnectedAppsTab } from "./AgentConnectedAppsTab";
import { AgentSubAgentsTab } from "./AgentSubAgentsTab";
import { ExternalSubAgentsTab } from "./ExternalSubAgentsTab";
import { AgentMemoryTab } from "./AgentMemoryTab";
import { AgentIam360CellTab } from "./AgentIam360CellTab";
import { AgentWebhooksTab } from "./AgentWebhooksTab";
import { AgentChannelConfig, AgentScheduleJob, fetchAgentReactionSummary, MessageReactionSummaryDto } from "../services/agentApi";

export type AgentSettingsTab =
  | "general"
  | "apps_mcp"
  | "subagents"
  | "channels_cron"
  | "memory_skills"
  | "webhooks_a2a"
  | "iam360_cells";

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
  onSelectModel: (modelId: string, providerId?: string) => void;
  // Avatar customization
  onOpenAvatarModal: () => void;
  // Enable / Disable agent
  togglingAgentId: string | null;
  onToggleAgentEnabled: (agent: InfraAgent, e: React.MouseEvent) => void;
  // Apps & MCP
  onOpenConnectModal: () => void;
  mcpRefreshTrigger: number;
  onMcpClientsChanged?: () => void;
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
  onMcpClientsChanged,
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
  const [, setModalUpdateTick] = useState(0);
  useEffect(() => {
    const onUpdate = () => setModalUpdateTick((t) => t + 1);
    window.addEventListener("agent-avatar-updated", onUpdate);
    window.addEventListener("agent-name-updated", onUpdate);
    return () => {
      window.removeEventListener("agent-avatar-updated", onUpdate);
      window.removeEventListener("agent-name-updated", onUpdate);
    };
  }, []);
  const agentTheme = getAgentColorTheme(agent.id, agent.name, agent.roleTag);
  const [modelSearch, setModelSearch] = useState("");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [reactionSummary, setReactionSummary] = useState<MessageReactionSummaryDto | null>(null);

  // SOUL.md expandable viewer & editor state
  const [isSoulExpanded, setIsSoulExpanded] = useState(false);
  const [soulContent, setSoulContent] = useState<string>("");
  const [loadingSoul, setLoadingSoul] = useState<boolean>(false);
  const [copiedSoul, setCopiedSoul] = useState<boolean>(false);

  useEffect(() => {
    if (isSoulExpanded && agent?.id && !soulContent) {
      setLoadingSoul(true);
      fetchWorkspaceFileContent(agent.id, "SOUL.md")
        .then((content) => {
          setSoulContent(content || "# SOUL.md\n\n(Tệp trống hoặc chưa được khởi tạo)");
        })
        .catch(() => {
          setSoulContent("# SOUL.md\n\n[Không thể tải nội dung SOUL.md]");
        })
        .finally(() => setLoadingSoul(false));
    }
  }, [isSoulExpanded, agent?.id, soulContent]);

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
    icon: React.ReactNode;
    badge?: string | number;
  }[] = [
    {
      id: "general",
      label: "Hồ sơ & Mô hình",
      icon: <Bot size={15} />,
    },
    {
      id: "iam360_cells",
      label: "Phân quyền & Cells",
      icon: <ShieldCheck size={15} />,
      badge: "2-Cell",
    },
    {
      id: "apps_mcp",
      label: "Ứng dụng & MCP",
      icon: <Layers size={15} />,
    },
    {
      id: "subagents",
      label: "Đội ngũ Sub-Agents",
      icon: <Network size={15} />,
    },
    {
      id: "channels_cron",
      label: "Kênh & Lịch chạy",
      icon: <Radio size={15} />,
      badge: channels.filter((c) => c.enabled).length + schedules.length || undefined,
    },
    {
      id: "webhooks_a2a",
      label: "Webhooks & Matrix",
      icon: <Activity size={15} />,
    },
    {
      id: "memory_skills",
      label: "Bộ nhớ & Kỹ năng",
      icon: <Brain size={15} />,
      badge: skills.length || undefined,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          "--agent-primary": agentTheme.primary,
          "--agent-light": agentTheme.light,
          "--agent-dark": agentTheme.dark,
          "--agent-bg-light": agentTheme.bgLight,
          "--agent-bg-dark": agentTheme.bgDark,
          "--agent-border-light": agentTheme.borderLight,
          "--agent-border-dark": agentTheme.borderDark,
        } as React.CSSProperties}
        className="w-full sm:w-[95vw] md:w-[1100px] lg:w-[1240px] xl:w-[1360px] max-w-[96vw] h-[94dvh] sm:h-[92vh] max-h-[100dvh] sm:max-h-[820px] bg-white dark:bg-[#121218] border-t sm:border border-slate-200 dark:border-[#262634] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              style={{
                backgroundColor: agentTheme.bgLight,
                borderColor: agentTheme.borderLight,
                color: agentTheme.light,
              }}
              className="h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs"
            >
              <Bot size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  Cấu hình Agent: {agent.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border shrink-0 bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]">
                  {agent.roleTag || "AI Teammate"}
                </span>
                <Tooltip
                  content={
                    <div className="text-left font-mono space-y-0.5 py-0.5">
                      <div className="font-semibold text-slate-900 dark:text-white">Thông tin hạ tầng</div>
                      <div>Node: {agent.node || "Node 3rd (Core)"}</div>
                      <div>ID: {agent.id}</div>
                      <div>Slug: {agent.slug}</div>
                      <div>Runtime: {(agent.runtimeVersion || "Skyer v2.2.1").replace(/qwenpaw|agentcore/gi, "AgentCore")}</div>
                    </div>
                  }
                  placement="bottom"
                  minWidth={220}
                >
                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Thông tin node & ID"
                  >
                    <Info size={13} />
                  </button>
                </Tooltip>
              </div>
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
          {/* Left Navigation Rail: Minimalist, clean single-line */}
          <div className="w-full md:w-52 bg-slate-50 dark:bg-[#0f0f15] border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#20202c] p-2 sm:p-2.5 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left transition-all cursor-pointer shrink-0 md:w-full ${
                    isActive
                      ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] font-semibold shadow-xs"
                      : "text-slate-600 dark:text-neutral-400 hover:bg-slate-200/60 dark:hover:bg-[#181822] hover:text-slate-900 dark:hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? "text-[var(--agent-light)] dark:text-[var(--agent-dark)]" : "text-neutral-400"}>
                      {item.icon}
                    </span>
                    <span className="text-xs truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono shrink-0 ${
                      isActive
                        ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]"
                        : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-neutral-300"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-3.5 sm:p-5 overflow-y-auto space-y-4 sm:space-y-5 bg-white dark:bg-[#121218]">
            {/* TAB 1: GENERAL (Identity, LLM Model, Governance, Status) */}
            {activeTab === "general" && (
              <div className="space-y-4 max-w-4xl">
                {/* Agent Identity Card */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      onClick={onOpenAvatarModal}
                      className="relative group cursor-pointer shrink-0"
                      title="Bấm để chỉnh sửa Avatar & Tên Agent"
                    >
                      <AgentAvatar agent={agent} size="lg" className="shadow-xs" />
                      <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white shadow-sm">
                        <Camera size={16} />
                      </div>
                    </div>
                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{agent.name}</span>
                        <button
                          type="button"
                          onClick={onOpenAvatarModal}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          title="Chỉnh sửa Avatar & Tên Agent"
                          aria-label="Chỉnh sửa Agent"
                        >
                          <Pencil size={12} />
                        </button>
                        <span
                          style={{
                            backgroundColor: agentTheme.bgLight,
                            color: agentTheme.light,
                            borderColor: agentTheme.borderLight,
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-mono border shrink-0"
                        >
                          {agent.roleTag || "Agent"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-neutral-500 font-mono">
                        <Tooltip
                          content={
                            <div className="text-left font-mono space-y-0.5 py-0.5">
                              <div className="font-semibold text-slate-900 dark:text-white">Chi tiết Định danh & Node</div>
                              <div>Node: {agent.node || "Node 3rd (Core)"}</div>
                              <div>ID: {agent.id}</div>
                              <div>Slug: {agent.slug}</div>
                              <div>Runtime: {(agent.runtimeVersion || "Skyer v2.2.1").replace(/qwenpaw|agentcore/gi, "AgentCore")}</div>
                            </div>
                          }
                          placement="top"
                          minWidth={220}
                        >
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-help transition-colors select-none">
                            <Info size={11} className="text-slate-400 dark:text-neutral-500" />
                            <span className="text-[10px] font-mono">{agent.node ? agent.node.split(" - ")[0] : "Node"} · {agent.slug || agent.id}</span>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Enable / Disable Agent Toggle */}
                  {agent.canToggle !== false && (
                    <button
                      type="button"
                      onClick={(e) => onToggleAgentEnabled(agent, e)}
                      disabled={togglingAgentId === agent.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium flex items-center gap-1.5 border transition-all cursor-pointer shrink-0 ${
                        agent.enabled === false || agent.status === "disabled"
                          ? "bg-slate-200/70 dark:bg-white/5 border-slate-300 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      }`}
                      title={agent.enabled === false || agent.status === "disabled" ? "Bấm để kích hoạt Agent" : "Bấm để tạm dừng Agent"}
                    >
                      {togglingAgentId === agent.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : agent.enabled === false || agent.status === "disabled" ? (
                        <Power size={13} />
                      ) : (
                        <PowerOff size={13} />
                      )}
                      <span>{agent.enabled === false || agent.status === "disabled" ? "Tạm dừng" : "Hoạt động"}</span>
                    </button>
                  )}
                </div>

                {/* Active LLM Model Switcher Card (Simple QwenPaw Style) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cpu size={14} style={{ color: agentTheme.primary }} />
                      <span>Mô hình AI (LLM Model)</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-neutral-400">Đang chạy:</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border font-semibold bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] flex items-center gap-1">
                        {isChangingModel && <Loader2 size={11} className="animate-spin" />}
                        <span>{isChangingModel ? "Đang đổi..." : currentCleanModel}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quick-pick flagship model pills (QwenPaw Style) */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                      Mô hình phổ biến (Quick Select)
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { id: "grok-4.7", label: "Grok 4.7" },
                        { id: "gpt-5.6-luna", label: "GPT-5.6 Luna" },
                        { id: "gpt-6-sol", label: "GPT-6 Sol" },
                        { id: "claude-opus-4.6-thinking", label: "Claude Opus 4.6" },
                        { id: "gemini-3.7-flash-tiered", label: "Gemini 3.7 Flash" },
                        { id: "qwen3.7-max", label: "Qwen 3.7 Max" },
                      ].map((preset) => {
                        const isCurrent = currentCleanModel === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            disabled={isChangingModel}
                            onClick={() => onSelectModel(preset.id)}
                            className={"px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer border flex items-center gap-1.5 " + (
                              isCurrent
                                ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] font-semibold shadow-xs"
                                : "bg-white dark:bg-[#121218] hover:bg-slate-100 dark:hover:bg-[#1c1c28] text-slate-700 dark:text-neutral-300 border-slate-200/80 dark:border-[#222230]"
                            )}
                          >
                            <span>{preset.label}</span>
                            {isCurrent && <Check size={11} style={{ color: agentTheme.primary }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clean Dropdown / Full Search Selector */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] text-slate-800 dark:text-neutral-200 hover:border-slate-300 dark:hover:border-neutral-700 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles size={13} style={{ color: agentTheme.primary }} />
                        <span className="font-medium">
                          {isModelDropdownOpen ? "Thu gọn danh sách tất cả mô hình" : "Chọn từ danh sách tất cả mô hình khả dụng..."}
                        </span>
                      </span>
                      {isModelDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isModelDropdownOpen && (
                      <div className="mt-2 p-2 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] space-y-2 animate-in fade-in duration-100">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#222230] rounded-lg px-2.5 py-1">
                          <Search size={12} className="text-neutral-400 shrink-0" />
                          <input
                            type="text"
                            value={modelSearch}
                            onChange={(e) => setModelSearch(e.target.value)}
                            placeholder="Tìm kiếm model khả dụng..."
                            className="w-full bg-transparent text-xs font-mono text-slate-800 dark:text-white placeholder-neutral-500 focus:outline-none"
                            autoFocus
                          />
                          {modelSearch && (
                            <button
                              type="button"
                              onClick={() => setModelSearch("")}
                              className="text-slate-400 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                            >
                              <X size={11} />
                            </button>
                          )}
                        </div>

                        <div className="max-h-48 overflow-y-auto pr-1 space-y-1">
                          {filteredModels.length === 0 ? (
                            <div className="py-3 text-center text-xs text-neutral-400 font-mono">
                              Không tìm thấy mô hình phù hợp
                            </div>
                          ) : (
                            filteredModels.map((m) => {
                              const isCurrent = currentCleanModel === m.model;
                              return (
                                <button
                                  key={m.model}
                                  type="button"
                                  disabled={isChangingModel}
                                  onClick={() => {
                                    onSelectModel(m.model, m.providerId);
                                    setIsModelDropdownOpen(false);
                                  }}
                                  className={"w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border text-left " + (
                                    isCurrent
                                      ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] font-semibold shadow-xs"
                                      : "bg-transparent hover:bg-slate-100 dark:hover:bg-[#1c1c28] text-slate-700 dark:text-neutral-300 border-transparent"
                                  )}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="truncate">{m.model}</span>
                                    {m.providerName && (
                                      <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                                        ({m.providerName})
                                      </span>
                                    )}
                                  </div>
                                  {isCurrent && <Check size={12} style={{ color: agentTheme.primary }} className="shrink-0 ml-2" />}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Governance & SOUL.md Profile (Expandable) */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] space-y-2.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-emerald-500 dark:text-emerald-400" />
                      <span>Hồ sơ & Quản trị</span>
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      SOUL.md ({agent.slug}) • {skills.length} skills
                    </span>
                  </div>

                  {agent.description && (
                    <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed select-text line-clamp-3">
                      {agent.description}
                    </p>
                  )}

                  {/* Expand / Collapse SOUL.md file preview */}
                  <div className="pt-1 border-t border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setIsSoulExpanded((prev) => !prev)}
                        className="text-xs font-mono font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <FileText size={13} style={{ color: agentTheme.primary }} />
                        <span>{isSoulExpanded ? "Thu gọn SOUL.md" : "Xem nội dung SOUL.md"}</span>
                        {isSoulExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {isSoulExpanded && soulContent && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(soulContent);
                            setCopiedSoul(true);
                            setTimeout(() => setCopiedSoul(false), 2000);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-mono border border-slate-200 dark:border-white/10 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedSoul ? <CheckCheck size={11} className="text-emerald-500" /> : <Copy size={11} />}
                          <span>{copiedSoul ? "Đã chép" : "Sao chép"}</span>
                        </button>
                      )}
                    </div>

                    {isSoulExpanded && (
                      <div className="mt-2 p-3 rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] max-h-60 overflow-y-auto font-mono text-[11px] leading-relaxed select-text text-slate-700 dark:text-neutral-300 whitespace-pre-wrap animate-in fade-in duration-100">
                        {loadingSoul ? (
                          <div className="flex items-center gap-2 text-neutral-400 py-3 justify-center">
                            <Loader2 size={13} className="animate-spin" />
                            <span>Đang tải SOUL.md...</span>
                          </div>
                        ) : (
                          soulContent
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Turn Telemetry & Reactions: Compact 1-line statistics strip (Boolean guard to prevent stray 0) */}
                {Boolean(turnTelemetry?.ttftMs || (reactionSummary && reactionSummary.total_reactions > 0)) && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] flex items-center justify-between gap-3 text-[11px] font-mono flex-wrap">
                    {turnTelemetry?.ttftMs && (
                      <div className="flex items-center gap-1.5 text-neutral-500">
                        <Activity size={13} style={{ color: agentTheme.primary }} />
                        <span>TTFT: <strong className="text-slate-800 dark:text-neutral-200">{turnTelemetry.ttftMs}ms</strong></span>
                        {turnTelemetry.tokensPerSec && (
                          <span>• <strong className="text-emerald-500">{turnTelemetry.tokensPerSec.toFixed(1)} t/s</strong></span>
                        )}
                      </div>
                    )}
                    {reactionSummary && reactionSummary.total_reactions > 0 && (
                      <div className="flex items-center gap-2 text-neutral-500 ml-auto">
                        <Smile size={13} style={{ color: agentTheme.primary }} />
                        <span>Đánh giá:</span>
                        <span className="text-emerald-500 font-semibold">+{reactionSummary.positive_count}</span>
                        {reactionSummary.negative_count > 0 && (
                          <span className="text-rose-500 font-semibold">-{reactionSummary.negative_count}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 1B: IAM360 IDENTITY CELL & ORGANIZATION CELL WORKBENCH */}
            {activeTab === "iam360_cells" && (
              <div className="space-y-4 max-w-5xl">
                <AgentIam360CellTab
                  agentId={agent.id}
                  agentSlug={agent.slug}
                  agentName={agent.name}
                />
              </div>
            )}

            {/* TAB 2: APPS & MCP */}
            {activeTab === "apps_mcp" && (
              <div className="space-y-4 max-w-4xl">

                <AgentConnectedAppsTab
                  agentId={agent.id}
                  agentName={agent.name}
                  onOpenConnectModal={onOpenConnectModal}
                  onRefreshTrigger={mcpRefreshTrigger}
                  onClientsChanged={onMcpClientsChanged}
                />
              </div>
            )}

            {/* TAB 3: SUB-AGENTS & A2A TOPOLOGY */}
            {activeTab === "subagents" && (
              <div className="space-y-4 max-w-4xl">
                <div className="flex items-center justify-between gap-3 pb-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                    Danh sách Sub-Agents & Topology
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTopologyModal();
                    }}
                    style={{ backgroundColor: agentTheme.primary }}
                    className="px-2.5 py-1 rounded-lg hover:opacity-90 text-neutral-950 text-xs font-mono font-semibold shrink-0 transition-opacity shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <Network size={12} />
                    <span>Sơ đồ A2A</span>
                    <ArrowUpRight size={12} />
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
              <div className="space-y-5 max-w-4xl">


                {/* Integrated Dispatch Channels */}
                <div className="rounded-2xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <Radio size={14} style={{ color: agentTheme.primary }} />
                      <span>Kênh kết nối</span>
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
                                    ? "bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] font-medium"
                                    : "bg-slate-200/60 dark:bg-white/5 border-slate-300/80 dark:border-white/10 text-neutral-400"
                                }`}
                              >
                                {ch.enabled ? "Bật" : "Tắt"}
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
                      <Clock size={14} style={{ color: agentTheme.primary }} />
                      <span>Lịch trình (Cron)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {schedules.length} jobs
                      </span>
                      <button
                        type="button"
                        onClick={onAddSchedule}
                        className="flex items-center gap-1 bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] hover:opacity-85 text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer"
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
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]">
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

            {/* TAB 4B: WEBHOOKS, MATRIX BRIDGE & QWENPAW RUNTIME API */}
            {activeTab === "webhooks_a2a" && (
              <div className="space-y-4 max-w-4xl">

                <AgentWebhooksTab
                  agentId={agent.id}
                  agentName={agent.name}
                  agentSlug={agent.slug}
                />
              </div>
            )}

            {/* TAB 5: MEMORY & LIVE SKILLS */}
            {activeTab === "memory_skills" && (
              <div className="space-y-6 max-w-4xl">


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
                      <Sparkles size={14} style={{ color: agentTheme.primary }} />
                      <span>Kỹ năng (Skills)</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)]">
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
                        <span className="text-[9px] text-[var(--agent-light)] dark:text-[var(--agent-dark)] font-mono font-semibold shrink-0 ml-2">
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
