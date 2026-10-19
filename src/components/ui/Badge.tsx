import React from "react";

export type BadgeVariant = "outline" | "subtle" | "solid";
export type BadgeColor = "brand" | "mint" | "sky" | "lavender" | "rose" | "apricot" | "neutral" | "emerald" | "amber" | "cyan" | "red";

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

  const colorStyles: Record<string, Record<BadgeVariant, string>> = {
    brand: {
      subtle: "bg-[#f8a87c]/15 text-[#f8a87c] border-[#f8a87c]/30",
      outline: "bg-transparent text-[#f8a87c] border-[#f8a87c]/40",
      solid: "bg-[#f8a87c] text-black font-semibold border-transparent",
    },
    mint: {
      subtle: "bg-[#86efac]/15 text-[#86efac] border-[#86efac]/30",
      outline: "bg-transparent text-[#86efac] border-[#86efac]/40",
      solid: "bg-[#86efac] text-black font-semibold border-transparent",
    },
    sky: {
      subtle: "bg-[#7dd3fc]/15 text-[#7dd3fc] border-[#7dd3fc]/30",
      outline: "bg-transparent text-[#7dd3fc] border-[#7dd3fc]/40",
      solid: "bg-[#7dd3fc] text-black font-semibold border-transparent",
    },
    lavender: {
      subtle: "bg-[#c4b5fd]/15 text-[#c4b5fd] border-[#c4b5fd]/30",
      outline: "bg-transparent text-[#c4b5fd] border-[#c4b5fd]/40",
      solid: "bg-[#c4b5fd] text-black font-semibold border-transparent",
    },
    rose: {
      subtle: "bg-[#fda4af]/15 text-[#fda4af] border-[#fda4af]/30",
      outline: "bg-transparent text-[#fda4af] border-[#fda4af]/40",
      solid: "bg-[#fda4af] text-black font-semibold border-transparent",
    },
    apricot: {
      subtle: "bg-[#fde047]/15 text-[#fde047] border-[#fde047]/30",
      outline: "bg-transparent text-[#fde047] border-[#fde047]/40",
      solid: "bg-[#fde047] text-black font-semibold border-transparent",
    },
    neutral: {
      subtle: "bg-slate-200/80 dark:bg-white/8 text-slate-700 dark:text-neutral-300 border-slate-300 dark:border-white/12",
      outline: "bg-transparent text-slate-700 dark:text-neutral-300 border-slate-300 dark:border-white/20",
      solid: "bg-slate-700 dark:bg-white/20 text-white border-transparent",
    },
    // Aliases mapped cleanly to pastel palette
    emerald: {
      subtle: "bg-[#86efac]/15 text-[#86efac] border-[#86efac]/30",
      outline: "bg-transparent text-[#86efac] border-[#86efac]/40",
      solid: "bg-[#86efac] text-black font-semibold border-transparent",
    },
    cyan: {
      subtle: "bg-[#7dd3fc]/15 text-[#7dd3fc] border-[#7dd3fc]/30",
      outline: "bg-transparent text-[#7dd3fc] border-[#7dd3fc]/40",
      solid: "bg-[#7dd3fc] text-black font-semibold border-transparent",
    },
    amber: {
      subtle: "bg-[#fde047]/15 text-[#fde047] border-[#fde047]/30",
      outline: "bg-transparent text-[#fde047] border-[#fde047]/40",
      solid: "bg-[#fde047] text-black font-semibold border-transparent",
    },
    red: {
      subtle: "bg-[#fda4af]/15 text-[#fda4af] border-[#fda4af]/30",
      outline: "bg-transparent text-[#fda4af] border-[#fda4af]/40",
      solid: "bg-[#fda4af] text-black font-semibold border-transparent",
    },
  };

  const dotColors: Record<string, string> = {
    brand: "bg-[#f8a87c]",
    mint: "bg-[#86efac]",
    sky: "bg-[#7dd3fc]",
    lavender: "bg-[#c4b5fd]",
    rose: "bg-[#fda4af]",
    apricot: "bg-[#fde047]",
    neutral: "bg-neutral-400",
    emerald: "bg-[#86efac]",
    cyan: "bg-[#7dd3fc]",
    amber: "bg-[#fde047]",
    red: "bg-[#fda4af]",
  };

  const currentStyle = colorStyles[color] ? colorStyles[color][variant] : colorStyles.neutral[variant];

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
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[color] || "bg-neutral-400"} ${
            color === "emerald" || color === "brand" || color === "mint" ? "animate-pulse" : ""
          }`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
