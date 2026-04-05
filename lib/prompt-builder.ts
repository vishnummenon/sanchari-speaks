import fs from "fs";
import path from "path";

interface GlossaryEntry {
  common_term: string;
  common_malayalam: string;
  sancharam_term: string;
  context?: string;
}

interface GlossaryData {
  entries?: GlossaryEntry[];
  [key: string]: unknown;
}

const ROOT_DIR = process.cwd();
const SYSTEM_PROMPT_PATH = path.join(ROOT_DIR, "prompts", "system_prompt.md");
const GLOSSARY_PATH = path.join(ROOT_DIR, "data", "glossary.json");
const EXAMPLES_DIR = path.join(ROOT_DIR, "data", "examples");

function loadSystemPrompt(): string {
  return fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
}

function loadGlossary(): string {
  const raw = fs.readFileSync(GLOSSARY_PATH, "utf-8");
  const data: GlossaryData | GlossaryEntry[] = JSON.parse(raw);
  const entries: GlossaryEntry[] = Array.isArray(data)
    ? data
    : data.entries ?? [];

  const lines = [
    "## Vocabulary Glossary",
    "",
    "Apply these vocabulary substitutions consistently:",
    "",
    "| Common Term | Common Malayalam | Sancharam Term |",
    "|---|---|---|",
  ];
  for (const entry of entries) {
    lines.push(
      `| ${entry.common_term || ""} | ${entry.common_malayalam || ""} | ${entry.sancharam_term || ""} |`
    );
  }
  return lines.join("\n");
}

function loadExamples(): string {
  const parts = [
    "## Style Reference Examples",
    "",
    "The following are actual excerpts from Sancharam episodes. " +
      "Use these as style references for tone, vocabulary, and sentence structure.",
    "",
  ];
  const files = fs.readdirSync(EXAMPLES_DIR).filter((f) => f.endsWith(".md")).sort();
  for (const file of files) {
    const content = fs
      .readFileSync(path.join(EXAMPLES_DIR, file), "utf-8")
      .trim();
    parts.push(content);
    parts.push("");
  }
  return parts.join("\n");
}

function buildUserMessage(inputText: string): string {
  const instruction =
    "Transform the following text into Sancharam narration style. " +
    "The input may be in Malayalam script, English, or Manglish (Malayalam in Latin script). " +
    "Detect the language yourself and apply the appropriate transformation rules. " +
    "Use vocabulary from the glossary. Output only Sancharam-style Malayalam.";
  return `${instruction}\n\n---\n\n${inputText}`;
}

export function buildPrompt(inputText: string): {
  systemPrompt: string;
  messages: Array<{ role: "user"; content: string }>;
} {
  const systemPrompt = [
    loadSystemPrompt(),
    "",
    loadGlossary(),
    "",
    loadExamples(),
  ].join("\n");

  const messages: Array<{ role: "user"; content: string }> = [
    { role: "user", content: buildUserMessage(inputText) },
  ];

  return { systemPrompt, messages };
}
