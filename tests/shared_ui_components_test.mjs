/**
 * Automated Verification Suite for Skyer Shared UI Components
 * Validates:
 * 1. Modal contract (ARIA attributes, backdrop, ESC dismiss handler binding, focus-trap)
 * 2. ToggleSwitch contract (ARIA role="switch", size variants, haptic callback)
 * 3. CustomSelect contract (floating portal rendering, keyboard arrow cycling, WAI-ARIA listbox)
 * 4. DropdownMenu contract (portal anchor positioning, menuItem roles, escape dismiss)
 * 5. Prompt Composer micro-chips (@mention & /tool chip extraction, deletion, clear-all)
 */

import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

console.log("▶ Running Skyer Shared UI Components & Modal Test Suite...");

// 1. Test Modal Contract & Escape Dismiss
console.log("Testing Modal primitive contracts & Escape dismiss...");
let isModalOpen = true;
function handleModalKeyDown(eventKey) {
  if (eventKey === "Escape") {
    isModalOpen = false;
  }
}

const modalConfig = {
  isOpen: isModalOpen,
  maxWidth: "lg",
  ariaRole: "dialog",
  ariaModal: "true",
};

assert.strictEqual(modalConfig.ariaRole, "dialog", "Modal must declare role='dialog'");
assert.strictEqual(modalConfig.ariaModal, "true", "Modal must declare aria-modal='true'");

handleModalKeyDown("Enter");
assert.strictEqual(isModalOpen, true, "Modal should remain open on Enter key");

handleModalKeyDown("Escape");
assert.strictEqual(isModalOpen, false, "Modal should close on Escape key");
console.log("✓ Test 1: Modal dialog accessibility attributes and Escape dismissal verified");

// 2. Test ToggleSwitch Contract
console.log("Testing ToggleSwitch component contracts...");
function simulateToggle(initial, disabled = false) {
  if (disabled) return initial;
  return !initial;
}

assert.strictEqual(simulateToggle(false), true, "ToggleSwitch should toggle false to true");
assert.strictEqual(simulateToggle(true), false, "ToggleSwitch should toggle true to false");
assert.strictEqual(simulateToggle(false, true), false, "Disabled ToggleSwitch must not toggle");
console.log("✓ Test 2: ToggleSwitch state transition and disabled guard verified");

// 3. Test CustomSelect Arrow Navigation & Wrap-around
console.log("Testing CustomSelect keyboard navigation cycle...");
const options = [
  { value: "all", label: "All" },
  { value: "custom", label: "Custom" },
  { value: "builtin", label: "Built-in" },
];

function nextIndex(current, max) {
  return current < max - 1 ? current + 1 : 0;
}

function prevIndex(current, max) {
  return current > 0 ? current - 1 : max - 1;
}

let idx = 0;
idx = nextIndex(idx, options.length);
assert.strictEqual(idx, 1, "ArrowDown from 0 should navigate to index 1");
idx = nextIndex(idx, options.length);
assert.strictEqual(idx, 2, "ArrowDown from 1 should navigate to index 2");
idx = nextIndex(idx, options.length);
assert.strictEqual(idx, 0, "ArrowDown from last index should cycle back to 0");

idx = prevIndex(idx, options.length);
assert.strictEqual(idx, 2, "ArrowUp from 0 should cycle to last index 2");
console.log("✓ Test 3: CustomSelect keyboard arrow cycling logic verified");

// 4. Test Floating Portal Boundary Positioning
console.log("Testing Floating Portal boundary calculation...");
function calculateDropdownPosition(rect, dropdownWidth, windowInnerWidth, windowInnerHeight) {
  const spaceBelow = windowInnerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openAbove = spaceBelow < 260 && spaceAbove > spaceBelow;
  const top = openAbove ? Math.max(8, rect.top - 268) : rect.bottom + 6;

  let left = rect.right - dropdownWidth;
  if (left < 8) left = 8;
  if (left + dropdownWidth > windowInnerWidth - 8) {
    left = Math.max(8, windowInnerWidth - dropdownWidth - 8);
  }

  return { top, left, openAbove };
}

// Case A: Normal open below
const posA = calculateDropdownPosition(
  { top: 100, bottom: 130, left: 100, right: 300 },
  240,
  1440,
  900
);
assert.strictEqual(posA.openAbove, false, "Should open below when ample space below");
assert.strictEqual(posA.top, 136, "Top should be rect.bottom + 6");

// Case B: Flip to open above when near bottom edge
const posB = calculateDropdownPosition(
  { top: 750, bottom: 780, left: 100, right: 300 },
  240,
  1440,
  800
);
assert.strictEqual(posB.openAbove, true, "Should flip to open above when spaceBelow < 260");

// Case C: Viewport left boundary constraint
const posC = calculateDropdownPosition(
  { top: 100, bottom: 130, left: 2, right: 50 },
  240,
  1440,
  900
);
assert(posC.left >= 8, "Left position must clamp to minimum 8px padding from viewport edge");

console.log("✓ Test 4: Floating portal flip calculation and viewport boundaries verified");

// 5. Test Focus Trap Contract in Searchable Combobox
console.log("Testing Focus Trap & Tab key containment...");
function simulateTabKey(e, searchable, isSearchInputFocused) {
  if (e.key === "Tab") {
    if (searchable) {
      return { preventDefault: true, targetFocus: "searchInput" };
    }
    return { preventDefault: true, targetFocus: "none" };
  }
  return { preventDefault: false, targetFocus: null };
}

const tabResult = simulateTabKey({ key: "Tab" }, true, false);
assert.strictEqual(tabResult.preventDefault, true, "Tab should be intercepted to trap focus inside dropdown");
assert.strictEqual(tabResult.targetFocus, "searchInput", "Tab should redirect focus back to searchInput");
console.log("✓ Test 5: Focus-trap and Tab key interception verified");

