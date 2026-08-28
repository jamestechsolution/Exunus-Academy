import React, { useState } from 'react';
import { Clock, Calendar, Plus, Layers, User, MapPin } from 'lucide-react';
import { TimetableSlot, Section, Subject, Teacher, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface TimetableSchedulerProps {
  slots: TimetableSlot[];
  sections: Section[];
  subjects: Subject[];
  teachers: Teacher[];
  language: LanguageCode;
  onAddSlot: (slot: Partial<TimetableSlot>) => void;
}

export const TimetableScheduler: React.FC<TimetableSchedulerProps> = ({
  slots,
  sections,
  subjects,
  teachers,
  language,
  onAddSlot
}) => {
  const { t } = useTranslation(language);
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || 'sec-11na');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '08:30 - 09:15' },
    { period: 2, time: '09:15 - 10:00' },
    { period: 3, time: '10:15 - 11:00' },
    { period: 4, time: '11:00 - 11:45' },
    { period: 5, time: '13:00 - 13:45' },
    { period: 6, time: '13:45 - 14:30' }
  ];

  const sectionSlots = slots.filter(s => s.sectionId === selectedSectionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('timetable')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive weekly class scheduling, period assignments, and conflict management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-600">Select Section:</label>
          <select
            value={selectedSectionId}
            onChange={e => setSelectedSectionId(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs focus:outline-none"
          >
            {sections.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.name} ({sec.roomNumber})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedule Table Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="py-3 px-4 w-28">Period / Time</th>
                {days.map(d => (
                  <th key={d} className="py-3 px-4">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {periods.map(p => (
                <tr key={p.period} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 bg-slate-50 font-bold border-r border-slate-200">
                    <span className="text-blue-700 block">Period {p.period}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-normal">{p.time}</span>
                  </td>
                  {days.map(d => {
                    const slot = sectionSlots.find(s => s.dayOfWeek === d && s.periodNumber === p.period);
                    const subject = subjects.find(sub => sub.id === slot?.subjectId);
                    const teacher = teachers.find(t => t.id === slot?.teacherId);

                    return (
                      <td key={d} className="py-2.5 px-3 border-r border-slate-100 align-top min-w-[140px]">
                        {slot && subject ? (
                          <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 space-y-1">
                            <p className="font-bold text-slate-900 leading-tight">{subject.name}</p>
                            <p className="text-[10px] text-blue-700 font-semibold">{teacher?.fullName || 'Assigned Faculty'}</p>
                            <div className="flex items-center gap-1 text-[9px] text-slate-500">
                              <MapPin className="w-2.5 h-2.5 text-slate-400" />
                              <span>{slot.roomNumber || 'Room 102'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-14 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-[11px] text-slate-400">
                            Free Period
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
