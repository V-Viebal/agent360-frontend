import React from "react";

interface SkyerLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showBotBadge?: boolean;
}

// Half-disc petal from the centre to the top edge; rotated ×4 into a pinwheel.
const PETAL = "M16 16V3.5a6.25 6.25 0 0 1 0 12.5Z";

/**
 * Skyer mark: an open geometric pinwheel of four half-disc petals.
 * Tightly coupled mark + wordmark with optical vertical centering.
 * Hover interaction: gentle rotation only (30deg, fluid ease-out).
 */
export function SkyerLogo({ size = 32, className = "", showText = true, showBotBadge = false }: SkyerLogoProps) {
  return (
    <div className={`inline-flex items-center gap-1 group select-none cursor-pointer ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        role="img"
        aria-label="Skyer"
        className="shrink-0 block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[30deg]"
      >
        <path d={PETAL} transform="rotate(0 16 16)" className="fill-[#252522] dark:fill-[#FFFDF9]" />
        <path d={PETAL} transform="rotate(90 16 16)" className="fill-[#252522] dark:fill-[#FFFDF9]" />
        <path d={PETAL} transform="rotate(180 16 16)" className="fill-[#252522] dark:fill-[#FFFDF9]" />
        <path d={PETAL} transform="rotate(270 16 16)" style={{ fill: "var(--agent-primary, #F8A87C)" }} />
      </svg>

      {showText && (
        <div className="flex items-center gap-1 leading-none">
          <span 
            className="text-[18px] font-semibold tracking-[-0.04em] text-[#252522] dark:text-[#FFFDF9] select-none translate-y-[0.5px]"
            style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
          >
            Skyer
          </span>
          {showBotBadge && (
            <span className="text-[9px] font-mono font-bold uppercase bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] px-1.5 py-0.5 rounded-full ml-0.5 translate-y-[0.5px]">
              BOT
            </span>
          )}
        </div>
      )}
    </div>
  );
}
