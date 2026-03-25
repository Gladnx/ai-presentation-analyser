export interface AnalysisResult {
  score: number;
  mood: string;
  improvements: string[];
  questions: {
    question: string;
    answer: string;
  }[];
}
