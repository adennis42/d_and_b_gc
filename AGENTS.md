# AGENTS.md — Raise Design & Build (d_and_b_gc)

## Project Overview
Marketing website for **Raise Design & Build** — a high-end residential remodeler on Long Island, NY (kitchens, baths, sunrooms, millwork).
- **Stack:** Next.js 15, TypeScript, Tailwind CSS, Shadcn UI, Lucide React, Framer Motion
- **Repo:** https://github.com/adennis42/d_and_b_gc
- **Current branch:** `revamp-website`

## Active Design System
**Modern Elegant Redesign** — full spec in `design_handoff_modern_elegant_redesign/README.md`
Reference components: `design_handoff_modern_elegant_redesign/design_files/components.jsx`
CSS tokens: `design_handoff_modern_elegant_redesign/colors_and_type.css`

## Design Direction (summary)
- **Warm paper neutrals** — never pure white. Primary bg: `#F5F1EA`. Alt section: `#EDE6DA`.
- **Charcoal ink** — never pure black. Headlines: `#1B1A17`. Body: `#2B2A26`.
- **Aged brass accent** (`#A8804A`) — used sparingly, one brass moment per screen.
- **Typography:** Cormorant Garamond (display/serif) + Inter (body/UI). Load from Google Fonts.
- **No emoji, no stock illustrations, no sales-y voice.**
- **Spacing is generous** — sections breathe at 96–160px vertical padding. White space = luxury.
- **Icons:** lucide-react, strokeWidth=1.25 globally.
- **Corners:** max 8px (cards/buttons). Never 16px+.
- **Shadows:** warm-tinted only. `rgba(27, 26, 23, ...)` — never cool grays.

## Key Design Tokens (implement in globals.css + tailwind.config.ts)
```
--paper: #F5F1EA        --ink: #1B1A17
--paper-2: #EDE6DA      --ink-2: #2B2A26
--paper-3: #E2D8C6      --ink-3: #4A4842
--bone: #FAF7F2         --ink-4: #76726A
--linen: #F0EAE0        --ink-5: #A39E94
--brass: #A8804A        --border: #D9D1C2
--brass-deep: #8A6638   --border-strong: #B8AE9C
--brass-soft: #C5A47E
--brass-wash: #EFE3D0
```

## What Needs Building
1. **Design tokens** → `src/app/globals.css` CSS vars + `tailwind.config.ts` theme.extend
2. **Typography** → load Cormorant Garamond + Inter via next/font in `src/app/layout.tsx`
3. **Header** → sticky transparent → frosted glass on scroll, nav links, logo wordmark, CTA button
4. **Hero** → full viewport, hero image with tinted overlay, oversize serif headline, vertical credit line
5. **EditorialIntro** → sand bg, serif italic lead paragraph
6. **Services** → 4 cards (Kitchens/Baths/Sunrooms/Millwork), 4:5 portrait, hover brass title
7. **FeaturedProject** → full-bleed image with shadow-image
8. **Process** → charcoal dark section, 4 numbered steps with brass italic numerals
9. **Testimonial** → single serif italic quote
10. **CTA** → large headline with brass emphasis on *your space.*
11. **Footer** → three columns + copyright + Instagram

## Agent Rules
1. Read `design_handoff_modern_elegant_redesign/README.md` first — all specs live there
2. Reference `design_files/components.jsx` for exact component structure
3. Use CSS variables + Tailwind theme tokens — no hardcoded hex in components
4. Use `lucide-react` for all icons with `strokeWidth={1.25}`
5. Google Fonts via `next/font/google` — Cormorant Garamond + Inter
6. Run build after each major section: `cd /Users/andrew/Documents/d_and_b_gc && bun run build`
7. Commit with descriptive messages, push to `revamp-website` branch
8. **Never** pure white (#fff) or pure black (#000)
9. **Never** rounded corners > 8px
10. **Never** cool gray shadows
