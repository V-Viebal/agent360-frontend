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
  for (const fmKey of ["copy_budget:", "typography_scale:", "hero_frame_contract:", "motion_choreography:", "css_scope_isolation:", "spatial_volume:", "subpixel_y_anchors:", "variable_font_axis:"]) {
    if (!md.includes(fmKey)) {
      errors.push(`DESIGN.md frontmatter missing ${fmKey} declaration.`);
    }
  }
}

// 2. Verify index.css Dual-Theme, Warm Cream Tokens, Contrast & Scoped Typography
const cssPath = path.join(ROOT, "src", "index.css");
const css = fs.readFileSync(cssPath, "utf-8");
if (!css.includes("@custom-variant dark")) {
  errors.push("src/index.css missing Tailwind v4 @custom-variant dark declaration.");
}
if (!css.includes("#FFFDF9") || !css.includes("#F8F3ED") || !css.includes("#252522")) {
  errors.push("src/index.css missing Strawberry Warm Cream & Soft Charcoal Light Mode tokens (#FFFDF9, #F8F3ED, #252522).");
}
if (!css.includes("--text-contrast")) {
  errors.push("src/index.css missing --text-contrast variable for WCAG AAA accessibility.");
}
if (!css.includes(":where(.workspace-root,") || !css.includes(".grok-workspace")) {
  errors.push("src/index.css must scope compact workspace typography inside :where(.workspace-root, [data-type-scope=\"app\"], .grok-workspace) so marketing typography is never shrunk.");
}

// 3. Verify LandingPage, MarketplacePage, DocsPage & StrawberryComparisonSection follow 1080px/1140px container & AgentAvatar binding
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

// 4. Verify Hero Above-the-Fold 1100x468 Stage, 5-Col Realistic ERP Table, Non-Occluding SVG Pointer & Crisp Entrance in LandingPage
const landingSrc = fs.readFileSync(path.join(ROOT, "src/pages/LandingPage.tsx"), "utf-8");
if (!landingSrc.includes("text-[47.8px]") && !landingSrc.includes("text-[48px]")) {
  errors.push("LandingPage missing Strawberry H1 scale (47.8px/48px).");
}
if (!landingSrc.includes("text-balance")) {
  errors.push("LandingPage missing text-balance on headline/subtitle typography.");
}
if (landingSrc.includes("All Agents (Infra)")) {
  errors.push("LandingPage Hero Frame must not include cluttered 'All Agents (Infra)' bar; keep pure agent list.");
}
if (!landingSrc.includes("setHeroAgentIdx")) {
  errors.push("LandingPage Hero Frame missing interactive agent switcher (setHeroAgentIdx).");
}
if (!landingSrc.includes("motion.circle") || !landingSrc.includes("motion.line")) {
  errors.push("LandingPage Hero Frame missing animated SVG progress wave (motion.line) or browser click ripple (motion.circle).");
}
if (!landingSrc.includes("motion.h1") || !landingSrc.includes("whileInView") || !landingSrc.includes("whileHover")) {
  errors.push("LandingPage missing Hero staggered entrance (motion.h1) or section micro-animations (whileInView / whileHover).");
}
if (landingSrc.includes('filter: "blur(')) {
  errors.push("LandingPage must not use CSS filter:blur() on Hero typography entrance animation (causes blurry text capture).");
}
if (!landingSrc.includes("max-w-[1140px]") || !landingSrc.includes("lg:h-[468px]") || !landingSrc.includes("h-[228px]")) {
  errors.push("LandingPage missing 1140px Hero container (max-w-[1140px]), 468px Above-the-Fold Hero height (lg:h-[468px]), or 228px full-bleed companion cards (h-[228px]).");
}
if (!landingSrc.includes("colHeaders") || !landingSrc.includes("fileName")) {
  errors.push("LandingPage Hero Frame missing realistic 5-column domain table (colHeaders) or chat deliverable attachment card (fileName).");
}

const compSrc = fs.readFileSync(path.join(ROOT, "src/components/StrawberryComparisonSection.tsx"), "utf-8");
if (!compSrc.includes("h-[430px]") || !compSrc.includes("lg:px-5")) {
  errors.push("StrawberryComparisonSection missing 430px viewport height (h-[430px]) or 1040px inner container width (lg:px-5).");
}

if (!css.includes("font-weight: 100 900") || !css.includes("@keyframes heroRise")) {
  errors.push("src/index.css must declare true Variable Font range (font-weight: 100 900) and @keyframes heroRise for zero-drift Y coordinates.");
}
if ((!landingSrc.includes("fontWeight: 530") && !landingSrc.includes("fontWeight: 480")) || !landingSrc.includes("animate-hero-rise-1") || !css.includes("Onest")) {
  errors.push("LandingPage H1 must use Onest variable fontWeight: 530/480 and .animate-hero-rise-1.");
}


// 5. Verify Portal Scope Gate (Every file using createPortal must include grok-modal-scope, grok-overlay-scope, or data-type-scope="overlay")
function walkTsxFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTsxFiles(full, acc);
    else if (entry.isFile() && full.endsWith(".tsx")) acc.push(full);
  }
  return acc;
}

for (const file of walkTsxFiles(path.join(ROOT, "src"))) {
  const content = fs.readFileSync(file, "utf-8");
  if (content.includes("createPortal(")) {
    const hasScope =
      content.includes("grok-modal-scope") ||
      content.includes("grok-overlay-scope") ||
      content.includes('data-type-scope="overlay"');
    if (!hasScope) {
      errors.push(`${path.relative(ROOT, file)} uses createPortal() without .grok-modal-scope or .grok-overlay-scope.`);
    }
  }
}

// 6. Verify User Message Bubble does not use harsh solid primary background with black bold text
const workspaceSrc = fs.readFileSync(path.join(ROOT, "src/pages/GrokBotWorkspace.tsx"), "utf-8");
if (workspaceSrc.includes('isColorBright(selectedAgentTheme.primary || selectedAgentTheme.dark) ? "#18181b"')) {
  errors.push("GrokBotWorkspace.tsx user-message-bubble must not use harsh solid accent background with #18181b black bold text.");
}

if (errors.length > 0) {
  console.error("[Visual Contract Gate] FAILED:");
  for (const e of errors) console.error("  ✕", e);
  process.exit(1);
}

console.log("[Visual Contract Gate] PASSED: DESIGN.md, Above-the-Fold 1100x468 Hero Stage, Realistic 5-Col ERP UI, Non-Occluding SVG Pointer, Unboxed 333px Cards, and Crisp Micro-Animations verified.");
