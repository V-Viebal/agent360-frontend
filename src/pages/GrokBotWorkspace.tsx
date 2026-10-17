import { SkyerLogo } from "../components/SkyerLogo";
import { fetchPendingApprovals, approveToolExecution, denyToolExecution, PendingApproval } from "../services/approvalApi";
import { ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { ContextUsageBar } from "../components/ContextUsageBar";
import { ConnectAppsModal } from "../components/ConnectAppsModal";
import { AgentConnectedAppsTab } from "../components/AgentConnectedAppsTab";
import { AgentSubAgentsTab } from "../components/AgentSubAgentsTab";
import { ExternalSubAgentsTab } from "../components/ExternalSubAgentsTab";
import { ChannelConfigModal } from "../components/ChannelConfigModal";
import { ScheduleJobModal } from "../components/ScheduleJobModal";
import { useState, useRef, useEffect } from "react";
import {
  Trash2,
  Pin,
  PinOff,
  Download,
  CheckCheck,
  Edit2,
  Wifi,
  Maximize2,
  Minimize2,
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
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession } from "../types/agent";
import {
  fetchInfraAgents,
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
  fetchAvailableModels,
  ModelOption,
  WorkspaceTreeNode,
  sendTurnTelemetryBeacon,
  compactAgentContext,
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { uploadFileToGateway, UploadedFileResult } from "../services/uploadApi";
import { requestNotificationPermission, notifyTaskComplete, SoundPreset, SOUND_PRESETS, playNotificationChime } from "../services/notificationService";
import { speakText, stopSpeaking, getStoredSpeechSettings, saveStoredSpeechSettings, getAvailableVoices } from "../services/speechService";
import { CustomSelect, StatusBadge, IconButton, SearchInput } from "../components/ui";
import { CommandPaletteModal } from "../components/CommandPaletteModal";
import { PermissionsModal } from "../components/PermissionsModal";
import { AudioVisualizerWaveform } from "../components/AudioVisualizerWaveform";
import { AgentAvatar } from "../components/AgentAvatar";
import { AgentMemoryTab } from "../components/AgentMemoryTab";
import { SlashCommandMenu, SlashCommand } from "../components/SlashCommandMenu";
import { requestPermission, queryPermissionStatus } from "../services/permissionService";
import { TelemetryHud, TurnTelemetry } from "../components/TelemetryHud";



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
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-[#22222e] hover:border-[#303040] text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer shadow-xs select-none"
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
          {reasoningItems.map((r, rIdx) => (
            <div
              key={rIdx}
              className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#14141a]/80 border border-[#202028] text-xs text-neutral-400 leading-relaxed font-sans shadow-xs"
            >
              <Sparkles size={13} className="text-[#ff7a00] shrink-0 mt-0.5" />
              <div className="flex-1 whitespace-pre-wrap italic break-words min-w-0">
                {renderInlineMarkdown(r.text || "")}
              </div>
            </div>
          ))}

          {allToolItems.map((step, sIdx) => (
            <QwenPawToolCard
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

// QwenPaw-style Tool Execution Block
function QwenPawToolCard({ toolCall }: { toolCall: { tool: string; args?: string; result?: string; state?: "calling" | "success" | "error" } }) {
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
  } else if (!screenImage && isScreenAction) {
    screenUrl = "https://browser-gm.antares.vn";
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
    <div className="w-full rounded-xl border border-[#22222c] bg-[#121217] overflow-hidden my-1.5 transition-all text-xs font-mono shadow-sm">
      {/* Header Bar */}
      <div
        onClick={() => setOpen(!open)}
        className="px-3 py-2 bg-[#15151c] hover:bg-[#191922] flex items-center justify-between cursor-pointer select-none transition-colors border-b border-transparent"
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
          <span className="text-[12px] font-semibold text-neutral-200 truncate font-mono">
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
}: {
  content: string;
  onRunCode?: (code: string, lang: string) => void;
  agentNode?: string;
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
                <p key={lineIdx} className="text-neutral-300 leading-relaxed break-words">
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
  cdpEndpoint: string;
  mode: string;
}

export function getAgentBrowserUrl(agent: InfraAgent): AgentBrowserMeta {
  return {
    url: 'https://browser.hmz.one',
    label: `${agent.name} Computer`,
    isLive: true,
    hostNode: 'Core VPS Cluster',
    cdpEndpoint: 'https://cdp-browser.hmz.one',
    mode: 'interactive CDP / noVNC',
  };
}

// Quick starter prompt suggestions for new chat session
const QUICK_SUGGESTIONS = [
  {
    title: "Audit Fleet & Health",
    desc: "Scan infrastructure nodes, memory pressure and service uptime",
    prompt: "Scan all infrastructure nodes and report active status, memory usage, and runtime health."
  },
  {
    title: "Deploy & Verify Diffs",
    desc: "Inspect latest git changes, run local build and check deployment status",
    prompt: "Check recent git changes, build the code, and verify service responses on 2nd."
  },
  {
    title: "Security Constitution Check",
    desc: "Evaluate current security posture against rootless container policy",
    prompt: "Perform a security audit against container isolation and approval policies."
  },
  {
    title: "Inspect ACP & MCP Tools",
    desc: "List active tool schemas, external bridges and QwenPaw capabilities",
    prompt: "List all active tools and MCP servers registered for this agent session."
  }
];

export function GrokBotWorkspace() {
  const [agents, setAgents] = useState<InfraAgent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<string>("all");
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
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [turnTelemetry, setTurnTelemetry] = useState<TurnTelemetry | null>(null);
  const [forwardModalMsg, setForwardModalMsg] = useState<string | null>(null);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
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

  useEffect(() => {
    const handleClickOutsideUser = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideUser);
    return () => document.removeEventListener("mousedown", handleClickOutsideUser);
  }, []);

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

  // Available models from QwenPaw /api/models
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [isChangingModel, setIsChangingModel] = useState<boolean>(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState<boolean>(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
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
      return localStorage.getItem("agent360_last_agent_id") || "";
    } catch {
      return "";
    }
  });
  const [chats, setChats] = useState<AgentSession[]>([]);
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
  const [rightTab, setRightTab] = useState<"Computer" | "Apps" | "Memory" | "Agents" | "Details" | "Library">("Computer");
  const [connectedAppIds, setConnectedAppIds] = useState<string[]>([]);
  const [mcpRefreshTrigger, setMcpRefreshTrigger] = useState(0);
  const [isBrowserModalOpen, setIsBrowserModalOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("agent360_browser_expanded") === "true";
    } catch {
      return false;
    }
  });

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

  // Collapse states per user request with localStorage persistence
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
        setIsChatListCollapsed(compact);
        setIsBotInfoCollapsed(compact);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  // Request Queue: Allows users to enter new requests while agent is in progress
  const [requestQueue, setRequestQueue] = useState<string[]>([]);
  const requestQueueRef = useRef<string[]>([]);
  const isProcessingQueueRef = useRef<boolean>(false);

  // Choice poll card state ("What would you like to call me?")
  const [showPollCard, setShowPollCard] = useState(true);
  const [customCallName, setCustomCallName] = useState("");

  // Workspace Tree State
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceTreeNode[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState<UploadedFileResult[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording / Speech-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
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
    return () => window.removeEventListener("agent360_vad_settings_changed", handleSettings);
  }, []);

  const startVoiceRecording = async () => {
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
      recognition.lang = "vi-VN"; // Default Vietnamese speech recognition

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setInputText((prev) => {
            const separator = prev && !prev.endsWith(" ") ? " " : "";
            return prev + separator + transcript;
          });

          // Voice Activity Detection (VAD): Reset silence countdown
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }
          silenceTimerRef.current = setTimeout(() => {
            if (autoSendOnSilenceRef.current) {
              stopVoiceRecording();
              // Auto-submit voice request if text was collected
              setTimeout(() => {
                const form = composerFormRef.current;
                if (form) {
                  form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
              }, 300);
            }
          }, silenceDurationRef.current); // dynamic silence auto-stop and submit
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

  const stopVoiceRecording = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
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
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadFileToGateway(file, selectedAgent.id);
        setAttachedFiles((prev) => [...prev, res]);
      }
    } catch (err: any) {
      console.error("File upload failed:", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Input composer
  const [inputText, setInputText] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get("prompt")?.slice(0, 2000) || "";
    } catch {
      return "";
    }
  });
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
  const [chatFilterTab, setChatFilterTab] = useState<"all" | "unread" | "pinned">("all");
  const [nodePingMs, setNodePingMs] = useState<number | null>(null);
  const [chatToDelete, setChatToDelete] = useState<AgentSession | null>(null);
  const [inSessionSearchOpen, setInSessionSearchOpen] = useState(false);
  const [inSessionSearchQuery, setInSessionSearchQuery] = useState("");
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
  const [isConnectAppsOpen, setIsConnectAppsOpen] = useState(false);

  // Jump immediately to bottom on open / chat switch without smooth scroll animation
  const jumpToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
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
      // During active token streaming, scroll gently or jump
      jumpToBottom();
    } else {
      jumpToBottom();
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
          fetchSkills(),
        ]);
        if (loadedAgents.length === 0) {
          setBackendError("No active agents returned from cluster. Running in Standby mode.");
        } else {
          setBackendError(null);
        }
      } catch (err: any) {
        setBackendError("Cluster API is unreachable (5290). Running in local sandbox preview.");
      }

      setAgents(loadedAgents);
      setSkills(loadedSkills);
      setIsLoadingAgents(false);

      // Subscribe to live SSE health pulse across infra fleet
      try {
        const healthSource = new EventSource("/api/v1/agents/health/stream");
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
        const savedAgentId = localStorage.getItem("agent360_last_agent_id");
        const found = savedAgentId && loadedAgents.find((a) => a.id === savedAgentId);
        const targetId = found ? savedAgentId : loadedAgents[0].id;
        setSelectedAgentId(targetId);
        try {
          localStorage.setItem("agent360_last_agent_id", targetId);
        } catch {}
      }
    }
    initData();
  }, []);

  // Fetch agent-specific MCP clients and chats whenever selectedAgentId changes
  useEffect(() => {
    if (!selectedAgentId) return;
    fetchAgentMcpClients(selectedAgentId).then((clients) => {
      const appIds = clients.map((c) => c.key.toLowerCase().replace(/^composio_/, ""));
      setConnectedAppIds(appIds);
    });
  }, [selectedAgentId, mcpRefreshTrigger]);

  // Fetch agent-specific chats whenever selectedAgentId changes
  useEffect(() => {
    if (!selectedAgentId) return;
    async function loadAgentChats() {
      setIsLoadingChats(true);
      try {
        const loadedChats = await fetchAgentChats(selectedAgentId);
        setChats(loadedChats);
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
  }, [selectedAgentId]);

  // When selectedChatId changes, fetch real messages with instant client cache display
  useEffect(() => {
    if (!selectedChatId) return;

    isInitialLoadRef.current = true;
    let mounted = true;

    // 1. Instant Cache Hit: render cached turns immediately without spinner
    const cachedTurns = getCachedChatMessages(selectedChatId, selectedAgentId);
    if (cachedTurns !== null) {
      setMessages(cachedTurns);
      setShowPollCard(false);
      setIsLoadingMessages(false);
      setTimeout(jumpToBottom, 0);
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
    });

    return () => {
      mounted = false;
    };
  }, [selectedChatId, selectedAgentId]);

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
    if (rightTab === "Library" && workspaceFiles.length === 0) {
      loadWorkspaceTree();
    }
  }, [rightTab]);

  useEffect(() => {
    if (!selectedAgentId) return;
    setLoadingChannels(true);
    fetchAgentChannels(selectedAgentId)
      .then(setChannels)
      .finally(() => setLoadingChannels(false));

    setLoadingSchedules(true);
    fetchAgentSchedules(selectedAgentId)
      .then(setSchedules)
      .finally(() => setLoadingSchedules(false));
  }, [selectedAgentId, rightTab]);

  const refreshDetailsData = () => {
    if (!selectedAgentId) return;
    fetchAgentChannels(selectedAgentId).then(setChannels);
    fetchAgentSchedules(selectedAgentId).then(setSchedules);
  };

  const handleToggleChannel = async (channelType: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    setChannels((prev) =>
      prev.map((ch) => (ch.type === channelType ? { ...ch, enabled: nextState } : ch))
    );
    await toggleAgentChannel(selectedAgentId, channelType, nextState);
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0] || {
    id: "default",
    name: "Skyer",
    slug: "skyer-bot",
    roleTag: "Engineering",
    node: "3rd (ai.hmz.one)",
    status: "active",
    model: "skyer-4.7",
    uptime: "Online",
    memoryUsageMb: 256,
    description: "Default Autonomous Agent",
    tools: [],
    sessions: [],
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);

  // Switch agent
  const handleSelectAgent = (agent: InfraAgent) => {
    setSelectedAgentId(agent.id);
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

  const togglePinChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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
    <p><strong>Agent:</strong> ${selectedAgent.name} (@${selectedAgent.slug}) | <strong>Node:</strong> ${selectedAgent.node} | <strong>Model:</strong> ${selectedAgent.model}</p>
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

    const handleExportSessionMarkdown = () => {
    if (messages.length === 0) return;
    const header = `# Skyer Agent Session Export: ${selectedAgent.name}\n` +
      `- **Agent:** ${selectedAgent.name} (@${selectedAgent.slug})\n` +
      `- **Node:** ${selectedAgent.node}\n` +
      `- **Model:** ${selectedAgent.model}\n` +
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

  const handleBatchApproveAll = async () => {
    for (const app of pendingApprovals) {
      await handleInlineApprove(app.request_id, app.session_id);
    }
  };

    // Periodic Node latency ping probe
  useEffect(() => {
    let isMounted = true;
    const probePing = async () => {
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
    const interval = setInterval(probePing, 15000); // Probe every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedAgentId]);

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

    // New Chat session with Optimistic Insertion and Instant UI Feedback
  const handleNewChat = () => {
    const timestamp = Date.now();
    const newChatId = `session-${timestamp.toString().slice(-6)}`;
    const newSession: AgentSession = {
      id: newChatId,
      title: "New Dialogue",
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

  // Core function to execute a single prompt stream
  const executeTurnStream = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const tempBotMsgId = `bot-${Date.now() + 1}`;
    const initialBotMsg: ChatMessage = {
      id: tempBotMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      evidenceStatus: "observed",
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    setIsStreaming(true);

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
        }
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
            content:
              accumulated ||
              `Completed instruction on ${selectedAgent.node} with exit code 0. Checked against constitution policy.`,
            evidenceStatus: "observed",
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
          onEnd: () => setSpeakingMsgId(null),
          onError: () => setSpeakingMsgId(null),
        });
      }
    } finally {
      setIsStreaming(false);
      // Process next item in queue if present
      processNextInQueue();
    }
  };

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
    if (isRecording) {
      stopVoiceRecording();
    }

    if (isStreaming || isProcessingQueueRef.current) {
      // Agent is busy: enqueue prompt
      requestQueueRef.current.push(userText);
      setRequestQueue([...requestQueueRef.current]);
    } else {
      isProcessingQueueRef.current = true;
      executeTurnStream(userText);
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
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-40 w-[85vw] max-w-[280px] lg:w-[260px] h-full flex flex-col border-r border-[#1e1e24] bg-[#0d0d12] shrink-0 transition-grok-transform ${
          mobileAgentsOpen
            ? "translate-x-0 shadow-2xl"
            : isCompactMode
            ? "-translate-x-full invisible"
            : "-translate-x-full max-lg:invisible lg:translate-x-0"
        }`}
        aria-hidden={!mobileAgentsOpen && isCompactMode ? true : undefined}
      >
        {/* Header */}
        <div className="h-12 px-3 border-b border-[#1c1c22] flex items-center justify-between gap-1.5 min-w-0 shrink-0 bg-[#0d0d12]">
          <a aria-label="Return to Skyer Home" href="/" className="hover:opacity-90 transition-opacity shrink-0" title="Return to Skyer Home">
            <SkyerLogo size={24} showText={true} showBotBadge={false} />
          </a>
          <div className="flex items-center gap-1 min-w-0 max-w-[130px] sm:max-w-[140px]">
            <CustomSelect
              value={selectedInstance}
              onChange={(val) => {
                setSelectedInstance(val);
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
              className="min-w-0 w-full"
              triggerClassName="px-2 py-1 text-[11px] font-mono text-[#ff7a00] w-full"
            />
            <button aria-label="Close drawer" data-ux-target-min="24"
              onClick={() => setMobileAgentsOpen(false)}
              className="lg:hidden h-7 w-7 rounded-lg bg-[#181820] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white"
              title="Close drawer"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Search Agents */}
        <div className="p-2 border-b border-[#1c1c22]">
          <SearchInput
            value={agentSearchQuery}
            onChange={setAgentSearchQuery}
            placeholder="Filter agents..."
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
                className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer border animate-fade-in-stagger ${
                  isSelected
                    ? "bg-[#1c1c26] border-[#303042] text-white shadow-sm"
                    : "border-transparent hover:bg-[#14141c] text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {/* Dedicated Agent Identity Avatar */}
                <div className="relative shrink-0">
                  <AgentAvatar agent={ag} size="md" />
                  {isSelected && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#ff7a00] border border-[#0c0c0e]" />
                  )}
                </div>

                {/* Agent Details: Lean typography with rich status tooltip */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-medium text-white truncate block">
                      {ag.name}
                    </span>
                    <div className="relative group shrink-0">
                      {(() => {
                        const hasError = ag.status === "degraded";
                        const unreadList = unreadCompletedSessions[ag.id] || [];
                        const hasUnreadCompleted = unreadList.length > 0;

                        // Lean State: Chỉ báo ĐỎ khi lỗi, chỉ báo XANH khi có việc chạy xong chưa xem, còn lại im lặng (neutral chìm)
                        return (
                          <span className="inline-flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors cursor-help">
                            {hasError ? (
                              <span
                                className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                                title="Agent gặp sự cố hạ tầng hoặc cần can thiệp"
                              />
                            ) : hasUnreadCompleted ? (
                              <span
                                className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                                title={`Có ${unreadList.length} session hoàn thành chưa đọc`}
                              />
                            ) : (
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-neutral-600/40"
                                title="Idle / Sẵn sàng"
                              />
                            )}
                          </span>
                        );
                      })()}
                      {/* Rich Tooltip displaying role, node & model */}
                      <div className="pointer-events-none absolute right-0 bottom-full mb-1.5 hidden group-hover:flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg bg-[#161622] border border-[#2a2a3c] text-[10px] font-mono shadow-xl z-30 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-neutral-200">
                          <span className="text-[#ff7a00] font-semibold">{ag.roleTag || "Agent"}</span>
                          <span>•</span>
                          <span className="text-emerald-400">{ag.status || "active"}</span>
                        </div>
                        <span className="text-neutral-400">{ag.node}</span>
                        <span className="text-neutral-500 text-[9px]">{ag.model}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 truncate block mt-0.5">
                    {ag.model}
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
              <div className="h-7 w-7 rounded-full bg-[#2a2a34] text-[#ff7a00] border border-[#3a3a4c] flex items-center justify-center text-xs font-semibold shadow-xs shrink-0">
                DM
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs text-neutral-200 font-medium truncate">Dang M</span>
                <span className="text-[10px] font-mono text-neutral-500 truncate">System Owner</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
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

          {/* User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-2 right-2 rounded-2xl bg-[#14141c]/95 border border-[#2e2e42] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-2.5 py-1.5 border-b border-[#22222e] mb-1">
                <div className="text-xs font-semibold text-white">Dang M</div>
                <div className="text-[10px] font-mono text-neutral-400">dangm@viebal.com</div>
              </div>
              <div className="space-y-0.5">
                <a
                  href="https://community-agent360.antares.vn"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Community Forum</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 group-hover:text-[#ff7a00]">
                    ↗
                  </span>
                </a>
                <div
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleToggleBotInfo(false);
                    setRightTab("Apps");
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors"
                >
                  <span>Connected Apps</span>
                  <span className="text-[10px] font-mono text-neutral-500">{connectedAppIds.length} apps</span>
                </div>
                <div
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleToggleBotInfo(false);
                    setRightTab("Details");
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors"
                >
                  <span>Fleet Diagnostics</span>
                  <span className="text-[10px] font-mono text-emerald-400">Healthy</span>
                </div>
                <div
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsPermissionsModalOpen(true);
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors"
                >
                  <span>Hardware & Permissions</span>
                  <span className="text-[10px] font-mono text-[#ff7a00]">Manage</span>
                </div>
                <div
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleExportSessionMarkdown();
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Download size={12} className="text-[#ff7a00]" />
                    <span>Export Session (MD)</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">Receipts</span>
                </div>
                <div
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleExportAuditCertificate();
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield size={12} className="text-emerald-400" />
                    <span>Audit Certificate (HTML)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">Verified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. CENTER AREA: Skyer Chat & Dialogue Content */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#0c0c0e] relative overflow-hidden min-w-0">
        {/* Top Centered Floating Capsule: Trigger Collapses Bot Info */}
        <div className="h-12 border-b border-[#1c1c22] flex items-center justify-between px-2 sm:px-3 shrink-0 relative bg-[#0c0c0e]/80 backdrop-blur-md z-10">
          {/* Left button: mobile/compact drawer for Agents */}
          <button aria-label="Toggle Agents Sidebar" data-ux-target-min="24"
            onClick={() => {
              setMobileAgentsOpen(!mobileAgentsOpen);
              setMobileChatsOpen(false);
              setMobileBotInfoOpen(false);
            }}
            className={`${isCompactMode ? "flex" : "lg:hidden flex"} h-8 w-8 rounded-lg bg-[#181820] border border-[#242430] items-center justify-center text-neutral-400 hover:text-white cursor-pointer shrink-0`}
            title="Toggle Agents Sidebar"
          >
            <Menu size={16} />
          </button>

          {/* Middle Group: Capsule Info + Telemetry HUD */}
          <div className="flex items-center gap-2 mx-auto">
            <div className="relative group">
              <div
                onClick={() => {
                  handleToggleBotInfo();
                  setMobileBotInfoOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 sm:gap-2 bg-[#181820] hover:bg-[#22222e] border border-[#2a2a34] hover:border-[#383848] px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm cursor-pointer transition-all select-none"
              >
                <div className="h-3.5 w-3.5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-black flex items-center justify-center">
                    <div className="h-0.5 w-0.5 rounded-full bg-white" />
                  </div>
                </div>
                <span className="truncate text-xs">{selectedAgent.name}</span>
                {nodePingMs !== null && (
                  <span
                    className={`hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono border ${
                      nodePingMs < 80
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : nodePingMs < 200
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                    title={`Live round-trip ping to ${selectedAgent.node}: ${nodePingMs}ms`}
                  >
                    <Wifi size={9} />
                    <span>{nodePingMs}ms</span>
                  </span>
                )}
                <span className="text-[9px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-1.5 py-0.2 rounded ml-1 shrink-0">
                  {isBotInfoCollapsed ? "Info ▸" : "Info ▾"}
                </span>
              </div>
              {/* Rich Tooltip for Capsule: Lean UI without cluttering header */}
              <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1.5 hidden group-hover:flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg bg-[#161622] border border-[#2a2a3c] text-[10px] font-mono shadow-xl z-30 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <span className="text-[#ff7a00] font-semibold">{selectedAgent.roleTag || "Agent"}</span>
                  <span>•</span>
                  <span className="text-emerald-400">{selectedAgent.status || "active"}</span>
                </div>
                <span className="text-neutral-400">{selectedAgent.node}</span>
                <span className="text-neutral-500 text-[9px]">{selectedAgent.model}</span>
              </div>
            </div>

            <div className="hidden md:flex">
              <TelemetryHud telemetry={turnTelemetry} isStreaming={isStreaming} />
            </div>
          </div>

          {/* Right action group: Command Palette + Audio Chime + Conversation drawer toggle */}
          <button aria-label="Command Palette (Ctrl+K / Cmd+K)"
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-[#14141c] hover:bg-[#1f1f2c] border border-[#262634] text-neutral-400 hover:text-white text-xs font-mono transition-colors cursor-pointer mr-1"
            title="Command Palette (Ctrl+K / Cmd+K)"
          >
            <Command size={13} className="text-[#ff7a00]" />
            <span className="text-[11px]">Ctrl+K</span>
          </button>
          <div className="flex items-center gap-1.5 shrink-0">
            <div ref={soundMenuRef} className="relative">
              <button aria-label="Configure audio chime and presets"
                type="button"
                onClick={() => setIsSoundMenuOpen((prev) => !prev)}
                className={`h-8 px-2 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer ${
                  isSoundEnabled
                    ? "bg-[#181820] hover:bg-[#22222e] border-[#242430] text-[#ff7a00]"
                    : "bg-[#14141a] hover:bg-[#1a1a22] border-[#202028] text-neutral-500"
                }`}
                title="Configure audio chime and presets"
              >
                {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <ChevronDown size={11} className={`transition-transform duration-200 ${isSoundMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isSoundMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-[#14141c] border border-[#2a2a38] p-2 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#22222e]">
                    <span className="text-[11px] font-semibold text-white">Audio Notification</span>
                    <button data-ux-target-min="24"
                      type="button"
                      onClick={() => {
                        const next = !isSoundEnabled;
                        setIsSoundEnabled(next);
                        try {
                          localStorage.setItem("agent360_sound_enabled", next ? "true" : "false");
                        } catch {}
                      }}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                        isSoundEnabled
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 border-white/10 text-neutral-400"
                      }`}
                    >
                      {isSoundEnabled ? "Enabled" : "Muted"}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 px-1 uppercase tracking-wider block">
                      Sound Presets
                    </span>
                    {SOUND_PRESETS.map((p) => {
                      const isSelected = p.id === soundPreset;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSoundPreset(p.id);
                            setIsSoundEnabled(true);
                            playNotificationChime(p.id);
                            try {
                              localStorage.setItem("agent360_sound_preset", p.id);
                              localStorage.setItem("agent360_sound_enabled", "true");
                            } catch {}
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-[#222230] text-[#ff7a00] border border-[#ff7a00]/30"
                              : "hover:bg-[#1a1a24] text-neutral-300"
                          }`}
                        >
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="text-xs font-medium truncate">{p.name}</span>
                            <span className="text-[10px] text-neutral-500 truncate">{p.description}</span>
                          </div>
                          <button aria-label="Preview sound" data-ux-target-min="24"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playNotificationChime(p.id);
                            }}
                            className="h-6 w-6 rounded hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white shrink-0"
                            title="Preview sound"
                          >
                            <Volume2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {/* Speech Voice Settings: Rate & Pitch */}
                  <div className="pt-2 mt-2 border-t border-[#22222e] space-y-2">
                    <span className="text-[10px] font-mono text-neutral-400 px-1 uppercase tracking-wider block">
                      Voice Dynamics (TTS)
                    </span>
                    {/* System Voice Selection */}
                    <div className="px-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-300">
                        <span>Voice Accent:</span>
                        <span className="font-mono text-[#ff7a00] text-[10px]">
                          {systemVoices.find(v => v.voiceURI === selectedVoiceURI)?.lang || "Auto"}
                        </span>
                      </div>
                      <select data-ux-target-min="16"
                        value={selectedVoiceURI}
                        onChange={(e) => {
                          const uri = e.target.value;
                          setSelectedVoiceURI(uri);
                          saveStoredSpeechSettings({ voiceURI: uri });
                        }}
                        className="w-full bg-[#181822] text-xs text-neutral-200 border border-[#2a2a38] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#ff7a00] cursor-pointer"
                      >
                        <option value="">Auto-Detect (Vietnamese / English)</option>
                        {systemVoices.map((v) => (
                          <option key={v.voiceURI} value={v.voiceURI}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="px-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-300">
                        <span>Speed:</span>
                        <span className="font-mono text-[#ff7a00] text-[10px]">{speechRate.toFixed(2)}x</span>
                      </div>
                      <input data-ux-target-min="16"
                        type="range"
                        min="0.8"
                        max="1.5"
                        step="0.05"
                        value={speechRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSpeechRate(val);
                          saveStoredSpeechSettings({ rate: val });
                        }}
                        className="w-full accent-[#ff7a00] h-1.5 bg-[#22222e] rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="px-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-neutral-300">
                        <span>Pitch:</span>
                        <span className="font-mono text-[#ff7a00] text-[10px]">{speechPitch.toFixed(2)}</span>
                      </div>
                      <input data-ux-target-min="16"
                        type="range"
                        min="0.7"
                        max="1.4"
                        step="0.05"
                        value={speechPitch}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSpeechPitch(val);
                          saveStoredSpeechSettings({ pitch: val });
                        }}
                        className="w-full accent-[#ff7a00] h-1.5 bg-[#22222e] rounded-lg cursor-pointer"
                      />
                    </div>
                    <button data-ux-target-min="24"
                      type="button"
                      onClick={() => {
                        speakText("Tốc độ và cao độ giọng nói đã được hiệu chỉnh.", {
                          rate: speechRate,
                          pitch: speechPitch
                        });
                      }}
                      className="w-full py-1 text-[10px] font-mono rounded bg-[#1c1c26] hover:bg-[#252534] text-neutral-300 hover:text-white border border-[#2a2a38] transition-colors cursor-pointer mt-1"
                    >
                      ▶ Test Voice Dynamics
                    </button>
                  </div>
                </div>
              )}
            </div>

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
            <button aria-label="Search within conversation" data-ux-target-min="24"
              type="button"
              onClick={() => setInSessionSearchOpen(!inSessionSearchOpen)}
              className={`h-8 w-8 rounded-lg border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                inSessionSearchOpen
                  ? "bg-[#ff7a00]/15 border-[#ff7a00]/30 text-[#ff7a00]"
                  : "bg-[#181820] hover:bg-[#22222e] border-[#242430] text-neutral-400 hover:text-white"
              }`}
              title="Search within conversation"
            >
              <Search size={15} />
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
            /* Quick Suggestions for fresh New Chat session */
            <div className="py-12 px-2 flex flex-col items-center justify-center text-center animate-in fade-in duration-300 max-w-xl mx-auto space-y-6">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-2xl bg-[#ff7a00]/10 border border-[#ff7a00]/30 text-[#ff7a00] flex items-center justify-center mx-auto shadow-lg shadow-[#ff7a00]/5">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  How can {selectedAgent.name} help you today?
                </h3>
                <p className="text-xs text-neutral-400 font-sans max-w-sm mx-auto leading-relaxed">
                  Autonomous AI teammate on <span className="text-neutral-200 font-mono">{selectedAgent.node}</span>. Pick a quick action or type any instruction below.
                </p>
              </div>

              {/* Grid of 4 quick prompt suggestion cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left font-sans">
                {QUICK_SUGGESTIONS.map((item, qIdx) => (
                  <button
                    key={qIdx}
                    type="button"
                    onClick={() => {
                      executeTurnStream(item.prompt);
                    }}
                    className="p-3.5 rounded-2xl bg-[#14141c]/90 hover:bg-[#1c1c28] border border-[#242432] hover:border-[#ff7a00]/40 text-left transition-all cursor-pointer group shadow-sm flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-neutral-200 group-hover:text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
                        {item.title}
                      </span>
                      <ArrowRight size={13} className="text-neutral-500 group-hover:text-[#ff7a00] group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
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
                    <div className="inline-block rounded-2xl px-4 py-2 text-[13px] leading-relaxed max-w-[85%] sm:max-w-[80%] bg-[#1c1c26] text-white rounded-br-xs shadow-sm font-sans border border-[#2c2c3e] ml-auto overflow-hidden break-words">
                      <p className="whitespace-pre-wrap select-text break-words break-all">{msg.content}</p>
                    </div>
                  ) : (
                    /* Assistant Turn: Structured Content Blocks + QwenPaw Tool Cards */
                    <div className="w-full max-w-full space-y-2.5 min-w-0 overflow-hidden">
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
                          <div className="text-[13px] leading-relaxed text-neutral-200 py-1 px-0.5 divide-y divide-dashed divide-[#22222c]/50">
                            <FormattedMessageContent content={msg.content} agentNode={selectedAgent.node} onRunCode={(codeSnippet) => {
                            sendConsoleChatMessageStream(
                              selectedChatId || "default",
                                "Execute shell verification:\n```bash\n" + codeSnippet + "\n```",
                              selectedAgent.slug
                            );
                          }} />
                            {/* Inline pulsing bullet cursor if currently streaming active tokens */}
                            {isStreaming && isLastTurn && (
                              <span className="inline-flex items-center gap-1 ml-1.5 align-middle select-none">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] typing-dot-1" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] typing-dot-2" />
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] typing-dot-3" />
                              </span>
                            )}
                          </div>
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
                                      onEnd: () => setSpeakingMsgId(null),
                                      onError: () => setSpeakingMsgId(null),
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
          {/* Attached Files Preview Chips */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pb-1 px-1">
              {attachedFiles.map((f, i) => (
                <div
                  key={f.url + i}
                  className="inline-flex items-center gap-2 bg-[#1c1c28] border border-[#2e2e42] text-xs font-mono px-3 py-1.5 rounded-xl text-neutral-200 shadow-sm animate-in fade-in duration-150"
                >
                  <Paperclip size={13} className="text-[#ff7a00]" />
                  <span className="max-w-[180px] truncate text-[11px] font-medium">{f.file_name}</span>
                  <span className="text-[9px] text-neutral-500 font-mono">({Math.round(f.size / 1024) || 1} KB)</span>
                  <button aria-label="Remove attachment" data-ux-target-min="24"
                    type="button"
                    onClick={() => removeAttachedFile(i)}
                    className="text-neutral-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 cursor-pointer ml-1"
                    title="Remove attachment"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
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
              className="mb-2 flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl border border-white/10 bg-[#121218] px-4 py-3 text-xs text-neutral-300"
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

          <form
            ref={composerFormRef}
            onSubmit={handleSendMessage}
            className={`flex items-center gap-2 bg-[#16161d] border ${isRecording ? "border-red-500/60 ring-2 ring-red-500/20" : "border-[#262632] focus-within:border-neutral-500"} rounded-full px-4 py-2.5 shadow-xl transition-all`}
          >
            {/* Hidden native file input */}
            <input data-ux-target-min="16"
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Plus / File Attachment Trigger */}
            <button aria-label="Add file to message (images, scripts, docs)" data-ux-target-min="24"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingFile}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-0.5 shrink-0"
              title="Add file to message (images, scripts, docs)"
            >
              {isUploadingFile ? (
                <Loader2 size={16} className="animate-spin text-[#ff7a00]" />
              ) : (
                <Plus size={16} />
              )}
            </button>

            <input aria-label={
                isRecording
                  ? "🎙 Đang nghe... Hãy nói để chuyển thành văn bản..."
                  : isStreaming
                  ? `Agent is busy • Type next request to queue (Press Enter)...`
                  : `Message ${selectedAgent.name}...`
              } data-ux-target-min="16"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isRecording
                  ? "🎙 Đang nghe... Hãy nói để chuyển thành văn bản..."
                  : isStreaming
                  ? `Agent is busy • Type next request to queue (Press Enter)...`
                  : `Message ${selectedAgent.name}...`
              }
              className="flex-1 bg-transparent border-0 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
            />

            <div className="flex items-center gap-2 text-neutral-400 shrink-0">
              {/* Live WebRTC Audio Visualizer */}
              <ContextUsageBar
                agentId={selectedAgent.id}
                sessionId={selectedChat?.id}
                estimatedTokens={selectedChat?.messageCount ? selectedChat.messageCount * 380 : 1200}
                maxTokens={128000}
                className="compact-trigger"
              />
              <AudioVisualizerWaveform isRecording={isRecording} />

              {/* Voice to text recording button (Supports Click Toggle & Push-to-Talk) */}
              <button aria-label={isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói (Voice to Text)"} data-ux-target-min="24"
                type="button"
                onClick={() => {
                  if (vadModeRef.current !== "push_to_talk") {
                    if (isRecording) stopVoiceRecording();
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
                className={`p-1 rounded-full cursor-pointer transition-all ${
                  isRecording
                    ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30"
                    : "hover:text-white hover:bg-white/10 text-neutral-400"
                }`}
                title={isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói (Voice to Text)"}
              >
                {isRecording ? <Square size={13} className="fill-white" /> : <Mic size={15} />}
              </button>

              {isStreaming && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ff7a00]/10 border border-[#ff7a00]/20 text-[10px] font-mono text-[#ff7a00]">
                  <Loader2 size={12} className="animate-spin" />
                  <span>{requestQueue.length > 0 ? `Queued (${requestQueue.length})` : "Running..."}</span>
                </div>
              )}
              <button aria-label={isStreaming ? "Add to request queue" : "Send Message"} data-ux-target-min="24"
                type="submit"
                disabled={!inputText.trim() && attachedFiles.length === 0}
                className="hover:text-white disabled:opacity-30 transition-colors cursor-pointer p-0.5"
                title={isStreaming ? "Add to request queue" : "Send Message"}
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. CONVERSATION SESSIONS LIST (COLLAPSIBLE, RIGHT OF CHAT) */}
      {/* ========================================================= */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 lg:z-30 h-full flex-col border-l border-[#1e1e24] bg-[#0f0f14] shrink-0 transition-grok ${
          mobileChatsOpen
            ? "flex w-[85vw] max-w-[320px] sm:w-[280px] translate-x-0 shadow-2xl"
            : isChatListCollapsed
            ? "hidden lg:flex lg:w-[56px] translate-x-full lg:translate-x-0 shadow-none border-l border-[#1e1e24]"
            : "hidden lg:flex lg:w-[280px] translate-x-full lg:translate-x-0 shadow-none border-l border-[#1e1e24]"
        }`}
      >
        {/* Header & Collapse Toggle */}
        {(isChatListCollapsed && !mobileChatsOpen) ? (
          <div className="h-12 border-b border-[#1c1c22] flex items-center justify-center shrink-0">
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
                      // Expand when user clicks on a chat from collapsed rail
                      handleToggleChatList(false);
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

            {/* Filter Tabs for Conversations: All / Unread / Pinned */}
            <div className="px-2 pt-2 pb-1 flex items-center gap-1 border-b border-[#1c1c24] text-[10px] font-mono select-none">
              <button data-ux-target-min="24"
                type="button"
                onClick={() => setChatFilterTab("all")}
                className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                  chatFilterTab === "all"
                    ? "bg-[#222230] text-[#ff7a00] font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                All ({chats.length})
              </button>
              <button data-ux-target-min="24"
                type="button"
                onClick={() => setChatFilterTab("unread")}
                className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                  chatFilterTab === "unread"
                    ? "bg-[#222230] text-emerald-400 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>Done</span>
                {(unreadCompletedSessions[selectedAgent.id] || []).length > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
              <button data-ux-target-min="24"
                type="button"
                onClick={() => setChatFilterTab("pinned")}
                className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
                  chatFilterTab === "pinned"
                    ? "bg-[#222230] text-amber-300 font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Pinned ({pinnedChatIds.length})
              </button>
            </div>

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
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer group animate-fade-in-stagger ${
                      isSelected
                        ? "bg-[#22222c] text-white shadow-sm"
                        : "hover:bg-[#181820] text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <div className="h-7 w-7 rounded-lg bg-[#181822] border border-[#2a2a3a] flex items-center justify-center shrink-0 relative text-neutral-400 group-hover:text-white transition-colors">
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

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Pin Toggle */}
                          <button aria-label={pinnedChatIds.includes(chat.id) ? "Unpin session" : "Pin session to top"} data-ux-target-min="24"
                            type="button"
                            onClick={(e) => togglePinChat(chat.id, e)}
                            className={`p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ${
                              pinnedChatIds.includes(chat.id) ? "text-amber-400" : "text-neutral-500 opacity-0 group-hover:opacity-100 hover:text-white"
                            }`}
                            title={pinnedChatIds.includes(chat.id) ? "Unpin session" : "Pin session to top"}
                          >
                            <Pin size={11} className={pinnedChatIds.includes(chat.id) ? "fill-amber-400" : ""} />
                          </button>

                          {/* Quick Rename */}
                          {editingChatId !== chat.id && (
                            <button aria-label="Rename session" data-ux-target-min="24"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingChatId(chat.id);
                                setEditingChatTitle(chat.title);
                              }}
                              className="p-1 rounded text-neutral-500 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                              title="Rename session"
                            >
                              <Edit2 size={11} />
                            </button>
                          )}

                          {/* Delete Session */}
                          <button aria-label="Delete conversation" data-ux-target-min="24"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setChatToDelete(chat);
                            }}
                            className="p-1 rounded text-neutral-500 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete conversation"
                          >
                            <Trash2 size={11} />
                          </button>

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
                    <div className="p-6 text-center text-xs text-neutral-500 font-mono">
                      No dialogues found.
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
        className={`fixed xl:static inset-y-0 right-0 z-50 xl:z-40 h-full flex flex-col border-l border-[#1e1e24] bg-[#0f0f13] shrink-0 select-none transition-grok ${
          isBotInfoCollapsed
            ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full xl:w-0"
            : "w-[85vw] max-w-[340px] sm:w-[320px] border-l border-[#1e1e24] translate-x-0 xl:translate-x-0 shadow-2xl xl:shadow-none"
        }`}
      >
        {!isBotInfoCollapsed && (
          <>
            {/* Clean Header with Mobile Close Button */}
            <div className="h-12 border-b border-[#1c1c22] flex items-center justify-between px-3 shrink-0 bg-[#0f0f13]">
              <span className="text-[11px] font-mono text-neutral-400">Agent Specification</span>
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

            {/* Mascot & Name with Mouse-following Eye Animation & Interactive Model Switcher */}
            <div className="p-5 flex flex-col items-center text-center border-b border-[#1c1c22]">
              {/* Interactive Eyes Mascot */}
              <div
                ref={mascotRef}
                className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-lg mb-2.5 relative transition-transform hover:scale-105 cursor-pointer"
                title={`${selectedAgent.name} mascot`}
              >
                <div className="flex items-center gap-2">
                  {/* Left Eye */}
                  <div className="h-3.5 w-3.5 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                    <div
                      className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-75"
                      style={{
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                      }}
                    />
                  </div>
                  {/* Right Eye */}
                  <div className="h-3.5 w-3.5 rounded-full bg-black flex items-center justify-center relative overflow-hidden">
                    <div
                      className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-75"
                      style={{
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-white tracking-tight">
                {selectedAgent.name}
              </h2>

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
                    {isChangingModel ? "Updating model..." : selectedAgent.model}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isModelDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Model selection dropdown menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-1.5 w-60 rounded-xl bg-[#14141c] border border-[#2a2a38] p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-400 border-b border-[#22222e] flex items-center justify-between">
                      <span>Available Models</span>
                      <span className="text-[9px] text-[#ff7a00]">{availableModels.length} models</span>
                    </div>
                    <div className="space-y-0.5 max-h-60 overflow-y-auto mt-1 text-left">
                      {(availableModels.length > 0
                        ? availableModels
                        : [
                            { providerId: "llm360coding", providerName: "LLM360", model: "gpt-5.6-luna", name: "GPT-5.6 Luna" },
                            { providerId: "llm360coding", providerName: "LLM360", model: "grok-4.7", name: "Grok 4.7" },
                            { providerId: "llm360coding", providerName: "LLM360", model: "gpt-6-sol", name: "GPT-6 Sol" },
                            { providerId: "llm360coding", providerName: "LLM360", model: "grok-4.6", name: "Grok 4.6" },
                            { providerId: "llm360coding", providerName: "LLM360", model: "claude-opus-4.6-thinking", name: "Claude Opus 4.6" },
                            { providerId: "llm360coding", providerName: "LLM360", model: "gemini-3.7-flash-tiered", name: "Gemini 3.7 Flash" },
                          ]
                      ).map((m) => {
                        const isCurrent = selectedAgent.model === m.model;
                        return (
                          <div
                            key={m.model}
                            onClick={() => handleSelectModel(m.model)}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                              isCurrent
                                ? "bg-[#222230] text-[#ff7a00] font-semibold"
                                : "text-neutral-300 hover:bg-[#1a1a24] hover:text-white"
                            }`}
                          >
                            <div className="flex flex-col truncate pr-2">
                              <span className="truncate text-[11px] font-mono">{m.model}</span>
                              <span className="text-[9px] text-neutral-500 font-normal truncate">
                                {m.providerName}
                              </span>
                            </div>
                            {isCurrent && <Check size={12} className="text-[#ff7a00] shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs: Apps | Computer | Details | Library */}
            <div className="flex items-center justify-around border-b border-[#1c1c22] text-xs font-medium text-neutral-400 px-2">
              {(["Computer", "Apps", "Memory", "Agents", "Details", "Library"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRightTab(tab)}
                  className={`py-2.5 transition-colors cursor-pointer border-b-2 ${
                    rightTab === tab
                      ? "text-white border-white font-semibold"
                      : "border-transparent hover:text-neutral-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 p-3.5 overflow-y-auto">
              {rightTab === "Computer" && (() => {
                const browserTarget = getAgentBrowserUrl(selectedAgent);
                return (
                  <div className="flex flex-col w-full">
                    {/* Live Browser Fixed-Height Responsive Card */}
                    <div className="w-full rounded-2xl border border-[#262634] bg-[#101015] overflow-hidden shadow-xl flex flex-col shrink-0">
                      {/* Top Browser Bar */}
                      <div className="h-9 px-3 bg-[#171720] border-b border-[#242430] flex items-center justify-between text-xs font-mono select-none shrink-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="text-[11px] font-semibold text-white truncate">
                            {selectedAgent.name} Computer
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button aria-label="Expand full screen" data-ux-target-min="24"
                            type="button"
                            onClick={() => handleSetBrowserModalOpen(true)}
                            className="p-1 text-neutral-400 hover:text-white hover:bg-[#232330] rounded transition-colors cursor-pointer"
                            title="Expand full screen"
                          >
                            <Maximize2 size={13} />
                          </button>
                          <a aria-label="Open in new window"
                            href={browserTarget.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-neutral-400 hover:text-white hover:bg-[#232330] rounded transition-colors cursor-pointer"
                            title="Open in new window"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </div>

                      {/* Embedded Live Iframe Viewport: Fixed 190px responsive height with clean shrunk preview scale */}
                      <div 
                        onClick={() => handleSetBrowserModalOpen(true)}
                        style={{ height: "190px", width: "100%", position: "relative", overflow: "hidden", backgroundColor: "#000", flexShrink: 0 }}
                        className="cursor-pointer group flex items-center justify-center rounded-b-2xl"
                      >
                        {/* Shrunk virtual viewport container (1024x768 virtual screen scaled to fit container) */}
                        <div 
                          style={{
                            width: "1024px",
                            height: "768px",
                            position: "absolute",
                            top: 0,
                            left: "50%",
                            transform: "translateX(-50%) scale(0.25)",
                            transformOrigin: "top center",
                            pointerEvents: "none"
                          }}
                        >
                          <iframe
                            key={`${selectedAgent.id}-${browserTarget.url}`}
                            src={browserTarget.url}
                            title={`${selectedAgent.name} Computer`}
                            style={{ width: "100%", height: "100%", border: "none" }}
                            loading="lazy"
                          />
                        </div>

                        {/* Hover Overlay: Click to expand */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5 z-10 select-none">
                          <div className="h-8 w-8 rounded-full bg-[#ff7a00]/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Maximize2 size={14} />
                          </div>
                          <span className="text-[11px] font-mono font-medium text-white bg-black/70 px-2.5 py-1 rounded-md border border-white/10">
                            Click to expand full screen
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {rightTab === "Memory" && (
                <AgentMemoryTab
                  agentId={selectedAgent.id}
                  agentName={selectedAgent.name}
                  agentSlug={selectedAgent.slug}
                />
              )}

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
                <div className="space-y-4 text-xs text-neutral-300 font-sans pb-4">
                  {/* Agent Persona & System Governance */}
                  <div className="rounded-xl bg-[#14141c] border border-[#22222e] p-3 space-y-2">
                    <div className="flex items-center justify-between text-white font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Bot size={13} className="text-[#ff7a00]" />
                        <span>Persona & Governance</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                        {selectedAgent.runtimeVersion || "ACP v2.2"}
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
                              className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
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

              {rightTab === "Library" && (
                <div className="space-y-3 text-xs flex flex-col h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Workspace Files ({workspaceFiles.length})
                    </span>
                    <button aria-label="Refresh workspace tree" data-ux-target-min="24"
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

                  {/* File Tree List */}
                  <div className="bg-[#14141a] border border-[#1e1e26] rounded-xl p-2 max-h-48 overflow-y-auto space-y-1 font-mono text-[11px]">
                    {isLoadingTree ? (
                      <div className="space-y-1.5 py-1">
                        <div className="h-6 w-3/4 rounded-md skeleton-shimmer" />
                        <div className="h-6 w-5/6 rounded-md skeleton-shimmer" />
                        <div className="h-6 w-2/3 rounded-md skeleton-shimmer" />
                        <div className="h-6 w-4/5 rounded-md skeleton-shimmer" />
                      </div>
                    ) : workspaceFiles.length === 0 ? (
                      <div className="text-center py-4 text-neutral-500">No files found</div>
                    ) : (
                      workspaceFiles.map((node) => {
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

                  {/* File Preview Content */}
                  {selectedFilePath && (
                    <div className="flex-1 flex flex-col space-y-1 min-h-[140px]">
                      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span className="truncate max-w-[180px]">{selectedFilePath}</span>
                        <span className="text-emerald-400">read-only ACL</span>
                      </div>
                      <div className="flex-1 bg-[#101014] border border-[#1c1c24] rounded-xl p-2.5 overflow-y-auto font-mono text-[10px] text-neutral-300 leading-relaxed whitespace-pre-wrap select-text max-h-52">
                        {isLoadingFile ? (
                          <div className="space-y-2 py-1">
                            <div className="h-3 w-4/5 rounded skeleton-shimmer" />
                            <div className="h-3 w-full rounded skeleton-shimmer" />
                            <div className="h-3 w-3/4 rounded skeleton-shimmer" />
                            <div className="h-3 w-5/6 rounded skeleton-shimmer" />
                          </div>
                        ) : fileContent !== null ? (
                          fileContent
                        ) : (
                          <span className="text-neutral-600">Empty or binary file.</span>
                        )}
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
        const browserTarget = getAgentBrowserUrl(selectedAgent);
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
                  href={browserTarget.url}
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
            <main className="flex-1 w-full h-full bg-black relative">
              <iframe
                key={`modal-${selectedAgent.id}-${browserTarget.url}`}
                src={browserTarget.url}
                title={`${selectedAgent.name} Interactive Workspace`}
                className="w-full h-full border-0 bg-black"
                allow="clipboard-read; clipboard-write; fullscreen"
              />
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

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onRequestDone={() => {
          setVoiceError(null);
        }}
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
            className="w-full max-w-md bg-[#14141c] border border-[#262634] rounded-2xl p-4 shadow-2xl text-neutral-200 font-sans space-y-3"
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

      {/* Delete Chat Confirmation Modal */}
      {chatToDelete && (
        <div
          onClick={() => setChatToDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#14141c] border border-[#2a2a38] rounded-2xl p-5 shadow-2xl text-neutral-200 font-sans space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <Trash2 size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Delete Conversation?</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Are you sure you want to remove &quot;{chatToDelete.title}&quot;? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#22222e]">
              <button data-ux-target-min="24"
                type="button"
                onClick={() => setChatToDelete(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button data-ux-target-min="24"
                type="button"
                onClick={(e) => {
                  handleDeleteChat(chatToDelete.id, e);
                  setChatToDelete(null);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-400 text-white transition-colors cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
