import OpenAI from "openai";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MODEL = "google/gemini-2.5-flash";

export async function callOpenRouter(
  systemPrompt: string,
  messages: Array<{ role: "user"; content: string }>,
  model: string = DEFAULT_MODEL,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const client = new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
  });

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return response.choices[0]?.message?.content ?? "";
}
