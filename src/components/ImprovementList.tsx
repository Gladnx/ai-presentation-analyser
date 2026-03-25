export default function ImprovementList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
        Areas for Improvement
      </h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3 text-text-muted bg-surface-alt p-4 rounded-lg border border-border">
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary-light text-primary font-bold text-sm dark:bg-red-600 dark:border dark:border-red-500 dark:text-white">
              {idx + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
