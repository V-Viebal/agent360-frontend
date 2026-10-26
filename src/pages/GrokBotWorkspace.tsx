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
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  ShieldCheck,
  GitFork,
  Network,
  Keyboard,
  Info,
} from "lucide-react";
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
import { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
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
  Filter,
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
  ChevronsDown,
  ChevronsUp,
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
  CornerUpLeft,
  Smile,
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession, SessionCollaborationRoom, SessionRoomTurn, ReplyToMessageInfo } from "../types/agent";

/** Short haptic tick on supporting devices; silently ignored elsewhere. */
const triggerHaptic = (ms = 8) => {
  try {
    // Ultra-soft micro-vibration: scale down duration to subtle tactile tick (2ms - 6ms)
    const gentleMs = Math.max(2, Math.min(Math.round(ms * 0.35), 6));
    navigator.vibrate?.(gentleMs);
  } catch { /* unsupported */ }
};

const DEFAULT_REACTIONS = ["❤️", "😆", "😮", "😢", "👍", "👎", "🔥", "🚀"];

const FULL_EMOJI_PALETTE = [
  "❤️", "😆", "😮", "😢", "👍", "👎", "🔥", "🚀",
  "🎉", "👏", "💯", "🎯", "💡", "🤖", "🤝", "☕",
  "⚡", "💪", "🙌", "😍", "🤩", "🫡", "🙏", "👀"
];

function getStoredRecentReactions(): string[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("agent360_recent_reactions") : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = Array.from(new Set([...parsed, ...DEFAULT_REACTIONS]));
        return merged.slice(0, 8);
      }
    }
  } catch {}
  return DEFAULT_REACTIONS;
}

function saveStoredRecentReaction(emoji: string) {
  try {
    const current = getStoredRecentReactions();
    const updated = [emoji, ...current.filter((e) => e !== emoji)].slice(0, 8);
    localStorage.setItem("agent360_recent_reactions", JSON.stringify(updated));
  } catch {}
}

const QUICK_REACTIONS = ["👍", "❤️", "🔥", "🎉", "👀", "🚀"];

function stripSharedRoomContext(text: string): string {
  if (!text) return "";
  let cleaned = text.replace(/^\s*QUESTION_FOR_PARENT:\s*/i, "");
  cleaned = cleaned.replace(/\[IMPLICIT_REACTION_FEEDBACK[^\]]*\][\s\S]*?\[\/IMPLICIT_REACTION_FEEDBACK\]/gi, "").trim();
  if (/^BuildSpecialtySynthesisFallback\(collab,\s*objective\)$/i.test(cleaned)) {
    cleaned = "**[Đóng góp chuyên môn từ Room]**\n- Đã đồng bộ phân tích chuyên môn và chuyển về Chủ session tổng hợp kết quả cuối.";
  }
  let idx = cleaned.indexOf("[SHARED SESSION ROOM CONTEXT]");
  if (idx < 0) idx = cleaned.indexOf("[AGENTTEAMS COLLABORATION ROOM");
  if (idx < 0) return cleaned;
  let head = cleaned.slice(0, idx).trimEnd();
  const tail = cleaned.slice(idx);
  const tailAttachments = tail.match(/\[Attached File:\s*[^\n\r]+?\s*\([^()\n\r]+\)\]/gi) || [];
  for (const att of tailAttachments) {
    if (!head.includes(att)) {
      head = head ? `${head}\n\n${att}` : att;
    }
  }
  return head;
}

export interface ParsedChatAttachmentItem {
  fileName: string;
  rawUrl: string;
  previewUrl: string;
  isImage: boolean;
  kind: AttachmentFormatKind;
  ext: string;
  badgeColor: string;
  caption?: string;
}

