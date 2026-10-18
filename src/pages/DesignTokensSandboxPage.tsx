import React, { useState } from "react";
import { 
  Sun, Moon, Sparkles, Layers, Box, Check, X, 
  ChevronDown, Search, Command, AlertCircle, ArrowRight
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { CustomSelect } from "../components/ui/CustomSelect";

export function DesignTokensSandboxPage() {
  const { themeMode, resolvedTheme, setThemeMode } = useTheme();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectVal, setSelectVal] = useState("option1");

  const colorTokens = [
    { name: "--bg-page", label: "Page Background", varName: "var(--bg-page)" },
    { name: "--bg-workspace", label: "Workspace Canvas", varName: "var(--bg-workspace)" },
    { name: "--bg-sidebar", label: "Sidebar Background", varName: "var(--bg-sidebar)" },
    { name: "--bg-card", label: "Card / Panel Surface", varName: "var(--bg-card)" },
    { name: "--bg-card-hover", label: "Card Hover", varName: "var(--bg-card-hover)" },
    { name: "--text-primary", label: "Primary Text", varName: "var(--text-primary)" },
    { name: "--text-secondary", label: "Secondary Text", varName: "var(--text-secondary)" },
    { name: "--border-card", label: "Card Border", varName: "var(--border-card)" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] p-6 sm:p-10 font-sans transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header & Theme Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 mb-2">
              <Sparkles size={13} />
              <span>UI DESIGN TOKENS & OVERLAY SANDBOX</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
              Light & Dark Mode Consistency Studio
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Kiểm tra trực quan tính nhất quán giữa Light/Dark mode cho Overlays, Modals, Dropdowns & Tokens.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs">
            <button
              onClick={() => setThemeMode("light")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                themeMode === "light"
                  ? "bg-amber-500 text-white shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Sun size={14} />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => setThemeMode("dark")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                themeMode === "dark"
                  ? "bg-[#1f1f2e] text-white shadow-xs font-semibold border border-[#3e3e56]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Moon size={14} />
              <span>Dark Mode</span>
            </button>
            <button
              onClick={() => setThemeMode("system")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                themeMode === "system"
                  ? "bg-[#ff7a00] text-black shadow-xs font-semibold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Layers size={14} />
              <span>System ({resolvedTheme})</span>
            </button>
          </div>
        </div>

        {/* Section 1: Semantic Design Tokens Palette */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Box size={18} className="text-[#ff7a00]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Semantic Tokens Palette</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {colorTokens.map((tok) => (
              <div 
                key={tok.name}
                className="p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs space-y-3"
              >
                <div 
                  className="h-12 w-full rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-inner"
                  style={{ backgroundColor: tok.varName }}
                />
                <div>
                  <div className="text-xs font-mono font-semibold text-[var(--text-primary)] truncate">{tok.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">{tok.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Overlays, Modals & Dialog Triggers */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-blue-500" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Interactive Modal & Overlay Tests</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal("confirm")}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] text-[var(--text-primary)] shadow-xs cursor-pointer transition-all"
            >
              Test Confirmation Dialog
            </button>
            <button
              onClick={() => setActiveModal("command")}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#ff7a00] hover:bg-[#ff8f26] text-black shadow-xs cursor-pointer transition-all"
            >
              Test Palette Overlay (Mock Ctrl+K)
            </button>
          </div>
        </section>

        {/* Section 3: Dropdowns & Selectors Preview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ChevronDown size={18} className="text-emerald-500" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Dropdowns & Tooltips Layering</h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text-secondary)]">CustomSelect Component (Floating Dropdown)</label>
              <CustomSelect
                value={selectVal}
                onChange={setSelectVal}
                options={[
                  { value: "option1", label: "Executive Autonomous Cluster" },
                  { value: "option2", label: "Financial Audit & FP&A Teammate" },
                  { value: "option3", label: "Customer Experience 24/7 Desk" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[var(--text-secondary)]">Interactive Card Hover State</label>
              <div className="p-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-card)] transition-colors cursor-pointer flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[var(--text-primary)]">Adaptive Hover Reaction</div>
                  <div className="text-[11px] text-[var(--text-secondary)]">Hover thử để kiểm tra độ dịu mắt ở Light/Dark mode.</div>
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)]" />
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Confirmation Modal Test */}
      {activeModal === "confirm" && (
        <div 
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#14141c] border border-[#262634] p-5 shadow-2xl text-neutral-200 font-sans space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <AlertCircle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Xác nhận Thao tác?</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Kiểm tra xem hộp thoại có đổi màu sang nền trắng sáng và chữ slate đậm trong Light mode không.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#22222e]">
              <button
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:bg-neutral-500/10 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#ff7a00] hover:bg-[#ff8f26] text-black cursor-pointer transition-colors"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Palette Overlay Test */}
      {activeModal === "command" && (
        <div
          onClick={() => setActiveModal(null)}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 backdrop-blur-sm px-4 pt-[15vh] animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0d12] shadow-2xl overflow-hidden font-sans"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 h-12">
              <Search size={16} className="text-neutral-500" />
              <input
                autoFocus
                placeholder="Search actions or commands..."
                className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
              />
              <kbd className="text-[10px] font-mono text-neutral-500 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="p-2 space-y-1">
              {["Jump to AI Workspace", "Review On-Premise Documentation", "Export Agent Topology Graph"].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveModal(null)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs text-neutral-200 hover:bg-neutral-500/10 cursor-pointer transition-colors"
                >
                  <span className="font-medium text-white">{item}</span>
                  <ArrowRight size={13} className="text-neutral-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
