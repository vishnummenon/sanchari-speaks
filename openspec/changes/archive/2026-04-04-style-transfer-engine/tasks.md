## 1. System Prompt

- [x] 1.1 Create `prompts/system_prompt.md` with Sancharam style characterisation: literary register, Sanskrit vocabulary preference, English loanword avoidance, contemplative tone, sentence structure patterns, and transformation rules for both Malayalam and English input

## 2. Prompt Builder

- [x] 2.1 Create `prompts/prompt_builder.py` with a `build_prompt(input_text: str, input_language: str)` function that returns `(system_prompt: str, messages: list[dict])` compatible with the Anthropic SDK
- [x] 2.2 Load and format glossary entries from `data/glossary.json` into the prompt
- [x] 2.3 Load and include all few-shot examples from `data/examples/*.md` into the prompt
- [x] 2.4 Adjust prompt content based on input language (Malayalam transformation vs English-to-Malayalam translation)

## 3. Transform CLI

- [x] 3.1 Create `scripts/transform.py` with uv inline script metadata declaring `openai` dependency
- [x] 3.2 Accept input text via positional argument or stdin, with error on no input
- [x] 3.3 Implement language auto-detection using Malayalam Unicode range (U+0D00–U+0D7F) with 30% threshold
- [x] 3.4 Call LLM via OpenRouter (OpenAI-compatible API) using the assembled prompt from prompt_builder, default model `anthropic/claude-sonnet-4-6`
- [x] 3.5 Add `--model` flag to allow switching OpenRouter model at runtime
- [x] 3.6 Print Sancharam-style output to stdout
- [x] 3.7 Implement `--dry-run` flag to print assembled prompt without API call
- [x] 3.8 Validate `OPENROUTER_API_KEY` environment variable with clear error message if missing

## 4. Glossary Verification

- [x] 4.1 Implement post-processing check: match input words against glossary `common_term`/`common_malayalam`, verify corresponding `sancharam_term` appears in output
- [x] 4.2 Print advisory warnings to stderr for missed glossary substitutions
