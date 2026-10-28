import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  ChevronRight,
  HelpCircle,
  PanelRight,
  MessageSquare,
  Bot,
} from "lucide-react";
import { Tooltip } from "./ui/Tooltip";
import { startOnboardingTour, highlightElement } from "../services/onboardingService";

export interface OnboardingMilestones {
  openedAgentDetail: boolean;
  openedChatList: boolean;
  // Deprecated compatibility milestones
  selectedAgent?: boolean;
  sentMessage?: boolean;
  openedSpecsOrTopology?: boolean;
  triedVoiceOrShortcuts?: boolean;
}

const STORAGE_KEY_CHECKLIST_DISMISSED = "agent360_onboarding_checklist_dismissed";
const STORAGE_KEY_MILESTONES = "agent360_onboarding_milestones_v2";

export function getStoredMilestones(): OnboardingMilestones {
  if (typeof window === "undefined") {
    return {
      openedAgentDetail: false,
      openedChatList: false,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MILESTONES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    openedAgentDetail: false,
    openedChatList: false,
  };
}

export function saveMilestones(milestones: OnboardingMilestones) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(milestones));
  } catch {}
}

export function recordMilestone(key: keyof OnboardingMilestones) {
  const current = getStoredMilestones();
  if (!current[key]) {
    current[key] = true;
    saveMilestones(current);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("agent360_milestone_updated", { detail: { key } }));
    }
  }
}

interface OnboardingChecklistWidgetProps {
  isBotInfoCollapsed?: boolean;
  isChatListCollapsed?: boolean;
  onToggleBotInfo?: () => void;
  onToggleChatList?: () => void;
  onFocusComposer?: () => void;
  variant?: "floating" | "inline";
}

