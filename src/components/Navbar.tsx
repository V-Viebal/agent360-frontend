import { authConfig } from "../config/authConfig";
import { initiateSkyerSignIn } from "../services/pkceAuth";
import { SkyerLogo } from "./SkyerLogo";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, BookOpen, BarChart3, Users, ArrowUpRight } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "./ThemeSelector";
import { useTranslation } from "../i18n/LanguageContext";
import { ContactModal } from "./ContactModal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactCategory, setContactCategory] = useState<"general" | "request_agent" | "enterprise">("general");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { language } = useTranslation();
  const isVi = language === "vi";
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    setHasSession(!!token);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setResourcesOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, "signIn").catch((err) => {
      console.error("[Auth] Failed to initiate Skyer OIDC sign in:", err);
    });
  };

  const openContact = (cat: "general" | "request_agent" | "enterprise") => {
    setContactCategory(cat);
    setContactModalOpen(true);
    setMobileMenuOpen(false);
    setResourcesOpen(false);
  };

  const navLinkClass =
    "px-3.5 py-2 rounded-full text-[15px] tracking-[-0.1px] font-normal text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer";

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[var(--bg-nav)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] transition-colors select-none">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <SkyerLogo size={30} showText={true} showBotBadge={false} />
          </Link>

          {/* Center: Strawberry-style 5-Item Navigation with Marketplace & Grouped Resources */}
          <nav ref={dropdownRef} className="hidden md:flex items-center gap-1">
            <a href="/#bots" className={navLinkClass}>
              {isVi ? "Ứng dụng" : "Use cases"}
            </a>
            <Link
              to="/marketplace"
              className={`${navLinkClass} ${location.pathname.startsWith("/marketplace") ? "text-neutral-900 dark:text-white font-medium" : ""}`}
            >
              Marketplace
            </Link>
            <Link
              to="/pricing"
              className={`${navLinkClass} relative ${location.pathname === "/pricing" ? "text-[#252522] dark:text-white font-medium" : ""}`}
            >
              <span>{isVi ? "Bảng giá" : "Pricing"}</span>
              {location.pathname === "/pricing" && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#EA580C] rotate-45" />
              )}
            </Link>

            {/* Grouped Secondary Pages: Docs, Analytics, Community */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={`${navLinkClass} inline-flex items-center gap-1 ${
                  resourcesOpen || location.pathname.startsWith("/docs") || location.pathname.startsWith("/analytics")
                    ? "text-neutral-900 dark:text-white font-medium"
                    : ""
                }`}
              >
                <span>{isVi ? "Tài liệu" : "Resources"}</span>
                <ChevronDown size={13} className={`transition-transform duration-150 ${resourcesOpen ? "rotate-180" : "opacity-60"}`} />
              </button>

              {resourcesOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#FFFDF9] dark:bg-[#11151f] border border-[#ECE5DC] dark:border-white/10 p-1.5 shadow-xl z-50">
                  <Link
                    to="/docs"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8F3ED] dark:hover:bg-white/5 transition-colors"
                  >
                    <BookOpen size={15} className="text-neutral-500 dark:text-neutral-400 shrink-0" />
                    <div>
                      <div className="text-[13px] font-medium text-[#252522] dark:text-white">
                        {isVi ? "Tài liệu Hướng dẫn" : "Documentation"}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {isVi ? "Kiến trúc AgentCore & On-Premise" : "AgentCore & On-Premise Guides"}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/analytics"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8F3ED] dark:hover:bg-white/5 transition-colors"
                  >
                    <BarChart3 size={15} className="text-neutral-500 dark:text-neutral-400 shrink-0" />
                    <div>
                      <div className="text-[13px] font-medium text-[#252522] dark:text-white">
                        {isVi ? "Thống kê Vận hành" : "Live Telemetry"}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {isVi ? "Hiệu suất & chi phí nhân viên AI" : "Real-time AI workforce metrics"}
                      </div>
                    </div>
                  </Link>

                  <a
                    href="https://community-agent360.antares.vn"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F8F3ED] dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users size={15} className="text-neutral-500 dark:text-neutral-400 shrink-0" />
                      <div>
                        <div className="text-[13px] font-medium text-[#252522] dark:text-white">
                          {isVi ? "Diễn đàn Cộng đồng" : "Community Forum"}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {isVi ? "Chia sẻ mẫu quy trình AI" : "Workflows & agent templates"}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight size={13} className="text-neutral-400" />
                  </a>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => openContact("general")}
              className={navLinkClass}
            >
              {isVi ? "Liên hệ" : "Contact"}
            </button>
          </nav>

          {/* Right: Clean Account + Primary Pill CTA */}
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSelector />
            <ThemeSelector />

            {!hasSession ? (
              <>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="px-3.5 py-2 rounded-full text-[15px] tracking-[-0.1px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {isVi ? "Tài khoản" : "Account"}
                </button>
                <Link
                  to="/app"
                  className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#252522] text-[#FFFCFA] hover:opacity-90 dark:bg-[#f8a87c] dark:text-black dark:hover:bg-[#f5935f] transition-all cursor-pointer"
                >
                  {isVi ? "Mở ứng dụng" : "Launch App"}
                </Link>
              </>
            ) : (
              <Link
                to="/app"
                className="px-5 py-2 rounded-full text-[13px] font-medium bg-[#252522] text-[#FFFCFA] hover:opacity-90 dark:bg-[#f8a87c] dark:text-black dark:hover:bg-[#f5935f] transition-all cursor-pointer"
              >
                {isVi ? "Mở ứng dụng" : "Launch App"}
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[var(--bg-page)] border-b border-[var(--border-subtle)] px-4 py-5 space-y-2 shadow-xl">
            <a
              href="/#bots"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 text-[15px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              {isVi ? "Ứng dụng" : "Use cases"}
            </a>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 text-[15px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              Marketplace
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 text-[15px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              {isVi ? "Bảng giá" : "Pricing"}
            </Link>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 text-[15px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              {isVi ? "Tài liệu Hướng dẫn" : "Documentation"}
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-2 text-[15px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            >
              {isVi ? "Thống kê Vận hành" : "Live Telemetry"}
            </Link>
            <button
              type="button"
              onClick={() => openContact("general")}
              className="w-full text-left block py-2 px-2 text-[15px] text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              {isVi ? "Liên hệ" : "Contact"}
            </button>

            <div className="pt-3 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-between px-2">
              <LanguageSelector />
              <ThemeSelector />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {!hasSession && (
                <button
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSignIn(e);
                  }}
                  className="w-full py-2.5 rounded-full border border-neutral-200 dark:border-white/10 text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  {isVi ? "Tài khoản" : "Account"}
                </button>
              )}
              <Link
                to="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#252522] text-[#FFFCFA] dark:bg-[#f8a87c] dark:text-black text-sm font-medium"
              >
                {isVi ? "Mở ứng dụng" : "Launch App"}
              </Link>
            </div>
          </div>
        )}
      </header>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultCategory={contactCategory}
      />
    </>
  );
}
