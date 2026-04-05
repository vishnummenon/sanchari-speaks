Build Plan: Sanchari Speaks UI

What exists

- app/api/translate/route.ts — POST endpoint (text → Sancharam Malayalam)
- lib/ — prompt builder, OpenRouter client, glossary verifier
- No frontend at all — app/ has only the API route  


What the Stitch design specifies

2 screens: Mobile Home + Desktop Home

Both share the same single-page layout with these sections:

┌─────┬───────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────┐  
 │ # │ Section │ Key Elements │
├─────┼───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤  
 │ 1 │ Header / Nav │ "Sanchari Speaks" + Malayalam tagline; desktop: 3 nav links; mobile: explore icon. │
│ │ │ Glassmorphism backdrop-filter: blur(12px) │
├─────┼───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤  
 │ 2 │ Hero │ "Draft Your Journey" headline (Noto Serif display); short subtitle; "✨ Translate to │
│ │ │ Narrative" CTA; landscape photo (Kerala) │  
 ├─────┼───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3 │ Translate Panel │ Textarea input (soft-top / bottom-border only style); Translate button; output quote block │  
 │ │ │ with Malayalam prose │  
 ├─────┼───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4 │ Output Card │ Large blockquote, format_quote icon, "Copy Text" + "Share as Image" action buttons │  
 ├─────┼───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤  
 │ 5 │ Examples — "The │ 4 before/after pairs: Raw Thought (English) → Sanchari Style (Malayalam). Shown as │
│ │ Evolution" │ postcard-style cards │  
 ├─────┼───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 6 │ Footer │ "Why Sanchari Speaks?" blurb; © 2024 The Narrative Traveler; 3 links │  
 └─────┴───────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────┘

---

Design token mapping (CSS variables)

--color-primary: #154212 (Deep Forest)
--color-secondary: #885210 (Warm Gold)  
 --color-tertiary: #6e1c0c (Terracotta)
--color-surface: #fcf9ee (Cream Parchment)  
 --color-surface-low: #f7f4e9
--color-surface-high: #ebe8dd  
 --color-surface-highest:#e5e2d8
--color-on-surface: #1c1c15  
 --color-on-surface-var: #42493e
--color-outline: #c2c9bb

--font-narrative: 'Noto Serif' (headlines, display)  
 --font-functional: 'Inter' (body, labels, UI)

---

File structure to build

app/
layout.tsx ← root layout; loads Noto Serif + Inter via next/font
globals.css ← CSS variables, base reset, topographic texture, scrollbar  
 page.tsx ← page composer (server component, no state)  
 components/  
 Header.tsx ← glassmorphism sticky nav, desktop + mobile responsive  
 Hero.tsx ← headline, subtitle, Kerala image, CTA scroll-link  
 TranslatePanel.tsx ← textarea + button + loading state; calls /api/translate  
 OutputCard.tsx ← quote block + copy + share-as-image  
 ExamplesSection.tsx ← 4 hardcoded before/after cards  
 Footer.tsx ← tagline + 3 links  
 components/  
 Header.module.css  
 Hero.module.css  
 TranslatePanel.module.css
OutputCard.module.css  
 ExamplesSection.module.css
Footer.module.css

---

Implementation order

1. globals.css + layout.tsx — fonts, CSS vars, base reset, topographic SVG background pattern
2. Header — sticky glassmorphism bar, collapses to icon on mobile
3. Hero — full-width editorial section with asymmetric layout
4. TranslatePanel — the core interactive piece; client component with useState; calls /api/translate; feeds result into  
   OutputCard
5. OutputCard — copy-to-clipboard (Clipboard API); share-as-image deferred (screenshot too complex for v1, show a toast instead)
6. ExamplesSection — static cards, 2-col desktop / 1-col mobile
7. Footer — simple
8. page.tsx — wire everything together  


---

Key design rules to enforce in code

- No border lines — use background color shifts for section separation
- No #000 / #fff — always var(--color-on-surface) / var(--color-surface)
- Minimum border-radius: 8px everywhere
- Cards: surface_container_highest background, asymmetric padding
- Inputs: bottom-border only (outline_variant at 15% opacity)
- Primary button: gradient #154212 → #2d5a27, xl roundedness  


---
