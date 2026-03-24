import Groq from "groq-sdk";
import { AnalysisResult } from "@/types/analysis";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyseScript(script: string): Promise<AnalysisResult> {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `You are a presentation coach. Analyse the user's presentation script and return ONLY valid JSON (no markdown, no code fences) with this exact structure:

{
  "score": <number 1-10>,
  "mood": "<one or two word mood, e.g. Informative, Persuasive, Humorous, Inspirational>",
  "improvements": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "questions": ["<question 1>", "<question 2>", "<question 3>", "<question 4>", "<question 5>"]
}

Rules:
- score: rate the script quality from 1 (poor) to 10 (excellent)
- mood: identify the primary tone/mood in 1-2 words
- improvements: provide 3-5 specific, actionable improvement suggestions
- questions: provide exactly 5 questions the audience might ask after the presentation
- Return ONLY the JSON object, nothing else`,
      },
      {
        role: "user",
        content: script,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response from Groq");
  }

  const parsed: AnalysisResult = JSON.parse(content);

  if (
    typeof parsed.score !== "number" ||
    typeof parsed.mood !== "string" ||
    !Array.isArray(parsed.improvements) ||
    !Array.isArray(parsed.questions)
  ) {
    throw new Error("Invalid response structure from Groq");
  }

  return parsed;
}
