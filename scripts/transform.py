# /// script
# dependencies = ["openai"]
# requires-python = ">=3.10"
# ///
"""Transform text into Sancharam narration style via OpenRouter.

Usage:
    uv run scripts/transform.py "ഞാൻ എയർപോർട്ടിൽ എത്തി"
    echo "I arrived at the airport" | uv run scripts/transform.py
    uv run scripts/transform.py --model google/gemini-2.0-flash-001 "text"
    uv run scripts/transform.py --dry-run "text"
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

# Add project root to path so we can import prompt_builder
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "prompts"))

from prompt_builder import build_prompt  # noqa: E402

GLOSSARY_PATH = ROOT_DIR / "data" / "glossary.json"
DEFAULT_MODEL = "google/gemini-2.5-flash-preview"
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"


def load_glossary() -> list[dict]:
    data = json.loads(GLOSSARY_PATH.read_text(encoding="utf-8"))
    return data.get("entries", data) if isinstance(data, dict) else data


def verify_glossary(
    input_text: str, output_text: str, glossary: list[dict]
) -> list[str]:
    """Check which glossary substitutions were expected but missing.

    Returns a list of warning strings for missed substitutions.
    """
    warnings = []
    input_lower = input_text.lower()
    for entry in glossary:
        common_term = entry.get("common_term", "")
        common_ml = entry.get("common_malayalam", "")
        sancharam_term = entry.get("sancharam_term", "")
        # Check if the input contains a glossary trigger
        matched = False
        if common_term and common_term.lower() in input_lower:
            matched = True
        if common_ml and common_ml in input_text:
            matched = True
        if matched and sancharam_term and sancharam_term not in output_text:
            warnings.append(
                f"  '{common_term}' / '{common_ml}' → expected '{sancharam_term}'"
            )
    return warnings


def call_openrouter(
    system_prompt: str, messages: list[dict], model: str
) -> str:
    from openai import OpenAI

    client = OpenAI(
        base_url=OPENROUTER_BASE_URL,
        api_key=os.environ["OPENROUTER_API_KEY"],
    )
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "system", "content": system_prompt}, *messages],
    )
    return response.choices[0].message.content


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Transform text into Sancharam narration style"
    )
    parser.add_argument("text", nargs="?", help="Input text to transform")
    parser.add_argument(
        "--model",
        default=DEFAULT_MODEL,
        help=f"OpenRouter model ID (default: {DEFAULT_MODEL})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print assembled prompt without making API call",
    )
    args = parser.parse_args()

    # Get input text from argument or stdin
    if args.text:
        input_text = args.text
    elif not sys.stdin.isatty():
        input_text = sys.stdin.read().strip()
        if not input_text:
            parser.error("Input text is required (provide as argument or via stdin)")
    else:
        parser.error("Input text is required (provide as argument or via stdin)")

    # Validate API key (unless dry-run)
    if not args.dry_run and not os.environ.get("OPENROUTER_API_KEY"):
        print(
            "OPENROUTER_API_KEY environment variable is required",
            file=sys.stderr,
        )
        sys.exit(1)

    # Build prompt (language detection is handled by the LLM)
    system_prompt, messages = build_prompt(input_text)

    if args.dry_run:
        print("=== SYSTEM PROMPT ===")
        print(system_prompt)
        print()
        print("=== USER MESSAGE ===")
        print(messages[0]["content"])
        print()
        print(f"=== MODEL: {args.model} ===")
        return

    # Call OpenRouter
    output_text = call_openrouter(system_prompt, messages, args.model)
    print(output_text)

    # Glossary verification
    glossary = load_glossary()
    warnings = verify_glossary(input_text, output_text, glossary)
    if warnings:
        print("\n[Glossary check] Missed substitutions:", file=sys.stderr)
        for w in warnings:
            print(w, file=sys.stderr)


if __name__ == "__main__":
    main()
