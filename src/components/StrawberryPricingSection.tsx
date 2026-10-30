import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { AgentAvatar } from "./AgentAvatar";
import { ContactModal } from "./ContactModal";
import {
  Check,
  Sparkles,
  Cpu,
  Globe,
  Database,
  Calendar,
  PlusCircle,
  Shield,
  Users,
  BarChart3,
  Layers,
  Wallet,
  Lock,
  Monitor,
  Coins,
} from "lucide-react";

interface StrawberryPricingSectionProps {
  isStandalonePage?: boolean;
}

export function StrawberryPricingSection({ isStandalonePage = false }: StrawberryPricingSectionProps) {
  const { language } = useTranslation();
  const isVi = language === "vi";

  const [segment, setSegment] = useState<"individual" | "team" | "enterprise">("individual");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [contactOpen, setContactOpen] = useState(false);

  const price = (monthlyUsd: number, monthlyVnd: string, annualVnd: string) => {
    if (isVi) {
      return billing === "monthly" ? monthlyVnd : annualVnd;
    }
    const val = billing === "monthly" ? monthlyUsd : Math.round(monthlyUsd * 0.83);
    return `$${val}`;
  };

  return (
    <section
      id="pricing"
      className={`relative overflow-hidden border-b border-[#ECE5DC] dark:border-white/10 bg-[var(--bg-page)] transition-colors select-none ${
        isStandalonePage ? "pt-24 pb-24" : "py-20 sm:py-28"
      }`}
    >
      {/* Subtle Top Mosaic Background Pattern */}
      <div
        className="absolute inset-x-0 top-0 h-[360px] pointer-events-none select-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.4) 78%, rgba(0,0,0,0.9) 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 22%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.04) 60%, rgba(0,0,0,0.4) 78%, rgba(0,0,0,0.9) 100%)",
          }}
        >
          <svg className="w-full h-full opacity-[0.32] dark:opacity-[0.05] text-[#e5ddd2] dark:text-white" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pricing-mosaic" width="64" height="64" patternUnits="userSpaceOnUse">
                <circle cx="8" cy="8" r="5" fill="currentColor" />
                <rect x="20" y="3" width="9" height="9" rx="1.5" fill="currentColor" opacity="0.7" />
                <polygon points="40,2 46,8 40,14 34,8" fill="currentColor" opacity="0.85" />
                <circle cx="24" cy="24" r="5.5" fill="currentColor" opacity="0.85" />
                <rect x="36" y="19" width="10" height="10" rx="2" fill="currentColor" opacity="0.55" />
                <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.9" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pricing-mosaic)" />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 1. Left-aligned Header Title & Subtitle (Exact Strawberry Pricing pattern) */}
        <div className="mb-10">
          <h1
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}
            className="text-4xl sm:text-[47.8px] leading-[1.1] tracking-[-1.91px] text-[#252522] dark:text-white"
          >
            {isVi ? "Bảng giá" : "Pricing"}
          </h1>
          <p className="mt-3 text-base sm:text-[19px] text-[#252522]/70 dark:text-neutral-400 font-normal">
            {isVi ? "Bắt đầu miễn phí, nâng cấp linh hoạt khi quy mô mở rộng." : "Start for free, upgrade as you grow."}
          </p>
        </div>

        {/* 2. Control Bar: Left 3-Tab Pill Switcher + Right Monthly/Annual Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Segment Switcher */}
          <div className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[#F3EDE4] dark:bg-white/[0.05] border border-[#E6DFD5] dark:border-white/10 w-full sm:w-fit justify-between sm:justify-start">
            {[
              { id: "individual", en: "Individual", vi: "Cá nhân" },
              { id: "team", en: "Team", vi: "Đội ngũ" },
              { id: "enterprise", en: "Enterprise", vi: "Doanh nghiệp" },
            ].map((tab) => {
              const active = segment === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSegment(tab.id as any)}
                  className={`flex-1 sm:flex-initial text-center px-3.5 sm:px-5 py-2 rounded-full text-[13px] sm:text-[14px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? "bg-[#FFFDF9] dark:bg-[#252522] text-[#252522] dark:text-white shadow-xs border border-[#E6DFD5]/80 dark:border-white/15"
                      : "text-[#252522]/65 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white"
                  }`}
                >
                  {isVi ? tab.vi : tab.en}
                </button>
              );
            })}
          </div>

          {/* Billing Period Switcher (Hidden on Enterprise tab like Strawberry) */}
          {segment !== "enterprise" && (
            <div className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-[#F3EDE4] dark:bg-white/[0.05] border border-[#E6DFD5] dark:border-white/10 w-full sm:w-fit justify-between sm:justify-start">
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`flex-1 sm:flex-initial text-center px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                  billing === "monthly"
                    ? "bg-[#FFFDF9] dark:bg-[#252522] text-[#252522] dark:text-white shadow-xs border border-[#E6DFD5]/80 dark:border-white/15"
                    : "text-[#252522]/65 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white"
                }`}
              >
                {isVi ? "Hàng tháng" : "Monthly"}
              </button>
              <button
                type="button"
                onClick={() => setBilling("annual")}
                className={`flex-1 sm:flex-initial justify-center px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                  billing === "annual"
                    ? "bg-[#FFFDF9] dark:bg-[#252522] text-[#252522] dark:text-white shadow-xs border border-[#E6DFD5]/80 dark:border-white/15"
                    : "text-[#252522]/65 dark:text-neutral-400 hover:text-[#252522] dark:hover:text-white"
                }`}
              >
                <span className="whitespace-nowrap shrink-0">{isVi ? "Hàng năm" : "Annual"}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EA580C] text-white keep-white text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap shrink-0">
                  {isVi ? "-17%" : "2 mo free"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 3A. INDIVIDUAL TAB: Split Card (Free) + Unified 3-Column Paid Container (Intern, Part-Time, Full-Time) */}
        {segment === "individual" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left 3 Cols: Free Card */}
            <div className="lg:col-span-3 rounded-[28px] bg-[#F3EDE4]/70 dark:bg-[#11151f] border border-[#E6DFD5] dark:border-white/10 p-1.5 flex flex-col justify-between">
              <div className="rounded-[22px] bg-[#FFFDF9] dark:bg-[#161b26] border border-[#ECE5DC] dark:border-white/10 p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Free</h3>
                  <p className="mt-1.5 text-[13px] text-[#252522]/65 dark:text-neutral-400 leading-relaxed min-h-[42px]">
                    {isVi ? "Khám phá cách nhân viên AI Skyer hỗ trợ bạn mỗi ngày." : "Explore what Skyer can do for you."}
                  </p>
                  <div className="mt-4 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                    <strong className="font-semibold text-[#252522] dark:text-white">500</strong>{" "}
                    {isVi ? "tín chỉ thực thi / tháng" : "monthly credits"}
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                      {isVi ? "0₫" : "$0"}
                    </span>
                    <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                      {isVi ? "/tháng" : "/month"}
                    </span>
                  </div>
                </div>

                {/* Single Companion Illustration */}
                <div className="my-7 flex items-center justify-center h-28">
                  <AgentAvatar
                    agent={{ id: "price-free", name: "Free Companion" }}
                    size="lg"
                    alwaysAnimate
                    overrideConfig={{
                      type: "blob",
                      blob: { shape: "clover", expression: "happy", color: "#eab308", animation: "nod.1.4", seed: 11 },
                    }}
                  />
                </div>

                <Link
                  to="/app"
                  className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                >
                  {isVi ? "Dùng thử miễn phí" : "Try for free"}
                </Link>
              </div>

              {/* Bottom Tray: Start with the essentials */}
              <div className="p-5 lg:h-[124px] flex flex-col justify-center space-y-2.5 text-[13px] text-[#252522] dark:text-neutral-200 shrink-0">
                <div className="font-semibold text-[13px]">{isVi ? "Tính năng khởi đầu:" : "Start with the essentials:"}</div>
                <div className="space-y-2.5 text-[12.5px] text-[#252522]/85 dark:text-neutral-300">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={14} className="text-neutral-500 shrink-0" />
                    <span>{isVi ? "Nhân viên AI cho tác vụ hằng ngày" : "AI for everyday tasks"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check size={14} className="text-neutral-500 shrink-0" />
                    <span>{isVi ? "Trình duyệt & Máy tính cơ bản" : "Curated AI models"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 9 Cols: Unified 3-Tier Paid Container (Intern, Part-Time, Full-Time) */}
            <div className="lg:col-span-9 rounded-[28px] bg-[#F3EDE4]/70 dark:bg-[#11151f] border border-[#E6DFD5] dark:border-white/10 p-1.5 flex flex-col justify-between">
              <div className="rounded-[22px] bg-[#FFFDF9] dark:bg-[#161b26] border border-[#ECE5DC] dark:border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#ECE5DC] dark:divide-white/10 flex-1">
                {/* Tier 1: Intern */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Intern</h3>
                    <p className="mt-1.5 text-[13px] text-[#252522]/65 dark:text-neutral-400 leading-relaxed min-h-[42px]">
                      {isVi ? "Như một thực tập sinh phụ việc vài giờ mỗi tuần." : "Like an assistant who helps out a few hours a week."}
                    </p>
                    <div className="mt-4 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                      <strong className="font-semibold text-[#252522] dark:text-white">6,000</strong>{" "}
                      {isVi ? "tín chỉ thực thi / tháng" : "monthly credits"}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                        {price(20, "490k", "390k")}
                      </span>
                      <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                        {isVi ? "/tháng" : "/month"}
                      </span>
                    </div>
                  </div>

                  <div className="my-7 flex items-center justify-center h-28">
                    <AgentAvatar
                      agent={{ id: "price-intern", name: "Intern Companion" }}
                      size="lg"
                      alwaysAnimate
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "bunny", expression: "attentive", color: "#a78bfa", animation: "wink.1.6", seed: 22 },
                      }}
                    />
                  </div>

                  <Link
                    to="/app"
                    className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                  >
                    {isVi ? "Tuyển Thực tập sinh" : "Get Intern"}
                  </Link>
                </div>

                {/* Tier 2: Part-Time */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Part-Time</h3>
                    <p className="mt-1.5 text-[13px] text-[#252522]/65 dark:text-neutral-400 leading-relaxed min-h-[42px]">
                      {isVi ? "Như một đồng nghiệp lành nghề đảm nhận trọn vẹn dự án." : "Like a capable colleague who takes on whole projects."}
                    </p>
                    <div className="mt-4 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                      <strong className="font-semibold text-[#252522] dark:text-white">25,000</strong>{" "}
                      {isVi ? "tín chỉ thực thi / tháng" : "monthly credits"}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                        {price(85, "1.990k", "1.650k")}
                      </span>
                      <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                        {isVi ? "/tháng" : "/month"}
                      </span>
                    </div>
                  </div>

                  <div className="my-7 flex items-center justify-center gap-2 h-28">
                    <AgentAvatar
                      agent={{ id: "price-pt-1", name: "PT Companion 1" }}
                      size="lg"
                      alwaysAnimate
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "nod.1.4", seed: 33 },
                      }}
                    />
                    <AgentAvatar
                      agent={{ id: "price-pt-2", name: "PT Companion 2" }}
                      size="lg"
                      alwaysAnimate
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "wink.1.6", seed: 44 },
                      }}
                    />
                  </div>

                  <Link
                    to="/app"
                    className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                  >
                    {isVi ? "Tuyển Bán thời gian" : "Get Part-Time"}
                  </Link>
                </div>

                {/* Tier 3: Full-Time */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Full-Time</h3>
                    <p className="mt-1.5 text-[13px] text-[#252522]/65 dark:text-neutral-400 leading-relaxed min-h-[42px]">
                      {isVi ? "Như đội ngũ nhân sự chính thức tự vận hành cả luồng nghiệp vụ." : "Like a few new hires who run entire workstreams."}
                    </p>
                    <div className="mt-4 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                      <strong className="font-semibold text-[#252522] dark:text-white">75,000</strong>{" "}
                      {isVi ? "tín chỉ thực thi / tháng" : "monthly credits"}
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                        {price(250, "5.900k", "4.900k")}
                      </span>
                      <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                        {isVi ? "/tháng" : "/month"}
                      </span>
                    </div>
                  </div>

                  <div className="my-7 flex items-center justify-center gap-2 h-28">
                    <AgentAvatar
                      agent={{ id: "price-ft-1", name: "FT Companion 1" }}
                      size="lg"
                      alwaysAnimate
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4", seed: 55 },
                      }}
                    />
                    <AgentAvatar
                      agent={{ id: "price-ft-2", name: "FT Companion 2" }}
                      size="lg"
                      alwaysAnimate
                      overrideConfig={{
                        type: "blob",
                        blob: { shape: "cat", expression: "happy", color: "#f8a87c", animation: "wink.1.6", seed: 66 },
                      }}
                    />
                  </div>

                  <Link
                    to="/app"
                    className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                  >
                    {isVi ? "Tuyển Toàn thời gian" : "Get Full-Time"}
                  </Link>
                </div>
              </div>

              {/* Bottom Shared Tray: Everything in Free, plus */}
              <div className="p-5 lg:h-[124px] flex flex-col justify-center space-y-2.5 text-[13px] text-[#252522] dark:text-neutral-200 shrink-0">
                <div className="font-semibold text-[13px]">
                  {isVi ? "Bao gồm mọi tính năng gói Free, cộng thêm:" : "Everything in Free, plus:"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[12.5px] text-[#252522]/85 dark:text-neutral-300">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={14} className="text-neutral-500 shrink-0" />
                    <span>{isVi ? "Chế độ Chuyên gia trên máy tính riêng" : "Smarter AI with Expert workstation mode"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Cpu size={14} className="text-neutral-500 shrink-0" />
                    <span>{isVi ? "Tùy chọn mô hình AI thực thi" : "Choose which AI models to use"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Monitor size={14} className="text-neutral-500 shrink-0" />
                    <span>{isVi ? "Ưu tiên tài nguyên máy tính giờ cao điểm" : "Priority access during peak hours"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Database size={14} className="text-neutral-500 shrink-0" />
                    <span>{isVi ? "Kết nối BYOK / Self-host model tiết kiệm tín chỉ" : "Use your own model keys to save credits"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3B. TEAM TAB: Unified 3-Column Container (Starter, Standard, Ultra) */}
        {segment === "team" && (
          <div className="rounded-[28px] bg-[#F3EDE4]/70 dark:bg-[#11151f] border border-[#E6DFD5] dark:border-white/10 p-1.5">
            <div className="rounded-[22px] bg-[#FFFDF9] dark:bg-[#161b26] border border-[#ECE5DC] dark:border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#ECE5DC] dark:divide-white/10">
              {/* Starter */}
              <div className="p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Starter</h3>
                  <div className="mt-2 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                    <strong className="font-semibold text-[#252522] dark:text-white">10,000</strong>{" "}
                    {isVi ? "tín chỉ / thành viên / tháng" : "monthly credits per seat"}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                      {price(35, "850k", "690k")}
                    </span>
                    <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                      {isVi ? "/thành viên/tháng" : "/seat/month"}
                    </span>
                  </div>
                </div>

                <div className="my-8 flex items-center justify-center h-28">
                  <AgentAvatar
                    agent={{ id: "team-starter", name: "Team Starter" }}
                    size="lg"
                    alwaysAnimate
                    overrideConfig={{
                      type: "blob",
                      blob: { shape: "bunny", expression: "attentive", color: "#a78bfa", animation: "nod.1.4", seed: 71 },
                    }}
                  />
                </div>

                <Link
                  to="/app"
                  className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                >
                  {isVi ? "Tạo đội ngũ" : "Create team"}
                </Link>
              </div>

              {/* Standard */}
              <div className="p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Standard</h3>
                  <div className="mt-2 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                    <strong className="font-semibold text-[#252522] dark:text-white">40,000</strong>{" "}
                    {isVi ? "tín chỉ / thành viên / tháng" : "monthly credits per seat"}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                      {price(150, "3.500k", "2.900k")}
                    </span>
                    <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                      {isVi ? "/thành viên/tháng" : "/seat/month"}
                    </span>
                  </div>
                </div>

                <div className="my-8 flex items-center justify-center h-28">
                  <AgentAvatar
                    agent={{ id: "team-std", name: "Team Standard" }}
                    size="lg"
                    alwaysAnimate
                    overrideConfig={{
                      type: "blob",
                      blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "wink.1.6", seed: 72 },
                    }}
                  />
                </div>

                <Link
                  to="/app"
                  className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                >
                  {isVi ? "Tạo đội ngũ" : "Create team"}
                </Link>
              </div>

              {/* Ultra */}
              <div className="p-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">Ultra</h3>
                  <div className="mt-2 text-[13px] text-[#252522]/80 dark:text-neutral-300">
                    <strong className="font-semibold text-[#252522] dark:text-white">100,000</strong>{" "}
                    {isVi ? "tín chỉ / thành viên / tháng" : "monthly credits per seat"}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-[36px] font-bold tracking-tight text-[#252522] dark:text-white">
                      {price(350, "8.200k", "6.800k")}
                    </span>
                    <span className="text-[13px] text-[#252522]/60 dark:text-neutral-400">
                      {isVi ? "/thành viên/tháng" : "/seat/month"}
                    </span>
                  </div>
                </div>

                <div className="my-8 flex items-center justify-center gap-1.5 h-28">
                  <AgentAvatar
                    agent={{ id: "team-u1", name: "Ultra 1" }}
                    size="md"
                    alwaysAnimate
                    overrideConfig={{
                      type: "blob",
                      blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4", seed: 81 },
                    }}
                  />
                  <AgentAvatar
                    agent={{ id: "team-u2", name: "Ultra 2" }}
                    size="md"
                    alwaysAnimate
                    overrideConfig={{
                      type: "blob",
                      blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "wink.1.6", seed: 82 },
                    }}
                  />
                  <AgentAvatar
                    agent={{ id: "team-u3", name: "Ultra 3" }}
                    size="md"
                    alwaysAnimate
                    overrideConfig={{
                      type: "blob",
                      blob: { shape: "cat", expression: "happy", color: "#f8a87c", animation: "nod.1.4", seed: 83 },
                    }}
                  />
                </div>

                <Link
                  to="/app"
                  className="w-full py-3 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13px] font-medium text-center hover:opacity-90 transition-opacity"
                >
                  {isVi ? "Tạo đội ngũ" : "Create team"}
                </Link>
              </div>
            </div>

            {/* Bottom Shared Tray: Everything in Individual, plus */}
            <div className="p-6 space-y-3 text-[13px] text-[#252522] dark:text-neutral-200">
              <div className="font-semibold text-[13px]">
                {isVi ? "Bao gồm mọi tính năng Cá nhân, cộng thêm:" : "Everything in Individual, plus:"}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12.5px] text-[#252522]/85 dark:text-neutral-300">
                <div className="flex items-center gap-2.5">
                  <Users size={14} className="text-neutral-500 shrink-0" />
                  <span>{isVi ? "Không gian chung & Bộ nhớ công ty" : "Shared workspace with company context"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Wallet size={14} className="text-neutral-500 shrink-0" />
                  <span>{isVi ? "Quản trị thanh toán tập trung" : "Central billing and admin"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BarChart3 size={14} className="text-neutral-500 shrink-0" />
                  <span>{isVi ? "Thống kê hiệu suất theo thành viên" : "Usage analytics by member"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield size={14} className="text-neutral-500 shrink-0" />
                  <span>{isVi ? "Kiểm soát hạn mức chi tiêu" : "Spend controls"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Lock size={14} className="text-neutral-500 shrink-0" />
                  <span>{isVi ? "Cam kết không huấn luyện trên dữ liệu" : "No training on your business data"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Layers size={14} className="text-neutral-500 shrink-0" />
                  <span>{isVi ? "Phối hợp linh hoạt nhiều vị trí AI" : "Mix and match seat types"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3C. ENTERPRISE TAB: 2-Column Split Card (Custom Pricing + Everything in Team, plus) */}
        {segment === "enterprise" && (
          <div className="rounded-[28px] bg-[#F3EDE4]/70 dark:bg-[#11151f] border border-[#E6DFD5] dark:border-white/10 p-1.5 grid grid-cols-1 lg:grid-cols-12 gap-2 items-stretch">
            {/* Left 6 Cols: White Inner Card */}
            <div className="lg:col-span-6 rounded-[22px] bg-[#FFFDF9] dark:bg-[#161b26] border border-[#ECE5DC] dark:border-white/10 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-[22px] font-semibold text-[#252522] dark:text-white tracking-tight">
                  {isVi ? "Doanh nghiệp & On-Premise" : "Enterprise"}
                </h3>
                <p className="mt-2 text-[13.5px] text-[#252522]/70 dark:text-neutral-400 leading-relaxed max-w-md">
                  {isVi
                    ? "Chia sẻ quy trình vận hành của tổ chức bạn. Chúng tôi sẽ thiết kế kiến trúc On-Premise hoặc Private Cloud phù hợp nhất."
                    : "Tell us how your team works. We'll put together the right plan and help you get started."}
                </p>
                <div className="mt-6 text-[34px] font-bold tracking-tight text-[#252522] dark:text-white">
                  {isVi ? "Báo giá theo quy mô" : "Custom pricing"}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center sm:justify-start gap-3 h-28">
                <AgentAvatar
                  agent={{ id: "ent-1", name: "Ent 1" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "squircle", expression: "proud", color: "#38bdf8", animation: "nod.1.4", seed: 91 },
                  }}
                />
                <AgentAvatar
                  agent={{ id: "ent-2", name: "Ent 2" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "bear", expression: "focused", color: "#34d399", animation: "wink.1.6", seed: 92 },
                  }}
                />
                <AgentAvatar
                  agent={{ id: "ent-3", name: "Ent 3" }}
                  size="lg"
                  alwaysAnimate
                  overrideConfig={{
                    type: "blob",
                    blob: { shape: "clover", expression: "happy", color: "#eab308", animation: "nod.1.4", seed: 93 },
                  }}
                />
              </div>
            </div>

            {/* Right 6 Cols: Everything in Team, plus */}
            <div className="lg:col-span-6 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="font-semibold text-[14px] text-[#252522] dark:text-white">
                  {isVi ? "Bao gồm mọi tính năng Đội ngũ, cộng thêm:" : "Everything in Team, plus:"}
                </div>
                <ul className="space-y-3 text-[13.5px] text-[#252522]/80 dark:text-neutral-300">
                  {[
                    isVi ? "Triển khai 100% On-Premise & Self-host Local Model" : "100% On-Premise & Self-hosted Local Models",
                    isVi ? "Quỹ tín chỉ gộp chung toàn tập đoàn" : "Pooled credits that roll over",
                    isVi ? "Hóa đơn GTGT & Hợp đồng SLA cam kết riêng" : "Invoicing and custom terms",
                    isVi ? "Huấn luyện nhân viên AI theo SOP nội bộ trực tiếp" : "Dedicated onboarding and workshops",
                    isVi ? "Bảo mật nâng cao: SSO, MFA, Passkeys & Nhật ký kiểm toán" : "Security options: SSO, MFA, passkeys, and audit logs",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="h-4 w-4 rounded-full bg-[#252522]/20 dark:bg-white/20 flex items-center justify-center text-[#252522] dark:text-white shrink-0">
                        <Check size={10} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="mt-8 w-full py-3.5 rounded-full bg-[#252522] dark:bg-white text-[#FFFCFA] dark:text-[#111318] text-[13.5px] font-medium text-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                {isVi ? "Liên hệ bộ phận Doanh nghiệp" : "Contact sales"}
              </button>
            </div>
          </div>
        )}

        {/* 4. "Included in every plan" Rounded Warm Sand Banner (Exact Strawberry Layout) */}
        <div className="mt-6 rounded-[28px] bg-[#F3EDE4]/70 dark:bg-[#11151f] border border-[#E6DFD5] dark:border-white/10 p-7 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4">
            <h3 className="text-[20px] font-semibold text-[#252522] dark:text-white tracking-tight">
              {isVi ? "Có sẵn trong mọi gói" : "Included in every plan"}
            </h3>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13.5px] font-medium text-[#252522] dark:text-neutral-200">
            <div className="flex items-center gap-3">
              <Layers size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Kết nối ERPCore, BaseCore, Knowledge Base KB" : "Connect ERPCore, BaseCore, Knowledge Base KB"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Globe size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Máy tính độc lập tự thao tác mọi trang web" : "AI computer that can use any website"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Monitor size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Tạo bảng điều khiển & báo cáo trực quan" : "Create interactive dashboards"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Database size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Bộ nhớ dài hạn xuyên suốt các phiên" : "Memory across chats"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Đặt lịch chạy tác vụ định kỳ tự động" : "Put tasks on a schedule"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Cpu size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Đồng bộ trạng thái trên mọi thiết bị" : "Sync across your devices"}</span>
            </div>
            <div className="flex items-center gap-3">
              <PlusCircle size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Mua thêm tín chỉ dự phòng không hết hạn" : "Buy top-ups that roll over"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Lock size={15} className="text-neutral-500 shrink-0" />
              <span>{isVi ? "Không bao giờ dùng dữ liệu của bạn để train AI" : "No training on your content"}</span>
            </div>
          </div>
        </div>

        {/* 5. Two-Column Explainer Callout Below Banner (Workspace always free + Fresh allowance) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="border-l border-[#E6DFD5] dark:border-white/10 pl-6 space-y-2">
            <div className="h-9 w-9 rounded-full bg-[#F3EDE4] dark:bg-white/5 border border-[#E6DFD5] dark:border-white/10 flex items-center justify-center text-[#252522] dark:text-white">
              <Globe size={16} />
            </div>
            <h4 className="text-[14px] font-semibold text-[#252522] dark:text-white pt-1">
              {isVi ? "Không gian quản trị luôn miễn phí." : "Workspace & browsing is always free."}
            </h4>
            <p className="text-[13px] text-[#252522]/70 dark:text-neutral-400 leading-relaxed">
              {isVi
                ? "Tín chỉ chỉ được tính khi nhân viên AI bắt đầu thực thi tác vụ trên máy tính riêng như đối soát hóa đơn, trích xuất dữ liệu hay soạn thảo báo cáo."
                : "Credits are only used when your AI teammates step in to execute tasks on their computer, like reconciling invoices or extracting data."}
            </p>
          </div>

          <div className="border-l border-[#E6DFD5] dark:border-white/10 pl-6 space-y-2">
            <div className="h-9 w-9 rounded-full bg-[#F3EDE4] dark:bg-white/5 border border-[#E6DFD5] dark:border-white/10 flex items-center justify-center text-[#252522] dark:text-white">
              <Coins size={16} />
            </div>
            <h4 className="text-[14px] font-semibold text-[#252522] dark:text-white pt-1">
              {isVi ? "Làm mới hạn mức mỗi đầu tháng." : "A fresh allowance every month."}
            </h4>
            <p className="text-[13px] text-[#252522]/70 dark:text-neutral-400 leading-relaxed">
              {isVi
                ? "Hạn mức tín chỉ trong gói được làm mới hàng tháng. Khi cần xử lý cao điểm, bạn có thể nạp thêm gói tín chỉ cộng dồn không giới hạn thời hạn."
                : "Plan credits refresh monthly. Need more during peak seasons? Top up anytime and purchased top-ups roll over."}
            </p>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultCategory="enterprise"
      />
    </section>
  );
}
