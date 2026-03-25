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
    <main className="w-full max-w-2xl flex flex-col justify-center">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black text-text tracking-tight mb-2 flex flex-col sm:block">
          <span className="font-cursive text-text mr-3 tracking-normal">Present with</span>
          <span className="animate-text-shimmer font-black">CONFIDENCE</span>
        </h1>
        <p className="text-text-muted text-sm max-w-lg mx-auto leading-relaxed">
          The AI powered coach that will help you perfect your script, predict audience questions and answers, and master your presentation mood.
        </p>
      </div>

      <div className="glass rounded-2xl border border-border/50 p-6 md:p-8 shadow-2xl shadow-primary/5">
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor="script-input"
            className="block text-[10px] font-semibold text-text-muted/80 uppercase tracking-[0.25em] ml-1"
          >
            Your Script
          </label>
          <button
            onClick={handleSampleScript}
            className="text-[10px] uppercase tracking-widest font-black py-1.5 px-3 rounded-md bg-surface-alt text-text-muted border border-border hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            Insert a sample script
          </button>
        </div>

        <div className="relative group">
          <textarea
            id="script-input"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={5}
            placeholder="e.g. Good morning everyone, today I'd like to talk about..."
            className="w-full rounded-xl border border-border bg-surface-alt/50 px-5 py-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed text-sm"
          />
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-muted">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary/60" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-bold italic uppercase tracking-wider opacity-60">
              Pro tip: Scripts over 200 words get deeper insights.
            </span>
          </div>

          <button
            onClick={handleAnalyse}
            disabled={!script.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 px-8 py-3 text-xs font-black text-white hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed dark:border dark:border-red-400 shadow-lg shadow-red-500/20 animate-shimmer tracking-widest"
          >
            <span>ANALYSE SCRIPT</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