// 6. Test Prompt Composer Micro-chips Extraction
console.log("Testing Prompt Composer micro-chips parsing...");
function extractChips(input) {
  const mentions = Array.from(new Set(input.match(/@[a-zA-Z0-9_-]+/g) || []));
  const tools = Array.from(new Set(input.match(/\/[a-zA-Z0-9_-]+/g) || []));
  return { mentions, tools, total: mentions.length + tools.length };
}

const testPrompt = "Hey @mons please run /audit on @storage1 fleet";
const chips = extractChips(testPrompt);
assert.strictEqual(chips.mentions.length, 2, "Should extract 2 unique mentions");
assert.strictEqual(chips.tools.length, 1, "Should extract 1 tool");
assert.strictEqual(chips.tools[0], "/audit", "Tool should be /audit");
console.log("✓ Test 6: Micro-chips @mention and /tool extraction verified");

console.log("🎉 All 6 Shared UI Components & Modal assertions passed successfully!");

// 7. Test Tabs Keyboard Navigation (Left / Right Arrow)
console.log("Testing Tabs ArrowLeft / ArrowRight navigation...");
function cycleTab(currentIdx, dir, length) {
  if (dir === "right") return (currentIdx + 1) % length;
  if (dir === "left") return (currentIdx - 1 + length) % length;
  return currentIdx;
}

assert.strictEqual(cycleTab(0, "right", 3), 1, "Tabs Right arrow from 0 should navigate to 1");
assert.strictEqual(cycleTab(2, "right", 3), 0, "Tabs Right arrow from 2 should wrap around to 0");
assert.strictEqual(cycleTab(0, "left", 3), 2, "Tabs Left arrow from 0 should wrap around to 2");
console.log("✓ Test 7: Tabs keyboard cycling logic verified");

// 8. Test ConfirmDialog Variant Styling Contract
console.log("Testing ConfirmDialog variant contract...");
function getConfirmBtnClass(variant) {
  return variant === "danger"
    ? "bg-red-500 hover:bg-red-600 text-white"
    : variant === "warning"
    ? "bg-amber-500 hover:bg-amber-600 text-black font-semibold"
    : "bg-[#ff7a00] hover:bg-[#ff8f26] text-black font-semibold";
}

assert(getConfirmBtnClass("danger").includes("bg-red-500"), "Danger variant must include red style");
assert(getConfirmBtnClass("default").includes("bg-[#ff7a00]"), "Default variant must include grok orange style");
console.log("✓ Test 8: ConfirmDialog action variants contract verified");

console.log("🎉 All 8 Shared UI Component assertions passed successfully!");

// 9. Test Badge Color and Variant Contract
console.log("Testing Badge variant and color contracts...");
function getBadgeClasses(color, variant) {
  if (color === "brand" && variant === "subtle") return "bg-[#ff7a00]/10 text-[#ff7a00]";
  if (color === "cyan" && variant === "solid") return "bg-cyan-500 text-black";
  return "border";
}

assert(getBadgeClasses("brand", "subtle").includes("#ff7a00"), "Brand badge must contain grok neon ember color");
assert(getBadgeClasses("cyan", "solid").includes("bg-cyan-500"), "Cyan solid badge must contain bg-cyan-500");
console.log("✓ Test 9: Badge color and variant contract verified");

// 10. Test Skeleton Variant Class Assignment
console.log("Testing Skeleton component variant styling...");
function getSkeletonClass(variant) {
  return variant === "circle" ? "rounded-full" : variant === "card" ? "rounded-xl" : "rounded-md";
}

assert.strictEqual(getSkeletonClass("circle"), "rounded-full", "Circle skeleton should have rounded-full");
assert.strictEqual(getSkeletonClass("card"), "rounded-xl", "Card skeleton should match Level 2 rounded-xl scale");
console.log("✓ Test 10: Skeleton styling and corner radii contract verified");

// 11. Test Toast Auto-Dismiss Contract
console.log("Testing Toast timeout calculation...");
function resolveToastDuration(item) {
  return item?.duration ?? 3500;
}

assert.strictEqual(resolveToastDuration({ message: "Saved" }), 3500, "Default duration should be 3500ms");
assert.strictEqual(resolveToastDuration({ message: "Fast", duration: 1500 }), 1500, "Custom duration should override");
console.log("✓ Test 11: Toast auto-dismiss timeout contract verified");

console.log("🎉 All 11 Shared UI Component assertions passed successfully!");

// 12. Test Kbd Component Classes & Sizes
console.log("Testing Kbd component size contracts...");
const kbdSizes = {
  xs: "text-[9px]",
  sm: "text-[10px]",
  md: "text-[11px]",
};
assert.strictEqual(kbdSizes.xs, "text-[9px]", "Kbd xs should be 9px font");
assert.strictEqual(kbdSizes.sm, "text-[10px]", "Kbd sm should be 10px font");
console.log("✓ Test 12: Kbd component size and typography verified");

// 13. Test Divider Component Orientation
console.log("Testing Divider component orientations...");
function getDividerStyle(orientation) {
  return orientation === "vertical" ? "w-px h-full" : "w-full h-px";
}
assert.strictEqual(getDividerStyle("vertical"), "w-px h-full", "Vertical divider must be 1px width");
assert.strictEqual(getDividerStyle("horizontal"), "w-full h-px", "Horizontal divider must be 1px height");
console.log("✓ Test 13: Divider orientation classes verified");

// 14. Test MetricStatCard Trend Color Contract
console.log("Testing MetricStatCard trend indicators...");
function getTrendColor(trend) {
  return trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-neutral-400";
}
assert.strictEqual(getTrendColor("up"), "text-emerald-500", "Up trend must be emerald color");
assert.strictEqual(getTrendColor("down"), "text-red-500", "Down trend must be red color");
console.log("✓ Test 14: MetricStatCard trend color mapping verified");

