# Sanchari Speaks

**നിങ്ങളുടെ വാക്കുകൾ, സഞ്ചാരത്തിന്റെ ശൈലിയിൽ**
*Your words, in the style of Sancharam.*

Sanchari Speaks transforms everyday Malayalam, English, or Manglish text into the distinctive literary narration style of *Sancharam* — Kerala's iconic travel documentary series. Type a plain observation; receive the kind of elevated, contemplative prose that made Sancharam a cultural phenomenon.

---

## What It Does

*Sancharam* is renowned for its ornate, literary Malayalam — formal vocabulary rooted in Sanskrit and pure Malayalam, unhurried sentence rhythms, and a traveller's wonder at the world. Sanchari Speaks brings that voice to anyone:

- **Input** text in Malayalam, English, or Manglish (Malayalam in Latin script)
- **Auto-detects** the input language
- **Transforms** it into Sancharam-style narration using an LLM guided by a curated prompt pipeline
- **Enforces vocabulary** from a hand-curated glossary (e.g., "airport" → "വിമാനത്താവളം", "skyscraper" → "അംബരചുംബി")
- **Copy** the result to clipboard for sharing on WhatsApp, Instagram, or X

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, TypeScript) |
| UI | React 19, CSS Modules |
| Fonts | Noto Serif + Noto Sans Malayalam + Inter via `next/font/google` |
| LLM | Claude Sonnet 4.6 via [OpenRouter](https://openrouter.ai/) |
| LLM Client | OpenAI JS SDK (pointed at OpenRouter) |
| Deployment | Vercel (recommended) |
| Data pipeline | Python 3 (`youtube-transcript-api`) — offline, for transcript extraction |

### Key files

```
sanchari-speaks/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, metadata
│   ├── globals.css                 # Design tokens, base reset, topographic texture
│   ├── page.tsx                    # Home page
│   ├── components/
│   │   ├── Header.tsx / .module.css
│   │   ├── Hero.tsx / .module.css
│   │   ├── TranslatePanel.tsx / .module.css   # Core interactive component
│   │   ├── OutputCard.tsx / .module.css
│   │   ├── ExamplesSection.tsx / .module.css
│   │   └── Footer.tsx / .module.css
│   └── api/
│       └── translate/route.ts      # POST /api/translate
├── lib/
│   ├── openrouter.ts               # LLM API client
│   ├── prompt-builder.ts           # Assembles system prompt from data files
│   └── glossary.ts                 # Loads glossary + verifies output
├── prompts/
│   └── system_prompt.md            # Core style description
├── data/
│   ├── glossary.json               # ~50–100 curated vocabulary mappings
│   ├── examples/                   # 8 few-shot example files (travel, food, etc.)
│   └── transcripts/                # Raw Sancharam episode transcripts (offline)
└── scripts/
    ├── fetch_transcripts.py        # YouTube transcript extraction CLI
    ├── run_batch.py                # Batch transcript runner
    └── transform.py                # Transcript transformation utilities
```

---

## How It Works

Each translation request assembles a prompt in three parts:

1. **System prompt** (`prompts/system_prompt.md`) — detailed style rules: formal literary Malayalam, Sanskrit-origin vocabulary, sentence structure patterns, and what to avoid.
2. **Glossary injection** (`data/glossary.json`) — a table of common terms mapped to Sancharam-style equivalents, injected as a vocabulary override.
3. **Few-shot examples** (`data/examples/*.md`) — 8 curated excerpts from actual Sancharam episode transcripts, showing the target style in action.

The assembled prompt is sent to Claude Sonnet 4.6 via OpenRouter. The response is post-processed to verify glossary terms were applied.

---

## Running Locally

### Prerequisites

- Node.js 18+
- An [OpenRouter](https://openrouter.ai/) API key with access to `anthropic/claude-sonnet-4-6`

### Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd sanchari-speaks

# 2. Install dependencies
npm install

# 3. Configure environment
cp env.example .env.local
# Edit .env.local and add your key:
# OPENROUTER_API_KEY=sk-or-...

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | Yes | Your OpenRouter API key |

### Build for production

```bash
npm run build
npm start
```

### Translate API

The web app exposes a single REST endpoint that the UI calls, and which you can also hit directly:

**`POST /api/translate`**

```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "I visited the airport and it was huge"}'
```

**Request body**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | `string` | Yes | Input text — Malayalam, English, or Manglish |

**Success response `200`**

```json
{
  "translated_text": "വിമാനത്താവളത്തിന്റെ...",
  "glossary_warnings": []
}
```

`glossary_warnings` is an array of strings listing any expected vocabulary substitutions that were not found in the output.

**Error responses**

| Status | Cause | Body |
|---|---|---|
| `400` | Missing or empty `text` field | `{ "error": "text field is required" }` |
| `500` | `OPENROUTER_API_KEY` not configured | `{ "error": "OPENROUTER_API_KEY is not configured" }` |
| `502` | OpenRouter / LLM API error | `{ "error": "<message>" }` |

---

## Data Pipeline (Offline)

The `scripts/` directory contains Python tools for extracting and processing Sancharam transcripts. These are run offline during data curation — they are not part of the web app's runtime.

### Prerequisites

```bash
pip install youtube-transcript-api
```

### Fetch transcripts

```bash
# Single video
python scripts/fetch_transcripts.py --url "https://www.youtube.com/watch?v=VIDEO_ID"

# From a list of URLs
python scripts/fetch_transcripts.py --file data/video_urls.txt

# Batch run
python scripts/run_batch.py
```

Transcripts are saved to `data/transcripts/` as JSON files (one per video). Videos without Malayalam captions are skipped and logged.

---

## Design

The UI follows the *"Digital Heirloom"* design system — an editorial aesthetic inspired by a traveller's weathered journal:

- **Palette** rooted in Kerala: Deep Forest green (`#154212`), Warm Gold (`#885210`), Cream Parchment (`#fcf9ee`)
- **Typography**: Noto Serif for headlines (the narrative voice), Inter for UI (the functional voice)
- **No border lines** — sections separated by tonal background shifts
- **Glassmorphism** navigation bar with `backdrop-filter: blur(12px)`
- **Topographic SVG texture** at 5% opacity as background

---

## Attribution

Inspired by *Sancharam*, the Malayalam travel documentary series. The vocabulary glossary and few-shot examples are derived from publicly available episode transcripts. Sanchari Speaks does not reproduce Sancharam content — it transforms user-provided input.
