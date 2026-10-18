import { useTranslation } from "../i18n/LanguageContext";
import React, { useState, useEffect } from "react";
import { Command as KeyboardIcon, X, RotateCcw, Edit2, Check, Download, Upload, Cloud, RefreshCw } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ShortcutItem {
  id: string;
  defaultKeys: string[];
  description: string;
  category: "Navigation & Search" | "Voice & Audio" | "Dialogue & Sessions" | "General";
  customizable?: boolean;
}

export const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  {
    id: "command_palette",
    defaultKeys: ["Ctrl", "K"],
    description: "Open Global Command Palette & Quick Switcher",
    category: "Navigation & Search",
    customizable: true,
  },
    {
    id: "toggle_chat_menu",
    defaultKeys: ["Alt", "M"],
    description: "Toggle active conversation options menu (Search, Export, Rename)",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "toggle_computer_workspace",
    defaultKeys: ["Ctrl", "M"],
    description: "Toggle Virtual Computer Workspace (Auto-collapse sidebars)",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "toggle_plus_menu",
    defaultKeys: ["Ctrl", "/"],
    description: "Toggle Add to prompt menu (Loop mode, Connected Apps & Subagents)",
    category: "Dialogue & Sessions",
    customizable: true,
  },
  {
    id: "toggle_left_sidebar",
    defaultKeys: ["Ctrl", "B"],
    description: "Toggle left Agents sidebar (collapse / expand)",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "open_topology",
    defaultKeys: ["Ctrl", "G"],
    description: "Open A2A Multi-Agent Topology Graph (Sơ đồ đội ngũ)",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "shortcuts_legend",
    defaultKeys: ["Ctrl", "/"],
    description: "Open Keyboard Shortcuts Legend",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "scroll_home",
    defaultKeys: ["Home"],
    description: "Smooth scroll to top of dialogue",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "scroll_end",
    defaultKeys: ["End"],
    description: "Jump to latest response / bottom anchor",
    category: "Navigation & Search",
    customizable: true,
  },
  {
    id: "toggle_mic",
    defaultKeys: ["Alt", "M"],
    description: "Toggle voice input / Push-to-Talk microphone",
    category: "Voice & Audio",
    customizable: true,
  },
  {
    id: "chime_audition",
    defaultKeys: ["1", "2", "3", "4"],
    description: "Audition chime sounds in Permissions Modal",
    category: "Voice & Audio",
    customizable: false,
  },
  {
    id: "new_chat",
    defaultKeys: ["Ctrl", "Shift", "O"],
    description: "Start a new chat dialogue session",
    category: "Dialogue & Sessions",
    customizable: true,
  },
  {
    id: "send_prompt",
    defaultKeys: ["Enter"],
    description: "Send prompt message or queue next turn",
    category: "Dialogue & Sessions",
    customizable: false,
  },
  {
    id: "newline_composer",
    defaultKeys: ["Shift", "Enter"],
    description: "Insert newline in prompt composer",
    category: "Dialogue & Sessions",
    customizable: false,
  },
  {
    id: "close_modal",
    defaultKeys: ["Esc"],
    description: "Close active modal, popover, or search drawer",
    category: "General",
    customizable: false,
  },
];

