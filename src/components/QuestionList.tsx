export default function QuestionList({ questions }: { questions: string[] }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        Predicted Audience Questions
      </h3>
      <ul className="space-y-3">
        {questions.map((q, idx) => (
          <li key={idx} className="flex gap-3 text-text-muted bg-white p-4 rounded-lg border border-border/50 shadow-sm group hover:border-primary/30 transition-colors">
            <span className="text-primary mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity">?</span>
            <span>{q}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
