import React from "react";

export interface MetricStatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  icon?: React.ReactNode;
  badge?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Standard MetricStatCard Component
 * High-density metrics card for Telemetry HUD, Token Analytics and System Health.
 * Follows Level 3 (rounded-xl) container and Level 5 (rounded-md) micro-badges.
 */
export function MetricStatCard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  icon,
  badge,
  className = "",
  onClick,
}: MetricStatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl bg-white dark:bg-[#14141c] border border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between transition-all select-none shadow-xs ${
        onClick ? "cursor-pointer hover:border-[#ff7a00]/40 hover:bg-slate-50 dark:hover:bg-[#181824]" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-sans font-medium text-slate-500 dark:text-neutral-400 truncate">
          {label}
        </span>
        {icon && <div className="text-slate-400 dark:text-neutral-500 shrink-0">{icon}</div>}
        {badge && (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20 font-semibold shrink-0">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-base sm:text-lg font-mono font-bold tracking-tight text-slate-900 dark:text-white tabular-nums truncate">
          {value}
        </div>
        {subValue && (
          <span className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 truncate">
            {subValue}
          </span>
        )}
      </div>

      {trendLabel && (
        <div className="mt-1 flex items-center gap-1 text-[10px] font-mono">
          <span
            className={
              trend === "up"
                ? "text-emerald-500"
                : trend === "down"
                ? "text-red-500"
                : "text-neutral-400"
            }
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "•"} {trendLabel}
          </span>
        </div>
      )}
    </div>
  );
}
