import React, { useState } from 'react';
import { Sparkles, X, Brain, CheckCircle2, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { Student, ExamResult, AttendanceRecord, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { apiService } from '../../services/api';

interface AIAcademicAdvisorProps {
  students: Student[];
  results: ExamResult[];
  attendance: AttendanceRecord[];
  language: LanguageCode;
  onClose: () => void;
}

export const AIAcademicAdvisor: React.FC<AIAcademicAdvisorProps> = ({
  students,
  results,
  attendance,
  language,
  onClose
}) => {
  const { t } = useTranslation(language);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'student-1');
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<{
    academicSummary: string;
    strengths: string[];
    weaknesses: string[];
    pedagogicalRecommendations: string[];
    suggestedRemedialLessons: string[];
  } | null>(null);

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleGenerateInsight = async () => {
    if (!currentStudent) return;
    setIsLoading(true);

    const studentResults = results.filter(r => r.studentId === currentStudent.id);
    const studentAttendance = attendance.filter(a => a.studentId === currentStudent.id);

    try {
      const res = await apiService.getStudentInsight(currentStudent.id, studentResults, studentAttendance);
      if (res.data) {
        setInsight(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col animate-slide-left">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-linear-to-r from-purple-900 to-indigo-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Pedagogical Academic Advisor</h3>
            <p className="text-[10px] text-purple-200">Powered by Gemini AI for Ethiopian Curriculum</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1.5">Select Student to Diagnose</label>
          <select
            value={selectedStudentId}
            onChange={e => {
              setSelectedStudentId(e.target.value);
              setInsight(null);
            }}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateInsight}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Brain className="w-4 h-4" />
          {isLoading ? 'Analyzing Student Academic Data...' : 'Run Gemini AI Performance Diagnostic'}
        </button>

        {insight && (
          <div className="space-y-4 animate-fade-in">
            {/* Academic Summary */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
              <h4 className="font-bold text-purple-900 text-xs">Academic Summary & Profile</h4>
              <p className="text-slate-700 leading-relaxed">{insight.academicSummary}</p>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </div>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                  {insight.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Areas for Improvement</span>
                </div>
                <ul className="space-y-1 text-slate-700 text-[11px] list-disc list-inside">
                  {insight.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pedagogical recommendations */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Pedagogical Recommendations for Teachers</h4>
              <div className="space-y-1.5 text-slate-700">
                {insight.pedagogicalRecommendations.map((r, i) => (
                  <p key={i} className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">👉</span>
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            </div>

            {/* Suggested Remedial Lessons */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
              <h4 className="font-bold text-blue-900 text-xs">Suggested Remedial LMS Lessons</h4>
              <div className="space-y-1.5">
                {insight.suggestedRemedialLessons.map((l, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white border border-blue-100 font-semibold text-slate-800 text-[11px] flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
