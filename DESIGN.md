---
name: Skyer & Agent360 Design System (Strawberry Editorial + High-Density Control Plane)
version: "2.4"
description: Dual-surface visual contract for Skyer marketing/editorial pages (Strawberry Warm Cream & Autonomous Canvases) and /app workspace control plane.
colors: "#FFFDF9, #F8F3ED, #252522, #ECE5DC, #f8a87c, #080a0f, #11151f"
typography: "Inter, Fraunces, JetBrains Mono"
spacing: "1080px container, 32px-38.4px grid gap, 80px-112px section rhythm"
rounded: "100px pill CTAs, 24px-32px companion cards, 16px product frame, 12px app modals"
components: "AgentAvatar, BlobAvatar, StrawberryComparisonSection, CustomSelect, DropdownMenu, Modal, Tooltip"
copy_budget: "H1<=8 words, Subtitle<=2 lines, CardDesc<=22 words, Bullet<=7 words"
---

# Skyer (Agent360) Design System & One-Shot Visual Reconstruction Contract

## Overview
Skyer combines two complementary visual surfaces under one unified dual-theme token system:
1. **Marketing, Onboarding, Docs & Marketplace Surfaces (`/`, `/marketplace`, `/docs`):** Follows the **Strawberry Browser Warm Editorial & Show-Don't-Tell** philosophy. Never use abstract AI cyber-grids, walls of marketing prose, or generic Lucide icons to represent teammates. Every section demonstrates autonomous work through real animated `<AgentAvatar>` (`BlobAvatar`) characters paired with live self-running Vietnamese enterprise micro-UIs (`ERPCore`, `TT99 Mẫu 02-VT`, `BaseCore`, `Knowledge Base KB`, `PayOS`, `Nghị định 13`).
2. **Workspace Control Plane (`/app`, `/admin`):** High-density operational console with 4-zone progressive disclosure, 1px borders, compact 24px interactive targets, and zero-clutter overlay filter menus.

## Colors
All surfaces MUST bind to semantic CSS variables in `src/index.css` and support seamless switching between **Light Mode (Warm Cream)** and **Dark Mode (Obsidian)** via Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *));`:

- **Light Mode (Strawberry Warm Editorial Palette):**
  - `--bg-page` / `--bg-workspace`: `#FFFDF9` (`hsla(30deg, 100%, 99%, 1)` — Warm Cream White; avoids harsh `#FFFFFF` page glare).
  - `--bg-card-subtle` / `--bg-sidebar` / `--bg-pill`: `#F8F3ED` (`hsla(30deg, 38%, 95%, 1)` — Warm Sand).
  - `--bg-card`: `#FFFFFF` (elevated surface cards).
  - `--text-primary`: `#252522` (`hsla(60deg, 4%, 14%, 1)` — Soft Charcoal; never use pure `#000000`).
  - `--text-secondary`: `#57534e` / `rgba(37, 37, 34, 0.70)`.
  - `--border-card` / `--border-subtle`: `#ECE5DC` (`hsla(30deg, 36%, 90%, 1)`).
- **Dark Mode (Obsidian High-Contrast Palette):**
  - `--bg-page`: `#080a0f`.
  - `--bg-card-subtle`: `#0b0e15`.
  - `--bg-card`: `#11151f`.
  - `--text-primary`: `#eceef2`.
  - `--border-card`: `#22222e` / `rgba(255, 255, 255, 0.10)`.
- **Brand & Companion Persona Pastels:**
  - Primary Accent: Skyer Peach (`#f8a87c`, light contrast `#c2540a`).
  - Executive (`Minh Bốc`): Sky Azure (`#38bdf8`, tint `#e0f2fe`).
  - Finance & ERP (`An Kế Toán`): Emerald Mint (`#34d399`, tint `#dcfce7`).
  - B2B Sales (`Linh Kinh Doanh`): Warm Orange (`#f8a87c`, tint `#ffedd5`).
  - Legal & Compliance (`Vy Pháp Chế`): Lavender (`#a78bfa`, tint `#f3e8ff`).
  - HR & Talent (`Nam Tuyển Dụng`): Rose (`#fb7185`, tint `#ffe4e6`).

## Typography
Self-hosted native WOFF2 variable fonts (`Inter`, `Fraunces`, `JetBrains Mono`) preloaded with zero FOUT/CLS:
- **Hero H1 (`.hero-title`):** `48px` (`3rem`), `font-weight: 400`, `line-height: 1.1`, `letter-spacing: -1.91px`, `max-width: 11em`, `text-wrap: balance`.
- **Hero Subtitle (`.hero-description`):** `21.6px` (`1.35rem`), `font-weight: 400`, `line-height: 1.38`, `letter-spacing: -0.21px`, `max-width: 33rem`, `70%` opacity.
- **Section Heading (H2):** `46px`, `font-weight: 400`, `line-height: 1.1`, `letter-spacing: -1.85px`.
- **Companion Card Body:** `15.3px`, `line-height: 1.45`, strictly capped at 2 lines (`<= 22 words`).
- **Workspace UI Scale:** Meta `12px`, UI `13px`, Body `14.5px`, Title `15.5px`, Heading `19px`.

