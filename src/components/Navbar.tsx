import { authConfig } from '../config/authConfig';
import { initiateSkyerSignIn } from '../services/pkceAuth';
import { SkyerLogo } from "./SkyerLogo";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Sparkles,
  Server,
  Shield,
  Workflow,
  Cpu,
  BarChart3,
  BookOpen,
  Users,
  ExternalLink,
  LogIn,
  Sun,
  Moon,
  Menu,
  X,
  Layers,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeSelector } from "./ThemeSelector";
import { useTranslation } from "../i18n/LanguageContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("skyer_access_token") || localStorage.getItem("skyer_access_token");
    setHasSession(!!token);
  }, []);
  const [openDropdown, setOpenDropdown] = useState<"product" | "solutions" | "resources" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { themeMode, resolvedTheme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  // Close overlay dropdowns on outside click or escape
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, 'signIn').catch((err) => {
      console.error('[Auth] Failed to initiate Skyer OIDC sign in:', err);
    });
  };

  const handleSignUp = (e: React.MouseEvent) => {
    e.preventDefault();
    initiateSkyerSignIn(authConfig, 'signUp').catch((err) => {
      console.error('[Auth] Failed to initiate Skyer OIDC sign up:', err);
    });
  };

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--bg-nav)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] transition-colors select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="shrink-0 flex items-center">
          <SkyerLogo size={32} showText={true} showBotBadge={false} />
        </Link>

        {/* Desktop Navigation Links: 3 Lean Dropdown Overlays + Direct Pricing */}
        <nav ref={dropdownRef} className="hidden md:flex items-center gap-1.5 text-xs font-medium text-neutral-300">
          
          {/* 1. PRODUCT OVERLAY */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "product" ? null : "product")}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                openDropdown === "product"
                  ? "bg-white/10 text-white font-semibold"
                  : "hover:text-white hover:bg-white/[0.06] text-neutral-300"
              }`}
            >
              <span>{t("nav.product")}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${openDropdown === "product" ? "rotate-180 text-[#f8a87c]" : "text-neutral-500"}`}
              />
            </button>

            {openDropdown === "product" && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0c0e15]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <a
                  href="/#bots"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c] shrink-0 mt-0.5">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#f8a87c] transition-colors">
                      AI Employees
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.productAiEmployeesDesc")}
                    </div>
                  </div>
                </a>

                <a
                  href="/#hierarchy"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Workflow size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {t("nav.productMultiAgentTitle")}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.productMultiAgentDesc")}
                    </div>
                  </div>
                </a>

                <Link
                  to="/app"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {t("nav.productWorkspaceTitle")}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.productWorkspaceDesc")}
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* 2. SOLUTIONS & DEPLOYMENT OVERLAY */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "solutions" ? null : "solutions")}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                openDropdown === "solutions"
                  ? "bg-white/10 text-white font-semibold"
                  : "hover:text-white hover:bg-white/[0.06] text-neutral-300"
              }`}
            >
              <span>{t("nav.solutions")}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${openDropdown === "solutions" ? "rotate-180 text-[#f8a87c]" : "text-neutral-500"}`}
              />
            </button>

            {openDropdown === "solutions" && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[#0c0e15]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <a
                  href="/#on-premise"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <span>{t("nav.solOnPremTitle")}</span>
                      <span className="text-[9px] font-mono bg-emerald-400/15 text-emerald-400 px-1.5 py-0.2 rounded">{t("nav.solOnPremBadge")}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.solOnPremDesc")}
                    </div>
                  </div>
                </a>

                <Link
                  to="/marketplace"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-[#f8a87c]/15 border border-[#f8a87c]/30 flex items-center justify-center text-[#f8a87c] shrink-0 mt-0.5">
                    <Layers size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#f8a87c] transition-colors">
                      {t("nav.solRoleCatalogTitle")}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.solRoleCatalogDesc")}
                    </div>
                  </div>
                </Link>

                <div className="pt-2 mt-1 border-t border-white/[0.06] px-2.5 pb-1 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>{t("nav.solArchSecurity")}</span>
                  <a
                    href="/skyer-enterprise-whitepaper.md"
                    target="_blank"
                    className="text-[#f8a87c] hover:underline flex items-center gap-1 font-sans text-xs"
                  >
                    {t("nav.whitepaper")} <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 3. PLATFORM & RESOURCES OVERLAY */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "resources" ? null : "resources")}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                openDropdown === "resources"
                  ? "bg-white/10 text-white font-semibold"
                  : "hover:text-white hover:bg-white/[0.06] text-neutral-300"
              }`}
            >
              <span>{t("nav.resources")}</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${openDropdown === "resources" ? "rotate-180 text-[#f8a87c]" : "text-neutral-500"}`}
              />
            </button>

            {openDropdown === "resources" && (
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0c0e15]/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                <Link
                  to="/docs"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-[#f8a87c] transition-colors">
                      {t("nav.resDocsTitle")}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.resDocsDesc")}
                    </div>
                  </div>
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {t("nav.resTelemetryTitle")}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.resTelemetryDesc")}
                    </div>
                  </div>
                </Link>

                <a
                  href="https://community-agent360.antares.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.06] transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                      <span>{t("nav.resCommunityTitle")}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[11px] text-neutral-400 font-normal leading-relaxed mt-0.5">
                      {t("nav.resCommunityDesc")}
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Direct Link: Transparent Pricing */}
          <a
            href="/#pricing"
            className="px-3.5 py-1.5 rounded-full text-xs hover:text-white hover:bg-white/[0.06] transition-all text-neutral-300"
          >
            Pricing
          </a>
        </nav>

        {/* Right Action Controls: Clean Utility Cluster */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Selector (Auto Location: vi / en) */}
          <LanguageSelector />

          {/* Theme Selector (System / Light / Dark) */}
          <ThemeSelector />



          {/* Conditional Auth & App CTA */}
          {!hasSession ? (
            <>
              {/* Sign In Button */}
              <button
                type="button"
                onClick={handleSignIn}
                className="text-xs font-medium text-neutral-200 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn size={13} className="text-[#f8a87c]" />
                <span>{t("nav.signIn")}</span>
              </button>

              {/* Sign Up Button (When no session) */}
              <button
                type="button"
                onClick={handleSignUp}
                className="text-xs font-semibold bg-[#f8a87c] hover:bg-[#f5935f] text-black px-4 py-1.5 rounded-full transition-all shadow-[0_0_20px_rgba(248,168,124,0.3)] hover:shadow-[0_0_25px_rgba(248,168,124,0.5)] active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {/* Launch Workspace CTA (When authenticated) */}
              <Link
                to="/app"
                className="text-xs font-semibold bg-[#f8a87c] hover:bg-[#f5935f] text-black px-4 py-1.5 rounded-full transition-all shadow-[0_0_20px_rgba(248,168,124,0.3)] hover:shadow-[0_0_25px_rgba(248,168,124,0.5)] active:scale-95 cursor-pointer"
              >
                Launch App
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Slide-down Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0e15] border-b border-white/10 px-4 py-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Section 1: Core Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-1">{t("nav.mobilePlatform")}</span>
            <a
              href="/#bots"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-200 hover:text-white py-2 px-1"
            >
              AI Employees & Roles
            </a>
            <a
              href="/#on-premise"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-emerald-400 font-medium py-2 px-1 flex items-center gap-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{t("nav.solOnPremTitle")}</span>
            </a>
            <a
              href="/#hierarchy"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-[#f8a87c] font-medium py-2 px-1"
            >
              {t("nav.productMultiAgentTitle")}
            </a>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-200 hover:text-white py-2 px-1"
            >
              Marketplace Catalog
            </Link>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-200 hover:text-white py-2 px-1"
            >
              Pricing Tiers
            </a>
          </div>

          {/* Section 2: Resources & Docs */}
          <div className="pt-3 border-t border-white/10 space-y-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-1">Resources</span>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-2 px-1"
            >
              Documentation & Guides
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-2 px-1"
            >
              Fleet Telemetry Radar
            </Link>
            <a
              href="https://community-agent360.antares.vn"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-emerald-400 font-medium py-2 px-1 flex items-center justify-between"
            >
              <span>{t("nav.resCommunityTitle")}</span>
              <ExternalLink size={12} />
            </a>
            <a
              href="/skyer-enterprise-whitepaper.md"
              target="_blank"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white py-2 px-1 flex items-center justify-between"
            >
              <span>{t("nav.mobileWhitepaper")}</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Section 3: Language & Action Buttons */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-neutral-400 font-mono">{t("nav.langLabel")}</span>
              <LanguageSelector />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              {!hasSession ? (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleSignIn(e);
                    }}
                    className="text-center text-sm font-medium border border-[#f8a87c]/40 bg-[#f8a87c]/10 text-white py-2.5 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn size={14} className="text-[#f8a87c]" />
                    <span>{t("nav.signInSkyer")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleSignUp(e);
                    }}
                    className="text-center text-sm font-semibold bg-[#f8a87c] text-black py-2.5 rounded-full shadow-md cursor-pointer"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-semibold bg-[#f8a87c] text-black py-2.5 rounded-full shadow-md"
                >
                  Launch App
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
