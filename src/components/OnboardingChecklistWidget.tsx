import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  ChevronRight,
} from "lucide-react";
import { startOnboardingTour } from "../services/onboardingService";

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
      className="fixed bottom-5 right-5 z-40 w-80 sm:w-88 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 bg-[#121218]/95 backdrop-blur-md border border-[#2a2a3a] rounded-2xl overflow-hidden text-neutral-200 font-sans"
    >
      <div className="px-4 py-3 bg-[#181822] border-b border-[#222230] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#ff7a00]/15 border border-[#ff7a00]/30 flex items-center justify-center text-[#ff7a00]">
            <Sparkles size={15} />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white tracking-wide">
              Bắt đầu với Agent360
            </h4>
            <p className="text-[10px] text-neutral-400 font-mono">
              {completedSteps}/{totalSteps} hoàn thành ({progressPercent}%)
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
                ? "bg-[#161622]/60 border-emerald-500/20 text-neutral-300"
                : "bg-[#181826] border-[#2c2c3e] text-white hover:border-[#ff7a00]/40"
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
                <span className="text-xs font-medium">1. Chọn AI Teammate</span>
                {milestones.selectedAgent && (
                  <span className="text-[10px] font-mono text-emerald-400">Xong</span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Chọn bot chuyên môn (SWE, SRE, QA, v.v.) từ thanh điều hướng bên trái.
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.sentMessage
                ? "bg-[#161622]/60 border-emerald-500/20 text-neutral-300"
                : "bg-[#181826] border-[#2c2c3e] text-white hover:border-[#ff7a00]/40"
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
                <span className="text-xs font-medium">2. Gửi lời thoại đầu tiên</span>
                {milestones.sentMessage ? (
                  <span className="text-[10px] font-mono text-emerald-400">Xong</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onFocusComposer && onFocusComposer()}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Nhập ngay <ChevronRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Nhập câu hỏi hoặc chọn một Recipe đề xuất để bắt đầu phiên hội thoại.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.openedSpecsOrTopology
                ? "bg-[#161622]/60 border-emerald-500/20 text-neutral-300"
                : "bg-[#181826] border-[#2c2c3e] text-white hover:border-[#ff7a00]/40"
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
                <span className="text-xs font-medium">3. Sơ đồ A2A & Chi tiết</span>
                {milestones.openedSpecsOrTopology ? (
                  <span className="text-[10px] font-mono text-emerald-400">Xong</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenTopology) onOpenTopology();
                      recordMilestone("openedSpecsOrTopology");
                    }}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Xem Sơ đồ <ChevronRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Xem mạng lưới liên kết bot A2A (Ctrl+G) hoặc thanh Agent Spec.
              </p>
            </div>
          </div>

          {/* Milestone 4 */}
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              milestones.triedVoiceOrShortcuts
                ? "bg-[#161622]/60 border-emerald-500/20 text-neutral-300"
                : "bg-[#181826] border-[#2c2c3e] text-white hover:border-[#ff7a00]/40"
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
                <span className="text-xs font-medium">4. Voice VAD & Phím tắt</span>
                {milestones.triedVoiceOrShortcuts ? (
                  <span className="text-[10px] font-mono text-emerald-400">Xong</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenShortcuts) onOpenShortcuts();
                      recordMilestone("triedVoiceOrShortcuts");
                    }}
                    className="text-[10px] font-medium text-[#ff7a00] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    Phím tắt (Ctrl+/) <ChevronRight size={11} />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Tận dụng phím tắt và chế độ nói rảnh tay (Alt + M) để tăng tốc thao tác.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-[#222230] flex items-center justify-between">
            <button
              type="button"
              onClick={() => startOnboardingTour({ force: true })}
              className="text-[11px] font-medium text-[#ff7a00] hover:text-[#ff9433] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={13} />
              <span>Chạy Tour tương tác</span>
            </button>

            {isAllCompleted ? (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={12} /> Hoàn thành 100%!
              </span>
            ) : (
              <button
                type="button"
                onClick={handleDismiss}
                className="text-[10px] text-neutral-400 hover:text-neutral-300 font-mono transition-colors cursor-pointer"
              >
                Ẩn bảng này
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
