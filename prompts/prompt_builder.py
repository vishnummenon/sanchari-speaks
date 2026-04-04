"""Prompt assembly module for Sancharam style transfer.

Assembles the full prompt from modular parts:
- System prompt (prompts/system_prompt.md)
- Vocabulary glossary (data/glossary.json)
- Few-shot examples (data/examples/*.md)
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
SYSTEM_PROMPT_PATH = ROOT_DIR / "prompts" / "system_prompt.md"
GLOSSARY_PATH = ROOT_DIR / "data" / "glossary.json"
EXAMPLES_DIR = ROOT_DIR / "data" / "examples"


def _load_system_prompt() -> str:
    return SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")


def _load_glossary() -> str:
    data = json.loads(GLOSSARY_PATH.read_text(encoding="utf-8"))
    entries = data.get("entries", data) if isinstance(data, dict) else data
    lines = ["## Vocabulary Glossary", ""]
    lines.append("Apply these vocabulary substitutions consistently:")
    lines.append("")
    lines.append("| Common Term | Common Malayalam | Sancharam Term |")
    lines.append("|---|---|---|")
    for entry in entries:
        common = entry.get("common_term", "")
        common_ml = entry.get("common_malayalam", "")
        sancharam = entry.get("sancharam_term", "")
        lines.append(f"| {common} | {common_ml} | {sancharam} |")
    return "\n".join(lines)


def _load_examples() -> str:
    parts = ["## Style Reference Examples", ""]
    parts.append(
        "The following are actual excerpts from Sancharam episodes. "
        "Use these as style references for tone, vocabulary, and sentence structure."
    )
    parts.append("")
    for md_file in sorted(EXAMPLES_DIR.glob("*.md")):
        content = md_file.read_text(encoding="utf-8").strip()
        parts.append(content)
        parts.append("")
    return "\n".join(parts)


def _build_user_message(input_text: str, input_language: str) -> str:
    if input_language == "ml":
        instruction = (
            "Transform the following Malayalam text into Sancharam narration style. "
            "Replace English loanwords with Malayalam/Sanskrit equivalents from the glossary. "
            "Elevate the register to formal literary Malayalam with the contemplative, "
            "atmospheric quality of the Sancharam narrator."
        )
    else:
        instruction = (
            "Translate and transform the following English text into Sancharam-style Malayalam. "
            "Use Malayalam/Sanskrit vocabulary from the glossary — do not transliterate English terms. "
            "Write in the formal literary register with the contemplative, "
            "first-person narration style of Sancharam."
        )
    return f"{instruction}\n\n---\n\n{input_text}"


def build_prompt(
    input_text: str, input_language: str
) -> tuple[str, list[dict[str, str]]]:
    """Assemble the full prompt for Sancharam style transfer.

    Args:
        input_text: The text to transform.
        input_language: "ml" for Malayalam, "en" for English.

    Returns:
        A tuple of (system_prompt, messages) compatible with the OpenAI
        chat completions API (used via OpenRouter).
    """
    system_parts = [
        _load_system_prompt(),
        "",
        _load_glossary(),
        "",
        _load_examples(),
    ]
    system_prompt = "\n".join(system_parts)

    messages = [{"role": "user", "content": _build_user_message(input_text, input_language)}]

    return system_prompt, messages
