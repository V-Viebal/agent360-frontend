import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";
import { useTranslation, LanguageSelection } from "../i18n/LanguageContext";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, selection, setLanguageSelection, detectedCountry, detectedTimezone, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { id: LanguageSelection; label: string; sub: string }[] = [
    {
      id: "auto",
      label: language === "vi" ? "Tự động (Vị trí máy)" : "Auto (Machine Location)",
      sub: `${detectedTimezone.split("/")[1] || detectedTimezone} • ${language === "vi" ? "Tiếng Việt" : "English"}`,
    },
    {
      id: "vi",
      label: "Tiếng Việt",
      sub: "Vietnam (vi-VN)",
    },
    {
      id: "en",
      label: "English",
      sub: "Global (en-US)",
    },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block text-left select-none ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        title="Change Language & Regional Location"
      >
        <Globe size={13} className="text-[#ff7a00]" />
        <span className="font-medium uppercase tracking-wider text-[11px]">{language}</span>
        <ChevronDown size={11} className={`text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-56 rounded-2xl bg-[#0f1118]/95 border border-white/15 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-white/[0.08] mb-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              {language === "vi" ? "Ngôn ngữ & Vị trí" : "Language & Location"}
            </div>
            <div className="text-[11px] text-neutral-200 flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{detectedTimezone}</span>
            </div>
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = selection === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setLanguageSelection(opt.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold border border-[#ff7a00]/30"
                      : "text-neutral-300 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{opt.label}</span>
                    <span className="text-[10px] font-mono text-neutral-500 truncate">{opt.sub}</span>
                  </div>
                  {isSelected && <Check size={13} className="text-[#ff7a00] shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
