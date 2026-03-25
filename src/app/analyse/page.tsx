"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ScoreCard from "@/components/ScoreCard";
import MoodBadge from "@/components/MoodBadge";
import ImprovementList from "@/components/ImprovementList";
import QuestionList from "@/components/QuestionList";
import { AnalysisResult } from "@/types/analysis";

function ResultsSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-2 gap-6">
        {[0, 1].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/50 glass p-6 h-[220px] shadow-xl shadow-primary/5 animate-pulse"
          >
            <div className="h-3 w-28 rounded-full bg-border/70 mx-auto mb-8" />
            <div className="flex h-[140px] items-center justify-center">
              <div className="h-28 w-28 rounded-full border border-border/60 bg-surface-alt/70" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 glass p-8 shadow-xl shadow-primary/5 animate-pulse">
        <div className="h-4 w-48 rounded-full bg-border/70 mb-6" />
        <div className="space-y-4">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="h-16 rounded-xl border border-border/50 bg-surface-alt/60"
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 glass p-8 shadow-xl shadow-primary/5 animate-pulse">
        <div className="h-4 w-56 rounded-full bg-border/70 mb-6" />
        <div className="space-y-4">
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className="h-20 rounded-xl border border-border/50 bg-surface-alt/60"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalysePage() {
  const router = useRouter();
  const [script, setScript] = useState<string | null>(null);
  const [editedScript, setEditedScript] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (scriptToAnalyse: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptToAnalyse }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyse script");
      }

      setResult(data);
      // Update session storage so if we reload we have the latest
      sessionStorage.setItem("presentation_script", scriptToAnalyse);
      setScript(scriptToAnalyse);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedScript = sessionStorage.getItem("presentation_script");

    if (!savedScript) {
      router.replace("/");
      return;
    }

    setScript(savedScript);
    setEditedScript(savedScript);
    performAnalysis(savedScript);
  }, [router, performAnalysis]);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedScript(script || "");
    }
    setIsEditing(!isEditing);
  };

  const handleReAnalyse = () => {
    if (!editedScript.trim()) return;
    performAnalysis(editedScript);
  };

  if (!script) return null;

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8 animate-fade-in-up">
        {/* Left Column: Script View/Edit */}
        <div className="flex-1 flex flex-col lg:border-r border-border lg:pr-8">
          <div className="mb-6 flex flex-col gap-3 max-[400px]:items-start sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-text uppercase tracking-widest text-sm">Your Script</h2>
            <div className="flex w-full flex-col gap-2 min-[401px]:w-auto min-[401px]:flex-row min-[401px]:items-center min-[401px]:gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="w-full min-[401px]:w-auto text-xs font-bold text-text-muted hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-surface border border-transparent hover:border-border uppercase tracking-wider"
                  >
                    Edit Script
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("presentation_script");
                      router.push("/");
                    }}
                    className="inline-flex w-full min-[401px]:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 px-5 py-2.5 text-xs font-black text-white hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 shadow-lg shadow-red-500/20 animate-shimmer uppercase tracking-widest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    New Analysis
                  </button>
                </>
              ) : (
                <div className="flex w-full flex-col gap-2 min-[401px]:w-auto min-[401px]:flex-row min-[401px]:items-center">
                  <button
                    onClick={handleEditToggle}
                    className="w-full min-[401px]:w-auto text-xs font-bold text-text-muted hover:text-text px-4 py-2 transition-colors uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReAnalyse}
                    disabled={loading || !editedScript.trim()}
                    className="inline-flex w-full min-[401px]:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 shadow-lg shadow-primary/20 animate-shimmer uppercase tracking-widest"
                  >
                    {loading ? "Analysing..." : "Re-analyse"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[500px]">
            {isEditing ? (
              <textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="flex-1 w-full glass border border-primary/30 rounded-2xl p-8 text-text focus:outline-none focus:ring-4 focus:ring-primary/5 resize-none leading-relaxed shadow-xl text-lg transition-all"
                placeholder="Edit your script here..."
              />
            ) : (
              <div className="flex-1 glass border border-border/50 rounded-2xl p-8 overflow-y-auto text-text-muted whitespace-pre-wrap leading-relaxed shadow-xl text-lg scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent transition-all hover:border-border">
                {script}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="flex-1 flex flex-col gap-8 lg:pl-4">
          <h2 className="text-xl font-bold text-text mb-2 uppercase tracking-widest text-sm">Analysis Results</h2>

          {loading && !isEditing ? (
            <ResultsSkeleton />
          ) : error ? (
            <div className="glass border border-red-500/20 rounded-2xl p-8 text-red-600 dark:text-red-400 flex flex-col items-center justify-center min-h-[400px] gap-6 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="font-bold text-center tracking-wide">{error}</p>
              <button
                onClick={() => performAnalysis(editedScript || script || "")}
                className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                Try Again
              </button>
            </div>
          ) : result ? (
            <div className="space-y-8 transition-opacity duration-300 animate-fade-in-soft">
              {/* score and mood */}
              <div className="grid grid-cols-2 gap-4 min-[401px]:gap-6 max-[400px]:grid-cols-1">
                <ScoreCard score={result.score} />
                <MoodBadge mood={result.mood} />
              </div>

              {/* suggestions */}
              <ImprovementList items={result.improvements} />

              {/* questions */}
              <QuestionList questions={result.questions} />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
