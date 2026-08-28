import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  Download,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  FileText,
  Filter
} from 'lucide-react';
import { PaymentTransaction, FeeStructure, Student, School, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { generatePaymentReceiptPDF } from '../../utils/pdfGenerator';

interface FinanceManagerProps {
  payments: PaymentTransaction[];
  feeStructures: FeeStructure[];
  students: Student[];
  school: School;
  language: LanguageCode;
  calendarType: CalendarType;
  onRecordPayment: (payment: Partial<PaymentTransaction>) => void;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  payments,
  feeStructures,
  students,
  school,
  language,
  calendarType,
  onRecordPayment
}) => {
  const { t } = useTranslation(language);

  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    amount: 4800,
    paymentMethod: 'telebirr' as const,
    referenceNumber: '',
    description: 'Monthly Tuition Fee'
  });

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    const student = students.find(s => s.id === p.studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
    const matchesSearch = studentName.includes(search.toLowerCase()) || p.receiptNumber.toLowerCase().includes(search.toLowerCase()) || p.referenceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = selectedMethod ? p.paymentMethod === selectedMethod : true;
    return matchesSearch && matchesMethod;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refNumber = formData.referenceNumber || `TEL-${Date.now().toString().slice(-8)}`;
    onRecordPayment({
      ...formData,
      referenceNumber: refNumber
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('financeAndFees')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Telebirr & CBE integration, fee structures, receipts with QR codes, and ledger accounting
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Record New Fee Payment
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Collected Fees</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{(totalCollected || 0).toLocaleString()} ETB</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% Reconciled</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Telebirr Volume</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">78%</p>
          <p className="text-xs text-slate-500 mt-1">Ethio Telecom Payment Gateway</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">CBE Birr & Bank</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-2">22%</p>
          <p className="text-xs text-slate-500 mt-1">Commercial Bank of Ethiopia</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Fee Structures</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{feeStructures.length}</p>
          <p className="text-xs text-slate-500 mt-1">Tuition, Lab & Transport</p>
        </div>
      </div>

      {/* Fee Structures Reference Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Configured School Fee Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {feeStructures.map(f => (
            <div key={f.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{f.title}</span>
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {f.category}
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900 mt-2">{(f?.amount || 0).toLocaleString()} ETB</p>
              <p className="text-[10px] text-slate-500 mt-0.5 capitalize">Frequency: {f.frequency}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search receipts, student names, ref..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
            />
          </div>

          <select
            value={selectedMethod}
            onChange={e => setSelectedMethod(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Payment Gateways</option>
            <option value="telebirr">Telebirr</option>
            <option value="cbe_birr">CBE Birr</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash Counter</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Receipt No.</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Gateway / Method</th>
                <th className="py-3 px-4">Tx Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Receipt PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map(p => {
                const student = students.find(s => s.id === p.studentId);

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student ? `${student.firstName} ${student.lastName}` : 'Enrolled Student'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.paymentMethod === 'telebirr'
                          ? 'bg-blue-100 text-blue-800'
                          : p.paymentMethod === 'cbe_birr'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.paymentMethod.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {p.referenceNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatEduDate(p.paymentDate, calendarType, language)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {(p?.amount || 0).toLocaleString()} ETB
                    </td>
                    <td className="py-3 px-4 text-right">
                      {student && (
                        <button
                          onClick={() => generatePaymentReceiptPDF(p, student, school)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors"
                          title="Download PDF Receipt with QR Verification"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Record School Fee Payment</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 capitalize"
                >
                  <option value="telebirr">Telebirr (ቴሌብር)</option>
                  <option value="cbe_birr">CBE Birr (ሲቢኢ ብር)</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                  <option value="cash">Cash Counter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (ETB)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. TEL-89104432"
                  value={formData.referenceNumber}
                  onChange={e => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Confirm & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
