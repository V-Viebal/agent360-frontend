import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Modal } from "./ui/Modal";
import { SearchInput } from "./ui/SearchInput";

export interface PromptRecipe {
  id: string;
  category: "Code" | "Infra" | "Security" | "Architecture";
  title: string;
  description: string;
  prompt: string;
}

export const PROMPT_RECIPES: PromptRecipe[] = [
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
  onSelectRecipe: (prompt: string) => void;
}

export function PromptRecipesModal({ isOpen, onClose, onSelectRecipe }: PromptRecipesModalProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");

  const categories = ["All", "Code", "Infra", "Security", "Architecture"];

  const filtered = PROMPT_RECIPES.filter((r) => {
    const matchCat = selectedCat === "All" || r.category === selectedCat;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.prompt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prompt Recipes & Task Templates"
      icon={<Sparkles size={16} className="text-[#ff7a00]" />}
      maxWidth="xl"
    >
      {/* Search & Category Tabs */}
      <div className="p-3 border-b border-slate-200 dark:border-[#1c1c24] bg-slate-50 dark:bg-[#14141a] space-y-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search templates (e.g. review, RCA, security)..."
          className="w-full"
        />

        <div className="flex items-center gap-1 text-[10px] font-mono select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#ff7a00] border-[#ff7a00] text-black font-semibold shadow-xs"
                  : "bg-white dark:bg-[#181822] border-slate-200 dark:border-[#242432] text-slate-500 dark:text-neutral-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes List */}
      <div className="p-3 max-h-[55vh] overflow-y-auto space-y-2 bg-slate-50/50 dark:bg-[#0e0e14]">
        {filtered.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => {
              onSelectRecipe(recipe.prompt);
              onClose();
            }}
            className="p-3.5 rounded-xl bg-white dark:bg-[#14141c] hover:bg-slate-100 dark:hover:bg-[#1c1c28] border border-slate-200 dark:border-[#22222e] hover:border-[#ff7a00]/40 transition-all cursor-pointer group shadow-xs space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-white group-hover:text-[#ff7a00] transition-colors">
                {recipe.title}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-white/5 text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-white/10 shrink-0">
                {recipe.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed font-sans">
              {recipe.description}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-[#1c1c24] text-[10px] font-mono text-neutral-500">
              <span className="truncate max-w-[85%]">{recipe.prompt.slice(0, 90)}...</span>
              <span className="text-[#ff7a00] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Use ↵
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-neutral-500">
            No prompt recipes matching query.
          </div>
        )}
      </div>
    </Modal>
  );
}
