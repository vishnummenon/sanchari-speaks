## ADDED Requirements

### Requirement: CLI accepts input text and returns Sancharam-style output
The transform script (`scripts/transform.py`) SHALL accept input text via a positional argument or stdin, call an LLM via OpenRouter (default: `anthropic/claude-sonnet-4-6`), and print the Sancharam-style output to stdout.

#### Scenario: Transform text provided as argument
- **WHEN** `uv run scripts/transform.py "ഞാൻ എയർപോർട്ടിൽ എത്തി"` is executed
- **THEN** the script prints the Sancharam-style Malayalam transformation to stdout

#### Scenario: Transform text provided via stdin
- **WHEN** text is piped into the script via stdin (e.g., `echo "I arrived at the airport" | uv run scripts/transform.py`)
- **THEN** the script reads stdin, transforms the text, and prints the result to stdout

#### Scenario: No input provided
- **WHEN** the script is invoked with no argument and no stdin
- **THEN** it exits with an error message indicating that input text is required

### Requirement: Auto-detect input language
The system SHALL support three input forms — Malayalam script, English, and Manglish (Malayalam in Latin script). Language detection is delegated to the LLM via the system prompt rather than client-side heuristics.

#### Scenario: Malayalam script input
- **WHEN** the input text is written in Malayalam script (e.g., "ഞാൻ എയർപോർട്ടിൽ എത്തി")
- **THEN** the LLM detects it as Malayalam and transforms it into Sancharam-style Malayalam

#### Scenario: English input
- **WHEN** the input text is written in English (e.g., "I arrived at the airport")
- **THEN** the LLM detects it as English and translates it into Sancharam-style Malayalam

#### Scenario: Manglish input
- **WHEN** the input text is Malayalam written in Latin script (e.g., "njan airport-il ethi")
- **THEN** the LLM detects it as Manglish, interprets the Malayalam meaning, and transforms it into Sancharam-style Malayalam

### Requirement: Glossary verification in post-processing
After receiving the LLM response, the script SHALL check which glossary terms from `data/glossary.json` could have been applied based on the input text, and report any missing substitutions.

#### Scenario: All expected glossary terms present
- **WHEN** the input contains words matching glossary `common_term` or `common_malayalam` entries and the output contains the corresponding `sancharam_term` for each
- **THEN** no warnings are printed

#### Scenario: Some glossary terms missing from output
- **WHEN** the input contains words matching glossary entries but the output is missing one or more corresponding `sancharam_term` values
- **THEN** a warning is printed to stderr listing the missed substitutions (advisory, not a failure)

### Requirement: API key validation
The script SHALL require the `OPENROUTER_API_KEY` environment variable to be set.

#### Scenario: API key is set
- **WHEN** `OPENROUTER_API_KEY` is present in the environment
- **THEN** the script proceeds with the API call

#### Scenario: API key is missing
- **WHEN** `OPENROUTER_API_KEY` is not set
- **THEN** the script exits with a clear error message: "OPENROUTER_API_KEY environment variable is required"

### Requirement: Dry-run mode for prompt inspection
The script SHALL support a `--dry-run` flag that prints the assembled prompt to stdout without making an API call.

#### Scenario: Dry-run flag used
- **WHEN** `uv run scripts/transform.py --dry-run "some text"` is executed
- **THEN** the assembled system prompt and user message are printed to stdout and no API call is made

### Requirement: Model selection via --model flag
The script SHALL support a `--model` flag to specify the OpenRouter model ID. The default SHALL be `anthropic/claude-sonnet-4-6`.

#### Scenario: Default model used
- **WHEN** `uv run scripts/transform.py "text"` is executed without `--model`
- **THEN** the script uses `anthropic/claude-sonnet-4-6` as the model

#### Scenario: Custom model specified
- **WHEN** `uv run scripts/transform.py --model "google/gemini-2.0-flash-001" "text"` is executed
- **THEN** the script uses the specified model for the API call

### Requirement: Uses uv inline script metadata for dependencies
The script SHALL declare its dependencies (`openai`) using uv inline script metadata, consistent with the existing scripts in the project.

#### Scenario: Script runs via uv without separate install
- **WHEN** `uv run scripts/transform.py "text"` is executed
- **THEN** uv resolves the `openai` dependency from the inline metadata and runs the script successfully
