import React, { useState } from 'react';
import { Plus, Search, Users, Mail, Phone, BookOpen, Award, Layers } from 'lucide-react';
import { Teacher, Subject, Section, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface TeacherListProps {
  teachers: Teacher[];
  subjects: Subject[];
  sections: Section[];
  language: LanguageCode;
  onCreateTeacher: (data: Partial<Teacher>) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({
  teachers,
  subjects,
  sections,
  language,
  onCreateTeacher
}) => {
  const { t } = useTranslation(language);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    fullNameAm: '',
    gender: 'male' as const,
    qualification: 'B.Ed / M.Sc in Natural Sciences',
    department: 'Natural Sciences',
    phone: '+251 91 123 4567',
    email: '',
    salary: 20000,
    specialization: ['Physics', 'Mathematics'],
    assignedSubjectIds: [] as string[],
    assignedSectionIds: [] as string[]
  });

  const filteredTeachers = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTeacher({
      ...formData,
      userId: `user-${Date.now()}`
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('teachers')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Faculty directory, workload distribution, and subject assignments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          + Add Faculty Staff
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by teacher name, employee ID, or department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Grid of Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map(teacher => {
          const assignedSubs = subjects.filter(s => teacher.assignedSubjectIds?.includes(s.id));
          const assignedSecs = sections.filter(sec => teacher.assignedSectionIds?.includes(sec.id));

          return (
            <div key={teacher.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <img
                    src={teacher.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}
                    alt={teacher.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{teacher.fullName}</h3>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                        {teacher.employeeId}
                      </span>
                    </div>
                    {teacher.fullNameAm && (
                      <p className="text-xs text-slate-500">{teacher.fullNameAm}</p>
                    )}
                    <span className="inline-block text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded mt-1">
                      {teacher.department}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 font-medium">🎓 {teacher.qualification}</p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.phone}</span>
                  </p>
                </div>

                {/* Assigned Subjects & Sections */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Courses & Classes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedSubs.map(s => (
                      <span key={s.id} className="text-[10px] bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded">
                        {s.name}
                      </span>
                    ))}
                    {assignedSecs.map(sec => (
                      <span key={sec.id} className="text-[10px] bg-blue-50 text-blue-800 font-medium px-2 py-0.5 rounded">
                        {sec.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Joined: {teacher.joinDate}</span>
                <span className="font-bold text-slate-800">{(teacher?.salary || 0).toLocaleString()} ETB / mo</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add New Faculty Member</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name (English)*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ato Berhanu Kebede"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Natural Sciences">Natural Sciences</option>
                    <option value="Social Sciences">Social Sciences</option>
                    <option value="Languages">Languages & Literature</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="ICT">Information Technology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Monthly Salary (ETB)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={e => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
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
                  Register Faculty Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
