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
          ? "bg-[#86efac]/15 text-[#86efac] border-[#86efac]/30"
          : isYellow
          ? "bg-[#fde047]/15 text-[#fde047] border-[#fde047]/30"
          : "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isGreen ? "bg-[#86efac] animate-pulse" : isYellow ? "bg-[#fde047]" : "bg-neutral-500"
        }`}
      />
      <span>{text || status}</span>
    </span>
  );
}
