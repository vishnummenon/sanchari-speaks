import fs from "fs";
import path from "path";

interface GlossaryEntry {
  common_term: string;
  common_malayalam: string;
  sancharam_term: string;
  context?: string;
}

const GLOSSARY_PATH = path.join(process.cwd(), "data", "glossary.json");

export function loadGlossary(): GlossaryEntry[] {
  const raw = fs.readFileSync(GLOSSARY_PATH, "utf-8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : data.entries ?? [];
}

export function verifyGlossary(
  inputText: string,
  outputText: string,
  glossary: GlossaryEntry[]
): string[] {
  const warnings: string[] = [];
  const inputLower = inputText.toLowerCase();

  for (const entry of glossary) {
    const { common_term, common_malayalam, sancharam_term } = entry;
    let matched = false;

    if (common_term && inputLower.includes(common_term.toLowerCase())) {
      matched = true;
    }
    if (common_malayalam && inputText.includes(common_malayalam)) {
      matched = true;
    }

    if (matched && sancharam_term && !outputText.includes(sancharam_term)) {
      warnings.push(
        `'${common_term}' / '${common_malayalam}' → expected '${sancharam_term}'`
      );
    }
  }

  return warnings;
}
