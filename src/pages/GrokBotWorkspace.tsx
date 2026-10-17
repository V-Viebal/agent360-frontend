import { ConnectAppsModal } from "../components/ConnectAppsModal";
import { AgentConnectedAppsTab } from "../components/AgentConnectedAppsTab";
import { ChannelConfigModal } from "../components/ChannelConfigModal";
import { ScheduleJobModal } from "../components/ScheduleJobModal";
import { useState, useRef, useEffect } from "react";
import {
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
  Bot,
  SlidersHorizontal,
  ExternalLink,
  Minimize2,
  Maximize2,
  AlertCircle,
  Sparkles,
  Clock,
  Radio,
  Copy,
  Check,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession } from "../types/agent";
import {
  fetchInfraAgents,
  fetchAgentChats,
  fetchChatMessages,
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
  updateAgentActiveModel,
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { uploadFileToGateway, UploadedFileResult } from "../services/uploadApi";
import { CustomSelect, StatusBadge, IconButton, SearchInput } from "../components/ui";


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
              <button
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
              <button
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
                <a
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
                <button
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

function FormattedMessageContent({ content }: { content: string }) {
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);

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
    <div className="space-y-2 text-[13px] leading-relaxed select-text">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```(\w+)?\s*\n([\s\S]*?)```$/);
          const lang = match ? match[1] || "shell" : "code";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div
              key={idx}
              className="my-2 rounded-xl overflow-hidden border border-[#262634] bg-[#0a0a0f] font-mono text-xs shadow-md"
            >
              <div className="px-3 py-1.5 bg-[#14141c] border-b border-[#262634] flex items-center justify-between text-[11px] text-neutral-400 select-none">
                <span className="flex items-center gap-1.5 text-[#ff7a00] font-mono">
                  <Terminal size={12} />
                  {lang}
                </span>
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
              <pre className="p-3.5 overflow-x-auto text-neutral-200 whitespace-pre max-h-80 overflow-y-auto">
                <code>{code}</code>
              </pre>
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
                <p key={lineIdx} className="text-neutral-300 leading-relaxed">
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

