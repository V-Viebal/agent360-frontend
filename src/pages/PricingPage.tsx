import React, { useState } from "react";
import { SeoHead } from "../components/SeoHead";
import { useTranslation } from "../i18n/LanguageContext";
import { StrawberryPricingSection } from "../components/StrawberryPricingSection";
import { ChevronDown } from "lucide-react";

export function PricingPage() {
  const { language } = useTranslation();
  const isVi = language === "vi";
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans transition-colors">
      <SeoHead
        title={isVi ? "Bảng giá — Skyer AI Workforce" : "Pricing — Skyer AI Workforce"}
        description={
          isVi
            ? "Bắt đầu miễn phí, nâng cấp linh hoạt khi quy mô mở rộng. Tuyển thực tập sinh AI, nhân viên bán thời gian hoặc triển khai On-Premise toàn diện."
            : "Start for free, upgrade as you grow. Hire AI interns, part-time or full-time teammates, or deploy 100% On-Premise."
        }
        canonicalPath="/pricing"
      />

      <StrawberryPricingSection isStandalonePage={true} />

      {/* Testimonials ("Loved by ambitious teams" like Strawberry /pricing) */}
      <section className="py-20 border-b border-[#ECE5DC] dark:border-white/10 bg-[var(--bg-page)]">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <h2
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            className="text-3xl sm:text-[42px] leading-[1.12] tracking-[-1.7px] text-center text-[#252522] dark:text-white mb-12"
          >
            {isVi ? "Được tin dùng bởi các đội ngũ tham vọng" : "Loved by ambitious teams"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: isVi
                  ? "“Skyer đã thay đổi hoàn toàn cách phòng kế toán làm việc. An Kế Toán tự mở trình duyệt, khớp 48 hóa đơn điện tử với ERPCore mà không cần ai copy-paste.”"
                  : "“Skyer has impressed our entire finance team. Our AI colleague reconciles vendor e-invoices directly in ERPCore without manual copy-pasting.”",
                author: "Nguyễn Minh Tuấn",
                role: isVi ? "Giám đốc Tài chính • Khối Sản xuất" : "CFO • Manufacturing Group",
              },
              {
                quote: isVi
                  ? "“Khả năng chạy trên máy tính độc lập On-Premise giúp chúng tôi yên tâm tuyệt đối về bảo mật hợp đồng và dữ liệu khách hàng doanh nghiệp.”"
                  : "“Having every AI teammate operate on its own isolated On-Premise computer gave our security and legal board immediate peace of mind.”",
                author: "Trần Thanh Hương",
                role: isVi ? "Trưởng ban Pháp chế & Tuân thủ" : "Head of Legal & Compliance",
              },
              {
                quote: isVi
                  ? "“Tầm nhìn đơn giản nhưng đột phá: thay vì chat với một con bot bị giam trong khung chat, giờ đây chúng tôi có những đồng nghiệp AI thực thụ.”"
                  : "“Their vision is simple but radical: instead of chatting in an isolated box, we now have real AI colleagues with their own computers.”",
                author: "Lê Hoàng Nam",
                role: isVi ? "CEO & Đồng sáng lập • B2B Commerce" : "CEO & Co-founder • B2B Commerce",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-[24px] bg-[#F3EDE4]/65 dark:bg-[#11151f] border border-[#E6DFD5] dark:border-white/10 p-7 flex flex-col justify-between space-y-6"
              >
                <p className="font-newsreader text-[16px] leading-[1.5] text-[#252522] dark:text-neutral-200">
                  {item.quote}
                </p>
                <div className="pt-2 border-t border-[#E6DFD5]/80 dark:border-white/10">
                  <div className="text-[13px] font-semibold text-[#252522] dark:text-white">{item.author}</div>
                  <div className="text-[11.5px] text-[#252522]/60 dark:text-neutral-400">{item.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="py-20 bg-[var(--bg-page)]">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <h2
            style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
            className="text-2xl sm:text-[38px] tracking-[-1.5px] text-center mb-10 text-[#252522] dark:text-white"
          >
            {isVi ? "Câu hỏi thường gặp về Bảng giá" : "Pricing FAQ"}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: isVi ? "Tín chỉ thực thi (Credits) được tính như thế nào?" : "How do monthly execution credits work?",
                a: isVi
                  ? "Mọi thao tác quản trị, xem báo cáo và duyệt kết quả đều miễn phí. Tín chỉ chỉ được trừ khi nhân viên AI khởi chạy tác vụ thực tế trên máy tính riêng của họ."
                  : "Browsing and workspace management are always free. Credits are only consumed when your AI teammates actively execute tasks on their dedicated computers.",
              },
              {
                q: isVi ? "Tôi có thể chuyển đổi giữa gói Cá nhân, Đội ngũ và On-Premise không?" : "Can we upgrade from Individual or Team to On-Premise Enterprise?",
                a: isVi
                  ? "Hoàn toàn được. Toàn bộ bộ nhớ MEMORY.md, quy trình SOP và cấu hình nhân viên AI được giữ nguyên khi chuyển sang cụm máy chủ On-Premise riêng."
                  : "Yes. All institutional memory (MEMORY.md), SOPs, and companion configurations migrate seamlessly to your private On-Premise cluster.",
              },
            ].map((item, idx) => (
              <div key={item.q} className="rounded-2xl border border-[#ECE5DC] dark:border-white/10 bg-[#FFFDF9] dark:bg-[#11151f]">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-[#252522] dark:text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown size={16} className={openFaq === idx ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
