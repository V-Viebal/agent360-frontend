import { useTranslation } from "../i18n/LanguageContext";
import { CustomSelect } from "./ui/CustomSelect";
import { Modal } from "./ui/Modal";
import { SearchInput } from "./ui/SearchInput";
import { useState, useEffect } from "react";
import { SkillItem, fetchLiveSkills } from "../services/skillsApi";
import {
  Sparkles,
  Puzzle,
  Tag,
  RefreshCw,
} from "lucide-react";

interface SkillPoolModalProps {
  onClose: () => void;
  agentName: string;
}

export function SkillPoolModal({ onClose, agentName }: SkillPoolModalProps) {
  const { t } = useTranslation();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filterSource, setFilterSource] = useState<string>("all");

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveSkills();
      setSkills(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const filtered = skills.filter((s) => {
    const matchQuery =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase()));

    const matchSource =
      filterSource === "all" || s.source?.toLowerCase() === filterSource.toLowerCase();

    return matchQuery && matchSource;
  });

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Skill Pool & Capabilities Catalog"
      icon={<Puzzle size={18} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />}
      maxWidth="2xl"
    >
      {/* Toolbar */}
      <div className="p-4 bg-slate-50 dark:bg-[#16120f] border-b border-slate-200 dark:border-[#2b241e] flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[200px]">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search available skills and toolchains..."
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <CustomSelect
            value={filterSource}
            onChange={(val) => setFilterSource(val)}
            options={[
              { value: "all", label: t("skillPool.allSources") },
              { value: "custom", label: t("skillPool.customSkills") },
              { value: "customized", label: t("skillPool.customized") },
              { value: "builtin", label: t("skillPool.builtin") },
            ]}
          />

          <button
            type="button"
            data-ux-target-min="24"
            aria-label="Refresh Skill Pool"
            onClick={loadSkills}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#2b241e] bg-white dark:bg-[#0c0a08] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh Skill Pool"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Skills list */}
      <div className="p-6 overflow-y-auto space-y-3 max-h-[60vh]">
        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs font-mono">
            Loading skills from Skyer runtime adapter...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs font-mono">
            No skills match your search query.
          </div>
        ) : (
          filtered.map((skill) => (
            <div
              key={skill.name}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#161310] border border-slate-200 dark:border-[#2b241e] hover:border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] transition-all flex flex-col gap-2 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-800 dark:text-neutral-200 group-hover:text-[var(--agent-light)] dark:text-[var(--agent-dark)] transition-colors">
                    {skill.name}
                  </span>
                  {skill.source && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] flex items-center gap-1">
                      <Tag size={10} />
                      {skill.source}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-sans">
                {skill.description || "No description provided."}
              </p>

              {skill.channels && skill.channels.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-neutral-500 mr-1 flex items-center gap-1">
                    <Sparkles size={10} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />
                    Channels:
                  </span>
                  {skill.channels.map((t: string) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-white dark:bg-[#0c0a08] border border-slate-200 dark:border-white/10 text-[10px] font-mono text-neutral-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 dark:bg-[#16120f] border-t border-slate-200 dark:border-[#2b241e] flex items-center justify-between">
        <span className="text-[11px] text-neutral-400 font-sans">
          Assigned directly to <strong className="text-slate-800 dark:text-white font-mono">{agentName}</strong>
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-xl bg-[var(--agent-primary)] text-black font-semibold text-xs hover:opacity-90 transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
