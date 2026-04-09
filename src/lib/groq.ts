import Groq from "groq-sdk";
import { AnalysisResult } from "@/types/analysis";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function getWordCount(script: string) {
  return script.trim().split(/\s+/).filter(Boolean).length;
}

function getScriptLengthGuidance(wordCount: number) {
  if (wordCount < 40) {
    return `The script is extremely short (${wordCount} words). Treat it as underdeveloped content, not as a complete presentation. Apply these stricter rules:
- Do not give a high score unless the content is unusually strong despite its length
- Prioritise improvements about missing structure, missing detail, weak development, lack of examples, and unclear objective
- Questions may be more foundational and should expose obvious gaps the audience would notice
- If tone is hard to infer because the script is too short, choose the closest likely mood but stay conservative`;
  }

  if (wordCount < 120) {
    return `The script is short (${wordCount} words). Judge it as an early draft rather than a polished presentation. Apply these rules:
- Be stricter about completeness, depth, transitions, and supporting detail
- Improvements should focus on what is missing as well as what is weak
- Questions should highlight likely audience uncertainties caused by limited detail
- Do not over-reward clarity if the content is still too brief to fully support the message`;
  }

  return `The script is substantial enough (${wordCount} words) to analyse as a normal presentation draft. Use the standard evaluation rules.`;
}

export async function analyseScript(script: string): Promise<AnalysisResult> {
  const wordCount = getWordCount(script);

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
  "questions": {
    "beginner": [
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" }
    ],
    "intermediate": [
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" }
    ],
    "expert": [
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" }
    ],
    "mixed": [
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" },
      { "question": "<question>", "answer": "<suggested response>" }
    ]
  }
}

Rules:
- score: rate the script quality from 1 (poor) to 10 (excellent)
- mood: identify the primary tone/mood in 1-2 words
- improvements: provide 3-5 specific, actionable improvement suggestions
- questions: provide exactly 5 questions per audience level, each paired with a suggested "best practice" answer or response strategy
  - "beginner": questions from an audience with NO prior knowledge of the topic. These should be simple, clarifying, foundational questions.
  - "intermediate": questions from an audience with SOME knowledge. These should probe deeper into reasoning, comparisons, and practical implications.
  - "expert": questions from an audience who are SPECIALISTS in the topic. These should be challenging, technical, or critical questions.
  - "mixed": questions from a DIVERSE audience with varied knowledge levels. Include a realistic blend of simple and complex questions.
- Evaluate quality based on both writing quality and completeness of content
- Short or underdeveloped scripts must be scored more conservatively than complete scripts
- If the script lacks enough content, say so indirectly through the score, improvements, and likely questions
- If the script is too short or underdeveloped, include at least one improvement that explicitly tells the user to add more content, detail, examples, or supporting points
- Return ONLY the JSON object, nothing else`,
      },
      {
        role: "user",
        content: `Word count: ${wordCount}

${getScriptLengthGuidance(wordCount)}

Script:
${script}`,
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
    typeof parsed.questions !== "object" ||
    !Array.isArray(parsed.questions.beginner) ||
    !Array.isArray(parsed.questions.intermediate) ||
    !Array.isArray(parsed.questions.expert) ||
    !Array.isArray(parsed.questions.mixed)
  ) {
    throw new Error("Invalid response structure from Groq");
  }

  return parsed;
}
