export interface QuestionItem {
  question: string;
  answer: string;
}

export interface AudienceQuestions {
  beginner: QuestionItem[];
  intermediate: QuestionItem[];
  expert: QuestionItem[];
  mixed: QuestionItem[];
}

export interface AnalysisResult {
  score: number;
  mood: string;
  improvements: string[];
  questions: AudienceQuestions;
}
