import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Save,
  Send,
  Sparkles,
  Smartphone,
  MessageSquare,
  ShieldCheck,
  Filter,
  Check,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { Student, Section, AttendanceRecord, LanguageCode, CalendarType, SMSNotificationLog, School } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { smsNotificationService } from '../../services/smsNotificationService';

interface AttendanceManagerProps {
  students: Student[];
  sections: Section[];
  attendanceRecords: AttendanceRecord[];
  school?: School;
  language: LanguageCode;
  calendarType: CalendarType;
  onSaveAttendance: (date: string, sectionId: string, records: { studentId: string; status: string; remarks?: string }[]) => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({
  students,
  sections,
  attendanceRecords,
  school,
  language,
  calendarType,
  onSaveAttendance
}) => {
  const { t } = useTranslation(language);

  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || 'sec-11na');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [alertSentLog, setAlertSentLog] = useState<string | null>(null);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(true);

  // Default school fallback
  const activeSchool: School = school || {
    id: 'sch-1',
    name: 'Ethiopian National Millennium Academy',
    nameAm: 'የኢትዮጵያ ብሔራዊ ሚሌኒየም አጠቃላይ ሁለተኛ ደረጃ ት/ቤት',
    code: 'MILA-01',
    type: 'secondary',
    curriculumType: 'national',
    region: 'Addis Ababa',
    zone: 'Bole',
    woreda: 'Woreda 03',
    city: 'Addis Ababa',
    address: 'Bole Medhanealem',
    phone: '+251 11 618 5555',
    email: 'admin@ethioschool.edu.et',
    establishedYearEC: 1998,
    principalName: 'Ato Girma Wolde',
    gradingScaleId: 'scale-nat-sec',
    motto: 'Excellence, Integrity, Innovation',
    status: 'active',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    currentAcademicYearId: 'ay-2017',
    defaultCalendar: 'ethiopian',
    defaultLanguage: 'en',
    allowedStreams: ['natural_science', 'social_science'],
    enabledModules: ['sms', 'lms', 'finance', 'library', 'transport']
  };

  // SMS Gateway Simulator Drawer state
  const [isSmsGatewayOpen, setIsSmsGatewayOpen] = useState(false);
  const [smsLogs, setSmsLogs] = useState<SMSNotificationLog[]>(() => smsNotificationService.getLogs());
  const [smsFilterType, setSmsFilterType] = useState<'all' | 'absence' | 'late' | 'report_card'>('all');

  // Test SMS Simulator state
  const [testStudentId, setTestStudentId] = useState(students[0]?.id || 'student-1');
  const [testCustomPhone, setTestCustomPhone] = useState('+251 91 188 9900');
  const [testStatusType, setTestStatusType] = useState<'absent' | 'late'>('absent');
  const [testSuccessNotice, setTestSuccessNotice] = useState<string | null>(null);

  // Section students
  const sectionStudents = students.filter(s => s.sectionId === selectedSectionId);

