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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Script View/Edit */}
        <div className="flex-1 flex flex-col lg:border-r border-border lg:pr-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text">Your Script</h2>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="text-sm font-medium text-text-muted hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-surface border border-transparent hover:border-border"
                  >
                    Edit Script
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("presentation_script");
                      router.push("/");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 px-4 py-2 text-sm font-medium text-white hover:from-red-700 hover:to-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 dark:border dark:border-red-500 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    New Analysis
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEditToggle}
                    className="text-sm font-medium text-text-muted hover:text-text px-3 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReAnalyse}
                    disabled={loading || !editedScript.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50"
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
                className="flex-1 w-full bg-surface border border-primary rounded-xl p-6 text-text focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed shadow-inner"
                placeholder="Edit your script here..."
              />
            ) : (
              <div className="flex-1 bg-surface border border-border rounded-xl p-6 overflow-y-auto text-text-muted whitespace-pre-wrap leading-relaxed shadow-inner">
                {script}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="flex-1 flex flex-col gap-6 lg:pl-4">
          <h2 className="text-xl font-semibold text-text mb-2">Analysis Results</h2>

          {loading && !isEditing ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-text-muted gap-4">
              <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
              <p className="animate-pulse">Analysing your presentation...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl p-6 text-red-600 dark:text-red-400 flex flex-col items-center justify-center min-h-[400px] gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium text-center">{error}</p>
              <button
                onClick={() => performAnalysis(editedScript || script || "")}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : result ? (
            <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
              {/* score and mood */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <ScoreCard score={result.score} />
                <MoodBadge mood={result.mood} />
              </div>

              {/* suggestions */}
              <div className="mb-6">
                <ImprovementList items={result.improvements} />
              </div>

              {/* questions */}
              <QuestionList questions={result.questions} />
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
