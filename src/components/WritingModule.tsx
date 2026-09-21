import React, { useState, useEffect } from "react";
import { ExamType, WritingPrompt, WritingEvaluationResult, UserScoreRecord } from "../types";
import { WRITING_PROMPTS } from "../data/mockWriting";
import { 
  PenTool, 
  Clock, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  ArrowRight, 
  BookOpen,
  Users,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";

interface WritingModuleProps {
  currentExam: ExamType;
  onSaveScore: (record: UserScoreRecord) => void;
}

export const WritingModule: React.FC<WritingModuleProps> = ({
  currentExam,
  onSaveScore,
}) => {
  const filteredPrompts = WRITING_PROMPTS.filter((p) => p.exam === currentExam);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(
    filteredPrompts[0]?.id || WRITING_PROMPTS[0].id
  );

  useEffect(() => {
    const matched = WRITING_PROMPTS.find((p) => p.exam === currentExam);
    if (matched) {
      setSelectedPromptId(matched.id);
    }
  }, [currentExam]);

  const currentPrompt =
    WRITING_PROMPTS.find((p) => p.id === selectedPromptId) || WRITING_PROMPTS[0];

  const [essayText, setEssayText] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState<"compose" | "modelAnswer">("compose");

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(
    currentPrompt.recommendedTimeMinutes * 60
  );
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    setEssayText("");
    setEvaluation(null);
    setActiveTab("compose");
    setTimerSeconds(currentPrompt.recommendedTimeMinutes * 60);
    setIsTimerRunning(false);
  }, [selectedPromptId]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const wordRatio = Math.min(100, Math.round((wordCount / currentPrompt.minWordCount) * 100));

  const handleEvaluateAI = async () => {
    if (!essayText.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: currentExam,
          taskType: currentPrompt.taskType,
          promptText: currentPrompt.promptText,
          essayText: essayText.trim(),
          wordCount,
        }),
      });

      if (!res.ok) {
        throw new Error("Evaluation request failed.");
      }

      const data: WritingEvaluationResult = await res.json();
      setEvaluation(data);

      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      onSaveScore({
        id: "wrt-score-" + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        exam: currentExam,
        skill: "writing",
        taskName: currentPrompt.taskType,
        score: data.score,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to evaluate writing with AI. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Task Selection */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {currentExam} Writing Workshop
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Official Rubric & AI Examiner Evaluation
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Practice timed academic reports, discursive essays, and discussions with real-time word counting and deep band assessments.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {filteredPrompts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPromptId(p.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left border ${
                  selectedPromptId === p.id
                    ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                    : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                }`}
              >
                {p.taskType}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Specifications Card */}
        <div className="mt-6 p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-stone-900">
              {currentPrompt.title}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-stone-600 font-medium">
              <span className="px-2 py-0.5 rounded-md bg-stone-200 font-semibold text-stone-800">
                Min: {currentPrompt.minWordCount} words
              </span>
              <span>Time: {currentPrompt.recommendedTimeMinutes} mins</span>
            </div>
          </div>

          <p className="text-xs text-stone-700 leading-relaxed font-medium">
            {currentPrompt.instructions}
          </p>

          <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed">
            <strong className="text-stone-900 block mb-1">Prompt:</strong>
            {currentPrompt.promptText}
          </div>

          {/* IELTS Task 1 Visual Chart (Interactive SVG) */}
          {currentPrompt.chartData && (
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-stone-800">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <span>{currentPrompt.chartData.title}</span>
              </div>

              {/* Responsive SVG Chart */}
              <div className="w-full overflow-x-auto py-2">
                <div className="min-w-[500px] h-48 flex items-end justify-between px-6 pt-6 pb-2 border-b border-l border-stone-300">
                  {currentPrompt.chartData.labels.map((year, idx) => {
                    const val1 = currentPrompt.chartData!.datasets[0].values[idx];
                    const val2 = currentPrompt.chartData!.datasets[1].values[idx];
                    const maxVal = 700;
                    const h1 = (val1 / maxVal) * 140;
                    const h2 = (val2 / maxVal) * 140;

                    return (
                      <div key={year} className="flex flex-col items-center space-y-2">
                        <div className="flex items-end space-x-2">
                          {/* Clean Energy Bar */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-stone-500 font-mono mb-1">
                              ${val1}B
                            </span>
                            <div
                              style={{ height: `${h1}px` }}
                              className="w-7 rounded-t bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xs"
                            />
                          </div>

                          {/* Fossil Bar */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-stone-500 font-mono mb-1">
                              ${val2}B
                            </span>
                            <div
                              style={{ height: `${h2}px` }}
                              className="w-7 rounded-t bg-rose-600 hover:bg-rose-500 transition-all shadow-xs"
                            />
                          </div>
                        </div>

                        <span className="text-xs font-bold text-stone-700">{year}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center space-x-6 text-xs text-stone-600 pt-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                  <span>Renewables (Solar / Wind / Hydro)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-sm bg-rose-600" />
                  <span>Fossil Fuels (Coal / Oil / Gas)</span>
                </div>
              </div>
            </div>
          )}

          {/* TOEFL Task 1 Integrated Snippets */}
          {currentPrompt.integratedReadingSnippet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900 block mb-1">
                  Reading Passage Summary:
                </span>
                {currentPrompt.integratedReadingSnippet}
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900 block mb-1">
                  Lecture Counter-Arguments:
                </span>
                {currentPrompt.integratedListeningSummary}
              </div>
            </div>
          )}

          {/* TOEFL Task 2 Academic Discussion Forum Context */}
          {currentPrompt.discussionContext && (
            <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-3 text-xs">
              <div className="p-3 bg-stone-100 rounded-lg text-stone-800 leading-relaxed">
                <strong className="text-stone-900 block mb-1">
                  Professor's Forum Question:
                </strong>
                {currentPrompt.discussionContext.professorPrompt}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPrompt.discussionContext.studentResponses.map((stud, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-stone-800 text-white font-bold text-[10px] flex items-center justify-center">
                        {stud.avatar}
                      </div>
                      <span className="font-bold text-stone-900">{stud.name}</span>
                    </div>
                    <p className="leading-relaxed">{stud.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Composition Workbench */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div className="flex items-center space-x-2">
            <PenTool className="w-4 h-4 text-stone-600" />
            <h4 className="text-sm font-bold text-stone-900">Your Response Essay</h4>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            {/* Countdown timer */}
            <div className="flex items-center space-x-2 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 font-mono font-bold text-stone-800">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{formatTimer(timerSeconds)}</span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-[10px] font-sans font-semibold text-stone-600 hover:text-stone-900 ml-1 underline"
              >
                {isTimerRunning ? "Pause" : "Start"}
              </button>
            </div>

            {/* Word count pill */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 font-semibold text-stone-700">
              <span>{wordCount}</span>
              <span className="text-stone-400">/</span>
              <span>{currentPrompt.minWordCount} words</span>
            </div>
          </div>
        </div>

        {/* Progress toward word minimum */}
        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${wordRatio}%` }}
            className={`h-full transition-all duration-300 ${
              wordRatio >= 100 ? "bg-emerald-500" : "bg-amber-400"
            }`}
          />
        </div>

        {/* Essay Textarea */}
        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder={`Type your ${currentPrompt.taskType} response here. Structure paragraphs logically with clear thesis statements, supporting topic sentences, and cohesive transition phrases...`}
          className="w-full min-h-[340px] p-4 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 leading-relaxed font-serif resize-y"
        />

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-200">
          <div className="text-xs text-stone-500">
            {wordCount >= currentPrompt.minWordCount ? (
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Word count requirement achieved ({wordCount} words)</span>
              </span>
            ) : (
              <span className="text-stone-500">
                Need {currentPrompt.minWordCount - wordCount} more words to reach minimum
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "compose" ? "modelAnswer" : "compose")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            >
              {activeTab === "compose" ? "View Model Essay" : "Back to Essay"}
            </button>

            <button
              type="button"
              onClick={handleEvaluateAI}
              disabled={isEvaluating || !essayText.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEvaluating ? "Analyzing Essay..." : "Grade Essay with AI Examiner"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Answer View */}
      {activeTab === "modelAnswer" && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-stone-900">
                Band 9.0 / TOEFL 30 Exemplar Essay
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-stone-500">
              {currentPrompt.modelAnswer.split(/\s+/).length} words
            </span>
          </div>

          <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 text-xs leading-relaxed text-stone-800 whitespace-pre-line font-serif text-justify">
            {currentPrompt.modelAnswer}
          </div>
        </div>
      )}

      {/* AI Evaluation Diagnostic Card */}
      {evaluation && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">
                Official {currentExam} Writing Diagnostic Report
              </h3>
            </div>
          </div>

          {/* Overall Score */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Examiner Overall Assessment
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-amber-950">
                {evaluation.score}
              </span>
              <span className="text-xs text-amber-800 font-semibold">
                Official Standard Band
              </span>
            </div>
            <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
              {evaluation.overallFeedback}
            </p>
          </div>

          {/* 4 Official Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {evaluation.criteria.map((crit, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">{crit.name}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-stone-200 text-stone-800">
                      {crit.score}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {crit.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Demonstrated Strengths</span>
              </h5>
              <ul className="list-disc pl-5 text-xs text-emerald-950 space-y-1">
                {evaluation.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
              <h5 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Priority Areas for Improvement</span>
              </h5>
              <ul className="list-disc pl-5 text-xs text-rose-950 space-y-1">
                {evaluation.weaknesses.map((wk, i) => (
                  <li key={i}>{wk}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Line-by-line Vocabulary & Grammar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                Academic Vocabulary Upgrades
              </span>
              <div className="space-y-2">
                {evaluation.vocabularyUpgrades.map((voc, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-600 line-through font-mono">{voc.original}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-emerald-700 font-bold font-mono">{voc.suggestion}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{voc.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 block">
                Grammar & Syntactic Corrections
              </span>
              <div className="space-y-2">
                {evaluation.grammarCorrections.map((g, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs">
                    <span className="text-rose-700 block font-medium">Original: "{g.original}"</span>
                    <span className="text-emerald-800 block font-semibold mt-0.5">
                      Corrected: "{g.corrected}"
                    </span>
                    <p className="text-[11px] text-stone-500 mt-1">{g.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exemplar Band 9 Rewrite */}
          {evaluation.band9Rewrite && (
            <div className="p-4 rounded-xl bg-stone-900 text-white space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Exemplar Band 9 / TOEFL 30 Academic Formulation
              </span>
              <p className="text-xs text-stone-200 font-serif leading-relaxed text-justify whitespace-pre-line">
                {evaluation.band9Rewrite}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
