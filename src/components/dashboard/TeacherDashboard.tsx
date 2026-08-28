import React from 'react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Video,
  FileEdit,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import {
  Teacher,
  Section,
  Subject,
  LMSCourse,
  LMSAssignment,
  LMSLiveClass,
  LanguageCode,
  CalendarType
} from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface TeacherDashboardProps {
  teacher: Teacher;
  sections: Section[];
  subjects: Subject[];
  courses: LMSCourse[];
  assignments: LMSAssignment[];
  liveClasses: LMSLiveClass[];
  language: LanguageCode;
  calendarType: CalendarType;
  onNavigate: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  sections,
  subjects,
  courses,
  assignments,
  liveClasses,
  language,
  calendarType,
  onNavigate
}) => {
  const { t } = useTranslation(language);

  const teacherCourses = courses.filter(c => c.teacherId === teacher.id);
  const teacherAssignments = assignments.filter(a => a.teacherId === teacher.id);
  const pendingSubmissions = teacherAssignments.reduce((acc, a) => acc + (a.submissionsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={teacher.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
            alt={teacher.fullName}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{teacher.fullName}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {teacher.employeeId}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">{teacher.qualification}</p>
            <p className="text-xs text-slate-300 mt-1">
              Department: <strong className="text-white">{teacher.department}</strong> • Specialization: {teacher.specialization.join(', ')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Mark Today's Attendance
          </button>
          <button
            onClick={() => onNavigate('exams')}
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            Input Grades
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assigned Sections</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{teacher.assignedSectionIds.length}</p>
          <p className="text-xs text-slate-500 mt-1">Grade 11 & 12 Natural Science</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">LMS Courses Taught</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{teacherCourses.length}</p>
          <p className="text-xs text-slate-500 mt-1">Physics & Calculus</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Submissions to Grade</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileEdit className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{pendingSubmissions}</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Awaiting Review</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Live Video Classes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{liveClasses.length}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Google Meet & Zoom</p>
        </div>
      </div>

      {/* Grid: My Courses and Upcoming Live Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active LMS Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">My Active LMS Curriculum & Lessons</h3>
              <p className="text-xs text-slate-500">Mapped with official Ethiopian Ministry of Education standards</p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Open Course Manager &rarr;
            </button>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teacherCourses.map(course => (
              <div key={course.id} className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-32 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded uppercase">
                      Grade 11 Natural
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{course.totalModules} Modules • {course.totalLessons} Lessons</span>
                    <button
                      onClick={() => onNavigate('courses')}
                      className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      Manage &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Live Online Sessions Launcher */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Scheduled Live Classes</h3>
            <Video className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {liveClasses.map(live => (
              <div key={live.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{live.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                    Upcoming
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{live.topic}</p>
                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1">
                  <span>📅 {formatEduDate(live.scheduledAt, calendarType, language)}</span>
                  <span>⏱️ {live.durationMinutes} min</span>
                </div>
                <a
                  href={live.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Launch Class ({live.platform.replace('_', ' ').toUpperCase()})
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
