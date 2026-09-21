import React, { useState, useEffect, useRef } from "react";
import { ExamType, ListeningSection, UserScoreRecord } from "../types";
import { LISTENING_SECTIONS } from "../data/mockListening";
import { speakText, stopSpeaking } from "../utils/audio";
import { 
  Play, 
  Square, 
  RotateCcw, 
  Volume2, 
  FileText, 
  CheckCircle, 
  XCircle, 
  HelpCircle,
  Clock,
  Gauge,
  Sparkles,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";

interface ListeningModuleProps {
  currentExam: ExamType;
  onSaveScore: (record: UserScoreRecord) => void;
}

export const ListeningModule: React.FC<ListeningModuleProps> = ({
  currentExam,
  onSaveScore,
}) => {
  // Filter sections by current exam
  const filteredSections = LISTENING_SECTIONS.filter((s) => s.exam === currentExam);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    filteredSections[0]?.id || LISTENING_SECTIONS[0].id
  );

  useEffect(() => {
    const matched = LISTENING_SECTIONS.find((s) => s.exam === currentExam);
    if (matched) {
      setSelectedSectionId(matched.id);
    }
  }, [currentExam]);

  const currentSection =
    LISTENING_SECTIONS.find((s) => s.id === selectedSectionId) || LISTENING_SECTIONS[0];

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [accent, setAccent] = useState<"en-GB" | "en-US">("en-GB");
  const [showScript, setShowScript] = useState<boolean>(false);

  // User answers
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    correct: number;
    total: number;
    bandScore: string;
  } | null>(null);

  // Clean up speech synthesis on unmount or section change
  useEffect(() => {
    stopSpeaking();
    setIsPlaying(false);
    setUserAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  }, [selectedSectionId]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(currentSection.script, {
        rate: playbackSpeed,
        lang: accent,
        onEnd: () => {
          setIsPlaying(false);
        },
      });
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPlaying(false);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    currentSection.questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || "").trim().toLowerCase();
      const actualAns = q.correctAnswer.trim().toLowerCase();
      if (userAns === actualAns) {
        correctCount += 1;
      }
    });

    const total = currentSection.questions.length;
    const ratio = correctCount / total;
    let bandScore = "";

    if (currentExam === "IELTS") {
      bandScore = ratio >= 0.9 ? "Band 8.5" : ratio >= 0.75 ? "Band 7.5" : ratio >= 0.5 ? "Band 6.5" : "Band 5.5";
    } else {
      const toeflScaled = Math.round(ratio * 30);
      bandScore = `${toeflScaled}/30 Points`;
    }

    const result = { correct: correctCount, total, bandScore };
    setScoreResult(result);
    setIsSubmitted(true);

    if (ratio >= 0.75) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (e) {
        // Confetti fallback
      }
    }

    onSaveScore({
      id: "score-" + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      exam: currentExam,
      skill: "listening",
      taskName: currentSection.title,
      score: bandScore,
      percentage: Math.round(ratio * 100),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Selection Bar */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {currentExam} Listening Center
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Authentic Audio Passage Simulator
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Practice real test questions with natural speech accents, timing controls, and instant diagnostic feedback.
            </p>
          </div>

          {/* Section Selector */}
          <div className="flex flex-wrap gap-2">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left border ${
                  selectedSectionId === sec.id
                    ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Player Controller Box */}
        <div className="mt-6 p-4 rounded-xl bg-stone-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-11 h-11 rounded-full bg-white text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-all shadow-md shrink-0"
              title={isPlaying ? "Pause" : "Play Audio"}
            >
              {isPlaying ? <Square className="w-4 h-4 fill-stone-900" /> : <Play className="w-5 h-5 ml-0.5 fill-stone-900" />}
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors"
              title="Stop & Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-stone-200">
                  {isPlaying ? "Playing Passage..." : "Audio Ready"}
                </span>
                {isPlaying && (
                  <span className="inline-flex items-center space-x-1">
                    <span className="w-1.5 h-3 bg-emerald-400 animate-pulse rounded-full" />
                    <span className="w-1.5 h-4 bg-emerald-400 animate-pulse rounded-full delay-75" />
                    <span className="w-1.5 h-2 bg-emerald-400 animate-pulse rounded-full delay-150" />
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 line-clamp-1">
                {currentSection.speakerDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Speed Selector */}
            <div className="flex items-center space-x-1 bg-stone-800 px-2 py-1 rounded-lg border border-stone-700">
              <Gauge className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-400">Speed:</span>
              {[0.8, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => {
                    setPlaybackSpeed(speed);
                    if (isPlaying) {
                      stopSpeaking();
                      setIsPlaying(true);
                      speakText(currentSection.script, { rate: speed, lang: accent, onEnd: () => setIsPlaying(false) });
                    }
                  }}
                  className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    playbackSpeed === speed ? "bg-white text-stone-900 font-bold" : "text-stone-300 hover:text-white"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Accent Selector */}
            <div className="flex items-center space-x-1 bg-stone-800 px-2 py-1 rounded-lg border border-stone-700">
              <span className="text-stone-400">Accent:</span>
              <button
                type="button"
                onClick={() => setAccent("en-GB")}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  accent === "en-GB" ? "bg-white text-stone-900" : "text-stone-300 hover:text-white"
                }`}
              >
                UK
              </button>
              <button
                type="button"
                onClick={() => setAccent("en-US")}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  accent === "en-US" ? "bg-white text-stone-900" : "text-stone-300 hover:text-white"
                }`}
              >
                US
              </button>
            </div>

            {/* Script Toggle */}
            <button
              type="button"
              onClick={() => setShowScript(!showScript)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg border transition-colors ${
                showScript
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-stone-800 text-stone-300 border-stone-700 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showScript ? "Hide Script" : "Peek Script"}</span>
            </button>
          </div>
        </div>

        {/* Script Viewer Panel (collapsible) */}
        {showScript && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs leading-relaxed text-stone-800 space-y-2 max-h-60 overflow-y-auto">
            <div className="flex items-center space-x-1.5 font-bold text-amber-900 uppercase tracking-wide">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Passage Audio Transcript (Study Aid)</span>
            </div>
            <p className="whitespace-pre-line font-mono text-stone-700">
              {currentSection.script}
            </p>
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Questions 1–{currentSection.questions.length}
            </h3>
            <p className="text-xs text-stone-500">
              {currentExam === "IELTS"
                ? "Complete the notes / choose the correct letter below."
                : "Listen carefully and choose the best response according to the speaker."}
            </p>
          </div>
          {scoreResult && (
            <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
              <span>Score: {scoreResult.correct}/{scoreResult.total}</span>
              <span className="text-stone-300">|</span>
              <span>{scoreResult.bandScore}</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {currentSection.questions.map((q, idx) => {
            const userAns = userAnswers[q.id] || "";
            const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-rose-50/50 border-rose-200"
                    : "bg-stone-50/60 border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-stone-900 text-sm">
                    {idx + 1}. {q.prompt}
                  </span>
                  {isSubmitted && (
                    <span className="shrink-0 ml-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </span>
                  )}
                </div>

                {/* Input depending on type */}
                <div className="mt-3">
                  {q.type === "fill-blank" ? (
                    <div className="max-w-md">
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={userAns}
                        placeholder="Type answer here..."
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 text-stone-900"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {q.options?.map((opt, optIdx) => {
                        const isSelected = userAns === opt;
                        const isActualCorrect = opt === q.correctAnswer;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center space-x-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isSubmitted
                                ? isActualCorrect
                                  ? "bg-emerald-100/70 border-emerald-300 font-semibold text-emerald-900"
                                  : isSelected
                                  ? "bg-rose-100/70 border-rose-300 text-rose-900"
                                  : "border-stone-200 opacity-60"
                                : isSelected
                                ? "bg-stone-900 text-white border-stone-900 font-medium"
                                : "bg-white border-stone-200 hover:bg-stone-100 text-stone-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.id}`}
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
                      })}
                    </div>
                  )}
                </div>

                {/* Explanation on submission */}
                {isSubmitted && (
                  <div className="mt-3 pt-3 border-t border-stone-200/60 text-xs text-stone-600 space-y-1">
                    <p>
                      <strong className="text-stone-900">Correct Answer:</strong>{" "}
                      <span className="text-emerald-700 font-semibold">{q.correctAnswer}</span>
                    </p>
                    <p className="text-stone-500 leading-relaxed">
                      <strong>Diagnostic Rationale:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit or Reset actions */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-200">
          <p className="text-xs text-stone-500">
            {Object.keys(userAnswers).length} of {currentSection.questions.length} answered
          </p>

          <div className="flex items-center space-x-3">
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
                Retake Section
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-xs disabled:opacity-50"
              >
                Submit Answers & Check Score
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
