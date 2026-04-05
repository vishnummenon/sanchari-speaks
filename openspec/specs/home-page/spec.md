## Requirements

### Requirement: Page renders all sections in correct order
The home page (`app/page.tsx`) SHALL render Header, Hero, TranslatePanel, ExamplesSection, and Footer as distinct sections in that order, on a Cream Parchment (`#fcf9ee`) background with no visible border lines between sections.

#### Scenario: Full page structure
- **WHEN** a user loads the home page
- **THEN** the page contains a sticky header, a hero section, a translate panel, an examples section, and a footer — in that vertical order

---

### Requirement: Header is sticky and uses glassmorphism
The Header component SHALL be position-fixed at the top of the viewport, display "Sanchari Speaks" as the brand name with the Malayalam tagline, and apply `backdrop-filter: blur(12px)` with a semi-transparent surface background.

#### Scenario: Desktop navigation
- **WHEN** the viewport width is ≥ 768px
- **THEN** the header shows three nav links: "Our Heritage", "Travelogue Archives", "The Craft"

#### Scenario: Mobile navigation
- **WHEN** the viewport width is < 768px
- **THEN** the header hides the text nav links and shows a single explore icon instead

---

### Requirement: Hero section presents the core value proposition
The Hero component SHALL display a "Draft Your Journey" headline in Noto Serif display size, a short subtitle, a Kerala landscape image, and a CTA button that scrolls to the translate panel.

#### Scenario: CTA scrolls to translate panel
- **WHEN** the user clicks the "✨ Translate to Narrative" CTA button
- **THEN** the page scrolls smoothly to the TranslatePanel section

#### Scenario: Hero image loads with placeholder
- **WHEN** the hero image is loading
- **THEN** a `surface_container_low` colour block is shown as placeholder with no layout shift

---

### Requirement: TranslatePanel accepts input and calls the translate API
The TranslatePanel component (`"use client"`) SHALL render a bottom-border-only textarea, a translate button, and pass the submitted text to `POST /api/translate`, then display the result in an OutputCard.

#### Scenario: Successful translation
- **WHEN** the user enters text and clicks "Translate"
- **THEN** the component calls `POST /api/translate` with `{ text }`, shows a loading state, and on success renders the `translated_text` in the OutputCard

#### Scenario: Loading state
- **WHEN** the API call is in-flight
- **THEN** the translate button is disabled and a "Translating…" indicator is visible

#### Scenario: Error state
- **WHEN** the API returns a non-200 response
- **THEN** an inline error message is shown below the textarea and the OutputCard is not rendered

#### Scenario: Empty submission prevented
- **WHEN** the user clicks "Translate" with an empty textarea
- **THEN** no API call is made and the button remains inactive

---

### Requirement: OutputCard displays translated text with copy action
The OutputCard component SHALL render the translated Malayalam text in a large blockquote styled with a `format_quote` icon and provide a "Copy Text" button that writes the text to the clipboard.

#### Scenario: Copy to clipboard
- **WHEN** the user clicks "Copy Text"
- **THEN** the translated text is written to `navigator.clipboard` and the button label changes to "Copied!" for 2 seconds

#### Scenario: Share as Image shows toast
- **WHEN** the user clicks "Share as Image"
- **THEN** a toast message "Coming soon" is displayed for 2 seconds (feature deferred)

---

### Requirement: ExamplesSection shows four before/after pairs
The ExamplesSection component SHALL display exactly 4 hardcoded example pairs showing a "Raw Thought" (English input) alongside its "Sanchari Style" (Malayalam output) in postcard-style cards with `surface_container_highest` background and no borders.

#### Scenario: Desktop two-column layout
- **WHEN** the viewport width is ≥ 768px
- **THEN** the four example cards are displayed in a 2-column grid

#### Scenario: Mobile single-column layout
- **WHEN** the viewport width is < 768px
- **THEN** the four example cards stack in a single column

---

### Requirement: Design tokens are applied consistently across all components
The implementation SHALL use CSS custom properties defined in `globals.css` for all colours, fonts, and spacing. No raw hex values or `#000`/`#fff` SHALL appear in component CSS.

#### Scenario: No raw black or white
- **WHEN** inspecting any component's computed styles
- **THEN** text colour resolves to `var(--color-on-surface)` (`#1c1c15`) and backgrounds resolve to surface token values, never pure `#000000` or `#ffffff`

#### Scenario: Border radius minimum
- **WHEN** inspecting any interactive element (buttons, cards, inputs)
- **THEN** the computed `border-radius` is at least `8px`
