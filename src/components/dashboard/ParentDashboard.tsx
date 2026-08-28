import React, { useState } from 'react';
import {
  Users,
  Award,
  CalendarCheck,
  DollarSign,
  Download,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight
} from 'lucide-react';
import {
  Parent,
  Student,
  School,
  ExamResult,
  AttendanceRecord,
  PaymentTransaction,
  LanguageCode,
  CalendarType
} from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { generateReportCardPDF, generatePaymentReceiptPDF } from '../../utils/pdfGenerator';
import { INITIAL_SUBJECTS } from '../../data/seedData';

interface ParentDashboardProps {
  parent: Parent;
  students: Student[];
  school: School;
  results: ExamResult[];
  attendance: AttendanceRecord[];
  payments: PaymentTransaction[];
  language: LanguageCode;
  calendarType: CalendarType;
  onNavigate: (tab: string) => void;
  onRecordPayment: (payment: Partial<PaymentTransaction>) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  parent,
  students,
  school,
  results,
  attendance,
  payments,
  language,
  calendarType,
  onNavigate,
  onRecordPayment
}) => {
  const { t } = useTranslation(language);

  // Filter linked children
  const myChildren = students.filter(s =>
    parent.linkedStudentIds ? parent.linkedStudentIds.includes(s.id) : s.parentId === parent.id
  );

  const [selectedChildId, setSelectedChildId] = useState<string>(myChildren[0]?.id || 'student-1');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('4800');
  const [payMethod, setPayMethod] = useState<'telebirr' | 'cbe_birr' | 'bank_transfer'>('telebirr');
  const [payRef, setPayRef] = useState('');

  const currentChild = myChildren.find(c => c.id === selectedChildId) || myChildren[0];
  const childResults = results.filter(r => r.studentId === currentChild?.id);
  const childPayments = payments.filter(p => p.studentId === currentChild?.id);
  const childAttendance = attendance.filter(a => a.studentId === currentChild?.id);

  const handleDownloadChildReport = async () => {
    if (!currentChild) return;
    const reportData = INITIAL_SUBJECTS.map(subj => ({
      subject: subj,
      result: childResults.find(r => r.subjectId === subj.id)
    }));
    await generateReportCardPDF(currentChild, school, reportData);
  };

  const handlePayTuition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChild) return;
    const refNumber = payRef || `TEL-${Date.now().toString().slice(-8)}`;
    onRecordPayment({
      studentId: currentChild.id,
      amount: parseFloat(payAmount),
      paymentMethod: payMethod,
      referenceNumber: refNumber,
      description: `Monthly Tuition Fee for ${currentChild.firstName} ${currentChild.lastName}`
    });
    setShowPayModal(false);
    setPayRef('');
  };

  return (
    <div className="space-y-6">
      {/* Parent Header */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Parent Portal (የወላጅ ፖርታል)
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2">{parent.fullName}</h2>
          <p className="text-xs text-slate-300 mt-1">
            {parent.occupation} • Contact: {parent.phone}
          </p>
        </div>

        {/* Child Switcher Tabs */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
          {myChildren.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedChildId === child.id
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <img
                src={child.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                alt={child.firstName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{child.firstName} ({child.gradeLevelId === 'gl-11-nat' ? 'Grade 11' : 'Grade 9'})</span>
            </button>
          ))}
        </div>
      </div>

      {currentChild && (
        <>
          {/* Selected Child Quick Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Student Record</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-900 mt-2">{currentChild.firstName} {currentChild.lastName}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">{currentChild.admissionNumber}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Academic Standing</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">GPA: 3.88</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Excellent Performance</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">98.5%</p>
              <p className="text-xs text-slate-500 mt-1">No unexcused absences</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Tuition Status</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-emerald-700 mt-2">Paid (Feb)</p>
              <p className="text-xs text-slate-500 mt-1">Next due: Megabit 5</p>
            </div>
          </div>

          {/* Child Performance & Finance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Academic Results & Teacher Notes */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {currentChild.firstName}'s Published Grades & Continuous Assessments
                    </h3>
                    <p className="text-xs text-slate-500">Official term scores reviewed by homeroom faculty</p>
                  </div>
                  <button
                    onClick={handleDownloadChildReport}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Report Card (PDF)
                  </button>
                </div>

                <div className="space-y-3">
                  {childResults.map(res => (
                    <div key={res.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">Grade 11 Physics Midterm</span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                            {res.letterGrade}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Remarks: "{res.remarks}"</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-700">{res.score} / {res.maxScore}</p>
                        <p className="text-[10px] text-slate-500">{res.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Fee Payment & Direct Telebirr Pay */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Tuition & Fee Payment</h3>
                  <p className="text-xs text-slate-500">Direct Telebirr & CBE Payment</p>
                </div>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>

              <button
                onClick={() => setShowPayModal(true)}
                className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Pay Tuition via Telebirr (4,800 ETB)
              </button>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-700">Recent Payment Receipts</p>
                {childPayments.map(p => (
                  <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{(p?.amount || 0).toLocaleString()} ETB</p>
                      <p className="text-[10px] text-slate-500">{p.receiptNumber} • {p.paymentMethod.toUpperCase()}</p>
                    </div>
                    <button
                      onClick={() => generatePaymentReceiptPDF(p, currentChild, school)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Download Official Receipt"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Pay School Tuition Online</h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handlePayTuition} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student</label>
                <input
                  type="text"
                  disabled
                  value={`${currentChild?.firstName} ${currentChild?.lastName} (${currentChild?.admissionNumber})`}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['telebirr', 'cbe_birr', 'bank_transfer'] as const).map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={`p-2 rounded-lg border text-center font-bold capitalize transition-all ${
                        payMethod === m
                          ? 'border-blue-600 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {m === 'telebirr' ? 'Telebirr' : m === 'cbe_birr' ? 'CBE Birr' : 'Bank'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (ETB)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref (Optional / Simulated)</label>
                <input
                  type="text"
                  placeholder="e.g. TEL-90812345"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold"
                >
                  Confirm & Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
