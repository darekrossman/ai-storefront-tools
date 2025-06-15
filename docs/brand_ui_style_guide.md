# StoreCraft Brand & UI Style Guide  
_Date: 2025-06-14 • Version 1.0 (MVP)_

---

## 1 · Brand Essence

| Attribute | Statement |
|-----------|-----------|
| **Mission** | *Empower builders to craft fully-realized commerce demos in minutes, not days.* |
| **Personality** | Confident, pragmatic, builder-centric, lightly playful (“hack-friendly”). |
| **Tagline** | **“Forge a store before your coffee cools.”** |
| **Voice** | Direct, conversational, action-oriented. Avoid buzzwords (“synergy”, “paradigm”). |
| **Tone Matrix** | <br>💡 **Docs** – helpful & precise (tutorial narrator).<br>🚀 **Marketing** – energetic & inspiring.<br>🔔 **System Notices** – concise & neutral.<br>🔴 **Errors** – empathetic + actionable (offer next steps). |

---

## 2 · Logo & Brandmark

| Element | Spec |
|---------|------|
| **Monogram** | `S↻` looping arrow suggests “regenerate / craft”. 36 × 36 dp grid, 4 dp stroke, 2 dp rounded ends. |
| **Wordmark** | “StoreCraft” in Inter SemiBold, letter-spacing -1 %. Optical kerning. |
| **Clear-Space** | At least 1 × monogram width on all sides. |
| **Minimum Sizes** | Icon: 24 dp; lock-up: 120 × 24 dp. |
| **Misuse** | Don't stretch, recolor, add drop shadows, or rotate the arrow. |

---

## 3 · Color System

### 3.1 Core Palette (Primitive Tokens)

| Token (raw) | Hex | HSL | WCAG Contrast on #FFFFFF |
|-------------|-----|-----|--------------------------|
| `colors.primary` | **#0DF2D9** | 173°, 95 %, 48 % | 2.4 : 1 (use bold text ≥ 24 px) |
| `colors.primaryFg` | **#031619** | 185°, 72 %, 5 % | 16.8 : 1 |
| `colors.secondary` | **#1F1F24** | 240°, 9 %, 13 % | 14.3 : 1 |
| `colors.surface` | **#121214** | 240°, 11 %, 8 % | N/A (background) |
| `colors.accent` | **#F20D92** | 318°, 93 %, 50 % | 4.5 : 1 |
| `colors.neutral100` | **#FFFFFF** | 0°, 0 %, 100 % | — |
| `colors.neutral200` | **#E9EAEE** | 226°, 20 %, 93 % | 3.1 : 1 on dark |
| `colors.neutral700` | **#4A4D55** | 225°, 9 %, 31 % | 7.2 : 1 on light |

> These primitives reside directly under `tokens.colors.*` in `panda.theme.extend.json` and should rarely be used in application code.

### 3.2 Semantic Colors (App-Facing)

| Semantic Token | Maps To | Purpose |
|----------------|---------|---------|
| `colors.primary` | `{colors.primary}` | Brand call-to-action surfaces |
| `colors.onPrimary` | `{colors.primaryFg}` | Text/icon color on primary surfaces |
| `colors.secondary` | `{colors.secondary}` | Secondary UI surfaces (header, footer) |
| `colors.surface` | `{colors.surface}` | Application background |
| `colors.accent` | `{colors.accent}` | Focus ring, link hover, progress bars |
| `colors.success` | `{colors.success}` | Success state / toast |
| `colors.warning` | `{colors.warning}` | Warning / toast |
| `colors.error` | `{colors.error}` | Destructive actions / errors |
| `colors.info` | `{colors.info}` | Info banners |
| `colors.onSecondary` | `{colors.neutral100}` | Text/icon color on secondary & danger surfaces |

> **Use semantic tokens everywhere**—they automatically inherit future theming (e.g. dark mode) without code changes.

### 3.3 Gradients & Overlays
* **Hero Gradient:** radial at 45° → `#0DF2D9 → #0A737C`.  
* Overlay scrim: `rgba(0,0,0,0.45)` for cards on imagery.

> **Accessibility:** maintain contrast ≥ 4.5 : 1 for body text; ≥ 3 : 1 for uppercase labels ≥ 14 px/medium weight.

---

## 4 · Typography

| Role | Font | Size / Line | Weight | Letter-spacing |
|------|------|-------------|--------|----------------|
| Display 1 | Inter | 48 / 56 px | 700 | -1 % |
| H1 | Inter | 32 / 40 | 700 | -1 % |
| H2 | Inter | 24 / 32 | 600 | -0.5 % |
| Body 1 | Inter | 16 / 24 | 400 | 0 |
| Body 2 | Inter | 14 / 20 | 400 | 0 |
| Caption | Inter | 12 / 16 | 400 | +0.2 % |
| Code | JetBrains Mono | 14 / 22 | 500 | 0 |

* **Numeric tabs:** use `tabular-nums` for tables.  
* **Code blocks:** 90 % of base size, background `--sc-secondary`, rounded `lg`.

---

## 5 · Layout & Grid

StoreCraft leverages Panda CSS's **default space scale** (`space.1` = 4 px, `space.2` = 8 px … `space.9` = 36 px) instead of maintaining a bespoke spacing token set.

