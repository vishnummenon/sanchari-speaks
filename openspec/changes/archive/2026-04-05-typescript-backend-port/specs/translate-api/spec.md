## ADDED Requirements

### Requirement: Prompt builder assembles prompt from data files
The TypeScript prompt builder (`lib/prompt-builder.ts`) SHALL read `prompts/system_prompt.md`, `data/glossary.json`, and all `data/examples/*.md` files, and assemble them into a system prompt string and user message array compatible with the OpenAI chat completions API.

#### Scenario: Assemble prompt for input text
- **WHEN** `buildPrompt("njan airport-il ethi")` is called
- **THEN** it returns a `{ systemPrompt: string, messages: Array<{role: string, content: string}> }` object containing the system prompt (with style description, glossary table, and example excerpts) and a user message with the input text

#### Scenario: Prompt output matches Python implementation
- **WHEN** the TS prompt builder assembles a prompt for any input text
- **THEN** the system prompt and user message content SHALL be identical to the output of the Python `build_prompt()` function for the same input

### Requirement: OpenRouter client calls LLM API
The OpenRouter client (`lib/openrouter.ts`) SHALL call OpenRouter's chat completions endpoint using the `openai` JS SDK, with the assembled system prompt and messages.

#### Scenario: Successful API call
- **WHEN** the client is called with a system prompt, messages, and model ID
- **THEN** it sends a chat completion request to `https://openrouter.ai/api/v1` and returns the response text

#### Scenario: Default model
- **WHEN** no model is specified
- **THEN** the client uses `anthropic/claude-sonnet-4-6`

### Requirement: Glossary verification checks output
The glossary module (`lib/glossary.ts`) SHALL load entries from `data/glossary.json` and check whether expected Sancharam terms appear in the LLM output based on input word matches.

#### Scenario: All expected terms present
- **WHEN** the input contains words matching glossary `common_term` or `common_malayalam` entries and the output contains the corresponding `sancharam_term` for each
- **THEN** the warnings array is empty

#### Scenario: Missing terms detected
- **WHEN** the input matches glossary entries but the output is missing corresponding `sancharam_term` values
- **THEN** the warnings array contains strings describing each missed substitution

### Requirement: Translate API route handles POST requests
The API route (`app/api/translate/route.ts`) SHALL accept POST requests with JSON body `{ text: string }` and return `{ translated_text: string, glossary_warnings: string[] }`.

#### Scenario: Successful translation
- **WHEN** a POST request is sent to `/api/translate` with `{ "text": "I visited the airport" }`
- **THEN** the response status is 200 and the body contains `{ "translated_text": "...", "glossary_warnings": [...] }`

#### Scenario: Missing text field
- **WHEN** a POST request is sent with an empty body or missing `text` field
- **THEN** the response status is 400 and the body contains `{ "error": "text field is required" }`

#### Scenario: Missing API key
- **WHEN** `OPENROUTER_API_KEY` environment variable is not set
- **THEN** the response status is 500 and the body contains `{ "error": "OPENROUTER_API_KEY is not configured" }`

#### Scenario: Non-POST method
- **WHEN** a GET request is sent to `/api/translate`
- **THEN** the response status is 405
