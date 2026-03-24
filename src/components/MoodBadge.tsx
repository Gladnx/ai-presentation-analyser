export default function MoodBadge({ mood }: { mood: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Detected Mood</h3>
      <div className="px-6 py-3 rounded-full bg-primary-light text-primary-dark font-semibold text-lg border border-primary/20">
        {mood}
      </div>
    </div>
  );
}
