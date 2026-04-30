# Handoff: Modern Elegant Redesign — Raise Design & Build

## Overview

This bundle is a complete editorial redesign for the **Raise Design & Build** marketing site (formerly D & B GC) — a high-end residential remodeler on Long Island, NY (kitchens, baths, sunrooms, millwork). The brief was: *"Update the UI to give a modern and elegant feel… catch the eye of high end clientele."*

The redesign moves the site from a generic Geist/utility look to a warm, editorial, craft-forward direction tuned for high-end clientele:

- **Warm paper neutrals** (never pure white) + deep charcoal ink (never pure black)
- **Aged-brass** as the singular metallic accent, used sparingly (one brass moment per screen)
- **Cormorant Garamond** serif display + **Inter** body — italic + brass is the brand's signature flourish
- **Restrained corners** (max 8px), **warm-tinted shadows**, **deliberately spacious** layout
- **No emoji, no stock-y illustrations, no sales-y voice**

## About the Design Files

The files in `design_files/` are **design references created in HTML** — high-fidelity prototypes showing the intended look and behavior, not production code to copy directly.

The target codebase is **Next.js 15 / App Router / TypeScript / Tailwind / Shadcn UI / Lucide React** (incumbent: `adennis42/d_and_b_gc`). Recreate these designs using the codebase's existing patterns:

- Move tokens from `colors_and_type.css` into `tailwind.config.ts` (theme.extend) and CSS variables in `src/app/globals.css`
- Build components as React Server / Client Components in `src/components/`
- Replace inline SVGs with `lucide-react` (set `strokeWidth={1.25}` globally)
- Use existing Shadcn primitives where they fit; restyle them to match the tokens

## Fidelity

**High-fidelity (hifi).** Pixel-perfect mockups with final colors, typography, spacing, motion, and interactions. Recreate as closely as possible — exact hex values, type sizes, line-heights, letter-spacing, padding values are all specified in `colors_and_type.css` and below.

---

## Design Tokens

Source: `colors_and_type.css` (drop into `globals.css` as `:root` variables, mirror in `tailwind.config.ts`).

### Color

**Warm paper neutrals (backgrounds — never pure white):**
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F1EA` | Primary page background |
| `--paper-2` | `#EDE6DA` | Tonal section background (alternate sections) |
| `--paper-3` | `#E2D8C6` | Card / divider tint |
| `--bone` | `#FAF7F2` | Panels, modals, surfaces |
| `--linen` | `#F0EAE0` | Hover surface on paper |

**Charcoal ink (foregrounds — never pure black):**
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1B1A17` | Headlines, primary text, primary buttons |
| `--ink-2` | `#2B2A26` | Body text |
| `--ink-3` | `#4A4842` | Secondary body, captions |
| `--ink-4` | `#76726A` | Muted, eyebrow-default, metadata |
| `--ink-5` | `#A39E94` | Hairlines, placeholders |

**Brass (singular metallic accent — use sparingly, one moment per screen):**
| Token | Hex | Use |
|---|---|---|
| `--brass` | `#A8804A` | Wordmark `&`, italic emphasis, eyebrow numerals, hover-mark |
| `--brass-deep` | `#8A6638` | Hover/press on brass elements |
| `--brass-soft` | `#C5A47E` | Light brass dividers |
| `--brass-wash` | `#EFE3D0` | Tinted background washes |

**Sage (secondary accent — reserved for sunroom contexts):**
- `--sage` `#6B7A5E` · `--sage-soft` `#C8CDB8`

**Functional:** `--success` `#5A7A4F` · `--danger` `#9B3A2E` · `--info` `#4A6B7A`

**Borders:** `--border` `#D9D1C2` (warm hairline) · `--border-strong` `#B8AE9C` · `--rule` `#1B1A17` (editorial heavy rule)

> **Forbidden:** pure white (`#fff`), pure black (`#000`), bluish-purple gradients, cool grays.

### Typography

**Families** (load from Google Fonts):
```
Cormorant Garamond: 300, 400, 500, 600, 700, italic 400
Inter: 300, 400, 500, 600, 700
```
- `--font-display: 'Cormorant Garamond', 'Garamond', 'Hoefler Text', serif`
- `--font-sans: 'Inter', -apple-system, 'Helvetica Neue', sans-serif`

