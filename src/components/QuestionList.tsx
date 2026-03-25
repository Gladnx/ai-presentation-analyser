"use client";

import { useState } from "react";

interface QuestionItem {
  question: string;
  answer: string;
}

export default function QuestionList({ questions }: { questions: QuestionItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!questions || questions.length === 0) return null;

  const toggleQuestion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="rounded-2xl border border-border/50 glass p-8 animate-fade-in-up shadow-xl shadow-primary/5" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-black text-text mb-6 flex items-center gap-3 uppercase tracking-widest">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        Predicted Insights
      </h3>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div 
            key={idx} 
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
                <span className={`font-medium transition-colors ${expandedIndex === idx ? "text-text" : "text-text-muted group-hover:text-text"}`}>
                  {q.question}
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`w-5 h-5 flex-shrink-0 text-text-muted transition-transform duration-300 ${expandedIndex === idx ? "rotate-180 text-primary" : ""}`} 
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
        ))}
      </div>
    </div>
  );
}
