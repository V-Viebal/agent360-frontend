import { useTranslation } from "../i18n/LanguageContext";
import { SkyerLogo } from "./SkyerLogo";
import { Bot, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-page)] transition-colors text-neutral-400 text-xs py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <SkyerLogo size={28} />
            <p className="text-neutral-400 text-xs leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t("footer.operational")}</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-900 dark:text-white font-medium text-xs uppercase tracking-wider font-mono">{t("footer.product")}</h4>
            <ul className="space-y-2">
              <li><a href="/#bots" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.botCatalog")}</a></li>
              <li><a href="/#workflow" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.routineAutomation")}</a></li>
              <li><a href="/#architecture" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.agentKernel")}</a></li>
              <li><a href="/#faq" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.auditTrail")}</a></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-900 dark:text-white font-medium text-xs uppercase tracking-wider font-mono">{t("footer.ecosystem")}</h4>
            <ul className="space-y-2">
              <li><a href="https://community-agent360.antares.vn" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-medium"><span>{t("footer.forum")}</span> <ArrowUpRight size={11} /></a></li>
              <li><a href="https://kb.hmz.one" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">KB Single Source of Truth <ArrowUpRight size={11} /></a></li>
              <li><a href="https://github.com/agentscope-ai/QwenPaw" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">QwenPaw Upstream <ArrowUpRight size={11} /></a></li>
              <li><a href="https://iam360-api-gm.hmz.one" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">IAM360 Authority Gateway <ArrowUpRight size={11} /></a></li>
              <li><a href="https://cloud.giamoc.com" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">Nextcloud Deck Projection <ArrowUpRight size={11} /></a></li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-900 dark:text-white font-medium text-xs uppercase tracking-wider font-mono">{t("footer.governance")}</h4>
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <ShieldCheck size={14} className="text-[#ff7a00]" />
                <span>{t("footer.proofTitle")}</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-normal">
                {t("footer.proofDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Skyer. {t("footer.rights")}
          </div>
          <div className="flex items-center gap-4">
            <a href="/#architecture" className="hover:text-neutral-400">{t("footer.sandbox")}</a>
            <span>•</span>
            <a href="/docs" className="hover:text-neutral-400">{t("footer.policy")}</a>
            <span>•</span>
            <a href="/analytics" className="hover:text-neutral-400">{t("footer.radar")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
