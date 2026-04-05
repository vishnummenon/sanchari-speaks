## 1. Project Setup

- [x] 1.1 Initialize Next.js project with TypeScript (`package.json`, `tsconfig.json`, `next.config.ts`) in the repo root — colocated with existing Python scripts and data files
- [x] 1.2 Install dependencies: `next`, `react`, `react-dom`, `openai`

## 2. Core Library Modules

- [x] 2.1 Create `lib/prompt-builder.ts` — port `prompts/prompt_builder.py`: read `system_prompt.md`, format glossary from `glossary.json`, load all `examples/*.md`, assemble system prompt string and user message. Use `process.cwd()` for file paths.
- [x] 2.2 Create `lib/openrouter.ts` — port the `call_openrouter()` function: create OpenAI client pointing at `https://openrouter.ai/api/v1`, send chat completion, return response text. Default model `anthropic/claude-sonnet-4-6`.
- [x] 2.3 Create `lib/glossary.ts` — port `load_glossary()` and `verify_glossary()`: load glossary entries, match input words against `common_term`/`common_malayalam`, check `sancharam_term` in output, return warnings array.

## 3. API Route

- [x] 3.1 Create `app/api/translate/route.ts` — POST handler that: validates `text` field in request body, calls prompt builder, calls OpenRouter, runs glossary verification, returns `{ translated_text, glossary_warnings }`
- [x] 3.2 Handle error cases: missing `text` (400), missing `OPENROUTER_API_KEY` (500), OpenRouter API errors (502)

## 4. Verification

- [x] 4.1 Add a minimal `app/page.tsx` placeholder so Next.js builds successfully
- [x] 4.2 Verify `next build` completes without errors
