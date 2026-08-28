import React, { useState } from 'react';
import { HelpCircle, Play, CheckCircle2, XCircle, Clock, Sparkles, Plus, Award } from 'lucide-react';
import { LMSQuiz, LMSQuizQuestion, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { apiService } from '../../services/api';

interface QuizEngineProps {
  quizzes: LMSQuiz[];
  language: LanguageCode;
  onQuizCompleted?: (quizId: string, score: number, maxScore: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quizzes,
  language,
  onQuizCompleted
}) => {
  const { t } = useTranslation(language);

  const [activeQuiz, setActiveQuiz] = useState<LMSQuiz | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // AI Quiz Generator modal state
  const [showAIGenModal, setShowAIGenModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('Ethiopian Grade 11 Physics 2D Kinematics and Vectors');
  const [aiGrade, setAiGrade] = useState('Grade 11');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<LMSQuizQuestion[]>([]);

  const handleStartQuiz = (quiz: LMSQuiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    if (currentQIndex < activeQuiz.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // calculate score
      let score = 0;
      activeQuiz.questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctOptionIndex) {
          score += q.points;
        }
      });
      onQuizCompleted?.(activeQuiz.id, score, activeQuiz.totalMarks);
    }
  };

  const handleGenerateAIQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await apiService.generateQuizQuestions(aiTopic, aiGrade, 4);
      if (res.data && res.data.length > 0) {
        setGeneratedQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('quizzesAndExams')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive online assessments, instant scoring, and Gemini AI-powered question generator
          </p>
        </div>

        <button
          onClick={() => setShowAIGenModal(true)}
          className="px-3.5 py-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          ✨ AI Quiz Generator (Gemini)
        </button>
      </div>

      {/* Active Quiz View */}
      {activeQuiz && !quizFinished && (
        <div className="bg-white rounded-2xl border border-purple-200 shadow-md p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Question {currentQIndex + 1} of {activeQuiz.questions.length}
              </span>
              <h3 className="font-bold text-slate-900 text-sm mt-1">{activeQuiz.title}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeQuiz.durationMinutes}:00</span>
            </div>
          </div>

          {/* Question Body */}
          {activeQuiz.questions[currentQIndex] && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {activeQuiz.questions[currentQIndex].question}
              </p>

              <div className="space-y-2">
                {activeQuiz.questions[currentQIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === oIdx;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setActiveQuiz(null)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Quit Quiz
            </button>
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQIndex] === undefined}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-200 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              {currentQIndex === activeQuiz.questions.length - 1 ? 'Finish & Submit Score' : 'Next Question &rarr;'}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Finished Result Screen */}
      {activeQuiz && quizFinished && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 max-w-md mx-auto text-center space-y-4 animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Quiz Completed!</h3>
          <p className="text-xs text-slate-500">Your score has been verified and recorded to your LMS transcript.</p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800">
            Score: {
              activeQuiz.questions.reduce((acc, q, idx) =>
                acc + (selectedAnswers[idx] === q.correctOptionIndex ? q.points : 0), 0
              )
            } / {activeQuiz.totalMarks} Points
          </div>

          <button
            onClick={() => {
              setActiveQuiz(null);
              setQuizFinished(false);
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Back to Quiz List
          </button>
        </div>
      )}

      {/* Quizzes List Cards */}
      {!activeQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-purple-300 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                    Chapter Quiz
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{quiz.durationMinutes} mins</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{quiz.title}</h3>
                <p className="text-xs text-slate-500">
                  {quiz.questions.length} Multiple Choice Questions • Pass: {quiz.passingScore}%
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-purple-900">{quiz.totalMarks} Total Points</span>
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                >
                  <Play className="w-3 h-3" />
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Quiz Generator Modal */}
      {showAIGenModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Gemini AI Ethiopian Quiz Builder</h3>
              </div>
              <button onClick={() => setShowAIGenModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <form onSubmit={handleGenerateAIQuestions} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curriculum Topic / Concept</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethiopian Grade 11 Physics 2D Kinematics and Vectors"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Grade Level</label>
                <input
                  type="text"
                  value={aiGrade}
                  onChange={e => setAiGrade(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {isGenerating ? 'Generating via Gemini AI...' : '✨ Generate 4 Quiz Questions'}
              </button>
            </form>

            {/* Generated Output Preview */}
            {generatedQuestions.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-3 max-h-60 overflow-y-auto">
                <p className="text-xs font-bold text-emerald-800">Generated Questions Preview:</p>
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs space-y-1">
                    <p className="font-bold text-slate-900">{idx + 1}. {q.question}</p>
                    <div className="space-y-0.5 text-slate-600 text-[11px]">
                      {q.options.map((opt, oIdx) => (
                        <p key={oIdx} className={oIdx === q.correctOptionIndex ? 'text-emerald-700 font-bold' : ''}>
                          {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctOptionIndex && '✓ (Correct)'}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
