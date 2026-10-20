import React from "react";
import { playMicroClick } from "../../services/notificationService";

export interface TabItem<T extends string = string> {
  id: T;
  label: React.ReactNode;
  count?: number | string;
  icon?: React.ReactNode;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  size?: "sm" | "md";
  className?: string;
  variant?: "pill" | "underline";
}

export function Tabs<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  size = "md",
  className = "",
  variant = "pill",
}: TabsProps<T>) {
  const isSm = size === "sm";

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      playMicroClick();
      onChange(tabs[nextIndex].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      playMicroClick();
      onChange(tabs[prevIndex].id);
    }
  };

  if (variant === "underline") {
    return (
      <div role="tablist" className={`flex items-center gap-4 border-b border-neutral-200 dark:border-[#22222e] select-none ${className}`}>
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                playMicroClick();
                onChange(tab.id);
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative pb-2.5 flex items-center gap-1.5 transition-colors cursor-pointer font-medium ${
                isSm ? "text-xs" : "text-sm"
              } ${
                isActive
                  ? "text-[#f8a87c]"
                  : "text-neutral-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-[#f8a87c]/15 text-[#f8a87c]"
                      : "bg-neutral-200 dark:bg-white/10 text-neutral-500"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f8a87c] rounded-full animate-in fade-in zoom-in-95 duration-150" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill variant (Default)
  return (
    <div
      role="tablist"
      className={`inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-[#121218] border border-slate-200 dark:border-[#22222e] select-none overflow-x-auto scrollbar-none max-w-full ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => {
              playMicroClick();
              onChange(tab.id);
            }}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center justify-center gap-1.5 rounded-md transition-all cursor-pointer font-medium shrink-0 whitespace-nowrap text-nowrap [text-wrap:nowrap] ${
              isSm ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"
            } ${
              isActive
                ? "bg-[#f8a87c]/20 text-[#f8a87c] dark:text-[#f8a87c] font-semibold border border-[#f8a87c]/30 shadow-xs"
                : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5"
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-[#f8a87c]/25 text-[#f8a87c] font-bold" : "bg-white/10 text-neutral-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
