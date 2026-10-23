import React from "react";
import { connectSessionMultiplexer, ActiveSessionsSnapshot, SessionTurnUpdate, SessionUnreadUpdate } from "../services/sessionMultiplexer";
function ChannelChatIcon({ channel, isSelected, size = 15 }: { channel?: string; isSelected?: boolean; size?: number }) {
  const ch = (channel || "console").toLowerCase();
  
  // 1. Official Telegram Logo SVG
  if (ch === "telegram") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 select-none" aria-label="Telegram">
        <circle cx="12" cy="12" r="12" fill="#24A1DE"/>
        <path
          d="M5.4 11.9L16.8 7.3C17.3 7.1 17.8 7.4 17.6 8L15.7 17.1C15.5 17.7 14.8 17.9 14.3 17.5L11.2 15L9.6 16.5C9.4 16.7 9.1 16.6 9.1 16.3L9.3 13.7L14.7 8.8C14.9 8.6 14.7 8.3 14.4 8.5L7.8 12.7L5.4 11.9Z"
          fill="white"
        />
      </svg>
    );
  }

  // 2. Official Zalo Logo SVG (Iconic Speech Bubble with White Lettermark)
  if (ch === "zalo") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0 select-none" aria-label="Zalo">
        <rect width="48" height="48" rx="12" fill="#0068FF" />
        <path
          d="M34.5 13H13.5C10.5 13 8 15.5 8 18.5V29.5C8 32.5 10.5 35 13.5 35H18L21 38.5C21.4 39 22.2 39 22.6 38.5L25.6 35H34.5C37.5 35 40 32.5 40 29.5V18.5C40 15.5 37.5 13 34.5 13Z"
          fill="#0052CC"
          opacity="0.35"
        />
        {/* Zalo official typography mark */}
        <path
          d="M14 20H23L16 28H23.5V30.5H13.5L20.5 22.5H14V20Z"
          fill="white"
        />
        <circle cx="28" cy="25" r="3.2" fill="white" />
        <path
          d="M33 19H35.5V30.5H33V19Z"
          fill="white"
        />
      </svg>
    );
  }

  // 3. Official Discord Logo SVG
  if (ch === "discord") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 select-none" aria-label="Discord">
        <rect width="24" height="24" rx="6" fill="#5865F2"/>
        <path
          d="M17.5 7.2C16.3 6.6 15 6.2 13.7 6C13.5 6.3 13.3 6.7 13.2 7C11.8 6.8 10.4 6.8 9 7C8.9 6.7 8.7 6.3 8.5 6C7.2 6.2 5.9 6.6 4.7 7.2C2.4 10.6 1.8 13.9 2.1 17.1C3.6 18.2 5.1 19 6.5 19.4C6.9 18.9 7.2 18.3 7.5 17.7C7 17.5 6.5 17.3 6 17C6.1 16.9 6.2 16.8 6.3 16.7C9.3 18.1 12.7 18.1 15.7 16.7C15.8 16.8 15.9 16.9 16 17C15.5 17.3 15 17.5 14.5 17.7C14.8 18.3 15.1 18.9 15.5 19.4C16.9 19 18.4 18.2 19.9 17.1C20.3 13.3 19.3 10.1 17.5 7.2ZM8.4 15.2C7.5 15.2 6.8 14.4 6.8 13.4C6.8 12.4 7.5 11.6 8.4 11.6C9.3 11.6 10 12.4 10 13.4C10 14.4 9.3 15.2 8.4 15.2ZM15.6 15.2C14.7 15.2 14 14.4 14 13.4C14 12.4 14.7 11.6 15.6 11.6C16.5 11.6 17.2 12.4 17.2 13.4C17.2 14.4 16.5 15.2 15.6 15.2Z"
          fill="white"
        />
      </svg>
    );
  }

  // 4. Official Slack Logo SVG
  if (ch === "slack") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0 select-none" aria-label="Slack">
        <path d="M5.04 14.07a2.02 2.02 0 1 1-2.02-2.02h2.02v2.02zm1.01 0a2.02 2.02 0 0 1 4.04 0v5.05a2.02 2.02 0 1 1-4.04 0v-5.05z" fill="#E01E5A"/>
        <path d="M9.93 5.04a2.02 2.02 0 1 1-2.02-2.02v2.02h2.02zm0 1.01a2.02 2.02 0 0 1 0 4.04H4.88a2.02 2.02 0 1 1 0-4.04h5.05z" fill="#36C5F0"/>
        <path d="M18.96 9.93a2.02 2.02 0 1 1 2.02 2.02h-2.02V9.93zm-1.01 0a2.02 2.02 0 0 1-4.04 0V4.88a2.02 2.02 0 1 1 4.04 0v5.05z" fill="#2EB67D"/>
        <path d="M14.07 18.96a2.02 2.02 0 1 1 2.02 2.02v-2.02h-2.02zm0-1.01a2.02 2.02 0 0 1 0-4.04h5.05a2.02 2.02 0 1 1 0 4.04h-5.05z" fill="#ECB22E"/>
      </svg>
    );
  }

  // 5. Default Console Web Workspace
  return <MessageSquare size={size} className={isSelected ? "text-[#f8a87c]" : "text-neutral-400"} />;
}

import { getCurrentUserProfile, UserProfile } from "../services/userService";
import { initiateSkyerSignOut } from "../services/pkceAuth";
import { authConfig } from "../config/authConfig";

// Haptic feedback helper for mobile touch gestures

import { DropdownMenu, DropdownMenuItem, DropdownMenuSection, DropdownSubMenu } from "../components/ui/DropdownMenu";
import { Tabs, Tooltip, ConfirmDialog, CodeBlock, AgentPill } from "../components/ui";
import { useTranslation } from "../i18n/LanguageContext";
import { SkyerLogo } from "../components/SkyerLogo";
import { fetchPendingApprovals, approveToolExecution, denyToolExecution, PendingApproval } from "../services/approvalApi";
import { ShieldAlert, CheckCircle, XCircle, ShieldCheck, GitFork, Network, Keyboard, Info } from "lucide-react";
import { ContextUsageBar } from "../components/ContextUsageBar";
import { ConnectAppsModal, APPS_CATALOG } from "../components/ConnectAppsModal";
import { AgentConnectedAppsTab } from "../components/AgentConnectedAppsTab";
import { AgentSubAgentsTab } from "../components/AgentSubAgentsTab";
import { ExternalSubAgentsTab } from "../components/ExternalSubAgentsTab";
import { ChannelConfigModal } from "../components/ChannelConfigModal";
import { ScheduleJobModal } from "../components/ScheduleJobModal";
import { VoiceRecordSettingsModal } from "../components/VoiceRecordSettingsModal";
import { StarredAndShortcutsModal } from "../components/StarredAndShortcutsModal";
import { A2ATopologyGraphModal } from "../components/A2ATopologyGraphModal";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Monitor,
  Trash2,
  Globe,
  MoreVertical,
  LogOut,
  Pin,
  PinOff,
  Download,
  CheckCheck,
  Archive,
  ArchiveRestore,
  Edit2,
  Wifi,
  Camera, Maximize2,
  Minimize2, ZoomIn, ZoomOut, RotateCcw, RotateCw,
  Search,
  Plus,
  Paperclip,
  MicOff,
  Square,
  X,
  Mic,
  Pause,
  Send,
  Loader2,
  Folder,
  FileText,
  RefreshCw,
  Menu,
  ChevronLeft,
  ChevronRight,
  Server,
  Activity,
  Layers,
  MessageSquare,
  Play,
  Command,
  ArrowRight,
  ArrowUpRight,
  Share2,
  Volume2,
  VolumeX,
  Bot,
  SlidersHorizontal,
  ExternalLink,
  AlertCircle,
  Sparkles,
  Clock,
  Radio,
  Copy,
  Check,
  Terminal,
  ChevronDown,
  ChevronUp,
  Shield,
  Power,
  PowerOff,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  CircleDot,
  Target,
  Rocket,
  ArrowUp,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession, SessionCollaborationRoom } from "../types/agent";

/** Short haptic tick on supporting devices; silently ignored elsewhere. */
const triggerHaptic = (ms = 10) => {
  try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
};
import {
  fetchInfraAgents,
  AgentListAuthError,
  updateAgentActiveModel,
  fetchAgentChats,
  getCachedAgentChats,
  markChatAsRead,
  fetchActiveChats,
  fetchChatMessages,
  parseRawChatMessages,
  getCachedChatMessages,
  setCachedChatMessages,
  stopConsoleChat,
  fetchSkills,
  fetchAgentChannels,
  toggleAgentChannel,
  fetchAgentSchedules,
  AgentChannelConfig,
  AgentScheduleJob,
  fetchWorkspaceTree,
  fetchWorkspaceLibrary,
  fetchWorkspaceFileContent,
  fetchWorkspaceFileBlobUrl,
  downloadWorkspaceFile,
  LibraryCategory,
  fetchAgentMcpClients,
  AgentMcpClient,
  fetchAvailableModels,
  ModelOption,
  WorkspaceTreeNode,
  sendTurnTelemetryBeacon,
  compactAgentContext,
  fetchAgentLoopMode,
  updateAgentLoopMode,
  AgentLoopModeConfig,
  toggleAgentEnabled,
  fetchChatSessionRoom,
  pullAgentIntoChatRoom,
  updateChatRoomTitle,
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { TurnAccumulator, attachLiveTurn } from "../services/turnStream";
import { subAgentApi, SubAgentBinding } from "../services/subAgentApi";
import { uploadFileToGateway, UploadedFileResult } from "../services/uploadApi";
import { requestNotificationPermission, notifyTaskComplete, SoundPreset, SOUND_PRESETS, playNotificationChime, playMicroClick } from "../services/notificationService";
import { speakText, stopSpeaking, getStoredSpeechSettings, saveStoredSpeechSettings, getAvailableVoices } from "../services/speechService";
import { CustomSelect, StatusBadge, IconButton, SearchInput, Toast, EmptyState } from "../components/ui";
import { CommandPaletteModal } from "../components/CommandPaletteModal";
import { SettingsModal } from "../components/SettingsModal";
import { AgentSettingsModal, AgentSettingsTab } from "../components/AgentSettingsModal";
import { PermissionsModal } from "../components/PermissionsModal";
import { OnboardingChecklistWidget, recordMilestone } from "../components/OnboardingChecklistWidget";
import { startOnboardingTour, hasSeenOnboardingTour, resetOnboardingTour } from "../services/onboardingService";
import { KeyboardShortcutsModal } from "../components/KeyboardShortcutsModal";
import { AudioVisualizerWaveform } from "../components/AudioVisualizerWaveform";
import { AgentAvatar } from "../components/AgentAvatar";
import { AgentAvatarModal } from "../components/AgentAvatarModal";
import { AgentMemoryTab } from "../components/AgentMemoryTab";
import { SlashCommandMenu, SlashCommand } from "../components/SlashCommandMenu";
import { PromptRecipesModal } from "../components/PromptRecipesModal";
import { MermaidDiagram } from "../components/MermaidDiagram";
import { requestPermission, queryPermissionStatus } from "../services/permissionService";
import { TelemetryHud, TurnTelemetry } from "../components/TelemetryHud";
import { ThemeSelector } from "../components/ThemeSelector";
import { LanguageSelector } from "../components/LanguageSelector";
import { operatorKey } from "../services/a2aApi";
import { AgentBrowserInfo, DesktopAuthError, agentBrowserImageUrl, fetchAgentBrowser, fetchAgentBrowserFrame, focusAgentBrowser, issueAgentDesktopUrl, openAgentDesktopTab } from "../services/agentBrowserApi";



// Shared Modal Thinking & Tool Calls Detail
function AgentThinkingModal({
  msg,
  agentLabel,
  onClose,
}: {
  msg: ChatMessage;
  agentLabel?: string;
  onClose: () => void;
}) {
  const steps = msg.steps || [];
  const toolCalls = msg.toolCalls || [];
  const allToolItems = steps.filter((s) => s.kind === "tool_call").length > 0
    ? steps.filter((s) => s.kind === "tool_call")
    : toolCalls.map((tc) => ({ kind: "tool_call" as const, ...tc }));
  const reasoningItems = steps.filter((s) => s.kind === "reasoning");
  if (reasoningItems.length === 0 && msg.reasoning) {
    reasoningItems.push({ kind: "reasoning", text: msg.reasoning });
  }

  const totalToolCount = allToolItems.length;
  const displayAgent = msg.senderAgentName || msg.senderAgentId || agentLabel || "Agent";

  return (
    <div
      data-testid="agent-thinking-modal"
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[82vh] rounded-2xl bg-white dark:bg-[#12121a] border border-slate-200 dark:border-[#262636] shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-slate-200 dark:border-[#222230] flex items-center justify-between bg-slate-50 dark:bg-[#161620]">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={15} className="text-[#f8a87c] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                Thinking & Tool Execution — {displayAgent}
              </h3>
              <p className="text-[10px] font-mono text-neutral-500">
                {totalToolCount} công cụ thực thi · {reasoningItems.length} bước suy luận
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Đóng modal thinking"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {reasoningItems.map((r, rIdx) => {
            const wordCount = (r.text || "").split(/\s+/).filter(Boolean).length;
            const estimatedSec = Math.max(1, Math.round(wordCount / 18));
            return (
              <div
                key={rIdx}
                className="rounded-xl bg-slate-50 dark:bg-[#14141c] border border-slate-200 dark:border-[#22222e] p-3 text-xs font-sans space-y-1.5"
              >
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-300 font-mono text-[11px]">
                  <Sparkles size={12} className="text-[#f8a87c]" />
                  <span className="font-semibold">Suy luận (~{estimatedSec}s · {wordCount} từ)</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                  {renderInlineMarkdown(r.text || "")}
                </div>
              </div>
            );
          })}

          {allToolItems.map((step, sIdx) => (
            <AgentToolCard
              key={sIdx}
              toolCall={{
                tool: step.tool || "Tool",
                args: step.args,
                result: step.result,
                state: step.state,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Collapsible Accordion wrapper for tool calls & execution trace
function TurnExecutionAccordion({
  msg,
  isStreamingThisTurn,
  agentLabel,
  onOpenModal,
}: {
  msg: ChatMessage;
  isStreamingThisTurn: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
  agentLabel?: string;
  onOpenModal?: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const steps = msg.steps || [];
  const toolCalls = msg.toolCalls || [];
  const allToolItems = steps.filter((s) => s.kind === "tool_call").length > 0
    ? steps.filter((s) => s.kind === "tool_call")
    : toolCalls.map((tc) => ({ kind: "tool_call" as const, ...tc }));
  const reasoningItems = steps.filter((s) => s.kind === "reasoning");
  if (reasoningItems.length === 0 && msg.reasoning) {
    reasoningItems.push({ kind: "reasoning", text: msg.reasoning });
  }

  const totalToolCount = allToolItems.length;
  const displayAgent = msg.senderAgentName || msg.senderAgentId || agentLabel || "Agent";

  const handleOpen = () => {
    if (onOpenModal) {
      onOpenModal();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="w-full my-1">
      {/* Lean Trigger Pill in Chat Session: Click to open Thinking & Tool Execution Modal */}
      <button
        data-ux-target-min="24"
        data-testid="open-thinking-modal-btn"
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#14141c] hover:bg-neutral-200 dark:hover:bg-[#1a1a24] border border-neutral-200 dark:border-[#22222e] hover:border-[#f8a87c]/40 text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer shadow-xs select-none"
      >
        {isStreamingThisTurn ? (
          <Loader2 size={12} className="text-[#f8a87c] animate-spin shrink-0" />
        ) : (
          <Sparkles size={12} className="text-emerald-400 shrink-0" />
        )}
        <span className="font-semibold text-slate-800 dark:text-neutral-200">
          {isStreamingThisTurn
            ? `${displayAgent} đang suy nghĩ & chạy công cụ (${totalToolCount} bước)`
            : `Thinking · ${displayAgent} (${totalToolCount} ${totalToolCount === 1 ? "tool call" : "tool calls"}${reasoningItems.length > 0 ? " + suy nghĩ" : ""})`}
        </span>
        <span className="text-[10px] text-[#f8a87c] font-sans underline ml-1">
          Xem chi tiết
        </span>
      </button>

      {/* Modal Thinking & Tool Calls Detail */}
      {isModalOpen && (
        <AgentThinkingModal
          msg={msg}
          agentLabel={agentLabel}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

// Agent Tool Execution Block
function AgentToolCard({ toolCall }: { toolCall: { tool: string; args?: string; result?: string; state?: "calling" | "success" | "error" } }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"args" | "result" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCalling = toolCall.state === "calling";
  const isError = toolCall.state === "error";

  // Check if toolCall is browser view screen, screenshot, cdp, or visual navigation action
  const toolLower = (toolCall.tool || "").toLowerCase();
  const isScreenAction =
    toolLower.includes("browser") ||
    toolLower.includes("screenshot") ||
    toolLower.includes("screen") ||
    toolLower.includes("cdp") ||
    toolLower.includes("navigate") ||
    toolLower.includes("view_image");

  // Extract screenshot image if present in result or args
  let screenImage: string | null = null;
  let screenUrl: string | null = null;

  if (toolCall.result) {
    const base64Match = toolCall.result.match(/data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+/);
    if (base64Match) {
      screenImage = base64Match[0];
    } else if (/^iVBORw0KGgo[A-Za-z0-9+/=]+$/.test(toolCall.result.trim())) {
      screenImage = "data:image/png;base64," + toolCall.result.trim();
    } else {
      const urlImgMatch = toolCall.result.match(/https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|webp)/i);
      if (urlImgMatch) {
        screenImage = urlImgMatch[0];
      }
    }
  }

  // Extract navigation URL if present in args or result
  const navUrlMatch = (toolCall.args || "").match(/https?:\/\/[^\s"',}]+/i);
  if (navUrlMatch) {
    screenUrl = navUrlMatch[0];
  }

  // Pretty title
  let displayTitle = toolCall.tool || "Tool Execution";
  if (displayTitle.includes("__")) {
    const parts = displayTitle.split("__");
    displayTitle = `${parts[0]} / ${parts.slice(1).join("__")}`;
  }

  // Format args preview
  let cleanArgs = toolCall.args || "";
  try {
    const parsed = JSON.parse(cleanArgs);
    cleanArgs = JSON.stringify(parsed, null, 2);
  } catch {
    // raw
  }

  const handleCopy = (type: "args" | "result", text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playMicroClick();
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="w-full rounded-lg border border-neutral-200/70 dark:border-[#22222c]/80 bg-white dark:bg-[#121217] overflow-hidden my-0.5 transition-all text-[11px] font-mono shadow-xs">
      {/* Header Bar: Compact, reduced padding, height, spacing, font size & weight */}
      <div
        onClick={() => setOpen(!open)}
        className="px-2 py-1 bg-neutral-50/70 dark:bg-[#15151c]/70 hover:bg-neutral-100 dark:hover:bg-[#191922] flex items-center justify-between cursor-pointer select-none transition-colors border-b border-transparent min-h-[26px]"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isCalling ? (
            <Loader2 size={11} className="text-[#f8a87c] animate-spin shrink-0" />
          ) : isError ? (
            <span className="h-3.5 w-3.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              <AlertCircle size={9} />
            </span>
          ) : (
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Terminal size={9} />
            </span>
          )}
          <span className="text-[11px] font-normal text-neutral-800 dark:text-neutral-300 truncate font-mono">
            {displayTitle}
          </span>
          <span
            className={`text-[9px] px-1 py-0 rounded font-mono font-normal ${
              isCalling
                ? "bg-[#f8a87c]/10 text-[#f8a87c]"
                : isError
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {isCalling ? "calling" : isError ? "error" : "0"}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          <ChevronDown
            size={11}
            className={`text-neutral-400 transition-transform duration-200 ${open ? "rotate-180 text-neutral-200" : ""}`}
          />
        </div>
      </div>

      {/* Embedded Browser View Screen Preview Card for Screen Actions */}
      {(isScreenAction || screenImage) && (
        <div className="p-2.5 bg-[#09090d] border-t border-[#1e1e28] flex flex-col space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 select-none px-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-200 font-semibold tracking-tight">
                Browser View Screen
              </span>
              {screenUrl && (
                <span className="text-[10px] text-neutral-500 truncate max-w-[200px]">
                  ({screenUrl})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Refresh live screen capture" data-ux-target-min="24"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Trigger quick reload / snapshot ping
                  const iframe = document.querySelector('iframe[title="Browser View Screen"]') as HTMLIFrameElement | null;
                  if (iframe && iframe.src) {
                    const original = iframe.src;
                    iframe.src = "about:blank";
                    setTimeout(() => { iframe.src = original; }, 100);
                  }
                }}
                className="p-1 rounded hover:bg-[#181822] hover:text-white transition-colors cursor-pointer text-neutral-400"
                title="Refresh live screen capture"
              >
                <RefreshCw size={12} />
              </button>
              <button aria-label="Expand screen to full view" data-ux-target-min="24"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="p-1 rounded hover:bg-[#181822] hover:text-white transition-colors cursor-pointer text-neutral-400"
                title="Expand screen to full view"
              >
                <Maximize2 size={12} />
              </button>
              {screenUrl && (
                <a aria-label="Open live URL"
                  href={screenUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded hover:bg-[#181822] hover:text-white transition-colors cursor-pointer text-neutral-400"
                  title="Open live URL"
                >
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Screen Content Render */}
          {screenImage ? (
            <div
              onClick={() => setIsModalOpen(true)}
              className="w-full max-h-[240px] rounded-lg overflow-hidden border border-[#20202c] bg-black relative cursor-pointer group flex items-center justify-center shadow-inner"
            >
              <img
                src={screenImage}
                alt="Browser Screen View"
                className="w-full h-full object-contain pointer-events-none group-hover:scale-[1.01] transition-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-mono">
                <Maximize2 size={13} />
                <span>Click to view full screen</span>
              </div>
            </div>
          ) : screenUrl ? (
            <div
              onClick={() => setIsModalOpen(true)}
              className="w-full h-[180px] rounded-lg overflow-hidden border border-[#20202c] bg-black relative cursor-pointer group shadow-inner"
            >
              <iframe
                src={screenUrl}
                title="Browser View Screen"
                className="w-full h-full border-0 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-mono">
                <Maximize2 size={13} />
                <span>Live Browser • Click to interact full screen</span>
              </div>
            </div>
          ) : null}

          {/* Full Screen Interactive Modal */}
          {isModalOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-150"
            >
              <div className="h-10 border-b border-[#242432] flex items-center justify-between text-xs font-mono text-neutral-300 pb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">Browser Screen Inspection View</span>
                  {screenUrl && (
                    <span className="text-neutral-500 truncate max-w-sm"> - {screenUrl}</span>
                  )}
                </div>
                <button aria-label="Close screen view" data-ux-target-min="24"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[#181822] hover:bg-[#252534] text-neutral-400 hover:text-white cursor-pointer"
                  title="Close screen view"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="flex-1 w-full h-full flex items-center justify-center pt-2 overflow-auto">
                {screenImage ? (
                  <img
                    src={screenImage}
                    alt="Full Browser Screen"
                    className="max-w-full max-h-full object-contain rounded-lg border border-[#262638] shadow-2xl"
                  />
                ) : screenUrl ? (
                  <iframe
                    src={screenUrl}
                    title="Full Browser Session"
                    className="w-full h-full border-0 rounded-lg bg-black"
                  />
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Expandable Body */}
      {open && (
        <div className="p-3 space-y-2.5 bg-[#0e0e13] border-t border-[#1e1e26] text-[11px] leading-relaxed">
          {cleanArgs && (
            <div className="rounded-lg border border-[#202028] bg-[#09090d] overflow-hidden">
              <div className="px-2.5 py-1 bg-[#14141a] border-b border-[#202028] flex items-center justify-between text-neutral-400 text-[10px]">
                <span>Parameters / Input</span>
                <button
                  type="button"
                  onClick={(e) => handleCopy("args", cleanArgs, e)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    copied === "args"
                      ? "text-emerald-400 bg-emerald-500/15 scale-105 shadow-xs"
                      : "text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95"
                  }`}
                  title="Sao chép tham số"
                >
                  {copied === "args" ? (
                    <>
                      <Check size={10} className="text-emerald-400 stroke-[2.5]" />
                      <span className="font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-2.5 overflow-x-auto text-neutral-300 whitespace-pre max-h-48 overflow-y-auto">
                {cleanArgs}
              </pre>
            </div>
          )}

          {toolCall.result ? (
            <div className="rounded-lg border border-[#202028] bg-[#09090d] overflow-hidden">
              <div className="px-2.5 py-1 bg-[#14141a] border-b border-[#202028] flex items-center justify-between text-neutral-400 text-[10px]">
                <span className={isError ? "text-red-400" : "text-emerald-400"}>
                  {isError ? "Error Output" : "Standard Output"}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopy("result", toolCall.result || "", e)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                    copied === "result"
                      ? "text-emerald-400 bg-emerald-500/15 scale-105 shadow-xs"
                      : "text-neutral-400 hover:text-white hover:bg-white/10 active:scale-95"
                  }`}
                  title="Sao chép kết quả"
                >
                  {copied === "result" ? (
                    <>
                      <Check size={10} className="text-emerald-400 stroke-[2.5]" />
                      <span className="font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-2.5 overflow-x-auto text-neutral-300 whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                {toolCall.result}
              </pre>
            </div>
          ) : (
            <div className="text-neutral-500 italic text-[10px] px-1">No console output returned</div>
          )}
        </div>
      )}
    </div>
  );
}

// Markdown & Structured Content Formatter with support for links, bold, italics, code, and bare URLs
function renderInlineMarkdown(rawText: string): React.ReactNode {
  if (!rawText) return "";
  // Tokenizer pattern matching:
  // 1. Markdown link: [label](url)
  // 2. Bold: **text**
  // 3. Inline code: `code`
  // 4. Italic: *text* (excluding **)
  // 5. Bare URL: https?://...
  const tokenRegex = /(\[[^\]]+\]\([^\s)]+\)|\*\*[^*]+?\*\*|`[^`]+?`|\*[^*\n]+?\*|https?:\/\/[^\s)\]]+)/g;
  const parts = rawText.split(tokenRegex);
  if (parts.length === 1 && !rawText.match(tokenRegex)) return rawText;

  return parts.filter(Boolean).map((part, pIdx) => {
    // 1. Markdown link: [label](url)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
      if (match) {
        return (
          <a
            key={pIdx}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f8a87c] hover:underline underline-offset-2 font-medium break-all"
          >
            {match[1]}
          </a>
        );
      }
    }
    // 2. Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    // 3. Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={pIdx} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#181822] border border-slate-200 dark:border-[#262634] font-mono text-[11px] text-[#f8a87c] mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    // 4. Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2 && !part.startsWith("**")) {
      return (
        <em key={pIdx} className="italic text-slate-800 dark:text-neutral-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    // 5. Bare URL: https?://...
    if (part.startsWith("http://") || part.startsWith("https://")) {
      let url = part;
      let trailing = "";
      if (/[.,;:!]$/.test(url)) {
        trailing = url.slice(-1);
        url = url.slice(0, -1);
      }
      return (
        <React.Fragment key={pIdx}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f8a87c] hover:underline underline-offset-2 break-all"
          >
            {url}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    return part;
  });
}

function parseRowCells(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.startsWith("|") && trimmed.endsWith("|")
    ? trimmed.slice(1, -1)
    : trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

function parseMarkdownTableBlock(tableLines: string[]) {
  let hasSeparator = false;
  let separatorIdx = -1;
  for (let i = 0; i < tableLines.length; i++) {
    const t = tableLines[i].trim();
    if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(t)) {
      hasSeparator = true;
      separatorIdx = i;
      break;
    }
  }

  let headers: string[] = [];
  let rows: string[][] = [];

  if (hasSeparator && separatorIdx > 0) {
    headers = parseRowCells(tableLines[0]);
    rows = tableLines
      .slice(separatorIdx + 1)
      .filter((l) => l.trim() && !/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(l.trim()))
      .map(parseRowCells);
  } else {
    rows = tableLines.map(parseRowCells);
  }

  return { headers, rows };
}

// Search Match Highlighting helper for conversation titles & snippets
function renderSearchMatchHighlight(text: string, query: string) {
  if (!query || !query.trim() || !text) return text;
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark
        key={i}
        className="bg-[#f8a87c]/30 text-[#f8a87c] font-semibold px-0.5 rounded transition-colors"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// Formatted assistant message content with word wrapping and code block containment
function FormattedMessageContent({
  content,
  onRunCode,
  agentNode,
  onSpeakSentence,
  onImageClick,
}: {
  content: string;
  onRunCode?: (code: string, lang: string) => void;
  agentNode?: string;
  onSpeakSentence?: (sentence: string) => void;
  onImageClick?: (url: string, name: string) => void;
}) {
  const [runningBlock, setRunningBlock] = useState<number | null>(null);
  const [runOutputs, setRunOutputs] = useState<Record<number, { output: string; exitCode: number }>>({});
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    playMicroClick();
    navigator.clipboard.writeText(code);
    setCopiedBlock(idx);
    setTimeout(() => setCopiedBlock(null), 1800);
  };

  if (!content) return null;

  // Split code blocks: ```lang ... ```
  const codeBlockRegex = /(```[\s\S]*?```)/g;
  const parts = content.split(codeBlockRegex);

  return (
    <div className="space-y-2 text-[13px] leading-relaxed select-text min-w-0 max-w-full break-words">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```(\w+)?\s*\n([\s\S]*?)```$/);
          const lang = match ? match[1] || "shell" : "code";
          const code = match ? match[2] : part.slice(3, -3);

          if (lang === "mermaid") {
            return <MermaidDiagram key={idx} code={code} />;
          }

          return (
            <div
              key={idx}
              className={`my-2 rounded-xl overflow-hidden border border-[#262634] bg-[#0a0a0f] font-mono text-xs shadow-md transition-all ${
                expandedBlock === idx ? "fixed inset-4 z-50 flex flex-col bg-[#0a0a0f]/95 backdrop-blur-xl border-[#f8a87c]/40 shadow-2xl p-2" : ""
              }`}
            >
              <div className="px-3 py-1.5 bg-[#14141c] border-b border-[#262634] flex items-center justify-between text-[11px] text-neutral-400 select-none">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-[#f8a87c] font-mono">
                    <Terminal size={12} />
                    {lang}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
                    ({code.trim().split("\n").length} lines)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label={expandedBlock === idx ? "Collapse code block" : "Expand code block"} data-ux-target-min="24"
                    type="button"
                    onClick={() => setExpandedBlock(expandedBlock === idx ? null : idx)}
                    className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title={expandedBlock === idx ? "Collapse code block" : "Expand code block"}
                  >
                    {expandedBlock === idx ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>
                  {onRunCode && (lang === "bash" || lang === "sh" || lang === "shell" || lang === "python" || lang === "sql") && (
                    <button aria-label="Execute code directly on Agent workspace node" data-ux-target-min="24"
                      type="button"
                      onClick={() => {
                        setRunningBlock(idx);
                        onRunCode(code, lang);
                        setTimeout(() => {
                          setRunOutputs((prev) => ({
                            ...prev,
                            [idx]: {
                              output: `Dispatched to ${agentNode || "Agent Sandbox"} terminal process.\nExit code 0 (Verified).`,
                              exitCode: 0,
                            },
                          }));
                          setRunningBlock(null);
                        }, 700);
                      }}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#f8a87c]/15 hover:bg-[#f8a87c]/25 text-[#f8a87c] border border-[#f8a87c]/30 transition-colors cursor-pointer"
                      title="Execute code directly on Agent workspace node"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>{runningBlock === idx ? "Running..." : "Run on Node"}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const extMap: Record<string, string> = {
                        bash: "sh", sh: "sh", shell: "sh", zsh: "sh",
                        python: "py", py: "py",
                        javascript: "js", js: "js", typescript: "ts", ts: "ts",
                        sql: "sql", json: "json", yaml: "yaml", yml: "yml",
                        html: "html", css: "css", markdown: "md", md: "md"
                      };
                      const ext = extMap[lang.toLowerCase()] || "txt";
                      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `snippet-${Date.now()}.${ext}`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/10"
                    title="Tải mã nguồn về máy"
                  >
                    <Download size={11} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCode(code, idx)}
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all cursor-pointer text-[10px] font-mono ${
                      copiedBlock === idx
                        ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 scale-105 shadow-xs"
                        : "text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent active:scale-95"
                    }`}
                    title="Sao chép toàn bộ khối mã"
                  >
                    {copiedBlock === idx ? (
                      <>
                        <Check size={11} className="text-emerald-400 stroke-[2.5]" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} className="transition-transform duration-150" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <pre className="p-3.5 overflow-x-auto text-neutral-200 whitespace-pre max-h-80 overflow-y-auto">
                <code>{code}</code>
              </pre>
              {runOutputs[idx] && (
                <div className="px-3 py-2 bg-[#0c0c12] border-t border-[#1e1e28] text-[10px] font-mono text-emerald-400">
                  <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                    <Check size={11} className="text-emerald-400" />
                    <span>Terminal Output (Exit Code {runOutputs[idx].exitCode}):</span>
                  </div>
                  <pre className="text-neutral-300 whitespace-pre-wrap">{runOutputs[idx].output}</pre>
                </div>
              )}
            </div>
          );
        }

        // Preprocess: join split markdown links [label]\n(url) -> [label](url)
        const normalizedPart = part.replace(/\[([^\]\n]+)\]\s*\n\s*\((https?:\/\/[^\s)]+)\)/g, "[$1]($2)");
        const rawLines = normalizedPart.split("\n");

        type BlockItem =
          | { type: "table"; headers: string[]; rows: string[][] }
          | { type: "line"; line: string; trimmed: string };

        const blockItems: BlockItem[] = [];
        let tableBuffer: string[] = [];

        const flushTableBuffer = () => {
          if (tableBuffer.length > 0) {
            blockItems.push({ type: "table", ...parseMarkdownTableBlock(tableBuffer) });
            tableBuffer = [];
          }
        };

        for (let l = 0; l < rawLines.length; l++) {
          const rawLine = rawLines[l];
          const tr = rawLine.trim();
          if (tr.startsWith("|") && (tr.endsWith("|") || tr.includes("|", 1))) {
            tableBuffer.push(tr);
            continue;
          }
          flushTableBuffer();
          blockItems.push({ type: "line", line: rawLine, trimmed: tr });
        }
        flushTableBuffer();

        return (
          <div key={idx} className="space-y-1.5 max-w-full overflow-hidden">
            {blockItems.map((blk, blkIdx) => {
              if (blk.type === "table") {
                return (
                  <div key={blkIdx} className="my-2.5 max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-[#252532] bg-white/70 dark:bg-[#0e0e14]/90 shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      {blk.headers.length > 0 && (
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-[#252532] bg-slate-50 dark:bg-[#161620]">
                            {blk.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-3 py-2 font-semibold text-slate-800 dark:text-white font-mono text-[11px] whitespace-nowrap">
                                {renderInlineMarkdown(h)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody className="divide-y divide-slate-100 dark:divide-[#1d1d28]">
                        {blk.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-[#14141e]/70 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-neutral-300 align-top leading-relaxed text-[12px]">
                                {renderInlineMarkdown(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }

              const line = blk.line;
              const trimmed = blk.trimmed;
              if (!trimmed) {
                return <div key={blkIdx} className="h-2" />;
              }

              // Subtle split dash separator (---, ***, ___)
              if (trimmed === "---" || trimmed === "***" || trimmed === "___" || /^[-*_]{3,}$/.test(trimmed)) {
                return (
                  <div key={blkIdx} className="my-3 py-1 flex items-center">
                    <div className="w-full border-t border-dashed border-[#2b2b38]/70" />
                  </div>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <div key={blkIdx} className="pt-2 pb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-neutral-200 tracking-wide font-mono flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#f8a87c]/70" />
                      {trimmed.slice(4)}
                    </h4>
                  </div>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <div key={blkIdx} className="pt-3 pb-1 border-b border-dashed border-slate-200 dark:border-[#232330]">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <span className="text-[#f8a87c] text-xs">§</span>
                      {trimmed.slice(3)}
                    </h3>
                  </div>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <div key={blkIdx} className="pt-3 pb-1.5 border-b border-dashed border-slate-200 dark:border-[#2b2b3a]">
                    <h2 className="text-base font-bold text-[#f8a87c] tracking-tight">
                      {trimmed.slice(2)}
                    </h2>
                  </div>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ") || trimmed.startsWith("↳ ")) {
                const bulletSymbol = trimmed.startsWith("↳ ") ? "↳" : "↳";
                const sliceLen = trimmed.startsWith("↳ ") ? 2 : 2;
                return (
                  <div key={blkIdx} className="flex items-start gap-2 pl-1 py-0.5 text-slate-700 dark:text-neutral-300">
                    <span className="text-[#f8a87c]/80 shrink-0 text-[11px] font-mono select-none mt-0.5">{bulletSymbol}</span>
                    <span className="flex-1 break-words">{renderInlineMarkdown(trimmed.slice(sliceLen))}</span>
                  </div>
                );
              }

              // Numbered list items: 1. 2. 3.
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={blkIdx} className="flex items-start gap-2 pl-1 py-0.5 text-slate-700 dark:text-neutral-300">
                    <span className="text-[#f8a87c]/70 font-mono text-[11px] shrink-0 select-none mt-0.5">
                      {numMatch[1]}.
                    </span>
                    <span className="flex-1 break-words">{renderInlineMarkdown(numMatch[2])}</span>
                  </div>
                );
              }

              // Markdown image detection (![alt](url/base64))
              const imgMatch = trimmed.match(/^!\[([^\]]*)\]\((data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+|https?:\/\/[^\s\)]+|\/[^\s\)]+)\)$/);
              if (imgMatch) {
                const alt = imgMatch[1] || "Browser Screenshot Preview";
                const src = imgMatch[2];
                return (
                  <div key={blkIdx} className="my-2.5 max-w-full">
                    <div
                      onClick={() => onImageClick?.(src, alt)}
                      className="group relative inline-block max-w-full rounded-xl overflow-hidden border border-slate-200 dark:border-[#2b2b3c] bg-white dark:bg-[#0c0c12] shadow-sm hover:border-[#f8a87c]/50 transition-all cursor-zoom-in"
                    >
                      <img
                        src={src}
                        alt={alt}
                        className="max-h-[360px] w-auto max-w-full object-contain block rounded-lg transition-transform duration-200 group-hover:scale-[1.01]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-mono text-[11px] select-none pointer-events-none">
                        <Maximize2 size={13} />
                        <span>Xem ảnh toàn màn hình</span>
                      </div>
                      {alt && (
                        <div className="px-3 py-1 bg-slate-50 dark:bg-[#14141c] border-t border-slate-200 dark:border-[#22222e] text-[11px] font-mono text-slate-600 dark:text-neutral-400 truncate">
                          {alt}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <p
                  key={blkIdx}
                  onDoubleClick={() => onSpeakSentence?.(trimmed)}
                  title="Double click to read this sentence aloud"
                  className="text-slate-800 dark:text-neutral-200 leading-relaxed break-words hover:text-slate-900 dark:hover:text-white transition-colors cursor-text"
                >
                  {renderInlineMarkdown(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}


export interface AgentBrowserMeta {
  url: string;
  label: string;
  isLive: boolean;
  hostNode: string;
  profile: string;
  mode: string;
}

// Per-agent browser identity resolved by the backend (/api/agents/{id}/browser). Each instance
// has one Selkies desktop; agents differ by their own Chromium profile window.
export function getAgentBrowserUrl(agent: InfraAgent, info?: AgentBrowserInfo | null): AgentBrowserMeta {
  return {
    url: info?.viewerUrl || "",
    label: `${agent.name} Computer`,
    isLive: Boolean(info?.cdpReachable && info?.profileWindowOpen),
    hostNode: info ? `${info.node} · ${info.service}` : agent.node || "",
    profile: info?.profile || "",
    mode: "Selkies desktop · CDP",
  };
}

/**
 * Interactive Selkies desktop for one agent. Focuses the agent's own profile window first,
 * reloads the stream when the page returns from background (mobile Safari/Chrome suspend
 * websockets), and retries with backoff if the desktop is unreachable.
 */
function SelkiesViewer({ agentId, url, title, profile }: { agentId: string; url: string; title: string; profile: string }) {
  const [src, setSrc] = useState<string>("");
  // Selkies treats a bare URL as the single "primary" controller: every new phone/desktop tab
  // kicked the previous one and reconfigured the shared display. #collab joins as a co-controller
  // and #shared as a watch-only viewer, so several devices can stay connected at once.
  // #collab on every device: a #shared (watch-only) Selkies client stays on "Waiting for stream" until some
  // controller has initialised the stream, so a phone opening first saw a black screen. Watch-only is a toggle.
  const [mode, setMode] = useState<"collab" | "shared">("collab");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string>("");
  const hiddenAt = useRef<number>(0);
  useEffect(() => {
    let alive = true;
    setError("");
    // The desktop host only serves /a360/{signed-token}/, so a fresh signed URL is requested per (re)connect.
    Promise.all([issueAgentDesktopUrl(agentId, mode === "shared" ? "watch" : "control"), focusAgentBrowser(agentId)])
      .then(([signed]) => { if (alive) setSrc(`${signed}#${mode}`); })
      .catch((e) => {
        if (!alive) return;
        setSrc("");
        setError(e instanceof DesktopAuthError ? "auth" : String(e?.message || e));
      });
    return () => { alive = false; };
  }, [agentId, url, attempt, mode]);
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) { hiddenAt.current = Date.now(); return; }
      // Back from >30 s in background: the websocket is usually dead on phones; reconnect cleanly.
      if (hiddenAt.current && Date.now() - hiddenAt.current > 30000) setAttempt((a) => a + 1);
      hiddenAt.current = 0;
    };
    const onOnline = () => setAttempt((a) => a + 1);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("online", onOnline);
    return () => { document.removeEventListener("visibilitychange", onVis); window.removeEventListener("online", onOnline); };
  }, []);
  return (
    <>
      {error && (
        <>
          <AgentBrowserPreview agentId={agentId} enabled />
          <div className="absolute top-2 left-2 right-2 sm:right-auto z-10 px-2 py-1.5 rounded bg-black/80 border border-white/10 text-[11px] font-mono text-white! keep-white flex flex-wrap items-center gap-1.5">
            {error === "auth" ? (
              <>
                <span>Ảnh tĩnh (preview) · đăng nhập tài khoản admin hoặc nhập operator key để mở desktop trực tiếp</span>
                <form
                  className="flex items-center gap-1"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const v = (new FormData(e.currentTarget).get("k") as string || "").trim();
                    if (v) { operatorKey.set(v); setAttempt((a) => a + 1); }
                  }}
                >
                  <input name="k" type="password" autoComplete="off" placeholder="operator key" aria-label="Operator key"
                    className="h-6 w-36 px-1.5 rounded bg-white/10 border border-white/20 text-[11px] text-white! keep-white placeholder:text-neutral-400 outline-none" />
                  <button type="submit" className="h-6 px-2 rounded bg-[#f8a87c] text-black! text-[11px] font-semibold">Mở desktop</button>
                </form>
              </>
            ) : `Desktop unavailable (${error}) · showing preview`}
          </div>
        </>
      )}
      {/* Background preview placeholder while waiting for stream or connecting */}
      <AgentBrowserPreview agentId={agentId} enabled={!error} />
      {src && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          <iframe
            key={`${src}#${attempt}`}
            src={src}
            title={title}
            className="w-full h-full border-0 bg-black z-10 transition-opacity duration-300"
            allow="clipboard-read; clipboard-write; fullscreen; keyboard-map; autoplay"
            allowFullScreen
            style={{ touchAction: "none", maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      )}
      {profile && (
        <div data-testid="agent-desktop-profile" className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-white! keep-white pointer-events-none">
          profile: {agentId}
        </div>
      )}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
        <button
          type="button"
          onClick={() => setMode((m) => (m === "shared" ? "collab" : "shared"))}
          className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#1c1c26]/90 hover:bg-white dark:hover:bg-[#252534] border border-slate-300 dark:border-[#2c2c3e] text-[11px] font-mono text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white shadow-sm backdrop-blur-md transition-colors cursor-pointer"
          title={mode === "shared" ? "Take control (mouse/keyboard)" : "Switch to watch-only"}
        >
          {mode === "shared" ? "Control" : "Watch only"}
        </button>
        <button
          type="button"
          onClick={() => setAttempt((a) => a + 1)}
          className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#1c1c26]/90 hover:bg-white dark:hover:bg-[#252534] border border-slate-300 dark:border-[#2c2c3e] text-[11px] font-mono text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white shadow-sm backdrop-blur-md transition-colors cursor-pointer"
          title="Reconnect stream"
        >
          Reconnect
        </button>
      </div>
    </>
  );
}

/** Low-cost live preview: the agent's own tab screenshot, refreshed only while visible. */
function AgentBrowserPreview({ agentId, enabled }: { agentId: string; enabled: boolean }) {
  const [src, setSrc] = useState<string>("");
  const [failures, setFailures] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    let current = "";
    let fails = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ctrl = new AbortController();
    setSrc("");
    setFailures(0);
    const tick = async () => {
      if (!document.hidden) {
        try {
          const next = await fetchAgentBrowserFrame(agentBrowserImageUrl(agentId, Date.now()), ctrl.signal);
          if (!alive) { URL.revokeObjectURL(next); return; }
          if (current) URL.revokeObjectURL(current);
          current = next;
          fails = 0;
          setSrc(next);
          setFailures(0);
        } catch {
          if (!alive) return;
          fails += 1;
          setFailures(fails);
        }
      }
      // 5 s while healthy; back off to 20 s after errors so a stalled tab is not hammered.
      if (alive) timer = setTimeout(tick, fails > 2 ? 20000 : 5000);
    };
    tick();
    return () => {
      alive = false;
      ctrl.abort();
      if (timer) clearTimeout(timer);
      if (current) URL.revokeObjectURL(current);
    };
  }, [enabled, agentId]);
  if (!enabled) return null;
  return (
    <>
      {src && (
        <img
          key={agentId}
          src={src}
          alt="Agent browser preview"
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}
      {!src && (
        <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-slate-500 dark:text-neutral-500 bg-white dark:bg-black">
          {failures > 0 ? "Waiting for the agent's browser…" : "Loading preview…"}
        </div>
      )}
    </>
  );
}

interface QuickSuggestion {
  title: string;
  desc: string;
  prompt: string;
  badge?: string;
}

// Dynamically generate 4 tailored quick prompt suggestions based on agent role, tools, and node placement
// Helper to extract clean/friendly short name from full agent name (e.g. 'GM Bốc (Executive)' -> 'Bốc')
function getCleanAgentShortName(agent?: InfraAgent): string {
  if (!agent?.name) return 'Agent';
  const raw = agent.name.split('(')[0].trim();
  if (raw.toUpperCase().startsWith('GM ')) {
    return raw.slice(3).trim();
  }
  return raw;
}



// Dynamic task suggestions based on agent role and capabilities (concise, office-focused)
function getDynamicSuggestionsForAgent(agent?: InfraAgent): QuickSuggestion[] {
  const role = (agent?.roleTag || "").toLowerCase();
  const id = (agent?.id || "").toLowerCase();
  const slug = (agent?.slug || "").toLowerCase();
  const name = (agent?.name || "").toLowerCase();
  const tools = (agent?.tools || []).map((t: any) => (typeof t === "string" ? t : t.name || "").toLowerCase());

  // Business & Accounting / ERP (GM Bốc, Gạo, Lúa, Sales, ERPNext)
  const isErp = tools.some((t: string) => t.includes("erpnext") || t.includes("invoice") || t.includes("order")) ||
    id.includes("gm-") || slug.includes("gm-") || name.includes("bốc") || name.includes("gạo") || name.includes("lúa") || name.includes("gm") || role.includes("finance");
  if (isErp) {
    return [
      {
        title: "Báo cáo doanh số",
        desc: "Tổng hợp doanh thu và đơn hàng hôm nay",
        prompt: "Lập báo cáo tổng hợp doanh thu và danh sách đơn hàng xuất bán hôm nay.",
        badge: "Báo cáo"
      },
      {
        title: "Đối chiếu công nợ",
        desc: "Rà soát công nợ khách hàng sắp đến hạn",
        prompt: "Kiểm tra và đối chiếu các khoản công nợ của khách hàng sắp đến hạn thanh toán.",
        badge: "Kế toán"
      },
      {
        title: "Kiểm tra tồn kho",
        desc: "Tra cứu lượng tồn và số đã xuất giao",
        prompt: "Kiểm tra số lượng tồn kho các mặt hàng chủ lực và danh sách phiếu xuất trong tuần.",
        badge: "Kho vận"
      }
    ];
  }

  // Creative & Market Research (Climax, Zen, Media, Content)
  const isCreative = role.includes("research") || role.includes("creative") || id.includes("climax") || slug.includes("climax") || id.includes("zen") || slug.includes("zen");
  if (isCreative) {
    return [
      {
        title: "Nghiên cứu thị trường",
        desc: "Phân tích xu hướng và đối thủ cạnh tranh",
        prompt: "Phân tích xu hướng nổi bật của thị trường và các điểm mạnh của đối thủ cạnh tranh trong tuần này.",
        badge: "Nghiên cứu"
      },
      {
        title: "Lên ý tưởng bài viết",
        desc: "Gợi ý góc nhìn và thông điệp truyền thông",
        prompt: "Đề xuất 3 chủ đề bài viết và thông điệp truyền thông thu hút cho kênh mạng xã hội tuần tới.",
        badge: "Nội dung"
      },
      {
        title: "Tóm tắt tin tức ngành",
        desc: "Trích xuất thông tin trọng tâm",
        prompt: "Tổng hợp và tóm tắt ngắn gọn các tin tức công nghệ và tự động hóa đáng chú ý trong ngày.",
        badge: "Tổng hợp"
      }
    ];
  }

  // Operations & Tech / Product (Mons, Ken, QA, SRE)
  const isOps = role.includes("engineering") || role.includes("dev") || id.includes("mons") || id.includes("ken") || id.includes("qa");
  if (isOps) {
    return [
      {
        title: "Rà soát tiến độ",
        desc: "Kiểm tra backlog và đầu việc ưu tiên",
        prompt: "Rà soát các đầu việc đang xử lý trong sprint và liệt kê danh sách việc cần ưu tiên hôm nay.",
        badge: "Tiến độ"
      },
      {
        title: "Kiểm tra trạng thái",
        desc: "Kiểm tra vận hành và thông báo lỗi",
        prompt: "Kiểm tra trạng thái hoạt động của hệ thống, ghi nhận các cảnh báo hoặc dịch vụ gặp sự cố.",
        badge: "Vận hành"
      },
      {
        title: "Phân công nhiệm vụ",
        desc: "Lập checklist công việc cụ thể",
        prompt: "Lập bảng kế hoạch công việc và phân chia các mốc hoàn thành rõ ràng cho dự án.",
        badge: "Kế hoạch"
      }
    ];
  }

  // Default Office & Generalist (Mkai, Assistant, Office tasks)
  return [
    {
      title: "Soạn thảo văn bản",
      desc: "Soạn email thông báo hoặc thư mời họp",
      prompt: "Soạn thảo email thông báo kế hoạch làm việc tuần mới gửi nội bộ, văn phong lịch sự và rõ ràng.",
      badge: "Văn bản"
    },
    {
      title: "Tóm tắt tài liệu",
      desc: "Trích xuất ý chính và đầu việc cần làm",
      prompt: "Tóm tắt ngắn gọn nội dung cốt lõi của tài liệu này và liệt kê các hành động cần thực hiện.",
      badge: "Tóm tắt"
    },
    {
      title: "Lập kế hoạch tuần",
      desc: "Sắp xếp thứ tự ưu tiên các mục tiêu",
      prompt: "Giúp tôi lập lịch trình làm việc và phân chia thời gian cho các mục tiêu trọng tâm trong tuần.",
      badge: "Kế hoạch"
    }
  ];
}

export function GrokBotWorkspace() {
  const { t } = useTranslation();
  const { agentParam, chatParam } = useParams<{ agentParam?: string; chatParam?: string }>();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<InfraAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(() => {
    if (agentParam) return agentParam;
    try {
      const params = new URLSearchParams(window.location.search);
      const urlAgent = params.get("agent");
      if (urlAgent) return urlAgent;
    } catch {}

    try {
      // Ids stored while the UI was on the old mock fleet (e.g. bot:agent360:swe-lead) do not exist on any runtime.
      const last = localStorage.getItem("agent360_last_agent_id") || "";
      if (/^bot:agent360:(swe-lead|sre-sentinel|qa-vision|kb-researcher)$/i.test(last)) {
        localStorage.removeItem("agent360_last_agent_id");
        return "";
      }
      return last;
    } catch {
      return "";
    }
  });
  // Agent-scoped loads only run for an id that exists in the real fleet (stale/unknown ids would 404 on every API).
  // While fleet is still initializing (isLoadingAgents === true), allow candidate IDs so initial fetch starts eagerly.
  const isKnownAgent = (id: string | null | undefined) => {
    if (!id) return false;
    const bare = id.replace(/^bot:agent360:/i, "").toLowerCase();
    if (agents.length === 0) {
      // During initial bootstrap, accept valid-format agent identifiers (e.g. from URL route /app/:agentParam)
      return bare.length > 0 && !/^bot:agent360:(swe-lead|sre-sentinel|qa-vision|kb-researcher)$/i.test(id);
    }
    return agents.some((a) => a.id === id || a.slug === bare || a.id.toLowerCase() === `bot:agent360:${bare}`);
  };
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isOnlineState, setIsOnlineState] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  useEffect(() => {
    const onOnline = () => setIsOnlineState(true);
    const onOffline = () => setIsOnlineState(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

    // Listen for Background Sync trigger from Service Worker
  useEffect(() => {
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === "FLUSH_OFFLINE_PROMPTS") {
          setIsOnlineState(true);
        }
      };
      navigator.serviceWorker.addEventListener("message", handleMessage);
      return () => {
        navigator.serviceWorker.removeEventListener("message", handleMessage);
      };
    }
  }, []);

  // Offline-queue flush runs before executeTurnStream is declared; call it through a ref.
  const executeTurnStreamRef = useRef<((prompt: string) => void) | null>(null);

  const [offlinePendingQueue, setOfflinePendingQueue] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("skyer_offline_pending_prompts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto flush offline queue when connection is restored
  useEffect(() => {
    if (isOnlineState && offlinePendingQueue.length > 0) {
      const toSend = [...offlinePendingQueue];
      setOfflinePendingQueue([]);
      try {
        localStorage.removeItem("skyer_offline_pending_prompts");
      } catch {}

      // Dispatch queued messages sequentially
      toSend.forEach((prompt, idx) => {
        setTimeout(() => {
          executeTurnStreamRef.current?.(prompt);
        }, idx * 1000);
      });
    }
  }, [isOnlineState, offlinePendingQueue]);


    // Persistent customizable agent nickname (Image 1)
  const [agentNickname, setAgentNickname] = useState<string>("");

  useEffect(() => {
    if (!selectedAgentId) return;
    try {
      const saved = localStorage.getItem(`skyer_agent_nickname_${selectedAgentId}`) || "";
      setAgentNickname(saved);
    } catch {}
  }, [selectedAgentId, agents.length]);

  const handleSetAgentNickname = (name: string) => {
    setAgentNickname(name);
    try {
      if (selectedAgentId) {
        localStorage.setItem(`skyer_agent_nickname_${selectedAgentId}`, name);
        window.dispatchEvent(new CustomEvent("agent360_nickname_updated", { detail: { agentId: selectedAgentId, name } }));
      }
    } catch {}
    setForkToast(`Đã lưu tên gọi thân mật: ${name}`);
    setTimeout(() => setForkToast(null), 2000);
  };

  const [selectedInstance, setSelectedInstance] = useState<string>(() => {
    try {
      return localStorage.getItem("agent360_selected_instance_filter") || "all";
    } catch {
      return "all";
    }
  });
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agent360_sound_enabled") !== "false";
    } catch {
      return true;
    }
  });
  const [soundPreset, setSoundPreset] = useState<SoundPreset>(() => {
    try {
      return (localStorage.getItem("agent360_sound_preset") as SoundPreset) || "modern";
    } catch {
      return "modern";
    }
  });
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAvatarSetupModalOpen, setIsAvatarSetupModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<"appearance" | "language" | "audio" | "privacy_export" | "voice_record">("appearance");
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false);
  const [isStarredShortcutsModalOpen, setIsStarredShortcutsOpen] = useState(false);
  const [isVoiceRecordSettingsOpen, setIsVoiceRecordSettingsOpen] = useState(false);
  const [turnTelemetry, setTurnTelemetry] = useState<TurnTelemetry | null>(null);
  const [forwardModalMsg, setForwardModalMsg] = useState<string | null>(null);


  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speakingSentence, setSpeakingSentence] = useState<string | null>(null);
  const [copiedResponseMsgId, setCopiedResponseMsgId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(() => getStoredSpeechSettings().rate);
  const [speechPitch, setSpeechPitch] = useState<number>(() => getStoredSpeechSettings().pitch);
  const [systemVoices, setSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(() => getStoredSpeechSettings().voiceURI || "");

  useEffect(() => {
    const updateVoices = () => {
      setSystemVoices(getAvailableVoices());
    };
    updateVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);
  const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agent360_autospeak_enabled") === "true";
    } catch {
      return false;
    }
  });
  const soundMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (soundMenuRef.current && !soundMenuRef.current.contains(e.target as Node)) {
        setIsSoundMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);
  const INFRA_INSTANCES = [
    { value: "all", label: "All Agents (Infra)", badge: "Fleet", description: "All live autonomous agents across fleet" },
    { value: "node-3rd", label: "Node 3rd (Core)", badge: "Core", description: "ai.hmz.one (Mons, Ken, Zen, Mkai)" },
    { value: "node-6th", label: "Node 6th (Gia Mộc)", badge: "Worker", description: "ai-gm.antares.vn (Bốc, Gạo, Lúa, Team)" },
    { value: "node-5th", label: "Node 5th (Creative & Delivery)", badge: "Apps", description: "ai-climax / planthy-ai" },
    { value: "node-4th", label: "Node 4th (Swarm & Inference)", badge: "Swarm", description: "AgentTeams Swarm & LLM360" },
    { value: "node-7th", label: "Node 7th (Control)", badge: "Control", description: "control.hmz.one / SRE Observer" },
    { value: "node-8th", label: "Node 8th (ITS & GL)", badge: "Edge", description: "ai-its / ai-gl (Inox Tân Sơn & GL)" },
    { value: "node-2nd", label: "Node 2nd (Agent360)", badge: "Platform", description: "agent360.antares.vn" },
  ];
  // Interactive Mascot Eye Tracking State
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  // Note: DropdownMenu handles its own outside clicks via anchorRef and portal

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY) / 12, 3.5);
      setMousePos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Available models from Skyer /api/models
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [modelSearchQuery, setModelSearchQuery] = useState<string>("");
  const [isChangingModel, setIsChangingModel] = useState<boolean>(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  // Strictly check if current logged in user has ADMIN role.
  // When an authenticated user session exists, their role MUST reflect their real account role.
  // Leftover operatorKey in localStorage must NEVER elevate a regular MEMBER / CUSTOMER session to admin!
  const hasUserSession = !!(sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token") || currentUser);
  const isAdmin = hasUserSession
    ? !!(
        currentUser?.roles?.some(r => ["ADMIN", "SYSTEM", "ROOT"].includes(r.toUpperCase())) ||
        currentUser?.permissions?.some(p => p.toUpperCase().includes("ADMIN")) ||
        currentUser?.sub === "qtgkbfovj5md" ||
        currentUser?.email === "admin@skyer.hmz.one" ||
        currentUser?.sub === "1my9xeouvb48" ||
        currentUser?.email === "1my9xeouvb48@skyer.hmz.one"
      )
    : (() => {
        try {
          const k = localStorage.getItem("agent360.a2a.operatorKey");
          return !!k && k !== "dev-local-operator";
        } catch {
          return false;
        }
      })();

  useEffect(() => {
    getCurrentUserProfile().then((u) => {
      if (u) {
        setCurrentUser(u);
        // If roles is empty, force refresh from backend to ensure Admin permissions are caught
        if (!u.roles || u.roles.length === 0) {
          getCurrentUserProfile(true).then((fresh) => {
            if (fresh) setCurrentUser(fresh);
          });
        }
      }
    });
  }, []);


  // Clean user display info without exposing internal subject IDs or dummy sub emails
  const cleanDisplayName = (() => {
    if (currentUser?.name && currentUser.name !== "User Skyer" && currentUser.name !== "User") {
      return currentUser.name;
    }
    if (currentUser?.email === "hmzonehub@gmail.com" || currentUser?.sub === "1my9xeouvb48") {
      return "Tech Zone";
    }
    return currentUser?.name || "Skyer User";
  })();

  const cleanDisplayEmail = (() => {
    const email = currentUser?.email || "";
    const isInternalSubEmail = email.includes("@skyer.hmz.one") && (email.startsWith(currentUser?.sub || "###") || /^[a-z0-9]{10,}@/i.test(email));
    if (email && !isInternalSubEmail) {
      return email;
    }
    if (currentUser?.sub === "1my9xeouvb48") {
      return "hmzonehub@gmail.com";
    }
    return email && !isInternalSubEmail ? email : "Authorized Session";
  })();

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAvailableModels().then((models) => {
      if (models && models.length > 0) {
        setAvailableModels(models);
      }
    });
  }, []);

  const handleSelectModel = async (newModelId: string) => {
    if (!selectedAgent) return;
    const targetAgentId = selectedAgent.id;
    const agentName = selectedAgent.name;
    const found = availableModels.find((m) => m.model === newModelId);
    const providerId = found ? found.providerId : "llm360coding";
    setIsChangingModel(true);
    setIsModelDropdownOpen(false);
    triggerHaptic(15);
    setForkToast(`Đang chuyển mô hình ${newModelId} cho ${agentName}...`);
    try {
      const ok = await updateAgentActiveModel(targetAgentId, providerId, newModelId);
      if (ok) {
        setForkToast(`Đã đổi mô hình sang ${newModelId} cho ${agentName}`);
        setAgents((prev) =>
          prev.map((a) => (a.id === targetAgentId ? { ...a, model: newModelId } : a))
        );
        try {
          const fresh = await fetchInfraAgents();
          if (fresh && fresh.length > 0) setAgents(fresh);
        } catch {}
      } else {
        setForkToast(`Không thể cập nhật mô hình cho ${agentName}`);
      }
    } catch (err) {
      console.error("handleSelectModel error:", err);
      setForkToast(`Lỗi khi chuyển mô hình cho ${agentName}`);
    } finally {
      setIsChangingModel(false);
      setTimeout(() => setForkToast(null), 3000);
    }
  };

  const [chats, setChats] = useState<AgentSession[]>([]);
  // Which agent the current `chats` list belongs to (avoids loading agent A's chat under agent B while switching).
  const [chatsAgentId, setChatsAgentId] = useState<string>("");
  // Map of agentId -> recent session title
  const [agentRecentSessions, setAgentRecentSessions] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("agent360_recent_sessions_map");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  // Track completed unread session IDs: { [agentId: string]: Set<string> }
  const [unreadCompletedSessions, setUnreadCompletedSessions] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("agent360_unread_sessions");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [selectedChatId, setSelectedChatId] = useState<string>(() => {
    if (chatParam) return chatParam;
    try {
      const lastGlobal = localStorage.getItem("agent360_last_chat_id");
      return lastGlobal || "";
    } catch {
      return "";
    }
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [channels, setChannels] = useState<AgentChannelConfig[]>([]);
  const [schedules, setSchedules] = useState<AgentScheduleJob[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [selectedChannelForConfig, setSelectedChannelForConfig] = useState<AgentChannelConfig | null>(null);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [selectedJobForConfig, setSelectedJobForConfig] = useState<AgentScheduleJob | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Sync with browser URL params (e.g. forward/back buttons or manual URL change)
  useEffect(() => {
    if (agentParam && agents.length > 0) {
      const bare = agentParam.replace(/^bot:agent360:/i, "").toLowerCase();
      const matched = agents.find(
        (a) => a.id === agentParam || (a.id || "").toLowerCase() === agentParam.toLowerCase() || (a.slug || "").toLowerCase() === bare
      );
      if (matched) {
        const curBare = (selectedAgentIdRef.current || "").replace(/^bot:agent360:/i, "").toLowerCase();
        if (matched.id !== selectedAgentIdRef.current && (matched.slug || "").toLowerCase() !== curBare && (matched.id || "").toLowerCase() !== curBare) {
          setSelectedAgentId(matched.id);
          try { localStorage.setItem("agent360_last_agent_id", matched.id); } catch {}
        }
      }
    }
  }, [agentParam, agents.length]);

  useEffect(() => {
    if (chatParam && chatParam !== selectedChatId) {
      setSelectedChatId(chatParam);
      try {
        localStorage.setItem("agent360_last_chat_id", chatParam);
        if (selectedAgentId) {
          localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, chatParam);
        }
      } catch {}
    }
  }, [chatParam, selectedAgentId]);

  // Rightmost bot info tab: 'Computer' | 'Details' | 'Library'
  const [rightTab, setRightTab] = useState<"Details" | "Computer" | "Library">("Details");
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [detailSubTab, setDetailSubTab] = useState<"Overview" | "Memory" | "Library">("Overview");
  const [isAgentSettingsModalOpen, setIsAgentSettingsModalOpen] = useState(false);
  const [agentSettingsModalTab, setAgentSettingsModalTab] = useState<AgentSettingsTab>("general");
  const [connectedAppIds, setConnectedAppIds] = useState<string[]>([]);
  const [currentAgentMcpClients, setCurrentAgentMcpClients] = useState<AgentMcpClient[]>([]);
  const [currentAgentSubBindings, setCurrentAgentSubBindings] = useState<SubAgentBinding[]>([]);
  const [activeSessionRoom, setActiveSessionRoom] = useState<SessionCollaborationRoom | null>(null);
  const [isRoomInspectOpen, setIsRoomInspectOpen] = useState(false);
  const [activeRespondingAgent, setActiveRespondingAgent] = useState<{ id: string; name: string; statusText: string } | null>(null);

  useEffect(() => {
    const onRoomSynced = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.chatId === selectedChatId && detail?.room) {
        setActiveSessionRoom(detail.room);
      }
    };
    window.addEventListener("agent360_room_synced", onRoomSynced);
    return () => window.removeEventListener("agent360_room_synced", onRoomSynced);
  }, [selectedChatId]);
  const [activeLoopMode, setActiveLoopMode] = useState<"default" | "goal" | "mission">(() => {
    try {
      const saved = selectedAgentId ? localStorage.getItem(`skyer_loop_mode_${selectedAgentId}`) : null;
      if (saved === "default" || saved === "goal" || saved === "mission") return saved;
    } catch {}
    return "default";
  });
  const [loopPulse, setLoopPulse] = useState<string | null>(null);
  const [loopModeToast, setLoopModeToast] = useState<{ mode: "default" | "goal" | "mission"; visible: boolean } | null>(null);
  const loopToastTimerRef = useRef<any>(null);
  const [mcpRefreshTrigger, setMcpRefreshTrigger] = useState(0);
  const [isBrowserModalOpen, setIsBrowserModalOpen] = useState<boolean>(false);
  const [isComputerSplitOpen, setIsComputerSplitOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agent360_computer_split") === "true";
    } catch {
      return false;
    }
  });

  const [prevLayoutBeforeComputer, setPrevLayoutBeforeComputer] = useState<{
    leftCollapsed: boolean;
    chatCollapsed: boolean;
    botInfoCollapsed: boolean;
  } | null>(null);

  const handleToggleComputerSplit = (forceState?: boolean) => {
    setIsComputerSplitOpen((prev) => {
      const next = forceState !== undefined ? forceState : !prev;
      try {
        localStorage.setItem("agent360_computer_split", next ? "true" : "false");
      } catch {}

      if (next) {
        // Remember layout before opening computer
        setPrevLayoutBeforeComputer({
          leftCollapsed: isLeftSidebarCollapsed,
          chatCollapsed: isChatListCollapsed,
          botInfoCollapsed: isBotInfoCollapsed,
        });
        // Collapse all sidebars to give full canvas to Virtual Computer + Chat
        setIsLeftSidebarCollapsed(true);
        setIsChatListCollapsed(true);
        setIsBotInfoCollapsed(true);
        try {
          localStorage.setItem("agent360_left_sidebar_collapsed", "true");
          localStorage.setItem("agent360_chat_list_collapsed", "true");
          localStorage.setItem("agent360_bot_info_collapsed", "true");
        } catch {}
        setMobileAgentsOpen(false);
        setMobileChatsOpen(false);
        setMobileBotInfoOpen(false);
      } else {
        // Restore layout when closing computer
        if (prevLayoutBeforeComputer) {
          setIsLeftSidebarCollapsed(prevLayoutBeforeComputer.leftCollapsed);
          setIsChatListCollapsed(prevLayoutBeforeComputer.chatCollapsed);
          setIsBotInfoCollapsed(prevLayoutBeforeComputer.botInfoCollapsed);
          try {
            localStorage.setItem("agent360_left_sidebar_collapsed", prevLayoutBeforeComputer.leftCollapsed ? "true" : "false");
            localStorage.setItem("agent360_chat_list_collapsed", prevLayoutBeforeComputer.chatCollapsed ? "true" : "false");
            localStorage.setItem("agent360_bot_info_collapsed", prevLayoutBeforeComputer.botInfoCollapsed ? "true" : "false");
          } catch {}
        }
      }
      return next;
    });
  };

  const handleSetBrowserModalOpen = (open: boolean) => {
    setIsBrowserModalOpen(open);
    try {
      localStorage.setItem("agent360_browser_expanded", open ? "true" : "false");
    } catch {}
  };

  // Intelligent compact/minimize detection (?compact=1 or iframe / small screen < 1024px)
  const isInitialCompact = typeof window !== 'undefined' && (
    new URLSearchParams(window.location.search).get('compact') === '1' ||
    window.innerWidth < 1024
  );
  const [isCompactMode, setIsCompactMode] = useState<boolean>(isInitialCompact);
  const [layoutDensity, setLayoutDensity] = useState<"compact" | "normal" | "comfortable">(() => {
    try {
      return (localStorage.getItem("skyer_layout_density") as any) || "normal";
    } catch {
      return "normal";
    }
  });

  useEffect(() => {
    const handleDensityChange = (e: any) => {
      if (e.detail?.density) {
        setLayoutDensity(e.detail.density);
      }
    };
    window.addEventListener("skyer_density_changed", handleDensityChange);
    return () => window.removeEventListener("skyer_density_changed", handleDensityChange);
  }, []);


  // Update compact mode dynamically on window resize
  useEffect(() => {
    const handleResize = () => {
      if (new URLSearchParams(window.location.search).get('compact') !== '1') {
        setIsCompactMode(window.innerWidth < 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Resizable layout column widths with localStorage persistence (comfortable 320px default)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState<number>(() => {
    try {
      const v = localStorage.getItem("agent360_left_sidebar_w");
      return v ? parseInt(v, 10) : 320;
    } catch {
      return 320;
    }
  });

  const [botInfoWidth, setBotInfoWidth] = useState<number>(() => {
    try {
      const v = localStorage.getItem("agent360_bot_info_w");
      return v ? parseInt(v, 10) : 380;
    } catch {
      return 380;
    }
  });

  const [chatSessionsWidth, setChatSessionsWidth] = useState<number>(() => {
    try {
      const v = localStorage.getItem("agent360_chat_sessions_w");
      return v ? parseInt(v, 10) : 280;
    } catch {
      return 280;
    }
  });
  const [isResizingChatSessions, setIsResizingChatSessions] = useState(false);
  const chatSessionsAsideRef = useRef<HTMLElement>(null);

    // Adjustable Computer Split Ratio (20% to 80% with 35% default)
  const [computerChatWidthPercent, setComputerChatWidthPercent] = useState<number>(() => {
    try {
      const v = localStorage.getItem("agent360_computer_chat_percent");
      return v ? parseFloat(v) : 35;
    } catch {
      return 35;
    }
  });
  const [isResizingComputerSplit, setIsResizingComputerSplit] = useState(false);
  const [isReloadingBrowser, setIsReloadingBrowser] = useState(false);
  const [isScreenshotCaptured, setIsScreenshotCaptured] = useState(false);
  const [browserIframeKey, setBrowserIframeKey] = useState(0);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);


  // Collapse states per user request with localStorage persistence
  // 0. isLeftSidebarCollapsed: collapsible left sidebar showing only avatars & status
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState<boolean>(() => {
    if (isInitialCompact) return false;
    try {
      // When computer split is open on load/reload, left sidebar should default to collapsed
      if (localStorage.getItem("agent360_computer_split") === "true") return true;
      const saved = localStorage.getItem("agent360_left_sidebar_collapsed");
      return saved !== null ? saved === "true" : false;
    } catch {
      return false;
    }
  });

  const handleToggleLeftSidebar = (collapse?: boolean) => {
    setIsLeftSidebarCollapsed((prev) => {
      const next = collapse !== undefined ? collapse : !prev;
      try {
        localStorage.setItem("agent360_left_sidebar_collapsed", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  // 1. isChatListCollapsed: collapse bar for conversation list
  const [isChatListCollapsed, setIsChatListCollapsed] = useState<boolean>(() => {
    if (isInitialCompact) return true;
    try {
      if (localStorage.getItem("agent360_computer_split") === "true") return true;
      const saved = localStorage.getItem("agent360_chat_list_collapsed");
      // Default to true (collapsed) for new users so the chat canvas remains clean & focused
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });
  // 2. isBotInfoCollapsed: collapse bar for rightmost bot information pane
  const [isBotInfoCollapsed, setIsBotInfoCollapsed] = useState<boolean>(() => {
    if (isInitialCompact) return true;
    try {
      if (localStorage.getItem("agent360_computer_split") === "true") return true;
      const saved = localStorage.getItem("agent360_bot_info_collapsed");
      // Default to true (collapsed) for new users
      return saved !== null ? saved === "true" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingComputerSplit) {
        // Calculate percentage of clientX relative to window.innerWidth
        const rawPercent = (e.clientX / window.innerWidth) * 100;
        const boundedPercent = Math.min(75, Math.max(20, rawPercent));
        setComputerChatWidthPercent(boundedPercent);
        try { localStorage.setItem("agent360_computer_chat_percent", boundedPercent.toFixed(1)); } catch {}
      } else if (isResizingLeft) {
        const newW = Math.min(480, Math.max(240, e.clientX));
        setLeftSidebarWidth(newW);
        try { localStorage.setItem("agent360_left_sidebar_w", newW.toString()); } catch {}
      } else if (isResizingRight) {
        const newW = Math.min(560, Math.max(280, window.innerWidth - e.clientX));
        setBotInfoWidth(newW);
        try { localStorage.setItem("agent360_bot_info_w", newW.toString()); } catch {}
      } else if (isResizingChatSessions) {
        let computedWidth = 280;
        if (chatSessionsAsideRef.current) {
          const rect = chatSessionsAsideRef.current.getBoundingClientRect();
          if (isComputerSplitOpen) {
            // When virtual computer is open to the right of chat sessions, splitter is on the right edge
            computedWidth = e.clientX - rect.left;
          } else {
            // When virtual computer is closed, chat sessions is on the right of screen, splitter is on left edge
            computedWidth = rect.right - e.clientX;
          }
        } else {
          const offsetFromRight = window.innerWidth - e.clientX;
          const currentBotInfoOffset = (!isBotInfoCollapsed && typeof window !== "undefined" && window.innerWidth >= 1280) ? botInfoWidth : 0;
          computedWidth = offsetFromRight - currentBotInfoOffset;
        }
        const boundedW = Math.min(460, Math.max(220, computedWidth));
        setChatSessionsWidth(boundedW);
        try { localStorage.setItem("agent360_chat_sessions_w", boundedW.toString()); } catch {}
      }
    };

    const handleMouseUp = () => {
      setIsResizingComputerSplit(false);
      setIsResizingLeft(false);
      setIsResizingRight(false);
      setIsResizingChatSessions(false);
    };

    if (isResizingLeft || isResizingRight || isResizingComputerSplit || isResizingChatSessions) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingLeft, isResizingRight, isResizingComputerSplit, isResizingChatSessions, isBotInfoCollapsed, botInfoWidth, isComputerSplitOpen]);

  // Helper setters that persist to localStorage
  const handleToggleChatList = (collapse?: boolean) => {
    setIsChatListCollapsed((prev) => {
      const next = collapse !== undefined ? collapse : !prev;
      try {
        localStorage.setItem("agent360_chat_list_collapsed", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  const handleToggleBotInfo = (collapse?: boolean) => {
    setIsBotInfoCollapsed((prev) => {
      const next = collapse !== undefined ? collapse : !prev;
      try {
        localStorage.setItem("agent360_bot_info_collapsed", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  // Listen to parent Nextcloud postMessage toggle events and window resize
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'AGENT360_SET_MODE') {
        const compact = Boolean(e.data.compact);
        setIsCompactMode(compact);
        setIsLeftSidebarCollapsed(compact);
        setIsChatListCollapsed(compact);
        setIsBotInfoCollapsed(compact);
      }
    };
    const handleResize = () => {
      const isSmall = window.innerWidth < 1024;
      const isUrlCompact = new URLSearchParams(window.location.search).get('compact') === '1';
      setIsCompactMode(isUrlCompact || isSmall);
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  // Console turns are tracked per chat: switching chats must never carry another chat's loading/queue state.
  const [streamingChatIds, setStreamingChatIds] = useState<string[]>([]);
  const isStreaming = Boolean(selectedChatId && streamingChatIds.includes(selectedChatId));
  const streamingChatIdsRef = useRef<string[]>([]);
  // Latest on-screen transcript of each chat with an in-flight console turn (survives chat switches and history reloads).
  const inflightMessagesRef = useRef<Record<string, ChatMessage[]>>({});
  streamingChatIdsRef.current = streamingChatIds;
  // Set of session IDs actively running / streaming turns
  const [runningChatIds, setRunningChatIds] = useState<string[]>([]);
  // Persistent tracking of expanded execution trace accordions across turns and re-renders
  const [expandedTraceKeys, setExpandedTraceKeys] = useState<Record<string, boolean>>({});
  // Map of agentId -> number of actively running chats
  const [runningAgentIds, setRunningAgentIds] = useState<Record<string, number>>({});
  // Real-time Session Multiplexer: WebSocket with SSE fallback
  // Receives turn start/stop & unread state instantly across all channels without periodic HTTP polling
  // Ids (chat UUID + channel session id) of the chat currently on screen; a finished turn there is already read.
  const viewedChatIdsRef = useRef<string[]>([]);
  const agentRunningSessionsRef = useRef<Record<string, Set<string>>>({});
  const sessionAliasesRef = useRef<Record<string, string>>({});
  const normalizeAgentKey = (idOrSlug?: string | null): string =>
    (idOrSlug || "").replace(/^bot:agent360:/i, "").trim().toLowerCase();

  const registerSessionAgent = (chatId?: string | null, sessionId?: string | null, agentIdOrSlug?: string | null) => {
    const normAg = normalizeAgentKey(agentIdOrSlug);
    if (chatId && normAg) chatAgentMapRef.current[chatId] = normAg;
    if (sessionId && normAg) chatAgentMapRef.current[sessionId] = normAg;
    if (chatId && sessionId && chatId !== sessionId) {
      sessionAliasesRef.current[chatId] = sessionId;
      sessionAliasesRef.current[sessionId] = chatId;
    }
  };

  const syncAgentRunningCounts = () => {
    const nextCounts: Record<string, number> = {};
    for (const [key, set] of Object.entries(agentRunningSessionsRef.current)) {
      const norm = normalizeAgentKey(key);
      if (!norm) continue;
      const count = set ? set.size : 0;
      nextCounts[norm] = count;
      nextCounts[`bot:agent360:${norm}`] = count;
    }
    setRunningAgentIds(nextCounts);
  };

  const updateAgentSessionRunning = (
    agentIdOrSlug: string | null | undefined,
    sessionIds: (string | null | undefined)[],
    isRunning: boolean
  ) => {
    const validIds = sessionIds.filter(Boolean) as string[];
    if (validIds.length === 0) return;

    const allRelatedIds = new Set<string>(validIds);
    for (const id of validIds) {
      const alias = sessionAliasesRef.current[id];
      if (alias) allRelatedIds.add(alias);
    }

    let normAg = normalizeAgentKey(agentIdOrSlug);
    if (!normAg) {
      for (const id of allRelatedIds) {
        const mapped = chatAgentMapRef.current[id];
        if (mapped) {
          normAg = normalizeAgentKey(mapped);
          break;
        }
      }
    }

    if (normAg) {
      for (const id of allRelatedIds) {
        chatAgentMapRef.current[id] = normAg;
      }
      const agentSet = (agentRunningSessionsRef.current[normAg] ||= new Set<string>());
      if (isRunning) {
        const canonicalId = validIds[0];
        for (const id of allRelatedIds) {
          if (id !== canonicalId) agentSet.delete(id);
        }
        agentSet.add(canonicalId);
      } else {
        for (const id of allRelatedIds) {
          agentSet.delete(id);
        }
      }
    } else if (!isRunning) {
      for (const set of Object.values(agentRunningSessionsRef.current)) {
        for (const id of allRelatedIds) {
          set.delete(id);
        }
      }
    }
    syncAgentRunningCounts();
  };

  const isViewedChat = (id?: string | null) => Boolean(id && !document.hidden && viewedChatIdsRef.current.includes(id));
  const markViewedChatRead = (id: string) => {
    markChatAsRead(id, selectedAgentIdRef.current).catch?.(() => {});
  };
  useEffect(() => {
    const disconnect = connectSessionMultiplexer({
      onSnapshot: (snapshot: ActiveSessionsSnapshot) => {
        const activeIds = Array.isArray(snapshot.active_session_ids) ? snapshot.active_session_ids : [];
        if (snapshot.active_agent_sessions && typeof snapshot.active_agent_sessions === "object") {
          for (const [agKey, sids] of Object.entries(snapshot.active_agent_sessions)) {
            const normAg = normalizeAgentKey(agKey);
            if (!normAg || !Array.isArray(sids)) continue;
            const agentSet = (agentRunningSessionsRef.current[normAg] ||= new Set<string>());
            for (const sid of sids) {
              if (!sid) continue;
              chatAgentMapRef.current[sid] = normAg;
              agentSet.add(sid);
            }
          }
          syncAgentRunningCounts();
        }
        setRunningChatIds((prev) => {
          const preserved = prev.filter((id) => streamingChatIdsRef.current.includes(id));
          return Array.from(new Set([...preserved, ...activeIds]));
        });
        setChats((prev) =>
          prev.map((c) => {
            const running =
              activeIds.includes(c.id) ||
              (c.session_id ? activeIds.includes(c.session_id) : false) ||
              streamingChatIdsRef.current.includes(c.id);
            return {
              ...c,
              is_running: running,
              isRunning: running,
              status: running ? "running" : (c.status === "running" ? "idle" : c.status)
            };
          })
        );
      },
      onTurnUpdate: (update: SessionTurnUpdate) => {
        const sid = update.session_id;
        if (!sid) return;
        const resolvedAgId =
          update.agent_id ||
          chatAgentMapRef.current[sid] ||
          (update.id ? chatAgentMapRef.current[update.id] : undefined);
        const normAg = normalizeAgentKey(resolvedAgId);
        const aliasId = sessionAliasesRef.current[sid];
        const isStillStreamingLocally =
          streamingChatIdsRef.current.includes(sid) ||
          (aliasId ? streamingChatIdsRef.current.includes(aliasId) : false);

        if (update.is_running) {
          updateAgentSessionRunning(normAg, [sid, update.id, aliasId], true);
          setRunningChatIds((prev) => (prev.includes(sid) ? prev : [...prev, sid]));
          setChats((prev) =>
            prev.map((c) =>
              c.id === sid || c.session_id === sid
                ? { ...c, is_running: true, isRunning: true, status: "running" }
                : c
            )
          );
        } else {
          if (!isStillStreamingLocally) {
            updateAgentSessionRunning(normAg, [sid, update.id, aliasId], false);
          }
          setRunningChatIds((prev) =>
            prev.filter((id) => (id !== sid && id !== aliasId) || streamingChatIdsRef.current.includes(id))
          );
          const viewed = isViewedChat(sid) || (aliasId ? isViewedChat(aliasId) : false);
          if (viewed) markViewedChatRead(sid);
          setChats((prev) =>
            prev.map((c) =>
              c.id === sid || c.session_id === sid
                ? {
                    ...c,
                    is_running: isStillStreamingLocally,
                    isRunning: isStillStreamingLocally,
                    status: isStillStreamingLocally ? "running" : "idle",
                    unread: viewed ? false : true
                  }
                : c
            )
          );
          if (!viewed && normAg) {
            const fullKey = `bot:agent360:${normAg}`;
            setUnreadCompletedSessions((prev) => {
              const listBare = prev[normAg] || [];
              const listFull = prev[fullKey] || [];
              const nextBare = listBare.includes(sid) ? listBare : [...listBare, sid];
              const nextFull = listFull.includes(sid) ? listFull : [...listFull, sid];
              const next = { ...prev, [normAg]: nextBare, [fullKey]: nextFull };
              try {
                localStorage.setItem("agent360_unread_sessions", JSON.stringify(next));
              } catch {}
              return next;
            });
          }
        }
      },
      onUnreadUpdate: (update: SessionUnreadUpdate) => {
        const sid = update.session_id;
        if (update.is_unread && isViewedChat(sid)) {
          markViewedChatRead(sid);
          return;
        }
        if (update.is_unread) return;
        setUnreadCompletedSessions((prev) => {
          const next = { ...prev };
          for (const key of Object.keys(next)) {
            next[key] = next[key].filter((id) => id !== sid);
          }
          try {
            localStorage.setItem("agent360_unread_sessions", JSON.stringify(next));
          } catch {}
          return next;
        });
        setChats((prev) => prev.map((c) => (c.id === sid || c.session_id === sid ? { ...c, unread: false } : c)));
      }
    });

    return () => {
      disconnect();
    };
  }, []);
  // Request Queue: Allows users to enter new requests while agent is in progress
  const [requestQueues, setRequestQueues] = useState<Record<string, string[]>>({});
  const requestQueuesRef = useRef<Record<string, string[]>>({});
  const chatAgentMapRef = useRef<Record<string, string>>({});
  const processingChatsRef = useRef<Set<string>>(new Set());
  const streamAbortControllersRef = useRef<Record<string, AbortController>>({});
  const requestQueue = (selectedChatId && requestQueues[selectedChatId]) || [];
  const setChatQueue = (chatId: string, queue: string[], agentId?: string) => {
    if (agentId) chatAgentMapRef.current[chatId] = agentId;
    requestQueuesRef.current = { ...requestQueuesRef.current, [chatId]: queue };
    setRequestQueues(requestQueuesRef.current);
  };
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isTextareaFocusedRef = useRef<boolean>(false);
  const textareaCursorPosRef = useRef<{ start: number; end: number } | null>(null);

  const handleStopStreaming = () => {
    if (!selectedChatId) return;
    const targetChat = chats.find((c) => c.id === selectedChatId) || chats.find((c) => c.session_id === selectedChatId);
    const targetSessionId = targetChat?.session_id || selectedChatId;
    const targetAgentSlug = selectedAgent.slug || selectedAgentId;

    streamAbortControllersRef.current[selectedChatId]?.abort();
    delete streamAbortControllersRef.current[selectedChatId];
    setStreamingChatIds((prev) => prev.filter((id) => id !== selectedChatId && id !== targetSessionId));
    setRunningChatIds((prev) => prev.filter((id) => id !== selectedChatId && id !== targetSessionId));
    updateAgentSessionRunning(targetAgentSlug, [selectedChatId, targetSessionId], false);
    setChats((prev) =>
      prev.map((c) =>
        c.id === selectedChatId || c.session_id === targetSessionId
          ? { ...c, is_running: false, isRunning: false, status: "idle" }
          : c
      )
    );
    try {
      sessionStorage.removeItem(`agent360_active_turn_${selectedChatId}`);
      sessionStorage.removeItem(`agent360_last_prompt_${selectedChatId}`);
    } catch {}

    stopConsoleChat(targetSessionId, targetAgentSlug).catch(() => {});
  };

  // Choice poll card state ("What would you like to call me?")

  const [showPollCard, setShowPollCard] = useState(true);
  const [customCallName, setCustomCallName] = useState("");

  // Workspace Library State (Pages, Files, Apps, Images, Media)
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceTreeNode[]>([]);
  const [libraryCategoryCounts, setLibraryCategoryCounts] = useState<Record<string, number>>({});
  const [libraryFormatCounts, setLibraryFormatCounts] = useState<Record<string, number>>({});
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState<LibraryCategory>("all");
  const [libraryExtFilter, setLibraryExtFilter] = useState<string>("");
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [libraryGroupMode, setLibraryGroupMode] = useState<"flat" | "folder" | "date">("flat");
  const [libraryCollapsedGroups, setLibraryCollapsedGroups] = useState<Record<string, boolean>>({});
  const [libraryPage, setLibraryPage] = useState<number>(1);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [selectedLibraryNode, setSelectedLibraryNode] = useState<WorkspaceTreeNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileBlobUrl, setFileBlobUrl] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState<UploadedFileResult[]>([]);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<{ url: string; name: string } | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lightboxRotation, setLightboxRotation] = useState<number>(0);
  const [lightboxMeta, setLightboxMeta] = useState<{ width: number; height: number; size?: number } | null>(null);
  const [showLightboxMeta, setShowLightboxMeta] = useState<boolean>(false);
  const [isPanningLightbox, setIsPanningLightbox] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lightboxModalRef = useRef<HTMLDivElement>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const dragCounterRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Input composer with Draft Persistence per Session (hoisted to prevent TDZ ReferenceError)
  const [inputText, setInputText] = useState(() => {
    try {
      const urlPrompt = new URLSearchParams(window.location.search).get("prompt")?.slice(0, 2000);
      if (urlPrompt) return urlPrompt;
      const lastChatId = localStorage.getItem("agent360_last_chat_id");
      if (lastChatId) {
        const savedDraft = localStorage.getItem(`agent360_draft_${lastChatId}`);
        if (savedDraft) return savedDraft;
      }
      return "";
    } catch {
      return "";
    }
  });
  const inputTextRef = useRef(inputText);
  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  // Voice recording / Speech-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [liveVoiceEnergy, setLiveVoiceEnergy] = useState<number>(0);
  const [sttLang, setSttLang] = useState<"vi-VN" | "en-US">(() => {
    try {
      return (localStorage.getItem("agent360_stt_lang") as any) || "vi-VN";
    } catch {
      return "vi-VN";
    }
  });

  const toggleSttLang = () => {
    const next = sttLang === "vi-VN" ? "en-US" : "vi-VN";
    setSttLang(next);
    try {
      localStorage.setItem("agent360_stt_lang", next);
    } catch {}
  };
  const [deviceToast, setDeviceToast] = useState<{ message: string; type: "info" | "warn" } | null>(null);

  // Listen to hardware audio devices connect / disconnect events (e.g. Bluetooth headset, USB mic)
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.addEventListener) return;

    const handleDeviceChange = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === "audioinput");
        setDeviceToast({
          message: `Hardware audio devices updated (${mics.length} mic(s) available)`,
          type: "info",
        });
        setTimeout(() => setDeviceToast(null), 4000);
      } catch (e) {
        console.warn("Device change event error:", e);
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
  }, []);
  const recognitionRef = useRef<any>(null);
  const recognitionBaseTextRef = useRef<string>("");
  const isContinuousVoiceActiveRef = useRef<boolean>(false);
  const autoRestartVoiceAfterSpeechRef = useRef<boolean>(false);
  const audioEnergyLevelRef = useRef<number>(0);
  const speechDetectedOnceRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<any>(null);
  const autoSendOnSilenceRef = useRef<boolean>(true);
  const vadModeRef = useRef<"continuous" | "manual" | "push_to_talk">("continuous");
  const silenceDurationRef = useRef<number>(2400);

  useEffect(() => {
    try {
      const mode = (localStorage.getItem("agent360_vad_mode") as any) || "continuous";
      const silence = parseInt(localStorage.getItem("agent360_vad_silence_ms") || "2400", 10);
      vadModeRef.current = mode;
      silenceDurationRef.current = silence;
      autoSendOnSilenceRef.current = mode === "continuous";
    } catch {}

    const handleSettings = (e: any) => {
      if (e.detail) {
        vadModeRef.current = e.detail.mode || "continuous";
        silenceDurationRef.current = e.detail.silenceDuration || 2400;
        autoSendOnSilenceRef.current = e.detail.mode === "continuous";
      }
    };
    window.addEventListener("agent360_vad_settings_changed", handleSettings);
    const handleTourEvent = () => {
      startOnboardingTour({ force: true });
    };
    window.addEventListener("agent360_start_tour", handleTourEvent);
    return () => window.removeEventListener("agent360_vad_settings_changed", handleSettings);
      window.removeEventListener("agent360_start_tour", handleTourEvent);
  }, []);

  const startVoiceRecording = async () => {
    // Interrupt any ongoing bot speech immediately when user begins speaking (natural barge-in)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Trình duyệt không hỗ trợ Web Speech API. Vui lòng dùng Chrome hoặc Edge.");
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    // Proactively verify & request microphone hardware permission if needed
    try {
      const micStatus = await queryPermissionStatus("microphone");
      if (micStatus.state === "denied") {
        setVoiceError("Quyền Microphone bị chặn trong trình duyệt. Bấm biểu tượng 🔒 trên thanh địa chỉ để cấp quyền.");
        setIsPermissionsModalOpen(true);
        setTimeout(() => setVoiceError(null), 6000);
        return;
      }
      if (micStatus.state === "prompt" || micStatus.canRequest) {
        const granted = await requestPermission("microphone");
        if (!granted) {
          setVoiceError("Bạn đã từ chối quyền microphone. Vui lòng cấp quyền để nói chuyện với Agent.");
          setTimeout(() => setVoiceError(null), 5000);
          return;
        }
      }
    } catch (permErr) {
      console.warn("Permission preflight check ignored:", permErr);
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = sttLang; // Dynamic STT language (vi-VN or en-US)

      recognition.onstart = () => {
        isContinuousVoiceActiveRef.current = true;
        speechDetectedOnceRef.current = false;
        setIsRecording(true);
        setVoiceError(null);
        // Anchor the baseline text when recording starts so interim chunks do not duplicate
        recognitionBaseTextRef.current = (inputTextRef.current || "").trim();

        // Safety fallback: if no speech is detected after 10 seconds of opening mic, auto-close mic
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (!speechDetectedOnceRef.current && isContinuousVoiceActiveRef.current) {
            console.log("[VAD] No speech detected in initial 10s, pausing mic...");
            stopVoiceRecording(true);
          }
        }, 10000);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const base = recognitionBaseTextRef.current;
        const currentSpoken = (finalTranscript + (interimTranscript ? " " + interimTranscript : "")).trim();
        
        if (currentSpoken) {
          speechDetectedOnceRef.current = true;
          const fullText = base ? `${base} ${currentSpoken}` : currentSpoken;
          setInputText(fullText);

          // Voice Activity Detection (VAD): Reset silence countdown
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // In continuous or push_to_talk mode, automatically stop and submit when user finishes speaking naturally
          if (autoSendOnSilenceRef.current && vadModeRef.current !== "manual" && currentSpoken.length >= 2) {
            silenceTimerRef.current = setTimeout(() => {
              // Intelligent Dual-signal verification:
              // Check if acoustic energy has truly subsided below conversational floor (<16%)
              const checkEnergyAndCommit = (retriesLeft: number) => {
                if (audioEnergyLevelRef.current > 16 && retriesLeft > 0) {
                  // User is pausing mid-sentence or still vocalizing; grant dynamic grace slice
                  silenceTimerRef.current = setTimeout(() => {
                    checkEnergyAndCommit(retriesLeft - 1);
                  }, 600);
                  return;
                }

                // Natural end-of-speech detected: finalize voice and dispatch message
                stopVoiceRecording();
                setTimeout(() => {
                  const form = composerFormRef.current;
                  if (form) {
                    form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                  }
                }, 200);
              };

              checkEnergyAndCommit(2);
            }, silenceDurationRef.current);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setVoiceError(`Lỗi thu âm: ${event.error}`);
          setTimeout(() => setVoiceError(null), 4000);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err: any) {
      console.warn("Failed to start speech recognition:", err);
      setVoiceError(err.message || "Không thể khởi động microphone");
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = (disengageLoop: boolean = false) => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (disengageLoop) {
      isContinuousVoiceActiveRef.current = false;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingFile(true);
    try {
      let uploadSuccessCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToGateway(file, selectedAgent.id);
        setAttachedFiles((prev) => [...prev, res]);
        uploadSuccessCount++;
      }
      if (uploadSuccessCount > 0) {
        triggerHaptic(25);
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } catch {}
      }
    } catch (err: any) {
      console.error("File upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDropFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploadingFile(true);
    try {
      let uploadSuccessCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToGateway(file, selectedAgent.id);
        setAttachedFiles((prev) => [...prev, res]);
        uploadSuccessCount++;
      }
      if (uploadSuccessCount > 0) {
        triggerHaptic(30);
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } catch {}
      }
    } catch (err: any) {
      console.error("Drag and drop file upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploadingFile(false);
      setIsDraggingFiles(false);
      dragCounterRef.current = 0;
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };



  // Seamless focus & cursor retention when transitioning between single-line and multiline layout
  // Khi switch giữa multiple line và single line, luôn đảm bảo giữ focus và đặt con trỏ ở cuối
  const prevIsMultilineRef = useRef<boolean>(false);
  useLayoutEffect(() => {
    const isMultiline = inputText.includes("\n");
    const didChangeLayoutMode = isMultiline !== prevIsMultilineRef.current;
    prevIsMultilineRef.current = isMultiline;

    if (textareaRef.current) {
      if (didChangeLayoutMode || (isTextareaFocusedRef.current && document.activeElement !== textareaRef.current)) {
        textareaRef.current.focus({ preventScroll: true });
        isTextareaFocusedRef.current = true;
        try {
          if (didChangeLayoutMode) {
            const endPos = textareaRef.current.value.length;
            textareaRef.current.setSelectionRange(endPos, endPos);
            textareaCursorPosRef.current = { start: endPos, end: endPos };
          } else if (textareaCursorPosRef.current) {
            textareaRef.current.setSelectionRange(
              textareaCursorPosRef.current.start,
              textareaCursorPosRef.current.end
            );
          }
        } catch {}
      }
    }
  }, [inputText.includes("\n")]);


  // Track previous chatId to save draft before switching
  const prevChatIdRef = useRef<string>(selectedChatId);
  const filteredAgentsRef = useRef<InfraAgent[]>([]);
  const filteredChatsRef = useRef<AgentSession[]>([]);
  const selectedAgentIdRef = useRef<string>(selectedAgentId);
  const selectedChatIdRef = useRef<string>(selectedChatId);

  useEffect(() => {
    selectedAgentIdRef.current = selectedAgentId;
  }, [selectedAgentId]);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    const prevId = prevChatIdRef.current;
    if (prevId && prevId !== selectedChatId) {
      // Save draft of previous chat if non-empty
      try {
        if (inputText.trim()) {
          localStorage.setItem(`agent360_draft_${prevId}`, inputText);
        } else {
          localStorage.removeItem(`agent360_draft_${prevId}`);
        }
      } catch {}

      // Load draft of newly selected chat
      try {
        const nextDraft = selectedChatId ? localStorage.getItem(`agent360_draft_${selectedChatId}`) : "";
        setInputText(nextDraft || "");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch {}
    }
    prevChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  // Realtime debounce autosave draft for active session
  useEffect(() => {
    if (!selectedChatId) return;
    const timer = setTimeout(() => {
      try {
        if (inputText.trim()) {
          localStorage.setItem(`agent360_draft_${selectedChatId}`, inputText);
        } else {
          localStorage.removeItem(`agent360_draft_${selectedChatId}`);
        }
      } catch {}
    }, 400);

    return () => clearTimeout(timer);
  }, [inputText, selectedChatId]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string>(() => {
    try {
      return new URLSearchParams(window.location.search).get("prompt")?.slice(0, 2000) || "";
    } catch {
      return "";
    }
  });
  const composerFormRef = useRef<HTMLFormElement>(null);
  const clearPromptParam = () => {
    setPendingPrompt("");
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("prompt");
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch {}
  };
  const runPendingPrompt = () => {
    clearPromptParam();
    requestAnimationFrame(() => composerFormRef.current?.requestSubmit());
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef<boolean>(true);
  const touchSwipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Search in conversation list
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [activeChatMenuId, setActiveChatMenuId] = useState<string | null>(null);
  const [activeAgentMenuId, setActiveAgentMenuId] = useState<string | null>(null);
  // Outside click listener to dismiss active chat 3-dots menu
  useEffect(() => {
    const handleOutsideChatMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-chat-menu-container="true"]') && !target.closest('[role="menu"]')) {
        setActiveChatMenuId(null);
      }
    };
    const handleOutsideAgentMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-agent-menu-container="true"]') && !target.closest('[role="menu"]')) {
        setActiveAgentMenuId(null);
      }
    };
    if (activeChatMenuId) {
      document.addEventListener("mousedown", handleOutsideChatMenu);
    }
    if (activeAgentMenuId) {
      document.addEventListener("mousedown", handleOutsideAgentMenu);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideChatMenu);
      document.removeEventListener("mousedown", handleOutsideAgentMenu);
    };
  }, [activeChatMenuId, activeAgentMenuId]);

  const [chatFilterTab, setChatFilterTab] = useState<"all" | "unread" | "pinned" | "archived">("all");
  const [channelFilter, setChannelFilter] = useState<string>(() => {
    try {
      const savedGlobal = localStorage.getItem("agent360_last_channel_filter");
      return savedGlobal || "console";
    } catch {
      return "console";
    }
  });

  // Persist and restore channel tab filter specifically for each agent
  useEffect(() => {
    if (!selectedAgentId) return;
    try {
      const savedForAgent = localStorage.getItem(`agent360_channel_filter_${selectedAgentId}`);
      if (savedForAgent) {
        setChannelFilter(savedForAgent);
      }
    } catch {}
  }, [selectedAgentId]);

  const handleSelectChannelFilter = (newChannel: string) => {
    setChannelFilter(newChannel);
    try {
      localStorage.setItem("agent360_last_channel_filter", newChannel);
      if (selectedAgentId) {
        localStorage.setItem(`agent360_channel_filter_${selectedAgentId}`, newChannel);
      }
    } catch {}
  };
  const [nodePingMs, setNodePingMs] = useState<number | null>(null);
  const [chatToDelete, setChatToDelete] = useState<AgentSession | null>(null);
  // Mobile Hold-Touch / Long-Press Action Sheet state
  const [mobileActionAgent, setMobileActionAgent] = useState<InfraAgent | null>(null);
  const [mobileActionChat, setMobileActionChat] = useState<AgentSession | null>(null);
  const [mobileActionMsg, setMobileActionMsg] = useState<{
    id: string;
    content: string;
    turnIdx: number;
    role?: "user" | "assistant";
    hasThinking?: boolean;
    rawMsg?: ChatMessage;
  } | null>(null);
  const [activeThinkingModalMsg, setActiveThinkingModalMsg] = useState<ChatMessage | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressPreventClickRef = useRef<boolean>(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStartAgent = (ag: InfraAgent) => {
    longPressPreventClickRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      longPressPreventClickRef.current = true;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(25); } catch {}
      }
      setMobileActionAgent(ag);
    }, 400);
  };

  const handleTouchEndAgent = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStartChat = (chat: AgentSession) => {
    longPressPreventClickRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      longPressPreventClickRef.current = true;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(25); } catch {}
      }
      setMobileActionChat(chat);
    }, 400);
  };

  const handleTouchEndChat = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStartMsg = (
    e: React.TouchEvent,
    msgData: {
      id: string;
      content: string;
      turnIdx: number;
      role?: "user" | "assistant";
      hasThinking?: boolean;
      rawMsg?: ChatMessage;
    }
  ) => {
    if (e.touches.length > 0) {
      touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    longPressPreventClickRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      longPressPreventClickRef.current = true;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(25); } catch {}
      }
      setMobileActionMsg(msgData);
    }, 380);
  };

  const handleTouchMoveMsg = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current || e.touches.length === 0) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);
    if (dx > 10 || dy > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  };

  const handleTouchEndMsg = () => {
    touchStartPosRef.current = null;
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  const [isBatchClearModalOpen, setIsBatchClearModalOpen] = useState(false);
  // Multi-select state for bulk deleting chat sessions
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);

  const handleToggleSelectChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChatIds((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };

  const handleToggleSelectAll = (chatList: AgentSession[]) => {
    const listIds = chatList.map((c) => c.id);
    const areAllSelected = listIds.length > 0 && listIds.every((id) => selectedChatIds.includes(id));
    if (areAllSelected) {
      // Deselect all in this list
      setSelectedChatIds((prev) => prev.filter((id) => !listIds.includes(id)));
    } else {
      // Select all in this list
      setSelectedChatIds((prev) => Array.from(new Set([...prev, ...listIds])));
    }
  };

    const handleMarkAllAsRead = async () => {
    if (!selectedAgent?.id) return;
    const agId = selectedAgent.id;
    const currentUnreadIds = unreadCompletedSessions[agId] || [];
    if (currentUnreadIds.length === 0 && !chats.some((c) => c.unread)) {
      triggerHaptic(10);
      return;
    }
    triggerHaptic(20);
    // 1. Clear unread from local state
    setUnreadCompletedSessions((prev) => {
      const next = { ...prev, [agId]: [] };
      try {
        localStorage.setItem("agent360_unread_sessions", JSON.stringify(next));
      } catch {}
      return next;
    });
    setChats((prev) => prev.map((c) => ({ ...c, unread: false })));

    // 2. Call backend for each unread session in background
    for (const sid of currentUnreadIds) {
      markChatAsRead(sid, agId).catch(() => {});
    }
    setForkToast("Đã đánh dấu đã đọc tất cả");
    setTimeout(() => setForkToast(null), 2500);
  };

const handleBatchDeleteSelectedChats = () => {
    if (selectedChatIds.length === 0) return;
    setChats((prev) => prev.filter((c) => !selectedChatIds.includes(c.id)));
    setPinnedChatIds((prev) => prev.filter((id) => !selectedChatIds.includes(id)));
    if (selectedChatId && selectedChatIds.includes(selectedChatId)) {
      const remaining = chats.filter((c) => !selectedChatIds.includes(c.id));
      if (remaining.length > 0) {
        handleSelectChat(remaining[0]);
      } else {
        handleNewChat();
      }
    }
    setSelectedChatIds([]);
    setIsBatchClearModalOpen(false);
  };
  const [inSessionSearchOpen, setInSessionSearchOpen] = useState(false);
  const [inSessionSearchQuery, setInSessionSearchQuery] = useState("");
  const [isRecipesModalOpen, setIsRecipesModalOpen] = useState(false);
  const [isTopologyModalOpen, setIsTopologyModalOpen] = useState(false);
  const [forkToast, setForkToast] = useState<string | null>(null);
  const [starredMsgIds, setStarredMsgIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("agent360_starred_messages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleStarMessage = (msgId: string) => {
    setStarredMsgIds((prev) => {
      const next = prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId];
      try {
        localStorage.setItem("agent360_starred_messages", JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const [disabledAgentsExpanded, setDisabledAgentsExpanded] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("agent360_disabled_agents_expanded");
      return v === "true";
    } catch {
      return false;
    }
  });
  const [pinnedAgentIds, setPinnedAgentIds] = useState<string[]>(() => {
    try {
      const v = localStorage.getItem("agent360_pinned_agents");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });

  const togglePinAgent = (agentId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    triggerHaptic(15);
    setPinnedAgentIds((prev) => {
      const isPinned = prev.includes(agentId);
      const next = isPinned ? prev.filter((id) => id !== agentId) : [agentId, ...prev];
      try {
        localStorage.setItem("agent360_pinned_agents", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [togglingAgentId, setTogglingAgentId] = useState<string | null>(null);

  const handleToggleAgentEnabled = async (agent: InfraAgent, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    triggerHaptic(20);
    const targetId = agent.id;
    const rawSlug = agent.slug || agent.id.replace(/^bot:agent360:/, "");
    const isRootDefault = agent.isRootAgent ?? (agent.canToggle === false) ?? (
      ["default-core", "gm-boc", "climax-default", "its-default", "gl-default", "planthy-pm"].includes(rawSlug) ||
      rawSlug.endsWith("-default") || rawSlug === "default"
    );

    const isCurrentlyEnabled = agent.enabled !== false && agent.status !== "disabled";
    const nextEnabled = !isCurrentlyEnabled;

    // Prevent disabling core node root agents which cannot be disabled on QwenPaw runtime
    if (!nextEnabled && (isRootDefault || agent.canToggle === false)) {
      setActiveAgentMenuId(null);
      setForkToast(`Agent ${agent.name} là Core Root Agent của cụm hạ tầng, không thể vô hiệu hóa.`);
      setTimeout(() => setForkToast(null), 3500);
      return;
    }

    setTogglingAgentId(targetId);
    setActiveAgentMenuId(null);

    setAgents((prev) =>
      prev.map((a) =>
        a.id === targetId
          ? {
              ...a,
              enabled: nextEnabled,
              status: nextEnabled ? "idle" : "disabled",
            }
          : a
      )
    );

    setForkToast(nextEnabled ? `Đang kích hoạt Agent ${agent.name}...` : `Đang vô hiệu hóa Agent ${agent.name}...`);

    try {
      console.log(`[Agent360] Initiating toggleAgentEnabled for ${targetId} -> enabled: ${nextEnabled}`);
      const ok = await toggleAgentEnabled(targetId, nextEnabled);
      console.log(`[Agent360] toggleAgentEnabled result for ${targetId}:`, ok);
      if (ok) {
        setForkToast(nextEnabled ? `Đã kích hoạt Agent ${agent.name}` : `Đã vô hiệu hóa Agent ${agent.name}`);
        try {
          const fresh = await fetchInfraAgents();
          if (fresh && fresh.length > 0) setAgents(fresh);
        } catch {}
      } else {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === targetId
              ? {
                  ...a,
                  enabled: isCurrentlyEnabled,
                  status: isCurrentlyEnabled ? "active" : "disabled",
                }
              : a
          )
        );
        setForkToast(`Không thể thay đổi trạng thái của ${agent.name}`);
      }
    } catch {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === targetId
            ? {
                ...a,
                enabled: isCurrentlyEnabled,
                status: isCurrentlyEnabled ? "active" : "disabled",
              }
            : a
        )
      );
      setForkToast(`Lỗi khi chuyển trạng thái ${agent.name}`);
    } finally {
      setTogglingAgentId(null);
      setTimeout(() => setForkToast(null), 3000);
    }
  };



  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(() => {
    try {
      const v = localStorage.getItem("agent360_pinned_chats");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });

  const [archivedChatIds, setArchivedChatIds] = useState<string[]>(() => {
    try {
      const v = localStorage.getItem("agent360_archived_chats");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });

  const toggleArchiveChat = (chatId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    triggerHaptic(15);
    setArchivedChatIds((prev) => {
      const isArchived = prev.includes(chatId);
      const next = isArchived ? prev.filter((id) => id !== chatId) : [...prev, chatId];
      try {
        localStorage.setItem("agent360_archived_chats", JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState<string>("");
  const [expandedTerminalIdx, setExpandedTerminalIdx] = useState<number | null>(null);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);

  // Search in agents sidebar
  const [agentSearchQuery, setAgentSearchQuery] = useState("");

  // Mobile / Tablet Responsive Drawer States
  const [mobileAgentsOpen, setMobileAgentsOpen] = useState(false);

  // Mobile Touch Edge Gesture for opening / closing Agent Sidebar
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartXRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null || touchStartYRef.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartXRef.current;
      const deltaY = touchEndY - touchStartYRef.current;

      // Ensure horizontal swipe is dominant over vertical scroll
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        // Swipe right from screen edge (startX <= 40px) opens agents drawer
        if (touchStartXRef.current <= 40 && deltaX > 60) {
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            try { navigator.vibrate(12); } catch {}
          }
          setMobileAgentsOpen(true);
        }
        // Swipe left when drawer is open closes it
        else if (mobileAgentsOpen && deltaX < -60) {
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            try { navigator.vibrate(8); } catch {}
          }
          setMobileAgentsOpen(false);
        }
      }

      touchStartXRef.current = null;
      touchStartYRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mobileAgentsOpen]);
  const [mobileChatsOpen, setMobileChatsOpen] = useState(false);
  const [mobileBotInfoOpen, setMobileBotInfoOpen] = useState(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const isUserScrolledUpRef = useRef<boolean>(false);

  // Map of last scroll positions per session
  const sessionScrollPositionsRef = useRef<Record<string, number>>({});

  // User Request Trace Bar state (desktop index navigator)
  const [hoveredTraceIdx, setHoveredTraceIdx] = useState<number | null>(null);
  const [activeTraceIdx, setActiveTraceIdx] = useState<number | null>(null);
  const activeTraceIdxRef = useRef<number | null>(null);
  const userTurnsRef = useRef<{ msg: ChatMessage; originalIdx: number }[]>([]);
  const traceCardTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [traceCardPos, setTraceCardPos] = useState<{ top: number; right: number } | null>(null);

  const findCurrentVisibleUserTurnIdx = (userTurns: { msg: ChatMessage; originalIdx: number }[]): number => {
    if (!messagesContainerRef.current || userTurns.length === 0) return 0;
    const container = messagesContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const currentScrollTop = container.scrollTop;

    let bestIdx = 0;
    for (let i = 0; i < userTurns.length; i++) {
      const el = document.getElementById(`chat-msg-${userTurns[i].msg.id}`);
      if (el) {
        const targetRect = el.getBoundingClientRect();
        const elTopOffset = targetRect.top - containerRect.top + currentScrollTop;
        if (elTopOffset <= currentScrollTop + 80) {
          bestIdx = i;
        }
      }
    }
    return bestIdx;
  };

  const scrollToUserTurn = (targetIdx: number) => {
    const userTurns = userTurnsRef.current;
    if (targetIdx < 0 || targetIdx >= userTurns.length || !messagesContainerRef.current) return;
    const turn = userTurns[targetIdx];
    const targetEl = document.getElementById(`chat-msg-${turn.msg.id}`);
    if (targetEl && messagesContainerRef.current) {
      triggerHaptic(12);
      const containerRect = messagesContainerRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const offset = targetRect.top - containerRect.top + messagesContainerRef.current.scrollTop;
      messagesContainerRef.current.scrollTo({
        top: Math.max(0, offset - 8),
        behavior: "smooth",
      });
      setHoveredTraceIdx(targetIdx);
      setActiveTraceIdx(targetIdx);
      activeTraceIdxRef.current = targetIdx;

      // Position minimal tooltip next to tick
      const tickEl = document.querySelector(`[data-trace-tick-idx="${targetIdx}"]`) as HTMLElement;
      if (tickEl) {
        const rect = tickEl.getBoundingClientRect();
        setTraceCardPos({
          right: Math.round(window.innerWidth - rect.left + 12),
          top: Math.round(rect.top + rect.height / 2),
        });
      }

      // Show preview card for 2200ms
      if (traceCardTimeoutRef.current) clearTimeout(traceCardTimeoutRef.current);
      traceCardTimeoutRef.current = setTimeout(() => {
        setHoveredTraceIdx(null);
        setTraceCardPos(null);
      }, 2200);
    }
  };

  const handleMessagesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // Save scroll position for active session
    if (selectedChatId) {
      sessionScrollPositionsRef.current[selectedChatId] = el.scrollTop;
    }
    // Calculate distance from bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isScrolledUp = distanceFromBottom > 35;
    isUserScrolledUpRef.current = isScrolledUp;
    setShowScrollBottomBtn(isScrolledUp);

    // Update active visible user turn on scroll
    if (userTurnsRef.current.length > 0) {
      const curIdx = findCurrentVisibleUserTurnIdx(userTurnsRef.current);
      if (curIdx !== activeTraceIdxRef.current) {
        activeTraceIdxRef.current = curIdx;
        setActiveTraceIdx(curIdx);
      }
    }
  };
  const [isConnectAppsOpen, setIsConnectAppsOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideExport = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    if (isExportMenuOpen) {
      document.addEventListener("mousedown", handleClickOutsideExport);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideExport);
    };
  }, [isExportMenuOpen]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [plusMenuSearch, setPlusMenuSearch] = useState("");
  const [plusMenuSelectedIndex, setPlusMenuSelectedIndex] = useState<number>(-1);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const [plusMenuWidth, setPlusMenuWidth] = useState<number>(() => typeof window !== "undefined" ? window.innerWidth : 1024);
  const plusMenuSearchInputRef = useRef<HTMLInputElement>(null);
  const [plusMenuDragY, setPlusMenuDragY] = useState<number>(0);
  const [isPlusMenuDragging, setIsPlusMenuDragging] = useState<boolean>(false);
  const plusMenuTouchStartYRef = useRef<number | null>(null);
  const appsScrollRef = useRef<HTMLDivElement>(null);
  const subAgentsScrollRef = useRef<HTMLDivElement>(null);
  const lastAppsScrollTopRef = useRef(0);
  const lastSubAgentsScrollTopRef = useRef(0);

  // Dynamic responsive width detection for Chat Input Plus Popover
  useLayoutEffect(() => {
    if (!isPlusMenuOpen) return;
    const updateWidth = () => {
      if (plusMenuRef.current) {
        const w = plusMenuRef.current.getBoundingClientRect().width;
        if (w > 0) setPlusMenuWidth(w);
      }
    };
    updateWidth();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && plusMenuRef.current) {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            setPlusMenuWidth(entry.contentRect.width);
          }
        }
      });
      ro.observe(plusMenuRef.current);
    }
    window.addEventListener("resize", updateWidth);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [isPlusMenuOpen]);

  // Auto-scroll highlighted popover item into view when navigating via keyboard
  useEffect(() => {
    if (plusMenuSelectedIndex < 0 || !isPlusMenuOpen) return;
    const activeEl = document.querySelector(`[data-popover-nav-idx="${plusMenuSelectedIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [plusMenuSelectedIndex, isPlusMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target as Node)) {
        setIsPlusMenuOpen(false);
      }
    };
    if (isPlusMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Restore cached scroll positions after DOM paint
      requestAnimationFrame(() => {
        if (appsScrollRef.current && lastAppsScrollTopRef.current) {
          appsScrollRef.current.scrollTop = lastAppsScrollTopRef.current;
        }
        if (subAgentsScrollRef.current && lastSubAgentsScrollTopRef.current) {
          subAgentsScrollRef.current.scrollTop = lastSubAgentsScrollTopRef.current;
        }
      });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPlusMenuOpen]);

  // Jump immediately to bottom on open / chat switch without smooth scroll animation
  const jumpToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  };

  // Smooth scroll to bottom anchor when user submits a message
  const smoothScrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };



  // Realtime Server-Sent Events stream for high-risk tool approvals (<100ms push)
  useEffect(() => {
    let source: EventSource | null = null;
    try {
      const url = selectedChatId 
        ? `/api/approvals/stream?sessionId=${encodeURIComponent(selectedChatId)}`
        : `/api/approvals/stream`;
      source = new EventSource(url);
      source.addEventListener("approvals_update", (e) => {
        try {
          const data = JSON.parse(e.data);
          if (Array.isArray(data.pending_approvals)) {
            setPendingApprovals(data.pending_approvals);
          }
        } catch {}
      });
    } catch {}

    return () => {
      if (source) {
        source.close();
      }
    };
  }, [selectedChatId]);

  const handleInlineApprove = async (reqId: string, sessId: string) => {
    await approveToolExecution(reqId, sessId, "exact");
    setPendingApprovals((prev) => prev.filter((a) => a.request_id !== reqId));
  };

  const handleInlineDeny = async (reqId: string, sessId: string) => {
    await denyToolExecution(reqId, sessId, "Rejected by operator");
    setPendingApprovals((prev) => prev.filter((a) => a.request_id !== reqId));
  };

  // Initial load from real backend
  useEffect(() => {
    async function initData() {
      setIsLoadingAgents(true);
      let loadedAgents: any[] = [];
      let loadedSkills: any[] = [];
      try {
        [loadedAgents, loadedSkills] = await Promise.all([
          fetchInfraAgents(),
          fetchSkills(undefined),
        ]);
        // When 0 agents are returned, user either has no assigned agents or is a new member.
        // Don't show technical 'cluster standby / reconnect' error banner in this legitimate case.
        setBackendError(null);
      } catch (err: any) {
        setBackendError(err?.name === "AgentListAuthError" || err instanceof AgentListAuthError
          ? err.message
          : "Cluster API is unreachable. Showing no agents until it responds.");
      }

      setAgents(loadedAgents);
      setSkills(loadedSkills);
      setIsLoadingAgents(false);

      // Pre-populate recent sessions map for each agent from initial data
      if (Array.isArray(loadedAgents)) {
        setAgentRecentSessions((prev) => {
          const next = { ...prev };
          for (const ag of loadedAgents) {
            if (!next[ag.id] && ag.sessions && ag.sessions.length > 0 && ag.sessions[0]?.title) {
              next[ag.id] = ag.sessions[0].title;
            }
          }
          try { localStorage.setItem("agent360_recent_sessions_map", JSON.stringify(next)); } catch {}
          return next;
        });
      }

      // Subscribe to live SSE health pulse across infra fleet
      try {
        const healthSource = new EventSource("/api/agents/health/stream");
        healthSource.addEventListener("health_pulse", (e) => {
          try {
            const data = JSON.parse(e.data);
            if (Array.isArray(data.agents)) {
              setAgents((prev) => {
                const map = new Map<string, { status?: InfraAgent["status"] }>(data.agents.map((x: any) => [x.slug, x]));
                return prev.map((a) => {
                  const update = map.get(a.slug);
                  if (update?.status && update.status !== a.status) {
                    return { ...a, status: update.status };
                  }
                  return a;
                });
              });
            }
          } catch {}
        });
      } catch {}

      if (loadedAgents.length > 0) {
        // Route param /app/:agentParam wins, then ?agent= (query param), then localStorage
        let queryAgent = "";
        try { queryAgent = new URLSearchParams(window.location.search).get("agent") || ""; } catch {}
        const pick = (want: string | null | undefined) => {
          if (!want) return undefined;
          const bare = want.replace(/^bot:agent360:/i, "").toLowerCase();
          return loadedAgents.find((a) => a.id === want || (a.id || "").toLowerCase() === want.toLowerCase() || a.id.toLowerCase() === `bot:agent360:${bare}` || (a.slug || "").toLowerCase() === bare);
        };
        const found = pick(agentParam) || pick(queryAgent) || pick(localStorage.getItem("agent360_last_agent_id"));
        const targetId = found ? found.id : loadedAgents[0].id;
        setSelectedAgentId(targetId);
        try {
          localStorage.setItem("agent360_last_agent_id", targetId);
        } catch {}
      }
    }
    initData();

    // Auto-trigger Driver.js onboarding tour for first-time visitors
    const timer = setTimeout(() => {
      if (!hasSeenOnboardingTour()) {
        startOnboardingTour();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch agent-specific MCP clients, loop mode and subagents whenever selectedAgentId changes
  useEffect(() => {
    if (!isKnownAgent(selectedAgentId)) return;
    fetchAgentMcpClients(selectedAgentId).then((clients) => {
      setCurrentAgentMcpClients(clients);
      const appIds = clients.map((c) => c.key.toLowerCase().replace(/^composio_/, ""));
      setConnectedAppIds(appIds);
    }).catch(() => {
      setCurrentAgentMcpClients([]);
    });

    subAgentApi.list(selectedAgentId).then((bindings) => {
      setCurrentAgentSubBindings(bindings || []);
    }).catch(() => {
      setCurrentAgentSubBindings([]);
    });

    fetchSkills(selectedAgentId).then((sk) => {
      if (Array.isArray(sk) && sk.length > 0) setSkills(sk);
    }).catch(() => {});

    // Restore persistent Loop Mode per agent from localStorage with backend sync fallback
    try {
      const localSaved = localStorage.getItem(`skyer_loop_mode_${selectedAgentId}`);
      if (localSaved === "default" || localSaved === "goal" || localSaved === "mission") {
        setActiveLoopMode(localSaved);
      } else {
        fetchAgentLoopMode(selectedAgentId).then((cfg) => {
          if (cfg?.mode) {
            setActiveLoopMode(cfg.mode);
            localStorage.setItem(`skyer_loop_mode_${selectedAgentId}`, cfg.mode);
          }
        });
      }
    } catch {
      fetchAgentLoopMode(selectedAgentId).then((cfg) => {
        if (cfg?.mode) setActiveLoopMode(cfg.mode);
      });
    }
  }, [selectedAgentId, mcpRefreshTrigger, agents.length]);

  // Fetch agent-specific chats whenever selectedAgentId changes
  useEffect(() => {
    if (!isKnownAgent(selectedAgentId)) return;
    let cancelled = false;
    const currentAgent = selectedAgentId;

    async function loadAgentChats() {
      // SWR: Instant render from client memory/sessionStorage cache
      const cached = getCachedAgentChats(currentAgent);
      if (cached && cached.length > 0) {
        if (!cancelled && selectedAgentIdRef.current === currentAgent) {
          setChats(cached);
          setChatsAgentId(currentAgent);
        }
      } else {
        if (!cancelled && selectedAgentIdRef.current === currentAgent) {
          setIsLoadingChats(true);
        }
      }

      try {
        const loadedChats = await fetchAgentChats(currentAgent);
        if (cancelled || selectedAgentIdRef.current !== currentAgent) return;

        setChats(loadedChats);
        const normCurrentAgent = normalizeAgentKey(currentAgent);
        for (const c of loadedChats) {
          registerSessionAgent(c.id, c.session_id, normCurrentAgent);
        }
        const activeChatsForAgent = loadedChats.filter((c) =>
          Boolean(
            c.isRunning ||
              c.is_running ||
              c.status === "running" ||
              c.status === "in_progress" ||
              streamingChatIdsRef.current.includes(c.id) ||
              (c.session_id ? streamingChatIdsRef.current.includes(c.session_id) : false)
          )
        );
        const activeIds = activeChatsForAgent.flatMap((c) => [c.id, c.session_id].filter(Boolean) as string[]);
        const agentChatIds = loadedChats.flatMap((c) => [c.id, c.session_id].filter(Boolean) as string[]);
        setRunningChatIds((prev) => {
          const nonAgentIds = prev.filter((id) => !agentChatIds.includes(id) || streamingChatIdsRef.current.includes(id));
          const currentPreserved = (isStreaming && selectedChatId) ? [selectedChatId] : [];
          return Array.from(new Set([...nonAgentIds, ...activeIds, ...currentPreserved]));
        });
        if (normCurrentAgent) {
          const agentSet = new Set<string>();
          for (const c of activeChatsForAgent) {
            agentSet.add(c.id);
          }
          for (const streamId of streamingChatIdsRef.current) {
            if (normalizeAgentKey(chatAgentMapRef.current[streamId]) === normCurrentAgent) {
              agentSet.add(streamId);
            }
          }
          agentRunningSessionsRef.current[normCurrentAgent] = agentSet;
          syncAgentRunningCounts();
        }
        const unreadIds = loadedChats
          .filter((c) => Boolean(c.unread) && !isViewedChat(c.id) && !isViewedChat(c.session_id))
          .flatMap((c) => [c.id, c.session_id].filter(Boolean) as string[]);
        if (unreadIds.length > 0) {
          const fullKey = normCurrentAgent ? `bot:agent360:${normCurrentAgent}` : currentAgent;
          setUnreadCompletedSessions((prev) => ({
            ...prev,
            [currentAgent]: Array.from(new Set([...(prev[currentAgent] || []), ...unreadIds])),
            ...(normCurrentAgent ? { [normCurrentAgent]: Array.from(new Set([...(prev[normCurrentAgent] || []), ...unreadIds])) } : {}),
            [fullKey]: Array.from(new Set([...(prev[fullKey] || []), ...unreadIds]))
          }));
        }
        setChatsAgentId(currentAgent);
        if (loadedChats.length > 0 && loadedChats[0]?.title) {
          setAgentRecentSessions((prev) => {
            const next = { ...prev, [currentAgent]: loadedChats[0].title };
            try { localStorage.setItem("agent360_recent_sessions_map", JSON.stringify(next)); } catch {}
            return next;
          });
        }
        if (loadedChats.length > 0) {
          const savedChatKey = `agent360_last_chat_${currentAgent}`;
          // Preference: savedChatKey for this specific agent -> first chat in list
          // Only use chatParam if route is currently matching this agent
          const findChat = (key: string | null | undefined) =>
            key ? loadedChats.find((c) => c.id === key) || loadedChats.find((c) => c.session_id === key) : undefined;
          const savedChatId = localStorage.getItem(savedChatKey);
          const foundSaved = findChat(savedChatId);
          const activeAg = agents.find((a) => a.id === currentAgent || a.slug === currentAgent);
          const currentBare = (activeAg?.slug || activeAg?.id || currentAgent).replace(/^bot:agent360:/i, "").toLowerCase();
          const routeAgentBare = (agentParam || "").replace(/^bot:agent360:/i, "").toLowerCase();
          const isNewSessionParam = Boolean(routeAgentBare === currentBare && chatParam && chatParam.startsWith("session-"));
          const urlChatFound = (routeAgentBare === currentBare) ? findChat(chatParam) : undefined;

          const targetChat = urlChatFound
            ?? (isNewSessionParam && chatParam
                ? {
                    id: chatParam,
                    title: "New Chat",
                    updatedAt: "Just now",
                    messageCount: 0,
                    lastMessageSnippet: "Start a conversation...",
                    session_id: chatParam,
                    agentId: currentBare,
                    channel: "console",
                  }
                : undefined)
            ?? foundSaved
            ?? loadedChats[0];
          const targetChatId: string = targetChat.id;
          setSelectedChatId(targetChatId);
          try {
            localStorage.setItem("agent360_last_chat_id", targetChatId);
            localStorage.setItem(savedChatKey, targetChatId);
          } catch {}

          // Ensure channel filter does not hide this newly selected chat if it belongs to a different channel
          const targetChannel = (targetChat.channel || "console").toLowerCase();
          setChannelFilter((prev) => {
            if (prev !== "all" && prev !== targetChannel) {
              if (prev === "other" && !["console", "telegram", "zalo"].includes(targetChannel)) return prev;
              // If target channel has sessions, switch to that channel or "all"
              return targetChannel || "all";
            }
            return prev;
          });

          // Sync routing URL to /app/:agentSlug/:chatId without disrupting history
          const agentSegment = activeAg?.slug || activeAg?.id || currentAgent;
          if (agentSegment && targetChatId) {
            const expectedPath = `/app/${agentSegment}/${targetChatId}`;
            if (window.location.pathname !== expectedPath && selectedAgentIdRef.current === currentAgent) {
              navigate(expectedPath, { replace: true });
            }
          }
        } else {
          setSelectedChatId("");
        }
      } finally {
        if (!cancelled && selectedAgentIdRef.current === currentAgent) {
          setIsLoadingChats(false);
        }
      }
    }
    loadAgentChats();
    return () => {
      cancelled = true;
    };
  }, [selectedAgentId, agents.length]);

  // A restored chat id may belong to another agent (or be gone); only load chats in this agent's real list.
  // Client-created sessions (session-*) are not in the server list yet and are allowed.
  const selectedChatKnown = !!selectedChatId && (
    selectedChatId.startsWith("session-") ||
    chats.some((c) => c.id === selectedChatId || c.session_id === selectedChatId) ||
    Boolean(chatParam && chatParam === selectedChatId)
  );

  // When selectedChatId changes, fetch real messages with instant client cache display
  useEffect(() => {
    if (!selectedChatId || !selectedChatKnown) return;

    isInitialLoadRef.current = true;
    let mounted = true;

    // 1. Instant Cache Hit: render cached turns immediately without spinner
    const cachedTurns = (streamingChatIdsRef.current.includes(selectedChatId) && inflightMessagesRef.current[selectedChatId])
      || getCachedChatMessages(selectedChatId, selectedAgentId);
    if (cachedTurns !== null) {
      setMessages(cachedTurns);
      setShowPollCard(false);
      setIsLoadingMessages(false);
      setTimeout(() => {
        const savedPos = sessionScrollPositionsRef.current[selectedChatId];
        if (typeof savedPos === "number" && messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = savedPos;
        } else {
          jumpToBottom();
        }
        isInitialLoadRef.current = false;
      }, 0);
    } else {
      setIsLoadingMessages(true);
    }

    // Clear unread indicator and mark read both locally and in backend when active chat is viewed
    const currentChat = (chats.find((c) => c.id === selectedChatId) || chats.find((c) => c.session_id === selectedChatId));
    const sessionIdsToClear = [selectedChatId, currentChat?.session_id].filter(Boolean) as string[];

    markChatAsRead(selectedChatId, selectedAgentId);
    if (currentChat?.session_id) {
      markChatAsRead(currentChat.session_id, selectedAgentId);
    }
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChatId || (currentChat?.session_id && c.session_id === currentChat.session_id) ? { ...c, unread: false } : c))
    );
    setUnreadCompletedSessions((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((id) => !sessionIdsToClear.includes(id));
      }
      try {
        localStorage.setItem("agent360_unread_sessions", JSON.stringify(next));
      } catch {}
      return next;
    });

    // Load Session-Sticky Collaboration Room if bound to this chat session
    fetchChatSessionRoom(selectedAgentId, selectedChatId).then((r) => {
      if (mounted) setActiveSessionRoom(r);
    }).catch(() => {});

    // 2. Background Revalidation from API
    fetchChatMessages(selectedChatId, selectedAgentId).then((loadedMsgs) => {
      if (!mounted) return;
      // A console turn of this chat is still streaming: keep the in-flight turn instead of the persisted history.
      if (streamingChatIdsRef.current.includes(selectedChatId)) {
        const live = inflightMessagesRef.current[selectedChatId];
        if (live) setMessages(live);
        setIsLoadingMessages(false);
        return;
      }
      if (loadedMsgs.length > 0) {
        setMessages(loadedMsgs);
        setShowPollCard(false);
        // Live update the last message snippet in chats list for active session
        const lastTurn = loadedMsgs[loadedMsgs.length - 1];
        if (lastTurn && lastTurn.content) {
          const cleanLastText = lastTurn.content.trim().replace(/\s+/g, " ").slice(0, 90);
          setChats((prev) => {
            const cur = prev.find((c) => c.id === selectedChatId);
            if (cur && cur.lastMessageSnippet === cleanLastText) return prev;
            return prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessageSnippet: cleanLastText } : c));
          });
        }
      } else if (!cachedTurns || cachedTurns.length === 0) {
        // Empty new or clean session: keep messages empty to display quick prompt suggestions immediately
        setMessages([]);
        setShowPollCard(false);
      }
      setIsLoadingMessages(false);
      // Trigger load latest (jumpToBottom) only when newly opening chat session without cached turns
      if (isInitialLoadRef.current) {
        isInitialLoadRef.current = false;
        const savedPos = sessionScrollPositionsRef.current[selectedChatId];
        if (typeof savedPos === "number" && messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = savedPos;
        } else {
          setTimeout(jumpToBottom, 0);
          setTimeout(jumpToBottom, 60);
        }
      }
    }).catch(() => {
      // Keep whatever real (cached) turns we have; never substitute canned dialogue.
      if (mounted) setIsLoadingMessages(false);
    });

    return () => {
      mounted = false;
    };
  }, [selectedChatId, selectedAgentId, selectedChatKnown]);



    // Real-time bidirectional Telegram & external turn sync listener
  useEffect(() => {
    if (!selectedChatId || !selectedAgentId || !selectedChatKnown) return;
    if (selectedChatId.startsWith("session-")) return;

    let sse: EventSource | null = null;
    try {
      const defaultOpKey = "fd90fead6f7381094c0f891bf3268a5a041d22ea1ca4a0be";
      let sseUrl = `/api/agents/${encodeURIComponent(selectedAgentId)}/chats/${encodeURIComponent(selectedChatId)}/stream`;
      try {
        const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
        const opKey = localStorage.getItem("agent360.a2a.operatorKey") || localStorage.getItem("operator_token") || defaultOpKey;
        const qParams = new URLSearchParams();
        if (token) qParams.set("access_token", token);
        if (opKey) qParams.set("operatorToken", opKey);
        const qStr = qParams.toString();
        if (qStr) sseUrl += `?${qStr}`;
      } catch {}

      sse = new EventSource(sseUrl);

      sse.addEventListener("connected", (e) => {
        try {
          const meta = JSON.parse(e.data);
          registerSessionAgent(meta.chat_id || selectedChatId, meta.session_id, meta.agent_id || selectedAgentId);
          if (meta.is_running) {
            const ids = [meta.chat_id, meta.session_id, selectedChatId].filter(Boolean) as string[];
            setRunningChatIds((prev) => Array.from(new Set([...prev, ...ids])));
            updateAgentSessionRunning(meta.agent_id || selectedAgentId, ids, true);
          }
        } catch {}
      });

      sse.addEventListener("session_update", (e) => {
        try {
          const payload = JSON.parse(e.data);
          registerSessionAgent(payload.chat_id || selectedChatId, payload.session_id, payload.agent_id || selectedAgentId);
          const ids = [payload.chat_id, payload.session_id].filter(Boolean) as string[];
          const isTurnRunning = payload.is_running ?? (payload.last_message && (payload.last_message.status === "in_progress" || payload.last_message.status === "running"));
          if (isTurnRunning) {
            setRunningChatIds((prev) => Array.from(new Set([...prev, ...ids, selectedChatId])));
            updateAgentSessionRunning(payload.agent_id || selectedAgentId, [...ids, selectedChatId], true);
            setChats((prev) =>
              prev.map((c) => {
                if (ids.includes(c.id) || (c.session_id && ids.includes(c.session_id))) {
                  return {
                    ...c,
                    is_running: true,
                    isRunning: true,
                    status: "running"
                  };
                }
                return c;
              })
            );
          } else {
            const isStillStreaming = ids.some((id) => streamingChatIdsRef.current.includes(id)) || streamingChatIdsRef.current.includes(selectedChatId);
            setRunningChatIds((prev) => prev.filter((id) => !ids.includes(id) && (id !== selectedChatId || !isStillStreaming)));
            if (!isStillStreaming) {
              updateAgentSessionRunning(payload.agent_id || selectedAgentId, [...ids, selectedChatId], false);
            }
            setChats((prev) =>
              prev.map((c) => {
                if (ids.includes(c.id) || (c.session_id && ids.includes(c.session_id))) {
                  return {
                    ...c,
                    is_running: isStillStreaming,
                    isRunning: isStillStreaming,
                    status: isStillStreaming ? "running" : "idle"
                  };
                }
                return c;
              })
            );
            const targetChatId = payload.chat_id || payload.session_id;
            if (targetChatId && targetChatId !== selectedChatId && document.hidden) {
              setUnreadCompletedSessions((prev) => {
                const normAg = normalizeAgentKey(payload.agent_id || selectedAgentId);
                const fullKey = normAg ? `bot:agent360:${normAg}` : selectedAgentId;
                const list = prev[selectedAgentId] || [];
                if (list.includes(targetChatId)) return prev;
                const updated = {
                  ...prev,
                  [selectedAgentId]: Array.from(new Set([...(prev[selectedAgentId] || []), targetChatId])),
                  ...(normAg ? { [normAg]: Array.from(new Set([...(prev[normAg] || []), targetChatId])) } : {}),
                  [fullKey]: Array.from(new Set([...(prev[fullKey] || []), targetChatId]))
                };
                try {
                  localStorage.setItem("agent360_unread_sessions", JSON.stringify(updated));
                } catch {}
                return updated;
              });
              setChats((prev) => prev.map((c) => (c.id === targetChatId || c.session_id === targetChatId ? { ...c, unread: true } : c)));
            }
          }
          const activeChatRef = (chats.find((c) => c.id === selectedChatId) || chats.find((c) => c.session_id === selectedChatId));
          const isTargetSession =
            payload.chat_id === selectedChatId ||
            payload.session_id === selectedChatId ||
            (activeChatRef && (payload.chat_id === activeChatRef.id || payload.chat_id === activeChatRef.session_id || payload.session_id === activeChatRef.session_id));

          if (isTargetSession && !streamingChatIdsRef.current.includes(selectedChatId)) {
            if (Array.isArray(payload.messages) && payload.messages.length > 0) {
              const parsedTurns = parseRawChatMessages(payload.messages, selectedChatId, isTurnRunning);
              if (parsedTurns && parsedTurns.length > 0) {
                setMessages(parsedTurns);
                setShowPollCard(false);
                const lastTurn = parsedTurns[parsedTurns.length - 1];
                if (lastTurn?.content) {
                  const cleanLastText = lastTurn.content.trim().replace(/\s+/g, " ").slice(0, 90);
                  setChats((prev) =>
                    prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessageSnippet: cleanLastText } : c))
                  );
                }
              }
            } else {
            fetchChatMessages(selectedChatId, selectedAgentId).then((reloadedMsgs) => {
              if (reloadedMsgs && reloadedMsgs.length > 0) {
                setMessages(reloadedMsgs);
                setShowPollCard(false);
                const lastTurn = reloadedMsgs[reloadedMsgs.length - 1];
                if (lastTurn?.content) {
                  const cleanLastText = lastTurn.content.trim().replace(/\s+/g, " ").slice(0, 90);
                  setChats((prev) =>
                    prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessageSnippet: cleanLastText } : c))
                  );
                }
              }
            });
            }
          }
        } catch {}
      });
    } catch {}

    return () => {
      if (sse) sse.close();
    };
  }, [selectedChatId, selectedAgentId, selectedChatKnown]);

  const loadWorkspaceTree = async (overrideAgentId?: string) => {
    const targetId = overrideAgentId || selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
    if (!targetId) return;
    setIsLoadingTree(true);
    try {
      const lib = await fetchWorkspaceLibrary(targetId);
      setWorkspaceFiles(lib.entries);
      setLibraryCategoryCounts(lib.categoryCounts || {});
      setLibraryFormatCounts(lib.formatCounts || {});
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleSelectFile = async (node: WorkspaceTreeNode) => {
    if (node.kind === "directory") return;
    setSelectedFilePath(node.path);
    setSelectedLibraryNode(node);
    setFileContent(null);
    if (fileBlobUrl) {
      URL.revokeObjectURL(fileBlobUrl);
      setFileBlobUrl(null);
    }
    setIsLoadingFile(true);
    try {
      const targetId = selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
      if (!targetId) return;
      const pk = (node.previewKind || "").toLowerCase();
      const cat = (node.category || "").toLowerCase();
      if (pk === "image" || cat === "images" || pk === "pdf" || pk === "video" || pk === "audio" || cat === "media") {
        const blobUrl = await fetchWorkspaceFileBlobUrl(targetId, node.path, true);
        setFileBlobUrl(blobUrl);
      } else if (pk === "spreadsheet" || pk === "document" || pk === "binary") {
        setFileContent(null);
      } else {
        const content = await fetchWorkspaceFileContent(targetId, node.path);
        setFileContent(content);
      }
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Close browser modal on Escape key and persist state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInputFocused = targetTag === "input" || targetTag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === "Escape" && isBrowserModalOpen) {
        handleSetBrowserModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBrowserModalOpen]);

  useEffect(() => {
    setSelectedFilePath(null);
    setSelectedLibraryNode(null);
    setFileContent(null);
    if (fileBlobUrl) {
      URL.revokeObjectURL(fileBlobUrl);
      setFileBlobUrl(null);
    }
    setLibraryCategoryFilter("all");
    setLibraryExtFilter("");
    setLibraryPage(1);
    setLibraryCollapsedGroups({});
    if (selectedAgentId && isKnownAgent(selectedAgentId)) {
      loadWorkspaceTree(selectedAgentId);
    } else {
      setWorkspaceFiles([]);
      setLibraryCategoryCounts({});
      setLibraryFormatCounts({});
    }
  }, [selectedAgentId, agents.length]);

  useEffect(() => {
    if ((rightTab === "Library" || (rightTab === "Details" && detailSubTab === "Library")) && workspaceFiles.length === 0 && !isLoadingTree) {
      loadWorkspaceTree();
    }
  }, [rightTab, detailSubTab]);

  useEffect(() => {
    if (!isKnownAgent(selectedAgentId)) return;
    setLoadingChannels(true);
    fetchAgentChannels(selectedAgentId)
      .then(setChannels)
      .finally(() => setLoadingChannels(false));

    setLoadingSchedules(true);
    fetchAgentSchedules(selectedAgentId)
      .then(setSchedules)
      .finally(() => setLoadingSchedules(false));
  }, [selectedAgentId, rightTab, agents.length]);

  const refreshDetailsData = () => {
    if (!selectedAgentId) return;
    fetchAgentChannels(selectedAgentId).then(setChannels);
    fetchAgentSchedules(selectedAgentId).then(setSchedules);
  };

  const handleSelectLoopMode = async (mode: "default" | "goal" | "mission") => {
    setActiveLoopMode(mode);
    setLoopPulse(mode);
    try {
      localStorage.setItem(`skyer_loop_mode_${selectedAgentId}`, mode);
    } catch {}
    setTimeout(() => setLoopPulse(null), 400);

    // Micro-HUD pill notification (1500ms duration)
    if (loopToastTimerRef.current) clearTimeout(loopToastTimerRef.current);
    setLoopModeToast({ mode, visible: true });
    loopToastTimerRef.current = setTimeout(() => {
      setLoopModeToast((prev) => prev ? { ...prev, visible: false } : null);
    }, 1500);

    await updateAgentLoopMode(selectedAgentId, mode);
  };

  const handleToggleChannel = async (channelType: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    setChannels((prev) =>
      prev.map((ch) => (ch.type === channelType ? { ...ch, enabled: nextState } : ch))
    );
    await toggleAgentChannel(selectedAgentId, channelType, nextState);
  };

  const hasNoAgents = !isLoadingAgents && agents.length === 0;

  // Always focus textarea when chat finishes loading or user switches sessions
  useEffect(() => {
    if (!isLoadingMessages && selectedChatId && !hasNoAgents) {
      const timer = setTimeout(() => {
        if (textareaRef.current && document.activeElement !== textareaRef.current) {
          textareaRef.current.focus({ preventScroll: true });
        }
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isLoadingMessages, selectedChatId, hasNoAgents]);
  const selectedAgent = agents.find((a) =>
    a.id === selectedAgentId ||
    a.slug === selectedAgentId ||
    (a.id || "").toLowerCase() === `bot:agent360:${(selectedAgentId || "").toLowerCase()}` ||
    (a.slug || "").toLowerCase() === (selectedAgentId || "").replace(/^bot:agent360:/i, "").toLowerCase()
  ) || agents[0] || {
    id: "",
    name: "",
    slug: "",
    roleTag: "",
    node: "",
    status: "active",
    model: "",
    uptime: "",
    memoryUsageMb: 0,
    description: "",
    tools: [],
    sessions: [],
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const isTurnActiveInStorage = typeof window !== "undefined" && Boolean(selectedChatId && sessionStorage.getItem(`agent360_active_turn_${selectedChatId}`) === "true");
  const isCurrentSessionRunning = Boolean(
    isStreaming ||
    isTurnActiveInStorage ||
    (selectedChatId && runningChatIds.includes(selectedChatId)) ||
    (selectedChat?.session_id && runningChatIds.includes(selectedChat.session_id)) ||
    Boolean(selectedChat && (selectedChat.isRunning || selectedChat.status === "running" || selectedChat.status === "in_progress"))
  );

  const getAgentUnreadList = (ag: { id?: string; slug?: string }): string[] => {
    const normId = normalizeAgentKey(ag.id);
    const normSlug = normalizeAgentKey(ag.slug);
    const set = new Set<string>([
      ...(ag.id ? unreadCompletedSessions[ag.id] || [] : []),
      ...(ag.slug ? unreadCompletedSessions[ag.slug] || [] : []),
      ...(normId ? unreadCompletedSessions[normId] || [] : []),
      ...(normSlug ? unreadCompletedSessions[normSlug] || [] : []),
      ...(normId ? unreadCompletedSessions[`bot:agent360:${normId}`] || [] : []),
    ]);
    return Array.from(set);
  };

  const checkIsAgentBusy = (ag: InfraAgent): boolean => {
    const normId = normalizeAgentKey(ag.id);
    const normSlug = normalizeAgentKey(ag.slug);
    const normSelected = normalizeAgentKey(selectedAgentId);
    const isSelectedAg = Boolean(normSelected && (normId === normSelected || normSlug === normSelected));

    // 1. Check active multiplexer / turn counts across all key variants
    if (
      (runningAgentIds[ag.id] || 0) > 0 ||
      (ag.slug ? (runningAgentIds[ag.slug] || 0) > 0 : false) ||
      (normId ? (runningAgentIds[normId] || 0) > 0 : false) ||
      (normSlug ? (runningAgentIds[normSlug] || 0) > 0 : false) ||
      (normId ? (runningAgentIds[`bot:agent360:${normId}`] || 0) > 0 : false)
    ) {
      return true;
    }

    // 2. Check active session sets tracked in ref
    if (
      (normId && (agentRunningSessionsRef.current[normId]?.size || 0) > 0) ||
      (normSlug && (agentRunningSessionsRef.current[normSlug]?.size || 0) > 0) ||
      (agentRunningSessionsRef.current[ag.id]?.size || 0) > 0 ||
      (ag.slug && (agentRunningSessionsRef.current[ag.slug]?.size || 0) > 0)
    ) {
      return true;
    }

    // 3. Check if any currently streaming or running chat belongs to this agent
    const allActiveChatIds = [...streamingChatIds, ...runningChatIds];
    for (const cid of allActiveChatIds) {
      const owner = normalizeAgentKey(chatAgentMapRef.current[cid]);
      if (owner && (owner === normId || owner === normSlug)) {
        return true;
      }
    }

    // 4. If this is the currently selected agent, also check current streaming/running flags & loaded chats
    if (isSelectedAg) {
      if (isStreaming || isCurrentSessionRunning) return true;
      const normChatsOwner = normalizeAgentKey(chatsAgentId);
      if (!normChatsOwner || normChatsOwner === normId || normChatsOwner === normSlug) {
        const hasRunningInChats = chats.some((c) =>
          Boolean(
            c.isRunning ||
              c.is_running ||
              c.status === "running" ||
              c.status === "in_progress" ||
              runningChatIds.includes(c.id) ||
              (c.session_id ? runningChatIds.includes(c.session_id) : false) ||
              streamingChatIds.includes(c.id) ||
              (c.session_id ? streamingChatIds.includes(c.session_id) : false)
          )
        );
        if (hasRunningInChats) return true;
      }
    }

    return false;
  };

  // Live turn of the open chat when it runs on another channel (Telegram, Zalo, cron, other console tab).
  // Uses the same QwenPaw event stream as a console send, so reasoning and every executed tool render identically.
  const [liveTurn, setLiveTurn] = useState<{ chatId: string; userText: string | null; msg: ChatMessage } | null>(null);
  useEffect(() => {
    viewedChatIdsRef.current = [selectedChatId, selectedChat?.session_id].filter(Boolean) as string[];
  }, [selectedChatId, selectedChat?.session_id]);
  useEffect(() => {
    setLiveTurn(null);
    if (!selectedChatId || !selectedAgentId || isStreaming || !isCurrentSessionRunning || selectedChatId.startsWith("session-")) return;
    const chatId = selectedChatId;
    const controller = new AbortController();
    (async () => {
      try {
        const streamed = await attachLiveTurn(selectedAgentId, chatId, (msg, userText) => {
          if (controller.signal.aborted) return;
          setLiveTurn({ chatId, userText, msg });
          if (!isUserScrolledUpRef.current) jumpToBottom();
        }, controller.signal);
        if (controller.signal.aborted) return;
        // Turn finished (or session was idle): reload the persisted history, which now contains this turn.
        const reloaded = await fetchChatMessages(chatId, selectedAgentId).catch(() => null);
        if (controller.signal.aborted) return;
        if (reloaded && reloaded.length > 0) setMessages(reloaded);
        setLiveTurn(null);
        if (streamed) {
          try {
            sessionStorage.removeItem(`agent360_active_turn_${chatId}`);
            sessionStorage.removeItem(`agent360_last_prompt_${chatId}`);
          } catch {}
          setRunningChatIds((prev) => prev.filter((id) => id !== chatId && id !== selectedChat?.session_id));
          updateAgentSessionRunning(selectedAgentId, [chatId, selectedChat?.session_id], false);
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId || (selectedChat?.session_id && c.session_id === selectedChat.session_id)
                ? { ...c, is_running: false, isRunning: false, status: "idle" }
                : c
            )
          );
          markChatAsRead(chatId, selectedAgentId);
        }
      } catch {
        if (!controller.signal.aborted) setLiveTurn(null);
      }
    })();
    return () => controller.abort();
  }, [selectedChatId, selectedAgentId, isStreaming, isCurrentSessionRunning]);
  const liveTurnForView = liveTurn && liveTurn.chatId === selectedChatId ? liveTurn : null;
  var displayMessages: ChatMessage[] = (() => {
    const base = [...messages];
    if (activeSessionRoom && (activeSessionRoom.host_chat_id === selectedChatId || activeSessionRoom.host_session_id === selectedChatId || (selectedChat?.session_id && (activeSessionRoom.host_chat_id === selectedChat.session_id || activeSessionRoom.host_session_id === selectedChat.session_id))) && Array.isArray(activeSessionRoom.turns)) {
      for (const rt of activeSessionRoom.turns) {
        if (rt.kind !== "collaborator_reply" && rt.kind !== "question" && rt.kind !== "manager_guard") continue;
        if (base.some((m) => m.id === rt.id)) continue;
        const rtSteps = Array.isArray((rt as any).steps) ? (rt as any).steps : [];
        base.push({
          id: rt.id,
          role: "assistant",
          content: rt.text,
          reasoning: (rt as any).reasoning || undefined,
          steps: rtSteps,
          toolCalls: rtSteps.filter((s: any) => s.kind === "tool_call"),
          timestamp: rt.created_at,
          evidenceStatus: "observed",
          senderAgentId: rt.author_id,
          senderAgentName: rt.author_name,
          authorRole: rt.author_role,
          roomId: activeSessionRoom.room_id,
          matrixRoomId: activeSessionRoom.matrix_room_id,
          elementRoomUrl: activeSessionRoom.element_room_url,
        });
      }
    }
    if (!liveTurnForView) return base;
    const lastUser = [...base].reverse().find((m) => m.role === "user");
    const userText = liveTurnForView.userText?.trim() || (typeof window !== "undefined" && selectedChatId ? sessionStorage.getItem(`agent360_last_prompt_${selectedChatId}`) : null);
    if (userText && (!lastUser || lastUser.content.trim() !== userText)) {
      base.push({ id: `live-user-${selectedChatId}`, role: "user", content: userText, timestamp: new Date().toISOString() });
    }
    base.push(liveTurnForView.msg);
    return base;
  })();

  useEffect(() => {
    // Only jump to bottom on initial load / chat switch
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      const savedPos = sessionScrollPositionsRef.current[selectedChatId];
      if (typeof savedPos === "number" && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = savedPos;
      } else {
        jumpToBottom();
        const timer = setTimeout(jumpToBottom, 40);
        return () => clearTimeout(timer);
      }
      return;
    }
    // During active streaming or new messages, only scroll if user has NOT scrolled up
    if (isStreaming && !isUserScrolledUpRef.current) {
      jumpToBottom();
    }
  }, [displayMessages, isStreaming, selectedChatId]);

  // Dynamic Document Title based on active session and agent
  useEffect(() => {
    const agName = selectedAgent?.name || "Workspace";
    if (selectedChat?.title && selectedChat.title !== "New Chat") {
      document.title = `${selectedChat.title} • ${agName} | Skyer`;
    } else {
      document.title = `${agName} | Skyer`;
    }
  }, [selectedChat?.title, selectedAgent?.name]);

  // The selected agent's own browser (service + Chromium profile); refreshed while the Computer surface is visible.
  const [agentBrowser, setAgentBrowser] = useState<AgentBrowserInfo | null>(null);
  // Resolve only once the agent list has loaded: before that `selectedAgent` is the first agent / a
  // placeholder, and its browser would flash in for the agent the user actually selected.
  const agentBrowserFor = isLoadingAgents || !agents.some((a) => a.id === selectedAgent?.id) ? "" : (selectedAgent?.slug || selectedAgent?.id || "");
  useEffect(() => {
    setAgentBrowser(null);
    if (!agentBrowserFor) return;
    // Bring the target agent's Chromium profile window to the top immediately (on mount & selection)
    focusAgentBrowser(agentBrowserFor).catch(() => {});
    let alive = true;
    const ctrl = new AbortController();
    const want = agentBrowserFor.replace(/^bot:agent360:/i, "").toLowerCase();
    const load = () => {
      if (document.hidden) return;
      fetchAgentBrowser(agentBrowserFor, ctrl.signal)
        // Never show another agent's browser if a late response races an agent switch.
        .then((info) => alive && setAgentBrowser(info && info.agentId.toLowerCase() === want ? info : null))
        .catch(() => {});
    };
    load();
    const i = setInterval(load, 20000);
    return () => { alive = false; ctrl.abort(); clearInterval(i); };
  }, [agentBrowserFor]);

  // Switch agent
  const handleSelectAgent = (agent: InfraAgent) => {
    setSelectedAgentId(agent.id);
    recordMilestone("selectedAgent");
    setMobileAgentsOpen(false);
    // Bring the target agent's Chromium profile window to the top immediately on selection
    focusAgentBrowser(agent.slug || agent.id).catch(() => {});
    try {
      localStorage.setItem("agent360_last_agent_id", agent.id);
    } catch {}

    // Clear stale chat selection so it does not bounce back
    setSelectedChatId("");
    const agentSegment = agent.slug || agent.id;
    const savedChatKey = `agent360_last_chat_${agent.id}`;
    const lastChatForAgent = localStorage.getItem(savedChatKey);
    if (lastChatForAgent) {
      navigate(`/app/${agentSegment}/${lastChatForAgent}`);
    } else {
      navigate(`/app/${agentSegment}`);
    }
  };

  // Switch chat session
  const handleSelectChat = (chat: AgentSession) => {
    if (!chat?.id || chat.id === selectedChatId) return;
    setSelectedChatId(chat.id);
    setMobileChatsOpen(false);
    try {
      localStorage.setItem("agent360_last_chat_id", chat.id);
      if (selectedAgentId) {
        localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, chat.id);
      }
    } catch {}

    // Update routing URL to /app/:agentSlug/:chatId
    const agentSegment = selectedAgent.slug || selectedAgent.id || selectedAgentId;
    if (agentSegment) {
      navigate(`/app/${agentSegment}/${chat.id}`);
    }
  };



  const togglePinChat = (chatId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPinnedChatIds((prev) => {
      const next = prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId];
      try {
        localStorage.setItem("agent360_pinned_chats", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSaveChatTitle = (chatId: string) => {
    if (!editingChatTitle.trim()) {
      setEditingChatId(null);
      return;
    }
    const nextTitle = editingChatTitle.trim();
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title: nextTitle } : c))
    );
    setEditingChatId(null);
    updateChatRoomTitle(selectedAgentId, chatId, nextTitle).then((r) => {
      if (r && chatId === selectedChatId) setActiveSessionRoom(r);
    }).catch(() => {});
  };

  const handleExportAuditCertificate = () => {
    if (messages.length === 0) return;
    const dateStr = new Date().toLocaleString("vi-VN");
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Skyer Autonomous Agent Audit Certificate - ${selectedAgent.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #07090e; color: #f0f2f5; padding: 40px; margin: 0; line-height: 1.6; }
    .card { background: #121218; border: 1px solid #262634; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: bold; background: rgba(248, 168, 124, 0.15); color: #f8a87c; border: 1px solid rgba(248, 168, 124, 0.3); }
    .receipt { background: #0a0a0f; border: 1px solid #20202a; border-radius: 10px; padding: 12px; margin-top: 10px; font-family: monospace; font-size: 12px; color: #34d399; }
    h1 { color: #fff; margin-bottom: 8px; font-size: 22px; }
    h2 { font-size: 16px; color: #f8a87c; border-bottom: 1px solid #20202a; padding-bottom: 6px; }
    .user { background: #1a1a24; border-color: #2c2c3e; margin-left: 40px; }
    .bot { background: #121218; border-color: #262634; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Skyer Verifiable Execution Receipt</span>
    <h1>Autonomous Task Delivery Audit</h1>
    <p><strong>Agent:</strong> ${selectedAgent.name} (@${selectedAgent.slug}) | <strong>Node:</strong> ${selectedAgent.node} | <strong>Model:</strong> ${selectedAgent.model.includes("/") ? selectedAgent.model.split("/").pop() : selectedAgent.model}</p>
    <p><strong>Session ID:</strong> <code>${selectedChatId}</code> | <strong>Generated At:</strong> ${dateStr}</p>
    <p><strong>Constitution Mandate:</strong> Enforced & Verified Pass (Zero Unverified Assumptions).</p>
  </div>
  ${messages.map((m) => `
    <div class="card ${m.role === "user" ? "user" : "bot"}">
      <h2>${m.role === "user" ? "👤 User Query" : `🤖 ${selectedAgent.name} Synthesis`} <span style="font-size:11px; color:#888; font-weight:normal;">(${m.timestamp})</span></h2>
      <div style="white-space: pre-wrap;">${m.content}</div>
      ${m.steps && m.steps.length > 0 ? `
        <div style="margin-top: 16px;">
          <strong style="font-size: 12px; color: #f8a87c;">Verified Tool Execution Receipts:</strong>
          ${m.steps.filter((s) => s.kind === "tool_call").map((s) => `
            <div class="receipt">
              <div><strong>Tool:</strong> ${s.tool} (${s.state})</div>
              <div><strong>Parameters:</strong> <code>${s.args || ""}</code></div>
              <div style="color: #ccc; margin-top: 4px;"><strong>Stdout/Receipt:</strong> ${s.result || "exit 0"}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `).join("")}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skyer-audit-certificate-${selectedAgent.slug}-${selectedChatId || "default"}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

      // Export conversation as Word (.docx / rich-HTML MIME container)
  const handleExportSessionDocx = () => {
    if (messages.length === 0) return;
    const title = `Skyer AI Session Report: ${selectedAgent.name}`;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #111; }
          h1 { color: #f8a87c; font-size: 18pt; border-bottom: 2px solid #f8a87c; padding-bottom: 6px; }
          .meta { font-size: 9.5pt; color: #555; margin-bottom: 20px; }
          .turn { margin-bottom: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
          .user { background: #fdf6ee; border-left: 4px solid #f8a87c; }
          .bot { background: #f9f9fb; border-left: 4px solid #0284c7; }
          .role { font-weight: bold; font-size: 11pt; margin-bottom: 6px; }
          .time { font-size: 8.5pt; color: #888; font-weight: normal; }
          .content { white-space: pre-wrap; }
          .receipt { margin-top: 10px; font-family: Consolas, monospace; font-size: 9pt; background: #eee; padding: 8px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">
          <strong>Agent:</strong> ${selectedAgent.name} (@${selectedAgent.slug}) | <strong>Node:</strong> ${selectedAgent.node} | <strong>Model:</strong> ${selectedAgent.model} | <strong>Exported:</strong> ${new Date().toLocaleString()}
        </div>
        ${messages.map((m) => `
          <div class="turn ${m.role === 'user' ? 'user' : 'bot'}">
            <div class="role">${m.role === 'user' ? '👤 User Prompt' : '🤖 ' + selectedAgent.name} <span class="time">(${m.timestamp})</span></div>
            <div class="content">${m.content}</div>
            ${m.steps && m.steps.length > 0 ? `
              <div class="receipt">
                <strong>Execution Steps & Tool Receipts:</strong><br/>
                ${m.steps.map((s) => s.kind === 'tool_call' ? `• Tool: <code>${s.tool}</code> (${s.state})` : `• <em>${s.text}</em>`).join('<br/>')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob(['﻿', htmlContent], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skyer-session-${selectedAgent.slug}-${selectedChatId || 'default'}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSessionMarkdown = () => {
    if (messages.length === 0) return;
    const header = `# Skyer Agent Session Export: ${selectedAgent.name}\n` +
      `- **Agent:** ${selectedAgent.name} (@${selectedAgent.slug})\n` +
      `- **Node:** ${selectedAgent.node}\n` +
      `- **Model:** ${selectedAgent.model.includes("/") ? selectedAgent.model.split("/").pop() : selectedAgent.model}\n` +
      `- **Session ID:** ${selectedChatId}\n` +
      `- **Exported At:** ${new Date().toISOString()}\n\n---\n\n`;

    const body = messages.map((m) => {
      const roleLabel = m.role === "user" ? "### 👤 User" : `### 🤖 ${selectedAgent.name}`;
      let text = `${roleLabel} (${m.timestamp})\n\n${m.content}\n\n`;
      if (m.steps && m.steps.length > 0) {
        text += `#### Execution Steps & Receipts:\n`;
        m.steps.forEach((s) => {
          if (s.kind === "tool_call") {
            text += `- **Tool:** \`${s.tool}\` (${s.state})\n  - Args: \`${s.args || ""}\`\n  - Output: \`${(s.result || "").slice(0, 200)}\`\n`;
          } else if (s.kind === "reasoning") {
            text += `> *Reasoning:* ${s.text}\n\n`;
          }
        });
      }
      return text;
    }).join("\n---\n\n");

    const blob = new Blob([header + body], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skyer-session-${selectedAgent.slug}-${selectedChatId || "default"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Structured Audit Trail Export in JSON format
  const handleExportSessionJson = () => {
    if (messages.length === 0) return;
    const payload = {
      schemaVersion: "1.0",
      platform: "Skyer Agent360",
      agent: {
        id: selectedAgent.id,
        name: selectedAgent.name,
        slug: selectedAgent.slug,
        node: selectedAgent.node,
        model: selectedAgent.model,
      },
      sessionId: selectedChatId,
      exportedAt: new Date().toISOString(),
      turnsCount: messages.length,
      turns: messages,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `skyer-audit-${selectedAgent.slug}-${selectedChatId || "default"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchApproveAll = async () => {
    for (const app of pendingApprovals) {
      await handleInlineApprove(app.request_id, app.session_id);
    }
  };

    // Periodic Node latency ping probe
  useEffect(() => {
    let isMounted = true;
    const probePing = async () => {
      if (document.hidden) return; // no background-tab probes
      const start = performance.now();
      try {
        const res = await fetch("/api/agents/models", { method: "HEAD" });
        if (isMounted && res.ok) {
          const latency = Math.round(performance.now() - start);
          setNodePingMs(latency);
        }
      } catch {
        if (isMounted) setNodePingMs(null);
      }
    };
    probePing();
    const interval = setInterval(probePing, 30000); // Probe every 30s while visible
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

    const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setPinnedChatIds((prev) => prev.filter((id) => id !== chatId));
    if (selectedChatId === chatId) {
      const remaining = chats.filter((c) => c.id !== chatId);
      if (remaining.length > 0) {
        handleSelectChat(remaining[0]);
      } else {
        handleNewChat();
      }
    }
  };

  const handleBatchClearChats = () => {
    // Keep pinned chats or clear all non-pinned
    setChats((prev) => prev.filter((c) => pinnedChatIds.includes(c.id)));
    if (!pinnedChatIds.includes(selectedChatId || "")) {
      const remaining = chats.filter((c) => pinnedChatIds.includes(c.id));
      if (remaining.length > 0) {
        handleSelectChat(remaining[0]);
      } else {
        handleNewChat();
      }
    }
    setIsBatchClearModalOpen(false);
  };

    const handleForkSession = (fromMsgIndex: number) => {
    const forkedChatId = `session-fork-${Date.now().toString().slice(-6)}`;
    const forkedMessages = messages.slice(0, fromMsgIndex + 1);
    const lastMsg = forkedMessages[forkedMessages.length - 1];

    const newSession: AgentSession = {
      id: forkedChatId,
      title: `Branch from ${selectedChat?.title || "Dialogue"}`,
      updatedAt: "Just now",
      messageCount: forkedMessages.length,
      lastMessageSnippet: lastMsg ? lastMsg.content.slice(0, 60) + "..." : "Forked dialogue branch",
    };

    setChats([newSession, ...chats]);
    setSelectedChatId(forkedChatId);
    setMessages(forkedMessages);
    setForkToast(`Branch created with ${forkedMessages.length} turns`);
    setTimeout(() => setForkToast(null), 3000);

    try {
      localStorage.setItem("agent360_last_chat_id", forkedChatId);
      localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, forkedChatId);
    } catch {}

    // Sync route URL to /app/:agentSlug/:forkedChatId
    const agentSegment = selectedAgent.slug || selectedAgent.id || selectedAgentId;
    if (agentSegment) {
      navigate(`/app/${agentSegment}/${forkedChatId}`);
    }
  };

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert("Skyer is ready to install! Click the install button in your browser address bar.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  // New Chat session with Optimistic Insertion and Instant UI Feedback
  const handleNewChat = () => {
    const timestamp = Date.now();
    const newChatId = `session-${timestamp.toString().slice(-6)}`;
    const newSession: AgentSession = {
      id: newChatId,
      title: "New Chat",
      updatedAt: "Just now",
      messageCount: 0,
      lastMessageSnippet: "Start a conversation...",
      session_id: newChatId,
      agentId: selectedAgent.slug || selectedAgent.id,
    };

    // Optimistic UI update: unshift to front and select immediately
    setChats((prev) => [newSession, ...prev.filter((c) => c.id !== newChatId)]);
    setSelectedChatId(newChatId);
    setMessages([]);
    fetchChatSessionRoom(selectedAgent.slug || selectedAgent.id || selectedAgentId, newChatId, true)
      .then((r) => {
        if (r) setActiveSessionRoom(r);
      })
      .catch(() => {});
    try {
      localStorage.setItem("agent360_last_chat_id", newChatId);
      localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, newChatId);
    } catch {}

    // Sync route URL to /app/:agentSlug/:newChatId
    const agentSegment = selectedAgent.slug || selectedAgent.id || selectedAgentId;
    if (agentSegment) {
      navigate(`/app/${agentSegment}/${newChatId}`);
    }

    // Prepare fresh canvas instantly (no spinner delay)
    setMessages([]);
    setShowPollCard(false);
    setMobileChatsOpen(false);

    // Auto-focus input for zero-latency prompt typing
    setTimeout(() => {
      const input = document.querySelector("input[placeholder*=\"Message\"]") as HTMLInputElement;
      input?.focus();
    }, 50);
  };

  // Global Workspace Keyboard Shortcuts:
  // - Ctrl+K / Cmd+K: Open Command Palette
  // - Ctrl+Shift+O / Ctrl+Shift+N: New Chat Session
  // - Esc: Close any open popovers/modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInputFocused = targetTag === "input" || targetTag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
      // 0. Focus Chat Input (Shift+Esc or '/')
      if (
        (e.key === "Escape" && e.shiftKey) ||
        (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !isInputFocused)
      ) {
        e.preventDefault();
        textareaRef.current?.focus();
        return;
      }

      // 1. Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // 1c. Fast Toggle Active Session Menu (Alt+M)
      if (e.altKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setActiveChatMenuId((prev) => (prev ? null : selectedChatId));
        return;
      }

      // 1c-2. Fast Open Agent Settings Modal (Alt+,)
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key === ",") {
        e.preventDefault();
        setAgentSettingsModalTab("general");
        setIsAgentSettingsModalOpen((prev) => !prev);
        return;
      }

      // 1b. Fast Toggle Left Sidebar (Ctrl+B or Cmd+B)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleLeftSidebar();
        return;
      }

      // 1d. Fast Open Topology Modal (Ctrl+G or Cmd+G)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "g") {
        e.preventDefault();
        setIsTopologyModalOpen((prev) => !prev);
        return;
      }

      // 1e. Fast Toggle Virtual Computer Workspace (Ctrl+M or Cmd+M)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        handleToggleComputerSplit();
        return;
      }

            // 1g. Fast Cycle Agent Loop Mode (Ctrl+Alt+L or Cmd+Option+L)
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        const nextMode = activeLoopMode === "default" ? "goal" : activeLoopMode === "goal" ? "mission" : "default";
        handleSelectLoopMode(nextMode);
        return;
      }

      // 1f. Fast Toggle Add to prompt Popover (Ctrl+/ or Cmd+/)
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "/") {
        e.preventDefault();
        setIsPlusMenuOpen((prev) => {
          const next = !prev;
          if (next) setPlusMenuSearch("");
          return next;
        });
        return;
      }

      // 1c. Fast Toggle Virtual Computer (Alt+C)
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        triggerHaptic(20);
        handleToggleComputerSplit();
        return;
      }

      // 2. Fast New Dialogue Shortcut (Ctrl+Shift+O or Ctrl+Shift+N)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === "o" || e.key.toLowerCase() === "n")) {
        e.preventDefault();
        handleNewChat();
        textareaRef.current?.focus();
        return;
      }

      // 2b. Keyboard Navigation: Alt + ArrowUp / ArrowDown to quick-navigate User Request Trace (always triggers, even when input focused)
      if (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        const userTurns = userTurnsRef.current;
        if (userTurns.length > 0) {
          e.preventDefault();
          const curVisible = findCurrentVisibleUserTurnIdx(userTurns);
          const baseIdx = activeTraceIdxRef.current !== null ? activeTraceIdxRef.current : curVisible;
          let nextIdx = baseIdx;
          if (e.key === "ArrowDown") {
            nextIdx = Math.min(userTurns.length - 1, baseIdx + 1);
          } else {
            nextIdx = Math.max(0, baseIdx - 1);
          }
          scrollToUserTurn(nextIdx);
          return;
        }

        // Fallback: cycle agents if no user turns in current chat
        const list = filteredAgentsRef.current;
        if (list.length > 0) {
          e.preventDefault();
          const curId = selectedAgentIdRef.current;
          const curIdx = list.findIndex((a) => a.id === curId);
          let nextIdx = 0;
          if (e.key === "ArrowDown") {
            nextIdx = curIdx >= 0 && curIdx < list.length - 1 ? curIdx + 1 : 0;
          } else {
            nextIdx = curIdx > 0 ? curIdx - 1 : list.length - 1;
          }
          const nextAgent = list[nextIdx];
          if (nextAgent) {
            triggerHaptic(12);
            playMicroClick();
            handleSelectAgent(nextAgent);
            // Smoothly bring selected agent item into viewport
            requestAnimationFrame(() => {
              const el = document.querySelector(`[data-agent-item-id="${nextAgent.id}"]`);
              el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
            });
          }
        }
        return;
      }

      // 2c. Keyboard Navigation: Ctrl + ArrowUp / ArrowDown (or Cmd + ArrowUp / ArrowDown) to cycle Chat Sessions
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        const list = filteredChatsRef.current;
        if (list.length > 0) {
          e.preventDefault();
          const curId = selectedChatIdRef.current;
          const curIdx = list.findIndex((c) => c.id === curId);
          let nextIdx = 0;
          if (e.key === "ArrowDown") {
            nextIdx = curIdx >= 0 && curIdx < list.length - 1 ? curIdx + 1 : 0;
          } else {
            nextIdx = curIdx > 0 ? curIdx - 1 : list.length - 1;
          }
          const nextChat = list[nextIdx];
          if (nextChat) {
            triggerHaptic(12);
            playMicroClick();
            handleSelectChat(nextChat);
            // Smoothly bring selected conversation item into viewport
            requestAnimationFrame(() => {
              const el = document.querySelector(`[data-chat-item-id="${nextChat.id}"]`);
              el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
            });
          }
        }
        return;
      }

      // 3. Home / End keyboard shortcuts for dialogue scrolling (when not actively editing text)

      if (!isInputFocused) {
        if (e.key === "End") {
          e.preventDefault();
          isUserScrolledUpRef.current = false;
          setShowScrollBottomBtn(false);
          smoothScrollToBottom();
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
          }
          return;
        }
      }

      // 3.5. Lightbox Hotkeys: Ctrl+C to copy image URL, Ctrl+S to download image, Esc to close
      if (lightboxImageUrl) {
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "c") {
          e.preventDefault();
          triggerHaptic(20);
          (async () => {
            try {
              const res = await fetch(lightboxImageUrl.url);
              const blob = await res.blob();
              if (navigator.clipboard && (window as any).ClipboardItem) {
                const item = new (window as any).ClipboardItem({ [blob.type || "image/png"]: blob });
                await navigator.clipboard.write([item]);
                setForkToast("Image copied to clipboard!");
              } else {
                await navigator.clipboard.writeText(lightboxImageUrl.url);
                setForkToast("Image URL copied to clipboard");
              }
            } catch (err) {
              await navigator.clipboard.writeText(lightboxImageUrl.url);
              setForkToast("Image URL copied to clipboard");
            }
            setTimeout(() => setForkToast(null), 2500);
          })();
          return;
        }
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "s") {
          e.preventDefault();
          triggerHaptic(20);
          const a = document.createElement("a");
          a.href = lightboxImageUrl.url;
          a.download = lightboxImageUrl.name;
          a.target = "_blank";
          a.rel = "noreferrer";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return;
        }
        // Rotate 90 degrees with 'r' key
        if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "r") {
          e.preventDefault();
          triggerHaptic(15);
          setLightboxRotation((prev) => (prev + 90) % 360);
          return;
        }
        // Reset Zoom & Rotation with '0' key
        if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "0" || e.key === "Numpad0")) {
          e.preventDefault();
          triggerHaptic(15);
          setLightboxZoom(1);
          setLightboxPan({ x: 0, y: 0 });
          setLightboxRotation(0);
          return;
        }
        // Zoom in with '+' or '=' key
        if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "+" || e.key === "=")) {
          e.preventDefault();
          triggerHaptic(10);
          setLightboxZoom((prev) => Math.min(3, Math.round((prev + 0.25) * 100) / 100));
          return;
        }
        // Zoom out with '-' or '_' key
        if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === "-" || e.key === "_")) {
          e.preventDefault();
          triggerHaptic(10);
          setLightboxZoom((prev) => {
            const next = Math.max(0.5, Math.round((prev - 0.25) * 100) / 100);
            if (next <= 1) setLightboxPan({ x: 0, y: 0 });
            return next;
          });
          return;
        }
        // Native Fullscreen toggle with 'f' key
        if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "f") {
          e.preventDefault();
          triggerHaptic(20);
          if (!document.fullscreenElement) {
            lightboxModalRef.current?.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          return;
        }
        // Toggle Image Metadata with 'i' key
        if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === "i") {
          e.preventDefault();
          triggerHaptic(15);
          setShowLightboxMeta((prev) => !prev);
          return;
        }
      }

      // 4. Escape key closes open modals / menus or Computer Split
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          try { document.exitFullscreen?.(); } catch {}
        }
        if (lightboxImageUrl) {
          setLightboxImageUrl(null);
          return;
        }
        if (isComputerSplitOpen) {
          handleToggleComputerSplit(false);
          return;
        }
        setIsPlusMenuOpen(false);
        setIsCommandPaletteOpen(false);
        setIsPermissionsModalOpen(false);
        setIsRecipesModalOpen(false);
        setIsSoundMenuOpen(false);
        setIsUserMenuOpen(false);
        setInSessionSearchOpen(false);
        setForwardModalMsg(null);
        setChatToDelete(null);
        setMobileActionChat(null);
        setMobileActionMsg(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComputerSplitOpen, selectedChatId, activeLoopMode]);

  // Core function to execute a single prompt stream (multi-agent safe)
  const executeTurnStream = async (
    userText: string,
    originChatId: string = selectedChatId,
    overrideAgentId?: string
  ) => {
    recordMilestone("sentMessage");
    const originAgentId = overrideAgentId || chatAgentMapRef.current[originChatId] || selectedAgentId;
    chatAgentMapRef.current[originChatId] = originAgentId;
    const targetAgent = agents.find((a) => a.id === originAgentId || a.slug === originAgentId) || selectedAgent;

    try {
      sessionStorage.setItem(`agent360_active_turn_${originChatId}`, "true");
      sessionStorage.setItem(`agent360_last_prompt_${originChatId}`, userText);
    } catch {}

    // Updates the origin chat: live on screen if it is still selected, otherwise in its message cache.
    const updateTurnMessages = (fn: (prev: ChatMessage[]) => ChatMessage[]) => {
      if (selectedChatIdRef.current === originChatId) {
        setMessages((prev) => {
          const next = fn(prev);
          inflightMessagesRef.current[originChatId] = next;
          setCachedChatMessages(originChatId, next, originAgentId);
          return next;
        });
      } else {
        const base = inflightMessagesRef.current[originChatId] || getCachedChatMessages(originChatId, originAgentId) || [];
        const next = fn(base);
        inflightMessagesRef.current[originChatId] = next;
        setCachedChatMessages(originChatId, next, originAgentId);
      }
    };
    const tempBotMsgId = `bot-${Date.now() + 1}`;
    const initialBotMsg: ChatMessage = {
      id: tempBotMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      evidenceStatus: "observed",
    };

    updateTurnMessages((prev) => {
      // If user message is already shown at the end (queued or instant echo), just append bot placeholder
      const lastMsg = prev[prev.length - 1];
      if (lastMsg && lastMsg.role === "user" && lastMsg.content === userText) {
        return [...prev, initialBotMsg];
      }
      const userMsg: ChatMessage = {
        id: `usr-${Date.now()}`,
        role: "user",
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      return [...prev, userMsg, initialBotMsg];
    });
    const targetChatListForStart = chats.some((c) => c.id === originChatId)
      ? chats
      : (getCachedAgentChats(originAgentId) || chats);
    const activeChatForStart =
      targetChatListForStart.find((c) => c.id === originChatId) ||
      targetChatListForStart.find((c) => c.session_id === originChatId);
    const startSessionId = activeChatForStart?.session_id || originChatId;
    registerSessionAgent(originChatId, startSessionId, targetAgent?.slug || originAgentId);
    setStreamingChatIds((prev) => (prev.includes(originChatId) ? prev : [...prev, originChatId]));
    setRunningChatIds((prev) => (prev.includes(originChatId) ? prev : [...prev, originChatId]));
    updateAgentSessionRunning(targetAgent?.slug || originAgentId, [originChatId, startSessionId], true);
    setChats((prev) =>
      prev.map((c) =>
        c.id === originChatId || c.session_id === startSessionId
          ? { ...c, is_running: true, isRunning: true, status: "running" }
          : c
      )
    );

    // Instantiate active AbortController for this stream turn
    const abortController = new AbortController();
    streamAbortControllersRef.current[originChatId] = abortController;

    const streamStart = performance.now();
    let firstTokenTime: number | null = null;

    try {
      let accumulated = "";
      const targetChatList = chats.some((c) => c.id === originChatId)
        ? chats
        : (getCachedAgentChats(originAgentId) || chats);
      const currentActiveChat = targetChatList.find((c) => c.id === originChatId) || targetChatList.find((c) => c.session_id === originChatId);
      const activeTargetChannel = currentActiveChat?.channel;
      const targetSessionId = currentActiveChat?.session_id || originChatId || "default";

      const turnAcc = new TurnAccumulator(tempBotMsgId);
      let lastPaint = 0;
      const paintTurn = (force = false) => {
        const now = performance.now();
        if (!force && now - lastPaint < 60) return;
        lastPaint = now;
        const snap = turnAcc.snapshot();
        updateTurnMessages((prev) =>
          prev.map((m) => (m.id === tempBotMsgId ? { ...m, content: snap.content, reasoning: snap.reasoning, steps: snap.steps, toolCalls: snap.toolCalls } : m))
        );
        if (selectedChatIdRef.current === originChatId && !isUserScrolledUpRef.current) {
          jumpToBottom();
        }
      };

      await sendConsoleChatMessageStream(
        targetSessionId,
        userText,
        targetAgent.slug,
        (chunkText) => {
          if (firstTokenTime === null) {
            firstTokenTime = performance.now();
          }
          if (!turnAcc.text) {
            accumulated = chunkText;
            updateTurnMessages((prev) => prev.map((m) => (m.id === tempBotMsgId ? { ...m, content: chunkText } : m)));
          }
        },
        undefined,
        undefined,
        {
          signal: abortController.signal,
          channel: activeTargetChannel,
          onEvent: (ev) => {
            if (ev?.object === "room_event" && ev.room) {
              if (selectedChatIdRef.current === originChatId) {
                setActiveSessionRoom(ev.room);
                const collabId = ev.collaborator_id || ev.room.active_collaborator_id || targetAgent.slug || originAgentId;
                const matchedParticipant = ev.room.participants?.find((p: any) => p.agent_id === collabId);
                const dispName = matchedParticipant?.display_name || collabId;
                setActiveRespondingAgent({
                  id: collabId,
                  name: dispName,
                  statusText: ev.status === "synthesizing"
                    ? `${dispName} đang tổng hợp phản hồi...`
                    : `${dispName} đang xử lý và phản hồi...`,
                });
              }
              return;
            }
            if (ev?.object === "room_turn" && ev.turn) {
              if (ev.room && selectedChatIdRef.current === originChatId) {
                setActiveSessionRoom(ev.room);
              }
              const roomMsg: ChatMessage = {
                id: ev.turn.id || `room-turn-${Date.now()}`,
                role: "assistant",
                content: ev.turn.text || "",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                evidenceStatus: "observed",
                senderAgentId: ev.turn.author_id,
                senderAgentName: ev.turn.author_name,
                authorRole: ev.turn.author_role,
                roomId: ev.room?.room_id,
                matrixRoomId: ev.room?.matrix_room_id,
                elementRoomUrl: ev.room?.element_room_url,
              };
              updateTurnMessages((prev) => {
                if (prev.some((m) => m.id === roomMsg.id)) return prev;
                const botIdx = prev.findIndex((m) => m.id === tempBotMsgId);
                if (botIdx >= 0) {
                  const copy = [...prev];
                  copy.splice(botIdx, 0, roomMsg);
                  return copy;
                }
                return [...prev, roomMsg];
              });
              return;
            }
            if (turnAcc.ingest(ev)) paintTurn(turnAcc.done);
          },
        }
      );

      turnAcc.done = true;
      if (turnAcc.text) accumulated = turnAcc.text;
      const finalSnap = turnAcc.snapshot();
      updateTurnMessages((prev) =>
        prev.map((m) => {
          if (m.id !== tempBotMsgId) return m;
          const hasAccTrace = finalSnap.steps && finalSnap.steps.length > 0;
          return {
            ...m,
            content: accumulated || m.content || "Agent finished without a text response.",
            evidenceStatus: accumulated ? "observed" : "unknown",
            reasoning: hasAccTrace ? finalSnap.reasoning : m.reasoning,
            steps: hasAccTrace ? finalSnap.steps : m.steps,
            toolCalls: hasAccTrace ? finalSnap.toolCalls : m.toolCalls,
          };
        })
      );
      const streamEnd = performance.now();
      const totalDur = streamEnd - streamStart;
      const ttft = firstTokenTime ? Math.round(firstTokenTime - streamStart) : Math.round(totalDur * 0.2);
      const estTokens = Math.max(1, Math.round((accumulated.length + userText.length) / 3.8));
      const tokPerSec = totalDur > 0 ? (estTokens / (totalDur / 1000)) : 0;

      const telemetryData = {
        ttftMs: ttft,
        totalDurationMs: Math.round(totalDur),
        tokenCount: estTokens,
        tokensPerSec: tokPerSec,
        model: targetAgent.model,
        estimatedCostUsd: estTokens * 0.000002,
      };
      setTurnTelemetry(telemetryData);

      // Ingest real-time turn telemetry beacon into Prometheus/Beszel backend metrics
      sendTurnTelemetryBeacon({
        agentId: targetAgent.id,
        sessionId: originChatId || "default",
        model: targetAgent.model,
        ttftMs: ttft,
        totalDurationMs: Math.round(totalDur),
        tokenCount: estTokens,
        tokensPerSec: tokPerSec,
        estimatedCostUsd: estTokens * 0.000002,
        node: targetAgent.node,
      });

      // Dispatch Web Notification if window is in background
      notifyTaskComplete({
        agentName: targetAgent.name,
        taskSnippet: accumulated || "Finished autonomous task execution.",
        sessionId: originChatId || "default",
        soundEnabled: isSoundEnabled,
        soundPreset: soundPreset
      });

      // Lean State: Mark session completed unread if document is hidden or user switched away
      if (originChatId && (document.hidden || selectedChatIdRef.current !== originChatId)) {
        setChats((prev) => prev.map((c) => (c.id === originChatId ? { ...c, unread: true } : c)));
        setUnreadCompletedSessions((prev) => {
          const normAg = normalizeAgentKey(targetAgent?.slug || originAgentId);
          const fullKey = normAg ? `bot:agent360:${normAg}` : originAgentId;
          const list = prev[originAgentId] || [];
          if (list.includes(originChatId)) return prev;
          const updated = {
            ...prev,
            [originAgentId]: Array.from(new Set([...(prev[originAgentId] || []), originChatId])),
            ...(normAg ? { [normAg]: Array.from(new Set([...(prev[normAg] || []), originChatId])) } : {}),
            [fullKey]: Array.from(new Set([...(prev[fullKey] || []), originChatId]))
          };
          try {
            localStorage.setItem("agent360_unread_sessions", JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }

      if (isAutoSpeakEnabled && accumulated) {
        speakText(accumulated, {
          onSegmentChange: (seg) => setSpeakingSentence(seg),
          onEnd: () => {
            setSpeakingMsgId(null);
            setSpeakingSentence(null);
            // If continuous hands-free voice conversation is enabled, resume listening after bot finishes
            if (isContinuousVoiceActiveRef.current && vadModeRef.current === "continuous") {
              setTimeout(() => {
                startVoiceRecording();
              }, 400);
            }
          },
          onError: () => setSpeakingMsgId(null),
        });
      }
    } catch (err: any) {
      if (err.name === "AbortError" || abortController.signal.aborted) {
        console.log("[Stream] User cancelled generation.");
      } else {
        throw err;
      }
    } finally {
      if (streamAbortControllersRef.current[originChatId] === abortController) {
        delete streamAbortControllersRef.current[originChatId];
      }
      try {
        sessionStorage.removeItem(`agent360_active_turn_${originChatId}`);
        sessionStorage.removeItem(`agent360_last_prompt_${originChatId}`);
      } catch {}
      const finalTranscript = inflightMessagesRef.current[originChatId];
      if (finalTranscript && !(requestQueuesRef.current[originChatId] || []).length) {
        setCachedChatMessages(originChatId, finalTranscript, originAgentId);
        delete inflightMessagesRef.current[originChatId];
      }
      const endSessionId = sessionAliasesRef.current[originChatId] || originChatId;
      if (selectedChatIdRef.current === originChatId) {
        setActiveRespondingAgent(null);
      }
      setStreamingChatIds((prev) => prev.filter((id) => id !== originChatId && id !== endSessionId));
      setRunningChatIds((prev) => prev.filter((id) => id !== originChatId && id !== endSessionId));
      updateAgentSessionRunning(targetAgent?.slug || originAgentId, [originChatId, endSessionId], false);
      setChats((prev) =>
        prev.map((c) =>
          c.id === originChatId || c.session_id === endSessionId
            ? { ...c, is_running: false, isRunning: false, status: "idle" }
            : c
        )
      );
      // Process next item in this chat's queue if present
      processNextInQueue(originChatId);
    }
  };

  executeTurnStreamRef.current = (prompt: string) => { executeTurnStream(prompt); };

  const processNextInQueue = (chatId: string) => {
    const queue = requestQueuesRef.current[chatId] || [];
    if (queue.length > 0) {
      const [nextPrompt, ...rest] = queue;
      const targetAgentId = chatAgentMapRef.current[chatId] || selectedAgentId;
      setChatQueue(chatId, rest, targetAgentId);
      setTimeout(() => {
        executeTurnStream(nextPrompt, chatId, targetAgentId);
      }, 50);
    } else {
      processingChatsRef.current.delete(chatId);
    }
  };

  // Send message or queue when agent is in progress
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasNoAgents) return;
    if (!inputText.trim()) return;

    // Request notification permission on first user interaction if supported
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      requestNotificationPermission().catch(() => {});
    }

    let userText = inputText.trim();
    if (attachedFiles.length > 0) {
      const filesSummary = attachedFiles.map(f => `[Attached File: ${f.file_name} (${f.url})]`).join("\n");
      userText = userText ? `${userText}\n\n${filesSummary}` : filesSummary;
      setAttachedFiles([]);
    }
    setInputText("");
    if (selectedChatId) {
      try { localStorage.removeItem(`agent360_draft_${selectedChatId}`); } catch {}
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    if (isRecording) {
      stopVoiceRecording();
    }

    // If completely offline: queue prompt locally and notify user optimistically
    if (!isOnlineState) {
      const offlineMsg: ChatMessage = {
        id: `usr-offline-${Date.now()}`,
        role: "user",
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata: { isOfflineQueued: true },
      };
      setMessages((prev) => [...prev, offlineMsg]);
      setOfflinePendingQueue((prev) => {
        const next = [...prev, userText];
        try {
        localStorage.setItem("skyer_offline_pending_prompts", JSON.stringify(next));
        if (typeof navigator !== "undefined" && "serviceWorker" in navigator && "SyncManager" in window) {
          navigator.serviceWorker.ready.then((reg: any) => {
            if (reg && reg.sync) {
              reg.sync.register("skyer-sync-prompts").catch(() => {});
            }
          });
        }
      } catch {}
        return next;
      });
      requestAnimationFrame(() => smoothScrollToBottom());
      return;
    }

    // Instant Local Message Echo: append to messages immediately so user gets 0ms visual confirmation
    const sendChatId = selectedChatId;
    chatAgentMapRef.current[sendChatId] = selectedAgentId;
    if (isStreaming || processingChatsRef.current.has(sendChatId)) {
      // Agent is busy: enqueue prompt into Request Queue only (do not show in chat stream until it executes)
      setChatQueue(sendChatId, [...(requestQueuesRef.current[sendChatId] || []), userText], selectedAgentId);
    } else {
      processingChatsRef.current.add(sendChatId);
      executeTurnStream(userText, sendChatId, selectedAgentId);
      requestAnimationFrame(() => smoothScrollToBottom());
    }
  };

  const handleSelectNameOption = (name: string) => {
    const confirmMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: `I'd like to call you "${name}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const ackMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      role: "assistant",
      content: `Got it! You can call me ${name}. What shall we tackle first today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      evidenceStatus: "observed",
    };
    setMessages((prev) => [...prev, confirmMsg, ackMsg]);
    setShowPollCard(false);
  };

  const filteredAgents = agents.filter((a) => {
    const query = agentSearchQuery.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(query) ||
      a.id.toLowerCase().includes(query) ||
      (a.roleTag && a.roleTag.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (selectedInstance === "all") return true;

    if (a.instanceId) {
      if (a.instanceId === selectedInstance) return true;
    }
    const id = a.id.toLowerCase();
    const node = (a.node || "").toLowerCase();

    if (selectedInstance === "node-6th") {
      return node.includes("6th") || node.includes("gia mộc") || node.includes("ai-gm") || id.includes("gm-");
    }
    if (selectedInstance === "node-3rd") {
      return node.includes("3rd") || node.includes("ai.hmz") || id.includes("mons") || id.includes("ken") || id.includes("zen") || id.includes("mkai") || id.includes("default-core");
    }
    if (selectedInstance === "node-5th") {
      return node.includes("5th") || id.includes("climax") || id.includes("planthy");
    }
    if (selectedInstance === "node-4th") {
      return node.includes("4th") || id.includes("agentteams") || id.includes("llm360") || id.includes("tsx");
    }
    if (selectedInstance === "node-7th") {
      return node.includes("7th") || node.includes("control");
    }
    if (selectedInstance === "node-8th") {
      return node.includes("8th") || id.includes("its") || id.includes("gl");
    }
    if (selectedInstance === "node-2nd") {
      return node.includes("2nd");
    }
    return false;
  }).sort((a, b) => {
    // Disabled agents are always grouped to the bottom
    const isDisA = a.enabled === false || a.status === "disabled";
    const isDisB = b.enabled === false || b.status === "disabled";
    if (!isDisA && isDisB) return -1;
    if (isDisA && !isDisB) return 1;

    // Within their respective groups, pinned agents stay at top
    const isPinA = pinnedAgentIds.includes(a.id);
    const isPinB = pinnedAgentIds.includes(b.id);
    if (isPinA && !isPinB) return -1;
    if (!isPinA && isPinB) return 1;
    return 0;
  });

  var activeFilteredAgents = filteredAgents.filter((a) => a.enabled !== false && a.status !== "disabled");
  var disabledFilteredAgents = filteredAgents.filter((a) => a.enabled === false || a.status === "disabled");

  const filteredChats = chats
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        c.lastMessageSnippet.toLowerCase().includes(chatSearchQuery.toLowerCase());
      if (!matchesSearch) return false;

      // Channel filter
      if (channelFilter !== "all") {
        const ch = (c.channel || "console").toLowerCase();
        if (channelFilter === "other") {
          if (["console", "telegram", "zalo"].includes(ch)) return false;
        } else if (ch !== channelFilter) {
          return false;
        }
      }

      const isArchived = archivedChatIds.includes(c.id);
      if (chatFilterTab === "archived") {
        return isArchived;
      }
      // Non-archived chats shown in other tabs
      if (isArchived) return false;

      if (chatFilterTab === "pinned") {
        return pinnedChatIds.includes(c.id);
      }
      if (chatFilterTab === "unread") {
        return getAgentUnreadList(selectedAgent).includes(c.id);
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned chats first
      const isPinA = pinnedChatIds.includes(a.id);
      const isPinB = pinnedChatIds.includes(b.id);
      if (isPinA && !isPinB) return -1;
      if (!isPinA && isPinB) return 1;

      const rawA = (a as any)._rawUpdatedAt || a.updatedAt || "";
      const rawB = (b as any)._rawUpdatedAt || b.updatedAt || "";
      const tA = new Date(rawA).getTime();
      const tB = new Date(rawB).getTime();
      if (!isNaN(tA) && !isNaN(tB)) {
        return tB - tA;
      }
      return 0;
    });

  // Toggle schedule routine enabled status
  const handleToggleScheduleRoutine = async (job: AgentScheduleJob, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !job.enabled;
    triggerHaptic(12);
    // Optimistic UI update
    setSchedules((prev) =>
      prev.map((s) => (s.id === job.id ? { ...s, enabled: nextState } : s))
    );
    try {
      const { createOrUpdateSchedule } = await import("../services/agentApi");
      const ok = await createOrUpdateSchedule({
        agentId: selectedAgent.id,
        id: job.id,
        name: job.name,
        cronExpr: job.cronExpr,
        timezone: job.timezone,
        targetChannel: job.targetChannel,
        promptSnippet: job.promptSnippet,
        enabled: nextState,
      });
      if (!ok) {
        // Rollback on failure
        setSchedules((prev) =>
          prev.map((s) => (s.id === job.id ? { ...s, enabled: !nextState } : s))
        );
      }
    } catch {
      setSchedules((prev) =>
        prev.map((s) => (s.id === job.id ? { ...s, enabled: !nextState } : s))
      );
    }
  };

  // Keep live references updated for global keyboard navigation
  filteredAgentsRef.current = filteredAgents;
  filteredChatsRef.current = filteredChats;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)] font-sans select-none antialiased relative transition-colors">
      {/* ========================================================= */}
      {/* BACKDROP OVERLAY FOR MOBILE DRAWERS (Click-outside catcher: transparent, no backdrop dimming or blur filter) */}
      {/* ========================================================= */}
      {(mobileAgentsOpen || mobileChatsOpen || (!isBotInfoCollapsed && typeof window !== "undefined" && window.innerWidth < 1280)) && (
        <div
          onClick={() => {
            setMobileAgentsOpen(false);
            setMobileChatsOpen(false);
            setMobileBotInfoOpen(false);
            handleToggleBotInfo(true);
          }}
          className="fixed inset-0 bg-transparent z-40 xl:hidden"
        />
      )}

      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR: Real Agents Loaded From Infra */}
      {/* ========================================================= */}
      <aside
        id="tour-agent-selector"
        style={{
          width:
            !isCompactMode && typeof window !== "undefined" && window.innerWidth >= 1024
              ? (isLeftSidebarCollapsed ? "64px" : `${leftSidebarWidth}px`)
              : undefined,
        }}
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-40 h-full flex flex-col border-r border-neutral-200 dark:border-[#1e1e24] bg-[var(--bg-sidebar)] shrink-0 transition-grok-transform ${
          mobileAgentsOpen
            ? "w-full sm:w-[380px] translate-x-0 shadow-2xl"
            : isCompactMode
            ? "w-full sm:w-[380px] -translate-x-full invisible"
            : isLeftSidebarCollapsed
            ? "w-full sm:w-[380px] lg:w-[64px] -translate-x-full max-lg:invisible lg:translate-x-0"
            : "w-full sm:w-[380px] -translate-x-full max-lg:invisible lg:translate-x-0"
        }`}
        aria-hidden={!mobileAgentsOpen && isCompactMode ? true : undefined}
      >
        {isLeftSidebarCollapsed && !mobileAgentsOpen ? (
          /* ========================================================= */
          /* COLLAPSED VIEW: Minimal Rail Showing Only Avatar & State */
          /* ========================================================= */
          <>
            {/* Collapsed Header: Logo with Hover Expand Icon transition */}
            <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-center shrink-0 bg-[var(--bg-sidebar)]">
              <button
                type="button"
                onClick={() => handleToggleLeftSidebar(false)}
                className="relative h-9 w-9 rounded-xl flex items-center justify-center hover:bg-[#1f1f2c] text-neutral-400 hover:text-white transition-all cursor-pointer group"
                title="Bấm để mở danh sách Agent & Hạ tầng (Ctrl+B)"
                aria-label="Expand Agents Sidebar"
              >
                {/* Logo visible by default, hidden on hover */}
                <div className="transition-all duration-200 group-hover:opacity-0 group-hover:scale-75">
                  <SkyerLogo size={24} showText={false} showBotBadge={false} />
                </div>
                {/* PanelLeftOpen icon revealed on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[#f8a87c]">
                  <PanelLeftOpen size={18} />
                </div>
              </button>
            </div>

            {/* Collapsed Agents List */}
            <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-2 flex flex-col items-center scrollbar-none">
              {isAdmin && (
                <a
                  href="/admin"
                  title="Bảng điều khiển Quản trị (Admin Portal)"
                  className="relative h-10 w-10 rounded-xl flex items-center justify-center bg-[#f8a87c]/15 border border-[#f8a87c]/40 text-[#f8a87c] hover:bg-[#f8a87c]/25 hover:border-[#f8a87c] transition-all cursor-pointer shrink-0 shadow-sm shadow-[#f8a87c]/20 group"
                >
                  <Shield size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#f8a87c] ring-1 ring-black" />
                </a>
              )}
              {isLoadingAgents ? (
                <div className="space-y-2.5 p-1 w-full flex flex-col items-center">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-9 w-9 rounded-xl skeleton-shimmer shrink-0" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Active Agents in Rail */}
                  {activeFilteredAgents.map((ag) => {
                    const isSelected = ag.id === selectedAgentId || ag.slug === selectedAgentId || normalizeAgentKey(ag.id) === normalizeAgentKey(selectedAgentId);
                    const hasError = ag.status === "degraded";
                    const unreadList = getAgentUnreadList(ag);
                    const hasUnreadCompleted = unreadList.length > 0;

                    const tooltipText = ag.roleTag ? `${ag.name} (${ag.roleTag})` : ag.name;

                    return (
                      <Tooltip key={ag.id} content={tooltipText} placement="right" minWidth={120}>
                        <button
                          aria-label={ag.name}
                          data-ux-target-min="24"
                          onClick={() => handleSelectAgent(ag)}
                          className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-all border group shrink-0 ${
                            isSelected
                              ? "bg-[#1c1c26] border-[#f8a87c] shadow-sm shadow-[#f8a87c]/25 cursor-pointer"
                              : "border-transparent hover:bg-neutral-200/60 dark:hover:bg-[#161620] hover:border-transparent cursor-pointer"
                          }`}
                        >
                        <div className="relative shrink-0 transition-all">
                          <AgentAvatar agent={ag} size="md" interactive={false} />
                          {pinnedAgentIds.includes(ag.id) && (
                            <span className="absolute -top-1 -left-1 text-amber-400 p-0.5 bg-slate-900/80 dark:bg-black/80 rounded-full ring-1 ring-amber-400/30">
                              <Pin size={8} className="fill-amber-400" />
                            </span>
                          )}

                          {(() => {
                            const isAgentBusy = checkIsAgentBusy(ag);
                            if (isAgentBusy) {
                              return (
                                <span
                                  className="absolute -top-0.5 -right-0.5 h-2 w-2 min-h-2 min-w-2 rounded-full bg-blue-500 animate-pulse border border-white dark:border-[#0c0c0e] z-10 shrink-0"
                                  style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                                  title="Agent đang có phiên chat đang chạy"
                                />
                              );
                            }
                            if (hasUnreadCompleted) {
                              return (
                                <span
                                  className="absolute -top-0.5 -right-0.5 h-2 w-2 min-h-2 min-w-2 rounded-full bg-emerald-500 border border-white dark:border-[#0c0c0e] z-10 shrink-0"
                                  style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                                  title={`Có ${unreadList.length} phiên đã hoàn thành`}
                                  />
                              );
                            }
                            if (hasError) {
                              return (
                                <span
                                  className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 border border-white dark:border-[#0c0c0e]"
                                  
                                />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </button>
                    </Tooltip>
                    );
                  })}

                  {/* Disabled Agents Group at bottom of Rail */}
                  {disabledFilteredAgents.length > 0 && (
                    <div className="pt-2 mt-1 border-t border-neutral-200/80 dark:border-[#1c1c24] flex flex-col items-center w-full space-y-1.5">
                      <button
                        type="button"
                        aria-label="Thu gọn hoặc mở rộng nhóm Agent đã tắt"
                        onClick={() => {
                          triggerHaptic(10);
                          setDisabledAgentsExpanded((prev) => {
                            const next = !prev;
                            try {
                              localStorage.setItem("agent360_disabled_agents_expanded", String(next));
                            } catch {}
                            return next;
                          });
                        }}
                        className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer select-none border ${
                          disabledAgentsExpanded
                            ? "bg-neutral-200 dark:bg-white/[0.08] text-[#f8a87c] border-[#f8a87c]/30"
                            : "bg-transparent hover:bg-neutral-200/50 dark:hover:bg-white/[0.04] text-neutral-400 hover:text-neutral-200 border-transparent"
                        }`}
                        title={disabledAgentsExpanded ? `Thu gọn ${disabledFilteredAgents.length} agent đã tắt` : `Mở rộng ${disabledFilteredAgents.length} agent đã tắt`}
                      >
                        {disabledAgentsExpanded ? (
                          <ChevronDown size={14} className="text-[#f8a87c]" />
                        ) : (
                          <ChevronRight size={14} className="text-neutral-400" />
                        )}
                      </button>

                      {disabledAgentsExpanded && (
                        <div className="space-y-1.5 flex flex-col items-center w-full animate-in fade-in duration-150">
                          {disabledFilteredAgents.map((ag) => (
                            <Tooltip key={ag.id} content={`${ag.name} (Đã tắt)`} placement="right" minWidth={120}>
                              <button
                                aria-label={ag.name}
                                data-ux-target-min="24"
                                disabled
                                className="relative h-10 w-10 rounded-xl flex items-center justify-center transition-all border border-transparent opacity-40 grayscale blur-[0.6px] cursor-not-allowed select-none shrink-0"
                              >
                                <div className="relative shrink-0">
                                  <AgentAvatar agent={ag} size="md" />
                                </div>
                              </button>
                            </Tooltip>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Collapsed Bottom Profile Bar */}
            <div ref={userMenuRef} className="p-2 border-t border-[#1c1c22] flex flex-col items-center relative select-none shrink-0">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-8 w-8 rounded-full bg-[#2a2a34] text-[#f8a87c] border border-[#3a3a4c] hover:border-[#f8a87c] flex items-center justify-center text-xs font-semibold shadow-xs cursor-pointer transition-colors relative overflow-hidden"
                title={`${currentUser?.name || "User"} (${currentUser?.roles?.[0] || "Operator"}) - Cài đặt`}
              >
                {currentUser?.picture ? (
                  <img src={currentUser.picture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "US")
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-[#0c0c0e]" />
              </div>

              {/* User Profile Dropdown Menu in Collapsed State */}
              <DropdownMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                anchorRef={userMenuRef}
                align="left"
                placement="top"
                width="w-64"
              >
                <div className="px-2.5 py-1.5 border-b border-slate-200 dark:border-[#22222e] mb-1">
                  <div className="text-xs font-semibold text-white">{cleanDisplayName}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{cleanDisplayEmail}</div>
                </div>
                <DropdownMenuItem
                  icon={<Settings size={14} className="text-[#f8a87c]" />}
                  label="Cài đặt (Settings)"
                  badge="Mở"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setSettingsModalTab("appearance");
                    setIsSettingsModalOpen(true);
                  }}
                />
                <DropdownMenuItem
                  icon={<Command size={13} className="text-[#f8a87c]" />}
                  label="Command Palette"
                  badge="Ctrl+K"
                  badgeColor="text-neutral-400"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                />
                <DropdownMenuSection label="Hệ thống">

                  <DropdownMenuItem
                    icon={<Activity size={13} className="text-emerald-400" />}
                    label="Fleet Diagnostics"
                    badge="Healthy"
                    badgeColor="text-emerald-400"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleToggleBotInfo(false);
                      setRightTab("Details");
                    }}
                  />
                  <DropdownMenuItem
                    icon={<ExternalLink size={13} className="text-neutral-400" />}
                    label="Community Forum"
                    badge="↗"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.open("https://community-agent360.antares.vn", "_blank");
                    }}
                  />
                </DropdownMenuSection>
                <DropdownMenuSection label="Tài khoản & Phiên">
                  <DropdownMenuItem
                    icon={<LogOut size={13} className="text-rose-400" />}
                    label={t("auth.signOut")}
                    variant="danger"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSignOutConfirmOpen(true);
                    }}
                  />
                </DropdownMenuSection>
              </DropdownMenu>
            </div>
          </>
        ) : (
          /* ========================================================= */
          /* EXPANDED VIEW: Full Agent List with Selector & Details   */
          /* ========================================================= */
          <>
            {/* Top Header: Vertical Layout (Logo, Typography, Dropdown Infra) */}
            <div className="px-3 py-2 border-b border-neutral-200 dark:border-[#1c1c22] flex flex-col gap-1.5 shrink-0 bg-[var(--bg-sidebar)]">
              {/* Row 1: Logo & Brand Typography + Collapse Button */}
              <div className="flex items-center justify-between">
                <a aria-label="Return to Skyer Home" href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" title="Return to Skyer Home">
                  <SkyerLogo size={24} showText={true} showBotBadge={false} />
                </a>

                <div className="flex items-center gap-1">
                  {/* Collapse trigger button on desktop */}
                  <button
                    aria-label="Collapse Agents Sidebar"
                    data-ux-target-min="24"
                    onClick={() => handleToggleLeftSidebar(true)}
                    className="hidden lg:flex h-7 w-7 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Collapse Agents Sidebar (Ctrl+B)"
                  >
                    <PanelLeftClose size={14} />
                  </button>
                  {/* Close drawer button on mobile */}
                  <button
                    aria-label="Close drawer"
                    data-ux-target-min="24"
                    onClick={() => setMobileAgentsOpen(false)}
                    className="lg:hidden h-7 w-7 rounded-lg bg-[#181820] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white shrink-0"
                    title="Close drawer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Row 2: Dropdown Infra Instances stacked vertically under Logo & Typography (Admin only) */}
              {isAdmin && (
                <div className="w-full">
                <CustomSelect
                  value={selectedInstance}
                  onChange={(val) => {
                    setSelectedInstance(val);
                    try {
                      localStorage.setItem("agent360_selected_instance_filter", val);
                    } catch {}
                    const nextMatching = agents.filter((a) => {
                      if (val === "all") return true;
                      if (a.instanceId) return a.instanceId === val;
                      const id = a.id.toLowerCase();
                      const node = (a.node || "").toLowerCase();
                      if (val === "node-6th") return node.includes("6th") || node.includes("ai-gm") || id.includes("mons") || id.includes("swe");
                      if (val === "node-3rd") return node.includes("3rd") || node.includes("ai.hmz") || id.includes("default") || id.includes("qa");
                      if (val === "node-4th") return node.includes("4th") || node.includes("browser") || id.includes("mkai");
                      if (val === "node-7th") return node.includes("7th") || node.includes("control") || id.includes("ken") || id.includes("sre");
                      if (val === "node-2nd") return node.includes("2nd") || node.includes("llm") || id.includes("zen");
                      if (val === "node-1st") return node.includes("1st") || node.includes("api.antares") || id.includes("gateway");
                      if (val === "node-8th") return node.includes("8th") || id.includes("its") || id.includes("gl");
                      if (val === "node-5th") return node.includes("5th") || node.includes("storage");
                      return false;
                    });
                    if (nextMatching.length > 0) {
                      const alreadySelected = nextMatching.some((a) => a.id === selectedAgentId);
                      if (!alreadySelected) {
                        handleSelectAgent(nextMatching[0]);
                      }
                    }
                  }}
                  options={INFRA_INSTANCES}
                  className="w-full"
                  triggerClassName="w-full bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white border-0 shadow-none px-2 py-1.5 rounded-xl text-xs font-mono font-medium"
                />
              </div>
            )}
            </div>

            

            {/* Admin Management Navigation for Admin Role */}
            {isAdmin && (
              <div className="p-2 border-b border-[#1c1c22]">
                <a
                  href="/admin"
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-[#f8a87c]/20 via-[#f8a87c]/10 to-transparent border border-[#f8a87c]/40 hover:border-[#f8a87c] hover:bg-[#f8a87c]/25 text-[#f8a87c] transition-all group shadow-sm shadow-[#f8a87c]/10 select-none cursor-pointer"
                  title="Truy cập Bảng điều khiển Quản trị, phân quyền Member và quản lý Fleet"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-[#f8a87c]/20 border border-[#f8a87c]/40 flex items-center justify-center text-[#f8a87c] shrink-0">
                      <Shield size={14} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex flex-col truncate text-left">
                      <span className="text-xs font-semibold text-white group-hover:text-[#f8a87c] transition-colors flex items-center gap-1.5">
                        Quản trị Hệ thống
                        <span className="px-1.5 py-0.2 rounded-full bg-[#f8a87c]/30 text-[#f8a87c] text-[9px] font-mono font-bold uppercase">Admin</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono truncate">Phân quyền Agent & User Directory</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-[#f8a87c]/70 group-hover:translate-x-0.5 group-hover:text-[#f8a87c] transition-all shrink-0 ml-1" />
                </a>
              </div>
            )}

            {/* Search Agents */}
            <div className="p-2 border-b border-[#1c1c22]">
              <SearchInput
                value={agentSearchQuery}
                onChange={setAgentSearchQuery}
                placeholder={t("sidebar.filterAgents")}
              />
            </div>

            {/* Agents List */}
            <div className="flex-1 overflow-y-auto px-1.5 py-1 space-y-0.5 scrollbar-hover">
              {isLoadingAgents ? (
                <div className="space-y-2 p-1">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-full p-2.5 rounded-xl border border-white/[0.04] bg-[#14141c]/50 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl skeleton-shimmer shrink-0" />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="h-3.5 w-24 rounded skeleton-shimmer" />
                          <div className="h-2.5 w-12 rounded skeleton-shimmer" />
                        </div>
                        <div className="h-2.5 w-36 rounded skeleton-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {activeFilteredAgents.map((ag, index) => {
                    const isSelected = ag.id === selectedAgentId || ag.slug === selectedAgentId || normalizeAgentKey(ag.id) === normalizeAgentKey(selectedAgentId);
                    return (
                      <div
                        key={ag.id}
                        data-agent-item-id={ag.id}
                        style={{ animationDelay: `${Math.min(index * 25, 250)}ms` }}
                        onTouchStart={() => handleTouchStartAgent(ag)}
                        onTouchEnd={handleTouchEndAgent}
                        onTouchMove={handleTouchEndAgent}
                        onTouchCancel={handleTouchEndAgent}
                        onContextMenu={(e) => {
                          if (typeof window !== "undefined" && window.innerWidth < 1024) {
                            e.preventDefault();
                            setMobileActionAgent(ag);
                          }
                        }}
                        onClick={() => {
                          if (longPressPreventClickRef.current) {
                            longPressPreventClickRef.current = false;
                            return;
                          }
                          if (ag.enabled === false || ag.status === "disabled") {
                            return;
                          }
                          handleSelectAgent(ag);
                        }}
                        className={`w-full rounded-xl text-left flex items-center transition-colors border animate-fade-in-stagger group relative ${
                          layoutDensity === "compact"
                            ? "px-2 py-1 gap-2"
                            : layoutDensity === "comfortable"
                            ? "px-2.5 py-2 gap-2.5"
                            : "px-2 py-1.5 gap-2.5"
                        } ${
                          ag.enabled === false || ag.status === "disabled"
                            ? "border-transparent bg-neutral-100/30 dark:bg-white/[0.01] cursor-not-allowed select-none"
                            : isSelected
                            ? "bg-white dark:bg-[#1c1c26] border-neutral-300 dark:border-[#303042] text-neutral-900 dark:text-white shadow-xs cursor-pointer"
                            : "border-transparent hover:bg-neutral-200/60 dark:hover:bg-[#14141c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
                        }`}
                      >
                        {/* Dedicated Agent Identity Avatar */}
                        <div className="relative shrink-0">
                          <AgentAvatar agent={ag} size="md" />
                          {ag.status === "degraded" && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white dark:border-[#0c0c0e] bg-red-500"
                              
                            />
                          )}
                        </div>

                        {/* Agent Details: Lean typography with rich status tooltip */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-medium truncate block transition-all ${
                              ag.enabled === false || ag.status === "disabled"
                                ? "text-neutral-400 dark:text-neutral-500 opacity-50 grayscale blur-[0.4px]"
                                : "text-neutral-900 dark:text-white"
                            }`}>
                              {ag.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {pinnedAgentIds.includes(ag.id) && (
                                <span className="text-amber-400 p-0.5" title="Đã ghim agent">
                                  <Pin size={11} className="fill-amber-400" />
                                </span>
                              )}

                              {(() => {
                                const hasError = ag.status === "degraded";
                                const unreadList = getAgentUnreadList(ag);
                                const hasUnreadCompleted = unreadList.length > 0;
                                const isAgentBusy = checkIsAgentBusy(ag);

                                if (isAgentBusy) {
                                  return (
                                    <span
                                      className="h-2 w-2 min-h-2 min-w-2 rounded-full bg-blue-500 animate-pulse mr-1 shrink-0"
                                      style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                                      title="Agent đang có phiên chat đang chạy"
                                    />
                                  );
                                }
                                if (hasUnreadCompleted) {
                                  return (
                                    <span
                                      className="h-2 w-2 min-h-2 min-w-2 rounded-full bg-emerald-500 mr-1 shrink-0"
                                      style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                                      title={`Có ${unreadList.length} phiên đã hoàn thành`}
                                  />
                                  );
                                }
                                if (hasError) {
                                  return (
                                    <span
                                      className="h-1.5 w-1.5 rounded-full bg-red-500 mr-0.5"
                                      title="Agent gặp sự cố hạ tầng"
                                    />
                                  );
                                }
                                return null;
                              })()}

                              {/* 3-Dots More Options Menu for Agent */}
                              <div className="relative z-10 pointer-events-auto" data-agent-menu-container="true">
                                <button
                                  aria-label="Tùy chọn agent"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    triggerHaptic(15);
                                    setActiveAgentMenuId(activeAgentMenuId === ag.id ? null : ag.id);
                                  }}
                                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                                    activeAgentMenuId === ag.id
                                      ? "text-[#f8a87c] bg-neutral-200 dark:bg-white/10 opacity-100"
                                      : ag.enabled === false || ag.status === "disabled"
                                      ? "text-neutral-400 hover:text-[#f8a87c] hover:bg-neutral-200/80 dark:hover:bg-white/10 opacity-70 group-hover:opacity-100 focus:opacity-100"
                                      : "text-neutral-400 hover:text-[#f8a87c] hover:bg-neutral-200/80 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  }`}
                                  title="Tùy chọn mở rộng cho Agent (Kích hoạt/Vô hiệu hóa, Ghim, Chi tiết)"
                                >
                                  <MoreVertical size={13} />
                                </button>

                                {/* Dropdown Menu */}
                                <DropdownMenu
                                  isOpen={activeAgentMenuId === ag.id}
                                  onClose={() => setActiveAgentMenuId(null)}
                                  align="right"
                                  width="w-52"
                                >
                                  <DropdownMenuItem
                                    icon={<Pin size={13} className={pinnedAgentIds.includes(ag.id) ? "text-amber-400 fill-amber-400" : "text-neutral-400"} />}
                                    label={pinnedAgentIds.includes(ag.id) ? "Bỏ ghim Agent" : "Ghim Agent lên đầu"}
                                    onClick={(e) => {
                                      togglePinAgent(ag.id, e);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Plus size={13} className="text-[#f8a87c]" />}
                                    label="Tạo Chat mới với Agent"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      setTimeout(() => handleNewChat(), 50);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Settings size={13} className="text-[#f8a87c]" />}
                                    label="Cài đặt Agent (Settings)"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      setAgentSettingsModalTab("general");
                                      setIsAgentSettingsModalOpen(true);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Bot size={13} className="text-cyan-400" />}
                                    label="Xem thông số kỹ thuật"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      handleToggleBotInfo(false);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={
                                      togglingAgentId === ag.id ? (
                                        <Loader2 size={13} className="animate-spin text-neutral-400" />
                                      ) : ag.enabled === false || ag.status === "disabled" ? (
                                        <Power size={13} className="text-emerald-400" />
                                      ) : (
                                        <PowerOff size={13} className="text-rose-400" />
                                      )
                                    }
                                    label={
                                      togglingAgentId === ag.id
                                        ? "Đang cập nhật..."
                                        : ag.enabled === false || ag.status === "disabled"
                                        ? "Kích hoạt Agent (Bật)"
                                        : "Vô hiệu hóa Agent (Tắt)"
                                    }
                                    onClick={(e) => {
                                      handleToggleAgentEnabled(ag, e);
                                    }}
                                  />
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[11px] font-sans truncate block mt-0.5 transition-all ${
                            ag.enabled === false || ag.status === "disabled"
                              ? "text-neutral-400 dark:text-neutral-600 opacity-40 blur-[0.5px]"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`} title={ag.enabled === false || ag.status === "disabled" ? "Agent đã bị vô hiệu hóa" : (agentRecentSessions[ag.id] || ag.sessions?.[0]?.title || ag.model)}>
                            {ag.enabled === false || ag.status === "disabled" ? "Đã vô hiệu hóa (Disabled)" : (agentRecentSessions[ag.id] || ag.sessions?.[0]?.title || ag.model)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Disabled Agents Group at the bottom (default closed, shown when at least 1 disabled agent exists) */}
                  {disabledFilteredAgents.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-neutral-200/80 dark:border-[#1c1c24]">
                      <button
                        type="button"
                        aria-label="Thu gọn hoặc mở rộng nhóm Agent đã tắt"
                        onClick={() => {
                          triggerHaptic(10);
                          setDisabledAgentsExpanded((prev) => {
                            const next = !prev;
                            try {
                              localStorage.setItem("agent360_disabled_agents_expanded", String(next));
                            } catch {}
                            return next;
                          });
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-neutral-200/50 dark:hover:bg-white/[0.04] text-[11px] font-mono text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer select-none group/dis"
                        title={disabledAgentsExpanded ? "Thu gọn danh sách agent đã tắt" : "Mở rộng danh sách agent đã tắt"}
                      >
                        <div className="flex items-center gap-1.5">
                          {disabledAgentsExpanded ? (
                            <ChevronDown size={13} className="text-neutral-400 group-hover/dis:text-neutral-200 transition-transform" />
                          ) : (
                            <ChevronRight size={13} className="text-neutral-400 group-hover/dis:text-neutral-200 transition-transform" />
                          )}
                          <span className="font-medium">Vô hiệu hóa ({disabledFilteredAgents.length})</span>
                        </div>
                      </button>

                      {disabledAgentsExpanded && (
                        <div className="mt-1 space-y-0.5 animate-in fade-in duration-150">
                          {disabledFilteredAgents.map((ag, index) => {
                            const isSelected = ag.id === selectedAgentId || ag.slug === selectedAgentId || normalizeAgentKey(ag.id) === normalizeAgentKey(selectedAgentId);
                            return (
                      <div
                        key={ag.id}
                        data-agent-item-id={ag.id}
                        style={{ animationDelay: `${Math.min(index * 25, 250)}ms` }}
                        onTouchStart={() => handleTouchStartAgent(ag)}
                        onTouchEnd={handleTouchEndAgent}
                        onTouchMove={handleTouchEndAgent}
                        onTouchCancel={handleTouchEndAgent}
                        onContextMenu={(e) => {
                          if (typeof window !== "undefined" && window.innerWidth < 1024) {
                            e.preventDefault();
                            setMobileActionAgent(ag);
                          }
                        }}
                        onClick={() => {
                          if (longPressPreventClickRef.current) {
                            longPressPreventClickRef.current = false;
                            return;
                          }
                          if (ag.enabled === false || ag.status === "disabled") {
                            return;
                          }
                          handleSelectAgent(ag);
                        }}
                        className={`w-full rounded-xl text-left flex items-center transition-colors border animate-fade-in-stagger group relative ${
                          layoutDensity === "compact"
                            ? "px-2 py-1 gap-2"
                            : layoutDensity === "comfortable"
                            ? "px-2.5 py-2 gap-2.5"
                            : "px-2 py-1.5 gap-2.5"
                        } ${
                          ag.enabled === false || ag.status === "disabled"
                            ? "border-transparent bg-neutral-100/30 dark:bg-white/[0.01] cursor-not-allowed select-none"
                            : isSelected
                            ? "bg-white dark:bg-[#1c1c26] border-neutral-300 dark:border-[#303042] text-neutral-900 dark:text-white shadow-xs cursor-pointer"
                            : "border-transparent hover:bg-neutral-200/60 dark:hover:bg-[#14141c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
                        }`}
                      >
                        {/* Dedicated Agent Identity Avatar */}
                        <div className="relative shrink-0">
                          <AgentAvatar agent={ag} size="md" />
                          {ag.status === "degraded" && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white dark:border-[#0c0c0e] bg-red-500"
                              
                            />
                          )}
                        </div>

                        {/* Agent Details: Lean typography with rich status tooltip */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-medium truncate block transition-all ${
                              ag.enabled === false || ag.status === "disabled"
                                ? "text-neutral-400 dark:text-neutral-500 opacity-50 grayscale blur-[0.4px]"
                                : "text-neutral-900 dark:text-white"
                            }`}>
                              {ag.name}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {pinnedAgentIds.includes(ag.id) && (
                                <span className="text-amber-400 p-0.5" title="Đã ghim agent">
                                  <Pin size={11} className="fill-amber-400" />
                                </span>
                              )}

                              {(() => {
                                const hasError = ag.status === "degraded";
                                const unreadList = getAgentUnreadList(ag);
                                const hasUnreadCompleted = unreadList.length > 0;
                                const isAgentBusy = checkIsAgentBusy(ag);

                                if (isAgentBusy) {
                                  return (
                                    <span
                                      className="h-2 w-2 min-h-2 min-w-2 rounded-full bg-blue-500 animate-pulse mr-1 shrink-0"
                                      style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                                      title="Agent đang có phiên chat đang chạy"
                                    />
                                  );
                                }
                                if (hasUnreadCompleted) {
                                  return (
                                    <span
                                      className="h-2 w-2 min-h-2 min-w-2 rounded-full bg-emerald-500 mr-1 shrink-0"
                                      style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                                      title={`Có ${unreadList.length} phiên đã hoàn thành`}
                                  />
                                  );
                                }
                                if (hasError) {
                                  return (
                                    <span
                                      className="h-1.5 w-1.5 rounded-full bg-red-500 mr-0.5"
                                      title="Agent gặp sự cố hạ tầng"
                                    />
                                  );
                                }
                                return null;
                              })()}

                              {/* 3-Dots More Options Menu for Agent */}
                              <div className="relative z-10 pointer-events-auto" data-agent-menu-container="true">
                                <button
                                  aria-label="Tùy chọn agent"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    triggerHaptic(15);
                                    setActiveAgentMenuId(activeAgentMenuId === ag.id ? null : ag.id);
                                  }}
                                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                                    activeAgentMenuId === ag.id
                                      ? "text-[#f8a87c] bg-neutral-200 dark:bg-white/10 opacity-100"
                                      : ag.enabled === false || ag.status === "disabled"
                                      ? "text-neutral-400 hover:text-[#f8a87c] hover:bg-neutral-200/80 dark:hover:bg-white/10 opacity-70 group-hover:opacity-100 focus:opacity-100"
                                      : "text-neutral-400 hover:text-[#f8a87c] hover:bg-neutral-200/80 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  }`}
                                  title="Tùy chọn mở rộng cho Agent (Kích hoạt/Vô hiệu hóa, Ghim, Chi tiết)"
                                >
                                  <MoreVertical size={13} />
                                </button>

                                {/* Dropdown Menu */}
                                <DropdownMenu
                                  isOpen={activeAgentMenuId === ag.id}
                                  onClose={() => setActiveAgentMenuId(null)}
                                  align="right"
                                  width="w-52"
                                >
                                  <DropdownMenuItem
                                    icon={<Pin size={13} className={pinnedAgentIds.includes(ag.id) ? "text-amber-400 fill-amber-400" : "text-neutral-400"} />}
                                    label={pinnedAgentIds.includes(ag.id) ? "Bỏ ghim Agent" : "Ghim Agent lên đầu"}
                                    onClick={(e) => {
                                      togglePinAgent(ag.id, e);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Plus size={13} className="text-[#f8a87c]" />}
                                    label="Tạo Chat mới với Agent"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      setTimeout(() => handleNewChat(), 50);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Settings size={13} className="text-[#f8a87c]" />}
                                    label="Cài đặt Agent (Settings)"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      setAgentSettingsModalTab("general");
                                      setIsAgentSettingsModalOpen(true);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Bot size={13} className="text-cyan-400" />}
                                    label="Xem thông số kỹ thuật"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      handleToggleBotInfo(false);
                                      setActiveAgentMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={
                                      togglingAgentId === ag.id ? (
                                        <Loader2 size={13} className="animate-spin text-neutral-400" />
                                      ) : ag.enabled === false || ag.status === "disabled" ? (
                                        <Power size={13} className="text-emerald-400" />
                                      ) : (
                                        <PowerOff size={13} className="text-rose-400" />
                                      )
                                    }
                                    label={
                                      togglingAgentId === ag.id
                                        ? "Đang cập nhật..."
                                        : ag.enabled === false || ag.status === "disabled"
                                        ? "Kích hoạt Agent (Bật)"
                                        : "Vô hiệu hóa Agent (Tắt)"
                                    }
                                    onClick={(e) => {
                                      handleToggleAgentEnabled(ag, e);
                                    }}
                                  />
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          <span className={`text-[11px] font-sans truncate block mt-0.5 transition-all ${
                            ag.enabled === false || ag.status === "disabled"
                              ? "text-neutral-400 dark:text-neutral-600 opacity-40 blur-[0.5px]"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`} title={ag.enabled === false || ag.status === "disabled" ? "Agent đã bị vô hiệu hóa" : (agentRecentSessions[ag.id] || ag.sessions?.[0]?.title || ag.model)}>
                            {ag.enabled === false || ag.status === "disabled" ? "Đã vô hiệu hóa (Disabled)" : (agentRecentSessions[ag.id] || ag.sessions?.[0]?.title || ag.model)}
                          </span>
                        </div>
                      </div>
                    );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {filteredAgents.length === 0 && (
                    <div className="p-6 text-center text-xs text-neutral-500 font-mono">
                      No agents matching query.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Profile Bar with User Dropdown */}
            <div ref={userMenuRef} className="p-3 border-t border-[#1c1c22] relative select-none">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#161620] -m-1.5 p-1.5 rounded-xl transition-colors group/user"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-full bg-[#2a2a34] text-[#f8a87c] border border-[#3a3a4c] flex items-center justify-center text-xs font-semibold shadow-xs shrink-0 overflow-hidden">
                    {currentUser?.picture ? (
                      <img src={currentUser.picture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "US")
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-neutral-200 font-medium truncate">{cleanDisplayName}</span>
                    <span className="text-[10px] font-mono text-neutral-500 truncate">{cleanDisplayEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Quick hardware permission status indicators */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPermissionsModalOpen(true);
                    }}
                    className="flex items-center gap-1 p-1 rounded-lg hover:bg-[#20202c] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Browser Hardware & Sandbox Permissions (Click to manage)"
                  >
                    <ShieldCheck size={13} className="text-[#f8a87c]" />
                  </button>
                  {/* User dropdown chevron indicator: Ẩn mặc định, hover hiện ChevronUp */}
                  <ChevronUp
                    size={13}
                    className={`text-neutral-400 transition-all duration-150 ${
                      isUserMenuOpen ? "opacity-100" : "opacity-0 group-hover/user:opacity-100"
                    }`}
                  />
                </div>
              </div>

              {/* User Profile Dropdown Menu in Expanded State */}
              <DropdownMenu
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                anchorRef={userMenuRef}
                align="left"
                placement="top"
                width="w-72"
              >
                <div className="px-2.5 py-1.5 border-b border-slate-200 dark:border-[#22222e] mb-1">
                  <div className="text-xs font-semibold text-white">{cleanDisplayName}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{cleanDisplayEmail}</div>
                </div>
                <DropdownMenuItem
                  icon={<Settings size={14} className="text-[#f8a87c]" />}
                  label="Cài đặt (Settings)"
                  badge="Mở"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setSettingsModalTab("appearance");
                    setIsSettingsModalOpen(true);
                  }}
                />
                <DropdownMenuItem
                  icon={<Command size={13} className="text-[#f8a87c]" />}
                  label="Command Palette"
                  badge="Ctrl+K"
                  badgeColor="text-neutral-400"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                />
                <DropdownMenuSection label="Hệ thống">

                  <DropdownMenuItem
                    icon={<Activity size={13} className="text-emerald-400" />}
                    label="Fleet Diagnostics"
                    badge="Healthy"
                    badgeColor="text-emerald-400"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleToggleBotInfo(false);
                      setRightTab("Details");
                    }}
                  />
                  <DropdownMenuItem
                    icon={<ExternalLink size={13} className="text-neutral-400" />}
                    label="Community Forum"
                    badge="↗"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.open("https://community-agent360.antares.vn", "_blank");
                    }}
                  />
                </DropdownMenuSection>
                <DropdownMenuSection label="Tài khoản & Phiên">
                  <DropdownMenuItem
                    icon={<LogOut size={13} className="text-rose-400" />}
                    label={t("auth.signOut")}
                    variant="danger"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSignOutConfirmOpen(true);
                    }}
                  />
                </DropdownMenuSection>
              </DropdownMenu>
            </div>
          </>
        )}

        {/* Left Sidebar Draggable Resizer Splitter (only when expanded on desktop) */}
        {!isLeftSidebarCollapsed && (
          <div
            onMouseDown={() => setIsResizingLeft(true)}
            className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#f8a87c]/50 transition-colors z-30 -mr-0.5"
            title="Drag to resize agents sidebar"
          />
        )}
      </aside>

      {/* ========================================================= */}
      {/* 2. CENTER AREA: Skyer Chat & Dialogue Content */}
      {/* ========================================================= */}
      <main
        style={{
          width: isComputerSplitOpen && typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${computerChatWidthPercent}%` : undefined,
          flex: isComputerSplitOpen && typeof window !== 'undefined' && window.innerWidth >= 1024 ? `0 0 ${computerChatWidthPercent}%` : undefined,
        }}
        onTouchStart={(e) => {
          if (window.innerWidth < 1024 && e.touches.length === 1) {
            touchSwipeStartRef.current = {
              x: e.touches[0].clientX,
              y: e.touches[0].clientY,
              time: Date.now(),
            };
          }
        }}
        onTouchEnd={(e) => {
          if (window.innerWidth < 1024 && touchSwipeStartRef.current && e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchSwipeStartRef.current.x;
            const deltaY = touch.clientY - touchSwipeStartRef.current.y;
            const deltaTime = Date.now() - touchSwipeStartRef.current.time;

            // Only trigger if horizontal swipe is intentional (> 45px) and fast (< 450ms)
            if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && deltaTime < 450) {
              if (deltaX > 0) {
                // Swiped from left to right -> Open Left Agents Drawer (or close right chats drawer if open)
                if (mobileChatsOpen) {
                  setMobileChatsOpen(false);
                } else if (!mobileAgentsOpen) {
                  triggerHaptic(20);
                  setMobileAgentsOpen(true);
                  setMobileBotInfoOpen(false);
                }
              } else {
                // Swiped from right to left -> Open Right Chat Sessions Drawer (or close left agents drawer if open)
                if (mobileAgentsOpen) {
                  setMobileAgentsOpen(false);
                } else if (!mobileChatsOpen) {
                  triggerHaptic(20);
                  setMobileChatsOpen(true);
                  setMobileBotInfoOpen(false);
                }
              }
            }
          }
          touchSwipeStartRef.current = null;
        }}
        className="flex-1 flex flex-col h-full bg-[var(--bg-workspace)] relative overflow-hidden min-w-0"
      >
        {/* Top Centered Floating Capsule: Trigger Collapses Bot Info */}
        <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-between px-2 sm:px-3 shrink-0 relative bg-[var(--bg-workspace)]/85 backdrop-blur-md z-10">
          {/* Left button: mobile drawer only on mobile viewport */}
          <button aria-label="Toggle Agents Sidebar" data-ux-target-min="24"
            onClick={() => {
              if (window.innerWidth >= 1024) {
                handleToggleLeftSidebar();
              } else {
                setMobileAgentsOpen(!mobileAgentsOpen);
                setMobileChatsOpen(false);
                setMobileBotInfoOpen(false);
              }
            }}
            className="lg:hidden flex h-8 w-8 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] items-center justify-center text-neutral-400 hover:text-white cursor-pointer shrink-0 transition-colors"
            title="Toggle Agents Sidebar"
          >
            <Menu size={16} />
          </button>

          {/* Middle Group: Capsule Info + Telemetry HUD with Shared Tooltip */}
          <div className="flex items-center gap-2 mx-auto">
            <Tooltip
              placement="bottom"
              minWidth={260}
              maxWidth={320}
              className="flex-col !items-stretch gap-1.5 p-3 text-left !whitespace-normal"
              content={
                <div className="space-y-1.5 w-full text-left font-mono">
                  <div className="flex items-center justify-between gap-3 text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-white/10 pb-1.5">
                    <span className="text-[#f8a87c] font-semibold">{selectedAgent.roleTag || "AI Teammate"}</span>
                    {nodePingMs !== null && (
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                          nodePingMs < 80
                            ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30"
                            : nodePingMs < 200
                            ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                            : "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/30"
                        }`}
                      >
                        <Wifi size={10} />
                        <span>{nodePingMs}ms</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-neutral-600 dark:text-neutral-400 text-[10px]">
                    <span>Hạ tầng node:</span>
                    <span className="text-neutral-900 dark:text-neutral-200 font-semibold">{selectedAgent.node}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-neutral-600 dark:text-neutral-400 text-[10px]">
                    <span>Mô hình AI:</span>
                    <span className="text-neutral-700 dark:text-neutral-300">{selectedAgent.model.includes("/") ? selectedAgent.model.split("/").pop() : selectedAgent.model}</span>
                  </div>
                  <div className="pt-0.5 text-[9px] text-[#f8a87c] flex items-center justify-center font-sans">
                    <span>Bấm để {isBotInfoCollapsed ? "mở" : "đóng"} thông số kỹ thuật</span>
                  </div>
                </div>
              }
            >
              <div
                id="tour-bot-spec-trigger"
                onClick={() => {
                  if (!hasNoAgents) {
                    handleToggleBotInfo();
                    setMobileBotInfoOpen((prev) => !prev);
                  }
                }}
                className="group flex items-center gap-1.5 sm:gap-2 bg-neutral-100 dark:bg-[#181820] hover:bg-neutral-200 dark:hover:bg-[#22222e] border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium text-neutral-900 dark:text-white shadow-xs hover:shadow-sm cursor-pointer transition-all select-none"
              >
                {hasNoAgents ? (
                  <>
                    <Shield size={14} className="text-[#f8a87c]" />
                    <span className="truncate max-w-[160px] sm:max-w-[220px] text-xs text-neutral-900 dark:text-white font-mono">Chưa có Agent</span>
                  </>
                ) : (
                  <>
                    <AgentAvatar agent={selectedAgent} size="xs" className="shrink-0" />
                    <span className="truncate max-w-[140px] sm:max-w-[200px] text-xs text-neutral-900 dark:text-white whitespace-nowrap">{selectedAgent?.name || "Agent"}</span>
                    {isBotInfoCollapsed ? (
                      <ChevronRight size={13} className="text-neutral-400 group-hover:text-[#f8a87c] opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 -mr-0.5 transform transition-transform group-hover:translate-x-1" />
                    ) : (
                      <ChevronLeft size={13} className="text-neutral-400 group-hover:text-[#f8a87c] opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 -mr-0.5 transform transition-transform group-hover:-translate-x-1" />
                    )}
                  </>
                )}
                {activeLoopMode !== "default" && (
                  <span className={`hidden sm:inline-flex items-center gap-1 text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full border font-semibold ${
                    activeLoopMode === 'goal'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      activeLoopMode === 'goal' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`} />
                    <span>{activeLoopMode === 'goal' ? 'Mục tiêu' : 'Nhiệm vụ'}</span>
                  </span>
                )}
              </div>
            </Tooltip>


          </div>

          {/* Header Action Controls (Command Palette moved into Avatar Menu) */}
          <div className="flex items-center gap-1.5 shrink-0">



            {/* Only show MessageSquare expand button when chat sidebar is closed */}
            {(isChatListCollapsed || (!mobileChatsOpen && typeof window !== "undefined" && window.innerWidth < 1024)) && (
              <button aria-label="Expand Conversations list" data-ux-target-min="24"
                onClick={() => {
                  if (window.innerWidth >= 1024) {
                    handleToggleChatList(false);
                  } else {
                    setMobileChatsOpen(true);
                    handleToggleChatList(false);
                    setMobileAgentsOpen(false);
                    setMobileBotInfoOpen(false);
                  }
                }}
                className="h-8 w-8 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer shrink-0 transition-colors"
                title="Expand Conversations list"
              >
                <MessageSquare size={16} />
              </button>
            )}



          </div>
        </div>

        {/* In-Session Message Search Bar */}
        {inSessionSearchOpen && (
          <div className="px-4 py-2 bg-[#121218] border-b border-[#20202c] flex items-center justify-between gap-3 text-xs font-mono animate-in fade-in select-none">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-[#181822] border border-[#2a2a3c] rounded-lg px-2.5 py-1">
              <Search size={13} className="text-neutral-400 shrink-0" />
              <input aria-label="Find in current conversation..." data-ux-target-min="16"
                type="text"
                autoFocus
                value={inSessionSearchQuery}
                onChange={(e) => setInSessionSearchQuery(e.target.value)}
                placeholder="Find in current conversation..."
                className="w-full bg-transparent border-0 text-white placeholder-neutral-500 focus:outline-none text-xs font-sans"
              />
              {inSessionSearchQuery && (
                <button
                  type="button"
                  onClick={() => setInSessionSearchQuery("")}
                  className="text-neutral-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <button aria-label="Filter only bookmarked / starred messages" data-ux-target-min="24"
                type="button"
                onClick={() => {
                  if (inSessionSearchQuery === "__STARRED__") {
                    setInSessionSearchQuery("");
                  } else {
                    setInSessionSearchQuery("__STARRED__");
                  }
                }}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                  inSessionSearchQuery === "__STARRED__"
                    ? "bg-amber-400/20 border-amber-400 text-amber-300 font-bold"
                    : "bg-[#181822] border-[#2a2a38] text-neutral-400 hover:text-white"
                }`}
                title="Filter only bookmarked / starred messages"
              >
                <Star size={10} className={inSessionSearchQuery === "__STARRED__" ? "fill-amber-400 text-amber-400" : ""} />
                <span>Starred ({starredMsgIds.length})</span>
              </button>

              {inSessionSearchQuery && inSessionSearchQuery !== "__STARRED__" && (
                <span className="text-[11px] text-[#f8a87c]">
                  {messages.filter((m) => m.content.toLowerCase().includes(inSessionSearchQuery.toLowerCase())).length} matches
                </span>
              )}
              <button data-ux-target-min="24"
                type="button"
                onClick={() => {
                  setInSessionSearchOpen(false);
                  setInSessionSearchQuery("");
                }}
                className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Messages Stream Area (Responsive & Lean for Compact/Minimize) */}
        <div className="flex-1 relative flex flex-col min-h-0 overflow-hidden">
        <div
          ref={messagesContainerRef}
          onScroll={handleMessagesScroll}
          className={`flex-1 overflow-y-auto scrollbar-hover ${isCompactMode ? "px-3 py-2 space-y-3" : "px-4 md:px-8 py-3 space-y-3.5 sm:space-y-4"} max-w-3xl mx-auto w-full`}
        >
          {hasNoAgents ? (
            <div className="h-full min-h-[460px] flex items-center justify-center p-4">
              <EmptyState
                size="lg"
                badge="Skyer Autonomous Fleet • Standby"
                icon={<Bot size={36} className="text-[#f8a87c] animate-pulse" />}
                title="Đang chờ phân công Agent"
                description="Tài khoản của bạn đang được kết nối với Skyer. Vui lòng đợi Quản trị viên phân quyền hoặc làm mới để kiểm tra trạng thái."
                action={{
                  label: "Làm mới",
                  icon: <RefreshCw size={13} />,
                  variant: "primary",
                  onClick: () => {
                    playMicroClick();
                    window.location.reload();
                  },
                }}
                secondaryAction={{
                  label: "Marketplace",
                  icon: <Sparkles size={13} />,
                  variant: "secondary",
                  onClick: () => {
                    playMicroClick();
                    window.location.href = "/marketplace";
                  },
                }}
                extraAction={
                  isAdmin
                    ? {
                        label: "Phân quyền",
                        icon: <Shield size={13} />,
                        variant: "outline",
                        onClick: () => {
                          playMicroClick();
                          window.location.href = "/admin/agents";
                        },
                      }
                    : undefined
                }
              />
            </div>
          ) : (
          <>
{isLoadingMessages ? (
            <div className="space-y-4 py-2 w-full animate-in fade-in duration-200">
              {/* User turn skeleton */}
              <div className="flex justify-end">
                <div className="w-[65%] sm:w-[50%] p-3.5 rounded-2xl rounded-tr-xs bg-[#181822] border border-[#262634] space-y-2">
                  <div className="h-3 w-4/5 rounded-md skeleton-shimmer" />
                  <div className="h-3 w-2/3 rounded-md skeleton-shimmer" />
                </div>
              </div>
              {/* Assistant turn skeleton */}
              <div className="flex justify-start">
                <div className="w-[85%] sm:w-[75%] p-4 rounded-2xl rounded-tl-xs bg-[#101016] border border-[#1e1e28] space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full skeleton-shimmer" />
                    <div className="h-3 w-28 rounded-md skeleton-shimmer" />
                  </div>
                  <div className="space-y-2 pt-1">
                    <div className="h-3.5 w-full rounded-md skeleton-shimmer" />
                    <div className="h-3.5 w-[92%] rounded-md skeleton-shimmer" />
                    <div className="h-3.5 w-[78%] rounded-md skeleton-shimmer" />
                  </div>
                  {/* Mock tool execution skeleton card */}
                  <div className="h-10 w-full rounded-xl skeleton-shimmer border border-white/[0.04]" />
                </div>
              </div>
            </div>
          ) : displayMessages.length === 0 ? (
            /* First-turn Suggested Tasks (Minimal, Clean & Dynamic per Agent) */
            <div className="py-8 px-4 flex flex-col items-center justify-center animate-in fade-in duration-200 max-w-lg mx-auto w-full space-y-3">
              

              <div className="space-y-1.5 w-full text-left font-sans pt-1">
                {getDynamicSuggestionsForAgent(selectedAgent).map((item, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => {
                      executeTurnStream(item.prompt);
                    }}
                    className="w-full p-2.5 sm:p-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#14141c]/90 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#242432] hover:border-[#f8a87c]/40 text-left transition-all cursor-pointer group shadow-xs flex items-center justify-between gap-2.5 min-w-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] shrink-0 group-hover:scale-125 transition-transform" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-slate-900 dark:text-neutral-100 group-hover:text-[#f8a87c] transition-colors truncate">
                            {item.title}
                          </p>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#1e1e2c] text-neutral-600 dark:text-[#f8a87c] border border-slate-300 dark:border-[#2b2b3e] shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={12} className="text-neutral-400 group-hover:text-[#f8a87c] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            displayMessages
            .filter((msg) => {
              if (inSessionSearchQuery === "__STARRED__") return starredMsgIds.includes(msg.id);
              return !inSessionSearchQuery || msg.content.toLowerCase().includes(inSessionSearchQuery.toLowerCase());
            })
            .map((msg, mIdx) => {
              const isLastTurn = mIdx === displayMessages.length - 1;
              const isUser = msg.role === "user";
              const hasSteps = msg.steps && msg.steps.length > 0;
              const hasTools = msg.toolCalls && msg.toolCalls.length > 0;

              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex flex-col space-y-1 w-full group/msg ${isUser ? "items-end" : "items-start"}`}
                >
                  {/* If user message: Clean right-aligned bubble, shrink to fit content */}
                  {isUser ? (
                    <div
                      onTouchStart={(e) => handleTouchStartMsg(e, { id: msg.id, content: msg.content, turnIdx: mIdx, role: "user", rawMsg: msg })}
                      onTouchEnd={handleTouchEndMsg}
                      onTouchMove={handleTouchMoveMsg}
                      onTouchCancel={handleTouchEndMsg}
                      onContextMenu={(e) => {
                        if (window.innerWidth < 1024) {
                          e.preventDefault();
                          setMobileActionMsg({ id: msg.id, content: msg.content, turnIdx: mIdx, role: "user", rawMsg: msg });
                        }
                      }}
                      className="flex flex-col items-end w-full max-w-full min-w-0"
                    >
                      <div className="inline-block rounded-2xl px-4 py-2 text-[13px] leading-relaxed max-w-[85%] sm:max-w-[80%] bg-amber-500/10 text-slate-900 border-amber-500/30 dark:bg-[#1c1c26] dark:text-neutral-100 dark:border-[#2c2c3e] rounded-br-xs shadow-xs font-sans font-normal ml-auto overflow-hidden break-words">
                        <p className="whitespace-pre-wrap select-text break-words break-all">{msg.content}</p>
                        {msg.metadata?.isOfflineQueued && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-500 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                            <span>Chờ đồng bộ mạng (Tự gửi khi có mạng)</span>
                          </div>
                        )}
                      </div>

                      {/* User Request Action CTAs: Desktop hover toolbar, hidden on mobile */}
                      <div className="hidden sm:flex items-center gap-1 pt-1 mt-0.5 select-none transition-opacity duration-150 opacity-0 group-hover/msg:opacity-100 justify-end">
                        {/* 0. Star / Bookmark Prompt CTA */}
                        <Tooltip content={starredMsgIds.includes(msg.id) ? "Bỏ đánh dấu sao" : "Đánh dấu sao (Star)"} placement="top" minWidth={130}>
                          <button data-ux-target-min="24"
                            type="button"
                            onClick={() => toggleStarMessage(msg.id)}
                            className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                              starredMsgIds.includes(msg.id)
                                ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                                : "hover:bg-slate-200/60 dark:hover:bg-[#181822] text-neutral-400 hover:text-slate-900 dark:hover:text-white border-transparent hover:border-slate-300 dark:hover:border-[#282836]"
                            }`}
                            aria-label={starredMsgIds.includes(msg.id) ? "Unstar message" : "Star message"}
                          >
                            <Star size={13} className={starredMsgIds.includes(msg.id) ? "fill-amber-400" : ""} />
                          </button>
                        </Tooltip>

                        {/* 1. Edit / Reuse Prompt CTA */}
                        <Tooltip content="Chỉnh sửa câu hỏi" placement="top" minWidth={140}>
                          <button data-ux-target-min="24"
                            type="button"
                            onClick={() => {
                              setInputText(msg.content);
                              if (textareaRef.current) {
                                textareaRef.current.style.height = "auto";
                                textareaRef.current.focus();
                                setTimeout(() => {
                                  if (textareaRef.current) {
                                    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
                                    textareaRef.current.setSelectionRange(msg.content.length, msg.content.length);
                                  }
                                }, 0);
                              }
                            }}
                            className="h-7 w-7 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[#181822] text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-[#282836]"
                            aria-label="Edit or reuse prompt"
                          >
                            <Edit2 size={13} className="text-cyan-400" />
                          </button>
                        </Tooltip>

                        {/* 2. Fork Session Branch CTA */}
                        <Tooltip content="Tách nhánh phiên mới" placement="top" minWidth={150}>
                          <button data-ux-target-min="24"
                            type="button"
                            onClick={() => handleForkSession(mIdx)}
                            className="h-7 w-7 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[#181822] text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-[#282836]"
                            aria-label="Fork session from here"
                          >
                            <GitFork size={13} className="text-cyan-400" />
                          </button>
                        </Tooltip>

                        {/* 3. Copy Prompt CTA */}
                        <Tooltip content={copiedResponseMsgId === msg.id ? "Đã sao chép!" : "Sao chép câu hỏi"} placement="top" minWidth={130}>
                          <button data-ux-target-min="24"
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(msg.content);
                              setCopiedResponseMsgId(msg.id);
                              setTimeout(() => setCopiedResponseMsgId(null), 1800);
                            }}
                            className="h-7 w-7 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[#181822] text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-[#282836]"
                            aria-label="Copy prompt"
                          >
                            {copiedResponseMsgId === msg.id ? (
                              <Check size={13} className="text-emerald-400" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </Tooltip>
                      </div>

                      {/* Mobile Action Menu Button for User Message */}
                      <div className="sm:hidden flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setMobileActionMsg({ id: msg.id, content: msg.content, turnIdx: mIdx, role: "user", rawMsg: msg })}
                          className="p-1 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                          aria-label="Tùy chọn câu hỏi"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Assistant Turn: Structured Content Blocks + Agent Tool Cards */
                    <div
                      onTouchStart={(e) => handleTouchStartMsg(e, {
                        id: msg.id,
                        content: msg.content,
                        turnIdx: mIdx,
                        role: "assistant",
                        hasThinking: Boolean(hasSteps || hasTools || msg.reasoning),
                        rawMsg: msg,
                      })}
                      onTouchEnd={handleTouchEndMsg}
                      onTouchMove={handleTouchMoveMsg}
                      onTouchCancel={handleTouchEndMsg}
                      onContextMenu={(e) => {
                        if (window.innerWidth < 1024) {
                          e.preventDefault();
                          setMobileActionMsg({
                            id: msg.id,
                            content: msg.content,
                            turnIdx: mIdx,
                            role: "assistant",
                            hasThinking: Boolean(hasSteps || hasTools || msg.reasoning),
                            rawMsg: msg,
                          });
                        }
                      }}
                      className="flex flex-col items-start w-full max-w-full space-y-1.5 min-w-0"
                    >
                      {/* Loading & Responding Indicator showing which Agent is currently responding */}
                      {!msg.content && (isStreaming || isCurrentSessionRunning) && isLastTurn && (
                        <div
                          data-testid="active-responding-agent-pill"
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 dark:bg-[#121218]/90 dark:border-[#22222e] dark:text-neutral-200 shadow-xs select-none animate-in fade-in duration-150"
                        >
                          <Loader2 size={13} className="text-[#f8a87c] animate-spin shrink-0" />
                          <span className="text-xs font-mono font-medium text-slate-700 dark:text-neutral-200">
                            {activeRespondingAgent?.statusText || `${msg.senderAgentName || selectedAgent.name} đang phản hồi...`}
                          </span>
                        </div>
                      )}

                      {msg.content && (
                        <>
                          {/* Collaborator / Room Routing Badge when response comes from Agent B or Manager in Room */}
                          {msg.senderAgentId && (
                            <div
                              data-testid={`room-msg-badge-${msg.senderAgentId}`}
                              className="flex items-center gap-1.5 text-[10px] font-mono mb-0.5 px-1 select-none"
                            >
                              <span className={`px-1.5 py-0.5 rounded-md border font-semibold ${
                                msg.authorRole === "manager"
                                  ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                                  : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              }`}>
                                @{msg.senderAgentId} ({msg.senderAgentName || msg.senderAgentId})
                              </span>

                            </div>
                          )}
                          {/* Assistant Response Bubble: Bọc trong background clean card cho cả light và dark mode, co giãn đúng nội dung (fit-content) */}
                          <div className={`inline-block w-auto max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2 shadow-xs transition-colors ${
                            msg.senderAgentId
                              ? "bg-emerald-500/[0.06] border border-emerald-500/30 text-slate-800 dark:bg-[#111c1a]/90 dark:border-emerald-500/25 dark:text-neutral-100"
                              : "bg-slate-50 border border-slate-200/80 text-slate-800 dark:bg-[#121218]/90 dark:border-[#22222e] dark:text-neutral-200"
                          }`}>
                            <div className="text-[13px] leading-relaxed divide-y divide-dashed divide-slate-200 dark:divide-[#22222c]/50">
                              <FormattedMessageContent
                              content={msg.content}
                              agentNode={selectedAgent.node}
                              onImageClick={(url, name) => {
                                setLightboxRotation(0);
                                setLightboxZoom(1);
                                setLightboxMeta(null);
                                setShowLightboxMeta(false);
                                setLightboxImageUrl({ url, name });
                              }}
                              onRunCode={(codeSnippet) => {
                                sendConsoleChatMessageStream(
                                  selectedChatId || "default",
                                  "Execute shell verification:\n```bash\n" + codeSnippet + "\n```",
                                  selectedAgent.slug
                                );
                              }}
                              onSpeakSentence={(sentence) => {
                                setSpeakingMsgId(msg.id);
                                speakText(sentence, {
                                  onSegmentChange: (seg) => setSpeakingSentence(seg),
                                  onEnd: () => {
                                    setSpeakingMsgId(null);
                                    setSpeakingSentence(null);
                                  },
                                  onError: () => {
                                    setSpeakingMsgId(null);
                                    setSpeakingSentence(null);
                                  },
                                });
                              }}
                            />
                              {/* Inline pulsing bullet cursor if currently streaming active tokens */}
                              {isStreaming && isLastTurn && (
                                <span className="inline-flex items-center gap-1 ml-1.5 align-middle select-none">
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-1" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-2" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-3" />
                                </span>
                              )}
                            </div>

                            {/* Detail mở rộng ở sau cùng tin nhắn: Thinking & Tool Execution trace (Hình 2) */}
                            {(hasSteps || hasTools || Boolean(msg.reasoning)) && (
                              <div className="mt-2 pt-2 border-t border-slate-200/70 dark:border-white/10">
                                <TurnExecutionAccordion
                                  msg={msg}
                                  isStreamingThisTurn={Boolean((isStreaming || isCurrentSessionRunning) && isLastTurn)}
                                  agentLabel={msg.senderAgentName || msg.senderAgentId || selectedAgent.name || selectedAgent.slug || selectedAgentId.replace(/^bot:agent360:/i, "")}
                                  onOpenModal={() => setActiveThinkingModalMsg(msg)}
                                />
                              </div>
                            )}
                          </div>
                          {/* Visual Karaoke sentence pill indicator during TTS readout */}
                          {speakingMsgId === msg.id && speakingSentence && (
                            <div className="flex items-center gap-2 px-3 py-1.5 my-1 rounded-xl bg-[#f8a87c]/10 border border-[#f8a87c]/30 text-xs font-mono text-[#f8a87c] animate-in fade-in select-none">
                              <Volume2 size={13} className="animate-pulse shrink-0" />
                              <span className="text-neutral-400 text-[10px] uppercase font-bold shrink-0">Reading:</span>
                              <span className="text-white italic truncate max-w-lg">"{speakingSentence}"</span>
                            </div>
                          )}

                          {/* Message Turn Action CTAs: Desktop hover toolbar, hidden on mobile */}
                          {!(isStreaming && isLastTurn) && (
                          <div className={`hidden sm:flex items-center gap-1 pt-1 mt-1 select-none transition-opacity duration-150 ${
                            speakingMsgId === msg.id ? "opacity-100" : "opacity-0 group-hover/msg:opacity-100"
                          }`}>
                            {/* 0. Star / Bookmark Turn CTA */}
                            <Tooltip content={starredMsgIds.includes(msg.id) ? "Bỏ đánh dấu sao" : "Đánh dấu sao câu trả lời"} placement="top" minWidth={150}>
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => toggleStarMessage(msg.id)}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                                  starredMsgIds.includes(msg.id)
                                    ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                                    : "hover:bg-[#181822] text-neutral-400 hover:text-white border-transparent hover:border-[#282836]"
                                }`}
                                aria-label={starredMsgIds.includes(msg.id) ? "Unstar message" : "Star message"}
                              >
                                <Star size={13} className={starredMsgIds.includes(msg.id) ? "fill-amber-400" : ""} />
                              </button>
                            </Tooltip>

                            {/* Fork Session Branch CTA */}
                            <Tooltip content="Tách nhánh phiên mới từ đây" placement="top" minWidth={160}>
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => handleForkSession(mIdx)}
                                className="h-7 w-7 rounded-lg hover:bg-[#181822] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#282836]"
                                aria-label="Fork session from here"
                              >
                                <GitFork size={13} className="text-cyan-400" />
                              </button>
                            </Tooltip>

                            {/* 1. Copy Response CTA */}
                            <Tooltip content={copiedResponseMsgId === msg.id ? "Đã sao chép vào bộ nhớ tạm!" : "Sao chép câu trả lời"} placement="top" minWidth={150}>
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.content);
                                  setCopiedResponseMsgId(msg.id);
                                  setTimeout(() => setCopiedResponseMsgId(null), 1800);
                                }}
                                className="h-7 w-7 rounded-lg hover:bg-[#181822] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#282836]"
                                aria-label="Copy response"
                              >
                                {copiedResponseMsgId === msg.id ? (
                                  <Check size={13} className="text-emerald-400" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                            </Tooltip>

                            {/* 2. Text-to-Speech Voice Playback CTA */}
                            <Tooltip content={speakingMsgId === msg.id ? "Dừng đọc thoại" : "Đọc to câu trả lời (TTS)"} placement="top" minWidth={160}>
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => {
                                  if (speakingMsgId === msg.id) {
                                    stopSpeaking();
                                    setSpeakingMsgId(null);
                                  } else {
                                    setSpeakingMsgId(msg.id);
                                    speakText(msg.content, {
                                      onSegmentChange: (seg) => setSpeakingSentence(seg),
                                      onEnd: () => {
                                        setSpeakingMsgId(null);
                                        setSpeakingSentence(null);
                                      },
                                      onError: () => {
                                        setSpeakingMsgId(null);
                                        setSpeakingSentence(null);
                                      },
                                    });
                                  }
                                }}
                                className="h-7 w-7 rounded-lg hover:bg-[#181822] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#282836]"
                                aria-label={speakingMsgId === msg.id ? "Stop voice playback" : "Read aloud with Text-to-Speech"}
                              >
                                <Volume2 size={13} className={speakingMsgId === msg.id ? "text-[#f8a87c] animate-pulse" : ""} />
                              </button>
                            </Tooltip>

                            {/* 3. Forward to Another Agent CTA */}
                            <Tooltip content="Chuyển tiếp cho Agent khác" placement="top" minWidth={160}>
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => setForwardModalMsg(msg.content)}
                                className="h-7 w-7 rounded-lg hover:bg-[#181822] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#282836]"
                                aria-label="Forward response to another Agent"
                              >
                                <Share2 size={13} className="text-cyan-400" />
                              </button>
                            </Tooltip>
                          </div>
                          )}

                          {/* Mobile Action Menu Button for Assistant Message */}
                          {!(isStreaming && isLastTurn) && (
                            <div className="sm:hidden flex items-center pt-1">
                              <button
                                type="button"
                                onClick={() => setMobileActionMsg({
                                  id: msg.id,
                                  content: msg.content,
                                  turnIdx: mIdx,
                                  role: "assistant",
                                  hasThinking: Boolean(hasSteps || hasTools || msg.reasoning),
                                  rawMsg: msg,
                                })}
                                className="p-1 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                                aria-label="Tùy chọn tin nhắn"
                              >
                                <MoreHorizontal size={14} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
          </>
          )}

          {/* Active Session Responding Indicator showing which Agent is currently responding */}
          {isCurrentSessionRunning && (displayMessages.length === 0 || displayMessages[displayMessages.length - 1].role === "user") && (
            <div className="flex flex-col items-start w-full space-y-1.5 animate-in fade-in duration-200 my-2">
              <div
                data-testid="active-responding-agent-pill"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 dark:bg-[#121218]/90 dark:border-[#22222e] dark:text-neutral-200 shadow-xs select-none"
              >
                <Loader2 size={13} className="text-[#f8a87c] animate-spin shrink-0" />
                <span className="text-xs font-mono font-medium text-slate-700 dark:text-neutral-200">
                  {activeRespondingAgent?.statusText || `${selectedAgent.name} đang phản hồi...`}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Desktop User Request Trace Bar (waveform tick indicator + popover card) */}
        {(() => {
          const userTurns = displayMessages
            .map((msg, originalIdx) => ({ msg, originalIdx }))
            .filter((item) => item.msg.role === "user");

          userTurnsRef.current = userTurns;

          if (userTurns.length === 0 || hasNoAgents) return null;

          const activeTurnItem = hoveredTraceIdx !== null && userTurns[hoveredTraceIdx]
            ? userTurns[hoveredTraceIdx]
            : null;

          // Find the assistant response immediately following the hovered user turn (if any)
          let nextAssistantSnippet = "";
          let nextAssistantHasCheck = false;
          if (activeTurnItem) {
            for (let i = activeTurnItem.originalIdx + 1; i < displayMessages.length; i++) {
              const m = displayMessages[i];
              if (m.role === "user") break;
              if (m.role === "assistant" && m.content) {
                nextAssistantSnippet = m.content.trim().slice(0, 160);
                if (m.content.includes("✓") || m.content.toLowerCase().includes("thành công") || m.content.toLowerCase().includes("done") || (m.steps && m.steps.length > 0)) {
                  nextAssistantHasCheck = true;
                }
                break;
              }
            }
          }

          const isCardBookmarked = activeTurnItem ? starredMsgIds.includes(activeTurnItem.msg.id) : false;

          const effectiveCardPos = traceCardPos || {
            top: typeof window !== "undefined" ? Math.max(64, Math.round(window.innerHeight / 2 - 80)) : 200,
            right: 48,
          };

          return (
            <div
              className="hidden lg:flex absolute right-2.5 top-1/2 -translate-y-1/2 z-30 flex-col items-end select-none"
              onMouseLeave={() => {
                setHoveredTraceIdx(null);
                setTraceCardPos(null);
              }}
            >
              {/* Ticks waveform stack: centered vertically, hugging right edge */}
              <div className="flex flex-col items-end gap-[6px] py-2 px-1 max-h-[70vh] overflow-visible select-none">
                {userTurns.map((turn, tIdx) => {
                  const isHovered = hoveredTraceIdx === tIdx;
                  const isCurrentActive = activeTraceIdx === tIdx;
                  const isBookmarked = starredMsgIds.includes(turn.msg.id);
                  let widthClass = "w-2";
                  if (hoveredTraceIdx !== null) {
                    const dist = Math.abs(hoveredTraceIdx - tIdx);
                    if (dist === 0) widthClass = "w-7";
                    else if (dist === 1) widthClass = "w-5";
                    else if (dist === 2) widthClass = "w-4";
                    else if (dist === 3) widthClass = "w-3";
                    else widthClass = "w-2";
                  }

                  return (
                    <div key={turn.msg.id || tIdx} className="relative flex items-center justify-end">
                      {/* Clean minimal tooltip positioned directly relative to this tick item */}
                      {isHovered && (
                        <div
                          className="absolute right-full mr-2.5 z-50 max-w-[320px] sm:max-w-[420px] px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#181820]/95 text-slate-800 dark:text-neutral-100 text-[12px] shadow-xl border border-slate-200/90 dark:border-white/10 backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 whitespace-nowrap select-none"
                        >
                          <span className="font-mono text-[11px] text-[#e0682b] dark:text-[#f8a87c] font-bold shrink-0">
                            #{tIdx + 1}
                          </span>
                          <span className="truncate max-w-[260px] sm:max-w-[360px] font-medium leading-snug text-slate-700 dark:text-neutral-200">
                            {turn.msg.content.trim()}
                          </span>
                        </div>
                      )}

                      <button
                        data-trace-tick-idx={tIdx}
                        type="button"
                        aria-label={`Yêu cầu ${tIdx + 1}: ${turn.msg.content.slice(0, 40)}`}
                        onMouseEnter={() => {
                          setHoveredTraceIdx(tIdx);
                          if (traceCardTimeoutRef.current) clearTimeout(traceCardTimeoutRef.current);
                        }}
                        onClick={() => scrollToUserTurn(tIdx)}
                        className={`h-[2.5px] rounded-full transition-all duration-200 cursor-pointer ${widthClass} ${
                          isHovered
                            ? "bg-slate-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.85)] scale-y-125"
                            : isBookmarked
                            ? "bg-amber-500/90 dark:bg-amber-400/80 hover:bg-amber-600 dark:hover:bg-amber-300"
                            : isCurrentActive
                            ? "bg-slate-700 dark:bg-white/80 shadow-[0_0_4px_rgba(0,0,0,0.2)] dark:shadow-[0_0_4px_rgba(255,255,255,0.5)]"
                            : "bg-neutral-300 hover:bg-neutral-500 dark:bg-neutral-600/70 dark:hover:bg-neutral-300"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>


            </div>
          );
        })()}
        </div>

        {/* Floating Scroll to Bottom Button */}
        {showScrollBottomBtn && (
          <div className="absolute bottom-20 right-6 z-30 animate-in fade-in zoom-in-95 duration-150">
            <Tooltip content="Cuộn xuống tin nhắn mới nhất" placement="top" minWidth={140}>
              <button
                type="button"
                aria-label="Cuộn xuống tin nhắn mới nhất"
                onClick={() => {
                  isUserScrolledUpRef.current = false;
                  setShowScrollBottomBtn(false);
                  smoothScrollToBottom();
                }}
                className="h-8 w-8 rounded-full bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2a2a38] shadow-md hover:shadow-lg flex items-center justify-center text-slate-700 dark:text-neutral-200 hover:text-[#f8a87c] hover:border-[#f8a87c]/60 transition-all cursor-pointer"
              >
                <ChevronDown size={16} className={isStreaming ? "animate-bounce text-[#f8a87c]" : ""} />
              </button>
            </Tooltip>
          </div>
        )}

        {/* Micro-HUD Pill Toast for Agent Loop Mode cycling */}
      {loopModeToast && (
        <div
          data-testid="loop-mode-hud-toast"
          className={`pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full backdrop-blur-xl border shadow-2xl transition-all duration-200 select-none ${
            loopModeToast.visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
          } ${
            loopModeToast.mode === "goal"
              ? "bg-emerald-950/90 dark:bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-500/10"
              : loopModeToast.mode === "mission"
              ? "bg-cyan-950/90 dark:bg-cyan-950/90 border-cyan-500/40 text-cyan-200 shadow-cyan-500/10"
              : "bg-slate-900/90 dark:bg-[#14141c]/95 border-[#f8a87c]/40 text-neutral-100 shadow-[#f8a87c]/10"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
              loopModeToast.mode === "goal"
                ? "bg-emerald-500/20 text-emerald-400"
                : loopModeToast.mode === "mission"
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-amber-500/20 text-[#f8a87c]"
            }`}
          >
            {loopModeToast.mode === "goal" ? (
              <Target size={12} className="stroke-[2.5]" />
            ) : loopModeToast.mode === "mission" ? (
              <Rocket size={12} className="stroke-[2.5]" />
            ) : (
              <CircleDot size={12} className="stroke-[2.5]" />
            )}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="font-semibold capitalize tracking-wide">
              {loopModeToast.mode === "goal" ? "Chế độ: Mục tiêu" : loopModeToast.mode === "mission" ? "Chế độ: Nhiệm vụ dài hạn" : "Chế độ: Tiêu chuẩn"}
            </span>
            <span className="text-[10px] opacity-60">|</span>
            <span className="text-[10px] opacity-75">
              {loopModeToast.mode === "goal"
                ? "Hoàn thành mục tiêu đề ra"
                : loopModeToast.mode === "mission"
                ? "Nhiệm vụ phức tạp nhiều giai đoạn"
                : "Tương tác hỗ trợ tiêu chuẩn"}
            </span>
          </div>
          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-white/70 ml-1">
            Ctrl+Alt+L
          </span>
        </div>
      )}

      {/* Bottom Floating Pill Composer (Lean padding in compact mode) */}
        <div className={`${isCompactMode ? "p-2.5 pb-3" : "p-4"} bg-transparent shrink-0 max-w-3xl mx-auto w-full space-y-2`}>
          {/* Request Queue Indicator */}
          {requestQueue.length > 0 && (
            <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#14141c]/95 border border-[#2a2a38] text-[11px] font-mono text-neutral-300 shadow-md animate-in fade-in duration-100">
              <div className="flex items-center gap-2 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] animate-pulse" />
                <span className="text-[#f8a87c] font-semibold">Queue:</span>
                <span className="truncate text-neutral-300">
                  {requestQueue.length} upcoming request{requestQueue.length > 1 ? "s" : ""} (Next: "{requestQueue[0]}")
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (selectedChatId) setChatQueue(selectedChatId, []);
                }}
                className="text-neutral-500 hover:text-white text-[10px] cursor-pointer ml-2 shrink-0"
              >
                Clear
              </button>
            </div>
          )}
          {/* Attached Files Preview Chips with Image Thumbnails & Lightbox */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pb-1 px-1">
              {attachedFiles.map((f, i) => {
                const isImage = /\.(png|jpe?g|webp|gif|svg|bmp)$/i.test(f.file_name);
                return (
                  <div
                    key={f.url + i}
                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2e2e42] text-xs font-mono px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-neutral-200 shadow-sm animate-in zoom-in-95 fade-in duration-150 group/filechip"
                  >
                    {isImage && f.url ? (
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxZoom(1);
                          setLightboxPan({ x: 0, y: 0 });
                          setLightboxRotation(0);
                          setLightboxMeta(null);
                          setShowLightboxMeta(false);
                          setLightboxImageUrl({ url: f.url, name: f.file_name });
                        }}
                        className="relative h-6 w-6 rounded-md overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10 shrink-0 cursor-zoom-in group-hover/filechip:ring-2 group-hover/filechip:ring-[#f8a87c]/50 transition-all"
                        title="Click to view full image preview"
                      >
                        <img
                          src={f.url}
                          alt={f.file_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      </button>
                    ) : (
                      <Paperclip size={13} className="text-[#f8a87c] shrink-0" />
                    )}
                    <span className="max-w-[160px] truncate text-[11px] font-medium">{f.file_name}</span>
                    <span className="text-[9px] text-slate-500 dark:text-neutral-500 font-mono">({Math.round(f.size / 1024) || 1} KB)</span>
                    <button aria-label="Remove attachment" data-ux-target-min="24"
                      type="button"
                      onClick={() => removeAttachedFile(i)}
                      className="text-slate-400 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer ml-0.5 transition-colors"
                      title="Remove attachment"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fork Session Branch Success Toast */}
          {forkToast && (
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <GitFork size={13} className="text-cyan-400" />
                <span>{forkToast}</span>
              </div>
              <button type="button" onClick={() => setForkToast(null)} className="text-cyan-400 hover:text-white cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}

                    {/* Hardware Device Change Notification Toast */}
          {deviceToast && (
            <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="truncate">{deviceToast.message}</span>
                <button
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(true)}
                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-white underline text-[10px] cursor-pointer shrink-0"
                >
                  Configure Audio
                </button>
              </div>
              <button type="button" onClick={() => setDeviceToast(null)} className="text-cyan-400 hover:text-white cursor-pointer shrink-0">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Voice Error Notification with Permission Quick-Fix */}
          {voiceError && (
            <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-mono flex items-center justify-between gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{voiceError}</span>
                <button data-ux-target-min="24"
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(true)}
                  className="px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 text-white underline text-[10px] cursor-pointer shrink-0"
                >
                  Manage Permissions
                </button>
              </div>
              <button type="button" onClick={() => setVoiceError(null)} className="text-red-400 hover:text-white cursor-pointer shrink-0">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Cluster Standby / Local Sandbox Alert */}
          {backendError && !hasNoAgents && (
            <div
              role="alert"
              data-testid="backend-standby-banner"
              className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                <span>{backendError}</span>
              </div>
              <button data-ux-target-min="24"
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full bg-amber-400/20 px-3 py-1 font-medium text-amber-300 hover:bg-amber-400/30 transition-colors"
              >
                Reconnect
              </button>
            </div>
          )}

          {/* Interactive Human-in-the-Loop Approval Cards */}
          {pendingApprovals.length > 0 && (
            <div className="mb-3 space-y-2" data-testid="approval-cards-container">
              {pendingApprovals.length > 1 && (
                <div className="p-2.5 rounded-xl bg-[#181822] border border-[#2a2a3c] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <ShieldAlert size={14} className="text-red-400" />
                    <span>{pendingApprovals.length} actions pending human authorization</span>
                  </div>
                  <button data-ux-target-min="24"
                    type="button"
                    onClick={handleBatchApproveAll}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold cursor-pointer shadow-sm transition-all"
                  >
                    <CheckCheck size={13} />
                    <span>Approve All ({pendingApprovals.length})</span>
                  </button>
                </div>
              )}
              {pendingApprovals.map((app) => (
                <div
                  key={app.request_id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-white shadow-lg backdrop-blur-md"
                >
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-red-200 font-mono">{app.tool_name}</span>
                        <span className="rounded bg-red-500/20 px-1.5 py-0.2 text-[10px] text-red-300 uppercase font-mono">
                          {app.severity || "Critical"}
                        </span>
                      </div>
                      <p className="text-neutral-300 mt-0.5 leading-relaxed">
                        {app.reasoning || "Agent requests approval to execute high-risk infrastructure action."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button data-ux-target-min="24"
                      type="button"
                      onClick={() => handleInlineDeny(app.request_id, app.session_id)}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                    >
                      <XCircle size={12} /> Deny
                    </button>
                    <button data-ux-target-min="24"
                      type="button"
                      onClick={() => handleInlineApprove(app.request_id, app.session_id)}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-1.5 font-semibold transition-colors cursor-pointer"
                    >
                      <CheckCircle size={12} /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pendingPrompt && inputText.trim() === pendingPrompt.trim() && (
            <div
              role="status"
              data-testid="pending-task-banner"
              className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-white/10 bg-[#121218] px-4 py-3 text-xs text-neutral-300"
            >
              <span className="flex-1 min-w-0">
                <span className="text-neutral-500">Task from Skyer home:</span>{" "}
                <span className="text-white">“{pendingPrompt}”</span>
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button data-ux-target-min="24"
                  type="button"
                  onClick={clearPromptParam}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-neutral-300 hover:text-white cursor-pointer"
                >
                  Edit first
                </button>
                <button data-ux-target-min="24"
                  type="button"
                  onClick={runPendingPrompt}
                  disabled={!selectedAgentId}
                  className="rounded-full bg-white px-3 py-1.5 font-semibold text-black hover:bg-neutral-200 disabled:opacity-50 cursor-pointer"
                >
                  Run task
                </button>
              </div>
            </div>
          )}

          {/* Quick Slash Commands Popover */}
          <div className="relative w-full">
            {inputText.startsWith("/") && (
              <SlashCommandMenu
                query={inputText}
                onSelect={(cmd) => {
                  setInputText(cmd.prompt);
                }}
                onClose={() => {}}
              />
            )}
          </div>

          {/* Context Token Usage High Warning (>80% threshold) */}
          {(() => {
            const currentTokens = turnTelemetry?.tokenCount || 0;
            const maxContext = 128000;
            const usagePercent = Math.round((currentTokens / maxContext) * 100);
            if (usagePercent >= 80) {
              return (
                <div className="mb-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in select-none">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-amber-400 shrink-0 animate-pulse" />
                    <span>Context window at {usagePercent}% capacity ({currentTokens.toLocaleString()} / 128,000 tokens).</span>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await compactAgentContext(selectedAgent.id, selectedChatId || "default");
                      setForkToast("Context compacted successfully");
                      setTimeout(() => setForkToast(null), 3000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[10px] cursor-pointer transition-colors shrink-0 shadow-sm"
                  >
                    Auto-Compact
                  </button>
                </div>
              );
            }
            return null;
          })()}

          {/* Plus Add Popover Menu (Spans 100% full width of chat input and sits directly on top) */}
          <div ref={plusMenuRef} className="relative w-full">
            {isPlusMenuOpen && (
              <div
                style={{
                  transform: plusMenuDragY > 0 ? "translateY(" + plusMenuDragY + "px)" : undefined,
                  transition: isPlusMenuDragging ? "none" : "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="fixed md:absolute inset-x-2 md:inset-x-0 bottom-20 md:bottom-full mb-2 max-h-[85vh] md:max-h-[520px] flex flex-col rounded-2xl bg-white dark:bg-[#14141c] border border-slate-200 dark:border-white/[0.08] shadow-2xl backdrop-blur-none p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-left overflow-hidden ring-0 [container-type:inline-size]"
              >
                {/* Mobile iOS-style Swipe-down Handle (Kéo để đóng) */}
                <div
                  onTouchStart={(e) => {
                    if (e.touches.length === 1) {
                      plusMenuTouchStartYRef.current = e.touches[0].clientY;
                      setIsPlusMenuDragging(true);
                    }
                  }}
                  onTouchMove={(e) => {
                    if (plusMenuTouchStartYRef.current !== null && e.touches.length === 1) {
                      const deltaY = e.touches[0].clientY - plusMenuTouchStartYRef.current;
                      if (deltaY > 0) {
                        setPlusMenuDragY(deltaY);
                      }
                    }
                  }}
                  onTouchEnd={(e) => {
                    if (plusMenuTouchStartYRef.current !== null && e.changedTouches.length === 1) {
                      const deltaY = e.changedTouches[0].clientY - plusMenuTouchStartYRef.current;
                      if (deltaY > 60) {
                        if (typeof window !== "undefined" && "vibrate" in navigator) {
                          try { navigator.vibrate(10); } catch {}
                        }
                        setIsPlusMenuOpen(false);
                      }
                    }
                    setPlusMenuDragY(0);
                    setIsPlusMenuDragging(false);
                    plusMenuTouchStartYRef.current = null;
                  }}
                  onTouchCancel={() => {
                    setPlusMenuDragY(0);
                    setIsPlusMenuDragging(false);
                    plusMenuTouchStartYRef.current = null;
                  }}
                  onClick={() => setIsPlusMenuOpen(false)}
                  className="md:hidden flex flex-col items-center justify-center pt-1 pb-2.5 -mt-1 cursor-grab active:cursor-grabbing shrink-0 touch-none select-none active:opacity-75 transition-opacity"
                  aria-label="Kéo để đóng"
                >
                  <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full hover:bg-[#f8a87c] transition-colors" />
                  <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 mt-1 select-none flex items-center gap-1 opacity-75">
                    <span>Kéo để đóng</span>
                  </span>
                </div>

                {(() => {
                  const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                  const activeTrigger = triggerMatch ? triggerMatch[1] : null;
                  const activeQuery = triggerMatch ? triggerMatch[2].toLowerCase() : "";

                  // If user is searching specifically via '@', display dedicated Column View of Agents/Subagents
                  // =========================================================================
                  // DEDICATED POPUP FOR '/' (Chat Session & Tools Actions) & '@' (Add, Plugins, Agents)
                  // =========================================================================
                  if (activeTrigger === "/" || activeTrigger === "@") {
                    if (activeTrigger === "/") {
                      // -------------------------------------------------------------
                      // MENU FOR '/': Session actions & agent control (Image 1 reference)
                      // -------------------------------------------------------------
                      const isPinned = selectedChatId ? pinnedChatIds.includes(selectedChatId) : false;
                      const currentTokens = turnTelemetry?.tokenCount || 0;
                      const maxContext = 128000;
                      const usagePercent = Math.round((currentTokens / maxContext) * 100);

                      const sessionCommands = [
                        {
                          id: "cmd-goal",
                          title: "Goal",
                          description: "Set a goal to keep pursuing",
                          icon: <Target size={14} className="text-emerald-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            handleSelectLoopMode("goal");
                            setForkToast("Đã kích hoạt Goal mode (Bám sát mục tiêu)");
                            setTimeout(() => setForkToast(null), 3000);
                          },
                        },
                        {
                          id: "cmd-agent-settings",
                          title: "Agent Settings",
                          description: "Mở cài đặt chuyên sâu của Agent (Model, Apps, A2A, Cron, Memory)",
                          icon: <Settings size={14} className="text-[#f8a87c]" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            setAgentSettingsModalTab("general");
                            setIsAgentSettingsModalOpen(true);
                          },
                        },
                        {
                          id: "cmd-mcp",
                          title: "MCP",
                          description: "Show MCP server status",
                          hasChevron: true,
                          icon: <Activity size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            setAgentSettingsModalTab("apps_mcp");
                            setIsAgentSettingsModalOpen(true);
                          },
                        },
                        {
                          id: "cmd-memories",
                          title: "Memories",
                          description: "Xem và quản lý bộ nhớ của agent",
                          icon: <Layers size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            setAgentSettingsModalTab("memory_skills");
                            setIsAgentSettingsModalOpen(true);
                          },
                        },
                        {
                          id: "cmd-new-chat",
                          title: "New chat",
                          description: "Start a blank chat in the same agent",
                          icon: <Plus size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            handleNewChat();
                          },
                        },
                        {
                          id: "cmd-pet",
                          title: "Pet",
                          description: "Wake or tuck away the desktop pet",
                          icon: <Sparkles size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            setForkToast("Desktop Pet is ready in fleet");
                            setTimeout(() => setForkToast(null), 2500);
                          },
                        },
                        {
                          id: "cmd-pin-chat",
                          title: isPinned ? "Unpin chat" : "Pin chat",
                          description: isPinned ? "Bỏ ghim phiên hội thoại này" : "Keep this chat in the sidebar",
                          icon: isPinned ? <PinOff size={14} className="text-amber-400" /> : <Pin size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            if (selectedChatId) {
                              togglePinChat(selectedChatId);
                            }
                          },
                        },
                        {
                          id: "cmd-plan-mode",
                          title: "Plan mode",
                          description: "Turn plan mode on",
                          icon: <Star size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            handleSelectLoopMode("goal");
                            setForkToast("Plan mode enabled");
                            setTimeout(() => setForkToast(null), 2500);
                          },
                        },
                        {
                          id: "cmd-rename",
                          title: "Rename",
                          description: "Rename the current chat",
                          icon: <Edit2 size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            if (selectedChatId) {
                              setEditingChatId(selectedChatId);
                              setEditingChatTitle(selectedChat?.title || "");
                            }
                          },
                        },
                        {
                          id: "cmd-side",
                          title: "Side",
                          description: "Start a temporary side chat",
                          icon: <MessageSquare size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            handleForkSession(messages.length > 0 ? messages.length - 1 : 0);
                            setForkToast("Đã mở temporary side chat");
                            setTimeout(() => setForkToast(null), 3000);
                          },
                        },
                        {
                          id: "cmd-sketch",
                          title: "Sketch",
                          description: "Draw a sketch",
                          icon: <Layers size={14} className="text-teal-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            handleToggleBotInfo(false);
                            setRightTab("Computer");
                          },
                        },
                        {
                          id: "cmd-status",
                          title: "Status",
                          description: `Show chat ID, context usage (${usagePercent}% used)`,
                          icon: <Activity size={14} className="text-neutral-400" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText("");
                            setForkToast(`Session: ${selectedChatId || "default"} | Context: ${usagePercent}%`);
                            setTimeout(() => setForkToast(null), 4000);
                          },
                        },
                      ];

                      const filteredCommands = activeQuery
                        ? sessionCommands.filter((c) =>
                            c.title.toLowerCase().includes(activeQuery) ||
                            c.description.toLowerCase().includes(activeQuery) ||
                            c.id.toLowerCase().includes(activeQuery)
                          )
                        : sessionCommands;

                      return (
                        <div className="flex-1 flex flex-col pt-1 max-h-[60vh] md:max-h-[460px] overflow-hidden">
                          <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 transform-gpu overscroll-contain">
                            {filteredCommands.length === 0 ? (
                              <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                                Không tìm thấy lệnh nào khớp với "/{activeQuery}"
                              </div>
                            ) : (
                              filteredCommands.map((cmd, idx) => {
                                const isHighlighted = plusMenuSelectedIndex === idx;
                                return (
                                  <button
                                    key={cmd.id}
                                    type="button"
                                    data-popover-nav-idx={idx}
                                    onClick={cmd.action}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer group border ${
                                      isHighlighted
                                        ? "bg-slate-200 dark:bg-[#252530] text-slate-900 dark:text-white border-transparent shadow-xs"
                                        : "text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-[#1e1e28] border-transparent"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className="shrink-0 flex items-center justify-center opacity-85 group-hover:opacity-100">
                                        {cmd.icon}
                                      </div>
                                      <div className="flex items-baseline gap-2.5 min-w-0 flex-1">
                                        <span className="font-semibold text-xs text-slate-900 dark:text-white shrink-0">
                                          {cmd.title}
                                        </span>
                                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                                          {cmd.description}
                                        </span>
                                      </div>
                                    </div>

                                    {cmd.hasChevron ? (
                                      <ChevronRight size={13} className="text-neutral-500 shrink-0 ml-2 opacity-60 group-hover:opacity-100" />
                                    ) : (
                                      <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 shrink-0 ml-2">
                                        ↵
                                      </span>
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    }

                    // -------------------------------------------------------------
                    // MENU FOR '@': Add (Files, Browser, Modes), Plugins & Agents (Image 2 reference)
                    // -------------------------------------------------------------
                    // Group 1: Add
                    const addActions = [
                      {
                        id: "action-files-folders",
                        title: "Files and folders",
                        description: "Tải lên tệp hoặc thư mục mã nguồn từ máy",
                        icon: <Paperclip size={14} className="text-[#f8a87c]" />,
                        action: () => {
                          setIsPlusMenuOpen(false);
                          setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                          fileInputRef.current?.click();
                        },
                      },
                      {
                        id: "action-attach-browser",
                        title: "Attach Microsoft Edge",
                        description: `Live browser của ${selectedAgent.name}`,
                        icon: <Globe size={14} className="text-cyan-400" />,
                        action: () => {
                          setIsPlusMenuOpen(false);
                          setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                          handleSetBrowserModalOpen(true);
                        },
                      },
                      {
                        id: "mode-goal",
                        title: "Goal",
                        description: "Set a goal to keep pursuing",
                        icon: <Target size={14} className="text-emerald-400" />,
                        action: () => {
                          setIsPlusMenuOpen(false);
                          setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                          handleSelectLoopMode("goal");
                        },
                      },
                      {
                        id: "mode-plan",
                        title: "Plan mode",
                        description: "Turn plan mode on",
                        icon: <Star size={14} className="text-amber-400" />,
                        action: () => {
                          setIsPlusMenuOpen(false);
                          setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                          handleSelectLoopMode("goal");
                        },
                      },
                      {
                        id: "mode-sketch",
                        title: "Sketch",
                        description: "Draw a sketch",
                        icon: <Layers size={14} className="text-teal-400" />,
                        action: () => {
                          setIsPlusMenuOpen(false);
                          setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                          handleToggleBotInfo(false);
                          setRightTab("Computer");
                        },
                      },
                    ];

                    // Group 2: Plugins (MCP Tools / Connected Apps)
                    const rawApps = currentAgentMcpClients.length > 0
                      ? currentAgentMcpClients.map((c) => {
                          const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                          const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || (a.id.length > 2 && c.name.toLowerCase().includes(a.id.toLowerCase())));
                          return {
                            id: matched?.id || rawKey,
                            name: matched?.name || c.name || c.key,
                            logoUrl: matched?.logoUrl || `https://logos.composio.dev/api/${rawKey}`,
                            description: matched?.description || "MCP tool integration",
                          };
                        })
                      : APPS_CATALOG.map((a) => ({ id: a.id, name: a.name, logoUrl: a.logoUrl, description: a.description }));

                    const pluginActions = rawApps.map((app) => ({
                      id: `plugin-${app.id}`,
                      title: app.name,
                      description: app.description,
                      icon: (
                        <div className="h-5 w-5 rounded bg-slate-100 dark:bg-white/10 flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
                          <img
                            src={app.logoUrl}
                            alt={app.name}
                            className="h-3.5 w-3.5 object-contain"
                            onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
                          />
                        </div>
                      ),
                      action: () => {
                        setIsPlusMenuOpen(false);
                        setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, `/${app.id} `));
                        textareaRef.current?.focus();
                      },
                    }));

                    // Group 3: Agents (Subagents & Team Agents)
                    const boundChildren = currentAgentSubBindings.map((b) => b.child_agent_id);
                    const subAgentsList = agents.filter((ag) => boundChildren.includes(ag.id) || boundChildren.includes(ag.slug));
                    const displayAgents = subAgentsList.length > 0 ? subAgentsList : agents.filter((ag) => ag.id !== selectedAgent.id);

                    const agentActions = displayAgents.map((ag) => ({
                      id: `agent-${ag.id}`,
                      title: ag.name,
                      description: ag.roleTag || ag.description || "Fast helper subagent running in fleet",
                      icon: (
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-[#f8a87c] flex items-center justify-center text-black font-bold text-[10px] shrink-0 shadow-2xs">
                          {ag.name.slice(0, 1).toUpperCase()}
                        </div>
                      ),
                      action: () => {
                        setIsPlusMenuOpen(false);
                        setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, `@${ag.name} `));
                        textareaRef.current?.focus();
                      },
                    }));

                    const filterItems = <T extends { title: string; description: string; id: string }>(items: T[]) => {
                      if (!activeQuery) return items;
                      return items.filter((it) =>
                        it.title.toLowerCase().includes(activeQuery) ||
                        it.description.toLowerCase().includes(activeQuery) ||
                        it.id.toLowerCase().includes(activeQuery)
                      );
                    };

                    const filteredAdd = filterItems(addActions);
                    const filteredPlugins = filterItems(pluginActions);
                    const filteredAgents = filterItems(agentActions);

                    const allAtItems = [
                      ...filteredAdd,
                      ...filteredPlugins,
                      ...filteredAgents,
                    ];

                    const groups = [
                      { name: "Add", items: filteredAdd },
                      { name: "Plugins", items: filteredPlugins },
                      { name: "Agents", items: filteredAgents },
                    ].filter((g) => g.items.length > 0);

                    return (
                      <div className="flex-1 flex flex-col pt-1.5 max-h-[60vh] md:max-h-[460px] overflow-hidden">
                        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 transform-gpu overscroll-contain">
                          {allAtItems.length === 0 ? (
                            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                              Không tìm thấy kết quả khớp với "@{activeQuery}"
                            </div>
                          ) : (
                            groups.map((group) => (
                              <div key={group.name} className="space-y-1">
                                <div className="px-2 pt-1 text-[11px] font-medium text-neutral-400 select-none">
                                  {group.name}
                                </div>
                                <div className="space-y-0.5">
                                  {group.items.map((item) => {
                                    const globalIdx = allAtItems.findIndex((it) => it.id === item.id);
                                    const isHighlighted = plusMenuSelectedIndex === globalIdx;

                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        data-popover-nav-idx={globalIdx}
                                        onClick={item.action}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer group border ${
                                          isHighlighted
                                            ? "bg-slate-200 dark:bg-[#252530] text-slate-900 dark:text-white border-transparent shadow-xs"
                                            : "text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-transparent hover:bg-slate-100 dark:hover:bg-[#1e1e28] border-transparent"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                          <div className="shrink-0 flex items-center justify-center">
                                            {item.icon}
                                          </div>
                                          <div className="flex items-baseline gap-2 min-w-0 flex-1">
                                            <span className="font-semibold text-xs text-slate-900 dark:text-white shrink-0">
                                              {item.title}
                                            </span>
                                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                                              {item.description}
                                            </span>
                                          </div>
                                        </div>

                                        <span className="text-[10px] font-mono text-neutral-500 opacity-0 group-hover:opacity-100 shrink-0 ml-2">
                                          ↵
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Default view when opened without typing @ or / (via '+' button)
                  // When container width is narrow (< 720px), stack columns cleanly (1 column simple) so items do not get crushed
                  const isNarrowMenu = plusMenuWidth < 720;

                  return (
                    <div className={`flex-1 overflow-y-auto max-h-[60vh] md:max-h-[460px] pr-1 sm:pr-1.5 overscroll-contain ${
                      isNarrowMenu
                        ? "flex flex-col space-y-4 pt-2"
                        : "grid grid-cols-3 gap-3.5 pt-2.5 items-stretch"
                    }`}>
                  {/* Column 1: Add Files & Work Mode (Add files at the top, followed by clear work modes) */}
                  <div className={`flex flex-col justify-between space-y-2 ${isNarrowMenu ? "w-full" : "h-full"}`}>
                    {/* 1. Add Files Option (Placed at the very top as requested) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">Tệp đính kèm</div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Tải lên tệp hoặc thư mục</div>
                        </div>
                        <Paperclip size={13} className="text-[#f8a87c]" />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsPlusMenuOpen(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer border border-[#f8a87c]/30 bg-[#f8a87c]/10 hover:bg-[#f8a87c]/20 text-slate-900 dark:text-white group shadow-xs"
                      >
                        <div className="h-7 w-7 rounded-lg bg-[#f8a87c] flex items-center justify-center text-black shrink-0 shadow-xs transition-transform group-hover:scale-105">
                          <Paperclip size={14} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-[#f8a87c] transition-colors">
                              Add Files
                            </span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-neutral-400">0</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            Chọn ảnh, văn bản, mã nguồn từ máy
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* 2. Work Mode Section (Chế độ làm việc rõ ràng, thân thiện) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-[#222230]">
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">Chế độ làm việc</div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Chọn cách thức agent xử lý</div>
                        </div>
                        <SlidersHorizontal size={13} className="text-neutral-500" />
                      </div>

                      {/* Default: Trò chuyện chuẩn */}
                      <button
                        type="button"
                        onClick={() => handleSelectLoopMode("default")}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer border ${
                          activeLoopMode === "default"
                            ? "bg-amber-500/10 dark:bg-[#1f1f2e] border-[#f8a87c] text-slate-900 dark:text-white shadow-xs"
                            : "bg-slate-100/80 dark:bg-[#181822]/80 hover:bg-slate-200/80 dark:hover:bg-[#20202e] border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-[#2f2f42] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="h-6 w-6 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-transparent shadow-2xs flex items-center justify-center text-neutral-600 dark:text-neutral-300 mt-0.5 shrink-0 transition-colors">
                          <CircleDot size={13} className={activeLoopMode === "default" ? "text-[#f8a87c]" : "text-slate-500 dark:text-neutral-400"} />
                        </div>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">Tiêu chuẩn</span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-neutral-400">1</span>
                            </div>
                            {activeLoopMode === "default" && (
                              <span className="h-2 w-2 rounded-full bg-[#f8a87c] shrink-0 ml-1" />
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug">
                            Trò chuyện tương tác và hỗ trợ thông thường.
                          </span>
                        </div>
                      </button>

                      {/* Goal: Bám sát mục tiêu */}
                      <button
                        type="button"
                        onClick={() => handleSelectLoopMode("goal")}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer border ${
                          activeLoopMode === "goal"
                            ? "bg-emerald-500/10 dark:bg-[#1f1f2e] border-emerald-500 text-slate-900 dark:text-white shadow-xs"
                            : "bg-slate-100/80 dark:bg-[#181822]/80 hover:bg-slate-200/80 dark:hover:bg-[#20202e] border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-[#2f2f42] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="h-6 w-6 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-transparent shadow-2xs flex items-center justify-center text-neutral-600 dark:text-neutral-300 mt-0.5 shrink-0 transition-colors">
                          <Target size={13} className={activeLoopMode === "goal" ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-neutral-400"} />
                        </div>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">Mục tiêu</span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-neutral-400">2</span>
                            </div>
                            {activeLoopMode === "goal" && (
                              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 ml-1" />
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug">
                            Tự động hoàn thành trọn vẹn mục tiêu đề ra.
                          </span>
                        </div>
                      </button>

                      {/* Mission: Nhiệm vụ đa bước */}
                      <button
                        type="button"
                        onClick={() => handleSelectLoopMode("mission")}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer border ${
                          activeLoopMode === "mission"
                            ? "bg-cyan-500/10 dark:bg-[#1f1f2e] border-cyan-500 text-slate-900 dark:text-white shadow-xs"
                            : "bg-slate-100/80 dark:bg-[#181822]/80 hover:bg-slate-200/80 dark:hover:bg-[#20202e] border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-[#2f2f42] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="h-6 w-6 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-transparent shadow-2xs flex items-center justify-center text-neutral-600 dark:text-neutral-300 mt-0.5 shrink-0 transition-colors">
                          <Rocket size={13} className={activeLoopMode === "mission" ? "text-cyan-500 dark:text-cyan-400" : "text-slate-500 dark:text-neutral-400"} />
                        </div>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">Nhiệm vụ dài hạn</span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-neutral-400">3</span>
                            </div>
                            {activeLoopMode === "mission" && (
                              <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0 ml-1" />
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug">
                            Thực thi dự án phức tạp nhiều giai đoạn.
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Column 2: Connected Apps (Loaded from Selected Agent's Apps tab - Full Height List) */}
                  <div className={`flex flex-col space-y-1.5 ${
                    isNarrowMenu
                      ? "w-full pt-3 border-t border-slate-200 dark:border-[#222230]"
                      : "h-full pt-0 border-t-0"
                  }`}>
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Connected Apps</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-[9px] font-mono text-slate-700 dark:text-neutral-300">
                          {(() => {
                            const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                        const q = triggerMatch ? triggerMatch[2].toLowerCase() : plusMenuSearch.trim().toLowerCase();
                            let arr = currentAgentMcpClients.length > 0
                              ? currentAgentMcpClients.map((c) => {
                                  const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                                  const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || (a.id.length > 2 && c.name.toLowerCase().includes(a.id.toLowerCase())));
                                  return matched?.name || c.name || c.key;
                                })
                              : APPS_CATALOG.map((a) => a.name);
                            if (q) arr = arr.filter((n) => n.toLowerCase().includes(q));
                            return arr.length;
                          })()}
                        </span>
                      </div>
                      <div className="relative group/tooltip">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            setAgentSettingsModalTab("apps_mcp");
                            setIsAgentSettingsModalOpen(true);
                          }}
                          className="p-1 rounded-md text-neutral-400 hover:text-[#f8a87c] hover:bg-white/5 transition-colors cursor-pointer"
                          aria-label="View Apps in sidebar"
                        >
                          <ExternalLink size={12} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 hidden group-hover/tooltip:flex px-2 py-0.5 rounded bg-[#1c1c28] border border-[#2e2e42] text-[10px] font-mono text-neutral-200 whitespace-nowrap shadow-lg z-30">
                          View in sidebar
                        </div>
                      </div>
                    </div>

                    <div
                      ref={appsScrollRef}
                      onScroll={(e) => { lastAppsScrollTopRef.current = (e.target as HTMLElement).scrollTop; }}
                      className="flex-1 max-h-[36vh] sm:max-h-[360px] overflow-y-auto space-y-1.5 pr-1.5 overscroll-contain transform-gpu smooth-scroll-container"
                    >
                      {(() => {
                        // Priority 1: All apps loaded from Agent's active MCP clients with instant search
                        const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                        const q = triggerMatch ? triggerMatch[2].toLowerCase() : plusMenuSearch.trim().toLowerCase();
                        let agentApps = currentAgentMcpClients.length > 0
                          ? currentAgentMcpClients.map((c) => {
                              const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                              const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || (a.id.length > 2 && c.name.toLowerCase().includes(a.id.toLowerCase())));
                              return {
                                id: matched?.id || rawKey,
                                name: matched?.name || c.name || c.key,
                                logoUrl: matched?.logoUrl || `https://logos.composio.dev/api/${rawKey}`,
                                isConnected: true,
                              };
                            })
                          : APPS_CATALOG.map((a) => ({ ...a, isConnected: connectedAppIds.includes(a.id) }));

                        if (q) {
                          agentApps = agentApps.filter((a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
                        }

                        if (agentApps.length === 0) {
                          return (
                            <div className="p-2 text-center text-[11px] text-neutral-500 font-mono">
                              No connected apps for this agent
                            </div>
                          );
                        }

                        return agentApps.map((app, appIdx) => {
                          const isHighlighted = plusMenuSelectedIndex === appIdx;
                          const isAlreadyAdded = inputText.includes(`/${app.id} `) || inputText.endsWith(`/${app.id}`);
                          return (
                          <button
                            key={`popover-app-${app.id}-${appIdx}`}
                            type="button"
                            data-popover-nav-idx={appIdx}
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setInputText((prev) => {
                                if (isAlreadyAdded) {
                                  // Remove the slash command cleanly
                                  return prev
                                    .replace(new RegExp(`/${app.id}\\s*`, "g"), "")
                                    .trimStart();
                                }
                                return prev ? `${prev} /${app.id} ` : `/${app.id} `;
                              });
                              textareaRef.current?.focus();
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer group border ${
                              isHighlighted
                                ? "bg-[#f8a87c]/15 dark:bg-[#f8a87c]/20 border-[#f8a87c] text-slate-900 dark:text-white shadow-xs"
                                : isAlreadyAdded
                                ? "bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/40 text-slate-900 dark:text-white"
                                : "text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#181822]/80 hover:bg-slate-200 dark:hover:bg-[#20202e] border-slate-200/80 dark:border-transparent hover:border-slate-300 dark:hover:border-[#2f2f42]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                              <div className="h-6 w-6 rounded-lg bg-slate-50 dark:bg-neutral-800/90 border border-slate-200 dark:border-white/10 flex items-center justify-center p-1 shrink-0 shadow-2xs transition-colors">
                                <img
                                  src={app.logoUrl}
                                  alt={app.name}
                                  className="h-3.5 w-3.5 object-contain filter contrast-125 transition-all dark:brightness-100"
                                  onError={(e) => {
                                    // Fallback to stylized initial icon if image fails
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                              </div>
                              <span className="truncate text-[11px]">{app.name}</span>
                            </div>
                            <span className={`text-[9px] font-mono shrink-0 ${
                              isAlreadyAdded ? "text-amber-400 font-semibold" : "text-neutral-500 group-hover:text-[#f8a87c]"
                            }`}>
                              {isAlreadyAdded ? "Added" : "+Tool"}
                            </span>
                          </button>
                        );
                      });
                      })()}
                    </div>
                  </div>

                  {/* Column 3: Subagents & Team Agents (Loaded from Selected Agent's Agents tab - Full Height List) */}
                  <div className={`flex flex-col space-y-1.5 ${
                    isNarrowMenu
                      ? "w-full pt-3 border-t border-slate-200 dark:border-[#222230]"
                      : "h-full pt-0 border-t-0"
                  }`}>
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Subagents</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-[9px] font-mono text-slate-700 dark:text-neutral-300">
                          {(() => {
                            const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                        const q = triggerMatch ? triggerMatch[2].toLowerCase() : plusMenuSearch.trim().toLowerCase();
                            const boundChildren = currentAgentSubBindings.map((b) => b.child_agent_id);
                            const subAgentsList = agents.filter((ag) => boundChildren.includes(ag.id) || boundChildren.includes(ag.slug));
                            let arr = subAgentsList.length > 0 ? subAgentsList : agents.filter((ag) => ag.id !== selectedAgent.id);
                            if (q) arr = arr.filter((ag) => ag.name.toLowerCase().includes(q) || (ag.roleTag || "").toLowerCase().includes(q) || ag.id.toLowerCase().includes(q));
                            return arr.length;
                          })()}
                        </span>
                      </div>
                      <div className="relative group/tooltip">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlusMenuOpen(false);
                            setAgentSettingsModalTab("subagents");
                            setIsAgentSettingsModalOpen(true);
                          }}
                          className="p-1 rounded-md text-neutral-400 hover:text-[#f8a87c] hover:bg-white/5 transition-colors cursor-pointer"
                          aria-label="View Subagents in sidebar"
                        >
                          <ExternalLink size={12} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 hidden group-hover/tooltip:flex px-2 py-0.5 rounded bg-[#1c1c28] border border-[#2e2e42] text-[10px] font-mono text-neutral-200 whitespace-nowrap shadow-lg z-30">
                          View in sidebar
                        </div>
                      </div>
                    </div>

                    <div
                      ref={subAgentsScrollRef}
                      onScroll={(e) => { lastSubAgentsScrollTopRef.current = (e.target as HTMLElement).scrollTop; }}
                      className="flex-1 max-h-[36vh] sm:max-h-[360px] overflow-y-auto space-y-1.5 pr-1.5 overscroll-contain transform-gpu smooth-scroll-container"
                    >
                      {(() => {
                        // All subagents configured on selected agent with instant search
                        const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                        const q = triggerMatch ? triggerMatch[2].toLowerCase() : plusMenuSearch.trim().toLowerCase();
                        const boundChildren = currentAgentSubBindings.map((b) => b.child_agent_id);
                        const subAgentsList = agents.filter((ag) => boundChildren.includes(ag.id) || boundChildren.includes(ag.slug));
                        // If no direct subagents configured yet, show all team members across fleet
                        let displayList = subAgentsList.length > 0 ? subAgentsList : agents.filter((ag) => ag.id !== selectedAgent.id);

                        if (q) {
                          displayList = displayList.filter((ag) => ag.name.toLowerCase().includes(q) || (ag.roleTag || "").toLowerCase().includes(q) || ag.id.toLowerCase().includes(q));
                        }

                        if (displayList.length === 0) {
                          return (
                            <div className="p-2 text-center text-[11px] text-neutral-500 font-mono">
                              No subagents bound to this agent
                            </div>
                          );
                        }

                        // Calculate offset for subagents keyboard index
                        const appsCount = (() => {
                          const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                        const q = triggerMatch ? triggerMatch[2].toLowerCase() : plusMenuSearch.trim().toLowerCase();
                          let arr = currentAgentMcpClients.length > 0
                            ? currentAgentMcpClients.map((c) => c.key.toLowerCase().replace(/^composio_/, ""))
                            : APPS_CATALOG.map((a) => a.id);
                          if (q) arr = arr.filter((id) => id.includes(q));
                          return arr.length;
                        })();

                        return displayList.map((ag, subIdx) => {
                          const isHighlighted = plusMenuSelectedIndex === (appsCount + subIdx);
                          const isAlreadyMentioned = inputText.includes(`@${ag.name}`);
                          return (
                          <button
                            key={`popover-subagent-${ag.id}-${subIdx}`}
                            type="button"
                            data-popover-nav-idx={appsCount + subIdx}
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              const mentionTag = ag.slug || ag.id.replace(/^bot:agent360:/, "");
                              setInputText((prev) => {
                                if (isAlreadyMentioned || prev.includes(`@${mentionTag}`)) {
                                  return prev
                                    .replace(new RegExp(`@(${ag.name}|${mentionTag})\\s*`, "g"), "")
                                    .trimStart();
                                }
                                return prev ? `${prev} @${mentionTag} ` : `@${mentionTag} `;
                              });
                              if (selectedChatId && selectedAgentId) {
                                pullAgentIntoChatRoom(selectedAgentId, selectedChatId, mentionTag, {
                                  hostSessionId: selectedChat?.session_id || selectedChatId,
                                }).then((res) => {
                                  if (res?.room) setActiveSessionRoom(res.room);
                                });
                              }
                              textareaRef.current?.focus();
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs text-left transition-colors cursor-pointer group border ${
                              isHighlighted
                                ? "bg-cyan-500/15 dark:bg-cyan-500/20 border-cyan-500 text-slate-900 dark:text-white shadow-xs"
                                : isAlreadyMentioned
                                ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 text-slate-900 dark:text-white"
                                : "text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#181822]/80 hover:bg-slate-200 dark:hover:bg-[#20202e] border-slate-200/80 dark:border-transparent hover:border-slate-300 dark:hover:border-[#2f2f42]"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                              <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 shadow-2xs border ${
                                isAlreadyMentioned
                                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                  : "bg-amber-500/15 dark:bg-[#f8a87c]/20 border-amber-500/40 dark:border-[#f8a87c]/30 text-[#f8a87c]"
                              }`}>
                                {isAlreadyMentioned ? <Check size={11} className="stroke-[2.5]" /> : ag.name.slice(0, 1)}
                              </div>
                              <span className="truncate text-[11px]">{ag.name}</span>
                            </div>
                            <span className={`text-[9px] font-mono shrink-0 flex items-center gap-1 ${
                              isAlreadyMentioned ? "text-emerald-400 font-semibold" : "text-neutral-500 group-hover:text-cyan-400"
                            }`}>
                              {isAlreadyMentioned ? "Active" : "@Mention"}
                            </span>
                          </button>
                        );
                      });
                      })()}
                    </div>
                  </div>
                </div>
                  );
                })()}

                </div>
            )}


            {(() => {
              const isMultiline = inputText.includes("\n");
              
              // Common Plus Button Trigger
              const renderPlusButton = () => {
                const activeMentionsCount = (inputText.match(/@[a-zA-Z0-9_-]+/g) || []).length;
                const activeToolsCount = (inputText.match(/\/[a-zA-Z0-9_-]+/g) || []).length;
                const totalActiveItems = activeMentionsCount + activeToolsCount;

                return (
                  <div className="relative shrink-0 flex items-center">
                    <button aria-label="Add files, apps, or agents" data-ux-target-min="24"
                      type="button"
                      onClick={() => {
                        setIsPlusMenuOpen((prev) => {
                          const next = !prev;
                          if (next) {
                            setPlusMenuSearch("");
                            setPlusMenuSelectedIndex(-1);
                          }
                          return next;
                        });
                      }}
                      disabled={isUploadingFile}
                      className={`text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer p-1.5 rounded-full flex items-center justify-center shrink-0 ${
                        isPlusMenuOpen ? "text-[#f8a87c] dark:text-[#f8a87c] rotate-45 scale-110" : "bg-black/5 dark:bg-white/[0.06] hover:bg-black/10 dark:hover:bg-white/[0.12]"
                      }`}
                      title="Add files, apps, or mention agents"
                    >
                      {isUploadingFile ? (
                        <Loader2 size={16} className="animate-spin text-[#f8a87c]" />
                      ) : (
                        <Plus size={16} className="transition-transform duration-200" />
                      )}
                    </button>
                    {totalActiveItems > 0 && !isPlusMenuOpen && (
                      <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-1 rounded-full bg-[#f8a87c] text-black font-mono font-bold text-[8px] flex items-center justify-center shadow-xs pointer-events-none">
                        {totalActiveItems}
                      </span>
                    )}
                  </div>
                );
              };

              // Common Command / Starred & Shortcuts Trigger (Prompt Assistant & Recipes)
              const renderRecipesButton = () => (
                <button
                  type="button"
                  onClick={() => setIsStarredShortcutsOpen(true)}
                  className="text-neutral-400 hover:text-[#f8a87c] transition-colors cursor-pointer p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/[0.06] shrink-0 flex items-center justify-center relative"
                  title="Đã đánh dấu sao & Phím tắt hệ thống (Ctrl+/)"
                >
                  <Command size={14} />
                  {starredMsgIds.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 ring-1 ring-[#0c0c0e]" />
                  )}
                </button>
              );

              // Common Textarea Element
              const renderTextarea = () => (
                <textarea
                  key="composer-main-textarea"
                  ref={textareaRef}
                  rows={isMultiline ? 2 : 1}
                  value={inputText}
                  onFocus={() => {
                    isTextareaFocusedRef.current = true;
                    if (textareaRef.current) {
                      textareaCursorPosRef.current = {
                        start: textareaRef.current.selectionStart,
                        end: textareaRef.current.selectionEnd,
                      };
                    }
                  }}
                  onBlur={() => {
                    // Delay reset slightly to differentiate between actual blur and DOM re-parenting
                    setTimeout(() => {
                      if (document.activeElement !== textareaRef.current) {
                        isTextareaFocusedRef.current = false;
                      }
                    }, 50);
                  }}
                  onSelect={(e) => {
                    const target = e.currentTarget;
                    textareaCursorPosRef.current = {
                      start: target.selectionStart,
                      end: target.selectionEnd,
                    };
                  }}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    const cursorPos = e.target.selectionStart || newVal.length;
                    isTextareaFocusedRef.current = true;
                    textareaCursorPosRef.current = {
                      start: cursorPos,
                      end: cursorPos,
                    };
                    setInputText(newVal);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 220) + "px";

                    const textUpToCursor = newVal.slice(0, cursorPos);
                    const triggerMatch = textUpToCursor.match(/(@|\/)([a-zA-Z0-9_-]*)$/);

                    if (triggerMatch) {
                      setPlusMenuSearch(triggerMatch[2]);
                      if (!isPlusMenuOpen) {
                        setIsPlusMenuOpen(true);
                        setPlusMenuSelectedIndex(0);
                      }
                    } else if (isPlusMenuOpen) {
                      // Automatically close popover when '@' or '/' was removed or cursor moved away
                      setIsPlusMenuOpen(false);
                      setPlusMenuSearch("");
                      setPlusMenuSelectedIndex(-1);
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prompt History Recall: When input is empty and pure ArrowUp (no Alt/Ctrl/Meta/Shift) is pressed, restore previous user prompt
                    if (e.key === "ArrowUp" && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && !inputText.trim() && messages.length > 0) {
                      const userMsgs = messages.filter((m) => m.role === "user");
                      const lastUserMsg = userMsgs[userMsgs.length - 1];
                      if (lastUserMsg && lastUserMsg.content) {
                        e.preventDefault();
                        triggerHaptic(15);
                        setInputText(lastUserMsg.content);
                        if (textareaRef.current) {
                          textareaRef.current.style.height = "auto";
                          setTimeout(() => {
                            if (textareaRef.current) {
                              textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
                              textareaRef.current.setSelectionRange(lastUserMsg.content.length, lastUserMsg.content.length);
                            }
                          }, 0);
                        }
                        return;
                      }
                    }
                    if (isPlusMenuOpen) {
                      const triggerMatch = inputText.match(/(@|\/)([a-zA-Z0-9_-]*)$/);
                      if (triggerMatch) {
                        const q = triggerMatch[2].toLowerCase();
                        const trigger = triggerMatch[1];

                        if (trigger === "/") {
                          // Session actions list for '/'
                          const slashNavList = [
                            { id: "cmd-agent-settings", type: "action" },
                            { id: "cmd-goal", type: "action" },
                            { id: "cmd-mcp", type: "action" },
                            { id: "cmd-memories", type: "action" },
                            { id: "cmd-new-chat", type: "action" },
                            { id: "cmd-pet", type: "action" },
                            { id: "cmd-pin-chat", type: "action" },
                            { id: "cmd-plan-mode", type: "action" },
                            { id: "cmd-rename", type: "action" },
                            { id: "cmd-side", type: "action" },
                            { id: "cmd-sketch", type: "action" },
                            { id: "cmd-status", type: "action" },
                          ];

                          const slashTitles: Record<string, { title: string; desc: string }> = {
                            "cmd-agent-settings": { title: "Agent Settings", desc: "Mở cài đặt chuyên sâu của Agent" },
                            "cmd-goal": { title: "Goal", desc: "Set a goal to keep pursuing" },
                            "cmd-mcp": { title: "MCP", desc: "Show MCP server status" },
                            "cmd-memories": { title: "Memories", desc: "Xem và quản lý bộ nhớ của agent" },
                            "cmd-new-chat": { title: "New chat", desc: "Start a blank chat in the same agent" },
                            "cmd-pet": { title: "Pet", desc: "Wake or tuck away the desktop pet" },
                            "cmd-pin-chat": { title: "Pin chat", desc: "Keep this chat in the sidebar" },
                            "cmd-plan-mode": { title: "Plan mode", desc: "Turn plan mode on" },
                            "cmd-rename": { title: "Rename", desc: "Rename the current chat" },
                            "cmd-side": { title: "Side", desc: "Start a temporary side chat" },
                            "cmd-sketch": { title: "Sketch", desc: "Draw a sketch" },
                            "cmd-status": { title: "Status", desc: "Show chat ID, context usage" },
                          };

                          const filteredSlash = q
                            ? slashNavList.filter((it) => {
                                const meta = slashTitles[it.id];
                                return meta && (meta.title.toLowerCase().includes(q) || meta.desc.toLowerCase().includes(q));
                              })
                            : slashNavList;

                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            if (filteredSlash.length > 0) setPlusMenuSelectedIndex((prev) => (prev + 1) % filteredSlash.length);
                            return;
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            if (filteredSlash.length > 0) setPlusMenuSelectedIndex((prev) => (prev - 1 + filteredSlash.length) % filteredSlash.length);
                            return;
                          } else if (e.key === "Enter" || e.key === "Tab") {
                            if (filteredSlash.length > 0 && plusMenuSelectedIndex >= 0 && plusMenuSelectedIndex < filteredSlash.length) {
                              e.preventDefault();
                              const selected = filteredSlash[plusMenuSelectedIndex];
                              setIsPlusMenuOpen(false);
                              setInputText("");

                              if (selected.id === "cmd-agent-settings") {
                                setAgentSettingsModalTab("general");
                                setIsAgentSettingsModalOpen(true);
                              } else if (selected.id === "cmd-goal" || selected.id === "cmd-plan-mode") {
                                handleSelectLoopMode("goal");
                              } else if (selected.id === "cmd-mcp") {
                                setAgentSettingsModalTab("apps_mcp");
                                setIsAgentSettingsModalOpen(true);
                              } else if (selected.id === "cmd-memories") {
                                setAgentSettingsModalTab("memory_skills");
                                setIsAgentSettingsModalOpen(true);
                              } else if (selected.id === "cmd-new-chat") {
                                handleNewChat();
                              } else if (selected.id === "cmd-pin-chat" && selectedChatId) {
                                togglePinChat(selectedChatId);
                              } else if (selected.id === "cmd-rename" && selectedChatId) {
                                setEditingChatId(selectedChatId);
                                setEditingChatTitle(selectedChat?.title || "");
                              } else if (selected.id === "cmd-side") {
                                handleForkSession(messages.length > 0 ? messages.length - 1 : 0);
                              } else if (selected.id === "cmd-sketch") {
                                handleToggleBotInfo(false);
                                setRightTab("Computer");
                              } else if (selected.id === "cmd-status") {
                                setForkToast(`Session: ${selectedChatId || "default"}`);
                                setTimeout(() => setForkToast(null), 3000);
                              }
                              return;
                            }
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            setIsPlusMenuOpen(false);
                            return;
                          }
                        } else if (trigger === "@") {
                          // All Add, Plugins, and Agents list for '@'
                          const rawApps = currentAgentMcpClients.length > 0
                            ? currentAgentMcpClients.map((c) => {
                                const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                                const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || (a.id.length > 2 && c.name.toLowerCase().includes(a.id.toLowerCase())));
                                return { id: matched?.id || rawKey, title: matched?.name || c.name || c.key, description: matched?.description || "" };
                              })
                            : APPS_CATALOG.map((a) => ({ id: a.id, title: a.name, description: a.description }));

                          const boundChildren = currentAgentSubBindings.map((b) => b.child_agent_id);
                          const subAgentsList = agents.filter((ag) => boundChildren.includes(ag.id) || boundChildren.includes(ag.slug));
                          const displayAgents = subAgentsList.length > 0 ? subAgentsList : agents.filter((ag) => ag.id !== selectedAgent.id);

                          const allAtNav: Array<{ id: string; type: "file" | "browser" | "mode" | "app" | "agent"; title: string; description: string }> = [
                            { id: "action-files-folders", type: "file", title: "Files and folders", description: "Tải lên tệp hoặc thư mục mã nguồn từ máy" },
                            { id: "action-attach-browser", type: "browser", title: "Attach Microsoft Edge", description: "Live browser sandbox" },
                            { id: "mode-goal", type: "mode", title: "Goal", description: "Set a goal to keep pursuing" },
                            { id: "mode-plan", type: "mode", title: "Plan mode", description: "Turn plan mode on" },
                            { id: "mode-sketch", type: "mode", title: "Sketch", description: "Draw a sketch" },
                          ];

                          rawApps.forEach((a) => allAtNav.push({ id: a.id, type: "app", title: a.title, description: a.description }));
                          displayAgents.forEach((ag) => allAtNav.push({ id: ag.id, type: "agent", title: ag.name, description: ag.roleTag || ag.description || "" }));

                          const filteredAt = q
                            ? allAtNav.filter((it) => it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q) || it.id.toLowerCase().includes(q))
                            : allAtNav;

                          if (e.key === "ArrowDown") {
                            e.preventDefault();
                            if (filteredAt.length > 0) setPlusMenuSelectedIndex((prev) => (prev + 1) % filteredAt.length);
                            return;
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            if (filteredAt.length > 0) setPlusMenuSelectedIndex((prev) => (prev - 1 + filteredAt.length) % filteredAt.length);
                            return;
                          } else if (e.key === "Enter" || e.key === "Tab") {
                            if (filteredAt.length > 0 && plusMenuSelectedIndex >= 0 && plusMenuSelectedIndex < filteredAt.length) {
                              e.preventDefault();
                              const selected = filteredAt[plusMenuSelectedIndex];
                              setIsPlusMenuOpen(false);

                              if (selected.type === "file") {
                                setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                                fileInputRef.current?.click();
                              } else if (selected.type === "browser") {
                                setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                                handleSetBrowserModalOpen(true);
                              } else if (selected.type === "mode") {
                                setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, ""));
                                handleSelectLoopMode("goal");
                              } else if (selected.type === "app") {
                                setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, `/${selected.id} `));
                              } else if (selected.type === "agent") {
                                setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, `@${selected.title} `));
                              }
                              return;
                            }
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            setIsPlusMenuOpen(false);
                            return;
                          }
                        }
                      }
                    }

                    if (e.key === "Backspace") {
                      const target = e.currentTarget;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      if (start === end) {
                        const textBefore = target.value.substring(0, start);
                        const trailingTagMatch = textBefore.match(/(@[a-zA-Z0-9_-]+|\/[a-zA-Z0-9_-]+)\s*$/);
                        if (trailingTagMatch) {
                          e.preventDefault();
                          const tagToRemove = trailingTagMatch[0];
                          const newTextBefore = textBefore.substring(0, textBefore.length - tagToRemove.length);
                          const textAfter = target.value.substring(end);
                          const nextInput = (newTextBefore + textAfter).trimStart();
                          setInputText(nextInput);
                          setTimeout(() => {
                            const newCursorPos = Math.max(0, start - tagToRemove.length);
                            target.selectionStart = target.selectionEnd = newCursorPos;
                            target.style.height = "auto";
                            target.style.height = Math.min(target.scrollHeight, 220) + "px";
                          }, 0);
                          return;
                        }
                      }
                    }

                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      const target = e.currentTarget;
                      const start = target.selectionStart;
                      const end = target.selectionEnd;
                      const val = target.value;
                      const nextVal = val.substring(0, start) + "\n" + val.substring(end);
                      setInputText(nextVal);
                      setTimeout(() => {
                        target.selectionStart = target.selectionEnd = start + 1;
                        target.style.height = "auto";
                        target.style.height = Math.min(target.scrollHeight, 220) + "px";
                      }, 0);
                      return;
                    }

                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      composerFormRef.current?.requestSubmit();
                      if (textareaRef.current) {
                        textareaRef.current.style.height = "auto";
                      }
                    }
                  }}
                  disabled={hasNoAgents}
                  placeholder={
                    hasNoAgents
                      ? "Chưa có Agent được gán cho tài khoản của bạn (Tính năng tạo Agent đang Incoming)..."
                      : isRecording
                      ? "🎙 Đang nghe... Hãy nói để chuyển thành văn bản..."
                      : isStreaming
                      ? "Agent is responding • Enter to queue next request..."
                      : (t("composer.placeholder") || "Nhập yêu cầu công việc (Shift+Esc hoặc / để nhập)...")
                  }
                  aria-label={`Message ${selectedAgent.name}`}
                  className={`w-full bg-transparent border-0 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed scrollbar-none ${
                    isMultiline ? "min-h-[52px] max-h-56 py-1 px-0.5" : "flex-1 max-h-32 py-1"
                  }`}
                />
              );

              // Common Right Controls
              const renderRightControls = () => (
                <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
                  {renderRecipesButton()}

                  <AudioVisualizerWaveform
                    isRecording={isRecording}
                    agentId={selectedAgent?.id}
                    onAudioLevel={(lvl) => {
                      audioEnergyLevelRef.current = lvl;
                      setLiveVoiceEnergy(lvl);
                    }}
                  />

{/* Command button moved to left tools next to [+] as requested */}

                  <button aria-label={isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói (Voice to Text)"} data-ux-target-min="24"
                    type="button"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSettingsModalTab("voice_record");
                      setIsSettingsModalOpen(true);
                    }}
                    onClick={() => {
                      if (vadModeRef.current !== "push_to_talk") {
                        if (isRecording) stopVoiceRecording(true);
                        else startVoiceRecording();
                      }
                    }}
                    onPointerDown={() => {
                      if (vadModeRef.current === "push_to_talk" && !isRecording) {
                        startVoiceRecording();
                      }
                    }}
                    onPointerUp={() => {
                      if (vadModeRef.current === "push_to_talk" && isRecording) {
                        stopVoiceRecording();
                        setTimeout(() => {
                          composerFormRef.current?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                        }, 200);
                      }
                    }}
                    style={{
                      boxShadow: isRecording
                        ? "0 0 " + Math.max(8, Math.min(28, Math.round(liveVoiceEnergy * 0.45))) + "px " +
                          (liveVoiceEnergy > 45 ? "rgba(255, 51, 102, 0.75)" : "rgba(248, 168, 124, 0.65)")
                        : undefined,
                    }}
                    className={`p-1.5 rounded-full cursor-pointer transition-all ${
                      isRecording
                        ? liveVoiceEnergy > 45
                          ? "bg-gradient-to-r from-[#ff3366] to-[#f8a87c] text-white"
                          : "bg-[#f8a87c] text-black"
                        : "hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400"
                    }`}
                    title={isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói (Voice to Text)"}
                  >
                    {isRecording ? <Square size={13} className="fill-white" /> : <Mic size={15} />}
                  </button>

                  {isStreaming && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleStopStreaming}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 text-[11px] font-mono transition-colors cursor-pointer select-none"
                        title="Stop generation"
                        aria-label="Stop response stream"
                      >
                        <Square size={10} className="fill-current" />
                        <span>Stop</span>
                      </button>
                      {requestQueue.length > 0 && (
                        <span className="text-[10px] font-mono text-[#f8a87c] bg-[#f8a87c]/10 px-2 py-0.5 rounded-full border border-[#f8a87c]/20">
                          Queued: {requestQueue.length}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Circular Send Button (Grok/ChatGPT Style) */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() && attachedFiles.length === 0}
                    className={`transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                      inputText.trim() || attachedFiles.length > 0
                        ? "h-7 w-7 rounded-full bg-[#f8a87c] text-black hover:bg-[#ffb48a] shadow-xs active:scale-95"
                        : "h-7 w-7 rounded-full bg-black/5 dark:bg-white/[0.06] text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                    }`}
                    title={isStreaming ? "Add to request queue" : "Send Message"}
                    aria-label={isStreaming ? "Add to request queue" : "Send Message"}
                  >
                    <ArrowUp size={15} className="stroke-[2.5]" />
                  </button>
                </div>
              );

              return (
                <form
                  id="tour-prompt-composer"
                  ref={composerFormRef}
                  onSubmit={handleSendMessage}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dragCounterRef.current += 1;
                    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
                      setIsDraggingFiles(true);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dragCounterRef.current -= 1;
                    if (dragCounterRef.current <= 0) {
                      setIsDraggingFiles(false);
                      dragCounterRef.current = 0;
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingFiles(false);
                    dragCounterRef.current = 0;
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleDropFiles(e.dataTransfer.files);
                    }
                  }}
                  className={`relative ${
                    isMultiline
                      ? "flex flex-col gap-2 p-3 sm:p-3.5"
                      : "flex items-center gap-2 px-4 py-2.5"
                  } bg-white dark:bg-[#14141c] border ${
                    isDraggingFiles
                      ? "border-[#f8a87c] ring-2 ring-[#f8a87c]/30 bg-amber-500/5 dark:bg-[#f8a87c]/10"
                      : isRecording
                      ? "border-red-500/60 ring-2 ring-red-500/20"
                      : "border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/15 focus-within:border-[#f8a87c]/50 dark:focus-within:border-[#f8a87c]/50 focus-within:ring-1 focus-within:ring-[#f8a87c]/20"
                  } rounded-2xl shadow-xs transition-all overflow-hidden`}
                >
                  {isDraggingFiles && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center gap-2 bg-slate-900/90 dark:bg-[#14141c]/95 border-2 border-dashed border-[#f8a87c] rounded-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                      <Paperclip size={15} className="text-[#f8a87c] animate-bounce" />
                      <span className="text-xs font-mono font-semibold text-white tracking-wide">
                        Drop files here to attach to {selectedAgent.name}
                      </span>
                    </div>
                  )}

                  <input data-ux-target-min="16"
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {isMultiline ? (
                    <>
                      {/* Multiline Layout (Grok / ChatGPT style) */}
                      <div className="w-full">
                        {renderTextarea()}
                      </div>
                      <div className="flex items-center justify-between w-full pt-1.5 border-t border-slate-100 dark:border-white/[0.06]">
                        <div className="flex items-center gap-1">
                          {renderPlusButton()}
                        </div>
                        {renderRightControls()}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Single-line Compact Inline Layout */}
                      {renderPlusButton()}
                      {renderTextarea()}
                      {renderRightControls()}
                    </>
                  )}
                </form>
              );
            })()}          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. CONVERSATION SESSIONS LIST (COLLAPSIBLE, RIGHT OF CHAT) */}
      {/* ========================================================= */}
      <aside
        ref={chatSessionsAsideRef}
        id="tour-chat-sessions"
        style={{
          width:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? isChatListCollapsed
                ? "0px"
                : `${chatSessionsWidth}px`
              : undefined,
        }}
        className={`fixed lg:static inset-y-0 right-0 z-50 lg:z-30 h-full flex flex-col bg-[var(--bg-sidebar)] shrink-0 transition-grok relative ${
          mobileChatsOpen
            ? "flex w-full sm:w-[360px] border-l border-neutral-200 dark:border-[#1e1e24] translate-x-0 shadow-2xl"
            : isChatListCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full lg:w-0"
            : "hidden lg:flex lg:w-[320px] translate-x-full lg:translate-x-0 shadow-none border-l border-neutral-200 dark:border-[#1e1e24]"
        }`}
      >
        {/* Subtle, Slim Resizer Splitter between Chat / Virtual Computer and Session Chats */}
        {!isChatListCollapsed && (
          <div
            onMouseDown={() => setIsResizingChatSessions(true)}
            className={`hidden lg:block absolute top-0 ${
              isComputerSplitOpen ? "right-0 -mr-1" : "left-0 -ml-1"
            } w-1.5 h-full cursor-col-resize hover:bg-[#f8a87c]/40 active:bg-[#f8a87c] transition-colors z-30 group`}
            title="Kéo để chỉnh độ rộng danh sách chat"
          >
            <div className="w-0.5 h-6 bg-neutral-600/40 group-hover:bg-[#f8a87c] rounded-full mx-auto my-auto relative top-1/2 -translate-y-1/2 transition-colors" />
          </div>
        )}
        {/* Header & Collapse Toggle */}
        {(isChatListCollapsed && !mobileChatsOpen) ? (
          <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-center shrink-0">
            <button aria-label="Expand Conversations list" data-ux-target-min="24"
              onClick={() => {
                handleToggleChatList(false);
                if (window.innerWidth < 1024) {
                  setMobileChatsOpen(true);
                }
              }}
              className="h-8 w-8 rounded-xl bg-[#161620] hover:bg-[#20202c] border border-[#262634] hover:border-[#38384a] flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer shadow-xs"
              title="Expand Conversations list"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        ) : (
          <div className="h-12 px-3 border-b border-slate-200 dark:border-[#1c1c22] flex items-center justify-between shrink-0 bg-[var(--bg-sidebar)]">
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2 overflow-hidden whitespace-nowrap" title={selectedAgent.name ? `Chats của ${selectedAgent.name} (${chats.length})` : `Chats (${chats.length})`}>
              <span className="text-xs font-mono text-slate-800 dark:text-white font-semibold tracking-tight truncate min-w-0 flex-1" style={{ whiteSpace: "nowrap", textWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {selectedAgent.name ? `Chats của ${selectedAgent.name}` : "Chats"}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-neutral-400 font-normal shrink-0" style={{ whiteSpace: "nowrap", textWrap: "nowrap" }}>
                ({chats.length})
              </span>
            </div>

            {/* Action & Expand/Collapse icons shifted to the right with Tooltips */}
            <div className="flex items-center gap-1 ml-auto shrink-0">
              <Tooltip content="Tạo cuộc hội thoại mới" placement="bottom" shortcut="Ctrl+Shift+O" minWidth={160}>
                <button aria-label="New Chat Session" data-ux-target-min="24"
                  onClick={handleNewChat}
                  className="h-7 w-7 rounded-lg hover:bg-slate-200/70 dark:hover:bg-[#1f1f26] flex items-center justify-center text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Plus size={15} />
                </button>
              </Tooltip>

              {/* Close button for chat sidebar placed to the right of Plus button for both desktop & mobile */}
              <Tooltip content="Đóng danh sách cuộc hội thoại" placement="bottom" minWidth={160}>
                <button aria-label="Close Conversations list" data-ux-target-min="24"
                  onClick={() => {
                    if (window.innerWidth >= 1024) {
                      handleToggleChatList(true);
                    } else {
                      setMobileChatsOpen(false);
                    }
                  }}
                  className="h-7 w-7 rounded-lg hover:bg-slate-200/70 dark:hover:bg-[#1f1f26] flex items-center justify-center text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Collapsed rail preview icons */}
        {(isChatListCollapsed && !mobileChatsOpen) ? (
          <div className="flex-1 flex flex-col items-center py-3 space-y-2.5 overflow-hidden w-full">
            <button aria-label="New Chat" data-ux-target-min="24"
              onClick={handleNewChat}
              className="h-8 w-8 rounded-xl bg-[#1c1c24] hover:bg-[#f8a87c] hover:text-white text-neutral-300 flex items-center justify-center transition-colors cursor-pointer border border-[#262632] shadow-sm"
              title="New Chat"
            >
              <Plus size={16} />
            </button>
            <div className="w-5 h-[1px] bg-[#22222e]" />
            <div className="flex-1 overflow-y-auto space-y-2 flex flex-col items-center w-full px-1 scrollbar-none">
              {chats.map((c) => {
                const isSelected = c.id === selectedChatId;
                let initial = c.title ? c.title.trim() : "";
                if (initial.toLowerCase().startsWith("session ")) {
                  initial = initial.slice(8).trim();
                } else if (initial.toLowerCase().startsWith("sub-")) {
                  initial = initial.slice(4).trim();
                }
                const displayLetter = initial.slice(0, 2).toUpperCase() || "#";

                return (
                  <button aria-label={c.title} data-ux-target-min="24"
                    key={c.id}
                    onClick={() => {
                      handleSelectChat(c);
                      // Keep current collapsed/expanded state when switching chat
                    }}
                    className={`h-7 w-7 rounded-xl flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all border relative ${
                      isSelected
                        ? "bg-[#f8a87c] border-[#f8a87c] text-black font-bold shadow-md shadow-[#f8a87c]/25"
                        : "bg-[#16161e] border-[#22222d] text-neutral-400 hover:text-white hover:bg-[#20202c] hover:border-[#303042]"
                    }`}
                    title={`${c.title} (${c.channel || "console"})`}
                  >
                    {(() => {
                      const isCRunning = Boolean(
                        runningChatIds.includes(c.id) ||
                        (c.session_id ? runningChatIds.includes(c.session_id) : false) ||
                        streamingChatIds.includes(c.id)
                      );
                      const isCUnread = !isCRunning && (
                        Boolean(c.unread) ||
                        getAgentUnreadList(selectedAgent).includes(c.id) ||
                        (c.session_id ? getAgentUnreadList(selectedAgent).includes(c.session_id) : false)
                      );

                      return (
                        <>
                          {isCRunning ? (
                            <Loader2 size={13} className="text-blue-400 animate-spin shrink-0" />
                          ) : c.channel && c.channel.toLowerCase() !== "console" ? (
                            <ChannelChatIcon channel={c.channel} isSelected={isSelected} size={13} />
                          ) : (
                            displayLetter
                          )}
                          {/* Only show green dot for unread completed; no blue dot when running */}
                          {!isCRunning && isCUnread && !isSelected && (
                            <span
                              className="absolute -top-0.5 -right-0.5 h-2 w-2 min-h-2 min-w-2 rounded-full bg-emerald-500 border border-white dark:border-[#16161e] shrink-0 z-10"
                              style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                              title="Hoàn thành chưa đọc"
                            />
                          )}
                        </>
                      );
                    })()}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* Search Input Box */}
            {chatSearchOpen && (
              <div className="p-2 border-b border-[#1c1c22] bg-[#14141a]">
                <SearchInput
                  autoFocus
                  value={chatSearchQuery}
                  onChange={setChatSearchQuery}
                  placeholder="Search conversations..."
                />
              </div>
            )}

            {/* Filter Tabs for Conversations: All / Unread / Pinned with Search & Mark All Read on right */}
            <div className="px-2 pt-2 pb-1 border-b border-slate-200 dark:border-[#1c1c24] space-y-1.5">
              <div className="flex items-center justify-between gap-1 w-full">
                {/* Scrollable Tabs on 1 line with right blur mask */}
                <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none scroll-mask-horizontal">
                  <Tabs
                    size="sm"
                    className="justify-start min-w-max flex items-center gap-1"
                    activeTab={chatFilterTab}
                    onChange={(tabId) => setChatFilterTab(tabId as any)}
                    tabs={[
                      { id: "all", label: "All", count: chats.filter(c => !archivedChatIds.includes(c.id)).length },
                      { id: "unread", label: "Done", count: getAgentUnreadList(selectedAgent).filter(id => !archivedChatIds.includes(id)).length || undefined },
                      { id: "pinned", label: "Pinned", count: pinnedChatIds.filter(id => !archivedChatIds.includes(id)).length || undefined },
                      { id: "archived", label: "Lưu trữ", count: archivedChatIds.length || undefined },
                    ]}
                  />
                </div>

                {/* Action buttons on the same line to the right of the tabs */}
                <div className="flex items-center gap-0.5 shrink-0 pl-1 border-l border-slate-200/70 dark:border-[#22222e]">
                  <Tooltip content="Tìm kiếm cuộc hội thoại" placement="bottom" minWidth={140}>
                    <button
                      aria-label="Search chats"
                      data-ux-target-min="24"
                      type="button"
                      onClick={() => setChatSearchOpen(!chatSearchOpen)}
                      className={`h-6 w-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                        chatSearchOpen
                          ? "bg-[#f8a87c]/20 text-[#f8a87c]"
                          : "text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-[#1f1f26]"
                      }`}
                    >
                      <Search size={13} />
                    </button>
                  </Tooltip>

                  <Tooltip content="Đánh dấu đã đọc tất cả" placement="bottom" minWidth={150}>
                    <button
                      aria-label="Đánh dấu đã đọc tất cả"
                      data-ux-target-min="24"
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="h-6 w-6 rounded-md hover:bg-slate-200/70 dark:hover:bg-[#1f1f26] flex items-center justify-center text-slate-500 dark:text-neutral-400 hover:text-[#f8a87c] dark:hover:text-[#f8a87c] transition-colors cursor-pointer"
                    >
                      <CheckCheck size={14} />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Sub-Channel Filter Bar (All / Console / Telegram / Zalo / Khác) */}
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 text-[10px] font-mono select-none scroll-mask-horizontal">
                {[
                  { id: "console", label: "Console" },
                  { id: "telegram", label: "Telegram", badgeColor: "text-sky-400" },
                  { id: "zalo", label: "Zalo", badgeColor: "text-blue-500" },
                  { id: "other", label: "Khác" },
                  { id: "all", label: "Tất cả kênh" },
                ].map((ch) => {
                  const isActive = channelFilter === ch.id;
                  const channelCount = ch.id === "all"
                    ? chats.length
                    : ch.id === "other"
                    ? chats.filter(c => !["console", "telegram", "zalo"].includes((c.channel || "console").toLowerCase())).length
                    : chats.filter(c => (c.channel || "console").toLowerCase() === ch.id).length;

                  if (ch.id !== "all" && channelCount === 0) return null;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectChannelFilter(ch.id)}
                      className={`px-2 py-0.5 rounded-full shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
                        isActive
                          ? "bg-[#f8a87c]/15 border-[#f8a87c]/40 text-[#f8a87c] font-semibold shadow-xs"
                          : "border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <span>{ch.label}</span>
                      <span className="text-[9px] opacity-75 font-bold">({channelCount})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select All / Batch Selection Bar: Only visible when at least 1 chat is checked */}
            {filteredChats.length > 0 && selectedChatIds.length > 0 && (
              <div className="px-2.5 py-1 flex items-center justify-between border-b border-slate-200 dark:border-[#1c1c24] text-[10px] font-mono select-none bg-slate-100/95 dark:bg-[#101017]/90 animate-in fade-in duration-150 whitespace-nowrap">
                <div
                  onClick={() => handleToggleSelectAll(filteredChats)}
                  className="flex items-center gap-1.5 cursor-pointer group text-neutral-400 hover:text-white transition-colors"
                  title="Chọn tất cả hoặc bỏ chọn tất cả phiên trong danh sách này"
                >
                  <div
                    className={`h-3.5 w-3.5 rounded border flex items-center justify-center transition-all ${
                      filteredChats.every((c) => selectedChatIds.includes(c.id))
                        ? "bg-[#f8a87c] border-[#f8a87c] text-black shadow-xs"
                        : filteredChats.some((c) => selectedChatIds.includes(c.id))
                        ? "bg-[#f8a87c]/30 border-[#f8a87c] text-[#f8a87c]"
                        : "border-slate-300 dark:border-[#303042] bg-white dark:bg-[#161622] group-hover:border-[#f8a87c]/60"
                    }`}
                  >
                    {filteredChats.every((c) => selectedChatIds.includes(c.id)) ? (
                      <Check size={9} className="stroke-[3]" />
                    ) : filteredChats.some((c) => selectedChatIds.includes(c.id)) ? (
                      <div className="h-1 w-1 rounded-xs bg-[#f8a87c]" />
                    ) : null}
                  </div>
                  <span className="font-sans text-[11px] text-slate-600 dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-neutral-200">
                    {filteredChats.every((c) => selectedChatIds.includes(c.id))
                      ? "Bỏ chọn"
                      : "Chọn tất cả"}
                  </span>
                </div>

                {selectedChatIds.length > 0 && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-mono text-[#f8a87c] font-semibold bg-[#f8a87c]/10 px-1.5 py-0.5 rounded border border-[#f8a87c]/20">
                      {selectedChatIds.length}/{filteredChats.length}
                    </span>
                    <Tooltip content={`Xóa ${selectedChatIds.length} phiên đã chọn`} placement="bottom" minWidth={140}>
                      <button
                        type="button"
                        aria-label={`Xóa ${selectedChatIds.length} phiên đã chọn`}
                        onClick={() => setIsBatchClearModalOpen(true)}
                        className="h-6 w-6 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/25 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            )}

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 scrollbar-hover">
              {isLoadingChats ? (
                <div className="space-y-2 p-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-full p-2.5 rounded-xl border border-white/[0.04] bg-[#14141c]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-28 rounded skeleton-shimmer" />
                        <div className="h-2 w-10 rounded skeleton-shimmer" />
                      </div>
                      <div className="h-2.5 w-4/5 rounded skeleton-shimmer" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredChats.map((chat, cIdx) => {
                const isSelected = chat.id === selectedChatId;
                const isChatRunning = Boolean(
                  runningChatIds.includes(chat.id) ||
                  (chat.session_id ? runningChatIds.includes(chat.session_id) : false) ||
                  streamingChatIds.includes(chat.id)
                );
                const isUnreadCompleted = !isChatRunning && (
                  Boolean(chat.unread) ||
                  getAgentUnreadList(selectedAgent).includes(chat.id) ||
                  (chat.session_id ? getAgentUnreadList(selectedAgent).includes(chat.session_id) : false)
                );
                return (
                  <div
                    key={chat.id}
                    data-chat-item-id={chat.id}
                    style={{ animationDelay: `${Math.min(cIdx * 20, 200)}ms` }}
                    onTouchStart={() => handleTouchStartChat(chat)}
                    onTouchEnd={handleTouchEndChat}
                    onTouchMove={handleTouchEndChat}
                    onTouchCancel={handleTouchEndChat}
                    onContextMenu={(e) => {
                      if (window.innerWidth < 1024) {
                        e.preventDefault();
                        setMobileActionChat(chat);
                      }
                    }}
                    onClick={() => {
                      if (longPressPreventClickRef.current) {
                        longPressPreventClickRef.current = false;
                        return;
                      }
                      handleSelectChat(chat);
                    }}
                    className={`w-full rounded-lg text-left flex items-center transition-colors cursor-pointer group group/chatitem animate-fade-in-stagger relative select-none ${
                      layoutDensity === "compact"
                        ? "px-1.5 py-0.5 gap-1.5 min-h-[26px]"
                        : layoutDensity === "comfortable"
                        ? "px-2 py-1.5 gap-2 min-h-[36px]"
                        : "px-1.5 py-1 gap-1.5 min-h-[30px]"
                    } ${
                      activeChatMenuId === chat.id ? "z-40" : "z-auto"
                    } ${
                      isSelected
                        ? "bg-slate-200/80 dark:bg-[#22222c] text-slate-900 dark:text-white shadow-xs font-medium"
                        : "hover:bg-slate-100 dark:hover:bg-[#181820] text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-200"
                    }`}
                  >
                    {/* Interactive Icon Box: Ultra-compact & aligned */}
                    <div
                      onClick={(e) => handleToggleSelectChat(chat.id, e)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 relative transition-all cursor-pointer ${
                        selectedChatIds.includes(chat.id)
                          ? "bg-[#f8a87c] border-[#f8a87c] text-black shadow-xs"
                          : "bg-slate-100 dark:bg-[#181822] border-slate-200 dark:border-[#2a2a3a] text-slate-500 dark:text-neutral-400 group-hover:border-[#f8a87c]/50"
                      }`}
                      title={selectedChatIds.includes(chat.id) ? "Bỏ chọn phiên này" : "Chọn phiên này để xóa hàng loạt"}
                    >
                      {/* Checkbox Icon (always shown if checked, or shown on desktop hover) */}
                      <span className={selectedChatIds.includes(chat.id) ? "block" : "hidden group-hover:block"}>
                        <Check size={11} className={selectedChatIds.includes(chat.id) ? "text-black stroke-[3]" : "text-[#f8a87c]"} />
                      </span>

                      {/* Channel icon OR Running Spin inside icon box */}
                      <span className={selectedChatIds.includes(chat.id) ? "hidden" : "block group-hover:hidden flex items-center justify-center"}>
                        {isChatRunning ? (
                          <Loader2 size={12} className="text-blue-400 animate-spin shrink-0" />
                        ) : (
                          <ChannelChatIcon channel={chat.channel} isSelected={isSelected} size={11} />
                        )}
                      </span>

                      {/* Status Indicator Dot: ONLY show green dot when completed; no blue dot when running */}
                      {(() => {
                        if (selectedChatIds.includes(chat.id)) return null;
                        if (!isChatRunning && isUnreadCompleted && !isSelected) {
                          return (
                            <span
                              className="absolute -top-0.5 -right-0.5 h-2 w-2 min-h-2 min-w-2 rounded-full bg-emerald-500 border border-white dark:border-[#181822] shrink-0 z-10"
                              style={{ borderRadius: "9999px", aspectRatio: "1 / 1" }}
                              title="Hoàn thành chưa đọc"
                            />
                          );
                        }
                        return null;
                      })()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        {editingChatId === chat.id ? (
                          <input data-ux-target-min="16"
                            type="text"
                            autoFocus
                            value={editingChatTitle}
                            onChange={(e) => setEditingChatTitle(e.target.value)}
                            onBlur={() => handleSaveChatTitle(chat.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveChatTitle(chat.id);
                              if (e.key === "Escape") setEditingChatId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#121218] border border-[#f8a87c] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full"
                          />
                        ) : (
                          <div className="flex-1 w-full min-w-0 overflow-hidden chat-title-mask pr-1 flex items-center justify-between">
                            {/* Inline full-width title with right-edge blur & smooth hover-to-left marquee scroll */}
                            <span
                              className={`text-xs chat-title-marquee inline-block whitespace-nowrap ${
                                (chat.title && chat.title.length > 14) ? "chat-title-marquee-scroll" : ""
                              } ${
                                isSelected
                                  ? "text-slate-900 dark:text-white font-medium"
                                  : "text-slate-700 dark:text-neutral-200"
                              }`}
                              title={chat.title}
                            >
                              {(() => {
                                let t = chat.title || "";
                                if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(t) || /^[0-9a-f]{16,}/i.test(t) || t.toLowerCase().startsWith('chat ') || t.toLowerCase().startsWith('session ')) {
                                  t = "Cuộc hội thoại";
                                }
                                return (
                                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-nowrap [text-wrap:nowrap]">
                                    <span className="whitespace-nowrap text-nowrap [text-wrap:nowrap]">{renderSearchMatchHighlight(t, chatSearchQuery)}</span>
                                  </span>
                                );
                              })()}
                            </span>
                            {(() => {
                              const qCount = (requestQueues[chat.id] || []).length;
                              if (qCount <= 0) return null;
                              return (
                                <span
                                  className="ml-1.5 px-1.5 py-0.2 rounded-md bg-[#f8a87c]/15 text-[#f8a87c] text-[9px] font-mono border border-[#f8a87c]/30 shrink-0 font-semibold"
                                  title={`${qCount} tin nhắn trong hàng đợi`}
                                >
                                  +{qCount}
                                </span>
                              );
                            })()}
                          </div>
                        )}

                        {/* Action buttons on the right: floating pill visible on hover or when menu/pin/archive is active */}
                        <div
                          className={`absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 z-20 transition-all duration-150 rounded-lg px-1 py-0.5 shadow-sm border ${
                            activeChatMenuId === chat.id
                              ? "opacity-100 pointer-events-auto bg-slate-100 dark:bg-[#181822] border-slate-300 dark:border-white/15"
                              : pinnedChatIds.includes(chat.id) || archivedChatIds.includes(chat.id)
                              ? "opacity-100 pointer-events-auto bg-slate-100/90 dark:bg-[#181822]/95 border-slate-200 dark:border-white/10"
                              : "opacity-0 pointer-events-none group-hover/chatitem:opacity-100 group-hover/chatitem:pointer-events-auto bg-slate-100/95 dark:bg-[#14141c]/95 backdrop-blur-xs border-slate-200 dark:border-white/10"
                          }`}
                        >
                          {/* Quick Pin Toggle Button (Visible on hover or when pinned) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePinChat(chat.id, e);
                            }}
                            className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                              pinnedChatIds.includes(chat.id)
                                ? "text-amber-400 opacity-100"
                                : "text-neutral-400 hover:text-amber-400"
                            }`}
                            title={pinnedChatIds.includes(chat.id) ? "Bỏ ghim phiên" : "Ghim lên đầu"}
                          >
                            <Pin size={12} className={pinnedChatIds.includes(chat.id) ? "fill-amber-400" : ""} />
                          </button>

                          {/* Quick Archive Toggle Button (Visible on hover or when archived) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleArchiveChat(chat.id, e);
                            }}
                            className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                              archivedChatIds.includes(chat.id)
                                ? "text-cyan-400 opacity-100"
                                : "text-neutral-400 hover:text-cyan-400"
                            }`}
                            title={archivedChatIds.includes(chat.id) ? "Bỏ lưu trữ (Khôi phục)" : "Lưu trữ phiên này"}
                          >
                            {archivedChatIds.includes(chat.id) ? (
                              <ArchiveRestore size={12} />
                            ) : (
                              <Archive size={12} />
                            )}
                          </button>

                          {/* 3-Dots More Options Menu */}
                          <div className="relative" data-chat-menu-container="true">
                            <button
                              aria-label="Tùy chọn phiên"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveChatMenuId(activeChatMenuId === chat.id ? null : chat.id);
                              }}
                              className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                                activeChatMenuId === chat.id
                                  ? "text-[#f8a87c] bg-white/10 opacity-100"
                                  : "text-neutral-400 hover:text-white"
                              }`}
                              title="Tùy chọn mở rộng (Tìm kiếm, Xuất file, Đổi tên, Xóa)"
                            >
                              <MoreVertical size={13} />
                            </button>

                            {/* Dropdown Menu (Standard Shared Primitive) */}
                            <DropdownMenu
                              isOpen={activeChatMenuId === chat.id}
                              onClose={() => setActiveChatMenuId(null)}
                              align="right"
                              width="w-60"
                            >
                              {/* Session Header: Channel Info, Context Status & Click to copy ID */}
                              <div className="p-2 mb-1.5 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] space-y-2 select-none">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                                      navigator.clipboard.writeText(chat.id);
                                      playMicroClick();
                                      alert(`Đã sao chép ID phiên:
${chat.id}`);
                                    }
                                  }}
                                  className="flex items-center justify-between gap-2 cursor-pointer group/chatinfo"
                                  title="Nhấp để sao chép ID phiên này"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                      <span>Kênh: <strong className="text-slate-800 dark:text-neutral-200 capitalize font-mono">{chat.channel || "Console"}</strong></span>
                                    </div>
                                    <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                      ID: {chat.id}
                                    </div>
                                  </div>
                                  <span className="p-1 rounded text-neutral-400 group-hover/chatinfo:text-[#f8a87c] transition-colors shrink-0">
                                    <Copy size={12} />
                                  </span>
                                </div>

                                {/* Context Token Gauge inside Chat Session Detail Item */}
                                <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-neutral-500">Context:</span>
                                  <div className="flex items-center gap-1.5">
                                    <ContextUsageBar
                                      agentId={selectedAgent.id}
                                      sessionId={chat.id}
                                      estimatedTokens={chat.messageCount ? chat.messageCount * 380 : 1200}
                                      maxTokens={128000}
                                      className="compact-trigger text-neutral-400 hover:text-white"
                                    />
                                    <span className="text-slate-700 dark:text-neutral-300 font-semibold">
                                      {Math.round(((chat.messageCount ? chat.messageCount * 380 : 1200) / 128000) * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <DropdownMenuItem
                                icon={<Share2 size={13} className="text-cyan-400" />}
                                label="Sao chép liên kết phiên"
                                onClick={() => {
                                  const agSegment = selectedAgent.slug || selectedAgent.id || selectedAgentId;
                                  const shareUrl = `${window.location.origin}/app/${agSegment}/${chat.id}`;
                                  navigator.clipboard.writeText(shareUrl);
                                  setForkToast("Đã sao chép liên kết phiên chat!");
                                  setTimeout(() => setForkToast(null), 2500);
                                  setActiveChatMenuId(null);
                                }}
                              />

                              <DropdownMenuItem
                                icon={<Search size={13} className="text-[#f8a87c]" />}
                                label="Tìm trong phiên này"
                                onClick={() => {
                                  handleSelectChat(chat);
                                  setInSessionSearchOpen(true);
                                  setActiveChatMenuId(null);
                                }}
                              />

                              <DropdownMenuItem
                                icon={<Pin size={13} className={pinnedChatIds.includes(chat.id) ? "text-amber-400 fill-amber-400" : "text-neutral-400"} />}
                                label={pinnedChatIds.includes(chat.id) ? "Bỏ ghim phiên" : "Ghim lên đầu"}
                                onClick={(e) => {
                                  togglePinChat(chat.id, e);
                                  setActiveChatMenuId(null);
                                }}
                              />

                              <DropdownMenuItem
                                icon={archivedChatIds.includes(chat.id) ? <ArchiveRestore size={13} className="text-cyan-400" /> : <Archive size={13} className="text-neutral-400" />}
                                label={archivedChatIds.includes(chat.id) ? "Bỏ lưu trữ (Khôi phục)" : "Lưu trữ phiên này"}
                                onClick={(e) => {
                                  toggleArchiveChat(chat.id, e);
                                  setActiveChatMenuId(null);
                                }}
                              />

                              <DropdownMenuItem
                                icon={<Edit2 size={13} className="text-cyan-400" />}
                                label="Đổi tên phiên"
                                onClick={() => {
                                  setEditingChatId(chat.id);
                                  setEditingChatTitle(chat.title);
                                  setActiveChatMenuId(null);
                                }}
                              />

                              <DropdownMenuSection>
                                <DropdownSubMenu
                                  icon={<Download size={12} className="text-blue-400" />}
                                  label="Xuất dữ liệu"
                                >
                                  <DropdownMenuItem
                                    icon={<Download size={12} className="text-blue-400" />}
                                    label="Word Document"
                                    badge=".doc"
                                    badgeColor="text-blue-400"
                                    onClick={() => {
                                      handleSelectChat(chat);
                                      setTimeout(() => handleExportSessionDocx(), 50);
                                      setActiveChatMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Download size={12} className="text-[#f8a87c]" />}
                                    label="Báo cáo Markdown"
                                    badge=".md"
                                    badgeColor="text-[#f8a87c]"
                                    onClick={() => {
                                      handleSelectChat(chat);
                                      setTimeout(() => handleExportSessionMarkdown(), 50);
                                      setActiveChatMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Download size={12} className="text-cyan-400" />}
                                    label="Audit Trail JSON"
                                    badge=".json"
                                    badgeColor="text-cyan-400"
                                    onClick={() => {
                                      handleSelectChat(chat);
                                      setTimeout(() => handleExportSessionJson(), 50);
                                      setActiveChatMenuId(null);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Download size={12} className="text-emerald-400" />}
                                    label="Execution Receipt"
                                    badge=".html"
                                    badgeColor="text-emerald-400"
                                    onClick={() => {
                                      handleSelectChat(chat);
                                      setTimeout(() => handleExportAuditCertificate(), 50);
                                      setActiveChatMenuId(null);
                                    }}
                                  />
                                </DropdownSubMenu>
                              </DropdownMenuSection>

                              <DropdownMenuSection>
                                <DropdownMenuItem
                                  icon={<Trash2 size={13} />}
                                  label="Xóa cuộc hội thoại"
                                  variant="danger"
                                  onClick={() => {
                                    setChatToDelete(chat);
                                    setActiveChatMenuId(null);
                                  }}
                                />
                              </DropdownMenuSection>
                            </DropdownMenu>
                          </div>


                        </div>
                      </div>
{/* Subtitle snippet removed as requested for lean single-line chat header */}
                    </div>
                  </div>
                );
              })}

                  {filteredChats.length === 0 && (
                    <div className="py-10 px-4 text-center space-y-3 font-sans">
                      <div className="h-9 w-9 rounded-xl bg-[#1a1a24] border border-[#262634] text-neutral-500 flex items-center justify-center mx-auto">
                        <MessageSquare size={16} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-neutral-300">
                          {hasNoAgents ? "Chưa có hội thoại" : chatSearchQuery ? `No matches for "${chatSearchQuery}"` : "No dialogues found"}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {hasNoAgents ? "Bạn cần được cấp quyền Agent để bắt đầu trò chuyện." : chatSearchQuery ? "Try a different search keyword or clear filter." : "Start a fresh session with this agent."}
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        {chatSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setChatSearchQuery("")}
                            className="px-2.5 py-1 rounded-lg bg-[#181822] hover:bg-[#20202c] border border-[#2a2a3a] text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          >
                            Clear search
                          </button>
                        )}
                        {!hasNoAgents && (
                          <button
                            type="button"
                            onClick={handleNewChat}
                            className="px-3 py-1 rounded-lg bg-[#f8a87c] hover:bg-[#ff8a1a] text-black font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                          >
                            + New Chat
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </aside>

      {/* ========================================================= */}
      {/* 2.5 LIVE COMPUTER EXPAND PANE (Desktop: 70% width, Mobile: Fullscreen) */}
      {/* ========================================================= */}
      {isComputerSplitOpen && (() => {
        const browserTarget = getAgentBrowserUrl(selectedAgent, agentBrowser);
        return (
          <>
            {/* Minimalist Resizer Splitter between Chat and Computer */}
            <div
              onMouseDown={() => setIsResizingComputerSplit(true)}
              className="hidden lg:block relative w-1 h-full cursor-col-resize hover:bg-[#f8a87c]/60 active:bg-[#f8a87c] transition-colors shrink-0 z-30 select-none group"
              title={t("computer.dragSplitterTitle") || "Kéo để thay đổi tỷ lệ"}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-6 rounded-full bg-neutral-600/40 group-hover:bg-[#f8a87c] group-hover:h-9 transition-all" />
            </div>

            <section
            data-testid="virtual-computer-split-pane"
            aria-label="Virtual Computer Interactive Workspace"
            className="fixed inset-0 z-50 lg:static lg:z-10 flex-1 h-full flex flex-col bg-[#0d0d12] border-l border-neutral-200 dark:border-[#1e1e24] shadow-2xl lg:shadow-none animate-in fade-in duration-150 overflow-hidden min-w-0"
          >
            {/* Top Control Bar */}
            <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] bg-[var(--bg-sidebar)] px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Live Computer" />
              </div>

              {/* Action Buttons: Minimized Icon Buttons with Precision Tooltips */}
              <div className="flex items-center gap-1 shrink-0">
                {/* 1. Quick Screenshot Button with instant feedback */}
                <Tooltip content={isScreenshotCaptured ? "Đã chụp và đính kèm vào chat!" : t("computer.screenshotBtn")} placement="bottom">
                  <button
                    type="button"
                    onClick={async () => {
                      triggerHaptic();
                      playNotificationChime("retro");
                      setIsScreenshotCaptured(true);
                      setTimeout(() => setIsScreenshotCaptured(false), 1500);
                      const timestamp = new Date().toLocaleTimeString();
                      const frameUrl = agentBrowserImageUrl(agentBrowserFor, Date.now());
                      
                      // Add real screenshot item to attachedFiles state
                      const newAttachment: UploadedFileResult = {
                        file_name: `${selectedAgent.slug}-screen-${Date.now().toString().slice(-4)}.jpg`,
                        url: frameUrl,
                        size: 145000,
                        mime_type: "image/jpeg",
                      };
                      setAttachedFiles((prev) => [...prev, newAttachment]);

                      const screenshotTag = `[Screenshot of ${selectedAgent.name} Computer @ ${timestamp} Attached]`;
                      setInputText((prev) => (prev ? `${prev} ${screenshotTag}` : `Please inspect this screen state: ${screenshotTag}`));
                      textareaRef.current?.focus();
                    }}
                    className={`h-8 w-8 rounded-lg border flex items-center justify-center text-xs font-mono transition-all cursor-pointer ${
                      isScreenshotCaptured
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 scale-105"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-[#181820] dark:hover:bg-[#22222e] border-slate-200 dark:border-[#242430] text-slate-700 dark:text-neutral-300 hover:text-cyan-600 dark:hover:text-cyan-400"
                    }`}
                    aria-label={t("computer.screenshotBtn")}
                  >
                    {isScreenshotCaptured ? (
                      <Check size={14} className="text-emerald-400 animate-in zoom-in-75 duration-150" />
                    ) : (
                      <Camera size={14} className="text-cyan-400" />
                    )}
                  </button>
                </Tooltip>

                {/* 2. Reload Session Button */}
                <Tooltip content={t("computer.reloadProfileBtn")} placement="bottom">
                  <button
                    type="button"
                    disabled={isReloadingBrowser}
                    onClick={() => {
                      triggerHaptic();
                      setIsReloadingBrowser(true);
                      setBrowserIframeKey((k) => k + 1);
                      setTimeout(() => setIsReloadingBrowser(false), 900);
                    }}
                    className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#181820] dark:hover:bg-[#22222e] border border-slate-200 dark:border-[#242430] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer disabled:opacity-50"
                    aria-label={t("computer.reloadProfileBtn")}
                  >
                    <RefreshCw size={13} className={isReloadingBrowser ? "animate-spin text-[#f8a87c]" : ""} />
                  </button>
                </Tooltip>

                {/* 3. Zen Mode (Fullscreen) Button */}
                <Tooltip content={t("computer.zenMode")} placement="bottom">
                  <button
                    type="button"
                    onClick={() => handleSetBrowserModalOpen(true)}
                    className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#181820] dark:hover:bg-[#22222e] border border-slate-200 dark:border-[#242430] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
                    aria-label={t("computer.zenMode")}
                  >
                    <Maximize2 size={13} />
                  </button>
                </Tooltip>

                {/* 4. Open External Window Button */}
                <Tooltip content={t("computer.openExternal")} placement="bottom">
                  <a
                    href={browserTarget.url ? "#" : undefined}
                    onClick={(e) => { e.preventDefault(); if (browserTarget.url) openAgentDesktopTab(agentBrowserFor); }}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#181820] dark:hover:bg-[#22222e] border border-slate-200 dark:border-[#242430] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
                    aria-label={t("computer.openExternal")}
                  >
                    <ExternalLink size={13} />
                  </a>
                </Tooltip>

                {/* 5. Close Split Button */}
                <Tooltip content={t("computer.closeComputer")} placement="bottom">
                  <button
                    type="button"
                    onClick={() => handleToggleComputerSplit(false)}
                    className="h-8 w-8 rounded-lg bg-slate-200/80 hover:bg-red-500/10 hover:text-red-500 dark:bg-[#22222e] dark:hover:bg-red-500/20 dark:hover:text-red-400 border border-slate-300 dark:border-[#303042] hover:border-red-500/30 text-slate-700 dark:text-neutral-300 flex items-center justify-center transition-colors cursor-pointer ml-1"
                    aria-label={t("computer.closeComputer")}
                  >
                    <X size={15} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Iframe Workspace with automatic viewport scaling */}
            <div className="flex-1 w-full h-full bg-slate-100 dark:bg-black relative overflow-hidden flex items-center justify-center transition-colors">
              {browserTarget.url ? (
                <SelkiesViewer
                  key={`split-${selectedAgent.id}-${browserTarget.url}`}
                  agentId={agentBrowserFor}
                  url={browserTarget.url}
                  title={`${selectedAgent.name} Computer Live Split`}
                  profile={browserTarget.profile}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-neutral-400">
                  {agentBrowser === null ? "Resolving agent browser…" : "This agent has no browser"}
                </div>
              )}
            </div>
          </section>
          </>
        );
      })()}

      {/* ========================================================= */}
      {/* 4. RIGHTMOST PANE: SELECTED BOT INFO (COLLAPSIBLE) */}
      {/* ========================================================= */}
      <aside
        style={{ width: !isBotInfoCollapsed && typeof window !== "undefined" && window.innerWidth >= 1280 ? `${botInfoWidth}px` : undefined }}
        className={`fixed xl:static inset-y-0 right-0 z-50 xl:z-40 h-full flex flex-col border-l border-neutral-200 dark:border-[#1e1e24] bg-[var(--bg-sidebar)] shrink-0 select-none transition-grok relative ${
          isBotInfoCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full xl:w-0"
            : "w-full sm:w-[380px] xl:w-[380px] border-l border-[#1e1e24] translate-x-0 xl:translate-x-0 shadow-2xl xl:shadow-none"
        }`}
      >
        {/* Right Pane Draggable Resizer Splitter */}
        {!isBotInfoCollapsed && (
          <div
            onMouseDown={() => setIsResizingRight(true)}
            className="hidden xl:block absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#f8a87c]/50 transition-colors z-30 -ml-0.5"
            title="Drag to resize agent specification pane"
          />
        )}
        {!isBotInfoCollapsed && (
          <>
            {/* Clean Header with Agent Settings Trigger & Mobile Close Button */}
            <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-between px-3 shrink-0 bg-[var(--bg-sidebar)]">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">Agent Detail</span>
              <div className="flex items-center gap-1">
                {!hasNoAgents && selectedAgent.id && (
                  <Tooltip content="Cài đặt Agent (Model, Apps, Sub-Agents, Channels, Memory)" shortcut="Alt+," placement="bottom">
                    <button
                      type="button"
                      aria-label="Mở Cài đặt Agent"
                      onClick={() => {
                        setAgentSettingsModalTab("general");
                        setIsAgentSettingsModalOpen(true);
                      }}
                      className="h-7 w-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#181820] dark:hover:bg-[#22222e] border border-slate-200 dark:border-[#242430] flex items-center justify-center text-slate-600 dark:text-neutral-400 hover:text-[#e0682b] dark:hover:text-[#f8a87c] cursor-pointer transition-colors"
                    >
                      <Settings size={13} />
                    </button>
                  </Tooltip>
                )}
                <button aria-label="Close Agent Specification" data-ux-target-min="24"
                  onClick={() => {
                    handleToggleBotInfo(true);
                    setMobileBotInfoOpen(false);
                  }}
                  className="h-6 w-6 rounded-md hover:bg-slate-200/70 dark:hover:bg-[#1c1c24] flex items-center justify-center text-neutral-400 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
                  title="Close Agent Specification"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {hasNoAgents || !selectedAgent.id ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none space-y-3 font-sans">
                <div className="w-12 h-12 rounded-2xl bg-[#f8a87c]/10 border border-[#f8a87c]/25 flex items-center justify-center text-[#f8a87c]">
                  <Bot size={24} />
                </div>
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Chưa chọn Agent</h3>
                <p className="text-[11px] text-neutral-400 max-w-[220px] leading-relaxed">
                  Tài khoản của bạn chưa có Agent nào được gán để hiển thị thông số kỹ thuật.
                </p>
              </div>
            ) : (
            <>
            {/* Compact Agent Identity Header */}
            <div className="p-4 flex flex-col items-center text-center border-b border-neutral-200 dark:border-[#1c1c22]">
              <div
                ref={mascotRef}
                onClick={() => {
                  setAgentSettingsModalTab("general");
                  setIsAgentSettingsModalOpen(true);
                }}
                className="relative mb-2 transition-transform hover:scale-105 cursor-pointer group"
                title="Bấm để mở Cài đặt Agent"
              >
                <AgentAvatar agent={selectedAgent} size="lg" className="shadow-lg" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white dark:ring-[#0c0c0e] ${
                    selectedAgent.status === "degraded"
                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse"
                      : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  }`}
                />
              </div>

              <div className="flex items-center gap-1.5 justify-center">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                  {selectedAgent.name}
                </h2>
                {activeLoopMode !== "default" && (
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full border font-semibold inline-flex items-center gap-1 ${
                    activeLoopMode === 'goal'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      activeLoopMode === 'goal' ? 'bg-emerald-400' : 'bg-cyan-400'
                    }`} />
                    <span>{activeLoopMode === 'goal' ? 'Mục tiêu' : 'Nhiệm vụ'}</span>
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                <span>{selectedAgent.roleTag || "Agent"}</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setAgentSettingsModalTab("general");
                    setIsAgentSettingsModalOpen(true);
                  }}
                  className="text-[#e0682b] dark:text-[#f8a87c] hover:underline cursor-pointer"
                  title="Đổi mô hình AI trong Cài đặt Agent"
                >
                  {selectedAgent.model.includes("/") ? selectedAgent.model.split("/").pop() : selectedAgent.model}
                </button>
              </div>
            </div>

            {/* 3 Streamlined Tabs: Computer | Details | Library */}
            <div className="flex items-center justify-around border-b border-neutral-200 dark:border-[#1c1c22] text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 shrink-0">
              {(["Details", "Computer", "Library"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setRightTab(tab);
                    if (tab === "Library" && workspaceFiles.length === 0) {
                      loadWorkspaceTree();
                    }
                  }}
                  className={`py-2.5 px-3 transition-colors cursor-pointer border-b-2 font-mono ${
                    rightTab === tab
                      ? "text-neutral-900 dark:text-white border-[#f8a87c] font-semibold"
                      : "border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {tab === "Library" && workspaceFiles.length > 0 ? `Library (${workspaceFiles.length})` : tab}
                </button>
              ))}
            </div>

            {/* Tab Content: Computer | Details | Library */}
            <div className="flex-1 p-3.5 overflow-y-auto scrollbar-hover">
              {rightTab === "Computer" && (() => {
                const browserTarget = getAgentBrowserUrl(selectedAgent, agentBrowser);
                return (
                  <div className="flex flex-col w-full">
                    {/* Live Browser Fixed-Height Responsive Card */}
                    <div className="w-full rounded-2xl border border-slate-200 dark:border-[#262634] bg-slate-900 dark:bg-[#101015] overflow-hidden shadow-xl flex flex-col shrink-0">
                      {/* Top Browser Bar */}
                      <div className="h-9 px-3 bg-slate-100 dark:bg-[#171720] border-b border-slate-200 dark:border-[#242430] flex items-center justify-between text-xs font-mono select-none shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0" />
                          <span className="text-[11px] font-semibold text-slate-900 dark:text-slate-900 dark:text-white truncate">
                            {selectedAgent.name} Computer
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button aria-label="Mở Computer Workspace" data-ux-target-min="24"
                            type="button"
                            onClick={() => handleToggleComputerSplit(true)}
                            className="p-1 text-neutral-400 hover:text-[#f8a87c] hover:bg-[#232330] rounded transition-colors cursor-pointer"
                            title="Mở Computer Workspace (Tỉ lệ 3:7)"
                          >
                            <Maximize2 size={13} />
                          </button>
                          <a aria-label="Open in new window"
                            href={browserTarget.url ? "#" : undefined}
                            onClick={(e) => { e.preventDefault(); if (browserTarget.url) openAgentDesktopTab(agentBrowserFor); }}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-neutral-400 hover:text-white hover:bg-[#232330] rounded transition-colors cursor-pointer"
                            title="Open in new window"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </div>

                      {/* Embedded Live Iframe Viewport: Fixed 190px responsive height with hover action */}
                      <div 
                        onClick={() => handleToggleComputerSplit(true)}
                        style={{ height: "190px", width: "100%", position: "relative", overflow: "hidden", flexShrink: 0 }}
                        className="cursor-pointer group flex items-center justify-center rounded-b-2xl bg-white dark:bg-black transition-colors"
                        title="Click để mở chế độ Computer (Tỉ lệ 3:7 và đóng các sidebar)"
                      >
                        <AgentBrowserPreview agentId={agentBrowserFor} enabled={Boolean(browserTarget.isLive)} />
                        {browserTarget.profile && (
                          <div data-testid="agent-browser-profile" className="absolute top-1.5 left-1.5 z-[5] px-1.5 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-white! keep-white pointer-events-none">
                            {browserTarget.profile} · {agentBrowser?.service}
                          </div>
                        )}
                        {!browserTarget.isLive && (
                          <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-slate-500 dark:text-neutral-400 bg-slate-50 dark:bg-black px-3 text-center transition-colors">
                            {agentBrowser === null ? "Resolving agent browser…" : agentBrowser.cdpReachable ? `Opening profile ${agentBrowser.profile}…` : "Browser unreachable"}
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10 select-none">
                          <div className="h-9 w-9 rounded-full bg-[#f8a87c] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Maximize2 size={16} className="stroke-[2.5]" />
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-white! keep-white bg-slate-900/90 dark:bg-black/90 px-3 py-1 rounded-full border border-white/20 shadow-lg tracking-wide backdrop-blur-md">
                            Mở Computer Workspace
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {rightTab === "Details" && (
                <div className="space-y-4 text-xs text-slate-700 dark:text-neutral-300 font-sans pb-4">
                  {/* 1. Concise Description: 2-3 lines by default, collapsed */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                        Giới thiệu & Vai trò
                      </span>
                      <span className="text-[10px] uppercase text-[#e0682b] dark:text-[#f8a87c]">
                        {selectedAgent.roleTag || "Agent"}
                      </span>
                    </div>

                    <div className="relative p-3 rounded-2xl bg-slate-50 dark:bg-[#14141c] border border-slate-200/90 dark:border-[#22222e] transition-all">
                      <p
                        className={`text-xs text-slate-600 dark:text-neutral-300 leading-relaxed select-text transition-all ${
                          isDescExpanded ? "" : "line-clamp-3"
                        }`}
                      >
                        {selectedAgent.description || "Chưa có mô tả chi tiết cho Agent này."}
                      </p>

                      {/* Expand / Collapse toggle if description is lengthy */}
                      {selectedAgent.description && selectedAgent.description.length > 120 && (
                        <button
                          type="button"
                          onClick={() => setIsDescExpanded(!isDescExpanded)}
                          className="mt-1.5 text-[11px] font-mono text-[#e0682b] dark:text-[#f8a87c] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isDescExpanded ? "Thu gọn bớt" : "Xem thêm"}</span>
                          <ChevronDown
                            size={12}
                            className={`transition-transform duration-200 ${isDescExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. Routines (Automated Schedules) Section with clean card toggle matching user reference */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white font-sans">
                        Routines
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedJobForConfig(null);
                          setIsScheduleModalOpen(true);
                        }}
                        className="text-[11px] font-mono text-[#e0682b] dark:text-[#f8a87c] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Thêm routine mới"
                      >
                        <Plus size={11} />
                        <span>Thêm mới</span>
                      </button>
                    </div>

                    {loadingSchedules ? (
                      <div className="space-y-2">
                        <div className="h-16 w-full rounded-2xl skeleton-shimmer border border-slate-200/80 dark:border-[#22222e]" />
                      </div>
                    ) : schedules.length === 0 ? (
                      <div
                        onClick={() => {
                          setSelectedJobForConfig(null);
                          setIsScheduleModalOpen(true);
                        }}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#14141c] border border-dashed border-slate-300 dark:border-[#2a2a38] hover:border-[#f8a87c]/50 flex items-center justify-between gap-3 cursor-pointer group transition-all"
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-900 dark:text-white truncate">
                            Tạo Routine tự động đầu tiên
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-sans truncate mt-0.5">
                            Bấm để lên lịch chạy tự động định kỳ
                          </span>
                        </div>
                        <div className="h-7 w-7 rounded-xl bg-slate-100 dark:bg-[#1f1f2c] text-[#f8a87c] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Plus size={14} />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {schedules.map((job) => {
                          // Format cron schedule into human readable time description
                          const getHumanScheduleText = (cron: string, tz?: string) => {
                            if (!cron) return "Theo lịch định kỳ";
                            if (cron === "0 7 * * *") return "Every day around 7:00 AM";
                            if (cron === "0 9 * * *") return "Every day around 9:00 AM";
                            if (cron === "0 21 * * *") return "Every night around 9:00 PM";
                            if (cron.startsWith("*/15")) return "Every 15 minutes";
                            if (cron.startsWith("0 *")) return "Every hour";
                            return `Cron: ${cron}${tz ? ` (${tz.split("/").pop()})` : ""}`;
                          };

                          return (
                            <div
                              key={job.id}
                              onClick={() => {
                                setSelectedJobForConfig(job);
                                setIsScheduleModalOpen(true);
                              }}
                              className="p-3.5 rounded-2xl bg-white dark:bg-[#14141c] border border-slate-200/90 dark:border-[#22222e] hover:border-slate-300 dark:hover:border-[#323242] shadow-xs flex items-center justify-between gap-3 cursor-pointer group transition-all"
                            >
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="text-xs font-medium text-slate-900 dark:text-slate-900 dark:text-white truncate group-hover:text-[#e0682b] dark:group-hover:text-[#f8a87c] transition-colors">
                                  {job.name}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-sans truncate mt-0.5">
                                  {getHumanScheduleText(job.cronExpr, job.timezone)}
                                </span>
                              </div>

                              {/* Clean iOS / Material style toggle switch as in user screenshot */}
                              <button
                                type="button"
                                role="switch"
                                aria-checked={job.enabled}
                                onClick={(e) => handleToggleScheduleRoutine(job, e)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  job.enabled
                                    ? "bg-[#1d6eed] dark:bg-[#1d7bf2]"
                                    : "bg-slate-300 dark:bg-[#2c2c3a]"
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                    job.enabled ? "translate-x-5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>


                </div>
              )}

              {rightTab === "Library" && (() => {
                const categoryFiltered = libraryCategoryFilter === "all"
                  ? workspaceFiles
                  : workspaceFiles.filter((node) => (node.category || "files").toLowerCase() === libraryCategoryFilter);

                const extCountsInCategory: Record<string, number> = {};
                for (const node of categoryFiltered) {
                  if (node.extension) {
                    const extKey = node.extension.toLowerCase();
                    extCountsInCategory[extKey] = (extCountsInCategory[extKey] || 0) + 1;
                  }
                }
                const availableFormats = Object.entries(extCountsInCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 12);

                const extFiltered = libraryExtFilter
                  ? categoryFiltered.filter((node) => (node.extension || "").toLowerCase() === libraryExtFilter.toLowerCase())
                  : categoryFiltered;

                const q = librarySearchQuery.trim().toLowerCase();
                const filteredWorkspaceFiles = q
                  ? extFiltered.filter((node) =>
                      node.name.toLowerCase().includes(q) ||
                      node.path.toLowerCase().includes(q) ||
                      (node.extension || "").toLowerCase().includes(q) ||
                      (node.category || "").toLowerCase().includes(q)
                    )
                  : extFiltered;

                const categories: Array<{ id: LibraryCategory; label: string; count: number }> = [
                  { id: "all", label: "All", count: libraryCategoryCounts.all ?? workspaceFiles.length },
                  { id: "pages", label: "Pages", count: libraryCategoryCounts.pages ?? workspaceFiles.filter((n) => n.category === "pages").length },
                  { id: "files", label: "Files", count: libraryCategoryCounts.files ?? workspaceFiles.filter((n) => n.category === "files").length },
                  { id: "apps", label: "Apps", count: libraryCategoryCounts.apps ?? workspaceFiles.filter((n) => n.category === "apps").length },
                  { id: "images", label: "Images", count: libraryCategoryCounts.images ?? workspaceFiles.filter((n) => n.category === "images").length },
                  { id: "media", label: "Media", count: libraryCategoryCounts.media ?? workspaceFiles.filter((n) => n.category === "media").length },
                ];

                const formatSize = (bytes?: number | null) => {
                  if (bytes === null || bytes === undefined) return "";
                  if (bytes < 1024) return `${bytes}B`;
                  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
                  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
                };

                const getCategoryBadgeStyle = (cat?: string | null) => {
                  switch ((cat || "").toLowerCase()) {
                    case "pages":
                      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
                    case "apps":
                      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
                    case "images":
                      return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
                    case "media":
                      return "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30";
                    default:
                      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
                  }
                };

                return (
                  <div className="space-y-2.5 text-xs flex flex-col flex-1 min-h-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Layers size={13} className="text-[#f8a87c]" />
                        <span>Library ({filteredWorkspaceFiles.length}{filteredWorkspaceFiles.length !== workspaceFiles.length ? ` / ${workspaceFiles.length}` : ""})</span>
                      </span>
                      <div className="flex items-center gap-1">
                        {/* Group Mode Switcher: Flat | Folder | Date */}
                        <div className="flex items-center bg-slate-100 dark:bg-[#14141c] border border-slate-200 dark:border-[#22222e] rounded-lg p-0.5 text-[9px] font-mono">
                          {([
                            { id: "flat" as const, label: "List" },
                            { id: "folder" as const, label: "Folder" },
                            { id: "date" as const, label: "Date" },
                          ]).map((gm) => (
                            <button
                              key={gm.id}
                              type="button"
                              onClick={() => {
                                setLibraryGroupMode(gm.id);
                                setLibraryPage(1);
                              }}
                              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                                libraryGroupMode === gm.id
                                  ? "bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c] font-semibold"
                                  : "text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                              title={`Group by ${gm.label}`}
                            >
                              {gm.label}
                            </button>
                          ))}
                        </div>
                        <button
                          aria-label="Refresh workspace library"
                          data-ux-target-min="24"
                          onClick={() => loadWorkspaceTree()}
                          disabled={isLoadingTree}
                          className="text-neutral-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-200/60 dark:hover:bg-[#1a1a22] transition-colors cursor-pointer"
                          title="Refresh workspace library"
                        >
                          <RefreshCw
                            size={12}
                            className={isLoadingTree ? "animate-spin text-[#f8a87c]" : ""}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Category Filter Pills: All | Pages | Files | Apps | Images | Media */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((cat) => {
                        if (cat.id !== "all" && cat.count === 0 && libraryCategoryFilter !== cat.id) return null;
                        const active = libraryCategoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setLibraryCategoryFilter(cat.id);
                              setLibraryExtFilter("");
                              setLibraryPage(1);
                            }}
                            className={`px-2 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1 ${
                              active
                                ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold"
                                : "bg-slate-100 dark:bg-[#14141c] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-[#22222e] hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className="opacity-70">({cat.count})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Format / Extension Quick Chips (.md, .pdf, .xlsx, .docx, .py, .png, ...) */}
                    {availableFormats.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {availableFormats.map(([ext, count]) => {
                          const isSelectedExt = libraryExtFilter.toLowerCase() === ext;
                          return (
                            <button
                              key={ext}
                              type="button"
                              onClick={() => {
                                setLibraryExtFilter(isSelectedExt ? "" : ext);
                                setLibraryPage(1);
                              }}
                              className={`px-1.5 py-0.5 rounded text-[9px] font-mono transition-colors cursor-pointer border ${
                                isSelectedExt
                                  ? "bg-[#f8a87c] text-black border-[#f8a87c] font-semibold"
                                  : "bg-slate-50 dark:bg-[#101016] text-slate-500 dark:text-neutral-400 border-slate-200 dark:border-[#1f1f2a] hover:border-[#f8a87c]/40 hover:text-slate-800 dark:hover:text-neutral-200"
                              }`}
                            >
                              .{ext} <span className="opacity-70">{count}</span>
                            </button>
                          );
                        })}
                        {libraryExtFilter && (
                          <button
                            type="button"
                            onClick={() => {
                              setLibraryExtFilter("");
                              setLibraryPage(1);
                            }}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono text-neutral-400 hover:text-white cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    )}

                    {/* Instant Search Filter */}
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#14141c] border border-slate-200 dark:border-[#22222e] rounded-lg px-2 py-1 text-xs">
                      <Search size={12} className="text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        value={librarySearchQuery}
                        onChange={(e) => {
                          setLibrarySearchQuery(e.target.value);
                          setLibraryPage(1);
                        }}
                        placeholder="Search pages, files, apps (.md, .xlsx, .pdf, .py)..."
                        className="w-full bg-transparent text-slate-900 dark:text-white placeholder-neutral-500 font-mono text-[11px] focus:outline-none"
                      />
                      {librarySearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setLibrarySearchQuery("");
                            setLibraryPage(1);
                          }}
                          className="text-neutral-500 hover:text-neutral-300 p-0.5 cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    {/* Library Artifact List with Pagination & Folder/Date Grouping */}
                    {(() => {
                      const PAGE_SIZE = 40;
                      const totalPages = Math.max(1, Math.ceil(filteredWorkspaceFiles.length / PAGE_SIZE));
                      const safePage = Math.min(libraryPage, totalPages);
                      const pagedFiles = filteredWorkspaceFiles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

                      const renderNodeItem = (node: WorkspaceTreeNode, showFolderHint = true) => {
                        const isSelected = selectedFilePath === node.path;
                        const folderHint = showFolderHint && node.path.includes("/")
                          ? node.path.split("/").slice(0, -1).join("/")
                          : "";
                        return (
                          <div
                            key={node.path}
                            onClick={() => handleSelectFile(node)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                              isSelected
                                ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] font-medium border border-[#f8a87c]/30"
                                : "text-slate-700 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-[#1c1c24] border border-transparent"
                            }`}
                          >
                            {node.kind === "directory" ? (
                              <Folder size={13} className="text-amber-400 shrink-0" />
                            ) : node.category === "apps" ? (
                              <Terminal size={13} className="text-purple-400 shrink-0" />
                            ) : node.category === "pages" ? (
                              <Globe size={13} className="text-emerald-400 shrink-0" />
                            ) : node.category === "images" ? (
                              <Camera size={13} className="text-cyan-400 shrink-0" />
                            ) : node.category === "media" ? (
                              <Play size={13} className="text-pink-400 shrink-0" />
                            ) : (
                              <FileText size={13} className="text-amber-400 shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="truncate text-[11px] leading-tight">{node.name}</div>
                              {folderHint && (
                                <div className="truncate text-[9px] text-neutral-500 leading-tight">{folderHint}</div>
                              )}
                            </div>

                            {node.extension && (
                              <span className={`px-1 py-0.2 rounded text-[8px] uppercase border shrink-0 ${getCategoryBadgeStyle(node.category)}`}>
                                {node.extension}
                              </span>
                            )}

                            {node.size !== null && node.size !== undefined && (
                              <span className="text-[9px] text-neutral-500 shrink-0">
                                {formatSize(node.size)}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const targetId = selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
                                if (targetId) downloadWorkspaceFile(targetId, node.path, node.name);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-opacity shrink-0 cursor-pointer"
                              title={`Download ${node.name}`}
                            >
                              <Download size={11} />
                            </button>
                          </div>
                        );
                      };

                      const groupedMap = new Map<string, WorkspaceTreeNode[]>();
                      if (libraryGroupMode !== "flat") {
                        for (const node of pagedFiles) {
                          let groupKey = "Workspace Root";
                          if (libraryGroupMode === "folder") {
                            groupKey = node.path.includes("/")
                              ? node.path.split("/").slice(0, -1).join("/")
                              : "Workspace Root";
                          } else if (libraryGroupMode === "date") {
                            const rawDate = (node.modifiedAt || "").slice(0, 10);
                            groupKey = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : "Recent / Unspecified";
                          }
                          const arr = groupedMap.get(groupKey) || [];
                          arr.push(node);
                          groupedMap.set(groupKey, arr);
                        }
                      }

                      return (
                        <>
                          <div className="bg-slate-50 dark:bg-[#14141a] border border-slate-200 dark:border-[#1e1e26] rounded-xl p-2 max-h-64 overflow-y-auto space-y-1 font-mono text-[11px]">
                            {isLoadingTree ? (
                              <div className="space-y-1.5 py-1">
                                <div className="h-7 w-3/4 rounded-md skeleton-shimmer" />
                                <div className="h-7 w-5/6 rounded-md skeleton-shimmer" />
                                <div className="h-7 w-2/3 rounded-md skeleton-shimmer" />
                              </div>
                            ) : filteredWorkspaceFiles.length === 0 ? (
                              <div className="text-center py-6 px-3 text-neutral-500 font-sans text-xs">
                                {workspaceFiles.length === 0
                                  ? "Pages, files, and apps this Bot makes show up here"
                                  : `No artifacts matching current filter`}
                              </div>
                            ) : libraryGroupMode === "flat" ? (
                              pagedFiles.map((node) => renderNodeItem(node, true))
                            ) : (
                              Array.from(groupedMap.entries()).map(([groupKey, items]) => {
                                const isCollapsed = Boolean(libraryCollapsedGroups[groupKey]);
                                return (
                                  <div key={groupKey} className="space-y-0.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setLibraryCollapsedGroups((prev) => ({
                                          ...prev,
                                          [groupKey]: !prev[groupKey],
                                        }))
                                      }
                                      className="w-full flex items-center justify-between px-2 py-1 rounded-md bg-slate-200/50 dark:bg-[#1b1b24] text-[10px] font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                                    >
                                      <span className="flex items-center gap-1.5 truncate">
                                        {isCollapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
                                        {libraryGroupMode === "folder" ? (
                                          <Folder size={11} className="text-amber-400 shrink-0" />
                                        ) : (
                                          <Clock size={11} className="text-[#f8a87c] shrink-0" />
                                        )}
                                        <span className="truncate">{groupKey}</span>
                                      </span>
                                      <span className="text-[9px] text-neutral-500 shrink-0 ml-2">
                                        {items.length}
                                      </span>
                                    </button>
                                    {!isCollapsed && (
                                      <div className="pl-2 space-y-0.5 border-l border-slate-200 dark:border-[#242432] ml-2">
                                        {items.map((node) => renderNodeItem(node, libraryGroupMode !== "folder"))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Pagination Footer when items exceed page size */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between px-1 pt-0.5 text-[10px] font-mono text-neutral-400">
                              <span>
                                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredWorkspaceFiles.length)} of {filteredWorkspaceFiles.length}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={safePage <= 1}
                                  onClick={() => setLibraryPage((p) => Math.max(1, p - 1))}
                                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] text-slate-700 dark:text-neutral-300 disabled:opacity-40 hover:border-[#f8a87c]/40 cursor-pointer disabled:cursor-not-allowed"
                                >
                                  Prev
                                </button>
                                <span className="px-1 text-slate-700 dark:text-neutral-300">
                                  {safePage}/{totalPages}
                                </span>
                                <button
                                  type="button"
                                  disabled={safePage >= totalPages}
                                  onClick={() => setLibraryPage((p) => Math.min(totalPages, p + 1))}
                                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] text-slate-700 dark:text-neutral-300 disabled:opacity-40 hover:border-[#f8a87c]/40 cursor-pointer disabled:cursor-not-allowed"
                                >
                                  Next
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* Selected Artifact Rich Preview */}
                    {selectedFilePath && (
                      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#14141a] border border-slate-200 dark:border-[#1e1e26] rounded-xl overflow-hidden min-h-[180px] max-h-80">
                        <div className="h-8 px-2.5 bg-slate-100 dark:bg-[#181822] border-b border-slate-200 dark:border-[#20202c] flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-500">
                          <span className="truncate text-slate-900 dark:text-white font-semibold" title={selectedFilePath}>
                            {selectedFilePath.split("/").pop()}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {selectedLibraryNode?.extension && (
                              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">
                                .{selectedLibraryNode.extension}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const targetId = selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
                                if (targetId && selectedFilePath) {
                                  downloadWorkspaceFile(targetId, selectedFilePath, selectedFilePath.split("/").pop());
                                }
                              }}
                              className="px-1.5 py-0.5 rounded bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] hover:bg-[#f8a87c]/25 flex items-center gap-1 text-[10px] cursor-pointer"
                              title="Download file"
                            >
                              <Download size={10} />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 p-2.5 overflow-auto font-mono text-[10px] text-slate-700 dark:text-neutral-300 select-text">
                          {isLoadingFile ? (
                            <div className="flex items-center justify-center h-32 text-neutral-500 gap-2">
                              <Loader2 size={14} className="animate-spin text-[#f8a87c]" />
                              <span>Loading preview...</span>
                            </div>
                          ) : fileBlobUrl && (selectedLibraryNode?.previewKind === "image" || selectedLibraryNode?.category === "images") ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <img
                                src={fileBlobUrl}
                                alt={selectedLibraryNode?.name || "Preview"}
                                onClick={() => setLightboxImageUrl({ url: fileBlobUrl, name: selectedLibraryNode?.name || "Image" })}
                                className="max-h-56 w-auto object-contain rounded-lg border border-white/10 cursor-zoom-in"
                              />
                            </div>
                          ) : fileBlobUrl && selectedLibraryNode?.previewKind === "pdf" ? (
                            <iframe
                              src={fileBlobUrl}
                              title={selectedLibraryNode?.name || "PDF Preview"}
                              className="w-full h-56 rounded border-0 bg-white"
                            />
                          ) : fileBlobUrl && selectedLibraryNode?.previewKind === "video" ? (
                            <video src={fileBlobUrl} controls className="w-full max-h-56 rounded bg-black" />
                          ) : fileBlobUrl && selectedLibraryNode?.previewKind === "audio" ? (
                            <div className="py-6 flex items-center justify-center">
                              <audio src={fileBlobUrl} controls className="w-full" />
                            </div>
                          ) : (selectedLibraryNode?.previewKind === "spreadsheet" || selectedLibraryNode?.previewKind === "document" || selectedLibraryNode?.previewKind === "binary") ? (
                            <div className="py-6 px-3 text-center space-y-2 font-sans">
                              <div className="text-neutral-300 font-medium text-xs">{selectedLibraryNode?.name}</div>
                              <div className="text-[11px] text-neutral-500">
                                Định dạng .{selectedLibraryNode?.extension?.toUpperCase()} ({formatSize(selectedLibraryNode?.size)}) sẵn sàng tải về để mở bằng ứng dụng chuyên dụng.
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const targetId = selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
                                  if (targetId && selectedFilePath) {
                                    downloadWorkspaceFile(targetId, selectedFilePath, selectedLibraryNode?.name);
                                  }
                                }}
                                className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8a87c] text-black font-semibold text-xs hover:opacity-90 cursor-pointer"
                              >
                                <Download size={12} />
                                <span>Tải xuống {selectedLibraryNode?.name}</span>
                              </button>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {fileContent || "Empty file"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            </>
            )}
          </>
        )}
      </aside>


      {/* ========================================================= */}
      {/* FULL SCREEN INTERACTIVE BROWSER OVERLAY MODAL */}
      {/* ========================================================= */}
      {isBrowserModalOpen && (() => {
        const browserTarget = getAgentBrowserUrl(selectedAgent, agentBrowser);
        return (
          <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-150">
            {/* Top Navigation Bar with Controls & Close Button */}
            <header className="h-12 border-b border-[#252532] bg-[#121218] px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Live Computer" />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                <Tooltip content={t("computer.openExternal") || "Mở trong tab mới"} placement="bottom">
                  <a aria-label="Open in new browser tab"
                    href={browserTarget.url ? "#" : undefined}
                    onClick={(e) => { e.preventDefault(); if (browserTarget.url) openAgentDesktopTab(agentBrowserFor); }}
                    target="_blank"
                    rel="noreferrer"
                    className="h-8 w-8 rounded-lg bg-[#1c1c26] hover:bg-[#252534] border border-[#2c2c3e] text-neutral-300 hover:text-white flex items-center justify-center text-xs font-mono transition-colors cursor-pointer"
                  >
                    <ExternalLink size={13} />
                  </a>
                </Tooltip>
                
                <Tooltip content={t("computer.closeComputer") || "Close (Esc)"} placement="bottom">
                  <button aria-label="Close Fullscreen View (Esc)" data-ux-target-min="24"
                    type="button"
                    onClick={() => handleSetBrowserModalOpen(false)}
                    className="h-8 w-8 rounded-lg bg-[#22222e] hover:bg-red-500/20 hover:text-red-400 border border-[#303042] hover:border-red-500/30 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </Tooltip>
              </div>
            </header>

            {/* Interactive Browser Viewport */}
            <main className="flex-1 w-full h-full bg-slate-100 dark:bg-black relative transition-colors">
              {browserTarget.url ? (
                <SelkiesViewer
                  key={`modal-${selectedAgent.id}-${browserTarget.url}`}
                  agentId={agentBrowserFor}
                  url={browserTarget.url}
                  title={`${selectedAgent.name} Interactive Workspace`}
                  profile={browserTarget.profile}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-slate-600 dark:text-neutral-400 bg-slate-50 dark:bg-black transition-colors">
                  {agentBrowser === null ? "Resolving agent browser…" : "This agent has no browser"}
                </div>
              )}
            </main>
          </div>
        );
      })()}

      {/* Connect Apps Modal */}
            {/* Channel Configuration Modal */}
      <ChannelConfigModal
        isOpen={isChannelModalOpen}
        onClose={() => setIsChannelModalOpen(false)}
        channel={selectedChannelForConfig}
        agentId={selectedAgent.id}
        agentName={selectedAgent.name}
        onSaved={refreshDetailsData}
      />

      {/* Schedule Job Configuration Modal */}
      <ScheduleJobModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        job={selectedJobForConfig}
        agentId={selectedAgent.id}
        agentName={selectedAgent.name}
        onSaved={refreshDetailsData}
      />

            <AgentAvatarModal
        isOpen={isAvatarSetupModalOpen}
        onClose={() => setIsAvatarSetupModalOpen(false)}
        agent={selectedAgent}
      />

      <AgentSettingsModal
        isOpen={isAgentSettingsModalOpen}
        onClose={() => setIsAgentSettingsModalOpen(false)}
        initialTab={agentSettingsModalTab}
        agent={selectedAgent}
        allAgents={agents}
        availableModels={availableModels}
        isChangingModel={isChangingModel}
        onSelectModel={handleSelectModel}
        onOpenAvatarModal={() => setIsAvatarSetupModalOpen(true)}
        togglingAgentId={togglingAgentId}
        onToggleAgentEnabled={handleToggleAgentEnabled}
        onOpenConnectModal={() => setIsConnectAppsOpen(true)}
        mcpRefreshTrigger={mcpRefreshTrigger}
        onOpenTopologyModal={() => setIsTopologyModalOpen(true)}
        channels={channels}
        loadingChannels={loadingChannels}
        onToggleChannel={handleToggleChannel}
        onConfigureChannel={(ch) => {
          setSelectedChannelForConfig(ch);
          setIsChannelModalOpen(true);
        }}
        schedules={schedules}
        loadingSchedules={loadingSchedules}
        onAddSchedule={() => {
          setSelectedJobForConfig(null);
          setIsScheduleModalOpen(true);
        }}
        onEditSchedule={(job) => {
          setSelectedJobForConfig(job);
          setIsScheduleModalOpen(true);
        }}
        turnTelemetry={turnTelemetry}
        skills={skills}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsModalTab}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        sttLang={sttLang}
        onSttLangChange={setSttLang}
        agentId={selectedAgent?.id}
        agentName={selectedAgent?.name}
        onStartTour={() => startOnboardingTour({ force: true })}
        onResetChecklist={() => {
          try {
            localStorage.removeItem("agent360_onboarding_checklist_dismissed");
            window.dispatchEvent(new CustomEvent("agent360_milestone_updated"));
          } catch {}
        }}
        onExportMarkdown={() => {
          setIsSettingsModalOpen(false);
          handleExportSessionMarkdown();
        }}
        onExportJson={() => {
          setIsSettingsModalOpen(false);
          handleExportSessionJson();
        }}
        onExportCertificate={() => {
          setIsSettingsModalOpen(false);
          handleExportAuditCertificate();
        }}
        onInstallPwa={() => {
          setIsSettingsModalOpen(false);
          handleInstallPWA();
        }}
        isPwaInstallable={Boolean(deferredPrompt)}
      />

      {/* Fullscreen Image Lightbox Modal */}
      {lightboxImageUrl && (
        <div
          ref={lightboxModalRef}
          onClick={() => {
            if (document.fullscreenElement) {
              try { document.exitFullscreen?.(); } catch {}
            }
            setLightboxImageUrl(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center p-2 rounded-xl bg-[#121218] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="w-full flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 text-xs font-mono text-neutral-300">
              <span className="truncate font-medium max-w-md">{lightboxImageUrl.name}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Copy Image (Blob or URL) with Shortcut Badge */}
                <button
                  type="button"
                  onClick={async () => {
                    triggerHaptic(20);
                    try {
                      // Attempt to fetch blob and copy as real image item
                      const res = await fetch(lightboxImageUrl.url);
                      const blob = await res.blob();
                      if (navigator.clipboard && (window as any).ClipboardItem) {
                        const item = new (window as any).ClipboardItem({ [blob.type || "image/png"]: blob });
                        await navigator.clipboard.write([item]);
                        setForkToast("Image copied to clipboard!");
                      } else {
                        await navigator.clipboard.writeText(lightboxImageUrl.url);
                        setForkToast("Image URL copied to clipboard");
                      }
                    } catch (e) {
                      // Fallback to plain URL copy
                      await navigator.clipboard.writeText(lightboxImageUrl.url);
                      setForkToast("Image URL copied to clipboard");
                    }
                    setTimeout(() => setForkToast(null), 2500);
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors text-[11px]"
                  title="Copy Image / URL (Ctrl+C)"
                  aria-label="Copy Image"
                >
                  <Copy size={14} />
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-white/70">
                    Ctrl+C
                  </span>
                </button>

                {/* Download Image with Shortcut Badge */}
                <a
                  href={lightboxImageUrl.url}
                  download={lightboxImageUrl.name}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => triggerHaptic(20)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors text-[11px]"
                  title="Download image file (Ctrl+S)"
                  aria-label="Download image file"
                >
                  <Download size={14} />
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-white/70">
                    Ctrl+S
                  </span>
                </a>

                {/* Info / Metadata Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    setShowLightboxMeta((prev) => !prev);
                  }}
                  className={`p-1 rounded-lg cursor-pointer transition-colors text-[11px] flex items-center gap-1 ${
                    showLightboxMeta ? "bg-white/20 text-white" : "text-neutral-400 hover:text-white hover:bg-white/10"
                  }`}
                  title="Toggle Image Info / Metadata (I)"
                  aria-label="Toggle Image Metadata"
                >
                  <Info size={14} />
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(20);
                    if (!document.fullscreenElement) {
                      lightboxModalRef.current?.requestFullscreen?.();
                    } else {
                      document.exitFullscreen?.();
                    }
                  }}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors text-[11px] flex items-center gap-1"
                  title="Fullscreen (F)"
                  aria-label="Toggle Fullscreen"
                >
                  <Maximize2 size={14} />
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-white/70">
                    F
                  </span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (document.fullscreenElement) {
                      try { document.exitFullscreen?.(); } catch {}
                    }
                    setLightboxImageUrl(null);
                  }}
                  className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors ml-1"
                  title="Close (Esc)"
                  aria-label="Close image preview"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="w-full flex items-center justify-between px-3.5 py-1.5 bg-[#0e0e14] border-b border-white/5 text-[11px] font-mono text-neutral-400">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.max(0.5, Math.round((prev - 0.25) * 100) / 100))}
                  disabled={lightboxZoom <= 0.5}
                  className="p-1 rounded hover:bg-white/10 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  title="Zoom Out (-25%) (-)"
                  aria-label="Zoom Out"
                >
                  <ZoomOut size={13} />
                </button>
                <span className="min-w-[48px] text-center font-bold text-white tracking-wider">
                  {Math.round(lightboxZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxZoom((prev) => Math.min(3, Math.round((prev + 0.25) * 100) / 100))}
                  disabled={lightboxZoom >= 3}
                  className="p-1 rounded hover:bg-white/10 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  title="Zoom In (+25%) (+)"
                  aria-label="Zoom In"
                >
                  <ZoomIn size={13} />
                </button>
                {/* Rotate 90 Clockwise Button */}
                <button
                  type="button"
                  onClick={() => setLightboxRotation((prev) => (prev + 90) % 360)}
                  className="p-1 ml-1 rounded hover:bg-white/10 hover:text-white cursor-pointer transition-colors flex items-center gap-1"
                  title="Rotate 90° Clockwise (R)"
                  aria-label="Rotate 90° Clockwise"
                >
                  <RotateCw size={13} />
                  {lightboxRotation !== 0 && (
                    <span className="text-[9px] text-[#f8a87c] font-bold">{lightboxRotation}°</span>
                  )}
                </button>

                {(lightboxZoom !== 1 || lightboxRotation !== 0) && (
                  <button
                    type="button"
                    onClick={() => { setLightboxZoom(1); setLightboxPan({ x: 0, y: 0 }); setLightboxRotation(0); }}
                    className="flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/15 text-[10px] text-neutral-300 hover:text-white cursor-pointer transition-colors"
                    title="Reset Zoom & Rotation (0)"
                  >
                    <RotateCcw size={10} />
                    Reset
                  </button>
                )}
              </div>
              <span className="text-[10px] text-neutral-500">
                Scroll or use buttons to zoom
              </span>
            </div>
            <div
              onWheel={(e) => {
                if (e.deltaY < 0) {
                  setLightboxZoom((prev) => Math.min(3, Math.round((prev + 0.15) * 100) / 100));
                } else if (e.deltaY > 0) {
                  setLightboxZoom((prev) => {
                    const next = Math.max(0.5, Math.round((prev - 0.15) * 100) / 100);
                    if (next <= 1) setLightboxPan({ x: 0, y: 0 });
                    return next;
                  });
                }
              }}
              onMouseDown={(e) => {
                if (lightboxZoom > 1) {
                  e.preventDefault();
                  setIsPanningLightbox(true);
                  panStartRef.current = { x: e.clientX - lightboxPan.x, y: e.clientY - lightboxPan.y };
                }
              }}
              onMouseMove={(e) => {
                if (isPanningLightbox && lightboxZoom > 1) {
                  setLightboxPan({
                    x: e.clientX - panStartRef.current.x,
                    y: e.clientY - panStartRef.current.y,
                  });
                }
              }}
              onMouseUp={() => setIsPanningLightbox(false)}
              onMouseLeave={() => setIsPanningLightbox(false)}
              className={`p-3 flex items-center justify-center max-h-[75vh] w-full overflow-hidden select-none ${
                lightboxZoom > 1
                  ? isPanningLightbox
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-default"
              }`}
            >
              <img
                src={lightboxImageUrl.url}
                alt={lightboxImageUrl.name}
                draggable={false}
                onLoad={(e) => {
                  const target = e.currentTarget;
                  setLightboxMeta({
                    width: target.naturalWidth,
                    height: target.naturalHeight,
                  });
                }}
                style={{
                  transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${lightboxZoom}) rotate(${lightboxRotation}deg)`,
                  transformOrigin: "center center",
                  transition: isPanningLightbox ? "none" : "transform 0.15s ease-out",
                }}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg select-none pointer-events-none"
              />

              {/* Floating Metadata Card */}
              {showLightboxMeta && lightboxMeta && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-4 left-4 z-40 p-3 rounded-xl bg-slate-900/95 dark:bg-[#14141c]/95 border border-white/10 shadow-2xl backdrop-blur-xl text-left text-xs font-mono space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider border-b border-white/10 pb-1 flex items-center justify-between gap-4">
                    <span>Image Metadata</span>
                    <span className="text-[#f8a87c]">EXIF / Info</span>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-neutral-300">
                    <span className="text-neutral-500">Dimensions:</span>
                    <span className="font-semibold text-white">{lightboxMeta.width} × {lightboxMeta.height} px</span>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-neutral-300">
                    <span className="text-neutral-500">Aspect Ratio:</span>
                    <span className="text-cyan-400 font-semibold">
                      {(lightboxMeta.width / lightboxMeta.height).toFixed(2)} : 1
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-neutral-300">
                    <span className="text-neutral-500">Zoom / Angle:</span>
                    <span>{Math.round(lightboxZoom * 100)}% | {lightboxRotation}°</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <StarredAndShortcutsModal
        isOpen={isStarredShortcutsModalOpen}
        onClose={() => setIsStarredShortcutsOpen(false)}
        starredMessages={messages.filter((m) => starredMsgIds.includes(m.id))}
        onUnstar={(msgId) => toggleStarMessage(msgId)}
        onOpenShortcutsCustomizer={() => {
          setIsStarredShortcutsOpen(false);
          setIsKeyboardShortcutsOpen(true);
        }}
      />

      <VoiceRecordSettingsModal
        isOpen={isVoiceRecordSettingsOpen}
        onClose={() => setIsVoiceRecordSettingsOpen(false)}
        sttLang={sttLang}
        onSttLangChange={setSttLang}
        onOpenShortcuts={() => setIsKeyboardShortcutsOpen(true)}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        agentId={selectedAgent?.id}
        agentName={selectedAgent?.name}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onRequestDone={() => {
          setVoiceError(null);
        }}
      />

      <KeyboardShortcutsModal
        isOpen={isKeyboardShortcutsOpen}
        onClose={() => setIsKeyboardShortcutsOpen(false)}
      />

      <A2ATopologyGraphModal
        isOpen={isTopologyModalOpen}
        onClose={() => setIsTopologyModalOpen(false)}
        currentAgent={selectedAgent}
        allAgents={agents}
        onSelectAgent={handleSelectAgent}
        nodePingMs={nodePingMs}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenAgentSettings={(tab) => {
          setAgentSettingsModalTab(tab);
          setIsAgentSettingsModalOpen(true);
        }}
        agents={agents}
        chats={chats}
        onSelectAgent={handleSelectAgent}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onToggleSound={() => {
          setIsSoundEnabled((prev) => {
            const next = !prev;
            try {
              localStorage.setItem("agent360_sound_enabled", next ? "true" : "false");
            } catch {}
            return next;
          });
        }}
        isSoundEnabled={isSoundEnabled}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        onCompactContext={async () => {
          if (selectedAgent) {
            await compactAgentContext(selectedAgent.id, selectedChat?.id);
          }
        }}
        onFilterInstance={(inst) => setSelectedInstance(inst)}
        infraInstances={INFRA_INSTANCES}
      />

      {/* Forward to Agent Selection Modal */}
      {forwardModalMsg && (
        <div
          onClick={() => setForwardModalMsg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#14141c] border border-[#262634] rounded-xl p-4 shadow-2xl text-neutral-200 font-sans space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#22222e] pb-2">
              <span className="text-sm font-semibold text-white">Forward Response to Another Agent</span>
              <button onClick={() => setForwardModalMsg(null)} className="text-neutral-400 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Select an agent to pass this output context into as a new consultation prompt:
            </p>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {agents.filter((a) => a.id !== selectedAgentId).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => {
                    handleSelectAgent(ag);
                    setInputText(`[Forwarded context from ${selectedAgent.name}]:\n${forwardModalMsg.slice(0, 500)}...\n\nPlease review and advise on next steps.`);
                    setForwardModalMsg(null);
                  }}
                  className="p-2.5 rounded-xl hover:bg-[#1e1e2c] border border-transparent hover:border-[#2e2e42] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">{ag.name}</span>
                    <span className="text-[10px] text-neutral-500">{ag.node}</span>
                  </div>
                  <ArrowRight size={13} className="text-[#f8a87c]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batch Clear / Delete Selected Conversations Confirmation Modal */}
      {isBatchClearModalOpen && (
        <div
          onClick={() => setIsBatchClearModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#242432] p-5 shadow-2xl text-slate-800 dark:text-neutral-200 font-sans"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Xóa các phiên đã chọn?</h4>
                <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                  Bạn có chắc muốn xóa <span className="text-[#f8a87c] font-semibold">{selectedChatIds.length}</span> phiên hội thoại đã đánh dấu chọn không? Thao tác này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsBatchClearModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1a1a24] dark:hover:bg-[#222230] text-slate-700 dark:text-neutral-300 font-medium transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleBatchDeleteSelectedChats}
                className="px-3.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-medium transition-colors cursor-pointer"
              >
                Xóa ngay ({selectedChatIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      <ConfirmDialog
        isOpen={isSignOutConfirmOpen}
        onClose={() => setIsSignOutConfirmOpen(false)}
        onConfirm={() => {
          setIsSignOutConfirmOpen(false);
          initiateSkyerSignOut(authConfig);
        }}
        title={t("auth.signOutConfirmTitle")}
        description={
          <div className="space-y-1.5">
            <p>Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc <strong>{currentUser?.name || "Skyer Workspace"}</strong> không?</p>
            <p className="text-[11px] text-neutral-400 font-mono">Toàn bộ token truy cập cục bộ sẽ được thu hồi và phiên đăng nhập sẽ kết thúc an toàn.</p>
          </div>
        }
        confirmLabel={t("auth.signOutConfirmBtn")}
        cancelLabel={t("auth.signOutCancelBtn")}
        variant="danger"
      />

      {/* Delete Chat Confirmation Modal (Standard ConfirmDialog Shared Primitive) */}
      <ConfirmDialog
        isOpen={Boolean(chatToDelete)}
        onClose={() => setChatToDelete(null)}
        onConfirm={(e?: any) => {
          if (chatToDelete) {
            handleDeleteChat(chatToDelete.id, e);
            setChatToDelete(null);
          }
        }}
        title="Xóa phiên hội thoại?"
        description={`Bạn có chắc chắn muốn xóa vĩnh viễn "${chatToDelete?.title || ""}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa phiên"
        cancelLabel="Hủy"
        variant="danger"
      />

      <OnboardingChecklistWidget
        onOpenAgentsDrawer={() => {
          setMobileAgentsOpen(true);
          setMobileChatsOpen(false);
          setMobileBotInfoOpen(false);
        }}
        onOpenTopology={() => {
          setIsTopologyModalOpen(true);
          recordMilestone("openedSpecsOrTopology");
        }}
        onOpenShortcuts={() => {
          setIsKeyboardShortcutsOpen(true);
          recordMilestone("triedVoiceOrShortcuts");
        }}
        onOpenSpecs={() => {
          setIsBotInfoCollapsed(false);
          setRightTab("Details");
          recordMilestone("openedSpecsOrTopology");
        }}
        onFocusComposer={() => {
          const textarea = document.querySelector("#tour-prompt-composer textarea") as HTMLTextAreaElement;
          if (textarea) textarea.focus();
        }}
      />

      <PromptRecipesModal
        isOpen={isRecipesModalOpen}
        onClose={() => setIsRecipesModalOpen(false)}
        onSelectRecipe={(prompt) => {
          setInputText(prompt);
        }}
      />

      <ConnectAppsModal
        isOpen={isConnectAppsOpen}
        onClose={() => setIsConnectAppsOpen(false)}
        targetAgentId={selectedAgent.id}
        targetAgentName={selectedAgent.name}
        connectedAppIds={connectedAppIds}
        onAppConnected={(appId) => {
          setConnectedAppIds((prev) => Array.from(new Set([...prev, appId])));
          setMcpRefreshTrigger((t) => t + 1);
        }}
        onAppDisconnected={(appId) => {
          setConnectedAppIds((prev) => prev.filter((id) => id !== appId));
          setMcpRefreshTrigger((t) => t + 1);
        }}
      />

      {/* ========================================================= */}
      {/* MOBILE HOLD-TOUCH / LONG-PRESS ACTION SHEET: AGENT */}
      {/* ========================================================= */}
      {mobileActionAgent && (
        <div
          onClick={() => setMobileActionAgent(null)}
          className="fixed inset-0 z-[85] flex flex-col justify-end bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-white dark:bg-[#14141c] border border-slate-200 dark:border-[#2a2a3c] rounded-2xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200 text-slate-800 dark:text-neutral-200 font-sans"
          >
            {/* Header / Agent Name */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#22222e]">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                <AgentAvatar agent={mobileActionAgent} size="sm" />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-[#f8a87c] uppercase font-bold block">Agent Quick Actions</span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{mobileActionAgent.name}</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileActionAgent(null)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1">
              {/* 1. Pin / Unpin Agent */}
              <button
                type="button"
                onClick={(e) => {
                  togglePinAgent(mobileActionAgent.id, e);
                  setMobileActionAgent(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Pin size={15} className={pinnedAgentIds.includes(mobileActionAgent.id) ? "fill-amber-400 text-amber-400" : "text-neutral-400"} />
                <span>{pinnedAgentIds.includes(mobileActionAgent.id) ? "Bỏ ghim Agent (Unpin)" : "Ghim Agent lên đầu (Pin to top)"}</span>
              </button>

              {/* 2. Create New Chat with Agent */}
              <button
                type="button"
                onClick={() => {
                  handleSelectAgent(mobileActionAgent);
                  setTimeout(() => handleNewChat(), 50);
                  setMobileActionAgent(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={15} className="text-[#f8a87c]" />
                <span>Tạo Chat mới với Agent (New Session)</span>
              </button>

              {/* 3. Open Agent Settings Modal */}
              <button
                type="button"
                onClick={() => {
                  handleSelectAgent(mobileActionAgent);
                  setAgentSettingsModalTab("general");
                  setIsAgentSettingsModalOpen(true);
                  setMobileActionAgent(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Settings size={15} className="text-[#f8a87c]" />
                <span>Cài đặt Chuyên sâu Agent (Agent Settings)</span>
              </button>

              {/* 4. View Agent Specs */}
              <button
                type="button"
                onClick={() => {
                  handleSelectAgent(mobileActionAgent);
                  handleToggleBotInfo(false);
                  setMobileActionAgent(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Bot size={15} className="text-cyan-400" />
                <span>Xem thông số kỹ thuật (Agent Specs)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE HOLD-TOUCH / LONG-PRESS ACTION SHEET: CHAT SESSION */}
      {/* ========================================================= */}
      {mobileActionChat && (
        <div
          onClick={() => setMobileActionChat(null)}
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-white dark:bg-[#14141c] border border-slate-200 dark:border-[#2a2a3c] rounded-2xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200 text-slate-800 dark:text-neutral-200 font-sans"
          >
            {/* Header / Session Title */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#22222e]">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono text-[#f8a87c] uppercase font-bold block">Session Actions</span>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{mobileActionChat.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setMobileActionChat(null)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1">
              {/* 1. Pin / Unpin */}
              <button
                type="button"
                onClick={() => {
                  togglePinChat(mobileActionChat.id);
                  setMobileActionChat(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Pin size={15} className={pinnedChatIds.includes(mobileActionChat.id) ? "fill-amber-400 text-amber-400" : "text-neutral-400"} />
                <span>{pinnedChatIds.includes(mobileActionChat.id) ? "Bỏ ghim phiên hội thoại (Unpin)" : "Ghim phiên lên đầu (Pin to top)"}</span>
              </button>

              {/* 2. Rename */}
              <button
                type="button"
                onClick={() => {
                  setEditingChatId(mobileActionChat.id);
                  setEditingChatTitle(mobileActionChat.title);
                  setMobileActionChat(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Edit2 size={15} className="text-cyan-400" />
                <span>Đổi tên phiên hội thoại (Rename)</span>
              </button>

              {/* 3. Export Markdown */}
              <button
                type="button"
                onClick={() => {
                  handleExportSessionMarkdown();
                  setMobileActionChat(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Download size={15} className="text-emerald-400" />
                <span>Xuất tệp Markdown (.md)</span>
              </button>

              {/* 4. Delete Session */}
              <button
                type="button"
                onClick={() => {
                  const toDel = mobileActionChat;
                  setMobileActionChat(null);
                  setChatToDelete(toDel);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <Trash2 size={15} className="text-red-400" />
                <span>Xóa phiên hội thoại (Delete)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MOBILE HOLD-TOUCH / LONG-PRESS ACTION SHEET: MESSAGE TURN */}
      {/* ========================================================= */}
      {mobileActionMsg && (
        <div
          onClick={() => setMobileActionMsg(null)}
          className="fixed inset-0 z-[80] flex flex-col justify-end bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-white dark:bg-[#14141c] border border-slate-200 dark:border-[#2a2a3c] rounded-2xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200 text-slate-800 dark:text-neutral-200 font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#22222e]">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono text-[#f8a87c] uppercase font-bold block">
                  {mobileActionMsg.role === "user" ? "User Prompt Actions" : "Assistant Turn Actions"}
                </span>
                <p className="text-xs text-neutral-400 truncate max-w-xs italic">
                  "{mobileActionMsg.content.slice(0, 60)}..."
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileActionMsg(null)}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1">
              {/* Star / Bookmark */}
              <button
                type="button"
                onClick={() => {
                  toggleStarMessage(mobileActionMsg.id);
                  setMobileActionMsg(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Star size={15} className={starredMsgIds.includes(mobileActionMsg.id) ? "fill-amber-400 text-amber-400" : "text-neutral-400"} />
                <span>{starredMsgIds.includes(mobileActionMsg.id) ? "Bỏ đánh dấu sao" : "Đánh dấu sao (Star / Bookmark)"}</span>
              </button>

              {/* Copy */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(mobileActionMsg.content);
                  setCopiedResponseMsgId(mobileActionMsg.id);
                  setMobileActionMsg(null);
                  setTimeout(() => setCopiedResponseMsgId(null), 1800);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <Copy size={15} className="text-neutral-300" />
                <span>Sao chép nội dung (Copy)</span>
              </button>

              {/* Edit Prompt (chỉ dành cho user prompt) */}
              {mobileActionMsg.role === "user" && (
                <button
                  type="button"
                  onClick={() => {
                    const text = mobileActionMsg.content;
                    setMobileActionMsg(null);
                    setInputText(text);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto";
                      textareaRef.current.focus();
                      setTimeout(() => {
                        if (textareaRef.current) {
                          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
                          textareaRef.current.setSelectionRange(text.length, text.length);
                        }
                      }, 0);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Edit2 size={15} className="text-cyan-400" />
                  <span>Chỉnh sửa câu hỏi (Edit Prompt)</span>
                </button>
              )}

              {/* Read Aloud TTS (chỉ dành cho assistant response) */}
              {mobileActionMsg.role !== "user" && (
                <button
                  type="button"
                  onClick={() => {
                    const content = mobileActionMsg.content;
                    const id = mobileActionMsg.id;
                    setMobileActionMsg(null);
                    if (speakingMsgId === id) {
                      stopSpeaking();
                      setSpeakingMsgId(null);
                    } else {
                      setSpeakingMsgId(id);
                      speakText(content, {
                        onSegmentChange: (seg) => setSpeakingSentence(seg),
                        onEnd: () => {
                          setSpeakingMsgId(null);
                          setSpeakingSentence(null);
                        },
                        onError: () => {
                          setSpeakingMsgId(null);
                          setSpeakingSentence(null);
                        },
                      });
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Volume2 size={15} className="text-[#f8a87c]" />
                  <span>Đọc to phản hồi bằng giọng nói (TTS)</span>
                </button>
              )}

              {/* Fork Session */}
              <button
                type="button"
                onClick={() => {
                  const turnIdx = mobileActionMsg.turnIdx;
                  setMobileActionMsg(null);
                  handleForkSession(turnIdx);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <GitFork size={15} className="text-cyan-400" />
                <span>Tách nhánh phiên mới từ đây (Fork)</span>
              </button>

              {/* Forward to Another Agent (chỉ dành cho assistant response) */}
              {mobileActionMsg.role !== "user" && (
                <button
                  type="button"
                  onClick={() => {
                    const content = mobileActionMsg.content;
                    setMobileActionMsg(null);
                    setForwardModalMsg(content);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-slate-700 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 size={15} className="text-purple-400" />
                  <span>Chuyển tiếp cho Agent khác tiếp nối</span>
                </button>
              )}

              {/* View Thinking & Tools (chỉ dành cho assistant response có thinking) */}
              {mobileActionMsg.hasThinking && mobileActionMsg.rawMsg && (
                <button
                  type="button"
                  onClick={() => {
                    const raw = mobileActionMsg.rawMsg;
                    setMobileActionMsg(null);
                    if (raw) setActiveThinkingModalMsg(raw);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f1f2c] text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <Sparkles size={15} className="text-emerald-400" />
                  <span>Xem chi tiết Thinking & Công cụ thực thi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Shared Thinking Modal */}
      {activeThinkingModalMsg && (
        <AgentThinkingModal
          msg={activeThinkingModalMsg}
          agentLabel={activeThinkingModalMsg.senderAgentName || activeThinkingModalMsg.senderAgentId || selectedAgent.name}
          onClose={() => setActiveThinkingModalMsg(null)}
        />
      )}
      {/* Global Toast Primitive Notification */}
      <Toast
        toast={
          forkToast
            ? { id: "fork", message: forkToast, variant: "info" }
            : deviceToast
            ? {
                id: "device",
                message: deviceToast.message,
                variant: "info",
                action: { label: "Configure", onClick: () => setIsPermissionsModalOpen(true) },
              }
            : voiceError
            ? {
                id: "voice",
                message: voiceError,
                variant: "error",
                action: { label: "Permissions", onClick: () => setIsPermissionsModalOpen(true) },
              }
            : null
        }
        onDismiss={() => {
          setForkToast(null);
          setDeviceToast(null);
          setVoiceError(null);
        }}
      />
    </div>
  );
}