export function getCustomShortcutsMap(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("agent360_custom_shortcuts");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const { t } = useTranslation();
  const [customMap, setCustomMap] = useState<Record<string, string[]>>(() => getCustomShortcutsMap());
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync custom shortcuts with backend user profile persistence
  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    setCloudSyncStatus(null);
    try {
      const response = await fetch("/api/console/user/shortcuts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "default",
          customShortcuts: customMap,
          updatedAt: new Date().toISOString(),
        }),
      }).catch(() => null);

      if (response && response.ok) {
        setCloudSyncStatus("Synced to Cloud!");
      } else {
        // Saved locally fallback
        setCloudSyncStatus("Saved locally!");
      }
      setTimeout(() => setCloudSyncStatus(null), 3000);
    } catch {
      setCloudSyncStatus("Saved locally!");
      setTimeout(() => setCloudSyncStatus(null), 2500);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleExportShortcuts = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customMap, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `skyer-shortcuts-${Date.now().toString().slice(-6)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.warn("Failed to export shortcuts JSON:", e);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === "object" && parsed !== null) {
          setCustomMap(parsed);
          localStorage.setItem("agent360_custom_shortcuts", JSON.stringify(parsed));
          window.dispatchEvent(new CustomEvent("agent360_shortcuts_updated", { detail: parsed }));
          setImportSuccess("Custom shortcuts imported successfully!");
          setTimeout(() => setImportSuccess(null), 3000);
        }
      } catch (err) {
        setConflictWarning("Invalid shortcuts JSON file format.");
        setTimeout(() => setConflictWarning(null), 3500);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // List of reserved browser hotkeys that shouldn't be overridden
  const RESERVED_BROWSER_HOTKEYS = ["Ctrl+W", "Ctrl+T", "Ctrl+N", "Ctrl+R", "Ctrl+F4", "Alt+F4", "Ctrl+Tab"];

  useEffect(() => {
    if (isOpen) {
      setCustomMap(getCustomShortcutsMap());
      setRecordingId(null);
    }
  }, [isOpen]);

  // Global keydown listener when in recording state
  useEffect(() => {
    if (!recordingId) return;

    const handleRecord = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // If user presses Escape, cancel recording
      if (e.key === "Escape") {
        setRecordingId(null);
        return;
      }

      const keys: string[] = [];
      if (e.ctrlKey) keys.push("Ctrl");
      if (e.metaKey) keys.push("Cmd");
      if (e.altKey) keys.push("Alt");
      if (e.shiftKey) keys.push("Shift");

      const keyName = e.key;
      // Do not record bare modifier keys alone
      if (!["Control", "Meta", "Alt", "Shift"].includes(keyName)) {
        const formatted = keyName.length === 1 ? keyName.toUpperCase() : keyName;
        if (!keys.includes(formatted)) {
          keys.push(formatted);
        }

        const comboString = keys.join("+");
        // Check for browser collision
        if (RESERVED_BROWSER_HOTKEYS.includes(comboString)) {
          setConflictWarning(`"${comboString}" conflicts with a reserved browser action. Please choose a different key combination.`);
          setTimeout(() => setConflictWarning(null), 4000);
          return;
        }

        // Check for collision with another active shortcut
        const collidingItem = DEFAULT_SHORTCUTS.find((item) => {
          if (item.id === recordingId) return false;
          const otherKeys = (customMap[item.id] || item.defaultKeys).join("+");
          return otherKeys === comboString;
        });

        if (collidingItem) {
          setConflictWarning(`"${comboString}" is already assigned to "${collidingItem.description}". Please choose another combination.`);
          setTimeout(() => setConflictWarning(null), 4000);
          return;
        }

        // Save recorded custom keys
        setConflictWarning(null);
        const nextMap = { ...customMap, [recordingId]: keys };
        setCustomMap(nextMap);
        try {
          localStorage.setItem("agent360_custom_shortcuts", JSON.stringify(nextMap));
          window.dispatchEvent(new CustomEvent("agent360_shortcuts_updated", { detail: nextMap }));
        } catch {}

        setRecordingId(null);
      }
    };

    window.addEventListener("keydown", handleRecord, { capture: true });
    return () => window.removeEventListener("keydown", handleRecord, { capture: true });
  }, [recordingId, customMap]);

  const handleResetDefaults = () => {
    try {
      localStorage.removeItem("agent360_custom_shortcuts");
      setCustomMap({});
      window.dispatchEvent(new CustomEvent("agent360_shortcuts_updated", { detail: {} }));
    } catch {}
    setRecordingId(null);
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#ff7a00]/10 border border-[#ff7a00]/20 flex items-center justify-center text-[#ff7a00]">
              <KeyboardIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t("shortcuts.title")}</h3>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Click any shortcut with an edit icon to record your custom key combination
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1c1c28] hover:bg-[#252536] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Conflict Warning Toast */}
        {conflictWarning && (
          <div className="px-4 py-2 bg-red-500/15 border-b border-red-500/30 text-red-300 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in select-none">
            <span className="truncate">{conflictWarning}</span>
            <button
              type="button"
              onClick={() => setConflictWarning(null)}
              className="text-red-400 hover:text-white cursor-pointer shrink-0"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Content list by category */}
        <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
          {categories.map((cat) => {
            const items = DEFAULT_SHORTCUTS.filter((s) => s.category === cat);
            if (items.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold px-1">
                  {cat}
                </span>
                <div className="rounded-xl border border-slate-200 dark:border-[#22222e] bg-slate-50 dark:bg-[#161620] divide-y divide-[#22222e] overflow-hidden">
                  {items.map((item) => {
                    const activeKeys = customMap[item.id] || item.defaultKeys;
                    const isRecording = recordingId === item.id;
                    const isCustomized = Boolean(customMap[item.id]);

                    return (
                      <div
                        key={item.id}
                        className={`px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                          isRecording ? "bg-[#ff7a00]/10 border-l-2 border-[#ff7a00]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-slate-700 dark:text-neutral-300 font-normal truncate">{item.description}</span>
                          {isCustomized && (
                            <span className="text-[9px] font-mono text-[#ff7a00] bg-[#ff7a00]/15 px-1.5 py-0.2 rounded shrink-0">
                              custom
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isRecording ? (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ff7a00]/20 border border-[#ff7a00] text-[#ff7a00] font-mono text-[11px] animate-pulse">
                              <span>{t("shortcuts.pressKeys")}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1">
                                {activeKeys.map((k, kIdx) => (
                                  <kbd
                                    key={kIdx}
                                    className="px-2 py-0.5 rounded-md bg-white dark:bg-[#222230] border border-slate-300 dark:border-[#303044] text-[11px] font-mono text-slate-800 dark:text-neutral-200 shadow-xs font-semibold"
                                  >
                                    {k}
                                  </kbd>
                                ))}
                              </div>
                              {item.customizable && (
                                <button
                                  type="button"
                                  onClick={() => setRecordingId(item.id)}
                                  className="p-1 rounded-md hover:bg-white/10 text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                  title="Record custom shortcut"
                                >
                                  <Edit2 size={12} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Import Success Toast */}
        {importSuccess && (
          <div className="px-4 py-1.5 bg-emerald-500/15 border-t border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in select-none">
            <Check size={13} className="text-emerald-400" />
            <span>{importSuccess}</span>
          </div>
        )}

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#0f0f15] border-t border-slate-200 dark:border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-500">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCloudSync}
              disabled={isSyncingCloud}
              className="flex items-center gap-1 text-[#ff7a00] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Sync shortcuts to user profile"
            >
              {isSyncingCloud ? <RefreshCw size={11} className="animate-spin" /> : <Cloud size={11} />}
              <span>{isSyncingCloud ? "Syncing..." : cloudSyncStatus || "Sync Cloud"}</span>
            </button>
            <span className="text-neutral-700">|</span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Reset all shortcuts to factory defaults"
            >
              <RotateCcw size={12} />
              <span>{t("shortcuts.reset")}</span>
            </button>
            <span className="text-neutral-700">|</span>
            <button
              type="button"
              onClick={handleExportShortcuts}
              className="flex items-center gap-1 text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Export custom shortcuts to JSON file"
            >
              <Download size={12} />
              <span>{t("shortcuts.export")}</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Import shortcuts from JSON file"
            >
              <Upload size={12} />
              <span>{t("shortcuts.import")}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
