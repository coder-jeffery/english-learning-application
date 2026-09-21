import React, { useState } from "react";
import { ExamType, UserScoreRecord } from "../types";
import { 
  BarChart3, 
  Award, 
  Target, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  HelpCircle,
  Lightbulb,
  Trash2
} from "lucide-react";

interface ScoreDashboardProps {
  currentExam: ExamType;
  targetScore: string;
  onUpdateTargetScore: (score: string) => void;
  scoreHistory: UserScoreRecord[];
  onClearHistory: () => void;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({
  currentExam,
  targetScore,
  onUpdateTargetScore,
  scoreHistory,
  onClearHistory,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>(targetScore);

  const ieltsTargets = ["Band 6.5", "Band 7.0", "Band 7.5", "Band 8.0", "Band 8.5", "Band 9.0"];
  const toeflTargets = ["80/120", "90/120", "100/120", "105/120", "110/120", "115/120"];

  const handleSaveTarget = (val: string) => {
    setSelectedTarget(val);
    onUpdateTargetScore(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Exam Diagnostics & Benchmarks
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Performance Analytics & Strategy Hub
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Set personal target scores, track multi-skill practice history, and master test day strategy protocols.
            </p>
          </div>

          {/* Current Target Selector */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center space-x-3">
            <Target className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                Target Objective
              </span>
              <select
                value={selectedTarget}
                onChange={(e) => handleSaveTarget(e.target.value)}
                className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer"
              >
                {(currentExam === "IELTS" ? ieltsTargets : toeflTargets).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Score History & Conversion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Practice History */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-stone-900">
                Recent Practice Assessments ({scoreHistory.length})
              </h3>
            </div>
            {scoreHistory.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-[11px] text-stone-400 hover:text-rose-600 flex items-center space-x-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {scoreHistory.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              No practice attempts recorded yet. Practice in Listening, Speaking, Reading, or Writing to log your diagnostics here!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {scoreHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold uppercase px-1.5 py-0.5 rounded bg-stone-900 text-white text-[10px]">
                        {rec.exam}
                      </span>
                      <span className="font-semibold text-stone-900 capitalize">
                        {rec.skill}: {rec.taskName}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">{rec.timestamp}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                      {rec.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Official Score Conversion Table */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-stone-200">
            <h3 className="text-sm font-bold text-stone-900">
              IELTS vs TOEFL vs CEFR Concordance
            </h3>
            <p className="text-[11px] text-stone-500">
              Official university admission benchmark equivalencies.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <th className="pb-2">IELTS Band</th>
                  <th className="pb-2">TOEFL iBT</th>
                  <th className="pb-2">CEFR Level</th>
                  <th className="pb-2">Proficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="py-2 font-bold text-stone-900">8.5 – 9.0</td>
                  <td className="py-2 font-mono">115 – 120</td>
                  <td className="py-2"><span className="px-1.5 py-0.5 bg-stone-900 text-white rounded font-bold text-[10px]">C2</span></td>
                  <td className="py-2 text-stone-500">Expert / Mastery</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-stone-900">7.5 – 8.0</td>
                  <td className="py-2 font-mono">102 – 114</td>
                  <td className="py-2"><span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold text-[10px]">C1</span></td>
                  <td className="py-2 text-stone-500">Effective Operational</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-stone-900">6.5 – 7.0</td>
                  <td className="py-2 font-mono">79 – 101</td>
                  <td className="py-2"><span className="px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded font-bold text-[10px]">B2+</span></td>
                  <td className="py-2 text-stone-500">Solid Competent</td>
                </tr>
                <tr>
                  <td className="py-2 font-bold text-stone-900">5.5 – 6.0</td>
                  <td className="py-2 font-mono">46 – 78</td>
                  <td className="py-2"><span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-[10px]">B2</span></td>
                  <td className="py-2 text-stone-500">Modest User</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Test-Day Strategy & Tactics Dossier */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-stone-200">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-stone-900">
            High-Yield Test Day Protocols & Strategy Dossier
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Listening Strategy */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">
              🎧 Listening Strategy
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>• <strong>Pre-read questions:</strong> Underline keywords in the 30-second prep breaks.</li>
              <li>• <strong>Signpost signals:</strong> Listen for contrast markers (<em>however, in reality, on the contrary</em>) where speakers correct earlier statements.</li>
              <li>• <strong>Watch spelling:</strong> Singular vs. plural endings lose points if mismatched.</li>
            </ul>
          </div>

          {/* Speaking Strategy */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">
              🗣️ Speaking Strategy
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>• <strong>PEEL framework:</strong> Point, Explanation, Example, Link back to topic.</li>
              <li>• <strong>Avoid filler silence:</strong> Use high-level transition fillers: <em>"That is an intriguing proposition..."</em></li>
              <li>• <strong>Range over speed:</strong> Prioritize sentence variety (conditionals, passive voice) over rapid talking.</li>
            </ul>
          </div>

          {/* Reading Strategy */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">
              📖 Reading Strategy
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>• <strong>True/False/Not Given rule:</strong> If the text directly contradicts, it's FALSE. If it's impossible to verify, it's NOT GIVEN.</li>
              <li>• <strong>Strict 20-min cap:</strong> Do not spend more than 90 seconds on any single difficult question. Flag and move on.</li>
              <li>• <strong>Topic sentences:</strong> 80% of paragraph headings relate directly to lines 1–2 or the final sentence.</li>
            </ul>
          </div>

          {/* Writing Strategy */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 block text-sm">
              ✍️ Writing Strategy
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>• <strong>Task 1 Overview:</strong> Always include a distinct overview paragraph summarizing general trends without numbers.</li>
              <li>• <strong>Task 2 Weighting:</strong> Task 2 contributes 66% of your writing score; spend a full 40 minutes on it.</li>
              <li>• <strong>5-min proofreading:</strong> Reserve time to eliminate subject-verb agreement slips and comma splices.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