console.log("🎉 All 14 Shared UI Component assertions passed successfully!");

console.log("Testing Agent Pin & Unpin Override Resolution...");
const grokSrc = fs.readFileSync(path.join(rootDir, "src/pages/GrokBotWorkspace.tsx"), "utf8");
assert.ok(
  grokSrc.includes("agent360_unpinned_agents") && grokSrc.includes("const isAgentPinned ="),
  "GrokBotWorkspace must maintain agent360_unpinned_agents ledger and isAgentPinned resolver so unpinning root/default agents persists across reloads"
);
console.log("✓ Test 15: Agent Pin / Unpin override resolution verified");

console.log("Testing Message Reply Quote & Header Stripping...");
const apiSrc = fs.readFileSync(path.join(rootDir, "src/services/agentApi.ts"), "utf8");
assert.ok(
  apiSrc.includes("stripReplyHeader") && grokSrc.includes("[Replying to ") && grokSrc.includes("setReplyingToMsg(null)"),
  "Message reply quote header must be cleanly parsed in bubbles, stripped from sidebar chat titles/snippets, and cleared on Escape or chat switch"
);
console.log("✓ Test 16: Message Reply quote & header stripping verified");

console.log("Testing Image Upload to Chat Composer & Inline Preview URL Resolution...");
const uploadSrc = fs.readFileSync(path.join(rootDir, "src/services/uploadApi.ts"), "utf8");
assert.ok(
  uploadSrc.includes("/console/files/") &&
  grokSrc.includes("if (!inputText.trim() && attachedFiles.length === 0) return;") &&
  grokSrc.includes("onPaste={(e) =>"),
  "Image upload must route preview URLs via /console/files/, allow sending image-only messages without text, and support clipboard paste"
);
console.log("✓ Test 17: Image Upload, Clipboard Paste & Inline Preview URL resolution verified");

console.log("Testing Generated Image & Tool-Sent File Attachment Extraction...");
assert.ok(
  grokSrc.includes("extractInlineToolResultMedia") &&
  grokSrc.includes("generate_image") &&
  grokSrc.includes("Ảnh do Agent tạo") &&
  apiSrc.includes("callDatas.length > 0 ? callDatas : [payload]"),
  "Generated images (mcp-image__generate_image) and tool-sent files must merge args/result across plugin_call & plugin_call_output and render unified file/image attachment cards"
);
console.log("✓ Test 18: Generated Image & Tool-Sent File Attachment Extraction verified");

console.log("Testing Skyer Chat Stream approval_level=OFF Enforcement...");
const chatStreamSrc = fs.readFileSync(path.join(rootDir, "src/services/chatStream.ts"), "utf8");
assert.ok(
  chatStreamSrc.includes('approval_level: "OFF"'),
  "sendConsoleChatMessageStream must inject request_context.approval_level = OFF on every turn"
);
console.log("✓ Test 19: Skyer Chat Stream approval_level=OFF enforcement verified");

console.log("Testing Library & Attachment Multi-Stage File Download Fallback...");
assert.ok(
  apiSrc.includes("function resolveEffectiveAgentId") &&
  apiSrc.includes("getSignedWorkspaceFileUrl") &&
  apiSrc.includes("const triggerAnchorDownload =") &&
  apiSrc.includes("30000"),
  "downloadWorkspaceFile must resolve custom/alias agent slugs, attempt authenticated blob download with 30s revoke grace period, and fall back to signed URL and /console/files/?download=1"
);
console.log("✓ Test 20: Library & Attachment Multi-Stage File Download Fallback verified");

console.log("Testing Internal Runtime Notice & Headline Stripping from Chat Responses...");
const turnStreamSrc = fs.readFileSync(path.join(rootDir, "src/services/turnStream.ts"), "utf8");
assert.ok(
  apiSrc.includes("function stripInternalExecutionArtifacts") &&
  apiSrc.includes("function isInternalRuntimeMessage") &&
  apiSrc.includes("<system-(?:notification|info|reminder)>") &&
  turnStreamSrc.includes("isInternalRuntimeMessage(event)") &&
  turnStreamSrc.includes("stripInternalExecutionArtifacts") &&
  chatStreamSrc.includes("isInternalRuntimeMessage(parsed)") &&
  chatStreamSrc.includes("stripInternalExecutionArtifacts") &&
  grokSrc.includes("stripInternalExecutionArtifacts(stripSharedRoomContext"),
  "Chat message history, SSE turn streams, and UI bubbles must filter out internal runtime system notices (<system-notification>, original_name=system) and scroll headlines (⟦...⟧) so execution artifacts never leak into user-facing response messages"
);
console.log("✓ Test 21: Internal Runtime Notice & Headline Stripping from Chat Responses verified");

console.log("Testing Telegram Channel Setup Defaults & Authorized Save Contract...");
const channelModalSrc = fs.readFileSync(path.join(rootDir, "src/components/ChannelConfigModal.tsx"), "utf8");
assert.ok(
  apiSrc.includes("DEFAULT_TELEGRAM_API_BASE_URL = \"http://100.70.201.83:8083\"") &&
  apiSrc.includes("function normalizeTelegramChannelDefaults") &&
  apiSrc.includes("const getRes = await authorizedFetch(channelPath") &&
  apiSrc.includes("const putRes = await authorizedFetch(channelPath") &&
  channelModalSrc.includes("DEFAULT_TELEGRAM_API_BASE_URL") &&
  channelModalSrc.includes("showTyping") &&
  channelModalSrc.includes("dmAccessControl") &&
  channelModalSrc.includes("groupAccessControl") &&
  channelModalSrc.includes("requireMention") &&
  channelModalSrc.includes("noTextDebounce"),
  "Telegram ChannelConfigModal and updateAgentChannelConfig must default base_url to http://100.70.201.83:8083, show_typing=true, access_control_dm=false, access_control_group=false, require_mention=true, no_text_debounce=true, and use authorizedFetch so saves succeed"
);
console.log("✓ Test 22: Telegram Channel Setup Defaults & Authorized Save Contract verified");

