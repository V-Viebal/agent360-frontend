import { useState, useEffect } from "react";
import { InfraAgentsSidebar } from "../components/InfraAgentsSidebar";
import { AgentProfileHeader } from "../components/AgentProfileHeader";
import { ChatSessionCanvas } from "../components/ChatSessionCanvas";
import { CollapsibleSessionsRail } from "../components/CollapsibleSessionsRail";
import { CommandPaletteModal } from "../components/CommandPaletteModal";
import { SkillPoolModal } from "../components/SkillPoolModal";
import { TokenAnalyticsModal } from "../components/TokenAnalyticsModal";
import { MOCK_INFRA_AGENTS, MOCK_MESSAGES_BY_SESSION } from "../data/mockInfraAgents";
import { fetchInfraAgents, fetchAgentChats } from "../services/agentApi";
import {
  fetchPendingApprovals,
  approveToolExecution,
  denyToolExecution,
  PendingApproval,
} from "../services/approvalApi";
import { sendConsoleChatMessageStream } from "../services/chatStream";
import { ChatMessage, InfraAgent } from "../types/agent";

export function AgentWorkspace() {
  const [agents, setAgents] = useState<InfraAgent[]>(MOCK_INFRA_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [showSkillsModal, setShowSkillsModal] = useState<boolean>(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const liveAgents = await fetchInfraAgents();
        if (liveAgents && liveAgents.length > 0) {
          const liveChats = await fetchAgentChats();
          if (liveChats && liveChats.length > 0) {
            liveAgents[0].sessions = liveChats.slice(0, 10);
            liveAgents[0].activeSessionId = liveChats[0].id;
          }
          setAgents(liveAgents);
          setSelectedAgentId(liveAgents[0].id);
        }
      } catch (err) {
        console.error("Error loading live agents data", err);
      }
    }
    loadData();
  }, []);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const [activeSessionId, setActiveSessionId] = useState<string>(
    selectedAgent.activeSessionId || selectedAgent.sessions?.[0]?.id || "default"
  );

  // Poll approvals for active session periodically
  useEffect(() => {
    let mounted = true;
    async function checkApprovals() {
      try {
        const apps = await fetchPendingApprovals(activeSessionId);
        if (mounted) {
          setPendingApprovals(apps);
        }
      } catch (err) {
        // quiet poll
      }
    }

    checkApprovals();
    const interval = setInterval(checkApprovals, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeSessionId]);

  const [messagesMap, setMessagesMap] = useState(MOCK_MESSAGES_BY_SESSION);

  const handleSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    const target = agents.find((a) => a.id === agentId);
    if (target && target.sessions && target.sessions.length > 0) {
      setActiveSessionId(target.sessions[0].id);
    }
  };

  const handleModelChanged = (newModel: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === selectedAgent.id ? { ...a, model: newModel } : a))
    );
  };

  const currentMessages = messagesMap[activeSessionId] || [
    {
      id: "init-1",
      role: "assistant",
      content: `Hello! I am ${selectedAgent.name} provisioned on ${selectedAgent.node}. Connected through Agent360 Backend Gateway with Live SSE Stream, Tool Guard Approvals & Dynamic Model Slot Switch. How can I assist you today?`,
      reasoning: "Loaded Agent360 Core context and verified active QwenPaw backend channels.",
      timestamp: "Just now",
      evidenceStatus: "observed",
    },
  ];

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const initialAssistantMsgId = `bot-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: initialAssistantMsgId,
      role: "assistant",
      content: "...",
      reasoning: "Synthesizing prompt context and verifying execution boundaries...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      evidenceStatus: "observed",
      toolCalls: [],
    };

    const updatedList = [...currentMessages, userMsg, initialAssistantMsg];
    setMessagesMap((prev) => ({
      ...prev,
      [activeSessionId]: updatedList,
    }));

    const rawAgentId = selectedAgent.slug || selectedAgent.id.replace("bot:agent360:", "");

    const { text: finalAnswer, reasoning: finalReasoning } = await sendConsoleChatMessageStream(
      activeSessionId,
      text,
      rawAgentId,
      (streamedText) => {
        setMessagesMap((prev) => {
          const list = prev[activeSessionId] || [];
          return {
            ...prev,
            [activeSessionId]: list.map((m) =>
              m.id === initialAssistantMsgId ? { ...m, content: streamedText } : m
            ),
          };
        });
      },
      (streamedReasoning) => {
        setMessagesMap((prev) => {
          const list = prev[activeSessionId] || [];
          return {
            ...prev,
            [activeSessionId]: list.map((m) =>
              m.id === initialAssistantMsgId ? { ...m, reasoning: streamedReasoning } : m
            ),
          };
        });
      },
      (tool, args, result) => {
        setMessagesMap((prev) => {
          const list = prev[activeSessionId] || [];
          return {
            ...prev,
            [activeSessionId]: list.map((m) =>
              m.id === initialAssistantMsgId
                ? {
                    ...m,
                    toolCalls: [
                      ...(m.toolCalls || []),
                      { tool, args, result: result || "Completed with exit 0", exitCode: 0 },
                    ],
                  }
                : m
            ),
          };
        });
      }
    );

    // Finalize state
    setMessagesMap((prev) => {
      const list = prev[activeSessionId] || [];
      return {
        ...prev,
        [activeSessionId]: list.map((m) =>
          m.id === initialAssistantMsgId
            ? {
                ...m,
                content: finalAnswer || m.content,
                reasoning: finalReasoning || m.reasoning,
              }
            : m
        ),
      };
    });
  };

  const handleApproveTool = async (
    requestId: string,
    sessionId: string,
    scope: "exact" | "similar" = "exact"
  ) => {
    await approveToolExecution(requestId, sessionId, scope);
    setPendingApprovals((prev) => prev.filter((a) => a.request_id !== requestId));
  };

  const handleDenyTool = async (
    requestId: string,
    sessionId: string,
    reason?: string
  ) => {
    await denyToolExecution(requestId, sessionId, reason);
    setPendingApprovals((prev) => prev.filter((a) => a.request_id !== requestId));
  };

  const handleNewSession = () => {
    const newSessId = `sess-${Date.now().toString().slice(-4)}`;
    const newSession = {
      id: newSessId,
      title: `Session: Task #${(selectedAgent.sessions?.length || 0) + 1}`,
      updatedAt: "Just now",
      messageCount: 1,
      lastMessageSnippet: "Session created.",
    };

    setAgents((prev) =>
      prev.map((a) =>
        a.id === selectedAgent.id ? { ...a, sessions: [newSession, ...(a.sessions || [])] } : a
      )
    );

    setActiveSessionId(newSessId);
  };

  const activeSessionObj = selectedAgent.sessions?.find((s) => s.id === activeSessionId);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07090e] text-[#f4f3ef] font-sans">
      {/* 1. Left Sidebar: Agents loaded from Infra */}
      <InfraAgentsSidebar
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={handleSelectAgent}
      />

      {/* 2. Right Part */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top: Selected Agent Information */}
        <AgentProfileHeader
          agent={selectedAgent}
          onModelChanged={handleModelChanged}
          onRefresh={async () => {
            const live = await fetchInfraAgents();
            setAgents(live);
          }}
        />

        {/* Center: Selected Session Chat Space */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          <ChatSessionCanvas
            session={activeSessionObj}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            agentName={selectedAgent.name}
            pendingApprovals={pendingApprovals}
            onApproveTool={handleApproveTool}
            onDenyTool={handleDenyTool}
          />
        </div>

        {/* Bottom: Collapse Bar with Chat List of selected agent */}
        <CollapsibleSessionsRail
          sessions={selectedAgent.sessions || []}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewSession={handleNewSession}
          agentName={selectedAgent.name}
        />
      </div>

      {/* Cmd+K Command Palette Modal */}
      <CommandPaletteModal
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        agents={agents}
        onSelectAgent={handleSelectAgent}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
        onOpenSkills={() => setShowSkillsModal(true)}
      />

      {/* Floating Cmd+K Trigger Badge */}
      <button
        onClick={() => setShowCommandPalette(true)}
        className="fixed bottom-14 right-6 z-40 px-3 py-1.5 rounded-full bg-[#1c1713]/90 hover:bg-[#2b241e] border border-white/10 text-neutral-400 hover:text-white flex items-center gap-1.5 font-mono text-[11px] shadow-lg backdrop-blur cursor-pointer transition-colors"
        title="Open Command Palette"
      >
        <span>Cmd+K</span>
      </button>

      {/* Global Modals triggered from Command Palette */}
      {showSkillsModal && (
        <SkillPoolModal
          agentName={selectedAgent.name}
          onClose={() => setShowSkillsModal(false)}
        />
      )}

      {showAnalyticsModal && (
        <TokenAnalyticsModal
          onClose={() => setShowAnalyticsModal(false)}
        />
      )}
    </div>
  );
}
