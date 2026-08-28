import React, { useState } from 'react';
import { Megaphone, Plus, Calendar, User, ShieldCheck } from 'lucide-react';
import { Announcement, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';

interface AnnouncementsListProps {
  announcements: Announcement[];
  language: LanguageCode;
  calendarType: CalendarType;
  onCreateAnnouncement?: (data: Partial<Announcement>) => void;
}

export const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  announcements,
  language,
  calendarType,
  onCreateAnnouncement
}) => {
  const { t } = useTranslation(language);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleAm: '',
    content: '',
    targetAudience: 'all' as const,
    isPinned: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAnnouncement?.({
      ...formData,
      publishedAt: new Date().toISOString()
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('announcements')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            School-wide announcements, parent alerts, exam schedules, and holiday notices
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          + Post Notice
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{ann.title}</h3>
                  {ann.isPinned && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      PINNED
                    </span>
                  )}
                </div>
                {ann.titleAm && (
                  <p className="text-xs text-slate-500 mt-0.5">{ann.titleAm}</p>
                )}
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                Audience: {ann.targetAudience}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">{ann.content}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                By {ann.authorName} ({ann.authorRole})
              </span>
              <span>📅 {formatEduDate(ann.publishedAt, calendarType, language)}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Broadcast School Notice</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value as any })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 capitalize"
                >
                  <option value="all">Entire School Community (All)</option>
                  <option value="students">Students Only</option>
                  <option value="teachers">Faculty & Teachers Only</option>
                  <option value="parents">Parents Only</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Body</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                ></textarea>
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
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
