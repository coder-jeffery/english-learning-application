import React, { useState } from "react";
import { VocabCard, ExamType } from "../types";
import { VOCABULARY_LIST } from "../data/mockVocabulary";
import { speakText } from "../utils/audio";
import { 
  Sparkles, 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Award,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

interface VocabularyModuleProps {
  currentExam: ExamType;
}

export const VocabularyModule: React.FC<VocabularyModuleProps> = ({ currentExam }) => {
  const [activeView, setActiveView] = useState<"flashcards" | "quiz">("flashcards");
  const [selectedCefr, setSelectedCefr] = useState<string>("ALL");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter list
  const filteredList = VOCABULARY_LIST.filter((item) => {
    if (selectedCefr === "ALL") return true;
    return item.cefr === selectedCefr;
  });

  const currentCard = filteredList[currentIndex] || filteredList[0] || VOCABULARY_LIST[0];

  // Quiz state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const quizCurrentWord = VOCABULARY_LIST[quizIndex % VOCABULARY_LIST.length];

  // Generate 4 multiple choice options for quiz definition
  const generateQuizOptions = (correctWord: VocabCard) => {
    const distractors = VOCABULARY_LIST.filter((w) => w.id !== correctWord.id)
      .slice(0, 3)
      .map((w) => w.definition);
    const all = [...distractors, correctWord.definition];
    // Deterministic shuffle based on word length
    return all.sort((a, b) => a.length - b.length);
  };

  const currentQuizOptions = generateQuizOptions(quizCurrentWord);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * filteredList.length));
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedQuizOption) return; // already answered
    setSelectedQuizOption(option);
    if (option === quizCurrentWord.definition) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizOption(null);
    if (quizIndex + 1 >= 5) {
      setQuizCompleted(true);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setQuizIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              High-Yield Academic Lexicon
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Academic Word List (AWL) & Collocations
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Master C1/C2 vocabulary essential for achieving IELTS Band 7.5+ and TOEFL 26+ in Speaking and Writing.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveView("flashcards");
                  setIsFlipped(false);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeView === "flashcards"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Interactive Flashcards
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveView("quiz");
                  setQuizIndex(0);
                  setQuizScore(0);
                  setSelectedQuizOption(null);
                  setQuizCompleted(false);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeView === "quiz"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Recall Quiz
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar (for flashcards) */}
        {activeView === "flashcards" && (
          <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-stone-500 font-semibold">CEFR Level:</span>
              {["ALL", "B2", "C1", "C2"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => {
                    setSelectedCefr(level);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                    selectedCefr === level
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <span className="text-stone-400">
              Card {currentIndex + 1} of {filteredList.length}
            </span>
          </div>
        )}
      </div>

      {/* View 1: Flashcard Deck */}
      {activeView === "flashcards" && currentCard && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[360px] bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col justify-between select-none relative group"
          >
            {/* Top pill bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-white text-[11px] font-black tracking-wide">
                  {currentCard.cefr}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                  {currentExam === "IELTS" ? currentCard.ieltsBand : `TOEFL ${currentCard.toeflScore}`}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  • {currentCard.topic}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakText(currentCard.word, { lang: "en-US", rate: 0.9 });
                }}
                className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                title="Pronounce Word"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Middle: Front vs Back */}
            {!isFlipped ? (
              <div className="text-center py-8 space-y-2">
                <h3 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                  {currentCard.word}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-xs font-mono text-stone-500">
                  <span>{currentCard.phonetic}</span>
                  <span>•</span>
                  <span className="italic">{currentCard.partOfSpeech}</span>
                </div>
                <p className="text-xs text-stone-400 pt-6">
                  (Click card or press flip to reveal definition, collocations, & example)
                </p>
              </div>
            ) : (
              <div className="py-2 space-y-4 text-left">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                    Definition
                  </span>
                  <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-relaxed">
                    {currentCard.definition}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Academic Collocations
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCard.collocations.map((col, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-xs font-mono font-medium border border-stone-200/60"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Contextual Exemplar
                  </span>
                  <p className="text-xs text-stone-700 italic bg-stone-50 p-3 rounded-xl border border-stone-200/80 leading-relaxed font-serif">
                    "{currentCard.exampleSentence}"
                  </p>
                </div>
              </div>
            )}

            {/* Bottom flip hint */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
              <span className="flex items-center space-x-1">
                <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                <span>{isFlipped ? "Click to see word" : "Click to flip card"}</span>
              </span>
              <span>IELTS / TOEFL Lexical Resource</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleShuffle}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Random</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-2xs"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View 2: Rapid Recall Quiz */}
      {activeView === "quiz" && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
          {!quizCompleted ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                    Question {quizIndex + 1} of 5
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-900">
                  Score: {quizScore} / {quizIndex + (selectedQuizOption ? 1 : 0)}
                </div>
              </div>

              <div className="text-center py-4 space-y-1">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Select the correct academic definition for:
                </span>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                  {quizCurrentWord.word}
                </h3>
                <div className="flex items-center justify-center space-x-2 text-xs font-mono text-stone-500">
                  <span>{quizCurrentWord.phonetic}</span>
                  <span>({quizCurrentWord.partOfSpeech})</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {currentQuizOptions.map((opt, idx) => {
                  const isSelected = selectedQuizOption === opt;
                  const isCorrect = opt === quizCurrentWord.definition;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={Boolean(selectedQuizOption)}
                      onClick={() => handleQuizAnswer(opt)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start space-x-3 ${
                        selectedQuizOption
                          ? isCorrect
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold"
                            : isSelected
                            ? "bg-rose-50 border-rose-300 text-rose-950"
                            : "border-stone-200 opacity-60 text-stone-700"
                          : "bg-stone-50/60 border-stone-200 hover:bg-stone-100 hover:border-stone-300 text-stone-800"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption && (
                <div className="pt-4 border-t border-stone-200 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuizQuestion}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    {quizIndex + 1 >= 5 ? "Finish Quiz" : "Next Question"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 space-y-4">
              <Award className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-bold text-stone-900">Quiz Completed!</h3>
              <p className="text-xs text-stone-600">
                You scored <strong className="text-stone-900">{quizScore} out of 5</strong> on academic recall.
              </p>
              <div className="pt-4 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setQuizIndex(0);
                    setQuizScore(0);
                    setSelectedQuizOption(null);
                    setQuizCompleted(false);
                  }}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("flashcards")}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  Back to Flashcards
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
