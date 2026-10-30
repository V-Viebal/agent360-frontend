import { SeoHead } from "../components/SeoHead";
import { useTranslation } from "../i18n/LanguageContext";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Bot,
  Users,
  Cpu,
  Play,
  ArrowRight,
  BookOpen,
  X,
  Workflow,
  Check,
} from "lucide-react";
import { MARKETPLACE_AGENTS } from "../data/mockMarketplaceAgents";
import { AIOrgChart } from "../components/AIOrgChart";
import { MarketplaceCustomAgentBanner } from "../components/MarketplaceCustomAgentBanner";
import { AgentAvatar } from "../components/AgentAvatar";
import { AgentMarketplaceItem } from "../types/marketplace";

const CATEGORY_DEFS: { id: string; en: string; vi: string; filter: (item: AgentMarketplaceItem) => boolean }[] = [
  { id: "all", en: "All Companions", vi: "Tất cả vị trí", filter: () => true },
  { id: "exec", en: "Executive & Ops", vi: "Điều hành", filter: (item) => item.department === "Executive & Ops" },
  { id: "finance", en: "Finance & TT99", vi: "Kế toán & ERP", filter: (item) => item.department === "Finance & Accounting" },
  { id: "sales", en: "Sales & B2B", vi: "Kinh doanh B2B", filter: (item) => item.department === "Sales & BizDev" },
  { id: "cx", en: "Customer Support", vi: "Chăm sóc KH", filter: (item) => item.department === "Customer Support & Success" },
  { id: "marketing", en: "Marketing", vi: "Marketing", filter: (item) => item.department === "Marketing & Creative" },
  { id: "hr", en: "HR & Legal", vi: "Nhân sự & Pháp chế", filter: (item) => item.department === "HR & People" || item.department === "Legal & Compliance" },
  { id: "tech", en: "IT & Infra", vi: "CNTT & Hạ tầng", filter: (item) => item.department === "Engineering & Tech" },
];

const COMPANION_STAGE_META: Record<
  string,
  {
    vnName: string;
    enName: string;
    badgeVi: string;
    badgeEn: string;
    badgeStyle: string;
    stageGradient: string;
    blob: { shape: string; expression: string; color: string; animation: string; seed: number };
    conciseVi: string;
    conciseEn: string;
    miniHeader: string;
    miniTag: string;
    miniRow1: [string, string];
    miniRow2: [string, string];
    miniStatusVi: string;
    miniStatusEn: string;
  }