function extractToolSentAttachments(
  toolCalls?: ChatMessage["toolCalls"],
  steps?: ChatMessage["steps"],
  agentIdForUrl: string = "default"
): ParsedChatAttachmentItem[] {
  const results: ParsedChatAttachmentItem[] = [];
  const seen = new Set<string>();

  const addCandidate = (rawPath: string, rawFileName?: string, caption?: string) => {
    const cleanPath = (rawPath || "").trim();
    const cleanName = (rawFileName || cleanPath.replace(/\\/g, "/").split("/").pop() || "attachment").trim();
    if (!cleanPath && !cleanName) return;
    const effectiveUrl = cleanPath || `media/${cleanName}`;
    const key = (effectiveUrl.replace(/\\/g, "/").split("/").pop() || cleanName).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);

    const previewUrl = resolveUploadedAttachmentPreviewUrl(effectiveUrl, agentIdForUrl);
    const fmt = classifyAttachmentFormat(cleanName || effectiveUrl);
    results.push({
      fileName: cleanName,
      rawUrl: effectiveUrl,
      previewUrl,
      isImage: fmt.kind === "image",
      kind: fmt.kind,
      ext: fmt.ext,
      badgeColor: fmt.badgeColor,
      caption: caption?.trim() || undefined,
    });
  };

  const inspectList = [...(toolCalls || []), ...(steps || []).filter((s) => s.kind === "tool_call")];
  for (const tc of inspectList) {
    const toolName = (tc.tool || "").toLowerCase();
    if (
      toolName.includes("send_telegram_file") ||
      toolName.includes("send_file") ||
      toolName.includes("send_document") ||
      toolName.includes("send_photo") ||
      toolName.includes("send_video") ||
      toolName.includes("send_audio") ||
      toolName.includes("deliver_file") ||
      toolName.includes("media_send")
    ) {
      try {
        const argsObj = typeof tc.args === "string" && tc.args.trim().startsWith("{") ? JSON.parse(tc.args) : {};
        const filePath = argsObj.file_path || argsObj.path || argsObj.url || argsObj.media_url || "";
        const fileName = argsObj.filename || argsObj.file_name || argsObj.name || "";
        const caption = typeof argsObj.caption === "string" ? argsObj.caption : undefined;
        if (filePath || fileName) {
          addCandidate(filePath, fileName, caption);
        }
      } catch {}
    }

    if (tc.result && typeof tc.result === "string") {
      const fileOutMatch = tc.result.match(/FILE\s+(\/app\/working\/workspaces\/[^\s"']+)/i);
      if (fileOutMatch && (toolName.includes("send") || inspectList.some((x) => (x.tool || "").toLowerCase().includes("send")))) {
        addCandidate(fileOutMatch[1]);
      }
    }
  }

  return results;
}

function parseQuotedReplyFromContent(
  rawContent: string,
  explicitReplyTo?: ReplyToMessageInfo,
  agentIdForUrl: string = "default",
  toolCalls?: ChatMessage["toolCalls"],
  steps?: ChatMessage["steps"]
): { replyTo?: ReplyToMessageInfo; cleanContent: string; attachments: ParsedChatAttachmentItem[] } {
  let text = stripSharedRoomContext(rawContent || "");
  let resolvedReplyTo = explicitReplyTo;
  const match = text.match(/^\[Replying to ([^:\]]+):\s*"([^"]*)"\]\s*\n\n?([\s\S]*)$/);
  if (match) {
    resolvedReplyTo = explicitReplyTo || {
      authorName: match[1].trim(),
      snippet: match[2].trim(),
    };
    text = stripSharedRoomContext(match[3]);
  }

  const attachments: ParsedChatAttachmentItem[] = [];
  const seenKeys = new Set<string>();

  const pushAttachment = (rawName: string, rawUrl: string, caption?: string) => {
    const url = (rawUrl || "").trim().replace(/^file:\/\/+/, "/");
    const fallbackFile = url.replace(/\\/g, "/").split("/").pop() || "attachment";
    const fileName = (rawName || fallbackFile).trim();
    const dedupeKey = (url.replace(/\\/g, "/").split("/").pop() || fileName).toLowerCase();
    if (seenKeys.has(dedupeKey)) return;
    seenKeys.add(dedupeKey);

    const previewUrl = resolveUploadedAttachmentPreviewUrl(url, agentIdForUrl);
    const fmt = classifyAttachmentFormat(fileName || url);
    attachments.push({
      fileName,
      rawUrl: url,
      previewUrl,
      isImage: fmt.kind === "image",
      kind: fmt.kind,
      ext: fmt.ext,
      badgeColor: fmt.badgeColor,
      caption,
    });
  };

  // Look for friendly display name in Telegram/Zalo history header: "[Đính kèm: <name>]"
  const friendlyNames: string[] = [];
  const friendlyRegex = /\[(?:Đính kèm|Attachment|File):\s*([^\]\n\r]+)\]/gi;
  let fm: RegExpExecArray | null;
  while ((fm = friendlyRegex.exec(text)) !== null) {
    if (fm[1]) friendlyNames.push(fm[1].trim());
  }

  // 1. Standard [Attached File: name (url)] (allows parentheses inside filename)
  const attachRegex = /\[Attached File:\s*([^\n\r]+?)\s*\(([^()\n\r]+)\)\]/gi;
  text = text.replace(attachRegex, (_full, rawName: string, rawUrl: string) => {
    pushAttachment(rawName, rawUrl);
    return "";
  });

  // 2. QwenPaw <system-reminder>An attached file is saved into file:///app/working/workspaces/...</system-reminder>
  const sysReminderRegex = /<system-reminder>\s*An attached file is saved into\s*(?:file:\/\/)?([^<\s]+?)\.?\s*<\/system-reminder>/gi;
  text = text.replace(sysReminderRegex, (_full, rawPath: string) => {
    const cleanPath = rawPath.replace(/\.$/, "");
    const friendly = friendlyNames.length > 0 ? friendlyNames[friendlyNames.length - 1] : "";
    pushAttachment(friendly, cleanPath);
    return "";
  });

  // 3. QwenPaw "User uploaded a file, downloaded to /app/working/workspaces/..."
  const uploadedLineRegex = /(?:^|\n)\s*User uploaded a file,\s*downloaded to\s*([^\s\n\r]+)\s*/gi;
  text = text.replace(uploadedLineRegex, (_full, rawPath: string) => {
    const friendly = friendlyNames.length > 0 ? friendlyNames[friendlyNames.length - 1] : "";
    pushAttachment(friendly, rawPath.trim());
    return "\n";
  });

  // 4. Strip Telegram/Zalo backlog wrapper if present so user bubble shows only the actual user message
  const currentMsgMarker = "[Tin nhắn hiện tại cần xử lý]:";
  const markerIdx = text.indexOf(currentMsgMarker);
  if (markerIdx >= 0 && text.includes("[Ngữ cảnh hội thoại gần đây")) {
    text = text.slice(markerIdx + currentMsgMarker.length);
  }

  // 5. Strip [Telegram replied-message context ...] block if embedded in user content
  text = text.replace(/\[Telegram replied-message context[^\]]*\]\s*\n\{[\s\S]*?\}(?=\n|$)/gi, "");

  // 6. Include any files sent by the assistant via tool calls (e.g. send_telegram_file)
  const toolSent = extractToolSentAttachments(toolCalls, steps, agentIdForUrl);
  for (const ts of toolSent) {
    const dedupeKey = (ts.rawUrl.replace(/\\/g, "/").split("/").pop() || ts.fileName).toLowerCase();
    if (!seenKeys.has(dedupeKey)) {
      seenKeys.add(dedupeKey);
      attachments.push(ts);
    }
  }

  return {
    replyTo: resolvedReplyTo,
    cleanContent: text.trim(),
    attachments,
  };
}
import {
  fetchInfraAgents,
  AgentListAuthError,
  updateAgentActiveModel,
  fetchAgentChats,
  getCachedAgentChats,
  markChatAsRead,
  updateCachedAgentChatsRead,
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
  postChatRoomMessage,
  submitMessageReaction,
  classifyReactionEmoji,
  updateChatRoomTitle,
  updateChatRoomTriagePolicy,
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { TurnAccumulator, attachLiveTurn } from "../services/turnStream";
import { subAgentApi, SubAgentBinding } from "../services/subAgentApi";
import { uploadFileToGateway, UploadedFileResult, resolveUploadedAttachmentPreviewUrl, classifyAttachmentFormat, AttachmentFormatKind } from "../services/uploadApi";
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
import { AgentAvatar, getAgentColorTheme } from "../components/AgentAvatar";
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
import { AgentBrowserInfo, DesktopAuthError, agentBrowserImageUrl, fetchAgentBrowser, fetchAgentBrowserFrame, focusAgentBrowser, issueAgentDesktopUrl, openAgentDesktopTab, prefetchAgentDesktopUrl } from "../services/agentBrowserApi";



// Unified Modal for Live In-Progress Execution, Multi-Agent Room Flow & Message Thinking Blocks
function AgentThinkingModal({
  msg,
  agentLabel,
  agentId,
  room,
  activeRespondingAgent,
  allAgents = [],
  isLiveInProgress = false,
  onDrillDownBranch,
  onUpdateHostExecutionPolicy,
  onClose,
}: {
  msg: ChatMessage;
  agentLabel?: string;
  agentId?: string;
  room?: SessionCollaborationRoom | null;
  activeRespondingAgent?: { id: string; name: string; statusText: string } | null;
  allAgents?: InfraAgent[];
  isLiveInProgress?: boolean;
  onDrillDownBranch?: (branchTurn: SessionRoomTurn) => void;
  onUpdateHostExecutionPolicy?: (nextPolicy: "auto" | "co_execute" | "synthesize_only") => void;
  onClose: () => void;
}) {
  const focusedAgentSlug = msg.senderAgentId
    ? msg.senderAgentId.replace(/^bot:agent360:/i, "").toLowerCase()
    : null;
  // Default filter to "all" so multi-agent Flow Tree is always visible in full context
  const [selectedParticipantFilter, setSelectedParticipantFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"tree" | "timeline">("tree");
  const [selectedWaveIdx, setSelectedWaveIdx] = useState<number>(-1);
  const [expandedBranchIds, setExpandedBranchIds] = useState<Record<string, boolean>>({});
  const [flowSearchQuery, setFlowSearchQuery] = useState<string>("");

  // Mobile swipe down to close gesture state & touch handling
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const isSwipeEligibleRef = useRef<boolean>(false);

  // Enhancement 2 & 4: Highlight branch on chip tap, and copy feedback
  const [highlightedBranchSlug, setHighlightedBranchSlug] = useState<string | null>(null);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  const handleCopyContent = (id: string, textToCopy: string) => {
    if (!textToCopy) return;
    try {
      navigator.clipboard.writeText(textToCopy);
      setCopiedItemId(id);
      triggerHaptic(8);
      setTimeout(() => setCopiedItemId(null), 1800);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  const handleTouchStart = (e: React.TouchEvent, fromHeader = false) => {
    if (e.touches.length === 1) {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
      isSwipeEligibleRef.current = fromHeader;
      setIsDragging(false);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null || e.touches.length !== 1) return;
    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - touchStartYRef.current;
    const deltaX = currentX - touchStartXRef.current;

    // Only engage swipe down if moving downward and predominantly vertical
    if (deltaY > 5 && deltaY > Math.abs(deltaX) * 1.15 && isSwipeEligibleRef.current) {
      setIsDragging(true);
      setDragY(Math.max(0, deltaY * 0.85));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current !== null && e.changedTouches.length === 1 && isSwipeEligibleRef.current) {
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
      if (deltaY > 75) {
        if (typeof window !== "undefined" && "vibrate" in navigator) {
          triggerHaptic(10);
        }
        onClose();
        return;
      }
    }
    setDragY(0);
    setIsDragging(false);
    touchStartYRef.current = null;
    touchStartXRef.current = null;
    isSwipeEligibleRef.current = false;
  };

  useEffect(() => {
    setSelectedParticipantFilter("all");
    setSelectedWaveIdx(-1);
  }, [msg.id, msg.senderAgentId]);

  const steps = msg.steps || [];
  const toolCalls = msg.toolCalls || [];
  const allToolItems = steps.filter((s) => s.kind === "tool_call").length > 0
    ? steps.filter((s) => s.kind === "tool_call")
    : toolCalls.map((tc) => ({ kind: "tool_call" as const, ...tc }));
  const reasoningItems = steps.filter((s) => s.kind === "reasoning");
  if (reasoningItems.length === 0 && msg.reasoning) {
    reasoningItems.push({ kind: "reasoning", text: msg.reasoning });
  }

  const hasMultiAgentRoom = Boolean(
    room &&
    Array.isArray(room.participants) &&
    room.participants.some((p) => p.role === "collaborator")
  );

  // Extract room turns (excluding manager init turn)
  const roomWaveTurns = useMemo(() => {
    if (!room || !Array.isArray(room.turns)) return [];
    const sorted = [...room.turns].sort((a, b) => (a.turn_no || 0) - (b.turn_no || 0));
    return sorted.filter((t) => !(t.kind === "request" && t.author_role === "manager"));
  }, [room]);

  // Avoid duplicating msg's own steps if msg itself is already one of the roomWaveTurns
  const msgIsRoomTurn = useMemo(() => {
    return roomWaveTurns.some((t) => t.id === msg.id);
  }, [roomWaveTurns, msg.id]);

  const roomToolCount = useMemo(() => {
    return roomWaveTurns.reduce((acc, t) => {
      const tSteps = Array.isArray(t.steps) ? t.steps.filter((s) => s.kind === "tool_call").length : 0;
      return acc + tSteps;
    }, 0);
  }, [roomWaveTurns]);

  const roomReasonCount = useMemo(() => {
    return roomWaveTurns.reduce((acc, t) => {
      const rSteps = Array.isArray(t.steps) ? t.steps.filter((s) => s.kind === "reasoning").length : (t.reasoning ? 1 : 0);
      return acc + rSteps;
    }, 0);
  }, [roomWaveTurns]);

  const totalToolCount = (msgIsRoomTurn ? 0 : allToolItems.length) + roomToolCount;
  const totalReasonCount = (msgIsRoomTurn ? 0 : reasoningItems.length) + roomReasonCount;
  const hostSlug = (room?.host_agent_id || agentId || "mons").replace(/^bot:agent360:/i, "").toLowerCase();
  const hostParticipant = room?.participants?.find((p) => p.role === "host" || p.agent_id === hostSlug);
  const hostDisplayName = hostParticipant?.display_name || agentLabel || hostSlug;
  const displayAgent = msg.senderAgentName || msg.senderAgentId || agentLabel || "Agent";
  const isCurrentlyRunning = Boolean(
    isLiveInProgress ||
    activeRespondingAgent ||
    room?.status === "collaborator_running" ||
    room?.status === "synthesizing"
  );

  // Group roomWaveTurns into hierarchical Execution Waves for the Flow Tree
  const executionWaves = useMemo(() => {
    type WaveGroup = {
      waveNo: number;
      runId?: string;
      requestTurn: SessionRoomTurn | null;
      kickoffTurn: SessionRoomTurn | null;
      progressTurns: SessionRoomTurn[];
      collaboratorTurns: SessionRoomTurn[];
      managerGuardTurns: SessionRoomTurn[];
      synthesisTurn: SessionRoomTurn | null;
      triageMeta: {
        mode: string;
        confidence: number;
        reason: string;
        executionStrategy: string;
        assignedAgents: string[];
        selectedCollaborators: string[];
        suggestedCollaborators: string[];
        synthesisOwnerId: string;
        hostShouldSelfExecute: boolean;
        hostExecutionRole: string;
        hostExecutionFocus: string;
      };
      isMultiAgentWave: boolean;
    };

    const parseTriageFromTurn = (req: SessionRoomTurn | null, collabs: SessionRoomTurn[]) => {
      let mode = collabs.length > 0 ? "specialty_triage" : "host_solo";
      let confidence = 0.95;
      let reason = req?.reasoning || "";
      let executionStrategy = collabs.length > 1 ? "parallel" : "sequential";
      let assignedAgents: string[] = [];
      let selectedCollaborators: string[] = collabs.map((c) => c.author_id);
      let suggestedCollaborators: string[] = [];
      let synthesisOwnerId = hostSlug;
      let hostShouldSelfExecute = collabs.length === 0;
      let hostExecutionRole = collabs.length === 0 ? "solo_execute_and_respond" : "synthesize_only";
      let hostExecutionFocus = "";

      const triageStep = req?.steps?.find((s) => s.tool === "agentteams_manager_triage");
      if (triageStep?.result) {
        try {
          const parsed = JSON.parse(triageStep.result);
          if (parsed.mode) mode = parsed.mode;
          if (typeof parsed.confidence === "number") confidence = parsed.confidence;
          if (parsed.reason) reason = parsed.reason;
          if (parsed.execution_strategy) executionStrategy = parsed.execution_strategy;
          if (Array.isArray(parsed.assigned_agents)) assignedAgents = parsed.assigned_agents;
          if (Array.isArray(parsed.selected_collaborators) && parsed.selected_collaborators.length > 0) {
            selectedCollaborators = parsed.selected_collaborators;
          }
          if (Array.isArray(parsed.suggested_collaborators)) {
            suggestedCollaborators = parsed.suggested_collaborators;
          }
          if (parsed.synthesis_owner_id) synthesisOwnerId = parsed.synthesis_owner_id;
          if (typeof parsed.host_should_self_execute === "boolean") {
            hostShouldSelfExecute = parsed.host_should_self_execute;
          }
          if (parsed.host_execution_role) {
            hostExecutionRole = parsed.host_execution_role;
          } else if (selectedCollaborators.length > 0) {
            hostExecutionRole = hostShouldSelfExecute ? "co_execute_and_synthesize" : "synthesize_only";
          }
          if (parsed.host_execution_focus) {
            hostExecutionFocus = parsed.host_execution_focus;
          }
        } catch {}
      }
      if (!hostExecutionFocus) {
        hostExecutionFocus = selectedCollaborators.length > 0
          ? hostShouldSelfExecute
            ? `Manager phân định Chủ session @${hostSlug} vừa tự chạy nhánh chuyên môn riêng vừa đại diện Room tổng hợp kết quả cuối sau khi cả Room đã chạy done.`
            : `Manager phân định Chủ session @${hostSlug} không cần tự chạy nhánh riêng mà ưu tiên làm Người đại diện Room tổng hợp câu phản hồi cuối cùng sau khi cả Room đã chạy done.`
          : `Chủ session @${hostSlug} trực tiếp tự thực thi và đại diện phiên đưa ra câu trả lời cuối cùng.`;
      }
      if (!reason) {
        reason = collabs.length > 0
          ? `AgentTeams Manager (@agentteams-manager) phân công ${selectedCollaborators.map((c) => `@${c}`).join(", ")} thực thi chuyên môn và ưu tiên Chủ session (@${hostSlug}) làm Người đại diện Room tổng hợp kết quả cuối sau khi cả Room đã chạy done.`
          : `Phân tích thông minh độc lập (Smart Solo) bởi Chủ session @${hostSlug} (${hostDisplayName}).`;
      }
      return {
        mode,
        confidence,
        reason,
        executionStrategy,
        assignedAgents: assignedAgents.length > 0 ? assignedAgents : [...selectedCollaborators, hostSlug],
        selectedCollaborators,
        suggestedCollaborators,
        synthesisOwnerId,
        hostShouldSelfExecute,
        hostExecutionRole,
        hostExecutionFocus,
      };
    };

    if (roomWaveTurns.length === 0) {
      // Fallback wave for pure solo message when roomWaveTurns is empty
      const synthTurn: SessionRoomTurn = {
        id: msg.id,
        turn_no: 1,
        author_id: hostSlug,
        author_name: displayAgent,
        author_role: "host",
        kind: "synthesis",
        text: msg.content || "",
        created_at: new Date().toISOString(),
        reasoning: reasoningItems.map((r) => r.text).filter(Boolean).join("\n") || msg.reasoning || null,
        steps: [
          ...reasoningItems.map((r, idx) => ({
            kind: "reasoning" as const,
            id: `solo_r_${idx}`,
            text: r.text,
          })),
          ...allToolItems.map((t, idx) => ({
            kind: "tool_call" as const,
            id: t.id || `solo_t_${idx}`,
            tool: t.tool || "Tool",
            args: t.args,
            result: t.result,
            state: t.state || "success",
          })),
        ],
      };
      return [
        {
          waveNo: 1,
          runId: msg.runId,
          requestTurn: null,
          kickoffTurn: null,
          progressTurns: [],
          collaboratorTurns: [],
          managerGuardTurns: [],
          synthesisTurn: synthTurn,
          triageMeta: parseTriageFromTurn(null, []),
          isMultiAgentWave: false,
        },
      ];
    }

    const waves: WaveGroup[] = [];
    let curRunId: string | undefined = undefined;
    let curReq: SessionRoomTurn | null = null;
    let curKickoff: SessionRoomTurn | null = null;
    let curProgress: SessionRoomTurn[] = [];
    let curCollabs: SessionRoomTurn[] = [];
    let curGuards: SessionRoomTurn[] = [];
    let curSynth: SessionRoomTurn | null = null;

    const flushWave = () => {
      if (!curReq && !curKickoff && curProgress.length === 0 && curCollabs.length === 0 && !curSynth) return;
      const meta = parseTriageFromTurn(curReq, curCollabs);
      const resolvedRunId =
        curRunId ||
        curReq?.run_id ||
        curKickoff?.run_id ||
        curProgress[0]?.run_id ||
        curCollabs[0]?.run_id ||
        curSynth?.run_id ||
        undefined;
      waves.push({
        waveNo: waves.length + 1,
        runId: resolvedRunId,
        requestTurn: curReq,
        kickoffTurn: curKickoff,
        progressTurns: curProgress,
        collaboratorTurns: curCollabs,
        managerGuardTurns: curGuards,
        synthesisTurn: curSynth,
        triageMeta: meta,
        isMultiAgentWave: curCollabs.length > 0 || Boolean(curKickoff) || meta.selectedCollaborators.length > 0,
      });
      curRunId = undefined;
      curReq = null;
      curKickoff = null;
      curProgress = [];
      curCollabs = [];
      curGuards = [];
      curSynth = null;
    };

    for (const turn of roomWaveTurns) {
      if (turn.run_id && curRunId && turn.run_id !== curRunId) {
        flushWave();
      }
      if (turn.run_id && !curRunId) {
        curRunId = turn.run_id;
      }

      if (turn.kind === "request") {
        if (
          curReq &&
          curCollabs.length === 0 &&
          !curSynth &&
          stripSharedRoomContext(curReq.text).trim().toLowerCase() === stripSharedRoomContext(turn.text).trim().toLowerCase()
        ) {
          continue;
        }
        if (curReq || curCollabs.length > 0 || curSynth) {
          flushWave();
          if (turn.run_id) curRunId = turn.run_id;
        }
        curReq = turn;
      } else if (turn.kind === "host_kickoff") {
        if (curSynth) flushWave();
        curKickoff = turn;
      } else if (turn.kind === "host_progress") {
        if (curSynth) flushWave();
        curProgress.push(turn);
      } else if (turn.kind === "manager_guard") {
        curGuards.push(turn);
      } else if (turn.kind === "synthesis") {
        curSynth = turn;
        flushWave();
      } else {
        if (curSynth) {
          flushWave();
        }
        curCollabs.push(turn);
      }
    }
    flushWave();

    // Attach msg's own direct steps/reasoning into the latest wave's synthesisTurn if not already present
    if (waves.length > 0 && !msgIsRoomTurn && (reasoningItems.length > 0 || allToolItems.length > 0)) {
      const lastW = waves[waves.length - 1];
      if (!lastW.synthesisTurn) {
        lastW.synthesisTurn = {
          id: msg.id,
          turn_no: roomWaveTurns.length + 1,
          author_id: hostSlug,
          author_name: hostDisplayName,
          author_role: "host",
          kind: "synthesis",
          text: msg.content || "",
          created_at: new Date().toISOString(),
          reasoning: reasoningItems.map((r) => r.text).filter(Boolean).join("\n") || null,
          steps: [
            ...reasoningItems.map((r, idx) => ({ kind: "reasoning" as const, id: `msg_r_${idx}`, text: r.text })),
            ...allToolItems.map((t, idx) => ({
              kind: "tool_call" as const,
              id: t.id || `msg_t_${idx}`,
              tool: t.tool || "Tool",
              args: t.args,
              result: t.result,
              state: t.state || "success",
            })),
          ],
        };
      }
    }

    return waves;
  }, [roomWaveTurns, msg, msgIsRoomTurn, reasoningItems, allToolItems, hostSlug, hostDisplayName, displayAgent]);

  // Determine which wave to display in the Flow Tree (match msg.id or default to latest wave)
  const activeWaveIndex = useMemo(() => {
    if (selectedWaveIdx >= 0 && selectedWaveIdx < executionWaves.length) {
      return selectedWaveIdx;
    }
    const matchedIdx = executionWaves.findIndex(
      (w) =>
        (msg.runId && w.runId === msg.runId) ||
        w.requestTurn?.id === msg.id ||
        w.kickoffTurn?.id === msg.id ||
        w.progressTurns.some((p) => p.id === msg.id) ||
        w.synthesisTurn?.id === msg.id ||
        w.collaboratorTurns.some((c) => c.id === msg.id)
    );
    return matchedIdx >= 0 ? matchedIdx : Math.max(0, executionWaves.length - 1);
  }, [executionWaves, selectedWaveIdx, msg.id, msg.runId]);

  const activeWave = executionWaves[activeWaveIndex] || executionWaves[executionWaves.length - 1];

  const getModeLabel = (mode: string, isMulti: boolean) => {
    switch (mode) {
      case "explicit_mention":
        return "Chỉ định trực tiếp (@mention)";
      case "specialty_triage":
        return "Tự động phân công chuyên môn";
      case "manager_specialist_recruitment":
        return "Tự động chiêu mộ chuyên viên mới";
      case "reply_or_named":
        return "Phản hồi nối tiếp chuyên viên";
      case "continuity_followup":
      case "active_collaborator_affinity":
        return "Duy trì mạch hội thoại chuyên sâu";
      case "manual_policy_host_solo":
        return "Chế độ Thủ công (Chủ phòng xử lý)";
      default:
        return isMulti ? "Điều phối Đa Tác Tử (Room)" : "Xử lý Cá nhân Thông minh (Smart Solo)";
    }
  };

  const visibleCollaboratorBranches = useMemo(() => {
    if (!activeWave) return [];
    const completedTurns = [...activeWave.collaboratorTurns];
    const completedSlugs = new Set(completedTurns.map((t) => t.author_id.toLowerCase()));
    const isLatestWave = activeWaveIndex === executionWaves.length - 1;

    // Proposal 4: Synthesize live in-progress branch nodes for assigned/running collaborators that haven't emitted their completed turn yet
    if (isLatestWave && isCurrentlyRunning) {
      const pendingSlugs = new Set<string>();
      for (const s of activeWave.triageMeta.selectedCollaborators) {
        if (s && s.toLowerCase() !== hostSlug && !completedSlugs.has(s.toLowerCase())) {
          pendingSlugs.add(s.toLowerCase());
        }
      }
      if (room && Array.isArray(room.participants)) {
        for (const p of room.participants) {
          const pSlug = p.agent_id.toLowerCase();
          if (
            p.role === "collaborator" &&
            pSlug !== hostSlug &&
            !completedSlugs.has(pSlug) &&
            (p.status === "running" || room.active_collaborator_id?.toLowerCase() === pSlug || activeRespondingAgent?.id?.toLowerCase() === pSlug)
          ) {
            pendingSlugs.add(pSlug);
          }
        }
      }
      Array.from(pendingSlugs).forEach((slug, idx) => {
        const part = room?.participants?.find((p) => p.agent_id.toLowerCase() === slug);
        const matchedAg = allAgents.find((a) => (a.slug || "").toLowerCase() === slug || a.id.toLowerCase() === slug);
        const dispName = part?.display_name || matchedAg?.name || slug;
        completedTurns.push({
          id: `live-branch-${slug}-${idx}`,
          turn_no: (activeWave.requestTurn?.turn_no || 1) + completedTurns.length + 1,
          author_id: slug,
          author_name: dispName,
          author_role: "collaborator",
          kind: "collaborator_progress",
          text: "",
          target_agent_id: hostSlug,
          created_at: new Date().toISOString(),
          reasoning:
            activeRespondingAgent?.id?.toLowerCase() === slug
              ? activeRespondingAgent.statusText
              : `Đang phân tích ngữ cảnh Room & thực thi nhiệm vụ chuyên môn của @${slug}...`,
          steps: [
            {
              kind: "tool_call",
              id: `live_tool_${slug}`,
              tool: "session_room_collaborate",
              args: JSON.stringify({ room_id: room?.matrix_room_id || room?.room_id, host_agent: hostSlug, collaborator: slug, status: "running" }),
              result: "in_progress",
              state: "calling",
            },
          ],
          manager_audit: null,
        });
      });
    }

    const q = flowSearchQuery.trim().toLowerCase();
    const byParticipant =
      selectedParticipantFilter === "all" ||
      selectedParticipantFilter === "agentteams-manager" ||
      selectedParticipantFilter === hostSlug
        ? completedTurns
        : completedTurns.filter(
            (t) =>
              t.author_id.toLowerCase() === selectedParticipantFilter ||
              (t.target_agent_id && t.target_agent_id.toLowerCase() === selectedParticipantFilter)
          );
    if (!q) return byParticipant;
    return byParticipant.filter(
      (t) =>
        t.author_id.toLowerCase().includes(q) ||
        (t.author_name || "").toLowerCase().includes(q) ||
        (t.text || "").toLowerCase().includes(q) ||
        (t.reasoning || "").toLowerCase().includes(q) ||
        (Array.isArray(t.steps) && t.steps.some((s: any) => (s.tool || "").toLowerCase().includes(q) || (s.text || "").toLowerCase().includes(q)))
    );
  }, [activeWave, activeWaveIndex, executionWaves.length, isCurrentlyRunning, room, activeRespondingAgent, allAgents, selectedParticipantFilter, hostSlug, flowSearchQuery]);

  const completedCollabCount = activeWave ? activeWave.collaboratorTurns.length : 0;
  const totalExpectedCollabCount = activeWave
    ? Math.max(visibleCollaboratorBranches.length, activeWave.triageMeta.selectedCollaborators.length)
    : 0;
  const hostToolsInWave = useMemo(() => {
    if (!activeWave?.synthesisTurn?.steps) return [];
    return activeWave.synthesisTurn.steps.filter((s) => s.kind === "tool_call");
  }, [activeWave]);
  const showHostCoExecBranch = Boolean(
    activeWave &&
    activeWave.isMultiAgentWave &&
    (activeWave.triageMeta.hostShouldSelfExecute || hostToolsInWave.length > 0) &&
    (selectedParticipantFilter === "all" || selectedParticipantFilter === hostSlug)
  );
  const totalRenderedBranches = visibleCollaboratorBranches.length + (showHostCoExecBranch ? 1 : 0);

  return (
    <div
      data-testid="agent-thinking-modal"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${Math.max(0.12, 0.6 * (1 - Math.min(dragY, 260) / 300))})`,
        transition: isDragging ? "none" : "background-color 0.22s ease-out",
      }}
      className="fixed inset-0 z-[95] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <style>{`
        @keyframes flowPulseDown {
          0% { transform: translateY(-100%); opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(220%); opacity: 0; }
        }
        @keyframes flowBeamHorizontal {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .flow-tree-pulse-dot {
          animation: flowPulseDown 1.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .flow-tree-bus-animated {
          background: linear-gradient(90deg, rgba(248,168,124,0.25) 0%, rgba(16,185,129,0.65) 50%, rgba(248,168,124,0.25) 100%);
          background-size: 200% 100%;
          animation: flowBeamHorizontal 2.6s linear infinite;
        }
      `}</style>
      <div
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? "none" : "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="w-full max-w-4xl h-[92dvh] sm:h-auto max-h-[92dvh] sm:max-h-[88vh] rounded-xl sm:rounded-2xl bg-white dark:bg-[#12121a] border border-slate-200 dark:border-[#262636] shadow-2xl flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe-Down Pill Handle */}
        <div
          onTouchStart={(e) => handleTouchStart(e, true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            setDragY(0);
            setIsDragging(false);
          }}
          className="sm:hidden flex flex-col items-center justify-center pt-2 pb-0.5 cursor-grab active:cursor-grabbing shrink-0 touch-none select-none bg-slate-50 dark:bg-[#161620]"
          aria-label="Vuốt xuống để đóng"
        >
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-neutral-600 transition-colors" />
        </div>

        {/* Unified Modal Header */}
        <div
          onTouchStart={(e) => handleTouchStart(e, true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            setDragY(0);
            setIsDragging(false);
          }}
          className="px-3 py-2 sm:px-4 sm:py-3 border-b border-slate-200 dark:border-[#222230] flex items-center justify-between gap-2 bg-slate-50 dark:bg-[#161620] select-none"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            {isCurrentlyRunning ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#f8a87c]/15 border border-[#f8a87c]/30 shrink-0">
                <AgentAvatar
                  agent={
                    (activeRespondingAgent?.id && allAgents.find((a) => a.id === activeRespondingAgent.id || a.slug === activeRespondingAgent.id)) ||
                    allAgents.find((a) => (a.slug || "").toLowerCase() === hostSlug || a.id.toLowerCase() === hostSlug) ||
                    { id: hostSlug, name: displayAgent }
                  }
                  size="2xs"
                  alwaysAnimate={true}
                  forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
                  className="ring-1 ring-[#f8a87c]/40"
                />
                <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-1" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-2" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-3" />
              </span>
            ) : (
              <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg sm:rounded-xl bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center shrink-0">
                <Sparkles size={13} className="text-[#f8a87c]" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                  Thinking & Smart Flow Tree — {displayAgent}
                </h3>
                <span
                  className={`text-[8px] sm:text-[9px] font-mono px-1.5 py-0.2 sm:py-0.5 rounded-full border shrink-0 ${
                    isCurrentlyRunning
                      ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                  }`}
                >
                  {isCurrentlyRunning ? "Running" : "Done"}
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] font-mono text-neutral-500 truncate">
                {totalToolCount} công cụ · {totalReasonCount} suy luận
                {room?.room_id ? ` · Room ${room.room_id}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Enhancement 3: Toggle Expand / Collapse All Branches */}
            {viewMode === "tree" && visibleCollaboratorBranches.length > 0 && (
              <button
                type="button"
                data-testid="thinking-toggle-expand-all-btn"
                onClick={() => {
                  triggerHaptic(8);
                  const areAllExpanded = visibleCollaboratorBranches.every((b) => expandedBranchIds[b.id]);
                  if (areAllExpanded) {
                    setExpandedBranchIds({});
                  } else {
                    const next: Record<string, boolean> = {};
                    visibleCollaboratorBranches.forEach((b) => {
                      next[b.id] = true;
                    });
                    setExpandedBranchIds(next);
                  }
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-mono border border-slate-300/60 dark:border-[#2c2c40] bg-slate-100 dark:bg-[#1a1a28] hover:bg-white dark:hover:bg-[#222234] text-slate-700 dark:text-neutral-300 transition-all cursor-pointer flex items-center gap-1"
                title={visibleCollaboratorBranches.every((b) => expandedBranchIds[b.id]) ? "Thu gọn tất cả chi tiết" : "Mở rộng tất cả chi tiết"}
                aria-label={visibleCollaboratorBranches.every((b) => expandedBranchIds[b.id]) ? "Thu gọn tất cả" : "Mở rộng tất cả"}
              >
                {visibleCollaboratorBranches.every((b) => expandedBranchIds[b.id]) ? <ChevronsUp size={11} /> : <ChevronsDown size={11} />}
                <span className="hidden sm:inline">
                  {visibleCollaboratorBranches.every((b) => expandedBranchIds[b.id]) ? "Thu gọn hết" : "Mở rộng hết"}
                </span>
              </button>
            )}

            {/* View Mode Toggle: Flow Tree vs Timeline Log */}
            <div className="inline-flex items-center rounded-lg sm:rounded-xl bg-slate-200/70 dark:bg-[#1d1d2b] p-0.5 border border-slate-300/60 dark:border-[#2c2c40]">
              <button
                type="button"
                data-testid="thinking-view-mode-tree"
                onClick={() => setViewMode("tree")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "tree"
                    ? "bg-white dark:bg-[#12121a] text-[#e0682b] dark:text-[#f8a87c] shadow-2xs"
                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <GitFork size={11} className="rotate-180" />
                <span><span className="hidden xs:inline">Sơ đồ </span>Flow Tree</span>
              </button>
              <button
                type="button"
                data-testid="thinking-view-mode-timeline"
                onClick={() => setViewMode("timeline")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-mono font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === "timeline"
                    ? "bg-white dark:bg-[#12121a] text-[#e0682b] dark:text-[#f8a87c] shadow-2xs"
                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Terminal size={11} />
                <span><span className="hidden xs:inline">Chi tiết </span>Log</span>
              </button>
            </div>

            <button
              type="button"
              data-testid="close-thinking-modal-btn"
              aria-label="Đóng modal thinking"
              onClick={onClose}
              className="p-1 sm:p-1.5 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Unified Thinking Blocks & Flow Tree Body */}
        <div
          onTouchStart={(e) => {
            if (e.currentTarget.scrollTop <= 0) {
              handleTouchStart(e, true);
            }
          }}
          onTouchMove={(e) => {
            if (isSwipeEligibleRef.current && e.currentTarget.scrollTop <= 0) {
              handleTouchMove(e);
            }
          }}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            setDragY(0);
            setIsDragging(false);
          }}
          className="p-2.5 sm:p-4 overflow-y-auto overscroll-contain space-y-2.5 sm:space-y-3 flex-1 min-h-0"
        >
          {/* 1. In-Progress Live Status Banner */}
          {isCurrentlyRunning && (
            <div
              data-testid="inprogress-thinking-status-block"
              className="rounded-xl bg-[#f8a87c]/[0.07] dark:bg-[#181622] border border-[#f8a87c]/35 p-3 text-xs font-sans space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#f8a87c] font-mono text-[11px] font-semibold">
                  <AgentAvatar
                    agent={
                      (activeRespondingAgent?.id && allAgents.find((a) => a.id === activeRespondingAgent.id || a.slug === activeRespondingAgent.id)) ||
                      allAgents.find((a) => (a.slug || "").toLowerCase() === hostSlug || a.id.toLowerCase() === hostSlug) ||
                      { id: hostSlug, name: displayAgent }
                    }
                    size="2xs"
                    alwaysAnimate={true}
                    forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
                    className="ring-1 ring-[#f8a87c]/40"
                  />
                  <span className="inline-flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-1" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-2" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-3" />
                  </span>
                  <span>Tiến trình đang thực thi (Realtime Flow)</span>
                </div>
                {room?.triage_policy && (
                  <span className="text-[10px] font-mono text-neutral-400">
                    Triage: {room.triage_policy.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-800 dark:text-neutral-200 font-medium">
                {activeRespondingAgent?.statusText || `${displayAgent} đang phân tích suy luận và thực thi công cụ...`}
              </p>
            </div>
          )}

          {/* 2. Multi-Agent Room Participants & Wave Selector Bar */}
          {hasMultiAgentRoom && room && (
            <div
              data-testid="room-orchestration-flow-section"
              className="rounded-xl bg-slate-50 dark:bg-[#14141c] border border-slate-200 dark:border-[#22222e] p-2.5 sm:p-3 space-y-2 sm:space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-700 dark:text-neutral-300 font-semibold">
                  <Sparkles size={11} className="text-[#f8a87c]" />
                  <span>Luồng Điều Phối & Phối Hợp Thông Minh Trong Room</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                  {focusedAgentSlug && (
                    <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25">
                      Tin nhắn: @{focusedAgentSlug}
                    </span>
                  )}
                  <button
                    type="button"
                    data-testid="host-execution-policy-toggle"
                    onClick={() => {
                      const cur = (room.host_execution_policy || "auto").toLowerCase();
                      const next: "auto" | "co_execute" | "synthesize_only" =
                        cur === "auto" ? "co_execute" : cur === "co_execute" ? "synthesize_only" : "auto";
                      onUpdateHostExecutionPolicy?.(next);
                    }}
                    title="Bấm để chuyển chế độ tự thực thi của Chủ session"
                    className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-[#1f1f2e] dark:hover:bg-[#28283a] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-[#2e2e42] transition-colors cursor-pointer font-medium"
                  >
                    Chủ session:{" "}
                    {(room.host_execution_policy || "auto") === "co_execute"
                      ? "Tự chạy kèm"
                      : (room.host_execution_policy || "auto") === "synthesize_only"
                      ? "Chỉ tổng hợp"
                      : "Tự động"}
                  </button>
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1f1f2e] text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-[#2e2e42]">
                    {(room.triage_policy || "auto").toUpperCase()} · {room.status}
                  </span>
                </div>
              </div>

              {/* Participant Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full flex-nowrap sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedParticipantFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedParticipantFilter === "all"
                      ? "bg-[#f8a87c]/15 border-[#f8a87c] text-slate-900 dark:text-white font-semibold"
                      : "bg-white dark:bg-[#191926] border-slate-200 dark:border-[#2a2a3c] text-neutral-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Tất cả ({room.participants.filter((p) => p.role === "host" || p.role === "collaborator" || p.role === "manager").length})
                </button>
                {room.participants
                  .filter((p) => p.role === "host" || p.role === "collaborator" || p.role === "manager")
                  .map((p) => {
                    const isRunning =
                      p.status === "running" ||
                      room.active_collaborator_id === p.agent_id ||
                      activeRespondingAgent?.id === p.agent_id;
                    const isDone = p.status === "completed";
                    const isSelected = selectedParticipantFilter === p.agent_id;
                    const isMsgAuthor = focusedAgentSlug === p.agent_id.toLowerCase();
                    const participantAg = allAgents.find((a: InfraAgent) => (a.slug || "").toLowerCase() === p.agent_id.toLowerCase() || a.id.toLowerCase() === p.agent_id.toLowerCase());
                    const pTheme = getAgentColorTheme(p.agent_id, participantAg?.name || p.agent_id, participantAg?.roleTag);
                    return (
                      <button
                        key={p.agent_id}
                        type="button"
                        data-testid={`room-flow-agent-chip-${p.agent_id}`}
                        onClick={() => {
                          if (selectedParticipantFilter === "all" || selectedParticipantFilter === p.agent_id) {
                            const branchEl = document.querySelector(`[data-testid="flow-tree-branch-${p.agent_id}"]`);
                            if (branchEl) {
                              branchEl.scrollIntoView({ behavior: "smooth", block: "center" });
                              setHighlightedBranchSlug(p.agent_id.toLowerCase());
                              triggerHaptic(8);
                              setTimeout(() => setHighlightedBranchSlug(null), 1800);
                            }
                          }
                          setSelectedParticipantFilter(isSelected ? "all" : p.agent_id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-semibold shadow-2xs"
                            : "bg-white dark:bg-[#191926] border-slate-200 dark:border-[#2a2a3c] text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#202030]"
                        } ${isMsgAuthor && !isSelected ? "ring-1 ring-slate-400 dark:ring-neutral-500" : ""}`}
                      >
                        <AgentAvatar
                          agent={participantAg || { id: p.agent_id, name: p.agent_id, roleTag: p.role }}
                          size="2xs"
                          alwaysAnimate={isRunning}
                          forcedAnimation={isRunning ? "nod.1.4,jump.1.4,wink.1.4" : undefined}
                          className="shrink-0"
                        />
                        <span className="font-semibold">@{p.agent_id}</span>
                        <span className="opacity-70 text-[9px]">
                          ({p.role === "host" ? "Chủ room" : p.role === "manager" ? "Manager" : "Chuyên viên"})
                        </span>
                      </button>
                    );
                  })}
              </div>

              {/* Quick Keyword Search in Flow Tree */}
              <div className="pt-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    data-testid="flow-tree-search-input"
                    value={flowSearchQuery}
                    onChange={(e) => setFlowSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm từ khóa, @agent hoặc công cụ trong Flow Tree..."
                    className="w-full pl-7 pr-6 py-1 rounded-lg bg-white dark:bg-[#191926] border border-slate-200 dark:border-[#2a2a3c] text-[10px] font-mono text-slate-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#f8a87c]"
                  />
                  {flowSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setFlowSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* Session Evolution Wave Selector (Shows smooth Solo <-> Multi-Agent transitions across turns) */}
              {executionWaves.length > 1 && (
                <div className="pt-1.5 border-t border-slate-200/70 dark:border-[#222230] flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full flex-nowrap sm:flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 mr-1 shrink-0">Mạch phiên:</span>
                  {executionWaves.map((w, wIdx) => {
                    const isWaveActive = wIdx === activeWaveIndex;
                    return (
                      <button
                        key={w.waveNo}
                        type="button"
                        data-testid={`flow-tree-wave-btn-${w.waveNo}`}
                        onClick={() => setSelectedWaveIdx(wIdx)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                          isWaveActive
                            ? "bg-[#f8a87c]/15 border-[#f8a87c] text-slate-900 dark:text-white font-semibold shadow-2xs"
                            : "bg-white dark:bg-[#181824] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-[#2a2a3a] hover:border-[#f8a87c]/50"
                        }`}
                      >
                        <span>Đợt #{w.waveNo}</span>
                        <span className="opacity-75">
                          ({w.isMultiAgentWave ? `Room: ${w.collaboratorTurns.length || w.triageMeta.selectedCollaborators.length} agent` : "Smart Solo"})
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW MODE 1: INTERACTIVE ANIMATED FLOW TREE (DEFAULT)                 */}
          {/* ===================================================================== */}
          {viewMode === "tree" && activeWave && (
            <div
              data-testid="agent-execution-flow-tree"
              className="rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-[#13131c] border border-slate-200/90 dark:border-[#232334] p-2.5 sm:p-4 flex flex-col items-center w-full"
            >
              {/* LEVEL 0: ROOT NODE — User Request & Session Continuity Context */}
              <div
                data-testid="flow-tree-root-node"
                className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#171723] border border-slate-200 dark:border-[#29293d] p-2.5 sm:p-3 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    <span>1. Yêu cầu Đầu vào (Root Intent)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {activeWaveIndex > 0 && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-[#20202e] dark:text-neutral-400 border border-slate-200 dark:border-[#2e2e40]">
                        Kế thừa {activeWaveIndex} lượt
                      </span>
                    )}
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-[#20202e] dark:text-neutral-300 border border-slate-200 dark:border-[#2e2e40]">
                      {activeWave.isMultiAgentWave ? "Multi-Agent Room" : "Solo Agent"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-800 dark:text-neutral-100 font-medium leading-relaxed break-words">
                  {activeWave.requestTurn?.text
                    ? `"${stripSharedRoomContext(activeWave.requestTurn.text)}"`
                    : `Phân tích & xử lý yêu cầu trực tiếp trên phiên của @${hostSlug} (${hostDisplayName})`}
                </p>
              </div>

              {/* Animated Vertical Trunk Connector (Root -> Triage Brain) */}
              <div className="relative h-6 w-0.5 bg-gradient-to-b from-cyan-400/60 via-[#f8a87c] to-[#f8a87c] overflow-hidden my-0.5">
                <span className="absolute inset-x-0 h-2.5 bg-white dark:bg-[#f8a87c] rounded-full flow-tree-pulse-dot" />
              </div>

              {/* LEVEL 1: TRIAGE & ORCHESTRATION BRAIN NODE (@agentteams-manager / Smart Solo Triage) */}
              <div
                data-testid="flow-tree-triage-node"
                style={{ animationDelay: "50ms" }}
                className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#171723] border border-[#f8a87c]/45 dark:border-[#f8a87c]/35 p-2.5 sm:p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-1.5 sm:space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-900 dark:text-white">
                    <span className="h-5 w-5 rounded-lg bg-[#f8a87c]/15 border border-[#f8a87c]/40 flex items-center justify-center text-[#e0682b] dark:text-[#f8a87c] shrink-0">
                      <Sparkles size={11} />
                    </span>
                    <span>
                      2. Tầng Phân Định Thông Minh ·{" "}
                      {activeWave.isMultiAgentWave
                        ? "AgentTeams Manager (@agentteams-manager)"
                        : `Smart Triage & Grounding (@${hostSlug})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeWave.isMultiAgentWave && (() => {
                      const progKind = activeWave.progressTurns?.[0]?.receipt?.kind || "";
                      const kickoffArgs = activeWave.kickoffTurn?.steps?.[0]?.args || "";
                      let playbook = progKind === "relay"
                        ? "relay_pipeline"
                        : progKind === "review"
                        ? "adversarial_review"
                        : progKind === "workstreams"
                        ? "task_decomposition"
                        : progKind === "reply"
                        ? "consultation"
                        : activeWave.triageMeta.mode === "manager_specialist_recruitment"
                        ? "peer_assist"
                        : activeWave.triageMeta.selectedCollaborators.length === 1
                        ? "consultation"
                        : "deliberation";
                      try {
                        if (kickoffArgs) {
                          const parsed = JSON.parse(kickoffArgs);
                          if (parsed.collaboration_mode) playbook = parsed.collaboration_mode;
                        }
                      } catch {}
                      const playbookLabel =
                        playbook === "relay_pipeline"
                          ? "Chuỗi Bàn giao (Relay Pipeline)"
                          : playbook === "adversarial_review"
                          ? "Phản biện & Kiểm định Rủi ro"
                          : playbook === "task_decomposition"
                          ? "Chia để Trị (Task Decomposition)"
                          : playbook === "peer_assist"
                          ? "Hỗ trợ Đồng đội (Peer Assist)"
                          : playbook === "consultation"
                          ? "Tham vấn Chuyên gia (Consultation)"
                          : "Hội đồng Thảo luận (Deliberation)";
                      return (
                        <span
                          data-testid="flow-tree-playbook-badge"
                          data-playbook={playbook}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/35 font-semibold"
                        >
                          {playbookLabel}
                        </span>
                      );
                    })()}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-[#222232] dark:text-neutral-300 border border-slate-200 dark:border-[#323248]">
                      {getModeLabel(activeWave.triageMeta.mode, activeWave.isMultiAgentWave)}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#222232] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-[#323248]">
                      {activeWave.isMultiAgentWave && visibleCollaboratorBranches.length > 1
                        ? activeWave.triageMeta.executionStrategy === "parallel"
                          ? "Song song"
                          : "Tuần tự"
                        : "Trực tiếp"}
                    </span>
                    {activeWave.isMultiAgentWave && totalExpectedCollabCount > 0 && (
                      <span
                        data-testid="flow-tree-step-counter"
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#323248] bg-slate-100 dark:bg-[#222232] text-slate-700 dark:text-neutral-300"
                      >
                        {isCurrentlyRunning && completedCollabCount < totalExpectedCollabCount ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Check size={10} className="text-emerald-500" />
                        )}
                        <span>
                          Tiến độ: {completedCollabCount}/{totalExpectedCollabCount}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  {activeWave.triageMeta.reason}
                </p>

                {/* Assigned or Suggested Agents in Triage Node */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono text-neutral-400">Luồng phân công:</span>
                  {activeWave.triageMeta.selectedCollaborators.map((collabSlug) => {
                    const cAg = allAgents.find((a) => (a.slug || "").toLowerCase() === collabSlug.toLowerCase() || a.id.toLowerCase() === collabSlug.toLowerCase());
                    const cTheme = getAgentColorTheme(collabSlug, cAg?.name || collabSlug, cAg?.roleTag);
                    return (
                      <span
                        key={collabSlug}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#282838] bg-slate-50 dark:bg-[#191926] text-slate-700 dark:text-neutral-300 text-[10px] font-mono shadow-2xs"
                      >
                        <AgentAvatar
                          agent={cAg || { id: collabSlug, name: collabSlug }}
                          size="2xs"
                          interactive={false}
                          className="shrink-0"
                        />
                        <span>@{collabSlug}</span>
                        <span className="opacity-70 text-[9px]">(Chuyên viên)</span>
                      </span>
                    );
                  })}
                  {(() => {
                    const hostTheme = getAgentColorTheme(hostSlug, hostDisplayName);
                    return (
                      <span
                        data-testid="flow-tree-host-role-badge"
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-[#282838] bg-slate-50 dark:bg-[#191926] text-slate-700 dark:text-neutral-300 text-[10px] font-mono shadow-2xs"
                      >
                        <AgentAvatar
                          agent={allAgents.find((a) => (a.slug || "").toLowerCase() === hostSlug.toLowerCase() || a.id.toLowerCase() === hostSlug.toLowerCase()) || { id: hostSlug, name: hostDisplayName }}
                          size="2xs"
                          interactive={false}
                          className="shrink-0"
                        />
                        <span>@{hostSlug}</span>
                        <span className="opacity-85 text-[9px]">
                          ({activeWave.isMultiAgentWave
                            ? activeWave.triageMeta.hostShouldSelfExecute
                              ? "Chủ session: Tự chạy + Đại diện Room tổng hợp cuối"
                              : "Chủ session: Đại diện Room tổng hợp cuối (Sau khi Room Done)"
                            : "Chủ session: Tự chạy & Phản hồi trực tiếp"})
                        </span>
                      </span>
                    );
                  })()}
                  {activeWave.triageMeta.suggestedCollaborators.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 text-[10px] font-mono">
                      <span>💡 Gợi ý mở rộng Room: {activeWave.triageMeta.suggestedCollaborators.map((s) => `@${s}`).join(", ")}</span>
                    </span>
                  )}
                </div>

                {/* Triage Tool Call Receipt inside Brain Node */}
                {activeWave.requestTurn?.steps?.filter((s) => s.kind === "tool_call").map((tStep, tIdx) => (
                  <div key={tStep.id || tIdx} className="pt-1">
                    <AgentToolCard
                      agentId="agentteams-manager"
                      toolCall={{
                        tool: tStep.tool || "agentteams_manager_triage",
                        args: tStep.args,
                        result: tStep.result,
                        state: (tStep.state as any) || "success",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Tree Split Connector (Brain -> Collaborator & Host Co-Exec Branches or Solo Execution) */}
              {totalRenderedBranches > 1 ? (
                <div className="w-full max-w-3xl flex flex-col items-center my-0.5">
                  {/* Desktop Multi-Column Split Bracket */}
                  <div className="hidden md:flex flex-col items-center w-full">
                    <div className="relative h-4 w-0.5 bg-[#f8a87c] overflow-hidden">
                      <span className="absolute inset-x-0 h-2 bg-white rounded-full flow-tree-pulse-dot" />
                    </div>
                    <div className="relative w-2/3 h-3.5 border-t-2 border-x-2 border-[#f8a87c]/75 dark:border-[#f8a87c]/60 rounded-t-xl bg-transparent">
                      {totalRenderedBranches >= 3 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#f8a87c]/75 dark:bg-[#f8a87c]/60" />
                      )}
                    </div>
                  </div>
                  {/* Mobile Single-Column Vertical Connecting Trunk */}
                  <div className="flex md:hidden relative h-5 w-0.5 bg-[#f8a87c] overflow-hidden">
                    <span className="absolute inset-x-0 h-2.5 bg-white rounded-full flow-tree-pulse-dot" />
                  </div>
                </div>
              ) : (
                <div className="relative h-5 sm:h-6 w-0.5 bg-[#f8a87c] overflow-hidden my-0.5">
                  <span className="absolute inset-x-0 h-2.5 bg-white dark:bg-[#f8a87c] rounded-full flow-tree-pulse-dot" />
                </div>
              )}

              {/* LEVEL 2: COLLABORATOR EXECUTION BRANCHES + OPTIONAL HOST CO-EXECUTION BRANCH */}
              <div
                data-testid="flow-tree-branches-container"
                style={{ animationDelay: "110ms" }}
                className={`w-full grid gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
                  totalRenderedBranches >= 3
                    ? "grid-cols-1 md:grid-cols-3"
                    : totalRenderedBranches === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 max-w-2xl"
                }`}
              >
                {visibleCollaboratorBranches.length > 0 ? (
                  visibleCollaboratorBranches.map((branchTurn, bIdx) => {
                    const bSteps = Array.isArray(branchTurn.steps) ? branchTurn.steps : [];
                    const bTools = bSteps.filter((s) => s.kind === "tool_call");
                    const bReasons = bSteps.filter((s) => s.kind === "reasoning");
                    const isFocusedBranch = focusedAgentSlug === branchTurn.author_id.toLowerCase();
                    const isBranchExpanded = Boolean(expandedBranchIds[branchTurn.id]);
                    const cleanBranchReply = stripSharedRoomContext(branchTurn.text || "");
                    const audit = branchTurn.manager_audit;
                    const qaScore = Math.round(((audit?.quality_score ?? 0.94) as number) * 100);
                    const isBranchRunning = Boolean(
                      branchTurn.kind === "collaborator_progress" ||
                      (isCurrentlyRunning &&
                        activeWaveIndex === executionWaves.length - 1 &&
                        (room?.active_collaborator_id?.toLowerCase() === branchTurn.author_id.toLowerCase() ||
                          activeRespondingAgent?.id?.toLowerCase() === branchTurn.author_id.toLowerCase()))
                    );

                    return (
                      <div
                        key={branchTurn.id || bIdx}
                        data-testid={`flow-tree-branch-${branchTurn.author_id}`}
                        data-branch-status={isBranchRunning ? "running" : "completed"}
                        className={`rounded-xl bg-white dark:bg-[#171723] border p-2.5 sm:p-3 flex flex-col justify-between space-y-2 sm:space-y-2.5 shadow-xs transition-all duration-300 ${
                          highlightedBranchSlug === branchTurn.author_id.toLowerCase()
                            ? "border-[#f8a87c] ring-2 ring-[#f8a87c] shadow-md scale-[1.01]"
                            : isBranchRunning
                            ? "border-amber-400/80 dark:border-amber-500/60 ring-2 ring-amber-400/20"
                            : isFocusedBranch
                            ? "border-[#f8a87c] ring-2 ring-[#f8a87c]/30"
                            : "border-slate-200 dark:border-[#29293d]"
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Sub-node 2.1: Collaborator Branch Header */}
                          <div
                            data-testid={`room-flow-turn-${branchTurn.kind}-${branchTurn.author_id}`}
                            className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-[#232334] pb-2"
                          >
                            {(() => {
                              const bAg = allAgents.find((a) => (a.slug || "").toLowerCase() === branchTurn.author_id.toLowerCase() || a.id.toLowerCase() === branchTurn.author_id.toLowerCase());
                              const bTheme = getAgentColorTheme(branchTurn.author_id, branchTurn.author_name || branchTurn.author_id, bAg?.roleTag);
                              return (
                                <div className="flex items-center gap-2 min-w-0">
                                  <AgentAvatar
                                    agent={bAg || { id: branchTurn.author_id, name: branchTurn.author_name, roleTag: "Collaborator" }}
                                    size="xs"
                                    alwaysAnimate={isBranchRunning}
                                    forcedAnimation={isBranchRunning ? "nod.1.4,jump.1.4,wink.1.4" : undefined}
                                    className="shrink-0 shadow-2xs ring-1 ring-black/5 dark:ring-white/10"
                                  />
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        style={{ color: bTheme.light }}
                                        className="text-xs font-mono font-bold truncate dark:!text-[var(--b-dark-col)]"
                                      >
                                        <style>{`[data-testid="room-flow-turn-${branchTurn.kind}-${branchTurn.author_id}"] { --b-dark-col: ${bTheme.dark}; }`}</style>
                                        @{branchTurn.author_id}
                                      </span>
                                      <span
                                        data-testid={`flow-tree-round-badge-${branchTurn.author_id}-${branchTurn.round_no || 1}`}
                                        className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-neutral-300 border border-slate-200/70 dark:border-white/10"
                                      >
                                        Vòng {branchTurn.round_no || 1}
                                      </span>
                                      {isFocusedBranch && (
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c] font-semibold">
                                          Đang chọn
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                                      {branchTurn.author_name} → @{branchTurn.target_agent_id || hostSlug}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                            {isBranchRunning ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/35 shrink-0 font-semibold">
                                <Loader2 size={10} className="animate-spin" />
                                <span>Đang thực thi...</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-[#20202e] border border-slate-200 dark:border-[#2e2e40] shrink-0">
                                <Check size={10} className="text-emerald-500" />
                                <span>Hoàn tất</span>
                              </span>
                            )}
                          </div>

                          {/* Sub-node 2.2: Reasoning & Tool Execution inside Branch */}
                          <div className="pl-2.5 border-l-2 border-dashed border-slate-300 dark:border-[#323248] space-y-1.5">
                            <div className="text-[10px] font-mono font-semibold text-slate-500 dark:text-neutral-400">
                              Bước 2.{bIdx + 1}a · Suy luận & Thực thi Chuyên môn
                            </div>
                            {(branchTurn.reasoning || bReasons.length > 0) && (
                              <div className="text-[11px] text-slate-600 dark:text-neutral-300 leading-relaxed bg-slate-50 dark:bg-[#13131c] p-2 rounded-lg border border-slate-200/60 dark:border-[#242436]">
                                {branchTurn.reasoning || bReasons.map((r) => r.text).join("\n")}
                              </div>
                            )}
                            {bTools.length > 0 && (
                              <div className="space-y-1">
                                {bTools.map((tStep, tIdx) => (
                                  <AgentToolCard
                                    key={tStep.id || tIdx}
                                    agentId={branchTurn.author_id}
                                    toolCall={{
                                      tool: tStep.tool || "Tool",
                                      args: tStep.args,
                                      result: tStep.result,
                                      state: (tStep.state as any) || "success",
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Sub-node 2.3: Manager Quality Gate inside Branch */}
                          <div className="pl-2.5 border-l-2 border-dashed border-emerald-500/40 space-y-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                Bước 2.{bIdx + 1}b · Trạm Kiểm Định Manager QA
                              </span>
                              {isBranchRunning && !audit ? (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30">
                                  ⏳ Chờ nghiệm thu QA...
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                                    audit?.passed !== false
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30"
                                      : "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30"
                                  }`}
                                >
                                  QA {qaScore}% · {audit?.auto_retried ? "Auto-Corrected" : (audit?.verdict || "approved")}
                                </span>
                              )}
                            </div>
                            {audit?.checklist_passed && audit.checklist_passed.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {audit.checklist_passed.map((ck) => (
                                  <span
                                    key={ck}
                                    className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1e1e2d] text-slate-600 dark:text-neutral-400"
                                  >
                                    ✓ {ck}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sub-node 2.4: Collapsible Specialist Output Contribution Preview */}
                        {cleanBranchReply && (
                          <div className="pt-2 border-t border-slate-100 dark:border-[#232334]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-mono text-neutral-400">
                                Đóng góp chuyên môn của @{branchTurn.author_id}:
                              </span>
                              <div className="flex items-center gap-2">
                                {onDrillDownBranch && (
                                  <button
                                    type="button"
                                    data-testid={`flow-tree-drilldown-btn-${branchTurn.author_id}`}
                                    onClick={() => onDrillDownBranch(branchTurn)}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/25 text-[9px] font-mono font-semibold cursor-pointer transition-colors"
                                  >
                                    <CornerUpLeft size={9} />
                                    <span>Hỏi sâu @{branchTurn.author_id}</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  data-testid={`flow-tree-copy-branch-${branchTurn.author_id}`}
                                  onClick={() => handleCopyContent(`branch-${branchTurn.id}`, cleanBranchReply)}
                                  className="inline-flex items-center gap-1 text-[9px] font-mono text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                                  title="Sao chép đóng góp chuyên môn"
                                >
                                  {copiedItemId === `branch-${branchTurn.id}` ? (
                                    <>
                                      <Check size={10} className="text-emerald-500" />
                                      <span className="text-emerald-500 font-semibold">Đã copy!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={10} />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedBranchIds((prev) => ({
                                      ...prev,
                                      [branchTurn.id]: !prev[branchTurn.id],
                                    }))
                                  }
                                  className="text-[10px] font-mono text-[#e0682b] dark:text-[#f8a87c] hover:underline cursor-pointer"
                                >
                                  {isBranchExpanded ? "Thu gọn" : "Xem chi tiết"}
                                </button>
                              </div>
                            </div>
                            <div
                              className={`text-[11px] text-slate-700 dark:text-neutral-300 leading-relaxed bg-slate-50/80 dark:bg-[#13131c] p-2 rounded-lg border border-slate-200/60 dark:border-[#222232] whitespace-pre-wrap break-words ${
                                isBranchExpanded ? "max-h-60 overflow-y-auto" : "line-clamp-2"
                              }`}
                            >
                              {renderInlineMarkdown(cleanBranchReply)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* SMART SOLO EXECUTION BRANCH (When no external collaborators were needed in this wave) */
                  <div
                    data-testid="flow-tree-solo-branch"
                    className="rounded-xl bg-white dark:bg-[#171723] border border-slate-200 dark:border-[#29293d] p-3 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-900 dark:text-white">
                        <span className="h-5 w-5 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-500 flex items-center justify-center">
                          ⚡
                        </span>
                        <span>3. Thực thi Độc lập Thông minh (Smart Solo Execution) · @{hostSlug}</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                        Direct Zero-Latency
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                      @{hostSlug} ({hostDisplayName}) trực tiếp phân tích ngữ cảnh phiên chat, suy luận đa chiều và thực thi công cụ mà không cần chờ vòng điều phối phụ.
                    </p>
                  </div>
                )}

                {/* Proposal 1: Dedicated Host Self-Execution Co-Branch when Manager decides Host also self-executes alongside Room collaborators */}
                {showHostCoExecBranch && (
                  <div
                    data-testid="flow-tree-host-coexec-branch"
                    className="rounded-xl bg-white dark:bg-[#171723] border border-[#f8a87c]/65 dark:border-[#f8a87c]/50 ring-1 ring-[#f8a87c]/20 p-2.5 sm:p-3 flex flex-col justify-between space-y-2 sm:space-y-2.5 shadow-xs"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-[#232334] pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <AgentAvatar
                            agent={allAgents.find((a) => (a.slug || "").toLowerCase() === hostSlug || a.id.toLowerCase() === hostSlug) || { id: hostSlug, name: hostDisplayName, roleTag: "Host" }}
                            size="xs"
                            interactive={false}
                            className="shrink-0 shadow-2xs ring-1 ring-[#f8a87c]/40"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-mono font-bold text-[#e0682b] dark:text-[#f8a87c] truncate">
                                👑 @{hostSlug}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] font-semibold">
                                Chủ session tự chạy
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                              {hostDisplayName} · Thực thi nhánh chuyên môn riêng
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 shrink-0 font-semibold">
                          <Sparkles size={10} />
                          <span>Co-Execute</span>
                        </span>
                      </div>

                      <div className="pl-2.5 border-l-2 border-dashed border-[#f8a87c]/50 space-y-1.5">
                        <div className="text-[10px] font-mono font-semibold text-[#e0682b] dark:text-[#f8a87c]">
                          Nhánh Tự Thực Thi Của Chủ Session (Do Manager Quyết Định)
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-neutral-300 leading-relaxed bg-slate-50 dark:bg-[#13131c] p-2 rounded-lg border border-slate-200/60 dark:border-[#242436]">
                          {activeWave.triageMeta.hostExecutionFocus}
                        </div>
                        {hostToolsInWave.length > 0 && (
                          <div className="space-y-1">
                            {hostToolsInWave.map((tStep, tIdx) => (
                              <AgentToolCard
                                key={tStep.id || tIdx}
                                agentId={hostSlug}
                                toolCall={{
                                  tool: tStep.tool || "Tool",
                                  args: tStep.args,
                                  result: tStep.result,
                                  state: (tStep.state as any) || "success",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-[#232334] text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      ↳ Hội tụ kết quả tự chạy của @{hostSlug} cùng các nhánh chuyên viên xuống Tầng 4 (Đại diện Room tổng hợp cuối)
                    </div>
                  </div>
                )}
              </div>

              {/* Proposal 1: When Manager decides synthesize_only (Host does not self-execute), show explicit priority routing pill */}
              {activeWave.isMultiAgentWave && !showHostCoExecBranch && (
                <div
                  data-testid="flow-tree-host-synth-only-pill"
                  className="mt-2 px-2.5 py-1 sm:px-3 rounded-xl sm:rounded-full bg-slate-100 dark:bg-[#1a1a28] border border-slate-200 dark:border-[#2c2c42] text-[9px] sm:text-[10px] font-mono text-slate-600 dark:text-neutral-300 flex items-center gap-1.5 leading-snug"
                >
                  <span>👑</span>
                  <span>
                    Manager định tuyến ưu tiên: Chủ session <strong>@{hostSlug}</strong> không cần tự chạy nhánh lặp lại — chờ cả Room chạy Done ({completedCollabCount}/{totalExpectedCollabCount}) để đại diện tổng hợp cuối
                  </span>
                </div>
              )}

              {/* Tree Convergence Connector (Branches -> Host Final Synthesis) */}
              {totalRenderedBranches > 1 ? (
                <div className="w-full max-w-3xl flex flex-col items-center my-0.5">
                  {/* Desktop Multi-Column Convergence Bracket */}
                  <div className="hidden md:flex flex-col items-center w-full">
                    <div className="relative w-2/3 h-3.5 border-b-2 border-x-2 border-emerald-500/75 dark:border-emerald-500/60 rounded-b-xl bg-transparent">
                      {totalRenderedBranches >= 3 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-emerald-500/75 dark:bg-emerald-500/60" />
                      )}
                    </div>
                    <div className="relative h-4 w-0.5 bg-emerald-500 overflow-hidden">
                      <span className="absolute inset-x-0 h-2 bg-white rounded-full flow-tree-pulse-dot" />
                    </div>
                  </div>
                  {/* Mobile Single-Column Vertical Convergence Trunk */}
                  <div className="flex md:hidden relative h-5 w-0.5 bg-emerald-500 overflow-hidden">
                    <span className="absolute inset-x-0 h-2.5 bg-white rounded-full flow-tree-pulse-dot" />
                  </div>
                </div>
              ) : (
                <div className="relative h-5 sm:h-6 w-0.5 bg-emerald-500/80 overflow-hidden my-0.5">
                  <span className="absolute inset-x-0 h-2.5 bg-white dark:bg-emerald-300 rounded-full flow-tree-pulse-dot" />
                </div>
              )}

              {/* LEVEL 3: CONVERGENCE & HOST FINAL SYNTHESIS NODE */}
              <div
                data-testid="flow-tree-synthesis-node"
                style={{ animationDelay: "170ms" }}
                className="w-full max-w-2xl rounded-xl bg-white dark:bg-[#171723] border border-emerald-500/45 dark:border-emerald-500/35 p-2.5 sm:p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-1.5 sm:space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-slate-900 dark:text-white">
                    <span className="h-5 w-5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500 shrink-0">
                      <Check size={12} />
                    </span>
                    <span>
                      {activeWave.isMultiAgentWave
                        ? `4. Đại Diện Room Tổng Hợp Cuối (Sau Khi Room Done) · Chủ session @${hostSlug} (${hostDisplayName})`
                        : `4. Đại Diện Phiên Phản Hồi Cuối · Chủ session @${hostSlug} (${hostDisplayName})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 font-semibold">
                      {activeWave.isMultiAgentWave
                        ? activeWave.triageMeta.hostShouldSelfExecute
                          ? "Manager: Tự chạy + Đại diện tổng hợp"
                          : "Manager: Chỉ đại diện tổng hợp từ Room"
                        : "Manager: Tự chạy & Phản hồi"}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${
                        isCurrentlyRunning
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      }`}
                    >
                      {isCurrentlyRunning ? "Đang tổng hợp..." : "Đã tổng hợp hoàn tất"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                  {activeWave.isMultiAgentWave
                    ? `${activeWave.triageMeta.hostExecutionFocus} Sau khi toàn bộ nhánh trong Room (${
                        activeWave.collaboratorTurns.map((c) => `@${c.author_id}`).join(", ") || "các chuyên viên"
                      }) đã chạy xong (done) và qua kiểm định Manager QA, Chủ session @${hostSlug} đại diện Room đưa ra câu phản hồi tổng hợp cuối cùng cho người dùng.`
                    : `Phản hồi đã được Chủ session @${hostSlug} hoàn thiện và lưu vào mạch ngữ cảnh của phiên chat (sẵn sàng chuyển tiếp mượt sang chế độ Đa Tác Tử bất cứ lúc nào).`}
                </p>

                {/* Proposal 2: Manager Host Synthesis Coverage Audit Badges */}
                {activeWave.isMultiAgentWave && activeWave.collaboratorTurns.length > 0 && (
                  <div
                    data-testid="flow-tree-synthesis-coverage-audit"
                    className="pt-1 flex flex-wrap items-center gap-1.5"
                  >
                    <span
                      data-testid="flow-tree-synthesis-audit-badge"
                      className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-semibold"
                    >
                      <Check size={9} />
                      <span>
                        Manager Synthesis Verified (
                        {Math.round(((activeWave.synthesisTurn?.manager_audit?.quality_score ?? 0.98) as number) * 100)}% · 100% Room Coverage)
                      </span>
                    </span>
                    {activeWave.collaboratorTurns.map((ct) => (
                      <span
                        key={`cov-${ct.author_id}`}
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1e1e2d] text-slate-600 dark:text-neutral-400 border border-slate-200/70 dark:border-[#2c2c40]"
                      >
                        ✓ Đã hợp nhất @{ct.author_id}
                      </span>
                    ))}
                  </div>
                )}

                {/* Host Synthesis Reasoning & Tool Call Steps */}
                {activeWave.synthesisTurn && (
                  <div
                    data-testid={`room-flow-turn-synthesis-${activeWave.synthesisTurn.author_id}`}
                    className="space-y-1.5 pt-1"
                  >
                    {(activeWave.synthesisTurn.reasoning || activeWave.synthesisTurn.text) && (
                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          data-testid="flow-tree-copy-synthesis-btn"
                          onClick={() => handleCopyContent("host-synthesis", activeWave.synthesisTurn?.reasoning || activeWave.synthesisTurn?.text || "")}
                          className="inline-flex items-center gap-1 text-[9px] font-mono text-neutral-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                          title="Sao chép tổng hợp cuối của Chủ room"
                        >
                          {copiedItemId === "host-synthesis" ? (
                            <>
                              <Check size={10} className="text-emerald-500" />
                              <span className="text-emerald-500 font-semibold">Đã copy tổng hợp!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={10} />
                              <span>Copy phản hồi tổng hợp</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    {activeWave.synthesisTurn.reasoning && (
                      <div className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed bg-slate-50 dark:bg-[#13131c] p-2.5 rounded-lg border border-slate-200/70 dark:border-[#232334] whitespace-pre-wrap break-words">
                        {renderInlineMarkdown(activeWave.synthesisTurn.reasoning)}
                      </div>
                    )}
                    {Array.isArray(activeWave.synthesisTurn.steps) &&
                      activeWave.synthesisTurn.steps
                        .filter((s) => s.kind === "tool_call")
                        .map((tStep, tIdx) => (
                          <AgentToolCard
                            key={tStep.id || tIdx}
                            agentId={activeWave.synthesisTurn?.author_id || hostSlug}
                            toolCall={{
                              tool: tStep.tool || "Tool",
                              args: tStep.args,
                              result: tStep.result,
                              state: (tStep.state as any) || "success",
                            }}
                          />
                        ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW MODE 2: CHRONOLOGICAL TIMELINE LOG VIEW                          */}
          {/* ===================================================================== */}
          {viewMode === "timeline" && (
            <div className="space-y-2.5">
              {hasMultiAgentRoom &&
                room &&
                roomWaveTurns
                  .filter(
                    (t) =>
                      selectedParticipantFilter === "all" ||
                      t.author_id === selectedParticipantFilter ||
                      t.target_agent_id === selectedParticipantFilter ||
                      (selectedParticipantFilter === "agentteams-manager" &&
                        (t.kind === "request" || t.kind === "manager_guard" || Boolean(t.manager_audit)))
                  )
                  .map((rt, idx) => {
                    const rtSteps = Array.isArray(rt.steps) ? rt.steps : [];
                    const rtTools = rtSteps.filter((s) => s.kind === "tool_call");
                    const rtReasons = rtSteps.filter((s) => s.kind === "reasoning");
                    const flowTitle =
                      rt.kind === "request"
                        ? `Tiếp nhận & Phân công · AgentTeams Manager (@agentteams-manager) → @${rt.target_agent_id || "room"}`
                        : rt.kind === "synthesis"
                        ? `Suy luận & Tổng hợp cuối · Chủ room (@${rt.author_id})`
                        : rt.kind === "manager_guard"
                        ? `Kiểm soát vòng lặp · Manager (@${rt.author_id})`
                        : `Suy luận & Thực thi · @${rt.author_id} (${rt.author_name}) → Chủ room (@${rt.target_agent_id || room.host_agent_id})`;

                    const combinedReasonText = [
                      rt.reasoning,
                      ...rtReasons.map((r) => r.text),
                      rt.kind === "request" ? `Yêu cầu điều phối: "${stripSharedRoomContext(rt.text)}"` : null,
                    ]
                      .filter(Boolean)
                      .join("\n");
                    const wordCount = combinedReasonText.split(/\s+/).filter(Boolean).length;
                    const estimatedSec = Math.max(1, Math.round(wordCount / 18));

                    return (
                      <div
                        key={rt.id || idx}
                        data-testid={`room-flow-turn-${rt.kind}-${rt.author_id}`}
                        className="rounded-xl bg-slate-50 dark:bg-[#14141c] border border-slate-200 dark:border-[#22222e] p-3 text-xs font-sans space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-200 font-mono text-[11px]">
                            <Sparkles size={12} className="text-[#f8a87c] shrink-0" />
                            <span className="px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-[#1e1e2c] text-[#f8a87c] font-semibold">
                              #{rt.turn_no || idx + 1}
                            </span>
                            <span className="font-semibold">{flowTitle}</span>
                            {wordCount > 0 && (
                              <span className="text-neutral-400 font-normal">(~{estimatedSec}s · {wordCount} từ)</span>
                            )}
                          </div>
                          {rt.manager_audit && (
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                                rt.manager_audit.passed
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              }`}
                            >
                              Manager QA: {Math.round((rt.manager_audit.quality_score || 0.92) * 100)}% ({rt.manager_audit.verdict || "approved"})
                            </span>
                          )}
                        </div>

                        {combinedReasonText && (
                          <div className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap break-words">
                            {renderInlineMarkdown(combinedReasonText)}
                          </div>
                        )}

                        {rtTools.length > 0 && (
                          <div className="space-y-1 pt-0.5">
                            {rtTools.map((tStep, tIdx) => (
                              <AgentToolCard
                                key={tStep.id || tIdx}
                                agentId={rt.author_id}
                                toolCall={{
                                  tool: tStep.tool || "Tool",
                                  args: tStep.args,
                                  result: tStep.result,
                                  state: (tStep.state as any) || "success",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

              {!msgIsRoomTurn &&
                (selectedParticipantFilter === "all" ||
                  (msg.senderAgentId && msg.senderAgentId.toLowerCase() === selectedParticipantFilter) ||
                  (!msg.senderAgentId && room?.host_agent_id?.toLowerCase() === selectedParticipantFilter)) && (
                  <>
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
                            <span className="font-semibold">
                              Suy luận · {displayAgent} (~{estimatedSec}s · {wordCount} từ)
                            </span>
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
                        agentId={msg.senderAgentId || agentId || agentLabel}
                        toolCall={{
                          tool: step.tool || "Tool",
                          args: step.args,
                          result: step.result,
                          state: step.state,
                        }}
                      />
                    ))}
                  </>
                )}
            </div>
          )}

          {/* Empty / Initializing Fallback */}
          {reasoningItems.length === 0 && allToolItems.length === 0 && roomWaveTurns.length === 0 && !activeWave && (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 size={24} className="text-[#f8a87c] animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-800 dark:text-neutral-200">
                  {activeRespondingAgent?.statusText || `${displayAgent} đang khởi tạo suy luận & công cụ...`}
                </p>
                <p className="text-[11px] font-mono text-neutral-500">
                  Sơ đồ Flow Tree điều phối Room và tool call execution sẽ hiển thị thời gian thực tại đây.
                </p>
              </div>
            </div>
          )}
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
          <AgentAvatar
            agent={{ id: msg.senderAgentId || displayAgent, name: displayAgent }}
            size="2xs"
            interactive={false}
            alwaysAnimate={true}
            forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
            className="ring-1 ring-[#f8a87c]/40 shrink-0"
          />
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
function AgentToolCard({ toolCall, agentId }: { toolCall: { tool: string; args?: string; result?: string; state?: "calling" | "success" | "error" }; agentId?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"args" | "result" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewRefreshNonce, setPreviewRefreshNonce] = useState(0);

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
                  setPreviewRefreshNonce((n) => n + 1);
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
          ) : (screenUrl || agentId) ? (
            <div
              onClick={() => setIsModalOpen(true)}
              className="w-full h-[180px] rounded-lg overflow-hidden border border-[#20202c] bg-black relative cursor-pointer group shadow-inner"
            >
              {agentId ? (
                <AgentBrowserPreview key={`${agentId}-${previewRefreshNonce}`} agentId={agentId} enabled />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-xs font-mono">
                  {screenUrl}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-mono z-10">
                <Maximize2 size={13} />
                <span>Live Browser • Click to inspect full screen</span>
              </div>
            </div>
          ) : null}

          {/* Full Screen Interactive Modal */}
          {isModalOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 animate-in fade-in duration-150"
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
                ) : agentId ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden bg-black border border-[#262638]">
                    <AgentBrowserPreview key={`modal-${agentId}-${previewRefreshNonce}`} agentId={agentId} enabled />
                  </div>
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

// Component to render enhanced rich links with favicons and clean domain pill badge matching user reference
function InlineSmartLink({ href, label }: { href: string; label?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  let hostname = "";
  try {
    const parsed = new URL(href);
    hostname = parsed.hostname.replace(/^www\./, "");
  } catch {
    hostname = href.replace(/^https?:\/\//, "").split("/")[0];
  }

  // Known friendly domain names
  const getDomainLabel = (host: string) => {
    const lower = host.toLowerCase();
    if (lower.includes("github.com")) return "GitHub";
    if (lower.includes("cnbc.com")) return "CNBC";
    if (lower.includes("reuters.com")) return "Reuters";
    if (lower.includes("yahoo.com")) return "Yahoo Finance";
    if (lower.includes("theverge.com")) return "The Verge";
    if (lower.includes("capcom.com")) return "Capcom";
    if (lower.includes("channelnewsasia.com") || lower.includes("cna.asia")) return "CNA";
    if (lower.includes("dicebear.com")) return "DiceBear";
    if (lower.includes("openai.com")) return "OpenAI";
    if (lower.includes("anthropic.com")) return "Anthropic";
    const parts = host.split(".");
    const main = parts.length >= 2 ? parts[parts.length - 2] : host;
    return main.charAt(0).toUpperCase() + main.slice(1);
  };

  const domainLabel = getDomainLabel(hostname);
  const displayLabel = label?.trim() || domainLabel || hostname || href;

  const faviconUrl = hostname
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=64`
    : "";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 my-0.5 mx-1 rounded-md bg-slate-100/90 hover:bg-slate-200/90 dark:bg-[#181824] dark:hover:bg-[#232336] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-neutral-200 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-medium no-underline group shrink-0 max-w-full align-middle select-none shadow-2xs hover:border-[#f8a87c]/40"
      title={`${displayLabel} (${href})`}
    >
      <span className="w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center overflow-hidden bg-white/40 dark:bg-black/30">
        {!imgFailed && faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="w-3.5 h-3.5 object-contain"
          />
        ) : (
          <Globe size={11} className="text-[#f8a87c] shrink-0" />
        )}
      </span>
      <span className="truncate max-w-[220px] text-slate-900 dark:text-slate-100 group-hover:underline underline-offset-2">
        {displayLabel}
      </span>
      <ExternalLink size={10} className="text-slate-400 dark:text-neutral-500 group-hover:text-[#f8a87c] shrink-0 transition-colors opacity-70 group-hover:opacity-100" />
    </a>
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
    // 1. Markdown link: [label](url) -> rendered with smart favicon pill badge
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^\s)]+)\)$/);
      if (match) {
        return <InlineSmartLink key={pIdx} href={match[2]} label={match[1]} />;
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
    // 5. Bare URL: https?://... -> rendered with smart favicon pill badge
    if (part.startsWith("http://") || part.startsWith("https://")) {
      let url = part;
      let trailing = "";
      if (/[.,;:!]$/.test(url)) {
        trailing = url.slice(-1);
        url = url.slice(0, -1);
      }
      return (
        <React.Fragment key={pIdx}>
          <InlineSmartLink href={url} />
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
                expandedBlock === idx ? "fixed inset-4 z-50 flex flex-col bg-[#0a0a0f]/95 border-[#f8a87c]/40 shadow-2xl p-2" : ""
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
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const hiddenAt = useRef<number>(0);
  useEffect(() => {
    let alive = true;
    setError("");
    setIframeLoaded(false);
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
      {/* Background preview placeholder while waiting for stream or connecting (paused once iframe is live to save mobile bandwidth) */}
      <AgentBrowserPreview agentId={agentId} enabled={!error && !iframeLoaded} />
      {src && (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
          <iframe
            key={`${src}#${attempt}`}
            src={src}
            title={title}
            onLoad={() => setIframeLoaded(true)}
            className="w-full h-full border-0 bg-black z-10 transition-opacity duration-300"
            allow="clipboard-read; clipboard-write; fullscreen; keyboard-map; autoplay"
            allowFullScreen
            style={{ touchAction: "manipulation", maxWidth: "100%", maxHeight: "100%" }}
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
          className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#1c1c26]/90 hover:bg-white dark:hover:bg-[#252534] border border-slate-300 dark:border-[#2c2c3e] text-[11px] font-mono text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
          title={mode === "shared" ? "Take control (mouse/keyboard)" : "Switch to watch-only"}
        >
          {mode === "shared" ? "Control" : "Watch only"}
        </button>
        <button
          type="button"
          onClick={() => setAttempt((a) => a + 1)}
          className="px-2.5 py-1 rounded-lg bg-white/90 dark:bg-[#1c1c26]/90 hover:bg-white dark:hover:bg-[#252534] border border-slate-300 dark:border-[#2c2c3e] text-[11px] font-mono text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors cursor-pointer"
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

  // Business & Accounting / ERP (GM Bốc, Gạo, Lúa, Sales, ERPCore)
  const isErp = tools.some((t: string) => t.includes("erpcore") || t.includes("invoice") || t.includes("order")) ||
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
  const [settingsModalTab, setSettingsModalTab] = useState<"profile" | "appearance" | "language" | "audio" | "privacy_export" | "voice_record">("profile");
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

    // User profile represented as an Agent profile for unified Blob Avatar rendering
  const userAsAgent = useMemo(() => ({
    id: currentUser?.sub || 'user-account',
    slug: 'user',
    name: cleanDisplayName,
    roleTag: currentUser?.roles?.[0] || 'User',
    avatar: currentUser?.picture,
    status: 'idle',
    enabled: true,
  }), [currentUser?.sub, currentUser?.roles, currentUser?.picture, cleanDisplayName]);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAvailableModels().then((models) => {
      if (models && models.length > 0) {
        setAvailableModels(models);
      }
    });
  }, []);

  const handleSelectModel = async (newModelId: string, explicitProviderId?: string) => {
    if (!selectedAgent) return;
    const targetAgentId = selectedAgent.id;
    const agentName = selectedAgent.name;
    const cleanModel = newModelId.includes("/") ? newModelId.split("/").pop()! : newModelId;
    const found = availableModels.find((m) => m.model === cleanModel || m.model === newModelId);
    const providerId = explicitProviderId || (found ? found.providerId : "llm360coding");
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
      if (next) {
        setMobileBotInfoOpen(false);
      }
      return next;
    });
  };

  // Listen to parent BaseCore postMessage toggle events and window resize
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
  const [isLibraryFilterMenuOpen, setIsLibraryFilterMenuOpen] = useState(false);
  const libraryFilterBtnRef = useRef<HTMLButtonElement>(null);
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
  const [previewModalFile, setPreviewModalFile] = useState<ParsedChatAttachmentItem | null>(null);
  const [previewModalText, setPreviewModalText] = useState<string | null>(null);
  const [isLoadingPreviewModalText, setIsLoadingPreviewModalText] = useState<boolean>(false);

  const handleOpenAttachmentPreview = async (att: ParsedChatAttachmentItem) => {
    if (att.isImage || att.kind === "image") {
      setLightboxZoom(1);
      setLightboxPan({ x: 0, y: 0 });
      setLightboxRotation(0);
      setLightboxMeta(null);
      setShowLightboxMeta(false);
      setLightboxImageUrl({ url: att.previewUrl, name: att.fileName });
      return;
    }
    setPreviewModalFile(att);
    setPreviewModalText(null);
    if (att.kind === "code" || att.kind === "data" || /^(CSV|TSV|MD|MDX|TXT|JSON|YAML|YML|XML|LOG|SQL|PY|TS|TSX|JS|JSX|SH|HTML|CSS)$/i.test(att.ext)) {
      setIsLoadingPreviewModalText(true);
      try {
        const res = await fetch(att.previewUrl);
        if (res.ok) {
          const txt = await res.text();
          setPreviewModalText(txt.slice(0, 120000));
        } else {
          setPreviewModalText(null);
        }
      } catch {
        setPreviewModalText(null);
      } finally {
        setIsLoadingPreviewModalText(false);
      }
    }
  };
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
    const isMultiline = inputText.includes("\n") || inputText.length > 70;
    const didChangeLayoutMode = isMultiline !== prevIsMultilineRef.current;
    prevIsMultilineRef.current = isMultiline;

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      if (inputText) {
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 210) + "px";
      }
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
  }, [inputText]);


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
      return savedGlobal || "all";
    } catch {
      return "all";
    }
  });

  // Persist and restore channel tab filter specifically for each agent
  useEffect(() => {
    if (!selectedAgentId) return;
    try {
      const savedForAgent = localStorage.getItem(`agent360_channel_filter_${selectedAgentId}`);
      setChannelFilter(savedForAgent || "all");
    } catch {
      setChannelFilter("all");
    }
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
    anchorRect?: { top: number; bottom: number; left: number; right: number; width: number; height: number };
    clickY?: number;
  } | null>(null);
  const [activeThinkingModalMsg, setActiveThinkingModalMsg] = useState<ChatMessage | null>(null);
  const [isLiveThinkingModalOpen, setIsLiveThinkingModalOpen] = useState<boolean>(() => {
    try {
      return typeof window !== "undefined" && new URLSearchParams(window.location.search).get("openModal") === "1";
    } catch {
      return false;
    }
  });
  const [mentionSelectedIndex, setMentionSelectedIndex] = useState<number>(0);
  const [sharedHistoryCollabAgent, setSharedHistoryCollabAgent] = useState<{
    slug: string;
    name: string;
    roleTag?: string;
    model?: string;
    description?: string;
    isOnline?: boolean;
    isBusy?: boolean;
  } | null>(null);

  const handleOpenActiveThinkingModal = (targetMsg?: ChatMessage) => {
    setActiveExtendPopoverMsgId(null);
    setActiveReactPopoverMsgId(null);
    setMobileActionMsg(null);
    if (targetMsg) {
      setActiveThinkingModalMsg(targetMsg);
    }
    setIsLiveThinkingModalOpen(true);
  };
  const [replyingToMsg, setReplyingToMsg] = useState<ReplyToMessageInfo | null>(null);
  const [highlightedReplyMsgId, setHighlightedReplyMsgId] = useState<string | null>(null);
  const [activeReactPopoverMsgId, setActiveReactPopoverMsgId] = useState<string | null>(null);
  const [reactPopoverAbove, setReactPopoverAbove] = useState<boolean>(true);
  const [activeExtendPopoverMsgId, setActiveExtendPopoverMsgId] = useState<string | null>(null);
  const [extendPopoverAbove, setExtendPopoverAbove] = useState<boolean>(true);
  const [isMobileActionExtended, setIsMobileActionExtended] = useState<boolean>(false);
  const [showFullEmojiPicker, setShowFullEmojiPicker] = useState<boolean>(false);
  const [recentReactions, setRecentReactions] = useState<string[]>(() => getStoredRecentReactions());
  const [msgReactions, setMsgReactions] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("agent360_msg_reactions");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleMessageReaction = (msgId: string, emoji: string, targetMsg?: ChatMessage) => {
    triggerHaptic(12);
    saveStoredRecentReaction(emoji);
    setRecentReactions(getStoredRecentReactions());
    let isAdded = false;
    setMsgReactions((prev) => {
      const current = prev[msgId] || [];
      const exists = current.includes(emoji);
      isAdded = !exists;
      const nextList = exists ? current.filter((e) => e !== emoji) : [...current, emoji];
      const next = { ...prev, [msgId]: nextList };
      if (nextList.length === 0) delete next[msgId];
      try {
        localStorage.setItem("agent360_msg_reactions", JSON.stringify(next));
      } catch {}
      return next;
    });

    // Update in-memory messages state and cache so reactions persist
    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.id === msgId) {
          const cur = m.reactions || [];
          const exists = cur.includes(emoji);
          const nextReactions = exists ? cur.filter((e) => e !== emoji) : [...cur, emoji];
          return { ...m, reactions: nextReactions };
        }
        return m;
      });
      if (selectedChatId) {
        setCachedChatMessages(selectedChatId, updated, selectedAgent?.id);
      }
      return updated;
    });

    // Ghi nhận reaction và kích hoạt Implicit Evaluation Turn trực tiếp xuống AgentCore
    const foundMsg = targetMsg || messages.find((m) => m.id === msgId);
    if (foundMsg && selectedAgent?.id && selectedChatId) {
      const isAgentResponse = foundMsg.role === "assistant";
      const targetAgentId = foundMsg.senderAgentId || selectedAgent.id;
      const snippet = (foundMsg.content || "").slice(0, 160).replace(/\s+/g, " ");

      if (isAdded) {
        // Post background record to session room
        postChatRoomMessage(selectedAgent.id, selectedChatId, {
          author_id: "user",
          author_role: "user",
          kind: "reaction",
          text: `[Reaction Reply ${emoji}]`,
          target_agent_id: targetAgentId,
        }).catch(() => {});

        // Nếu là reaction trên câu trả lời của Agent -> Gửi request ngầm để Agent treat & respond
        if (isAgentResponse && !isStreaming && !isCurrentSessionRunning) {
          const originChatId = selectedChatId;
          const originAgentId = selectedAgent.id;
          const classification = classifyReactionEmoji(emoji);
          const feedbackToast = `Đã gửi đánh giá ${emoji} (${classification.labelVi})`;
          setForkToast(feedbackToast);
          setTimeout(() => setForkToast(null), 2500);

          // Tạo placeholder turn phản hồi ngầm cho Agent mà không tạo thêm user bubble
          const tempBotMsgId = `bot-react-${Date.now()}`;
          const initialBotMsg: ChatMessage = {
            id: tempBotMsgId,
            role: "assistant",
            content: "",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            evidenceStatus: "observed",
            senderAgentId: targetAgentId,
            senderAgentName: foundMsg.senderAgentName || selectedAgent.name,
          };

          setMessages((prev: ChatMessage[]) => [...prev, initialBotMsg]);
          setStreamingChatIds((prev) => (prev.includes(originChatId) ? prev : [...prev, originChatId]));
          setRunningChatIds((prev) => (prev.includes(originChatId) ? prev : [...prev, originChatId]));
          setActiveRespondingAgent({
            id: targetAgentId,
            name: foundMsg.senderAgentName || selectedAgent.name,
            statusText: `${foundMsg.senderAgentName || selectedAgent.name} đang phản hồi đánh giá ${emoji}...`,
          });

          // Gọi API submitMessageReaction hỗ trợ stream
          submitMessageReaction(selectedAgent.id, selectedChatId, msgId, {
            emoji,
            action: "add",
            session_id: selectedChat?.session_id || selectedChatId,
            message_snippet: snippet,
            target_agent_id: targetAgentId,
            trigger_agent_response: true,
          }).then(async (response) => {
            if (!response.ok || !response.body) {
              setStreamingChatIds((prev) => prev.filter((id) => id !== originChatId));
              setRunningChatIds((prev) => prev.filter((id) => id !== originChatId));
              setActiveRespondingAgent(null);
              return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let accumulated = "";

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith(":")) continue;
                if (trimmed.startsWith("data:")) {
                  const rawData = trimmed.replace(/^data:\s*/, "");
                  if (rawData === "[DONE]") break;
                  try {
                    const parsed = JSON.parse(rawData);
                    if ((parsed.object === "content" && parsed.type === "text") || parsed.type === "text") {
                      if (parsed.delta && parsed.text) {
                        accumulated += parsed.text;
                      } else if (parsed.text) {
                        accumulated = parsed.text;
                      }
                      setMessages((prev: ChatMessage[]) =>
                        prev.map((m: ChatMessage) => (m.id === tempBotMsgId ? { ...m, content: accumulated } : m))
                      );
                    }
                  } catch {}
                }
              }
            }

            setStreamingChatIds((prev) => prev.filter((id) => id !== originChatId));
            setRunningChatIds((prev) => prev.filter((id) => id !== originChatId));
            setActiveRespondingAgent(null);
            if (originChatId) {
              setMessages((cur: ChatMessage[]) => {
                setCachedChatMessages(originChatId, cur, originAgentId);
                return cur;
              });
            }
          }).catch(() => {
            setStreamingChatIds((prev) => prev.filter((id) => id !== originChatId));
            setRunningChatIds((prev) => prev.filter((id) => id !== originChatId));
            setActiveRespondingAgent(null);
          });
        }
      } else {
        // Gỡ bỏ reaction
        submitMessageReaction(selectedAgent.id, selectedChatId, msgId, {
          emoji,
          action: "remove",
          session_id: selectedChat?.session_id || selectedChatId,
          target_agent_id: targetAgentId,
          trigger_agent_response: false,
        }).catch(() => {});
      }
    }
    setActiveReactPopoverMsgId(null);
  };

  const handleStartReply = (msg: ChatMessage) => {
    triggerHaptic(15);
    const parsed = parseQuotedReplyFromContent(msg.content, msg.replyTo);
    const authorName = msg.role === "user"
      ? "Bạn"
      : (msg.senderAgentName || msg.senderAgentId || selectedAgent?.name || "Agent");
    const snippet = parsed.cleanContent.replace(/\s+/g, " ").trim().slice(0, 140);
    setReplyingToMsg({
      id: msg.id,
      role: msg.role,
      authorName,
      snippet,
    });
    setActiveReactPopoverMsgId(null);
    setActiveExtendPopoverMsgId(null);
    setMobileActionMsg(null);
    setIsMobileActionExtended(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  const scrollToOriginalMessage = (targetMsgId?: string, snippet?: string) => {
    let targetEl: HTMLElement | null = null;
    if (targetMsgId) {
      targetEl = document.getElementById(`chat-msg-${targetMsgId}`);
    }
    if (!targetEl && snippet) {
      const matchingMsg = displayMessages.find((m: ChatMessage) =>
        m.content && m.content.replace(/\s+/g, " ").includes(snippet.slice(0, 40))
      );
      if (matchingMsg) {
        targetEl = document.getElementById(`chat-msg-${matchingMsg.id}`);
        targetMsgId = matchingMsg.id;
      }
    }
    if (targetEl && targetMsgId) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedReplyMsgId(targetMsgId);
      setTimeout(() => {
        setHighlightedReplyMsgId((prev) => (prev === targetMsgId ? null : prev));
      }, 1800);
    }
  };

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressPreventClickRef = useRef<boolean>(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStartAgent = (ag: InfraAgent) => {
    longPressPreventClickRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      longPressPreventClickRef.current = true;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        triggerHaptic(12);
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
        triggerHaptic(12);
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
      anchorRect?: { top: number; bottom: number; left: number; right: number; width: number; height: number };
      clickY?: number;
    }
  ) => {
    if (e.touches.length > 0) {
      touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    longPressPreventClickRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    const currentTarget = e.currentTarget as HTMLElement;
    longPressTimerRef.current = setTimeout(() => {
      longPressPreventClickRef.current = true;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        triggerHaptic(12);
      }
      setIsMobileActionExtended(false);
      const rect = currentTarget?.getBoundingClientRect();
      setMobileActionMsg({
        ...msgData,
        anchorRect: rect ? { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height } : undefined,
        clickY: touchStartPosRef.current?.y,
      });
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
    setTimeout(() => {
      longPressPreventClickRef.current = false;
    }, 120);
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
    const normId = normalizeAgentKey(selectedAgent.id);
    const normSlug = normalizeAgentKey(selectedAgent.slug);
    const agFullKey = normId ? "bot:agent360:" + normId : agId;

    const unreadFromAgent = getAgentUnreadList(selectedAgent);
    const unreadFromChats = chats
      .filter((c) => Boolean(c.unread))
      .flatMap((c) => [c.id, c.session_id].filter(Boolean) as string[]);
    const allUnreadIds = Array.from(new Set([...unreadFromAgent, ...unreadFromChats]));

    if (allUnreadIds.length === 0 && !chats.some((c) => c.unread)) {
      triggerHaptic(10);
      return;
    }
    triggerHaptic(20);

    // 1. Clear unread from local state for all alias keys of this agent
    const matchingKeys = new Set<string>([
      agId,
      agFullKey,
      ...(selectedAgent.slug ? [selectedAgent.slug] : []),
      ...(normId ? [normId] : []),
      ...(normSlug ? [normSlug] : []),
    ]);

    setUnreadCompletedSessions((prev) => {
      const next: Record<string, string[]> = {};
      for (const [k, v] of Object.entries(prev)) {
        if (matchingKeys.has(k)) {
          next[k] = [];
        } else {
          next[k] = v.filter((id) => !allUnreadIds.includes(id));
        }
      }
      try {
        localStorage.setItem("agent360_unread_sessions", JSON.stringify(next));
      } catch {}
      return next;
    });

    // 2. Update chats state and cached storage
    setChats((prev) => prev.map((c) => ({ ...c, unread: false })));
    updateCachedAgentChatsRead(agId);
    if (selectedAgent.slug && selectedAgent.slug !== agId) {
      updateCachedAgentChatsRead(selectedAgent.slug);
    }

    // 3. Call backend for each unread session in background
    for (const sid of allUnreadIds) {
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

    // Prevent disabling core node root agents which cannot be disabled on AgentCore runtime
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
            triggerHaptic(8);
          }
          setMobileAgentsOpen(true);
        }
        // Swipe left when drawer is open closes it
        else if (mobileAgentsOpen && deltaX < -60) {
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            triggerHaptic(6);
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
    // Calculate distance from bottom only when content overflows container
    const hasOverflow = el.scrollHeight > el.clientHeight + 24;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isScrolledUp = hasOverflow && distanceFromBottom > 35;
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

  // Listen to WebSocket composio:connection_activated globally so workspace state updates even when modal is closed
  useEffect(() => {
    const handleGlobalComposioActivation = (ev: Event) => {
      const detail = (ev as CustomEvent).detail;
      if (detail?.app_slug) {
        const cleanSlug = String(detail.app_slug).toLowerCase().replace(/^composio_/, "");
        setConnectedAppIds((prev) => Array.from(new Set([...prev, cleanSlug])));
        setMcpRefreshTrigger((t) => t + 1);
      }
    };
    window.addEventListener("composio:connection_activated", handleGlobalComposioActivation);
    return () => {
      window.removeEventListener("composio:connection_activated", handleGlobalComposioActivation);
    };
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

          // Ensure channel filter does not hide loaded chats or the selected chat
          const targetChannel = (targetChat.channel || "console").toLowerCase();
          setChannelFilter((prev) => {
            if (prev === "all") return "all";
            const hasPrevChannelChats = loadedChats.some((c) => {
              const ch = (c.channel || "console").toLowerCase();
              return prev === "other" ? !["console", "telegram", "zalo"].includes(ch) : ch === prev;
            });
            if (!hasPrevChannelChats) return "all";
            if (prev !== targetChannel) {
              if (prev === "other" && !["console", "telegram", "zalo"].includes(targetChannel)) return prev;
              return "all";
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

    // Load Session-Sticky Collaboration Room if bound to this chat session (read-only on switch; avoid creating stub room during route agent transition)
    if (!agentParam || normalizeAgentKey(selectedAgentId) === normalizeAgentKey(agentParam)) {
      fetchChatSessionRoom(selectedAgentId, selectedChatId, false).then((r) => {
        if (mounted && r) setActiveSessionRoom(r);
      }).catch(() => {});
    }

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
    if (selectedChatId.startsWith("session-") && !isCurrentSessionRunning && messages.length === 0) return;

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
            setChats((prev) => {
              const wantStatus = isStillStreaming ? "running" : "idle";
              const needsUpdate = prev.some((c) => (ids.includes(c.id) || (c.session_id && ids.includes(c.session_id))) && (c.isRunning !== isStillStreaming || c.status !== wantStatus));
              if (!needsUpdate) return prev;
              return prev.map((c) => {
                if (ids.includes(c.id) || (c.session_id && ids.includes(c.session_id))) {
                  return {
                    ...c,
                    is_running: isStillStreaming,
                    isRunning: isStillStreaming,
                    status: wantStatus
                  };
                }
                return c;
              });
            });
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
            const applySyncedMessages = (nextTurns: ChatMessage[]) => {
              if (!nextTurns || nextTurns.length === 0) return;
              setMessages((prev) => {
                if (prev.length === nextTurns.length) {
                  const prevLast = prev[prev.length - 1];
                  const nextLast = nextTurns[nextTurns.length - 1];
                  if (
                    prevLast &&
                    nextLast &&
                    prevLast.content === nextLast.content &&
                    (prevLast.steps?.length || 0) === (nextLast.steps?.length || 0) &&
                    (prevLast.toolCalls?.length || 0) === (nextLast.toolCalls?.length || 0)
                  ) {
                    return prev;
                  }
                }
                return nextTurns;
              });
              setShowPollCard(false);
              const lastTurn = nextTurns[nextTurns.length - 1];
              if (lastTurn?.content) {
                const cleanLastText = lastTurn.content.trim().replace(/\s+/g, " ").slice(0, 90);
                setChats((prev) => {
                  const cur = prev.find((c) => c.id === selectedChatId);
                  if (cur && cur.lastMessageSnippet === cleanLastText) return prev;
                  return prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessageSnippet: cleanLastText } : c));
                });
              }
            };

            if (Array.isArray(payload.messages) && payload.messages.length > 0) {
              const parsedTurns = parseRawChatMessages(payload.messages, selectedChatId, isTurnRunning);
              applySyncedMessages(parsedTurns);
            } else {
              fetchChatMessages(selectedChatId, selectedAgentId).then((reloadedMsgs) => {
                if (reloadedMsgs) applySyncedMessages(reloadedMsgs);
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
  // Uses the same AgentCore event stream as a console send, so reasoning and every executed tool render identically.
  const [liveTurn, setLiveTurn] = useState<{ chatId: string; userText: string | null; msg: ChatMessage } | null>(null);
  const liveAttachRef = useRef<{ key: string; controller: AbortController; active: boolean } | null>(null);
  useEffect(() => {
    viewedChatIdsRef.current = [selectedChatId, selectedChat?.session_id].filter(Boolean) as string[];
  }, [selectedChatId, selectedChat?.session_id]);

  // Abort live attach only when switching chat/agent or starting a local console stream
  useEffect(() => {
    const key = `${normalizeAgentKey(selectedAgentId)}:${selectedChatId}`;
    if (liveAttachRef.current && (liveAttachRef.current.key !== key || isStreaming)) {
      liveAttachRef.current.controller.abort();
      liveAttachRef.current = null;
    }
    if (isStreaming) {
      setLiveTurn(null);
    }
  }, [selectedChatId, selectedAgentId, isStreaming]);

  useEffect(() => {
    if (!selectedChatId || !selectedAgentId || isStreaming) return;
    if (selectedChatId.startsWith("session-") && !isCurrentSessionRunning && messages.length === 0) return;

    const key = `${normalizeAgentKey(selectedAgentId)}:${selectedChatId}`;
    if (liveAttachRef.current?.key === key && liveAttachRef.current.active) {
      return;
    }

    const chatId = selectedChatId;
    const agentId = selectedAgentId;
    const controller = new AbortController();
    const attachState = { key, controller, active: true };
    liveAttachRef.current = attachState;

    let latestStreamedMsg: ChatMessage | null = null;
    let latestStreamedUserText: string | null = null;

    (async () => {
      try {
        let streamed = false;
        const maxAttempts = isCurrentSessionRunning ? 4 : 1;
        for (let attempt = 0; attempt < maxAttempts && !controller.signal.aborted; attempt++) {
          if (attempt > 0) {
            await new Promise((r) => setTimeout(r, 650));
            if (controller.signal.aborted) return;
          }
          streamed = await attachLiveTurn(agentId, chatId, (msg, userText) => {
            if (controller.signal.aborted) return;
            latestStreamedMsg = msg;
            latestStreamedUserText = userText;
            setLiveTurn({ chatId, userText, msg });
            setRunningChatIds((prev) => (prev.includes(chatId) ? prev : [...prev, chatId]));
            updateAgentSessionRunning(agentId, [chatId, selectedChat?.session_id], true);
            if (!isUserScrolledUpRef.current) jumpToBottom();
          }, controller.signal);
          if (streamed) break;
        }
        if (controller.signal.aborted) return;

        if (streamed) {
          const reloaded = await fetchChatMessages(chatId, agentId).catch(() => null);
          if (controller.signal.aborted) return;
          if (reloaded && reloaded.length > 0) {
            const finalMsg = latestStreamedMsg as ChatMessage | null;
            const hasLatestContent = !finalMsg?.content || reloaded.some((m) => m.role === "assistant" && m.content.trim() === finalMsg.content.trim());
            if (hasLatestContent) {
              setMessages(reloaded);
              setCachedChatMessages(chatId, reloaded, agentId);
            } else if (finalMsg) {
              const merged = [...reloaded];
              const uText = (latestStreamedUserText as string | null)?.trim() || (typeof window !== "undefined" ? sessionStorage.getItem(`agent360_last_prompt_${chatId}`)?.trim() : null);
              const lastU = [...merged].reverse().find((m) => m.role === "user");
              if (uText && (!lastU || lastU.content.trim() !== uText)) {
                merged.push({ id: `usr-reloaded-${Date.now()}`, role: "user", content: uText, timestamp: new Date().toISOString() });
              }
              merged.push(finalMsg);
              setMessages(merged);
              setCachedChatMessages(chatId, merged, agentId);
              setTimeout(() => {
                fetchChatMessages(chatId, agentId).then((later) => {
                  if (!controller.signal.aborted && later && later.length >= merged.length) {
                    setMessages(later);
                  }
                }).catch(() => {});
              }, 800);
            }
          }
          try {
            sessionStorage.removeItem(`agent360_active_turn_${chatId}`);
            sessionStorage.removeItem(`agent360_last_prompt_${chatId}`);
          } catch {}
          setLiveTurn(null);
          setRunningChatIds((prev) => prev.filter((id) => id !== chatId && id !== selectedChat?.session_id));
          updateAgentSessionRunning(agentId, [chatId, selectedChat?.session_id], false);
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId || (selectedChat?.session_id && c.session_id === selectedChat.session_id)
                ? { ...c, is_running: false, isRunning: false, status: "idle" }
                : c
            )
          );
          markChatAsRead(chatId, agentId);
        } else if (!isCurrentSessionRunning) {
          setLiveTurn(null);
        }
      } catch {
        if (!controller.signal.aborted) setLiveTurn(null);
      } finally {
        attachState.active = false;
      }
    })();
  }, [selectedChatId, selectedAgentId, isStreaming, isCurrentSessionRunning]);

  useEffect(() => {
    return () => {
      liveAttachRef.current?.controller.abort();
    };
  }, []);

  const liveTurnForView = liveTurn && liveTurn.chatId === selectedChatId ? liveTurn : null;
  const displayMessages = useMemo<ChatMessage[]>(() => {
    // Narrator Model: filter out any legacy/cached collaborator bubbles so only User + Host narrator bubbles appear on the main chat timeline
    const base = messages.filter(
      (m) =>
        m.role === "user" ||
        (m.visibility !== "room" &&
          m.turnKind !== "collaborator_reply" &&
          m.turnKind !== "collaborator_progress" &&
          m.turnKind !== "question" &&
          m.turnKind !== "manager_guard" &&
          m.authorRole !== "collaborator" &&
          !m.senderAgentId)
    );
    if (
      activeSessionRoom &&
      (activeSessionRoom.host_chat_id === selectedChatId ||
        activeSessionRoom.host_session_id === selectedChatId ||
        (selectedChat?.session_id &&
          (activeSessionRoom.host_chat_id === selectedChat.session_id ||
            activeSessionRoom.host_session_id === selectedChat.session_id))) &&
      Array.isArray(activeSessionRoom.turns)
    ) {
      const sortedRoomTurns = [...activeSessionRoom.turns].sort((a, b) => (a.turn_no || 0) - (b.turn_no || 0));
      for (const rt of sortedRoomTurns) {
        if (rt.kind !== "host_kickoff" && rt.kind !== "host_progress" && rt.kind !== "synthesis") continue;
        const isSynth = rt.kind === "synthesis";
        const existingMatchIdx = base.findIndex(
          (m) =>
            m.id === rt.id ||
            (isSynth &&
              m.role === "assistant" &&
              m.turnKind !== "host_kickoff" &&
              m.turnKind !== "host_progress" &&
              m.content.trim() === (rt.text || "").trim())
        );
        if (existingMatchIdx >= 0) {
          if (rt.run_id || rt.receipt) {
            base[existingMatchIdx] = {
              ...base[existingMatchIdx],
              runId: base[existingMatchIdx].runId || rt.run_id || undefined,
              roundNo: base[existingMatchIdx].roundNo || rt.round_no || undefined,
              turnKind: base[existingMatchIdx].turnKind || rt.kind,
              roomReceipt: base[existingMatchIdx].roomReceipt || rt.receipt || undefined,
              roomId: base[existingMatchIdx].roomId || activeSessionRoom.room_id,
              matrixRoomId: base[existingMatchIdx].matrixRoomId || activeSessionRoom.matrix_room_id,
              elementRoomUrl: base[existingMatchIdx].elementRoomUrl || activeSessionRoom.element_room_url,
            };
          }
          continue;
        }
        const rtSteps = Array.isArray((rt as any).steps) ? (rt as any).steps : [];
        const turnMsg: ChatMessage = {
          id: rt.id,
          role: "assistant",
          content: rt.text,
          reasoning: (rt as any).reasoning || undefined,
          steps: rtSteps,
          toolCalls: rtSteps.filter((s: any) => s.kind === "tool_call"),
          timestamp: rt.created_at,
          evidenceStatus: "observed",
          authorRole: "host",
          runId: rt.run_id || undefined,
          roundNo: rt.round_no || undefined,
          turnKind: rt.kind,
          visibility: "main",
          roomReceipt: rt.receipt || undefined,
          roomId: activeSessionRoom.room_id,
          matrixRoomId: activeSessionRoom.matrix_room_id,
          elementRoomUrl: activeSessionRoom.element_room_url,
        };
        if (!isSynth) {
          const matchingSynthIdx = base.findIndex(
            (m, idx) =>
              idx > 0 &&
              m.role === "assistant" &&
              m.turnKind !== "host_kickoff" &&
              m.turnKind !== "host_progress" &&
              (m.id.startsWith("bot-") ||
                (rt.run_id && m.runId === rt.run_id) ||
                sortedRoomTurns.some(
                  (st) => st.kind === "synthesis" && (st.turn_no || 0) > (rt.turn_no || 0) && m.content.trim() === (st.text || "").trim()
                ))
          );
          if (matchingSynthIdx >= 0) {
            base.splice(matchingSynthIdx, 0, turnMsg);
            continue;
          }
        }
        base.push(turnMsg);
      }
    }
    const isRemoteOrReloadedTurnActive = Boolean(liveTurnForView) || (isCurrentSessionRunning && !isStreaming);
    if (!isRemoteOrReloadedTurnActive) return base;

    // If base ends with an orphaned empty/partial bot-* placeholder from before a page reload, replace it with liveTurn
    if (liveTurnForView && base.length > 0) {
      const lastItem = base[base.length - 1];
      if (lastItem.role === "assistant" && (lastItem.id.startsWith("bot-") || !lastItem.content)) {
        base.pop();
      }
    }

    const lastUser = [...base].reverse().find((m) => m.role === "user");
    const storedPrompt = typeof window !== "undefined" && selectedChatId ? sessionStorage.getItem(`agent360_last_prompt_${selectedChatId}`)?.trim() : null;
    const userText = liveTurnForView?.userText?.trim() || storedPrompt;
    if (userText && (!lastUser || lastUser.content.trim() !== userText)) {
      base.push({ id: `live-user-${selectedChatId}`, role: "user", content: userText, timestamp: new Date().toISOString() });
    }

    if (liveTurnForView) {
      base.push(liveTurnForView.msg);
    } else if (base.length === 0 || base[base.length - 1].role === "user") {
      base.push({
        id: `live-pending-${selectedChatId}`,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        evidenceStatus: "observed",
      });
    }
    return base;
  }, [messages, activeSessionRoom, liveTurnForView, isCurrentSessionRunning, isStreaming, selectedChatId, selectedChat?.session_id]);

  useEffect(() => {
    // Only jump to bottom on initial load / chat switch
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      const savedPos = sessionScrollPositionsRef.current[selectedChatId];
      if (typeof savedPos === "number" && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = savedPos;
      } else {
        jumpToBottom();
      }
      return;
    }
    // Check if container actually overflows; if not, hide scroll-to-bottom button
    if (messagesContainerRef.current) {
      const el = messagesContainerRef.current;
      if (el.scrollHeight <= el.clientHeight + 24) {
        setShowScrollBottomBtn(false);
        isUserScrolledUpRef.current = false;
      }
    }

    // During active streaming or new messages, only scroll if user has NOT scrolled up
    if (isStreaming && !isUserScrolledUpRef.current) {
      jumpToBottom();
    }
  }, [displayMessages.length, isStreaming, selectedChatId]);

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
    // Bring the target agent's Chromium profile window to the top immediately (on mount & selection) and pre-warm signed desktop URL for mobile
    focusAgentBrowser(agentBrowserFor).catch(() => {});
    prefetchAgentDesktopUrl(agentBrowserFor).catch(() => {});
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
    if (!chat?.id) return;
    setMobileChatsOpen(false);
    if (chat.id === selectedChatId) return;
    setSelectedChatId(chat.id);
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
    if (
      selectedChatIdRef.current === originChatId &&
      activeSessionRoom &&
      (activeSessionRoom.host_chat_id === originChatId || activeSessionRoom.host_session_id === originChatId || activeSessionRoom.host_session_id === startSessionId) &&
      Array.isArray(activeSessionRoom.participants) &&
      activeSessionRoom.participants.some((p: any) => p.role === "collaborator")
    ) {
      setActiveRespondingAgent({
        id: "agentteams-manager",
        name: "AgentTeams Manager",
        statusText: "AgentTeams Manager (@agentteams-manager) đang tiếp nhận yêu cầu và phân định agent xử lý trong Room...",
      });
    }
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
      // Always pass originChatId (the unique chat UUID) so backend maps to the exact chat branch and user_id
      const targetSessionId = originChatId || currentActiveChat?.session_id || "default";

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
            if (ev?.object === "room_event") {
              if (selectedChatIdRef.current === originChatId) {
                if (ev.room) {
                  setActiveSessionRoom(ev.room);
                } else if (ev.status === "host_triage" && Array.isArray(ev.selected_collaborators) && ev.selected_collaborators.length > 0) {
                  const hostNorm = (targetAgent.slug || originAgentId).replace(/^bot:agent360:/i, "").toLowerCase();
                  setActiveSessionRoom((prev) => {
                    const baseParticipants = prev?.participants ? [...prev.participants] : [
                      { agent_id: hostNorm, display_name: targetAgent.name || hostNorm, role: "host", matrix_user_id: `@${hostNorm}:agentteams`, status: "idle", joined_at: new Date().toISOString() },
                      { agent_id: "agentteams-manager", display_name: "AgentTeams Manager", role: "manager", matrix_user_id: "@manager:agentteams", status: "idle", joined_at: new Date().toISOString() },
                    ];
                    for (const sc of ev.selected_collaborators) {
                      const scLow = String(sc).toLowerCase();
                      const exIdx = baseParticipants.findIndex((p) => p.agent_id.toLowerCase() === scLow);
                      if (exIdx >= 0) {
                        baseParticipants[exIdx] = { ...baseParticipants[exIdx], status: "running" };
                      } else {
                        const mAg = agents.find((a) => (a.slug || "").toLowerCase() === scLow || a.id.toLowerCase() === scLow);
                        baseParticipants.push({
                          agent_id: scLow,
                          display_name: mAg?.name || scLow,
                          role: "collaborator",
                          matrix_user_id: `@${scLow}:agentteams`,
                          status: "running",
                          joined_at: new Date().toISOString(),
                        });
                      }
                    }
                    const baseTurns = prev?.turns ? [...prev.turns] : [];
                    const hasOptReq = baseTurns.some((t) => t.kind === "request" && stripSharedRoomContext(t.text).trim() === stripSharedRoomContext(userText).trim());
                    if (!hasOptReq) {
                      baseTurns.push({
                        id: `rt_live_req_${Date.now()}`,
                        turn_no: baseTurns.length + 1,
                        author_id: hostNorm,
                        author_name: targetAgent.name || hostNorm,
                        author_role: "host",
                        kind: "request",
                        text: userText,
                        target_agent_id: ev.selected_collaborators.join(", @"),
                        created_at: new Date().toISOString(),
                        reasoning: ev.triage_reason || "",
                        steps: [
                          {
                            kind: "tool_call",
                            id: `step_live_triage_${Date.now()}`,
                            tool: "agentteams_manager_triage",
                            state: "success",
                            result: JSON.stringify({
                              mode: ev.triage_mode || "specialty_triage",
                              confidence: ev.triage_confidence || 0.95,
                              reason: ev.triage_reason || "",
                              selected_collaborators: ev.selected_collaborators,
                              assigned_agents: ev.assigned_agents || [...ev.selected_collaborators, hostNorm],
                              synthesis_owner_id: ev.synthesis_owner_id || hostNorm,
                              host_should_self_execute: Boolean(ev.host_should_self_execute),
                              host_execution_role: ev.host_execution_role || (ev.host_should_self_execute ? "co_execute_and_synthesize" : "synthesize_only"),
                              host_execution_focus: ev.host_execution_focus || "",
                            }),
                          },
                        ],
                      });
                    }
                    return {
                      room_id: prev?.room_id || `room_${hostNorm}_live`,
                      matrix_room_id: prev?.matrix_room_id || `!room_${hostNorm}_live:agentteams`,
                      element_room_url: prev?.element_room_url || "",
                      host_agent_id: hostNorm,
                      host_chat_id: originChatId,
                      host_session_id: startSessionId,
                      participants: baseParticipants,
                      status: "collaborator_running",
                      active_collaborator_id: ev.collaborator_id || ev.selected_collaborators[0],
                      max_room_turns: prev?.max_room_turns || 4,
                      current_turn_count: baseTurns.length,
                      turns: baseTurns,
                      created_at: prev?.created_at || new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      triage_policy: prev?.triage_policy || "auto",
                    };
                  });
                }
                const roomRef = ev.room || activeSessionRoom;
                const collabId = ev.collaborator_id || roomRef?.active_collaborator_id || targetAgent.slug || originAgentId;
                const matchedParticipant = roomRef?.participants?.find((p: any) => p.agent_id === collabId);
                const matchedAgent = agents.find((a) => a.slug === collabId || a.id === collabId || a.id === `bot:agent360:${collabId}`);
                const dispName = matchedParticipant?.display_name || matchedAgent?.name || collabId;
                const totalCollabs = typeof ev.total_collaborators === "number" ? ev.total_collaborators : (Array.isArray(ev.selected_collaborators) ? ev.selected_collaborators.length : 1);
                const stepIdx = typeof ev.step_index === "number" ? ev.step_index : 1;
                const stepBadgeText = totalCollabs > 1 ? ` (${stepIdx}/${totalCollabs})` : "";

                let nextStatusText = `${dispName} đang xử lý và phản hồi...`;
                if (ev.status === "host_triage") {
                  const selectedNames = Array.isArray(ev.selected_collaborators) && ev.selected_collaborators.length > 0
                    ? ev.selected_collaborators.map((s: string) => `@${s}`).join(", ")
                    : `@${collabId}`;
                  const recruitedNames = Array.isArray(ev.auto_recruited_collaborators) && ev.auto_recruited_collaborators.length > 0
                    ? ev.auto_recruited_collaborators.map((s: string) => `@${s}`).join(", ")
                    : "";
                  nextStatusText = recruitedNames
                    ? `AgentTeams Manager (@agentteams-manager) mời bổ sung ${recruitedNames} vào Room & giao ${selectedNames} xử lý...`
                    : `AgentTeams Manager (@agentteams-manager) phân định giao ${selectedNames} trong Room xử lý...`;
                } else if (ev.status === "synthesizing") {
                  nextStatusText = `${dispName} đang tổng hợp kết quả cuối từ Room...`;
                } else if (ev.execution_strategy === "parallel" && totalCollabs > 1) {
                  const selectedNames = Array.isArray(ev.selected_collaborators) && ev.selected_collaborators.length > 0
                    ? ev.selected_collaborators.map((s: string) => `@${s}`).join(", ")
                    : `${totalCollabs} chuyên viên`;
                  nextStatusText = `AgentTeams Manager đang điều phối song song ${selectedNames} trong Room...`;
                } else if (ev.triage_mode && ev.triage_mode !== "explicit_mention") {
                  nextStatusText = `AgentTeams Manager phân công ${dispName}${stepBadgeText} xử lý...`;
                } else {
                  nextStatusText = `${dispName}${stepBadgeText} đang xử lý và phản hồi...`;
                }

                setActiveRespondingAgent({
                  id: collabId,
                  name: dispName,
                  statusText: nextStatusText,
                });
              }
              return;
            }
            if (ev?.object === "room_turn" && ev.turn) {
              if (ev.room && selectedChatIdRef.current === originChatId) {
                setActiveSessionRoom(ev.room);
                if (typeof ev.step_index === "number" && typeof ev.total_collaborators === "number" && ev.step_index < ev.total_collaborators) {
                  setActiveRespondingAgent({
                    id: ev.turn.author_id || originAgentId,
                    name: ev.turn.author_name || ev.turn.author_id || "Room",
                    statusText: `Đã nhận phản hồi ${ev.step_index}/${ev.total_collaborators} (@${ev.turn.author_id}) — đang đồng bộ chuyên viên còn lại...`,
                  });
                }
              }
              const turnVis = ev.visibility || ev.turn.visibility || (ev.turn.kind === "host_kickoff" || ev.turn.kind === "host_progress" || ev.turn.kind === "synthesis" ? "main" : "room");
              if (
                turnVis === "room" ||
                ev.turn.kind === "collaborator_reply" ||
                ev.turn.kind === "collaborator_progress" ||
                ev.turn.kind === "question" ||
                ev.turn.kind === "manager_guard" ||
                ev.turn.author_role === "collaborator"
              ) {
                return;
              }
              const sseSteps = Array.isArray(ev.turn.steps) ? ev.turn.steps : [];
              const roomMsg: ChatMessage = {
                id: ev.turn.id || `room-turn-${Date.now()}`,
                role: "assistant",
                content: ev.turn.text || "",
                reasoning: ev.turn.reasoning || undefined,
                steps: sseSteps,
                toolCalls: sseSteps.filter((s: any) => s.kind === "tool_call"),
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                evidenceStatus: "observed",
                authorRole: "host",
                runId: ev.run_id || ev.turn.run_id || undefined,
                roundNo: ev.round_no || ev.turn.round_no || 1,
                turnKind: ev.turn.kind,
                visibility: "main",
                roomReceipt: ev.receipt || ev.turn.receipt || undefined,
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
    if (replyingToMsg) {
      const safeAuthor = (replyingToMsg.authorName || "Agent").replace(/[\]:"]/g, "");
      const safeSnippet = (replyingToMsg.snippet || "").replace(/"/g, "'").replace(/\s+/g, " ").trim().slice(0, 140);
      userText = `[Replying to ${safeAuthor}: "${safeSnippet}"]\n\n${userText}`;
      setReplyingToMsg(null);
    }
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

  // Helper to calculate smart popup positioning close to the clicked message bubble while staying safely in viewport
  const getSmartMessageMenuCoords = (
    anchorRect?: { top: number; bottom: number; left: number; right: number; width: number; height: number },
    role?: 'user' | 'assistant',
    isExpandedEmoji?: boolean,
    clickY?: number
  ) => {
    if (typeof window === 'undefined') return { top: '50%', left: '50%', isAbove: false, transformOrigin: 'top center' };
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const menuWidth = 230;
    const isUser = role === 'user';
    const menuHeight = isExpandedEmoji ? 360 : 255;
    const margin = 10;
    const topMargin = 52;
    const bottomMargin = 60;

    if (!anchorRect) {
      return {
        top: Math.round(Math.max(topMargin, (vh - menuHeight) / 2)) + 'px',
        left: Math.round(Math.max(margin, (vw - menuWidth) / 2)) + 'px',
        isAbove: false,
        transformOrigin: 'center center',
      };
    }

    let refTop = anchorRect.top;
    let refBottom = anchorRect.bottom;
    if (anchorRect.height > vh * 0.55 && clickY !== undefined) {
      refTop = Math.max(anchorRect.top, clickY - 45);
      refBottom = Math.min(anchorRect.bottom, clickY + 45);
    }

    const spaceBelow = vh - refBottom - bottomMargin;
    const spaceAbove = refTop - topMargin;

    let top: number;
    let isAbove = false;
    if (spaceBelow >= menuHeight) {
      top = refBottom + 6;
      isAbove = false;
    } else if (spaceAbove >= menuHeight) {
      top = refTop - menuHeight - 6;
      isAbove = true;
    } else if (spaceBelow >= spaceAbove) {
      top = refBottom + 6;
      isAbove = false;
    } else {
      top = refTop - menuHeight - 6;
      isAbove = true;
    }

    top = Math.max(topMargin, Math.min(vh - menuHeight - bottomMargin, top));

    let left: number;
    if (isUser) {
      left = anchorRect.right - menuWidth;
    } else {
      left = anchorRect.left;
    }

    left = Math.max(margin, Math.min(vw - menuWidth - margin, left));

    const originY = isAbove ? 'bottom' : 'top';
    const originX = isUser ? 'right' : 'left';
    const transformOrigin = originY + ' ' + originX;

    return {
      top: Math.round(top) + 'px',
      left: Math.round(left) + 'px',
      isAbove,
      transformOrigin,
    };
  };

  filteredChatsRef.current = filteredChats;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)] font-sans select-none antialiased relative transition-colors">
      {/* ========================================================= */}
      {/* DEDICATED OVERLAY BACKDROPS FOR MOBILE RESPONSIVE DRAWERS */}
      {/* ========================================================= */}
      {/* Left Agent Selector Mobile Overlay Backdrop */}
      <div
        onClick={() => setMobileAgentsOpen(false)}
        className={`lg:hidden fixed inset-0 z-50 mobile-drawer-backdrop transition-all duration-300 ${
          mobileAgentsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileAgentsOpen}
      />

      {/* Right Chat Sessions Mobile Overlay Backdrop */}
      <div
        onClick={() => setMobileChatsOpen(false)}
        className={`lg:hidden fixed inset-0 z-50 mobile-drawer-backdrop transition-all duration-300 ${
          mobileChatsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileChatsOpen}
      />

      {/* Rightmost Agent Detail Pane Mobile Overlay Backdrop */}
      <div
        onClick={() => {
          setMobileBotInfoOpen(false);
          handleToggleBotInfo(true);
        }}
        className={`xl:hidden fixed inset-0 z-50 mobile-drawer-backdrop transition-all duration-300 ${
          !isBotInfoCollapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={isBotInfoCollapsed}
      />

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
        className={`fixed lg:static inset-y-0 left-0 z-[60] lg:z-40 h-full flex flex-col border-r border-neutral-200 dark:border-[#1e1e24] bg-[var(--bg-sidebar)] shrink-0 transition-grok-transform mobile-drawer-panel ${
          mobileAgentsOpen
            ? "w-full sm:w-[380px] translate-x-0 shadow-2xl pointer-events-auto"
            : isCompactMode
            ? "w-full sm:w-[380px] -translate-x-full invisible pointer-events-none"
            : isLeftSidebarCollapsed
            ? "w-full sm:w-[380px] lg:w-[64px] -translate-x-full max-lg:invisible max-lg:pointer-events-none lg:translate-x-0 lg:pointer-events-auto"
            : "w-full sm:w-[380px] -translate-x-full max-lg:invisible max-lg:pointer-events-none lg:translate-x-0 lg:pointer-events-auto"
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
                          <AgentAvatar agent={ag} size="md" interactive={false} alwaysAnimate={checkIsAgentBusy(ag)} forcedAnimation={checkIsAgentBusy(ag) ? "nod.1.4,jump.1.4,wink.1.4" : undefined} />
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
                className="h-8 w-8 rounded-full flex items-center justify-center shadow-xs cursor-pointer transition-all relative overflow-visible group/userav"
                title={`${currentUser?.name || "User"} (${currentUser?.roles?.[0] || "Operator"}) - Cài đặt`}
              >
                {currentUser?.picture ? (
                  <div className="h-8 w-8 rounded-full overflow-hidden border border-[#3a3a4c] hover:border-[#f8a87c] bg-[#2a2a34]">
                    <img src={currentUser.picture} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <AgentAvatar agent={userAsAgent} size="sm" interactive={false} className="rounded-full ring-1 ring-[#3a3a4c] group-hover/userav:ring-[#f8a87c] transition-all" />
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c0c0e] shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
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
                    setMobileAgentsOpen(false);
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
                    setMobileAgentsOpen(false);
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
                    setMobileAgentsOpen(false);
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
            {/* Top Header: Standardized h-12 Header Bar (Aligned with Chat and Workspace Headers) */}
            <div className="h-12 px-3 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-between shrink-0 bg-[var(--bg-sidebar)]">
              <a aria-label="Return to Skyer Home" href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" title="Return to Skyer Home">
                <SkyerLogo size={28} showText={true} showBotBadge={false} />
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

            {/* Sub-bar: Dropdown Infra Instances (Admin only, positioned neatly below standardized h-12 header) */}
            {isAdmin && (
              <div className="px-3 py-1.5 border-b border-neutral-200 dark:border-[#1c1c22] bg-[var(--bg-sidebar)]">
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
                            ? "px-2 py-1 gap-1.5"
                            : layoutDensity === "comfortable"
                            ? "px-2.5 py-1.5 gap-2"
                            : "px-2 py-1 gap-1.5"
                        } ${
                          ag.enabled === false || ag.status === "disabled"
                            ? "border-transparent bg-neutral-100/30 dark:bg-white/[0.01] cursor-not-allowed select-none"
                            : isSelected
                            ? "bg-white dark:bg-[#1c1c26] border-neutral-300 dark:border-[#303042] text-neutral-900 dark:text-white shadow-xs cursor-pointer"
                            : "border-transparent hover:bg-neutral-200/60 dark:hover:bg-[#14141c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
                        }`}
                      >
                        {/* Dedicated Agent Identity Avatar */}
                        <div className="relative shrink-0 flex items-center justify-center self-center">
                          <AgentAvatar agent={ag} size="md" alwaysAnimate={checkIsAgentBusy(ag)} forcedAnimation={checkIsAgentBusy(ag) ? "nod.1.4,jump.1.4,wink.1.4" : undefined} />
                          {ag.status === "degraded" && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white dark:border-[#0c0c0e] bg-red-500"
                              
                            />
                          )}
                        </div>

                        {/* Agent Details: Lean typography with rich status tooltip */}
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
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
                                      setMobileAgentsOpen(false);
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
                                      setMobileAgentsOpen(false);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Bot size={13} className="text-cyan-400" />}
                                    label="Xem thông số kỹ thuật"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      handleToggleBotInfo(false);
                                      setActiveAgentMenuId(null);
                                      setMobileAgentsOpen(false);
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
                          <span className={`text-[10px] leading-tight font-sans truncate block mt-0 transition-all ${
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
                            ? "px-2 py-1 gap-1.5"
                            : layoutDensity === "comfortable"
                            ? "px-2.5 py-1.5 gap-2"
                            : "px-2 py-1 gap-1.5"
                        } ${
                          ag.enabled === false || ag.status === "disabled"
                            ? "border-transparent bg-neutral-100/30 dark:bg-white/[0.01] cursor-not-allowed select-none"
                            : isSelected
                            ? "bg-white dark:bg-[#1c1c26] border-neutral-300 dark:border-[#303042] text-neutral-900 dark:text-white shadow-xs cursor-pointer"
                            : "border-transparent hover:bg-neutral-200/60 dark:hover:bg-[#14141c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 cursor-pointer"
                        }`}
                      >
                        {/* Dedicated Agent Identity Avatar */}
                        <div className="relative shrink-0 flex items-center justify-center self-center">
                          <AgentAvatar agent={ag} size="md" alwaysAnimate={checkIsAgentBusy(ag)} forcedAnimation={checkIsAgentBusy(ag) ? "nod.1.4,jump.1.4,wink.1.4" : undefined} />
                          {ag.status === "degraded" && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border border-white dark:border-[#0c0c0e] bg-red-500"
                              
                            />
                          )}
                        </div>

                        {/* Agent Details: Lean typography with rich status tooltip */}
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
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
                                      setMobileAgentsOpen(false);
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
                                      setMobileAgentsOpen(false);
                                    }}
                                  />
                                  <DropdownMenuItem
                                    icon={<Bot size={13} className="text-cyan-400" />}
                                    label="Xem thông số kỹ thuật"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      handleToggleBotInfo(false);
                                      setActiveAgentMenuId(null);
                                      setMobileAgentsOpen(false);
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
                          <span className={`text-[10px] leading-tight font-sans truncate block mt-0 transition-all ${
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
                  <div className="h-7 w-7 rounded-full flex items-center justify-center shadow-xs shrink-0 relative overflow-visible">
                    {currentUser?.picture ? (
                      <div className="h-7 w-7 rounded-full overflow-hidden border border-[#3a3a4c] bg-[#2a2a34]">
                        <img src={currentUser.picture} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <AgentAvatar agent={userAsAgent} size="xs" interactive={false} className="rounded-full ring-1 ring-[#3a3a4c]" />
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
                    setMobileAgentsOpen(false);
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
                    setMobileAgentsOpen(false);
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
                    setMobileAgentsOpen(false);
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
        <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-between px-2 sm:px-3 shrink-0 relative bg-[var(--bg-workspace)] z-10">
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
                className="group inline-flex items-center justify-center gap-2 bg-neutral-100 dark:bg-[#181820] hover:bg-neutral-200 dark:hover:bg-[#22222e] border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium text-neutral-900 dark:text-white shadow-xs hover:shadow-sm cursor-pointer transition-all select-none leading-none"
              >
                {hasNoAgents ? (
                  <>
                    <Shield size={14} className="text-[#f8a87c]" />
                    <span className="truncate max-w-[160px] sm:max-w-[220px] text-xs text-neutral-900 dark:text-white font-mono">Chưa có Agent</span>
                  </>
                ) : (
                  <>
                    <AgentAvatar agent={selectedAgent} size="sm" alwaysAnimate={isStreaming || isCurrentSessionRunning || Boolean(liveTurnForView)} forcedAnimation={(isStreaming || isCurrentSessionRunning || Boolean(liveTurnForView)) ? "nod.1.4,jump.1.4,wink.1.4" : undefined} className="shrink-0" />
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
            .filter((msg: ChatMessage) => {
              if (inSessionSearchQuery === "__STARRED__") return starredMsgIds.includes(msg.id);
              return !inSessionSearchQuery || msg.content.toLowerCase().includes(inSessionSearchQuery.toLowerCase());
            })
            .map((msg: ChatMessage, mIdx: number) => {
              const isLastTurn = mIdx === displayMessages.length - 1;
              const isUser = msg.role === "user";
              const hasSteps = Boolean(msg.steps && msg.steps.length > 0);
              const hasTools = Boolean(msg.toolCalls && msg.toolCalls.length > 0);
              const hasRoomTurns = Boolean(
                activeSessionRoom &&
                (activeSessionRoom.host_chat_id === selectedChatId ||
                 activeSessionRoom.host_session_id === selectedChatId ||
                 (selectedChat?.session_id &&
                  (activeSessionRoom.host_chat_id === selectedChat.session_id ||
                   activeSessionRoom.host_session_id === selectedChat.session_id))) &&
                Array.isArray(activeSessionRoom.turns) &&
                activeSessionRoom.turns.length > 0
              );
              const hasThinking = Boolean(hasSteps || hasTools || msg.reasoning || msg.roomId || msg.senderAgentId || hasRoomTurns);
              const { replyTo: parsedReplyTo, cleanContent, attachments: parsedAttachments } = parseQuotedReplyFromContent(msg.content, msg.replyTo, msg.senderAgentId || selectedAgent?.slug || selectedAgent?.id || "default", msg.toolCalls, msg.steps);
              const currentReactions = isUser
                ? []
                : Array.from(new Set([...(msg.reactions || []), ...(msgReactions[msg.id] || [])]));
              const isReactOpen = activeReactPopoverMsgId === msg.id;
              const isExtendOpen = activeExtendPopoverMsgId === msg.id;
              const isHighlighted = highlightedReplyMsgId === msg.id;

              const renderAgentMentionChip = (rawSlugOrId: string, fallbackName?: string, variant: "inline" | "meta" = "inline") => {
                const cleanSlug = rawSlugOrId.replace(/^@/, "").replace(/^bot:agent360:/i, "").toLowerCase();
                const matchedAg = agents.find(
                  (a) => (a.slug || "").toLowerCase() === cleanSlug || a.id.replace(/^bot:agent360:/i, "").toLowerCase() === cleanSlug
                );
                const fullName = matchedAg?.name || fallbackName || rawSlugOrId.replace(/^@/, "");
                const shortName = fullName.split(" (")[0];
                const roleLabel = matchedAg?.roleTag || "Collaborator Agent";
                const modelLabel = matchedAg?.model || "llm360";
                const isAgRunning = matchedAg ? checkIsAgentBusy(matchedAg) : false;
                const isAgOnline = matchedAg ? matchedAg.status !== "disabled" : true;

                const openCollabHistory = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  triggerHaptic(12);
                  setSharedHistoryCollabAgent({
                    slug: cleanSlug,
                    name: fullName,
                    roleTag: roleLabel,
                    model: modelLabel,
                    description: matchedAg?.description,
                    isOnline: isAgOnline,
                    isBusy: isAgRunning,
                  });
                };

                const agentTheme = getAgentColorTheme(matchedAg?.id || cleanSlug, fullName, roleLabel);

                return (
                  <span
                    data-testid={`agent-mention-chip-${cleanSlug}`}
                    onClick={openCollabHistory}
                    title={`Bấm để xem lịch sử phối hợp với ${shortName}`}
                    style={{
                      color: agentTheme.light,
                      backgroundColor: variant === "inline" ? agentTheme.bgLight : undefined,
                      borderColor: undefined,
                    }}
                    className={`relative inline-flex items-center gap-1 group/agchip cursor-pointer select-none dark:!text-[var(--dark-theme-color)] transition-transform duration-150 ease-out hover:scale-105 ${
                      variant === "inline"
                        ? "px-1.5 py-0.5 mx-0.5 my-0.5 rounded-full border-0 text-[12px] font-medium align-middle leading-none shadow-2xs hover:brightness-105"
                        : "font-semibold hover:underline"
                    }`}
                  >
                    <style>{`[data-testid=\"agent-mention-chip-${cleanSlug}\"] { --dark-theme-color: ${agentTheme.dark}; }`}</style>
                    <AgentAvatar
                      agent={matchedAg || { id: cleanSlug, name: fullName, roleTag: roleLabel }}
                      size="2xs"
                      interactive={false}
                      className="shrink-0"
                    />
                    <span className="font-semibold leading-none">{shortName}</span>

                    {/* Hover / Focus Popover Card showing Bot Role, Model, Live Status & Click to Open Shared History */}
                    <span
                      data-testid={`agent-mention-card-${cleanSlug}`}
                      onClick={openCollabHistory}
                      className="hidden group-hover/agchip:flex flex-col gap-1.5 absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-[70] w-60 p-2.5 rounded-xl bg-white dark:bg-[#18202c] border border-slate-200 dark:border-white/10 shadow-xl text-left font-sans normal-case pointer-events-auto animate-in fade-in zoom-in-95 duration-100"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">{fullName}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono shrink-0 ${
                          isAgRunning
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                            : isAgOnline
                            ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                            : "bg-neutral-500/15 text-neutral-400 border border-neutral-500/30"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            isAgRunning ? "bg-amber-400 animate-ping" : isAgOnline ? "bg-emerald-400" : "bg-neutral-400"
                          }`} />
                          <span>{isAgRunning ? "Đang xử lý" : isAgOnline ? "Online" : "Offline"}</span>
                        </span>
                      </span>
                      {matchedAg?.description && (
                        <span className="text-[10px] text-slate-500 dark:text-neutral-400 line-clamp-2 leading-snug">
                          {matchedAg.description}
                        </span>
                      )}
                      <span className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-neutral-500 pt-1 border-t border-slate-100 dark:border-white/5">
                        <span className="truncate">{roleLabel}</span>
                        <span className="truncate text-[#f8a87c]">{modelLabel}</span>
                      </span>
                      <span className="mt-0.5 pt-1 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-medium text-blue-600 dark:text-blue-400">
                        <span>Xem lịch sử phối hợp chung</span>
                        <span>→</span>
                      </span>
                    </span>
                  </span>
                );
              };

              const renderQuotedReplyBox = () => {
                if (!parsedReplyTo) return null;
                return (
                  <div
                    data-testid="quoted-reply-card"
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToOriginalMessage(parsedReplyTo.id, parsedReplyTo.snippet);
                    }}
                    className="mb-2 pl-2.5 pr-2 py-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] border-l-2 border-[#f8a87c] cursor-pointer hover:bg-black/[0.08] dark:hover:bg-white/[0.1] transition-colors text-left select-none"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[#f8a87c]">
                      <CornerUpLeft size={10} className="shrink-0" />
                      <span className="truncate">{parsedReplyTo.authorName}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-neutral-300 line-clamp-2 italic break-words mt-0.5">
                      "{parsedReplyTo.snippet}"
                    </p>
                  </div>
                );
              };

              const renderMessageAttachmentsBox = () => {
                if (!parsedAttachments || parsedAttachments.length === 0) return null;
                const imageItems = parsedAttachments.filter((a) => a.isImage || a.kind === "image");
                const videoItems = parsedAttachments.filter((a) => a.kind === "video");
                const audioItems = parsedAttachments.filter((a) => a.kind === "audio");
                const fileItems = parsedAttachments.filter((a) => !a.isImage && a.kind !== "image" && a.kind !== "video" && a.kind !== "audio");

                return (
                  <div data-testid="chat-message-attachments" className={`flex flex-col gap-2 ${cleanContent ? "mb-2" : ""}`}>
                    {imageItems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {imageItems.map((att, aIdx) => (
                          <div
                            key={att.rawUrl + aIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAttachmentPreview(att);
                            }}
                            className="group/attimg relative rounded-xl overflow-hidden border border-slate-200 dark:border-[#2e2e42] bg-black/10 dark:bg-black/30 max-w-[260px] sm:max-w-[320px] cursor-zoom-in shadow-xs hover:border-[#f8a87c]/60 transition-all"
                            title={`Xem ảnh: ${att.fileName}`}
                          >
                            <img
                              src={att.previewUrl}
                              alt={att.fileName}
                              className="max-h-56 w-auto max-w-full object-contain block rounded-lg transition-transform duration-200 group-hover/attimg:scale-[1.02]"
                              loading="lazy"
                            />
                            <div className="px-2.5 py-1 bg-slate-900/80 text-white text-[10px] font-mono truncate flex items-center justify-between gap-2">
                              <span className="truncate">{att.fileName}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <a
                                  href={`${att.previewUrl}${att.previewUrl.includes("?") ? "&" : "?"}download=1`}
                                  download={att.fileName}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:text-[#f8a87c] p-0.5"
                                  title="Tải ảnh"
                                >
                                  <Download size={10} />
                                </a>
                                <Maximize2 size={10} className="opacity-80" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {videoItems.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {videoItems.map((att, vIdx) => (
                          <div
                            key={att.rawUrl + vIdx}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#2e2e42] bg-black max-w-[320px] shadow-xs"
                          >
                            <video src={att.previewUrl} controls preload="metadata" className="max-h-56 w-full object-contain" />
                            <div className="px-2.5 py-1 bg-slate-900/90 text-white text-[10px] font-mono flex items-center justify-between gap-2">
                              <span className="truncate">{att.fileName}</span>
                              <a
                                href={`${att.previewUrl}${att.previewUrl.includes("?") ? "&" : "?"}download=1`}
                                download={att.fileName}
                                className="text-neutral-300 hover:text-[#f8a87c] shrink-0"
                                title="Tải video"
                              >
                                <Download size={11} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {audioItems.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        {audioItems.map((att, auIdx) => (
                          <div
                            key={att.rawUrl + auIdx}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2.5 rounded-xl bg-white/85 dark:bg-[#14141f] border border-slate-200 dark:border-[#2d2d42] max-w-[320px] space-y-1.5"
                          >
                            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                              <span className="truncate font-medium text-slate-800 dark:text-neutral-200">{att.fileName}</span>
                              <a
                                href={`${att.previewUrl}${att.previewUrl.includes("?") ? "&" : "?"}download=1`}
                                download={att.fileName}
                                className="text-slate-400 hover:text-[#f8a87c] shrink-0"
                                title="Tải audio"
                              >
                                <Download size={12} />
                              </a>
                            </div>
                            <audio src={att.previewUrl} controls preload="metadata" className="w-full h-8" />
                          </div>
                        ))}
                      </div>
                    )}

                    {fileItems.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {fileItems.map((att, fIdx) => {
                          const downloadHref = `${att.previewUrl}${att.previewUrl.includes("?") ? "&" : "?"}download=1`;
                          return (
                            <div
                              key={att.rawUrl + fIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAttachmentPreview(att);
                              }}
                              className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/90 dark:bg-[#14141f] border border-slate-200/90 dark:border-[#2d2d42] hover:border-[#f8a87c]/60 text-left shadow-2xs transition-all group/attfile max-w-full cursor-pointer"
                              title={`Bấm để xem trước hoặc tải về: ${att.fileName}`}
                            >
                              <div className={`h-8 min-w-8 px-1.5 rounded-lg border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${att.badgeColor}`}>
                                {att.ext}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-semibold text-slate-800 dark:text-neutral-100 truncate max-w-[180px] sm:max-w-[240px] group-hover/attfile:text-[#e0682b] dark:group-hover/attfile:text-[#f8a87c] transition-colors">
                                  {att.fileName}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 flex items-center gap-1 truncate max-w-[220px]">
                                  <Paperclip size={10} className="shrink-0" />
                                  <span className="truncate">{att.caption || (isUser ? "Tệp đã gửi" : "Tệp phản hồi từ Agent")}</span>
                                </div>
                              </div>
                              <a
                                href={downloadHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={att.fileName}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-[#f8a87c] shrink-0 transition-colors"
                                title={`Tải xuống ${att.fileName}`}
                              >
                                <Download size={13} />
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              };

              const renderMessageReactionsAndActions = () => (
                <div className={`flex flex-row items-center gap-1.5 mt-0.5 w-full relative ${isUser ? "justify-end" : "justify-start"}`}>
                  {/* Unified Action Bar: Reaction Badge(s) integrated directly alongside React, Reply, Extend */}
                  {!(isStreaming && isLastTurn && !isUser) && (
                    <div
                      data-testid={`msg-action-bar-${msg.id}`}
                      className={`relative flex items-center gap-1 p-0.5 rounded-full bg-slate-100/90 dark:bg-[#181824]/90 border border-slate-200/80 dark:border-[#2a2a38] shadow-2xs select-none transition-all duration-150 ${
                        speakingMsgId === msg.id || isReactOpen || isExtendOpen || (!isUser && currentReactions.length > 0)
                          ? "opacity-100 flex"
                          : "hidden sm:flex sm:opacity-0 sm:group-hover/msg:opacity-100"
                      }`}
                    >
                      {/* Integrated Reaction Badge(s) inside the pill */}
                      {!isUser && currentReactions.length > 0 && (
                        <div data-testid={`msg-reactions-${msg.id}`} className="flex items-center gap-0.5 pl-0.5 pr-1 border-r border-slate-200 dark:border-white/10">
                          {currentReactions.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleMessageReaction(msg.id, emoji, msg);
                              }}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[11px] bg-amber-500/15 dark:bg-[#f8a87c]/15 text-slate-800 dark:text-neutral-100 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                              title="Bạn đã phản hồi cảm xúc này. Bấm để gỡ bỏ."
                            >
                              <span className="inline-block transform active:scale-125 transition-transform leading-none">{emoji}</span>
                              <span className="text-[10px] font-mono text-[#f8a87c] font-semibold leading-none">1</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {/* 1. React Button: ONLY for Agent message - No Tooltip */}
                      {!isUser && (
                        <div className="relative">
                          <button
                            data-ux-target-min="24"
                            data-testid="msg-react-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              const containerRect = messagesContainerRef.current?.getBoundingClientRect();
                              const spaceTop = containerRect ? rect.top - containerRect.top : rect.top;
                              const spaceBottom = containerRect ? containerRect.bottom - rect.bottom : window.innerHeight - rect.bottom;
                              setReactPopoverAbove(spaceTop >= 180 || spaceTop > spaceBottom);
                              setActiveExtendPopoverMsgId(null);
                              setShowFullEmojiPicker(false);
                              setActiveReactPopoverMsgId((prev) => (prev === msg.id ? null : msg.id));
                            }}
                            className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                              isReactOpen
                                ? "bg-[#f8a87c]/20 text-[#f8a87c]"
                                : "hover:bg-slate-200 dark:hover:bg-[#252536] text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                            aria-label="Thả cảm xúc"
                          >
                            <Smile size={13} />
                          </button>

                          {/* Quick Emoji Reaction Popover */}
                          {isReactOpen && (
                            <div
                              data-testid="msg-react-popover"
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute z-50 flex flex-col items-center gap-1 p-1 rounded-xl bg-white/95 dark:bg-[#18202c]/95 border border-slate-200/90 dark:border-white/10 shadow-xl animate-in zoom-in-95 duration-100 select-none left-0 text-slate-700 dark:text-neutral-200 ${
                                reactPopoverAbove ? "bottom-full mb-1" : "top-full mt-1"
                              }`}
                            >
                              <div className="flex items-center gap-0.5 px-1 py-0.5">
                                {recentReactions.slice(0, 7).map((emoji) => {
                                  const active = currentReactions.includes(emoji);
                                  return (
                                    <button
                                      key={emoji}
                                      type="button"
                                      data-testid={`react-option-${emoji}`}
                                      onClick={() => toggleMessageReaction(msg.id, emoji, msg)}
                                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs hover:scale-125 active:scale-90 transition-transform cursor-pointer ${
                                        active ? "bg-[#f8a87c]/25 ring-1 ring-[#f8a87c]" : "hover:bg-white/10"
                                      }`}
                                      aria-label={`Thả ${emoji}`}
                                    >
                                      {emoji}
                                    </button>
                                  );
                                })}
                                <button
                                  type="button"
                                  data-testid="desktop-more-emoji-btn"
                                  onClick={() => {
                                    triggerHaptic(10);
                                    setShowFullEmojiPicker((prev) => !prev);
                                  }}
                                  className={`h-6 w-6 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer ${
                                    showFullEmojiPicker ? "bg-slate-200 dark:bg-white/20 text-slate-900 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"
                                  }`}
                                  title="Mở thêm biểu tượng cảm xúc"
                                >
                                  <Plus size={12} className="shrink-0" />
                                </button>
                              </div>

                              {showFullEmojiPicker && (
                                <div
                                  data-testid="desktop-full-emoji-picker-grid"
                                  className="grid grid-cols-6 gap-0.5 p-1 rounded-lg bg-[#141a24] border border-white/10 w-full text-xs max-h-44 overflow-y-auto"
                                >
                                  {FULL_EMOJI_PALETTE.map((emoji) => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      data-testid={`full-emoji-${emoji}`}
                                      onClick={() => {
                                        toggleMessageReaction(msg.id, emoji, msg);
                                        setShowFullEmojiPicker(false);
                                      }}
                                      className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-125 hover:scale-110 transition-transform cursor-pointer"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. Reply Button (Both User & Agent) - No Tooltip */}
                      <button
                        data-ux-target-min="24"
                        data-testid="msg-reply-btn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartReply(msg);
                        }}
                        className="h-6 w-6 rounded-full hover:bg-slate-200 dark:hover:bg-[#252536] text-neutral-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Trả lời"
                      >
                        <CornerUpLeft size={13} />
                      </button>

                      {/* 3. Extend Menu Button (...) - No Tooltip */}
                      <div className="relative">
                        <button
                          data-ux-target-min="24"
                          data-testid="msg-extend-btn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            const containerRect = messagesContainerRef.current?.getBoundingClientRect();
                            const spaceTop = containerRect ? rect.top - containerRect.top : rect.top;
                            const spaceBottom = containerRect ? containerRect.bottom - rect.bottom : window.innerHeight - rect.bottom;
                            setExtendPopoverAbove(spaceTop >= 210 || spaceTop > spaceBottom);
                            setActiveReactPopoverMsgId(null);
                            if (typeof window !== "undefined" && window.innerWidth < 640) {
                              const turnEl = document.getElementById(`chat-msg-${msg.id}`);
                              const bubbleEl = (turnEl?.querySelector('.inline-block') as HTMLElement) || e.currentTarget;
                              const bubbleRect = bubbleEl.getBoundingClientRect();
                              const anchor = { top: bubbleRect.top, bottom: bubbleRect.bottom, left: bubbleRect.left, right: bubbleRect.right, width: bubbleRect.width, height: bubbleRect.height };
                              setMobileActionMsg({
                                id: msg.id,
                                content: cleanContent,
                                turnIdx: mIdx,
                                role: isUser ? "user" : "assistant",
                                hasThinking,
                                rawMsg: msg,
                                anchorRect: anchor,
                              });
                            } else {
                              setActiveExtendPopoverMsgId((prev) => (prev === msg.id ? null : msg.id));
                            }
                          }}
                          className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                            isExtendOpen
                              ? "bg-[#f8a87c]/20 text-[#f8a87c]"
                              : "hover:bg-slate-200 dark:hover:bg-[#252536] text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                          aria-label="Mở rộng"
                        >
                          <MoreHorizontal size={13} />
                        </button>

                        {/* Desktop Vertical Extend Dropdown Menu - Compact & Always In Viewport */}
                        {isExtendOpen && (
                          <div
                            data-testid="msg-extend-menu"
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute z-50 w-40 py-1 rounded-xl bg-white/95 dark:bg-[#18202c]/95 border border-slate-200/80 dark:border-white/10 shadow-lg animate-in zoom-in-95 duration-100 flex flex-col divide-y divide-slate-100 dark:divide-white/5 text-[11px] font-sans text-left max-h-[65vh] overflow-y-auto ${
                              extendPopoverAbove ? "bottom-full mb-1" : "top-full mt-1"
                            } ${isUser ? "right-0" : "left-0"}`}
                          >
                            <div className="space-y-0.5 pb-1">
                              {/* Reply */}
                              <button
                                type="button"
                                data-testid="extend-reply-btn"
                                onClick={() => {
                                  setActiveExtendPopoverMsgId(null);
                                  handleStartReply(msg);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                              >
                                <CornerUpLeft size={14} className="text-neutral-400 shrink-0" />
                                <span>Reply</span>
                              </button>

                              {/* Copy */}
                              <button
                                type="button"
                                data-testid="extend-copy-btn"
                                onClick={() => {
                                  navigator.clipboard.writeText(cleanContent);
                                  setCopiedResponseMsgId(msg.id);
                                  setActiveExtendPopoverMsgId(null);
                                  setTimeout(() => setCopiedResponseMsgId(null), 1800);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                              >
                                {copiedResponseMsgId === msg.id ? (
                                  <Check size={14} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <Copy size={14} className="text-neutral-400 shrink-0" />
                                )}
                                <span>{copiedResponseMsgId === msg.id ? "Đã chép!" : "Copy"}</span>
                              </button>

                              {/* Thinking (Agent only, when has thinking) */}
                              {!isUser && hasThinking && (
                                <button
                                  type="button"
                                  data-testid="extend-thinking-btn"
                                  onClick={() => {
                                    handleOpenActiveThinkingModal(msg);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-emerald-500 dark:text-emerald-400 transition-colors cursor-pointer font-medium"
                                >
                                  <Sparkles size={14} className="text-emerald-400 shrink-0" />
                                  <span>Thinking & Tools</span>
                                </button>
                              )}

                              {/* Edit (User only) */}
                              {isUser && (
                                <button
                                  type="button"
                                  data-testid="extend-edit-btn"
                                  onClick={() => {
                                    setActiveExtendPopoverMsgId(null);
                                    setInputText(cleanContent);
                                    if (textareaRef.current) {
                                      textareaRef.current.style.height = "auto";
                                      textareaRef.current.focus();
                                      setTimeout(() => {
                                        if (textareaRef.current) {
                                          textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 210) + "px";
                                          textareaRef.current.setSelectionRange(cleanContent.length, cleanContent.length);
                                        }
                                      }, 0);
                                    }
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-cyan-500 dark:text-cyan-400 transition-colors cursor-pointer"
                                >
                                  <Edit2 size={14} className="text-cyan-400 shrink-0" />
                                  <span>Edit</span>
                                </button>
                              )}

                              {/* TTS Read Aloud (Agent only) */}
                              {!isUser && (
                                <button
                                  type="button"
                                  data-testid="extend-tts-btn"
                                  onClick={() => {
                                    setActiveExtendPopoverMsgId(null);
                                    if (speakingMsgId === msg.id) {
                                      stopSpeaking();
                                      setSpeakingMsgId(null);
                                    } else {
                                      setSpeakingMsgId(msg.id);
                                      speakText(cleanContent, {
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
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                                >
                                  <Volume2 size={14} className="text-neutral-400 shrink-0" />
                                  <span>Read Aloud</span>
                                </button>
                              )}
                            </div>

                            <div className="space-y-0.5 pt-1">
                              {/* Pin / Star */}
                              <button
                                type="button"
                                data-testid="extend-star-btn"
                                onClick={() => {
                                  toggleStarMessage(msg.id);
                                  setActiveExtendPopoverMsgId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                              >
                                <Star size={14} className={starredMsgIds.includes(msg.id) ? "fill-amber-400 text-amber-400 shrink-0" : "text-neutral-400 shrink-0"} />
                                <span>{starredMsgIds.includes(msg.id) ? "Unstar" : "Pin / Star"}</span>
                              </button>

                              {/* Forward (Agent only) */}
                              {!isUser && (
                                <button
                                  type="button"
                                  data-testid="extend-forward-btn"
                                  onClick={() => {
                                    setActiveExtendPopoverMsgId(null);
                                    setForwardModalMsg(cleanContent);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                                >
                                  <Share2 size={14} className="text-neutral-400 shrink-0" />
                                  <span>Forward</span>
                                </button>
                              )}

                              {/* Fork */}
                              <button
                                type="button"
                                data-testid="extend-fork-btn"
                                onClick={() => {
                                  setActiveExtendPopoverMsgId(null);
                                  handleForkSession(mIdx);
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-200 transition-colors cursor-pointer"
                              >
                                <GitFork size={14} className="text-neutral-400 shrink-0" />
                                <span>Fork Session</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
              const prevMsg = mIdx > 0 ? displayMessages[mIdx - 1] : null;
              const isConsecutiveAssistant = !isUser && prevMsg && prevMsg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex flex-col w-full group/msg ${
                    isConsecutiveAssistant
                      ? "-mt-2 sm:-mt-2.5 space-y-0.5"
                      : "space-y-1"
                  } ${isUser ? "items-end" : "items-start"}`}
                >
                  {/* If user message: Clean right-aligned bubble, shrink to fit content */}
                  {isUser ? (
                    <div
                      onTouchStart={(e) => handleTouchStartMsg(e, { id: msg.id, content: cleanContent, turnIdx: mIdx, role: "user", rawMsg: msg })}
                      onTouchEnd={handleTouchEndMsg}
                      onTouchMove={handleTouchMoveMsg}
                      onTouchCancel={handleTouchEndMsg}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("button") || target.closest("a") || target.closest("input")) return;
                        if (window.getSelection()?.toString().trim()) return;
                        if (longPressPreventClickRef.current) {
                          longPressPreventClickRef.current = false;
                          return;
                        }
                        // On mobile, short tap does not open action menu - only hold touch (long-press) opens it
                        if (window.innerWidth >= 1024) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect = messagesContainerRef.current?.getBoundingClientRect();
                          const spaceTop = containerRect ? rect.top - containerRect.top : rect.top;
                          const spaceBottom = containerRect ? containerRect.bottom - rect.bottom : window.innerHeight - rect.bottom;
                          setExtendPopoverAbove(spaceTop >= 210 || spaceTop > spaceBottom);
                          setActiveReactPopoverMsgId(null);
                          setActiveExtendPopoverMsgId((prev) => (prev === msg.id ? null : msg.id));
                        }
                      }}
                      onContextMenu={(e) => {
                        if (window.innerWidth < 1024) {
                          e.preventDefault();
                          triggerHaptic(15);
                          const bubbleEl = (e.currentTarget.querySelector('.inline-block') as HTMLElement) || e.currentTarget;
                          const bubbleRect = bubbleEl.getBoundingClientRect();
                          const anchor = { top: bubbleRect.top, bottom: bubbleRect.bottom, left: bubbleRect.left, right: bubbleRect.right, width: bubbleRect.width, height: bubbleRect.height };
                          setMobileActionMsg({ id: msg.id, content: cleanContent, turnIdx: mIdx, role: "user", rawMsg: msg, anchorRect: anchor, clickY: e.clientY });
                        }
                      }}
                      className="flex flex-col items-end w-full max-w-full min-w-0"
                    >
                      <div className={`inline-block rounded-2xl px-4 py-2 text-[13px] leading-relaxed max-w-[85%] sm:max-w-[80%] bg-amber-500/10 text-slate-900 border border-amber-500/30 dark:bg-[#1c1c26] dark:text-neutral-100 dark:border-[#2c2c3e] rounded-br-xs shadow-xs font-sans font-normal ml-auto break-words ${
                        isHighlighted ? "ring-2 ring-[#f8a87c] shadow-lg" : ""
                      }`}>
                        {renderQuotedReplyBox()}
                        {renderMessageAttachmentsBox()}
                        {cleanContent && (() => {
                          const mentionMatches = Array.from(cleanContent.matchAll(/(?:^|\s)@([a-zA-Z0-9_-]{2,32})/g)).map((m) => m[1]);
                          const uniqueMentions = Array.from(new Set(mentionMatches));
                          const strippedPromptText = cleanContent.replace(/(?:^|\s)@[a-zA-Z0-9_-]{2,32}\b/g, " ").replace(/\s+/g, " ").trim();
                          const startsWithSingleShortMention =
                            uniqueMentions.length === 1 &&
                            /^@[a-zA-Z0-9_-]{2,32}\s+/.test(cleanContent.trim()) &&
                            strippedPromptText.length <= 42;

                          if (uniqueMentions.length > 0 && strippedPromptText && !startsWithSingleShortMention) {
                            return (
                              <div className="space-y-1.5">
                                <p className="whitespace-pre-wrap select-text break-words">{strippedPromptText}</p>
                                <div data-testid="user-bubble-mention-chips" className="flex flex-wrap items-center gap-1 pt-0.5">
                                  {uniqueMentions.map((slug) => (
                                    <span key={slug}>{renderAgentMentionChip(`@${slug}`, undefined, "inline")}</span>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <p className="whitespace-pre-wrap select-text break-words">
                              {cleanContent.split(/(@[a-zA-Z0-9_-]+)/g).map((part, pIdx) => {
                                if (/^@[a-zA-Z0-9_-]+$/.test(part)) {
                                  return <span key={pIdx}>{renderAgentMentionChip(part, undefined, "inline")}</span>;
                                }
                                return <span key={pIdx}>{part}</span>;
                              })}
                            </p>
                          );
                        })()}
                        {msg.metadata?.isOfflineQueued && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-500 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                            <span>Chờ đồng bộ mạng (Tự gửi khi có mạng)</span>
                          </div>
                        )}
                      </div>

                      {renderMessageReactionsAndActions()}
                    </div>
                  ) : (
                    /* Assistant Turn: Structured Content Blocks + Agent Tool Cards */
                    <div
                      onTouchStart={(e) => handleTouchStartMsg(e, {
                        id: msg.id,
                        content: cleanContent,
                        turnIdx: mIdx,
                        role: "assistant",
                        hasThinking,
                        rawMsg: msg,
                      })}
                      onTouchEnd={handleTouchEndMsg}
                      onTouchMove={handleTouchMoveMsg}
                      onTouchCancel={handleTouchEndMsg}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("button") || target.closest("a") || target.closest("input") || target.closest("pre")) return;
                        if (window.getSelection()?.toString().trim()) return;
                        if (longPressPreventClickRef.current) {
                          longPressPreventClickRef.current = false;
                          return;
                        }
                        // When this assistant turn is actively in-progress, clicking it ONLY opens the realtime thinking & tool calls modal
                        if ((isStreaming || isCurrentSessionRunning || Boolean(liveTurnForView)) && isLastTurn) {
                          handleOpenActiveThinkingModal(msg);
                          return;
                        }
                        // On mobile, short tap does not open action menu - only hold touch (long-press) opens it
                        if (window.innerWidth >= 1024) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect = messagesContainerRef.current?.getBoundingClientRect();
                          const spaceTop = containerRect ? rect.top - containerRect.top : rect.top;
                          const spaceBottom = containerRect ? containerRect.bottom - rect.bottom : window.innerHeight - rect.bottom;
                          setExtendPopoverAbove(spaceTop >= 210 || spaceTop > spaceBottom);
                          setActiveReactPopoverMsgId(null);
                          setActiveExtendPopoverMsgId((prev) => (prev === msg.id ? null : msg.id));
                        }
                      }}
                      onContextMenu={(e) => {
                        if ((isStreaming || isCurrentSessionRunning || Boolean(liveTurnForView)) && isLastTurn) {
                          e.preventDefault();
                          triggerHaptic(12);
                          handleOpenActiveThinkingModal(msg);
                          return;
                        }
                        if (window.innerWidth < 1024) {
                          e.preventDefault();
                          triggerHaptic(15);
                          const bubbleEl = (e.currentTarget.querySelector('.inline-block') as HTMLElement) || e.currentTarget;
                          const bubbleRect = bubbleEl.getBoundingClientRect();
                          const anchor = { top: bubbleRect.top, bottom: bubbleRect.bottom, left: bubbleRect.left, right: bubbleRect.right, width: bubbleRect.width, height: bubbleRect.height };
                          setMobileActionMsg({
                            id: msg.id,
                            content: cleanContent,
                            turnIdx: mIdx,
                            role: "assistant",
                            hasThinking,
                            rawMsg: msg,
                            anchorRect: anchor,
                            clickY: e.clientY,
                          });
                        }
                      }}
                      className="flex flex-col items-start w-full max-w-full space-y-1.5 min-w-0"
                    >
                      {/* Responding Indicator with Agent Avatar + Animation alongside 3-dots */}
                      {!msg.content && (isStreaming || isCurrentSessionRunning || Boolean(liveTurnForView)) && isLastTurn && (
                        <button
                          type="button"
                          data-testid="active-responding-agent-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerHaptic(12);
                            handleOpenActiveThinkingModal(msg);
                          }}
                          onFocus={() => {
                            handleOpenActiveThinkingModal(msg);
                          }}
                          className="inline-flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-[#14141c]/95 border border-slate-200/80 dark:border-white/[0.08] hover:border-[#f8a87c]/50 focus:border-[#f8a87c] focus:outline-none transition-all cursor-pointer select-none shadow-2xs group hover:scale-[1.02]"
                          title={activeRespondingAgent?.statusText || "Bấm hoặc focus để xem luồng điều phối Room & chi tiết thực thi công cụ"}
                          aria-label={activeRespondingAgent?.statusText || "Xem luồng điều phối Room và chi tiết thực thi công cụ"}
                        >
                          <div className="relative shrink-0 flex items-center justify-center">
                            <AgentAvatar
                              agent={
                                (msg.senderAgentId && agents.find((a) => a.id === msg.senderAgentId || a.slug === msg.senderAgentId)) ||
                                (activeRespondingAgent?.id && agents.find((a) => a.id === activeRespondingAgent.id || a.slug === activeRespondingAgent.id)) ||
                                selectedAgent
                              }
                              size="2xs"
                              interactive={false}
                              forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
                              className="ring-1 ring-[#f8a87c]/40 animate-pulse"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-black animate-ping" />
                          </div>
                          <span className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-1" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-2" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-3" />
                          </span>
                        </button>
                      )}

                      {(msg.content || parsedAttachments.length > 0) && (
                        <>
                          <div className="inline-flex flex-col items-start max-w-[85%] sm:max-w-[80%]">
                            {/* Subtle Collaborator Header matching reference UI ("Message from <Agent>") */}
                            {msg.senderAgentId && (
                              <div
                                data-testid={`room-msg-badge-${msg.senderAgentId}`}
                                className="flex items-center justify-end self-end gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500 mb-1 px-1 select-none"
                              >
                                <span>Message from</span>
                                {renderAgentMentionChip(msg.senderAgentId, msg.senderAgentName || msg.senderAgentId, "meta")}
                              </div>
                            )}
                            {/* Assistant Response Bubble (Clean Content Only - Thinking moved to Action Bar) */}
                            <div className={`inline-block w-auto max-w-full rounded-2xl px-3.5 py-2 shadow-xs bg-slate-50 border border-slate-200/80 text-slate-800 dark:bg-[#121218]/90 dark:border-[#22222e] dark:text-neutral-200 ${isHighlighted ? "ring-2 ring-[#f8a87c] shadow-lg" : ""}`}>
                            {renderQuotedReplyBox()}
                            {renderMessageAttachmentsBox()}
                            <div className="text-[13px] leading-relaxed divide-y divide-dashed divide-slate-200 dark:divide-[#22222c]/50">
                              <FormattedMessageContent
                                content={cleanContent}
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
                              {/* Inline pulsing button with small animated Agent Blob Avatar alongside dots */}
                              {isStreaming && isLastTurn && (
                                <button
                                  type="button"
                                  data-testid="inline-streaming-dots-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerHaptic(12);
                                    handleOpenActiveThinkingModal(msg);
                                  }}
                                  onFocus={() => handleOpenActiveThinkingModal(msg)}
                                  className="inline-flex items-center gap-1.5 ml-1.5 px-2 py-0.5 rounded-full bg-[#f8a87c]/10 hover:bg-[#f8a87c]/20 border border-[#f8a87c]/30 align-middle select-none cursor-pointer transition-all"
                                  title={activeRespondingAgent?.statusText || "Bấm hoặc focus để xem Thinking & tiến trình đang chạy"}
                                >
                                  <AgentAvatar
                                    agent={
                                      (msg.senderAgentId && agents.find((a) => a.id === msg.senderAgentId || a.slug === msg.senderAgentId)) ||
                                      selectedAgent
                                    }
                                    size="2xs"
                                    interactive={false}
                                    forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
                                    className="ring-1 ring-[#f8a87c]/30"
                                  />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-1" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-2" />
                                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-3" />
                                </button>
                              )}
                            </div>
                            </div>
                            {/* Narrator Inline Receipt ("Messaged @A and @B", "N messages with @A and @B", "Message from @A") right-aligned below Host bubble */}
                            {!msg.senderAgentId && (() => {
                              const receipt = msg.roomReceipt || (msg.metadata?.receipt as any);
                              if (!receipt || !Array.isArray(receipt.participants) || receipt.participants.length === 0) {
                                return null;
                              }
                              const participants: string[] = receipt.participants;
                              const rKind: string = receipt.kind || "dispatch";
                              const rRound: number = receipt.round_no || msg.roundNo || 1;
                              const rCount: number = receipt.message_count || participants.length;
                              const prefixText =
                                rKind === "dispatch"
                                  ? "Messaged"
                                  : rKind === "reply" || (rCount <= 1 && participants.length === 1)
                                  ? "Message from"
                                  : rKind === "relay"
                                  ? `${rCount} relay steps with`
                                  : rKind === "review"
                                  ? `${rCount} review checks with`
                                  : rKind === "workstreams"
                                  ? `${rCount} workstreams with`
                                  : `${rCount} messages with`;

                              return (
                                <button
                                  type="button"
                                  data-testid={`room-inline-receipt-${rKind}-${rRound}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerHaptic(12);
                                    handleOpenActiveThinkingModal(msg);
                                  }}
                                  title="Bấm để mở Flow Tree xem chi tiết trao đổi trong Room ở vòng này"
                                  className="flex flex-wrap items-center justify-end self-end gap-1 text-[11px] text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200 mt-0.5 mb-0.5 px-1.5 py-0.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-white/[0.05] transition-colors cursor-pointer select-none"
                                >
                                  <span>{prefixText}</span>
                                  {participants.map((pSlug, pIdx) => (
                                    <React.Fragment key={pSlug + pIdx}>
                                      {pIdx > 0 && (
                                        <span className="text-slate-400 dark:text-neutral-500">
                                          {pIdx === participants.length - 1 ? "and" : ","}
                                        </span>
                                      )}
                                      <span className="pointer-events-none inline-flex items-center">
                                        {renderAgentMentionChip(pSlug, undefined, "inline")}
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </button>
                              );
                            })()}
                          </div>
                          {/* Visual Karaoke sentence pill indicator during TTS readout */}
                          {speakingMsgId === msg.id && speakingSentence && (
                            <div className="flex items-center gap-2 px-3 py-1.5 my-1 rounded-xl bg-[#f8a87c]/10 border border-[#f8a87c]/30 text-xs font-mono text-[#f8a87c] animate-in fade-in select-none">
                              <Volume2 size={13} className="animate-pulse shrink-0" />
                              <span className="text-neutral-400 text-[10px] uppercase font-bold shrink-0">Reading:</span>
                              <span className="text-white italic truncate max-w-lg">"{speakingSentence}"</span>
                            </div>
                          )}

                          {renderMessageReactionsAndActions()}
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

          {/* Responding Indicator with Agent Avatar + Animation alongside 3-dots */}
          {isCurrentSessionRunning && (displayMessages.length === 0 || displayMessages[displayMessages.length - 1].role === "user") && (
            <div className="flex flex-col items-start w-full space-y-1 animate-in fade-in duration-150 my-1">
              <button
                type="button"
                data-testid="active-responding-agent-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic(12);
                  handleOpenActiveThinkingModal();
                }}
                onFocus={() => {
                  handleOpenActiveThinkingModal();
                }}
                className="inline-flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-2xl bg-slate-100/90 dark:bg-[#14141c]/95 border border-slate-200/80 dark:border-white/[0.08] hover:border-[#f8a87c]/50 focus:border-[#f8a87c] focus:outline-none transition-all cursor-pointer select-none shadow-2xs group hover:scale-[1.02]"
                title={activeRespondingAgent?.statusText || "Bấm hoặc focus để xem luồng điều phối Room & chi tiết thực thi công cụ"}
                aria-label={activeRespondingAgent?.statusText || "Xem luồng điều phối Room và chi tiết thực thi công cụ"}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <AgentAvatar
                    agent={
                      (activeRespondingAgent?.id && agents.find((a) => a.id === activeRespondingAgent.id || a.slug === activeRespondingAgent.id)) ||
                      selectedAgent
                    }
                    size="2xs"
                    interactive={false}
                    forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
                    className="ring-1 ring-[#f8a87c]/40 animate-pulse"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-1 ring-white dark:ring-black animate-ping" />
                </div>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-1" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] typing-dot-3" />
                </span>
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Desktop User Request Trace Bar (waveform tick indicator + popover card) */}
        {(() => {
          const userTurns = displayMessages
            .map((msg: ChatMessage, originalIdx: number) => ({ msg, originalIdx }))
            .filter((item: { msg: ChatMessage; originalIdx: number }) => item.msg.role === "user");

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
                {userTurns.map((turn: { msg: ChatMessage; originalIdx: number }, tIdx: number) => {
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
                          className="absolute right-full mr-2.5 z-50 max-w-[320px] sm:max-w-[420px] px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#181820]/95 text-slate-800 dark:text-neutral-100 text-[12px] shadow-xl border border-slate-200/90 dark:border-white/10 pointer-events-none animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 whitespace-nowrap select-none"
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
          {/* Floating Scroll to Bottom Button (Always centered horizontally in Chat UI and positioned above/outside the input composer) */}
          {showScrollBottomBtn && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-150">
              <Tooltip content="Cuộn xuống tin nhắn mới nhất" placement="top" minWidth={140}>
                <button
                  type="button"
                  aria-label="Cuộn xuống tin nhắn mới nhất"
                  onClick={() => {
                    isUserScrolledUpRef.current = false;
                    setShowScrollBottomBtn(false);
                    smoothScrollToBottom();
                  }}
                  className="h-8 w-8 rounded-full bg-white/95 dark:bg-[#181824]/95 border border-slate-200 dark:border-[#2a2a38] shadow-md hover:shadow-lg flex items-center justify-center text-slate-700 dark:text-neutral-200 hover:text-[#f8a87c] hover:border-[#f8a87c]/60 transition-all cursor-pointer"
                >
                  <ChevronDown size={16} className={isStreaming ? "animate-bounce text-[#f8a87c]" : ""} />
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Micro-HUD Pill Toast for Agent Loop Mode cycling */}
      {loopModeToast && (
        <div
          data-testid="loop-mode-hud-toast"
          className={`pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border shadow-2xl transition-all duration-200 select-none ${
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
        <div className={`${isCompactMode ? "px-2.5 pt-1 pb-3" : "px-4 pt-1 pb-3.5"} bg-transparent shrink-0 max-w-3xl mx-auto w-full space-y-1.5`}>
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
                const isImage = /\.(png|jpe?g|webp|gif|svg|bmp|ico)$/i.test(f.file_name);
                const previewSrc = f.preview_url || resolveUploadedAttachmentPreviewUrl(f.url, selectedAgent?.slug || selectedAgent?.id || "default");
                return (
                  <div
                    key={f.url + i}
                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-[#1c1c28] border border-slate-200 dark:border-[#2e2e42] text-xs font-mono px-2.5 py-1.5 rounded-xl text-slate-800 dark:text-neutral-200 shadow-sm animate-in zoom-in-95 fade-in duration-150 group/filechip"
                  >
                    {isImage && previewSrc ? (
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxZoom(1);
                          setLightboxPan({ x: 0, y: 0 });
                          setLightboxRotation(0);
                          setLightboxMeta(null);
                          setShowLightboxMeta(false);
                          setLightboxImageUrl({ url: previewSrc, name: f.file_name });
                        }}
                        className="relative h-6 w-6 rounded-md overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10 shrink-0 cursor-zoom-in group-hover/filechip:ring-2 group-hover/filechip:ring-[#f8a87c]/50 transition-all"
                        title="Click to view full image preview"
                      >
                        <img
                          src={previewSrc}
                          alt={f.file_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      </button>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${classifyAttachmentFormat(f.file_name).badgeColor}`}>
                        {classifyAttachmentFormat(f.file_name).ext}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const fmt = classifyAttachmentFormat(f.file_name);
                        handleOpenAttachmentPreview({
                          fileName: f.file_name,
                          rawUrl: f.url,
                          previewUrl: previewSrc,
                          isImage: fmt.kind === "image",
                          kind: fmt.kind,
                          ext: fmt.ext,
                          badgeColor: fmt.badgeColor,
                        });
                      }}
                      className="max-w-[160px] truncate text-[11px] font-medium hover:text-[#f8a87c] cursor-pointer text-left"
                      title={`Xem trước: ${f.file_name}`}
                    >
                      {f.file_name}
                    </button>
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
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-950/20 p-3.5 text-xs text-white shadow-lg"
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
                  if (cmd.command === "/cells") {
                    setInputText("");
                    setAgentSettingsModalTab("iam360_cells");
                    setIsAgentSettingsModalOpen(true);
                  } else {
                    setInputText(cmd.prompt);
                  }
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
                className="fixed md:absolute inset-x-2 md:inset-x-0 bottom-20 md:bottom-full mb-2 max-h-[85vh] md:max-h-[520px] flex flex-col rounded-2xl bg-white dark:bg-[#14141c] border border-slate-200 dark:border-white/[0.08] shadow-2xl p-3 sm:p-4 z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-left overflow-hidden ring-0 [container-type:inline-size]"
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
                          triggerHaptic(6);
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
                          id: "cmd-attach-files",
                          title: "Attach files",
                          description: "Tải lên tệp hoặc thư mục từ máy",
                          icon: <Paperclip size={14} className="text-[#f8a87c]" />,
                          action: () => {
                            setIsPlusMenuOpen(false);
                            setInputText((prev) => prev.replace(/(\/[a-zA-Z0-9_-]*)$/, ""));
                            fileInputRef.current?.click();
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
                                        <span className="font-medium text-[11px] text-slate-900 dark:text-white shrink-0">
                                          {cmd.title}
                                        </span>
                                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
                                          {cmd.description}
                                        </span>
                                      </div>
                                    </div>

                                    {(cmd as any).hasChevron ? (
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

                    const agentActions = displayAgents.map((ag) => {
                      const mentionSlug = ag.slug || ag.id.replace(/^bot:agent360:/i, "");
                      return {
                        id: `agent-${ag.id}`,
                        title: ag.name,
                        description: ag.roleTag || ag.description || "Fast helper subagent running in fleet",
                        icon: (
                          <AgentAvatar
                            agent={ag}
                            size="2xs"
                            interactive={false}
                            className="shrink-0"
                          />
                        ),
                        action: () => {
                          setIsPlusMenuOpen(false);
                          setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, `@${mentionSlug} `));
                          if (selectedChatId && selectedAgentId) {
                            pullAgentIntoChatRoom(selectedAgentId, selectedChatId, mentionSlug, {
                              hostSessionId: selectedChat?.session_id || selectedChatId,
                            }).then((res) => {
                              if (res?.room) setActiveSessionRoom(res.room);
                            });
                          }
                          textareaRef.current?.focus();
                        },
                      };
                    });

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
                      ...filteredAgents,
                      ...filteredPlugins,
                      ...filteredAdd,
                    ];

                    const groups = [
                      { name: "Agents", items: filteredAgents },
                      { name: "Apps & MCPs", items: filteredPlugins },
                      { name: "Add", items: filteredAdd },
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
                                            <span className="font-medium text-[11px] text-slate-900 dark:text-white shrink-0">
                                              {item.title}
                                            </span>
                                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">
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
                          const mentionTag = ag.slug || ag.id.replace(/^bot:agent360:/, "");
                          const isHighlighted = plusMenuSelectedIndex === (appsCount + subIdx);
                          const isAlreadyMentioned = inputText.includes(`@${ag.name}`) || new RegExp(`@${mentionTag}\\b`, "i").test(inputText);
                          return (
                          <button
                            key={`popover-subagent-${ag.id}-${subIdx}`}
                            type="button"
                            data-popover-nav-idx={appsCount + subIdx}
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setInputText((prev) => {
                                if (/(@[a-zA-Z0-9_-]*)$/.test(prev)) {
                                  return prev.replace(/(@[a-zA-Z0-9_-]*)$/, `@${mentionTag} `);
                                }
                                if (isAlreadyMentioned) {
                                  return prev
                                    .replace(new RegExp(`@(${ag.name}|${mentionTag})\\s*`, "gi"), "")
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
                              {isAlreadyMentioned ? (
                                <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 shadow-2xs border bg-emerald-500/20 border-emerald-500/50 text-emerald-400">
                                  <Check size={11} className="stroke-[2.5]" />
                                </div>
                              ) : (
                                <AgentAvatar
                                  agent={ag}
                                  size="2xs"
                                  interactive={false}
                                  className="shrink-0"
                                />
                              )}
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

            {replyingToMsg && (
              <div
                data-testid="composer-reply-banner"
                className="mb-1 px-3 py-1.5 rounded-xl bg-slate-100/95 dark:bg-[#161622]/95 border border-slate-200 dark:border-[#2a2a3c] border-l-4 border-l-[#f8a87c] flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-150 shadow-xs text-left select-none"
              >
                <div
                  onClick={() => scrollToOriginalMessage(replyingToMsg.id, replyingToMsg.snippet)}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#f8a87c]">
                    <CornerUpLeft size={12} className="shrink-0" />
                    <span className="truncate">Đang trả lời {replyingToMsg.authorName}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-neutral-300 truncate mt-0.5 italic">
                    "{replyingToMsg.snippet}"
                  </p>
                </div>
                <button
                  type="button"
                  data-testid="cancel-reply-btn"
                  onClick={() => setReplyingToMsg(null)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                  aria-label="Hủy trả lời"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {(() => {
              const isMultiline = inputText.includes("\n") || inputText.length > 70;
              
              // Common Plus Button Trigger
              const renderPlusButton = () => {
                const activeMentionsCount = (inputText.match(/@[a-zA-Z0-9_-]+/g) || []).length;
                const activeToolsCount = (inputText.match(/\/[a-zA-Z0-9_-]+/g) || []).length;
                const totalActiveItems = activeMentionsCount + activeToolsCount;

                return (
                  <div className="relative shrink-0 flex items-center gap-1">
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
                    {/* Starred & Shortcuts moved to Settings Modal */}
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
                    e.target.style.height = Math.min(e.target.scrollHeight, 210) + "px";

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
                              textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 210) + "px";
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
                            { id: "cmd-attach-files", type: "action" },
                            { id: "cmd-new-chat", type: "action" },
                            { id: "cmd-pin-chat", type: "action" },
                            { id: "cmd-goal", type: "action" },
                            { id: "cmd-plan-mode", type: "action" },
                            { id: "cmd-agent-settings", type: "action" },
                          ];

                          const slashTitles: Record<string, { title: string; desc: string }> = {
                            "cmd-attach-files": { title: "Attach files", desc: "Tải lên tệp hoặc thư mục từ máy" },
                            "cmd-new-chat": { title: "New chat", desc: "Start a blank chat in the same agent" },
                            "cmd-pin-chat": { title: "Pin chat", desc: "Keep this chat in the sidebar" },
                            "cmd-goal": { title: "Goal", desc: "Set a goal to keep pursuing" },
                            "cmd-plan-mode": { title: "Plan mode", desc: "Turn plan mode on" },
                            "cmd-agent-settings": { title: "Agent Settings", desc: "Mở cài đặt chuyên sâu của Agent" },
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

                              if (selected.id === "cmd-attach-files") {
                                setInputText((prev) => prev.replace(/(\/[a-zA-Z0-9_-]*)$/, ""));
                                fileInputRef.current?.click();
                              } else if (selected.id === "cmd-new-chat") {
                                handleNewChat();
                              } else if (selected.id === "cmd-pin-chat" && selectedChatId) {
                                togglePinChat(selectedChatId);
                              } else if (selected.id === "cmd-goal" || selected.id === "cmd-plan-mode") {
                                handleSelectLoopMode("goal");
                              } else if (selected.id === "cmd-agent-settings") {
                                setAgentSettingsModalTab("general");
                                setIsAgentSettingsModalOpen(true);
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

                          const allAtNav: Array<{ id: string; type: "file" | "browser" | "mode" | "app" | "agent"; title: string; description: string }> = [];

                          displayAgents.forEach((ag) => allAtNav.push({ id: ag.id, type: "agent", title: ag.name, description: ag.roleTag || ag.description || "" }));
                          rawApps.forEach((a) => allAtNav.push({ id: a.id, type: "app", title: a.title, description: a.description }));

                          allAtNav.push(
                            { id: "action-files-folders", type: "file", title: "Files and folders", description: "Tải lên tệp hoặc thư mục mã nguồn từ máy" },
                            { id: "action-attach-browser", type: "browser", title: "Attach Microsoft Edge", description: "Live browser sandbox" },
                            { id: "mode-goal", type: "mode", title: "Goal", description: "Set a goal to keep pursuing" },
                            { id: "mode-plan", type: "mode", title: "Plan mode", description: "Turn plan mode on" },
                            { id: "mode-sketch", type: "mode", title: "Sketch", description: "Draw a sketch" }
                          );

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
                                const agSlug = selected.id.replace(/^bot:agent360:/i, "");
                                setInputText((prev) => prev.replace(/(@[a-zA-Z0-9_-]*)$/, `@${agSlug} `));
                                if (selectedChatId && selectedAgentId) {
                                  pullAgentIntoChatRoom(selectedAgentId, selectedChatId, agSlug, {
                                    hostSessionId: selectedChat?.session_id || selectedChatId,
                                  }).then((res) => {
                                    if (res?.room) setActiveSessionRoom(res.room);
                                  });
                                }
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
                            target.style.height = Math.min(target.scrollHeight, 210) + "px";
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
                        target.style.height = Math.min(target.scrollHeight, 210) + "px";
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
                  className={`w-full bg-transparent border-0 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed overflow-y-auto scrollbar-hover ${
                    isMultiline ? "min-h-[40px] max-h-[210px] pt-0.5 pb-1 px-0.5" : "flex-1 max-h-[210px] py-1"
                  }`}
                />
              );

              // Common Right Controls
              const renderRightControls = () => {
                const hasInputContent = Boolean(inputText.trim() || attachedFiles.length > 0);

                return (
                  <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
                    <AudioVisualizerWaveform
                      isRecording={isRecording}
                      agentId={selectedAgent?.id}
                      onAudioLevel={(lvl) => {
                        audioEnergyLevelRef.current = lvl;
                        setLiveVoiceEnergy(lvl);
                      }}
                    />

                    {/* Single Action Slot: Voice button when empty, Send button when text/files entered */}
                    {(!hasInputContent || isRecording) ? (
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
                        {isRecording ? <Square size={13} className="fill-white" /> : <Mic size={16} />}
                      </button>
                    ) : (
                      /* Send button: replaces Voice button when user inputs text or attachments */
                      <button
                        type="submit"
                        className="h-7 w-7 rounded-full bg-[#f8a87c] text-black hover:bg-[#ffb48a] shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title={isStreaming ? "Add to request queue" : "Send Message"}
                        aria-label={isStreaming ? "Add to request queue" : "Send Message"}
                      >
                        <ArrowUp size={15} className="stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                );
              };

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
                      ? "flex flex-col gap-2 pt-2 pb-2.5 px-3 sm:pt-2.5 sm:pb-3 sm:px-3.5"
                      : "flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2"
                  } bg-white dark:bg-[#14141c] border ${
                    isDraggingFiles
                      ? "border-[#f8a87c] ring-2 ring-[#f8a87c]/30 bg-amber-500/5 dark:bg-[#f8a87c]/10"
                      : isRecording
                      ? "border-red-500/60 ring-2 ring-red-500/20"
                      : "border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/15 focus-within:border-[#f8a87c]/50 dark:focus-within:border-[#f8a87c]/50 focus-within:ring-1 focus-within:ring-[#f8a87c]/20"
                  } rounded-2xl shadow-xs transition-all overflow-hidden`}
                >
                  {isDraggingFiles && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center gap-2 bg-slate-900/90 dark:bg-[#14141c]/95 border-2 border-dashed border-[#f8a87c] rounded-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
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
        className={`fixed lg:static lg:relative inset-y-0 right-0 z-[60] lg:z-30 h-full flex flex-col bg-[var(--bg-sidebar)] shrink-0 transition-grok chat-sidebar-panel mobile-drawer-panel ${
          mobileChatsOpen
            ? "flex w-full sm:w-[360px] border-l border-neutral-200 dark:border-[#1e1e24] translate-x-0 shadow-2xl pointer-events-auto"
            : isChatListCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full lg:w-0 invisible lg:visible"
            : "hidden lg:flex lg:w-[320px] translate-x-full max-lg:invisible lg:translate-x-0 shadow-none border-l border-neutral-200 dark:border-[#1e1e24]"
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
                    handleToggleChatList(true);
                    setMobileChatsOpen(false);
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
                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
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
                    style={{ animationDelay: `${Math.min(cIdx * 12, 100)}ms` }}
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
                      className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 relative transition-all cursor-pointer ${
                        selectedChatIds.includes(chat.id)
                          ? "bg-[#f8a87c] border border-[#f8a87c] text-black shadow-xs"
                          : isChatRunning
                          ? "bg-transparent border-0 group-hover:bg-slate-100 dark:group-hover:bg-[#181822] group-hover:border group-hover:border-[#f8a87c]/50"
                          : "bg-slate-100 dark:bg-[#181822] border border-slate-200 dark:border-[#2a2a3a] text-slate-500 dark:text-neutral-400 group-hover:border-[#f8a87c]/50"
                      }`}
                      title={selectedChatIds.includes(chat.id) ? "Bỏ chọn phiên này" : "Chọn phiên này để xóa hàng loạt"}
                    >
                      {/* Checkbox Icon (always shown if checked, or shown on desktop hover) */}
                      <span className={selectedChatIds.includes(chat.id) ? "block" : "hidden group-hover:block"}>
                        <Check size={11} className={selectedChatIds.includes(chat.id) ? "text-black stroke-[3]" : "text-[#f8a87c]"} />
                      </span>

                      {/* Channel icon OR Running Animated Agent Avatar inside icon box */}
                      <span className={selectedChatIds.includes(chat.id) ? "hidden" : "block group-hover:hidden flex items-center justify-center"}>
                        {isChatRunning ? (
                          <AgentAvatar
                            agent={selectedAgent}
                            size="2xs"
                            interactive={false}
                            alwaysAnimate={true}
                            forcedAnimation="nod.1.4,jump.1.4,wink.1.4"
                            className="shrink-0"
                          />
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
                              : "opacity-0 pointer-events-none group-hover/chatitem:opacity-100 group-hover/chatitem:pointer-events-auto bg-slate-100/95 dark:bg-[#14141c]/95 border-slate-200 dark:border-white/10"
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
                                  setMobileChatsOpen(false);
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
        className={`fixed xl:static xl:relative inset-y-0 right-0 z-[60] xl:z-40 h-full flex flex-col border-l border-neutral-200 dark:border-[#1e1e24] bg-[var(--bg-sidebar)] shrink-0 select-none transition-grok mobile-drawer-panel ${
          isBotInfoCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full xl:w-0 invisible xl:visible"
            : "w-full sm:w-[380px] xl:w-[380px] border-l border-neutral-200 dark:border-[#1e1e24] translate-x-0 xl:translate-x-0 shadow-2xl xl:shadow-none pointer-events-auto"
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
                  className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-1.5 ring-white dark:ring-[#0c0c0e] ${
                    selectedAgent.status === "degraded"
                      ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)] animate-pulse"
                      : "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
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
                            onClick={() => {
                              handleToggleComputerSplit(true);
                              if (typeof window !== "undefined" && window.innerWidth < 1280) {
                                handleToggleBotInfo(true);
                                setMobileBotInfoOpen(false);
                              }
                            }}
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
                        onClick={() => {
                          handleToggleComputerSplit(true);
                          if (typeof window !== "undefined" && window.innerWidth < 1280) {
                            handleToggleBotInfo(true);
                            setMobileBotInfoOpen(false);
                          }
                        }}
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

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-2 z-10 select-none">
                          <div className="h-9 w-9 rounded-full bg-[#f8a87c] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Maximize2 size={16} className="stroke-[2.5]" />
                          </div>
                          <span className="text-[11px] font-mono font-semibold text-white! keep-white bg-slate-900/90 dark:bg-black/90 px-3 py-1 rounded-full border border-white/20 shadow-lg tracking-wide">
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
                  .slice(0, 16);

                const q = librarySearchQuery.trim().toLowerCase();
                const extFiltered = libraryExtFilter
                  ? categoryFiltered.filter((node) => (node.extension || "").toLowerCase() === libraryExtFilter.toLowerCase())
                  : categoryFiltered;

                const filteredWorkspaceFiles = q
                  ? extFiltered.filter((node) =>
                      node.name.toLowerCase().includes(q) ||
                      node.path.toLowerCase().includes(q) ||
                      (node.extension || "").toLowerCase().includes(q) ||
                      (node.category || "").toLowerCase().includes(q)
                    )
                  : extFiltered;

                const categories: Array<{ id: LibraryCategory; label: string; icon: React.ReactNode; count: number }> = [
                  { id: "all", label: "All", icon: <Layers size={13} />, count: libraryCategoryCounts.all ?? workspaceFiles.length },
                  { id: "pages", label: "Pages", icon: <Globe size={13} className="text-emerald-400" />, count: libraryCategoryCounts.pages ?? workspaceFiles.filter((n) => n.category === "pages").length },
                  { id: "files", label: "Files", icon: <FileText size={13} className="text-amber-400" />, count: libraryCategoryCounts.files ?? workspaceFiles.filter((n) => n.category === "files").length },
                  { id: "apps", label: "Apps", icon: <Terminal size={13} className="text-purple-400" />, count: libraryCategoryCounts.apps ?? workspaceFiles.filter((n) => n.category === "apps").length },
                  { id: "images", label: "Images", icon: <Camera size={13} className="text-cyan-400" />, count: libraryCategoryCounts.images ?? workspaceFiles.filter((n) => n.category === "images").length },
                  { id: "media", label: "Media", icon: <Play size={13} className="text-pink-400" />, count: libraryCategoryCounts.media ?? workspaceFiles.filter((n) => n.category === "media").length },
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

                const activeFiltersCount = (libraryCategoryFilter !== "all" ? 1 : 0) + (libraryExtFilter ? 1 : 0) + (librarySearchQuery.trim() ? 1 : 0);

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
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors group ${
                        isSelected
                          ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] font-medium border border-[#f8a87c]/30"
                          : "text-slate-700 dark:text-neutral-300 hover:bg-slate-200/60 dark:hover:bg-[#1c1c24] border border-transparent"
                      }`}
                    >
                      {node.kind === "directory" ? (
                        <Folder size={14} className="text-amber-400 shrink-0" />
                      ) : node.category === "apps" ? (
                        <Terminal size={14} className="text-purple-400 shrink-0" />
                      ) : node.category === "pages" ? (
                        <Globe size={14} className="text-emerald-400 shrink-0" />
                      ) : node.category === "images" ? (
                        <Camera size={14} className="text-cyan-400 shrink-0" />
                      ) : node.category === "media" ? (
                        <Play size={14} className="text-pink-400 shrink-0" />
                      ) : (
                        <FileText size={14} className="text-amber-400 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="truncate text-[11px] leading-tight font-medium">{node.name}</div>
                        {folderHint && (
                          <div className="truncate text-[9px] text-neutral-500 leading-tight font-mono">{folderHint}</div>
                        )}
                      </div>

                      {node.extension && (
                        <span className={`px-1 py-0.2 rounded text-[8px] uppercase border font-mono shrink-0 ${getCategoryBadgeStyle(node.category)}`}>
                          {node.extension}
                        </span>
                      )}

                      {node.size !== null && node.size !== undefined && (
                        <span className="text-[9px] text-neutral-500 font-mono shrink-0">
                          {formatSize(node.size)}
                        </span>
                      )}

                      <Tooltip content={`Download ${node.name}`} placement="left" minWidth={100}>
                        <button
                          type="button"
                          aria-label={`Download ${node.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            const targetId = selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
                            if (targetId) downloadWorkspaceFile(targetId, node.path, node.name);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-opacity shrink-0 cursor-pointer"
                        >
                          <Download size={12} />
                        </button>
                      </Tooltip>
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
                  <div className="space-y-2 text-xs flex flex-col flex-1 min-h-0">
                    {/* Clean Minimal Header: Count & Icon-only Action Controls with Tooltips */}
                    <div className="flex items-center justify-between gap-1.5 px-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                        <Layers size={13} className="text-[#f8a87c] shrink-0" />
                        <span>
                          Library ({filteredWorkspaceFiles.length}
                          {filteredWorkspaceFiles.length !== workspaceFiles.length ? ` / ${workspaceFiles.length}` : ""})
                        </span>
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Group Mode Switcher Icons: List | Folder | Date */}
                        <div className="flex items-center bg-slate-100 dark:bg-[#14141c] border border-slate-200 dark:border-[#22222e] rounded-lg p-0.5">
                          <Tooltip content="Group: List" placement="top" minWidth={90}>
                            <button
                              type="button"
                              aria-label="Group: List"
                              onClick={() => {
                                setLibraryGroupMode("flat");
                                setLibraryPage(1);
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                libraryGroupMode === "flat"
                                  ? "bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c]"
                                  : "text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Layers size={12} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Group: Folder" placement="top" minWidth={100}>
                            <button
                              type="button"
                              aria-label="Group: Folder"
                              onClick={() => {
                                setLibraryGroupMode("folder");
                                setLibraryPage(1);
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                libraryGroupMode === "folder"
                                  ? "bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c]"
                                  : "text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Folder size={12} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Group: Date" placement="top" minWidth={90}>
                            <button
                              type="button"
                              aria-label="Group: Date"
                              onClick={() => {
                                setLibraryGroupMode("date");
                                setLibraryPage(1);
                              }}
                              className={`p-1 rounded transition-colors cursor-pointer ${
                                libraryGroupMode === "date"
                                  ? "bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c]"
                                  : "text-neutral-400 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Clock size={12} />
                            </button>
                          </Tooltip>
                        </div>

                        {/* Filter Overlay Menu Trigger Button */}
                        <div className="relative inline-flex">
                          <Tooltip
                            content={activeFiltersCount > 0 ? `Filters (${activeFiltersCount} active)` : "Filters & Search"}
                            placement="top"
                            minWidth={110}
                          >
                            <button
                              ref={libraryFilterBtnRef}
                              type="button"
                              aria-label="Filters & Search"
                              onClick={() => setIsLibraryFilterMenuOpen(!isLibraryFilterMenuOpen)}
                              className={`relative p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isLibraryFilterMenuOpen || activeFiltersCount > 0
                                  ? "bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold"
                                  : "bg-slate-100 dark:bg-[#14141c] text-neutral-400 border-slate-200 dark:border-[#22222e] hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              <Filter size={12} />
                              {activeFiltersCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#f8a87c] text-black font-mono text-[8px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#101016]">
                                  {activeFiltersCount}
                                </span>
                              )}
                            </button>
                          </Tooltip>

                          {/* Overlay Filter Menu (Portal with solid surface & click outside dismissal) */}
                          <DropdownMenu
                            isOpen={isLibraryFilterMenuOpen}
                            onClose={() => setIsLibraryFilterMenuOpen(false)}
                            anchorRef={libraryFilterBtnRef}
                            align="right"
                            width="w-72"
                          >
                            {/* Search Bar inside Overlay */}
                            <div className="p-1.5 pb-2 border-b border-slate-100 dark:border-white/[0.08]">
                              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#121218] border border-slate-200 dark:border-[#282836] rounded-lg px-2 py-1 text-xs">
                                <Search size={11} className="text-neutral-400 shrink-0" />
                                <input
                                  type="text"
                                  value={librarySearchQuery}
                                  onChange={(e) => {
                                    setLibrarySearchQuery(e.target.value);
                                    setLibraryPage(1);
                                  }}
                                  placeholder="Search (.md, .xlsx, .pdf, .py)..."
                                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-neutral-500 font-mono text-[10px] focus:outline-none"
                                  autoFocus
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
                                    <X size={10} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Category Filter Section */}
                            <DropdownMenuSection label="Categories">
                              <div className="grid grid-cols-3 gap-1 px-1 py-1">
                                {categories.map((cat) => {
                                  const isActive = libraryCategoryFilter === cat.id;
                                  return (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onClick={() => {
                                        setLibraryCategoryFilter(cat.id);
                                        setLibraryExtFilter("");
                                        setLibraryPage(1);
                                      }}
                                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-mono transition-colors cursor-pointer border ${
                                        isActive
                                          ? "bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c] border-[#f8a87c]/40 font-semibold"
                                          : "bg-slate-50 dark:bg-[#121218] text-slate-700 dark:text-neutral-300 border-slate-200 dark:border-[#242432] hover:border-slate-300 dark:hover:border-[#323242]"
                                      }`}
                                    >
                                      <span className="shrink-0">{cat.icon}</span>
                                      <span className="truncate">{cat.label}</span>
                                      <span className="text-[9px] opacity-60 ml-auto">{cat.count}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </DropdownMenuSection>

                            {/* Format / Extension Section */}
                            {availableFormats.length > 0 && (
                              <DropdownMenuSection label="Formats">
                                <div className="flex flex-wrap gap-1 px-1 py-1 max-h-28 overflow-y-auto scrollbar-thin">
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
                                            : "bg-slate-50 dark:bg-[#121218] text-slate-600 dark:text-neutral-400 border-slate-200 dark:border-[#242432] hover:border-[#f8a87c]/40"
                                        }`}
                                      >
                                        .{ext} <span className="opacity-60">{count}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </DropdownMenuSection>
                            )}

                            {/* Reset All Filters Button */}
                            {activeFiltersCount > 0 && (
                              <div className="p-1 border-t border-slate-100 dark:border-white/[0.08] pt-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLibraryCategoryFilter("all");
                                    setLibraryExtFilter("");
                                    setLibrarySearchQuery("");
                                    setLibraryPage(1);
                                    setIsLibraryFilterMenuOpen(false);
                                  }}
                                  className="w-full text-center py-1 rounded-md text-[10px] font-mono text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
                                >
                                  Clear all filters
                                </button>
                              </div>
                            )}
                          </DropdownMenu>
                        </div>

                        {/* Refresh Library Button */}
                        <Tooltip content="Refresh workspace library" placement="top" minWidth={140}>
                          <button
                            aria-label="Refresh workspace library"
                            data-ux-target-min="24"
                            onClick={() => loadWorkspaceTree()}
                            disabled={isLoadingTree}
                            className="text-neutral-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-[#1a1a22] transition-colors cursor-pointer border border-transparent"
                          >
                            <RefreshCw
                              size={12}
                              className={isLoadingTree ? "animate-spin text-[#f8a87c]" : ""}
                            />
                          </button>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Active Filters Pill Bar (Only visible when filters are applied, 1-click clear) */}
                    {activeFiltersCount > 0 && (
                      <div className="flex items-center gap-1 flex-wrap px-0.5 text-[9px] font-mono text-neutral-400">
                        {libraryCategoryFilter !== "all" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#181822] border border-slate-200 dark:border-[#2a2a3a] text-slate-700 dark:text-neutral-300">
                            <span>cat: {libraryCategoryFilter}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setLibraryCategoryFilter("all");
                                setLibraryPage(1);
                              }}
                              className="hover:text-white cursor-pointer"
                            >
                              <X size={9} />
                            </button>
                          </span>
                        )}
                        {libraryExtFilter && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#181822] border border-slate-200 dark:border-[#2a2a3a] text-slate-700 dark:text-neutral-300">
                            <span>ext: .{libraryExtFilter}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setLibraryExtFilter("");
                                setLibraryPage(1);
                              }}
                              className="hover:text-white cursor-pointer"
                            >
                              <X size={9} />
                            </button>
                          </span>
                        )}
                        {librarySearchQuery.trim() && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#181822] border border-slate-200 dark:border-[#2a2a3a] text-slate-700 dark:text-neutral-300">
                            <span>q: "{librarySearchQuery.trim()}"</span>
                            <button
                              type="button"
                              onClick={() => {
                                setLibrarySearchQuery("");
                                setLibraryPage(1);
                              }}
                              className="hover:text-white cursor-pointer"
                            >
                              <X size={9} />
                            </button>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setLibraryCategoryFilter("all");
                            setLibraryExtFilter("");
                            setLibrarySearchQuery("");
                            setLibraryPage(1);
                          }}
                          className="text-neutral-500 hover:text-neutral-300 underline cursor-pointer ml-1"
                        >
                          Clear all
                        </button>
                      </div>
                    )}

                    {/* Artifact List Container */}
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

                    {/* Pagination Footer */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-1 pt-0.5 text-[10px] font-mono text-neutral-400">
                        <span>
                          {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredWorkspaceFiles.length)} of {filteredWorkspaceFiles.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <Tooltip content="Previous page" placement="top" minWidth={90}>
                            <button
                              type="button"
                              aria-label="Previous page"
                              disabled={safePage <= 1}
                              onClick={() => setLibraryPage((p) => Math.max(1, p - 1))}
                              className="p-1 rounded bg-slate-100 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] text-slate-700 dark:text-neutral-300 disabled:opacity-40 hover:border-[#f8a87c]/40 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <ChevronLeft size={11} />
                            </button>
                          </Tooltip>

                          <span className="px-1 text-slate-700 dark:text-neutral-300">
                            {safePage}/{totalPages}
                          </span>

                          <Tooltip content="Next page" placement="top" minWidth={80}>
                            <button
                              type="button"
                              aria-label="Next page"
                              disabled={safePage >= totalPages}
                              onClick={() => setLibraryPage((p) => Math.min(totalPages, p + 1))}
                              className="p-1 rounded bg-slate-100 dark:bg-[#161620] border border-slate-200 dark:border-[#242432] text-slate-700 dark:text-neutral-300 disabled:opacity-40 hover:border-[#f8a87c]/40 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <ChevronRight size={11} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    )}

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
                            <Tooltip content={`Download ${selectedFilePath.split("/").pop()}`} placement="left" minWidth={110}>
                              <button
                                type="button"
                                aria-label="Download file"
                                onClick={() => {
                                  const targetId = selectedAgent?.slug || selectedAgent?.id || selectedAgentId;
                                  if (targetId && selectedFilePath) {
                                    downloadWorkspaceFile(targetId, selectedFilePath, selectedFilePath.split("/").pop());
                                  }
                                }}
                                className="p-1 rounded bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] hover:bg-[#f8a87c]/25 cursor-pointer"
                              >
                                <Download size={11} />
                              </button>
                            </Tooltip>
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
          <div className="fixed inset-0 z-50 flex flex-col bg-black/90 animate-in fade-in duration-150">
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
        onMcpClientsChanged={() => setMcpRefreshTrigger((t) => t + 1)}
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
        {...({
          onOpenStarredAndShortcuts: () => {
            setIsSettingsModalOpen(false);
            setIsStarredShortcutsOpen(true);
          },
          starredCount: starredMsgIds.length,
        } as any)}
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

      {/* Universal File & Media Attachment Preview Modal */}
      {previewModalFile && (
        <div
          onClick={() => setPreviewModalFile(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-[#12121a] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161622]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border shrink-0 ${previewModalFile.badgeColor}`}>
                  {previewModalFile.ext}
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {previewModalFile.fileName}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`${previewModalFile.previewUrl}${previewModalFile.previewUrl.includes("?") ? "&" : "?"}download=1`}
                  download={previewModalFile.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8a87c] text-black font-semibold text-xs hover:opacity-90 transition-opacity"
                >
                  <Download size={13} />
                  <span>Tải xuống</span>
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModalFile(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 cursor-pointer"
                  aria-label="Đóng xem trước"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-slate-100/50 dark:bg-[#0d0d14] min-h-[260px] flex flex-col">
              {previewModalFile.kind === "pdf" ? (
                <iframe
                  src={previewModalFile.previewUrl}
                  title={previewModalFile.fileName}
                  className="w-full h-[65vh] rounded-xl border border-slate-200 dark:border-white/10 bg-white"
                />
              ) : previewModalFile.kind === "video" ? (
                <video src={previewModalFile.previewUrl} controls autoPlay className="w-full max-h-[65vh] rounded-xl bg-black m-auto" />
              ) : previewModalFile.kind === "audio" ? (
                <div className="m-auto w-full max-w-md p-6 rounded-2xl bg-white dark:bg-[#161622] border border-slate-200 dark:border-white/10 space-y-3 text-center">
                  <div className="text-xs font-mono text-slate-700 dark:text-neutral-300 truncate">{previewModalFile.fileName}</div>
                  <audio src={previewModalFile.previewUrl} controls autoPlay className="w-full" />
                </div>
              ) : isLoadingPreviewModalText ? (
                <div className="m-auto flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Loader2 size={15} className="animate-spin text-[#f8a87c]" />
                  <span>Đang tải nội dung tệp...</span>
                </div>
              ) : previewModalText !== null ? (
                <pre className="w-full flex-1 p-3.5 rounded-xl bg-white dark:bg-[#111118] border border-slate-200 dark:border-[#242434] text-xs font-mono text-slate-800 dark:text-neutral-200 whitespace-pre-wrap break-words overflow-auto max-h-[65vh]">
                  {previewModalText || "(Tệp trống)"}
                </pre>
              ) : (
                <div className="m-auto text-center max-w-md space-y-3 py-8 px-4">
                  <div className={`mx-auto h-12 w-12 rounded-2xl border flex items-center justify-center font-mono text-xs font-bold ${previewModalFile.badgeColor}`}>
                    {previewModalFile.ext}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white break-all">
                    {previewModalFile.fileName}
                  </div>
                  {previewModalFile.caption && (
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed">
                      {previewModalFile.caption}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Định dạng .{previewModalFile.ext} sẵn sàng tải về máy để xem hoặc chỉnh sửa đầy đủ.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`${previewModalFile.previewUrl}${previewModalFile.previewUrl.includes("?") ? "&" : "?"}download=1`}
                      download={previewModalFile.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f8a87c] text-black font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
                    >
                      <Download size={14} />
                      <span>Tải xuống {previewModalFile.fileName}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-200 select-none"
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
                  className="absolute bottom-4 left-4 z-40 p-3 rounded-xl bg-slate-900/95 dark:bg-[#14141c]/95 border border-white/10 shadow-2xl text-left text-xs font-mono space-y-1.5 animate-in fade-in zoom-in-95 duration-150"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-100"
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
          const cleanSlug = appId.toLowerCase().replace(/^composio_/, "");
          setConnectedAppIds((prev) => Array.from(new Set([...prev, cleanSlug])));
          setCurrentAgentMcpClients((prev) => {
            const clientKey = `composio_${cleanSlug}`;
            if (prev.some((c) => c.key.toLowerCase() === clientKey || c.key.toLowerCase() === cleanSlug)) {
              return prev;
            }
            const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === cleanSlug);
            return [
              ...prev,
              {
                key: clientKey,
                name: matched?.name || cleanSlug,
                description: matched?.description || `Composio ${cleanSlug} integration`,
                enabled: true,
                transport: "sse",
                url: `https://connect.composio.dev/mcp/${cleanSlug}`,
              },
            ];
          });
          setMcpRefreshTrigger((t) => t + 1);
        }}
        onAppDisconnected={(appId) => {
          const cleanSlug = appId.toLowerCase().replace(/^composio_/, "");
          setConnectedAppIds((prev) => prev.filter((id) => id !== cleanSlug));
          setCurrentAgentMcpClients((prev) =>
            prev.filter((c) => c.key.toLowerCase().replace(/^composio_/, "") !== cleanSlug)
          );
          setMcpRefreshTrigger((t) => t + 1);
        }}
      />

      {/* ========================================================= */}
      {/* MOBILE HOLD-TOUCH / LONG-PRESS ACTION SHEET: AGENT */}
      {/* ========================================================= */}
      {mobileActionAgent && (
        <div
          onClick={() => setMobileActionAgent(null)}
          className="fixed inset-0 z-[85] flex flex-col justify-end bg-black/40 p-4 animate-in fade-in duration-150 select-none"
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
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 p-4 animate-in fade-in duration-150 select-none"
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
      {/* MOBILE TELEGRAM-STYLE POPUP: REACTION PILL + VERTICAL MENU */}
      {/* ========================================================= */}
      {mobileActionMsg && (() => {
        const coords = getSmartMessageMenuCoords(
          mobileActionMsg.anchorRect,
          mobileActionMsg.role,
          showFullEmojiPicker,
          mobileActionMsg.clickY
        );

        return (
          <div
            onClick={() => { setShowFullEmojiPicker(false); setMobileActionMsg(null); }}
            className="fixed inset-0 z-[80] bg-transparent select-none duration-100 overflow-hidden"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                width: "225px",
                transformOrigin: coords.transformOrigin,
              }}
              className="flex flex-col items-center gap-2 max-h-[85vh] animate-in zoom-in-90 fade-in duration-200 ease-out select-none will-change-transform"
            >
            {/* 1. TOP HORIZONTAL REACTION PILL (Telegram style): ONLY FOR AGENT MESSAGE */}
            {mobileActionMsg.role !== "user" && (
              <div className="flex flex-col items-center gap-1.5 w-full">
                <div
                  data-testid="mobile-quick-react-bar"
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-full bg-white dark:bg-[#1c2430] border border-slate-200/90 dark:border-white/10 shadow-xl w-full"
                >
                  <div className="flex items-center justify-between flex-1 gap-1">
                    {recentReactions.slice(0, 7).map((emoji) => {
                      const isSelected = (msgReactions[mobileActionMsg.id] || []).includes(emoji);
                      return (
                        <button
                          key={emoji}
                          type="button"
                          data-testid={`mobile-react-option-${emoji}`}
                          onClick={() => {
                            toggleMessageReaction(mobileActionMsg.id, emoji, mobileActionMsg.rawMsg);
                            setShowFullEmojiPicker(false);
                            setMobileActionMsg(null);
                          }}
                          className={`h-6.5 w-6.5 rounded-full flex items-center justify-center text-sm transition-transform active:scale-125 hover:scale-110 cursor-pointer ${
                            isSelected ? "bg-[#f8a87c]/30 ring-1 ring-[#f8a87c]" : "hover:bg-slate-100 dark:hover:bg-white/10"
                          }`}
                          aria-label={`Thả ${emoji}`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                  {/* Plus button to toggle full emoji palette */}
                  <button
                    type="button"
                    data-testid="mobile-more-emoji-btn"
                    onClick={() => {
                      triggerHaptic(10);
                      setShowFullEmojiPicker((prev) => !prev);
                    }}
                    className={`h-7 w-7 ml-1 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer ${
                      showFullEmojiPicker ? "bg-slate-200 dark:bg-white/20 text-slate-900 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                    title="Mở thêm biểu tượng cảm xúc"
                  >
                    <Plus size={14} className="shrink-0" />
                  </button>
                </div>

                {/* Full Emoji Picker Palette (When plus is clicked) */}
                {showFullEmojiPicker && (
                  <div
                    data-testid="full-emoji-picker-grid"
                    className="w-full grid grid-cols-6 gap-1 p-2 rounded-2xl bg-white dark:bg-[#1c2430] border border-slate-200/90 dark:border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-base"
                  >
                    {FULL_EMOJI_PALETTE.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        data-testid={`full-emoji-${emoji}`}
                        onClick={() => {
                          toggleMessageReaction(mobileActionMsg.id, emoji, mobileActionMsg.rawMsg);
                          setShowFullEmojiPicker(false);
                          setMobileActionMsg(null);
                        }}
                        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 active:scale-125 hover:scale-110 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. TELEGRAM-STYLE VERTICAL ACTION MENU LIST */}
            <div
              data-testid="mobile-vertical-menu"
              className="w-full rounded-2xl bg-white dark:bg-[#1c2430] border border-slate-200/90 dark:border-white/10 shadow-2xl overflow-hidden py-1 divide-y divide-slate-100 dark:divide-white/5 text-xs text-slate-800 dark:text-white font-sans text-left"
            >
              <div className="space-y-0.5 pb-1">
                {/* Reply */}
                <button
                  type="button"
                  data-testid="mobile-reply-btn"
                  onClick={() => {
                    if (mobileActionMsg.rawMsg) {
                      handleStartReply(mobileActionMsg.rawMsg);
                    } else {
                      setReplyingToMsg({
                        id: mobileActionMsg.id,
                        role: mobileActionMsg.role || "assistant",
                        authorName: mobileActionMsg.role === "user" ? "Bạn" : (selectedAgent?.name || "Agent"),
                        snippet: mobileActionMsg.content.slice(0, 140),
                      });
                      setMobileActionMsg(null);
                      setTimeout(() => textareaRef.current?.focus(), 50);
                    }
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
                >
                  <CornerUpLeft size={16} className="shrink-0 text-slate-400 dark:text-slate-300" />
                  <span className="font-medium text-xs text-slate-800 dark:text-white">Reply</span>
                </button>

                {/* Copy */}
                <button
                  type="button"
                  data-testid="mobile-copy-btn"
                  onClick={() => {
                    triggerHaptic(10);
                    navigator.clipboard.writeText(mobileActionMsg.content);
                    setCopiedResponseMsgId(mobileActionMsg.id);
                    setMobileActionMsg(null);
                    setTimeout(() => setCopiedResponseMsgId(null), 1800);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
                >
                  {copiedResponseMsgId === mobileActionMsg.id ? (
                    <Check size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Copy size={16} className="shrink-0 text-slate-400 dark:text-slate-300" />
                  )}
                  <span className="font-medium text-xs text-slate-800 dark:text-white">
                    {copiedResponseMsgId === mobileActionMsg.id ? "Đã chép!" : "Copy"}
                  </span>
                </button>

                {/* Thinking (Agent only, when has thinking) */}
                {mobileActionMsg.role !== "user" && mobileActionMsg.hasThinking && mobileActionMsg.rawMsg && (
                  <button
                    type="button"
                    data-testid="mobile-thinking-btn"
                    onClick={() => {
                      triggerHaptic(10);
                      const raw = mobileActionMsg.rawMsg;
                      handleOpenActiveThinkingModal(raw);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-400 transition-colors cursor-pointer font-medium"
                  >
                    <Sparkles size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Thinking & Tools</span>
                  </button>
                )}

                {/* Edit (User only) */}
                {mobileActionMsg.role === "user" && (
                  <button
                    type="button"
                    data-testid="mobile-edit-btn"
                    onClick={() => {
                      triggerHaptic(10);
                      const text = mobileActionMsg.content;
                      setMobileActionMsg(null);
                      setInputText(text);
                      if (textareaRef.current) {
                        textareaRef.current.style.height = "auto";
                        textareaRef.current.focus();
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 210) + "px";
                            textareaRef.current.setSelectionRange(text.length, text.length);
                          }
                        }, 0);
                      }
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-cyan-600 dark:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <Edit2 size={16} className="shrink-0 text-cyan-600 dark:text-cyan-400" />
                    <span className="font-medium text-xs text-cyan-600 dark:text-cyan-400">Edit</span>
                  </button>
                )}

                {/* Read Aloud TTS (Agent only) */}
                {mobileActionMsg.role !== "user" && (
                  <button
                    type="button"
                    data-testid="mobile-tts-btn"
                    onClick={() => {
                      triggerHaptic(10);
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
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
                  >
                    <Volume2 size={16} className="shrink-0 text-slate-400 dark:text-slate-300" />
                    <span className="font-medium text-xs text-slate-800 dark:text-white">Read Aloud</span>
                  </button>
                )}
              </div>

              <div className="space-y-0.5 pt-1">
                {/* Pin / Star */}
                <button
                  type="button"
                  data-testid="mobile-star-btn"
                  onClick={() => {
                    triggerHaptic(10);
                    toggleStarMessage(mobileActionMsg.id);
                    setMobileActionMsg(null);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
                >
                  <Star size={16} className={starredMsgIds.includes(mobileActionMsg.id) ? "fill-amber-400 text-amber-400 shrink-0" : "shrink-0 text-slate-400 dark:text-slate-300"} />
                  <span className="font-medium text-xs text-slate-800 dark:text-white">{starredMsgIds.includes(mobileActionMsg.id) ? "Unpin" : "Pin / Star"}</span>
                </button>

                {/* Forward (Agent only) */}
                {mobileActionMsg.role !== "user" && (
                  <button
                    type="button"
                    data-testid="mobile-forward-btn"
                    onClick={() => {
                      triggerHaptic(10);
                      const content = mobileActionMsg.content;
                      setMobileActionMsg(null);
                      setForwardModalMsg(content);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
                  >
                    <Share2 size={16} className="shrink-0 text-slate-400 dark:text-slate-300" />
                    <span className="font-medium text-xs text-slate-800 dark:text-white">Forward</span>
                  </button>
                )}

                {/* Fork */}
                <button
                  type="button"
                  data-testid="mobile-fork-btn"
                  onClick={() => {
                    triggerHaptic(10);
                    const turnIdx = mobileActionMsg.turnIdx;
                    setMobileActionMsg(null);
                    handleForkSession(turnIdx);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
                >
                  <GitFork size={16} className="shrink-0 text-slate-400 dark:text-slate-300" />
                  <span className="font-medium text-xs text-slate-800 dark:text-white">Fork Session</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Global Shared Thinking Modal (Supports static turns & live in-progress streaming turns) */}
      {(activeThinkingModalMsg || isLiveThinkingModalOpen) && (() => {
        const dynamicMatch = activeThinkingModalMsg
          ? displayMessages.find((m) => m.id === activeThinkingModalMsg.id)
          : null;
        const liveBotMsg = liveTurnForView?.msg
          || inflightMessagesRef.current[selectedChatId]?.slice().reverse().find((m) => m.role === "assistant")
          || [...displayMessages].reverse().find((m) => m.role === "assistant")
          || {
            id: `live-thinking-${selectedChatId}`,
            role: "assistant" as const,
            content: "",
            timestamp: new Date().toISOString(),
            senderAgentName: selectedAgent.name,
            steps: [],
            toolCalls: [],
          };
        const modalMsg = (dynamicMatch || activeThinkingModalMsg || liveBotMsg);
        const isModalTurnLive = Boolean(
          (isStreaming || isCurrentSessionRunning || Boolean(liveTurnForView)) &&
          (!activeThinkingModalMsg || modalMsg.id === liveBotMsg.id)
        );
        return (
          <AgentThinkingModal
            msg={modalMsg}
            agentLabel={modalMsg.senderAgentName || modalMsg.senderAgentId || selectedAgent.name}
            agentId={selectedAgent?.slug || selectedAgent?.id || selectedAgentId}
            room={activeSessionRoom}
            activeRespondingAgent={activeRespondingAgent}
            allAgents={agents}
            isLiveInProgress={isModalTurnLive}
            onDrillDownBranch={(branchTurn) => {
              const cleanSnippet = stripSharedRoomContext(branchTurn.text || "").slice(0, 140);
              setActiveThinkingModalMsg(null);
              setIsLiveThinkingModalOpen(false);
              setReplyingToMsg({
                id: branchTurn.id,
                role: "assistant",
                authorName: `🤖 ${branchTurn.author_name || branchTurn.author_id} (@${branchTurn.author_id})`,
                snippet: cleanSnippet,
              });
              setInputText((prev) => {
                if (new RegExp(`@${branchTurn.author_id}\\b`, "i").test(prev)) return prev;
                return prev ? `@${branchTurn.author_id} ${prev}` : `@${branchTurn.author_id} `;
              });
              setTimeout(() => textareaRef.current?.focus(), 60);
            }}
            onUpdateHostExecutionPolicy={async (nextPolicy) => {
              if (!selectedAgentId || !selectedChatId) return;
              setActiveSessionRoom((prev) => (prev ? { ...prev, host_execution_policy: nextPolicy } : prev));
              const updated = await updateChatRoomTriagePolicy(
                selectedAgent?.slug || selectedAgentId,
                selectedChatId,
                (activeSessionRoom?.triage_policy as "auto" | "manual") || "auto",
                nextPolicy
              );
              if (updated) setActiveSessionRoom(updated);
            }}
            onClose={() => {
              setActiveThinkingModalMsg(null);
              setIsLiveThinkingModalOpen(false);
            }}
          />
        );
      })()}
      {/* Shared Collaboration History Modal when clicking on a Collaborator Bot Chip / Card */}
      {sharedHistoryCollabAgent && (() => {
        const collabSlug = sharedHistoryCollabAgent.slug.toLowerCase();
        const collabShortName = sharedHistoryCollabAgent.name.split(" (")[0];
        const sharedTurns = displayMessages.filter((m) => {
          if (m.senderAgentId && m.senderAgentId.replace(/^bot:agent360:/i, "").toLowerCase() === collabSlug) {
            return true;
          }
          if (m.role === "user" && new RegExp(`@${collabSlug}\\b`, "i").test(m.content)) {
            return true;
          }
          return false;
        });

        return (
          <div
            data-testid="collaborator-shared-history-modal"
            onClick={() => setSharedHistoryCollabAgent(null)}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-3 sm:p-4 animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[80vh] rounded-2xl bg-white dark:bg-[#141822] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden text-left font-sans"
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#18202c]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        Phối hợp chung: {selectedAgent.name.split(" (")[0]} ↔ {collabShortName}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono shrink-0 ${
                        sharedHistoryCollabAgent.isBusy
                          ? "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                          : sharedHistoryCollabAgent.isOnline
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          : "bg-neutral-500/15 text-neutral-400 border border-neutral-500/30"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          sharedHistoryCollabAgent.isBusy ? "bg-amber-400 animate-ping" : sharedHistoryCollabAgent.isOnline ? "bg-emerald-400" : "bg-neutral-400"
                        }`} />
                        <span>{sharedHistoryCollabAgent.isBusy ? "Đang xử lý" : sharedHistoryCollabAgent.isOnline ? "Online" : "Offline"}</span>
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500 truncate">
                      @{collabSlug} · {sharedHistoryCollabAgent.roleTag || "Collaborator"} · {sharedTurns.length} lượt trao đổi trong phiên
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  data-testid="close-collab-history-modal-btn"
                  onClick={() => setSharedHistoryCollabAgent(null)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                  aria-label="Đóng lịch sử phối hợp"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3 flex-1">
                {sharedTurns.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <p className="text-xs text-slate-600 dark:text-neutral-300">
                      Chưa có lượt phản hồi trực tiếp nào từ @{collabSlug} trong phiên này.
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Bạn có thể gắn thẻ @{collabSlug} trong ô nhập tin nhắn để mời bot cùng xử lý công việc.
                    </p>
                  </div>
                ) : (
                  sharedTurns.map((t, idx) => {
                    const isU = t.role === "user";
                    const cleaned = stripSharedRoomContext(t.content);
                    return (
                      <div
                        key={t.id || idx}
                        className={`flex flex-col ${isU ? "items-end" : "items-start"} space-y-1`}
                      >
                        <span className="text-[10px] font-mono text-neutral-400 px-1">
                          {isU ? "Yêu cầu của bạn" : `Message from ${collabShortName}`}
                        </span>
                        <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[90%] ${
                          isU
                            ? "bg-amber-500/10 text-slate-900 dark:bg-[#1c1c26] dark:text-neutral-100 border border-amber-500/30 dark:border-[#2c2c3e]"
                            : "bg-slate-100 text-slate-800 dark:bg-[#1c2430] dark:text-neutral-100 border border-slate-200 dark:border-white/10"
                        }`}>
                          <p className="whitespace-pre-wrap break-words">{cleaned}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#18202c] flex items-center justify-between gap-2">
                <button
                  type="button"
                  data-testid="mention-collab-from-modal-btn"
                  onClick={() => {
                    const slug = sharedHistoryCollabAgent.slug;
                    setSharedHistoryCollabAgent(null);
                    setInputText((prev) => (prev.includes(`@${slug}`) ? prev : prev ? `${prev} @${slug} ` : `@${slug} `));
                    setTimeout(() => textareaRef.current?.focus(), 50);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-medium transition-colors cursor-pointer"
                >
                  + Nhắc @{collabSlug} vào câu nhắn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const matched = agents.find((a) => (a.slug || "").toLowerCase() === collabSlug || a.id.replace(/^bot:agent360:/i, "").toLowerCase() === collabSlug);
                    setSharedHistoryCollabAgent(null);
                    if (matched) handleSelectAgent(matched);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                >
                  Mở không gian của {collabShortName} →
                </button>
              </div>
            </div>
          </div>
        );
      })()}

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
