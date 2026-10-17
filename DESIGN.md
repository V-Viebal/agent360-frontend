# Agent360 Design System & Pattern Contract

## 1. Visual Vibe & Aesthetic Principles
Inspired by modern high-density autonomous bot control planes (e.g. Grok Bot / x.ai terminal).
- **Core Theme:** Deep space dark (`#0c0c0e`, `#0f0f14`, `#14141c`).
- **Accent Brand Color:** Grok Neon Ember (`#ff7a00`), with emerald status telemetry (`#34d399`).
- **Typography:**
  - UI Labels & Headers: Inter / System Sans-serif, Clean, High Legibility.
  - Telemetry & Code: JetBrains Mono / Monospace for IDs, status, models, and exit codes.
  - Numerical counters: Monospaced tabular digits.
- **Corner Radii:**
  - Badges & Pills: `rounded-full`
  - Cards & Drawers: `rounded-2xl`
  - Controls & Modals: `rounded-xl`

## 2. Reusable Shared UI Components (`src/components/ui/`)
All views, modals, and toolbars MUST consume shared primitives for consistency:
- `CustomSelect`: Styled custom dropdown with chevron animations, active check indicators, role badges, and outside-click dismiss.
- `StatusBadge`: Consistent glowing status indicator (`active`, `idle`, `running`, `evaluating`).
- `IconButton`: Circular micro-action button with ghost, secondary, and primary variants.
- `SearchInput`: Standardized search container with embedded magnifying glass icon and clear `✕` button.

## 3. Four-Zone Layout Architecture
The Agent360 Workspace adheres strictly to a 4-pane progressive disclosure layout:
1. **Leftmost Navigation (Zone 1):** Infra Agents switcher loaded live from backend.
2. **Center Canvas (Zone 2):** Chat stream, execution receipts, and interactive choice cards.
3. **Conversations Rail (Zone 3):** Collapsible conversation history placed immediately to the right of the chat.
4. **Agent Inspector Pane (Zone 4):** Collapsible rightmost pane containing Virtual Computer screen, Details, and ACL Workspace file tree, toggled via the Top Bar capsule.


## Voice & Text-to-Speech (TTS) Standard

- **Speech Synthesis:** Agents support natural real-time voice playback with auto-detected Vietnamese (`vi-VN`) and English (`en-US`) locales.
- **Audio Chimes:** Web Audio API synthesized tones (Modern Chime, Retro Beep, Subtle Pop, Crystal Bell) require zero external static audio asset requests.
- **Accessibility & Hands-Free:** Users can toggle Auto-Read Responses or click "Read aloud" on any individual assistant message turn.

## Interaction targets (desktop control-plane density)

The `/app` workspace is a high-density desktop console. Icon buttons, tab pills and inline inputs use compact
24 px hit areas (16 px for inline text inputs) with at least 8 px spacing, declared per element with
`data-ux-target-min` so the harness UI gate validates the documented minimum instead of 44 px.
Every icon-only control must carry an `aria-label` (mirrors its `title`). Standalone forms and modals
(operator unlock, delegate, bind) keep 44 px targets.
