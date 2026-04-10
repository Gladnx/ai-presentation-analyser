import { NextRequest, NextResponse } from "next/server";
import { rewriteScript } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { script, improvements } = body;

    if (!script || typeof script !== "string" || script.trim().length === 0) {
      return NextResponse.json(
        { error: "Script is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    if (!improvements || !Array.isArray(improvements) || improvements.length === 0) {
      return NextResponse.json(
        { error: "Improvements list is required." },
        { status: 400 }
      );
    }

    const rewritten = await rewriteScript(script.trim(), improvements);

    return NextResponse.json({ rewritten });
  } catch (error) {
    console.error("Rewrite error:", error);
    return NextResponse.json(
      { error: "Failed to rewrite the script. Please try again." },
      { status: 500 }
    );
  }
}
