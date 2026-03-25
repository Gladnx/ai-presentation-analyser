"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ScoreCard from "@/components/ScoreCard";
import MoodBadge from "@/components/MoodBadge";
import ImprovementList from "@/components/ImprovementList";
import QuestionList from "@/components/QuestionList";
import { AnalysisResult } from "@/types/analysis";

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

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8 animate-fade-in-up">
        {/* Left Column: Script View/Edit */}
        <div className="flex-1 flex flex-col lg:border-r border-border lg:pr-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text uppercase tracking-widest text-sm">Your Script</h2>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="text-xs font-bold text-text-muted hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-surface border border-transparent hover:border-border uppercase tracking-wider"
                  >
                    Edit Script
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("presentation_script");
                      router.push("/");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 px-5 py-2.5 text-xs font-black text-white hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 shadow-lg shadow-red-500/20 animate-shimmer uppercase tracking-widest"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    New Analysis
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEditToggle}
                    className="text-xs font-bold text-text-muted hover:text-text px-4 py-2 transition-colors uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReAnalyse}
                    disabled={loading || !editedScript.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black text-white hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 shadow-lg shadow-primary/20 animate-shimmer uppercase tracking-widest"
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
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-text-muted gap-6 glass rounded-2xl border border-border/50">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
              </div>
              <p className="animate-pulse font-bold tracking-widest text-xs uppercase text-primary/80">Analysing Presence...</p>
            </div>
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
            <div className={`space-y-8 ${loading ? "opacity-40 pointer-events-none grayscale-[0.5] transition-all duration-500" : "transition-all duration-500"}`}>
              {/* score and mood */}
              <div className="grid grid-cols-2 gap-6">
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