export function GrokBotWorkspace() {
  const [agents, setAgents] = useState<InfraAgent[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>("all");
  const INFRA_INSTANCES = [
    { value: "all", label: "All Agents", badge: "Personal", description: "All private agents on system" },
    { value: "node-3rd", label: "Node 3rd (Core)", badge: "Core", description: "ai.hmz.one (QwenPaw/ACP)" },
    { value: "node-6th", label: "Node 6th (Dedicated)", badge: "Worker", description: "ai-gm.antares.vn / Mons" },
    { value: "node-4th", label: "Node 4th (Browser)", badge: "Cluster", description: "browser.hmz.one (CDP)" },
    { value: "node-7th", label: "Node 7th (Control)", badge: "Control", description: "control.hmz.one / SRE" },
    { value: "node-1st", label: "Node 1st (Gateway)", badge: "Edge", description: "api.antares.vn" },
    { value: "node-2nd", label: "Node 2nd (LLM360)", badge: "GPU", description: "AI Model Gateway" },
    { value: "node-5th", label: "Node 5th (Storage)", badge: "S3", description: "storage1.hmz.one" },
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
  const [rightTab, setRightTab] = useState<"Computer" | "Apps" | "Details" | "Library">("Computer");
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

  // Collapse states per user request
  // 1. isChatListCollapsed: collapse bar for conversation list (auto collapsed in compact mode)
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(isInitialCompact);
  // 2. isBotInfoCollapsed: collapse bar for rightmost bot information pane (auto collapsed in compact mode)
  const [isBotInfoCollapsed, setIsBotInfoCollapsed] = useState(isInitialCompact);

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

  const startVoiceRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Trình duyệt không hỗ trợ Web Speech API. Vui lòng dùng Chrome hoặc Edge.");
      setTimeout(() => setVoiceError(null), 4000);
      return;
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
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef<boolean>(true);

  // Search in conversation list
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatSearchOpen, setChatSearchOpen] = useState(false);

  // Search in agents sidebar
  const [agentSearchQuery, setAgentSearchQuery] = useState("");

  // Mobile / Tablet Responsive Drawer States
  const [mobileAgentsOpen, setMobileAgentsOpen] = useState(false);
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

  // Initial load from real backend
  useEffect(() => {
    async function initData() {
      const [loadedAgents, loadedSkills] = await Promise.all([
        fetchInfraAgents(),
        fetchSkills(),
      ]);

      setAgents(loadedAgents);
      setSkills(loadedSkills);

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
    }
    loadAgentChats();
  }, [selectedAgentId]);

  // When selectedChatId changes, fetch real messages
  useEffect(() => {
    if (!selectedChatId) return;

    isInitialLoadRef.current = true;
    let mounted = true;
    setIsLoadingMessages(true);

    fetchChatMessages(selectedChatId, selectedAgentId).then((loadedMsgs) => {
      if (!mounted) return;
      if (loadedMsgs.length > 0) {
        setMessages(loadedMsgs);
        setShowPollCard(false);
      } else {
        const curAgent = agents.find((a) => a.id === selectedAgentId);
        setMessages([
          {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: `Hi! I'm ${curAgent?.name || "Skyer"}, running on ${curAgent?.node || "Personal System"}. I can execute commands, query skills, and take complex tasks off your plate.`,
            timestamp: "Just now",
            evidenceStatus: "observed",
          },
        ]);
        setShowPollCard(true);
      }
      setIsLoadingMessages(false);
      setTimeout(() => {
        jumpToBottom();
      }, 0);
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
    try {
      localStorage.setItem("agent360_last_chat_id", chat.id);
      localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, chat.id);
    } catch {}
  };

  // New Chat session
  const handleNewChat = () => {
    const newChatId = `session-${Date.now().toString().slice(-6)}`;
    const newSession: AgentSession = {
      id: newChatId,
      title: "New Dialogue",
      updatedAt: "Just now",
      messageCount: 1,
      lastMessageSnippet: "What would you like to call me?...",
    };
    setChats([newSession, ...chats]);
    setSelectedChatId(newChatId);
    try {
      localStorage.setItem("agent360_last_chat_id", newChatId);
      localStorage.setItem(`agent360_last_chat_${selectedAgentId}`, newChatId);
    } catch {}
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: `Hi! I'm ${selectedAgent.name}, your new personal assistant. What would you like to call me?`,
        timestamp: "Just now",
        evidenceStatus: "observed",
      },
    ]);
    setShowPollCard(true);
    setMobileChatsOpen(false);
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
      content: "...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      evidenceStatus: "observed",
    };

    setMessages((prev) => [...prev, userMsg, initialBotMsg]);
    setIsStreaming(true);

    try {
      let accumulated = "";
      await sendConsoleChatMessageStream(
        selectedChatId || "default",
        userText,
        selectedAgent.slug,
        (chunkText) => {
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

    const id = a.id.toLowerCase();
    const node = (a.node || "").toLowerCase();
    const desc = (a.description || "").toLowerCase();

    if (node === selectedInstance) return true;
    if (selectedInstance === "node-6th") {
      return node.includes("6th") || node.includes("ai-gm") || id.includes("mons") || id.includes("swe") || id.includes("vision");
    }
    if (selectedInstance === "node-3rd") {
      return node.includes("3rd") || node.includes("ai.hmz") || id.includes("default") || id.includes("qa") || id === "bot:agent360:default";
    }
    if (selectedInstance === "node-4th") {
      return node.includes("4th") || node.includes("browser") || id.includes("mkai");
    }
    if (selectedInstance === "node-7th") {
      return node.includes("7th") || node.includes("control") || id.includes("ken") || id.includes("sre") || id.includes("researcher");
    }
    if (selectedInstance === "node-2nd") {
      return node.includes("2nd") || node.includes("llm") || id.includes("zen");
    }
    if (selectedInstance === "node-1st") {
      return node.includes("1st") || node.includes("api.antares") || id.includes("gateway");
    }
    if (selectedInstance === "node-5th") {
      return node.includes("5th") || node.includes("storage");
    }
    return false;
  });

  const filteredChats = chats
    .filter(
      (c) =>
        c.title.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
        c.lastMessageSnippet.toLowerCase().includes(chatSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0c0e] text-[#e6e6e8] font-sans select-none antialiased relative">
      {/* ========================================================= */}
      {/* BACKDROP OVERLAY FOR MOBILE DRAWERS */}
      {/* ========================================================= */}
      {(mobileAgentsOpen || mobileChatsOpen || (!isBotInfoCollapsed && mobileBotInfoOpen)) && (
        <div
          onClick={() => {
            setMobileAgentsOpen(false);
            setMobileChatsOpen(false);
            setMobileBotInfoOpen(false);
            setIsBotInfoCollapsed(true);
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
            ? "-translate-x-full"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-3 sm:p-3.5 border-b border-[#1c1c22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-[#ff7a00]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white font-mono">
              Skyer
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CustomSelect
              value={selectedInstance}
              onChange={(val) => {
                setSelectedInstance(val);
                const nextMatching = agents.filter((a) => {
                  if (val === "all") return true;
                  const id = a.id.toLowerCase();
                  const node = (a.node || "").toLowerCase();
                  if (node === val) return true;
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
              triggerClassName="px-2 py-1 text-[11px] font-mono text-[#ff7a00]"
            />
            <button
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
          {filteredAgents.map((ag) => {
            const isSelected = ag.id === selectedAgentId;
            return (
              <div
                key={ag.id}
                onClick={() => handleSelectAgent(ag)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer border ${
                  isSelected
                    ? "bg-[#1c1c26] border-[#303042] text-white shadow-sm"
                    : "border-transparent hover:bg-[#14141c] text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {/* Agent Avatar */}
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm relative">
                  <div className="h-4 w-4 rounded-full bg-black flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  {isSelected && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-black" />
                  )}
                </div>

                {/* Agent Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white truncate block">
                      {ag.name}
                    </span>
                    <StatusBadge status={(ag.status === "degraded" ? "stopped" : ag.status) || "active"} text={ag.roleTag || "Personal"} className="shrink-0" />
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
                    setIsBotInfoCollapsed(false);
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
                    setIsBotInfoCollapsed(false);
                    setRightTab("Details");
                  }}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-neutral-300 hover:bg-[#1f1f2c] hover:text-white cursor-pointer transition-colors"
                >
                  <span>Fleet Diagnostics</span>
                  <span className="text-[10px] font-mono text-emerald-400">Healthy</span>
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
          <button
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

          {/* CAPSULE INFO BOT: Click triggers collapse / expand of rightmost bot info */}
          <div
            onClick={() => {
              setIsBotInfoCollapsed((prev) => !prev);
              setMobileBotInfoOpen((prev) => !prev);
            }}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#181820] hover:bg-[#22222e] border border-[#2a2a34] hover:border-[#383848] px-2.5 sm:px-3.5 py-1 rounded-full text-xs font-medium text-white shadow-sm mx-auto cursor-pointer transition-all select-none group max-w-[200px] sm:max-w-none"
            title="Click to toggle Bot Information panel"
          >
            <div className="h-3.5 w-3.5 rounded-full bg-white flex items-center justify-center shrink-0">
              <div className="h-2 w-2 rounded-full bg-black flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-white" />
              </div>
            </div>
            <span className="truncate text-xs">{selectedAgent.name}</span>
            <span className="text-[9px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-1.5 py-0.2 rounded ml-1 group-hover:bg-[#ff7a00]/20 shrink-0">
              {isBotInfoCollapsed ? "Info ▸" : "Info ▾"}
            </span>
          </div>

          {/* Right button: toggle Conversations list (mobile drawer or desktop rail expand/collapse) */}
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) {
                setIsChatListCollapsed((prev) => !prev);
              } else {
                setMobileChatsOpen((prev) => {
                  const nextState = !prev;
                  if (nextState) {
                    setIsChatListCollapsed(false);
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

        {/* Messages Stream Area (Responsive & Lean for Compact/Minimize) */}
        <div
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto ${isCompactMode ? "px-3 py-3 space-y-3.5" : "px-4 md:px-8 py-5 space-y-5"} max-w-3xl mx-auto w-full`}
        >
          {/* Session Title & Timestamp Header */}
          <div className="flex flex-col items-center justify-center gap-1.5 text-center">
            {selectedChat && (
              <div className="flex items-center gap-2 max-w-[90%] sm:max-w-md px-3.5 py-1 rounded-xl bg-[#14141c]/90 border border-[#22222e] shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00] shrink-0" />
                <span className="text-xs font-medium text-white truncate" title={selectedChat.title}>
                  {selectedChat.title}
                </span>
                {selectedChat.messageCount > 1 && (
                  <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                    ({selectedChat.messageCount} msgs)
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono text-neutral-500 bg-[#16161c]/80 px-2.5 py-0.5 rounded-full">
                Live Stream • {selectedAgent.name}
              </span>
            </div>
          </div>

          {isLoadingMessages ? (
            <div className="flex items-center justify-center py-12 text-neutral-500 text-xs font-mono gap-2">
              <Loader2 size={16} className="animate-spin text-[#ff7a00]" />
              <span>Loading dialogue history...</span>
            </div>
          ) : (
            messages.map((msg) => {
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
                    <div className="inline-block rounded-2xl px-4 py-2 text-[13px] leading-relaxed max-w-[80%] bg-[#1c1c26] text-white rounded-br-xs shadow-sm font-sans border border-[#2c2c3e] ml-auto">
                      <p className="whitespace-pre-wrap select-text">{msg.content}</p>
                    </div>
                  ) : (
                    /* Assistant Turn: Structured Content Blocks + QwenPaw Tool Cards */
                    <div className="w-full max-w-[95%] space-y-2.5">
                      {/* 1. Intermediate Steps (Reasoning & Tool Calls) in execution order */}
                      {hasSteps && (
                        <div className="space-y-1.5 w-full">
                          {msg.steps!.map((step, sIdx) => {
                            if (step.kind === "reasoning") {
                              return (
                                <div
                                  key={sIdx}
                                  className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#14141a]/80 border border-[#202028] text-xs text-neutral-400 leading-relaxed font-sans shadow-xs"
                                >
                                  <Sparkles size={13} className="text-[#ff7a00] shrink-0 mt-0.5" />
                                  <div className="flex-1 whitespace-pre-wrap italic">
                                    {renderInlineMarkdown(step.text || "")}
                                  </div>
                                </div>
                              );
                            }
                            if (step.kind === "tool_call") {
                              return (
                                <QwenPawToolCard
                                  key={sIdx}
                                  toolCall={{
                                    tool: step.tool || "Tool",
                                    args: step.args,
                                    result: step.result,
                                    state: step.state
                                  }}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}

                      {/* Fallback if toolCalls array exists without steps */}
                      {!hasSteps && hasTools && (
                        <div className="space-y-1.5 w-full">
                          {msg.toolCalls!.map((tc, tcIdx) => (
                            <QwenPawToolCard key={tcIdx} toolCall={tc} />
                          ))}
                        </div>
                      )}

                      {/* Subtle split dash divider between execution steps and final synthesis */}
                      {hasSteps && msg.content && (
                        <div className="py-1 flex items-center justify-center">
                          <div className="w-full border-t border-dashed border-[#242432]/60" />
                        </div>
                      )}

                      {/* 2. Formatted Main Response Content: left-aligned, transparent, no background, no border */}
                      {msg.content && (
                        <div className="text-[13px] leading-relaxed text-neutral-200 py-1 px-0.5 divide-y divide-dashed divide-[#22222c]/50">
                          <FormattedMessageContent content={msg.content} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Interactive Choice Card from Skyer */}
          {showPollCard && !isLoadingMessages && (
            <div className="bg-[#14141a] border border-[#242430] rounded-2xl p-4 shadow-xl max-w-xl text-xs space-y-3">
              <div className="flex items-center justify-between text-neutral-300 font-medium">
                <span>What would you like to call me? You can always change this later.</span>
                <button
                  onClick={() => setShowPollCard(false)}
                  className="text-neutral-500 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Options A, B, C */}
              <div className="space-y-1.5 font-sans">
                <button
                  onClick={() => handleSelectNameOption("Nori")}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#1c1c24] hover:bg-[#262632] border border-[#2a2a34] text-left text-neutral-200 transition-colors cursor-pointer group"
                >
                  <span className="h-5 w-5 rounded-md bg-[#2a2a36] text-[10px] font-mono flex items-center justify-center text-neutral-400 group-hover:text-white">
                    A
                  </span>
                  <span>Nori</span>
                </button>

                <button
                  onClick={() => handleSelectNameOption("Doodle")}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#1c1c24] hover:bg-[#262632] border border-[#2a2a34] text-left text-neutral-200 transition-colors cursor-pointer group"
                >
                  <span className="h-5 w-5 rounded-md bg-[#2a2a36] text-[10px] font-mono flex items-center justify-center text-neutral-400 group-hover:text-white">
                    B
                  </span>
                  <span>Doodle</span>
                </button>

                <button
                  onClick={() => handleSelectNameOption(selectedAgent.name)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[#1c1c24] hover:bg-[#262632] border border-[#2a2a34] text-left text-neutral-200 transition-colors cursor-pointer group"
                >
                  <span className="h-5 w-5 rounded-md bg-[#2a2a36] text-[10px] font-mono flex items-center justify-center text-neutral-400 group-hover:text-white">
                    C
                  </span>
                  <span>{selectedAgent.name}</span>
                </button>
              </div>

              {/* Free-form Input */}
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Type your own answer"
                  value={customCallName}
                  onChange={(e) => setCustomCallName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customCallName.trim()) {
                      handleSelectNameOption(customCallName.trim());
                    }
                  }}
                  className="w-full bg-[#181820] border border-[#262634] rounded-xl px-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>
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
                  <button
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

          {/* Voice Error Notification */}
          {voiceError && (
            <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[11px] font-mono flex items-center justify-between animate-in fade-in">
              <span>{voiceError}</span>
              <button type="button" onClick={() => setVoiceError(null)} className="text-red-400 hover:text-white cursor-pointer">
                <X size={12} />
              </button>
            </div>
          )}

          <form
            onSubmit={handleSendMessage}
            className={`flex items-center gap-2 bg-[#16161d] border ${isRecording ? "border-red-500/60 ring-2 ring-red-500/20" : "border-[#262632] focus-within:border-neutral-500"} rounded-full px-4 py-2.5 shadow-xl transition-all`}
          >
            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Plus / File Attachment Trigger */}
            <button
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

            <input
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
              {/* Voice to text recording button */}
              <button
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
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
              <button
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
        {isChatListCollapsed ? (
          <div className="h-12 border-b border-[#1c1c22] flex items-center justify-center shrink-0">
            <button
              onClick={() => {
                setIsChatListCollapsed(false);
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
              <button
                onClick={() => setChatSearchOpen(!chatSearchOpen)}
                className="h-7 w-7 rounded-lg hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Search chats"
              >
                <Search size={14} />
              </button>
              <button
                onClick={handleNewChat}
                className="h-7 w-7 rounded-lg hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="New Chat Session"
              >
                <Plus size={15} />
              </button>

              {/* Collapse bar trigger for conversations on desktop */}
              <button
                onClick={() => setIsChatListCollapsed(true)}
                className="hidden lg:flex h-7 w-7 rounded-lg hover:bg-[#1f1f26] items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Collapse Conversations list"
              >
                <ChevronRight size={16} />
              </button>

              {/* Close button for conversations on mobile */}
              <button
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
        {isChatListCollapsed ? (
          <div className="flex-1 flex flex-col items-center py-3 space-y-2.5 overflow-hidden w-full">
            <button
              onClick={handleNewChat}
              className="h-8 w-8 rounded-xl bg-[#1c1c24] hover:bg-[#ff7a00] hover:text-white text-neutral-300 flex items-center justify-center transition-colors cursor-pointer border border-[#262632] shadow-sm"
              title="New Chat"
            >
              <Plus size={16} />
            </button>
            <div className="w-5 h-[1px] bg-[#22222e]" />
            <div className="flex-1 overflow-y-auto space-y-2 flex flex-col items-center w-full px-1 scrollbar-none">
              {chats.slice(0, 10).map((c) => {
                const isSelected = c.id === selectedChatId;
                let initial = c.title ? c.title.trim() : "";
                if (initial.toLowerCase().startsWith("session ")) {
                  initial = initial.slice(8).trim();
                } else if (initial.toLowerCase().startsWith("sub-")) {
                  initial = initial.slice(4).trim();
                }
                const displayLetter = initial.slice(0, 2).toUpperCase() || "#";

                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      handleSelectChat(c);
                      // Expand when user clicks on a chat from collapsed rail
                      setIsChatListCollapsed(false);
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

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                Recent Dialogues
              </div>

              {filteredChats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#22222c] text-white shadow-sm"
                        : "hover:bg-[#181820] text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm relative">
                      <div className="h-3.5 w-3.5 rounded-full bg-black flex items-center justify-center">
                        <div className="h-1 w-1 rounded-full bg-white" />
                      </div>
                      {isSelected && (
                        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-400 border border-black" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-white truncate block">
                        {chat.title}
                      </span>
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
            <div className="h-10 border-b border-[#1c1c22] flex items-center justify-between px-3">
              <span className="text-[11px] font-mono text-neutral-400">Agent Specification</span>
              <button
                onClick={() => {
                  setIsBotInfoCollapsed(true);
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
                <button
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
              {(["Computer", "Apps", "Details", "Library"] as const).map((tab) => (
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
                          <button
                            type="button"
                            onClick={() => handleSetBrowserModalOpen(true)}
                            className="p-1 text-neutral-400 hover:text-white hover:bg-[#232330] rounded transition-colors cursor-pointer"
                            title="Expand full screen"
                          >
                            <Maximize2 size={13} />
                          </button>
                          <a
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

              {rightTab === "Apps" && (
                <AgentConnectedAppsTab
                  agentId={selectedAgent.id}
                  agentName={selectedAgent.name}
                  onOpenConnectModal={() => setIsConnectAppsOpen(true)}
                  onRefreshTrigger={mcpRefreshTrigger}
                />
              )}

              {rightTab === "Details" && (
                <div className="space-y-4 text-xs text-neutral-300 font-sans pb-4">
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
                      <div className="text-center py-3 text-neutral-500 font-mono text-[11px]">
                        Loading channels...
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
                                <button
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
                                <button
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
                        <button
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
                      <div className="text-center py-3 text-neutral-500 font-mono text-[11px]">
                        Loading schedules...
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
                    <button
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
                      <div className="text-center py-4 text-neutral-500">Loading tree...</div>
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
                          <span className="text-neutral-500">Reading content...</span>
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
                <a
                  href={browserTarget.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#1c1c26] hover:bg-[#252534] border border-[#2c2c3e] text-neutral-300 hover:text-white flex items-center gap-1.5 text-xs font-mono transition-colors cursor-pointer"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">External</span>
                </a>
                
                <button
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
