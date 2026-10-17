import { useState, useEffect } from "react";
import { SkillItem, fetchLiveSkills } from "../services/skillsApi";
import {
  Sparkles,
  Search,
  Check,
  X,
  Puzzle,
  Tag,
  Radio,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";

interface SkillPoolModalProps {
  onClose: () => void;
  agentName: string;
}

export function SkillPoolModal({ onClose, agentName }: SkillPoolModalProps) {
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#120f0c] border border-[#d86f4c]/50 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#1a1410] border-b border-[#2b241e] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-[#d86f4c]">
            <Puzzle size={18} />
            <h3 className="font-semibold text-sm text-white font-sans">
              Skill Pool & Capabilities Catalog
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 dark:text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-[#16120f] border-b border-[#2b241e] flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search available skills and toolchains..."
              className="w-full bg-[#0c0a08] border border-[#2b241e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-[#d86f4c]/60 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-[#0c0a08] border border-[#2b241e] rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-neutral-300 font-mono focus:outline-none"
            >
              <option value="all">All Sources</option>
              <option value="custom">Custom Skills</option>
              <option value="customized">Customized</option>
              <option value="builtin">Built-in</option>
            </select>

            <button
              onClick={loadSkills}
              className="p-1.5 rounded-lg border border-[#2b241e] bg-[#0c0a08] text-slate-500 dark:text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Skill Pool"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Skills list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
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
                className="bg-slate-50 dark:bg-[#17120e] border border-[#26201a] hover:border-[#d86f4c]/30 rounded-xl p-3.5 flex items-start justify-between gap-4 transition-all"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-xs text-white">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/5 border border-white/10 text-slate-500 dark:text-neutral-400">
                      {skill.source || "repo"}
                    </span>
                    {skill.enabled && (
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Check size={11} />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-sans line-clamp-2">
                    {skill.description || "Skill definition and operational runbook for autonomous execution."}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer border ${
                      skill.enabled
                        ? "bg-[#26211d] text-slate-700 dark:text-neutral-300 border-[#382f28] hover:bg-[#382f28]"
                        : "bg-[#d86f4c] text-white border-transparent hover:bg-[#c2410c]"
                    }`}
                  >
                    {skill.enabled ? "Configured" : "Attach"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-[#17120e] border-t border-[#2b241e] flex justify-between items-center text-[11px] text-neutral-500 font-mono">
          <span>{filtered.length} capabilities loaded on {agentName}</span>
          <button
            onClick={onClose}
            className="hover:text-slate-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
