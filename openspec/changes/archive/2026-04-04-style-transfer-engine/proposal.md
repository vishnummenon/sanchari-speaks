## Why

Phase 1 delivered 15 Sancharam transcripts, an 82-entry vocabulary glossary, and 8 themed few-shot examples. The next step is to build the prompt engineering pipeline that uses these assets to transform ordinary Malayalam or English text into the distinctive Sancharam narration style via Claude Sonnet.

## What Changes

- Add a system prompt (`prompts/system_prompt.md`) that characterizes the Sancharam narration style: formal literary Malayalam, Sanskrit-origin vocabulary preference, avoidance of English loanwords, elevated contemplative register.
- Add a prompt builder (`prompts/prompt_builder.py`) that assembles the final prompt at request time from the system prompt, glossary, and few-shot examples.
- Add a style transfer script (`scripts/transform.py`) — a CLI that accepts input text, calls Claude Sonnet via the Anthropic API, and returns the Sancharam-style output.
- Auto-detect input language (Malayalam or English) and adjust the transformation prompt accordingly.
- Post-processing check to verify glossary terms were applied.

## Capabilities

### New Capabilities
- `prompt-assembly`: System prompt authoring and runtime assembly of the full prompt from modular parts (style description + glossary + few-shot examples).
- `style-transfer`: CLI entry point that accepts input text, calls Claude Sonnet, and returns Sancharam-style output with language auto-detection and glossary verification.

### Modified Capabilities
<!-- None — this is a new pipeline independent of the data collection layer. -->

## Impact

- **New files**: `prompts/system_prompt.md`, `prompts/prompt_builder.py`, `scripts/transform.py`
- **Dependencies**: `openai` Python SDK (OpenRouter uses OpenAI-compatible API)
- **External service**: OpenRouter API — requires `OPENROUTER_API_KEY` environment variable. Default model: `anthropic/claude-sonnet-4-6`, switchable via `--model` flag.
- **Reads from**: `data/glossary.json`, `data/examples/*.md` (produced by Phase 1)
- **No existing code is modified**
