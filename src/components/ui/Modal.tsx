import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
  bodyClassName?: string;
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

/**
 * Standard Skyer Modal Backdrop and Container Primitive
 * Provides portal rendering, backdrop blur, ESC dismiss, and clean styling.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  maxWidth = "md",
  className = "",
  bodyClassName = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthMap[maxWidth]} rounded-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] shadow-2xl overflow-hidden font-sans text-xs flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150 ring-1 ring-black/5 dark:ring-white/10 ${className}`}
      >
        {/* Header */}
        {(title || icon) && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#181822] border-b border-slate-200 dark:border-[#242432] flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2 min-w-0">
              {icon && <span className="shrink-0 text-[#f8a87c]">{icon}</span>}
              {typeof title === "string" ? (
                <span className="font-semibold text-slate-800 dark:text-white tracking-wide uppercase font-mono truncate">
                  {title}
                </span>
              ) : (
                title
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              data-ux-target-min="24"
              aria-label="Close modal"
              className="p-1 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-[#232330] transition-colors cursor-pointer shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`overflow-y-auto ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
