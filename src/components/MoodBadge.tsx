export default function MoodBadge({ mood }: { mood: string }) {
  const getMoodConfig = () => {
    const m = mood.toLowerCase();
    if (m.includes('confident') || m.includes('positive')) return {
      color: "bg-green-600 border-green-500 text-white"
    };
    if (m.includes('nervous') || m.includes('anxious')) return {
      color: "bg-yellow-600 border-yellow-500 text-white"
    };
    if (m.includes('confused') || m.includes('unclear')) return {
      color: "bg-red-600 border-red-500 text-white"
    };
    return { color: "bg-red-600 border-red-500 text-white" };
  };

  const config = getMoodConfig();

  return (
    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-xs font-bold text-text-muted mb-6 uppercase tracking-[0.2em]">Detected Mood</h3>
      <div className="h-25 flex items-center justify-center w-full">
        <div className={`px-8 py-4 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300 ${config.color}`}>
          <span className="font-black text-xl leading-tight uppercase tracking-widest text-center">
            {mood}
          </span>
        </div>
      </div>
    </div>
  );
}
