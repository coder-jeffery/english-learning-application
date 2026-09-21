import React, { useState, useEffect } from "react";
import { ExamType, SkillType, UserScoreRecord } from "./types";
import { Header } from "./components/Header";
import { ListeningModule } from "./components/ListeningModule";
import { SpeakingModule } from "./components/SpeakingModule";
import { ReadingModule } from "./components/ReadingModule";
import { WritingModule } from "./components/WritingModule";
import { VocabularyModule } from "./components/VocabularyModule";
import { ScoreDashboard } from "./components/ScoreDashboard";
import { 
  Headphones, 
  Mic, 
  BookOpen, 
  PenTool, 
  Sparkles, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function App() {
  const [currentExam, setCurrentExam] = useState<ExamType>("IELTS");
  const [activeSkill, setActiveSkill] = useState<SkillType>("listening");
  const [targetScore, setTargetScore] = useState<string>("Band 7.5");

  // Load / persist score history
  const [scoreHistory, setScoreHistory] = useState<UserScoreRecord[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("engprep_score_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    // Seed initial records for demonstration
    return [
      {
        id: "seed-1",
        timestamp: "Yesterday, 3:15 PM",
        exam: "IELTS",
        skill: "listening",
        taskName: "Section 1: Accommodation Inquiry",
        score: "Band 8.0",
        percentage: 85,
      },
      {
        id: "seed-2",
        timestamp: "Yesterday, 4:40 PM",
        exam: "IELTS",
        skill: "reading",
        taskName: "The Biophilic City",
        score: "Band 7.5",
        percentage: 80,
      },
      {
        id: "seed-3",
        timestamp: "Today, 10:20 AM",
        exam: "TOEFL",
        skill: "speaking",
        taskName: "Task 1 (Independent)",
        score: "26/30 Points",
      },
    ];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("engprep_score_history", JSON.stringify(scoreHistory));
    }
  }, [scoreHistory]);

  const handleSaveScore = (record: UserScoreRecord) => {
    setScoreHistory((prev) => [record, ...prev]);
  };

  const handleClearHistory = () => {
    setScoreHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("engprep_score_history");
    }
  };

  // Switch target default when exam changes
  const handleSelectExam = (exam: ExamType) => {
    setCurrentExam(exam);
    if (exam === "IELTS" && !targetScore.includes("Band")) {
      setTargetScore("Band 7.5");
    } else if (exam === "TOEFL" && targetScore.includes("Band")) {
      setTargetScore("102/120");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans antialiased selection:bg-stone-900 selection:text-white">
      {/* Main Persistent Header */}
      <Header
        currentExam={currentExam}
        onSelectExam={handleSelectExam}
        activeSkill={activeSkill}
        onSelectSkill={setActiveSkill}
        targetScore={targetScore}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Skill Overview Breadcrumb & Info */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold px-2 py-0.5 rounded-md bg-stone-900 text-white">
              {currentExam}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-600 capitalize">
              {activeSkill === "vocabulary"
                ? "Academic Vocabulary"
                : activeSkill === "dashboard"
                ? "Diagnostics & Strategy"
                : `${activeSkill} Module`}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-stone-500">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Test Criteria Aligned</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Evaluation Enabled</span>
            </div>
          </div>
        </div>

        {/* Dynamic Skill View */}
        {activeSkill === "listening" && (
          <ListeningModule
            currentExam={currentExam}
            onSaveScore={handleSaveScore}
          />
        )}

        {activeSkill === "speaking" && (
          <SpeakingModule
            currentExam={currentExam}
            onSaveScore={handleSaveScore}
          />
        )}

        {activeSkill === "reading" && (
          <ReadingModule
            currentExam={currentExam}
            onSaveScore={handleSaveScore}
          />
        )}

        {activeSkill === "writing" && (
          <WritingModule
            currentExam={currentExam}
            onSaveScore={handleSaveScore}
          />
        )}

        {activeSkill === "vocabulary" && (
          <VocabularyModule currentExam={currentExam} />
        )}

        {activeSkill === "dashboard" && (
          <ScoreDashboard
            currentExam={currentExam}
            targetScore={targetScore}
            onUpdateTargetScore={setTargetScore}
            scoreHistory={scoreHistory}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-stone-800">PrepMaster English</span>
            <span>•</span>
            <span>IELTS Academic & TOEFL iBT Preparation Suite</span>
          </div>

          <div className="flex items-center space-x-4 text-stone-500">
            <span>Listening • Speaking • Reading • Writing</span>
            <span>•</span>
            <span>CEFR B2 – C2 Advanced Mastery</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
