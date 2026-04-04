## ADDED Requirements

### Requirement: System prompt defines Sancharam narration style
The system prompt (`prompts/system_prompt.md`) SHALL characterise the Sancharam narration style with explicit guidance on: formal literary Malayalam register, Sanskrit-origin vocabulary preference, avoidance of English loanwords, contemplative and elevated tone, and typical sentence structure patterns found in the series.

#### Scenario: System prompt file exists and contains style guidance
- **WHEN** the file `prompts/system_prompt.md` is read
- **THEN** it contains sections covering vocabulary preference, register/tone, sentence patterns, and transformation rules for both Malayalam and English input

### Requirement: Prompt builder assembles full prompt from modular parts
The prompt builder (`prompts/prompt_builder.py`) SHALL export a `build_prompt(input_text: str, input_language: str) -> tuple[str, list[dict]]` function that assembles the OpenAI-compatible messages array from the system prompt, glossary, and few-shot examples.

#### Scenario: Assemble prompt for Malayalam input
- **WHEN** `build_prompt` is called with Malayalam text and `input_language="ml"`
- **THEN** it returns a messages structure containing: the system prompt content, the glossary entries formatted as vocabulary guidance, relevant few-shot examples, and the user's input text with Malayalam-specific transformation instructions

#### Scenario: Assemble prompt for English input
- **WHEN** `build_prompt` is called with English text and `input_language="en"`
- **THEN** it returns a messages structure containing: the system prompt content, the glossary entries, relevant few-shot examples, and the user's input text with instructions to translate and transform into Sancharam-style Malayalam

#### Scenario: Glossary is loaded from data directory
- **WHEN** the prompt builder assembles a prompt
- **THEN** it reads `data/glossary.json` and formats all entries as vocabulary substitution guidance within the prompt

#### Scenario: Few-shot examples are loaded from data directory
- **WHEN** the prompt builder assembles a prompt
- **THEN** it reads all `.md` files from `data/examples/` and includes the transcript excerpts as style reference examples in the prompt

### Requirement: Prompt builder returns structured messages for OpenAI-compatible API
The prompt builder SHALL return a tuple of `(system_prompt: str, messages: list[dict])` compatible with the OpenAI Python SDK's chat completions format (used via OpenRouter).

#### Scenario: Output is directly usable with OpenAI SDK via OpenRouter
- **WHEN** the return value of `build_prompt` is unpacked as `(system, messages)`
- **THEN** `system` is a string suitable for the `system` message role and `messages` is a list of `{"role": "user", "content": "..."}` dicts suitable for the `messages` parameter of `client.chat.completions.create()`
