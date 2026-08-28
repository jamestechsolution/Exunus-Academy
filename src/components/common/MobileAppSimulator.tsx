import React, { useState } from 'react';
import {
  Smartphone,
  X,
  Home,
  BookOpen,
  CalendarCheck,
  CreditCard,
  User,
  Award,
  Bell,
  Download,
  Wifi,
  Battery
} from 'lucide-react';
import { Student, School, LMSCourse, ExamResult, PaymentTransaction, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { generateReportCardPDF } from '../../utils/pdfGenerator';
import { INITIAL_SUBJECTS } from '../../data/seedData';

interface MobileAppSimulatorProps {
  student: Student;
  school: School;
  courses: LMSCourse[];
  results: ExamResult[];
  payments: PaymentTransaction[];
  language: LanguageCode;
  calendarType: CalendarType;
  onClose: () => void;
}

export const MobileAppSimulator: React.FC<MobileAppSimulatorProps> = ({
  student,
  school,
  courses,
  results,
  payments,
  language,
  calendarType,
  onClose
}) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'attendance' | 'fees'>('home');

  const handleDownloadReport = async () => {
    const reportData = INITIAL_SUBJECTS.map(subj => ({
      subject: subj,
      result: results.find(r => r.subjectId === subj.id)
    }));
    await generateReportCardPDF(student, school, reportData);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 p-4 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
      {/* Mobile Device Mockup Frame */}
      <div className="w-[360px] h-[720px] bg-slate-950 rounded-[45px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col relative overflow-hidden text-slate-900 select-none animate-scale-in">
        {/* Device Notch & Status Bar */}
        <div className="h-6 w-full flex items-center justify-between px-6 text-white text-[10px] font-semibold pt-1">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto"></div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 bg-slate-50 rounded-[35px] overflow-hidden flex flex-col relative mt-1">
          {/* Mobile App Header */}
          <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={student.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                alt={student.firstName}
                className="w-9 h-9 rounded-full object-cover border border-white/40"
              />
              <div>
                <p className="text-xs font-bold leading-tight">{student.firstName} {student.lastName}</p>
                <p className="text-[10px] text-blue-200">{school.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Main Mobile Screen Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {activeTab === 'home' && (
              <div className="space-y-3">
                {/* GPA & Quick Stats Card */}
                <div className="p-4 rounded-2xl bg-linear-to-tr from-blue-700 to-indigo-600 text-white space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-blue-200">Term Standing</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">2017 E.C.</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-2xl font-black">3.88</p>
                      <p className="text-[10px] text-blue-200">Cumulative GPA (A+)</p>
                    </div>
                    <span className="text-xs font-bold bg-white text-blue-900 px-2.5 py-1 rounded-lg">
                      Rank #2
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Term Report Card
                </button>

                {/* Enrolled Courses Preview */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800">My LMS Courses</span>
                  {courses.slice(0, 2).map(c => (
                    <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                      <img src={c.thumbnail} alt={c.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-xs truncate">{c.title}</p>
                        <p className="text-[10px] text-slate-500">{c.totalLessons} Lessons • 75% Done</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800">All Registered LMS Courses</span>
                {courses.map(c => (
                  <div key={c.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-24 rounded-lg object-cover" />
                    <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-3 text-center">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700">Attendance Roll Call</span>
                  <p className="text-3xl font-black text-emerald-600">98.5%</p>
                  <p className="text-[11px] text-slate-500">Total days present: 48 / 49</p>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-600 text-white space-y-2">
                  <p className="text-[10px] uppercase font-bold text-emerald-200">Tuition Status</p>
                  <p className="text-xl font-bold">Paid for Yekatit (Feb)</p>
                  <p className="text-[11px] text-emerald-100">Next payment due on Megabit 5</p>
                </div>

                <span className="text-xs font-bold text-slate-800">Recent Receipts</span>
                {payments.map(p => (
                  <div key={p.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{(p?.amount || 0).toLocaleString()} ETB</p>
                      <p className="text-[10px] text-slate-500">{p.receiptNumber} • {p.paymentMethod.toUpperCase()}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      SUCCESS
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="h-14 bg-white border-t border-slate-200 px-4 flex items-center justify-around">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'courses' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Courses</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'attendance' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Attendance</span>
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'fees' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-[9px] font-semibold">Telebirr</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
