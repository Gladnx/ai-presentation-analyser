export default function ScoreCard({ score }: { score: number }) {
  const getColorClass = () => {
    if (score >= 8) return "text-green-600 border-green-200 bg-green-50";
    if (score >= 5) return "text-yellow-600 border-yellow-200 bg-yellow-50";
    return "text-red-600 border-red-200 bg-red-50";
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 flex flex-col items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <h3 className="text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">Overall Score</h3>
      <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getColorClass()} transition-colors`}>
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-lg opacity-50 ml-1">/10</span>
      </div>
    </div>
  );
}
