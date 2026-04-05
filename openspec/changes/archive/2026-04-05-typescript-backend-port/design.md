## Context

The style transfer pipeline has three logical steps: prompt assembly (read files, format prompt), LLM call (OpenRouter via OpenAI-compatible API), and glossary verification (post-processing check). These are currently in Python across `prompts/prompt_builder.py` and `scripts/transform.py`. We need these in TypeScript so they can run as a Next.js API route on Vercel.

The data files (`system_prompt.md`, `glossary.json`, `examples/*.md`) are static and shared between the Python CLI and the TS backend. They are read at request time using `fs`.

## Goals / Non-Goals

**Goals:**
- Port all backend logic to TypeScript with feature parity to the Python implementation
- Expose a single `/api/translate` API route
- Keep the TS modules (`lib/`) independent of Next.js so they can be reused later
- Read the same data files as the Python CLI — no duplication of prompt content

**Non-Goals:**
- Frontend / web UI (separate change)
- Rate limiting (defer to web UI change or Vercel config)
- Response caching (defer)
- Style intensity control (defer)
- Modifying or replacing the Python CLI

## Decisions

### 1. Next.js App Router with TypeScript

Using Next.js App Router for the API route gives us Vercel deployment with zero config. The API route at `app/api/translate/route.ts` exports a POST handler. Even though we're not building the UI yet, initializing Next.js now avoids re-scaffolding later.

**Alternative considered:** Standalone Express/Fastify server. Rejected because the HLD specifies Vercel + Next.js, and adding a separate server framework creates deployment complexity we don't need.

### 2. Shared `lib/` modules separate from the API route

The core logic lives in three modules under `lib/`:
- `lib/prompt-builder.ts` — prompt assembly (reads files, formats system prompt + user message)
- `lib/openrouter.ts` — OpenRouter API call wrapper
- `lib/glossary.ts` — glossary loading and verification

The API route (`app/api/translate/route.ts`) is a thin handler that wires these together. This separation keeps the logic testable and reusable.

### 3. `openai` JS SDK for OpenRouter

Same approach as the Python CLI — OpenRouter is OpenAI-compatible, so we use the official `openai` npm package pointed at `https://openrouter.ai/api/v1`. Default model: `anthropic/claude-sonnet-4-6`.

### 4. Read data files from filesystem with `fs`

On Vercel, Next.js API routes can read files from the project directory at runtime using `fs`. The data files are bundled with the deployment. No need to embed them as constants or move them to a database.

**Note:** Files must be read using `path.join(process.cwd(), ...)` for Vercel compatibility, not `__dirname`.

### 5. API contract

```
POST /api/translate
Content-Type: application/json

Request:  { "text": "string" }
Response: { "translated_text": "string", "glossary_warnings": ["string"] }
Error:    { "error": "string" } with appropriate HTTP status
```

The `text` field accepts Malayalam, English, or Manglish — language detection is handled by the LLM, same as the Python CLI. No `language` field needed.

## Risks / Trade-offs

**File reading on Vercel serverless** — `fs.readFileSync` works in Vercel serverless functions for files bundled at build time. The data files are in the repo and will be included. If this becomes an issue, we can move to build-time bundling.

**Prompt output parity** — The TS prompt builder must produce the exact same prompt text as the Python version. We can verify this by comparing `--dry-run` output from the Python CLI against the TS prompt builder output.

**Cold start latency** — Vercel serverless functions have cold starts (~200-500ms). Combined with the LLM API call (~2-5s), total latency will be ~3-6s. Acceptable for this use case.
