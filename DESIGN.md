# Agent360 Design System & Pattern Contract

## 1. Visual Vibe & Aesthetic Principles
Inspired by modern high-density autonomous bot control planes (Grok Bot / x.ai terminal).
- **Core Theme:** Deep space dark (`#0c0c0e`, `#0f0f14`, `#14141c`).
- **Accent Brand Color:** Grok Neon Ember (`#ff7a00`), with emerald status telemetry (`#34d399`).
- **Typography:**
  - UI Labels & Headers: Inter / System Sans-serif, Clean, High Legibility.
  - Telemetry & Code: JetBrains Mono / Monospace for IDs, status, models, and exit codes.
  - Numerical counters: Monospaced tabular digits.
- **Unified Corner Radii Scale (Lean & Consistent Control Plane):**
  - **Level 1 (Badges, Dots & Micro-pills):** `rounded-full` (online indicator, tag chips).
  - **Level 2 (Modals, Overlays & Dialogs):** `rounded-xl` (12px) - scaled down from `rounded-2xl` for a tighter, more professional desktop feel.
  - **Level 3 (Cards, Floating Menus & Dropdowns):** `rounded-xl` (12px) - solid, clean border alignment.
  - **Level 4 (Buttons, Inputs, Tabs & List Items):** `rounded-lg` (8px) - crisp, high-density interactive targets.
  - **Level 5 (Micro-controls, badges, sub-chips):** `rounded-md` (6px).

## 2. Reusable Shared UI Components (`src/components/ui/`)
All views, modals, and toolbars consume standardized shared primitives:
- `CustomSelect`: Floating portal dropdown with keyboard arrows navigation, WAI-ARIA combobox, and `rounded-xl` container with `rounded-lg` option items.
- `DropdownMenu`: Anchor-positioned floating menu with `rounded-xl` card and `rounded-lg` items.
- `Modal`: Base modal wrapper with `rounded-xl` boundary, backdrop blur, ESC dismissal, and header controls.
- `ToggleSwitch`: Switch control with `rounded-full` track and thumb.
- `Tabs`: Segmented tab bar with `rounded-lg` container and `rounded-md` active pill.
- `Tooltip`: Precision portal tooltip with `rounded-lg` edge.
- `ConfirmDialog`: Action confirmation dialog using `rounded-xl` modal.
- `CodeBlock`: Monospace snippet block with `rounded-xl` frame.
- `AgentPill`: Identity badge with `rounded-lg` container.
- `StatusBadge`: Telemetry glowing pill with `rounded-full`.
- `SearchInput`: Search field with `rounded-lg` perimeter.
- `IconButton`: Action button with `rounded-lg` or `rounded-full` variant.

## 3. Four-Zone Layout Architecture
The Agent360 Workspace adheres strictly to a 4-pane progressive disclosure layout:
1. **Leftmost Navigation (Zone 1):** Infra Agents switcher loaded live from backend.
2. **Center Canvas (Zone 2):** Chat stream, execution receipts, and interactive choice cards.
3. **Conversations Rail (Zone 3):** Collapsible conversation history placed immediately to the right of the chat.
4. **Agent Inspector Pane (Zone 4):** Collapsible rightmost pane containing Virtual Computer screen, Details, and ACL Workspace file tree, toggled via the Top Bar capsule.

## 4. Voice & Text-to-Speech (TTS) Standard
- **Speech Synthesis:** Agents support natural real-time voice playback with auto-detected Vietnamese (`vi-VN`) and English (`en-US`) locales.
- **Audio Chimes:** Web Audio API synthesized tones (Modern Chime, Retro Beep, Subtle Pop, Crystal Bell).
- **Accessibility & Hands-Free:** Users can toggle Auto-Read Responses or click "Read aloud" on any individual turn.

## 5. Interaction Targets (Desktop Control-Plane Density)
The `/app` workspace is a high-density desktop console. Icon buttons, tab pills and inline inputs use compact
24 px hit areas (16 px for inline text inputs) with at least 8 px spacing, declared per element with
`data-ux-target-min` so the harness UI gate validates the documented minimum.

## 6. Lean Content-First Pattern: Icon-First Controls & Overlay Filter Menus
When building data/artifact lists, toolbars, or inspectors (e.g. Workspace Library, chat toolbars, asset browsers):
- **Core Principle: Zero Visual Clutter / Content-First Focus:**
  - The main canvas/panel belongs exclusively to primary content (files, cards, logs, previews).
  - Do NOT clutter headers or sub-headers with multi-row filter pills, tag chips, or verbose inline filter buttons.
- **Icon-First Controls with Precision Tooltips:**
  - View switchers (e.g., List/Folder/Date, Grid/Table, Sort) use compact icon buttons with dedicated tooltips.
  - Interactive targets MUST have explicit `aria-label` and `Tooltip` hover hints (`content="..."`, `placement="top"|"bottom"`).
  - Active button states use translucent accent backgrounds (`bg-[#f8a87c]/20 text-[#e0682b] dark:text-[#f8a87c] font-semibold`).
- **Unified Overlay Filter Menu (`DropdownMenu` Portal):**
  - All secondary filters (Categories, Format extensions, Date ranges, Search queries) MUST be grouped into an overlay menu triggered by a single `<Filter size={12} />` button.
  - The trigger button displays a numerical badge indicator (`activeFiltersCount`) when any filters are active.
  - Dropdown surfaces MUST use solid backgrounds matching the DESIGN.md card standard (`bg-white dark:bg-[#181824] border border-slate-200 dark:border-[#2c2c3e] shadow-2xl`), rendered via React Portal (`document.body`) at `z-[999999]`.
  - The overlay menu embeds an inline instant search input with auto-focus and clear button, categorized grid selectors, format chips, and a "Clear all filters" reset action.
- **Transient Active-Filter Pill Bar:**
  - When filters are active, render a lean single-line active summary bar (`cat: ...`, `ext: ...`, `q: ...`) directly below the header with 1-click `X` clear buttons.
  - The active pill bar disappears completely when filters are at default state, restoring maximum vertical canvas height.