export function OnboardingChecklistWidget({
  isBotInfoCollapsed = true,
  isChatListCollapsed = false,
  onToggleBotInfo,
  onToggleChatList,
  variant = "floating",
}: OnboardingChecklistWidgetProps) {
  const [milestones, setMilestones] = useState<OnboardingMilestones>(() => getStoredMilestones());
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY_CHECKLIST_DISMISSED) === "true";
    } catch {
      return false;
    }
  });

  // Default to minimized (collapsed) state as requested by the user
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem("agent360_onboarding_checklist_collapsed_v2");
      if (stored === null) return true; // Default minimized
      return stored === "true";
    } catch {
      return true;
    }
  });

  const handleToggleCollapse = (collapse?: boolean) => {
    setIsCollapsed((prev) => {
      const next = collapse !== undefined ? collapse : !prev;
      try {
        localStorage.setItem("agent360_onboarding_checklist_collapsed_v2", next ? "true" : "false");
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    const handler = () => {
      setMilestones(getStoredMilestones());
    };
    window.addEventListener("agent360_milestone_updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("agent360_milestone_updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  // Update milestone dynamically when sidebars open
  useEffect(() => {
    if (!isBotInfoCollapsed) {
      recordMilestone("openedAgentDetail");
    }
  }, [isBotInfoCollapsed]);

  useEffect(() => {
    if (!isChatListCollapsed) {
      recordMilestone("openedChatList");
    }
  }, [isChatListCollapsed]);

  const totalSteps = 2;
  const completedSteps = [
    milestones.openedAgentDetail,
    milestones.openedChatList,
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const isAllCompleted = completedSteps === totalSteps;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST_DISMISSED, "true");
      window.dispatchEvent(new CustomEvent("agent360_checklist_dismissed"));
    } catch {}
  };

  if (isDismissed && variant === "floating") return null;

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-[60] w-[calc(100vw-24px)] max-w-[320px] sm:max-w-[340px] shadow-xl animate-in slide-in-from-bottom-5 duration-300 bg-white/95 dark:bg-[#121218]/95 backdrop-blur-md border border-slate-200 dark:border-[#2a2a3a] rounded-2xl overflow-hidden text-neutral-200 font-sans select-none"
    >
      {/* Header bar */}
      <div className="px-3.5 py-2.5 bg-slate-50 dark:bg-[#181822] border-b border-slate-200 dark:border-[#222230] flex items-center justify-between">
        <div
          onClick={() => handleToggleCollapse()}
          className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
          title={isCollapsed ? "Bấm để mở rộng" : "Bấm để thu gọn"}
        >
          <div className="h-6 w-6 rounded-lg bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c] shrink-0">
            <Sparkles size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
              Làm quen cơ bản
            </h4>
            <p className="text-[10px] text-neutral-400 font-mono">
              {completedSteps}/{totalSteps} bước ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleToggleCollapse()}
            className="p-1 rounded text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-[10px] font-mono px-1.5 cursor-pointer"
          >
            {isCollapsed ? "Mở" : "Thu gọn"}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-md text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Đóng bảng hướng dẫn"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      <div className="h-0.5 w-full bg-[#1e1e2c]">
        <div
          className="h-full bg-gradient-to-r from-[#f8a87c] to-amber-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Expanded Checklist Steps (Minimal text + Tooltip for details) */}
      {!isCollapsed && (
        <div className="p-3 space-y-2">
          {/* Step 1: Agent Details Sidebar */}
          <div
            className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
              milestones.openedAgentDetail
                ? "bg-emerald-50/50 dark:bg-[#161622]/60 border-emerald-500/20 text-slate-700 dark:text-neutral-300"
                : "bg-slate-50 dark:bg-[#181826] border-slate-200 dark:border-[#2c2c3e] text-slate-900 dark:text-white hover:border-[var(--agent-primary)]/40"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="shrink-0">
                {milestones.openedAgentDetail ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : (
                  <Circle size={15} className="text-neutral-500" />
                )}
              </div>
              <Tooltip content="Bấm vào tên hoặc avatar Agent ở thanh header để xem Memory, Library và Routine" placement="top" minWidth={160}>
                <span className="text-xs font-medium cursor-help flex items-center gap-1 truncate">
                  <span>1. Chi tiết Agent</span>
                  <HelpCircle size={11} className="text-neutral-400 shrink-0" />
                </span>
              </Tooltip>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onToggleBotInfo) onToggleBotInfo();
                recordMilestone("openedAgentDetail");
              }}
              className="text-[10px] font-medium text-[#f8a87c] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded bg-[#f8a87c]/10 hover:bg-[var(--agent-bg-light)] dark:hover:bg-[var(--agent-bg-dark)]"
            >
              <span>{isBotInfoCollapsed ? "Mở" : "Đóng"}</span>
              <ChevronRight size={11} />
            </button>
          </div>

          {/* Step 2: Chat Sessions Sidebar */}
          <div
            className={`p-2 rounded-xl border transition-all flex items-center justify-between gap-2 ${
              milestones.openedChatList
                ? "bg-emerald-50/50 dark:bg-[#161622]/60 border-emerald-500/20 text-slate-700 dark:text-neutral-300"
                : "bg-slate-50 dark:bg-[#181826] border-slate-200 dark:border-[#2c2c3e] text-slate-900 dark:text-white hover:border-[var(--agent-primary)]/40"
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="shrink-0">
                {milestones.openedChatList ? (
                  <CheckCircle2 size={15} className="text-emerald-400" />
                ) : (
                  <Circle size={15} className="text-neutral-500" />
                )}
              </div>
              <Tooltip content="Bấm nút chat ở góc trên để mở danh sách các phiên trò chuyện của Agent" placement="top" minWidth={160}>
                <span className="text-xs font-medium cursor-help flex items-center gap-1 truncate">
                  <span>2. Danh sách Chat</span>
                  <HelpCircle size={11} className="text-neutral-400 shrink-0" />
                </span>
              </Tooltip>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onToggleChatList) onToggleChatList();
                recordMilestone("openedChatList");
              }}
              className="text-[10px] font-medium text-[#f8a87c] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded bg-[#f8a87c]/10 hover:bg-[var(--agent-bg-light)] dark:hover:bg-[var(--agent-bg-dark)]"
            >
              <span>{isChatListCollapsed ? "Mở" : "Đóng"}</span>
              <ChevronRight size={11} />
            </button>
          </div>

          {/* Footer Controls */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#222230] flex items-center justify-between">
            <button
              type="button"
              onClick={() => startOnboardingTour({ force: true })}
              className="text-[10.5px] font-medium text-[#f8a87c] hover:text-[#ff9433] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={12} />
              <span>Dẫn tham quan</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="text-[10px] text-neutral-400 hover:text-slate-800 dark:hover:text-neutral-200 font-mono transition-colors cursor-pointer hover:underline"
            >
              Đóng bảng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
