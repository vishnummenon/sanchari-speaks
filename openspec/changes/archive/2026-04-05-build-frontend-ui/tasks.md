## 1. Foundation

- [x] 1.1 Create `app/globals.css` — define all CSS custom properties (`--color-*`, `--font-*`), base reset (no pure black/white, min `border-radius: 8px`), and topographic SVG texture as a data-URI `background-image` at 5% opacity on `body`
- [x] 1.2 Create `app/layout.tsx` — root layout that loads Noto Serif and Inter via `next/font/google`, applies fonts as CSS variables, sets `<html lang="ml">`, and wraps children with the cream parchment background

## 2. Header

- [x] 2.1 Create `app/components/Header.tsx` — render brand name "Sanchari Speaks" + Malayalam tagline; position fixed; apply glassmorphism (`backdrop-filter: blur(12px)`, semi-transparent surface background)
- [x] 2.2 Create `app/components/Header.module.css` — desktop nav shows three links ("Our Heritage", "Travelogue Archives", "The Craft"); mobile (`< 768px`) hides links and shows explore icon only

## 3. Hero

- [x] 3.1 Create `app/components/Hero.tsx` — "Draft Your Journey" headline (Noto Serif display), subtitle, Kerala landscape via `next/image` with `surface_container_low` placeholder, and CTA anchor that smooth-scrolls to `#translate`
- [x] 3.2 Create `app/components/Hero.module.css` — asymmetric layout (image offset, text overlapping), responsive stack on mobile

## 4. Translate Panel & Output Card

- [x] 4.1 Create `app/components/OutputCard.tsx` — render translated Malayalam text in a large blockquote with `format_quote` icon; "Copy Text" button writes to `navigator.clipboard` and shows "Copied!" for 2s; "Share as Image" button shows a 2s toast "Coming soon"
- [x] 4.2 Create `app/components/OutputCard.module.css` — blockquote styled with `surface_container_highest` background, asymmetric padding, Noto Serif text
- [x] 4.3 Create `app/components/TranslatePanel.tsx` (`"use client"`) — bottom-border-only textarea (soft-top style), "Translate" button (gradient `#154212 → #2d5a27`, xl roundedness); on submit call `POST /api/translate`, manage loading/error/success state; render `OutputCard` with result; prevent empty submission; disable button while loading
- [x] 4.4 Create `app/components/TranslatePanel.module.css` — textarea with bottom border only (`outline_variant` at 15% opacity), loading skeleton pulse animation, inline error message style

## 5. Examples Section

- [x] 5.1 Create `app/components/ExamplesSection.tsx` — "The Evolution" heading; 4 hardcoded before/after pairs (rain, tea, lost direction, traffic) each showing "Raw Thought" English input and "Sanchari Style" Malayalam output
- [x] 5.2 Create `app/components/ExamplesSection.module.css` — postcard-style cards (`surface_container_highest`, asymmetric padding, no borders, `border-radius ≥ 8px`); 2-column grid on desktop (`≥ 768px`), single column on mobile

## 6. Footer

- [x] 6.1 Create `app/components/Footer.tsx` — "Why Sanchari Speaks?" blurb, © 2024 The Narrative Traveler, links: Journal / Archives / About
- [x] 6.2 Create `app/components/Footer.module.css` — `surface_container_low` background, centered layout, Noto Serif tagline

## 7. Page Assembly & Verification

- [x] 7.1 Update `app/page.tsx` — replace placeholder with full server component that renders `<Header />`, `<Hero />`, `<TranslatePanel id="translate" />`, `<ExamplesSection />`, `<Footer />`
- [x] 7.2 Verify `next build` completes without TypeScript errors
- [x] 7.3 Smoke-test on mobile viewport (390px) and desktop (1280px) — confirm section order, glassmorphism header, responsive grid, translate flow end-to-end
