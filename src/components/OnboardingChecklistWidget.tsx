import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  ChevronRight,
  Bot,
  MessageSquare,
  Workflow,
  Mic,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";
import { startOnboardingTour } from "../services/onboardingService";

export interface OnboardingMilestones {
  selectedAgent: boolean;
  sentMessage: boolean;
  openedSpecsOrTopology: boolean;
  triedVoiceOrShortcuts: boolean;
}

const STORAGE_KEY_CHECKLIST_DISMISSED = "agent360_onboarding_checklist_dismissed_v3";
const STORAGE_KEY_MILESTONES = "agent360_onboarding_milestones_v3";

export function getStoredMilestones(): OnboardingMilestones {
  if (typeof window === "undefined") {
    return {
      selectedAgent: false,
      sentMessage: false,
      openedSpecsOrTopology: false,
      triedVoiceOrShortcuts: false,
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MILESTONES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    selectedAgent: false,
    sentMessage: false,
    openedSpecsOrTopology: false,
    triedVoiceOrShortcuts: false,
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
  onToggleAgentsList?: () => void;
  isBotInfoCollapsed?: boolean;
  isChatListCollapsed?: boolean;
  onToggleBotInfo?: () => void;
  onToggleChatList?: () => void;
  onFocusComposer?: () => void;
  variant?: "floating" | "inline";
  themeColor?: string;
}

export function OnboardingChecklistWidget({
  onToggleAgentsList,
  isBotInfoCollapsed = true,
  isChatListCollapsed = false,
  onToggleBotInfo,
  onToggleChatList,
  onFocusComposer,
  variant = "floating",
  themeColor,
}: OnboardingChecklistWidgetProps) {
  const primaryColor = themeColor || "#f8a87c";
  const { t } = useTranslation();
  const [milestones, setMilestones] = useState<OnboardingMilestones>(() => getStoredMilestones());
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY_CHECKLIST_DISMISSED) === "true";
    } catch {
      return false;
    }
  });

  // Default to collapsed for lean UI
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const stored = localStorage.getItem("agent360_onboarding_collapsed_v3");
      if (stored === null) return true;
      return stored === "true";
    } catch {
      return true;
    }
  });

  const handleToggleCollapse = (collapse?: boolean) => {
    setIsCollapsed((prev) => {
      const next = collapse !== undefined ? collapse : !prev;
      try {
        localStorage.setItem("agent360_onboarding_collapsed_v3", next ? "true" : "false");
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

  // 4 lean steps
  const steps = [
    {
      id: "selectedAgent" as const,
      num: 1,
      title: t("onboarding.step1Title") || "1. Chọn đồng đội AI",
      icon: Bot,
      done: milestones.selectedAgent,
      action: () => {
        if (onToggleAgentsList) onToggleAgentsList();
        recordMilestone("selectedAgent");
      },
    },
    {
      id: "sentMessage" as const,
      num: 2,
      title: t("onboarding.step2Title") || "2. Giao việc đầu tiên",
      icon: MessageSquare,
      done: milestones.sentMessage,
      action: () => {
        if (onFocusComposer) onFocusComposer();
        recordMilestone("sentMessage");
      },
    },
    {
      id: "openedSpecsOrTopology" as const,
      num: 3,
      title: t("onboarding.step3Title") || "3. Xem hồ sơ & kỹ năng",
      icon: Workflow,
      done: milestones.openedSpecsOrTopology,
      action: () => {
        if (onToggleBotInfo) onToggleBotInfo();
        recordMilestone("openedSpecsOrTopology");
      },
    },
    {
      id: "triedVoiceOrShortcuts" as const,
      num: 4,
      title: t("onboarding.step4Title") || "4. Cuộc trò chuyện & Kênh",
      icon: MessageSquare,
      done: milestones.triedVoiceOrShortcuts,
      action: () => {
        if (onToggleChatList) onToggleChatList();
        recordMilestone("triedVoiceOrShortcuts");
      },
    },
  ];

  const totalSteps = 4;
  const completedSteps = [
    milestones.selectedAgent,
    milestones.sentMessage,
    milestones.openedSpecsOrTopology,
    milestones.triedVoiceOrShortcuts,
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST_DISMISSED, "true");
    } catch {}
  };

  if (isDismissed && variant === "floating") return null;

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-[60] w-[calc(100vw-24px)] max-w-[270px] shadow-lg animate-in slide-in-from-bottom-4 duration-200 bg-white/95 dark:bg-[#11131a]/95 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden font-sans select-none"
    >
      {/* Lean Header Bar */}
      <div className="px-3 py-2 bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-200 dark:border-white/10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleToggleCollapse()}
          className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
        >
          <div className="h-5 w-5 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}>
            <Sparkles size={11} />
          </div>
          <div className="min-w-0 flex-1 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-900 dark:text-white truncate">
              {t("onboarding.title") || "Làm quen"}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {completedSteps}/4
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => handleToggleCollapse()}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ChevronDown size={12} className={`transition-transform duration-200 ${isCollapsed ? "-rotate-90" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            title={t("onboarding.dismiss") || "Đóng"}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="h-0.5 w-full bg-neutral-100 dark:bg-white/5">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progressPercent}%`, backgroundColor: primaryColor }}
        />
      </div>

      {/* Lean Step List */}
      {!isCollapsed && (
        <div className="p-2 space-y-1">
          {steps.map((st) => {
            return (
              <button
                key={st.id}
                type="button"
                onClick={st.action}
                className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  st.done
                    ? "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                    : "text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {st.done ? (
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  ) : (
                    <Circle size={13} className="text-neutral-400 shrink-0" />
                  )}
                  <span className={`text-[11px] truncate ${st.done ? "line-through opacity-70" : "font-medium"}`}>
                    {st.title}
                  </span>
                </div>
                <ChevronRight size={10} className="text-neutral-400 shrink-0 opacity-60" />
              </button>
            );
          })}

          {/* Quick Tour Link */}
          <div className="pt-1.5 mt-1 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between px-1 text-[10px]">
            <button
              type="button"
              onClick={() => startOnboardingTour({ force: true })}
              className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
              style={{ color: primaryColor }}
            >
              <span>Tham quan 1 vòng</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
