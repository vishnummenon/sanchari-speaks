# Sanchari Speaks — High-Level Design Document

**Version:** 1.0  
**Date:** April 2026  
**Author:** Vishnu Mohan  
**Status:** Prototype

---

## 1. Overview

Sanchari Speaks is a web application that transforms everyday Malayalam (or English) sentences into the distinctive narration style of _Sancharam_ — the iconic Malayalam travel documentary series. The narrator's style is characterised by ornate, literary Malayalam, a preference for pure Malayalam and Sanskrit-origin terms over English loanwords, and an elevated, contemplative register that has become a cultural phenomenon in Kerala.

The application uses AI-powered style transfer via prompt engineering against a frontier LLM, supported by a curated glossary and few-shot examples extracted from actual Sancharam episode transcripts.

---

## 2. Architecture Overview

The system has three distinct layers:

**Data Layer** — A Python service that extracts Malayalam transcripts from Sancharam YouTube videos. These transcripts feed the glossary and few-shot example curation process.

**Style Transfer Engine** — A prompt engineering pipeline that combines a system prompt, a vocabulary glossary, and curated transcript excerpts to perform style transfer via a frontier LLM API (Claude / Gemini / GPT-4o).

**Web Application** — A responsive Next.js frontend with an API backend that accepts user input and returns Sancharam-style output.

```
┌─────────────────────────────────────────────────────┐
│                   Web Application                   │
│              (Next.js on Vercel)                     │
│  ┌─────────────┐    ┌────────────────────────────┐  │
│  │  Frontend    │───▶│  API Route / FastAPI        │  │
│  │  (React UI)  │◀───│  (Style Transfer Engine)    │  │
│  └─────────────┘    └──────────┬─────────────────┘  │
└────────────────────────────────┼─────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Frontier LLM API      │
                    │  (Claude / Gemini /      │
                    │   GPT-4o)               │
                    └────────────▲────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   Prompt Assembly        │
                    │  ┌───────────────────┐   │
                    │  │ System Prompt      │   │
                    │  │ Glossary (JSON)    │   │
                    │  │ Few-shot Examples  │   │
                    │  └───────────────────┘   │
                    └─────────────────────────┘

┌─────────────────────────────────────────────────────┐
│          Data Collection Pipeline (Offline)          │
│  YouTube Videos ──▶ Transcript Extraction ──▶ JSON   │
│                          │                           │
│                    Manual Curation                    │
│                  (Glossary + Examples)                │
└─────────────────────────────────────────────────────┘
```

---

## 3. Phase Breakdown

### Phase 1 — Data Collection

**Objective:** Extract Malayalam transcripts from ~25 Sancharam YouTube episodes and curate a glossary and few-shot example set.

**Components:**

- A Python CLI tool that accepts a YouTube video URL, a list of URLs, or a playlist URL
- For each video, the tool fetches the auto-generated or manually uploaded Malayalam caption track
- Each transcript is saved as a structured JSON file containing video ID, title, URL, transcript language, raw continuous text, and timestamped segments
- Output is written to `data/transcripts/`, one file per video, named by video ID
- Videos without Malayalam captions are skipped and logged

**Tech Stack:** Python, `youtube-transcript-api`, `argparse` or `click`

**Outputs:**

- ~25 transcript JSON files
- A curated vocabulary glossary (`data/glossary.json`) — 50–100 entries mapping common terms to Sancharam-style equivalents
- 8–10 curated transcript excerpts for few-shot prompting (`data/examples/`)

**Glossary Format:**

```json
{
  "entries": [
    {
      "common_term": "skyscraper",
      "common_malayalam": "സ്കൈസ്ക്രാപ്പർ",
      "sancharam_term": "അംബരചുംബി",
      "context": "Used when describing tall buildings in urban landscapes"
    },
    {
      "common_term": "airport",
      "common_malayalam": "എയർപോർട്ട്",
      "sancharam_term": "വിമാനത്താവളം",
      "context": "Used for all references to airports"
    }
  ]
}
```

**Episode Selection Criteria:** Pick episodes across diverse geographies and themes — Europe, Middle East, Northeast India, Southeast Asia, Africa — to capture the full vocabulary range rather than clustering around one region.

