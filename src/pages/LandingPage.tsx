import { SeoHead } from "../components/SeoHead";
import { initiateSkyerSignIn } from "../services/pkceAuth";
import { authConfig } from "../config/authConfig";
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { LandingCommandPalette, appTaskUrl } from "../components/LandingCommandPalette";
import { useTranslation } from "../i18n/LanguageContext";
import {
  Terminal,
  ArrowRight,
  Shield,
  Check,
  CheckCircle2,
  ChevronDown,
  Monitor,
  Layers,
  Bot,
  Sparkles,
  Server,
  Cpu,
  Workflow,
  Globe,
  ExternalLink,
  Zap,
  Play,
  RotateCcw,
  Lock,
  Database,
  FileText,
  Search,
  Activity,
  Network,
  Clock,
  Eye,
  MousePointerClick,
  GitBranch,
  HardDrive,
} from "lucide-react";

interface MetricItem {
  label: string;
  value: string;
  status: "pass" | "neutral" | "warn";
}

interface StepItem {
  label: string;
  detail: string;
  time: string;
  icon: string;
}

interface LogItem {
  time: string;
  text: string;
  ok: boolean;
}

interface AgentRoleDef {
  id: string;
  category: "Executive" | "Finance" | "Sales" | "Support" | "HR";
  icon: any;
  title: { en: string; vi: string };
  tag: { en: string; vi: string };
  headline: { en: string; vi: string };
  promptExample: { en: string; vi: string };
  tools: string[];
  metrics: { en: MetricItem[]; vi: MetricItem[] };
  previewData: {
    file: { en: string; vi: string };
    action: { en: string; vi: string };
    steps: { en: StepItem[]; vi: StepItem[] };
    logs: { en: LogItem[]; vi: LogItem[] };
  };
}

