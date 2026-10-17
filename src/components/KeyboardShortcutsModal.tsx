import React from "react";
import { Keyboard, X, Command } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: "Navigation & Search" | "Voice & Audio" | "Dialogue & Sessions" | "General";
}

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ["Ctrl", "K"],
    description: "Open Global Command Palette & Quick Switcher",
    category: "Navigation & Search",
  },
  {
    keys: ["Ctrl", "/"],
    description: "Open Keyboard Shortcuts Legend",
    category: "Navigation & Search",
  },
  {
    keys: ["Home"],
    description: "Smooth scroll to top of dialogue",
    category: "Navigation & Search",
  },
  {
    keys: ["End"],
    description: "Jump to latest response / bottom anchor",
    category: "Navigation & Search",
  },
  {
    keys: ["Alt", "M"],
    description: "Toggle voice input / Push-to-Talk microphone",
    category: "Voice & Audio",
  },
  {
    keys: ["1", "2", "3", "4"],
    description: "Audition chime sounds in Permissions Modal",
    category: "Voice & Audio",
  },
  {
    keys: ["Ctrl", "Shift", "O"],
    description: "Start a new chat dialogue session",
    category: "Dialogue & Sessions",
  },
  {
    keys: ["Enter"],
    description: "Send prompt message or queue next turn",
    category: "Dialogue & Sessions",
  },
  {
    keys: ["Shift", "Enter"],
    description: "Insert newline in prompt composer",
    category: "Dialogue & Sessions",
  },
  {
    keys: ["Esc"],
    description: "Close active modal, popover, or search drawer",
    category: "General",
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const categories: ShortcutItem["category"][] = [
    "Navigation & Search",
    "Voice & Audio",
    "Dialogue & Sessions",
    "General",
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#121218] border border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#22222e] flex items-center justify-between bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <Keyboard size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Keyboard Shortcuts</h3>
              <p className="text-[11px] text-neutral-400">
                Navigate Skyer workspace with lightning-fast key commands
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1c1c28] hover:bg-[#252536] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content list by category */}
        <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
          {categories.map((cat) => {
            const items = SHORTCUTS.filter((s) => s.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-1">
                  {cat}
                </span>
                <div className="rounded-xl border border-[#22222e] bg-[#161620] divide-y divide-[#22222e] overflow-hidden">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="text-neutral-300 font-normal">{item.description}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.keys.map((k, kIdx) => (
                          <kbd
                            key={kIdx}
                            className="px-2 py-0.5 rounded-md bg-[#222230] border border-[#303044] text-[11px] font-mono text-neutral-200 shadow-xs"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0f0f15] border-t border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Press ESC anytime to close</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
