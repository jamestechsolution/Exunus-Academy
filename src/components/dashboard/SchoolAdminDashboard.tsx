import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CalendarCheck,
  DollarSign,
  BookOpen,
  UserPlus,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Megaphone,
  BarChart3,
  PieChart as PieIcon,
  Activity,
  Layers,
  Smartphone,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  School,
  Student,
  Teacher,
  AttendanceRecord,
  PaymentTransaction,
  LMSCourse,
  Announcement,
  Exam,
  LanguageCode,
  CalendarType
} from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate, getCurrentAcademicYearLabel } from '../../utils/ethiopianCalendar';

interface SchoolAdminDashboardProps {
  school: School;
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  courses: LMSCourse[];
  exams: Exam[];
  announcements: Announcement[];
  language: LanguageCode;
  calendarType: CalendarType;
  onNavigate: (tab: string) => void;
}

export const SchoolAdminDashboard: React.FC<SchoolAdminDashboardProps> = ({
  school,
  students,
  teachers,
  attendance,
  payments,
  courses,
  exams,
  announcements,
  language,
  calendarType,
  onNavigate
}) => {
  const { t } = useTranslation(language);

  // State for interactive chart filters
  const [attendanceSectionFilter, setAttendanceSectionFilter] = useState('all');
  const [academicStreamFilter, setAcademicStreamFilter] = useState<'all' | 'natural' | 'social'>('all');
  const [feeTimeframe, setFeeTimeframe] = useState<'semester1' | 'semester2' | 'annual'>('annual');

  // Safe defaults
  const safeStudents = students || [];
  const safeTeachers = teachers || [];
  const safeAttendance = attendance || [];
  const safePayments = payments || [];
  const safeExams = exams || [];
  const safeAnnouncements = announcements || [];

  // Aggregated calculations
  const totalStudents = safeStudents.length;
  const totalTeachers = safeTeachers.length;

  // Attendance statistics
  const todayRecords = safeAttendance.filter(a => a.date >= '2025-02-20');
  const presentCount = todayRecords.filter(a => a.status === 'present').length;
  const absentCount = todayRecords.filter(a => a.status === 'absent').length;
  const lateCount = todayRecords.filter(a => a.status === 'late').length;
  const attendanceRate = todayRecords.length > 0 ? Math.round((presentCount / todayRecords.length) * 100) : 96;

  // Fee revenue sum
  const totalRevenue = safePayments.reduce((sum, p) => sum + (p?.amount || 0), 0);

  // 1. Chart Data: Attendance Trend over recent academic days
  const attendanceTrendData = [
    { day: 'Mon (Yek 13)', present: 97.2, absent: 2.1, late: 0.7, headcount: 34 },
    { day: 'Tue (Yek 14)', present: 94.5, absent: 4.2, late: 1.3, headcount: 33 },
    { day: 'Wed (Yek 15)', present: 98.1, absent: 1.4, late: 0.5, headcount: 35 },
    { day: 'Thu (Yek 16)', present: 96.0, absent: 2.8, late: 1.2, headcount: 34 },
    { day: 'Fri (Yek 17)', present: 95.8, absent: 3.1, late: 1.1, headcount: 34 },
    { day: 'Today', present: attendanceRate, absent: Math.max(0, 100 - attendanceRate - 2), late: 2, headcount: presentCount || 34 }
  ];

  // 2. Chart Data: Fee Collection Status (Target vs. Actual in ETB)
  const monthlyFeeData = [
    { month: 'Meskerem', target: 165000, collected: 162000, completion: 98 },
    { month: 'Tikimt', target: 165000, collected: 159000, completion: 96 },
    { month: 'Hidar', target: 165000, collected: 164000, completion: 99 },
    { month: 'Tahsas', target: 170000, collected: 168000, completion: 98 },
    { month: 'Tir', target: 170000, collected: 161000, completion: 94 },
    { month: 'Yekatit (Current)', target: 175000, collected: totalRevenue || 148500, completion: 85 }
  ];

  // Payment method breakdown for donut chart
  const paymentChannelData = [
    { name: 'Telebirr (ቴሌብር)', value: 48, amount: '81,600 ETB', color: '#0284c7' },
    { name: 'CBE Birr (ንግድ ባንክ)', value: 32, amount: '54,400 ETB', color: '#7c3aed' },
    { name: 'Bank Transfer (Awaqi/Awash)', value: 14, amount: '23,800 ETB', color: '#10b981' },
    { name: 'Cash / School Counter', value: 6, amount: '10,200 ETB', color: '#f59e0b' }
  ];

  // 3. Chart Data: Grade Distribution Across Sections
  const gradeDistributionData = [
    { grade: 'A+ (90-100%)', 'Sec 11-Nat-A': 12, 'Sec 11-Soc-B': 8, 'Sec 12-Nat': 14, 'Sec 9-Gen': 9 },
    { grade: 'A (85-89%)', 'Sec 11-Nat-A': 14, 'Sec 11-Soc-B': 11, 'Sec 12-Nat': 12, 'Sec 9-Gen': 13 },
    { grade: 'B+ (75-84%)', 'Sec 11-Nat-A': 6, 'Sec 11-Soc-B': 9, 'Sec 12-Nat': 7, 'Sec 9-Gen': 10 },
    { grade: 'B (70-74%)', 'Sec 11-Nat-A': 2, 'Sec 11-Soc-B': 5, 'Sec 12-Nat': 2, 'Sec 9-Gen': 4 },
    { grade: 'C (50-69%)', 'Sec 11-Nat-A': 1, 'Sec 11-Soc-B': 2, 'Sec 12-Nat': 0, 'Sec 9-Gen': 1 }
  ];

  // Subject performance radar data
  const subjectRadarData = [
    { subject: 'Mathematics', averageScore: 88, benchmark: 75 },
    { subject: 'Physics', averageScore: 84, benchmark: 72 },
    { subject: 'Chemistry', averageScore: 89, benchmark: 74 },
    { subject: 'Biology', averageScore: 92, benchmark: 78 },
    { subject: 'English', averageScore: 86, benchmark: 80 },
    { subject: 'Amharic', averageScore: 91, benchmark: 82 },
    { subject: 'IT / Comp', averageScore: 94, benchmark: 76 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {getCurrentAcademicYearLabel(calendarType)}
            </span>
            <span className="text-xs text-blue-200">
              {formatEduDate(new Date(), calendarType, language)}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2">
            {school.name}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {school.motto || 'Excellence in Education and Character'}
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('students')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + New Student
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all backdrop-blur-xs cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Mark Attendance
          </button>
          <button
            onClick={() => onNavigate('report-cards')}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            Report Cards (PDF)
          </button>
          <button
            onClick={() => onNavigate('finance')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Record Payment
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('totalStudents')}</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</p>
          <div className="flex items-center justify-between text-xs mt-1 text-slate-500">
            <span>Enrolled: {totalStudents}</span>
            <span className="text-emerald-600 font-medium">100% Active</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('teachers')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('totalTeachers')}</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalTeachers}</p>
          <div className="flex items-center justify-between text-xs mt-1 text-slate-500">
            <span>Faculty Staff</span>
            <span className="text-blue-600 font-medium">Full Time</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('attendanceRate')}</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{attendanceRate}%</p>
          <div className="flex items-center justify-between text-xs mt-1 text-slate-500">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3 text-indigo-600" />
              Auto SMS Active
            </span>
            <span className="text-emerald-600 font-medium">High Turnout</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('finance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{t('feeCollection')}</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{(totalRevenue || 0).toLocaleString()} ETB</p>
          <div className="flex items-center justify-between text-xs mt-1 text-slate-500">
            <span>Telebirr & CBE</span>
            <span className="text-emerald-600 font-medium">94.2% Collected</span>
          </div>
        </div>
      </div>

      {/* DATA VISUALIZATION SECTION 1: ATTENDANCE TRENDS & DAILY ROLL-CALL */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Weekly Attendance Trends & Presence Rates</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily percentage of present students vs. absences triggering parent SMS alerts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={attendanceSectionFilter}
              onChange={e => setAttendanceSectionFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">All School Sections</option>
              <option value="sec-11na">Grade 11 Natural Science (A)</option>
              <option value="sec-11sb">Grade 11 Social Science (B)</option>
              <option value="sec-12">Grade 12 University Prep</option>
            </select>

            <button
              onClick={() => onNavigate('attendance')}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Mark Today &rarr;
            </button>
          </div>
        </div>

        {/* Attendance AreaChart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === 'present' ? 'Present Turnout' : name === 'absent' ? 'Absent Rate (SMS Sent)' : 'Late Arrival'
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="present" name="Present Rate (%)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#presentGradient)" />
              <Area type="monotone" dataKey="absent" name="Absenteeism (SMS Dispatched)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#absentGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Insights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
            <span className="text-emerald-900 font-medium">Average Weekly Attendance</span>
            <span className="font-bold text-emerald-800 text-sm">96.3%</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
            <span className="text-rose-900 font-medium">Absence SMS Alerts Dispatched</span>
            <span className="font-bold text-rose-800 text-sm">14 SMS (Delivered)</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <span className="text-blue-900 font-medium">Highest Performing Section</span>
            <span className="font-bold text-blue-800 text-sm">Sec 11-A (98.1%)</span>
          </div>
        </div>
      </div>

      {/* DATA VISUALIZATION SECTION 2: PAYMENT COLLECTION & REVENUE STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Target vs Collected BarChart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Fee Collection & Revenue Target (ETB)</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target vs. Actual Collected by Ethiopian Academic Month
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                Efficiency: 96.8%
              </span>
              <button
                onClick={() => onNavigate('finance')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Finance Ledger &rarr;
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFeeData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} ETB`]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="target" name="Monthly Target (ETB)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Actual Collected (ETB)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Channels Breakdown Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Payment Channels</h3>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Telebirr, CBE Birr & Digital Gateway</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentChannelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {paymentChannelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '11px' }}
                  formatter={(val, name, props) => [`${val}% (${props.payload.amount})`, props.payload.name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {paymentChannelData.map(ch => (
              <div key={ch.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }}></span>
                  <span className="font-medium">{ch.name.split(' ')[0]}</span>
                </div>
                <span className="font-bold text-slate-900">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DATA VISUALIZATION SECTION 3: ACADEMIC GRADE & SUBJECT DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution BarChart across Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Grade Distribution Across Sections</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Letter grades achieved in Semester II</p>
            </div>

            <button
              onClick={() => onNavigate('report-cards')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 cursor-pointer"
            >
              Report Cards &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="grade" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="Sec 11-Nat-A" fill="#2563eb" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Sec 11-Soc-B" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Sec 12-Nat" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance Radar / Skill Benchmark */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Subject Mastery vs. Regional Benchmark</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Average score (%) across core disciplines</p>
            </div>

            <button
              onClick={() => onNavigate('exams')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              Exam Marks &rarr;
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={subjectRadarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569', fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[60, 100]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Radar name="School Average (%)" dataKey="averageScore" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                <Radar name="Regional Target (%)" dataKey="benchmark" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Row: Recent Payments & Academic Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Fee Payments & Telebirr Logs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Fee Collection & Payments</h3>
              <p className="text-xs text-slate-500">Telebirr, CBE Birr & Bank Transactions with Auto-Receipt</p>
            </div>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View All Ledger &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {safePayments.slice(0, 4).map(p => {
              const student = safeStudents.find(s => s.id === p.studentId);
              return (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      p.paymentMethod === 'telebirr'
                        ? 'bg-blue-100 text-blue-800'
                        : p.paymentMethod === 'cbe_birr'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.paymentMethod === 'telebirr' ? 'TELE' : p.paymentMethod === 'cbe_birr' ? 'CBE' : 'BANK'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {student ? `${student.firstName} ${student.lastName}` : 'Enrolled Student'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {p.receiptNumber} • Ref: {p.referenceNumber}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{(p?.amount || 0).toLocaleString()} ETB</p>
                    <p className="text-[10px] text-slate-500">{p.paymentDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Exams & Announcements */}
        <div className="space-y-6">
          {/* Upcoming Exams Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Scheduled Examinations</h3>
              <Award className="w-4 h-4 text-purple-600" />
            </div>

            <div className="space-y-3">
              {exams.map(exam => (
                <div key={exam.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{exam.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold text-[10px]">
                      {exam.weightPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 mt-2 text-[11px]">
                    <span>📅 {exam.examDate}</span>
                    <span>⏱️ {exam.durationMinutes} mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* School Broadcasts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Active School Notices</h3>
              <Megaphone className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 2).map(ann => (
                <div key={ann.id} className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
                  <p className="font-bold text-slate-900">{ann.title}</p>
                  <p className="text-slate-600 text-[11px] line-clamp-2 mt-1">{ann.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2">By {ann.authorName} ({ann.authorRole})</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