  // Initial attendance state map for selected section & date
  const [statusMap, setStatusMap] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; remarks: string }>>(() => {
    const map: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; remarks: string }> = {};
    sectionStudents.forEach(s => {
      const existing = attendanceRecords.find(a => a.studentId === s.id && a.date === selectedDate);
      map[s.id] = {
        status: existing?.status || 'present',
        remarks: existing?.remarks || ''
      };
    });
    return map;
  });

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; remarks: string }> = {};
    sectionStudents.forEach(s => {
      updated[s.id] = { status: 'present', remarks: '' };
    });
    setStatusMap(updated);
  };

  const handleSave = () => {
    const payload = sectionStudents.map(s => ({
      studentId: s.id,
      status: statusMap[s.id]?.status || 'present',
      remarks: statusMap[s.id]?.remarks || ''
    }));

    onSaveAttendance(selectedDate, selectedSectionId, payload);
    setSavedSuccess(true);

    const absentStudents = sectionStudents.filter(s => statusMap[s.id]?.status === 'absent');
    const lateStudents = sectionStudents.filter(s => statusMap[s.id]?.status === 'late');

    // Trigger real SMS alerts if automated SMS is toggled ON
    if (autoSmsEnabled) {
      const mockSchool = {
        id: 'sch-1',
        name: 'Ethiopian National Millennium Academy',
        nameAm: 'የኢትዮጵያ ብሔራዊ ሚሌኒየም አጠቃላይ ሁለተኛ ደረጃ ት/ቤት',
        code: 'MILA-01',
        type: 'secondary' as const,
        curriculumType: 'national' as const,
        region: 'Addis Ababa',
        zone: 'Bole',
        woreda: 'Woreda 03',
        city: 'Addis Ababa',
        address: 'Bole Medhanealem',
        phone: '+251 11 618 5555',
        email: 'admin@ethioschool.edu.et',
        establishedYearEC: 1998,
        principalName: 'Ato Girma Wolde',
        gradingScaleId: 'scale-nat-sec',
        motto: 'Excellence, Integrity, Innovation',
        status: 'active' as const
      };

      absentStudents.forEach(s => {
        smsNotificationService.dispatchAbsenceAlert(
          s,
          activeSchool,
          selectedDate,
          statusMap[s.id]?.remarks
        );
      });

      lateStudents.forEach(s => {
        smsNotificationService.dispatchLateAlert(
          s,
          activeSchool,
          selectedDate,
          statusMap[s.id]?.remarks
        );
      });

      // Refresh SMS store
      setSmsLogs(smsNotificationService.getLogs());

      if (absentStudents.length > 0 || lateStudents.length > 0) {
        setAlertSentLog(
          `Automated SMS Gateway (984) sent ${absentStudents.length} absence alert(s) & ${lateStudents.length} late alert(s) to parent phone numbers.`
        );
      } else {
        setAlertSentLog(null);
      }
    } else {
      setAlertSentLog(null);
    }

    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleSendManualTestSms = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === testStudentId) || students[0];
    if (!st) return;

    const stWithCustomPhone = { ...st, parentPhone: testCustomPhone };

    if (testStatusType === 'absent') {
      smsNotificationService.dispatchAbsenceAlert(stWithCustomPhone, activeSchool, selectedDate, 'Simulated absence notification');
    } else {
      smsNotificationService.dispatchLateAlert(stWithCustomPhone, activeSchool, selectedDate, 'Simulated late arrival notification');
    }

    setSmsLogs(smsNotificationService.getLogs());
    setTestSuccessNotice(`Carrier Shortcode 984 delivered SMS to ${testCustomPhone} for ${st.firstName} ${st.lastName}.`);
    setTimeout(() => setTestSuccessNotice(null), 3500);
  };

  const presentCount = sectionStudents.filter(s => (statusMap[s.id]?.status || 'present') === 'present').length;
  const absentCount = sectionStudents.filter(s => statusMap[s.id]?.status === 'absent').length;
  const lateCount = sectionStudents.filter(s => statusMap[s.id]?.status === 'late').length;

  const filteredLogs = smsLogs.filter(log => {
    if (smsFilterType === 'all') return true;
    return log.triggerType === smsFilterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('attendance')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily student roll-call with automated Ethio Telecom parent SMS absence alerts & live carrier dispatch simulator
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* SMS Gateway Logs Button */}
          <button
            onClick={() => {
              setSmsLogs(smsNotificationService.getLogs());
              setIsSmsGatewayOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            Carrier SMS Dispatch Logs ({smsLogs.length})
          </button>

          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Mark All Present
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            Save Attendance
          </button>
        </div>
      </div>

      {/* Filter, Date Selector & Auto-SMS Toggle Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Section</label>
            <select
              value={selectedSectionId}
              onChange={e => setSelectedSectionId(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            >
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name} ({sec.roomNumber})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>

          {/* Automated SMS Toggle */}
          <div className="pt-3 sm:pt-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoSmsEnabled(!autoSmsEnabled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                autoSmsEnabled
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <BellRing className={`w-3.5 h-3.5 ${autoSmsEnabled ? 'text-indigo-600' : 'text-slate-400'}`} />
              Auto SMS on Absence: <span className="underline">{autoSmsEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Present: {presentCount}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            Absent: {absentCount}
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            Late: {lateCount}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-800 font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Attendance saved successfully for {formatEduDate(selectedDate, calendarType, language)}!</span>
          </div>
          {alertSentLog && (
            <span className="text-[11px] bg-emerald-200/70 px-2.5 py-1 rounded-md text-emerald-950 font-medium">
              {alertSentLog}
            </span>
          )}
        </div>
      )}

      {/* Attendance Grid Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Student & Parent Contact</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4 text-center">Attendance Status</th>
                <th className="py-3 px-4">Remarks / Excuse</th>
                <th className="py-3 px-4 text-center">SMS Alert Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sectionStudents.map(student => {
                const current = statusMap[student.id] || { status: 'present', remarks: '' };

                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                          alt={student.firstName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{student.firstName} {student.middleName} {student.lastName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Parent: {student.parentPhone || '+251 91 188 9900'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {student.admissionNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            current.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Present (ተገኝቷል)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            current.status === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent (ቀሪ)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            current.status === 'late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Late (ዘግይቷል)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'excused')}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            current.status === 'excused'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Excused (በፍቃድ)
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional remarks (e.g. medical leave)..."
                        value={current.remarks}
                        onChange={e => {
                          const val = e.target.value;
                          setStatusMap(prev => ({
                            ...prev,
                            [student.id]: {
                              ...prev[student.id],
                              remarks: val
                            }
                          }));
                        }}
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {current.status === 'absent' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <Smartphone className="w-3 h-3 text-rose-600" />
                          SMS Queued ({student.parentPhone || '+251 91 188 9900'})
                        </span>
                      ) : current.status === 'late' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Smartphone className="w-3 h-3 text-amber-600" />
                          Late SMS Ready
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Standard</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SMS Carrier Dispatch Gateway & Simulator Drawer */}
      {isSmsGatewayOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ethio Telecom SMS Gateway Dispatch Logs (Shortcode 984)</h3>
                  <p className="text-[11px] text-slate-500">Automated Parent Absence Alerts & Delivery Receipts</p>
                </div>
              </div>
              <button
                onClick={() => setIsSmsGatewayOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Test SMS Dispatch Simulator */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Instant SMS Gateway Simulator
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Rate: 0.35 ETB / SMS
                </span>
              </div>

              {testSuccessNotice && (
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{testSuccessNotice}</span>
                </div>
              )}

              <form onSubmit={handleSendManualTestSms} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Student</label>
                  <select
                    value={testStudentId}
                    onChange={e => {
                      setTestStudentId(e.target.value);
                      const found = students.find(s => s.id === e.target.value);
                      if (found?.parentPhone) setTestCustomPhone(found.parentPhone);
                    }}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Parent Mobile</label>
                  <input
                    type="text"
                    required
                    value={testCustomPhone}
                    onChange={e => setTestCustomPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Trigger Alert Type</label>
                  <select
                    value={testStatusType}
                    onChange={e => setTestStatusType(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  >
                    <option value="absent">Absence Alert (ቀሪ)</option>
                    <option value="late">Late Arrival Alert (ዘግይቷል)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch SMS
                  </button>
                </div>
              </form>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSmsFilterType('all')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    smsFilterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Logs ({smsLogs.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSmsFilterType('absence')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    smsFilterType === 'absence' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Absence Alerts
                </button>
                <button
                  type="button"
                  onClick={() => setSmsFilterType('late')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    smsFilterType === 'late' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Late Alerts
                </button>
                <button
                  type="button"
                  onClick={() => setSmsFilterType('report_card')}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    smsFilterType === 'report_card' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Report Cards
                </button>
              </div>

              <span className="text-[11px] text-slate-400">
                Connected: Shortcode 984
              </span>
            </div>

            {/* Scrollable Logs List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No SMS logs found for this filter.</p>
                </div>
              ) : (
                filteredLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.triggerType === 'absence'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : log.triggerType === 'late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          {log.triggerType.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-slate-900">{log.studentName} ({log.studentAdmissionNo})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Delivered</span>
                      </div>
                    </div>

                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg font-sans text-[11px] leading-relaxed border border-slate-100">
                      {log.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <span>To: <strong>{log.recipientPhone}</strong> ({log.recipientName})</span>
                      <span>Carrier: <strong>{log.carrier}</strong></span>
                      <span>Dispatched: {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'Just now'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSmsGatewayOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Gateway Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

