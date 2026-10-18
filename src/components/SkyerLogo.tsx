import React from "react";

interface SkyerLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showBotBadge?: boolean;
}

export function SkyerLogo({ size = 32, className = "", showText = true, showBotBadge = false }: SkyerLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Precision Icon Mark with Light / Dark Theme Support */}
      <div 
        style={{ width: size, height: size }}
        className={`rounded-[8px] bg-slate-100 dark:bg-[#0A0C13] border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-xs dark:shadow-[0_0_15px_rgba(255,122,0,0.18)] transition-all duration-300 hover:border-[#ff7a00]/50 hover:shadow-[0_0_22px_rgba(255,122,0,0.25)] hover:scale-105 shrink-0 ${
          size <= 24 ? "p-1" : size <= 32 ? "p-1.5" : "p-2"
        }`}
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="transition-transform duration-300 group-hover:rotate-6">
          {/* Upper Blade: Deep Slate in Light Mode, Pure White in Dark Mode */}
          <path 
            d="M 27 7.5 L 13.5 7.5 C 10 7.5 7.5 10 7.5 13.5 L 7.5 14.5 C 7.5 18 10 20 13.5 20.5 L 21 21.5" 
            className="stroke-slate-900 dark:stroke-white" 
            strokeWidth="3.6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Lower Blade: Electric Grok Ember */}
          <path 
            d="M 9 28.5 L 22.5 28.5 C 26 28.5 28.5 26 28.5 22.5 L 28.5 21.5 C 28.5 18 26 16 22.5 15.5 L 15 14.5" 
            className="stroke-[#ff7a00]" 
            strokeWidth="3.6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Modern Wordmark with Dynamic Light / Dark Color */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[17px] tracking-tight text-slate-900 dark:text-white font-sans group-hover:text-[#ff7a00] dark:group-hover:text-neutral-100 transition-colors">
            Skyer
          </span>
          {showBotBadge && (
            <span className="text-[9px] font-mono font-bold uppercase bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 px-1.5 py-0.2 rounded-full">
              BOT
            </span>
          )}
        </div>
      )}
    </div>
  );
}
