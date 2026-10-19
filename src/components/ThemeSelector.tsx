import React, { useRef, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, ThemeMode } from "../context/ThemeContext";
import { DropdownMenu, DropdownMenuItem } from "./ui/DropdownMenu";

export function ThemeSelector({ className = "" }: { className?: string }) {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const options: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "system",
      label: "Giao diện hệ thống",
      icon: <Monitor size={14} className="text-neutral-400" />,
    },
    {
      id: "light",
      label: "Giao diện sáng",
      icon: <Sun size={14} className="text-amber-500" />,
    },
    {
      id: "dark",
      label: "Giao diện tối",
      icon: <Moon size={14} className="text-blue-400" />,
    },
  ];

  return (
    <div className={`relative inline-block text-left select-none ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-neutral-400 hover:text-[var(--text-primary)] hover:bg-neutral-500/10 transition-colors cursor-pointer flex items-center justify-center"
        title={`Theme: ${themeMode} (${resolvedTheme})`}
        aria-label="Toggle Theme"
      >
        {resolvedTheme === "dark" ? (
          <Moon size={15} />
        ) : (
          <Sun size={15} className="text-amber-500" />
        )}
      </button>

      <DropdownMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={triggerRef}
        align="right"
        width="w-44"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.id}
            icon={opt.icon}
            label={opt.label}
            badge={themeMode === opt.id ? "✓" : undefined}
            badgeColor="text-[#f8a87c]"
            onClick={() => {
              setThemeMode(opt.id);
              setIsOpen(false);
            }}
          />
        ))}
      </DropdownMenu>
    </div>
  );
}