**Scale:**
| Token | Size | Use |
|---|---|---|
| `--t-display` | 6.5rem (104px) | Hero, oversize editorial |
| `--t-h1` | 4.5rem (72px) | Page H1 |
| `--t-h2` | 3.25rem (52px) | Section heading |
| `--t-h3` | 2.25rem (36px) | Sub-heading |
| `--t-h4` | 1.625rem (26px) | Card title |
| `--t-h5` | 1.25rem (20px) | Sans, weight 500 |
| `--t-h6` | 1rem (16px) | Sans, weight 600 |
| `--t-lead` | 1.25rem (20px) | Lead paragraph (serif italic) |
| `--t-body-lg` | 1.125rem (18px) | Large body |
| `--t-body` | 1rem (16px) | Body |
| `--t-small` | 0.875rem (14px) | Small |
| `--t-caption` | 0.75rem (12px) | Caption |
| `--t-eyebrow` | 0.6875rem (11px) | Tracked uppercase eyebrow |

**Line-heights:** `--lh-tight 1.05` (display) · `--lh-snug 1.2` (h3/h4) · `--lh-normal 1.55` · `--lh-loose 1.75` (body paragraphs)

**Letter-spacing:** `--tr-tight -0.02em` (display/H1/H2/H3) · `--tr-normal 0` · `--tr-eyebrow 0.18em` (signature wide tracking — eyebrows widen up to 0.22–0.32em)

**Defaults applied to elements:**
- `h1, h2, h3, h4` → display family, weight **400** (serif sits at regular weight), `--tr-tight`, `--lh-tight`, `text-wrap: balance`
- `h5, h6` → sans family
- `p` → body, `--lh-loose 1.75`, color `--fg-2` (`#2B2A26`), `text-wrap: pretty`

**Utility classes** (replicate in Tailwind as components or utilities):
- `.lead` — display family, italic, 20px, color `--fg-2`
- `.eyebrow` — sans 11px / weight 500 / tracking 0.18em / uppercase / color `--fg-muted`
- `.display` — display family, 104px, weight **300**, letter-spacing -0.025em, line-height 0.95
- `.serif-italic` — display family, italic, weight 400

**Signature flourish — Eyebrow with serif numeral:**
```jsx
<div className="flex items-baseline gap-3 text-[#76726A]">
  <span className="font-display italic text-[18px] text-[#A8804A]">i</span>
  <span className="font-sans text-[11px] font-medium tracking-[0.22em] uppercase">Studio</span>
</div>
```
Numerals are Roman lowercase italic (`i`, `ii`, `iii`, `iv`) **or** decimal italic (`01`, `02`, `03`) in **brass**, sitting before each section's eyebrow label.

### Spacing — 4-step scale
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160px (`--s-1` through `--s-11`).

Sections breathe at **96–160px** vertical padding on desktop. White space *is* the luxury signal — do not compress.

### Layout
- `--container: 1280px`
- `--container-narrow: 880px`
- `--gutter: max(24px, 4vw)`

### Radii — restrained, editorial
| Token | Value |
|---|---|
| `--r-sm` | 2px |
| `--r-md` | 4px |
| `--r-lg` | 8px (max for cards/buttons) |
| `--r-pill` | 999px (tags only) |

> **Never** use `border-radius: 16px+`. Brand reads sharp and quiet, not pillowy.

### Shadows — warm-tinted, never cool
```css
--shadow-1: 0 1px 2px rgba(27, 26, 23, 0.04);
--shadow-2: 0 2px 8px rgba(27, 26, 23, 0.06), 0 1px 2px rgba(27, 26, 23, 0.04);
--shadow-3: 0 12px 32px rgba(27, 26, 23, 0.08), 0 4px 8px rgba(27, 26, 23, 0.04);
--shadow-4: 0 32px 64px rgba(27, 26, 23, 0.12), 0 8px 16px rgba(27, 26, 23, 0.06);
--shadow-image: 0 24px 48px rgba(27, 26, 23, 0.18); /* dramatic editorial weight */
```
Resting cards → `--shadow-2`. Hover → `--shadow-3`. Featured imagery → `--shadow-image`.

