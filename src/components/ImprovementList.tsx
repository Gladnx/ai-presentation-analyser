export default function ImprovementList({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/50 glass p-8 shadow-xl shadow-primary/5">
      <h3 className="text-sm font-black text-text mb-6 flex items-center gap-3 uppercase tracking-widest">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </div>
        Improvement Roadmap
      </h3>
      <ul className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-4 text-text-muted bg-surface-alt/40 p-5 rounded-xl border border-border/50 hover:border-primary/20 transition-all group">
            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white font-black text-[10px] shadow-sm group-hover:scale-110 transition-transform">
              {idx + 1}
            </span>
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