**Estimated Effort:** 3–5 days (1–2 days pipeline, 2–3 days manual glossary curation)

---

### Phase 2 — Style Transfer Engine (Prompt Engineering)

**Objective:** Build a prompt pipeline that reliably transforms input text into Sancharam-style Malayalam.

**System Prompt Structure:**

The system prompt is assembled at request time from modular files:

```
prompts/
  system_prompt.md        # Style description and transformation rules
  glossary.json           # Vocabulary mappings
  examples/
    travel.md             # Few-shot example: travel narration
    food.md               # Few-shot example: food and cuisine
    architecture.md       # Few-shot example: buildings and monuments
    nature.md             # Few-shot example: landscapes and nature
    culture.md            # Few-shot example: cultural observations
```

The assembled prompt includes three sections:

1. **Style Description** — A detailed characterisation of the Sancharam narration style: formal literary Malayalam, Sanskrit-origin vocabulary preference, avoidance of English loanwords, contemplative and elevated register, specific sentence structure patterns.

2. **Glossary Injection** — The full vocabulary mapping table, instructing the model to apply these substitutions consistently.

3. **Few-Shot Examples** — 8–10 input-output pairs showing normal Malayalam/English sentences and their Sancharam-style equivalents.

**Model Selection:**

The primary choice is a frontier multilingual model with strong Malayalam support. Candidates in order of preference:

- Claude Sonnet or Opus (strong instruction following, good Indic language support)
- Gemini 1.5 Pro / 2.0 (strong on Indic languages)
- GPT-4o (decent Malayalam, strong style transfer)

The API integration should be model-agnostic — a simple adapter pattern so swapping models requires changing one config value.

**Input Handling:**

- Accept Malayalam text (primary use case)
- Accept English text (broader audience, translate to Sancharam-style Malayalam)
- Auto-detect input language and adjust the transformation prompt accordingly

**Quality Guardrails:**

- Post-processing step to verify glossary terms were applied (flag if key substitutions are missing)
- Character/word limit on input to control cost and latency
- Response caching for identical inputs

**Estimated Effort:** 5–7 days (2–3 days prompt development and iteration, 2–3 days API integration, 1 day testing and refinement)

---

### Phase 3 — Web Application

**Objective:** A clean, responsive web app where users type a sentence and receive the Sancharam-style translation.

**Tech Stack:** Next.js (App Router), Tailwind CSS, deployed on Vercel

**Pages and Components:**

- Single-page application with a centered input/output layout
- Text input area (supports both Malayalam and English input)
- "Translate" button triggering the style transfer
- Output display area showing the Sancharam-style result
- Copy-to-clipboard button (primary share mechanism — users will paste to WhatsApp, Instagram, X)
- 3–5 pre-loaded example translations so first-time users immediately understand the concept
- Optional: a "style intensity" control (subtle / balanced / full Sancharam) that adjusts the prompt's aggressiveness

**API Route:**

A single `/api/translate` endpoint:

- **Input:** `{ text: string, language?: "ml" | "en", intensity?: "subtle" | "balanced" | "full" }`
- **Output:** `{ translated_text: string, glossary_terms_used: string[] }`
- Assembles the system prompt from modular files, calls the LLM API, returns the result
- Rate limiting to prevent abuse (10–20 requests per minute per IP)

**UI/UX Considerations:**

- Mobile-first design (most Kerala users will access via mobile)
- Malayalam font rendering — use a web-safe Malayalam font (Manjari or Noto Sans Malayalam via Google Fonts)
- Loading state with a culturally resonant animation or message while the LLM processes
- Shareable result cards — formatted output that looks good when screenshotted

**Estimated Effort:** 5–7 days (2–3 days frontend, 2 days API integration, 1–2 days polish and testing)

---

### Phase 4 — Hosting and Deployment

**Web Application:** Vercel (free tier is sufficient for prototype traffic)

**API / Style Transfer Backend:**

Two options depending on architecture choice:

