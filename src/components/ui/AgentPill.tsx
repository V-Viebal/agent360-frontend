import React from "react";
import { Cpu } from "lucide-react";

export interface AgentPillProps {
  name: string;
  slug?: string;
  model?: string;
  node?: string;
  status?: "online" | "idle" | "busy" | "offline";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}

export function AgentPill({
  name,
  slug,
  model,
  node,
  status = "online",
  size = "md",
  className = "",
  onClick,
}: AgentPillProps) {
  const isSm = size === "sm";

  const statusColor =
    status === "online"
      ? "bg-emerald-400"
      : status === "busy"
      ? "bg-[#f8a87c]"
      : status === "idle"
      ? "bg-amber-400"
      : "bg-neutral-500";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-[#161620] border border-slate-200 dark:border-[#222230] select-none ${
        onClick ? "cursor-pointer hover:border-[var(--agent-primary)]/40 transition-colors" : ""
      } ${isSm ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"} ${className}`}
    >
      {/* Avatar Icon */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div className={`rounded-md bg-[#f8a87c]/15 border border-[#f8a87c]/30 text-[#f8a87c] flex items-center justify-center ${isSm ? "h-5 w-5" : "h-6 w-6"}`}>
          <Cpu size={isSm ? 12 : 14} />
        </div>
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full ring-1 ring-black ${statusColor} ${
            status === "online" ? "animate-pulse" : ""
          } ${isSm ? "h-1.5 w-1.5" : "h-2 w-2"}`}
        />
      </div>

      {/* Identity Text */}
      <div className="flex flex-col min-w-0 pr-1">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className="font-semibold text-slate-800 dark:text-white truncate">{name}</span>
          {slug && (
            <span className="text-[10px] font-mono text-neutral-500 truncate hidden sm:inline">
              @{slug}
            </span>
          )}
        </div>
        {(model || node) && (
          <div className="text-[9px] font-mono text-neutral-400 truncate mt-0.5 flex items-center gap-1">
            {model && <span className="text-cyan-400">{model.includes("/") ? model.split("/").pop() : model}</span>}
            {model && node && <span>•</span>}
            {node && <span>{node}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
