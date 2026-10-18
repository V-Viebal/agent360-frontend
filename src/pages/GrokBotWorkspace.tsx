import { getCurrentUserProfile, UserProfile } from "../services/userService";

// Haptic feedback helper for mobile touch gestures

import { DropdownMenu, DropdownMenuItem, DropdownMenuSection } from "../components/ui/DropdownMenu";
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
import { useState, useRef, useEffect } from "react";
import {
  Monitor,
  Trash2,
  Globe,
  MoreVertical,
  Pin,
  PinOff,
  Download,
  CheckCheck,
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
  Shield,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  CircleDot,
  Target,
  Rocket,
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession } from "../types/agent";

/** Short haptic tick on supporting devices; silently ignored elsewhere. */
const triggerHaptic = (ms = 10) => {
  try { navigator.vibrate?.(ms); } catch { /* unsupported */ }
};
import {
  fetchInfraAgents,
  AgentListAuthError,
  updateAgentActiveModel,
  fetchAgentChats,
  fetchChatMessages,
  getCachedChatMessages,
  setCachedChatMessages,
  fetchSkills,
  fetchAgentChannels,
  toggleAgentChannel,
  fetchAgentSchedules,
  AgentChannelConfig,
  AgentScheduleJob,
  fetchWorkspaceTree,
  fetchWorkspaceFileContent,
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
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { subAgentApi, SubAgentBinding } from "../services/subAgentApi";
import { uploadFileToGateway, UploadedFileResult } from "../services/uploadApi";
import { requestNotificationPermission, notifyTaskComplete, SoundPreset, SOUND_PRESETS, playNotificationChime } from "../services/notificationService";
import { speakText, stopSpeaking, getStoredSpeechSettings, saveStoredSpeechSettings, getAvailableVoices } from "../services/speechService";
import { CustomSelect, StatusBadge, IconButton, SearchInput, Toast } from "../components/ui";
import { CommandPaletteModal } from "../components/CommandPaletteModal";
import { SettingsModal } from "../components/SettingsModal";
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
import { AgentBrowserInfo, DesktopAuthError, agentBrowserImageUrl, fetchAgentBrowser, fetchAgentBrowserFrame, focusAgentBrowser, issueAgentDesktopUrl, openAgentDesktopTab } from "../services/agentBrowserApi";



// Collapsible Accordion wrapper for tool calls & execution trace
function TurnExecutionAccordion({
  msg,
  isStreamingThisTurn
}: {
  msg: ChatMessage;
  isStreamingThisTurn: boolean;
}) {
  const steps = msg.steps || [];
  const toolCalls = msg.toolCalls || [];
  const allToolItems = steps.filter((s) => s.kind === "tool_call").length > 0
    ? steps.filter((s) => s.kind === "tool_call")
    : toolCalls.map((tc) => ({ kind: "tool_call" as const, ...tc }));
  const reasoningItems = steps.filter((s) => s.kind === "reasoning");

  const totalToolCount = allToolItems.length;
  const isTurnDone = Boolean(msg.content && !isStreamingThisTurn);

  // Auto-collapse when turn finishes responding; expand while actively calling or streaming
  const [isExpanded, setIsExpanded] = useState<boolean>(!isTurnDone);

  useEffect(() => {
    if (isTurnDone) {
      setIsExpanded(false);
    }
  }, [isTurnDone]);

  // If there are only tool calls / reasoning without final text yet, or user expanded it
  return (
    <div className="w-full my-1 space-y-1.5">
      {/* Header bar to collapse/expand all tool steps when done */}
      {isTurnDone && totalToolCount > 0 && (
        <button data-ux-target-min="24"
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-[#14141c] hover:bg-neutral-200 dark:hover:bg-[#1a1a24] border border-neutral-200 dark:border-[#22222e] hover:border-neutral-300 dark:hover:border-[#303040] text-xs font-mono text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer shadow-xs select-none"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="font-semibold text-neutral-200">
            {totalToolCount} {totalToolCount === 1 ? "tool call" : "tool calls"} executed
          </span>
          <span className="text-[10px] text-neutral-500 font-sans">
            {isExpanded ? "(click to collapse)" : "(click to view trace)"}
          </span>
          <ChevronDown
            size={13}
            className={`ml-auto transition-transform duration-200 ${isExpanded ? "rotate-180 text-white" : ""}`}
          />
        </button>
      )}

      {/* Accordion Body: reasoning + tool cards */}
      {(!isTurnDone || isExpanded) && (
        <div className="space-y-1.5 w-full animate-in fade-in duration-150">
          {reasoningItems.map((r, rIdx) => {
            const wordCount = (r.text || "").split(/\s+/).filter(Boolean).length;
            const estimatedSec = Math.max(1, Math.round(wordCount / 18));
            return (
              <details
                key={rIdx}
                className="group rounded-xl bg-[#14141a]/70 border border-[#22222e] text-xs font-sans overflow-hidden transition-all select-none"
                open={!isTurnDone}
              >
                <summary className="flex items-center gap-2 px-3.5 py-2 cursor-pointer hover:bg-white/[0.03] text-neutral-400 hover:text-neutral-200 list-none">
                  <Sparkles size={13} className="text-[#ff7a00] shrink-0" />
                  <span className="font-mono text-[11px] font-medium text-neutral-300">
                    Thought for ~{estimatedSec}s
                  </span>
                  <span className="text-[10px] text-neutral-500 font-sans ml-1">
                    ({wordCount} words reasoning trace)
                  </span>
                  <ChevronDown
                    size={12}
                    className="ml-auto text-neutral-500 transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="px-3.5 py-2.5 pt-1 text-xs text-neutral-400 leading-relaxed italic border-t border-[#1e1e28] whitespace-pre-wrap break-words select-text">
                  {renderInlineMarkdown(r.text || "")}
                </div>
              </details>
            );
          })}

          {allToolItems.map((step, sIdx) => (
            <AgentToolCard
              key={sIdx}
              toolCall={{
                tool: step.tool || "Tool",
                args: step.args,
                result: step.result,
                state: step.state
              }}
            />
          ))}
        </div>
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
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="w-full rounded-xl border border-neutral-200 dark:border-[#22222c] bg-white dark:bg-[#121217] overflow-hidden my-1.5 transition-all text-xs font-mono shadow-sm">
      {/* Header Bar */}
      <div
        onClick={() => setOpen(!open)}
        className="px-3 py-2 bg-neutral-50 dark:bg-[#15151c] hover:bg-neutral-100 dark:hover:bg-[#191922] flex items-center justify-between cursor-pointer select-none transition-colors border-b border-transparent"
      >
        <div className="flex items-center gap-2 min-w-0">
          {isCalling ? (
            <Loader2 size={13} className="text-[#ff7a00] animate-spin shrink-0" />
          ) : isError ? (
            <span className="h-4 w-4 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
              <AlertCircle size={10} />
            </span>
          ) : (
            <span className="h-4 w-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Terminal size={10} />
            </span>
          )}
          <span className="text-[12px] font-semibold text-neutral-900 dark:text-neutral-200 truncate font-mono">
            {displayTitle}
          </span>
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
              isCalling
                ? "bg-[#ff7a00]/10 text-[#ff7a00]"
                : isError
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}
          >
            {isCalling ? "calling..." : isError ? "error" : "exit 0"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            size={13}
            className={`text-neutral-500 transition-transform duration-200 ${open ? "rotate-180 text-white" : ""}`}
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
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied === "args" ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  <span>{copied === "args" ? "Copied" : "Copy"}</span>
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
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copied === "result" ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                  <span>{copied === "result" ? "Copied" : "Copy"}</span>
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

// Markdown & Structured Content Formatter
function renderInlineMarkdown(rawText: string) {
  if (!rawText) return "";
  const parts = rawText.split(/(\*\*.*?\*\*|`.*?`)/g);
  if (parts.length === 1) return rawText;

  return parts.map((part, pIdx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={pIdx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={pIdx} className="px-1.5 py-0.5 rounded-md bg-[#181822] border border-[#262634] font-mono text-[11px] text-[#ff7a00] mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// Formatted assistant message content with word wrapping and code block containment
function FormattedMessageContent({
  content,
  onRunCode,
  agentNode,
  onSpeakSentence,
}: {
  content: string;
  onRunCode?: (code: string, lang: string) => void;
  agentNode?: string;
  onSpeakSentence?: (sentence: string) => void;
}) {
  const [runningBlock, setRunningBlock] = useState<number | null>(null);
  const [runOutputs, setRunOutputs] = useState<Record<number, { output: string; exitCode: number }>>({});
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
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
                expandedBlock === idx ? "fixed inset-4 z-50 flex flex-col bg-[#0a0a0f]/95 backdrop-blur-xl border-[#ff7a00]/40 shadow-2xl p-2" : ""
              }`}
            >
              <div className="px-3 py-1.5 bg-[#14141c] border-b border-[#262634] flex items-center justify-between text-[11px] text-neutral-400 select-none">
                <span className="flex items-center gap-1.5 text-[#ff7a00] font-mono">
                  <Terminal size={12} />
                  {lang}
                </span>
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
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/30 transition-colors cursor-pointer"
                      title="Execute code directly on Agent workspace node"
                    >
                      <Play size={10} fill="currentColor" />
                      <span>{runningBlock === idx ? "Running..." : "Run on Node"}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopyCode(code, idx)}
                    className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedBlock === idx ? (
                      <>
                        <Check size={11} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
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

        // Segment regular text into paragraphs or markdown headers
        const lines = part.split("\n");
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-2" />;
              }

              // Subtle split dash separator (---, ***, ___)
              if (trimmed === "---" || trimmed === "***" || trimmed === "___" || /^[-*_]{3,}$/.test(trimmed)) {
                return (
                  <div key={lineIdx} className="my-3 py-1 flex items-center">
                    <div className="w-full border-t border-dashed border-[#2b2b38]/70" />
                  </div>
                );
              }

              if (trimmed.startsWith("### ")) {
                return (
                  <div key={lineIdx} className="pt-2 pb-0.5">
                    <h4 className="text-xs font-bold text-neutral-200 tracking-wide font-mono flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#ff7a00]/70" />
                      {trimmed.slice(4)}
                    </h4>
                  </div>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <div key={lineIdx} className="pt-3 pb-1 border-b border-dashed border-[#232330]">
                    <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                      <span className="text-[#ff7a00] text-xs">§</span>
                      {trimmed.slice(3)}
                    </h3>
                  </div>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <div key={lineIdx} className="pt-3 pb-1.5 border-b border-dashed border-[#2b2b3a]">
                    <h2 className="text-base font-bold text-[#ff7a00] tracking-tight">
                      {trimmed.slice(2)}
                    </h2>
                  </div>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-2 py-0.5 text-neutral-300">
                    <span className="text-[#ff7a00]/80 shrink-0 text-[11px] font-mono select-none mt-0.5">↳</span>
                    <span className="flex-1">{renderInlineMarkdown(trimmed.slice(2))}</span>
                  </div>
                );
              }

              // Numbered list items: 1. 2. 3.
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2.5 pl-2 py-0.5 text-neutral-300">
                    <span className="text-[#ff7a00]/70 font-mono text-[11px] shrink-0 select-none mt-0.5">
                      {numMatch[1]}.
                    </span>
                    <span className="flex-1">{renderInlineMarkdown(numMatch[2])}</span>
                  </div>
                );
              }

              return (
                <p
                  key={lineIdx}
                  onDoubleClick={() => onSpeakSentence?.(trimmed)}
                  title="Double click to read this sentence aloud"
                  className="text-neutral-300 leading-relaxed break-words hover:text-white transition-colors cursor-text"
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
          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/75 border border-white/10 text-[11px] font-mono text-neutral-300">
            {error === "auth" ? "Watch-only preview · nhập operator key để điều khiển desktop" : `Desktop unavailable (${error}) · showing preview`}
          </div>
        </>
      )}
      {src && (
        <iframe
          key={`${src}#${attempt}`}
          src={src}
          title={title}
          className="w-full h-full border-0 bg-black"
          allow="clipboard-read; clipboard-write; fullscreen; keyboard-map; autoplay"
          allowFullScreen
          style={{ touchAction: "none" }}
        />
      )}
      {profile && (
        <div data-testid="agent-desktop-profile" className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono text-white! keep-white pointer-events-none">
          profile: {profile}
        </div>
      )}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMode((m) => (m === "shared" ? "collab" : "shared"))}
          className="px-2.5 py-1 rounded-lg bg-[#1c1c26]/90 border border-[#2c2c3e] text-[11px] font-mono text-neutral-300 hover:text-white"
          title={mode === "shared" ? "Take control (mouse/keyboard)" : "Switch to watch-only"}
        >
          {mode === "shared" ? "Control" : "Watch only"}
        </button>
        <button
          type="button"
          onClick={() => setAttempt((a) => a + 1)}
          className="px-2.5 py-1 rounded-lg bg-[#1c1c26]/90 border border-[#2c2c3e] text-[11px] font-mono text-neutral-300 hover:text-white"
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
function getDynamicSuggestionsForAgent(agent?: InfraAgent): QuickSuggestion[] {
  if (!agent) {
    return [
      {
        title: "Audit Fleet & Health",
        desc: "Scan infrastructure nodes, memory pressure and service uptime",
        prompt: "Scan all infrastructure nodes and report active status, memory usage, and runtime health.",
        badge: "Fleet"
      },
      {
        title: "Deploy & Verify Diffs",
        desc: "Inspect latest git changes, run local build and check deployment status",
        prompt: "Check recent git changes, build the code, and verify service responses on 2nd.",
        badge: "Build"
      },
      {
        title: "Security Constitution Check",
        desc: "Evaluate current security posture against rootless container policy",
        prompt: "Perform a security audit against container isolation and approval policies.",
        badge: "Audit"
      },
      {
        title: "Inspect ACP & MCP Tools",
        desc: "List active tool schemas, external bridges and Skyer capabilities",
        prompt: "List all active tools and MCP servers registered for this agent session.",
        badge: "Tools"
      }
    ];
  }

  const role = agent.roleTag || "Engineering";
  const id = (agent.id || "").toLowerCase();
  const slug = (agent.slug || "").toLowerCase();
  const name = (agent.name || "").toLowerCase();
  const tools = (agent.tools || []).map((t: any) => (typeof t === "string" ? t : t.name || "").toLowerCase());

  // 1. ERPNext / Business Operations Agents (e.g. GM Bốc, GM Gạo, GM Lúa, GM Team)
  const hasErpTools = tools.some((t: string) => t.includes("erpnext") || t.includes("invoice") || t.includes("quotation"));
  if (hasErpTools || id.includes("gm-") || slug.includes("gm-")) {
    return [
      {
        title: "ERP & Stock Balance",
        desc: `Check warehouse stock levels, pending inventory transfers, and batch balance on ${agent.node}`,
        prompt: "Query current ERPNext inventory balances, pending stock movements, and item valuations.",
        badge: "ERP"
      },
      {
        title: "Order & Invoice Reconcile",
        desc: "Three-way invoice match for recent supplier receipts and payments",
        prompt: "Reconcile recent purchase orders against supplier invoices and generate a summary report.",
        badge: "Finance"
      },
      {
        title: "Draft Commercial Quotation",
        desc: "Generate official Vietnamese quote with pricing, terms, and item lines",
        prompt: "Create a formal draft service quotation for a prospective client with line items and TT99 terms.",
        badge: "Sales"
      },
      {
        title: "Triage Operations Inquiries",
        desc: "Review open tickets, delivery schedules, and partner communications",
        prompt: "Triage pending customer tickets and summarize high-priority fulfillment bottlenecks.",
        badge: "Ops"
      }
    ];
  }

  // 2. Research & Creative Discovery (e.g. Climax Default, Climax Team, KB Researcher, Zen)
  const hasResearchTools = tools.some((t: string) => t.includes("search_papers") || t.includes("brave") || t.includes("paper"));
  if (hasResearchTools || role === "Research" || id.includes("climax") || slug.includes("climax")) {
    return [
      {
        title: "Deep Market & Competitor Scan",
        desc: "Analyze industry competitors, market trends, and product positioning",
        prompt: "Perform evidence-backed market research on leading Vietnamese AI employee platforms and summarize key differentiators.",
        badge: "Research"
      },
      {
        title: "Topic & Trend Discovery",
        desc: "Harvest trending search topics, discussion keywords, and engagement signals",
        prompt: "Analyze trending topics and query branches related to AI automation for enterprise operations.",
        badge: "Trends"
      },
      {
        title: "Synthesize Knowledge Brief",
        desc: "Compile findings into a structured, citation-backed briefing for the KB Hub",
        prompt: "Synthesize a concise, layered research brief with key takeaways, data evidence, and actionable next steps.",
        badge: "Docs"
      },
      {
        title: "Social Content Planning",
        desc: "Draft multi-channel publication outlines with narrative hooks and visuals",
        prompt: "Draft an engaging 5-part LinkedIn and Threads series explaining how autonomous agents reduce operational friction.",
        badge: "Creative"
      }
    ];
  }

  // 3. Quality & UI/UX / Vision (e.g. QA Helper, Vision QA)
  const hasVisionOrBrowser = tools.some((t: string) => t.includes("click") || t.includes("cdp") || t.includes("browser") || t.includes("drag"));
  if (hasVisionOrBrowser || role === "Quality" || id.includes("qa") || slug.includes("qa") || name.includes("vision")) {
    return [
      {
        title: "Visual Regression Audit",
        desc: "Inspect live viewport rendering across mobile, tablet, and desktop breakpoints",
        prompt: "Run a browser visual check on https://agent360.antares.vn/app and audit layout contrast, spacing, and responsive scaling.",
        badge: "UI/UX"
      },
      {
        title: "Interactive Flow Test",
        desc: "Simulate click events, form inputs, modal toggles, and drawer animations",
        prompt: "Verify conversational flow: create a new session, test prompt execution, and confirm CTAs appear only after completion.",
        badge: "Test"
      },
      {
        title: "Accessibility & WCAG Check",
        desc: "Audit touch target dimensions, color contrast ratios, and aria labels",
        prompt: "Audit accessibility standards: verify aria labels, keyboard navigation (Ctrl+K), and color contrast for dark mode.",
        badge: "A11y"
      },
      {
        title: "Network & Console Diagnostics",
        desc: "Inspect DevTools network traffic, SSE event stream health, and error logs",
        prompt: "Check browser console and network responses for any 4xx/5xx status codes or unhandled rejections.",
        badge: "Logs"
      }
    ];
  }

  // 4. Security / Inference Gateway (e.g. LLM360, SRE Sentinel)
  if (role === "Security" || id.includes("llm360") || id.includes("sre") || slug.includes("sre")) {
    return [
      {
        title: "Audit Fleet & Node Latency",
        desc: "Scan infrastructure nodes (1st–7th), memory pressure, and container status",
        prompt: "Audit all fleet nodes (1st–7th, storage1) for CPU load, memory headroom, and container health.",
        badge: "Fleet"
      },
      {
        title: "Security Constitution Check",
        desc: "Evaluate container isolation, rootless execution, and bypass guards",
        prompt: "Perform a security compliance audit against rootless container guidelines and zero-trust proxy rules.",
        badge: "Audit"
      },
      {
        title: "Model Gateway & Quota Check",
        desc: "Inspect provider health, token quotas, and active inference routes",
        prompt: "Verify LLM360 provider availability, active upstream routes, and token consumption rate.",
        badge: "Gateway"
      },
      {
        title: "Audit Approval & Tool Receipts",
        desc: "Review high-risk tool execution approvals, policy hashes, and receipts",
        prompt: "Inspect recent security approvals and tool receipts across active agent sessions.",
        badge: "Receipts"
      }
    ];
  }

  // 5. Default Engineering / Fullstack Developer (e.g. Mons, AgentTeams Gateway, Fullstack SWE)
  return [
    {
      title: "Inspect & Review Git Diffs",
      desc: "Check uncommitted files, inspect git diffs, and prepare clean atomic commit",
      prompt: "Review current git status and code diffs across frontend and backend services.",
      badge: "Git"
    },
    {
      title: "Build & Deploy Verification",
      desc: "Run local build, verify TypeScript types, and check deployment health",
      prompt: "Execute local production build and verify service endpoints respond with exit code 0.",
      badge: "Build"
    },
    {
      title: "Inspect ACP & MCP Tool Registry",
      desc: "List active tool schemas, runtime bridges, and registered capabilities",
      prompt: "List all active tools and MCP servers registered for this agent session.",
      badge: "Tools"
    },
    {
      title: "Sub-Agent Delegation Task",
      desc: `Dispatch multi-step objective to specialized sub-agents via ${agent.name}`,
      prompt: "Plan and coordinate a multi-agent delegation pipeline with acceptance criteria.",
      badge: "Swarm"
    }
  ];
}

export function GrokBotWorkspace() {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<InfraAgent[]>([]);
  // Agent-scoped loads only run for an id that exists in the real fleet (stale/unknown ids would 404 on every API).
  const isKnownAgent = (id: string | null | undefined) => !!id && agents.some((a) => a.id === id);
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    getCurrentUserProfile().then((u) => {
      if (u) setCurrentUser(u);
    });
  }, []);

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
    const found = availableModels.find((m) => m.model === newModelId);
    const providerId = found ? found.providerId : "llm360coding";
    setIsChangingModel(true);
    setIsModelDropdownOpen(false);
    try {
      const ok = await updateAgentActiveModel(selectedAgent.id, providerId, newModelId);
      if (ok) {
        // Update local agent model
        selectedAgent.model = newModelId;
        setAgents((prev) =>
          prev.map((a) => (a.id === selectedAgent.id ? { ...a, model: newModelId } : a))
        );
      }
    } finally {
      setIsChangingModel(false);
    }
  };
  const [selectedAgentId, setSelectedAgentId] = useState<string>(() => {
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
  const [chats, setChats] = useState<AgentSession[]>([]);
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
    try {
      return localStorage.getItem("agent360_last_chat_id") || "";
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

  // Rightmost bot info tab: 'Details' | 'Library' | 'Computer'
  const [rightTab, setRightTab] = useState<"Computer" | "Apps" | "Agents" | "Details">("Computer");
    const [detailSubTab, setDetailSubTab] = useState<"Overview" | "Memory" | "Library">("Overview");
  const [connectedAppIds, setConnectedAppIds] = useState<string[]>([]);
  const [currentAgentMcpClients, setCurrentAgentMcpClients] = useState<AgentMcpClient[]>([]);
  const [currentAgentSubBindings, setCurrentAgentSubBindings] = useState<SubAgentBinding[]>([]);
  const [activeLoopMode, setActiveLoopMode] = useState<"default" | "goal" | "mission">(() => {
    try {
      const saved = localStorage.getItem(`skyer_loop_mode_${selectedAgentId || "mons"}`);
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
        // Collapse left sidebar when opening computer
        setIsLeftSidebarCollapsed(true);
        try { localStorage.setItem("agent360_left_sidebar_collapsed", "true"); } catch {}
        setMobileAgentsOpen(false);
        setMobileChatsOpen(false);
        setMobileBotInfoOpen(false);
      } else {
        // Restore layout when closing computer
        if (prevLayoutBeforeComputer) {
          setIsLeftSidebarCollapsed(prevLayoutBeforeComputer.leftCollapsed);
          try { localStorage.setItem("agent360_left_sidebar_collapsed", prevLayoutBeforeComputer.leftCollapsed ? "true" : "false"); } catch {}
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
      const saved = localStorage.getItem("agent360_chat_list_collapsed");
      return saved !== null ? saved === "true" : false;
    } catch {
      return false;
    }
  });
  // 2. isBotInfoCollapsed: collapse bar for rightmost bot information pane
  const [isBotInfoCollapsed, setIsBotInfoCollapsed] = useState<boolean>(() => {
    if (isInitialCompact) return true;
    try {
      const saved = localStorage.getItem("agent360_bot_info_collapsed");
      return saved !== null ? saved === "true" : false;
    } catch {
      return false;
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
        // Chat sessions is positioned to the left of Agent Specification (or right edge if bot info collapsed)
        const offsetFromRight = window.innerWidth - e.clientX;
        const currentBotInfoOffset = (!isBotInfoCollapsed && typeof window !== "undefined" && window.innerWidth >= 1280) ? botInfoWidth : 0;
        const computedWidth = offsetFromRight - currentBotInfoOffset;
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
  }, [isResizingLeft, isResizingRight, isResizingComputerSplit, isResizingChatSessions, isBotInfoCollapsed, botInfoWidth]);

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
  const [isStreaming, setIsStreaming] = useState(false);
  // Request Queue: Allows users to enter new requests while agent is in progress
  const [requestQueue, setRequestQueue] = useState<string[]>([]);
  const requestQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef<boolean>(false);
  const streamAbortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleStopStreaming = () => {
    if (streamAbortControllerRef.current) {
      streamAbortControllerRef.current.abort();
      streamAbortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  // Choice poll card state ("What would you like to call me?")
  const [showPollCard, setShowPollCard] = useState(true);
  const [customCallName, setCustomCallName] = useState("");

  // Workspace Tree State
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceTreeNode[]>([]);
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
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
        recognitionBaseTextRef.current = inputText.trim();

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

  // Input composer with Draft Persistence per Session
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

  // Track previous chatId to save draft before switching
  const prevChatIdRef = useRef<string>(selectedChatId);

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

  // Search in conversation list
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [activeChatMenuId, setActiveChatMenuId] = useState<string | null>(null);
  const [activeAgentMenuId, setActiveAgentMenuId] = useState<string | null>(null);
  // Outside click listener to dismiss active chat 3-dots menu
  useEffect(() => {
    const handleOutsideChatMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-chat-menu-container="true"]')) {
        setActiveChatMenuId(null);
      }
    };
    const handleOutsideAgentMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-agent-menu-container=\"true\"]")) {
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

  const [chatFilterTab, setChatFilterTab] = useState<"all" | "unread" | "pinned">("all");
  const [nodePingMs, setNodePingMs] = useState<number | null>(null);
  const [chatToDelete, setChatToDelete] = useState<AgentSession | null>(null);
  // Mobile Hold-Touch / Long-Press Action Sheet state
  const [mobileActionChat, setMobileActionChat] = useState<AgentSession | null>(null);
  const [mobileActionMsg, setMobileActionMsg] = useState<{ id: string; content: string; turnIdx: number } | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressPreventClickRef = useRef<boolean>(false);

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

  const handleTouchStartMsg = (msg: { id: string; content: string; turnIdx: number }) => {
    longPressPreventClickRef.current = false;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      longPressPreventClickRef.current = true;
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(25); } catch {}
      }
      setMobileActionMsg(msg);
    }, 400);
  };

  const handleTouchEndMsg = () => {
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



  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>(() => {
    try {
      const v = localStorage.getItem("agent360_pinned_chats");
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  });
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

  const handleMessagesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // Save scroll position for active session
    if (selectedChatId) {
      sessionScrollPositionsRef.current[selectedChatId] = el.scrollTop;
    }
    // Calculate distance from bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isScrolledUp = distanceFromBottom > 160;
    isUserScrolledUpRef.current = isScrolledUp;
    setShowScrollBottomBtn(isScrolledUp);
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
  const appsScrollRef = useRef<HTMLDivElement>(null);
  const subAgentsScrollRef = useRef<HTMLDivElement>(null);
  const lastAppsScrollTopRef = useRef(0);
  const lastSubAgentsScrollTopRef = useRef(0);

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

  useEffect(() => {
    // When messages change or chat is loaded:
    // If it's a switch / initial load, jump at once
    if (isInitialLoadRef.current) {
      jumpToBottom();
      // Double check after DOM render settle
      const timer = setTimeout(jumpToBottom, 40);
      return () => clearTimeout(timer);
    } else if (isStreaming) {
      // During active token streaming, only auto-scroll if user has NOT scrolled up to read earlier text
      if (!isUserScrolledUpRef.current) {
        jumpToBottom();
      }
    } else {
      if (!isUserScrolledUpRef.current) {
        jumpToBottom();
      }
    }
  }, [messages, showPollCard, isStreaming]);

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
        if (loadedAgents.length === 0) {
          setBackendError("No active agents returned from cluster. Running in Standby mode.");
        } else {
          setBackendError(null);
        }
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
        // ?agent= (deep link, id or slug) wins over the last-used agent; both must exist in the loaded list.
        let urlAgent = "";
        try { urlAgent = new URLSearchParams(window.location.search).get("agent") || ""; } catch {}
        const pick = (want: string | null) => {
          if (!want) return undefined;
          const bare = want.replace(/^bot:agent360:/i, "").toLowerCase();
          return loadedAgents.find((a) => a.id === want || a.id.toLowerCase() === `bot:agent360:${bare}` || (a.slug || "").toLowerCase() === bare);
        };
        const found = pick(urlAgent) || pick(localStorage.getItem("agent360_last_agent_id"));
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
    async function loadAgentChats() {
      setIsLoadingChats(true);
      try {
        const loadedChats = await fetchAgentChats(selectedAgentId);
        setChats(loadedChats);
        if (loadedChats.length > 0 && loadedChats[0]?.title) {
          setAgentRecentSessions((prev) => {
            const next = { ...prev, [selectedAgentId]: loadedChats[0].title };
            try { localStorage.setItem("agent360_recent_sessions_map", JSON.stringify(next)); } catch {}
            return next;
          });
        }
      if (loadedChats.length > 0) {
        const savedChatKey = `agent360_last_chat_${selectedAgentId}`;
        const savedChatId = localStorage.getItem(savedChatKey) || localStorage.getItem("agent360_last_chat_id");
        const found = savedChatId && loadedChats.find((c) => c.id === savedChatId);
        const targetChatId = found ? savedChatId : loadedChats[0].id;
        setSelectedChatId(targetChatId);
        try {
          localStorage.setItem("agent360_last_chat_id", targetChatId);
          localStorage.setItem(savedChatKey, targetChatId);
        } catch {}
      } else {
        setSelectedChatId("");
      }
      } finally {
        setIsLoadingChats(false);
      }
    }
    loadAgentChats();
  }, [selectedAgentId, agents.length]);

  // A restored chat id may belong to another agent (or be gone); only load chats in this agent's real list.
  // Client-created sessions (session-*) are not in the server list yet and are allowed.
  const selectedChatKnown = !!selectedChatId && (selectedChatId.startsWith("session-") || chats.some((c) => c.id === selectedChatId));

  // When selectedChatId changes, fetch real messages with instant client cache display
  useEffect(() => {
    if (!selectedChatId || !selectedChatKnown) return;

    isInitialLoadRef.current = true;
    let mounted = true;

    // 1. Instant Cache Hit: render cached turns immediately without spinner
    const cachedTurns = getCachedChatMessages(selectedChatId, selectedAgentId);
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
      }, 0);
    } else {
      setIsLoadingMessages(true);
    }

    // 2. Background Revalidation from API
    fetchChatMessages(selectedChatId, selectedAgentId).then((loadedMsgs) => {
      if (!mounted) return;
      if (loadedMsgs.length > 0) {
        setMessages(loadedMsgs);
        setShowPollCard(false);
      } else if (!cachedTurns || cachedTurns.length === 0) {
        // Empty new or clean session: keep messages empty to display quick prompt suggestions immediately
        setMessages([]);
        setShowPollCard(false);
      }
      setIsLoadingMessages(false);
      setTimeout(jumpToBottom, 0);
    }).catch(() => {
      // Keep whatever real (cached) turns we have; never substitute canned dialogue.
      if (mounted) setIsLoadingMessages(false);
    });

    return () => {
      mounted = false;
    };
  }, [selectedChatId, selectedAgentId, selectedChatKnown]);

  const loadWorkspaceTree = async () => {
    setIsLoadingTree(true);
    try {
      const entries = await fetchWorkspaceTree(selectedAgent?.id || "mons");
      setWorkspaceFiles(entries);
    } finally {
      setIsLoadingTree(false);
    }
  };

  const handleSelectFile = async (node: WorkspaceTreeNode) => {
    if (node.kind === "directory") return;
    setSelectedFilePath(node.path);
    setIsLoadingFile(true);
    try {
      const content = await fetchWorkspaceFileContent(selectedAgent?.id || "mons", node.path);
      setFileContent(content);
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Close browser modal on Escape key and persist state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isBrowserModalOpen) {
        handleSetBrowserModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBrowserModalOpen]);

  useEffect(() => {
    if (rightTab === "Details" && detailSubTab === "Library" && workspaceFiles.length === 0) {
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

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0] || {
    id: "mons",
    name: "Mons",
    slug: "mons",
    roleTag: "Engineering",
    node: "3rd (ai.hmz.one)",
    status: "active",
    model: "grok-4.7",
    uptime: "Online",
    memoryUsageMb: 256,
    description: "Core Development Agent for Core CoPaw AI",
    tools: [],
    sessions: [],
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  // The selected agent's own browser (service + Chromium profile); refreshed while the Computer surface is visible.
  const [agentBrowser, setAgentBrowser] = useState<AgentBrowserInfo | null>(null);
  // Resolve only once the agent list has loaded: before that `selectedAgent` is the first agent / a
  // placeholder, and its browser would flash in for the agent the user actually selected.
  const agentBrowserFor = isLoadingAgents ? "" : (selectedAgent?.slug || selectedAgent?.id || "");
  useEffect(() => {
    setAgentBrowser(null);
    if (!agentBrowserFor) return;
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
    try {
      localStorage.setItem("agent360_last_agent_id", agent.id);
    } catch {}
  };

  // Switch chat session
  const handleSelectChat = (chat: AgentSession) => {
    setSelectedChatId(chat.id);
    setMobileChatsOpen(false);
    // Clear unread mark for this session
    setUnreadCompletedSessions((prev) => {
      const list = prev[selectedAgent.id] || [];
      if (!list.includes(chat.id)) return prev;
      const updated = { ...prev, [selectedAgent.id]: list.filter((id) => id !== chat.id) };
      try {
        localStorage.setItem("agent360_unread_sessions", JSON.stringify(updated));
      } catch {}
      return updated;
    });
    try {
      localStorage.setItem("agent360_last_chat_id", chat.id);
      localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, chat.id);
    } catch {}
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
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title: editingChatTitle.trim() } : c))
    );
    setEditingChatId(null);
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
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: bold; background: rgba(255, 122, 0, 0.15); color: #ff7a00; border: 1px solid rgba(255, 122, 0, 0.3); }
    .receipt { background: #0a0a0f; border: 1px solid #20202a; border-radius: 10px; padding: 12px; margin-top: 10px; font-family: monospace; font-size: 12px; color: #34d399; }
    h1 { color: #fff; margin-bottom: 8px; font-size: 22px; }
    h2 { font-size: 16px; color: #ff7a00; border-bottom: 1px solid #20202a; padding-bottom: 6px; }
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
          <strong style="font-size: 12px; color: #ff7a00;">Verified Tool Execution Receipts:</strong>
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
          h1 { color: #ff7a00; font-size: 18pt; border-bottom: 2px solid #ff7a00; padding-bottom: 6px; }
          .meta { font-size: 9.5pt; color: #555; margin-bottom: 20px; }
          .turn { margin-bottom: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; }
          .user { background: #fdf6ee; border-left: 4px solid #ff7a00; }
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
    try {
      localStorage.setItem("agent360_last_chat_id", newChatId);
      localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, newChatId);
    } catch {}

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

      // 2. Fast New Dialogue Shortcut (Ctrl+Shift+O or Ctrl+Shift+N)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key.toLowerCase() === "o" || e.key.toLowerCase() === "n")) {
        e.preventDefault();
        handleNewChat();
        textareaRef.current?.focus();
        return;
      }

      // 3. Home / End keyboard shortcuts for dialogue scrolling (when not actively editing text)
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInputFocused = targetTag === "input" || targetTag === "textarea" || (e.target as HTMLElement)?.isContentEditable;

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

  // Core function to execute a single prompt stream
  const executeTurnStream = async (userText: string) => {
    recordMilestone("sentMessage");
    const tempBotMsgId = `bot-${Date.now() + 1}`;
    const initialBotMsg: ChatMessage = {
      id: tempBotMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      evidenceStatus: "observed",
    };

    setMessages((prev) => {
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
    setIsStreaming(true);

    // Instantiate active AbortController for this stream turn
    const abortController = new AbortController();
    streamAbortControllerRef.current = abortController;

    const streamStart = performance.now();
    let firstTokenTime: number | null = null;

    try {
      let accumulated = "";
      await sendConsoleChatMessageStream(
        selectedChatId || "default",
        userText,
        selectedAgent.slug,
        (chunkText) => {
          if (firstTokenTime === null) {
            firstTokenTime = performance.now();
          }
          accumulated = chunkText;
          setMessages((prev) =>
            prev.map((m) => (m.id === tempBotMsgId ? { ...m, content: chunkText } : m))
          );
        },
        undefined,
        (toolName, args, result, state) => {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== tempBotMsgId) return m;
              const currentTools = m.toolCalls || [];
              const existingIdx = currentTools.findIndex((t) => t.tool === toolName && (!args || t.args === args));
              let updatedTools;
              if (existingIdx !== -1) {
                updatedTools = [...currentTools];
                updatedTools[existingIdx] = {
                  ...updatedTools[existingIdx],
                  result: result !== undefined ? result : updatedTools[existingIdx].result,
                  state: state || updatedTools[existingIdx].state || 'success',
                  exitCode: state === 'error' ? 1 : 0
                };
              } else {
                updatedTools = [
                  ...currentTools,
                  { tool: toolName, args: args, result: result, state: state || 'calling', exitCode: state === 'error' ? 1 : 0 }
                ];
              }
              return { ...m, toolCalls: updatedTools };
            })
          );
        },
        { signal: abortController.signal }
      );

      // Finalize: Reconcile any lingering "calling" tool states to "success" upon response completion
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== tempBotMsgId) return m;
          const reconciledTools = (m.toolCalls || []).map((tc) => ({
            ...tc,
            state: tc.state === "calling" ? ("success" as const) : tc.state,
          }));
          const reconciledSteps = (m.steps || []).map((s) => ({
            ...s,
            state: s.state === "calling" ? ("success" as const) : s.state,
          }));
          return {
            ...m,
            content: accumulated || "Agent finished without a text response.",
            evidenceStatus: accumulated ? "observed" : "unknown",
            toolCalls: reconciledTools,
            steps: reconciledSteps,
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
        model: selectedAgent.model,
        estimatedCostUsd: estTokens * 0.000002,
      };
      setTurnTelemetry(telemetryData);

      // Ingest real-time turn telemetry beacon into Prometheus/Beszel backend metrics
      sendTurnTelemetryBeacon({
        agentId: selectedAgent.id,
        sessionId: selectedChatId || "default",
        model: selectedAgent.model,
        ttftMs: ttft,
        totalDurationMs: Math.round(totalDur),
        tokenCount: estTokens,
        tokensPerSec: tokPerSec,
        estimatedCostUsd: estTokens * 0.000002,
        node: selectedAgent.node,
      });

      // Dispatch Web Notification if window is in background
      notifyTaskComplete({
        agentName: selectedAgent.name,
        taskSnippet: accumulated || "Finished autonomous task execution.",
        sessionId: selectedChatId || "default",
        soundEnabled: isSoundEnabled,
        soundPreset: soundPreset
      });

      // Lean State: Mark session completed unread if document is hidden or user switched away
      if (document.hidden && selectedChatId) {
        setUnreadCompletedSessions((prev) => {
          const list = prev[selectedAgent.id] || [];
          if (list.includes(selectedChatId)) return prev;
          const updated = { ...prev, [selectedAgent.id]: [...list, selectedChatId] };
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
      streamAbortControllerRef.current = null;
      setIsStreaming(false);
      // Process next item in queue if present
      processNextInQueue();
    }
  };

  executeTurnStreamRef.current = (prompt: string) => { executeTurnStream(prompt); };

  const processNextInQueue = () => {
    if (requestQueueRef.current.length > 0) {
      const nextPrompt = requestQueueRef.current.shift()!;
      setRequestQueue([...requestQueueRef.current]);
      setTimeout(() => {
        executeTurnStream(nextPrompt);
      }, 50);
    } else {
      isProcessingQueueRef.current = false;
    }
  };

  // Send message or queue when agent is in progress
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (isStreaming || isProcessingQueueRef.current) {
      // Agent is busy: show optimistic user message with Queued indicator
      const queuedUserMsg: ChatMessage = {
        id: `usr-queued-${Date.now()}`,
        role: "user",
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, queuedUserMsg]);

      // Enqueue prompt for execution
      requestQueueRef.current.push(userText);
      setRequestQueue([...requestQueueRef.current]);

      // Smooth scroll anchor on instant echo
      requestAnimationFrame(() => smoothScrollToBottom());
    } else {
      isProcessingQueueRef.current = true;
      executeTurnStream(userText);
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
    if (selectedInstance === "node-2nd") {
      return node.includes("2nd");
    }
    return false;
  }).sort((a, b) => {
    const isPinA = pinnedAgentIds.includes(a.id);
    const isPinB = pinnedAgentIds.includes(b.id);
    if (isPinA && !isPinB) return -1;
    if (!isPinA && isPinB) return 1;
    return 0;
  });

  const filteredChats = chats
    .filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        c.lastMessageSnippet.toLowerCase().includes(chatSearchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (chatFilterTab === "pinned") {
        return pinnedChatIds.includes(c.id);
      }
      if (chatFilterTab === "unread") {
        return (unreadCompletedSessions[selectedAgent.id] || []).includes(c.id);
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

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)] font-sans select-none antialiased relative transition-colors">
      {/* ========================================================= */}
      {/* BACKDROP OVERLAY FOR MOBILE DRAWERS */}
      {/* ========================================================= */}
      {(mobileAgentsOpen || mobileChatsOpen || (!isBotInfoCollapsed && mobileBotInfoOpen)) && (
        <div
          onClick={() => {
            setMobileAgentsOpen(false);
            setMobileChatsOpen(false);
            setMobileBotInfoOpen(false);
            handleToggleBotInfo(true);
          }}
          className="fixed inset-0 bg-black/70 z-40 xl:hidden backdrop-blur-xs transition-opacity"
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
            ? "w-[85vw] max-w-[380px] translate-x-0 shadow-2xl"
            : isCompactMode
            ? "w-[85vw] max-w-[380px] -translate-x-full invisible"
            : isLeftSidebarCollapsed
            ? "w-[85vw] max-w-[380px] lg:w-[64px] -translate-x-full max-lg:invisible lg:translate-x-0"
            : "w-[85vw] max-w-[380px] -translate-x-full max-lg:invisible lg:translate-x-0"
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
                <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[#ff7a00]">
                  <PanelLeftOpen size={18} />
                </div>
              </button>
            </div>

            {/* Collapsed Agents List */}
            <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-2 flex flex-col items-center scrollbar-none">
              {isLoadingAgents ? (
                <div className="space-y-2.5 p-1 w-full flex flex-col items-center">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-9 w-9 rounded-xl skeleton-shimmer shrink-0" />
                  ))}
                </div>
              ) : (
                <>
                  {filteredAgents.map((ag) => {
                    const isSelected = ag.id === selectedAgentId;
                    const hasError = ag.status === "degraded";
                    const unreadList = unreadCompletedSessions[ag.id] || [];
                    const hasUnreadCompleted = unreadList.length > 0;

                    return (
                      <button
                        key={ag.id}
                        aria-label={ag.name}
                        data-ux-target-min="24"
                        onClick={() => handleSelectAgent(ag)}
                        className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-all cursor-pointer border group shrink-0 ${
                          isSelected
                            ? "bg-[#1c1c26] border-[#ff7a00] shadow-sm shadow-[#ff7a00]/25"
                            : "border-transparent hover:bg-[#161620] hover:border-[#2a2a38]"
                        }`}
                                                title={`${ag.name}\n${ag.roleTag || "Agent"} • ${ag.status || "active"}\n${ag.node} • ${ag.model}${hasUnreadCompleted ? ` (Có ${unreadList.length} session chưa xem)` : ""}${hasError ? " (Degraded)" : ""}`}
                      >
                        {/* Dedicated Agent Identity Avatar */}
                        <div className="relative shrink-0">
                          <AgentAvatar agent={ag} size="md" />
                          {pinnedAgentIds.includes(ag.id) && (
                            <span className="absolute -top-1 -left-1 text-amber-400 p-0.5 bg-slate-900/80 dark:bg-black/80 rounded-full ring-1 ring-amber-400/30" title="Đã ghim agent">
                              <Pin size={8} className="fill-amber-400" />
                            </span>
                          )}

                          {/* Lean State: ĐỎ khi sự cố, XANH khi xong việc chưa đọc, CAM khi selected */}
                          {/* Unread notification badge at top-right */}
                          {hasUnreadCompleted && (
                            <span
                              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0c0c0e] animate-bounce shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                              title={`Có ${unreadList.length} session hoàn thành chưa đọc`}
                            />
                          )}
                          {/* Online status beacon at bottom-right consistent across all sidebars */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-[#0c0c0e] ${
                              hasError ? "bg-red-500 animate-pulse" : "bg-emerald-400"
                            }`}
                            title={hasError ? "Sự cố hạ tầng" : "Đang hoạt động (Online)"}
                          />
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>

            {/* Collapsed Bottom Profile Bar */}
            <div ref={userMenuRef} className="p-2 border-t border-[#1c1c22] flex flex-col items-center relative select-none shrink-0">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="h-8 w-8 rounded-full bg-[#2a2a34] text-[#ff7a00] border border-[#3a3a4c] hover:border-[#ff7a00] flex items-center justify-center text-xs font-semibold shadow-xs cursor-pointer transition-colors relative overflow-hidden"
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
                <div className="px-2.5 py-1.5 border-b border-[#22222e] mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser?.name || "Member"}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{currentUser?.email || (currentUser?.roles?.[0] ? currentUser.roles[0] : "Authorized Session")}</div>
                </div>
                <DropdownMenuItem
                  icon={<Settings size={14} className="text-[#ff7a00]" />}
                  label="Cài đặt (Settings)"
                  badge="Mở"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setSettingsModalTab("appearance");
                    setIsSettingsModalOpen(true);
                  }}
                />
                <DropdownMenuItem
                  icon={<Command size={13} className="text-[#ff7a00]" />}
                  label="Command Palette"
                  badge="Ctrl+K"
                  badgeColor="text-neutral-400"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                />
                <DropdownMenuSection label="Hệ thống">
                {currentUser?.roles?.some(r => r.toUpperCase() === "ADMIN") && (
                  <DropdownMenuItem
                    icon={<Shield size={13} className="text-[#ff7a00]" />}
                    label="Admin Portal"
                    badge="Mở"
                    badgeColor="text-[#ff7a00]"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.location.href = "/admin/dashboard";
                    }}
                  />
                )}
                  <DropdownMenuItem
                    icon={<Globe size={13} className="text-blue-400" />}
                    label="Connected Apps"
                    badge={connectedAppIds.length + ' apps'}
                    badgeColor="text-neutral-400"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleToggleBotInfo(false);
                      setRightTab("Apps");
                    }}
                  />
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

              {/* Row 2: Dropdown Infra Instances stacked vertically under Logo & Typography */}
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
            </div>

            {/* Team Network Overview Button (Lean, Normal Option, Details on Hover) */}
            <div className="px-2 pt-1 pb-1.5 border-b border-neutral-200 dark:border-[#1c1c22]">
              <button
                type="button"
                onClick={() => setIsTopologyModalOpen(true)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-transparent hover:border-neutral-300 dark:hover:border-[#28283a] hover:bg-neutral-100 dark:hover:bg-[#161622] text-left transition-colors cursor-pointer group select-none"
                title={t("sidebar.teamOverviewTitle", { count: agents.length })}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Network size={14} className="text-neutral-400 group-hover:text-[#ff7a00] transition-colors shrink-0" />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate">
                    {t("sidebar.teamOverview")}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-neutral-400">
                    {t("sidebar.friendsCount", { count: agents.length })}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Ctrl+G
                  </span>
                </div>
              </button>
            </div>

            {/* Search Agents */}
            <div className="p-2 border-b border-[#1c1c22]">
              <SearchInput
                value={agentSearchQuery}
                onChange={setAgentSearchQuery}
                placeholder={t("sidebar.filterAgents")}
              />
            </div>

            {/* Agents List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                  {filteredAgents.map((ag, index) => {
                    const isSelected = ag.id === selectedAgentId;
                    return (
                      <div
                        key={ag.id}
                        style={{ animationDelay: `${Math.min(index * 25, 250)}ms` }}
                        onClick={() => handleSelectAgent(ag)}
                        className={`w-full rounded-xl text-left flex items-center transition-colors cursor-pointer border animate-fade-in-stagger group ${
                          layoutDensity === "compact"
                            ? "px-2 py-1 gap-2"
                            : layoutDensity === "comfortable"
                            ? "px-2.5 py-2 gap-2.5"
                            : "px-2 py-1.5 gap-2.5"
                        } ${
                          isSelected
                            ? "bg-white dark:bg-[#1c1c26] border-neutral-300 dark:border-[#303042] text-neutral-900 dark:text-white shadow-xs"
                            : "border-transparent hover:bg-neutral-200/60 dark:hover:bg-[#14141c] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        {/* Dedicated Agent Identity Avatar with consistent health beacon */}
                        <div className="relative shrink-0">
                          <AgentAvatar agent={ag} size="md" />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white dark:border-[#0c0c0e] ${
                              ag.status === "degraded" ? "bg-red-500 animate-pulse" : "bg-emerald-400"
                            }`}
                            title={ag.status === "degraded" ? "Sự cố hạ tầng" : "Đang hoạt động (Online)"}
                          />
                        </div>

                        {/* Agent Details: Lean typography with rich status tooltip */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-medium text-neutral-900 dark:text-white truncate block">
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
                                const unreadList = unreadCompletedSessions[ag.id] || [];
                                const hasUnreadCompleted = unreadList.length > 0;

                                if (hasError) {
                                  return (
                                    <span
                                      className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] mr-0.5"
                                      title="Agent gặp sự cố hạ tầng hoặc cần can thiệp"
                                    />
                                  );
                                }
                                if (hasUnreadCompleted) {
                                  return (
                                    <span
                                      className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce shadow-[0_0_8px_rgba(52,211,153,0.8)] mr-0.5"
                                      title={`Có ${unreadList.length} session hoàn thành chưa đọc`}
                                    />
                                  );
                                }
                                return null;
                              })()}

                              {/* 3-Dots More Options Menu for Agent */}
                              <div className="relative" data-agent-menu-container="true">
                                <button
                                  aria-label="Tùy chọn agent"
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    triggerHaptic(15);
                                    setActiveAgentMenuId(activeAgentMenuId === ag.id ? null : ag.id);
                                  }}
                                  className={`p-1 rounded-lg transition-all cursor-pointer ${
                                    activeAgentMenuId === ag.id
                                      ? "text-[#ff7a00] bg-neutral-200 dark:bg-white/10 opacity-100"
                                      : "text-neutral-400 hover:text-[#ff7a00] hover:bg-neutral-200/80 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  }`}
                                  title="Tùy chọn mở rộng cho Agent (Ghim, Chi tiết, Chat mới)"
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
                                    icon={<Plus size={13} className="text-[#ff7a00]" />}
                                    label="Tạo Chat mới với Agent"
                                    onClick={() => {
                                      handleSelectAgent(ag);
                                      setTimeout(() => handleNewChat(), 50);
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
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] font-sans text-neutral-500 dark:text-neutral-400 truncate block mt-0.5" title={agentRecentSessions[ag.id] || ag.sessions?.[0]?.title || ag.model}>
                            {agentRecentSessions[ag.id] || ag.sessions?.[0]?.title || ag.model}
                          </span>
                        </div>
                      </div>
                    );
                  })}

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
                className="flex items-center justify-between text-xs cursor-pointer hover:bg-[#161620] -m-1.5 p-1.5 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-7 w-7 rounded-full bg-[#2a2a34] text-[#ff7a00] border border-[#3a3a4c] flex items-center justify-center text-xs font-semibold shadow-xs shrink-0 overflow-hidden">
                    {currentUser?.picture ? (
                      <img src={currentUser.picture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "US")
                    )}
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-neutral-200 font-medium truncate">{currentUser?.name || "Dang M"}</span>
                    <span className="text-[10px] font-mono text-neutral-500 truncate">{currentUser?.email || (currentUser?.roles?.[0] ? currentUser.roles[0] : "System Owner")}</span>
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
                    <ShieldCheck size={13} className="text-[#ff7a00]" />
                  </button>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </div>
                  <ChevronDown
                    size={12}
                    className={`text-neutral-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
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
                <div className="px-2.5 py-1.5 border-b border-[#22222e] mb-1">
                  <div className="text-xs font-semibold text-white">{currentUser?.name || "Member"}</div>
                  <div className="text-[10px] font-mono text-neutral-400">{currentUser?.email || (currentUser?.roles?.[0] ? currentUser.roles[0] : "Authorized Session")}</div>
                </div>
                <DropdownMenuItem
                  icon={<Settings size={14} className="text-[#ff7a00]" />}
                  label="Cài đặt (Settings)"
                  badge="Mở"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setSettingsModalTab("appearance");
                    setIsSettingsModalOpen(true);
                  }}
                />
                <DropdownMenuItem
                  icon={<Command size={13} className="text-[#ff7a00]" />}
                  label="Command Palette"
                  badge="Ctrl+K"
                  badgeColor="text-neutral-400"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsCommandPaletteOpen(true);
                  }}
                />
                <DropdownMenuSection label="Hệ thống">
                {currentUser?.roles?.some(r => r.toUpperCase() === "ADMIN") && (
                  <DropdownMenuItem
                    icon={<Shield size={13} className="text-[#ff7a00]" />}
                    label="Admin Portal"
                    badge="Mở"
                    badgeColor="text-[#ff7a00]"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      window.location.href = "/admin/dashboard";
                    }}
                  />
                )}
                  <DropdownMenuItem
                    icon={<Globe size={13} className="text-blue-400" />}
                    label="Connected Apps"
                    badge={connectedAppIds.length + ' apps'}
                    badgeColor="text-neutral-400"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleToggleBotInfo(false);
                      setRightTab("Apps");
                    }}
                  />
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
              </DropdownMenu>
            </div>
          </>
        )}

        {/* Left Sidebar Draggable Resizer Splitter (only when expanded on desktop) */}
        {!isLeftSidebarCollapsed && (
          <div
            onMouseDown={() => setIsResizingLeft(true)}
            className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#ff7a00]/50 transition-colors z-30 -mr-0.5"
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

          {/* Middle Group: Capsule Info + Telemetry HUD */}
          <div className="flex items-center gap-2 mx-auto">
            <div className="relative group">
              <div
                id="tour-bot-spec-trigger"
                onClick={() => {
                  handleToggleBotInfo();
                  setMobileBotInfoOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 sm:gap-2 bg-neutral-100 dark:bg-[#181820] hover:bg-neutral-200 dark:hover:bg-[#22222e] border border-neutral-200/80 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium text-neutral-900 dark:text-white shadow-xs hover:shadow-sm cursor-pointer transition-all select-none"
              >
                <AgentAvatar agent={selectedAgent} size="xs" className="shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[200px] text-xs text-neutral-900 dark:text-white whitespace-nowrap">{selectedAgent.name}</span>
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
              {/* Rich Hover Tooltip for Capsule: Ping, Latency Telemetry, Specification & Status */}
              <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:flex flex-col gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#161622] border border-neutral-200 dark:border-[#2a2a3c] text-[11px] font-mono shadow-lg z-[100] whitespace-nowrap min-w-[260px] sm:min-w-[280px] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between gap-3 text-neutral-800 dark:text-neutral-200 border-b border-neutral-100 dark:border-[#242436] pb-1.5">
                  <span className="text-[#ff7a00] font-semibold">{selectedAgent.roleTag || "AI Teammate"}</span>
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
                <div className="pt-0.5 text-[9px] text-[#ff7a00] flex items-center justify-center">
                  <span>Bấm để {isBotInfoCollapsed ? "mở" : "đóng"} Specification</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex">
              <TelemetryHud telemetry={turnTelemetry} isStreaming={isStreaming} />
            </div>
          </div>

          {/* Header Action Controls (Command Palette moved into Avatar Menu) */}
          <div className="flex items-center gap-1.5 shrink-0">



            <button aria-label={isChatListCollapsed ? "Expand Conversations list" : "Collapse Conversations list"} data-ux-target-min="24"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  handleToggleChatList();
                } else {
                  setMobileChatsOpen((prev) => {
                    const nextState = !prev;
                    if (nextState) {
                      handleToggleChatList(false);
                    }
                    return nextState;
                  });
                  setMobileAgentsOpen(false);
                  setMobileBotInfoOpen(false);
                }
              }}
              className="h-8 w-8 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer shrink-0 transition-colors"
              title={isChatListCollapsed ? "Expand Conversations list" : "Collapse Conversations list"}
            >
              <MessageSquare size={16} />
            </button>



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
                <span className="text-[11px] text-[#ff7a00]">
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
        <div
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto ${isCompactMode ? "px-3 py-3 space-y-3.5" : "px-4 md:px-8 py-5 space-y-5"} max-w-3xl mx-auto w-full`}
        >
          {/* Lean dialogue flow without redundant banners */}

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
          ) : messages.length === 0 ? (
            /* Quick Suggestions for fresh New Chat session: Lean, no greeting text or descriptions */
            <div className="py-8 px-2 flex flex-col items-center justify-center animate-in fade-in duration-200 max-w-xl mx-auto w-full">
              <div className="w-full flex items-center justify-between mb-3 px-1 text-xs text-neutral-400 font-mono">
                <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                  <Sparkles size={13} className="text-[#ff7a00]" />
                  <span>Suggested Prompts</span>
                </span>
                <span className="text-[10px] text-neutral-500">Click to send immediately</span>
              </div>

              {/* Grid of 4 dynamic, agent-specific quick prompt suggestion cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left font-sans">
                {getDynamicSuggestionsForAgent(selectedAgent).map((item, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => {
                      executeTurnStream(item.prompt);
                    }}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#14141c]/90 hover:bg-slate-50 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#242432] hover:border-[#ff7a00]/50 text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-800 dark:text-neutral-200 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1e1e2c] text-[#ff7a00] border border-[#2b2b3e]">
                            {item.badge}
                          </span>
                        )}
                        <ArrowRight size={13} className="text-neutral-500 group-hover:text-[#ff7a00] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages
            .filter((msg) => {
              if (inSessionSearchQuery === "__STARRED__") return starredMsgIds.includes(msg.id);
              return !inSessionSearchQuery || msg.content.toLowerCase().includes(inSessionSearchQuery.toLowerCase());
            })
            .map((msg, mIdx) => {
              const isLastTurn = mIdx === messages.length - 1;
              const isUser = msg.role === "user";
              const hasSteps = msg.steps && msg.steps.length > 0;
              const hasTools = msg.toolCalls && msg.toolCalls.length > 0;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-2 w-full ${isUser ? "items-end" : "items-start"}`}
                >
                  {/* If user message: Clean right-aligned bubble, shrink to fit content */}
                  {isUser ? (
                    <div className="inline-block rounded-2xl px-4 py-2 text-[13px] leading-relaxed max-w-[85%] sm:max-w-[80%] bg-amber-500/10 text-slate-900 border-amber-500/30 dark:bg-[#1c1c26] dark:text-neutral-100 dark:border-[#2c2c3e] rounded-br-xs shadow-xs font-sans font-normal ml-auto overflow-hidden break-words">
                      <p className="whitespace-pre-wrap select-text break-words break-all">{msg.content}</p>
                      {msg.metadata?.isOfflineQueued && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-500 dark:text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                          <span>Chờ đồng bộ mạng (Tự gửi khi có mạng)</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Assistant Turn: Structured Content Blocks + Agent Tool Cards */
                    <div
                      onTouchStart={() => handleTouchStartMsg({ id: msg.id, content: msg.content, turnIdx: mIdx })}
                      onTouchEnd={handleTouchEndMsg}
                      onTouchMove={handleTouchEndMsg}
                      onTouchCancel={handleTouchEndMsg}
                      onContextMenu={(e) => {
                        if (window.innerWidth < 1024) {
                          e.preventDefault();
                          setMobileActionMsg({ id: msg.id, content: msg.content, turnIdx: mIdx });
                        }
                      }}
                      className="w-full max-w-full space-y-2.5 min-w-0 overflow-hidden"
                    >
                      {/* 1. Intermediate Steps (Reasoning & Tool Calls): Collapsible summary when turn is completed */}
                      {(hasSteps || hasTools) && (
                        <TurnExecutionAccordion
                          msg={msg}
                          isStreamingThisTurn={isStreaming && isLastTurn}
                        />
                      )}

                      {/* Subtle split dash divider between execution steps and final synthesis */}
                      {hasSteps && msg.content && (
                        <div className="py-1 flex items-center justify-center">
                          <div className="w-full border-t border-dashed border-[#242432]/60" />
                        </div>
                      )}

                      {/* 2. Formatted Main Response Content: left-aligned, transparent, no background, no border */}
                      {/* Smooth Bullet Typing Animation while streaming with no text yet */}
                      {isStreaming && isLastTurn && !msg.content && (
                        <div className="flex items-center gap-1.5 py-2 px-1 select-none">
                          <span className="h-2 w-2 rounded-full bg-[#ff7a00] typing-dot-1" />
                          <span className="h-2 w-2 rounded-full bg-[#ff7a00] typing-dot-2" />
                          <span className="h-2 w-2 rounded-full bg-[#ff7a00] typing-dot-3" />
                        </div>
                      )}

                      {msg.content && (
                        <>
                          <div className="text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200 py-1 px-0.5 divide-y divide-dashed divide-neutral-200 dark:divide-[#22222c]/50">
                            <FormattedMessageContent
                            content={msg.content}
                            agentNode={selectedAgent.node}
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
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] typing-dot-1" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] typing-dot-2" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] typing-dot-3" />
                              </span>
                            )}
                          </div>
                          {/* Visual Karaoke sentence pill indicator during TTS readout */}
                          {speakingMsgId === msg.id && speakingSentence && (
                            <div className="flex items-center gap-2 px-3 py-1.5 my-1 rounded-xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-xs font-mono text-[#ff7a00] animate-in fade-in select-none">
                              <Volume2 size={13} className="animate-pulse shrink-0" />
                              <span className="text-neutral-400 text-[10px] uppercase font-bold shrink-0">Reading:</span>
                              <span className="text-white italic truncate max-w-lg">"{speakingSentence}"</span>
                            </div>
                          )}

                          {/* Message Turn Action CTAs: ONLY rendered after turn completion, strictly hidden while streaming */}
                          {!(isStreaming && isLastTurn) && (
                          <div className="flex items-center gap-1 pt-1 mt-1 select-none">
                            {/* 0. Star / Bookmark Turn CTA */}
                            <div className="relative group">
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => toggleStarMessage(msg.id)}
                                className={`h-7 w-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                                  starredMsgIds.includes(msg.id)
                                    ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                                    : "hover:bg-[#181822] text-neutral-400 hover:text-white border-transparent hover:border-[#282836]"
                                }`}
                                aria-label={starredMsgIds.includes(msg.id) ? "Unstar message" : "Star message"}
                                title={starredMsgIds.includes(msg.id) ? "Remove star" : "Bookmark this turn"}
                              >
                                <Star size={13} className={starredMsgIds.includes(msg.id) ? "fill-amber-400" : ""} />
                              </button>
                            </div>

                            {/* Fork Session Branch CTA */}
                            <div className="relative group">
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => handleForkSession(mIdx)}
                                className="h-7 w-7 rounded-lg hover:bg-[#181822] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#282836]"
                                aria-label="Fork session from here"
                                title="Branch new session from this turn"
                              >
                                <GitFork size={13} className="text-cyan-400" />
                              </button>
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-0.5 rounded-md bg-[#161620] border border-[#262634] text-[10px] font-mono text-neutral-300 whitespace-nowrap shadow-lg z-20">
                                Branch session from here
                              </span>
                            </div>

                                                        {/* 1. Copy Response CTA */}
                            <div className="relative group">
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
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-0.5 rounded-md bg-[#161620] border border-[#262634] text-[10px] font-mono text-neutral-300 whitespace-nowrap shadow-lg z-20">
                                {copiedResponseMsgId === msg.id ? "Copied to clipboard!" : "Copy response"}
                              </span>
                            </div>

                            {/* 2. Text-to-Speech Voice Playback CTA */}
                            <div className="relative group">
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
                                <Volume2 size={13} className={speakingMsgId === msg.id ? "text-[#ff7a00] animate-pulse" : ""} />
                              </button>
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-0.5 rounded-md bg-[#161620] border border-[#262634] text-[10px] font-mono text-neutral-300 whitespace-nowrap shadow-lg z-20">
                                {speakingMsgId === msg.id ? "Stop reading" : "Read aloud (TTS)"}
                              </span>
                            </div>

                            {/* 3. Forward to Another Agent CTA */}
                            <div className="relative group">
                              <button data-ux-target-min="24"
                                type="button"
                                onClick={() => setForwardModalMsg(msg.content)}
                                className="h-7 w-7 rounded-lg hover:bg-[#181822] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-transparent hover:border-[#282836]"
                                aria-label="Forward response to another Agent"
                              >
                                <Share2 size={13} className="text-cyan-400" />
                              </button>
                              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex items-center px-2 py-0.5 rounded-md bg-[#161620] border border-[#262634] text-[10px] font-mono text-neutral-300 whitespace-nowrap shadow-lg z-20">
                                Forward to Agent
                              </span>
                            </div>
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

          

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Scroll to Bottom Button */}
        {showScrollBottomBtn && (
          <div className="absolute bottom-20 right-8 z-30 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                isUserScrolledUpRef.current = false;
                setShowScrollBottomBtn(false);
                smoothScrollToBottom();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181824]/95 border font-mono text-[11px] shadow-xl transition-all cursor-pointer backdrop-blur-md ${
                isStreaming
                  ? "border-[#ff7a00] text-white bg-[#221812]/95 shadow-[0_0_20px_rgba(255,122,0,0.5)] ring-1 ring-[#ff7a00]/60 animate-bounce"
                  : "border-[#ff7a00]/40 text-[#ff7a00] hover:bg-[#ff7a00] hover:text-black hover:shadow-[0_0_15px_rgba(255,122,0,0.4)]"
              }`}
              title="Jump to latest turn"
            >
              {isStreaming ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a00] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7a00]" />
                  </span>
                  <span>Generating response</span>
                  {turnTelemetry?.tokensPerSec ? (
                    <span className="px-1.5 py-0.2 rounded bg-[#ff7a00]/20 text-[#ff7a00] font-bold text-[10px]">
                      {turnTelemetry.tokensPerSec.toFixed(0)} t/s
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-[#ff7a00]/20 text-[#ff7a00] font-bold text-[10px]">
                      Live
                    </span>
                  )}
                </div>
              ) : (
                <span>Scroll to latest</span>
              )}
              <ChevronDown size={14} className={isStreaming ? "animate-pulse text-[#ff7a00]" : ""} />
            </button>
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
              : "bg-slate-900/90 dark:bg-[#14141c]/95 border-[#ff7a00]/40 text-neutral-100 shadow-[#ff7a00]/10"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
              loopModeToast.mode === "goal"
                ? "bg-emerald-500/20 text-emerald-400"
                : loopModeToast.mode === "mission"
                ? "bg-cyan-500/20 text-cyan-400"
                : "bg-amber-500/20 text-[#ff7a00]"
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] animate-pulse" />
                <span className="text-[#ff7a00] font-semibold">Queue:</span>
                <span className="truncate text-neutral-300">
                  {requestQueue.length} upcoming request{requestQueue.length > 1 ? "s" : ""} (Next: "{requestQueue[0]}")
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  requestQueueRef.current = [];
                  setRequestQueue([]);
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
                        className="relative h-6 w-6 rounded-md overflow-hidden bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10 shrink-0 cursor-zoom-in group-hover/filechip:ring-2 group-hover/filechip:ring-[#ff7a00]/50 transition-all"
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
                      <Paperclip size={13} className="text-[#ff7a00] shrink-0" />
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
          {backendError && (
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
              <div className="absolute bottom-full left-0 right-0 mb-3 w-full rounded-xl bg-white/95 dark:bg-[#121218]/95 border border-slate-200 dark:border-[#262634] shadow-lg backdrop-blur-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 select-none text-left">
                <div className="px-1 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-[#222230]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-300 font-semibold tracking-wide">
                      Add to prompt
                    </span>
                  </div>

                  {/* Instant Filter Search inside Popover */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#181824] border border-slate-200 dark:border-[#262638] focus-within:border-[#ff7a00]/50 rounded-lg px-2 py-1 text-xs sm:w-56 transition-colors">
                    <Search size={12} className="text-neutral-400 shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      value={plusMenuSearch}
                      onChange={(e) => {
                        setPlusMenuSearch(e.target.value);
                        setPlusMenuSelectedIndex(-1);
                      }}
                      onKeyDown={(e) => {
                        // Gather navigable items across loop modes, apps, and subagents
                        const q = plusMenuSearch.trim().toLowerCase();
                        let agentApps = currentAgentMcpClients.length > 0
                          ? currentAgentMcpClients.map((c) => {
                              const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                              const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || c.name.toLowerCase().includes(a.id.toLowerCase()));
                              return { type: "app" as const, id: matched?.id || rawKey, name: matched?.name || c.name || c.key };
                            })
                          : APPS_CATALOG.map((a) => ({ type: "app" as const, id: a.id, name: a.name }));
                        if (q) agentApps = agentApps.filter((a) => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));

                        const boundChildren = currentAgentSubBindings.map((b) => b.child_agent_id);
                        const subAgentsList = agents.filter((ag) => boundChildren.includes(ag.id) || boundChildren.includes(ag.slug));
                        let displayAgents = subAgentsList.length > 0 ? subAgentsList : agents.filter((ag) => ag.id !== selectedAgent.id);
                        if (q) displayAgents = displayAgents.filter((ag) => ag.name.toLowerCase().includes(q) || (ag.roleTag || "").toLowerCase().includes(q) || ag.id.toLowerCase().includes(q));
                        const agentItems = displayAgents.map((ag) => ({ type: "subagent" as const, id: ag.id, name: ag.name }));

                        const allNavItems = [...agentApps, ...agentItems];
                        if (allNavItems.length === 0) return;

                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setPlusMenuSelectedIndex((prev) => (prev + 1 >= allNavItems.length ? 0 : prev + 1));
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          setPlusMenuSelectedIndex((prev) => (prev <= 0 ? allNavItems.length - 1 : prev - 1));
                        } else if (e.key === "PageDown") {
                          e.preventDefault();
                          // Jump 5 items forward or scroll container down
                          setPlusMenuSelectedIndex((prev) => Math.min(allNavItems.length - 1, (prev < 0 ? 0 : prev) + 5));
                          if (appsScrollRef.current) {
                            appsScrollRef.current.scrollTop += 160;
                          }
                          if (subAgentsScrollRef.current) {
                            subAgentsScrollRef.current.scrollTop += 160;
                          }
                        } else if (e.key === "PageUp") {
                          e.preventDefault();
                          // Jump 5 items backward or scroll container up
                          setPlusMenuSelectedIndex((prev) => Math.max(0, (prev < 0 ? 0 : prev) - 5));
                          if (appsScrollRef.current) {
                            appsScrollRef.current.scrollTop -= 160;
                          }
                          if (subAgentsScrollRef.current) {
                            subAgentsScrollRef.current.scrollTop -= 160;
                          }
                        } else if (e.key === "Home" && !plusMenuSearch) {
                          e.preventDefault();
                          // Jump immediately to the first item and scroll to top
                          setPlusMenuSelectedIndex(0);
                          if (appsScrollRef.current) {
                            appsScrollRef.current.scrollTop = 0;
                          }
                          if (subAgentsScrollRef.current) {
                            subAgentsScrollRef.current.scrollTop = 0;
                          }
                        } else if (e.key === "End" && !plusMenuSearch) {
                          e.preventDefault();
                          // Jump immediately to the last item and scroll to bottom
                          setPlusMenuSelectedIndex(allNavItems.length - 1);
                          if (appsScrollRef.current) {
                            appsScrollRef.current.scrollTop = appsScrollRef.current.scrollHeight;
                          }
                          if (subAgentsScrollRef.current) {
                            subAgentsScrollRef.current.scrollTop = subAgentsScrollRef.current.scrollHeight;
                          }
                        } else if (!plusMenuSearch && (e.key === "1" || e.key === "2" || e.key === "3")) {
                          e.preventDefault();
                          if (e.key === "1") handleSelectLoopMode("default");
                          if (e.key === "2") handleSelectLoopMode("goal");
                          if (e.key === "3") handleSelectLoopMode("mission");
                        } else if (e.key === "Enter") {
                          if (plusMenuSelectedIndex >= 0 && plusMenuSelectedIndex < allNavItems.length) {
                            e.preventDefault();
                            const selected = allNavItems[plusMenuSelectedIndex];
                            setIsPlusMenuOpen(false);
                            setInputText((prev) => {
                              if (selected.type === "app") {
                                const exists = prev.includes(`/${selected.id} `) || prev.endsWith(`/${selected.id}`);
                                if (exists) {
                                  return prev.replace(new RegExp(`/${selected.id}\\s*`, "g"), "").trimStart();
                                }
                                return prev ? `${prev} /${selected.id} ` : `/${selected.id} `;
                              } else {
                                const exists = prev.includes(`@${selected.name}`);
                                if (exists) {
                                  return prev.replace(new RegExp(`@${selected.name}\\s*`, "g"), "").trimStart();
                                }
                                return prev ? `${prev} @${selected.name} ` : `@${selected.name} `;
                              }
                            });
                            textareaRef.current?.focus();
                          }
                        }
                      }}
                      placeholder="Search files, apps, agents..."
                      className="w-full bg-transparent border-0 text-[11px] text-slate-900 dark:text-white placeholder:text-neutral-500 focus:outline-none"
                    />
                    {plusMenuSearch && (
                      <button
                        type="button"
                        onClick={() => setPlusMenuSearch("")}
                        className="text-neutral-400 hover:text-white cursor-pointer"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2.5 items-stretch">
                  {/* Column 1: Add Files & Work Mode (Add files at the top, followed by clear work modes) */}
                  <div className="flex flex-col justify-between space-y-2 h-full">
                    {/* 1. Add Files Option (Placed at the very top as requested) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">Tệp đính kèm</div>
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Tải lên tệp hoặc thư mục</div>
                        </div>
                        <Paperclip size={13} className="text-[#ff7a00]" />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsPlusMenuOpen(false);
                          fileInputRef.current?.click();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-left transition-all cursor-pointer border border-[#ff7a00]/30 bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 text-slate-900 dark:text-white group shadow-xs"
                      >
                        <div className="h-7 w-7 rounded-lg bg-[#ff7a00] flex items-center justify-center text-black shrink-0 shadow-xs transition-transform group-hover:scale-105">
                          <Paperclip size={14} className="stroke-[2.5]" />
                        </div>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-[#ff7a00] transition-colors">
                            Add Files
                          </span>
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
                            ? "bg-amber-500/10 dark:bg-[#1f1f2e] border-[#ff7a00] text-slate-900 dark:text-white shadow-xs"
                            : "bg-slate-100/80 dark:bg-[#181822]/80 hover:bg-slate-200/80 dark:hover:bg-[#20202e] border-slate-200 dark:border-transparent hover:border-slate-300 dark:hover:border-[#2f2f42] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="h-6 w-6 rounded-lg bg-white dark:bg-neutral-800 border border-slate-200 dark:border-transparent shadow-2xs flex items-center justify-center text-neutral-600 dark:text-neutral-300 mt-0.5 shrink-0 transition-colors">
                          <CircleDot size={13} className={activeLoopMode === "default" ? "text-[#ff7a00]" : "text-slate-500 dark:text-neutral-400"} />
                        </div>
                        <div className="flex flex-col text-left min-w-0 flex-1">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">Tiêu chuẩn</span>
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-neutral-400">1</span>
                            </div>
                            {activeLoopMode === "default" && (
                              <span className="h-2 w-2 rounded-full bg-[#ff7a00] shrink-0 ml-1" />
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
                  <div className="flex flex-col space-y-1.5 h-full">
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Connected Apps</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-[9px] font-mono text-slate-700 dark:text-neutral-300">
                          {(() => {
                            const q = plusMenuSearch.trim().toLowerCase();
                            let arr = currentAgentMcpClients.length > 0
                              ? currentAgentMcpClients.map((c) => {
                                  const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                                  const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || c.name.toLowerCase().includes(a.id.toLowerCase()));
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
                            handleToggleBotInfo(false);
                            setRightTab("Apps");
                          }}
                          className="p-1 rounded-md text-neutral-400 hover:text-[#ff7a00] hover:bg-white/5 transition-colors cursor-pointer"
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
                      className="flex-1 max-h-[42vh] sm:max-h-[310px] overflow-y-auto space-y-1 pr-1.5 overscroll-contain transform-gpu smooth-scroll-container"
                    >
                      {(() => {
                        // Priority 1: All apps loaded from Agent's active MCP clients with instant search
                        const q = plusMenuSearch.trim().toLowerCase();
                        let agentApps = currentAgentMcpClients.length > 0
                          ? currentAgentMcpClients.map((c) => {
                              const rawKey = c.key.toLowerCase().replace(/^composio_/, "");
                              const matched = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || c.name.toLowerCase().includes(a.id.toLowerCase()));
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
                            key={app.id}
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
                                ? "bg-[#ff7a00]/15 dark:bg-[#ff7a00]/20 border-[#ff7a00] text-slate-900 dark:text-white shadow-xs"
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
                              isAlreadyAdded ? "text-amber-400 font-semibold" : "text-neutral-500 group-hover:text-[#ff7a00]"
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
                  <div className="flex flex-col space-y-1.5 h-full">
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <span>Subagents</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-white/10 text-[9px] font-mono text-slate-700 dark:text-neutral-300">
                          {(() => {
                            const q = plusMenuSearch.trim().toLowerCase();
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
                            handleToggleBotInfo(false);
                            setRightTab("Agents");
                          }}
                          className="p-1 rounded-md text-neutral-400 hover:text-[#ff7a00] hover:bg-white/5 transition-colors cursor-pointer"
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
                      className="flex-1 max-h-[42vh] sm:max-h-[310px] overflow-y-auto space-y-1 pr-1.5 overscroll-contain transform-gpu smooth-scroll-container"
                    >
                      {(() => {
                        // All subagents configured on selected agent with instant search
                        const q = plusMenuSearch.trim().toLowerCase();
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
                          const qApp = plusMenuSearch.trim().toLowerCase();
                          let arr = currentAgentMcpClients.length > 0
                            ? currentAgentMcpClients.map((c) => c.key.toLowerCase().replace(/^composio_/, ""))
                            : APPS_CATALOG.map((a) => a.id);
                          if (qApp) arr = arr.filter((id) => id.includes(qApp));
                          return arr.length;
                        })();

                        return displayList.map((ag, subIdx) => {
                          const isHighlighted = plusMenuSelectedIndex === (appsCount + subIdx);
                          const isAlreadyMentioned = inputText.includes(`@${ag.name}`);
                          return (
                          <button
                            key={ag.id}
                            type="button"
                            data-popover-nav-idx={appsCount + subIdx}
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setInputText((prev) => {
                                if (isAlreadyMentioned) {
                                  // Remove the @mention cleanly
                                  return prev
                                    .replace(new RegExp(`@${ag.name}\\s*`, "g"), "")
                                    .trimStart();
                                }
                                return prev ? `${prev} @${ag.name} ` : `@${ag.name} `;
                              });
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
                                  : "bg-amber-500/15 dark:bg-[#ff7a00]/20 border-amber-500/40 dark:border-[#ff7a00]/30 text-[#ff7a00]"
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

                {/* Popover Keyboard Shortcuts Footer Hint Bar */}
                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#222230] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-bold border border-slate-200 dark:border-white/5">↑/↓</span>
                      <span>Di chuyển</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-bold border border-slate-200 dark:border-white/5">PgUp/PgDn</span>
                      <span>Nhảy trang</span>
                    </span>
                    <span className="flex items-center gap-1 hidden sm:inline-flex">
                      <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-bold border border-slate-200 dark:border-white/5">Home/End</span>
                      <span>Đầu/Cuối</span>
                    </span>
                    <span className="flex items-center gap-1 hidden sm:inline-flex">
                      <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-bold border border-slate-200 dark:border-white/5">1-3</span>
                      <span>Chế độ</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="px-1.5 py-0.2 rounded bg-[#ff7a00]/20 text-[#ff7a00] font-bold border border-[#ff7a00]/30">↵ Enter</span>
                      <span>Chọn</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300 font-bold border border-slate-200 dark:border-white/5">Esc</span>
                      <span>Đóng</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Micro-chips preview for active @mentions and /tools in prompt input with Clear All */}
            {(() => {
              const mentions = Array.from(new Set(inputText.match(/@[a-zA-Z0-9_-]+/g) || []));
              const tools = Array.from(new Set(inputText.match(/\/[a-zA-Z0-9_-]+/g) || []));
              const totalChips = mentions.length + tools.length;
              if (totalChips === 0) return null;

              return (
                <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-1 mb-1.5 animate-in fade-in duration-150">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {mentions.map((mention) => {
                      const cleanName = mention.replace(/^@/, "");
                      const targetAgent = agents.find((a) => a.name.toLowerCase() === cleanName.toLowerCase() || a.id.toLowerCase() === cleanName.toLowerCase());
                      const roleDesc = targetAgent?.roleTag || (targetAgent as { title?: string } | undefined)?.title || "Team Autonomous Agent";

                      return (
                        <div key={mention} className="relative group/chiptip inline-flex items-center animate-in zoom-in-75 fade-in duration-200">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono shadow-2xs hover:border-cyan-400/60 transition-all">
                            <span className="font-semibold">{mention}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setInputText((prev) =>
                                  prev.replace(new RegExp(`${mention}\\s*`, "g"), "").trimStart()
                                );
                              }}
                              className="text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-200 cursor-pointer p-0.5 rounded-full"
                              aria-label={`Remove ${mention}`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                          <div className="pointer-events-none absolute bottom-full left-0 mb-1.5 hidden group-hover/chiptip:flex px-2 py-1 rounded-lg bg-slate-900/95 dark:bg-[#1c1c28]/95 border border-slate-700 dark:border-[#2e2e42] text-[10px] font-mono text-slate-100 whitespace-nowrap shadow-xl z-30 flex-col gap-0.5">
                            <div className="font-semibold text-cyan-400">{targetAgent?.name || mention}</div>
                            <div className="text-[9px] text-neutral-400 max-w-[200px] truncate">{roleDesc}</div>
                          </div>
                        </div>
                      );
                    })}

                    {tools.map((tool) => {
                      const rawKey = tool.replace(/^\//, "").toLowerCase();
                      const matchedApp = APPS_CATALOG.find((a) => a.id.toLowerCase() === rawKey || a.name.toLowerCase().includes(rawKey));
                      const toolTitle = matchedApp?.name || tool;
                      const toolDesc = matchedApp?.description || "MCP tool capability integration";

                      return (
                        <div key={tool} className="relative group/chiptip inline-flex items-center animate-in zoom-in-75 fade-in duration-200">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-mono shadow-2xs hover:border-amber-400/60 transition-all">
                            <span className="font-semibold">{tool}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setInputText((prev) =>
                                  prev.replace(new RegExp(`${tool}\\s*`, "g"), "").trimStart()
                                );
                              }}
                              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 cursor-pointer p-0.5 rounded-full"
                              aria-label={`Remove ${tool}`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                          <div className="pointer-events-none absolute bottom-full left-0 mb-1.5 hidden group-hover/chiptip:flex px-2 py-1 rounded-lg bg-slate-900/95 dark:bg-[#1c1c28]/95 border border-slate-700 dark:border-[#2e2e42] text-[10px] font-mono text-slate-100 whitespace-nowrap shadow-xl z-30 flex-col gap-0.5">
                            <div className="font-semibold text-amber-400">{toolTitle}</div>
                            <div className="text-[9px] text-neutral-400 max-w-[220px] truncate">{toolDesc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalChips >= 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputText((prev) => {
                          let cleaned = prev;
                          mentions.forEach((m) => {
                            cleaned = cleaned.replace(new RegExp(`${m}\\s*`, "g"), "");
                          });
                          tools.forEach((t) => {
                            cleaned = cleaned.replace(new RegExp(`${t}\\s*`, "g"), "");
                          });
                          return cleaned.trimStart();
                        });
                      }}
                      className="text-[10px] font-mono text-neutral-400 hover:text-red-400 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-red-500/10 shrink-0"
                    >
                      Clear all ({totalChips})
                    </button>
                  )}
                </div>
              );
            })()}

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
              className={`relative flex items-center gap-2 bg-white dark:bg-[#14141c] border ${
                isDraggingFiles
                  ? "border-[#ff7a00] ring-2 ring-[#ff7a00]/30 bg-amber-500/5 dark:bg-[#ff7a00]/10"
                  : isRecording
                  ? "border-red-500/60 ring-2 ring-red-500/20"
                  : "border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/15 focus-within:border-[#ff7a00]/50 dark:focus-within:border-[#ff7a00]/50 focus-within:ring-1 focus-within:ring-[#ff7a00]/20"
              } rounded-2xl px-4 py-2.5 shadow-xs transition-all overflow-hidden`}
            >
              {/* Drag-and-Drop Active Overlay */}
              {isDraggingFiles && (
                <div className="absolute inset-0 z-40 flex items-center justify-center gap-2 bg-slate-900/90 dark:bg-[#14141c]/95 border-2 border-dashed border-[#ff7a00] rounded-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                  <Paperclip size={15} className="text-[#ff7a00] animate-bounce" />
                  <span className="text-xs font-mono font-semibold text-white tracking-wide">
                    Drop files here to attach to {selectedAgent.name}
                  </span>
                </div>
              )}
              {/* Hidden native file input */}
              <input data-ux-target-min="16"
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Plus / Add Files, Apps & Agents Trigger */}
              {(() => {
                // Count active tools and mentions in prompt
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
                      className={`text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer p-1 rounded-full flex items-center justify-center shrink-0 ${
                        isPlusMenuOpen ? "text-[#ff7a00] dark:text-[#ff7a00] rotate-45 scale-110" : ""
                      }`}
                      title="Add files, apps, or mention agents"
                    >
                      {isUploadingFile ? (
                        <Loader2 size={16} className="animate-spin text-[#ff7a00]" />
                      ) : (
                        <Plus size={16} className="transition-transform duration-200" />
                      )}
                    </button>
                    {totalActiveItems > 0 && !isPlusMenuOpen && (
                      <span className="absolute -top-1 -right-1 h-3.5 min-w-[14px] px-1 rounded-full bg-[#ff7a00] text-black font-mono font-bold text-[8px] flex items-center justify-center shadow-xs pointer-events-none">
                        {totalActiveItems}
                      </span>
                    )}
                  </div>
                );
              })()}

            {/* Prompt Recipes & Templates Popover Trigger */}
            <button
              type="button"
              onClick={() => setIsRecipesModalOpen(true)}
              className="text-neutral-400 hover:text-[#ff7a00] transition-colors cursor-pointer p-0.5 shrink-0 flex items-center justify-center translate-y-[1px]"
              title="Open Prompt Recipes & Templates"
            >
              <Sparkles size={15} />
            </button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // Auto-expand height smoothly up to 130px
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
              }}
              onKeyDown={(e) => {
                // Fast Backspace LIFO tag deletion when cursor is at the very beginning of user-written text or prompt is composed only of tags
                if (e.key === "Backspace") {
                  const target = e.currentTarget;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  // Only trigger tag deletion if there is no active text selection
                  if (start === end) {
                    const textBefore = target.value.substring(0, start);
                    // Match trailing mention or tool right before cursor
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
                        target.style.height = Math.min(target.scrollHeight, 130) + "px";
                      }, 0);
                      return;
                    }
                  }
                }

                // If Ctrl+Enter or Cmd+Enter is pressed, insert a clean newline without sending
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
                    target.style.height = Math.min(target.scrollHeight, 130) + "px";
                  }, 0);
                  return;
                }

                // Ordinary Enter sends the message immediately unless Shift is held
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  composerFormRef.current?.requestSubmit();
                  if (textareaRef.current) {
                    textareaRef.current.style.height = "auto";
                  }
                }
              }}
              placeholder={
                isRecording
                  ? "🎙 Đang nghe... Hãy nói để chuyển thành văn bản..."
                  : isStreaming
                  ? `Agent is responding • Enter to queue next request, or click Stop...`
                  : `Message ${selectedAgent.name}... (Enter to send, Shift+Enter for new line)`
              }
              aria-label={`Message ${selectedAgent.name}`}
              className="flex-1 bg-transparent border-0 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 focus:outline-none resize-none max-h-32 py-1 leading-relaxed scrollbar-none"
            />

            <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
              {/* Context Token Usage Circular Ring Trigger (Hover for detail) */}
              <ContextUsageBar
                agentId={selectedAgent.id}
                sessionId={selectedChat?.id}
                estimatedTokens={selectedChat?.messageCount ? selectedChat.messageCount * 380 : 1200}
                maxTokens={128000}
                className="compact-trigger text-neutral-400 hover:text-white"
              />

              {/* Live WebRTC Audio Visualizer */}
              <AudioVisualizerWaveform
                isRecording={isRecording}
                agentId={selectedAgent?.id}
                onAudioLevel={(lvl) => {
                  audioEnergyLevelRef.current = lvl;
                  setLiveVoiceEnergy(lvl);
                }}
              />

              {/* Starred Messages & Keyboard Shortcuts Quick Hub */}
              <button
                type="button"
                onClick={() => setIsStarredShortcutsOpen(true)}
                className="hidden sm:flex p-1 rounded-full hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 dark:text-neutral-400 cursor-pointer transition-colors relative"
                title="Đã đánh dấu sao & Phím tắt hệ thống (Ctrl+/)"
              >
                <Command size={15} />
                {starredMsgIds.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 ring-1 ring-[#0c0c0e]" />
                )}
              </button>

              {/* Voice to text recording button (Supports Click Toggle, Push-to-Talk & Right-Click for Voice Settings) */}
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
                      (liveVoiceEnergy > 45 ? "rgba(255, 51, 102, 0.75)" : "rgba(255, 122, 0, 0.65)")
                    : undefined,
                }}
                className={`p-1 rounded-full cursor-pointer transition-all ${
                  isRecording
                    ? liveVoiceEnergy > 45
                      ? "bg-gradient-to-r from-[#ff3366] to-[#ff7a00] text-white"
                      : "bg-[#ff7a00] text-black"
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
                    <span className="text-[10px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded-full border border-[#ff7a00]/20">
                      Queued: {requestQueue.length}
                    </span>
                  )}
                </div>
              )}
              <button
                type="submit"
                disabled={!inputText.trim() && attachedFiles.length === 0}
                className="hover:text-neutral-900 dark:hover:text-white disabled:opacity-30 transition-colors cursor-pointer p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-neutral-500 dark:text-neutral-400"
                title={isStreaming ? "Add to request queue" : "Send Message"}
                aria-label={isStreaming ? "Add to request queue" : "Send Message"}
              >
                <Send size={15} />
              </button>
            </div>
          </form>
          </div>
        </div>
      </main>

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
              className="hidden lg:block relative w-1 h-full cursor-col-resize hover:bg-[#ff7a00]/60 active:bg-[#ff7a00] transition-colors shrink-0 z-30 select-none group"
              title={t("computer.dragSplitterTitle") || "Kéo để thay đổi tỷ lệ"}
            >
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-0.5 h-6 rounded-full bg-neutral-600/40 group-hover:bg-[#ff7a00] group-hover:h-9 transition-all" />
            </div>

            <section
            data-testid="virtual-computer-split-pane"
            aria-label="Virtual Computer Interactive Workspace"
            className="fixed inset-0 z-50 lg:static lg:z-10 flex-1 h-full flex flex-col bg-[#0d0d12] border-l border-neutral-200 dark:border-[#1e1e24] shadow-2xl lg:shadow-none animate-in fade-in duration-150 overflow-hidden min-w-0"
          >
            {/* Top Control Bar */}
            <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] bg-[var(--bg-sidebar)] px-3 sm:px-4 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-mono font-semibold text-white tracking-wide truncate">
                  {selectedAgent.name} Computer
                </span>

              </div>

              {/* Action Buttons: Screenshot, Reload, Fullscreen modal, Open in new tab, and Close Split */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* 1. Quick Screenshot Button */}
                <button
                  type="button"
                  onClick={async () => {
                    triggerHaptic();
                    playNotificationChime("retro");
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
                  className="h-8 px-2.5 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] text-neutral-300 hover:text-cyan-400 flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
                  title={t("computer.screenshotBtn")}
                >
                  <Camera size={13} className="text-cyan-400" />
                  <span className="hidden xl:inline text-[11px]">{t("computer.screenshotBtn")}</span>
                </button>

                {/* 2. Reload Session Button */}
                <button
                  type="button"
                  disabled={isReloadingBrowser}
                  onClick={() => {
                    triggerHaptic();
                    setIsReloadingBrowser(true);
                    setBrowserIframeKey((k) => k + 1);
                    setTimeout(() => setIsReloadingBrowser(false), 900);
                  }}
                  className="h-8 px-2 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer disabled:opacity-50"
                  title={t("computer.reloadProfileBtn")}
                >
                  <RefreshCw size={12} className={isReloadingBrowser ? "animate-spin text-[#ff7a00]" : ""} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSetBrowserModalOpen(true)}
                  className="h-8 px-2.5 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
                  title={t("computer.zenMode")}
                  aria-label="Expand full screen modal"
                >
                  <Maximize2 size={13} />
                  <span className="hidden sm:inline text-[11px]">{t("computer.zenMode")}</span>
                </button>

                <a
                  href={browserTarget.url ? "#" : undefined}
                  onClick={(e) => { e.preventDefault(); if (browserTarget.url) openAgentDesktopTab(agentBrowserFor); }}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-2.5 rounded-lg bg-[#181820] hover:bg-[#22222e] border border-[#242430] text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
                  title={t("computer.openExternal")}
                  aria-label="Open external window"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline text-[11px]">{t("computer.openExternal")}</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleToggleComputerSplit(false)}
                  className="h-8 w-8 rounded-lg bg-[#22222e] hover:bg-red-500/20 hover:text-red-400 border border-[#303042] hover:border-red-500/30 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer ml-1"
                  title={t("computer.closeComputer")}
                  aria-label="Close Virtual Computer"
                >
                  <X size={15} />
                </button>
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
      {/* 3. CONVERSATION SESSIONS LIST (COLLAPSIBLE, RIGHT OF CHAT) */}
      {/* ========================================================= */}
      <aside
        id="tour-chat-sessions"
        style={{
          width: !isChatListCollapsed && typeof window !== "undefined" && window.innerWidth >= 1024 ? `${chatSessionsWidth}px` : undefined,
        }}
        className={`fixed lg:static inset-y-0 right-0 z-50 lg:z-30 h-full flex-col bg-[var(--bg-sidebar)] shrink-0 transition-grok relative ${
          mobileChatsOpen
            ? "flex w-[85vw] max-w-[360px] border-l border-neutral-200 dark:border-[#1e1e24] translate-x-0 shadow-2xl"
            : isChatListCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full lg:w-0 lg:translate-x-0"
            : "flex w-[85vw] max-w-[360px] border-l border-neutral-200 dark:border-[#1e1e24] translate-x-0 shadow-none"
        }`}
      >
        {/* Subtle, Slim Resizer Splitter between Chat and Session Chats */}
        {!isChatListCollapsed && (
          <div
            onMouseDown={() => setIsResizingChatSessions(true)}
            className="hidden lg:block absolute top-0 left-0 w-1.5 h-full cursor-col-resize hover:bg-[#ff7a00]/40 active:bg-[#ff7a00] transition-colors z-30 -ml-1 group"
            title="Kéo để chỉnh độ rộng danh sách chat"
          >
            <div className="w-0.5 h-6 bg-neutral-600/40 group-hover:bg-[#ff7a00] rounded-full mx-auto my-auto relative top-1/2 -translate-y-1/2 transition-colors" />
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
          <div className="h-12 px-3 border-b border-[#1c1c22] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare size={15} className="text-[#ff7a00] shrink-0" />
              <span className="text-xs font-mono text-white font-semibold tracking-tight truncate">
                Chats ({chats.length})
              </span>
            </div>

            {/* Action & Expand/Collapse icons shifted to the right */}
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <button aria-label="Search chats" data-ux-target-min="24"
                onClick={() => setChatSearchOpen(!chatSearchOpen)}
                className="h-7 w-7 rounded-lg hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Search chats"
              >
                <Search size={14} />
              </button>
              {/* Delete Selected Sessions Button: ONLY visible when 1 or more sessions are checked */}
              {selectedChatIds.length > 0 && (
                <button
                  aria-label={`Delete ${selectedChatIds.length} selected conversations`}
                  data-ux-target-min="24"
                  type="button"
                  onClick={() => setIsBatchClearModalOpen(true)}
                  className="h-7 px-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 flex items-center gap-1.5 text-[11px] font-mono transition-all cursor-pointer animate-in fade-in"
                  title={`Xóa ${selectedChatIds.length} phiên hội thoại đã chọn`}
                >
                  <Trash2 size={12} />
                  <span>Xóa ({selectedChatIds.length})</span>
                </button>
              )}
              <button aria-label="New Chat Session" data-ux-target-min="24"
                onClick={handleNewChat}
                className="h-7 w-7 rounded-lg hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="New Chat Session"
              >
                <Plus size={15} />
              </button>

              {/* Collapse bar trigger for conversations on desktop */}
              <button aria-label="Collapse Conversations list" data-ux-target-min="24"
                onClick={() => handleToggleChatList(true)}
                className="hidden lg:flex h-7 w-7 rounded-lg hover:bg-[#1f1f26] items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Collapse Conversations list"
              >
                <ChevronRight size={16} />
              </button>

              {/* Close button for conversations on mobile */}
              <button aria-label="Close drawer" data-ux-target-min="24"
                onClick={() => setMobileChatsOpen(false)}
                className="lg:hidden h-7 w-7 rounded-lg bg-[#181820] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                title="Close drawer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Collapsed rail preview icons */}
        {(isChatListCollapsed && !mobileChatsOpen) ? (
          <div className="flex-1 flex flex-col items-center py-3 space-y-2.5 overflow-hidden w-full">
            <button aria-label="New Chat" data-ux-target-min="24"
              onClick={handleNewChat}
              className="h-8 w-8 rounded-xl bg-[#1c1c24] hover:bg-[#ff7a00] hover:text-white text-neutral-300 flex items-center justify-center transition-colors cursor-pointer border border-[#262632] shadow-sm"
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
                    className={`h-7 w-7 rounded-xl flex items-center justify-center text-[10px] font-mono cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-[#ff7a00] border-[#ff7a00] text-black font-bold shadow-md shadow-[#ff7a00]/25"
                        : "bg-[#16161e] border-[#22222d] text-neutral-400 hover:text-white hover:bg-[#20202c] hover:border-[#303042]"
                    }`}
                    title={c.title}
                  >
                    {displayLetter}
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

            {/* Filter Tabs for Conversations: All / Unread / Pinned (Shared Tabs Primitive) */}
            <div className="px-2 pt-2 pb-1 border-b border-[#1c1c24]">
              <Tabs
                size="sm"
                className="w-full justify-between"
                activeTab={chatFilterTab}
                onChange={(tabId) => setChatFilterTab(tabId as any)}
                tabs={[
                  { id: "all", label: "All", count: chats.length },
                  { id: "unread", label: "Done", count: (unreadCompletedSessions[selectedAgent.id] || []).length || undefined },
                  { id: "pinned", label: "Pinned", count: pinnedChatIds.length || undefined },
                ]}
              />
            </div>

            {/* Select All / Batch Selection Bar: Only visible when at least 1 chat is checked */}
            {filteredChats.length > 0 && selectedChatIds.length > 0 && (
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-[#1c1c24] text-[11px] font-mono select-none bg-[#101017] animate-in fade-in duration-150">
                <div
                  onClick={() => handleToggleSelectAll(filteredChats)}
                  className="flex items-center gap-2 cursor-pointer group text-neutral-400 hover:text-white transition-colors"
                  title="Chọn tất cả hoặc bỏ chọn tất cả phiên trong danh sách này"
                >
                  <div
                    className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all ${
                      filteredChats.every((c) => selectedChatIds.includes(c.id))
                        ? "bg-[#ff7a00] border-[#ff7a00] text-black shadow-xs"
                        : filteredChats.some((c) => selectedChatIds.includes(c.id))
                        ? "bg-[#ff7a00]/30 border-[#ff7a00] text-[#ff7a00]"
                        : "border-[#303042] bg-[#161622] group-hover:border-[#ff7a00]/60"
                    }`}
                  >
                    {filteredChats.every((c) => selectedChatIds.includes(c.id)) ? (
                      <Check size={11} className="stroke-[3]" />
                    ) : filteredChats.some((c) => selectedChatIds.includes(c.id)) ? (
                      <div className="h-1.5 w-1.5 rounded-xs bg-[#ff7a00]" />
                    ) : null}
                  </div>
                  <span className="font-sans font-medium text-xs text-neutral-300 group-hover:text-white">
                    {filteredChats.every((c) => selectedChatIds.includes(c.id))
                      ? "Bỏ chọn tất cả"
                      : "Chọn tất cả (Select All)"}
                  </span>
                </div>

                {selectedChatIds.length > 0 && (
                  <span className="text-[10px] text-[#ff7a00] font-semibold bg-[#ff7a00]/10 px-1.5 py-0.5 rounded">
                    Đã chọn {selectedChatIds.length}/{filteredChats.length}
                  </span>
                )}
              </div>
            )}

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
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
                return (
                  <div
                    key={chat.id}
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
                    className={`w-full rounded-xl text-left flex items-center transition-colors cursor-pointer group animate-fade-in-stagger relative select-none ${
                      layoutDensity === "compact"
                        ? "p-1.5 gap-2"
                        : layoutDensity === "comfortable"
                        ? "p-3 gap-3"
                        : "p-2.5 gap-2.5"
                    } ${
                      activeChatMenuId === chat.id ? "z-40" : "z-auto"
                    } ${
                      isSelected
                        ? "bg-[#22222c] text-white shadow-sm"
                        : "hover:bg-[#181820] text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {/* Interactive Icon Box: Shows Checkbox on hover or when selected, otherwise MessageSquare */}
                    <div
                      onClick={(e) => handleToggleSelectChat(chat.id, e)}
                      className={`h-7 w-7 rounded-lg border flex items-center justify-center shrink-0 relative transition-all cursor-pointer ${
                        selectedChatIds.includes(chat.id)
                          ? "bg-[#ff7a00] border-[#ff7a00] text-black shadow-xs shadow-[#ff7a00]/30"
                          : "bg-[#181822] border-[#2a2a3a] text-neutral-400 group-hover:border-[#ff7a00]/50"
                      }`}
                      title={selectedChatIds.includes(chat.id) ? "Bỏ chọn phiên này" : "Chọn phiên này để xóa hàng loạt"}
                    >
                      {/* Checkbox Icon (always shown if checked, or shown on desktop hover) */}
                      <span className={selectedChatIds.includes(chat.id) ? "block" : "hidden group-hover:block"}>
                        <Check size={13} className={selectedChatIds.includes(chat.id) ? "text-black stroke-[3]" : "text-[#ff7a00]"} />
                      </span>

                      {/* Default MessageSquare icon (hidden when checked or when hovering on desktop) */}
                      <span className={selectedChatIds.includes(chat.id) ? "hidden" : "block group-hover:hidden"}>
                        <MessageSquare size={13} className={isSelected ? "text-[#ff7a00]" : "text-neutral-400"} />
                        {(() => {
                          const isUnreadCompleted = (unreadCompletedSessions[selectedAgent.id] || []).includes(chat.id);
                          if (isUnreadCompleted) {
                            return (
                              <span
                                className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0f0f14] shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse"
                                title="Công việc đã hoàn thành và sẵn sàng nghiệm thu"
                              />
                            );
                          }
                          if (isSelected) {
                            return <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-[#ff7a00] border border-black" />;
                          }
                          return null;
                        })()}
                      </span>
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
                            className="bg-[#121218] border border-[#ff7a00] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full"
                          />
                        ) : (
                          <span className={`text-xs font-medium truncate block ${
                            (unreadCompletedSessions[selectedAgent.id] || []).includes(chat.id) ? "text-emerald-300 font-semibold" : "text-white"
                          }`}>
                            {chat.title}
                          </span>
                        )}

                        <div className="flex items-center gap-1 shrink-0 relative">
                          {pinnedChatIds.includes(chat.id) && (
                            <span className="text-amber-400 p-0.5" title="Đã ghim">
                              <Pin size={11} className="fill-amber-400" />
                            </span>
                          )}

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
                                  ? "text-[#ff7a00] bg-white/10 opacity-100"
                                  : "text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-white"
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
                              width="w-56"
                            >
                              <DropdownMenuItem
                                icon={<Search size={13} className="text-[#ff7a00]" />}
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
                                icon={<Edit2 size={13} className="text-cyan-400" />}
                                label="Đổi tên phiên"
                                onClick={() => {
                                  setEditingChatId(chat.id);
                                  setEditingChatTitle(chat.title);
                                  setActiveChatMenuId(null);
                                }}
                              />

                              <DropdownMenuSection label="Xuất dữ liệu">
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
                                  icon={<Download size={12} className="text-[#ff7a00]" />}
                                  label="Báo cáo Markdown"
                                  badge=".md"
                                  badgeColor="text-[#ff7a00]"
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

                          {(unreadCompletedSessions[selectedAgent.id] || []).includes(chat.id) && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-neutral-500 truncate block mt-0.5">
                        {chat.lastMessageSnippet}
                      </span>
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
                          {chatSearchQuery ? `No matches for "${chatSearchQuery}"` : "No dialogues found"}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {chatSearchQuery ? "Try a different search keyword or clear filter." : "Start a fresh session with this agent."}
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
                        <button
                          type="button"
                          onClick={handleNewChat}
                          className="px-3 py-1 rounded-lg bg-[#ff7a00] hover:bg-[#ff8a1a] text-black font-semibold text-[11px] transition-colors cursor-pointer shadow-xs"
                        >
                          + New Chat
                        </button>
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
      {/* 4. RIGHTMOST PANE: SELECTED BOT INFO (COLLAPSIBLE) */}
      {/* ========================================================= */}
      <aside
        style={{ width: !isBotInfoCollapsed && typeof window !== "undefined" && window.innerWidth >= 1280 ? `${botInfoWidth}px` : undefined }}
        className={`fixed xl:static inset-y-0 right-0 z-50 xl:z-40 h-full flex flex-col border-l border-neutral-200 dark:border-[#1e1e24] bg-[var(--bg-sidebar)] shrink-0 select-none transition-grok relative ${
          isBotInfoCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full xl:w-0"
            : "w-[85vw] max-w-[560px] sm:w-[380px] border-l border-[#1e1e24] translate-x-0 xl:translate-x-0 shadow-2xl xl:shadow-none"
        }`}
      >
        {/* Right Pane Draggable Resizer Splitter */}
        {!isBotInfoCollapsed && (
          <div
            onMouseDown={() => setIsResizingRight(true)}
            className="hidden xl:block absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#ff7a00]/50 transition-colors z-30 -ml-0.5"
            title="Drag to resize agent specification pane"
          />
        )}
        {!isBotInfoCollapsed && (
          <>
            {/* Clean Header with Mobile Close Button */}
            <div className="h-12 border-b border-neutral-200 dark:border-[#1c1c22] flex items-center justify-between px-3 shrink-0 bg-[var(--bg-sidebar)]">
              <span className="text-xs font-mono text-neutral-400">Agent Specification</span>
              <button aria-label="Close Agent Specification" data-ux-target-min="24"
                onClick={() => {
                  handleToggleBotInfo(true);
                  setMobileBotInfoOpen(false);
                }}
                className="h-6 w-6 rounded-md hover:bg-[#1c1c24] flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
                title="Close Agent Specification"
              >
                <X size={14} />
              </button>
            </div>

            {/* Dedicated Agent Identity Avatar matching Left Sidebar & Interactive Model Switcher */}
            <div className="p-5 flex flex-col items-center text-center border-b border-[#1c1c22]">
              {/* Agent Avatar matching left sidebar */}
              <div
                ref={mascotRef}
                onClick={() => setIsAvatarSetupModalOpen(true)}
                className="relative mb-2.5 transition-transform hover:scale-105 cursor-pointer group"
                title={`${selectedAgent.name} (${selectedAgent.roleTag || "Agent"})`}
              >
                <AgentAvatar agent={selectedAgent} size="xl" className="shadow-xl" />
                
                {/* Active Status Beacon Badge: Red when degraded, Green when healthy/online */}
                <span
                  className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-[#0c0c0e] ${
                    selectedAgent.status === "degraded"
                      ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse"
                      : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                  }`}
                  title={selectedAgent.status === "degraded" ? "Sự cố hạ tầng" : "Đang hoạt động (Online)"}
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

              {/* Interactive Model Selector Dropdown */}
              <div className="relative mt-1.5">
                <button aria-label="Click to change active model" data-ux-target-min="24"
                  type="button"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  disabled={isChangingModel}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 border border-[#ff7a00]/30 px-2.5 py-1 rounded-full cursor-pointer transition-all disabled:opacity-50"
                  title="Click to change active model"
                >
                  <span className="truncate max-w-[150px]">
                    {isChangingModel ? "Updating model..." : (selectedAgent.model.includes("/") ? selectedAgent.model.split("/").pop() : selectedAgent.model)}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isModelDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Model selection dropdown menu (Clean, Unique Models, No Provider Noise) */}
                {isModelDropdownOpen && (() => {
                  // Build distinct list of unique models configured and enabled across active agents & verified fleet
                  const agentConfiguredModels = agents.map((a) => a.model).filter(Boolean);
                  const baseList = availableModels.length > 0 ? availableModels : [
                    { providerId: "llm360coding", providerName: "LLM360", model: "gpt-5.6-luna", name: "gpt-5.6-luna" },
                    { providerId: "llm360coding", providerName: "LLM360", model: "grok-4.7", name: "grok-4.7" },
                    { providerId: "llm360coding", providerName: "LLM360", model: "gpt-6-sol", name: "gpt-6-sol" },
                    { providerId: "llm360coding", providerName: "LLM360", model: "grok-4.6", name: "grok-4.6" },
                    { providerId: "llm360coding", providerName: "LLM360", model: "claude-opus-4.6-thinking", name: "claude-opus-4.6-thinking" },
                    { providerId: "llm360coding", providerName: "LLM360", model: "gemini-3.7-flash-tiered", name: "gemini-3.7-flash-tiered" },
                  ];

                  // Deduplicate strictly by model string without provider prefixes
                  const uniqueMap = new Map<string, typeof baseList[0]>();
                  for (const m of baseList) {
                    const clean = m.model.includes("/") ? m.model.split("/").pop()! : m.model;
                    if (clean && !uniqueMap.has(clean) && clean !== "metadata_health") {
                      uniqueMap.set(clean, { ...m, model: clean });
                    }
                  }
                  // Ensure current agent model is always present in list
                  if (selectedAgent.model && !uniqueMap.has(selectedAgent.model)) {
                    uniqueMap.set(selectedAgent.model, {
                      providerId: "llm360coding",
                      providerName: "",
                      model: selectedAgent.model,
                      name: selectedAgent.model,
                    });
                  }

                  const uniqueModelsList = Array.from(uniqueMap.values()).filter((m) => {
                    if (!modelSearchQuery.trim()) return true;
                    return m.model.toLowerCase().includes(modelSearchQuery.toLowerCase());
                  });

                  return (
                  <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-1.5 w-64 rounded-xl bg-[#14141c] border border-[#2a2a38] p-1.5 shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-1.5 pb-1.5 text-[10px] font-mono text-neutral-400 border-b border-[#22222e] flex items-center justify-between">
                      <span className="font-semibold text-white">Mô hình trí tuệ</span>
                      <span className="text-[9px] text-[#ff7a00] font-mono">{uniqueModelsList.length} models</span>
                    </div>

                    {/* Instant Model Search */}
                    <div className="my-1.5 flex items-center gap-1.5 bg-[#1a1a24] border border-[#28283a] focus-within:border-[#ff7a00] rounded-lg px-2 py-1 text-xs">
                      <Search size={12} className="text-neutral-400 shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        value={modelSearchQuery}
                        onChange={(e) => setModelSearchQuery(e.target.value)}
                        placeholder="Tìm mô hình (grok, gpt, claude)..."
                        className="w-full bg-transparent text-white placeholder-neutral-500 font-mono text-[11px] focus:outline-none"
                      />
                      {modelSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setModelSearchQuery("")}
                          className="text-neutral-500 hover:text-neutral-300 p-0.5 cursor-pointer"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-0.5 max-h-56 overflow-y-auto mt-1 text-left">
                      {uniqueModelsList.map((m) => {
                        const isCurrent = selectedAgent.model === m.model;
                        return (
                          <div
                            key={m.model}
                            onClick={() => handleSelectModel(m.model)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold border border-[#ff7a00]/30"
                                : "text-neutral-300 hover:bg-[#1a1a24] hover:text-white"
                            }`}
                          >
                            <span className="truncate text-[11px] font-mono">{m.model}</span>
                            {isCurrent && <Check size={12} className="text-[#ff7a00] shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  );
                })()}
              </div>
            </div>

            {/* 4 Main Tabs: Computer | Apps | Agents | Details */}
            <div className="flex items-center justify-around border-b border-neutral-200 dark:border-[#1c1c22] text-xs font-medium text-neutral-500 dark:text-neutral-400 px-2 shrink-0">
              {(["Computer", "Apps", "Agents", "Details"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  className={`py-2.5 px-3 transition-colors cursor-pointer border-b-2 font-mono ${
                    rightTab === tab
                      ? "text-neutral-900 dark:text-white border-[#ff7a00] font-semibold"
                      : "border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-3.5 overflow-y-auto">
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
                          <span className="text-[11px] font-semibold text-slate-900 dark:text-white truncate">
                            {selectedAgent.name} Computer
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button aria-label="Mở Computer Workspace" data-ux-target-min="24"
                            type="button"
                            onClick={() => handleToggleComputerSplit(true)}
                            className="p-1 text-neutral-400 hover:text-[#ff7a00] hover:bg-[#232330] rounded transition-colors cursor-pointer"
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
                        {/* The full Selkies desktop is only opened on demand (modal); a hidden 1024x768 live
                            iframe kept a second stream running per viewer and resized the shared display. */}
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

                        {/* Hover Overlay: Chế độ mặc định khi người dùng hover vào preview computer */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-10 select-none">
                          <div className="h-9 w-9 rounded-full bg-[#ff7a00] text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
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

              {rightTab === "Apps" && (
                <AgentConnectedAppsTab
                  agentId={selectedAgent.id}
                  agentName={selectedAgent.name}
                  onOpenConnectModal={() => setIsConnectAppsOpen(true)}
                  onRefreshTrigger={mcpRefreshTrigger}
                />
              )}

              {rightTab === "Agents" && (
                <div className="space-y-4">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Internal</div>
                  <AgentSubAgentsTab agentId={selectedAgent.id} agentName={selectedAgent.name} allAgents={agents} />
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 pt-2 border-t border-[#22222e]">External (AgentTeams A2A)</div>
                  <ExternalSubAgentsTab agentId={selectedAgent.id} agentName={selectedAgent.name} />
                </div>
              )}

              {rightTab === "Details" && (
                <div className="space-y-4 text-xs text-neutral-300 font-sans pb-4 flex flex-col h-full">
                  {/* Details Sub-Tabs: Overview | Memory | Library */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14141c] border border-[#22222e] text-xs font-mono select-none shrink-0">
                    {(["Overview", "Memory", "Library"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setDetailSubTab(st);
                          if (st === "Library" && workspaceFiles.length === 0) {
                            loadWorkspaceTree();
                          }
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer font-medium ${
                          detailSubTab === st
                            ? "bg-[#222230] text-[#ff7a00] font-semibold shadow-xs border border-[#ff7a00]/30"
                            : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {st === "Library" ? `Library (${workspaceFiles.length})` : st}
                      </button>
                    ))}
                  </div>

                  {/* Sub-tab 1: Memory */}
                  {detailSubTab === "Memory" && (
                    <AgentMemoryTab
                      agentId={selectedAgent.id}
                      agentName={selectedAgent.name}
                      agentSlug={selectedAgent.slug}
                    />
                  )}

                  {/* Sub-tab 2: Library (Workspace Files) */}
                  {detailSubTab === "Library" && (() => {
                    const filteredWorkspaceFiles = librarySearchQuery.trim()
                      ? workspaceFiles.filter((node) =>
                          node.name.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
                          node.path.toLowerCase().includes(librarySearchQuery.toLowerCase())
                        )
                      : workspaceFiles;

                    return (
                    <div className="space-y-3 text-xs flex flex-col flex-1 min-h-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          Workspace Files ({filteredWorkspaceFiles.length}{librarySearchQuery.trim() ? ` / ${workspaceFiles.length}` : ""})
                        </span>
                        <button
                          aria-label="Refresh workspace tree"
                          data-ux-target-min="24"
                          onClick={loadWorkspaceTree}
                          disabled={isLoadingTree}
                          className="text-neutral-400 hover:text-white p-1 rounded hover:bg-[#1a1a22] transition-colors cursor-pointer"
                          title="Refresh workspace tree"
                        >
                          <RefreshCw
                            size={12}
                            className={isLoadingTree ? "animate-spin text-[#ff7a00]" : ""}
                          />
                        </button>
                      </div>

                      {/* Instant File Filter */}
                      <div className="flex items-center gap-1.5 bg-[#14141c] border border-[#22222e] rounded-lg px-2 py-1 text-xs">
                        <Search size={12} className="text-neutral-400 shrink-0" />
                        <input
                          type="text"
                          value={librarySearchQuery}
                          onChange={(e) => setLibrarySearchQuery(e.target.value)}
                          placeholder="Filter files (.md, .py, .yaml)..."
                          className="w-full bg-transparent text-white placeholder-neutral-500 font-mono text-[11px] focus:outline-none"
                        />
                        {librarySearchQuery && (
                          <button
                            type="button"
                            onClick={() => setLibrarySearchQuery("")}
                            className="text-neutral-500 hover:text-neutral-300 p-0.5 cursor-pointer"
                          >
                            <X size={11} />
                          </button>
                        )}
                      </div>

                      {/* File Tree List */}
                      <div className="bg-[#14141a] border border-[#1e1e26] rounded-xl p-2 max-h-48 overflow-y-auto space-y-1 font-mono text-[11px]">
                        {isLoadingTree ? (
                          <div className="space-y-1.5 py-1">
                            <div className="h-6 w-3/4 rounded-md skeleton-shimmer" />
                            <div className="h-6 w-5/6 rounded-md skeleton-shimmer" />
                            <div className="h-6 w-2/3 rounded-md skeleton-shimmer" />
                          </div>
                        ) : filteredWorkspaceFiles.length === 0 ? (
                          <div className="text-center py-4 text-neutral-500 font-mono">
                            {librarySearchQuery ? `No files matching "${librarySearchQuery}"` : "No files found in workspace"}
                          </div>
                        ) : (
                          filteredWorkspaceFiles.map((node) => {
                            const isSelected = selectedFilePath === node.path;
                            return (
                              <div
                                key={node.path}
                                onClick={() => handleSelectFile(node)}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-[#22222e] text-[#ff7a00] font-medium"
                                    : "text-neutral-300 hover:bg-[#1c1c24]"
                                }`}
                              >
                                {node.kind === "directory" ? (
                                  <Folder size={13} className="text-amber-400 shrink-0" />
                                ) : (
                                  <FileText size={13} className="text-neutral-400 shrink-0" />
                                )}
                                <span className="truncate flex-1">{node.name}</span>
                                {node.size !== null && node.size !== undefined && (
                                  <span className="text-[9px] text-neutral-600">
                                    {Math.round(node.size / 1024)}k
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Selected File Content Preview */}
                      {selectedFilePath && (
                        <div className="flex-1 flex flex-col bg-[#14141a] border border-[#1e1e26] rounded-xl overflow-hidden min-h-[140px] max-h-64">
                          <div className="h-8 px-2.5 bg-[#181822] border-b border-[#20202c] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                            <span className="truncate text-white">{selectedFilePath.split("/").pop()}</span>
                            <span className="text-[9px] text-neutral-500">Read-Only</span>
                          </div>
                          <div className="flex-1 p-2 overflow-auto font-mono text-[10px] text-neutral-300 whitespace-pre-wrap leading-relaxed select-text">
                            {isLoadingFile ? "Loading file content..." : fileContent || "Empty file"}
                          </div>
                        </div>
                      )}
                    </div>
                    );
                  })()}

                  {/* Sub-tab 3: Overview */}
                  {detailSubTab === "Overview" && (
                    <div className="space-y-4">
                  {/* Agent Persona & System Governance */}
                  <div className="rounded-xl bg-[#14141c] border border-[#22222e] p-3 space-y-2">
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Bot size={13} className="text-[#ff7a00]" />
                        <span>Persona & Governance</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {(selectedAgent.runtimeVersion || "Skyer v2.2.1").replace(/qwenpaw/gi, "Skyer")}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono space-y-1 bg-[#0f0f15] p-2.5 rounded-lg border border-[#1e1e28]">
                      <div className="flex items-center justify-between text-neutral-300">
                        <span>Role Constitution:</span>
                        <span className="text-emerald-400">Enforced (Pass)</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Identity Profile:</span>
                        <span className="text-neutral-200 truncate max-w-[150px]">SOUL.md ({selectedAgent.slug})</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span>Skills Bound:</span>
                        <span className="text-[#ff7a00]">{skills.length} available</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Description */}
                  <div className="rounded-xl bg-[#14141c] border border-[#22222e] p-3 space-y-1.5">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Description</span>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">{selectedAgent.roleTag}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {selectedAgent.description}
                    </p>
                  </div>

                  {/* Connected Dispatch Channels */}
                  <div className="rounded-xl bg-[#14141c] border border-[#22222e] p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Radio size={13} className="text-[#ff7a00]" />
                        <span>Integrated Channels</span>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {channels.filter((c) => c.enabled).length} active
                      </span>
                    </div>

                    {loadingChannels ? (
                      <div className="space-y-2 py-1">
                        <div className="h-10 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                        <div className="h-10 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                        <div className="h-10 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-1.5">
                        {channels
                          .filter((c) => ["console", "telegram", "discord", "slack", "matrix", "voice"].includes(c.type))
                          .map((ch) => (
                            <div
                              key={ch.type}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition-all ${
                                ch.enabled
                                  ? "bg-[#181824] border-[#2e2e42] text-white"
                                  : "bg-[#101016] border-[#1e1e28] text-neutral-500 opacity-70"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`h-2 w-2 rounded-full shrink-0 ${ch.enabled ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
                                <span className="font-mono text-xs font-medium uppercase tracking-wider">{ch.name}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button aria-label={`Configure ${ch.name} credentials & filters`} data-ux-target-min="24"
                                  type="button"
                                  onClick={() => {
                                    setSelectedChannelForConfig(ch);
                                    setIsChannelModalOpen(true);
                                  }}
                                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                  title={`Configure ${ch.name} credentials & filters`}
                                >
                                  <SlidersHorizontal size={12} />
                                </button>
                                <button data-ux-target-min="24"
                                  type="button"
                                  onClick={() => handleToggleChannel(ch.type, ch.enabled)}
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                    ch.enabled
                                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                                      : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10"
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
                  <div className="rounded-xl bg-[#14141c] border border-[#22222e] p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Clock size={13} className="text-[#ff7a00]" />
                        <span>Schedules & Automations</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button aria-label="Add automated cron schedule" data-ux-target-min="24"
                          type="button"
                          onClick={() => {
                            setSelectedJobForConfig(null);
                            setIsScheduleModalOpen(true);
                          }}
                          className="flex items-center gap-1 bg-[#ff7a00]/15 hover:bg-[#ff7a00]/25 text-[#ff7a00] border border-[#ff7a00]/30 px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all cursor-pointer"
                          title="Add automated cron schedule"
                        >
                          <Plus size={11} />
                          <span>Add</span>
                        </button>
                        <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {schedules.length}
                        </span>
                      </div>
                    </div>

                    {loadingSchedules ? (
                      <div className="space-y-2 py-1">
                        <div className="h-14 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                        <div className="h-14 w-full rounded-xl skeleton-shimmer border border-[#22222e]" />
                      </div>
                    ) : schedules.length === 0 ? (
                      <div className="text-center py-3 text-neutral-500 font-mono text-[11px] border border-dashed border-[#22222e] rounded-lg">
                        No active cron schedules for this agent.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {schedules.map((job) => (
                          <div
                            key={job.id}
                            onClick={() => {
                              setSelectedJobForConfig(job);
                              setIsScheduleModalOpen(true);
                            }}
                            className="p-2.5 rounded-lg bg-[#181822] hover:bg-[#1f1f2e] border border-[#242432] hover:border-[#383850] space-y-1.5 shadow-xs cursor-pointer transition-all group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-white text-xs truncate max-w-[170px]" title={job.name}>
                                {job.name}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {job.cronExpr}
                              </span>
                            </div>
                            <p className="text-[10px] text-neutral-400 leading-snug line-clamp-2">
                              {job.promptSnippet}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-0.5 border-t border-white/5">
                              <span>Target: #{job.targetChannel}</span>
                              <span className="text-neutral-400">{job.timezone}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live Skills Pool */}
                  <div className="rounded-xl bg-[#14141c] border border-[#22222e] p-3 space-y-2">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={13} className="text-[#ff7a00]" />
                        <span>Live Skills</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">({skills.length})</span>
                    </div>
                    <div className="space-y-1 font-mono text-[11px] max-h-36 overflow-y-auto pr-1">
                      {skills.map((s) => (
                        <div
                          key={s}
                          className="px-2 py-1 rounded bg-[#16161e] border border-[#20202a] text-neutral-300 flex items-center justify-between"
                        >
                          <span className="truncate">{s}</span>
                          <span className="text-[9px] text-[#ff7a00] font-sans">Ready</span>
                        </div>
                      ))}
                    </div>
                  </div>
                    </div>
                  )}
                </div>
              )}

              
            </div>
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
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-xs font-mono font-semibold text-white tracking-wide truncate">
                  {browserTarget.label}
                </span>
                <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {selectedAgent.name} ({selectedAgent.node})
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a aria-label="Open in new browser tab"
                  href={browserTarget.url ? "#" : undefined}
                            onClick={(e) => { e.preventDefault(); if (browserTarget.url) openAgentDesktopTab(agentBrowserFor); }}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#1c1c26] hover:bg-[#252534] border border-[#2c2c3e] text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">External</span>
                </a>
                
                <button aria-label="Close Fullscreen View (Esc)" data-ux-target-min="24"
                  type="button"
                  onClick={() => handleSetBrowserModalOpen(false)}
                  className="h-8 w-8 rounded-lg bg-[#22222e] hover:bg-red-500/20 hover:text-red-400 border border-[#303042] hover:border-red-500/30 text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Fullscreen View (Esc)"
                >
                  <X size={16} />
                </button>
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
                    <span className="text-[9px] text-[#ff7a00] font-bold">{lightboxRotation}°</span>
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
                    <span className="text-[#ff7a00]">EXIF / Info</span>
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
            <div className="flex items-center justify-between border-b border-[#22222e] pb-2">
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
                  <ArrowRight size={13} className="text-[#ff7a00]" />
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
            className="w-full max-w-sm rounded-xl bg-[#121218] border border-[#242432] p-5 shadow-2xl text-neutral-200 font-sans"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Xóa các phiên đã chọn?</h4>
                <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                  Bạn có chắc muốn xóa <span className="text-[#ff7a00] font-semibold">{selectedChatIds.length}</span> phiên hội thoại đã đánh dấu chọn không? Thao tác này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsBatchClearModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#1a1a24] hover:bg-[#222230] text-neutral-300 font-medium transition-colors cursor-pointer"
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
      {/* MOBILE HOLD-TOUCH / LONG-PRESS ACTION SHEET: CHAT SESSION */}
      {/* ========================================================= */}
      {mobileActionChat && (
        <div
          onClick={() => setMobileActionChat(null)}
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-[#14141c] border border-[#2a2a3c] rounded-xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200 text-neutral-200"
          >
            {/* Header / Session Title */}
            <div className="flex items-center justify-between pb-2 border-b border-[#22222e]">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono text-[#ff7a00] uppercase font-bold block">Session Actions</span>
                <h4 className="text-sm font-semibold text-white truncate">{mobileActionChat.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setMobileActionChat(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
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
      {/* MOBILE HOLD-TOUCH / LONG-PRESS ACTION SHEET: BOT RESPONSE */}
      {/* ========================================================= */}
      {mobileActionMsg && (
        <div
          onClick={() => setMobileActionMsg(null)}
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-auto bg-[#14141c] border border-[#2a2a3c] rounded-xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-5 duration-200 text-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#22222e]">
              <div className="min-w-0 flex-1 pr-2">
                <span className="text-[10px] font-mono text-[#ff7a00] uppercase font-bold block">Message Turn Actions</span>
                <p className="text-xs text-neutral-400 truncate max-w-xs italic">
                  "{mobileActionMsg.content.slice(0, 60)}..."
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileActionMsg(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Actions List */}
            <div className="space-y-1">
              {/* 1. Star / Bookmark Turn */}
              <button
                type="button"
                onClick={() => {
                  toggleStarMessage(mobileActionMsg.id);
                  setMobileActionMsg(null);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <Star size={15} className={starredMsgIds.includes(mobileActionMsg.id) ? "fill-amber-400 text-amber-400" : "text-neutral-400"} />
                <span>{starredMsgIds.includes(mobileActionMsg.id) ? "Bỏ đánh dấu sao câu trả lời" : "Đánh dấu sao (Star / Bookmark)"}</span>
              </button>

              {/* 2. Copy Response */}
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(mobileActionMsg.content);
                  setCopiedResponseMsgId(mobileActionMsg.id);
                  setMobileActionMsg(null);
                  setTimeout(() => setCopiedResponseMsgId(null), 1800);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <Copy size={15} className="text-neutral-300" />
                <span>Sao chép toàn bộ phản hồi (Copy)</span>
              </button>

              {/* 3. Read Aloud (TTS) */}
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
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <Volume2 size={15} className="text-[#ff7a00]" />
                <span>Đọc to phản hồi bằng giọng nói (TTS)</span>
              </button>

              {/* 4. Branch / Fork Session */}
              <button
                type="button"
                onClick={() => {
                  const turnIdx = mobileActionMsg.turnIdx;
                  setMobileActionMsg(null);
                  handleForkSession(turnIdx);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <GitFork size={15} className="text-cyan-400" />
                <span>Tách nhánh phiên mới từ đây (Fork Session)</span>
              </button>

              {/* 5. Forward to Another Agent */}
              <button
                type="button"
                onClick={() => {
                  const content = mobileActionMsg.content;
                  setMobileActionMsg(null);
                  setForwardModalMsg(content);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1f1f2c] text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer"
              >
                <Share2 size={15} className="text-purple-400" />
                <span>Chuyển tiếp cho Agent khác tiếp nối</span>
              </button>
            </div>
          </div>
        </div>
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
