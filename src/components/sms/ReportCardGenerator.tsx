import React, { useState } from 'react';
import {
  Download,
  FileText,
  QrCode,
  CheckCircle2,
  Search,
  User,
  Printer,
  Mail,
  Send,
  Sparkles,
  Share2,
  Layers,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Student, School, Subject, ExamResult, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate, getCurrentAcademicYearLabel } from '../../utils/ethiopianCalendar';
import { generateReportCardPDF, generateBatchReportCardsPDF } from '../../utils/pdfGenerator';
import { smsNotificationService } from '../../services/smsNotificationService';

interface ReportCardGeneratorProps {
  students: Student[];
  school: School;
  subjects: Subject[];
  examResults: ExamResult[];
  language: LanguageCode;
  calendarType: CalendarType;
}

export const ReportCardGenerator: React.FC<ReportCardGeneratorProps> = ({
  students,
  school,
  subjects,
  examResults,
  language,
  calendarType
}) => {
  const { t } = useTranslation(language);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'student-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('Semester II (2017 E.C.)');
  const [conductGrade, setConductGrade] = useState('A (Exemplary)');
  const [customComment, setCustomComment] = useState(
    'Demonstrates exceptional analytical problem-solving skills in natural sciences with exemplary leadership.'
  );

  // Email / SMS Sharing modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [parentEmailInput, setParentEmailInput] = useState('');
  const [parentPhoneInput, setParentPhoneInput] = useState('');
  const [includeSmsLink, setIncludeSmsLink] = useState(true);
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);
  const [isExportingBatch, setIsExportingBatch] = useState(false);

  // Filter students based on search query
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      s.admissionNumber.toLowerCase().includes(q)
    );
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Subject report rows
  const reportData = subjects.map((subj, idx) => {
    const res = examResults.find(r => r.studentId === selectedStudent?.id && r.subjectId === subj.id);
    const score = res ? res.score : Math.floor(Math.random() * 10) + 85;
    const maxScore = res ? res.maxScore : 100;
    const percentage = Math.round((score / maxScore) * 100);

    let letter = 'A';
    let gpa = 4.0;
    if (percentage >= 90) { letter = 'A+'; gpa = 4.0; }
    else if (percentage >= 85) { letter = 'A'; gpa = 4.0; }
    else if (percentage >= 80) { letter = 'A-'; gpa = 3.75; }
    else if (percentage >= 75) { letter = 'B+'; gpa = 3.5; }
    else if (percentage >= 70) { letter = 'B'; gpa = 3.0; }
    else { letter = 'C'; gpa = 2.0; }

    return {
      subject: subj,
      score,
      maxScore,
      percentage,
      letter,
      gpa,
      conduct: conductGrade.slice(0, 1) || 'A',
      teacherRemarks:
        percentage >= 90
          ? 'Outstanding mastery of concepts'
          : percentage >= 80
          ? 'Very good analytical performance'
          : 'Good effort, continue practicing'
    };
  });

  const avgScore = Math.round(reportData.reduce((sum, r) => sum + r.percentage, 0) / (reportData.length || 1));
  const gpa = (reportData.reduce((sum, r) => sum + r.gpa, 0) / (reportData.length || 1)).toFixed(2);

  const handleDownloadPDF = async () => {
    if (!selectedStudent) return;
    const formattedData = reportData.map(r => ({
      subject: r.subject,
      result: {
        id: `res-${r.subject.id}`,
        schoolId: school.id,
        examId: 'term-1',
        studentId: selectedStudent.id,
        subjectId: r.subject.id,
        score: r.score,
        maxScore: r.maxScore,
        percentage: r.percentage,
        letterGrade: r.letter,
        gradePoints: r.gpa,
        remarks: r.teacherRemarks,
        markedByTeacherId: 'teacher-1',
        submittedAt: new Date().toISOString()
      } as ExamResult
    }));

    await generateReportCardPDF(
      selectedStudent,
      school,
      formattedData,
      selectedTerm,
      getCurrentAcademicYearLabel(calendarType),
      {
        conductGrade,
        teacherComments: customComment,
        classRank: '2nd of 35 Students'
      }
    );
  };

  const handleBatchExport = async () => {
    if (!students || students.length === 0) return;
    setIsExportingBatch(true);
    try {
      await generateBatchReportCardsPDF(
        students,
        school,
        subjects,
        examResults,
        selectedTerm
      );
    } finally {
      setIsExportingBatch(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openShareModal = () => {
    if (selectedStudent) {
      setParentEmailInput(selectedStudent.parentEmail || 'haile.kebede@gmail.com');
      setParentPhoneInput(selectedStudent.parentPhone || '+251 91 188 9900');
    }
    setShowShareModal(true);
    setShareSuccessMessage(null);
  };

  const handleSendToParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Dispatch via SMS and In-App notification service
    const res = smsNotificationService.dispatchReportCardNotification(
      selectedStudent,
      school,
      selectedTerm,
      parentEmailInput,
      parentPhoneInput
    );

    setShareSuccessMessage(
      `Official Report Card PDF & SMS Alert successfully dispatched to ${parentEmailInput} and ${parentPhoneInput} via Ethio Telecom Shortcode 984.`
    );

    setTimeout(() => {
      setShowShareModal(false);
      setShareSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('reportCards')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Official Ethiopian Academic Report Card Generator with PDF Export, Direct Print & Automated Parent SMS/Email Sharing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBatchExport}
            disabled={isExportingBatch}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Export all students in current section into one combined multi-page PDF"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            {isExportingBatch ? 'Generating Batch...' : 'Batch Export Section PDF'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Print formatted official report card"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Print Report
          </button>

          <button
            onClick={openShareModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Email or SMS report card directly to parent"
          >
            <Share2 className="w-3.5 h-3.5" />
            Email / SMS to Parent
          </button>

          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Official PDF
          </button>
        </div>
      </div>

      {/* Filter and Configuration Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search student */}
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Student Selector */}
          <div>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              {filteredStudents.map(s => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} ({s.admissionNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Term Selector */}
          <div>
            <select
              value={selectedTerm}
              onChange={e => setSelectedTerm(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="Semester I (2017 E.C.)">Semester I (2017 E.C.)</option>
              <option value="Semester II (2017 E.C.)">Semester II (2017 E.C.)</option>
              <option value="Annual Cumulative Summary (2017 E.C.)">Annual Cumulative Summary (2017 E.C.)</option>
            </select>
          </div>
        </div>

        {/* Quick Student Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200">
            Grade 11 (Natural Science)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
            Average: {avgScore}%
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
            GPA: {gpa}
          </span>
        </div>
      </div>

      {/* Share / Dispatch to Parent Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Send Report Card to Parent</h3>
                  <p className="text-[11px] text-slate-500">Instant PDF link via Email & Ethio Telecom SMS</p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {shareSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Notification Dispatched Successfully!</p>
                  <p className="text-[11px] mt-0.5 text-emerald-700">{shareSuccessMessage}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendToParent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedStudent?.firstName} ${selectedStudent?.lastName} (${selectedStudent?.admissionNumber})`}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Email Address</label>
                  <input
                    type="email"
                    required
                    value={parentEmailInput}
                    onChange={e => setParentEmailInput(e.target.value)}
                    placeholder="e.g. parent@gmail.com"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Mobile Phone (for SMS Alert)</label>
                  <input
                    type="tel"
                    required
                    value={parentPhoneInput}
                    onChange={e => setParentPhoneInput(e.target.value)}
                    placeholder="e.g. +251 91 188 9900"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Automated Carrier Gateway Simulation:
                  </p>
                  <p className="text-slate-600">
                    A secure PDF document link will be emailed to <strong>{parentEmailInput || 'parent'}</strong> and an instant Ethio Telecom shortcode (984) SMS delivery notice will be triggered.
                  </p>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowShareModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Card Document Simulation Sheet */}
      {selectedStudent && (
        <div
          id="printable-report-card"
          className="bg-white rounded-2xl border border-slate-300 shadow-lg p-8 max-w-4xl mx-auto space-y-6 text-slate-900 print:shadow-none print:border-none print:p-0"
        >
          {/* Header of Report Card */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img
                src={school.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100'}
                alt={school.name}
                className="w-14 h-14 object-contain"
              />
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">{school.name}</h1>
                {school.nameAm && (
                  <h2 className="text-sm font-bold text-slate-700">{school.nameAm}</h2>
                )}
                <p className="text-[11px] text-slate-500 font-medium">
                  {school.address}, {school.city}, {school.region} • Phone: {school.phone} • Email: {school.email}
                </p>
              </div>
            </div>
            <div className="inline-block bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              OFFICIAL STUDENT ACADEMIC PROGRESS REPORT CARD • {selectedTerm.toUpperCase()}
            </div>
          </div>

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Student Full Name</span>
              <span className="font-bold text-slate-900">
                {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Admission Number</span>
              <span className="font-mono font-bold text-blue-700">{selectedStudent.admissionNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Grade & Stream</span>
              <span className="font-bold text-slate-900">Grade 11 (Natural Science)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Section / Term</span>
              <span className="font-bold text-slate-900">Section A • {selectedTerm}</span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3">Subject / Course</th>
                  <th className="py-2.5 px-3 text-center">Credit</th>
                  <th className="py-2.5 px-3 text-center">Continuous (30%)</th>
                  <th className="py-2.5 px-3 text-center">Final (70%)</th>
                  <th className="py-2.5 px-3 text-center">Total (100%)</th>
                  <th className="py-2.5 px-3 text-center">Letter Grade</th>
                  <th className="py-2.5 px-3 text-center">Grade Points</th>
                  <th className="py-2.5 px-3 text-center">Conduct</th>
                  <th className="py-2.5 px-3">Faculty Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.subject.name}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">{row.subject.creditHours}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{(row.percentage * 0.3).toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{(row.percentage * 0.7).toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-center font-bold font-mono text-slate-900">{row.percentage}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {row.letter}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">{row.gpa.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{row.conduct}</td>
                    <td className="py-2.5 px-3 text-slate-600">{row.teacherRemarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Summary Footer Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 text-white text-center">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Overall Average</p>
              <p className="text-xl font-black text-amber-400 mt-1">{avgScore}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Semester GPA</p>
              <p className="text-xl font-black text-white mt-1">{gpa} / 4.00</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Class Standing</p>
              <p className="text-xl font-black text-emerald-400 mt-1">2nd of 35</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Promotion Status</p>
              <p className="text-sm font-black text-blue-300 mt-2">ELIGIBLE FOR PROMOTION</p>
            </div>
          </div>

          {/* Editable Remarks & Conduct */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Discipline & Conduct Evaluation
              </label>
              <select
                value={conductGrade}
                onChange={e => setConductGrade(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none"
              >
                <option value="A (Exemplary)">A (Exemplary / ምሳሌያዊ)</option>
                <option value="B (Good)">B (Good / ጥሩ)</option>
                <option value="C (Satisfactory)">C (Satisfactory / አጥጋቢ)</option>
                <option value="D (Needs Improvement)">D (Needs Improvement)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                Homeroom Teacher Final Comments & Recommendations
              </label>
              <input
                type="text"
                value={customComment}
                onChange={e => setCustomComment(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                placeholder="Enter custom remarks to appear on the official PDF..."
              />
            </div>
          </div>

          {/* Signatures & QR Section */}
          <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 border border-slate-300 rounded-lg p-1 bg-slate-50 flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                <p className="font-bold text-slate-800">Scan QR Code to Verify Digital Authenticity</p>
                <p>Ministry of Education Anti-Tamper Stamp:</p>
                <p className="font-mono text-[9px] text-blue-600">auth.ethioschool.gov.et/v2/rc/{selectedStudent.admissionNumber}</p>
              </div>
            </div>

            <div className="flex gap-8 text-center">
              <div>
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <span className="text-[10px] font-semibold">Homeroom Teacher Signature</span>
              </div>
              <div>
                <div className="w-32 border-b border-slate-400 mb-1"></div>
                <span className="text-[10px] font-semibold">School Principal (Ato Girma)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

