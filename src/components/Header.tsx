import React, { useState } from "react";
import { ExamType, SkillType } from "../types";
import { 
  Headphones, 
  Mic, 
  BookOpen, 
  PenTool, 
  Sparkles, 
  BarChart3, 
  HelpCircle, 
  X, 
  CheckCircle2,
  Award
} from "lucide-react";

interface HeaderProps {
  currentExam: ExamType;
  onSelectExam: (exam: ExamType) => void;
  activeSkill: SkillType;
  onSelectSkill: (skill: SkillType) => void;
  targetScore: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentExam,
  onSelectExam,
  activeSkill,
  onSelectSkill,
  targetScore,
}) => {
  const [showExamComparison, setShowExamComparison] = useState(false);

  const skills: Array<{ id: SkillType; label: string; icon: React.ReactNode }> = [
    { id: "listening", label: "Listening", icon: <Headphones className="w-4 h-4" /> },
    { id: "speaking", label: "Speaking", icon: <Mic className="w-4 h-4" /> },
    { id: "reading", label: "Reading", icon: <BookOpen className="w-4 h-4" /> },
    { id: "writing", label: "Writing", icon: <PenTool className="w-4 h-4" /> },
    { id: "vocabulary", label: "Academic Vocab", icon: <Sparkles className="w-4 h-4" /> },
    { id: "dashboard", label: "Analytics & Strategy", icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper tier: Brand, Exam Selector, Target Score */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-sm">
              EP
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-stone-900 tracking-tight text-lg">
                  EnglishPrep
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  IELTS & TOEFL
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                Comprehensive 4-Skill Academic Exam Preparation
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Exam Mode Toggle */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                id="select-ielts-btn"
                type="button"
                onClick={() => onSelectExam("IELTS")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentExam === "IELTS"
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                IELTS Academic
              </button>
              <button
                id="select-toefl-btn"
                type="button"
                onClick={() => onSelectExam("TOEFL")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentExam === "TOEFL"
                    ? "bg-white text-stone-900 shadow-xs border border-stone-200/80"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                TOEFL iBT
              </button>
            </div>

            {/* Target Score Chip */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Target: {targetScore}</span>
            </div>

            {/* Comparison Guide Button */}
            <button
              id="exam-comparison-btn"
              type="button"
              onClick={() => setShowExamComparison(true)}
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
              title="IELTS vs TOEFL Comparison"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lower tier: Skill Navigation Bar */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none border-t border-stone-100 sm:border-0 pt-1 sm:pt-0">
          {skills.map((skill) => {
            const isActive = activeSkill === skill.id;
            return (
              <button
                key={skill.id}
                id={`nav-${skill.id}-tab`}
                type="button"
                onClick={() => onSelectSkill(skill.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap border-b-2 -mb-px ${
                  isActive
                    ? "text-stone-900 border-stone-900 bg-stone-50/70"
                    : "text-stone-500 border-transparent hover:text-stone-800 hover:bg-stone-50/40"
                }`}
              >
                <span className={isActive ? "text-stone-900" : "text-stone-400"}>
                  {skill.icon}
                </span>
                <span>{skill.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Comparison Modal */}
      {showExamComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">
                IELTS Academic vs TOEFL iBT Comparison Guide
              </h3>
              <button
                type="button"
                onClick={() => setShowExamComparison(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-stone-700">
              <p className="text-stone-600">
                Both tests assess listening, speaking, reading, and writing for university admissions and professional licensing, but differ in format:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    IELTS Academic
                  </span>
                  <h4 className="font-bold text-stone-900 text-base mt-1">0.0 – 9.0 Band Scale</h4>
                  <ul className="mt-3 space-y-2 text-xs text-stone-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Listening:</strong> 40 questions; diverse international accents (British, Australian, North American).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Speaking:</strong> In-person or video interview with human examiner in 3 parts.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Reading:</strong> 3 long academic texts; includes True/False/Not Given and Heading Matching.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Writing:</strong> Task 1 describes visual chart/map (150 words); Task 2 discursive essay (250 words).</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    TOEFL iBT
                  </span>
                  <h4 className="font-bold text-stone-900 text-base mt-1">0 – 120 Total Points (30/section)</h4>
                  <ul className="mt-3 space-y-2 text-xs text-stone-600">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Listening:</strong> 2 campus conversations + 3 academic lectures; primarily North American accents.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Speaking:</strong> 4 computer-recorded tasks with strict 15-30s prep & 45-60s speaking countdowns.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Reading:</strong> 2 academic passages (20 questions); vocabulary in context, sentence insertions.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Writing:</strong> Integrated synthesis task (150-225 words) + Writing for an Academic Discussion (100 words).</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-900">
                <strong>Benchmark Equivalent:</strong> IELTS Band 7.5 ≈ TOEFL 102 | IELTS Band 7.0 ≈ TOEFL 94 | IELTS Band 6.5 ≈ TOEFL 79.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExamComparison(false)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
