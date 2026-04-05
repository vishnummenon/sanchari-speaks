## Why

The backend style-transfer engine (API route, prompt builder, glossary) is fully operational, but there is no frontend — the app cannot be used by anyone. The Stitch design for Sanchari Speaks is finalised and ready to implement.

## What Changes

- Add `app/layout.tsx` — root layout loading Noto Serif + Inter via `next/font`
- Add `app/globals.css` — design token CSS variables, base reset, topographic SVG texture
- Replace `app/page.tsx` placeholder — server component composing all page sections
- Add `app/components/Header.tsx` — sticky glassmorphism navigation bar (desktop + mobile)
- Add `app/components/Hero.tsx` — editorial hero section with headline, subtitle, Kerala image, CTA
- Add `app/components/TranslatePanel.tsx` — textarea input + translate button + loading state; calls `/api/translate`
- Add `app/components/OutputCard.tsx` — Malayalam output blockquote with copy-to-clipboard
- Add `app/components/ExamplesSection.tsx` — 4 hardcoded before/after "Raw Thought → Sanchari Style" cards
- Add `app/components/Footer.tsx` — tagline, links, copyright
- Add CSS Modules (`*.module.css`) for each component

## Capabilities

### New Capabilities

- `home-page`: Single-page responsive UI that lets users input text and receive Sancharam-style Malayalam output, surfacing the existing `/api/translate` endpoint to end users

### Modified Capabilities

_(none — the API contract is unchanged)_

## Impact

- **New dependencies**: `next/font` (bundled with Next.js — no new packages needed)
- **Existing API**: `/api/translate` POST endpoint consumed by `TranslatePanel` — no route changes
- **No breaking changes**
