import React, { useState } from 'react';
import { UserPlus, CheckCircle2, Clock, XCircle, Search, Mail, Phone } from 'lucide-react';
import { AdmissionApplication, GradeLevel, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface AdmissionsManagerProps {
  applications: AdmissionApplication[];
  gradeLevels: GradeLevel[];
  language: LanguageCode;
  calendarType: CalendarType;
  onUpdateStatus?: (appId: string, status: AdmissionApplication['status']) => void;
}

export const AdmissionsManager: React.FC<AdmissionsManagerProps> = ({
  applications,
  gradeLevels,
  language,
  calendarType,
  onUpdateStatus
}) => {
  const { t } = useTranslation(language);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filtered = applications.filter(a => {
    const name = `${a.applicantFirstName} ${a.applicantLastName}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase()) || a.parentPhone.includes(search);
    const matchesStatus = selectedStatus ? a.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('admissions')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Online student application intake, entrance interview screening, and enrollment conversion
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicants, parents, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
        >
          <option value="">All Application Stages</option>
          <option value="submitted">Submitted / Under Review</option>
          <option value="under_review">Document Screening</option>
          <option value="interview_scheduled">Interview Scheduled</option>
          <option value="accepted">Accepted</option>
          <option value="enrolled">Enrolled as Student</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Cards / List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Applying For</th>
                <th className="py-3 px-4">Previous School</th>
                <th className="py-3 px-4">Parent / Phone</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(app => {
                const grade = gradeLevels.find(g => g.id === app.gradeLevelId);

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{app.applicantFirstName} {app.applicantMiddleName} {app.applicantLastName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{app.gender} • DOB: {app.dateOfBirth}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-800">
                      {grade?.name || 'Grade 9'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.previousSchool || 'Addis Primary'}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{app.parentName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{app.parentPhone}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatEduDate(app.applicationDate, calendarType, language)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'enrolled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'interview_scheduled'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onUpdateStatus?.(app.id, 'accepted')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => onUpdateStatus?.(app.id, 'enrolled')}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors cursor-pointer"
                        >
                          Enroll
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
