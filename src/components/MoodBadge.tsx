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
    <div className="rounded-2xl border border-border/50 glass p-6 flex flex-col items-center h-full shadow-xl shadow-primary/5">
      <h3 className="text-[10px] font-black text-text-muted mb-6 uppercase tracking-[0.2em] w-full text-center opacity-70">Detected Mood</h3>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className={`px-5 py-2 rounded-xl flex items-center justify-center border shadow-lg transition-all duration-500 scale-110 ${config.color}`}>
          <span className="font-black text-sm leading-tight uppercase tracking-widest text-center">
            {mood}
          </span>
        </div>
      </div>
    </div>
  );
}
