## Context

Phase 1 delivered 15 Sancharam transcripts, an 82-entry vocabulary glossary (`data/glossary.json`), and 8 themed few-shot example files (`data/examples/*.md`). These assets are the foundation for the style transfer engine.

The HLD specifies a modular prompt assembly approach: a system prompt describing the Sancharam style, the glossary injected as a vocabulary override, and few-shot examples providing concrete style anchors. The engine must handle both Malayalam and English input.

The existing codebase uses single-file Python scripts with `uv` inline script metadata for dependency management. There is no Python package or project-level pyproject.toml.

## Goals / Non-Goals

**Goals:**
- Author a system prompt that captures the Sancharam narration style precisely
- Build a prompt assembly module that composes the full prompt from modular parts at request time
- Create a CLI script that accepts text input, calls Claude Sonnet, and returns styled output
- Auto-detect input language (Malayalam vs English) and adjust the prompt accordingly
- Verify glossary term application in post-processing

**Non-Goals:**
- Web application or API endpoint (Phase 3)
- Model-agnostic adapter pattern (defer until Phase 3 when multi-model support may be needed)
- Response caching (defer until Phase 3)
- Rate limiting or cost controls (defer until Phase 3)
- Audio/TTS output
- Style intensity slider (defer until Phase 3)

## Decisions

### 1. OpenRouter as the LLM gateway

All API calls go through OpenRouter (`https://openrouter.ai/api/v1`), which exposes an OpenAI-compatible API. This gives us model-agnostic access from day one — the default model is `anthropic/claude-sonnet-4-6` but any OpenRouter-supported model can be used via the `--model` flag. The `openai` Python SDK is used as the client since OpenRouter is wire-compatible with the OpenAI chat completions API.

**Alternative considered:** Direct Anthropic SDK integration. Rejected because OpenRouter lets us switch between Claude, Gemini, GPT-4o, and open-source models without changing any client code or managing multiple API keys.

### 2. Single-file prompt builder in `prompts/prompt_builder.py`

The prompt builder is a Python module (not a standalone script) that exports a function to assemble the full prompt. It reads `prompts/system_prompt.md`, `data/glossary.json`, and `data/examples/*.md` at call time.

**Alternative considered:** Embedding all prompt content in one large file. Rejected because the HLD explicitly specifies modular prompt files, and modularity makes iteration on individual components easier.

### 3. CLI script at `scripts/transform.py`

Follows the established pattern from Phase 1 (`scripts/fetch_transcripts.py`, `scripts/run_batch.py`). Uses `uv` inline script metadata for the `openai` dependency. Imports prompt_builder as a module.

### 4. Language detection via simple heuristic

Detect Malayalam by checking for Unicode characters in the Malayalam block (U+0D00–U+0D7F). If >30% of non-whitespace characters are Malayalam, treat as Malayalam input; otherwise treat as English. This avoids adding a language detection library for a two-language problem.

**Alternative considered:** Using `langdetect` or `langid` library. Rejected as overkill for distinguishing two languages with distinct scripts.

### 5. Glossary verification as advisory output

After receiving the LLM response, check which glossary terms appear in the output and report any expected substitutions that were missed. This is logged to stderr as advisory — not a hard failure — since the LLM may legitimately choose alternative phrasing.

## Risks / Trade-offs

**Prompt length vs. context window** — Injecting the full 82-entry glossary + 8 example files could consume significant context. Mitigation: measure total prompt token count; if excessive, trim to most relevant examples based on input theme.

**Malayalam output quality variance** — Claude Sonnet's Malayalam generation quality may vary. Mitigation: the glossary provides explicit vocabulary anchors, and few-shot examples set a strong style baseline. Iterative prompt refinement is expected.

**API key management** — The CLI requires `OPENROUTER_API_KEY` in the environment. No key file or config file management in this phase. Mitigation: clear error message if key is missing.

**OpenRouter availability** — Adds a proxy hop between us and the model provider. Mitigation: OpenRouter has good uptime; if a specific model is down on OpenRouter, switching to another model is a single flag change.

**Cost during development** — Each test invocation costs API credits. Mitigation: keep test inputs short during iteration; consider using `--dry-run` flag to print the assembled prompt without calling the API.