## Layout
- **Marketing Container Width:** Strictly `max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8` (never `max-w-7xl`).
- **Header Height:** `64px` fixed with backdrop blur.
- **Section Vertical Rhythm:** `py-20 sm:py-28` with `1px` `var(--border-card)` dividers.
- **Companion Grid Gap:** `gap-[32px]` to `gap-[38.4px]` on a 3-column desktop grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **Four-Zone Workspace Layout (`/app`):**
  1. Leftmost Navigation: Infra Agents switcher loaded live from backend.
  2. Center Canvas: Chat stream, execution receipts, and interactive choice cards.
  3. Conversations Rail: Collapsible session history rail.
  4. Agent Inspector Pane: Virtual Computer screen, Details, and ACL Workspace file tree.

## Elevation & Depth
- **Hero Product Frame:** `0 16px 34px rgba(15,23,42,0.05), 0 60px 120px rgba(15,23,42,0.10)` in Light Mode; `0 20px 80px rgba(0,0,0,0.65)` in Dark Mode.
- **Secondary Pill CTA Shadow:** `0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)`.
- **Dot-Matrix Stage Texture:** Subtle `radial-gradient(#252522 1px, transparent 1px)` at `12px–18px` spacing with `15%–25%` opacity inside companion viewport headers.

## Shapes
- **Pill CTAs & Role Badges:** `rounded-full` (`100px` / `9999px`).
- **Companion & Comparison Cards:** `rounded-3xl` (`24px`) outer card with `rounded-2xl` (`16px`) inner stage viewport.
- **Hero 16:10 Product Frame:** `rounded-t-[16px]` bleeding cleanly into the section bottom border.
- **Workspace Controls (`/app`):** Modals/Menus `rounded-xl` (`12px`), Buttons/Inputs `rounded-lg` (`8px`), Micro-chips `rounded-md` (`6px`).

## Components
1. **Strawberry Hero Stage (Peeking Companions + 16:10 Live Frame):**
   - Centered H1 + 2-line subtitle + 2 pill CTAs (`Bắt đầu làm việc` & `Liên hệ Doanh nghiệp`).
   - 4 animated `<AgentAvatar>` characters (`Vy Pháp Chế`, `Minh Bốc`, `An Kế Toán`, `Linh B2B`) perched along the top edge (`-top-[74px]`) peeking over the `16:10` live product frame.
   - Inside the frame: Left companion progress rail + Right live `SỔ CÁI TT99` spreadsheet with a named floating cursor (`An Kế Toán`) moving across rows + bottom control pill `Đang điều khiển bởi An Kế Toán [Take over]`.
2. **Official Companions 6-Card Grid (`#bots`):**
   - Each card top stage (`h-52`) contains a real animated `<AgentAvatar size="lg" alwaysAnimate />` on the left, a live ticking Vietnamese enterprise mini-UI (`w-[148px]`) on the right, and a bottom-right floating role pill.
   - Card body has 1 concise outcome sentence + bottom bar with pill CTA (`Tuyển [Tên]`) and text link (`Giao việc thử →`).
3. **Side-by-Side Live Comparison (`StrawberryComparisonSection.tsx`):**
   - Left column (`Làm việc với Chatbot`): Tilted disconnected windows (`eInvoice_Viettel_T10.pdf`, empty `So_Cai_TT99.xlsx`, isolated Chat Box forcing manual copy-paste) + 3 red `✕` bullets (`<= 6 words` each).
   - Right column (`Làm việc với Skyer`): Unified browser tab `ERPCore // Sổ Cái TT99` with live row matching, named floating cursor, dark control bar, and 3 green `✓` bullets (`<= 7 words` each).
4. **Workspace Primitives (`src/components/ui/`):**
   - `CustomSelect`, `DropdownMenu`, `Modal`, `ToggleSwitch`, `Tabs`, `Tooltip`, `ConfirmDialog`, `CodeBlock`, `AgentPill`, `StatusBadge`, `SearchInput`, `IconButton`.

## Do's and Don'ts
- **DO (Copy Budget Lock):** Keep H1 `<= 8 words`, Subtitle `<= 2 lines`, Companion Card descriptions `<= 22 words`, and Comparison bullets `<= 7 words`.
- **DO (Show, Don't Tell):** Always pair `<AgentAvatar>` (`BlobAvatar`) with a live autonomous mini-UI or moving named cursor.
- **DO (Vietnam Enterprise Context):** Ground all examples in authentic Vietnamese enterprise workflows (`ERPCore`, `BaseCore`, `Knowledge Base KB`, `TT99 Mẫu 02-VT`, `PayOS`, `Nghị định 13/CP`).
- **DO (Dual-Theme Parity):** Verify both Light Mode (`#FFFDF9`) and Dark Mode (`#080a0f`) via CDP screenshot and computed style contrast checks before completion.
- **DON'T:** Never use static Lucide icons or generic stock avatars as stand-ins for AI teammates on landing or marketplace cards.
- **DON'T:** Never write multi-paragraph explanatory blocks or verbose technical jargon on marketing surfaces.
- **DON'T:** Never use hardcoded dark backgrounds without semantic CSS variables or `dark:` variants that break Light Mode readability.