| Guideline | Value |
|-----------|-------|
| **Grid** | 12-column, 72 px gutters desktop; 4-column, 16 px gutters mobile. |
| **Container Breakpoints** | sm (640 px) · md (768 px) · lg (1024 px) · xl (1280 px) · 2xl (1536 px) |
| **Token Usage** | Use `p={4}` for 16 px padding, `gap={6}` for 24 px gaps, etc., mirroring Panda's scale. |

> **Tip:** prefer semantic layout primitives—`Stack`, `Grid`, `Flex`—and pass numeric values from the scale or string tokens (`space.4`).

---

## 6 · Components

| Component | Spec Highlights |
|-----------|-----------------|
| **Buttons** | Height `40px`; radius `lg`; primary uses `colors.primary` bg + `colors.onPrimary` text; focus ring `2px` `colors.accent`. |
| **Input Fields** | Border 1 dp `--sc-neutral-700`; on focus switch to `--sc-accent`; label 12 px uppercase mono. |
| **Card** | Padding `--space-6`; background `--sc-secondary`; shadow `0 2 px 8 px rgba(0,0,0,.25)`; radius 24 dp. |
| **Toast** | Slide-in from bottom-right, 300 ms ease-out; icon fills semantic color bg. |
| **Modal** | 640 px max-width; background `--sc-surface`; drop shadow 24 dp; trap focus. |

Design tokens are exported to CSS variables and also distributed as `tailwind.config.ts` theme extensions.

---

## 7 · Iconography

* **Library**: Lucide 2.0 (stroke 1.5 dp).  
* Stroke color inherits text color; `--sc-accent` for active states.  
* Minimum‐tap area 44 × 44 dp.  
* Combine icons + text labels except in tooltips.

---

## 8 · Imagery

| Guideline | Value |
|-----------|-------|
| **Style** | Photoreal studio shots, soft diffused lighting, 4 K, neutral background tint `--sc-surface`. |
| **Mood** | Crisp, minimalist; negative space ≥ 20 % around product. |
| **Aspect Ratios** | Products 1:1; lifestyle 16:9; hero 21:9. |
| **Alt-Text** | `<80 chars`, formula: *{product} — {key adjective} view*.  |

---

## 9 · Motion

| Principle | Rule |
|-----------|------|
| **Purposeful** | Only animate on state change or user initiation. |
| **Duration** | 100–300 ms for micro-interactions; 400–700 ms for entrance/exit. |
| **Easing** | `cubic-bezier(0.4, 0, 0.2, 1)` (standard), `ease-out` for appear. |
| **Framer Motion Tokens** | `variants={fadeSlideUp}` with distance 12 dp. |

---

## 10 · Accessibility (AA Baseline)

| Checklist | Pass Criteria |
|-----------|---------------|
| **Color Contrast** | 4.5 : 1 body text; 3 : 1 UI icons (≥ 24 px). |
| **Focus Visible** | 2 dp outline `--sc-accent` inner, offset 2 dp. |
| **Keyboard Nav** | Tab flows in DOM order; ESC closes modals; Arrow keys cycle lists. |
| **Aria** | Components use WAI-ARIA 1.2 roles; toast region `aria-live="assertive"`. |
| **Motion** | Respect `prefers-reduced-motion` (fade w/out translate). |

---

## 11 · Content Guidelines

| Topic | Rule | Example |
|-------|------|---------|
| **Headings** | Sentence case, avoid colons. | **Good:** "Generate a catalog" |
| **Buttons** | Verb-first, 1–3 words. | "Start export" |
| **Errors** | Brief problem + remedy. | "Image failed to generate. Try again or change prompt." |
| **Placeholders** | Use instructional copy. | "Enter brand name…" |
| **Oxford Comma** | Always. | "colors, sizes, and patterns" |

---

## 12 · Brand Applications

| Asset | Spec |
|-------|------|
| **Favicon** | 32 × 32 px, monogram white on `--sc-primary`. |
| **Social Card** | 1200 × 630 px, hero gradient background, wordmark center. |
| **CLI Badge** | 128 × 32 px, wordmark white, background `--sc-secondary`. |
| **Email Template** | 640 px wide, `--sc-surface` header bar, body on white. |

---

## 13 · Design-Token Export Map

| Group | Panda Theme Key | Example Usage |
|-------|-----------------|---------------|
| **Color (semantic)** | `colors.primary`, `colors.accent`, … | `background="primary"` |
| **Raw Color (avoid)** | `colors.sc.primary` (primitives) | internal mapping only |
| **Typography** | `fontSizes.h1`, `lineHeights.h1` | `fontSize="h1"` |
| **Radius** | `radii.lg`, `radii.md` | `borderRadius="lg"` |
| **Spacing** | `space.4`, `space.6` | `p={4}` → 16 px |

StoreCraft's `panda.theme.extend.json` file only overrides **colors**, **typography**, **radii**, **shadows**, and **recipes**—spacing remains untouched to stay interoperable with default utilities.

---

## 14 · Do & Don't Gallery

| Do | Don't |
|----|-------|
| Use primary button color once per view. | Stack multiple primary buttons. |
| Keep copy under 20 words per paragraph on mobile. | Dump long paragraphs in modals. |
| Provide alt-text describing the product. | Use "image123.jpg" as alt-text. |

---

_© 2025 StoreCraft — Last updated 2025-06-14_
