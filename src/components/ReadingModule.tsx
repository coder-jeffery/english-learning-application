import React, { useState, useEffect } from "react";
import { ExamType, ReadingPassage, UserScoreRecord } from "../types";
import { READING_PASSAGES } from "../data/mockReading";
import { 
  Highlighter, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Flag, 
  BookOpen,
  Award,
  Sparkles,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";

interface ReadingModuleProps {
  currentExam: ExamType;
  onSaveScore: (record: UserScoreRecord) => void;
}

export const ReadingModule: React.FC<ReadingModuleProps> = ({
  currentExam,
  onSaveScore,
}) => {
  const filteredPassages = READING_PASSAGES.filter((p) => p.exam === currentExam);
  const [selectedPassageId, setSelectedPassageId] = useState<string>(
    filteredPassages[0]?.id || READING_PASSAGES[0].id
  );

  useEffect(() => {
    const matched = READING_PASSAGES.find((p) => p.exam === currentExam);
    if (matched) {
      setSelectedPassageId(matched.id);
    }
  }, [currentExam]);

  const currentPassage =
    READING_PASSAGES.find((p) => p.id === selectedPassageId) || READING_PASSAGES[0];

  // User state
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    correct: number;
    total: number;
    bandScore: string;
  } | null>(null);

  // Highlighting tool
  const [highlightColor, setHighlightColor] = useState<string>("bg-yellow-200/70");

  // Selected word for quick lookup
  const [lookupWord, setLookupWord] = useState<{
    word: string;
    definition: string;
    synonym: string;
  } | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(currentPassage.timeLimitMinutes * 60);

  useEffect(() => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setIsSubmitted(false);
    setScoreResult(null);
    setLookupWord(null);
    setTimeLeft(currentPassage.timeLimitMinutes * 60);
  }, [selectedPassageId]);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Quick word lookup dictionary helper
  const handleWordClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 2 && selection.split(/\s+/).length === 1) {
      const clean = selection.replace(/[^a-zA-Z]/g, "").toLowerCase();
      // Simple dictionary lookup
      const dict: Record<string, { def: string; syn: string }> = {
        biophilic: { def: "Relating to the innate human tendency to seek connections with nature.", syn: "nature-centric, eco-integrated" },
        predicated: { def: "Found or based on a specific premise or principle.", syn: "grounded, derived, contingent" },
        rectilinear: { def: "Contained by or consisting of straight lines.", syn: "linear, straight-angled" },
        subdue: { def: "Overcome, quieten, or bring under control.", syn: "tame, suppress, conquer" },
        evapotranspiration: { def: "The process by which water is transferred to the atmosphere by evaporation and by transpiration.", syn: "vegetative moisture release" },
        recuperating: { def: "Recovering from illness or exertion.", syn: "convalescing, healing, mending" },
        cantilevered: { def: "Projecting horizontally without exterior support.", syn: "overhanging, beam-projected" },
        impediments: { def: "Hindrances or obstructions in doing something.", syn: "obstacles, barriers, hurdles" },
        eusocial: { def: "Showing an advanced level of social organization (e.g. sterile worker castes).", syn: "communal caste-based" },
        altruistic: { def: "Showing disinterested and selfless concern for the well-being of others.", syn: "self-sacrificing, charitable" },
        haplodiploidy: { def: "Sex-determination system in which males develop from unfertilized eggs and females from fertilized.", syn: "haploid-diploid genetics" },
        diluting: { def: "Weakening or making less concentrated.", syn: "attenuating, diminishing" },
      };

      if (dict[clean]) {
        setLookupWord({
          word: clean.toUpperCase(),
          definition: dict[clean].def,
          synonym: dict[clean].syn,
        });
      } else {
        setLookupWord({
          word: clean.toUpperCase(),
          definition: "Academic term used in context.",
          synonym: "Refer to surrounding passage phrasing.",
        });
      }
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    currentPassage.questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || "").trim().toLowerCase();
      const actualAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === actualAns) {
        correctCount += 1;
      }
    });

    const total = currentPassage.questions.length;
    const ratio = correctCount / total;
    let bandScore = "";

    if (currentExam === "IELTS") {
      bandScore = ratio >= 0.9 ? "Band 8.5" : ratio >= 0.75 ? "Band 7.5" : ratio >= 0.5 ? "Band 6.5" : "Band 5.5";
    } else {
      const toeflPoints = Math.round(ratio * 30);
      bandScore = `${toeflPoints}/30 Points`;
    }

    setScoreResult({ correct: correctCount, total, bandScore });
    setIsSubmitted(true);

    if (ratio >= 0.75) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }

    onSaveScore({
      id: "rd-score-" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      exam: currentExam,
      skill: "reading",
      taskName: currentPassage.title,
      score: bandScore,
      percentage: Math.round(ratio * 100),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Passage Selector */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {currentExam} Reading Lab
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Computer-Delivered Academic Passage Interface
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Split-screen passage viewer with interactive text highlighter, quick dictionary lookup, and official item formats.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Passage Selector */}
            <div className="flex flex-wrap gap-2">
              {filteredPassages.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPassageId(p.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    selectedPassageId === p.id
                      ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                      : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {p.title.length > 30 ? p.title.substring(0, 30) + "..." : p.title}
                </button>
              ))}
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-900">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{formatTimer(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Highlighter & Instructions */}
        <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-medium">Text Highlighter:</span>
            {[
              { label: "Yellow", class: "bg-yellow-200/80" },
              { label: "Emerald", class: "bg-emerald-200/80" },
              { label: "Sky", class: "bg-sky-200/80" },
            ].map((col) => (
              <button
                key={col.label}
                type="button"
                onClick={() => setHighlightColor(col.class)}
                className={`w-6 h-6 rounded-full border border-stone-300 ${col.class} transition-transform ${
                  highlightColor === col.class ? "scale-110 ring-2 ring-stone-900" : ""
                }`}
                title={`Highlight in ${col.label}`}
              />
            ))}
            <span className="text-[11px] text-stone-400 ml-2">
              (Select text to trigger quick dictionary lookup)
            </span>
          </div>

          {lookupWord && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
              <span className="font-bold">{lookupWord.word}:</span>
              <span>{lookupWord.definition}</span>
              <span className="text-amber-700">| Syn: {lookupWord.synonym}</span>
              <button
                type="button"
                onClick={() => setLookupWord(null)}
                className="ml-1 text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Split-Screen: Passage Left, Questions Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic Passage */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs max-h-[720px] overflow-y-auto space-y-4">
          <div className="pb-3 border-b border-stone-200">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              {currentPassage.category} • {currentPassage.wordCount} words
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-0.5">
              {currentPassage.title}
            </h3>
          </div>

          <div
            className="space-y-4 text-xs leading-relaxed text-stone-800 font-serif text-justify select-text"
            onMouseUp={handleWordClick}
          >
            {currentPassage.paragraphs.map((para) => (
              <div key={para.id} className="relative pl-6">
                <span className="absolute left-0 top-0 font-sans font-bold text-[11px] text-stone-400">
                  [{para.letter}]
                </span>
                <p>{para.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Question Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs max-h-[720px] overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Questions 1–{currentPassage.questions.length}
                </h4>
                <p className="text-[11px] text-stone-500">
                  Review all items before submitting.
                </p>
              </div>
              {scoreResult && (
                <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900">
                  {scoreResult.correct}/{scoreResult.total} ({scoreResult.bandScore})
                </div>
              )}
            </div>

            <div className="space-y-6">
              {currentPassage.questions.map((q, idx) => {
                const userAns = userAnswers[q.id] || "";
                const isFlagged = flaggedQuestions[q.id];
                const isCorrect =
                  userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? "bg-emerald-50/50 border-emerald-200"
                          : "bg-rose-50/50 border-rose-200"
                        : isFlagged
                        ? "bg-amber-50/50 border-amber-300"
                        : "bg-stone-50/50 border-stone-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {idx + 1}. {q.prompt}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFlag(q.id)}
                        className={`p-1 rounded-md transition-colors ${
                          isFlagged ? "text-amber-600 bg-amber-100" : "text-stone-300 hover:text-stone-500"
                        }`}
                        title={isFlagged ? "Unflag" : "Flag for review"}
                      >
                        <Flag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Options */}
                    <div className="mt-3 space-y-1.5">
                      {q.type === "tfng" ? (
                        <div className="flex gap-2">
                          {["TRUE", "FALSE", "NOT GIVEN"].map((val) => {
                            const isSelected = userAns === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleAnswerChange(q.id, val)}
                                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                                  isSelected
                                    ? "bg-stone-900 text-white border-stone-900"
                                    : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                                }`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        q.options?.map((opt, optIdx) => {
                          const isSelected = userAns === opt;
                          const isActual = opt === q.correctAnswer;
                          return (
                            <label
                              key={optIdx}
                              className={`flex items-center space-x-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                isSubmitted
                                  ? isActual
                                    ? "bg-emerald-100 border-emerald-300 font-semibold text-emerald-900"
                                    : isSelected
                                    ? "bg-rose-100 border-rose-300 text-rose-900"
                                    : "border-stone-200 opacity-60"
                                  : isSelected
                                  ? "bg-stone-900 text-white border-stone-900 font-medium"
                                  : "bg-white border-stone-200 hover:bg-stone-100 text-stone-800"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`rq-${q.id}`}
                                disabled={isSubmitted}
                                checked={isSelected}
                                onChange={() => handleAnswerChange(q.id, opt)}
                                className="hidden"
                              />
                              <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </label>
                          );
                        })
                      )}
                    </div>

                    {/* Explanations on submission */}
                    {isSubmitted && (
                      <div className="mt-3 pt-3 border-t border-stone-200/60 text-[11px] text-stone-600 space-y-1">
                        <p>
                          <strong className="text-stone-900">Correct:</strong>{" "}
                          <span className="text-emerald-700 font-bold">{q.correctAnswer}</span>{" "}
                          {q.paragraphReference && (
                            <span className="text-stone-400 font-mono">
                              (See Paragraph {q.paragraphReference})
                            </span>
                          )}
                        </p>
                        <p className="text-stone-500 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Bar */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              {Object.keys(userAnswers).length}/{currentPassage.questions.length} answered
            </span>

            {isSubmitted ? (
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setUserAnswers({});
                  setScoreResult(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Reset & Retake
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-xs disabled:opacity-50"
              >
                Submit Reading Answers
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
