import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot, ChevronDown, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isLinkActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#ff7a00] to-amber-400 p-[1px] shadow-[0_0_15px_rgba(255,122,0,0.25)]">
            <div className="h-full w-full bg-[#07090e] rounded-[11px] flex items-center justify-center group-hover:bg-transparent transition-colors">
              <Bot size={20} className="text-[#ff7a00] group-hover:text-black transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-tight text-white flex items-center gap-1.5">
              Agent360
              <span className="text-[10px] font-mono font-normal uppercase bg-[#ff7a00]/15 text-[#ff7a00] border border-[#ff7a00]/30 px-1.5 py-0.2 rounded-full">
                Bot
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-neutral-300">
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
            to="/docs"
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              isLinkActive("/docs")
                ? "bg-white/10 text-white font-semibold"
                : "hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Docs
          </Link>
          <Link
            to="/landing#bots"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all"
          >
            AI Teammates
          </Link>
          <a
            href="/landing#hierarchy"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all text-[#ff7a00]"
          >
            Hierarchical AI Workforce
          </a>
          <Link
            to="/landing#workflow"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all"
          >
            How it Works
          </Link>
          <Link
            to="/landing#architecture"
            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Architecture
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/workspace"
            className="text-xs font-medium text-neutral-300 hover:text-white px-3.5 py-2 rounded-full hover:bg-white/[0.06] transition-all"
          >
            Control Plane
          </Link>
          <a
            href="https://github.com/agentscope-ai/QwenPaw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-2 rounded-full hover:bg-white/[0.06] transition-all flex items-center gap-1"
          >
            <span>GitHub</span>
            <ArrowUpRight size={13} className="text-neutral-500" />
          </a>
          <Link
            to="/marketplace"
            className="text-xs font-medium bg-[#ff7a00] hover:bg-[#ff8f26] text-black px-4 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_25px_rgba(255,122,0,0.5)] active:scale-95"
          >
            Deploy Bot
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0d14] border-b border-white/10 px-4 py-6 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#ff7a00] font-semibold py-2"
          >
            Marketplace (AI Teammates Teammates)
          </Link>
          <Link
            to="/docs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 py-2"
          >
            Documentation
          </Link>
          <Link
            to="/landing#bots"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 py-2"
          >
            AI Teammates
          </Link>
          <a
            href="/landing#hierarchy"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-[#ff7a00] font-medium py-2"
          >
            Hierarchical AI Workforce
          </a>
          <Link
            to="/landing#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 py-2"
          >
            How it Works
          </Link>
          <Link
            to="/landing#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-neutral-200 py-2"
          >
            Architecture
          </Link>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/workspace"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium border border-white/10 text-white py-2 rounded-full"
            >
              Open Control Plane
            </Link>
            <Link
              to="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-sm font-medium bg-[#ff7a00] text-black py-2.5 rounded-full"
            >
              Deploy Bot
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
