import React from "react";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md";
  className?: string;
}

const sizeClasses: Record<"xs" | "sm" | "md", string> = {
  xs: "px-1 py-0.2 text-[9px] min-h-[16px]",
  sm: "px-1.5 py-0.5 text-[10px] min-h-[18px]",
  md: "px-2 py-0.5 text-[11px] min-h-[22px]",
};

/**
 * Standard Kbd (Keyboard Shortcut Indicator) Component
 * Adheres to Agent360 Level 5 (rounded-md / 6px) corner radius contract.
 */
export function Kbd({ children, size = "sm", className = "", ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={`inline-flex items-center justify-center font-mono font-semibold rounded-md border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-[#181822] text-slate-700 dark:text-neutral-300 shadow-2xs select-none ${sizeClasses[size]} ${className}`}
    >
      {children}
    </kbd>
  );
}
