import React, { useEffect } from "react";
import { X } from "lucide-react";

interface SlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
  actions?: React.ReactNode;
}

export function SlideOverDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-lg",
  actions,
}: SlideOverDrawerProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dim Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Surface */}
      <div
        className={`relative w-full ${width} bg-white dark:bg-[#14141c] border-l border-slate-200 dark:border-[#242432] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200 text-slate-900 dark:text-white`}
      >
        {/* Drawer Header */}
        <div className="h-14 px-5 border-b border-slate-200 dark:border-[#22222e] bg-white dark:bg-[#161622] flex items-center justify-between shrink-0">
          <div className="min-w-0 pr-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono truncate">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#252534] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:text-white transition-colors cursor-pointer"
            title="Đóng (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-sans">
          {children}
        </div>

        {/* Drawer Footer (Optional Actions) */}
        {actions && (
          <div className="p-4 border-t border-slate-200 dark:border-[#22222e] bg-white dark:bg-[#161622] flex items-center justify-end gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
