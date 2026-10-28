import React, { useState } from "react";
import { Bot, Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { ContactModal } from "./ContactModal";

export function MarketplaceCustomAgentBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="relative mt-12 p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-sky-950/40 border border-purple-500/20 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles size={13} className="text-purple-400" />
              <span>Bespoke AI Teammate Engineering</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Chưa tìm thấy vị trí Nhân viên AI phù hợp với doanh nghiệp?
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Chúng tôi cấu hình và huấn luyện nhân viên AI độc quyền theo đúng tài liệu vận hành (SOP), kết nối hệ thống nội bộ (ERPCore, BaseCore, CRM) và triển khai an toàn On-premise.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-400" /> Chuẩn bảo mật nội bộ</span>
              <span className="flex items-center gap-1.5"><Cpu size={13} className="text-sky-400" /> Tự động sinh SOUL.md & AGENTS.md</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-semibold text-xs transition-all shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_35px_rgba(168,85,247,0.55)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bot size={15} />
              <span>Đặt hàng Nhân viên AI Mới</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCategory="request_agent"
      />
    </>
  );
}
