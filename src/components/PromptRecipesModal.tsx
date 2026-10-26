import React, { useState, useEffect } from "react";
import { Sparkles, Trash2, Users } from "lucide-react";
import { Modal } from "./ui/Modal";
import { SearchInput } from "./ui/SearchInput";

export interface PromptRecipe {
  id: string;
  category: "Team" | "Code" | "Infra" | "Security" | "Architecture" | string;
  title: string;
  description: string;
  prompt: string;
  collaborators?: string[];
  playbook?: string;
  createdAt?: string;
  isCustomTeamRecipe?: boolean;
}

const SAVED_TEAM_RECIPES_STORAGE_KEY = "agent360_saved_team_recipes";

export function getSavedTeamRecipes(): PromptRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_TEAM_RECIPES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTeamRecipe(input: {
  title: string;
  description: string;
  prompt: string;
  collaborators?: string[];
  playbook?: string;
}): PromptRecipe {
  const existing = getSavedTeamRecipes();
  const cleanTitle = (input.title || "Team Workflow Recipe").trim();
  const cleanPrompt = (input.prompt || "").trim();
  const collabs = Array.from(new Set((input.collaborators || []).map((c) => c.replace(/^@/, "").toLowerCase()).filter(Boolean)));
  const newRecipe: PromptRecipe = {
    id: `team-rec-${Date.now().toString(36)}`,
    category: "Team",
    title: cleanTitle,
    description: input.description || (collabs.length > 0 ? `Phối hợp đội hình @${collabs.join(", @")}` : "Quy trình làm việc tái sử dụng từ phiên chat"),
    prompt: cleanPrompt,
    collaborators: collabs,
    playbook: input.playbook || (collabs.length >= 2 ? "deliberation" : collabs.length === 1 ? "consultation" : "solo"),
    createdAt: new Date().toISOString(),
    isCustomTeamRecipe: true,
  };

  const deduped = existing.filter(
    (r) => r.title.trim().toLowerCase() !== cleanTitle.toLowerCase() && r.prompt.trim() !== cleanPrompt
  );
  const updated = [newRecipe, ...deduped].slice(0, 30);
  try {
    localStorage.setItem(SAVED_TEAM_RECIPES_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("agent360_team_recipes_updated", { detail: { recipes: updated } }));
    }
  } catch {}
  return newRecipe;
}

export function deleteSavedTeamRecipe(recipeId: string): PromptRecipe[] {
  const existing = getSavedTeamRecipes();
  const updated = existing.filter((r) => r.id !== recipeId);
  try {
    localStorage.setItem(SAVED_TEAM_RECIPES_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("agent360_team_recipes_updated", { detail: { recipes: updated } }));
    }
  } catch {}
  return updated;
}

export const PROMPT_RECIPES: PromptRecipe[] = [
  {
    id: "rec-team-event-launch",
    category: "Team",
    title: "Chiến dịch & Sự kiện Toàn diện (Poster, Slide, Video & WBS)",
    description: "Phối hợp @climax-default, @zen và @planthy-pm chia đầu việc từ thiết kế, định giá đến lộ trình WBS",
    prompt: "@zen @climax-default @planthy-pm hãy chia đầu việc mỗi người một phần để lập kế hoạch tổng thể từ A-Z cho sự kiện kèm hình ảnh poster, bộ slide chiến dịch và video promo",
    collaborators: ["zen", "climax-default", "planthy-pm"],
    playbook: "task_decomposition",
  },
  {
    id: "rec-team-relay-pipeline",
    category: "Team",
    title: "Chuỗi Bàn giao Nối tiếp Ra mắt Sản phẩm (Relay Pipeline)",
    description: "Chạy nối tiếp @climax-default (Concept) → @zen (Định giá & ROI) → @planthy-pm (Timeline 90 ngày)",
    prompt: "@climax-default @zen @planthy-pm hãy làm lần lượt từng bước theo thứ tự rồi bàn giao sang nhau để lên gói ra mắt sản phẩm mới",
    collaborators: ["climax-default", "zen", "planthy-pm"],
    playbook: "relay_pipeline",
  },
  {
    id: "rec-code-review",
    category: "Code",
    title: "Rigorous Pull Request Review",
    description: "Audit code diff for race conditions, edge cases, and performance regressions",
    prompt: "Please conduct a rigorous code review on the latest changes. Focus on: (1) Concurrency and race conditions, (2) Error resilience & null handling, (3) Compliance with the 3 Immutable Principles (No Fake Done). Propose exact minimal fixes.",
  },
  {
    id: "rec-rca",
    category: "Infra",
    title: "Incident Root Cause Analysis (RCA)",
    description: "Analyze error logs, trace stack, and identify the root cause of an outage",
    prompt: "Perform a Root Cause Analysis (RCA) on the following incident evidence. Identify: (1) Primary root cause, (2) Contributing friction points, (3) Containment action, and (4) Permanent preventive runbook step.",
  },
  {
    id: "rec-security-audit",
    category: "Security",
    title: "Infra & Zero-Trust Secret Audit",
    description: "Audit Infisical paths, exposed tokens, and host isolation policy",
    prompt: "Execute an infrastructure security audit: verify that all container secrets resolve via process env and Infisical, verify no hardcoded secrets exist in workspace files, and inspect host network bindings.",
  },
  {
    id: "rec-arch-diagram",
    category: "Architecture",
    title: "System Architecture Flow & Sequence",
    description: "Generate a full architecture specification with Mermaid diagram",
    prompt: "Design the technical architecture for this requirement. Include: (1) Component interaction topology, (2) Data model contracts, and (3) A complete Mermaid sequence diagram illustrating the request/response flow.",
  },
  {
    id: "rec-refactor",
    category: "Code",
    title: "Clean Architecture Refactoring Plan",
    description: "Decompose monolithic functions into clean testable domain boundaries",
    prompt: "Review the targeted module and propose a clean refactoring plan. Extract domain models, isolate external I/O behind interfaces, and provide unit test coverage for critical paths.",
  },
];

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
      icon={<Sparkles size={16} className="text-[#f8a87c]" />}
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
                  ? "bg-[#f8a87c] border-[#f8a87c] text-black font-semibold shadow-xs"
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
            className="p-3.5 rounded-xl bg-white dark:bg-[#14141c] hover:bg-slate-100 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#22222e] hover:border-[#f8a87c]/40 transition-all cursor-pointer group shadow-xs space-y-1.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[#f8a87c] transition-colors truncate">
                  {recipe.title}
                </span>
                {recipe.isCustomTeamRecipe && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#f8a87c]/15 text-[#e0682b] dark:text-[#f8a87c] border border-[#f8a87c]/30 shrink-0 font-semibold">
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
              <span className="text-[#f8a87c] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
