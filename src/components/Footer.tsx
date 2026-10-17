import { Bot, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070a] text-neutral-400 text-xs py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <div className="h-6 w-6 rounded-md bg-[#ff7a00] flex items-center justify-center text-black font-bold">
                <Bot size={14} />
              </div>
              <span>Skyer Platform</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Multi-bot control plane for enterprise engineering & autonomous infrastructure delivery.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>All systems operational • v2.2.1</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-medium text-xs uppercase tracking-wider font-mono">Product</h4>
            <ul className="space-y-2">
              <li><a href="#bots" className="hover:text-white transition-colors">Bot Catalog</a></li>
              <li><a href="#workflow" className="hover:text-white transition-colors">Routine Automation</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">Agent Kernel & ACP</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Epistemic Truth Guard</a></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-medium text-xs uppercase tracking-wider font-mono">Ecosystem</h4>
            <ul className="space-y-2">
              <li><a href="https://community-agent360.antares.vn" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"><span>Community Forum (Ready to Post)</span> <ArrowUpRight size={11} /></a></li>
              <li><a href="https://kb.hmz.one" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">KB Single Source of Truth <ArrowUpRight size={11} /></a></li>
              <li><a href="https://github.com/agentscope-ai/QwenPaw" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">QwenPaw Upstream <ArrowUpRight size={11} /></a></li>
              <li><a href="https://iam360-api-gm.hmz.one" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">IAM360 Authority Gateway <ArrowUpRight size={11} /></a></li>
              <li><a href="https://cloud.giamoc.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Nextcloud Deck Projection <ArrowUpRight size={11} /></a></li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-2.5">
            <h4 className="text-white font-medium text-xs uppercase tracking-wider font-mono">Governance</h4>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <ShieldCheck size={14} className="text-[#ff7a00]" />
                <span>No Fake Done Policy</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Strict epistemic separation: every action requires observed exit codes, pixel proofs, and authoritative readback receipts.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Skyer. All rights reserved. Designed with Awwwards visual excellence.
          </div>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-neutral-400">Security Sandbox</a>
            <span>•</span>
            <a href="#terms" className="hover:text-neutral-400">Constitution Policy</a>
            <span>•</span>
            <a href="#status" className="hover:text-neutral-400">System Radar</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
