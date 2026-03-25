export default function ScoreCard({ score }: { score: number }) {
  const getThemeClasses = () => {
    if (score >= 8) return {
      text: "text-green-600 dark:text-white",
      border: "border-green-500",
      bg: "bg-green-100 dark:bg-linear-to-br dark:from-green-600 dark:to-green-700",
      ring: "border-green-200 dark:border-green-500/50"
    };
    if (score >= 5) return {
      text: "text-yellow-600 dark:text-white",
      border: "border-yellow-500",
      bg: "bg-yellow-100 dark:bg-linear-to-br dark:from-yellow-600 dark:to-yellow-700",
      ring: "border-yellow-200 dark:border-yellow-500/50"
    };
    return {
      text: "text-red-600 dark:text-white",
      border: "border-red-500",
      bg: "bg-red-100 dark:bg-linear-to-br dark:from-red-600 dark:to-red-700",
      ring: "border-red-200 dark:border-red-500/50"
    };
  };

  const theme = getThemeClasses();

  return (
    <div className="rounded-2xl border border-border/50 glass p-6 flex flex-col items-center h-full shadow-xl shadow-primary/5">
      <h3 className="text-[10px] font-black text-text-muted mb-6 uppercase tracking-[0.2em] w-full text-center opacity-70">Overall Score</h3>
      <div className={`relative w-28 h-28 rounded-full border-2 ${theme.ring} flex items-center justify-center transition-all duration-500`}>
        <div className={`w-22 h-22 rounded-full border-2 ${theme.border} ${theme.bg} flex flex-col items-center justify-center shadow-lg`}>
          <div className="flex items-baseline leading-none">
            <span className={`text-4xl font-black ${theme.text}`}>{score}</span>
            <span className={`text-sm font-bold ml-0.5 ${theme.text} opacity-70`}>/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
