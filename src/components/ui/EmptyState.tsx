import React from "react";
import { Sparkles, LucideIcon } from "lucide-react";

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  badge?: string;
  title: string;
  description?: string;
  tip?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  extraAction?: EmptyStateAction;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EmptyState({
  icon,
  badge,
  title,
  description,
  tip,
  action,
  secondaryAction,
  extraAction,
  className = "",
  size = "md",
}: EmptyStateProps) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  const renderButton = (act: EmptyStateAction, key: string) => {
    const isPrimary = act.variant === "primary" || !act.variant;
    const isOutline = act.variant === "outline";
    const isSecondary = act.variant === "secondary";

    let btnClass = "px-4 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer select-none shadow-xs";

    if (isPrimary) {
      btnClass += " bg-[#f8a87c] hover:opacity-90 text-black shadow-md shadow-[#f8a87c]/20 hover:scale-[1.02] active:scale-[0.98]";
    } else if (isOutline) {
      btnClass += " bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white";
    } else if (isSecondary) {
      btnClass += " bg-slate-100 dark:bg-[#181824] hover:bg-slate-200 dark:hover:bg-[#20202e] border border-slate-200 dark:border-[#2a2a3c] text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white";
    } else {
      btnClass += " text-neutral-400 hover:text-white hover:bg-white/5";
    }

    if (act.disabled) {
      btnClass += " opacity-60 cursor-not-allowed pointer-events-none";
    }

    return (
      <button
        key={key}
        type="button"
        onClick={act.onClick}
        disabled={act.disabled}
        className={btnClass}
      >
        {act.icon && <span className="shrink-0">{act.icon}</span>}
        <span className="whitespace-nowrap">{act.label}</span>
        {act.badge && (
          <span className="px-1.5 py-0.5 rounded-md bg-black/20 text-[9px] font-mono uppercase tracking-wider font-bold">
            {act.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center select-none animate-in fade-in duration-300 ${
        isLarge ? "py-16 px-6 space-y-5" : isSmall ? "py-8 px-3 space-y-2.5" : "py-12 px-4 space-y-3.5"
      } ${className}`}
    >
      {/* Visual Aura & Multi-layer Container */}
      <div className="relative flex items-center justify-center mb-1">
        {/* Glow halo */}
        <div className="absolute -inset-2 rounded-full bg-[#f8a87c]/10 blur-xl pointer-events-none" />
        
        {/* Outer Tech Circle */}
        <div className={`relative rounded-3xl bg-slate-50 dark:bg-[#12121a] border border-[#f8a87c]/30 flex items-center justify-center shadow-xl shadow-[#f8a87c]/10 ${
          isLarge ? "h-20 w-20" : isSmall ? "h-11 w-11" : "h-16 w-16"
        }`}>
          {/* Subtle inner grid aura */}
          <div className="absolute inset-1 rounded-2xl border border-dashed border-[#f8a87c]/20 pointer-events-none" />
          
          <div className="text-[#f8a87c] flex items-center justify-center">
            {icon || <Sparkles size={isLarge ? 34 : isSmall ? 18 : 26} className="text-[#f8a87c]" />}
          </div>
        </div>
      </div>

      {/* Pill Badge */}
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f8a87c]/10 border border-[#f8a87c]/20 text-[#f8a87c] text-[10px] font-mono uppercase tracking-wider font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f8a87c] animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      {/* Title & Description */}
      <div className={`space-y-1.5 ${isLarge ? "max-w-lg" : "max-w-md"}`}>
        <h3 className={`font-bold text-slate-900 dark:text-white tracking-tight ${
          isLarge ? "text-xl sm:text-2xl" : isSmall ? "text-xs" : "text-base sm:text-lg"
        }`}>
          {title}
        </h3>
        {description && (
          <p className={`text-slate-500 dark:text-neutral-400 leading-relaxed font-sans ${
            isLarge ? "text-xs sm:text-sm" : isSmall ? "text-[11px]" : "text-xs"
          }`}>
            {description}
          </p>
        )}
        {tip && (
          <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-mono mt-1 pt-1 border-t border-slate-200/60 dark:border-white/5">
            {tip}
          </p>
        )}
      </div>

      {/* Action Buttons Group */}
      {(action || secondaryAction || extraAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 w-full max-w-xl">
          {action && renderButton(action, "act-main")}
          {secondaryAction && renderButton(secondaryAction, "act-sec")}
          {extraAction && renderButton(extraAction, "act-extra")}
        </div>
      )}
    </div>
  );
}
