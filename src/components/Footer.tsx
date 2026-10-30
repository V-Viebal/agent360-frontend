import { useState } from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { SkyerLogo } from "./SkyerLogo";
import { ArrowUpRight, ShieldCheck, Mail, Bot } from "lucide-react";
import { ContactModal } from "./ContactModal";

export function Footer() {
  const { t } = useTranslation();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<"general" | "request_agent" | "enterprise">("general");

  const openContact = (cat: "general" | "request_agent" | "enterprise") => {
    setModalCategory(cat);
    setContactModalOpen(true);
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-page)] transition-colors text-neutral-400 text-xs py-16">
      <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <SkyerLogo size={28} />
            <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>{t("footer.operational")}</span>
            </div>
            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => openContact("request_agent")}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#f8a87c]/40 hover:text-[#f8a87c] transition-all text-[11px] font-medium w-fit cursor-pointer"
              >
                <Bot size={13} />
                <span>Yêu cầu Nhân viên AI Mới</span>
              </button>
              <button
                type="button"
                onClick={() => openContact("general")}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-[#f8a87c]/40 hover:text-[#f8a87c] transition-all text-[11px] font-medium w-fit cursor-pointer"
              >
                <Mail size={13} />
                <span>Liên hệ tư vấn giải pháp</span>
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-900 dark:text-white font-semibold text-xs tracking-tight">{t("footer.product")}</h4>
            <ul className="space-y-2">
              <li><a href="/#bots" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.botCatalog")}</a></li>
              <li><a href="/#workflow" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.routineAutomation")}</a></li>
              <li><a href="/#architecture" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.agentKernel")}</a></li>
              <li><a href="/#faq" className="hover:text-neutral-900 dark:hover:text-white transition-colors">{t("footer.auditTrail")}</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => openContact("request_agent")}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 text-xs cursor-pointer"
                >
                  <span>Đặt hàng Agent theo yêu cầu</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-900 dark:text-white font-semibold text-xs tracking-tight">{t("footer.ecosystem")}</h4>
            <ul className="space-y-2">
              <li><a href="https://community-agent360.antares.vn" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"><span>{t("footer.forum")}</span> <ArrowUpRight size={11} /></a></li>
              <li><a href="https://kb.hmz.one" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">KB Single Source of Truth <ArrowUpRight size={11} /></a></li>
              <li><a href="https://github.com/v-viebal/agent360" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">Skyer Upstream <ArrowUpRight size={11} /></a></li>
              <li><a href="https://iam360-api-gm.hmz.one" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">IAM360 Authority Gateway <ArrowUpRight size={11} /></a></li>
              <li><a href="https://cloud.giamoc.com" target="_blank" rel="noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">BaseCore Deck Projection <ArrowUpRight size={11} /></a></li>
            </ul>
          </div>

          {/* Compliance & Security */}
          <div className="space-y-2.5">
            <h4 className="text-neutral-900 dark:text-white font-semibold text-xs tracking-tight">{t("footer.governance")}</h4>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/5 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-300 font-medium">
                <ShieldCheck size={14} className="text-[#f8a87c]" />
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
            <button
              type="button"
              onClick={() => openContact("general")}
              className="hover:text-neutral-300 transition-colors cursor-pointer"
            >
              Liên hệ
            </button>
            <span>•</span>
            <a href="/#architecture" className="hover:text-neutral-400">{t("footer.sandbox")}</a>
            <span>•</span>
            <a href="/docs" className="hover:text-neutral-400">{t("footer.policy")}</a>
            <span>•</span>
            <a href="/analytics" className="hover:text-neutral-400">{t("footer.radar")}</a>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        defaultCategory={modalCategory}
      />
    </footer>
  );
}
