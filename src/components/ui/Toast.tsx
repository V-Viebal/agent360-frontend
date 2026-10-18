import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { playMicroClick } from "../../services/notificationService";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  message: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps {
  toast: ToastItem | null;
  onDismiss: () => void;
  className?: string;
}

export function Toast({ toast, onDismiss, className = "" }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration ?? 3500;
    if (duration <= 0) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const variantStyles: Record<ToastVariant, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    info: {
      bg: "bg-[#141824]/95 dark:bg-[#10141e]/95",
      border: "border-cyan-500/30",
      text: "text-cyan-200",
      icon: <Info size={14} className="text-cyan-400 shrink-0" />,
    },
    success: {
      bg: "bg-[#142018]/95 dark:bg-[#0e1a12]/95",
      border: "border-emerald-500/30",
      text: "text-emerald-200",
      icon: <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: "bg-[#221c14]/95 dark:bg-[#1a140c]/95",
      border: "border-amber-500/30",
      text: "text-amber-200",
      icon: <AlertTriangle size={14} className="text-amber-400 shrink-0" />,
    },
    error: {
      bg: "bg-[#241416]/95 dark:bg-[#1c0e10]/95",
      border: "border-red-500/30",
      text: "text-red-200",
      icon: <AlertCircle size={14} className="text-red-400 shrink-0" />,
    },
  };

  const style = variantStyles[toast.variant || "info"];

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-[100000] max-w-sm w-auto rounded-xl p-3 shadow-2xl backdrop-blur-md border font-sans text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none ${style.bg} ${style.border} ${style.text} ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-1">
        {style.icon}
        <div className="text-[11px] font-medium leading-tight truncate">{toast.message}</div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {toast.action && (
          <button
            type="button"
            onClick={() => {
              playMicroClick();
              toast.action?.onClick();
              onDismiss();
            }}
            className="px-2 py-0.5 rounded-lg font-semibold text-[10px] uppercase font-mono bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            {toast.action.label}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            playMicroClick();
            onDismiss();
          }}
          className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X size={12} />
        </button>
      </div>
    </div>,
    document.body
  );
}
