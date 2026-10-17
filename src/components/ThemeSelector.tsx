import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, ThemeMode } from "../context/ThemeContext";

export function ThemeSelector({ className = "" }: { className?: string }) {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
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

  const options: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "system",
      label: "System",
      icon: <Monitor size={14} />,
    },
    {
      id: "light",
      label: "Light",
      icon: <Sun size={14} className="text-amber-500" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon size={14} className="text-blue-400" />,
    },
  ];

  return (
    <div ref={containerRef} className={`relative inline-block text-left select-none ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-neutral-400 hover:text-[var(--text-primary)] hover:bg-neutral-500/10 transition-colors cursor-pointer flex items-center justify-center"
        title={`Current theme: ${themeMode} (${resolvedTheme}). Click to choose.`}
        aria-label="Toggle Theme"
      >
        {resolvedTheme === "dark" ? (
          <Moon size={15} />
        ) : (
          <Sun size={15} className="text-amber-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-36 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = themeMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setThemeMode(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#ff7a00]/15 text-[#ff7a00] font-semibold border border-[#ff7a00]/30"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-500/10 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check size={13} className="text-[#ff7a00] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