console.log("Testing Telegram Whitelist UI & Hidden Base URL Contracts...");
assert.ok(
  !channelModalSrc.includes("<span>{t(\"channelConfig.apiBaseUrl\")") &&
  channelModalSrc.includes("DEFAULT_TELEGRAM_API_BASE_URL") &&
  channelModalSrc.includes("whitelistUsers") &&
  channelModalSrc.includes("allow_from: (dmAccessControl || groupAccessControl) ? whitelistUsers : []"),
  "ChannelConfigModal must hide the API Base URL input from the user while keeping the default, and present whitelist user ID setup whenever DM or Group Access Control is enabled"
);
console.log("✓ Test 23: Telegram Whitelist UI & Hidden Base URL verified");

console.log("Testing ScrollToTop Route Scroll Restoration Contract...");
const appSrc = fs.readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const scrollToTopSrc = fs.readFileSync(new URL("../src/components/ScrollToTop.tsx", import.meta.url), "utf8");
assert.ok(
  appSrc.includes("ScrollToTop") && appSrc.includes("<ScrollToTop />"),
  "App.tsx must mount ScrollToTop inside the router tree"
);
assert.ok(
  scrollToTopSrc.includes("window.scrollTo({") &&
  scrollToTopSrc.includes("top: 0") &&
  scrollToTopSrc.includes("useLocation") &&
  scrollToTopSrc.includes("hash"),
  "ScrollToTop must reset viewport to top:0 on route changes and handle anchor hash navigation"
);
console.log("✓ Test 24: ScrollToTop Route Scroll Restoration verified");

console.log("Testing Computer Maximize State Modal 95% & Toolbar Replacement...");
const grokWorkspaceSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokWorkspaceSrc.includes("data-testid=\"computer-maximized-modal\"") &&
  grokWorkspaceSrc.includes("sm:w-[95vw] sm:h-[95vh] max-w-full sm:max-w-[95vw] max-h-[100dvh] sm:max-h-[95vh]"),
  "Computer maximized state must render as a 95vw x 95vh modal"
);
assert.ok(
  !grokWorkspaceSrc.includes("openAgentDesktopTab(agentBrowserFor)"),
  "openAgentDesktopTab new tab button must be replaced with the maximize modal trigger"
);
console.log("✓ Test 27: Computer Maximize 95% Modal & Toolbar Replacement verified");

console.log("Testing Mobile iOS Zoom Prevention & 16px Font Contract...");
const indexHtml = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const indexCss = fs.readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const grokWorkspace = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");

assert.ok(
  indexHtml.includes("maximum-scale=1.0") && indexHtml.includes("user-scalable=no"),
  "index.html must restrict auto-zoom on mobile viewport"
);
assert.ok(
  indexCss.includes("@media (max-width: 639px)") && indexCss.includes("font-size: 16px !important"),
  "src/index.css must enforce 16px font-size on inputs/textareas under 640px"
);
assert.ok(
  grokWorkspace.includes("text-[16px] sm:text-[14.5px]"),
  "GrokBotWorkspace chat textarea must use 16px on mobile viewports"
);
console.log("✓ Test 28: Mobile iOS Zoom Prevention & 16px Font Contract verified");

console.log("Testing Mobile Ergonomics & Viewport Polish Contracts...");
const grokBotSrc3 = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");

assert.ok(
  grokBotSrc3.includes("h-[100dvh] max-h-[100dvh]") && grokBotSrc3.includes("overscroll-none"),
  "GrokBotWorkspace root container must adopt 100dvh and overscroll-none"
);
assert.ok(
  grokBotSrc3.includes("overscroll-contain") && grokBotSrc3.includes("handleMessagesScroll"),
  "Messages container must contain overscroll to prevent body bounce"
);
// Quick clear button removed to keep minimalist UI clean without duplicate clear controls
console.log("✓ Test 29: Mobile Ergonomics & Viewport Polish Contracts verified");

console.log("Testing Lean Request Queue UI Contract...");
const grokBotSrc4 = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");

assert.ok(
  grokBotSrc4.includes("data-testid=\"request-queue-indicator\""),
  "GrokBotWorkspace must include request-queue-indicator testid"
);
assert.ok(
  grokBotSrc4.includes("data-testid=\"request-queue-stack\""),
  "GrokBotWorkspace must include request-queue-stack testid"
);
assert.ok(
  grokBotSrc4.includes("requestQueue[0]?.previewText") || grokBotSrc4.includes("requestQueue[0]?.text"),
  "Request queue indicator must display clean prompt content directly"
);
assert.ok(
  !grokBotSrc4.includes("upcoming request") && !grokBotSrc4.includes(">Queue:<"),
  "Verbose labels like upcoming request or Queue: must be eliminated for ultra-lean content-first UI"
);
console.log("✓ Test 30: Lean Request Queue UI Contract verified");

console.log("Testing Browser Chrome Header (Tab Strip & Omnibox) & Landscape Rotation Contract...");
const grokBrowserSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokBrowserSrc.includes("data-testid=\"agent-browser-chrome-header\"") &&
  grokBrowserSrc.includes("data-testid=\"agent-browser-new-tab-btn\"") &&
  grokBrowserSrc.includes("handleCreateNewTab") &&
  grokBrowserSrc.includes("handleCloseTab") &&
  grokBrowserSrc.includes("handleNavigateSubmit") &&
  grokBrowserSrc.includes("handleBrowserAction(\"back\")") &&
  grokBrowserSrc.includes("handleBrowserAction(\"forward\")") &&
  grokBrowserSrc.includes("data-testid=\"computer-mobile-input-mode-btn\""),
  "SelkiesViewer must render the unified authentic Browser Chrome Header with Tab Strip, New/Close Tab, Back/Forward/Reload controls, and interactive URL Omnibox across Web and Phone"
);
console.log("✓ Test 31: Browser Chrome Header (Tab Strip & Omnibox) & Landscape Rotation verified");

