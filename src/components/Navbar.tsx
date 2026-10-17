import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot, Menu, X, ArrowUpRight, Sparkles, LogIn } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();

  const isLinkActive = (path: string) => location.pathname === path;

  // ScrollSpy for landing page section anchors
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = ["bots", "hierarchy", "workflow", "architecture", "pricing", "faq"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let currentSection = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#ff7a00] to-amber-400 p-[1px] shadow-[0_0_15px_rgba(255,122,0,0.25)]">
            <div className="h-full w-full bg-[#07090e] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <Bot size={20} className="text-[#ff7a00] group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
              Skyer
              <span className="text-[10px] font-mono font-normal uppercase bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 px-1.5 py-0.2 rounded-full">
                Bot
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links aligned to GrokBot style with ScrollSpy indicator */}
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-neutral-300">
          <a
            href="/#bots"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              location.pathname === "/" && activeSection === "bots"
                ? "bg-white/10 text-[#ff7a00] font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Bots
          </a>
          <a
            href="/#hierarchy"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              location.pathname === "/" && activeSection === "hierarchy"
                ? "bg-white/10 text-[#ff7a00] font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Multi-Agent
          </a>
          <a
            href="/#workflow"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              location.pathname === "/" && activeSection === "workflow"
                ? "bg-white/10 text-[#ff7a00] font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            How it Works
          </a>
          <a
            href="/#architecture"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              location.pathname === "/" && activeSection === "architecture"
                ? "bg-white/10 text-[#ff7a00] font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Architecture
          </a>
          <Link
            to="/marketplace"
            className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              isLinkActive("/marketplace")
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            <Sparkles size={13} className="text-[#ff7a00]" />
            <span>Marketplace</span>
          </Link>
          <Link
            to="/analytics"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              isLinkActive("/analytics")
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Analytics
          </Link>
          <Link
            to="/docs"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              isLinkActive("/docs")
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Docs
          </Link>
          <a
            href="https://community-agent360.antares.vn"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1 rounded-full hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5 text-neutral-300 text-xs"
            title="Join Skyer Community Forum"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Community</span>
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="https://github.com/agentscope-ai/QwenPaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-400 hover:text-white px-3 py-2 rounded-full hover:bg-white/[0.06] transition-all flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} className="text-neutral-500" />
          </a>

          {/* SIGN IN BUTTON -> DIRECT ENTRY TO /app */}
          <Link
            to="/app"
            className="text-xs font-medium text-neutral-200 hover:text-white px-3.5 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogIn size={13} className="text-[#ff7a00]" />
            <span>Sign In</span>
          </Link>

          <Link
            to="/app"
            className="text-xs font-medium bg-[#ff7a00] hover:bg-[#ff8f26] text-black px-4 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_25px_rgba(255,122,0,0.5)] active:scale-95"
          >
            Launch App
          </Link>
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d14] border-b border-white/10 px-4 py-6 space-y-2">
          <a
            href="/#bots"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 hover:text-white py-2"
          >
            Bots & AI Teammates
          </a>
          <a
            href="/#hierarchy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#ff7a00] font-medium py-2"
          >
            Multi-Agent Topology
          </a>
          <a
            href="/#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 hover:text-white py-2"
          >
            How it Works
          </a>
          <a
            href="/#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 hover:text-white py-2"
          >
            Architecture
          </a>
          <div className="pt-2 border-t border-white/10 space-y-1">
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-200 hover:text-white py-2"
            >
              Marketplace
            </Link>
            <Link
              to="/analytics"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-200 hover:text-white py-2"
            >
              Analytics & Telemetry
            </Link>
            <Link
              to="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-neutral-200 hover:text-white py-2"
            >
              Documentation
            </Link>
            <a
              href="https://community-agent360.antares.vn"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-emerald-400 font-medium py-2 flex items-center justify-between"
            >
              <span>Community Forum (Discourse)</span>
              <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">Ready to Post</span>
            </a>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium border border-[#ff7a00]/40 bg-[#ff7a00]/10 text-white py-2 rounded-full flex items-center justify-center gap-2"
            >
              <LogIn size={14} className="text-[#ff7a00]" />
              <span>Sign In to Skyer</span>
            </Link>
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium bg-[#ff7a00] text-black py-2.5 rounded-full"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
