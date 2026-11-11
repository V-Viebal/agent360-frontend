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
