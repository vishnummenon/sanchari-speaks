## Context

The backend is complete: `app/api/translate/route.ts` accepts POST `{ text }` and returns `{ translated_text, glossary_warnings }`. The Next.js app (v16, App Router) exists with no frontend pages or components. The Stitch design is finalised — two screens (mobile + desktop home) with a shared single-page layout, a "Digital Heirloom" editorial theme rooted in Kerala aesthetics, and a full design token set.

No Tailwind is installed. No component library is in use. The codebase is TypeScript throughout.

## Goals / Non-Goals

**Goals:**
- Implement the single home page matching the Stitch design (mobile + desktop)
- Wire the translate textarea to `/api/translate` with loading and error states
- Apply the full Stitch design system: Cream Parchment palette, Noto Serif + Inter typography, glassmorphism nav, tonal layering, no border lines
- Copy-to-clipboard on output

**Non-Goals:**
- Share as image (deferred — too complex for v1; show a toast instead)
- Additional pages (archives, heritage, craft)
- Authentication or rate limiting on the frontend
- Animation or page transitions beyond CSS

## Decisions

### CSS Modules over Tailwind
**Decision:** Use CSS Modules (`*.module.css`) per component, no Tailwind.  
**Rationale:** Tailwind is not installed and the design uses bespoke tokens (cream parchment, Kerala greens) that map cleanly to CSS custom properties. Adding Tailwind for one page adds build complexity with no benefit. CSS Modules keep styles colocated, scoped, and zero-runtime.  
**Alternative considered:** Inline styles — rejected because pseudo-selectors (`:hover`, `::before`) and media queries require a stylesheet.

### CSS custom properties for the design system
**Decision:** Define all design tokens in `globals.css` as `--color-*`, `--font-*` variables consumed by every module.  
**Rationale:** The Stitch design system is the single source of truth. Centralising tokens means a palette change touches one file. Mirrors the Stitch token naming directly.

### Client component boundary at TranslatePanel
**Decision:** `page.tsx` and all layout components are server components. Only `TranslatePanel` (and `OutputCard` embedded within it) is a `"use client"` component.  
**Rationale:** Keeps the RSC boundary minimal — only the interactive fetch + state logic needs the client. Header, Hero, Examples, and Footer are pure markup with no interactivity.

### Topographic SVG texture via CSS `background-image`
**Decision:** Render the background texture as a data-URI SVG in `globals.css` at 5% opacity.  
**Rationale:** No image assets needed, no network request, scales infinitely. Matches the Stitch design spec exactly.

### Kerala hero image via `next/image` with a placeholder
**Decision:** Use `next/image` for the hero landscape. Use a solid `surface_container_low` colour as a blurred placeholder.  
**Rationale:** Avoids layout shift and lazy-loads on mobile. The cream placeholder is on-brand while the image loads.

## Risks / Trade-offs

- **[Risk] Malayalam font rendering on older Android** → Noto Serif Malayalam is loaded via `next/font/google`; it includes the Malayalam Unicode block. Older Android WebViews may fall back to system font but will still render correctly.
- **[Risk] `/api/translate` latency (2–5 s LLM calls)** → `TranslatePanel` shows a pulsing "Translating…" skeleton state during the fetch. The button is disabled while loading to prevent double-submits.
- **[Risk] Clipboard API unavailable on HTTP** → `navigator.clipboard` requires a secure context. On `localhost` dev this works; on Vercel (HTTPS) it works. No mitigation needed for production; dev is fine.
- **[Risk] No hero image asset yet** → Use an `unsplash` Kerala landscape URL as a temporary stand-in. Can be swapped for a local asset before launch.
