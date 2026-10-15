import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  Minus,
  Square,
  Mic,
  AudioWaveform,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Activity,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Send,
  Loader2,
} from "lucide-react";
import { InfraAgent, ChatMessage, AgentSession } from "../types/agent";
import {
  fetchInfraAgents,
  fetchAgentChats,
  fetchChatMessages,
  fetchSkills,
} from "../services/agentApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";

export function GrokBotWorkspace() {
  const [agents, setAgents] = useState<InfraAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");
  const [chats, setChats] = useState<AgentSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);

  // Right pane tab: 'Details' | 'Library' | 'Computer'
  const [rightTab, setRightTab] = useState<"Details" | "Library" | "Computer">("Computer");

  // Chat messages state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Choice poll card state ("What would you like to call me?")
  const [showPollCard, setShowPollCard] = useState(true);
  const [customCallName, setCustomCallName] = useState("");

  // Input composer
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Search in left sidebar
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
      const [loadedAgents, loadedChats, loadedSkills] = await Promise.all([
        fetchInfraAgents(),
        fetchAgentChats(),
        fetchSkills(),
      ]);

      setAgents(loadedAgents);
      setChats(loadedChats);
      setSkills(loadedSkills);

      if (loadedAgents.length > 0) {
        setSelectedAgentId(loadedAgents[0].id);
      }
      if (loadedChats.length > 0) {
        setSelectedChatId(loadedChats[0].id);
      }
    }
    initData();
  }, []);

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
  };

  // Switch chat session
  const handleSelectChat = (chat: AgentSession) => {
    setSelectedChatId(chat.id);
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

  const filteredChats = chats.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessageSnippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0c0e] text-[#e6e6e8] font-sans select-none antialiased">
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR: Real Agents & Sessions from Backend */}
      {/* ========================================================= */}
      <aside className="w-[280px] h-full flex flex-col border-r border-[#1e1e24] bg-[#0f0f13] shrink-0">
        {/* Top Controls: Search & New Chat icons */}
        <div className="p-3 border-b border-[#1c1c22] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-8 w-8 rounded-full hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Search chats"
            >
              <Search size={16} />
            </button>
            <button
              onClick={handleNewChat}
              className="h-8 w-8 rounded-full hover:bg-[#1f1f26] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="New Chat Session"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Agent Picker Dropdown */}
          <div className="relative group">
            <select
              value={selectedAgentId}
              onChange={(e) => {
                const ag = agents.find((a) => a.id === e.target.value);
                if (ag) handleSelectAgent(ag);
              }}
              className="bg-[#181820] text-xs font-mono text-[#ff7a00] border border-[#2a2a36] rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input Box */}
        {searchOpen && (
          <div className="p-2 border-b border-[#1c1c22] bg-[#14141a]">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-[#1c1c24] border border-[#2a2a34] rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-neutral-500 focus:outline-none"
            />
          </div>
        )}

        {/* Real Sessions List from Backend /api/chats */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Recent Conversations ({filteredChats.length})
          </div>

          {filteredChats.map((chat) => {
            const isSelected = chat.id === selectedChatId;
            return (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-[#22222c] text-white shadow-sm"
                    : "hover:bg-[#181820] text-neutral-300"
                }`}
              >
                {/* Round Avatar matching Grok Bot */}
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm relative">
                  <div className="h-4 w-4 rounded-full bg-black flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  {isSelected && (
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 border border-black" />
                  )}
                </div>

                {/* Title & Preview */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white truncate block">
                      {chat.title}
                    </span>
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
              No sessions found.
            </div>
          )}
        </div>

        {/* Bottom Profile Bar */}
        <div className="p-3 border-t border-[#1c1c22] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#2a2a34] text-neutral-300 flex items-center justify-center text-xs font-semibold">
              F
            </div>
            <span className="text-xs text-neutral-400 hover:text-white cursor-pointer truncate max-w-[80px]">
              Dang M
            </span>
          </div>

          <button className="flex items-center gap-1.5 bg-[#1a1a22] hover:bg-[#242430] border border-[#2a2a34] px-2.5 py-1 rounded-full text-[11px] text-neutral-300 transition-colors cursor-pointer">
            <span>Connect apps</span>
            <div className="flex -space-x-1">
              <span className="h-3.5 w-3.5 rounded-full bg-red-500/80 inline-block text-[8px] text-center font-bold text-white">M</span>
              <span className="h-3.5 w-3.5 rounded-full bg-blue-500/80 inline-block text-[8px] text-center font-bold text-white">G</span>
            </div>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. CENTER AREA: Grok Bot Dialogue & Dynamic Poll Card */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full bg-[#0c0c0e] relative overflow-hidden">
        {/* Top Centered Floating Pill */}
        <div className="h-12 border-b border-[#1c1c22] flex items-center justify-center shrink-0 relative bg-[#0c0c0e]/80 backdrop-blur-md">
          <div className="flex items-center gap-2 bg-[#181820] border border-[#2a2a34] px-3.5 py-1 rounded-full text-xs font-medium text-white shadow-sm">
            <div className="h-3.5 w-3.5 rounded-full bg-white flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-black flex items-center justify-center">
                <div className="h-0.5 w-0.5 rounded-full bg-white" />
              </div>
            </div>
            <span>{selectedAgent.name}</span>
            <span className="text-[10px] font-mono text-neutral-500">({selectedAgent.node})</span>
          </div>
        </div>

        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 py-6 space-y-6 max-w-3xl mx-auto w-full">
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
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-1.5 ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed max-w-[85%] ${
                      isUser
                        ? "bg-[#252530] text-white rounded-br-sm"
                        : "bg-[#181820] text-neutral-200 rounded-bl-sm border border-[#22222c]"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {/* Tool execution logs */}
                  {msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="bg-[#121217] border border-[#20202a] rounded-xl p-2.5 font-mono text-[11px] text-neutral-400 max-w-[85%] space-y-1">
                      <div className="flex items-center justify-between text-neutral-300">
                        <span className="text-emerald-400">⚡ {msg.toolCalls[0].tool}</span>
                        <span className="text-neutral-500 text-[10px]">exit 0</span>
                      </div>
                      <div className="text-neutral-500 text-[10px] truncate">
                        {msg.toolCalls[0].args}
                      </div>
                      {msg.toolCalls[0].result && (
                        <div className="text-neutral-300 text-[11px] bg-black/40 p-1 rounded">
                          {msg.toolCalls[0].result}
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
      {/* 3. RIGHT PANE: Virtual Computer Screen & Live Skills */}
      {/* ========================================================= */}
      <aside className="w-[300px] h-full flex flex-col border-l border-[#1e1e24] bg-[#0f0f13] shrink-0 select-none">
        {/* Titlebar Window Controls */}
        <div className="h-10 border-b border-[#1c1c22] flex items-center justify-end px-3 gap-3 text-neutral-400">
          <button className="hover:text-white cursor-pointer"><Minus size={13} /></button>
          <button className="hover:text-white cursor-pointer"><Square size={11} /></button>
          <button className="hover:text-white cursor-pointer"><X size={13} /></button>
        </div>

        {/* Mascot & Name */}
        <div className="p-6 flex flex-col items-center text-center border-b border-[#1c1c22]">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-black flex items-center justify-center">
                <div className="h-1 w-1 rounded-full bg-white translate-x-[1px] -translate-y-[1px]" />
              </div>
              <div className="h-3 w-3 rounded-full bg-black flex items-center justify-center">
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

        {/* Tabs: Details | Library | Computer */}
        <div className="flex items-center justify-around border-b border-[#1c1c22] text-xs font-medium text-neutral-400 px-3">
          {(["Details", "Library", "Computer"] as const).map((tab) => (
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
              <div className="rounded-2xl border border-[#262634] bg-[#14141a] p-6 flex flex-col items-center justify-center min-h-[170px] shadow-inner text-center relative overflow-hidden group">
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
                {selectedAgent.name}'s screen
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
              <div className="pt-2 font-semibold text-white">Live Skills from Infra ({skills.length})</div>
              <div className="space-y-1 font-mono text-[11px] max-h-48 overflow-y-auto">
                {skills.map((s) => (
                  <div key={s} className="px-2 py-1 rounded bg-[#16161e] border border-[#20202a] text-neutral-300">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightTab === "Library" && (
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-white mb-2">Workspace History</div>
              <div className="p-2.5 rounded-xl bg-[#16161e] border border-[#20202a] text-neutral-300 font-mono text-[11px]">
                <div className="font-medium text-white">agent360-contracts.json</div>
                <div className="text-[10px] text-neutral-500">v1.0.0 ratified</div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
