import React, { useEffect } from "react";
import { Modal } from "./Modal";
import { AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";
import { playMicroClick } from "../../services/notificationService";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy bỏ",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isLoading) {
        e.preventDefault();
        playMicroClick();
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, isLoading]);

  const icon =
    variant === "danger" ? (
      <AlertCircle size={18} className="text-red-500" />
    ) : variant === "warning" ? (
      <AlertTriangle size={18} className="text-amber-500" />
    ) : (
      <HelpCircle size={18} className="text-[#f8a87c]" />
    );

  const confirmBtnClass =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : variant === "warning"
      ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold"
      : "bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={icon}
      maxWidth="sm"
    >
      <div className="p-5 space-y-4">
        <div className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed font-sans">
          {description}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              playMicroClick();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-[#2a2a3a] text-slate-600 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              playMicroClick();
              onConfirm();
            }}
            className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 ${confirmBtnClass}`}
          >
            {isLoading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