> = {
  "agent-chief-of-staff": {
    vnName: "Minh Bốc",
    enName: "Executive Minh",
    badgeVi: "Trợ lý Điều hành",
    badgeEn: "Chief of Staff",
    badgeStyle: "bg-[#e0f2fe] text-[#0369a1] dark:bg-sky-500/20 dark:text-sky-300 border-sky-200 dark:border-sky-500/30",
    stageGradient: "from-[#f0f9ff] to-[#FFFDF9] dark:from-[#0f1d2d] dark:to-[#0c0e15]",
    blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4,wink.1.6", seed: 101 },
    conciseVi: "Tổng hợp KPI mỗi sáng, soạn sẵn dự thảo trả lời email và theo sát đầu việc các phòng ban.",
    conciseEn: "Get a brief every morning, replies drafted in your voice, and cross-team OKRs tracked.",
    miniHeader: "OKR // Q4 Board",
    miniTag: "08:30",
    miniRow1: ["Doanh thu B2B", "108% ✓"],
    miniRow2: ["Runway Quỹ", "18.4 tháng"],
    miniStatusVi: "✓ Đã đồng bộ 4 phòng",
    miniStatusEn: "✓ 4 depts synced",
  },
  "agent-finance-controller": {
    vnName: "An Kế Toán",
    enName: "Finance An",
    badgeVi: "Kế toán TT99",
    badgeEn: "Finance & ERP",
    badgeStyle: "bg-[#dcfce7] text-[#15803d] dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    stageGradient: "from-[#f0fdf4] to-[#FFFDF9] dark:from-[#0f241c] dark:to-[#0c0e15]",
    blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4,jump.1.4", seed: 202 },
    conciseVi: "Khớp 48 hóa đơn GTGT với đơn hàng PO trên ERPCore, lập chứng từ TT99 với độ lệch 0 đồng.",
    conciseEn: "Reconcile 48 vendor invoices against POs in ERPCore and stage TT99 tax vouchers.",
    miniHeader: "ERPCore // 02-VT",
    miniTag: "TT99",
    miniRow1: ["PO-2026-891", "Khớp 100%"],
    miniRow2: ["Chênh lệch", "0 VNĐ"],
    miniStatusVi: "✓ 48/48 HĐ hợp lệ",
    miniStatusEn: "✓ 48/48 matched",
  },
  "agent-b2b-sales-exec": {
    vnName: "Linh Kinh Doanh",
    enName: "Sales Linh",
    badgeVi: "Kinh doanh B2B",
    badgeEn: "B2B Sales",
    badgeStyle: "bg-[#ffedd5] text-[#c2410c] dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
    stageGradient: "from-[#fff7ed] to-[#FFFDF9] dark:from-[#291811] dark:to-[#0c0e15]",
    blob: { shape: "cat", expression: "happy", color: "#f8a87c", animation: "wink.1.6,nod.1.4", seed: 303 },
    conciseVi: "Tìm 100 khách hàng doanh nghiệp tiềm năng, soạn báo giá và kịch bản tiếp cận theo đúng giọng của bạn.",
    conciseEn: "Get 100 qualified B2B leads with personalized outreach written in your voice, ready to send.",
    miniHeader: "CRM // Lead B2B",
    miniTag: "+100",
    miniRow1: ["VinFast Supply", "98% Fit"],
    miniRow2: ["Thaco Logistics", "95% Fit"],
    miniStatusVi: "✓ 15 báo giá sẵn sàng",
    miniStatusEn: "✓ 15 quotes staged",
  },
  "agent-customer-support-lead": {
    vnName: "Lúa CSKH",
    enName: "Support Lua",
    badgeVi: "CSKH 24/7",
    badgeEn: "Customer Success",
    badgeStyle: "bg-[#ccfbf1] text-[#0f766e] dark:bg-teal-500/20 dark:text-teal-300 border-teal-200 dark:border-teal-500/30",
    stageGradient: "from-[#f0fdfa] to-[#FFFDF9] dark:from-[#0f2624] dark:to-[#0c0e15]",
    blob: { shape: "droplet", expression: "laughing", color: "#2dd4bf", animation: "jump.1.4,nod.1.4", seed: 606 },
    conciseVi: "Phản hồi yêu cầu hỗ trợ trong 15 giây, tự tra cứu đơn hàng ERPCore và xử lý đổi trả 24/7.",
    conciseEn: "Resolve tier-2 tickets in 15s by querying ERPCore orders and knowledge base articles 24/7.",
    miniHeader: "Ticket // #8821",
    miniTag: "SLA 12s",
    miniRow1: ["CSAT Tuần", "4.95 / 5 ★"],
    miniRow2: ["Tồn đọng", "0 Ticket"],
    miniStatusVi: "✓ Đã xuất hóa đơn VAT",
    miniStatusEn: "✓ Receipt dispatched",
  },
  "agent-marketing-growth": {
    vnName: "Martin Nội Dung",
    enName: "Marketing Martin",
    badgeVi: "Marketing Đa kênh",
    badgeEn: "Growth & SEO",
    badgeStyle: "bg-[#f3e8ff] text-[#7e22ce] dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30",
    stageGradient: "from-[#faf5ff] to-[#FFFDF9] dark:from-[#22152e] dark:to-[#0c0e15]",
    blob: { shape: "cloud", expression: "excited", color: "#c084fc", animation: "wink.1.6,nod.1.4", seed: 707 },
    conciseVi: "Phân tích chủ đề chuyển đổi cao, viết bài chuẩn SEO/AEO và tự động lên lịch đăng đa kênh.",
    conciseEn: "Find what worked for you, then get SEO/AEO articles and social posts in your voice.",
    miniHeader: "Postiz // Lịch đăng",
    miniTag: "AEO/SEO",
    miniRow1: ["LinkedIn Series", "5 bài ✓"],
    miniRow2: ["CTR Tự nhiên", "+42%"],
    miniStatusVi: "✓ Đã lên lịch 09:00",
    miniStatusEn: "✓ Queued 09:00 AM",
  },
  "agent-hr-talent-partner": {
    vnName: "Nam Tuyển Dụng",
    enName: "Talent Nam",
    badgeVi: "Nhân sự & C&B",
    badgeEn: "Talent & HR",
    badgeStyle: "bg-[#ffe4e6] text-[#be123c] dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-500/30",
    stageGradient: "from-[#fff1f2] to-[#FFFDF9] dark:from-[#2b141b] dark:to-[#0c0e15]",
    blob: { shape: "clover", expression: "happy", color: "#fb7185", animation: "jump.1.4,nod.1.4", seed: 505 },
    conciseVi: "Chấm điểm 10 ứng viên sáng giá nhất theo JD của phòng ban và tự động xếp lịch phỏng vấn.",
    conciseEn: "Get 10 strong candidates, each researched and scored against what your team needs.",
    miniHeader: "Top 10 Ứng viên",
    miniTag: "Match",
    miniRow1: ["Trần M. Hoàng", "96/100"],
    miniRow2: ["Lê Thu Hà", "94/100"],
    miniStatusVi: "✓ Đã gửi lịch PV",
    miniStatusEn: "✓ Invites sent",
  },
  "agent-legal-compliance": {
    vnName: "Vy Pháp Chế",
    enName: "Legal Vy",
    badgeVi: "Pháp chế & HĐ",
    badgeEn: "Legal & NDA",
    badgeStyle: "bg-[#fef3c7] text-[#b45309] dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
    stageGradient: "from-[#fffbeb] to-[#FFFDF9] dark:from-[#292010] dark:to-[#0c0e15]",
    blob: { shape: "bunny", expression: "attentive", color: "#fbbf24", animation: "nod.1.4,wink.1.6", seed: 404 },
    conciseVi: "Rà soát hợp đồng thương mại, khoanh vùng điều khoản phạt rủi ro và đối chiếu chuẩn Nghị định 13.",
    conciseEn: "Redline commercial contracts, flag risky indemnity clauses, and verify NĐ13 compliance.",
    miniHeader: "MSA_2026.docx",
    miniTag: "NĐ13",
    miniRow1: ["Trần phạt HĐ", "100% GT"],
    miniRow2: ["Rủi ro SHTT", "0 Lỗi ✓"],
    miniStatusVi: "✓ Đã xuất bản Redline",
    miniStatusEn: "✓ Redline DOCX ready",
  },
  "agent-it-systems-ops": {
    vnName: "Kiên Hạ Tầng",
    enName: "IT Ops Kien",
    badgeVi: "CNTT & On-Premise",
    badgeEn: "IT & Infra Ops",
    badgeStyle: "bg-[#dcfce7] text-[#15803d] dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
    stageGradient: "from-[#f0fdf4] to-[#FFFDF9] dark:from-[#11241a] dark:to-[#0c0e15]",
    blob: { shape: "hexagon", expression: "focused", color: "#4ade80", animation: "nod.1.4", seed: 808 },
    conciseVi: "Cấp phát tài khoản SSO nhân sự mới, giám sát cụm Docker On-Premise và tự động sao lưu mỗi ngày.",
    conciseEn: "Provision SSO accounts, monitor on-premise Docker nodes, and verify daily backups 24/7.",
    miniHeader: "On-Prem // Nodes",
    miniTag: "99.98%",
    miniRow1: ["Logto SSO 2FA", "Active ✓"],
    miniRow2: ["Backup S3/DB", "Verified"],
    miniStatusVi: "✓ 8/8 Cụm khỏe mạnh",
    miniStatusEn: "✓ 8/8 nodes healthy",
  },
};

export function MarketplacePage() {
  const { t, language } = useTranslation();
  const isVi = language === "vi";
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"catalog" | "orgchart">("catalog");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAgentModal, setActiveAgentModal] = useState<AgentMarketplaceItem | null>(null);
  const [deployedSuccess, setDeployedSuccess] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((p) => (p + 1) % 2), 2600);
    return () => clearInterval(timer);
  }, []);

  const filteredAgents = useMemo(() => {
    const categoryConfig = CATEGORY_DEFS.find((c) => c.id === selectedCategoryId);
    return MARKETPLACE_AGENTS.filter((agent) => {
      const matchesCategory =
        selectedCategoryId === "all" ? true : categoryConfig ? categoryConfig.filter(agent) : true;
      const meta = COMPANION_STAGE_META[agent.id];
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        agent.name.toLowerCase().includes(query) ||
        (meta && meta.vnName.toLowerCase().includes(query)) ||
        (meta && meta.badgeVi.toLowerCase().includes(query)) ||
        agent.roleTitle.toLowerCase().includes(query) ||
        agent.summary.toLowerCase().includes(query) ||
        agent.tools.some((tool) => tool.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, searchQuery]);

  const handleDeployAgent = (agent: AgentMarketplaceItem) => {
    const meta = COMPANION_STAGE_META[agent.id];
    setDeployedSuccess(isVi && meta ? meta.vnName : agent.name);
    setTimeout(() => {
      setDeployedSuccess(null);
      navigate(`/app?task=${encodeURIComponent(agent.samplePrompt)}`);
    }, 900);
  };

  return (
    <div className="pt-20 pb-28 min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] font-sans transition-colors">
      <SeoHead
        title={
          isVi
            ? "Danh mục Nhân sự AI Skyer — Đồng nghiệp AI Chuyên biệt cho Doanh nghiệp"
            : "Skyer Companions — Pre-Built Enterprise AI Teammates"
        }
        description={
          isVi
            ? "Tuyển dụng các đồng nghiệp AI sở hữu máy tính độc lập cho Điều hành, Kế toán TT99 (ERPCore), Kinh doanh B2B, CSKH 24/7, Pháp chế và Hạ tầng On-Premise."
            : "Hire verified AI teammates with dedicated computers for Executive Ops, Finance (ERPCore & TT99), B2B Sales, Support, Legal, and IT."
        }
        canonicalPath="/marketplace"
      />

      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Header (Strawberry 48px Title + 2-Line Subtitle) */}
        <div className="text-center max-w-2xl mx-auto pt-6 pb-10">
          <h1 className="text-4xl sm:text-[48px] font-normal tracking-[-1.91px] leading-[1.1] text-[#252522] dark:text-white">
            {isVi ? "Tuyển dụng đồng nghiệp AI chuyên trách" : "Hire specialized AI teammates"}
          </h1>
          <p className="mt-4 text-lg sm:text-[20px] leading-[1.4] text-[#252522]/70 dark:text-neutral-400 font-normal">
            {isVi
              ? "Mỗi nhân viên AI được trang bị sẵn máy tính độc lập, công cụ nghiệp vụ và bộ nhớ quy trình 24/7."
              : "Every companion comes with a dedicated Linux computer, verified tool drivers, and 24/7 institutional memory."}
          </p>
        </div>

        {/* View Switcher + Search + Category Pills Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-card)]">
          {/* Catalog vs OrgChart Switcher */}
          <div className="inline-flex items-center gap-1.5 bg-[var(--bg-card-subtle)] p-1 rounded-full border border-[var(--border-card)] self-start">
            <button
              type="button"
              onClick={() => setActiveView("catalog")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === "catalog"
                  ? "bg-[#252522] dark:bg-white text-white dark:text-black shadow-2xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white"
              }`}
            >
              <Bot size={13} />
              <span>{isVi ? "Danh sách Nhân viên" : "Companions"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("orgchart")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === "orgchart"
                  ? "bg-[#252522] dark:bg-white text-white dark:text-black shadow-2xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white"
              }`}
            >
              <Users size={13} />
              <span>{isVi ? "Sơ đồ Tổ chức AI" : "AI Org Chart"}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? "Tìm theo vị trí, ERPCore, TT99..." : "Search role, ERPCore, TT99..."}
              className="w-full rounded-full border border-[var(--border-card)] bg-white dark:bg-[#11151f] pl-9 pr-8 py-2 text-xs text-[#252522] dark:text-white placeholder-neutral-400 focus:border-[#f8a87c] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#252522] dark:hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {activeView === "orgchart" ? (
          <div className="mt-8">
            <AIOrgChart />
          </div>
        ) : (
          <>
            {/* Lean Category Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {CATEGORY_DEFS.map((cat) => {
                const active = selectedCategoryId === cat.id;
                const label = isVi ? cat.vi : cat.en;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      active
                        ? "bg-[#252522] dark:bg-white text-white dark:text-black border-[#252522] dark:border-white shadow-2xs"
                        : "bg-white dark:bg-[#11151f] text-neutral-600 dark:text-neutral-400 hover:bg-[#F8F3ED] dark:hover:bg-white/10 border-[var(--border-card)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Strawberry 3-Column Companion Cards Grid (Real AgentAvatar + Live Mini-UI + Concise 2-Line Copy) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
              {filteredAgents.map((agent) => {
                const meta = COMPANION_STAGE_META[agent.id] || COMPANION_STAGE_META["agent-chief-of-staff"];
                const displayName = isVi ? meta.vnName : meta.enName;
                const displayBadge = isVi ? meta.badgeVi : meta.badgeEn;

                return (
                  <motion.div
                    layout
                    key={agent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-[var(--border-card)] bg-white dark:bg-[#11151f] p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Top Stage: Dot Matrix + Real Animated BlobAvatar + Live Mini-UI + Role Pill */}
                      <div
                        className={
                          "h-52 rounded-2xl bg-gradient-to-br " +
                          meta.stageGradient +
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

                        {/* Left: Real Animated AgentAvatar */}
                        <div className="relative z-10 pl-1">
                          <AgentAvatar
                            agent={{ id: agent.id, name: displayName }}
                            size="lg"
                            alwaysAnimate
                            overrideConfig={{
                              type: "blob",
                              blob: meta.blob as any,
                            }}
                          />
                        </div>

                        {/* Right: Live Autonomous Mini-UI Card */}
                        <div className="relative z-10 w-[148px] shrink-0 rounded-xl bg-white/95 dark:bg-[#161b26] backdrop-blur-xs border border-[#ECE5DC] dark:border-white/10 p-2.5 shadow-sm text-[10px] font-mono space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] text-[#c2540a] dark:text-[#f8a87c] font-bold border-b border-neutral-100 dark:border-white/5 pb-1">
                            <span className="truncate">{meta.miniHeader}</span>
                            <span>{meta.miniTag}</span>
                          </div>
                          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
                            <span className="truncate">{meta.miniRow1[0]}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">{meta.miniRow1[1]}</span>
                          </div>
                          <div className="flex items-center justify-between text-[#252522] dark:text-neutral-200">
                            <span className="truncate">{meta.miniRow2[0]}</span>
                            <span className="font-bold shrink-0">{meta.miniRow2[1]}</span>
                          </div>
                          <div className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[9px] truncate">
                            {tick === 0 ? (isVi ? meta.miniStatusVi : meta.miniStatusEn) : "⚡ Live Autopilot"}
                          </div>
                        </div>

                        {/* Floating Role Pill */}
                        <div
                          className={
                            "absolute bottom-2.5 right-3 z-20 px-3 py-1 rounded-full border text-[11px] font-semibold shadow-2xs " +
                            meta.badgeStyle
                          }
                        >
                          {displayName} • {displayBadge}
                        </div>
                      </div>

                      {/* Strictly 2-Line Outcome Description (Copy Budget <= 22 words) */}
                      <p className="text-[15.3px] leading-[1.45] text-[#252522]/85 dark:text-neutral-300 font-normal px-1">
                        {isVi ? meta.conciseVi : meta.conciseEn}
                      </p>

                      {/* Compact Tool Pills */}
                      <div className="mt-3.5 flex flex-wrap gap-1.5 px-1">
                        {agent.tools.slice(0, 3).map((tool) => (
                          <span
                            key={tool}
                            className="text-[10px] font-mono bg-[#F8F3ED] dark:bg-white/5 border border-[#ECE5DC] dark:border-white/10 px-2.5 py-0.5 rounded-full text-neutral-600 dark:text-neutral-300"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Pill Hire + Spec Inspector */}
                    <div className="mt-6 pt-4 border-t border-[#ECE5DC]/70 dark:border-white/10 flex items-center justify-between px-1">
                      <button
                        type="button"
                        onClick={() => handleDeployAgent(agent)}
                        className="px-4 py-2 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        {isVi ? `Tuyển ${meta.vnName.split(" ")[0]}` : `Hire ${meta.enName.split(" ")[1]}`}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveAgentModal(agent)}
                        className="text-[13px] font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>{isVi ? "Hồ sơ kỹ thuật" : "Inspect spec"}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12">
              <MarketplaceCustomAgentBanner />
            </div>
          </>
        )}
      </div>

      {/* Spec Inspector Modal (Light & Dark Adaptive) */}
      <AnimatePresence>
        {activeAgentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-2xl rounded-3xl border border-[var(--border-card)] bg-white dark:bg-[#11151f] p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setActiveAgentModal(null)}
                className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-[#252522] dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {(() => {
                const meta = COMPANION_STAGE_META[activeAgentModal.id] || COMPANION_STAGE_META["agent-chief-of-staff"];
                const displayName = isVi ? meta.vnName : meta.enName;
                return (
                  <>
                    <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-card)]">
                      <div className="p-2 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[var(--border-card)]">
                        <AgentAvatar
                          agent={{ id: activeAgentModal.id, name: displayName }}
                          size="lg"
                          alwaysAnimate
                          overrideConfig={{ type: "blob", blob: meta.blob as any }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-[#252522] dark:text-white">{displayName}</h2>
                          <span className={"px-2.5 py-0.5 rounded-full border text-[11px] font-semibold " + meta.badgeStyle}>
                            {isVi ? meta.badgeVi : meta.badgeEn}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{activeAgentModal.roleTitle}</p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-5 text-xs">
                      <div className="p-4 rounded-2xl bg-[#F8F3ED] dark:bg-white/5 border border-[var(--border-card)] space-y-1.5">
                        <div className="font-mono text-[10px] uppercase text-[#c2540a] dark:text-[#f8a87c] font-bold">
                          {isVi ? "Cam kết đầu ra" : "Outcome Commitment"}
                        </div>
                        <p className="text-sm text-[#252522] dark:text-neutral-200 leading-relaxed">
                          {isVi ? meta.conciseVi : meta.conciseEn}
                        </p>
                      </div>

                      <div>
                        <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 mb-2">
                          {isVi ? "Công cụ & Tích hợp được cấp quyền:" : "Authorized MCP Tool Drivers:"}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeAgentModal.tools.map((tool) => (
                            <span
                              key={tool}
                              className="px-3 py-1 rounded-full bg-white dark:bg-white/5 border border-[var(--border-card)] font-mono text-[11px] text-[#252522] dark:text-neutral-200"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-[#18181b] text-slate-200 p-4 font-mono text-[11px] space-y-1.5">
                        <div className="text-[10px] text-emerald-400 font-bold mb-2">
                          ● LIVE SANDBOX RECEIPT PREVIEW
                        </div>
                        {activeAgentModal.terminalPreview.map((line, idx) => (
                          <div key={idx} className="truncate">
                            <span className="text-neutral-500 mr-2">{idx + 1}.</span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-7 pt-4 border-t border-[var(--border-card)] flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveAgentModal(null)}
                        className="px-5 py-2 rounded-full border border-[var(--border-card)] text-xs font-medium text-[#252522] dark:text-white cursor-pointer"
                      >
                        {isVi ? "Đóng" : "Close"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const target = activeAgentModal;
                          setActiveAgentModal(null);
                          handleDeployAgent(target);
                        }}
                        className="px-6 py-2 rounded-full bg-[#252522] dark:bg-white text-white dark:text-black text-xs font-semibold cursor-pointer"
                      >
                        {isVi ? `Giao việc cho ${meta.vnName}` : `Deploy ${meta.enName}`}
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {deployedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-[#18181b] px-5 py-3 text-xs text-white shadow-xl">
          <Check size={15} className="text-emerald-400 shrink-0" />
          <span>
            {isVi ? `Đang mở bàn làm việc cùng ${deployedSuccess}...` : `Launching workspace with ${deployedSuccess}...`}
          </span>
        </div>
      )}
    </div>
  );
}