const AGENT_ROLE_DEFS: AgentRoleDef[] = [
  {
    id: "cos",
    category: "Executive",
    icon: Sparkles,
    title: {
      en: "Chief of Staff",
      vi: "Trợ Lý Điều Hành (Chief of Staff)",
    },
    tag: {
      en: "Executive & Ops",
      vi: "Vận Hành & Chiến Lược",
    },
    headline: {
      en: "Synthesizes cross-department OKRs & board packs.",
      vi: "Tổng hợp OKR các phòng ban, chuẩn bị hồ sơ báo cáo cho Ban Giám Đốc.",
    },
    promptExample: {
      en: "Synthesize weekly KPI reports from Sales, CX, and Finance, flagging bottlenecks.",
      vi: "Tổng hợp số liệu KPI tuần từ Sales, CX và Tài chính, phát hiện điểm nghẽn cần tháo gỡ.",
    },
    tools: ["Google Workspace", "Knowledge Base KB", "Telegram Bridge", "Plan Ledger"],
    metrics: {
      en: [
        { label: "KPIs Synced", value: "28/28", status: "pass" },
        { label: "Runway", value: "18.4 mo", status: "neutral" },
        { label: "Bottlenecks", value: "1 Flagged", status: "warn" },
      ],
      vi: [
        { label: "KPIs Đồng bộ", value: "28/28", status: "pass" },
        { label: "Runway Tài chính", value: "18.4 tháng", status: "neutral" },
        { label: "Điểm nghẽn", value: "1 Cảnh báo", status: "warn" },
      ],
    },
    previewData: {
      file: {
        en: "executive-briefing // Q4 Board Sync",
        vi: "executive-briefing // Báo Cáo Họp HĐQT Q4",
      },
      action: {
        en: "OKR Synthesis",
        vi: "Tổng hợp OKR",
      },
      steps: {
        en: [
          { label: "Ingest Dept Metrics", detail: "Sales, CX, Finance synced", time: "0.4s", icon: "db" },
          { label: "Burn Rate vs ARR", detail: "Runway verified: 18.4 mo", time: "0.8s", icon: "chart" },
          { label: "Bottleneck Radar", detail: "Legal SLA delay flagged", time: "1.1s", icon: "warn" },
          { label: "Board Pack Ready", detail: "3-page PDF + citations", time: "1.5s", icon: "check" },
        ],
        vi: [
          { label: "Thu thập số liệu phòng ban", detail: "Đã đồng bộ Sales, CX, Tài chính", time: "0.4s", icon: "db" },
          { label: "Đối soát Burn Rate & ARR", detail: "Runway xác nhận: 18.4 tháng", time: "0.8s", icon: "chart" },
          { label: "Radar phát hiện điểm nghẽn", detail: "Chậm SLA xét duyệt pháp lý", time: "1.1s", icon: "warn" },
          { label: "Hồ sơ Báo cáo hoàn tất", detail: "PDF 3 trang kèm trích dẫn số liệu", time: "1.5s", icon: "check" },
        ],
      },
      logs: {
        en: [
          { time: "08:30:02", text: "Ingesting weekly departmental progress reports (Sales, CX, Finance)", ok: true },
          { time: "08:30:08", text: "Reconciling ARR growth target with operational burn rate: Runway 18.4 mo", ok: true },
          { time: "08:30:14", text: "Flagged 1 bottleneck: Enterprise procurement turnaround in Legal", ok: false },
          { time: "08:30:21", text: "Generated 3-page Executive Decision Pack with citation receipts", ok: true },
        ],
        vi: [
          { time: "08:30:02", text: "Thu thập báo cáo tiến độ tuần từ các phòng ban (Kinh doanh, CX, Tài chính)", ok: true },
          { time: "08:30:08", text: "Đối soát mục tiêu tăng trưởng ARR với tốc độ tiêu quỹ: Runway đạt 18.4 tháng", ok: true },
          { time: "08:30:14", text: "Cảnh báo 1 điểm nghẽn: Thời gian duyệt hợp đồng Doanh nghiệp tại Ban Pháp lý kéo dài", ok: false },
          { time: "08:30:21", text: "Xuất bản Hồ sơ Quyết định Ban Điều Hành 3 trang kèm biên nhận trích dẫn minh bạch", ok: true },
        ],
      },
    },
  },
  {
    id: "finance",
    category: "Finance",
    icon: Server,
    title: {
      en: "Financial Controller",
      vi: "Kiểm Soát Viên Tài Chính",
    },
    tag: {
      en: "Finance & ERP",
      vi: "Tài Chính & Kế Toán ERP",
    },
    headline: {
      en: "3-way PO/Invoice matching & TT99 tax vouchers.",
      vi: "Khớp hóa đơn 3 bên (Đơn hàng/Phiếu kho) và lập bảng kê chứng từ chuẩn TT99.",
    },
    promptExample: {
      en: "Reconcile 48 supplier invoices against PO records and stage TT99 payment vouchers.",
      vi: "Đối chiếu 48 hóa đơn nhà cung cấp với đơn hàng PO, chuẩn bị phiếu thanh toán TT99.",
    },
    tools: ["ERPCore", "Bank Feed API", "Excel AST", "PayOS"],
    metrics: {
      en: [
        { label: "Invoices", value: "48/48 Match", status: "pass" },
        { label: "Variance", value: "$0.00", status: "pass" },
        { label: "Tax Standard", value: "TT99 02-VT", status: "neutral" },
      ],
      vi: [
        { label: "Hóa đơn", value: "48/48 Khớp", status: "pass" },
        { label: "Chênh lệch", value: "0 VNĐ", status: "pass" },
        { label: "Chuẩn thuế", value: "TT99 Mẫu 02-VT", status: "neutral" },
      ],
    },
    previewData: {
      file: {
        en: "general-ledger // Cycle W42",
        vi: "general-ledger // Sổ Cái Chu Kỳ W42",
      },
      action: {
        en: "3-Way Matching",
        vi: "Đối soát 3 bên",
      },
      steps: {
        en: [
          { label: "Scan 48 Invoices", detail: "Matched against PO & GRN", time: "0.6s", icon: "search" },
          { label: "Variance Audit", detail: "0.00 VND discrepancy", time: "1.0s", icon: "check" },
          { label: "TT99 Voucher Gen", detail: "Mẫu 02-VT compiled", time: "1.4s", icon: "doc" },
          { label: "CFO Sign-Off Gate", detail: "$148,290 staged", time: "1.8s", icon: "lock" },
        ],
        vi: [
          { label: "Quét 48 Hóa đơn", detail: "Khớp hồ sơ PO & Phiếu nhập kho GRN", time: "0.6s", icon: "search" },
          { label: "Kiểm toán chênh lệch", detail: "Chênh lệch 0.00 VNĐ", time: "1.0s", icon: "check" },
          { label: "Tạo chứng từ TT99", detail: "Đã lập bảng kê Mẫu 02-VT", time: "1.4s", icon: "doc" },
          { label: "Cổng duyệt CFO", detail: "Sẵn sàng duyệt giải ngân $148,290", time: "1.8s", icon: "lock" },
        ],
      },
      logs: {
        en: [
          { time: "09:00:10", text: "Scanning 48 incoming vendor invoices against PO-2026 and GRN records", ok: true },
          { time: "09:00:15", text: "Discrepancy audit: 48/48 invoices matched within 0.00 VND tolerance", ok: true },
          { time: "09:00:22", text: "Generated tax compliance voucher Mẫu 02-VT (TT99 standard)", ok: true },
          { time: "09:00:28", text: "Voucher pack staged for CFO cryptographic approval", ok: true },
        ],
        vi: [
          { time: "09:00:10", text: "Quét 48 hóa đơn nhà cung cấp gửi về và đối soát với đơn hàng PO-2026 & phiếu nhập kho", ok: true },
          { time: "09:00:15", text: "Kiểm toán sai số: 48/48 hóa đơn khớp 100% dung sai 0.00 VNĐ", ok: true },
          { time: "09:00:22", text: "Xuất chứng từ tuân thủ hóa đơn thuế điện tử Mẫu 02-VT (chuẩn Thông tư 99)", ok: true },
          { time: "09:00:28", text: "Đóng gói hồ sơ thanh toán đưa vào Cổng Chữ Ký Số phê duyệt của Giám Đốc Tài Chính (CFO)", ok: true },
        ],
      },
    },
  },
  {
    id: "sales",
    category: "Sales",
    icon: Zap,
    title: {
      en: "B2B Sales Executive",
      vi: "Chuyên Viên Bán Hàng B2B",
    },
    tag: {
      en: "Revenue & CRM",
      vi: "Doanh Thu & CRM",
    },
    headline: {
      en: "Enriches leads, maps C-level buyers & drafts pitches.",
      vi: "Tìm kiếm dữ liệu doanh nghiệp mục tiêu, liên hệ đúng người ra quyết định và gửi chào hàng.",
    },
    promptExample: {
      en: "Screen 120 SEA logistics accounts and stage personalized outreach decks in CRM.",
      vi: "Lọc 120 doanh nghiệp logistics tiềm năng, soạn nội dung giới thiệu riêng và lưu vào CRM.",
    },
    tools: ["HubSpot CRM", "LinkedIn Graph", "Exa Search", "Mail Sequencer"],
    metrics: {
      en: [
        { label: "Qualified", value: "42 Accounts", status: "pass" },
        { label: "Intent Score", value: "94% Match", status: "pass" },
        { label: "Staged ARR", value: "$48,000", status: "neutral" },
      ],
      vi: [
        { label: "Đủ điều kiện", value: "42 Doanh nghiệp", status: "pass" },
        { label: "Điểm nhu cầu", value: "94% Khớp", status: "pass" },
        { label: "ARR Ước tính", value: "$48,000", status: "neutral" },
      ],
    },
    previewData: {
      file: {
        en: "pipeline-engine // Outbound SEA",
        vi: "pipeline-engine // Tiếp Cận Thị Trường SEA",
      },
      action: {
        en: "Lead Enrichment",
        vi: "Làm giàu dữ liệu Lead",
      },
      steps: {
        en: [
          { label: "Screen 120 Accounts", detail: "SEA logistics segment", time: "0.5s", icon: "search" },
          { label: "Buyer Signal Filter", detail: "42 VP Supply Chain found", time: "0.9s", icon: "db" },
          { label: "Bespoke Deck Gen", detail: "Tailored ROI & case study", time: "1.3s", icon: "doc" },
          { label: "CRM Deal Staged", detail: "$48k ARR pipeline synced", time: "1.7s", icon: "check" },
        ],
        vi: [
          { label: "Lọc 120 Doanh nghiệp", detail: "Phân khúc chuỗi cung ứng logistics SEA", time: "0.5s", icon: "search" },
          { label: "Phân tích tín hiệu mua", detail: "Tìm thấy 42 Phó Tổng Giám Đốc phụ trách Mua hàng", time: "0.9s", icon: "db" },
          { label: "Soạn đề xuất cá nhân hóa", detail: "Phân tích ROI & Case Study tương ứng", time: "1.3s", icon: "doc" },
          { label: "Khởi tạo Deal trên CRM", detail: "Đã đồng bộ đường ống cơ hội $48k ARR", time: "1.7s", icon: "check" },
        ],
      },
      logs: {
        en: [
          { time: "09:30:11", text: "Screened 120 target enterprise logistics accounts via verified public data", ok: true },
          { time: "09:30:19", text: "Filtered 42 accounts with active Head of Supply Chain procurement signals", ok: true },
          { time: "09:30:28", text: "Drafted hyper-personalized demo pitches in company brand tone", ok: true },
          { time: "09:30:35", text: "Created deal opportunities in CRM: $48,000 potential ARR staged", ok: true },
        ],
        vi: [
          { time: "09:30:11", text: "Sàng lọc 120 doanh nghiệp logistics mục tiêu thông qua dữ liệu doanh nghiệp đã xác thực", ok: true },
          { time: "09:30:19", text: "Lọc ra 42 tài khoản có tín hiệu tìm kiếm giải pháp chuyển đổi số từ Giám Đốc Chuỗi Cung Ứng", ok: true },
          { time: "09:30:28", text: "Soạn thư chào giải pháp được may đo riêng theo nhận diện và văn phong thương hiệu", ok: true },
          { time: "09:30:35", text: "Tạo cơ hội giao dịch trên CRM: Đồng bộ đường ống doanh thu tiềm năng $48,000 ARR", ok: true },
        ],
      },
    },
  },
  {
    id: "cx",
    category: "Support",
    icon: Shield,
    title: {
      en: "Customer Success",
      vi: "Hỗ Trợ & CSKH 24/7",
    },
    tag: {
      en: "24/7 Support",
      vi: "Hỗ Trợ Trực Tuyến 24/7",
    },
    headline: {
      en: "Autonomous ticket triage & root-cause resolution.",
      vi: "Tự động phân loại và xử lý ticket hỗ trợ, không để tồn đọng yêu cầu của khách hàng.",
    },
    promptExample: {
      en: "Triage Zendesk queue, resolve billing inquiries, and debug webhook timeouts.",
      vi: "Kiểm tra hàng đợi Zendesk, giải đáp thắc mắc hóa đơn và tra cứu sự cố kỹ thuật.",
    },
    tools: ["Zendesk CDP", "Knowledge Base KB", "Log Inspector", "Mailer"],
    metrics: {
      en: [
        { label: "Cleared", value: "14/14 Tickets", status: "pass" },
        { label: "Response SLA", value: "22 sec", status: "pass" },
        { label: "CSAT Score", value: "98.4%", status: "neutral" },
      ],
      vi: [
        { label: "Đã xử lý", value: "14/14 Tickets", status: "pass" },
        { label: "SLA Phản hồi", value: "22 giây", status: "pass" },
        { label: "Điểm hài lòng CSAT", value: "98.4%", status: "neutral" },
      ],
    },
    previewData: {
      file: {
        en: "support-queue // Zendesk Live",
        vi: "support-queue // Zendesk Trực Tuyến",
      },
      action: {
        en: "Zero-Backlog Triage",
        vi: "Xử lý hàng đợi sạch 100%",
      },
      steps: {
        en: [
          { label: "Ingest 14 Tickets", detail: "Billing & API webhooks", time: "0.3s", icon: "db" },
          { label: "KB Grounding", detail: "Matched retry spec v2.4", time: "0.7s", icon: "search" },
          { label: "Dispatch Fixes", detail: "Code snippet + receipt", time: "1.2s", icon: "doc" },
          { label: "Queue Zeroed", detail: "5/5 CSAT verified", time: "1.5s", icon: "check" },
        ],
        vi: [
          { label: "Tiếp nhận 14 Tickets", detail: "Yêu cầu hóa đơn & Lỗi API Webhook", time: "0.3s", icon: "db" },
          { label: "Đối chiếu Tri Thức KB", detail: "Khớp tài liệu kỹ thuật Retry Spec v2.4", time: "0.7s", icon: "search" },
          { label: "Gửi phản hồi kèm giải pháp", detail: "Mã mẫu + biên bản hỗ trợ xác thực", time: "1.2s", icon: "doc" },
          { label: "Hàng đợi về 0", detail: "Đánh giá CSAT 5/5 sao", time: "1.5s", icon: "check" },
        ],
      },
      logs: {
        en: [
          { time: "10:20:01", text: "Ingested 14 incoming support inquiries across web and mobile apps", ok: true },
          { time: "10:20:06", text: "Ticket #8821 (Billing receipt request): Auto-generated and dispatched", ok: true },
          { time: "10:20:12", text: "Ticket #8824 (API webhook timeout): Diagnosed retry header mismatch", ok: true },
          { time: "10:20:22", text: "CSAT satisfaction score confirmed: 5/5 stars (Queue cleared)", ok: true },
        ],
        vi: [
          { time: "10:20:01", text: "Tiếp nhận 14 yêu cầu hỗ trợ gửi đến qua web và ứng dụng di động", ok: true },
          { time: "10:20:06", text: "Ticket #8821 (Yêu cầu hóa đơn VAT): Tự động trích xuất biên lai và gửi phản hồi", ok: true },
          { time: "10:20:12", text: "Ticket #8824 (Lỗi timeout webhook API): Chẩn đoán sai lệch header thử lại retry", ok: true },
          { time: "10:20:22", text: "Điểm hài lòng khách hàng CSAT xác nhận: 5/5 sao (Hàng đợi ticket đã giải quyết dứt điểm)", ok: true },
        ],
      },
    },
  },
  {
    id: "hr",
    category: "HR",
    icon: Layers,
    title: {
      en: "HR & Talent Partner",
      vi: "Trợ Lý Nhân Sự & Tuyển Dụng",
    },
    tag: {
      en: "People Ops",
      vi: "Vận Hành Nhân Sự",
    },
    headline: {
      en: "Screens CVs, books interviews & runs onboarding.",
      vi: "Chấm điểm CV theo tiêu chí tuyển dụng, tự xếp lịch phỏng vấn và gửi hướng dẫn hội nhập.",
    },
    promptExample: {
      en: "Screen 25 Operations Director CVs and schedule top 4 interviews.",
      vi: "Lọc 25 hồ sơ ứng viên Giám đốc Vận hành, chọn ra 4 ứng viên sáng giá nhất để hẹn lịch phỏng vấn.",
    },
    tools: ["Greenhouse", "CV AST Parser", "Calendar MCP", "Handbook KB"],
    metrics: {
      en: [
        { label: "Screened", value: "25 Dossiers", status: "neutral" },
        { label: "Shortlisted", value: "Top 4 (92%+)", status: "pass" },
        { label: "Time Saved", value: "14.5 hrs", status: "pass" },
      ],
      vi: [
        { label: "Hồ sơ đã duyệt", value: "25 Ứng viên", status: "neutral" },
        { label: "Vào phỏng vấn", value: "Top 4 (92%+)", status: "pass" },
        { label: "Thời gian tiết kiệm", value: "14.5 giờ", status: "pass" },
      ],
    },
    previewData: {
      file: {
        en: "talent-hub // Q4 Hiring",
        vi: "talent-hub // Kế Hoạch Tuyển Dụng Q4",
      },
      action: {
        en: "CV Competency Match",
        vi: "Đối soát năng lực ứng viên",
      },
      steps: {
        en: [
          { label: "Parse 25 Resumes", detail: "Ops Director role", time: "0.4s", icon: "doc" },
          { label: "Competency Score", detail: "ERP + Multi-cloud rubric", time: "0.9s", icon: "chart" },
          { label: "Shortlist Top 4", detail: "92%+ objective match", time: "1.3s", icon: "check" },
          { label: "Calendar Sync", detail: "Invites & scorecards sent", time: "1.6s", icon: "check" },
        ],
        vi: [
          { label: "Phân tích 25 Hồ sơ CV", detail: "Vị trí Giám Đốc Vận Hành", time: "0.4s", icon: "doc" },
          { label: "Chấm điểm năng lực", detail: "Khung năng lực ERP & Vận hành Đa đám mây", time: "0.9s", icon: "chart" },
          { label: "Chọn Top 4 ứng viên", detail: "Điểm tương thích khách quan trên 92%", time: "1.3s", icon: "check" },
          { label: "Đồng bộ lịch phỏng vấn", detail: "Đã gửi thư mời kèm biểu mẫu đánh giá", time: "1.6s", icon: "check" },
        ],
      },
      logs: {
        en: [
          { time: "10:05:02", text: "Parsed 25 applicant CVs for Operations Director position", ok: true },
          { time: "10:05:12", text: "Evaluated core competencies: ERP logistics, leadership, multi-cloud", ok: true },
          { time: "10:05:19", text: "Selected top 4 candidates with 92%+ objective match scores", ok: true },
          { time: "10:05:25", text: "Dispatched calendar invitations and interview scorecards", ok: true },
        ],
        vi: [
          { time: "10:05:02", text: "Phân tích cấu trúc 25 hồ sơ CV ứng tuyển cho vị trí Giám Đốc Vận Hành", ok: true },
          { time: "10:05:12", text: "Đánh giá các năng lực cốt lõi: Quản trị ERP logistics, năng lực lãnh đạo, hạ tầng đám mây", ok: true },
          { time: "10:05:19", text: "Lựa chọn danh sách 4 ứng viên hàng đầu có độ phù hợp khách quan từ 92% trở lên", ok: true },
          { time: "10:05:25", text: "Gửi thư mời phỏng vấn tự động kèm phiếu đánh giá tiêu chuẩn cho Hội Đồng Tuyển Dụng", ok: true },
        ],
      },
    },
  },
];

