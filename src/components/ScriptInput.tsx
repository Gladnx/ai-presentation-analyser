"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScriptInput() {
  const [script, setScript] = useState("");
  const router = useRouter();

  const handleAnalyse = () => {
    if (!script.trim()) return;

    // save to session storage so the next page can pick it up
    sessionStorage.setItem("presentation_script", script);

    // navigate to the split view results page
    router.push("/analyse");
  };

  const handleSampleScript = () => {
    setScript(
      "Good morning everyone. Today, I'd like to share our vision for the future of AI. We believe that artificial intelligence shouldn't just be about automation; it should be about augmentation. Imagine a world where your tools don't just follow instructions, but actually understand your intent. By focusing on human-centric design, we can create systems that empower creativity rather than replacing it. I'm excited to show you what we've been building and how it will transform your daily workflow. Thank you for being here."
    );
  };

  return (
    <main className="flex-1 mx-auto max-w-2xl px-6 py-8 flex flex-col justify-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-text tracking-tight">
          Analyse your presentation script
        </h1>
        <p className="mt-3 text-text-muted text-lg">
          Paste your script below and get an AI powered score, mood analysis,
          improvement tips, and predicted audience questions.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="script-input"
            className="block text-sm font-medium text-text"
          >
            Your script
          </label>
          <button
            onClick={handleSampleScript}
            className="text-xs font-semibold py-1 px-3 rounded-md bg-secondary text-secondary-foreground border border-border hover:bg-border transition-colors cursor-pointer"
          >
            Insert a sample script
          </button>
        </div>
        <textarea
          id="script-input"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={8}
          placeholder="e.g. Good morning everyone, today I'd like to talk about the future of renewable energy..."
          className="w-full rounded-lg border border-border bg-surface-alt px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Tip: Include your full script for the best analysis.
          </span>
          <button
            onClick={handleAnalyse}
            disabled={!script.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:from-red-700 hover:to-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:border dark:border-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Analyse
          </button>
        </div>
      </div>
    </main>
  );
}
