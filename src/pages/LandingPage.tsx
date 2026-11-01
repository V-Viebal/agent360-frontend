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
  Search,
  Pin,
  Camera,
  RefreshCw,
  Maximize2,
  ExternalLink,
  X,
  Mic,
  MessageSquare,
  PanelLeftClose,
} from "lucide-react";
import { SkyerLogo } from "../components/SkyerLogo";
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
  const [heroAgentIdx, setHeroAgentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 3);
      setHeroCursorStep((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const appTaskUrl = (task: string) => `/app?task=${encodeURIComponent(task)}`;

  const heroCursorPos = [
    { x: 150, y: 128 },
    { x: 210, y: 166 },
    { x: 175, y: 204 },
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
        <div className="w-[184px] sm:w-[196px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-sky-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
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
        <div className="w-[184px] sm:w-[196px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-emerald-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
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
        <div className="w-[184px] sm:w-[196px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-orange-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
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
        <div className="w-[184px] sm:w-[196px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-purple-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
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
        <div className="w-[184px] sm:w-[196px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-rose-200/80 dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
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
      <section className="relative pt-14 sm:pt-20 lg:pt-24 overflow-hidden border-b border-[var(--border-card)] bg-[var(--bg-page)]">
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

        <div className="mx-auto max-w-[1080px] px-5 sm:px-7 lg:px-5 relative z-10">
          {/* Hero Holder: Centered Title, 2-line Description, 2 Pill CTAs with Entrance Animation */}
          <div className="text-center flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
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
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
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
            </motion.p>

            {/* 2 Pill CTAs (Primary Charcoal/White + Secondary Pill Surface) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 flex flex-wrap items-center justify-center gap-3.5"
            >
              <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[15px] font-medium hover:opacity-95 transition-all shadow-sm"
                >
                  <span className="text-[#FFFCFA] dark:text-[#111318]">{isVi ? "Bắt đầu làm việc" : "Launch Workspace"}</span>
                </Link>
              </motion.div>
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white dark:bg-[#161a24] text-[#252522] dark:text-[#f3f4f6] border border-[#ECE5DC] dark:border-white/10 text-[15px] font-medium shadow-2xs hover:bg-[#F8F3ED] dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-[#252522] dark:text-[#f3f4f6]">{isVi ? "Liên hệ Doanh nghiệp" : "Contact Sales"}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* HERO PRODUCT STAGE: 4 Companion Avatars Peeking from Top Edge + 16:10 Live Workspace Frame */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.78, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-24 sm:mt-28"
          >
            {/* 4 Peeking Companions Perched at Exact Strawberry Outer Corners (0% & 10% Left / Right) with Large Scale */}
            <div className="pointer-events-none select-none">
              {/* Left Outer Companion (pos-1: flush with left frame edge): Vy Pháp Chế */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="hidden md:flex flex-col items-center absolute -top-[92px] left-[2px] lg:left-[4px] z-10"
              >
                <span className="mb-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-[10.5px] font-mono font-semibold shadow-2xs">
                  Vy Pháp Chế
                </span>
                <AgentAvatar
                  agent={{ id: "peek-vy", name: "Vy Pháp Chế" }}
                  size="xl"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "bunny", expression: "attentive", color: "#a78bfa", animation: "wink.1.6,nod.1.4", seed: 404 },
                  }}
                />
              </motion.div>

              {/* Left Inner Companion (pos-2: ~104px from left edge): Minh Bốc */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.0, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="flex flex-col items-center absolute -top-[96px] left-[12%] sm:left-[98px] lg:left-[108px] z-10"
              >
                <span className="mb-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 text-[10.5px] font-mono font-semibold shadow-2xs">
                  Minh Bốc
                </span>
                <AgentAvatar
                  agent={{ id: "peek-minh", name: "Minh Bốc" }}
                  size="xl"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4,wink.1.6", seed: 101 },
                  }}
                />
              </motion.div>

              {/* Right Inner Companion (pos-3: ~108px from right edge): An Kế Toán */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="flex flex-col items-center absolute -top-[96px] right-[12%] sm:right-[98px] lg:right-[108px] z-10"
              >
                <span className="mb-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[10.5px] font-mono font-semibold shadow-2xs">
                  An Kế Toán
                </span>
                <AgentAvatar
                  agent={{ id: "peek-an", name: "An Kế Toán" }}
                  size="xl"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4,jump.1.4", seed: 202 },
                  }}
                />
              </motion.div>

              {/* Right Outer Companion (pos-4: flush with right frame edge): Linh Kinh Doanh */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                className="hidden md:flex flex-col items-center absolute -top-[92px] right-[2px] lg:right-[4px] z-10"
              >
                <span className="mb-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/30 text-[10.5px] font-mono font-semibold shadow-2xs">
                  Linh B2B
                </span>
                <AgentAvatar
                  agent={{ id: "peek-linh", name: "Linh Kinh Doanh" }}
                  size="xl"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "cat", expression: "happy", color: "#f8a87c", animation: "wink.1.6,nod.1.4", seed: 303 },
                  }}
                />
              </motion.div>
            </div>

            {/* 16:10 Hero Product Frame — Ultra-Simple Authentic Skyer /app UI with Live Animated Request/Response & SVG Browser Canvas */}
            {(() => {
              const heroAgents = [
                {
                  id: "an",
                  name: "An Kế Toán",
                  role: isVi ? "Kế toán TT99" : "Finance TT99",
                  color: "#10b981",
                  blob: { shape: "bear" as const, expression: "focused" as const, color: "#34d399", animation: "nod.1.4", seed: 202 },
                  prompt: isVi ? "Đối soát 48 HĐ GTGT T10 trên ERPCore" : "Reconcile 48 Oct VAT invoices in ERPCore",
                  reply: isVi ? "Đã khớp 48/48 PO • Chênh lệch: 0₫" : "Matched 48/48 POs • Variance: 0₫",
                  url: "erpcore.vn/so-cai-tt99",
                  docTitle: "MẪU 02-VT // SỔ CÁI TT99",
                  kpiLeft: { label: isVi ? "Tổng giá trị PO" : "Total PO Value", val: "1.842.500.000₫" },
                  kpiRight: { label: isVi ? "Độ lệch đối soát" : "Variance", val: "0₫ (100% Khớp)" },
                  rows: [
                    { name: "VinFast Energy", code: "HĐ-0041", val: "482.500.000₫", ok: true },
                    { name: "Masan Consumer", code: "HĐ-0042", val: "195.000.000₫", ok: true },
                    { name: "FPT Smart Cloud", code: "HĐ-0045", val: "310.800.000₫", ok: true },
                    { name: "Viettel Logistics", code: "HĐ-0049", val: "128.400.000₫", ok: true },
                    { name: "Thaco Auto Chu Lai", code: "HĐ-0052", val: "415.000.000₫", ok: true },
                    { name: "Tân Cảng Sài Gòn", code: "HĐ-0058", val: "310.800.000₫", ok: heroCursorStep === 2 },
                  ],
                },
                {
                  id: "minh",
                  name: "Minh Bốc",
                  role: isVi ? "Điều hành OKR" : "Executive Ops",
                  color: "#0ea5e9",
                  blob: { shape: "squircle" as const, expression: "proud" as const, color: "#38bdf8", animation: "wink.1.6", seed: 101 },
                  prompt: isVi ? "Tổng hợp tiến độ OKR Quý 4 toàn công ty" : "Summarize company-wide Q4 OKR progress",
                  reply: isVi ? "Doanh thu đạt 108% • 14/14 đầu việc đúng hạn" : "Revenue at 108% • 14/14 milestones on track",
                  url: "basecore.vn/okr-q4-board",
                  docTitle: "OKR Q4 // EXECUTIVE BOARD",
                  kpiLeft: { label: isVi ? "Mục tiêu Doanh thu" : "Revenue Target", val: "108.4% (Vượt KH)" },
                  kpiRight: { label: isVi ? "Runway Dòng tiền" : "Cash Runway", val: "18.4 Tháng" },
                  rows: [
                    { name: "Khối Kinh doanh B2B", code: "OKR-01", val: "108% KH", ok: true },
                    { name: "Khối Tài chính & ERP", code: "OKR-02", val: "100% KH", ok: true },
                    { name: "Khối Pháp chế NĐ13", code: "OKR-03", val: "98% KH", ok: true },
                    { name: "Khối Hạ tầng On-Prem", code: "OKR-04", val: "99.98% SLA", ok: true },
                    { name: "Khối CSKH Đa kênh", code: "OKR-05", val: "96% CSAT", ok: true },
                    { name: "Tuyển dụng Nhân sự", code: "OKR-06", val: "95% KH", ok: heroCursorStep === 2 },
                  ],
                },
                {
                  id: "vy",
                  name: "Vy Pháp Chế",
                  role: isVi ? "Rà soát HĐ" : "Legal & NDA",
                  color: "#8b5cf6",
                  blob: { shape: "bunny" as const, expression: "attentive" as const, color: "#a78bfa", animation: "nod.1.4", seed: 404 },
                  prompt: isVi ? "Kiểm tra rủi ro hợp đồng đại lý MSA_2026" : "Audit liability clauses in MSA_2026.docx",
                  reply: isVi ? "Đã khoanh 2 điều khoản phạt & chuẩn hóa NĐ13" : "Flagged 2 penalty clauses & aligned Decree 13",
                  url: "basecore.vn/msa-2026-review",
                  docTitle: "MSA_2026.DOCX // PHÁP CHẾ",
                  kpiLeft: { label: isVi ? "Điều khoản rà soát" : "Clauses Audited", val: "24/24 Điều khoản" },
                  kpiRight: { label: isVi ? "Tuân thủ NĐ13" : "Decree 13 Status", val: "An toàn 100%" },
                  rows: [
                    { name: "Điều 4.2: Giới hạn bồi thường", code: "Đã sửa", val: "An toàn", ok: true },
                    { name: "Điều 7.1: Bảo mật dữ liệu NĐ13", code: "Chuẩn", val: "Đạt 100%", ok: true },
                    { name: "Điều 9.3: Phạt chậm thanh toán", code: "Cập nhật", val: "Trần 8%", ok: true },
                    { name: "Điều 11.4: Quyền sở hữu trí tuệ", code: "Chuẩn", val: "Đạt 100%", ok: true },
                    { name: "Điều 14.1: Luật điều chỉnh VN", code: "Chuẩn", val: "Hợp lệ", ok: true },
                    { name: "Phụ lục A: SLA cam kết 99.9%", code: "Ký số", val: "Sẵn sàng", ok: heroCursorStep === 2 },
                  ],
                },
                {
                  id: "linh",
                  name: "Linh Kinh Doanh",
                  role: isVi ? "Sales B2B" : "B2B Outbound",
                  color: "#f97316",
                  blob: { shape: "cat" as const, expression: "happy" as const, color: "#f8a87c", animation: "wink.1.6", seed: 303 },
                  prompt: isVi ? "Lọc 100 khách hàng B2B và gửi báo giá" : "Qualify 100 B2B leads and draft proposals",
                  reply: isVi ? "Đã chấm điểm 100 Lead • Gửi 15 báo giá VIP" : "Scored 100 leads • Sent 15 VIP proposals",
                  url: "crm.skyer.vn/b2b-pipeline",
                  docTitle: "CRM // CHIẾN DỊCH B2B",
                  kpiLeft: { label: isVi ? "Khách hàng tiềm năng" : "Qualified Leads", val: "100 Doanh nghiệp" },
                  kpiRight: { label: isVi ? "Tỷ lệ phản hồi" : "Reply Rate", val: "38.5% (+15 VIP)" },
                  rows: [
                    { name: "Thaco Logistics", code: "Score 98", val: "Đã gửi BG", ok: true },
                    { name: "CJ Gemadept", code: "Score 96", val: "Đã mở mail", ok: true },
                    { name: "Tân Cảng Sài Gòn", code: "Score 95", val: "Hẹn demo", ok: true },
                    { name: "Becamex IDC Bình Dương", code: "Score 94", val: "Đã gửi BG", ok: true },
                    { name: "Tổng Công ty Bưu điện", code: "Score 93", val: "Đang tư vấn", ok: true },
                    { name: "Hoà Phát Dung Quất", code: "Score 92", val: "Đang soạn...", ok: heroCursorStep === 2 },
                  ],
                },
              ];

              const activeAg = heroAgents[heroAgentIdx] || heroAgents[0];
              const svgCursorTargets = [
                { x: 225, y: 88 },
                { x: 245, y: 126 },
                { x: 235, y: 164 },
              ];
              const curTarget = svgCursorTargets[heroCursorStep] || svgCursorTargets[0];

              return (
                <div className="relative z-20 rounded-t-[16px] border border-b-0 border-[#ECE5DC] dark:border-[#1c1c22] bg-[#FFFDF9] dark:bg-[#0c0c0e] shadow-[0_16px_34px_rgba(15,23,42,0.05),0_60px_120px_rgba(15,23,42,0.10)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.75)] overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] sm:min-h-[590px] lg:min-h-[651px]">
                    {/* ZONE 1: Simple Clean Left Agents List (No All Infra, No Search Clutter, Pure Agent Switcher) */}
                    <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#ECE5DC] dark:border-[#1c1c22] bg-[#F8F3ED] dark:bg-[#0d0d12] flex flex-col justify-between select-none">
                      <div>
                        {/* Header: Skyer Brand */}
                        <div className="h-13 px-5 border-b border-[#ECE5DC] dark:border-[#1c1c22] flex items-center justify-between">
                          <SkyerLogo size={20} showText />
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        {/* Pure Interactive Agent List */}
                        <div className="p-3.5 space-y-2.5">
                          {heroAgents.map((ag, idx) => {
                            const isSelected = idx === heroAgentIdx;
                            return (
                              <button
                                key={ag.id}
                                type="button"
                                onClick={() => setHeroAgentIdx(idx)}
                                className={
                                  "w-full px-3.5 py-3.5 rounded-2xl flex items-center gap-3.5 text-left transition-all cursor-pointer " +
                                  (isSelected
                                    ? "bg-white dark:bg-[#181822] border border-[#ECE5DC] dark:border-[#2a2a3c] shadow-xs"
                                    : "hover:bg-white/60 dark:hover:bg-white/[0.04] border border-transparent opacity-75 hover:opacity-100")
                                }
                              >
                                <AgentAvatar
                                  agent={{ id: `hero-list-${ag.id}`, name: ag.name }}
                                  size="sm"
                                  alwaysAnimate={isSelected}
                                  overrideConfig={{ type: "blob", blob: ag.blob }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[13px] font-semibold text-[#252522] dark:text-white truncate">
                                      {ag.name}
                                    </span>
                                    <span
                                      className="h-1.5 w-1.5 rounded-full shrink-0"
                                      style={{ backgroundColor: ag.color }}
                                    />
                                  </div>
                                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate block">
                                    {ag.role}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Minimal Member Footer */}
                      <div className="px-4 py-2.5 border-t border-[#ECE5DC] dark:border-[#1c1c22] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="font-medium text-[#252522] dark:text-neutral-300">Skyer Workspace</span>
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">● Live</span>
                      </div>
                    </div>

                    {/* ZONE 2: Animated Live Chat Action (Real Request -> Live Streaming Response -> SVG Action Trigger) */}
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#ECE5DC] dark:border-[#1c1c22] bg-[#FFFDF9] dark:bg-[#0c0c0e] flex flex-col justify-between">
                      <div>
                        {/* Top Centered Agent Capsule */}
                        <div className="h-13 px-4 border-b border-[#ECE5DC] dark:border-[#1c1c22] flex items-center justify-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F3ED] dark:bg-[#14141c] border border-[#ECE5DC] dark:border-white/[0.08] text-xs font-semibold text-[#252522] dark:text-white">
                            <AgentAvatar
                              agent={{ id: `capsule-${activeAg.id}`, name: activeAg.name }}
                              size="xs"
                              alwaysAnimate
                              overrideConfig={{ type: "blob", blob: activeAg.blob }}
                            />
                            <span>{activeAg.name}</span>
                          </div>
                        </div>

                        {/* Animated Request & Response Flow */}
                        <div className="p-5 sm:p-6 space-y-5">
                          {/* 1. User Request Bubble */}
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`req-${activeAg.id}`}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.22 }}
                              className="ml-6 p-3 rounded-2xl rounded-tr-xs bg-[#F8F3ED] dark:bg-[#1c1c26] border border-[#ECE5DC] dark:border-white/[0.07] text-[12.5px] font-medium text-[#252522] dark:text-neutral-100 shadow-2xs"
                            >
                              {activeAg.prompt}
                            </motion.div>
                          </AnimatePresence>

                          {/* 2. Agent Live Animated Response Card with SVG Progress Wave */}
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`res-${activeAg.id}`}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.28, delay: 0.06 }}
                              className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#121218] border border-[#ECE5DC] dark:border-[#22222e] space-y-3 shadow-2xs"
                            >
                              {/* Live Tool Call Pill */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F8F3ED] dark:bg-[#1a1a24] border border-[#ECE5DC] dark:border-white/10 text-[10.5px] font-mono text-[#252522] dark:text-neutral-200">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full animate-ping"
                                    style={{ backgroundColor: activeAg.color }}
                                  />
                                  <span>{activeAg.url}</span>
                                </div>
                                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                  {heroCursorStep === 0 ? "35%" : heroCursorStep === 1 ? "78%" : "100%"}
                                </span>
                              </div>

                              {/* Animated SVG Execution Flow Diagram inside Chat Bubble */}
                              <svg viewBox="0 0 260 44" className="w-full h-11 overflow-visible">
                                {/* Connecting Track Line */}
                                <line
                                  x1="24"
                                  y1="22"
                                  x2="236"
                                  y2="22"
                                  stroke="currentColor"
                                  className="text-neutral-200 dark:text-neutral-800"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                                {/* Animated Active Progress Line */}
                                <motion.line
                                  x1="24"
                                  y1="22"
                                  animate={{ x2: heroCursorStep === 0 ? 95 : heroCursorStep === 1 ? 168 : 236 }}
                                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                  y2="22"
                                  stroke={activeAg.color}
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                />
                                {/* 3 Step Nodes: Read -> Match -> Sync */}
                                {[
                                  { x: 24, label: isVi ? "Đọc dữ liệu" : "Read" },
                                  { x: 130, label: isVi ? "Đối chiếu" : "Verify" },
                                  { x: 236, label: isVi ? "Hoàn tất" : "Sync" },
                                ].map((node, nIdx) => {
                                  const done = nIdx <= heroCursorStep;
                                  return (
                                    <g key={node.label} transform={`translate(${node.x}, 16)`}>
                                      <circle
                                        r="7"
                                        fill={done ? activeAg.color : "var(--bg-card)"}
                                        stroke={done ? activeAg.color : "rgba(150,150,150,0.35)"}
                                        strokeWidth="2"
                                      />
                                      {done && (
                                        <path
                                          d="M-2.5 0 L-0.5 2 L3 -2"
                                          fill="none"
                                          stroke="#ffffff"
                                          strokeWidth="1.6"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      )}
                                      <text
                                        y="21"
                                        textAnchor="middle"
                                        className="fill-neutral-500 dark:fill-neutral-400 text-[8.5px] font-mono"
                                      >
                                        {node.label}
                                      </text>
                                    </g>
                                  );
                                })}
                              </svg>

                              {/* Crisp Result Line */}
                              <div className="pt-1 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-[12px] font-medium text-[#252522] dark:text-neutral-200">
                                <span>{activeAg.reply}</span>
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Minimal Composer Bar */}
                      <div className="p-3">
                        <Link
                          to="/app"
                          className="h-9 px-3 rounded-full bg-[#F8F3ED] dark:bg-[#16161d] border border-[#ECE5DC] dark:border-[#242432] flex items-center justify-between gap-2 text-[11.5px] text-neutral-400 hover:border-[#f8a87c]/60 transition-colors"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Plus size={12} className="text-neutral-500 shrink-0" />
                            <span className="truncate">{isVi ? "Giao việc cho đồng đội AI..." : "Assign a task..."}</span>
                          </div>
                          <Mic size={12} className="text-[#f8a87c] shrink-0" />
                        </Link>
                      </div>
                    </div>

                    {/* ZONE 3: Authentic Visual Browser Screen with Animated SVG Canvas & Live AI Cursor */}
                    <div className="lg:col-span-5 bg-white dark:bg-[#0d0d12] flex flex-col justify-between relative overflow-hidden">
                      {/* Browser Top Toolbar */}
                      <div className="h-13 px-4 border-b border-[#ECE5DC] dark:border-[#1c1c22] bg-[#F8F3ED] dark:bg-[#0d0d12] flex items-center justify-between gap-2 select-none">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="px-2 py-0.5 rounded bg-white dark:bg-[#181820] text-[#252522] dark:text-neutral-200 text-[10px] font-mono border border-[#ECE5DC] dark:border-[#242430] truncate">
                            {activeAg.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {[Camera, RefreshCw, Maximize2].map((Icon, i) => (
                            <span
                              key={i}
                              className="h-6 w-6 rounded-md bg-white dark:bg-[#181820] border border-[#ECE5DC] dark:border-[#242430] text-neutral-600 dark:text-neutral-300 flex items-center justify-center"
                            >
                              <Icon size={11} className={i === 0 ? "text-cyan-500 dark:text-cyan-400" : ""} />
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive SVG Browser Viewport Canvas */}
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center relative">
                        <div className="rounded-2xl border border-[#ECE5DC] dark:border-[#22222e] bg-[#FFFDF9] dark:bg-[#121218] p-4 sm:p-5 shadow-xs relative overflow-hidden">
                          {/* Canvas Header */}
                          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#ECE5DC] dark:border-white/10 font-mono">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{
                                backgroundColor: `${activeAg.color}20`,
                                color: activeAg.color,
                              }}
                            >
                              {activeAg.docTitle}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              ● Auto-Sync
                            </span>
                          </div>

                          {/* Rows inside Browser Canvas */}
                          <div className="space-y-1.5 font-mono text-[11px]">
                            {activeAg.rows.map((r, rIdx) => {
                              const isHovered = rIdx === heroCursorStep;
                              return (
                                <motion.div
                                  key={r.name}
                                  animate={{
                                    scale: isHovered ? 1.01 : 1,
                                  }}
                                  className={
                                    "grid grid-cols-12 items-center px-3 py-2.5 rounded-xl border transition-colors " +
                                    (isHovered
                                      ? "bg-emerald-500/10 border-emerald-500/40"
                                      : "bg-white dark:bg-[#16161f] border-[#ECE5DC]/60 dark:border-white/5")
                                  }
                                >
                                  <span className="col-span-6 font-sans font-semibold text-[#252522] dark:text-white truncate">
                                    {r.name}
                                  </span>
                                  <span className="col-span-3 text-right text-neutral-500 dark:text-neutral-400 text-[10px]">
                                    {r.val}
                                  </span>
                                  <span className="col-span-3 text-right text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                    ✓ {r.code}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Animated SVG Overlay: Live Scanning Beam + AI Agent Pointer + Click Ripple */}
                          <svg
                            viewBox="0 0 360 210"
                            className="absolute inset-0 w-full h-full pointer-events-none z-20"
                          >
                            {/* Animated Click Ripple Ring at Cursor Target */}
                            <motion.circle
                              animate={{
                                cx: curTarget.x,
                                cy: curTarget.y,
                                r: [4, 18, 24],
                                opacity: [0.75, 0.25, 0],
                              }}
                              transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeOut",
                              }}
                              fill="none"
                              stroke={activeAg.color}
                              strokeWidth="2"
                            />

                            {/* Animated Agent Pointer Cursor */}
                            <motion.g
                              animate={{ x: curTarget.x, y: curTarget.y }}
                              transition={{ type: "spring", stiffness: 110, damping: 18 }}
                            >
                              <path
                                d="M0 0 L5 16 L9 10 L16 7 Z"
                                fill={activeAg.color}
                                stroke="#ffffff"
                                strokeWidth="1.2"
                              />
                              <rect
                                x="10"
                                y="10"
                                width="74"
                                height="18"
                                rx="9"
                                fill={activeAg.color}
                              />
                              <text
                                x="47"
                                y="22"
                                textAnchor="middle"
                                fill="#ffffff"
                                className="text-[9px] font-sans font-bold"
                              >
                                {activeAg.name}
                              </text>
                            </motion.g>
                          </svg>
                        </div>
                      </div>

                      {/* Minimalist Bottom Control Pill */}
                      <div className="px-3.5 py-2.5 border-t border-[#ECE5DC] dark:border-[#1c1c22] bg-[#F8F3ED]/60 dark:bg-[#0d0d12] flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-[#181820] border border-[#ECE5DC] dark:border-[#2c2c3e] text-[#252522] dark:text-neutral-200 text-[9.5px] shadow-2xs">
                          <span
                            className="h-1.5 w-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: activeAg.color }}
                          />
                          <span className="font-medium">{activeAg.name}</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-[#F8F3ED] dark:bg-[#252534] text-[#252522] dark:text-white text-[8.5px] font-semibold">
                            {isVi ? "Tiếp quản" : "Take over"}
                          </span>
                        </div>
                        <span className="text-[9.5px] font-mono text-neutral-500 dark:text-neutral-400">
                          On-Premise VM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      </section>

      {/* 1B. TRUSTED ENTERPRISE LOGO STRIP + "HIRE YOUR NEXT AI COLLEAGUE" 2-COLUMN SECTION */}
      <section className="py-16 sm:py-24 border-b border-[var(--border-card)] bg-[var(--bg-page)]">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-7 lg:px-5">
          {/* Monochrome Logo Strip with Staggered Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-6">
              {isVi ? "Đồng hành cùng các doanh nghiệp tăng trưởng nhanh" : "Trusted by fast-growing teams"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-bold tracking-tight text-neutral-400 dark:text-neutral-500 select-none">
              {["VINFAST", "MASAN GROUP", "FPT SOFTWARE", "VIETTEL POST", "AGENTCORE", "ERPCORE"].map((brand, bIdx) => (
                <motion.span
                  key={brand}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2, scale: 1.04 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: bIdx * 0.06 }}
                  className="hover:text-[#252522] dark:hover:text-neutral-200 transition-colors cursor-default"
                >
                  {brand}
                </motion.span>
              ))}
            </div>
          </motion.div>

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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 flex items-center justify-center"
            >
              <div className="w-full max-w-[548px] min-h-[320px] rounded-[28px] bg-[#F8F3ED] dark:bg-[#11151f] border border-[#ECE5DC] dark:border-white/10 p-7 sm:p-10 flex flex-col justify-center shadow-xs hover:shadow-md transition-shadow">
                <div className="grid grid-cols-3 gap-6 sm:gap-8 items-end">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#181d2a] border border-[#ECE5DC] dark:border-white/10 shadow-xs">
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
                    <span className="mt-2.5 text-sm font-semibold text-[#252522] dark:text-white">Minh Bốc</span>
                    <span className="text-[11.5px] text-neutral-500 dark:text-neutral-400">{isVi ? "Điều hành" : "Executive"}</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#181d2a] border border-[#ECE5DC] dark:border-white/10 shadow-xs">
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
                    <span className="mt-2.5 text-sm font-semibold text-[#252522] dark:text-white">An Kế Toán</span>
                    <span className="text-[11.5px] text-neutral-500 dark:text-neutral-400">{isVi ? "Kế toán TT99" : "Finance"}</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#181d2a] border border-[#ECE5DC] dark:border-white/10 shadow-xs">
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
                    <span className="mt-2.5 text-sm font-semibold text-[#252522] dark:text-white">Vy Pháp Chế</span>
                    <span className="text-[11.5px] text-neutral-500 dark:text-neutral-400">{isVi ? "Pháp chế" : "Legal"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL COMPANIONS 6-CARD GRID (Exact Strawberry 333px Full-Bleed Visual Anatomy — Zero Box-in-Box Padding Loss) */}
      <section id="bots" className="py-24 sm:py-32 border-b border-[var(--border-card)] bg-[var(--bg-card-subtle)] transition-colors">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-7 lg:px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[20px] gap-y-[44px]">
            {companions.map((comp, idx) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.48, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={
                      "h-[228px] rounded-[22px] bg-gradient-to-br " +
                      comp.cardGradient +
                      " border border-[#ECE5DC] dark:border-white/10 px-5 pt-4 pb-12 relative overflow-hidden flex items-center justify-between gap-3 mb-5 shadow-xs group-hover:shadow-lg group-hover:border-[#f8a87c]/50 transition-all"
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
                    className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white flex items-center gap-1 transition-colors group/link"
                  >
                    <span>{isVi ? "Tìm hiểu thêm" : "Learn more"}</span>
                    <ArrowRight size={13} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}

            {/* 6th Card: "+ Create your own" */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.48, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between group"
            >
              <div>
                <div className="h-[228px] rounded-[22px] bg-gradient-to-br from-neutral-100 to-[#FFFDF9] dark:from-[#161b26] dark:to-[#0c0e15] border border-dashed border-neutral-300 dark:border-white/15 px-5 pt-4 pb-12 relative overflow-hidden flex items-center justify-between gap-3 mb-5 shadow-xs group-hover:shadow-lg group-hover:border-[#f8a87c]/50 transition-all">
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
                  <div className="w-[184px] sm:w-[196px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] border border-neutral-200 dark:border-white/10 p-2.5 text-[10px] font-mono text-[#252522] dark:text-neutral-300 shadow-xs space-y-1">
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
                  className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white flex items-center gap-1 group/link"
                >
                  <span>{isVi ? "Thư viện mẫu" : "Templates"}</span>
                  <ArrowRight size={13} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
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
        <div className="mx-auto max-w-[1080px] px-5 sm:px-7 lg:px-5">
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

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-[#ECE5DC] dark:border-white/10 bg-[#F8F3ED] dark:bg-[#11151f] p-6 sm:p-8 shadow-2xs"
          >
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
                      <div className="text-[11.5px] text-neutral-500 dark:text-neutral-400">Phiên đăng nhập riêng</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Tự thao tác web</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-sm font-bold text-[#252522] dark:text-white">AgentCore</div>
                      <div className="text-[11.5px] text-neutral-500 dark:text-neutral-400">Không gian /app/working</div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">Xử lý file & Excel</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 space-y-1">
                      <div className="text-sm font-bold text-[#252522] dark:text-white">Local Model</div>
                      <div className="text-[11.5px] text-neutral-500 dark:text-neutral-400">Self-host On-Premise</div>
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
          </motion.div>
        </div>
      </section>

      {/* 5. STRAWBERRY PRICING SECTION */}
      <StrawberryPricingSection isStandalonePage={false} />

      {/* 6. LEAN FAQ */}
      <section id="faq" className="py-20 border-b border-[var(--border-card)] bg-[var(--bg-page)] transition-colors">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <h2 className="text-3xl sm:text-[46px] font-normal tracking-[-1.85px] leading-[1.12] text-center mb-10 text-[#252522] dark:text-[#f3f4f6]">
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
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl border border-[#ECE5DC] dark:border-white/10 bg-white dark:bg-[#11151f] hover:border-[#f8a87c]/40 transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-[#252522] dark:text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown size={16} className={openFaq === idx ? "rotate-180 transition-transform duration-200" : "transition-transform duration-200"} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="px-5 pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
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
