import { useTranslation } from "../i18n/LanguageContext";
import { startOnboardingTour } from "../services/onboardingService";
import React, { useState, useEffect, useRef } from "react";
import { Search, Bot, Server, MessageSquare, Volume2, Sparkles, X, HelpCircle, ArrowRight, CornerDownLeft, ShieldCheck, Mic, Settings, Layers, Network, Radio, Brain, ShieldAlert } from "lucide-react";
import { AgentSettingsTab } from "./AgentSettingsModal";
import { InfraAgent, AgentSession } from "../types/agent";
import { SOUND_PRESETS, SoundPreset, playNotificationChime } from "../services/notificationService";

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  agents: InfraAgent[];
  chats: AgentSession[];
  onSelectAgent: (agent: InfraAgent) => void;
  onSelectChat: (chat: AgentSession) => void;
  onNewChat: () => void;
  onToggleSound: () => void;
  isSoundEnabled: boolean;
  onOpenPermissions?: () => void;
  onFilterInstance: (instanceId: string) => void;
  onCompactContext?: () => void;
  onOpenAgentSettings?: (tab: AgentSettingsTab) => void;
  infraInstances: { value: string; label: string; badge: string }[];
}

export function CommandPaletteModal({
  isOpen,
  onClose,
  agents,
  chats,
  onSelectAgent,
  onSelectChat,
  onNewChat,
  onToggleSound,
  isSoundEnabled,
  onOpenPermissions,
  onFilterInstance,
  infraInstances,
  onCompactContext,
  onOpenAgentSettings,
}: CommandPaletteModalProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter actions, agents, instances, and chats
  const q = query.trim().toLowerCase();

  const actionItems = [
    ...(onOpenAgentSettings ? [
      {
        id: "act-agent-settings-iam360-cells",
        type: "action",
        title: "Cài đặt Agent: IAM360 Identity & Org Cells (Cây Phân Quyền)",
        subtitle: "Xem & Quản lý Cây 5 Nhánh Quyền hạn, Ed25519 Signed Intents & A2A Delegation",
        icon: <ShieldAlert size={14} className="text-[#f8a87c]" />,
        action: () => {
          onOpenAgentSettings("iam360_cells");
          onClose();
        },
      },
      {
        id: "act-agent-settings-general",
        type: "action",
        title: "Cài đặt Agent: Hồ sơ & Mô hình AI (Agent Settings)",
        subtitle: "Đổi LLM Model, Avatar, Governance & Trạng thái hoạt động (Alt+,)",
        icon: <Settings size={14} className="text-[#f8a87c]" />,
        action: () => {
          onOpenAgentSettings("general");
          onClose();
        },
      },
      {
        id: "act-agent-settings-apps",
        type: "action",
        title: "Cài đặt Agent: Ứng dụng & MCP (Connected Apps)",
        subtitle: "Quản lý kết nối Composio OAuth & MCP Tool Schemas",
        icon: <Layers size={14} className="text-cyan-400" />,
        action: () => {
          onOpenAgentSettings("apps_mcp");
          onClose();
        },
      },
      {
        id: "act-agent-settings-subagents",
        type: "action",
        title: "Cài đặt Agent: Đội ngũ Sub-Agents & Mạng lưới A2A",
        subtitle: "Cấu hình uỷ thác Sub-Agents nội bộ và liên cụm AgentTeams",
        icon: <Network size={14} className="text-emerald-400" />,
        action: () => {
          onOpenAgentSettings("subagents");
          onClose();
        },
      },
      {
        id: "act-agent-settings-channels",
        type: "action",
        title: "Cài đặt Agent: Kênh Giao tiếp & Lịch trình Tự động (Cron)",
        subtitle: "Bật/tắt Telegram, Discord, Slack, Console & Cron Schedules",
        icon: <Radio size={14} className="text-amber-400" />,
        action: () => {
          onOpenAgentSettings("channels_cron");
          onClose();
        },
      },
      {
        id: "act-agent-settings-memory",
        type: "action",
        title: "Cài đặt Agent: Bộ nhớ Dài hạn & Kỹ năng (Memory & Skills)",
        subtitle: "Quản lý bộ nhớ ngữ cảnh của Agent và danh sách SKILL.md",
        icon: <Brain size={14} className="text-violet-400" />,
        action: () => {
          onOpenAgentSettings("memory_skills");
          onClose();
        },
      },
    ] : []),
    ...(onCompactContext ? [{
      id: "act-compact-context",
      type: "action",
      title: "Compact Active Context",
      subtitle: "Trigger native Skyer checkpoint GC & Scroll context compaction",
      icon: <Sparkles size={14} className="text-amber-400" />,
      action: () => {
        onCompactContext();
        onClose();
      },
    }] : []),
    {
      id: "act-onboarding-tour",
      type: "action",
      title: "Interactive App Tour (Onboarding)",
      subtitle: "Start step-by-step Driver.js guided walkthrough of Skyer Agent360",
      icon: <Sparkles size={14} className="text-[#f8a87c]" />,
      action: () => {
        onClose();
        setTimeout(() => startOnboardingTour({ force: true }), 300);
      },
    },
    {
      id: "act-onboarding-checklist",
      type: "action",
      title: "Getting Started Checklist",
      subtitle: "Reopen the 4-step onboarding progress checklist widget",
      icon: <Sparkles size={14} className="text-amber-400" />,
      action: () => {
        onClose();
        try {
          localStorage.removeItem("agent360_onboarding_checklist_dismissed");
          window.dispatchEvent(new CustomEvent("agent360_milestone_updated"));
        } catch {}
      },
    },
    {
      id: "act-new-chat",
      type: "action",
      title: "New Chat Session",
      subtitle: "Start a fresh interactive turn with the active bot",
      icon: <Sparkles size={14} className="text-[#f8a87c]" />,
      action: () => {
        onNewChat();
        onClose();
      },
    },
    {
      id: "act-toggle-sound",
      type: "action",
      title: isSoundEnabled ? "Mute Audio Chime Alerts" : "Enable Audio Chime Alerts",
      subtitle: `Current state: ${isSoundEnabled ? "Sound Enabled" : "Sound Muted"}`,
      icon: <Volume2 size={14} className="text-[#f8a87c]" />,
      action: () => {
        onToggleSound();
        onClose();
      },
    },
    ...SOUND_PRESETS.map((preset) => ({
      id: `act-chime-${preset.id}`,
      type: "action" as const,
      title: `Sound Preset: ${preset.name}`,
      subtitle: `Switch audio alert to ${preset.description}`,
      icon: <Volume2 size={14} className="text-amber-400" />,
      action: () => {
        try {
          localStorage.setItem("agent360_sound_preset", preset.id);
          playNotificationChime(preset.id as SoundPreset);
        } catch {}
        onClose();
      },
    })),
  ];

  const agentItems = agents
    .filter((a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || (a.roleTag && a.roleTag.toLowerCase().includes(q)))
    .map((a) => ({
      id: `agent-${a.id}`,
      type: "agent",
      title: `@${a.name}`,
      subtitle: `${a.node} • ${a.roleTag || "Agent"} • ${a.model}`,
      icon: <Bot size={14} className="text-emerald-400" />,
      action: () => {
        onSelectAgent(a);
        onClose();
      },
    }));

  const instanceItems = infraInstances
    .filter((i) => i.value !== "all" && (i.label.toLowerCase().includes(q) || i.value.toLowerCase().includes(q)))
    .map((i) => ({
      id: `node-${i.value}`,
      type: "node",
      title: `/${i.value}`,
      subtitle: `Filter view to ${i.label} (${i.badge})`,
      icon: <Server size={14} className="text-cyan-400" />,
      action: () => {
        onFilterInstance(i.value);
        onClose();
      },
    }));

  const chatItems = chats
    .filter((c) => c.title.toLowerCase().includes(q) || c.lastMessageSnippet.toLowerCase().includes(q))
    .slice(0, 8)
    .map((c) => ({
      id: `chat-${c.id}`,
      type: "chat",
      title: c.title,
      subtitle: c.lastMessageSnippet || `Chat session from ${c.updatedAt}`,
      icon: <MessageSquare size={14} className="text-slate-500 dark:text-neutral-400" />,
      action: () => {
        onSelectChat(c);
        onClose();
      },
    }));

  const combinedItems = [
    ...(q ? [] : actionItems),
    ...agentItems,
    ...instanceItems,
    ...chatItems,
    ...(q ? actionItems.filter((a) => a.title.toLowerCase().includes(q)) : []),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (combinedItems[selectedIndex]) {
        combinedItems[selectedIndex].action();
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="h-14 px-4 border-b border-slate-200 dark:border-[#22222e] flex items-center gap-3 bg-slate-50 dark:bg-[#161620]">
          <Search size={18} className="text-[#f8a87c] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search agents (@mons), nodes (/node-6th), chats or actions..."
            className="flex-1 bg-transparent border-0 text-sm text-white placeholder-neutral-500 focus:outline-none font-sans"
          />
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-neutral-500 bg-[#20202c] border border-[#2c2c3c]">
            ESC to close
          </span>
          <button
            type="button"
            onClick={onClose}
            className="sm:hidden text-slate-500 dark:text-neutral-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {combinedItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-amber-500/10 text-slate-900 dark:text-white border border-[#f8a87c]/40 shadow-xs"
                    : "hover:bg-slate-50 dark:bg-[#181822] text-slate-700 dark:text-neutral-300 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-[#181824] border border-slate-200 dark:border-[#28283a] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-slate-900 dark:text-white truncate">{item.title}</span>
                    <span className="text-[11px] text-neutral-500 truncate">{item.subtitle}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#f8a87c] shrink-0">
                    <span>{t("cmdPalette.jump")}</span>
                    <CornerDownLeft size={11} />
                  </div>
                )}
              </div>
            );
          })}

          {combinedItems.length === 0 && (
            <div className="py-8 text-center text-xs font-mono text-neutral-500">
              No matching agents, nodes, chats or commands found.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#0f0f15] border-t border-slate-200 dark:border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500 select-none">
          <div className="flex items-center gap-3">
            <span>{t("cmdPalette.navigate")}</span>
            <span>{t("cmdPalette.select")}</span>
            <span>{t("cmdPalette.close")}</span>
          </div>
          <span>{t("cmdPalette.title")}</span>
        </div>
      </div>
    </div>
  );
}
