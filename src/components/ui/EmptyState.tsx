import React from "react";
import { Sparkles } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`py-12 px-4 flex flex-col items-center justify-center text-center space-y-3 select-none ${className}`}
    >
      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-neutral-400 shrink-0">
        {icon || <Sparkles size={18} className="text-[#ff7a00]" />}
      </div>

      <div className="space-y-1 max-w-sm">
        <h4 className="text-xs font-semibold text-slate-800 dark:text-neutral-200">{title}</h4>
        {description && (
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed font-sans">
            {description}
          </p>
        )}
      </div>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-1 px-3 py-1.5 rounded-lg bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold text-xs transition-all cursor-pointer shadow-sm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
