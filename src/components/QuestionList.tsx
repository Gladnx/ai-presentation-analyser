"use client";

import { useState } from "react";
import { AudienceQuestions } from "@/types/analysis";

interface QuestionItem {
  question: string;
  answer: string;
}

type AudienceLevel = "beginner" | "intermediate" | "expert" | "mixed";

const TabIcon = ({ type, className }: { type: AudienceLevel; className?: string }) => {
  const cls = className || "w-4 h-4";
  switch (type) {
    case "mixed":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "beginner":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "intermediate":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case "expert":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
  }
};

const AUDIENCE_TABS: { key: AudienceLevel; label: string; description: string }[] = [
  {
    key: "mixed",
    label: "Mixed",
    description: "Diverse audience with varied knowledge levels",
  },
  {
    key: "beginner",
    label: "Beginner",
    description: "Little to no prior knowledge of the topic",
  },
  {
    key: "intermediate",
    label: "Intermediate",
    description: "Some knowledge and basic understanding",
  },
  {
    key: "expert",
    label: "Expert",
    description: "Specialists with deep topic expertise",
  },
];

export default function QuestionList({ questions }: { questions: AudienceQuestions }) {
  const [activeTab, setActiveTab] = useState<AudienceLevel>("mixed");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!questions) return null;

  const activeQuestions: QuestionItem[] = questions[activeTab] || [];

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleTabChange = (tab: AudienceLevel) => {
    setActiveTab(tab);
    setExpandedIndex(null);
  };

  return (
    <div className="rounded-2xl border border-border/50 glass p-6 sm:p-8 shadow-xl shadow-primary/5">
      <h3 className="text-sm font-black text-text mb-5 flex items-center gap-3 uppercase tracking-widest">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        Audience Questions
      </h3>

      {/* Audience Level Tabs */}
      <div className="mb-6">
        <p className="text-xs text-text-muted mb-3 font-medium">Select the type of audience from whom you want questions</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AUDIENCE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`group relative flex flex-col items-center gap-1.5 rounded-xl px-3 py-3 text-center transition-all duration-200 border ${
                activeTab === tab.key
                  ? "bg-primary/10 border-primary/30 text-text shadow-sm"
                  : "bg-surface-alt/50 border-border hover:border-primary/20 hover:bg-surface-alt text-text-muted"
              }`}
            >
              <span className={activeTab === tab.key ? "text-primary" : "text-text-muted"}>
                <TabIcon type={tab.key} />
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider leading-none ${
                activeTab === tab.key ? "text-primary" : ""
              }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-text-muted/70 text-center italic">
          {AUDIENCE_TABS.find((t) => t.key === activeTab)?.description}
        </p>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {activeQuestions.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8 opacity-60">
            No questions available for this audience level.
          </p>
        ) : (
          activeQuestions.map((q, idx) => (
            <div
              key={`${activeTab}-${idx}`}
              className={`group rounded-xl border transition-all duration-300 ${
                expandedIndex === idx
                  ? "bg-surface-alt border-primary/40 shadow-sm"
                  : "bg-surface-alt/50 border-border hover:border-primary/20"
              }`}
            >
              <button
                onClick={() => toggleQuestion(idx)}
                className="w-full flex items-start gap-4 p-4 text-left focus:outline-none"
              >
                <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-bold text-sm mt-0.5 transition-colors ${
                  expandedIndex === idx
                    ? "bg-primary text-white"
                    : "bg-background text-text-muted dark:border dark:border-border"
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className={`font-medium transition-colors ${
                    expandedIndex === idx ? "text-text" : "text-text-muted group-hover:text-text"
                  }`}>
                    {q.question}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 flex-shrink-0 text-text-muted transition-transform duration-300 ${
                      expandedIndex === idx ? "rotate-180 text-primary" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedIndex === idx ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-14 pb-4 pt-1">
                  <div className="relative">
                    <div className="absolute left-[-2rem] top-0 bottom-0 w-0.5 bg-primary/20 rounded-full"></div>
                    <p className="text-sm text-text-muted leading-relaxed italic">
                      <span className="font-bold text-primary mr-2 not-italic text-xs uppercase tracking-wider">Suggested Answer:</span>
                      {q.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
