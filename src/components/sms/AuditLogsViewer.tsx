import React from 'react';
import { ShieldAlert, ShieldCheck, UserCheck, Clock, FileText } from 'lucide-react';
import { AuditLog, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface AuditLogsViewerProps {
  logs: AuditLog[];
  language: LanguageCode;
  calendarType: CalendarType;
}

export const AuditLogsViewer: React.FC<AuditLogsViewerProps> = ({
  logs,
  language,
  calendarType
}) => {
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('auditLogs')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable platform audit trail, user security actions, and role modification history
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {formatEduDate(log.timestamp, calendarType, language)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {log.ipAddress}
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