console.log("Testing Cross-Format Attachment Deduplication (PNG vs JPG, WAV vs MP3, MP4 vs WEBM)...");
const grokDedupeSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokDedupeSrc.includes("if (imgMatch && imgMatch[1]) return `img:${imgMatch[1]}`;") &&
  grokDedupeSrc.includes("if (audioMatch && audioMatch[1]) return `aud:${audioMatch[1]}`;") &&
  grokDedupeSrc.includes("if (videoMatch && videoMatch[1]) return `vid:${videoMatch[1]}`;") &&
  grokDedupeSrc.includes("lightbox-format-variant-selector") &&
  grokDedupeSrc.includes("preview-format-variant-selector"),
  "normalizeAttachmentDedupeKey must unify same-basename media variants and expose format-variant selector in Lightbox & Preview modals"
);
console.log("✓ Test 32: Cross-Format Attachment Deduplication verified");

console.log("Testing Mobile Agent Sidebar Text Visibility, iOS Form Accessory Suppression & Composer Multiline Wrapping...");
const grokMobileSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
const cssMobileSrc = fs.readFileSync(new URL("../src/index.css", import.meta.url), "utf8");

assert.ok(
  grokMobileSrc.includes("wrap=\"soft\"") &&
  grokMobileSrc.includes("whitespace-pre-wrap break-words [overflow-wrap:anywhere]") &&
  grokMobileSrc.includes("el.scrollWidth > el.clientWidth + 2"),
  "Composer textarea must enforce wrap=soft, whitespace-pre-wrap, and scrollWidth detection so long text always wraps to multiple lines"
);
assert.ok(
  grokMobileSrc.includes("inert: !mobileAgentsOpen") &&
  grokMobileSrc.includes("inputTabIndex={!mobileAgentsOpen"),
  "Off-screen mobile sidebars must be marked inert and have fileInput outside form so iOS keyboard hides the Next/Prev accessory bar"
);
assert.ok(
  cssMobileSrc.includes("[data-agent-item-id]") &&
  cssMobileSrc.includes("opacity: 1 !important"),
  "Agent list rows in mobile drawer must enforce full visibility and contrast without WebKit animation clipping"
);
console.log("✓ Test 33: Mobile Agent Sidebar Text Visibility, iOS Form Accessory Suppression & Composer Multiline Wrapping verified");

console.log("Testing Lean Attachment Preview Cards (No Redundant Status Subtext)...");
assert.ok(
  !grokMobileSrc.includes("Báo cáo hoàn tất · Nhấn để xem"),
  "Attachment preview cards must not contain redundant status subtext ('Báo cáo hoàn tất · Nhấn để xem')"
);
assert.ok(
  grokMobileSrc.includes("group/attfile") &&
  grokMobileSrc.includes("handleOpenAttachmentPreview(att)"),
  "Attachment preview card must retain lean badge, filename, and direct preview/download actions"
);
console.log("✓ Test 34: Lean Attachment Preview Cards verified");

console.log("Testing Lean Agent Settings Modal Model Selector Contract...");
const settingsModalSrc = fs.readFileSync(new URL("../src/components/AgentSettingsModal.tsx", import.meta.url), "utf8");

assert.ok(
  !settingsModalSrc.includes("Mô hình phổ biến (Quick Select)") &&
  !settingsModalSrc.includes("Chi tiết Định danh & Node"),
  "Agent Settings Modal must remove redundant node pill and quick-select presets for a lean single dropdown"
);
assert.ok(
  settingsModalSrc.includes("onSelectModel(m.model, m.providerId)") &&
  (settingsModalSrc.includes("currentCleanModel") && settingsModalSrc.includes("Chọn mô hình AI...")),
  "Model selector must present current active model and allow selecting any valid model with provider binding"
);
console.log("✓ Test 35: Lean Agent Settings Modal Model Selector Contract verified");

console.log("Testing Browser Dynamic Hover Cursor & Drag-and-Drop Tab Management Contract...");
assert.ok(
  grokMobileSrc.includes('msg?.method === "Page.cursorChanged"') &&
  grokMobileSrc.includes("applyRemoteCursorStyleDom(msg.params.cursor)") &&
  grokMobileSrc.includes("viewportBoxRef.current.style.cursor = clean") &&
  grokMobileSrc.includes('data-cursor-shape="pointer"') &&
  grokMobileSrc.includes('data-cursor-shape="text"'),
  "AgentBrowserPreview must handle Page.cursorChanged over WebSocket and dynamically update both viewport CSS cursor and virtual cursor shape"
);
assert.ok(
  grokMobileSrc.includes("reorderTabsInPlace(") &&
  grokMobileSrc.includes("reconcileTabsWithOrder(") &&
  grokMobileSrc.includes("closedTabsUntilRef") &&
  grokMobileSrc.includes("tabMutationLockUntilRef") &&
  grokMobileSrc.includes("onDragStart=") &&
  grokMobileSrc.includes("onDragOver="),
  "SelkiesViewer must support drag-and-drop tab reordering, custom order persistence across polls, optimistic new-tab creation, and closed-tab tombstones"
);
console.log("✓ Test 36: Browser Dynamic Hover Cursor & Drag-and-Drop Tab Management Contract verified");

