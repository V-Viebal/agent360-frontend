import React, { useState } from "react";
import { Star, Keyboard, X, Trash2, ArrowRight, CornerDownLeft, Copy, Check } from "lucide-react";
import { ChatMessage } from "../types/agent";
import { DEFAULT_SHORTCUTS, getCustomShortcutsMap } from "./KeyboardShortcutsModal";

interface StarredAndShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  starredMessages: ChatMessage[];
  onUnstar: (msgId: string) => void;
  onSelectMessage?: (msg: ChatMessage) => void;
  onOpenShortcutsCustomizer?: () => void;
}

export function StarredAndShortcutsModal({
  isOpen,
  onClose,
  starredMessages,
  onUnstar,
  onSelectMessage,
  onOpenShortcutsCustomizer,
}: StarredAndShortcutsModalProps) {
  const [activeTab, setActiveTab] = useState<"starred" | "shortcuts">("starred");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const customMap = getCustomShortcutsMap();

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-md animate-in fade-in duration-150 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white dark:bg-[#121218] border border-slate-200 dark:border-[#262634] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-neutral-200 font-sans animate-in zoom-in-95 duration-150"
      >
        {/* Header Tabs */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-[#22222e] flex items-center justify-between bg-slate-50 dark:bg-[#161620]">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#101016] p-1 rounded-xl border border-slate-200 dark:border-[#22222e]">
            <button
              type="button"
              onClick={() => setActiveTab("starred")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "starred"
                  ? "bg-[#ff7a00] text-black font-semibold shadow-xs"
                  : "text-slate-500 dark:text-neutral-400 hover:text-white"
              }`}
            >
              <Star size={13} className={activeTab === "starred" ? "fill-black" : "fill-amber-400 text-amber-400"} />
              <span>Starred Turns ({starredMessages.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shortcuts")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "shortcuts"
                  ? "bg-[#ff7a00] text-black font-semibold shadow-xs"
                  : "text-slate-500 dark:text-neutral-400 hover:text-white"
              }`}
            >
              <Keyboard size={13} />
              <span>Keyboard Shortcuts</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1c1c28] hover:bg-[#252536] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab 1: Starred Bookmarked Messages */}
        {activeTab === "starred" && (
          <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
            {starredMessages.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2.5 text-neutral-500 font-mono text-xs">
                <Star size={28} className="text-neutral-600 mb-1" />
                <p className="text-slate-700 dark:text-neutral-300 font-sans font-medium text-sm">Chưa có tin nhắn nào được gắn sao</p>
                <p className="text-neutral-500 text-[11px] max-w-sm">
                  Bấm vào biểu tượng ngôi sao dưới câu trả lời của Agent để lưu lại các phản hồi quan trọng hoặc câu trả lời hữu ích.
                </p>
              </div>
            ) : (
              starredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-[#242432] hover:border-[#343446] transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-400">
                    <span className="text-[#ff7a00] font-semibold uppercase">{msg.role}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => onUnstar(msg.id)}
                        className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 size={12} />
                        <span>Bỏ sao</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-800 dark:text-neutral-200 leading-relaxed line-clamp-4 font-sans select-text whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  {onSelectMessage && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectMessage(msg);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono pt-1 cursor-pointer"
                    >
                      <span>Xem lại vị trí này trong chat</span>
                      <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Keyboard Shortcuts Guide with Category Cards */}
        {activeTab === "shortcuts" && (
          <div className="p-4 space-y-3.5 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between bg-[#161622] border border-[#262638] rounded-xl p-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-white">Gợi ý Phím Tắt Nhanh (Keyboard Shortcuts)</span>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Tăng tốc thao tác làm việc với Agent thông qua các tổ hợp phím tắt chuẩn
                </p>
              </div>
              {onOpenShortcutsCustomizer && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShortcutsCustomizer();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#ff7a00]/20 hover:bg-[#ff7a00]/30 text-[#ff7a00] border border-[#ff7a00]/40 text-xs font-mono font-medium cursor-pointer transition-colors shrink-0"
                >
                  Tuỳ chỉnh phím
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DEFAULT_SHORTCUTS.slice(0, 8).map((s) => {
                const keys = customMap[s.id] || s.defaultKeys;
                return (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] flex items-center justify-between gap-2"
                  >
                    <span className="text-slate-700 dark:text-neutral-300 truncate text-[11px]">{s.description}</span>
                    <div className="flex items-center gap-1 shrink-0 font-mono">
                      {keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-[#222230] border border-[#303044] text-[10px] text-slate-800 dark:text-neutral-200"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-5 py-3 bg-[#0f0f15] border-t border-slate-200 dark:border-[#1e1e28] flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Skyer Quick Reference</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-700 dark:text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
