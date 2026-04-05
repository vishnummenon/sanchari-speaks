## Why

The style transfer engine is currently implemented in Python (`prompts/prompt_builder.py` + `scripts/transform.py`). To deploy on Vercel as a Next.js API route, this logic needs to be available in TypeScript. Porting the backend now — separately from building the web UI — lets us validate the TS implementation against the existing Python CLI before layering on the frontend.

## What Changes

- Initialize a Next.js project (App Router, TypeScript) with `package.json`, `tsconfig.json`, `next.config.ts`
- Port `prompts/prompt_builder.py` → `lib/prompt-builder.ts`: reads `prompts/system_prompt.md`, `data/glossary.json`, `data/examples/*.md` and assembles the system prompt + user message
- Port the OpenRouter call logic from `scripts/transform.py` → `lib/openrouter.ts`: calls OpenRouter via the `openai` JS SDK
- Port glossary verification from `scripts/transform.py` → `lib/glossary.ts`: matches input words against glossary entries, reports missed substitutions
- Create a Next.js API route at `app/api/translate/route.ts` that wires prompt assembly → OpenRouter call → glossary verification and returns JSON
- Existing Python scripts are **not modified** — they continue to work as the offline CLI

## Capabilities

### New Capabilities
- `translate-api`: Next.js API route (`/api/translate`) that accepts `{ text: string }`, assembles the prompt, calls OpenRouter, runs glossary verification, and returns `{ translated_text: string, glossary_warnings: string[] }`

### Modified Capabilities
<!-- None — this is a parallel TypeScript implementation. The Python CLI and its specs are unchanged. -->

## Impact

- **New files**: `package.json`, `tsconfig.json`, `next.config.ts`, `lib/prompt-builder.ts`, `lib/openrouter.ts`, `lib/glossary.ts`, `app/api/translate/route.ts`
- **Dependencies**: `next`, `react`, `react-dom`, `openai` (JS SDK)
- **External service**: OpenRouter API — requires `OPENROUTER_API_KEY` environment variable
- **Reads from**: `prompts/system_prompt.md`, `data/glossary.json`, `data/examples/*.md` (same data files as Python CLI)
- **No existing code is modified**
