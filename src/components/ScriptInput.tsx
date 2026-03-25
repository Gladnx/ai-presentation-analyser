"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadStepState = "pending" | "active" | "done" | "error";

function UploadStepIcon({ state }: { state: UploadStepState }) {
  if (state === "done") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.415 0l-3-3a1 1 0 111.415-1.42l2.293 2.294 6.493-6.494a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
          />
        </svg>
      </span>
    );
  }

  if (state === "error") {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/12 text-red-600 dark:text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 112 10a8 8 0 0116 0zm-8-4a1 1 0 00-.894.553l-2 4A1 1 0 008 12h4a1 1 0 00.894-1.447l-2-4A1 1 0 0010 6zm0 8a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 14z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-alt text-text-muted/50">
      <span className="h-2 w-2 rounded-full bg-current" />
    </span>
  );
}

export default function ScriptInput() {
  const [script, setScript] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnimatedIn, setIsAnimatedIn] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsAnimatedIn(true);
    }, 80);

    const cleanupId = window.setTimeout(() => {
      setIsIntroComplete(true);
    }, 1600);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(cleanupId);
    };
  }, []);

  const getRevealClass = (
    delay: number,
    variant: "fade" | "rise" | "card" = "fade"
  ) => {
    const base =
      "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform";
    const hidden =
      variant === "card"
        ? "opacity-0 translate-y-5 scale-[0.985]"
        : variant === "rise"
          ? "opacity-0 translate-y-4 scale-[0.985]"
          : "opacity-0 translate-y-3";
    const shown = "opacity-100 translate-y-0 scale-100";

    return {
      className: isIntroComplete
        ? ""
        : `${base} ${isAnimatedIn ? shown : hidden}`,
      style: isIntroComplete
        ? undefined
        : {
            transitionDelay: `${delay}ms`,
          },
    };
  };

  const handleAnalyse = () => {
    if (!script.trim() || isExtracting) return;

    // save to session storage so the next page can pick it up
    sessionStorage.setItem("presentation_script", script);

    // navigate to the split view results page
    router.push("/analyse");
  };

  const handleSampleScript = () => {
    setFileError(null);
    setSelectedFileName(null);
    setScript(
      "Good morning everyone. Today, I'd like to share our vision for the future of AI. We believe that artificial intelligence shouldn't just be about automation; it should be about augmentation. Imagine a world where your tools don't just follow instructions, but actually understand your intent. By focusing on human-centric design, we can create systems that empower creativity rather than replacing it. I'm excited to show you what we've been building and how it will transform your daily workflow. Thank you for being here."
    );
  };

  const handleClear = () => {
    setScript("");
    setSelectedFileName(null);
    setFileError(null);
    setIsExtracting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFileName(file.name);
    setFileError(null);
    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-script", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to read that file.");
      }

      setScript(data.script);
    } catch (error) {
      setFileError(
        error instanceof Error
          ? error.message
          : "Failed to read that file."
      );
    } finally {
      setIsExtracting(false);
      event.target.value = "";
    }
  };

  const uploadStepState: UploadStepState = selectedFileName ? "done" : "pending";
  const extractionStepState: UploadStepState = fileError
    ? "error"
    : isExtracting
      ? "active"
      : selectedFileName
        ? "done"
        : "pending";
  const heroReveal = getRevealClass(0, "fade");
  const titleReveal = getRevealClass(80, "rise");
  const copyReveal = getRevealClass(180, "fade");
  const cardReveal = getRevealClass(240, "card");
  const headerReveal = getRevealClass(320, "fade");
  const uploadReveal = getRevealClass(380, "fade");
  const sampleReveal = getRevealClass(460, "fade");
  const clearReveal = getRevealClass(540, "fade");
  const textareaReveal = getRevealClass(430, "fade");
  const footerReveal = getRevealClass(620, "fade");

  return (
    <main className="w-full max-w-2xl flex flex-col justify-center">
      <div
        className={`text-center mb-6 ${heroReveal.className}`}
        style={heroReveal.style}
      >
        <h1
          className={`text-4xl md:text-5xl font-black text-text tracking-tight mb-2 flex flex-col sm:block ${titleReveal.className}`}
          style={titleReveal.style}
        >
          <span
            className={`inline-block font-cursive text-text mr-3 tracking-normal ${
              isAnimatedIn ? "animate-hero-soft-reveal" : "opacity-0"
            }`}
          >
            Present with
          </span>
          <span
            className={`inline-block ${
              isAnimatedIn ? "animate-hero-accent-reveal" : "opacity-0"
            }`}
          >
            <span className="animate-text-shimmer font-black">CONFIDENCE</span>
          </span>
        </h1>
        <p
          className={`text-text-muted text-sm max-w-lg mx-auto leading-relaxed ${copyReveal.className}`}
          style={copyReveal.style}
        >
          The AI powered coach that will help you perfect your script, predict audience questions and answers, and master your presentation mood.
        </p>
      </div>

      <div
        className={`glass rounded-2xl border border-border/50 p-6 md:p-8 shadow-2xl shadow-primary/5 ${cardReveal.className}`}
        style={cardReveal.style}
      >
        <div
          className={`mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between ${headerReveal.className}`}
          style={headerReveal.style}
        >
          <label
            htmlFor="script-input"
            className="block text-[10px] font-semibold text-text-muted/80 uppercase tracking-[0.25em] sm:ml-1"
          >
            Your Script or File
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:items-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className={`inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-text-muted transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-3 sm:text-[10px] sm:tracking-[0.18em] ${uploadReveal.className}`}
              style={uploadReveal.style}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5"
                />
              </svg>
              <span className="truncate">{isExtracting ? "Reading" : "Upload"}</span>
            </button>

            <button
              onClick={handleSampleScript}
              className={`inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-text-muted transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary sm:w-auto sm:px-3 sm:text-[10px] sm:tracking-[0.18em] ${sampleReveal.className}`}
              style={sampleReveal.style}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7h8M8 12h8m-8 5h5M7 3h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z"
                />
              </svg>
              <span className="truncate">Sample</span>
            </button>

            <button
              onClick={handleClear}
              disabled={!script.trim() && !selectedFileName && !fileError}
              className={`inline-flex w-full min-w-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-alt px-2.5 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-text-muted transition-all hover:border-red-500/40 hover:bg-red-500/5 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-red-400 sm:w-auto sm:px-3 sm:text-[10px] sm:tracking-[0.18em] ${clearReveal.className}`}
              style={clearReveal.style}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 0l1 12h6l1-12M10 11v6m4-6v6"
                />
              </svg>
              <span className="truncate">Clear</span>
            </button>
          </div>
        </div>

        <div
          className={`relative group ${textareaReveal.className}`}
          style={textareaReveal.style}
        >
          <textarea
            id="script-input"
            value={script}
            onChange={(e) => {
              setScript(e.target.value);
              if (fileError) {
                setFileError(null);
              }
            }}
            rows={5}
            placeholder="Paste your script here or upload a PDF/Word document to extract it automatically..."
            className="w-full rounded-xl border border-border bg-surface-alt/50 px-5 py-4 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none leading-relaxed text-sm"
          />
        </div>

        {(selectedFileName || fileError) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-alt/60 px-3 py-2 animate-fade-in-soft">
            {selectedFileName ? (
              <div className="min-w-0 max-w-full flex items-center gap-2 rounded-md bg-primary/8 px-2 py-1 text-[11px] text-text">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 shrink-0 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 3v5h5"
                  />
                </svg>
                <span className="truncate max-w-[180px] font-semibold">
                  {selectedFileName}
                </span>
              </div>
            ) : null}

            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-text-muted">
              <UploadStepIcon state={uploadStepState} />
              <span>Uploaded</span>
            </div>

            <div
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] ${fileError
                  ? "text-red-600 dark:text-red-400"
                  : "text-text-muted"
                }`}
            >
              <UploadStepIcon state={extractionStepState} />
              <span>
                {fileError
                  ? "Extraction failed"
                  : isExtracting
                    ? "Extracting"
                    : "Text ready"}
              </span>
            </div>

            {fileError ? (
              <p className="w-full text-[11px] text-red-600 dark:text-red-400">
                {fileError}
              </p>
            ) : null}
          </div>
        )}

        <div
          className={`mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 ${footerReveal.className}`}
          style={footerReveal.style}
        >
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
            disabled={!script.trim() || isExtracting}
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
