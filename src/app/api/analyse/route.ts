import { NextRequest, NextResponse } from "next/server";
import { analyseScript } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { script } = body;

    if (!script || typeof script !== "string" || script.trim().length === 0) {
      return NextResponse.json(
        { error: "Script is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    const result = await analyseScript(script.trim());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyse the script. Please try again." },
      { status: 500 }
    );
  }
}
