import React from "react";

export type BadgeVariant = "outline" | "subtle" | "solid";
export type BadgeColor = "brand" | "cyan" | "emerald" | "amber" | "red" | "neutral";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Badge({
  children,
  variant = "subtle",
  color = "neutral",
  size = "sm",
  dot = false,
  className = "",
  onClick,
}: BadgeProps) {
  const isSm = size === "sm";

  const colorStyles: Record<BadgeColor, Record<BadgeVariant, string>> = {
    brand: {
      subtle: "bg-[#ff7a00]/10 text-[#ff7a00] border-[#ff7a00]/25",
      outline: "bg-transparent text-[#ff7a00] border-[#ff7a00]/50",
      solid: "bg-[#ff7a00] text-black font-semibold border-transparent",
    },
    cyan: {
      subtle: "bg-cyan-500/10 text-cyan-400 border-cyan-500/25",
      outline: "bg-transparent text-cyan-400 border-cyan-500/50",
      solid: "bg-cyan-500 text-black font-semibold border-transparent",
    },
    emerald: {
      subtle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
      outline: "bg-transparent text-emerald-400 border-emerald-500/50",
      solid: "bg-emerald-500 text-black font-semibold border-transparent",
    },
    amber: {
      subtle: "bg-amber-500/10 text-amber-400 border-amber-500/25",
      outline: "bg-transparent text-amber-400 border-amber-500/50",
      solid: "bg-amber-500 text-black font-semibold border-transparent",
    },
    red: {
      subtle: "bg-red-500/10 text-red-400 border-red-500/25",
      outline: "bg-transparent text-red-400 border-red-500/50",
      solid: "bg-red-500 text-white font-semibold border-transparent",
    },
    neutral: {
      subtle: "bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-neutral-400 border-slate-300 dark:border-white/10",
      outline: "bg-transparent text-slate-700 dark:text-neutral-400 border-slate-300 dark:border-white/20",
      solid: "bg-slate-700 dark:bg-white/20 text-white border-transparent",
    },
  };

  const dotColors: Record<BadgeColor, string> = {
    brand: "bg-[#ff7a00]",
    cyan: "bg-cyan-400",
    emerald: "bg-emerald-400",
    amber: "bg-amber-400",
    red: "bg-red-400",
    neutral: "bg-neutral-400",
  };

  const currentStyle = colorStyles[color][variant];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border select-none ${
        onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      } ${
        isSm ? "text-[9px] px-1.5 py-0.2 rounded-md" : "text-[10px] px-2 py-0.5 rounded-lg"
      } ${currentStyle} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[color]} ${
            color === "emerald" || color === "brand" ? "animate-pulse" : ""
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
