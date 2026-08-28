import React, { useState } from 'react';
import { Briefcase, Download, DollarSign, Calculator, CheckCircle2 } from 'lucide-react';
import { Teacher, School, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { generateStaffPayslipPDF } from '../../utils/pdfGenerator';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface PayrollManagerProps {
  teachers: Teacher[];
  school: School;
  language: LanguageCode;
  calendarType: CalendarType;
}

export const PayrollManager: React.FC<PayrollManagerProps> = ({
  teachers,
  school,
  language,
  calendarType
}) => {
  const { t } = useTranslation(language);

  // Ethiopian Progressive Income Tax Calculator
  const calculateIncomeTax = (gross: number) => {
    if (gross <= 600) return 0;
    if (gross <= 1650) return gross * 0.10 - 60;
    if (gross <= 3200) return gross * 0.15 - 142.5;
    if (gross <= 5250) return gross * 0.20 - 302.5;
    if (gross <= 7800) return gross * 0.25 - 565;
    if (gross <= 10900) return gross * 0.30 - 955;
    return gross * 0.35 - 1500;
  };

  const payrollData = teachers.map(teacher => {
    const gross = teacher.salary || 18000;
    const tax = Math.round(calculateIncomeTax(gross));
    const pension = Math.round(gross * 0.07); // 7% Employee Pension
    const net = gross - tax - pension;

    return {
      teacher,
      gross,
      tax,
      pension,
      net
    };
  });

  const totalGross = payrollData.reduce((sum, p) => sum + p.gross, 0);
  const totalTax = payrollData.reduce((sum, p) => sum + p.tax, 0);
  const totalNet = payrollData.reduce((sum, p) => sum + p.net, 0);

  const handleDownloadPayslip = async (item: typeof payrollData[0]) => {
    const payslip = {
      id: `ps-${item.teacher.id}`,
      staffId: item.teacher.id,
      month: 'Yekatit / February',
      year: 2017,
      basicSalary: item.gross,
      allowance: 0,
      grossSalary: item.gross,
      incomeTax: item.tax,
      pension: item.pension,
      otherDeductions: 0,
      netSalary: item.net,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'paid' as const
    };

    await generateStaffPayslipPDF(payslip, item.teacher.fullName, school);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('hrAndPayroll')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty compensation, Ethiopian statutory progressive income tax brackets, 7% pension, and payslips
          </p>
        </div>
      </div>

      {/* Tax Brackets Info Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs border border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-300 uppercase tracking-wider">
            Ethiopian Federal Tax Law Statutory Brackets
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
            Auto Calculated
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Personal Income Tax (0% up to 600 ETB, scaling to 35% above 10,900 ETB) + 7% Employee Pension Contribution.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Monthly Gross Payroll</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{(totalGross || 0).toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 mt-1">{teachers.length} Active Faculty</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tax & Pension Withholding</span>
          <p className="text-2xl font-bold text-amber-600 mt-2">{((totalTax || 0) + (totalGross || 0) * 0.07).toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 mt-1">Remitted to ERCA</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Net Disbursed</span>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{(totalNet || 0).toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 mt-1">Via Direct Bank Deposit</p>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Gross Salary</th>
                <th className="py-3 px-4">Income Tax</th>
                <th className="py-3 px-4">Pension (7%)</th>
                <th className="py-3 px-4">Net Salary</th>
                <th className="py-3 px-4 text-right">Official Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrollData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.teacher.fullName}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                    {item.teacher.employeeId}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {(item?.gross || 0).toLocaleString()} ETB
                  </td>
                  <td className="py-3 px-4 text-rose-700 font-semibold">
                    -{(item?.tax || 0).toLocaleString()} ETB
                  </td>
                  <td className="py-3 px-4 text-amber-700 font-semibold">
                    -{(item?.pension || 0).toLocaleString()} ETB
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700 text-sm">
                    {(item?.net || 0).toLocaleString()} ETB
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDownloadPayslip(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Payslip (PDF)</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
