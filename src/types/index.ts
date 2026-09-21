export type ExamType = "IELTS" | "TOEFL";
export type SkillType = "listening" | "speaking" | "reading" | "writing" | "vocabulary" | "dashboard";

export type CEFRLevel = "B1" | "B2" | "C1" | "C2";

// Listening types
export interface ListeningQuestion {
  id: string;
  questionNumber: number;
  type: "mcq" | "fill-blank" | "matching";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  timestampSeconds?: number;
}

export interface ListeningSection {
  id: string;
  exam: ExamType;
  title: string;
  contextType: "social-dialogue" | "monologue" | "academic-discussion" | "academic-lecture" | "campus-conversation";
  speakerDescription: string;
  audioDurationSeconds: number;
  script: string;
  questions: ListeningQuestion[];
}

// Reading types
export interface ReadingQuestion {
  id: string;
  questionNumber: number;
  type: "tfng" | "mcq" | "heading-match" | "vocab-context" | "sentence-insert";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  paragraphReference?: string;
}

export interface ReadingParagraph {
  id: string;
  letter: string;
  text: string;
}

export interface ReadingPassage {
  id: string;
  exam: ExamType;
  title: string;
  category: "Science" | "History" | "Psychology" | "Environment" | "Technology";
  wordCount: number;
  timeLimitMinutes: number;
  paragraphs: ReadingParagraph[];
  questions: ReadingQuestion[];
}

// Speaking types
export interface SpeakingPrompt {
  id: string;
  exam: ExamType;
  part: "IELTS Part 1" | "IELTS Part 2 (Cue Card)" | "IELTS Part 3" | "TOEFL Task 1 (Independent)" | "TOEFL Task 2 (Integrated)";
  topic: string;
  instructions: string;
  promptText: string;
  bulletPoints?: string[];
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  readingSnippet?: string;
  listeningSnippet?: string;
  modelAnswer: string;
  keyVocabulary: string[];
}

export interface SpeakingEvaluationResult {
  score: string;
  overallFeedback: string;
  criteria: Array<{
    name: string;
    score: string;
    feedback: string;
  }>;
  vocabularyUpgrades: Array<{
    original: string;
    suggestion: string;
    context: string;
  }>;
  grammarCorrections: Array<{
    error: string;
    correction: string;
  }>;
  modelAnswer: string;
}

// Writing types
export interface WritingPrompt {
  id: string;
  exam: ExamType;
  taskType: "IELTS Task 1 (Academic)" | "IELTS Task 2 (Essay)" | "TOEFL Task 1 (Integrated)" | "TOEFL Task 2 (Academic Discussion)";
  title: string;
  instructions: string;
  promptText: string;
  minWordCount: number;
  recommendedTimeMinutes: number;
  chartData?: {
    type: "bar" | "line";
    title: string;
    labels: string[];
    datasets: Array<{ label: string; values: number[]; color: string }>;
  };
  integratedReadingSnippet?: string;
  integratedListeningSummary?: string;
  discussionContext?: {
    professorPrompt: string;
    studentResponses: Array<{ name: string; avatar: string; response: string }>;
  };
  modelAnswer: string;
}

export interface WritingEvaluationResult {
  score: string;
  overallFeedback: string;
  criteria: Array<{
    name: string;
    score: string;
    feedback: string;
  }>;
  vocabularyUpgrades: Array<{
    original: string;
    suggestion: string;
    explanation: string;
  }>;
  grammarCorrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  strengths: string[];
  weaknesses: string[];
  band9Rewrite: string;
}

// Vocabulary types
export interface VocabCard {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  cefr: CEFRLevel;
  ieltsBand: string;
  toeflScore: string;
  collocations: string[];
  synonyms: string[];
  exampleSentence: string;
  topic: string;
}

// User Score History
export interface UserScoreRecord {
  id: string;
  timestamp: string;
  exam: ExamType;
  skill: SkillType;
  taskName: string;
  score: string;
  percentage?: number;
}
