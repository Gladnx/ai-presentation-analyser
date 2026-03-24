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

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
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
        <label
          htmlFor="script-input"
          className="block text-sm font-medium text-text mb-2"
        >
          Your script
        </label>
        <textarea
          id="script-input"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={8}
          placeholder="e.g. Good morning everyone, today I'd like to talk about the future of renewable energy..."
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition resize-none"
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Tip: Include your full script for the best analysis.
          </span>
          <button
            onClick={handleAnalyse}
            disabled={!script.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
