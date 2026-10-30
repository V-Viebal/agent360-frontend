import React, { useState, useEffect } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { AgentAvatar } from "./AgentAvatar";
import { ContactModal } from "./ContactModal";

export function StrawberryComparisonSection() {
  const { language } = useTranslation();
  const isVi = language === "vi";
  const [isRunning, setIsRunning] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [cursorRowIdx, setCursorRowIdx] = useState(0);

  const rows = [
    { id: 1, company: "VinFast Auto", doc: "PO-2026-891", tax: "TT99 Mẫu 02-VT", amount: "482.500.000₫" },
    { id: 2, company: "Masan Consumer", doc: "PO-2026-892", tax: "TT99 Mẫu 01-VT", amount: "195.000.000₫" },
    { id: 3, company: "FPT Software", doc: "PO-2026-894", tax: "TT99 Mẫu 02-VT", amount: "310.800.000₫" },
    { id: 4, company: "Viettel Post", doc: "PO-2026-899", tax: "TT99 Mẫu 03-TT", amount: "128.400.000₫" },
  ];

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setCursorRowIdx((prev) => (prev + 1) % rows.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [isRunning, rows.length]);

  const cursorPositions = [
    { x: 240, y: 58 },
    { x: 280, y: 92 },
    { x: 220, y: 126 },
    { x: 265, y: 160 },
  ];

  const currentCursor = cursorPositions[cursorRowIdx] || cursorPositions[0];

  return (
    <section className="py-20 sm:py-28 border-b border-[var(--border-card)] bg-[var(--bg-page)] transition-colors select-none">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">

        {/* Clean Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-[46px] font-normal leading-[1.1] tracking-[-1.9px] text-[#252522] dark:text-[#f3f4f6]">
            {isVi ? (
              <>
                Tạm biệt cảnh <span className="whitespace-nowrap">copy-paste</span> giữa các tab
              </>
            ) : (
              "Stop copy-pasting between chat tabs"
            )}
          </h2>
        </div>

        {/* 2-Column Visual Comparison (Exact Strawberry Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[38.4px] items-stretch">

          {/* LEFT COLUMN: Working with chatbots */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Top Icon Cluster + Title */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center -space-x-1.5 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#161a24] border border-[#ECE5DC] dark:border-white/10 shadow-sm flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 rotate-[-6deg]">
                    GPT
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#161a24] border border-[#ECE5DC] dark:border-white/10 shadow-sm flex items-center justify-center text-xs font-bold text-amber-600 dark:text-amber-400 z-10">
                    CL
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#161a24] border border-[#ECE5DC] dark:border-white/10 shadow-sm flex items-center justify-center text-xs font-bold text-sky-600 dark:text-sky-400 rotate-[6deg]">
                    AI
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#252522] dark:text-[#f3f4f6] tracking-tight">
                  {isVi ? "Làm việc với Chatbot" : "Working with chatbots"}
                </h3>
              </div>

              {/* Visual Viewport Frame: Tilted Cluttered Windows */}
              <div className="rounded-3xl border border-[#ECE5DC] dark:border-white/10 bg-[#F8F3ED] dark:bg-[#0d1017] p-5 h-[340px] relative overflow-hidden shadow-xs">

                {/* Window 1: Underlying LinkedIn / ERP Tab (Tilted Left) */}
                <div className="absolute top-5 left-5 w-[68%] rounded-xl bg-white dark:bg-[#151924] border border-[#ECE5DC] dark:border-white/10 p-3 shadow-md rotate-[-2deg] opacity-80">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-100 dark:border-white/5">
                    <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-white/20" />
                    <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">eInvoice_Viettel_T10.pdf</span>
                  </div>
                  <div className="mt-2.5 space-y-1.5">
                    <div className="text-[11px] font-bold text-[#252522] dark:text-neutral-200">Hóa đơn GTGT #00891</div>
                    <div className="h-2 w-32 bg-neutral-200 dark:bg-white/10 rounded" />
                    <div className="h-2 w-24 bg-neutral-100 dark:bg-white/5 rounded" />
                  </div>
                </div>

                {/* Window 2: Underlying Empty Spreadsheet (Tilted Right) */}
                <div className="absolute top-10 right-4 w-[66%] rounded-xl bg-white dark:bg-[#151924] border border-[#ECE5DC] dark:border-white/10 p-3 shadow-md rotate-[2deg] opacity-90">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-white/5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                    <span>So_Cai_TT99.xlsx</span>
                    <span>100%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 mt-2 text-[9px] font-mono text-neutral-500 dark:text-neutral-400 border-b border-neutral-100 dark:border-white/5 pb-1">
                    <span>Đối tác</span>
                    <span>Mã PO</span>
                    <span>Số tiền</span>
                  </div>
                  <div className="h-14 flex items-center justify-center text-[10px] font-mono text-neutral-400 dark:text-neutral-500 italic">
                    {isVi ? "(Chờ bạn gõ từng dòng...)" : "(Waiting for manual paste...)"}
                  </div>
                </div>

                {/* Window 3: Foreground Isolated Chat Window */}
                <div className="absolute bottom-4 left-6 right-6 rounded-2xl bg-white dark:bg-[#1a1f2e] border border-[#ECE5DC] dark:border-white/15 p-4 shadow-xl">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
                    <span className="font-semibold text-[#252522] dark:text-neutral-200">Chat Box</span>
                    <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-medium">
                      {isVi ? "Không kết nối bảng tính" : "Disconnected"}
                    </span>
                  </div>
                  <div className="text-[11px] bg-[#F8F3ED] dark:bg-white/5 text-[#252522] dark:text-neutral-200 px-3 py-1.5 rounded-lg mb-2">
                    {isVi ? "Đọc 4 hóa đơn PDF rồi điền vào Sổ Cái Excel giúp tôi." : "Read 4 invoices and fill the Excel sheet."}
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-white/5">
                    {isVi
                      ? "Tôi đã tóm tắt bên dưới. Bạn hãy tự mở Excel và copy-paste từng ô nhé:"
                      : "Here is the text summary. Please manually copy and paste each cell into Excel:"}
                  </div>
                </div>
              </div>

              {/* 3 Ultra-Clean Bullet Points */}
              <div className="mt-6 space-y-3 px-2">
                {[
                  isVi ? "Bị kẹt trong khung chat cô lập" : "Struggles to work in your tabs",
                  isVi ? "Bạn phải tự copy-paste thủ công" : "Forces manual copy-pasting",
                  isVi ? "Mất ngữ cảnh sau mỗi phiên" : "Everyone works in isolation",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-[#252522]/85 dark:text-neutral-300">
                    <span className="h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                      ✕
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Working with Skyer */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Top Skyer Avatar + Title */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center mb-3">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#161a24] border border-[#f8a87c]/50 shadow-sm flex items-center justify-center">
                    <AgentAvatar
                      agent={{ id: "cora-finance", name: "An Kế toán", roleTag: "finance" }}
                      size="xs"
                      alwaysAnimate
                      interactive={false}
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4", seed: 202 },
                      }}
                    />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#252522] dark:text-[#f3f4f6] tracking-tight">
                  {isVi ? "Làm việc với Skyer" : "Working with Skyer"}
                </h3>
              </div>

              {/* Visual Viewport Frame: Unified Autonomous Browser + Live Cursor */}
              <div className="rounded-3xl border-2 border-[#f8a87c]/50 bg-[#F8F3ED] dark:bg-[#0d1017] p-4 h-[340px] relative overflow-hidden shadow-md flex flex-col justify-between">

                {/* Unified Browser Window */}
                <div className="rounded-2xl bg-white dark:bg-[#131722] border border-[#ECE5DC] dark:border-white/10 shadow-sm flex-1 flex flex-col overflow-hidden relative">

                  {/* Browser Tab Bar */}
                  <div className="h-8 bg-[#F8F3ED]/90 dark:bg-[#0c0e14] border-b border-[#ECE5DC] dark:border-white/5 px-3 flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                      <div className="ml-2 px-2.5 py-0.5 rounded-md bg-white dark:bg-[#1a1f2e] text-[#252522] dark:text-neutral-200 font-semibold flex items-center gap-1.5 shadow-2xs border border-[#ECE5DC]/60 dark:border-white/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>ERPCore // Sổ Cái TT99</span>
                      </div>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">On-Premise VM</span>
                  </div>

                  {/* Split Inside Browser: Left Companion Rail + Right Live Spreadsheet */}
                  <div className="flex-1 grid grid-cols-12 overflow-hidden relative">

                    {/* Left Companion Mini Sidebar */}
                    <div className="col-span-4 border-r border-[#ECE5DC]/70 dark:border-white/5 p-3 flex flex-col justify-between bg-[#FFFDF9] dark:bg-white/[0.01]">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <AgentAvatar
                            agent={{ id: "an-kt", name: "An Kế toán" }}
                            size="2xs"
                            alwaysAnimate
                            interactive={false}
                            overrideConfig={{
                              type: "blob",
                              blob: { shape: "bear", expression: "happy", color: "#34d399", animation: "nod.1.4", seed: 202 },
                            }}
                          />
                          <span className="text-[11px] font-bold text-[#252522] dark:text-white truncate">An Kế toán</span>
                        </div>
                        <div className="text-[10px] text-neutral-600 dark:text-neutral-400 bg-white dark:bg-white/5 p-2 rounded-lg border border-[#ECE5DC] dark:border-white/5 leading-snug">
                          {isVi
                            ? "Đang khớp 4 hóa đơn điện tử và lập chứng từ TT99..."
                            : "Matching 4 e-invoices into TT99 ledger..."}
                        </div>
                      </div>

                      <div className="space-y-1 text-[9px] font-mono text-emerald-700 dark:text-emerald-400 font-medium">
                        <div>✓ Đọc XML Thuế</div>
                        <div>✓ Khớp PO 3 bên</div>
                        <div>✓ Ghi sổ ERPCore</div>
                      </div>
                    </div>

                    {/* Right Live Spreadsheet Canvas */}
                    <div className="col-span-8 p-3 font-mono text-[10px] relative bg-white dark:bg-[#131722]">
                      <div className="grid grid-cols-12 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-white/10 pb-1 mb-1.5 text-[9px]">
                        <span className="col-span-5">Doanh nghiệp</span>
                        <span className="col-span-4">Chuẩn TT99</span>
                        <span className="col-span-3 text-right">Trạng thái</span>
                      </div>

                      <div className="space-y-1.5">
                        {rows.map((r, idx) => {
                          const isCurrent = idx === cursorRowIdx;
                          return (
                            <div
                              key={r.id}
                              className={
                                "grid grid-cols-12 items-center px-1.5 py-1 rounded transition-colors " +
                                (isCurrent
                                  ? "bg-emerald-500/10 border border-emerald-500/30"
                                  : "border-b border-neutral-100 dark:border-white/5")
                              }
                            >
                              <span className="col-span-5 font-semibold text-[#252522] dark:text-white truncate">
                                {r.company}
                              </span>
                              <span className="col-span-4 text-neutral-500 dark:text-neutral-400 truncate text-[9px]">
                                {r.tax}
                              </span>
                              <span className="col-span-3 text-right text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-0.5">
                                <Check size={10} /> {isCurrent ? "Đang ghi" : "Khớp"}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Named Floating AI Cursor */}
                      <motion.div
                        animate={{ x: currentCursor.x - 160, y: currentCursor.y - 35 }}
                        transition={{ type: "spring", stiffness: 120, damping: 18 }}
                        className="absolute top-0 left-0 pointer-events-none z-20 flex items-center gap-1"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981" className="drop-shadow-md">
                          <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                        </svg>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-sans font-bold shadow-md whitespace-nowrap">
                          An Kế toán
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom Floating Control Pill */}
                  <div className="absolute bottom-2 right-2.5 z-30 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 dark:bg-[#18181b] text-neutral-900 dark:text-white text-[9px] shadow-md border border-emerald-200/80 dark:border-white/15 backdrop-blur-md whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                      {isVi ? "An Kế toán điều khiển" : "Controlled by An"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsRunning(!isRunning)}
                      className="px-2 py-0.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-white/20 dark:hover:bg-white/30 text-neutral-800 dark:text-white border border-neutral-200 dark:border-transparent text-[8.5px] font-semibold cursor-pointer transition-colors shadow-xs whitespace-nowrap"
                    >
                      {isRunning ? (isVi ? "Tiếp quản" : "Take over") : (isVi ? "Tiếp tục" : "Resume")}
                    </button>
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white keep-white text-[8.5px] font-semibold shadow-xs whitespace-nowrap">
                      Stop
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 Ultra-Clean Bullet Points */}
              <div className="mt-6 space-y-3 px-2">
                {[
                  isVi ? "Thao tác trực tiếp trên tab & bảng tính" : "Built to work in your tabs",
                  isVi ? "Chạy 100% On-Premise hoặc Cloud riêng" : "Runs on-premise or private cloud",
                  isVi ? "Chia sẻ bộ nhớ quy trình toàn công ty" : "Built-in team collaboration",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm font-medium text-[#252522] dark:text-[#f3f4f6]">
                    <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                      ✓
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
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