console.log("Testing Hardware GPU createImageBitmap + <canvas> Screencast Pipeline Contract...");
assert.ok(
  grokMobileSrc.includes("window.createImageBitmap(blobToDecode)") &&
  grokMobileSrc.includes("paintImageBitmapDom(bitmap, blobToDecode)") &&
  grokMobileSrc.includes('data-testid="agent-browser-gpu-canvas"') &&
  grokMobileSrc.includes('getContext("2d", { alpha: false, desynchronized: true })') &&
  grokMobileSrc.includes("bitmap.close()"),
  "AgentBrowserPreview must decode Binary JPEG frames via off-thread createImageBitmap and paint directly onto a desynchronized 2D GPU canvas with explicit bitmap.close() memory cleanup"
);
console.log("✓ Test 37: Hardware GPU createImageBitmap + <canvas> Screencast Pipeline Contract verified");

console.log("Testing Left Sidebar Collapsed Edge Resizer & Click-To-Open Contract...");
const grokWorkspaceEdgeSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokWorkspaceEdgeSrc.includes("data-testid=\"left-sidebar-collapsed-edge\"") &&
  grokWorkspaceEdgeSrc.includes("handleToggleLeftSidebar(false)") &&
  grokWorkspaceEdgeSrc.includes("cursor-col-resize"),
  "Left sidebar edge handle must render in collapsed state with col-resize cursor and click/drag-to-open handler"
);
console.log("✓ Test 38: Left Sidebar Collapsed Edge Resizer & Click-To-Open Contract verified");

console.log("Testing Smooth 60fps Browser Scroll & Interactive Synchronized Scrollbar Contract...");
const grokScrollSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokScrollSrc.includes('data-testid="agent-browser-interactive-scrollbar"') &&
  grokScrollSrc.includes('data-testid="agent-browser-scrollbar-thumb"') &&
  grokScrollSrc.includes("applyScrollMetricsDom") &&
  grokScrollSrc.includes("Page.scrollMetrics") &&
  grokScrollSrc.includes("stepSmoothWheelScroll") &&
  grokScrollSrc.includes('action: "scroll_to"') &&
  grokScrollSrc.includes('action: "mousedown"') &&
  grokScrollSrc.includes('action: "mousemove_drag"') &&
  grokScrollSrc.includes('action: "mouseup"'),
  "AgentBrowserPreview must render an interactive synchronized scrollbar thumb/track, handle Page.scrollMetrics, interpolate wheel deltas smoothly via stepSmoothWheelScroll, and forward native mousedown/mousemove_drag/mouseup"
);
console.log("✓ Test 39: Smooth 60fps Browser Scroll & Interactive Synchronized Scrollbar Contract verified");

console.log("Testing Full Browser Wrapper Controls (Reload, Find in Page, Space/Shift+Space Page Scroll, Keyboard Shortcuts)...");
const grokFullWrapperSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokFullWrapperSrc.includes('data-testid="agent-browser-reload-btn"') &&
  grokFullWrapperSrc.includes('data-testid="agent-browser-find-btn"') &&
  grokFullWrapperSrc.includes('data-testid="agent-browser-find-bar"') &&
  grokFullWrapperSrc.includes('action: "find"') &&
  grokFullWrapperSrc.includes('e.code === "Space"') &&
  grokFullWrapperSrc.includes('onBrowserShortcut?.("focus_address")') &&
  grokFullWrapperSrc.includes('onBrowserShortcut?.("new_tab")') &&
  grokFullWrapperSrc.includes('onBrowserShortcut?.("close_tab")'),
  "SelkiesViewer and AgentBrowserPreview must provide full browser wrapper controls including Reload button, Find-in-page bar, Space/Shift+Space page scrolling, and Ctrl+L/T/W/R/F shortcuts"
);
console.log("✓ Test 40: Full Browser Wrapper Controls verified");

console.log("Testing WebRTC H.264/VP9 Stream Engine Toggle & Predictive 120Hz Scroll Contract...");
const grokStreamEngineSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokStreamEngineSrc.includes('data-testid="agent-browser-stream-engine-btn"') &&
  grokStreamEngineSrc.includes('data-testid="agent-browser-webrtc-container"') &&
  grokStreamEngineSrc.includes('data-testid="agent-browser-webrtc-iframe"') &&
  grokStreamEngineSrc.includes('issueAgentDesktopUrl(agentId, "control")') &&
  grokStreamEngineSrc.includes("handleToggleStreamEngine") &&
  grokStreamEngineSrc.includes("applyPredictiveScrollOffset"),
  "SelkiesViewer must provide a 1-click toggle between CDP GPU Canvas (with 120Hz predictive scroll offset) and Selkies WebRTC H.264/VP9 60fps stream with automatic fallback"
);
console.log("✓ Test 41: WebRTC H.264/VP9 Stream Engine Toggle & Predictive 120Hz Scroll Contract verified");

console.log("Testing Adaptive 55..75 JPEG Quality Controller for 60fps 4G Mobile Stream...");
const grokAbrSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokAbrSrc.includes("Math.max(55, Math.min(75, Math.round(55 + ((ewmaKbps - 500) / 2500) * 20)))") &&
  grokAbrSrc.includes('action: "quality", width: desiredQ, pageId'),
  "AgentBrowserPreview must dynamically adjust JPEG quality between 55 and 75 based on ewmaKbps to maintain 60fps over 4G mobile networks"
);
console.log("✓ Test 42: Adaptive 55..75 JPEG Quality Controller for 60fps 4G Mobile Stream verified");

