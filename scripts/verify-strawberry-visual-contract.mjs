import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const errors = [];

// 1. Verify DESIGN.md frontmatter & 8 canonical sections
const designMdPath = path.join(ROOT, "DESIGN.md");
if (!fs.existsSync(designMdPath)) {
  errors.push("DESIGN.md is missing at frontend root.");
} else {
  const md = fs.readFileSync(designMdPath, "utf-8");
  const requiredSections = [
    "## Overview",
    "## Colors",
    "## Typography",
    "## Layout",
    "## Elevation & Depth",
    "## Shapes",
    "## Components",
    "## Do's and Don'ts",
  ];
  for (const sec of requiredSections) {
    if (!md.includes(sec)) {
      errors.push(`DESIGN.md missing canonical section: ${sec}`);
    }
  }
  if (!md.includes("copy_budget:")) {
    errors.push("DESIGN.md frontmatter missing copy_budget declaration.");
  }
}

// 2. Verify index.css Dual-Theme & Warm Cream Tokens
const cssPath = path.join(ROOT, "src", "index.css");
const css = fs.readFileSync(cssPath, "utf-8");
if (!css.includes("@custom-variant dark")) {
  errors.push("src/index.css missing Tailwind v4 @custom-variant dark declaration.");
}
if (!css.includes("#FFFDF9") || !css.includes("#F8F3ED") || !css.includes("#252522")) {
  errors.push("src/index.css missing Strawberry Warm Cream & Soft Charcoal Light Mode tokens (#FFFDF9, #F8F3ED, #252522).");
}

// 3. Verify LandingPage, MarketplacePage & DocsPage follow 1080px container & AgentAvatar binding
for (const rel of [
  "src/pages/LandingPage.tsx",
  "src/pages/MarketplacePage.tsx",
  "src/pages/DocsPage.tsx",
  "src/components/StrawberryComparisonSection.tsx",
]) {
  const full = path.join(ROOT, rel);
  const src = fs.readFileSync(full, "utf-8");
  if (!src.includes("max-w-[1080px]")) {
    errors.push(`${rel} does not enforce the 1080px Strawberry container (max-w-[1080px]).`);
  }
  if (!src.includes("AgentAvatar")) {
    errors.push(`${rel} does not bind native <AgentAvatar> (BlobAvatar) characters.`);
  }
}

if (errors.length > 0) {
  console.error("[Visual Contract Gate] FAILED:");
  for (const e of errors) console.error("  ✕", e);
  process.exit(1);
}

console.log("[Visual Contract Gate] PASSED: DESIGN.md, Dual-Theme Warm Cream/Obsidian tokens, 1080px container, and AgentAvatar bindings verified across LandingPage, MarketplacePage, DocsPage, and StrawberryComparisonSection.");
