import { ConnectAppsModal } from "../components/ConnectAppsModal";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
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
  AlertCircle,
  Sparkles,
  Copy,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession } from "../types/agent";
import {
  fetchInfraAgents,
  fetchAgentChats,
  fetchChatMessages,
  fetchSkills,
  fetchWorkspaceTree,
  fetchWorkspaceFileContent,
  WorkspaceTreeNode,
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { CustomSelect, StatusBadge, IconButton, SearchInput } from "../components/ui";


// QwenPaw-style Tool Execution Block
function QwenPawToolCard({ toolCall }: { toolCall: { tool: string; args?: string; result?: string; state?: "calling" | "success" | "error" } }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"args" | "result" | null>(null);

  const isCalling = toolCall.state === "calling";
  const isError = toolCall.state === "error";

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
                return <div key={lineIdx} className="h-1.5" />;
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lineIdx} className="text-xs font-bold text-neutral-100 pt-1 tracking-wide">
                    {trimmed.slice(4)}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lineIdx} className="text-sm font-bold text-white pt-2 border-b border-white/5 pb-1">
                    {trimmed.slice(3)}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lineIdx} className="text-base font-bold text-[#ff7a00] pt-2">
                    {trimmed.slice(2)}
                  </h2>
                );
              }
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2 text-neutral-300">
                    <span className="text-[#ff7a00] shrink-0 mt-1">•</span>
                    <span>{trimmed.slice(2)}</span>
                  </div>
                );
              }

              return (
                <p key={lineIdx} className="text-neutral-300">
                  {line}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function GrokBotWorkspace() {
  const [agents, setAgents] = useState<InfraAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [chats, setChats] = useState<AgentSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);

  // Rightmost bot info tab: 'Details' | 'Library' | 'Computer'
  const [rightTab, setRightTab] = useState<"Details" | "Library" | "Computer">("Computer");

  // Collapse states per user request
  // 1. isChatListCollapsed: collapse bar for conversation list
  const [isChatListCollapsed, setIsChatListCollapsed] = useState(false);
  // 2. isBotInfoCollapsed: collapse bar for rightmost bot information pane
  const [isBotInfoCollapsed, setIsBotInfoCollapsed] = useState(false);

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Choice poll card state ("What would you like to call me?")
  const [showPollCard, setShowPollCard] = useState(true);
  const [customCallName, setCustomCallName] = useState("");

  // Workspace Tree State
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceTreeNode[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Input composer
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
        setSelectedAgentId(loadedAgents[0].id);
      }
    }
    initData();
  }, []);

  // Fetch agent-specific chats whenever selectedAgentId changes
  useEffect(() => {
    if (!selectedAgentId) return;
    async function loadAgentChats() {
      const loadedChats = await fetchAgentChats(selectedAgentId);
      setChats(loadedChats);
      if (loadedChats.length > 0) {
        setSelectedChatId(loadedChats[0].id);
      } else {
        setSelectedChatId("");
      }
    }
    loadAgentChats();
  }, [selectedAgentId]);

  // When selectedChatId changes, fetch real messages
  useEffect(() => {
    if (!selectedChatId) return;

    let mounted = true;
    setIsLoadingMessages(true);

    fetchChatMessages(selectedChatId).then((loadedMsgs) => {
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
            content: `Hi! I'm ${curAgent?.name || "Grok Bot"}, running on ${curAgent?.node || "Fleet"}. I can execute commands, query skills, and take complex tasks off your plate.`,
            timestamp: "Just now",
            evidenceStatus: "observed",
          },
        ]);
        setShowPollCard(true);
      }
      setIsLoadingMessages(false);
    });

    return () => {
      mounted = false;
    };
  }, [selectedChatId, selectedAgentId]);

  const loadWorkspaceTree = async () => {
    setIsLoadingTree(true);
    try {
      const entries = await fetchWorkspaceTree();
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
      const content = await fetchWorkspaceFileContent(node.path);
      setFileContent(content);
    } finally {
      setIsLoadingFile(false);
    }
  };

  useEffect(() => {
    if (rightTab === "Library" && workspaceFiles.length === 0) {
      loadWorkspaceTree();
    }
  }, [rightTab]);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0] || {
    id: "default",
    name: "Grok Bot",
    slug: "grok-bot",
    roleTag: "Engineering",
    node: "3rd (ai.hmz.one)",
    status: "active",
    model: "grok-4.7",
    uptime: "Online",
    memoryUsageMb: 256,
    description: "Default Autonomous Agent",
    tools: [],
    sessions: [],
  };

  // Switch agent
  const handleSelectAgent = (agent: InfraAgent) => {
    setSelectedAgentId(agent.id);
    setMobileAgentsOpen(false);
  };

  // Switch chat session
  const handleSelectChat = (chat: AgentSession) => {
    setSelectedChatId(chat.id);
    setMobileChatsOpen(false);
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

  // Send message with streaming behavior
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isStreaming) return;

    const userText = inputText.trim();
    setInputText("");

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
        (toolName, args, result) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempBotMsgId
                ? {
                    ...m,
                    toolCalls: [
                      ...(m.toolCalls || []),
                      { tool: toolName, args: args, result: result, exitCode: 0 },
                    ],
                  }
                : m
            )
          );
        }
      );

      // Finalize
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempBotMsgId
            ? {
                ...m,
                content:
                  accumulated ||
                  `Completed instruction on ${selectedAgent.node} with exit code 0. Checked against constitution policy.`,
                evidenceStatus: "observed",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
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

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(agentSearchQuery.toLowerCase()) ||
      (a.roleTag && a.roleTag.toLowerCase().includes(agentSearchQuery.toLowerCase()))
  );

  const filteredChats = chats.filter(
    (c) =>
      c.title.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      c.lastMessageSnippet.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0c0e] text-[#e6e6e8] font-sans select-none antialiased relative">
      {/* ========================================================= */}
      {/* BACKDROP OVERLAY FOR MOBILE DRAWERS */}
      {/* ========================================================= */}
      {(mobileAgentsOpen || mobileChatsOpen || mobileBotInfoOpen) && (
        <div
          onClick={() => {
            setMobileAgentsOpen(false);
            setMobileChatsOpen(false);
            setMobileBotInfoOpen(false);
          }}
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR: Real Agents Loaded From Infra */}
      {/* ========================================================= */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-[260px] h-full flex flex-col border-r border-[#1e1e24] bg-[#0d0d12] shrink-0 transition-transform duration-200 ease-in-out ${
          mobileAgentsOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-[#1c1c22] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-[#ff7a00]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-white font-mono">
              Infra Agents
            </span>
          </div>
          <CustomSelect
            value={selectedAgentId}
            onChange={(val) => {
              const ag = agents.find((a) => a.id === val);
              if (ag) handleSelectAgent(ag);
            }}
            options={agents.map((ag) => ({
              value: ag.id,
              label: ag.name,
              badge: ag.roleTag,
              description: ag.model,
            }))}
            triggerClassName="px-2 py-1 text-[11px]"
          />
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
                    <StatusBadge status={(ag.status === "degraded" ? "stopped" : ag.status) || "active"} text={ag.roleTag || "Fleet"} className="shrink-0" />
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

        {/* Bottom Profile Bar */}
        <div className="p-3 border-t border-[#1c1c22] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#2a2a34] text-neutral-300 flex items-center justify-center text-xs font-semibold">
              F
            </div>
            <span className="text-xs text-neutral-400 truncate max-w-[80px]">
              Dang M
            </span>
          </div>

          <button
            onClick={() => setIsConnectAppsOpen(true)}
            className="flex items-center gap-1.5 bg-[#1a1a22] hover:bg-[#242430] border border-[#2a2a34] px-2.5 py-1 rounded-full text-[11px] text-neutral-300 transition-colors cursor-pointer"
          >
            <span>Connect apps</span>
            <div className="flex -space-x-1">
              <span className="h-3.5 w-3.5 rounded-full bg-red-500/80 inline-block text-[8px] text-center font-bold text-white">
                M
              </span>
              <span className="h-3.5 w-3.5 rounded-full bg-blue-500/80 inline-block text-[8px] text-center font-bold text-white">
                G
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. CENTER AREA: Grok Bot Chat & Dialogue Content */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#0c0c0e] relative overflow-hidden min-w-0">
        {/* Top Centered Floating Capsule: Trigger Collapses Bot Info */}
        <div className="h-12 border-b border-[#1c1c22] flex items-center justify-between px-3 shrink-0 relative bg-[#0c0c0e]/80 backdrop-blur-md z-10">
          {/* Left button: mobile drawer for Agents */}
          <button
            onClick={() => setMobileAgentsOpen(!mobileAgentsOpen)}
            className="lg:hidden h-8 w-8 rounded-lg bg-[#181820] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
            title="Toggle Agents Sidebar"
          >
            <Menu size={16} />
          </button>

          {/* CAPSULE INFO BOT: Click triggers collapse / expand of rightmost bot info */}
          <div
            onClick={() => {
              setIsBotInfoCollapsed((prev) => !prev);
            }}
            className="flex items-center gap-2 bg-[#181820] hover:bg-[#22222e] border border-[#2a2a34] hover:border-[#383848] px-3.5 py-1 rounded-full text-xs font-medium text-white shadow-sm mx-auto cursor-pointer transition-all select-none group"
            title="Click to toggle Bot Information panel"
          >
            <div className="h-3.5 w-3.5 rounded-full bg-white flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-black flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-white" />
              </div>
            </div>
            <span className="truncate max-w-[120px] sm:max-w-none">{selectedAgent.name}</span>
            <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
              ({selectedAgent.node})
            </span>
            <span className="text-[9px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-1.5 py-0.2 rounded ml-1 group-hover:bg-[#ff7a00]/20">
              {isBotInfoCollapsed ? "Info ▸" : "Info ▾"}
            </span>
          </div>

          {/* Right button: mobile drawer for Conversations */}
          <button
            onClick={() => setMobileChatsOpen(!mobileChatsOpen)}
            className="lg:hidden h-8 w-8 rounded-lg bg-[#181820] border border-[#242430] flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
            title="Toggle Conversations list"
          >
            <MessageSquare size={16} />
          </button>
        </div>

        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 space-y-6 max-w-3xl mx-auto w-full">
          {/* Timestamp Header */}
          <div className="text-center">
            <span className="text-[11px] font-mono text-neutral-500 bg-[#16161c] px-3 py-0.5 rounded-full">
              Live Fleet Stream • {selectedAgent.uptime}
            </span>
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
                  {/* If user message: Clean right-aligned bubble */}
                  {isUser ? (
                    <div className="rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed max-w-[85%] bg-[#282834] text-white rounded-br-sm shadow-md font-sans border border-[#343444]">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
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
                                    {step.text}
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

                      {/* 2. Formatted Main Response Content */}
                      {msg.content && (
                        <div className="rounded-2xl p-4 text-[13px] leading-relaxed bg-[#15151c] text-neutral-200 rounded-tl-sm border border-[#22222d] shadow-sm">
                          <FormattedMessageContent content={msg.content} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Interactive Choice Card from Grok Bot */}
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

        {/* Bottom Floating Pill Composer */}
        <div className="p-4 bg-transparent shrink-0 max-w-3xl mx-auto w-full">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 bg-[#16161d] border border-[#262632] rounded-full px-4 py-2.5 shadow-xl focus-within:border-neutral-500 transition-colors"
          >
            <button
              type="button"
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <Plus size={16} />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${selectedAgent.name}...`}
              disabled={isStreaming}
              className="flex-1 bg-transparent border-0 text-xs text-white placeholder:text-neutral-500 focus:outline-none disabled:opacity-50"
            />

            {isStreaming ? (
              <Loader2 size={16} className="animate-spin text-[#ff7a00]" />
            ) : (
              <div className="flex items-center gap-2 text-neutral-400">
                <button
                  type="button"
                  className="hover:text-white transition-colors cursor-pointer p-0.5"
                  title="Voice Input"
                >
                  <Mic size={15} />
                </button>
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="hover:text-white disabled:opacity-30 transition-colors cursor-pointer p-0.5"
                  title="Send Message"
                >
                  <Send size={15} />
                </button>
              </div>
            )}
          </form>
        </div>
      </main>

      {/* ========================================================= */}
      {/* 3. CONVERSATION SESSIONS LIST (COLLAPSIBLE, RIGHT OF CHAT) */}
      {/* ========================================================= */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 lg:right-auto z-30 h-full flex flex-col border-l border-[#1e1e24] bg-[#0f0f14] shrink-0 transition-all duration-200 ease-in-out ${
          isChatListCollapsed ? "lg:w-[48px]" : "w-[260px] sm:w-[280px]"
        } ${mobileChatsOpen ? "translate-x-0 shadow-2xl" : "translate-x-full lg:translate-x-0"}`}
      >
        {/* Header & Collapse Toggle */}
        <div className="p-3 border-b border-[#1c1c22] flex items-center justify-between">
          {!isChatListCollapsed && (
            <div className="flex items-center gap-1.5 min-w-0">
              <button
                onClick={() => setChatSearchOpen(!chatSearchOpen)}
                className="h-7 w-7 rounded-full hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Search chats"
              >
                <Search size={14} />
              </button>
              <button
                onClick={handleNewChat}
                className="h-7 w-7 rounded-full hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="New Chat Session"
              >
                <Plus size={16} />
              </button>
              <span className="text-[11px] font-mono text-neutral-400 truncate ml-1">
                Chats ({chats.length})
              </span>
            </div>
          )}

          {/* Collapse bar trigger for conversations */}
          <button
            onClick={() => setIsChatListCollapsed(!isChatListCollapsed)}
            className="h-7 w-7 rounded-lg hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer ml-auto"
            title={isChatListCollapsed ? "Expand Chat List" : "Collapse Chat List"}
          >
            {isChatListCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Collapsed rail preview icons */}
        {isChatListCollapsed ? (
          <div className="flex-1 flex flex-col items-center py-4 space-y-3">
            <button
              onClick={handleNewChat}
              className="h-8 w-8 rounded-full bg-[#1c1c24] hover:bg-[#ff7a00] hover:text-white text-neutral-300 flex items-center justify-center transition-colors cursor-pointer"
              title="New Chat"
            >
              <Plus size={16} />
            </button>
            <div className="w-5 h-[1px] bg-[#22222e]" />
            <div className="flex-1 overflow-y-auto space-y-2 flex flex-col items-center">
              {chats.slice(0, 8).map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectChat(c)}
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-mono cursor-pointer transition-colors ${
                    c.id === selectedChatId
                      ? "bg-[#ff7a00] text-white font-bold"
                      : "bg-[#181820] text-neutral-400 hover:text-white hover:bg-[#22222e]"
                  }`}
                  title={c.title}
                >
                  {c.title.slice(0, 1).toUpperCase()}
                </div>
              ))}
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
        className={`fixed xl:static inset-y-0 right-0 z-40 h-full flex flex-col border-l border-[#1e1e24] bg-[#0f0f13] shrink-0 select-none transition-all duration-200 ease-in-out ${
          isBotInfoCollapsed
          ? "w-0 overflow-hidden border-none pointer-events-none translate-x-full xl:w-0"
          : "w-[300px] sm:w-[320px] border-l border-[#1e1e24] translate-x-0 xl:translate-x-0"
        }`}
      >
        {!isBotInfoCollapsed && (
          <>
            {/* Clean Header: Window controls removed per user request */}
            <div className="h-10 border-b border-[#1c1c22] flex items-center px-3">
              <span className="text-[11px] font-mono text-neutral-400">Agent Specification</span>
            </div>

            {/* Mascot & Name */}
            <div className="p-5 flex flex-col items-center text-center border-b border-[#1c1c22]">
              <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shadow-lg mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-black flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-white translate-x-[1px] -translate-y-[1px]" />
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-black flex items-center justify-center">
                    <div className="h-1 w-1 rounded-full bg-white translate-x-[1px] -translate-y-[1px]" />
                  </div>
                </div>
              </div>

              <h2 className="text-sm font-semibold text-white tracking-tight">
                {selectedAgent.name}
              </h2>
              <span className="text-[10px] font-mono text-[#ff7a00] bg-[#ff7a00]/10 px-2 py-0.5 rounded-full mt-1">
                {selectedAgent.model}
              </span>
            </div>

            {/* Tabs: Computer | Details | Library */}
            <div className="flex items-center justify-around border-b border-[#1c1c22] text-xs font-medium text-neutral-400 px-3">
              {(["Computer", "Details", "Library"] as const).map((tab) => (
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
            <div className="flex-1 p-4 overflow-y-auto">
              {rightTab === "Computer" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#262634] bg-[#14141a] p-5 flex flex-col items-center justify-center min-h-[160px] shadow-inner text-center relative overflow-hidden group">
                    <div className="h-9 w-9 rounded-full bg-[#1f1f2a] flex items-center justify-center text-neutral-400 mb-2">
                      <Pause size={14} className="text-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-xs font-medium text-neutral-200">
                      Virtual Computer Active
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 mt-1">
                      Connected to {selectedAgent.node}
                    </span>
                  </div>

                  <div className="text-center text-[11px] text-neutral-500 font-mono">
                    {selectedAgent.name}'s virtual host
                  </div>

                  {/* Real Host Telemetry */}
                  <div className="bg-[#14141a] border border-[#1e1e26] rounded-xl p-3 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>Node:</span>
                      <span className="text-white">{selectedAgent.node}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Status:</span>
                      <span className="text-emerald-400">running (HTTP 200)</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Backend:</span>
                      <span className="text-neutral-300">qwenpaw / acp</span>
                    </div>
                  </div>
                </div>
              )}

              {rightTab === "Details" && (
                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="font-semibold text-white">Description</div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {selectedAgent.description}
                  </p>
                  <div className="pt-2 font-semibold text-white">
                    Live Skills from Infra ({skills.length})
                  </div>
                  <div className="space-y-1 font-mono text-[11px] max-h-48 overflow-y-auto">
                    {skills.map((s) => (
                      <div
                        key={s}
                        className="px-2 py-1 rounded bg-[#16161e] border border-[#20202a] text-neutral-300"
                      >
                        {s}
                      </div>
                    ))}
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

      {/* Connect Apps Modal */}
      <ConnectAppsModal
        isOpen={isConnectAppsOpen}
        onClose={() => setIsConnectAppsOpen(false)}
      />
    </div>
  );
}
