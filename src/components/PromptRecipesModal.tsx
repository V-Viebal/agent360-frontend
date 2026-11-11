import React, { useState, useEffect } from "react";
import { Sparkles, Trash2, Users } from "lucide-react";
import { Modal } from "./ui/Modal";
import { SearchInput } from "./ui/SearchInput";
import { PROMPT_RECIPES, getSavedTeamRecipes, saveTeamRecipe, deleteSavedTeamRecipe, type PromptRecipe } from "../data/promptRecipes";

export { PROMPT_RECIPES, getSavedTeamRecipes, saveTeamRecipe, deleteSavedTeamRecipe, type PromptRecipe };


interface PromptRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (prompt: string, recipe?: PromptRecipe) => void;
}

export function PromptRecipesModal({ isOpen, onClose, onSelectRecipe }: PromptRecipesModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [customRecipes, setCustomRecipes] = useState<PromptRecipe[]>(() => getSavedTeamRecipes());

  useEffect(() => {
    if (isOpen) {
      setCustomRecipes(getSavedTeamRecipes());
    }
    const onUpdated = () => setCustomRecipes(getSavedTeamRecipes());
    window.addEventListener("agent360_team_recipes_updated", onUpdated);
    return () => window.removeEventListener("agent360_team_recipes_updated", onUpdated);
  }, [isOpen]);

  const categories = ["All", "Team", "Code", "Infra", "Security", "Architecture"];

  const allRecipes = [...customRecipes, ...PROMPT_RECIPES];
  const filtered = allRecipes.filter((r) => {
    const matchCat = selectedCat === "All" || r.category === selectedCat;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.prompt.toLowerCase().includes(search.toLowerCase()) ||
      (Array.isArray(r.collaborators) && r.collaborators.some((c) => c.toLowerCase().includes(search.toLowerCase())));
    return matchCat && matchSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Team Recipes & Workflow Templates"
      icon={<Sparkles size={16} className="text-[var(--agent-light)] dark:text-[var(--agent-dark)]" />}
      maxWidth="xl"
    >
      {/* Search & Category Tabs */}
      <div className="p-3 border-b border-slate-200 dark:border-[#1c1c24] bg-slate-50 dark:bg-[#14141a] space-y-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm Team Recipe, @agent hoặc mẫu quy trình..."
          className="w-full"
        />

        <div className="flex items-center gap-1 text-[10px] font-mono select-none flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-testid={`recipe-cat-tab-${cat.toLowerCase()}`}
              onClick={() => setSelectedCat(cat)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[var(--agent-primary)] border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] text-black font-semibold shadow-xs"
                  : "bg-white dark:bg-[#181822] border-slate-200 dark:border-[#242432] text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat === "Team" ? `Team (${customRecipes.length + PROMPT_RECIPES.filter((x) => x.category === "Team").length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes List */}
      <div className="p-3 max-h-[55vh] overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-[#0e0e14]">
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            data-testid={`recipe-card-${recipe.id}`}
            onClick={() => {
              onSelectRecipe(recipe.prompt, recipe);
              onClose();
            }}
            className="p-3.5 rounded-xl bg-white dark:bg-[#14141c] hover:bg-slate-100 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#22222e] hover:border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] transition-all cursor-pointer group shadow-xs space-y-1.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[var(--agent-light)] dark:text-[var(--agent-dark)] transition-colors truncate">
                  {recipe.title}
                </span>
                {recipe.isCustomTeamRecipe && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[var(--agent-bg-light)] dark:bg-[var(--agent-bg-dark)] text-[var(--agent-light)] dark:text-[var(--agent-dark)] dark:text-[var(--agent-light)] dark:text-[var(--agent-dark)] border border-[var(--agent-border-light)] dark:border-[var(--agent-border-dark)] shrink-0 font-semibold">
                    Đã lưu
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {recipe.collaborators && recipe.collaborators.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <Users size={9} />
                    <span>
                      {recipe.collaborators.slice(0, 3).map((c) => `@${c}`).join(" ")}
                      {recipe.collaborators.length > 3 ? ` +${recipe.collaborators.length - 3}` : ""}
                    </span>
                  </span>
                )}
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/10">
                  {recipe.category}
                </span>
                {recipe.isCustomTeamRecipe && (
                  <button
                    type="button"
                    data-testid={`delete-recipe-${recipe.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCustomRecipes(deleteSavedTeamRecipe(recipe.id));
                    }}
                    className="p-1 rounded-md text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Xóa Team Recipe này"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed font-sans">
              {recipe.description}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#1c1c24] text-[10px] font-mono text-neutral-500">
              <span className="truncate max-w-[85%]">{recipe.prompt.slice(0, 95)}</span>
              <span className="text-[var(--agent-light)] dark:text-[var(--agent-dark)] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Use ↵
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-neutral-500">
            Không tìm thấy Team Recipe phù hợp.
          </div>
        )}
      </div>
    </Modal>
  );
}
