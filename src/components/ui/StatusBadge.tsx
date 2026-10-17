interface StatusBadgeProps {
  status: "active" | "idle" | "running" | "stopped" | "evaluating";
  text?: string;
  className?: string;
}

export function StatusBadge({ status, text, className = "" }: StatusBadgeProps) {
  const isGreen = status === "active" || status === "running";
  const isYellow = status === "evaluating";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
        isGreen
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : isYellow
          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
          : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isGreen ? "bg-emerald-400 animate-pulse" : isYellow ? "bg-amber-400" : "bg-neutral-500"
        }`}
      />
      <span>{text || status}</span>
    </span>
  );
}
