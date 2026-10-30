import { SeoHead } from "../components/SeoHead";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Play,
  Check,
  CheckCircle2,
  ChevronDown,
  Plus,
} from "lucide-react";
import { AgentAvatar } from "../components/AgentAvatar";
import { StrawberryComparisonSection } from "../components/StrawberryComparisonSection";
import { StrawberryPricingSection } from "../components/StrawberryPricingSection";
import { ContactModal } from "../components/ContactModal";

export function LandingPage() {
  const { language } = useTranslation();
  const isVi = language === "vi";
  const [contactOpen, setContactOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFoundationTab, setActiveFoundationTab] = useState<"vm" | "onprem" | "gate">("vm");
  const [approvedDemo, setApprovedDemo] = useState(false);
  const [tick, setTick] = useState(0);
  const [heroCursorStep, setHeroCursorStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 3);
      setHeroCursorStep((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const appTaskUrl = (task: string) => `/app?task=${encodeURIComponent(task)}`;

  const heroCursorPos = [
    { x: 260, y: 120 },
    { x: 340, y: 168 },
    { x: 290, y: 215 },
  ][heroCursorStep];

  const companions = [
    {
      id: "minh-boc",
      marketplaceId: "agent-chief-of-staff",
      name: isVi ? "Minh Bốc" : "Executive Minh",
      badge: isVi ? "Trợ lý Điều hành" : "Executive Ops",
      badgeStyle: "bg-[#e0f2fe] text-[#0369a1] dark:bg-sky-500/20 dark:text-sky-300 border-sky-200 dark:border-sky-500/30",
      cardGradient: "from-[#f0f9ff] to-[#FFFDF9] dark:from-[#0f1d2d] dark:to-[#0c0e15]",
      blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4,wink.1.6", seed: 101 },
      desc: isVi
        ? "Tổng hợp KPI mỗi sáng, soạn sẵn dự thảo trả lời email và theo sát đầu việc không để trễ hạn."
        : "Get a brief every morning, replies drafted in your voice, and follow-ups that don't slip.",
      hireText: isVi ? "Tuyển Minh Bốc" : "Hire Minh",
      task: "Tổng hợp báo cáo KPI tuần từ Kinh doanh, Tài chính và dự thảo biên bản họp giao ban",
      renderMiniUi: () => (
        <div className="w-[156px] sm:w-[164px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-sky-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-sky-600 dark:text-sky-400 font-bold border-b border-neutral-100 dark:border-white/5 pb-1">
            <span>OKR // Q4 Board</span>
            <span>08:30 AM</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>Doanh thu B2B</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">108% ✓</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>Runway Quỹ</span>
            <span className="font-bold">18.4 tháng</span>
          </div>
          <div className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[9px] truncate">
            {tick === 0 ? "⚡ Gửi báo cáo..." : "✓ Đã đồng bộ OKR"}
          </div>
        </div>
      ),
    },
    {
      id: "an-ke-toan",
      marketplaceId: "agent-finance-controller",
      name: isVi ? "An Kế Toán" : "Finance An",
      badge: isVi ? "Kế toán TT99" : "Finance & ERP",
      badgeStyle: "bg-[#dcfce7] text-[#15803d] dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
      cardGradient: "from-[#f0fdf4] to-[#FFFDF9] dark:from-[#0f241c] dark:to-[#0c0e15]",
      blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4,jump.1.4", seed: 202 },
      desc: isVi
        ? "Khớp 48 hóa đơn GTGT với đơn hàng PO trên ERPCore, lập chứng từ TT99 với độ lệch 0 đồng."
        : "Reconcile 48 vendor e-invoices against POs in ERPCore and stage TT99 tax vouchers.",
      hireText: isVi ? "Tuyển An" : "Hire An",
      task: "Đối soát 48 hóa đơn điện tử nhà cung cấp với đơn hàng PO trên ERPCore chuẩn TT99",
      renderMiniUi: () => (
        <div className="w-[156px] sm:w-[164px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-emerald-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-emerald-600 dark:text-emerald-400 font-bold border-b border-neutral-100 dark:border-white/5 pb-1">
            <span>ERPCore // 02-VT</span>
            <span>TT99</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>PO-2026-891</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Khớp 100%</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>Chênh lệch</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">0 VNĐ</span>
          </div>
          <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] truncate">
            {tick === 1 ? "⚡ Đang kiểm chữ ký..." : "✓ 48/48 HĐ hợp lệ"}
          </div>
        </div>
      ),
    },
    {
      id: "linh-sales",
      marketplaceId: "agent-b2b-sales-exec",
      name: isVi ? "Linh Kinh Doanh" : "Sales Linh",
      badge: isVi ? "Kinh doanh B2B" : "Sales & Leads",
      badgeStyle: "bg-[#ffedd5] text-[#c2410c] dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
      cardGradient: "from-[#fff7ed] to-[#FFFDF9] dark:from-[#291811] dark:to-[#0c0e15]",
      blob: { shape: "cat", expression: "happy", color: "#f8a87c", animation: "wink.1.6,nod.1.4", seed: 303 },
      desc: isVi
        ? "Tìm 100 khách hàng doanh nghiệp tiềm năng, soạn báo giá và kịch bản tiếp cận theo đúng giọng của bạn."
        : "Get 100 qualified B2B leads with personalized outreach written in your voice, ready to send.",
      hireText: isVi ? "Tuyển Linh" : "Hire Linh",
      task: "Tìm 25 doanh nghiệp sản xuất khu công nghiệp cần chuyển đổi số và soạn thư chào giá",
      renderMiniUi: () => (
        <div className="w-[156px] sm:w-[164px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-orange-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-orange-600 dark:text-orange-400 font-bold border-b border-neutral-100 dark:border-white/5 pb-1">
            <span>CRM // Lead B2B</span>
            <span>+100</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>VinFast Supply</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">98%</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>Thaco Logistics</span>
            <span className="text-orange-600 dark:text-orange-400 font-bold">95%</span>
          </div>
          <div className="px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-700 dark:text-orange-300 text-[9px] truncate">
            {tick === 2 ? "⚡ Soạn báo giá PDF..." : "✓ 15 email sẵn sàng"}
          </div>
        </div>
      ),
    },
    {
      id: "vy-phap-che",
      marketplaceId: "agent-legal-compliance",
      name: isVi ? "Vy Pháp Chế" : "Legal Vy",
      badge: isVi ? "Pháp chế & HĐ" : "Legal & NDA",
      badgeStyle: "bg-[#f3e8ff] text-[#7e22ce] dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
      cardGradient: "from-[#faf5ff] to-[#FFFDF9] dark:from-[#22152e] dark:to-[#0c0e15]",
      blob: { shape: "bunny", expression: "attentive", color: "#a78bfa", animation: "nod.1.4,wink.1.6", seed: 404 },
      desc: isVi
        ? "Rà soát hợp đồng thương mại, khoanh vùng điều khoản phạt rủi ro và đối chiếu chuẩn Nghị định 13."
        : "Redline commercial contracts, flag risky indemnity clauses, and verify NĐ13 data compliance.",
      hireText: isVi ? "Tuyển Vy" : "Hire Vy",
      task: "Rà soát hợp đồng nguyên tắc dịch vụ MSA, đánh dấu các điều khoản phạt và bảo mật NĐ13",
      renderMiniUi: () => (
        <div className="w-[156px] sm:w-[164px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-purple-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-purple-600 dark:text-purple-400 font-bold border-b border-neutral-100 dark:border-white/5 pb-1">
            <span>MSA_2026.docx</span>
            <span>NĐ13</span>
          </div>
          <div className="text-rose-500 line-through text-[9px] truncate">
            Phạt không giới hạn
          </div>
          <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-[9px] truncate">
            + Trần 100% giá trị HĐ
          </div>
          <div className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[9px] truncate">
            ✓ Đã bảo vệ SHTT
          </div>
        </div>
      ),
    },
    {
      id: "nam-nhan-su",
      marketplaceId: "agent-hr-talent-partner",
      name: isVi ? "Nam Tuyển Dụng" : "Talent Nam",
      badge: isVi ? "Nhân sự & C&B" : "Talent & HR",
      badgeStyle: "bg-[#ffe4e6] text-[#be123c] dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
      cardGradient: "from-[#fff1f2] to-[#FFFDF9] dark:from-[#2b141b] dark:to-[#0c0e15]",
      blob: { shape: "clover", expression: "excited", color: "#fb7185", animation: "jump.1.4,nod.1.4", seed: 505 },
      desc: isVi
        ? "Chấm điểm 10 ứng viên sáng giá nhất theo JD của phòng ban và tự động xếp lịch phỏng vấn."
        : "Get 10 strong candidates, each researched and scored against what your team needs.",
      hireText: isVi ? "Tuyển Nam" : "Hire Nam",
      task: "Sàng lọc 25 CV ứng viên vị trí Trưởng phòng Vận hành và xếp lịch phỏng vấn tuần này",
      renderMiniUi: () => (
        <div className="w-[156px] sm:w-[164px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-rose-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-rose-600 dark:text-rose-400 font-bold border-b border-neutral-100 dark:border-white/5 pb-1">
            <span>Top 10 Ứng viên</span>
            <span>Match</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>Trần M. Hoàng</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">96%</span>
          </div>
          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
            <span>Lê Thu Hà</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">94%</span>
          </div>
          <div className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[9px] truncate">
            ✓ Đã gửi lịch PV
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="pt-16 overflow-x-hidden bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[#f8a87c]/30 transition-colors">
      <SeoHead
        title={
          isVi
            ? "Skyer — Đồng nghiệp AI làm việc ngay cạnh bạn"
            : "Skyer — AI teammates that work alongside you"
        }
        description={
          isVi
            ? "Skyer là nền tảng nhân viên AI sở hữu máy tính độc lập, tự thao tác bảng tính, trình duyệt và phần mềm doanh nghiệp 24/7."
            : "Skyer is an AI workforce platform with built-in AI companions that take real operational work off your hands."
        }
        canonicalPath="/"
      />

      {/* 1. EXACT STRAWBERRY HERO ARCHITECTURE:
          H1 + 2-line Subtitle + 2 Pill CTAs + 4 Companion Avatars Peeking from Top Edge of Live 16:10 Product Frame */}
      <section className="relative pt-14 sm:pt-20 overflow-hidden border-b border-[var(--border-card)] bg-[var(--bg-page)]">
        {/* Strawberry Mosaic Geometric Side Background Pattern (Faint on Left & Right Outer Wings, Transparent in Center) */}
        <div
          className="absolute inset-x-0 top-0 h-[540px] pointer-events-none select-none overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, transparent 100%)",
          }}
        >
          <div
            className="w-full h-full"
            style={{
              maskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 18%, rgba(0,0,0,0.03) 34%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.03) 66%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.95) 100%)",
              WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 18%, rgba(0,0,0,0.03) 34%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.03) 66%, rgba(0,0,0,0.5) 82%, rgba(0,0,0,0.95) 100%)",
            }}
          >
            <svg className="w-full h-full opacity-[0.38] dark:opacity-[0.06] text-[#e5ddd2] dark:text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="strawberry-mosaic" width="64" height="64" patternUnits="userSpaceOnUse">
                {/* Row 1 */}
                <circle cx="8" cy="8" r="5.5" fill="currentColor" />
                <rect x="20" y="3" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.7" />
                <polygon points="40,2 46,8 40,14 34,8" fill="currentColor" opacity="0.85" />
                <circle cx="56" cy="8" r="3" fill="currentColor" opacity="0.5" />
                {/* Row 2 */}
                <polygon points="8,18 13,24 8,30 3,24" fill="currentColor" opacity="0.6" />
                <circle cx="24" cy="24" r="6" fill="currentColor" opacity="0.9" />
                <rect x="36" y="19" width="10" height="10" rx="2" fill="currentColor" opacity="0.55" />
                <polygon points="56,18 62,24 56,30 50,24" fill="currentColor" opacity="0.8" />
                {/* Row 3 */}
                <rect x="3" y="35" width="10" height="10" rx="2" fill="currentColor" opacity="0.85" />
                <polygon points="24,34 30,40 24,46 18,40" fill="currentColor" opacity="0.65" />
                <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.9" />
                <rect x="52" y="36" width="8" height="8" rx="1.5" fill="currentColor" opacity="0.6" />
                {/* Row 4 */}
                <circle cx="8" cy="56" r="4" fill="currentColor" opacity="0.5" />
                <rect x="19" y="51" width="10" height="10" rx="2" fill="currentColor" opacity="0.8" />
                <polygon points="40,50 46,56 40,62 34,56" fill="currentColor" opacity="0.7" />
                <circle cx="56" cy="56" r="5.5" fill="currentColor" opacity="0.85" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#strawberry-mosaic)" />
            </svg>
          </div>
        </div>

        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Hero Holder: Centered Title, 2-line Description, 2 Pill CTAs */}
          <div className="text-center flex flex-col items-center">
            <h1
              data-testid="hero-heading"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
              className="max-w-[478px] text-[36px] sm:text-[47.8px] leading-[1.1] tracking-[-1.91px] text-[#252522] dark:text-[#f3f4f6] text-balance"
            >
              {isVi ? (
                <>
                  Đồng nghiệp AI
                  <br />
                  làm việc cùng bạn
                </>
              ) : (
                <>
                  AI teammates that
                  <br />
                  work alongside you
                </>
              )}
            </h1>

            <p
              data-testid="hero-description"
              style={{ fontFamily: "var(--font-sans)", fontWeight: 400 }}
              className="mt-4 text-[15px] sm:text-[17px] md:text-[19.5px] lg:text-[21px] leading-[1.42] tracking-[-0.216px] text-[#252522]/70 dark:text-neutral-400 max-w-[320px] sm:max-w-[540px] md:max-w-[640px] lg:max-w-[680px] font-normal px-1 text-balance"
            >
              {isVi ? (
                <>
                  <span className="md:whitespace-nowrap">
                    Skyer là không gian làm việc tích hợp sẵn <span className="whitespace-nowrap">nhân viên AI</span>
                  </span>{" "}
                  <br className="hidden md:inline" />
                  <span className="md:whitespace-nowrap">
                    giúp bạn gánh vác công việc thực tế <span className="whitespace-nowrap">mỗi ngày</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="md:whitespace-nowrap">
                    Skyer is a workspace with built-in <span className="whitespace-nowrap">AI companions</span>
                  </span>{" "}
                  <br className="hidden md:inline" />
                  <span className="md:whitespace-nowrap">
                    that take real work off <span className="whitespace-nowrap">your hands</span>
                  </span>
                </>
              )}
            </p>

            {/* 2 Pill CTAs (Primary Charcoal/White + Secondary Pill Surface) */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/app"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[15px] font-medium hover:opacity-90 transition-all shadow-sm"
              >
                {isVi ? "Bắt đầu làm việc" : "Launch Workspace"}
              </Link>
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white dark:bg-[#161a24] text-[#252522] dark:text-[#f3f4f6] border border-[#ECE5DC] dark:border-white/10 text-[15px] font-medium shadow-2xs hover:bg-[#F8F3ED] dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                {isVi ? "Liên hệ Doanh nghiệp" : "Contact Sales"}
              </button>
            </div>
          </div>

          {/* HERO PRODUCT STAGE: 4 Companion Avatars Peeking from Top Edge + 16:10 Live Workspace Frame */}
          <div className="relative mt-24 sm:mt-28">
            {/* 4 Peeking Companions Perched on Top Edge of Frame (Exact Strawberry model-pos-1..4 pattern) */}
            <div className="pointer-events-none select-none">
              {/* Left Outer Companion: Vy Pháp Chế (Purple) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:flex flex-col items-center absolute -top-[74px] left-[8%] lg:left-[11%] z-10"
              >
                <span className="mb-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-[10px] font-mono font-semibold shadow-2xs">
                  Vy Pháp Chế
                </span>
                <AgentAvatar
                  agent={{ id: "peek-vy", name: "Vy Pháp Chế" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "bunny", expression: "attentive", color: "#a78bfa", animation: "wink.1.6,nod.1.4", seed: 404 },
                  }}
                />
              </motion.div>

              {/* Left Inner Companion: Minh Bốc (Sky Blue) */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="flex flex-col items-center absolute -top-[78px] left-[16%] sm:left-[24%] lg:left-[26%] z-10"
              >
                <span className="mb-1 px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-[10px] font-mono font-semibold shadow-2xs">
                  Minh Bốc
                </span>
                <AgentAvatar
                  agent={{ id: "peek-minh", name: "Minh Bốc" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4,wink.1.6", seed: 101 },
                  }}
                />
              </motion.div>

              {/* Right Inner Companion: An Kế Toán (Emerald Mint) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="flex flex-col items-center absolute -top-[78px] right-[16%] sm:right-[24%] lg:right-[26%] z-10"
              >
                <span className="mb-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-mono font-semibold shadow-2xs">
                  An Kế Toán
                </span>
                <AgentAvatar
                  agent={{ id: "peek-an", name: "An Kế Toán" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4,jump.1.4", seed: 202 },
                  }}
                />
              </motion.div>

              {/* Right Outer Companion: Linh Kinh Doanh (Peach Orange) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                className="hidden md:flex flex-col items-center absolute -top-[74px] right-[8%] lg:right-[11%] z-10"
              >
                <span className="mb-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 text-[10px] font-mono font-semibold shadow-2xs">
                  Linh B2B
                </span>
                <AgentAvatar
                  agent={{ id: "peek-linh", name: "Linh Kinh Doanh" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "cat", expression: "happy", color: "#f8a87c", animation: "wink.1.6,nod.1.4", seed: 303 },
                  }}
                />
              </motion.div>
            </div>

            {/* 16:10 Hero Product Frame (Bleeds slightly into bottom border like Strawberry) */}
            <div className="relative z-20 rounded-t-[16px] border border-b-0 border-[#ECE5DC] dark:border-white/15 bg-white dark:bg-[#11151f] shadow-[0_16px_34px_rgba(15,23,42,0.05),0_60px_120px_rgba(15,23,42,0.10)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.65)] overflow-hidden">
              {/* Top Browser Window Bar */}
              <div className="h-10 bg-[#F8F3ED] dark:bg-[#0c0f17] border-b border-[#ECE5DC] dark:border-white/10 px-3 sm:px-4 flex items-center justify-between gap-2 text-xs font-mono overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ff5f56] shrink-0" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#ffbd2e] shrink-0" />
                  <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#27c93f] shrink-0" />
                  <div className="ml-1.5 sm:ml-2 flex items-center gap-1.5 min-w-0 overflow-hidden">
                    <span className="px-2 sm:px-2.5 py-1 rounded-md bg-white dark:bg-[#181d2a] text-[#252522] dark:text-white font-semibold text-[10px] sm:text-[11px] shadow-2xs border border-[#ECE5DC]/70 dark:border-white/10 flex items-center gap-1.5 truncate">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      <span className="truncate">ERPCore // Đối soát Hóa đơn TT99</span>
                    </span>
                    <span className="hidden md:inline-block px-2.5 py-1 rounded-md text-neutral-500 dark:text-neutral-400 text-[11px] whitespace-nowrap truncate">
                      BaseCore // MSA_2026.docx
                    </span>
                    <span className="hidden lg:inline-block px-2.5 py-1 rounded-md text-neutral-500 dark:text-neutral-400 text-[11px] whitespace-nowrap shrink-0">
                      Knowledge Base KB
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[9.5px] sm:text-[10px] font-semibold whitespace-nowrap">
                    <span className="sm:hidden">On-Premise</span>
                    <span className="hidden sm:inline">Máy tính độc lập • On-Premise</span>
                  </span>
                </div>
              </div>

              {/* Workspace Body: Left AI Companion Chat + Right Live Spreadsheet & ERP Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px] sm:min-h-[390px]">
                {/* Left 4 Cols: Active Companion Sidebar */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#ECE5DC] dark:border-white/10 bg-[#FFFDF9] dark:bg-[#0e121b] p-4 sm:p-5 flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AgentAvatar
                          agent={{ id: "sidebar-an", name: "An Kế Toán" }}
                          size="sm"
                          alwaysAnimate
                          overrideConfig={{
                            type: "blob",
                            blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4", seed: 202 },
                          }}
                        />
                        <div>
                          <div className="text-xs font-bold text-[#252522] dark:text-white">An Kế Toán</div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">● Đang thao tác trên tab</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F8F3ED] dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-[#ECE5DC] dark:border-white/10">
                        TT99
                      </span>
                    </div>

                    {/* User instruction bubble */}
                    <div className="p-3 rounded-2xl rounded-tl-xs bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 text-xs text-[#252522] dark:text-neutral-200">
                      {isVi
                        ? "Đối chiếu 48 hóa đơn GTGT tháng 10 với đơn hàng PO trên ERPCore và lập bảng kê Mẫu 02-VT."
                        : "Reconcile 48 October VAT invoices against POs in ERPCore and stage TT99 vouchers."}
                    </div>

                    {/* Companion live step progress */}
                    <div className="p-3 rounded-2xl bg-white dark:bg-[#151a26] border border-[#ECE5DC] dark:border-white/10 space-y-2 text-[11px]">
                      <div className="font-semibold text-[#252522] dark:text-white">
                        {isVi ? "Tiến độ tự hành:" : "Autonomous steps:"}
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
                        <Check size={12} /> <span>1. Đọc 48 file XML/PDF Hóa đơn điện tử</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-[10px]">
                        <Check size={12} /> <span>2. Khớp 3 bên PO - Phiếu kho - Hóa đơn</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#c2540a] dark:text-[#f8a87c] font-mono text-[10px] font-semibold">
                        <span className="h-2 w-2 rounded-full bg-[#f8a87c] animate-ping" />
                        <span>3. Đang ghi Sổ Cái ERPCore (0 VNĐ lệch)</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Input Bar */}
                  <div className="mt-4 pt-3 border-t border-[#ECE5DC] dark:border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>{isVi ? "Giao thêm việc cho An..." : "Queue a follow-up..."}</span>
                    <Link
                      to="/app"
                      className="px-2.5 py-1 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-black text-[10px] font-sans font-semibold"
                    >
                      {isVi ? "Mở App →" : "Open →"}
                    </Link>
                  </div>
                </div>

                {/* Right 8 Cols: Live ERP Spreadsheet Viewport with Moving AI Cursor */}
                <div className="lg:col-span-8 p-4 sm:p-6 bg-white dark:bg-[#11151f] relative flex flex-col justify-between font-mono text-xs">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#ECE5DC] dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                          SỔ CÁI TT99
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                          Bang_Ke_Chung_Tu_T10_2026.xlsx
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ 48/48 Khớp • Chênh lệch: 0₫
                      </span>
                    </div>

                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-1 text-[10px] text-neutral-400 dark:text-neutral-500 pb-2 border-b border-neutral-100 dark:border-white/5">
                      <span className="col-span-5 sm:col-span-4">Nhà cung cấp</span>
                      <span className="hidden sm:inline col-span-3">Số PO / HĐ</span>
                      <span className="col-span-4 sm:col-span-3 text-right sm:text-left">Giá trị (VNĐ)</span>
                      <span className="col-span-3 sm:col-span-2 text-right">Đối soát</span>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-neutral-100 dark:divide-white/5 text-[10.5px] sm:text-[11px]">
                      {[
                        { vendor: "VinFast Energy", po: "PO-891 / HĐ-0041", val: "482.500.000₫", status: "Khớp 100%" },
                        { vendor: "Masan Consumer", po: "PO-892 / HĐ-0042", val: "195.000.000₫", status: "Khớp 100%" },
                        { vendor: "FPT Smart Cloud", po: "PO-894 / HĐ-0045", val: "310.800.000₫", status: "Khớp 100%" },
                        { vendor: "Viettel Logistics", po: "PO-899 / HĐ-0049", val: "128.400.000₫", status: "Đang ghi..." },
                      ].map((row, idx) => {
                        const active = idx === heroCursorStep;
                        return (
                          <div
                            key={row.po}
                            className={
                              "grid grid-cols-12 gap-1 py-2.5 items-center px-2 rounded-lg transition-colors " +
                              (active ? "bg-emerald-500/10 border border-emerald-500/30" : "")
                            }
                          >
                            <span className="col-span-5 sm:col-span-4 font-semibold text-[#252522] dark:text-white truncate">
                              {row.vendor}
                            </span>
                            <span className="hidden sm:inline col-span-3 text-neutral-500 dark:text-neutral-400 truncate text-[10px]">
                              {row.po}
                            </span>
                            <span className="col-span-4 sm:col-span-3 text-right sm:text-left text-[#252522] dark:text-neutral-200 font-medium whitespace-nowrap">
                              {row.val}
                            </span>
                            <span className="col-span-3 sm:col-span-2 text-right text-emerald-600 dark:text-emerald-400 font-bold text-[10px] whitespace-nowrap">
                              ✓ {row.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Named AI Cursor Floating Inside Hero Frame */}
                  <motion.div
                    animate={{ x: heroCursorPos.x - 100, y: heroCursorPos.y - 40 }}
                    transition={{ type: "spring", stiffness: 110, damping: 18 }}
                    className="absolute top-0 left-0 pointer-events-none z-30 flex items-center gap-1"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981" className="drop-shadow-md">
                      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                    </svg>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-sans font-bold shadow-md">
                      An Kế Toán
                    </span>
                  </motion.div>

                  {/* Bottom Control Bar inside Hero Viewport */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-[#18181b] border border-neutral-200 dark:border-white/15 text-neutral-800 dark:text-white text-[9px] shadow-xs whitespace-nowrap shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span className="font-medium whitespace-nowrap text-neutral-700 dark:text-neutral-200">{isVi ? "An Kế Toán điều khiển" : "Controlled by An"}</span>
                      <button type="button" className="px-1.5 py-0.5 rounded-full bg-white dark:bg-white/20 border border-neutral-200 dark:border-transparent text-neutral-800 dark:text-white text-[8.5px] font-semibold shadow-xs whitespace-nowrap hover:bg-neutral-50 dark:hover:bg-white/30 transition-colors cursor-pointer">{isVi ? "Tiếp quản" : "Take over"}</button>
                    </div>
                    <span className="text-[9.5px] text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {isVi ? "Biên nhận thực thi lưu tự động vào Knowledge Base KB" : "Execution receipt synced to KB"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1B. TRUSTED ENTERPRISE LOGO STRIP + "HIRE YOUR NEXT AI COLLEAGUE" 2-COLUMN SECTION */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-card)] bg-[var(--bg-page)]">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          {/* Monochrome Logo Strip */}
          <div className="text-center mb-16">
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-6">
              {isVi ? "Đồng hành cùng các doanh nghiệp tăng trưởng nhanh" : "Trusted by fast-growing teams"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-bold tracking-tight text-neutral-400 dark:text-neutral-500 select-none">
              <span>VINFAST</span>
              <span>MASAN GROUP</span>
              <span>FPT SOFTWARE</span>
              <span>VIETTEL POST</span>
              <span>AGENTCORE</span>
              <span>ERPCORE</span>
            </div>
          </div>

          {/* 2-Column Split: "Hire your next AI colleague" + Trio of Animated Companions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4">
            <div className="lg:col-span-6 space-y-5">
              <h2
                style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}
                className="text-3xl sm:text-[47.8px] tracking-[-1.91px] leading-[1.14] text-[#252522] dark:text-[#f3f4f6]"
              >
                {(() => {
                  const pillVariants = [
                    {
                      en: "first",
                      vi: "đầu tiên",
                      cls: "bg-[#F5E3D3] text-[#834C43] dark:bg-[#f8a87c]/20 dark:text-[#f8a87c]",
                    },
                    {
                      en: "next",
                      vi: "tiếp theo",
                      cls: "bg-[#E2EFE0] text-[#4E704B] dark:bg-emerald-500/20 dark:text-emerald-300",
                    },
                    {
                      en: "tenth",
                      vi: "thứ mười",
                      cls: "bg-[#DCEBF2] text-[#4B667B] dark:bg-sky-500/20 dark:text-sky-300",
                    },
                  ];
                  const activePill = pillVariants[tick % pillVariants.length];

                  return isVi ? (
                    <>
                      <span className="block sm:inline">Tuyển đồng nghiệp AI</span>{" "}
                      <span className="inline-flex items-center justify-center align-baseline">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={activePill.vi}
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.28, ease: [0.45, 0, 0.55, 1] }}
                            className={`inline-block px-4 py-0.5 rounded-full font-medium transition-colors duration-300 ${activePill.cls}`}
                          >
                            {activePill.vi}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="block mt-1">cho đội ngũ của bạn</span>
                    </>
                  ) : (
                    <>
                      <span>Hire your </span>
                      <span className="inline-flex items-center justify-center align-baseline">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={activePill.en}
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.28, ease: [0.45, 0, 0.55, 1] }}
                            className={`inline-block px-4 py-0.5 rounded-full font-medium transition-colors duration-300 ${activePill.cls}`}
                          >
                            {activePill.en}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <br />
                      <span>AI colleague</span>
                    </>
                  );
                })()}
              </h2>

              <div className="space-y-3 text-base sm:text-[19px] leading-[1.45] text-[#252522]/75 dark:text-neutral-300 font-normal max-w-md">
                <p>
                  {isVi ? (
                    <>
                      Trong Skyer, bạn có thể tuyển dụng hoặc tự tạo{" "}
                      <strong className="font-semibold text-[#252522] dark:text-white">Nhân viên AI chuyên trách.</strong>
                    </>
                  ) : (
                    <>
                      In Skyer you can hire or create{" "}
                      <strong className="font-semibold text-[#252522] dark:text-white">AI Companions.</strong>
                    </>
                  )}
                </p>
                <p>
                  {isVi
                    ? "Nhân viên học quy trình của bạn, ghi nhớ ngữ cảnh chung và bắt đầu làm việc 24/7."
                    : "Companions learn your preferences and workflows, and can start working for you 24/7."}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-black text-[14px] font-medium hover:opacity-90 transition-all"
                >
                  {isVi ? "Tuyển nhân viên ngay" : "Hire now"}
                </Link>
                <a
                  href="#bots"
                  className="inline-flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-[#161a24] border border-[#ECE5DC] dark:border-white/10 text-[14px] font-medium text-[#252522] dark:text-white shadow-2xs hover:bg-[#F8F3ED] dark:hover:bg-white/10 transition-all"
                >
                  <span className="h-7 w-7 rounded-full bg-[#f8a87c]/25 flex items-center justify-center text-[#c2540a] dark:text-[#f8a87c]">
                    <Play size={12} fill="currentColor" />
                  </span>
                  <span>{isVi ? "Xem hồ sơ năng lực" : "See how it works"}</span>
                </a>
              </div>
            </div>

            {/* Right: Trio of Animated Character Avatars */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-lg rounded-3xl bg-[#F8F3ED] dark:bg-[#11151f] border border-[#ECE5DC] dark:border-white/10 p-6 sm:p-8 shadow-xs">
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-3xl bg-white dark:bg-[#181d2a] border border-[#ECE5DC] dark:border-white/10 shadow-xs">
                      <AgentAvatar
                        agent={{ id: "hero-minh", name: "Minh Bốc" }}
                        size="xl"
                        alwaysAnimate
                        overrideConfig={{
                          type: "blob",
                          blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4,wink.1.6", seed: 101 },
                        }}
                      />
                    </div>
                    <span className="mt-2.5 text-xs font-semibold text-[#252522] dark:text-white">Minh Bốc</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{isVi ? "Điều hành" : "Executive"}</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-3xl bg-white dark:bg-[#181d2a] border border-[#ECE5DC] dark:border-white/10 shadow-xs">
                      <AgentAvatar
                        agent={{ id: "hero-an", name: "An Kế Toán" }}
                        size="xl"
                        alwaysAnimate
                        overrideConfig={{
                          type: "blob",
                          blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4,jump.1.4", seed: 202 },
                        }}
                      />
                    </div>
                    <span className="mt-2.5 text-xs font-semibold text-[#252522] dark:text-white">An Kế Toán</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{isVi ? "Kế toán TT99" : "Finance"}</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-3xl bg-white dark:bg-[#181d2a] border border-[#ECE5DC] dark:border-white/10 shadow-xs">
                      <AgentAvatar
                        agent={{ id: "hero-vy", name: "Vy Pháp Chế" }}
                        size="xl"
                        alwaysAnimate
                        overrideConfig={{
                          type: "blob",
                          blob: { shape: "bunny", expression: "happy", color: "#a78bfa", animation: "wink.1.6,nod.1.4", seed: 404 },
                        }}
                      />
                    </div>
                    <span className="mt-2.5 text-xs font-semibold text-[#252522] dark:text-white">Vy Pháp Chế</span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{isVi ? "Pháp chế" : "Legal"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL COMPANIONS 6-CARD GRID */}
      <section id="bots" className="py-20 sm:py-28 border-b border-[var(--border-card)] bg-[var(--bg-card-subtle)] transition-colors">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {companions.map((comp) => (
              <div
                key={comp.id}
                className="rounded-3xl border border-[#ECE5DC] dark:border-white/10 bg-white dark:bg-[#11151f] p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
              >
                <div>
                  <div
                    className={
                      "h-52 rounded-2xl bg-gradient-to-br " +
                      comp.cardGradient +
                      " border border-[#ECE5DC]/80 dark:border-white/10 px-3.5 pt-3.5 pb-11 relative overflow-hidden flex items-center justify-between gap-2 mb-5"
                    }
                  >
                    <div
                      className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(#252522 1px, transparent 1px)",
                        backgroundSize: "12px 12px",
                      }}
                    />

                    <div className="relative z-10 pl-1">
                      <AgentAvatar
                        agent={{ id: comp.id, name: comp.name }}
                        size="lg"
                        alwaysAnimate
                        overrideConfig={{
                          type: "blob",
                          blob: comp.blob as any,
                        }}
                      />
                    </div>

                    <div className="relative z-10">{comp.renderMiniUi()}</div>

                    <div
                      className={
                        "absolute bottom-2.5 right-3 z-20 px-3 py-1 rounded-full border text-[11px] font-semibold shadow-2xs " +
                        comp.badgeStyle
                      }
                    >
                      {comp.name} • {comp.badge}
                    </div>
                  </div>

                  <p className="text-[15.3px] leading-[1.45] text-[#252522]/85 dark:text-neutral-300 font-normal px-1">
                    {comp.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ECE5DC]/60 dark:border-white/10 flex items-center justify-between px-1">
                  <Link
                    to={appTaskUrl(comp.task)}
                    className="px-4 py-2 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium hover:opacity-90 transition-opacity"
                  >
                    {comp.hireText}
                  </Link>
                  <Link
                    to={`/marketplace/${(comp as any).marketplaceId}`}
                    className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>{isVi ? "Tìm hiểu thêm" : "Learn more"}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}

            {/* 6th Card: "+ Create your own" */}
            <div className="rounded-3xl border border-[#ECE5DC] dark:border-white/10 bg-white dark:bg-[#11151f] p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group">
              <div>
                <div className="h-52 rounded-2xl bg-gradient-to-br from-neutral-100 to-[#FFFDF9] dark:from-[#161b26] dark:to-[#0c0e15] border border-dashed border-neutral-300 dark:border-white/15 px-3.5 pt-3.5 pb-11 relative overflow-hidden flex items-center justify-between gap-2 mb-5">
                  <div className="relative z-10 pl-1">
                    <AgentAvatar
                      agent={{ id: "custom-builder", name: "Custom AI" }}
                      size="lg"
                      alwaysAnimate
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "star", expression: "wink", color: "#fbbf24", animation: "spin.1.6,wink.1.4", seed: 777 },
                      }}
                    />
                  </div>
                  <div className="w-[156px] sm:w-[164px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] border border-neutral-200 dark:border-white/10 p-2.5 text-[10px] font-mono text-[#252522] dark:text-neutral-300 shadow-xs space-y-1">
                    <div className="font-bold text-[#252522] dark:text-white">+ Kỹ năng SOP riêng</div>
                    <div>✓ Kết nối ERPCore</div>
                    <div>✓ Chạy tự động 24/7</div>
                  </div>

                  <div className="absolute bottom-2.5 right-3 px-3 py-1 rounded-full bg-neutral-200/80 dark:bg-white/10 text-[#252522] dark:text-neutral-200 text-[11px] font-semibold flex items-center gap-1">
                    <Plus size={12} />
                    <span>{isVi ? "Tự tạo nhân viên mới" : "Create your own"}</span>
                  </div>
                </div>

                <p className="text-[15.3px] leading-[1.45] text-[#252522]/85 dark:text-neutral-300 font-normal px-1">
                  {isVi
                    ? "Thiết kế đồng nghiệp AI với diện mạo, công cụ MCP và quy trình duyệt chi riêng cho doanh nghiệp bạn."
                    : "Create a teammate with its own look, built around your process and schedule."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#ECE5DC]/60 dark:border-white/10 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {isVi ? "Tạo từ đầu" : "Start from scratch"}
                </button>
                <Link
                  to="/marketplace"
                  className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white flex items-center gap-1"
                >
                  <span>{isVi ? "Thư viện mẫu" : "Templates"}</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#11151f] border border-[#ECE5DC] dark:border-white/10 text-[14px] font-medium text-[#252522] dark:text-white shadow-2xs hover:bg-[#F8F3ED] dark:hover:bg-white/10 transition-all"
            >
              <span>{isVi ? "Xem toàn bộ danh mục nhân sự AI" : "See all official companions"}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SIDE-BY-SIDE LIVE AUTONOMOUS COMPARISON */}
      <StrawberryComparisonSection />

      {/* 4. "A NEW FOUNDATION FOR YOUR WORK" */}
      <section id="on-premise" className="py-20 sm:py-28 border-b border-[var(--border-card)] bg-[var(--bg-page)] transition-colors">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <h2 className="text-3xl sm:text-[46px] font-normal leading-[1.1] tracking-[-1.9px] text-[#252522] dark:text-[#f3f4f6]">
              {isVi ? "Nền tảng mới cho vận hành tự động" : "A new foundation for your work"}
            </h2>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium cursor-pointer"
            >
              {isVi ? "Triển khai On-Premise" : "Deploy On-Premise"}
            </button>
          </div>

          <div className="rounded-3xl border border-[#ECE5DC] dark:border-white/10 bg-[#F8F3ED] dark:bg-[#11151f] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {[
                { id: "vm", label: isVi ? "1. Máy tính riêng" : "1. Dedicated Computer" },
                { id: "onprem", label: isVi ? "2. Thao tác phần mềm thật" : "2. Live App Execution" },
                { id: "gate", label: isVi ? "3. Kiểm soát & Phê duyệt" : "3. Human Control Gate" },
              ].map((t) => {
                const active = activeFoundationTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveFoundationTab(t.id as any)}
                    className={
                      "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer " +
                      (active
                        ? "bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] shadow-xs"
                        : "bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border border-[#ECE5DC] dark:border-white/10")
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {activeFoundationTab === "vm" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-2xl font-semibold text-[#252522] dark:text-white tracking-tight">
                    {isVi ? "Mỗi nhân viên sở hữu một máy tính riêng" : "Every teammate owns a dedicated computer"}
                  </h3>
                  <p className="text-[15.3px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {isVi
                      ? "Tự mở trình duyệt, xử lý bảng tính, chạy công cụ và lưu kết quả trực tiếp trên máy tính riêng."
                      : "Launches browsers, processes spreadsheets, runs scripts, and saves deliverables on its own computer."}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px] text-[#252522] dark:text-neutral-200">
                    <span className="px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10">ERPCore</span>
                    <span className="px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10">BaseCore</span>
                    <span className="px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10">Knowledge Base KB</span>
                    <span className="px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10">AgentCore</span>
                  </div>
                </div>

                <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0c0f17] border border-[#ECE5DC] dark:border-white/10 p-5 text-xs font-mono text-[#252522] dark:text-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-[#ECE5DC] dark:border-white/10 pb-2.5 text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">● vm://skyer-minh-boc/app/working</span>
                    <span className="px-2 py-0.5 rounded bg-[#F8F3ED] dark:bg-white/10 text-[10px]">Máy tính độc lập</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-[10px] text-neutral-500 dark:text-slate-400">TRÌNH DUYỆT RIÊNG</div>
                      <div className="text-[#252522] dark:text-white font-semibold">erp.company.vn/invoices</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400">✓ Đang thao tác trực tiếp</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-[10px] text-neutral-500 dark:text-slate-400">BỘ NHỚ DÀI HẠN</div>
                      <div className="text-[#252522] dark:text-white font-semibold">MEMORY.md & Knowledge Base KB</div>
                      <div className="text-[10px] text-[#c2540a] dark:text-[#f8a87c]">✓ Đã đồng bộ quy trình</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#252522] dark:bg-black/60 text-[11px] text-emerald-300">
                    $ agentcore reconcile --erpcore --tt99 → 48/48 Hóa đơn khớp (0.00₫ lệch)
                  </div>
                </div>
              </div>
            )}

            {activeFoundationTab === "onprem" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-2xl font-semibold text-[#252522] dark:text-white tracking-tight">
                    {isVi ? "Tự vận hành 24/7 ngay trên máy tính nội bộ" : "Operates 24/7 on its own private workstation"}
                  </h3>
                  <p className="text-[15.3px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {isVi
                      ? "Mỗi nhân viên AI chạy trên máy tính độc lập trong mạng nội bộ On-Premise. Dữ liệu không bao giờ rời khỏi máy chủ của bạn."
                      : "Every AI teammate runs on an isolated computer inside your On-Premise network. Data never leaves your server."}
                  </p>
                </div>

                <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0c0f17] border border-[#ECE5DC] dark:border-white/10 p-6 shadow-sm">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-bold mb-4 flex items-center justify-between">
                    <span>MÁY TÍNH RIÊNG NỘI BỘ (ON-PREMISE WORKSTATION)</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">100% Isolated</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                    <div className="p-4 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-sm font-bold text-[#252522] dark:text-white">Trình duyệt</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Phiên đăng nhập riêng</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Tự thao tác web</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-sm font-bold text-[#252522] dark:text-white">AgentCore</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Không gian /app/working</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Xử lý file & Excel</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-sm font-bold text-[#252522] dark:text-white">Local Model</div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Self-host On-Premise</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Bảo mật tuyệt đối</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFoundationTab === "gate" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-2xl font-semibold text-[#252522] dark:text-white tracking-tight">
                    {isVi ? "Bạn luôn nắm quyền kiểm soát máy tính của AI" : "You stay in full control of the AI computer"}
                  </h3>
                  <p className="text-[15.3px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {isVi
                      ? "Nhân viên AI tự hoàn tất việc chuẩn bị hồ sơ trên máy tính riêng và tạm dừng chờ bạn bấm duyệt trước khi chốt sổ."
                      : "Your AI teammate prepares files on its dedicated computer and pauses for your 1-click sign-off before committing."}
                  </p>
                </div>

                <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0c0f17] border border-[#ECE5DC] dark:border-white/10 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <AgentAvatar
                        agent={{ id: "gate-an", name: "An Kế Toán" }}
                        size="sm"
                        alwaysAnimate
                        overrideConfig={{
                          type: "blob",
                          blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4", seed: 202 },
                        }}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#252522] dark:text-white">An Kế Toán • Máy tính #VM-02</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Đã đối soát xong 48 hóa đơn trên ERPCore</div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                      CHỜ DUYỆT
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{isVi ? "Tác vụ trên máy tính nhân viên AI:" : "Task staged on AI workstation:"}</div>
                      <div className="text-sm sm:text-base font-bold text-[#252522] dark:text-white font-mono">Ghi sổ ERPCore & Xuất báo cáo TT99</div>
                    </div>

                    {approvedDemo ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white keep-white text-xs font-semibold">
                        <Check size={14} />
                        <span>{isVi ? "Đã duyệt thực thi" : "Approved & Executed"}</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setApprovedDemo(true)}
                        className="px-5 py-2.5 rounded-full bg-[#252522] dark:bg-[#f8a87c] text-[#FFFCFA] dark:text-black text-xs font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm"
                      >
                        {isVi ? "Duyệt thực thi →" : "Approve Execution →"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. STRAWBERRY PRICING SECTION */}
      <StrawberryPricingSection isStandalonePage={false} />

      {/* 6. LEAN FAQ */}
      <section id="faq" className="py-20 border-b border-[var(--border-card)] bg-[var(--bg-page)] transition-colors">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <h2 className="text-2xl sm:text-[38px] font-normal tracking-[-1.5px] text-center mb-10 text-[#252522] dark:text-[#f3f4f6]">
            {isVi ? "Câu hỏi thường gặp" : "Questions & Answers"}
          </h2>
          <div className="space-y-3">
            {[
              {
                q: isVi ? "Nhân viên AI Skyer khác gì với ChatGPT?" : "How is Skyer different from ChatGPT?",
                a: isVi
                  ? "ChatGPT chỉ trả lời văn bản trong khung chat. Nhân viên AI Skyer có máy tính riêng để mở trình duyệt, đăng nhập ERPCore, đọc hóa đơn PDF và điền thẳng vào bảng tính của bạn."
                  : "ChatGPT is passive text. Skyer companions own virtual computers to operate browsers, ERPs, and spreadsheets directly.",
              },
              {
                q: isVi ? "Tôi có thể tự cài đặt trên máy chủ công ty (On-Premise) không?" : "Can we deploy 100% On-Premise?",
                a: isVi
                  ? "Có. Skyer hỗ trợ triển khai toàn bộ hệ thống và mô hình AI (Self-host Local Model) ngay trên hạ tầng nội bộ của doanh nghiệp, không cần kết nối ra ngoài."
                  : "Yes. Skyer supports full air-gapped on-premise deployment with self-hosted local LLMs.",
              },
            ].map((item, idx) => (
              <div key={item.q} className="rounded-2xl border border-[#ECE5DC] dark:border-white/10 bg-white dark:bg-[#11151f]">
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

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultCategory="request_agent"
      />
    </div>
  );
}