const PRICING_PLANS = [
  {
    name: "Premium",
    price: "$30",
    period: { en: "/ mo", vi: "/ tháng" },
    badge: { en: "Starter", vi: "Khởi đầu" },
    description: {
      en: "1 dedicated Linux VM & daily workflow automation.",
      vi: "Dành cho cá nhân hoặc nhóm nhỏ bắt đầu tự động hóa công việc hàng ngày.",
    },
    features: {
      en: [
        "Persistent Linux container (/app/working)",
        "Headless Chromium CDP browser",
        "Scheduled cron routines",
        "Web, Desktop & Telegram access",
      ],
      vi: [
        "Container Linux bền bỉ (/app/working)",
        "Máy tính độc lập (Linux & Trình duyệt thật)",
        "Lên lịch quy trình tự động định kỳ (cron)",
        "Truy cập đồng thời qua Web, Desktop & Telegram",
      ],
    },
  },
  {
    name: "Super",
    price: "$100",
    period: { en: "/ mo", vi: "/ tháng" },
    badge: { en: "Most Popular", vi: "Phổ biến nhất" },
    description: {
      en: "Parallel multi-bot teams & 3.5x compute quota.",
      vi: "Nhiều Bot phối hợp cùng lúc, xử lý công việc liên phòng ban với hạn mức gấp 3.5 lần.",
    },
    features: {
      en: [
        "Everything in Premium (3.5x quota)",
        "Multi-bot ACP supervision tree",
        "Priority frontier model routing",
        "Deterministic execution receipts",
      ],
      vi: [
        "Bao gồm toàn bộ tính năng gói Premium (3.5x tài nguyên)",
        "Cây giám sát đa tác nhân phối hợp (ACP)",
        "Ưu tiên định tuyến các mô hình AI đỉnh cao (frontier)",
        "Biên nhận thực thi nghiệm thu minh bạch có mã hóa",
      ],
    },
  },
  {
    name: "Ultra",
    price: "$200",
    period: { en: "/ mo", vi: "/ tháng" },
    badge: { en: "Scale", vi: "Mở rộng" },
    description: {
      en: "12x compute, IAM360 governance & dedicated storage.",
      vi: "Hạn mức điện toán gấp 12 lần, phân quyền bảo mật cấp doanh nghiệp và lưu trữ riêng.",
    },
    features: {
      en: [
        "Everything in Super (12x quota)",
        "Multi-tenant IAM360 guardrails",
        "Dedicated NVMe workspace volume",
        "Earliest frontier model access",
      ],
      vi: [
        "Bao gồm toàn bộ tính năng gói Super (12x tài nguyên)",
        "Khung quản trị phân quyền đa tổ chức IAM360",
        "Ổ cứng NVMe chuyên dụng lưu trữ không gian làm việc",
        "Được cấp quyền tiếp cận sớm nhất các mô hình AI mới nhất",
      ],
    },
  },
  {
    name: "On-Premise",
    price: { en: "Custom", vi: "Theo yêu cầu" },
    period: { en: "Sovereign", vi: "Chủ quyền" },
    badge: { en: "Air-Gapped", vi: "Cô lập hoàn toàn" },
    description: {
      en: "100% self-hosted on your hardware via App360.",
      vi: "Triển khai độc lập 100% trên phần cứng máy chủ của doanh nghiệp qua App360.",
    },
    features: {
      en: [
        "1-Click App360 K8s / Bare-metal deploy",
        "Local GPU inference (vLLM / Ollama)",
        "Zero external egress (Decree 13 / GDPR)",
        "Dedicated SLA & custom MCP drivers",
      ],
      vi: [
        "Triển khai 1-Click trên K8s hoặc máy chủ vật lý qua App360",
        "Chạy Self-hosted Model trên GPU nội bộ (vLLM / Ollama)",
        "Không truyền dữ liệu ra Internet (Tuân thủ Nghị định 13 & GDPR)",
        "Cam kết SLA chuyên biệt & xây dựng MCP driver tùy chỉnh",
      ],
    },
  },
];

const FAQS = [
  {
    q: {
      en: "Can Skyer run 100% On-Premise without internet egress?",
      vi: "Doanh nghiệp có thể cài đặt Skyer chạy hoàn toàn nội bộ mà không cần ra Internet không?",
    },
    a: {
      en: "Yes. Skyer Enterprise deploys inside your private data center via App360 using Docker or Kubernetes, connecting directly to local vLLM/Ollama GPUs and intranet ERPs with zero external traffic.",
      vi: "Hoàn toàn được. Bản Skyer Doanh nghiệp được cài thẳng vào máy chủ hoặc cụm Kubernetes của bạn qua App360. Hệ thống kết nối trực tiếp với GPU nội bộ (vLLM/Ollama) và các phần mềm ERP sẵn có, cam kết tuyệt đối không một byte dữ liệu nào ra khỏi tường lửa công ty.",
    },
  },
  {
    q: {
      en: "How is Skyer different from chat wrappers?",
      vi: "Skyer khác biệt như thế nào so với các ứng dụng bọc giao diện chat thông thường?",
    },
    a: {
      en: "Each Skyer Bot owns a persistent Linux computer, headless Chromium browser, and MCP tool drivers. They execute real work in parallel 24/7 and return cryptographic verification receipts.",
      vi: "Khác với các ứng dụng chỉ trả lời câu hỏi, mỗi Bot Skyer sở hữu một máy tính Linux riêng, có trình duyệt web và công cụ chuyên môn. Bot tự tay thao tác trên phần mềm của bạn, làm việc độc lập 24/7 và chỉ báo cáo khi đã có kết quả kiểm tra thực tế.",
    },
  },
  {
    q: {
      en: "How do Human Approval Gates work?",
      vi: "Cổng Phê Duyệt Của Con Người (Human Approval Gate) hoạt động ra sao?",
    },
    a: {
      en: "Read/research actions run autonomously. Before any production write (bank payout, DB mutation, external email), Skyer pauses and sends an interactive approval card to your web console or Telegram.",
      vi: "Các việc đọc, tìm kiếm số liệu hay tổng hợp thông tin sẽ do Bot tự động làm. Riêng những thao tác nhạy cảm như chuyển tiền, sửa đổi cơ sở dữ liệu hoặc gửi email quan trọng, Bot sẽ luôn dừng lại hỏi ý kiến bạn trên Web hoặc Telegram trước khi bấm nút.",
    },
  },
  {
    q: {
      en: "Do multiple Bots share context and files?",
      vi: "Các Bot có thể chia sẻ ngữ cảnh công việc và tệp dữ liệu với nhau không?",
    },
    a: {
      en: "Yes. Bots in your workspace share a unified /app/working volume, browser sessions, and ReMe vector memory (MEMORY.md), allowing seamless task handoffs without re-prompting.",
      vi: "Có. Các Bot trong cùng không gian làm việc dùng chung ổ cứng, phiên đăng nhập trình duyệt và bộ nhớ quy trình (MEMORY.md). Nhờ vậy, một Bot hoàn thành bước này có thể chuyển tiếp ngay cho Bot khác mà bạn không cần nhắc lại ngữ cảnh.",
    },
  },
];

