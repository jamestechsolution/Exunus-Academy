import React, { useState } from 'react';
import { Video, Plus, ExternalLink, Calendar, Clock, UserCheck } from 'lucide-react';
import { LMSLiveClass, Teacher, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface LiveClassesManagerProps {
  liveClasses: LMSLiveClass[];
  teachers: Teacher[];
  language: LanguageCode;
  calendarType: CalendarType;
  onScheduleClass?: (data: Partial<LMSLiveClass>) => void;
}

export const LiveClassesManager: React.FC<LiveClassesManagerProps> = ({
  liveClasses,
  teachers,
  language,
  calendarType,
  onScheduleClass
}) => {
  const { t } = useTranslation(language);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    platform: 'google_meet' as const,
    scheduledAt: '2025-03-01T14:00:00Z',
    durationMinutes: 45,
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    courseId: 'course-1',
    teacherId: teachers[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleClass?.(formData);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('liveClasses')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronous virtual classrooms with Google Meet and Zoom integration
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          + Schedule Live Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {liveClasses.map(live => {
          const teacher = teachers.find(t => t.id === live.teacherId);

          return (
            <div key={live.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {live.platform.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ⏱️ {live.durationMinutes} minutes
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base">{live.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">{live.topic}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Instructor: {teacher?.fullName || 'Faculty Lead'}</span>
                  <span>📅 {formatEduDate(live.scheduledAt, calendarType, language)}</span>
                </div>
              </div>

              <a
                href={live.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Join Virtual Class
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
