import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

/**
 * Standard Divider Primitive
 * Subtle separator matching GrokBot Console contrast standards.
 */
export function Divider({
  orientation = "horizontal",
  label,
  className = "",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        {...props}
        className={`w-px h-full bg-slate-200/80 dark:bg-white/[0.08] shrink-0 ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        {...props}
        className={`flex items-center gap-2 my-2 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider select-none ${className}`}
      >
        <div className="flex-1 h-px bg-slate-200/80 dark:bg-white/[0.08]" />
        <span>{label}</span>
        <div className="flex-1 h-px bg-slate-200/80 dark:bg-white/[0.08]" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      {...props}
      className={`w-full h-px bg-slate-200/80 dark:bg-white/[0.08] my-1 shrink-0 ${className}`}
    />
  );
}
