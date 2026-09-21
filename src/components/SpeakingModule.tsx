import React, { useState, useEffect, useRef } from "react";
import { ExamType, SpeakingPrompt, SpeakingEvaluationResult, UserScoreRecord } from "../types";
import { SPEAKING_PROMPTS } from "../data/mockSpeaking";
import { createSpeechRecognizer, speakText, stopSpeaking } from "../utils/audio";
import { 
  Mic, 
  MicOff, 
  Play, 
  Square, 
  Sparkles, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  FileEdit,
  ArrowRight,
  BookOpen
} from "lucide-react";
import confetti from "canvas-confetti";

interface SpeakingModuleProps {
  currentExam: ExamType;
  onSaveScore: (record: UserScoreRecord) => void;
}

export const SpeakingModule: React.FC<SpeakingModuleProps> = ({
  currentExam,
  onSaveScore,
}) => {
  const filteredPrompts = SPEAKING_PROMPTS.filter((p) => p.exam === currentExam);
  const [selectedPromptId, setSelectedPromptId] = useState<string>(
    filteredPrompts[0]?.id || SPEAKING_PROMPTS[0].id
  );

  useEffect(() => {
    const matched = SPEAKING_PROMPTS.find((p) => p.exam === currentExam);
    if (matched) {
      setSelectedPromptId(matched.id);
    }
  }, [currentExam]);

  const currentPrompt =
    SPEAKING_PROMPTS.find((p) => p.id === selectedPromptId) || SPEAKING_PROMPTS[0];

  // Test states
  const [stage, setStage] = useState<"idle" | "prep" | "speaking" | "evaluated">("idle");
  const [timerSeconds, setTimerSeconds] = useState<number>(currentPrompt.prepTimeSeconds);
  const [notes, setNotes] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState<"feedback" | "modelAnswer">("feedback");

  const recognizerRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);

  // Reset when prompt changes
  useEffect(() => {
    setStage("idle");
    setNotes("");
    setTranscript("");
    setEvaluation(null);
    stopSpeaking();
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }
  }, [selectedPromptId]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      stopSpeaking();
    };
  }, []);

  // Handle Prep Timer
  const startPreparation = () => {
    setStage("prep");
    setTimerSeconds(currentPrompt.prepTimeSeconds);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          startSpeakingSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Speaking Session
  const startSpeakingSession = () => {
    setStage("speaking");
    setTimerSeconds(currentPrompt.speakTimeSeconds);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    // Initialize Speech Recognition
    const recognizer = createSpeechRecognizer({
      onResult: (text, isFinal) => {
        setTranscript(text);
      },
      onError: (err) => {
        console.warn("Speech recognition error:", err);
      },
      onEnd: () => {
        setIsRecognizing(false);
      },
    });

    if (recognizer) {
      try {
        recognizer.start();
        recognizerRef.current = recognizer;
        setIsRecognizing(true);
      } catch (e) {
        console.warn("Could not start recognition:", e);
      }
    }

    timerIntervalRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          stopSpeakingSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopSpeakingSession = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      setIsRecognizing(false);
    }
    setStage("idle");
  };

  const handleEvaluateAI = async () => {
    if (!transcript.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/evaluate-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam: currentExam,
          taskName: currentPrompt.part,
          promptText: currentPrompt.promptText,
          transcript: transcript.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Evaluation failed.");
      }

      const data: SpeakingEvaluationResult = await res.json();
      setEvaluation(data);
      setStage("evaluated");
      setActiveTab("feedback");

      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      onSaveScore({
        id: "spk-score-" + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        exam: currentExam,
        skill: "speaking",
        taskName: currentPrompt.part,
        score: data.score,
      });
    } catch (err: any) {
      console.error(err);
      alert("Failed to evaluate speaking response. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Prompt Selector */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {currentExam} Speaking Studio
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Interactive Examiner & Speech Grader
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Simulate authentic preparation and response timers, speak naturally with live transcription, and receive official examiner band breakdowns.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
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
                {p.part}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Card */}
        <div className="mt-6 p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {currentPrompt.part} • Topic: {currentPrompt.topic}
            </span>
            <div className="flex items-center space-x-2 text-xs text-stone-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Prep: {currentPrompt.prepTimeSeconds}s | Speak: {currentPrompt.speakTimeSeconds}s</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-stone-900 leading-snug">
            "{currentPrompt.promptText}"
          </h3>

          {/* Integrated reading or listening snippet (TOEFL) */}
          {currentPrompt.readingSnippet && (
            <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <strong className="text-stone-900 block mb-1">Campus Reading Context:</strong>
              {currentPrompt.readingSnippet}
            </div>
          )}
          {currentPrompt.listeningSnippet && (
            <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <strong className="text-stone-900 block mb-1">Campus Conversation / Lecture Excerpt:</strong>
              {currentPrompt.listeningSnippet}
            </div>
          )}

          {/* Cue card bullet points (IELTS) */}
          {currentPrompt.bulletPoints && currentPrompt.bulletPoints.length > 0 && (
            <div className="mt-2 text-xs text-stone-700 space-y-1">
              <p className="font-semibold text-stone-900">You should say:</p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                {currentPrompt.bulletPoints.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </div>
          )}

          {/* High-yield collocations */}
          <div className="pt-2 flex items-center flex-wrap gap-1.5 text-[11px]">
            <span className="text-stone-500 font-medium mr-1">Target Lexicon:</span>
            {currentPrompt.keyVocabulary.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800 font-mono font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Live Controls & Timers */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-stone-800 border border-stone-700 flex flex-col items-center justify-center shrink-0">
              <span className="text-xs text-stone-400 font-medium">Timer</span>
              <span className="text-base font-extrabold font-mono text-amber-400">
                {timerSeconds}s
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {stage === "prep"
                  ? "Preparation Time"
                  : stage === "speaking"
                  ? "Speaking Time (Recording)"
                  : "Exam Controls"}
              </span>
              <p className="text-xs text-stone-300">
                {stage === "prep"
                  ? "Formulate your key points in the scratchpad below."
                  : stage === "speaking"
                  ? "Speak clearly into your microphone. Live transcription active."
                  : "Click Start Preparation to begin the official countdown."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {stage === "idle" && (
              <button
                type="button"
                onClick={startPreparation}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Start Prep ({currentPrompt.prepTimeSeconds}s)</span>
              </button>
            )}

            {stage === "prep" && (
              <button
                type="button"
                onClick={startSpeakingSession}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
              >
                <Mic className="w-4 h-4" />
                <span>Skip to Speaking</span>
              </button>
            )}

            {stage === "speaking" && (
              <button
                type="button"
                onClick={stopSpeakingSession}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Finish Speaking</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Work Area: Scratchpad Notes & Live Speech Transcript */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scratchpad */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <FileEdit className="w-4 h-4 text-stone-500" />
              <h4 className="text-sm font-bold text-stone-900">Scratchpad / Outline Notes</h4>
            </div>
            <span className="text-[11px] text-stone-400">Not graded in exam</span>
          </div>
          <p className="text-xs text-stone-500 mt-2 mb-3">
            Jot down key vocabulary, transitional phrases, or three main supporting reasons.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g.
1. Urban tree canopy reduces ambient temp
2. Community engagement & volunteer tree planting
3. Bioswales prevent municipal stormwater runoff"
            className="flex-1 w-full min-h-[160px] p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono resize-none"
          />
        </div>

        {/* Live Speech Transcript & Evaluation Trigger */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Mic className={`w-4 h-4 ${isRecognizing ? "text-emerald-600 animate-pulse" : "text-stone-500"}`} />
              <h4 className="text-sm font-bold text-stone-900">Spoken Response Transcript</h4>
            </div>
            {isRecognizing && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-pulse">
                Listening...
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-2 mb-3">
            Your live speech is automatically transcribed here. You can also edit or paste directly.
          </p>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Transcribed words appear here as you speak. Or type your response..."
            className="flex-1 w-full min-h-[160px] p-3 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none leading-relaxed"
          />

          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Word count: {transcript.trim() ? transcript.trim().split(/\s+/).length : 0} words
            </span>

            <button
              type="button"
              onClick={handleEvaluateAI}
              disabled={isEvaluating || !transcript.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEvaluating ? "Evaluating with AI..." : "Evaluate with AI Examiner"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Evaluation Report & Model Answer */}
      {(evaluation || currentPrompt.modelAnswer) && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">
                Examiner Diagnostics & Benchmarks
              </h3>
            </div>

            <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("feedback")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === "feedback"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Diagnostic Feedback
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("modelAnswer")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === "modelAnswer"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Band 8.5+ Exemplar Model
              </button>
            </div>
          </div>

          {activeTab === "feedback" && evaluation && (
            <div className="space-y-6">
              {/* Overall Score Banner */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Official Assessment
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-black text-amber-950">
                      {evaluation.score}
                    </span>
                    <span className="text-xs text-amber-800 font-medium">
                      Estimated {currentExam} Score
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                    {evaluation.overallFeedback}
                  </p>
                </div>
              </div>

              {/* Rubric Criteria Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {evaluation.criteria.map((crit, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
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
                ))}
              </div>

              {/* Vocabulary Upgrades & Grammar Fixes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vocab Upgrades */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/40">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Vocabulary & Collocation Upgrades</span>
                  </h5>
                  <div className="space-y-2">
                    {evaluation.vocabularyUpgrades.map((voc, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-rose-600 line-through font-mono">{voc.original}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                          <span className="text-emerald-700 font-bold font-mono">{voc.suggestion}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1">{voc.context}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grammar Fixes */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/40">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Grammatical Precision Advice</span>
                  </h5>
                  <div className="space-y-2">
                    {evaluation.grammarCorrections.map((g, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-white border border-stone-200 text-xs">
                        <span className="font-semibold text-rose-700 block">Error: {g.error}</span>
                        <span className="text-emerald-800 font-medium block mt-0.5">
                          Correction: {g.correction}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && !evaluation && (
            <div className="text-center py-8 text-stone-500 text-xs">
              Record or type your response above, then click <strong>"Evaluate with AI Examiner"</strong> to generate a diagnostic report.
            </div>
          )}

          {activeTab === "modelAnswer" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Native Academic Standard (Band 8.5+ / TOEFL 29+)
                </span>
                <button
                  type="button"
                  onClick={() => speakText(currentPrompt.modelAnswer, { rate: 0.95 })}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen & Shadow Audio</span>
                </button>
              </div>

              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 text-xs leading-relaxed text-stone-800 whitespace-pre-line font-serif text-justify">
                {currentPrompt.modelAnswer}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs text-blue-900">
                <strong>Shadowing Technique:</strong> Listen to the native audio sentence-by-sentence, pausing to repeat the rhythm, sentence stress, and intonation curve.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