### Motion
- **Easing:** `--ease-editorial: cubic-bezier(0.25, 0.46, 0.45, 0.94)` — slightly slow at the end
- **Durations:** 180ms (fast UI) · 320ms (default) · 640ms (image reveals) · 900ms (hero entrance)
- **Patterns:** gentle fade + 30px rise on scroll-reveal. **No bounces, no springs, no scale > 1.05.**
- All motion respects `prefers-reduced-motion: reduce`.

---

## Components

All sizes/colors/copy below are taken directly from `design_files/components.jsx`.

### Logo / Wordmark

**Composition (CSS-only, no logo file):**
```
[Raise] [Design — italic 300] [& — italic, brass #A8804A, +2px] [Build]
```
- Font: Cormorant Garamond, baseline-aligned
- Default size: 26px (compact: 22px)
- "Raise" + "Build" = weight 400, letter-spacing 0.01em
- "Design" = italic, weight 300, padding 0 6px, letter-spacing 0.01em
- "&" = italic, color `#A8804A`, font-size +2px vs the rest, padding 0 4px
- Inverted variant: text color `#FAF7F2`, ampersand stays brass

### Button

| Variant | Background | Color | Border |
|---|---|---|---|
| `primary` | `#1B1A17` | `#FAF7F2` | `1px solid #1B1A17` |
| `secondary` | transparent | `#1B1A17` | `1px solid #1B1A17` |
| `inverted` | `#FAF7F2` | `#1B1A17` | `1px solid #FAF7F2` |
| `ghost` | transparent | `#1B1A17` | bottom-only `1px solid #1B1A17`, padding `6px 0` |

| Size | Padding | Font-size |
|---|---|---|
| sm | 10px 18px | 11px |
| md (default) | 14px 28px | 12px |
| lg | 18px 36px | 13px |

Type: Inter, weight 500, letter-spacing **0.18em**, UPPERCASE.
Optional trailing `arrowRight` icon (Lucide, 14px, stroke 1.25).

**Hover states:**
- `primary` → opacity 0.85
- `secondary` → background `#1B1A17`, color `#FAF7F2` (full inversion), opacity 1
- No scale, no shadow growth on buttons.

### Eyebrow

```jsx
<Eyebrow num="i">Studio</Eyebrow>
```
- Optional `num` prop renders serif italic in brass at 18px, gap 12px
- Label: Inter 11px / 500 / tracking 0.22em / uppercase / `#76726A`

### Header

- Sticky, fixed top
- **Above the fold:** fully transparent
- **On scroll (>40px):** background `rgba(245, 241, 234, 0.92)` + `backdrop-filter: blur(8px)` + 1px hairline border-bottom (`#D9D1C2`)
- Nav links: `Work · Studio · Process · Contact` — Inter 12px, weight 500, tracking 0.18em, uppercase
- Logo on left, nav center/right, primary "Schedule a Visit" button on right
- Mobile: hamburger (Lucide `menu`) → full-page sheet

### Cards (Service / Project)

- **No border, no top shadow.** Soft warm `--shadow-2` resting → `--shadow-3` on hover
- **Image flush** with card edges (no inner padding around image)
- Aspect ratio: **4:5 portrait** for project/service cards; 16:9 for featured; 1:1 for Instagram grid
- Corner radius: max **4px**
- Text content padding: 16–18px horizontal, 16/20px vertical
- **Hover:** `transform: translateY(-4px)` over 480ms, title color shifts to `#A8804A` (brass)
- Title is `<h3>` Cormorant Garamond, 36px, weight 400, line-height 1.2

### Forms

- **Underline-only inputs.** No boxed inputs. No filled backgrounds.
- Default: 1px bottom border `#D9D1C2`
- Focus: bottom border becomes `#A8804A` (brass) — see `.rb-input:focus` rule in `index.html`
- Label above field: eyebrow style (Inter 11px / 500 / tracking 0.18em / uppercase / `#76726A`)
- Input text: Inter 16–18px, color `#1B1A17`
- Padding: 12px 0 (no horizontal padding — underline runs full width)

### Iconography

