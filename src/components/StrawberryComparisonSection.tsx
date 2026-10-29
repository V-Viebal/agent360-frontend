import React, { useState, useEffect } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { Check, X, ArrowRight, Bot, Sparkles, Square, Play, Shield, Terminal, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContactModal } from "./ContactModal";

export function StrawberryComparisonSection() {
  const { language } = useTranslation();
  const isVi = language === "vi";
  const [isRunning, setIsRunning] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(2);

  // Dynamic autonomous simulation rows
  const [sheetRows, setSheetRows] = useState([
    { id: 1, company: "VinFast Auto", role: "Trưởng phòng Cung ứng", fit: "Strong fit", status: "Done", erpRef: "SO-8821" },
    { id: 2, company: "Masan Group", role: "GĐ Tài chính & Kế toán", fit: "Strong fit", status: "Done", erpRef: "SO-8822" },
    { id: 3, company: "FPT Software", role: "Tech Lead On-premise", fit: "Strong fit", status: "Done", erpRef: "SO-8823" },
    { id: 4, company: "Viettel Telecom", role: "Phó Ban Chuyển đổi số", fit: "Analyzing...", status: "In Progress", erpRef: "Pending" },
  ]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
      setSheetRows((prev) => {
        const next = [...prev];
        const isVerifying = next[3].status === "In Progress";
        next[3] = isVerifying
          ? { id: 4, company: "Viettel Telecom", role: "Phó Ban Chuyển đổi số", fit: "Strong fit", status: "Done", erpRef: "SO-8824" }
          : { id: 4, company: "Viettel Telecom", role: "Phó Ban Chuyển đổi số", fit: "Analyzing...", status: "In Progress", erpRef: "Pending" };
        return next;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <section className="py-20 sm:py-28 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] transition-colors select-none">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Pill Badge */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 text-[11px] font-mono">
            <Sparkles size={13} />
            <span>{isVi ? "CHUYỂN GIAO THỰC THI" : "WORKFORCE REVOLUTION"}</span>
          </div>
          <h2 className="text-3xl sm:text-[46px] font-normal leading-[1.12] tracking-[-1.9px] text-neutral-900 dark:text-white max-w-2xl mx-auto">
            {isVi ? "Chatbot rời rạc vs. Đồng đội AI Tự vận hành" : "Working with Chatbots vs. Working with Skyer"}
          </h2>
          <p className="text-base sm:text-[19px] text-neutral-600 dark:text-neutral-400 leading-[1.4] max-w-xl mx-auto font-normal">
            {isVi
              ? "Thay vì con người phải làm 'cầu nối thủ công' copy-paste giữa khung chat và hệ thống, Skyer làm việc trực tiếp trên trình duyệt, bảng tính và cơ sở dữ liệu nội bộ của bạn."
              : "Instead of humans serving as manual messengers copying text between chat windows and ERP software, Skyer operates directly inside your actual spreadsheets, web apps, and internal databases."}
          </p>
        </div>

        {/* 2-Column Comparison Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[38.4px] items-stretch">
          
          {/* LEFT CARD: Working with Traditional Chatbots */}
          <div className="rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c0e15] p-6 sm:p-8 flex flex-col justify-between shadow-sm">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
                  <span className="font-mono text-sm font-bold">1.0</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    {isVi ? "Làm việc với Chatbot thông thường" : "Working with Traditional Chatbots"}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">ChatGPT • Claude • Standalone Bots</p>
                </div>
              </div>

              {/* Visual Frame: Tilted Stack of Windows representing manual fragmented workflow */}
              <div className="relative rounded-2xl bg-neutral-100 dark:bg-[#080a10] border border-neutral-200 dark:border-white/5 p-4 h-72 overflow-hidden flex flex-col justify-between">
                
                {/* Background Window: Customer Spreadsheet */}
                <div className="absolute top-3 inset-x-4 bg-white dark:bg-[#151922] rounded-xl border border-neutral-200 dark:border-white/10 p-3 shadow-sm opacity-60">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pb-1 border-b border-neutral-200 dark:border-white/5">
                    <span>Customer_Shortlist.xlsx</span>
                    <span>100% • Arial</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 w-36 bg-neutral-300 dark:bg-white/15 rounded" />
                    <div className="h-2 w-48 bg-neutral-200 dark:bg-white/10 rounded" />
                    <div className="h-2 w-40 bg-neutral-200 dark:bg-white/10 rounded" />
                  </div>
                </div>

                {/* Overlapping Window: Chat Prompt Dialog */}
                <div className="relative z-10 self-center mt-6 w-full max-w-sm bg-white dark:bg-[#1a1e29] rounded-xl border border-neutral-200 dark:border-white/15 shadow-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 border-b border-neutral-100 dark:border-white/5 pb-2">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Chatbot Prompt</span>
                    <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">Tách biệt tab</span>
                  </div>
                  
                  {/* User Question */}
                  <div className="text-xs bg-slate-100 dark:bg-white/5 p-2 rounded-lg text-neutral-800 dark:text-neutral-200">
                    "Tìm 3 khách hàng tiềm năng ngành B2B rồi ghi vào file Excel giúp tôi."
                  </div>
                  
                  {/* Bot Passive Reply */}
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg border border-neutral-200 dark:border-white/5">
                    "Dưới đây là 3 doanh nghiệp: VinFast, Masan, FPT. Bạn vui lòng mở file Excel và copy-paste từng dòng vào nhé."
                  </div>
                </div>

                {/* Warning Footer Pill */}
                <div className="relative z-10 text-center">
                  <span className="inline-block px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25 rounded-full text-[11px] font-mono font-medium">
                    {isVi ? "✕ Con người phải copy-paste thủ công" : "✕ Human must manually copy-paste"}
                  </span>
                </div>
              </div>

              {/* Drawbacks Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <span>{isVi ? "Bị giam trong khung chat, không thể thao tác trên các tab phần mềm" : "Struggles to work in your tabs; locked inside an isolated chat box"}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <span>{isVi ? "Phụ thuộc API connector bên ngoài, không thể chạy độc lập On-premise" : "Limited to generic cloud connectors with zero private on-premise execution"}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✕
                  </div>
                  <span>{isVi ? "Mỗi người dùng làm việc cô lập, thiếu bộ nhớ quy trình tổ chức dùng chung" : "Everyone works in isolation with zero continuous institutional memory"}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-white/10 text-neutral-400 text-xs font-mono">
              {isVi ? "Mô hình chatbot đàm thoại cơ bản (2023 - 2024)" : "Generic conversational AI assistant"}
            </div>
          </div>

          {/* RIGHT CARD: Working with Skyer AI Employees */}
          <div className="rounded-3xl border-2 border-[#f8a87c]/50 bg-white dark:bg-[#0c0e15] p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Ambient Warm Glow */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#f8a87c]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#f8a87c]/20 border border-[#f8a87c]/40 flex items-center justify-center text-[#f8a87c]">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>{isVi ? "Làm việc với Nhân viên AI Skyer" : "Working with Skyer AI Workforce"}</span>
                      <span className="text-[10px] font-mono bg-[#f8a87c] text-black px-2 py-0.5 rounded-full font-bold">2.0 OS</span>
                    </h3>
                    <p className="text-xs text-[#f8a87c] font-mono">Bespoke Teammates • Máy tính độc lập • On-Premise</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-white/10 text-[11px] font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {isRunning ? <Square size={10} className="text-amber-400" /> : <Play size={10} className="text-emerald-400" />}
                  <span>{isRunning ? "Tạm dừng" : "Tiếp tục"}</span>
                </button>
              </div>

              {/* Visual Simulation: Side-by-Side Companion + Sheet Window */}
              <div className="rounded-2xl bg-[#0a0d14] border border-slate-800 p-4 h-72 overflow-hidden flex flex-col justify-between text-xs font-mono shadow-inner">
                
                {/* Browser Tab Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 text-[11px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">Ellis (Executive AI)</span>
                    <span className="text-slate-500">• Đang điều khiển Máy tính độc lập</span>
                  </div>
                  <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                    Live Autopilot
                  </span>
                </div>

                {/* Live Sheet Grid with Dynamic Simulated Typing */}
                <div className="space-y-1.5 my-auto">
                  <div className="grid grid-cols-12 text-[10px] text-slate-500 pb-1.5 border-b border-slate-800">
                    <span className="col-span-1">#</span>
                    <span className="col-span-4">Doanh nghiệp</span>
                    <span className="col-span-4">Chức danh / Quy trình</span>
                    <span className="col-span-3 text-right">Mã đối soát</span>
                  </div>

                  {sheetRows.map((r) => (
                    <div
                      key={r.id}
                      className="grid grid-cols-12 text-[11px] items-center py-1 border-b border-slate-800/40 text-slate-200"
                    >
                      <span className="col-span-1 text-slate-500">{r.id}</span>
                      <span className="col-span-4 font-semibold text-white truncate">{r.company}</span>
                      <span className="col-span-4 text-slate-300 truncate">{r.role}</span>
                      <span className="col-span-3 text-right flex items-center justify-end gap-1">
                        {r.status === "Done" ? (
                          <span className="text-emerald-400 text-[10px] flex items-center gap-0.5 font-mono">
                            <Check size={11} /> {r.erpRef}
                          </span>
                        ) : (
                          <span className="text-amber-400 text-[10px] animate-pulse font-mono">Đang cập nhật...</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Autonomous Action Bar */}
                <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-5 w-5 rounded-md bg-[#f8a87c] text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                      AI
                    </div>
                    <span className="text-slate-300 truncate">
                      {activeStep % 2 === 0
                        ? "Đang đối soát đơn hàng trên ERPCore và cập nhật bảng tính..."
                        : "Tự động phân loại lead B2B và chuẩn bị dự thảo hợp đồng..."}
                    </span>
                  </div>
                  <span className="text-emerald-400 text-[10px] font-bold shrink-0 ml-2">
                    ✓ Hoàn tất 3/4 bước
                  </span>
                </div>
              </div>

              {/* Skyer Advantages Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span>{isVi ? "Tự mở trình duyệt, thao tác trực tiếp trên giao diện và tài liệu thật" : "Built to work directly inside your browser tabs and spreadsheets"}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span>{isVi ? "Triển khai an toàn On-premise / Private Cloud, dữ liệu không rời hạ tầng" : "Runs on-premise in your private infrastructure with local LLMs"}</span>
                </div>
                <div className="flex items-start gap-3 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-medium">
                  <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <span>{isVi ? "Hệ thống trí nhớ chung MEMORY.md & KB: Agent tự phối hợp và bàn giao việc" : "Shared organizational memory: Seamless handoff between specialized roles"}</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="text-xs font-semibold text-[#f8a87c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isVi ? "Yêu cầu cấu hình Agent theo quy trình riêng" : "Request Bespoke Agent Specification"}</span>
                <ArrowRight size={13} />
              </button>

              <a
                href="/#bots"
                className="px-4 py-2 bg-[#f8a87c] hover:bg-[#f5935f] text-black rounded-full text-xs font-semibold transition-all shadow-[0_0_20px_rgba(248,168,124,0.3)]"
              >
                {isVi ? "Xem Danh mục Đồng đội AI" : "Explore AI Teammates"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultCategory="request_agent"
      />
    </section>
  );
}