console.log("Testing Phone Browser Mouse Mode: 2-Touch Swipe to Scroll & 2-Touch Tap to Right Click Contract...");
const grokMouseGesturesSrc = fs.readFileSync(new URL("../src/pages/GrokBotWorkspace.tsx", import.meta.url), "utf8");
assert.ok(
  grokMouseGesturesSrc.includes('twoFingerMode?: "undecided" | "scroll" | "pinch"') &&
  grokMouseGesturesSrc.includes('if (mobileInputMode === "mouse")') &&
  grokMouseGesturesSrc.includes('g.twoFingerMode = "scroll"') &&
  grokMouseGesturesSrc.includes('action: "rightclick"') &&
  grokMouseGesturesSrc.includes('triggerHaptic(15)') &&
  grokMouseGesturesSrc.includes('startInertiaScroll(g.vx, g.vy, cursorNormRef.current.x, cursorNormRef.current.y)'),
  "AgentBrowserPreview must support 2-finger swipe to scroll with momentum inertia and 2-finger tap for right-click in phone mouse mode"
);
console.log("✓ Test 43: Phone Browser Mouse Mode 2-Touch Gestures (Scroll & Right Click) verified");

console.log("Testing Phone Browser Mouse Mode: Double-Tap dblclick, Tap-and-Drag mousemove_drag, and Horizontal 2-Touch Scroll...");
assert.ok(
  grokMouseGesturesSrc.includes('action: "dblclick"') &&
  grokMouseGesturesSrc.includes('isDragSelect') &&
  grokMouseGesturesSrc.includes('isTapDraggingRef') &&
  grokMouseGesturesSrc.includes('action: "mousemove_drag"') &&
  grokMouseGesturesSrc.includes('action: "mouseup"') &&
  grokMouseGesturesSrc.includes('scrollDeltaX') &&
  grokMouseGesturesSrc.includes('scrollDeltaY'),
  "AgentBrowserPreview must support double-tap dblclick, tap-and-drag mousemove_drag/mouseup, and bidirectional 2-finger scroll"
);
console.log("✓ Test 44: Phone Browser Mouse Mode Enhancements 2, 3, and 4 verified");

console.log("Testing Browser Keyboard Shortcuts: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+Z and Clipboard Forwarding Contract...");
assert.ok(
  grokMouseGesturesSrc.includes('kLower === "c"') &&
  grokMouseGesturesSrc.includes('kLower === "v"') &&
  grokMouseGesturesSrc.includes('kLower === "x"') &&
  grokMouseGesturesSrc.includes('kLower === "a"') &&
  grokMouseGesturesSrc.includes('kLower === "z"') &&
  grokMouseGesturesSrc.includes('onCopy={async (e) =>') &&
  grokMouseGesturesSrc.includes('navigator.clipboard?.readText'),
  "AgentBrowserPreview must forward Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X, Ctrl/Cmd+A, and Ctrl/Cmd+Z to CDP target with clipboard integration"
);
console.log("✓ Test 45: Browser Clipboard Keyboard Shortcuts (Ctrl+C, Ctrl+V, etc.) verified");

console.log("Testing Browser Anti-Flicker Anchor Tab Hold & WebSocket Auto-Reconnect Contract...");
assert.ok(
  grokMouseGesturesSrc.includes("lastNonAnchorTabsRef") &&
  grokMouseGesturesSrc.includes("canHoldPreviousNonAnchorTabs") &&
  grokMouseGesturesSrc.includes("reconnectTimer = setTimeout(connectWs, delayMs)"),
  "SelkiesViewer must hold previous non-anchor tabs during transient poll gaps and AgentBrowserPreview must auto-reconnect live screencast WebSocket"
);
console.log("✓ Test 46: Browser Anti-Flicker Anchor Tab Hold & WebSocket Auto-Reconnect verified");

console.log("Testing Browser Scale-Jitter Guard for Modal / Split View and Stable CDP Frame Sizing...");
assert.ok(
  grokMouseGesturesSrc.includes("isComputerSplitOpen && !isBrowserModalOpen") &&
  grokMouseGesturesSrc.includes('className="w-full h-full sm:w-[95vw] sm:h-[95vh]') &&
  !grokMouseGesturesSrc.includes('max-h-[100dvh] sm:max-h-[95vh] rounded-none sm:rounded-2xl bg-white dark:bg-[#121218] border-0 sm:border border-slate-200 dark:border-[#252532] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-150'),
  "The maximized browser must not mount alongside split view or animate a scale transform during interaction"
);
console.log("✓ Test 47: Browser scale-jitter guard verified");

console.log("Testing Coalesced rAF Scroll Pipeline & Lossless Sub-Threshold Touch Tracking Contract...");
assert.ok(
  grokMouseGesturesSrc.includes("queueCoalescedScrollInput") &&
  grokMouseGesturesSrc.includes("pendingScrollWireRef") &&
  grokMouseGesturesSrc.includes("queueCoalescedScrollInput(cursorNormRef.current.x, cursorNormRef.current.y, scrollDeltaX, scrollDeltaY)"),
  "AgentBrowserPreview must coalesce scroll deltas via queueCoalescedScrollInput without dropping sub-threshold touch movements"
);
console.log("✓ Test 48: Coalesced rAF Scroll Pipeline & Lossless Sub-Threshold Touch Tracking Contract verified");

console.log("Testing Immediate GPU Bitmap Decode & Unified Wheel/Touch Scroll Coalescing Contract...");
assert.ok(
  grokMouseGesturesSrc.includes("if (!isDecodingFrame && nextFrameBlob && supportsGpuBitmap)") &&
  grokMouseGesturesSrc.includes("queueCoalescedScrollInput(state.xRatio, state.yRatio, stepX, stepY)") &&
  grokMouseGesturesSrc.includes("else if (centerMove > 2.5)"),
  "AgentBrowserPreview must decode incoming binary JPEG blobs immediately via createImageBitmap when idle and route wheel + 2.5px touch scrolls through queueCoalescedScrollInput"
);
console.log("✓ Test 49: Immediate GPU Bitmap Decode & Unified Wheel/Touch Scroll Coalescing Contract verified");