- **Library:** `lucide-react` (already in codebase)
- **Stroke weight:** **1.25** globally (override Lucide's default 2)
- **Sizes:** 16px in dense UI · 22px standard · 28px feature moments. **Never larger than 32px.**
- **Color:** inherits text color. Brass color reserved for the "marker" icon (project number bullets) — never colored gratuitously.
- **No emoji. No hand-rolled SVGs** for common icons.

The custom inline SVGs in `components.jsx` are there only because the prototype is self-contained — replace them 1:1 with `lucide-react` imports:
- `arrowRight` → `ArrowRight`
- `arrowDownRight` → `ArrowDownRight`
- `instagram` → `Instagram`
- `menu` → `Menu` · `close` → `X`
- `plus` / `minus` · `pin` → `MapPin` · `phone` → `Phone` · `mail` → `Mail`
- `chevDown` → `ChevronDown` · `check` → `Check`

---

## Screens / Views

Two screens in this bundle. All sub-component composition is in `design_files/components.jsx`; copy and structure below.

### 1. Home (`01 Home`)

Composition (top → bottom):
1. **Header** — sticky, transparent above fold
2. **Hero** — full viewport, hero image with brand-tinted overlay, oversize serif headline split across two columns
3. **EditorialIntro** — sand background (`--paper-2`), lead paragraph in serif italic
4. **Services** — 4 cards (Kitchens · Bathrooms · Sunrooms · Millwork), 4:5 portrait imagery
5. **FeaturedProject** — full-bleed image with `--shadow-image`, vertical credit line (rotated 180°, tracked 0.32em)
6. **Process** — anchor section on `--ink` charcoal background, inverted type, four numbered steps (`01 / 02 / 03 / 04` in brass italic)
7. **Testimonial** — single quote, serif italic, oversize
8. **Cta** — large "Bring craftsmanship to your space." with brass italic emphasis on *your space.*
9. **Footer** — three columns (Studio / Work / Contact) + © line + Instagram

**Section rhythm:** alternate `--paper` and `--paper-2`. Use `--ink` (charcoal) for **one** anchor section per page (Process is canonical).

**Vertical credit line** (architecture-monograph signature):
- Position: hero, right edge
- `writing-mode: vertical-rl; transform: rotate(180deg);`
- Inter 11px, tracking 0.32em, uppercase, color `--ink-4`

### 2. Schedule a Visit (`02 Schedule`)

- Two-column layout: form left (60%), supporting copy + contact info right (40%)
- Underline-only inputs:
  - Name · Email · Phone · Address (city/town)
  - Project type — radio chips (Kitchen / Bath / Sunroom / Millwork / Other)
  - Timeframe — select (`Within 3 months / 3–6 months / 6+ months / Just exploring`)
  - Tell us about your project — textarea
- Submit button: primary, lg size, with trailing `arrowRight`
- Right column: address block, phone, email, service area, plus a quiet pull-quote in serif italic

---

## Voice & Copy

The brand voice is **honest, quiet, and craft-forward**.

- **Tone:** confident but unhurried. Direct. Plainspoken. Slightly literary.
- **Person:** *We* (the studio) and *you* (the homeowner). Family is named — Paul Sr., Paul Jr., Jessica.
- **Casing:** sentence case for all running copy, headlines, and CTAs. Eyebrows are UPPERCASE with wide tracking. **Avoid Title Case.**
- **Punctuation:** em-dashes for asides, **no exclamation points**, no rhetorical questions. Periods at the ends of headlines are encouraged.
- **Numbers:** spelled out for small counts in editorial copy ("fourteen weeks"). Numerals for project numbers, dates, phone.
- **Vocabulary:** prefer concrete material words — *cerused white oak*, *honed marble*, *oil-rubbed bronze*, *bench-built* — over generic adjectives.

**Forbidden words:** "stunning", "breathtaking", "dream", "transform", "luxury", "premium", "world-class".
**Forbidden patterns:** Title Case headlines, exclamation points, all-caps urgency, emoji.

**Example headlines (use as anchors):**
- "Crafted by hand. Built for life."
- "Founded by a master carpenter, continued by his children."
- "From conversation to completion."
- "We meet at your home, walk the space, and listen. No drawings yet — only questions."

---

## Interactions & Behavior

### Scroll-reveal
Sections fade in (opacity 0 → 1) and rise 30px on entering viewport. Easing: `--ease-editorial`. Duration: 640ms. Stagger child elements at 80ms intervals.

### Hover
- **Links:** opacity drop to 0.65, transition 180ms
- **Buttons:** see component spec above
- **Cards:** translateY(-4px) over 480ms, title color → brass. **No** shadow growth, **no** scale.
- **Press:** subtle opacity dip, no shrink animation

### Sticky header
- Above fold (`scrollY <= 40`): transparent, no border
- Scrolled (`scrollY > 40`): `rgba(245, 241, 234, 0.92)` + `backdrop-filter: blur(8px)` + 1px bottom border `#D9D1C2`

### Modals & overlays
- Background: `rgba(27, 26, 23, 0.6)`, **no blur** (clean editorial modals)

### Form validation
- Errors inline below the field, color `--danger` `#9B3A2E`
- Field bottom border becomes `--danger` on error
- No icon decoration on errors — text only

### Responsive
- Desktop spec is 1280px container. Tablet (≥768px) drops to 2-column service grid. Mobile (<768px) is single column, sections compress vertical padding from 96–160px → 64–96px.
- Type uses `clamp()` to scale gracefully on mobile (e.g. hero `clamp(56px, 10vw, 104px)`).

---

## State Management

Minimal — this is a marketing site. Each page is a Server Component by default; only sticky header (scroll listener), mobile menu, and the schedule form need `'use client'`.

- **Header:** `scrolled: boolean` (window.scrollY listener) · `mobileMenuOpen: boolean`
- **Schedule form:** controlled inputs (name, email, phone, address, projectType, timeframe, message), `submitting`, `submitted`, `errors`
- **No global state** needed. No data fetching beyond Instagram embed (existing).

---

## Assets

| Asset | Source | Notes |
|---|---|---|
| `assets/hero.jpg` | Existing repo `public/images/hero.jpg` | Real interior photograph, warm daylit |
| Service grid imagery | **Missing** | Placeholder gradients in prototype. **Need:** 4 portrait (4:5) images — one per service (Kitchens, Bathrooms, Sunrooms, Millwork) |
| Featured project image | **Missing** | **Need:** 1 wide (16:9 or 16:6) full-bleed hero |
| Logo file | **None exists.** Wordmark is composed live in CSS (see Logo component spec). If a real logo arrives, drop in `/public/` and update Logo. |
| Icons | `lucide-react` (already installed) | Override stroke to 1.25 |

**Photography rules:** real, warm, daylit interior photography. **No stock, no illustrated, no AI-generated.** No filters, no duotones, no grain. Color vibe: cream cabinetry, brass hardware, oak floors, charcoal stone — the brand's colors echo the houses it builds.

---

## Files in this bundle

| File | What's in it |
|---|---|
| `README.md` | This document |
| `colors_and_type.css` | All design tokens (color, type, spacing, radii, shadow, motion). Drop into `globals.css`. |
| `design_files/index.html` | Hi-fi prototype shell (loads React + components.jsx) |
| `design_files/components.jsx` | All React components — Logo, Button, Eyebrow, Header, Hero, Services, FeaturedProject, Process, Testimonial, Cta, Footer, SchedulePage |
| `design_files/assets/hero.jpg` | Hero photograph |

To preview the prototype locally: open `design_files/index.html` in a browser (it loads React from CDN).

---

## Caveats & substitutions

- **Fonts.** Original site uses Geist Sans + Geist Mono. This system substitutes **Inter** for sans (closer to a refined editorial feel) and adds **Cormorant Garamond** as serif display. To retain Geist for body, swap `--font-sans` in `colors_and_type.css`; the system will continue to read coherently.
- **Logo.** No logo file in repo. Wordmark is CSS-only — replace if a real logo arrives.
- **Imagery.** Only `hero.jpg` was available. Service grid uses placeholder gradients in the brand palette. Real photography is the **single biggest lift** to land the design.
- **Phone, email, addresses** in the prototype are placeholders. Replace with real contact info.
- **"Raise Design & Build" company name** confirmed by client mid-session (was previously rendered as "Raise & Build" in early prototypes).
