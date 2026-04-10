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

  // Rewrite state
  const [rewrittenScript, setRewrittenScript] = useState<string | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (scriptToAnalyse: string) => {
    setLoading(true);
    setError(null);
    setRewrittenScript(null);
    setRewriteError(null);
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

  const handleRewrite = useCallback(async () => {
    if (!script || !result?.improvements) return;
    setIsRewriting(true);
    setRewriteError(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          improvements: result.improvements,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to rewrite script");
      }

      setRewrittenScript(data.rewritten);
    } catch (err: any) {
      setRewriteError(err.message);
    } finally {
      setIsRewriting(false);
    }
  }, [script, result]);

  const handleAcceptRewrite = () => {
    if (!rewrittenScript) return;
    setScript(rewrittenScript);
    setEditedScript(rewrittenScript);
    sessionStorage.setItem("presentation_script", rewrittenScript);
    setRewrittenScript(null);
    // Re-analyse automatically with the new script
    performAnalysis(rewrittenScript);
  };

  const handleDiscardRewrite = () => {
    setRewrittenScript(null);
    setRewriteError(null);
  };

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
    setRewrittenScript(null);
    setIsEditing(!isEditing);
  };

  const handleReAnalyse = () => {
    if (!editedScript.trim()) return;
    performAnalysis(editedScript);
  };

  if (!script) return null;

  // Determine what to show in the script panel
  const showingRewrite = rewrittenScript !== null;

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 flex flex-col lg:flex-row gap-6 sm:gap-8 animate-fade-in-up">
        {/* Left Column: Script View/Edit */}
        <div className="flex-1 flex flex-col lg:border-r border-border lg:pr-8">
          <div className="mb-4">
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="font-bold text-text uppercase tracking-widest text-sm whitespace-nowrap">
                {showingRewrite ? "Improved Script" : "Your Script"}
              </h2>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {showingRewrite ? (
                  <>
                    <button
                      onClick={handleDiscardRewrite}
                      className="text-xs font-bold text-text-muted hover:text-text px-3 py-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border transition-colors uppercase tracking-wider"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleAcceptRewrite}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-black text-white hover:bg-emerald-700 hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-md shadow-emerald-500/20 uppercase tracking-wider"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Accept &amp; Re-analyse
                    </button>
                  </>
                ) : !isEditing ? (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="text-xs font-bold text-text-muted hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-border uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleRewrite}
                      disabled={isRewriting || loading || !result}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs font-black text-primary hover:bg-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                      {isRewriting ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                          </svg>
                          Rewriting...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          Auto-Rewrite
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        sessionStorage.removeItem("presentation_script");
                        router.push("/");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 px-4 py-1.5 text-xs font-black text-white hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 shadow-md shadow-red-500/20 uppercase tracking-wider"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      New
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="text-xs font-bold text-text-muted hover:text-text px-3 py-1.5 transition-colors uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReAnalyse}
                      disabled={loading || !editedScript.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-black text-white hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 shadow-md shadow-primary/20 uppercase tracking-wider"
                    >
                      {loading ? "Analysing..." : "Re-analyse"}
                    </button>
                  </>
                )}
              </div>
            </div>
            {!isEditing && !showingRewrite && (
              <p className="text-[10px] text-text-muted/40 flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                AI can make mistakes, always review before accepting
              </p>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-[500px]">
            {isEditing ? (
              <textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="flex-1 w-full glass border border-primary/30 rounded-2xl p-8 text-text focus:outline-none focus:ring-4 focus:ring-primary/5 resize-none leading-relaxed shadow-xl text-lg transition-all"
                placeholder="Edit your script here..."
              />
            ) : showingRewrite ? (
              <div className="flex-1 flex flex-col gap-4">
                {/* Rewritten script with highlight */}
                <div className="flex-1 glass border border-emerald-500/30 rounded-2xl pt-12 px-8 pb-8 overflow-y-auto text-text whitespace-pre-wrap leading-relaxed shadow-xl text-lg transition-all relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">AI Improved</span>
                  </div>
                  {rewrittenScript}
                </div>
              </div>
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