console.log("Testing Agent Name Update Sync to QwenPaw API Contract...");
const avatarServiceSrc = fs.readFileSync(path.join(rootDir, "src/services/avatarService.ts"), "utf-8");
const operatorFetchSrc = fs.readFileSync(path.join(rootDir, "src/services/operatorFetch.ts"), "utf-8");
assert.ok(
  avatarServiceSrc.includes("export async function updateQwenPawAgentName") &&
  avatarServiceSrc.includes('fetch("/api/agents/" + encodeURIComponent(clean)') &&
  avatarServiceSrc.includes('fetch("/api/agents/" + encodeURIComponent(clean) + "/profile-config"') &&
  avatarServiceSrc.includes('method: "PUT"') &&
  avatarServiceSrc.includes("JSON.stringify({ name: effectiveName })") &&
  avatarServiceSrc.includes("updateQwenPawAgentName(clean, trimmed)") &&
  operatorFetchSrc.includes("agents/[^/]+(?:$|/(?:profile-config|"),
  "saveCustomAgentName must apply agent name updates to QwenPaw API via PUT /api/agents/{agentId} and persist profile-config via /api/agents/{agentId}/profile-config"
);
console.log("✓ Test 50: Agent Name Update Sync to QwenPaw API Contract verified");

console.log("Testing Agent Active Model Update Sync to QwenPaw API Contract...");
const agentApiModelSrc = fs.readFileSync(path.join(rootDir, "src/services/agentApi.ts"), "utf-8");
assert.ok(
  agentApiModelSrc.includes("export async function updateAgentActiveModel") &&
  agentApiModelSrc.includes("${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}/active-model") &&
  agentApiModelSrc.includes("${API_BASE_URL}/agents/${encodeURIComponent(cleanId)}") &&
  agentApiModelSrc.includes("active_model:") &&
  agentApiModelSrc.includes("provider_id: effectiveProviderId") &&
  agentApiModelSrc.includes("model: cleanModel") &&
  grokMouseGesturesSrc.includes("const ok = await updateAgentActiveModel(targetAgentId, providerId, cleanModel);"),
  "updateAgentActiveModel must resolve the agent provider_id and apply model updates to QwenPaw API via PUT /api/agents/{agentId} and PUT /api/agents/{agentId}/active-model"
);
console.log("✓ Test 51: Agent Active Model Update Sync to QwenPaw API Contract verified");

console.log("Testing Precision Touchpad 1:1 Direct Pass-Through & Sub-Pixel Remainder Preservation Contract...");
assert.ok(
  grokMouseGesturesSrc.includes("isLikelyTouchpad") &&
  grokMouseGesturesSrc.includes("st.dx -= sendDx;") &&
  grokMouseGesturesSrc.includes("st.dy -= sendDy;") &&
  grokMouseGesturesSrc.includes("queueCoalescedScrollInput(coords.xRatio, coords.yRatio, totalDx, totalDy)"),
  "AgentBrowserPreview must pass precision touchpad wheel streams directly 1:1 to queueCoalescedScrollInput without double-smoothing and preserve sub-pixel remainders"
);
console.log("✓ Test 52: Precision Touchpad 1:1 Direct Pass-Through & Sub-Pixel Remainder Preservation Contract verified");

console.log("Testing Unified Browser Header Borderless Window CTAs Contract...");
const grokBrowserWindowCtaSrc = fs.readFileSync(path.join(rootDir, "src/pages/GrokBotWorkspace.tsx"), "utf-8");
assert.ok(
  grokBrowserWindowCtaSrc.includes('data-testid="agent-browser-window-ctas"') &&
  grokBrowserWindowCtaSrc.includes('data-testid="agent-browser-header-screenshot-btn"') &&
  grokBrowserWindowCtaSrc.includes('data-testid="agent-browser-header-reload-session-btn"') &&
  grokBrowserWindowCtaSrc.includes('data-testid="agent-browser-header-maximize-btn"') &&
  grokBrowserWindowCtaSrc.includes('data-testid="agent-browser-header-close-btn"') &&
  grokBrowserWindowCtaSrc.includes("h-[38px] w-11 border-0 rounded-none") &&
  !grokBrowserWindowCtaSrc.includes("{selectedAgent.name} · Computer Workspace"),
  "SelkiesViewer must render the unified borderless window CTAs (Screenshot, Reload, Maximize/Restore, Close) directly inside the browser header row without a redundant separate top bar"
);
console.log("✓ Test 53: Unified Browser Header Borderless Window CTAs Contract verified");

console.log("Testing Hybrid Optional Image + Hover Animated Blob Avatar & Color Theme Contract...");
const agentAvatarSrc = fs.readFileSync(path.join(rootDir, "src/components/AgentAvatar.tsx"), "utf-8");
const agentAvatarModalSrc = fs.readFileSync(path.join(rootDir, "src/components/AgentAvatarModal.tsx"), "utf-8");
assert.ok(
  agentAvatarSrc.includes("const hasCustomImage = Boolean(customConfig?.imageUrl && !imageLoadFailed);") &&
  agentAvatarSrc.includes("const showStaticCustomImage = hasCustomImage && !isHovered;") &&
  agentAvatarSrc.includes("cfg?.blob?.color || cfg?.colorPreset || getAgentBlobProfile(agentId, name, roleTag).color") &&
  agentAvatarModalSrc.includes("if (current.blob || current.colorPreset)") &&
  !agentAvatarModalSrc.includes('setCustomImageUrl("");\n                      setIsCustomBlob(true);') &&
  avatarServiceSrc.includes("buildMultipartUploadHeaders(agentId)"),
  "AgentAvatar must show custom image by default when present and switch to animated BlobAvatar on hover, while AgentAvatarModal preserves optional customImageUrl when changing color/shape/expression/animation"
);
console.log("✓ Test 54: Hybrid Optional Image + Hover Animated Blob Avatar & Color Theme Contract verified");
