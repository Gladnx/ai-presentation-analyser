"use client";

import { useEffect, useState } from "react";
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
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // get script from session storage on mount
    const savedScript = sessionStorage.getItem("presentation_script");

    if (!savedScript) {
      // if no script then send them back home
      router.replace("/");
      return;
    }

    setScript(savedScript);

    // fetch analysis from API
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("/api/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ script: savedScript }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to analyse script");
        }

        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [router]);

  if (!script) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-8">

        <div className="flex-1 flex flex-col lg:border-r border-border lg:pr-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text">Your Script</h2>
            <button
              onClick={() => {
                sessionStorage.removeItem("presentation_script");
                router.push("/");
              }}
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Analyse Another
            </button>
          </div>
          <div className="flex-1 bg-surface border border-border rounded-xl p-6 overflow-y-auto min-h-[500px] text-text-muted whitespace-pre-wrap leading-relaxed shadow-inner">
            {script}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 lg:pl-4">
          <h2 className="text-xl font-semibold text-text mb-2">Analysis Results</h2>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-text-muted gap-4">
              <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"></div>
              <p className="animate-pulse">Analysing your presentation...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 flex flex-col items-center justify-center min-h-[400px] gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="font-medium text-center">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : result ? (
            <>
              {/* score and mood */}
              <div className="grid grid-cols-2 gap-6">
                <ScoreCard score={result.score} />
                <MoodBadge mood={result.mood} />
              </div>

              {/* suggestions */}
              <ImprovementList items={result.improvements} />

              {/* questions */}
              <QuestionList questions={result.questions} />
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
