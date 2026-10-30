import React, { useState } from "react";
import { Bot, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { ContactModal } from "./ContactModal";

export function MarketplaceCustomAgentBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="relative mt-12 p-7 sm:p-8 rounded-3xl bg-[#F8F3ED] dark:bg-[#11151f] border border-[#ECE5DC] dark:border-white/10 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 text-neutral-600 dark:text-neutral-300 text-[11px] font-mono">
              <span>BESPOKE AI COLLEAGUE</span>
            </div>
            <h3 className="text-xl md:text-2xl font-medium text-[#252522] dark:text-white tracking-tight">
              Chưa tìm thấy vị trí Nhân viên AI phù hợp với doanh nghiệp?
            </h3>
            <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Huấn luyện nhân viên AI riêng theo quy trình nội bộ (SOP), kết nối trực tiếp ERPCore, BaseCore và vận hành trên máy tính độc lập On-Premise.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" /> Máy tính độc lập On-Premise</span>
              <span className="flex items-center gap-1.5"><Cpu size={13} className="text-[#c2540a] dark:text-[#f8a87c]" /> Đồng bộ AgentCore & Knowledge Base KB</span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-full bg-[#252522] dark:bg-[#f8a87c] text-[#FFFCFA] dark:text-black font-medium text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
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
