import React, { useState } from "react";
import { Star, Keyboard, Trash2, ArrowRight, CornerDownLeft, Copy, Check } from "lucide-react";
import { ChatMessage } from "../types/agent";
import { DEFAULT_SHORTCUTS, getCustomShortcutsMap } from "./KeyboardShortcutsModal";
import { Modal } from "./ui/Modal";

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const headerTitle = (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#101016] p-1 rounded-xl border border-slate-200 dark:border-[#22222e]">
      <button
        type="button"
        onClick={() => setActiveTab("starred")}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          activeTab === "starred"
            ? "bg-[#f8a87c] text-black font-semibold shadow-xs"
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
            ? "bg-[#f8a87c] text-black font-semibold shadow-xs"
            : "text-slate-500 dark:text-neutral-400 hover:text-white"
        }`}
      >
        <Keyboard size={13} />
        <span>Keyboard Quick Ref</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={headerTitle}
      maxWidth="xl"
    >
      {/* Content Body */}
      <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
        {activeTab === "starred" ? (
          starredMessages.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-10 w-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Star size={20} />
              </div>
              <div className="text-xs font-semibold text-slate-800 dark:text-white">Chưa có tin nhắn nào được gắn sao</div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400 max-w-sm">
                Nhấp vào biểu tượng ngôi sao bên cạnh bất kỳ câu trả lời nào của Agent để lưu lại đây để tra cứu nhanh.
              </p>
            </div>
          ) : (
            starredMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] hover:border-[#f8a87c]/30 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#f8a87c] uppercase font-mono">
                      {msg.role === "assistant" ? "🤖 Agent Response" : "👤 User Turn"}
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">
                      {msg.timestamp || "Saved"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#20202c] text-neutral-400 hover:text-white transition-colors"
                      title="Sao chép nội dung"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    {onSelectMessage && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectMessage(msg);
                          onClose();
                        }}
                        className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-[#20202c] text-neutral-400 hover:text-[#f8a87c] transition-colors"
                        title="Xem vị trí trong hội thoại"
                      >
                        <ArrowRight size={12} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onUnstar(msg.id)}
                      className="p-1 rounded-md hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Bỏ gắn sao"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-slate-700 dark:text-neutral-300 font-sans leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            ))
          )
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#22222e] flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-neutral-400">Tùy biến và gán phím tắt cá nhân</span>
              {onOpenShortcutsCustomizer && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenShortcutsCustomizer();
                  }}
                  className="px-3 py-1 rounded-lg bg-[#f8a87c]/15 hover:bg-[#f8a87c]/25 text-[#f8a87c] border border-[#f8a87c]/30 font-medium transition-all"
                >
                  Mở Trình Tùy Biến
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {DEFAULT_SHORTCUTS.slice(0, 10).map((sc) => {
                const currentKey = customMap[sc.id] || sc.defaultKeys.join(" + ");
                return (
                  <div
                    key={sc.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#161620] border border-slate-200 dark:border-[#20202c] flex items-center justify-between"
                  >
                    <span className="text-slate-700 dark:text-neutral-300 truncate pr-2">{sc.description}</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-200 dark:bg-[#20202c] border border-slate-300 dark:border-[#2e2e40] font-mono text-[10px] text-slate-800 dark:text-neutral-200 shrink-0">
                      {currentKey}
                    </kbd>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 dark:border-[#22222e] bg-slate-50 dark:bg-[#161620] flex items-center justify-between text-[11px] text-neutral-500">
        <span className="font-mono">
          {activeTab === "starred" ? `${starredMessages.length} mục đã lưu` : "Tối ưu cho luồng làm việc tốc độ cao"}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-xl bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold transition-all cursor-pointer text-xs"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
}
