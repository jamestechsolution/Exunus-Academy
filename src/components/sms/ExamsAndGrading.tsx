import React, { useState } from 'react';
import { Award, Plus, CheckCircle2, Lock, Unlock, FileText, Download, BarChart2 } from 'lucide-react';
import { Exam, ExamResult, Student, Subject, Section, School, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { calculateEthiopianGrade, formatEduDate } from '../../utils/ethiopianCalendar';
import { generateReportCardPDF } from '../../utils/pdfGenerator';
import { INITIAL_SUBJECTS } from '../../data/seedData';

interface ExamsAndGradingProps {
  exams: Exam[];
  examResults: ExamResult[];
  students: Student[];
  subjects: Subject[];
  sections: Section[];
  school: School;
  language: LanguageCode;
  calendarType: CalendarType;
  onSaveMarks: (examId: string, subjectId: string, marks: { studentId: string; score: number; remarks?: string }[]) => void;
  onCreateExam: (exam: Partial<Exam>) => void;
}

export const ExamsAndGrading: React.FC<ExamsAndGradingProps> = ({
  exams,
  examResults,
  students,
  subjects,
  sections,
  school,
  language,
  calendarType,
  onSaveMarks,
  onCreateExam
}) => {
  const { t } = useTranslation(language);

  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || 'exam-mid-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'subj-phys-11');
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || 'sec-11na');
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeExam = exams.find(e => e.id === selectedExamId) || exams[0];
  const sectionStudents = students.filter(s => s.sectionId === selectedSectionId);

  // Marks map
  const [marksMap, setMarksMap] = useState<Record<string, { score: number; remarks: string }>>(() => {
    const map: Record<string, { score: number; remarks: string }> = {};
    sectionStudents.forEach(s => {
      const existing = examResults.find(r => r.examId === selectedExamId && r.subjectId === selectedSubjectId && r.studentId === s.id);
      map[s.id] = {
        score: existing ? existing.score : (activeExam?.maxMarks ? activeExam.maxMarks * 0.85 : 25),
        remarks: existing?.remarks || 'Good comprehension'
      };
    });
    return map;
  });

  const handleScoreChange = (studentId: string, score: number) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        score
      }
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setMarksMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSave = () => {
    const payload = sectionStudents.map(s => ({
      studentId: s.id,
      score: marksMap[s.id]?.score || 0,
      remarks: marksMap[s.id]?.remarks || ''
    }));

    onSaveMarks(selectedExamId, selectedSubjectId, payload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('examsAndAssessments')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous assessments, Ethiopian National scale grading (A+ to F), rank generation, and transcript publishing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddExamModal(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + Schedule New Exam
          </button>
        </div>
      </div>

      {/* Grade Scale Reference Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ethiopian Ministry of Education (MoE) Standard Secondary Grading Scale
          </span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
            Direct MoE Conversion
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2 text-center text-xs">
          {[
            { g: 'A+', r: '90-100%', p: '4.00' },
            { g: 'A', r: '85-89%', p: '4.00' },
            { g: 'A-', r: '80-84%', p: '3.75' },
            { g: 'B+', r: '75-79%', p: '3.50' },
            { g: 'B', r: '70-74%', p: '3.00' },
            { g: 'B-', r: '65-69%', p: '2.75' },
            { g: 'C+', r: '60-64%', p: '2.50' },
            { g: 'C', r: '50-59%', p: '2.00' },
            { g: 'D', r: '40-49%', p: '1.00' },
            { g: 'F', r: '<40%', p: '0.00' }
          ].map(scale => (
            <div key={scale.g} className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <span className="font-black text-amber-400 block text-sm">{scale.g}</span>
              <span className="text-[10px] text-slate-300 block">{scale.r}</span>
              <span className="text-[9px] text-slate-400 font-mono">GP: {scale.p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Exam Event</label>
            <select
              value={selectedExamId}
              onChange={e => setSelectedExamId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              {exams.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.title} (Max: {ex.maxMarks} pts, {ex.weightPercentage}%)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Section</label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Save & Calculate Ranks
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Grades saved and published successfully to student transcripts!</span>
        </div>
      )}

      {/* Marks Input Spreadsheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4">Score (Max: {activeExam?.maxMarks || 30})</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Letter Grade</th>
                <th className="py-3 px-4">Grade Points</th>
                <th className="py-3 px-4">Evaluator Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sectionStudents.map(student => {
                const currentScore = marksMap[student.id]?.score || 0;
                const maxMarks = activeExam?.maxMarks || 30;
                const percentage = Math.round((currentScore / maxMarks) * 100);
                const gradeInfo = calculateEthiopianGrade(percentage);

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {student.firstName} {student.middleName} {student.lastName}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={maxMarks}
                          value={currentScore}
                          onChange={e => handleScoreChange(student.id, parseFloat(e.target.value) || 0)}
                          className="w-20 p-1.5 bg-slate-50 border border-slate-300 rounded-md font-bold text-slate-900 text-center focus:bg-white focus:ring-1 focus:ring-blue-600"
                        />
                        <span className="text-slate-400 font-medium">/ {maxMarks}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md font-bold text-xs ${
                        gradeInfo.grade.startsWith('A')
                          ? 'bg-emerald-100 text-emerald-800'
                          : gradeInfo.grade.startsWith('B')
                          ? 'bg-blue-100 text-blue-800'
                          : gradeInfo.grade.startsWith('C')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {gradeInfo.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {gradeInfo.points.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={marksMap[student.id]?.remarks || ''}
                        onChange={e => handleRemarksChange(student.id, e.target.value)}
                        placeholder="Remarks..."
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