_Option A — Next.js API Routes (simpler):_ The LLM API call happens directly in a Next.js API route on Vercel. No separate backend needed. This is the recommended approach for the prototype.

_Option B — Separate FastAPI Backend:_ If the prompt assembly logic grows complex or you want to decouple the backend, deploy a FastAPI service on Google Cloud Run (pay-per-request, scales to zero, you already know GCP). The Next.js app calls this service.

**LLM API Cost Estimates (per month):**

| Usage Level            | Requests/Day | Estimated Monthly Cost |
| ---------------------- | ------------ | ---------------------- |
| Low (early days)       | 50           | ₹1,500–3,000           |
| Medium (some traction) | 500          | ₹8,000–15,000          |
| High (viral moment)    | 5,000        | ₹50,000–80,000         |

Cost depends heavily on model choice and prompt length. Caching identical/similar inputs can reduce costs by 30–50%.

**Environment Variables:**

- `LLM_API_KEY` — API key for the chosen model provider
- `LLM_MODEL` — Model identifier (easily swappable)
- `RATE_LIMIT_RPM` — Requests per minute cap

**Monitoring:** Basic logging of request count, latency, error rate. Vercel Analytics for frontend. No complex observability needed at prototype stage.

**Estimated Effort:** 1–2 days

---

## 4. Project Structure

```
sanchari-speaks/
├── data/
│   ├── transcripts/          # Raw transcript JSON files
│   ├── glossary.json         # Curated vocabulary mappings
│   └── examples/             # Few-shot example files
├── scripts/
│   └── fetch_transcripts.py  # YouTube transcript extraction CLI
├── prompts/
│   ├── system_prompt.md      # Core style description
│   └── prompt_builder.py     # Assembles final prompt from parts
├── app/                      # Next.js app
│   ├── page.tsx              # Main UI
│   ├── api/
│   │   └── translate/
│   │       └── route.ts      # Translation API endpoint
│   └── components/
│       ├── TranslateInput.tsx
│       ├── TranslateOutput.tsx
│       └── ExampleCards.tsx
├── requirements.txt          # Python dependencies
├── package.json              # Node dependencies
└── README.md
```

---

## 5. Prototype Timeline

| Week     | Focus                                            | Deliverable                           |
| -------- | ------------------------------------------------ | ------------------------------------- |
| Week 1   | Data collection pipeline + transcript extraction | 25 transcripts in `data/transcripts/` |
| Week 1–2 | Glossary curation + example selection            | `glossary.json` + 8–10 example files  |
| Week 2–3 | Prompt engineering + API integration             | Working style transfer via API        |
| Week 3–4 | Web app build + deployment                       | Live prototype on Vercel              |

**Total estimated time to working prototype: 3–4 weeks**

---

## 6. Risks and Mitigations

**Malayalam output quality may be inconsistent.** Frontier models handle Malayalam well but not perfectly. Mitigation: the glossary acts as an explicit vocabulary override, and few-shot examples anchor the style. Iterative prompt refinement based on testing will be essential.

**Auto-generated YouTube captions may mangle signature vocabulary.** The very words that define the Sancharam style (uncommon, literary terms) are most likely to be misrecognised by ASR. Mitigation: spot-check transcripts for key vocabulary, manually correct critical terms in the glossary.

**LLM API costs could spike if the app goes viral.** A Kerala-focused meme-worthy tool has genuine viral potential. Mitigation: implement aggressive caching, rate limiting, and consider a queue-based architecture if demand exceeds budget.

**Copyright and content attribution.** The transcripts are derived from publicly available YouTube content. The app transforms user input — it does not reproduce Sancharam content directly. A clear attribution to the original series in the app footer is appropriate and respectful.

---

## 7. Future Enhancements (Post-Prototype)

- **Audio output** — Generate the translated text as speech in a Sancharam-like voice using TTS
- **Reverse mode** — Paste Sancharam-style text and get the "normal" version
- **WhatsApp/Telegram bot** — Reach users where they already share content
- **Fine-tuned model** — If prompt-based quality hits a ceiling, pursue LoRA fine-tuning with synthetic parallel corpus
- **Community glossary** — Let users suggest new vocabulary mappings