export function LandingPage() {
  const { t, language } = useTranslation();
  const isVi = language === "vi";
  const navigate = useNavigate();

  // Map bilingual role definitions based on the active language
  const roles = useMemo(() => {
    return AGENT_ROLE_DEFS.map((def) => ({
      id: def.id,
      category: def.category,
      icon: def.icon,
      title: isVi ? def.title.vi : def.title.en,
      tag: isVi ? def.tag.vi : def.tag.en,
      headline: isVi ? def.headline.vi : def.headline.en,
      promptExample: isVi ? def.promptExample.vi : def.promptExample.en,
      tools: def.tools,
      metrics: isVi ? def.metrics.vi : def.metrics.en,
      previewData: {
        file: isVi ? def.previewData.file.vi : def.previewData.file.en,
        action: isVi ? def.previewData.action.vi : def.previewData.action.en,
        steps: isVi ? def.previewData.steps.vi : def.previewData.steps.en,
        logs: isVi ? def.previewData.logs.vi : def.previewData.logs.en,
      },
    }));
  }, [isVi]);

  // Interactive States
  const [selectedRoleGroup, setSelectedRoleGroup] = useState<string>("All");
  const [activeRoleId, setActiveRoleId] = useState<string>("cos");
  const activeRole = useMemo(() => {
    return roles.find((r) => r.id === activeRoleId) || roles[0];
  }, [roles, activeRoleId]);

  const [visibleLogs, setVisibleLogs] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [heroTask, setHeroTask] = useState("");
  const [hasSession, setHasSession] = useState(false);

  // Live Interactive Simulation States
  const [deployMode, setDeployMode] = useState<"onprem" | "cloud">("onprem");
  const [approvalState, setApprovalState] = useState<"pending" | "approved" | "executing">("pending");
  const [activeRoutineStep, setActiveRoutineStep] = useState<number>(0);
  const [activeBrowserStep, setActiveBrowserStep] = useState<number>(0);
  const [activeAcpStep, setActiveAcpStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const roleScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    setHasSession(!!token);
  }, []);

  // 1. Role Workbench Step & Log Animator
  useEffect(() => {
    const total = activeRole.previewData.logs.length;
    setVisibleLogs(0);
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setVisibleLogs(n);
      if (n >= total) window.clearInterval(timer);
    }, 550);
    return () => window.clearInterval(timer);
  }, [activeRole, replayKey]);

  // 2. Autonomous Routine & Browser & ACP Cyclic Animators
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRoutineStep((prev) => (prev + 1) % 4);
      setActiveBrowserStep((prev) => (prev + 1) % 4);
      setActiveAcpStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => window.clearInterval(timer);
  }, []);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signIn").catch(console.error);
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signUp").catch(console.error);
  };

  const selectRoleById = (id: string) => {
    setActiveRoleId(id);
  };

  const submitHeroTask = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(appTaskUrl(heroTask));
  };

  const triggerApproveDemo = () => {
    setApprovalState("executing");
    setTimeout(() => {
      setApprovalState("approved");
    }, 900);
  };

  // Palette roles formatted for command menu
  const paletteRoles = useMemo(() => {
    return roles.map((r) => ({
      id: r.id,
      title: r.title,
      promptExample: r.promptExample,
    }));
  }, [roles]);

  return (
    <div className="pt-16 overflow-x-hidden bg-[var(--bg-page)] text-[var(--text-primary)] selection:bg-[#f8a87c]/30 selection:text-white">
      <SeoHead
        title={
          isVi
            ? "Skyer — Đồng nghiệp AI Tự hành cho Doanh nghiệp (Cloud & On-Premise)"
            : "Skyer — Autonomous AI Teammates & AgentCore Workforce Platform"
        }
        description={
          isVi
            ? "Mỗi nhân viên AI Skyer sở hữu một máy trạm Linux riêng (/app/working), tự thao tác trình duyệt thật, kết nối công cụ nội bộ và ghi nhớ công việc dài hạn. Triển khai linh hoạt trên Cloud hoặc 100% On-Premise qua App360."
            : "Every Skyer AI teammate owns a dedicated Linux container, headless Chromium browser, MCP tool drivers, and ReMe vector memory. Deploy on Managed Cloud or 100% Air-Gapped On-Premise via App360."
        }
        keywords="Skyer, Agent360, AI Employees, Autonomous Agents, AgentCore, Multi-Agent ACP, On-Premise AI, App360, AI Workforce, Vietnam Enterprise AI"
        canonicalPath="/"
        aeoSummary={{
          question: isVi ? "Skyer là gì và hoạt động như thế nào?" : "What is Skyer and how does it work?",
          directAnswer: isVi
            ? "Skyer là nền tảng lực lượng lao động AI doanh nghiệp được xây dựng trên AgentCore Kernel. Hệ thống cung cấp các nhân viên AI tự hành—mỗi nhân viên sở hữu một máy trạm Linux riêng biệt (/app/working), máy tính độc lập có trình duyệt thật, kết nối công cụ MCP và bộ nhớ vector ReMe 2 tầng—có khả năng làm việc 24/7 trên Cloud hoặc On-Premise cô lập hoàn toàn qua App360."
            : "Skyer is an enterprise AI workforce platform built on the AgentCore Kernel. It provisions autonomous AI employees—each equipped with a rootless Linux computer (/app/working), headless Chromium CDP browser, MCP tool integrations, and dual-tier ReMe vector memory—capable of collaborating 24/7 on Managed Cloud or 100% Air-Gapped On-Premise via App360.",
          keyFacts: isVi
            ? [
                "Kiến trúc: AgentCore Kernel v2.4 với container Linux rootless và cơ chế cách ly mạng eBPF.",
                "Các vị trí chuyên trách: Chánh Văn Phòng (CoS), Kiểm Soát Viên Tài Chính (đối soát hóa đơn 3 bên & chứng từ TT99), Chuyên Viên Bán Hàng B2B, Hỗ Trợ Khách Hàng 24/7, Đối Tác Tuyển Dụng Nhân Sự.",
                "Hình thức triển khai: Cloud trọn gói hoặc 100% On-Premise cô lập mạng (Air-Gapped) qua App360 (tuân thủ Nghị định 13/NĐ-CP, HIPAA, GDPR).",
                "Tiêu chuẩn nghiệm thu: Triết lý No-Fake-Done nghiêm ngặt, chỉ hoàn thành khi có mã trả về 0, HTTP 200 OK hoặc biên nhận hash DOM thực tế.",
              ]
            : [
                "Architecture: AgentCore Kernel v2.4 with rootless Linux containers and eBPF network isolation.",
                "Roles: Chief of Staff, Financial Controller (TT99 & ERPCore 3-way matching), B2B Sales Executive, Customer Success Lead, HR & Talent Partner.",
                "Deployment: Turnkey Managed Cloud ($30-$200/mo) or 100% Sovereign Air-Gapped On-Premise via App360 (compliant with Decree 13/ND-CP, HIPAA, GDPR).",
                "Verification: Strict No-Fake-Done policy requiring exit code 0, HTTP 200 OK, or visual DOM receipt hashes.",
              ],
        }}
      />
      <LandingCommandPalette roles={paletteRoles} onSelectRole={selectRoleById} />

      {/* 1. Compact Status Telemetry Bar */}
      <div className="border-b border-neutral-200/80 dark:border-[var(--border-subtle)] bg-slate-50/70 dark:bg-white/[0.015] backdrop-blur-md px-4 py-2 text-center text-xs text-neutral-600 dark:text-neutral-400">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f8a87c] shrink-0 animate-pulse" />
          <strong className="font-medium text-neutral-900 dark:text-white flex items-center gap-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] to-amber-400 font-bold">
              Skyer
            </span>
            <span>{isVi ? "Nền tảng Đồng nghiệp AI Tự hành" : "Autonomous AI Workforce"}</span>
          </strong>
          <span className="text-neutral-400 dark:text-neutral-600">•</span>
          <span className="font-mono text-[11px] bg-neutral-200/70 dark:bg-white/[0.05] text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-full">
            "Managed Cloud & 100% On-Premise"
          </span>
          <a
            href="#on-premise"
            className="font-medium text-[#f8a87c] hover:underline inline-flex items-center gap-0.5 ml-1"
          >
            <span>{isVi ? "Kiến trúc" : "Architecture"}</span>
            <ArrowRight size={11} />
          </a>
        </div>
      </div>

      {/* 2. Hero Section: Punchy Headline + Interactive Live Task Router */}
      <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-neutral-200 dark:border-[var(--border-subtle)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] md:w-[860px] h-[300px] bg-[#f8a87c]/[0.07] blur-[110px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Live Kernel Pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-[11px] font-mono text-neutral-600 dark:text-neutral-300 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AGENTCORE KERNEL v2.4</span>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <span className="text-[#f8a87c] font-semibold">{isVi ? "NGHIỆM THU THỰC TẾ" : "NO FAKE DONE"}</span>
          </motion.div>

          <h1 className="font-newsreader text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-neutral-900 dark:text-white leading-[1.12] max-w-4xl mx-auto">
            <span className="block sm:inline">
              {isVi ? "Làm quen với " : "Meet "}
              <span className="relative inline-block font-semibold">
                <span className="absolute -inset-1 rounded-2xl bg-[#f8a87c]/25 blur-xl pointer-events-none -z-10" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 drop-shadow-[0_0_30px_rgba(248,168,124,0.4)]">
                  Skyer
                </span>
              </span>
              .
            </span>{" "}
            <span className="block mt-1 sm:mt-1.5 text-balance">
              {isVi ? (
                <>
                  <span className="whitespace-nowrap">Đồng nghiệp AI</span>{" "}
                  <span className="whitespace-nowrap">làm được</span>{" "}
                  <span className="whitespace-nowrap">việc thật.</span>
                </>
              ) : (
                <>
                  <span className="whitespace-nowrap">AI teammates</span>{" "}
                  <span>that finish</span>{" "}
                  <span className="whitespace-nowrap">the work.</span>
                </>
              )}
            </span>
          </h1>

          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono text-neutral-600 dark:text-neutral-400">
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300/40 dark:border-white/5">
              {isVi ? "Máy tính Linux riêng" : "Dedicated Linux VM"}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300/40 dark:border-white/5">
              {isVi ? "Trình duyệt tự động" : "Headless Browser"}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300/40 dark:border-white/5">
              {isVi ? "Bộ nhớ dài hạn" : "Persistent Memory"}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-200/60 dark:bg-white/5 border border-neutral-300/40 dark:border-white/5 text-[#f8a87c]">
              {isVi ? "Nghiệm thu 24/7" : "Verifiable Receipts"}
            </span>
          </div>

          {/* Interactive Live Command Dispatcher */}
          <form
            onSubmit={submitHeroTask}
            className="mt-8 sm:mt-10 mx-auto max-w-2xl rounded-2xl border border-neutral-200 dark:border-white/[0.12] bg-white dark:bg-[#0b0d12] p-2 text-left focus-within:border-[#f8a87c] shadow-lg dark:shadow-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
                <Terminal size={16} className="text-[#f8a87c] shrink-0" />
                <input
                  id="hero-task"
                  value={heroTask}
                  onChange={(e) => setHeroTask(e.target.value)}
                  placeholder={
                    isVi
                      ? "Giao việc cho Bot: Đối soát 48 hóa đơn, xử lý ticket Zendesk, lọc hồ sơ ứng viên..."
                      : "Assign a real task: Reconcile 48 invoices, triage Zendesk queue..."
                  }
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none font-sans"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#f8a87c] px-5 text-xs sm:text-sm font-semibold text-black hover:bg-[#f5935f] transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <span>{isVi ? "Giao việc ngay" : "Dispatch Bot"}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick Interactive Role Presets */}
            <div className="flex flex-wrap items-center gap-1.5 px-2 pt-2 pb-1 border-t border-neutral-100 dark:border-white/[0.06] mt-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400 mr-1">
                {isVi ? "Mẫu thử nhanh:" : "Presets:"}
              </span>
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setHeroTask(r.promptExample);
                    setActiveRoleId(r.id);
                  }}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition-all cursor-pointer ${
                    heroTask === r.promptExample
                      ? "bg-[#f8a87c]/20 border-[#f8a87c] text-[#f8a87c] font-semibold"
                      : "border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/[0.02] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </form>

          {/* Animated Live Routing Simulation when typing or selecting a preset */}
          <AnimatePresence mode="wait">
            <motion.div
              key={heroTask || "default-flow"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-4 mx-auto max-w-2xl rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50/90 dark:bg-[#0d1017]/90 px-4 py-3 text-left font-mono text-[11px] shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {"ACP ROUTER:"}
                  </span>
                  <span className="text-neutral-900 dark:text-white font-semibold">
                    {heroTask.toLowerCase().includes("hóa đơn") || heroTask.toLowerCase().includes("invoice") || heroTask.toLowerCase().includes("tài chính") || heroTask.toLowerCase().includes("finance")
                      ? (isVi ? "Kiểm Soát Viên Tài Chính" : "Financial Controller")
                      : heroTask.toLowerCase().includes("zendesk") || heroTask.toLowerCase().includes("ticket") || heroTask.toLowerCase().includes("hỗ trợ")
                      ? (isVi ? "Hỗ Trợ & CSKH 24/7" : "Customer Success")
                      : heroTask.toLowerCase().includes("sales") || heroTask.toLowerCase().includes("bán hàng") || heroTask.toLowerCase().includes("sea")
                      ? (isVi ? "Chuyên Viên Bán Hàng B2B" : "B2B Sales Executive")
                      : heroTask.toLowerCase().includes("cv") || heroTask.toLowerCase().includes("tuyển dụng") || heroTask.toLowerCase().includes("hire")
                      ? (isVi ? "Tuyển Dụng & Nhân Sự" : "HR & Talent Partner")
                      : activeRole.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {"SANDBOX: /app/working"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f8a87c]/15 text-[#f8a87c] border border-[#f8a87c]/30">
                    {isVi ? "HUMAN GATE: SẴN SÀNG" : "HUMAN GATE: ARMED"}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Primary Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {hasSession ? (
              <Link
                to="/app"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-7 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.3)]"
              >
                <span>{t("hero.launchApp")}</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSignUp}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-7 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.3)] cursor-pointer"
                >
                  <span>{isVi ? "Bắt đầu dùng thử miễn phí" : "Start Free Workspace"}</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.08] px-6 text-xs sm:text-sm font-medium text-neutral-800 dark:text-white transition-all cursor-pointer"
                >
                  {t("nav.signIn")}
                </button>
              </>
            )}
            <Link
              to="/marketplace"
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/70 dark:bg-white/[0.02] hover:border-[#f8a87c]/50 px-5 text-xs font-mono text-neutral-600 dark:text-neutral-300 transition-all"
            >
              <Layers size={13} className="text-[#f8a87c]" />
              <span>{isVi ? "Chợ Nhân viên AI" : "Role Marketplace"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Section #bots: Interactive AI Employee Workbench */}
      <section id="bots" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c] mb-2">
                <Bot size={13} />
                <span>ROLE WORKBENCH SIMULATOR</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
                {isVi ? "Chọn vị trí nhân sự cần giao việc" : "Specialized corporate roles"}
              </h2>
            </div>

            {/* Lean Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: "All", en: "All", vi: "Tất cả" },
                { id: "Executive", en: "Executive", vi: "Điều hành" },
                { id: "Finance", en: "Finance", vi: "Tài chính" },
                { id: "Sales", en: "Sales", vi: "Kinh doanh" },
                { id: "Support", en: "Support", vi: "CSKH" },
                { id: "HR", en: "HR", vi: "Nhân sự" },
              ].map((grp) => {
                const isSelected = selectedRoleGroup === grp.id;
                return (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoleGroup(grp.id);
                      const matching = roles.filter((r) => grp.id === "All" || r.category === grp.id);
                      if (matching.length > 0 && !matching.some((m) => m.id === activeRoleId)) {
                        setActiveRoleId(matching[0].id);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#f8a87c] text-black font-bold shadow-xs"
                        : "bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5"
                    }`}
                  >
                    {isVi ? grp.vi : grp.en}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Selector Bar */}
          <div
            ref={roleScrollRef}
            className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar"
          >
            {roles.filter((role) => selectedRoleGroup === "All" || role.category === selectedRoleGroup).map((role) => {
              const active = role.id === activeRole.id;
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRoleId(role.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap border ${
                    active
                      ? "bg-[#f8a87c]/15 text-[#f8a87c] border-[#f8a87c]/40 dark:bg-white dark:text-black dark:border-white font-semibold shadow-sm"
                      : "bg-white dark:bg-[#0b0e14] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/[0.08] border-neutral-200 dark:border-[var(--border-subtle)]"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{role.title}</span>
                </button>
              );
            })}
          </div>

          {/* Visual Workbench Grid: Left = Animated Step Pipeline, Right = Live Execution Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mt-2">
            {/* Left: Visual Workflow Pipeline Card */}
            <div className="lg:col-span-5 rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-5 sm:p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/25 px-2.5 py-0.5 rounded-full font-semibold">
                    {activeRole.tag}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isVi ? "Trực tuyến" : "Online"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{activeRole.title}</h3>

                {/* Animated Visual Step Pipeline */}
                <div className="mt-5 space-y-2.5">
                  {activeRole.previewData.steps.map((st, idx) => {
                    const isDone = idx < visibleLogs;
                    const isCurrent = idx === visibleLogs;
                    return (
                      <motion.div
                        key={`${activeRole.id}-step-${idx}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                          isDone
                            ? "bg-emerald-500/[0.04] border-emerald-500/25 text-neutral-900 dark:text-white"
                            : isCurrent
                            ? "bg-[#f8a87c]/10 border-[#f8a87c]/40 text-neutral-900 dark:text-white"
                            : "bg-slate-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/5 text-neutral-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`h-6 w-6 rounded-md flex items-center justify-center text-[11px] font-mono shrink-0 ${
                              isDone
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : isCurrent
                                ? "bg-[#f8a87c] text-black font-bold animate-pulse"
                                : "bg-neutral-200 dark:bg-white/5 text-neutral-500"
                            }`}
                          >
                            {isDone ? <Check size={12} /> : idx + 1}
                          </div>
                          <div className="truncate">
                            <div className="font-semibold text-xs truncate">{st.label}</div>
                            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{st.detail}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 shrink-0 ml-2">{st.time}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Authorized MCP Drivers */}
              <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-[var(--border-subtle)]">
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded text-neutral-700 dark:text-neutral-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Execution Stream + Telemetry Receipt HUD */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl overflow-hidden font-mono text-xs flex flex-col justify-between">
              <div>
                {/* Window Chrome */}
                <div className="h-10 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="ml-1.5 text-[11px] text-neutral-700 dark:text-neutral-300 truncate">
                      {activeRole.previewData.file}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setReplayKey((k) => k + 1)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-white/[0.06] hover:bg-[#f8a87c]/20 text-neutral-700 dark:text-neutral-300 text-[10px] cursor-pointer transition-colors"
                    >
                      <RotateCcw size={10} />
                      <span>{isVi ? "Chạy lại" : "Replay"}</span>
                    </button>
                  </div>
                </div>

                {/* Prompt Bar */}
                <div className="px-5 py-3 bg-slate-100/60 dark:bg-white/[0.02] border-b border-neutral-200 dark:border-white/5 flex items-center justify-between gap-2">
                  <div className="truncate text-[11px] text-neutral-700 dark:text-neutral-300 font-sans">
                    <span className="font-mono text-[#f8a87c] font-semibold mr-2">{isVi ? "Tác vụ:" : "Task:"}</span>
                    “{activeRole.promptExample}”
                  </div>
                </div>

                {/* Animated Execution Stream */}
                <div className="p-5 space-y-2.5 min-h-[185px]">
                  {activeRole.previewData.logs.slice(0, visibleLogs).map((log, idx) => (
                    <motion.div
                      key={`${activeRole.id}-${replayKey}-${idx}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 leading-relaxed text-[11px]"
                    >
                      <span className="text-neutral-400 dark:text-neutral-600 select-none shrink-0">{log.time}</span>
                      <span className="text-emerald-500 shrink-0">✓</span>
                      <span className={log.ok ? "text-neutral-800 dark:text-neutral-200" : "text-amber-600 dark:text-amber-400 font-semibold"}>
                        {log.text}
                      </span>
                    </motion.div>
                  ))}
                  {visibleLogs < activeRole.previewData.logs.length && (
                    <div className="flex items-center gap-2 text-neutral-400 pt-1">
                      <span className="inline-block h-3 w-1.5 bg-[#f8a87c] animate-pulse" />
                      <span>{isVi ? "Bot đang thao tác công cụ trong môi trường an toàn..." : "Executing tool call in sandbox..."}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Visual Metric Cards Footer */}
              <div className="bg-slate-50 dark:bg-[#0b0e14] border-t border-neutral-200 dark:border-[var(--border-subtle)] p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {activeRole.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 flex items-center gap-2"
                    >
                      <span className="text-[10px] text-neutral-500">{m.label}:</span>
                      <span className="text-[11px] font-bold text-neutral-900 dark:text-white">{m.value}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to={appTaskUrl(activeRole.promptExample)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#f8a87c] text-black font-sans font-semibold text-xs hover:bg-[#f5935f] transition-all shrink-0"
                >
                  <span>{t("roles.tryTask")}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section #on-premise: Interactive Topology Switcher */}
      <section
        id="on-premise"
        className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-gradient-to-b from-slate-100/60 via-slate-50 to-slate-100/60 dark:from-[#05070a] dark:via-[#090c13] dark:to-[#05070a] relative overflow-hidden"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/25 px-3 py-1 rounded-full mb-3">
                <Server size={12} />
                <span>HYBRID DEPLOYMENT TOPOLOGY</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal text-balance leading-[1.15]">
                {isVi ? (
                  <>
                    <span className="whitespace-nowrap">100% On-Premise</span>{" "}
                    <span className="whitespace-nowrap">qua App360</span>{" "}
                    <span>hoặc </span>
                    <span className="whitespace-nowrap">Skyer Cloud.</span>
                  </>
                ) : (
                  "100% Air-Gapped On-Premise or Instant Cloud."
                )}
              </h2>
            </div>

            {/* Interactive Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-neutral-200/80 dark:bg-white/[0.05] border border-neutral-300/80 dark:border-white/10 self-start">
              <button
                type="button"
                onClick={() => setDeployMode("onprem")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  deployMode === "onprem"
                    ? "bg-[#f8a87c] text-black font-bold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Shield size={13} />
                <span>On-Premise (App360)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeployMode("cloud")}
                className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  deployMode === "cloud"
                    ? "bg-[#f8a87c] text-black font-bold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Globe size={13} />
                <span>{isVi ? "Skyer Đám Mây (Cloud)" : "Managed Cloud"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Animated Architecture Diagram */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0c1018] p-6 sm:p-8 shadow-md">
            <AnimatePresence mode="wait">
              {deployMode === "onprem" ? (
                <motion.div
                  key="onprem-diagram"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c]">
                        <Lock size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          {isVi
                            ? "Mạng Nội Bộ Doanh Nghiệp / Trung Tâm Dữ Liệu Riêng (Không rò rỉ dữ liệu)"
                            : "Corporate Intranet / Private Data Center (Zero Egress)"}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500">
                          {isVi
                            ? "Tuân thủ chặt chẽ Nghị định 13/NĐ-CP, tiêu chuẩn HIPAA & ISO-27001"
                            : "Compliant with Decree 13/ND-CP, HIPAA, ISO-27001"}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                      {isVi ? "TƯỜNG LỬA CÔ LẬP HOÀN TOÀN" : "AIR-GAPPED FIREWALL ACTIVE"}
                    </span>
                  </div>

                  {/* Visual Node Flow */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Node 1: App360 Control Plane */}
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#f8a87c]">
                        <span>01. APP360 ORCHESTRATOR</span>
                        <Server size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {isVi ? "App360 Sovereign Node" : "App360 Sovereign Node"}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {isVi
                          ? "Triển khai 1-Click Helm / Docker, giám sát sức khỏe & cách ly eBPF"
                          : "1-Click Helm / Docker rollout, health guardian & eBPF isolation"}
                      </div>
                    </div>

                    {/* Node 2: AgentCore Runtime + Local GPU */}
                    <div className="p-4 rounded-xl border-2 border-[#f8a87c]/50 bg-[#f8a87c]/[0.05] space-y-2 relative">
                      <div className="flex items-center justify-between text-xs font-mono text-[#f8a87c]">
                        <span>02. SELF-HOSTED LOCAL MODELS</span>
                        <Cpu size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">vLLM / Ollama / Qwen 72B</div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                        {isVi
                          ? "Cụm GPU nội bộ (Self-hosted) + ReMe Vector DB lưu trữ tại chỗ"
                          : "On-premise GPU cluster + local ReMe Vector DB"}
                      </div>
                    </div>

                    {/* Node 3: Internal Enterprise Systems */}
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
                        <span>03. INTRANET TOOLS & MCP</span>
                        <Database size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">SAP • ERPCore • GitLab</div>
                      <div className="text-[11px] text-neutral-500">
                        {isVi
                          ? "Gọi MCP trực tiếp qua mạng LAN — 0 byte ra khỏi máy chủ của bạn"
                          : "Direct LAN MCP execution — 0 bytes leave your servers"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-[#f8a87c]" /> {isVi ? "BYOK & Lưu trữ Nội bộ" : "BYOK & Local Storage"}</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-[#f8a87c]" /> {isVi ? "Container an toàn không cần quyền root" : "Rootless Containers"}</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-[#f8a87c]" /> {isVi ? "Nhật ký kiểm toán đầy đủ" : "Full Audit Ledger"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href="/skyer-enterprise-whitepaper.md"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10"
                      >
                        <FileText size={12} className="text-[#f8a87c]" />
                        <span>{isVi ? "Whitepaper" : "Whitepaper"}</span>
                      </a>
                      <a
                        href="https://app360.space/apps/skyer"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#f8a87c] text-black px-4 py-1.5 rounded-lg hover:bg-[#f5935f]"
                      >
                        <span>{isVi ? "Cài đặt qua App360" : "Deploy via App360"}</span>
                        <ArrowRight size={12} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="cloud-diagram"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500">
                        <Globe size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-neutral-900 dark:text-white">
                          {isVi ? "Skyer Đám Mây Quản Trị (Kích hoạt ngay trong 10s)" : "Skyer Managed Cloud (Instant Turnkey)"}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500">
                          {isVi ? "Sẵn sàng trong 10 giây • Máy ảo MicroVM cô lập theo người dùng" : "Ready in 10 seconds • Per-user microVM isolation"}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold">
                      {isVi ? "CAM KẾT HOẠT ĐỘNG 99.99% UPTIME" : "99.99% UPTIME SLA"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                        <span>01. MULTI-CHANNEL CLIENTS</span>
                        <Monitor size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">Web • Telegram • Slack</div>
                      <div className="text-[11px] text-neutral-500">
                        {isVi ? "Giao việc từ mọi nơi với phản hồi trực tiếp theo thời gian thực" : "Dispatch tasks from anywhere with real-time streaming"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border-2 border-blue-500/40 bg-blue-500/[0.05] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-blue-400">
                        <span>02. FRONTIER MODEL FLEET</span>
                        <Sparkles size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">Grok • Claude • GPT • Qwen</div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300">
                        {isVi ? "Tự động định tuyến qua Gateway LLM360 với độ trễ tối ưu" : "Auto-routed via LLM360 gateway with zero cold-start"}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#080a0f] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-emerald-500">
                        <span>03. CLOUD SANDBOX & CDP</span>
                        <HardDrive size={14} />
                      </div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {isVi ? "Container Linux & Trình duyệt CDP" : "Persistent Linux & CDP"}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {isVi ? "Lưu trữ mã hóa riêng biệt & cookie phiên làm việc bền vững" : "Encrypted storage volume & authenticated browser sessions"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> {isVi ? "Không tốn công DevOps" : "Zero DevOps"}</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> {isVi ? "Không dùng dữ liệu huấn luyện" : "Training Opt-Out"}</span>
                      <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> {isVi ? "Mở rộng tức thì" : "Instant Scaling"}</span>
                    </div>
                    <Link
                      to="/app"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#f8a87c] text-black px-4 py-1.5 rounded-lg hover:bg-[#f5935f]"
                    >
                      <span>{isVi ? "Mở Không Gian Làm Việc" : "Launch Cloud Workspace"}</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5. Section #interaction & #hierarchy */}
      <section id="interaction" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Chat + Live Approval Gate */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c]">
                <CheckCircle2 size={13} />
                <span>{isVi ? "KIỂM SOÁT BẢO MẬT" : "HUMAN-IN-THE-LOOP"}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal leading-tight">
                {isVi ? "Tự chủ thực thi. Dừng lại khi duyệt chi." : "Autonomous work. Pauses for approval."}
              </h2>

              {/* Interactive Chat Simulation Card */}
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-lg overflow-hidden font-sans">
                <div className="h-9 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                    <span className="ml-1 text-neutral-500">
                      {isVi ? "Skyer // Tác vụ #402" : "Skyer // Task #402"}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                    {isVi ? "Mô Phỏng Trực Tiếp" : "Live Demo"}
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* User Message */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-800 dark:text-neutral-200 shrink-0">
                      {isVi ? "Bạn" : "You"}
                    </div>
                    <div className="bg-slate-50 dark:bg-[#12151d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl rounded-tl-none p-3 text-xs text-neutral-800 dark:text-neutral-200">
                      {isVi
                        ? "Đối soát 48 hóa đơn nhà cung cấp và lập lệnh thanh toán $14,200 qua PayOS."
                        : "Reconcile 48 supplier invoices and wire $14,200 payout batch via PayOS."}
                    </div>
                  </div>

                  {/* Bot Response + Interactive Approval Gate */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-[#f8a87c] flex items-center justify-center text-xs font-bold text-black shrink-0">
                      S
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-[#12151d] border border-neutral-200 dark:border-[var(--border-subtle)] rounded-xl rounded-tl-none p-3.5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {isVi ? "✓ 48/48 Hóa đơn khớp 100% (0.00 VNĐ lệch)" : "✓ 48/48 Invoices Matched ($0.00 diff)"}
                        </span>
                        <span className="text-neutral-400">TT99 02-VT</span>
                      </div>

                      {/* Interactive Human Gate Box */}
                      <div className="rounded-lg border border-[#f8a87c]/40 bg-white dark:bg-[#090b10] p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-mono uppercase text-[#f8a87c] font-bold">
                              {isVi ? "BƯỚC PHÊ DUYỆT BẮT BUỘC" : "HUMAN APPROVAL GATE"}
                            </div>
                            <div className="text-xs font-semibold text-neutral-900 dark:text-white mt-0.5">
                              {isVi ? "Xác nhận duyệt chi PayOS lô #402 ($14,200.00)" : "Execute PayOS Batch #402 ($14,200.00)"}
                            </div>
                          </div>

                          {approvalState === "pending" && (
                            <button
                              type="button"
                              onClick={triggerApproveDemo}
                              className="px-3 py-1.5 rounded-lg bg-[#f8a87c] hover:bg-[#f5935f] text-black font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-xs animate-pulse"
                            >
                              <MousePointerClick size={13} />
                              <span>{isVi ? "Phê duyệt" : "Approve"}</span>
                            </button>
                          )}
                          {approvalState === "executing" && (
                            <span className="text-xs font-mono text-[#f8a87c]">
                              {isVi ? "Đang ký lệnh chuyển khoản..." : "Signing tx..."}
                            </span>
                          )}
                          {approvalState === "approved" && (
                            <button
                              type="button"
                              onClick={() => setApprovalState("pending")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={12} />
                              <span>{isVi ? "Đã gửi lệnh thành công (Bấm để thử lại)" : "Dispatched (Reset)"}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Section #hierarchy - Animated Multi-Agent ACP Pipeline */}
            <div id="hierarchy" className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c]">
                <Network size={13} />
                <span>{isVi ? "ĐIỀU PHỐI ĐA BOT" : "MULTI-AGENT ACP"}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal leading-tight">
                {isVi ? "Tự bàn giao công việc giữa các phòng ban." : "Autonomous cross-team task handoffs."}
              </h2>

              {/* Animated Multi-Agent Mesh Visual */}
              <div className="rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] p-5 shadow-lg space-y-3 font-mono text-xs">
                {[
                  {
                    step: 0,
                    role: isVi ? "Chánh Văn Phòng (CoS Trưởng Nhóm)" : "Chief of Staff (Lead)",
                    badge: isVi ? "GIAO VIỆC" : "DELEGATE",
                    msg: isVi
                      ? "Phân rã Hợp đồng Doanh nghiệp Q4 #88 thành 3 tiểu tác vụ cho các phòng ban"
                      : "Decomposed Q4 Enterprise Deal #88 into 3 department sub-tasks",
                    color: "text-[#f8a87c]",
                  },
                  {
                    step: 1,
                    role: isVi ? "Bot Bán Hàng B2B" : "B2B Sales Bot",
                    badge: isVi ? "ĐỒNG BỘ CRM" : "CRM SYNC",
                    msg: isVi
                      ? "Hợp đồng đã ký tải lên BaseCore • Trạng thái Deal → Thành công (Closed Won $48k)"
                      : "Signed MSA uploaded to BaseCore • Deal stage → Closed Won ($48k)",
                    color: "text-blue-400",
                  },
                  {
                    step: 2,
                    role: isVi ? "Bot Kiểm Soát Tài Chính" : "Financial Controller Bot",
                    badge: "ERPCORE",
                    msg: isVi
                      ? "Xuất hóa đơn VAT điện tử #INV-2026-88 & đối soát đợt chuyển khoản thanh toán đầu tiên"
                      : "Generated VAT Invoice #INV-2026-88 & reconciled first wire transfer",
                    color: "text-emerald-400",
                  },
                  {
                    step: 3,
                    role: isVi ? "Knowledge Base KB & BaseCore Deck" : "Knowledge Base KB & Deck",
                    badge: isVi ? "BIÊN NHẬN" : "RECEIPT",
                    msg: isVi
                      ? "Đã cam kết biên nhận tri thức #b7a9 • Cập nhật sổ cái ghi nhận doanh thu"
                      : "Epistemic receipt #b7a9 committed • Revenue ledger updated",
                    color: "text-purple-400",
                  },
                ].map((item, idx) => {
                  const isActive = activeAcpStep === idx;
                  return (
                    <div
                      key={item.role}
                      onClick={() => setActiveAcpStep(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#f8a87c]/[0.07] border-[#f8a87c]/50 shadow-xs scale-[1.01]"
                          : "bg-slate-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/5 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold ${item.color} flex items-center gap-1.5`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-[#f8a87c] animate-ping" : "bg-neutral-400"}`} />
                          {item.role}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-white/5 text-neutral-600 dark:text-neutral-300">
                          {item.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-700 dark:text-neutral-300 font-sans pl-3">
                        {item.msg}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section #architecture & #workflow: Visual Browser CDP + Autonomous Routine & Memory Loop */}
      <section id="architecture" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Part A: Headless Browser CDP Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#f8a87c]">
                <Eye size={13} />
                <span>{isVi ? "TRÌNH DUYỆT TỰ HÀNH" : "ISOLATED BROWSER CDP"}</span>
              </div>
              <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal leading-tight">
                {isVi ? "Thao tác trực tiếp trên giao diện web của bạn." : "Navigates your web apps with 60 FPS precision."}
              </h2>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {["Zendesk", "ERPCore", "GitHub", "Notion", "Google Workspace", "PayOS", "Telegram"].map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] font-mono bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/10 px-2.5 py-1 rounded-lg text-neutral-700 dark:text-neutral-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Animated Virtual Browser Viewport */}
            <div className="lg:col-span-7 rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#090b10] shadow-xl overflow-hidden font-mono text-xs">
              <div className="h-9 bg-slate-50 dark:bg-[#0e1117] border-b border-neutral-200 dark:border-[var(--border-subtle)] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                  <span className="ml-2 text-[11px] truncate text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-white/5 px-2.5 py-0.5 rounded">
                    https://erp.company.vn/app/purchase-invoice
                  </span>
                </div>
                <span className="text-[10px] text-[#f8a87c] bg-[#f8a87c]/10 border border-[#f8a87c]/30 px-2 py-0.5 rounded">
                  CDP: 60 FPS
                </span>
              </div>

              {/* Interactive Simulated DOM Targets */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    title: isVi ? "1. Xác thực Phiên" : "1. Session Auth",
                    desc: isVi ? "Đã nạp Kho Cookie SSO an toàn" : "SSO Cookie Vault mounted",
                    status: "200 OK",
                  },
                  {
                    title: isVi ? "2. Bộ chọn DOM" : "2. DOM Selector",
                    desc: isVi ? "Đã click [data-action='reconcile']" : "Clicked [data-action='reconcile']",
                    status: isVi ? "Đã khớp" : "Matched",
                  },
                  {
                    title: isVi ? "3. Tự điền Biểu mẫu" : "3. Form Prefill",
                    desc: isVi ? "Nạp dữ liệu 48 dòng PO vào bảng" : "Injected 48 PO line items",
                    status: isVi ? "0 Lỗi" : "0 Errors",
                  },
                  {
                    title: isVi ? "4. Biên nhận Thị giác" : "4. Visual Receipt",
                    desc: isVi ? "Chụp ảnh màn hình hash #a94f2" : "Captured PNG hash #a94f2",
                    status: isVi ? "Đã xác thực" : "Verified",
                  },
                ].map((bStep, idx) => {
                  const active = activeBrowserStep === idx;
                  return (
                    <div
                      key={bStep.title}
                      onClick={() => setActiveBrowserStep(idx)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        active
                          ? "border-[#f8a87c] bg-[#f8a87c]/10"
                          : "border-neutral-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-neutral-900 dark:text-white">{bStep.title}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">{bStep.status}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
                        {bStep.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Part B: Section #workflow - Repeatable Routines & ReMe Memory Graph */}
          <div id="workflow" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Card 1: Scheduled Cron Routine Simulator */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#f8a87c] bg-[#f8a87c]/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {t("routines.badge")}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                    <Clock size={12} className="text-[#f8a87c]" />
                    {isVi ? "08:00 Sáng Mỗi Ngày" : "08:00 AM Daily"}
                  </span>
                </div>
                <h3 className="font-newsreader text-2xl text-neutral-900 dark:text-white font-normal mb-4">
                  {isVi ? "Tự động chạy định kỳ mỗi sáng" : "Scheduled daily routines"}
                </h3>
              </div>

              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090d] p-3.5 font-mono text-[11px] space-y-2">
                {[
                  isVi ? "01. Trích xuất sao kê ngân hàng & sổ cái ERP" : "01. Pull bank & ERP ledger",
                  isVi ? "02. Cảnh báo các khoản lệch > $100" : "02. Flag variance > $100",
                  isVi ? "03. Gửi thông báo tóm tắt vào nhóm Telegram" : "03. Post briefing to Telegram",
                  isVi ? "04. Lưu trữ biên nhận vào Cơ sở Tri thức KB" : "04. Archive receipt to KB",
                ].map((rStep, idx) => (
                  <div
                    key={rStep}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded ${
                      activeRoutineStep === idx
                        ? "bg-[#f8a87c]/15 text-neutral-900 dark:text-white font-semibold"
                        : "text-neutral-500"
                    }`}
                  >
                    <span>{rStep}</span>
                    <span className={activeRoutineStep === idx ? "text-[#f8a87c]" : "text-emerald-500"}>
                      {activeRoutineStep === idx ? (isVi ? "● Đang chạy" : "● Running") : "✓"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: ReMe Persistent Memory & Self-Evolution */}
            <div className="rounded-xl border border-neutral-200 dark:border-[var(--border-subtle)] bg-white dark:bg-[var(--bg-card)] p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-semibold">
                    {t("memory.badge")}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">ReMe Engine</span>
                </div>
                <h3 className="font-newsreader text-2xl text-neutral-900 dark:text-white font-normal mb-4">
                  {isVi ? "Ghi nhớ quy định & thói quen làm việc" : "Persistent memory & organizational rules"}
                </h3>
              </div>

              <div className="rounded-lg border border-neutral-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090d] p-3.5 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-neutral-200 dark:border-white/5">
                  <span className="text-neutral-900 dark:text-white font-bold">/app/working/MEMORY.md</span>
                  <span className="text-emerald-500 text-[10px]">{isVi ? "Đã đồng bộ" : "Synced"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-[#f8a87c]">[[QuyĐịnhNhàCungCấp]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {isVi ? "Bắt buộc khớp hóa đơn 3 bên" : "3-way match required"}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-blue-400">[[VănPhongThươngHiệu]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {isVi ? "Ngắn gọn, rõ ràng, phong cách quản lý" : "Executive concise tone"}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-emerald-400">[[QuyTắcTT99]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {isVi ? "Bảng kê chứng từ Mẫu 02-VT" : "Mẫu 02-VT template"}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-white/[0.03] border border-neutral-200 dark:border-white/5">
                    <div className="text-[10px] text-purple-400">[[SLAThanhToán]]</div>
                    <div className="text-[10px] text-neutral-500 truncate">
                      {isVi ? "Báo cho CFO nếu khoản chi > $5,000" : "Notify CFO > $5,000"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section #pricing: Clean Tiers */}
      <section id="pricing" className="py-16 sm:py-24 border-b border-neutral-200 dark:border-[var(--border-subtle)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-newsreader text-3xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
              {isVi ? "Bảng giá điện toán minh bạch" : "Predictable compute pricing"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 flex flex-col justify-between border transition-all ${
                  plan.name === "Super"
                    ? "bg-white dark:bg-[var(--bg-card)] border-[#f8a87c] shadow-lg relative"
                    : "bg-slate-50/70 dark:bg-[#080a0f] border-neutral-200 dark:border-[var(--border-subtle)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{plan.name}</h3>
                    <span
                      className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                        plan.name === "Super"
                          ? "bg-[#f8a87c] text-black"
                          : "bg-neutral-200/70 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                      }`}
                    >
                      {isVi ? plan.badge.vi : plan.badge.en}
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      {typeof plan.price === "string" ? plan.price : isVi ? plan.price.vi : plan.price.en}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {isVi ? plan.period.vi : plan.period.en}
                    </span>
                  </div>


                  <ul className="mt-5 space-y-2.5 border-t border-neutral-200 dark:border-[var(--border-subtle)] pt-4 text-xs text-neutral-700 dark:text-neutral-300">
                    {(isVi ? plan.features.vi : plan.features.en).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-[#f8a87c] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={plan.name === "On-Premise" ? "/docs" : "/app"}
                  className={`mt-6 w-full py-2.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    plan.name === "Super"
                      ? "bg-[#f8a87c] text-black hover:bg-[#f5935f]"
                      : "bg-neutral-200/70 dark:bg-white/[0.06] text-neutral-900 dark:text-white hover:bg-neutral-300/70 dark:hover:bg-white/[0.12]"
                  }`}
                >
                  {plan.name === "On-Premise"
                    ? isVi
                      ? "Tài liệu On-Prem"
                      : "Explore On-Prem"
                    : `${t("pricing.getPlan")} ${plan.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Section #faq: Compact Accordion */}
      <section id="faq" className="py-16 sm:py-20 border-b border-neutral-200 dark:border-[var(--border-subtle)] bg-[var(--bg-card-subtle)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-newsreader text-2xl sm:text-4xl text-neutral-900 dark:text-white font-normal">
              {isVi ? "Câu hỏi thường gặp" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-[var(--border-subtle)] border-t border-b border-neutral-200 dark:border-[var(--border-subtle)]">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between py-4 text-left text-xs sm:text-sm font-medium text-neutral-900 dark:text-white hover:text-[#f8a87c] transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{isVi ? item.q.vi : item.q.en}</span>
                    <ChevronDown
                      size={15}
                      className={`text-neutral-500 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#f8a87c]" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {isVi ? item.a.vi : item.a.en}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section id="deploy" className="py-20 text-center relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 relative z-10">
          <h2 className="font-newsreader text-3xl sm:text-5xl text-neutral-900 dark:text-white font-normal leading-[1.15] text-balance">
            {isVi ? (
              <>
                <span className="whitespace-nowrap">Khởi chạy</span>{" "}
                <span className="whitespace-nowrap">Nhân viên AI</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 font-semibold whitespace-nowrap">
                  Skyer
                </span>{" "}
                <span className="whitespace-nowrap">ngay hôm nay.</span>
              </>
            ) : (
              <>
                <span>Deploy your first </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f8a87c] via-[#ffa149] to-amber-300 font-semibold">
                  Skyer
                </span>
                <span> teammate today.</span>
              </>
            )}
          </h2>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f8a87c] text-black hover:bg-[#f5935f] px-8 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_25px_rgba(248,168,124,0.35)]"
            >
              <span>{t("cta.getStarted")}</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/docs"
              className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 dark:border-white/15 bg-white dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-white/[0.08] px-7 text-xs sm:text-sm font-medium text-neutral-800 dark:text-white transition-all"
            >
              {t("cta.readDocs")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
