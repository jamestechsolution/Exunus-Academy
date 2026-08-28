import React from 'react';
import {
  BookOpen,
  Award,
  CalendarCheck,
  Clock,
  PlayCircle,
  FileCheck,
  Download,
  Video,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import {
  Student,
  LMSCourse,
  ExamResult,
  LMSAssignment,
  LMSLiveClass,
  LMSCertificate,
  School,
  LanguageCode,
  CalendarType
} from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { generateReportCardPDF, generateCourseCertificatePDF } from '../../utils/pdfGenerator';
import { INITIAL_SUBJECTS } from '../../data/seedData';

interface StudentDashboardProps {
  student: Student;
  school: School;
  courses: LMSCourse[];
  results: ExamResult[];
  assignments: LMSAssignment[];
  liveClasses: LMSLiveClass[];
  certificates: LMSCertificate[];
  language: LanguageCode;
  calendarType: CalendarType;
  onNavigate: (tab: string) => void;
  onSelectCourse?: (course: LMSCourse) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  school,
  courses,
  results,
  assignments,
  liveClasses,
  certificates,
  language,
  calendarType,
  onNavigate,
  onSelectCourse
}) => {
  const { t } = useTranslation(language);

  const handleDownloadReportCard = async () => {
    const reportData = INITIAL_SUBJECTS.map(subj => ({
      subject: subj,
      result: results.find(r => r.subjectId === subj.id)
    }));
    await generateReportCardPDF(student, school, reportData);
  };

  const handleDownloadCert = async () => {
    if (certificates.length > 0) {
      await generateCourseCertificatePDF(certificates[0], school);
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={student.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
            alt={student.firstName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">
                {student.firstName} {student.middleName} {student.lastName}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                {student.admissionNumber}
              </span>
            </div>
            {student.firstNameAm && (
              <p className="text-xs text-blue-200">{student.firstNameAm} {student.middleNameAm} {student.lastNameAm}</p>
            )}
            <p className="text-xs text-slate-300 mt-1">
              Grade 11 Natural Science • Section 11-Nat-A • Academic Year 2017 E.C.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadReportCard}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Term Report Card (PDF)
          </button>
          {certificates.length > 0 && (
            <button
              onClick={handleDownloadCert}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              Certificate (PDF)
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">3.88 / 4.00</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Rank: 2nd in Class</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled LMS Courses</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{courses.length}</p>
          <p className="text-xs text-slate-500 mt-1">Natural Science Stream</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">98.5%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Exemplary Punctuality</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{assignments.length}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Assignments & Quiz</p>
        </div>
      </div>

      {/* Grid: Enrolled Courses & Live Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Courses with Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">My Active LMS Courses</h3>
              <p className="text-xs text-slate-500">Continue interactive lessons and view syllabus</p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              All Courses &rarr;
            </button>
          </div>

          <div className="p-5 space-y-4">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => onSelectCourse?.(course)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Natural Science
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {course.totalModules} Modules • {course.totalLessons} Lessons
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-44 flex flex-col items-end gap-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between w-full text-[11px] text-slate-500 font-medium">
                    <span>Progress</span>
                    <span className="text-blue-700 font-bold">75%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Online Classes & Upcoming Tasks */}
        <div className="space-y-6">
          {/* Live Classes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Upcoming Live Classes</h3>
              <Video className="w-4 h-4 text-emerald-600" />
            </div>

            {liveClasses.map(live => (
              <div key={live.id} className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1.5">
                <p className="font-bold text-slate-900">{live.title}</p>
                <p className="text-slate-600 text-[11px]">{live.topic}</p>
                <div className="flex items-center justify-between text-slate-500 text-[10px] pt-1">
                  <span>📅 {formatEduDate(live.scheduledAt, calendarType, language)}</span>
                  <a
                    href={live.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Join Class &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Assignments */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Pending Assignments</h3>
              <FileCheck className="w-4 h-4 text-purple-600" />
            </div>

            {assignments.map(a => (
              <div
                key={a.id}
                onClick={() => onNavigate('assignments')}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1 hover:border-purple-300 transition-colors cursor-pointer"
              >
                <p className="font-bold text-slate-900">{a.title}</p>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                  <span>Max: {a.maxScore} pts</span>
                  <span className="text-rose-600 font-medium">Due: Mar 4</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
