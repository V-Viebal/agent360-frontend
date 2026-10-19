import React, { useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation, LanguageSelection } from "../i18n/LanguageContext";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSection } from "./ui/DropdownMenu";

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { language, selection, setLanguageSelection, detectedTimezone } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const options: { id: LanguageSelection; label: string; sub: string }[] = [
    {
      id: "auto",
      label: language === "vi" ? "Tự động (Vị trí máy)" : "Auto (Machine Location)",
      sub: `${detectedTimezone.split("/")[1] || detectedTimezone}`,
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
    <div className={`relative inline-block text-left select-none ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer"
        title="Change Language & Regional Location"
      >
        <Globe size={13} className="text-[#f8a87c]" />
        <span className="font-medium uppercase tracking-wider text-[11px]">{language}</span>
        <ChevronDown size={11} className={`text-neutral-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <DropdownMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={triggerRef}
        align="right"
        width="w-56"
      >
        <DropdownMenuSection label={language === "vi" ? "Ngôn ngữ & Vùng" : "Language & Region"}>
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt.id}
              label={opt.label}
              badge={selection === opt.id ? "✓" : opt.sub}
              badgeColor={selection === opt.id ? "text-[#f8a87c]" : "text-neutral-500"}
              onClick={() => {
                setLanguageSelection(opt.id);
                setIsOpen(false);
              }}
            />
          ))}
        </DropdownMenuSection>
      </DropdownMenu>
    </div>
  );
}
