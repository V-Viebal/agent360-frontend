import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { startOnboardingTour, highlightElement } from "../services/onboardingService";

export interface OnboardingMilestones {
  selectedAgent: boolean;
  sentMessage: boolean;
  openedSpecsOrTopology: boolean;
  triedVoiceOrShortcuts: boolean;
}

const STORAGE_KEY_CHECKLIST_DISMISSED = "agent360_onboarding_checklist_dismissed";
const STORAGE_KEY_MILESTONES = "agent360_onboarding_milestones";

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
  onOpenTopology?: () => void;
  onOpenShortcuts?: () => void;
  onOpenSpecs?: () => void;
  onFocusComposer?: () => void;
  variant?: "floating" | "inline";
}

export function OnboardingChecklistWidget({
  onOpenTopology,
  onOpenShortcuts,
  onOpenSpecs,
  onFocusComposer,
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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

  const totalSteps = 4;
  const completedSteps = [
    milestones.selectedAgent,
    milestones.sentMessage,
    milestones.openedSpecsOrTopology,
    milestones.triedVoiceOrShortcuts,
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);
  const isAllCompleted = completedSteps === totalSteps;

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST_DISMISSED, "true");
    } catch {}
  };

  if (isDismissed && variant === "floating") return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 w-80 sm:w-88 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 bg-white/95 dark:bg-[#121218]/95 backdrop-blur-md border border-slate-200 dark:border-[#2a2a3a] rounded-2xl overflow-hidden text-neutral-200 font-sans"
    >
      <div className="px-4 py-3 bg-slate-50 dark:bg-[#181822] border-b border-slate-200 dark:border-[#222230] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#ff7a00]/15 border border-[#ff7a00]/30 flex items-center justify-center text-[#ff7a00]">
            <Sparkles size={15} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-wide">
              Làm quen cùng đội ngũ AI
            </h4>
            <p className="text-[10px] text-neutral-400 font-mono">
              {completedSteps}/{totalSteps} bước ({progressPercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-white/5 transition-colors text-[11px] font-mono px-1.5 cursor-pointer"
          >
            {isCollapsed ? "Mở rộng" : "Thu gọn"}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Đóng bảng hướng dẫn"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="h-1 w-full bg-[#1e1e2c]">
        <div
          className="h-full bg-gradient-to-r from-[#ff7a00] to-amber-400 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {!isCollapsed && (
        <div className="p-3.5 space-y-2.5">
          {/* Milestone 1 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.selectedAgent
                ? "bg-emerald-50/50 dark:bg-[#161622]/60 border-emerald-500/20 text-slate-700 dark:text-neutral-300"
                : "bg-slate-50 dark:bg-[#181826] border-slate-200 dark:border-[#2c2c3e] text-slate-900 dark:text-white hover:border-[#ff7a00]/40"
            } flex items-start gap-2.5`}
          >
            <div className="mt-0.5 shrink-0">
              {milestones.selectedAgent ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Circle size={16} className="text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">1. Chọn đồng đội bạn muốn làm việc cùng</span>
                {milestones.selectedAgent && (
                  <span className="text-[10px] font-mono text-emerald-400">Đã chọn</span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Xem danh sách đồng đội ở cột bên trái: Lập trình viên (SWE), Vận hành (SRE), Kiểm thử (QA), v.v.
              </p>
              {!milestones.selectedAgent && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => highlightElement("#tour-agent-selector", "Danh sách đồng đội", "Bấm chọn bạn đồng đội bạn muốn giao việc ở đây nhé", "right")}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Chỉ cho tôi chỗ chọn <ChevronRight size={11} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Milestone 2 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.sentMessage
                ? "bg-emerald-50/50 dark:bg-[#161622]/60 border-emerald-500/20 text-slate-700 dark:text-neutral-300"
                : "bg-slate-50 dark:bg-[#181826] border-slate-200 dark:border-[#2c2c3e] text-slate-900 dark:text-white hover:border-[#ff7a00]/40"
            } flex items-start gap-2.5`}
          >
            <div className="mt-0.5 shrink-0">
              {milestones.sentMessage ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Circle size={16} className="text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">2. Giao việc đầu tiên cho đồng đội</span>
                {milestones.sentMessage ? (
                  <span className="text-[10px] font-mono text-emerald-400">Đã gửi</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onFocusComposer && onFocusComposer()}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Gõ lời nhắn ngay <ChevronRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Hỏi một câu bất kỳ hoặc bấm một gợi ý có sẵn để bạn ấy bắt tay vào làm việc ngay.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.openedSpecsOrTopology
                ? "bg-emerald-50/50 dark:bg-[#161622]/60 border-emerald-500/20 text-slate-700 dark:text-neutral-300"
                : "bg-slate-50 dark:bg-[#181826] border-slate-200 dark:border-[#2c2c3e] text-slate-900 dark:text-white hover:border-[#ff7a00]/40"
            } flex items-start gap-2.5`}
          >
            <div className="mt-0.5 shrink-0">
              {milestones.openedSpecsOrTopology ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Circle size={16} className="text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">3. Xem sơ đồ phối hợp giữa các bạn</span>
                {milestones.openedSpecsOrTopology ? (
                  <span className="text-[10px] font-mono text-emerald-400">Đã xem</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenTopology) onOpenTopology();
                      recordMilestone("openedSpecsOrTopology");
                    }}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Mở sơ đồ mạng lưới <ChevronRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Xem các bạn bot phối hợp công việc với nhau thế nào (phím Ctrl + G).
              </p>
            </div>
          </div>

          {/* Milestone 4 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.triedVoiceOrShortcuts
                ? "bg-emerald-50/50 dark:bg-[#161622]/60 border-emerald-500/20 text-slate-700 dark:text-neutral-300"
                : "bg-slate-50 dark:bg-[#181826] border-slate-200 dark:border-[#2c2c3e] text-slate-900 dark:text-white hover:border-[#ff7a00]/40"
            } flex items-start gap-2.5`}
          >
            <div className="mt-0.5 shrink-0">
              {milestones.triedVoiceOrShortcuts ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <Circle size={16} className="text-neutral-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">4. Nói chuyện rảnh tay hoặc xem phím tắt</span>
                {milestones.triedVoiceOrShortcuts ? (
                  <span className="text-[10px] font-mono text-emerald-400">Đã biết</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenShortcuts) onOpenShortcuts();
                      recordMilestone("triedVoiceOrShortcuts");
                    }}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Xem phím tắt (Ctrl+/) <ChevronRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Bật micro (Alt + M) để nói trực tiếp, hoặc dùng phím tắt để làm việc nhanh hơn.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#222230] flex items-center justify-between">
            <button
              type="button"
              onClick={() => startOnboardingTour({ force: true })}
              className="text-[11px] font-medium text-[#ff7a00] hover:text-[#ff9433] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Dẫn tôi đi tham quan 1 vòng</span>
            </button>

            {isAllCompleted ? (
              <button
                type="button"
                onClick={handleDismiss}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="Bấm để đóng bảng và bắt đầu làm việc ngay"
              >
                <CheckCircle2 size={13} />
                <span>Đã sẵn sàng làm việc! ✕</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDismiss}
                className="text-[10px] text-neutral-400 hover:text-neutral-300 font-mono transition-colors cursor-pointer hover:underline"
                title="Đóng bảng và không hiển thị lại"
              >
                Đã hiểu, đóng bảng này
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
