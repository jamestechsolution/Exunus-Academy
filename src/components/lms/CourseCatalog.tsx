import React, { useState } from 'react';
import { BookMarked, Plus, Search, PlayCircle, Users, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { LMSCourse, Subject, Teacher, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface CourseCatalogProps {
  courses: LMSCourse[];
  subjects: Subject[];
  teachers: Teacher[];
  language: LanguageCode;
  onSelectCourse: (course: LMSCourse) => void;
  onCreateCourse: (course: Partial<LMSCourse>) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  subjects,
  teachers,
  language,
  onSelectCourse,
  onCreateCourse
}) => {
  const { t } = useTranslation(language);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    titleAm: '',
    description: '',
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    gradeLevelId: 'gl-11-nat',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600'
  });

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateCourse({
      ...formData,
      totalModules: 1,
      totalLessons: 3,
      enrolledStudentIds: ['student-1', 'student-2'],
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Introduction & Core Concepts',
          order: 1,
          lessons: [
            {
              id: `les-${Date.now()}-1`,
              title: 'Overview & Fundamentals',
              contentType: 'video',
              contentUrl: 'https://www.youtube.com/watch?v=b1t41Q3xRM8',
              durationMinutes: 20,
              order: 1,
              isCompleted: false
            }
          ]
        }
      ]
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('courses')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive Ethiopian Ministry of Education curriculum courses, video lectures, and syllabus
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          + Create New Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search LMS courses, topics, keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const teacher = teachers.find(t => t.id === course.teacherId);

          return (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-purple-900/80 backdrop-blur-xs text-white font-bold text-[10px] uppercase">
                    Grade 11 Natural
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-purple-700 transition-colors">
                    {course.title}
                  </h3>
                  {course.titleAm && (
                    <p className="text-xs text-slate-500">{course.titleAm}</p>
                  )}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-800">
                    👨‍🏫 {teacher?.fullName || 'Faculty Lead'}
                  </span>
                  <span>
                    {course.totalModules} Modules • {course.totalLessons} Lessons
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create New LMS Course</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title (English)*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethiopian Grade 11 Chemistry - Atomic Structure"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title (አማርኛ)</label>
                <input
                  type="text"
                  placeholder="የ11ኛ ክፍል ኬሚስትሪ"
                  value={formData.titleAm}
                  onChange={e => setFormData({ ...formData, titleAm: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject & Instructor</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.subjectId}
                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <select
                    value={formData.teacherId}
                    onChange={e => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Description & Overview</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comprehensive course covering the national curriculum..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Publish LMS Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
