import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt-builder";
import { callOpenRouter } from "@/lib/openrouter";
import { loadGlossary, verifyGlossary } from "@/lib/glossary";

export async function POST(request: Request) {
  // Validate API key
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY is not configured" },
      { status: 500 }
    );
  }

  // Parse and validate request body
  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json(
      { error: "text field is required" },
      { status: 400 }
    );
  }

  // Build prompt, call OpenRouter, verify glossary
  try {
    const { systemPrompt, messages } = buildPrompt(text);
    const translatedText = await callOpenRouter(systemPrompt, messages);
    const glossary = loadGlossary();
    const glossaryWarnings = verifyGlossary(text, translatedText, glossary);

    return NextResponse.json({
      translated_text: translatedText,
      glossary_warnings: glossaryWarnings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
