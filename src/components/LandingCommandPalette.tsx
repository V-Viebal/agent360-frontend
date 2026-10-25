import { useTranslation } from "../i18n/LanguageContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Command, CornerDownLeft, Search } from "lucide-react";

export interface PaletteRole {
  id: string;
  title: string;
  promptExample: string;
}

interface Item {
  id: string;
  group: string;
  label: string;
  hint: string;
  run: () => void;
}

interface Props {
  roles: PaletteRole[];
  onSelectRole: (id: string) => void;
}

export function appTaskUrl(prompt: string, agent?: string) {
  const params = new URLSearchParams();
  if (prompt.trim()) params.set("prompt", prompt.trim());
  if (agent) params.set("agent", agent);
  const qs = params.toString();
  return qs ? `/app?${qs}` : "/app";
}

export function LandingCommandPalette({ roles, onSelectRole }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("skyer:open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("skyer:open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const close = () => setOpen(false);
    const scrollTo = (id: string) => () => {
      close();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const base: Item[] = [
      ...roles.map((r) => ({
        id: `role-${r.id}`,
        group: t("cmdPalette.groupBots"),
        label: `${t("cmdPalette.preview")} ${r.title}`,
        hint: r.promptExample,
        run: () => {
          onSelectRole(r.id);
          scrollTo("bots")();
        },
      })),
      { id: "nav-pricing", group: t("cmdPalette.groupNav"), label: t("cmdPalette.navPricing"), hint: t("cmdPalette.navPricingHint"), run: scrollTo("pricing") },
      { id: "nav-faq", group: t("cmdPalette.groupNav"), label: t("cmdPalette.navFaq"), hint: t("cmdPalette.navFaqHint"), run: scrollTo("faq") },
      { id: "nav-app", group: t("cmdPalette.groupNav"), label: t("cmdPalette.navApp"), hint: t("cmdPalette.navAppHint"), run: () => { close(); navigate("/app"); } },
      { id: "nav-docs", group: t("cmdPalette.groupNav"), label: t("cmdPalette.navDocs"), hint: t("cmdPalette.navDocsHint"), run: () => { close(); navigate("/docs"); } },
    ];
    const q = query.trim().toLowerCase();
    const filtered = q ? base.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q)) : base;
    if (q) {
      filtered.unshift({
        id: "delegate",
        group: t("cmdPalette.groupDelegate"),
        label: `${t("cmdPalette.delegatePrefix")} “${query.trim()}”`,
        hint: t("cmdPalette.delegateHint"),
        run: () => { close(); navigate(appTaskUrl(query)); },
      });
    }
    return filtered;
  }, [query, roles, navigate, onSelectRole]);

  useEffect(() => setCursor(0), [query]);

  if (!open) return null;

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[cursor]?.run();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-neutral-950/40 dark:bg-black/75 backdrop-blur-md px-4 pt-[12vh]"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Skyer command menu"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-neutral-200 dark:border-white/[0.1] bg-white dark:bg-[#0b0d12] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-white/[0.06] px-4 h-12">
          <Search size={15} className="text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onListKey}
            placeholder={t("cmdPalette.placeholder")}
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 outline-none"
            aria-activedescendant={items[cursor]?.id}
          />
          <kbd className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-white/10 rounded px-1.5 py-0.5 bg-neutral-100 dark:bg-white/[0.04]">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2" role="listbox">
          {items.map((item, idx) => (
            <li
              key={item.id}
              id={item.id}
              role="option"
              aria-selected={idx === cursor}
              onMouseEnter={() => setCursor(idx)}
              onClick={item.run}
              className={`mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                idx === cursor ? "bg-neutral-100 dark:bg-white/[0.06]" : ""
              }`}
            >
              <span className="w-16 shrink-0 text-[10px] font-mono uppercase tracking-wider text-neutral-500">{item.group}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm text-neutral-900 dark:text-white">{item.label}</span>
                <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">{item.hint}</span>
              </span>
              {idx === cursor && <CornerDownLeft size={13} className="text-slate-500 dark:text-neutral-400 shrink-0" />}
            </li>
          ))}
          {items.length === 0 && <li className="px-5 py-6 text-sm text-neutral-500">{t("cmdPalette.noMatches")}</li>}
        </ul>
        <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/[0.06] px-4 h-9 text-[11px] text-neutral-500 dark:text-neutral-400 bg-slate-50/50 dark:bg-transparent">
          <span className="flex items-center gap-1.5"><Command size={11} />{t("cmdPalette.toggleHelp")}</span>
          <span className="flex items-center gap-1">Enter <ArrowRight size={11} /></span>
        </div>
      </div>
    </div>
  );
}
