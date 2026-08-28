import React, { useState } from 'react';
import { FileEdit, Plus, Upload, CheckCircle2, Clock, Award, FileText } from 'lucide-react';
import { LMSAssignment, LMSSubmission, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface AssignmentsManagerProps {
  assignments: LMSAssignment[];
  submissions: LMSSubmission[];
  language: LanguageCode;
  calendarType: CalendarType;
  onCreateAssignment?: (data: Partial<LMSAssignment>) => void;
  onSubmitAssignment?: (assignmentId: string, content: string) => void;
}

export const AssignmentsManager: React.FC<AssignmentsManagerProps> = ({
  assignments,
  submissions,
  language,
  calendarType,
  onCreateAssignment,
  onSubmitAssignment
}) => {
  const { t } = useTranslation(language);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const activeAssignment = assignments.find(a => a.id === selectedAssignmentId);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId) return;
    onSubmitAssignment?.(selectedAssignmentId, submissionText);
    setShowSubmitModal(false);
    setSubmissionText('');
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('assignments')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Homework assignments, student file submissions, teacher grading, and feedback loops
          </p>
        </div>
      </div>

      {submittedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Assignment solution submitted successfully for review!
        </div>
      )}

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map(ass => {
          const mySub = submissions.find(s => s.assignmentId === ass.id);

          return (
            <div key={ass.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 hover:border-purple-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{ass.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Max Score: {ass.maxScore} points</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Due: {formatEduDate(ass.dueDate, calendarType, language)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {ass.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                {mySub ? (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      Grade: {mySub.score !== undefined ? `${mySub.score} / ${ass.maxScore}` : 'Submitted (Under Review)'}
                    </span>
                    {mySub.feedback && (
                      <span className="text-slate-500 italic">"{mySub.feedback}"</span>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedAssignmentId(ass.id);
                      setShowSubmitModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Submit Homework
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && activeAssignment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Submit Solution for: {activeAssignment.title}</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Answers / Calculations</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Type your complete solution, mathematical formulas, and analysis..."
                  value={submissionText}
                  onChange={e => setSubmissionText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                ></textarea>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Upload & Turn In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
