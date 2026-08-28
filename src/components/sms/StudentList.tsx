import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  QrCode,
  FileText,
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { Student, GradeLevel, Section, School, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate } from '../../utils/ethiopianCalendar';
import { generateReportCardPDF } from '../../utils/pdfGenerator';
import { INITIAL_SUBJECTS, INITIAL_RESULTS } from '../../data/seedData';

interface StudentListProps {
  students: Student[];
  gradeLevels: GradeLevel[];
  sections: Section[];
  school: School;
  language: LanguageCode;
  calendarType: CalendarType;
  onCreateStudent: (data: Partial<Student>) => void;
  onPromoteStudent: (studentId: string, gradeId: string, sectionId: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({
  students,
  gradeLevels,
  sections,
  school,
  language,
  calendarType,
  onCreateStudent,
  onPromoteStudent
}) => {
  const { t } = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);
  const [promoteGradeId, setPromoteGradeId] = useState('');
  const [promoteSectionId, setPromoteSectionId] = useState('');

  // New Student Form State
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    firstNameAm: '',
    middleNameAm: '',
    lastNameAm: '',
    gender: 'male' as const,
    dateOfBirth: '2008-01-01',
    gradeLevelId: gradeLevels[0]?.id || 'gl-9',
    sectionId: sections[0]?.id || 'sec-9a',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: 'Addis Ababa',
    city: 'Addis Ababa'
  });

  const filteredStudents = students.filter(s => {
    const fullName = `${s.firstName} ${s.middleName} ${s.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade ? s.gradeLevelId === selectedGrade : true;
    const matchesSection = selectedSection ? s.sectionId === selectedSection : true;
    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateStudent(formData);
    setShowAddModal(false);
    setFormData({
      firstName: '',
      middleName: '',
      lastName: '',
      firstNameAm: '',
      middleNameAm: '',
      lastNameAm: '',
      gender: 'male',
      dateOfBirth: '2008-01-01',
      gradeLevelId: gradeLevels[0]?.id || 'gl-9',
      sectionId: sections[0]?.id || 'sec-9a',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      address: 'Addis Ababa',
      city: 'Addis Ababa'
    });
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudent || !promoteGradeId || !promoteSectionId) return;
    onPromoteStudent(targetStudent.id, promoteGradeId, promoteSectionId);
    setShowPromoteModal(false);
    setTargetStudent(null);
  };

  const handleExportCSV = () => {
    const headers = 'AdmissionNumber,FirstName,MiddleName,LastName,Gender,Grade,Section,ParentPhone,Status\n';
    const rows = filteredStudents.map(s =>
      `"${s.admissionNumber}","${s.firstName}","${s.middleName}","${s.lastName}","${s.gender}","${s.gradeLevelId}","${s.sectionId}","${s.parentPhone || ''}","${s.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Students_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('students')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Student directory, official Ethiopian admission records, and promotion wizard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            {t('exportCsv')}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('add')} Student
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or admission ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Grade Levels</option>
            {gradeLevels.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={e => setSelectedSection(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="">All Sections</option>
            {sections.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4">Grade & Section</th>
                <th className="py-3 px-4">Gender / DOB</th>
                <th className="py-3 px-4">Parent / Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No student records found
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const grade = gradeLevels.find(g => g.id === student.gradeLevelId);
                  const section = sections.find(sec => sec.id === student.sectionId);
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.photo || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                            alt={student.firstName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">
                              {student.firstName} {student.middleName} {student.lastName}
                            </p>
                            {student.firstNameAm && (
                              <p className="text-[11px] text-slate-500">{student.firstNameAm} {student.middleNameAm} {student.lastNameAm}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {student.admissionNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{grade?.name || 'Grade 11'}</span>
                        <p className="text-[11px] text-slate-500">{section?.name || 'Section A'}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="capitalize">{student.gender}</span> • {student.dateOfBirth}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{student.parentName || 'Parent'}</p>
                        <p className="text-[11px] text-slate-500">{student.parentPhone || '+251 91 123 4567'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          student.status === 'enrolled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : student.status === 'promoted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {student.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              const reportData = INITIAL_SUBJECTS.map(subj => ({
                                subject: subj,
                                result: INITIAL_RESULTS.find(r => r.studentId === student.id && r.subjectId === subj.id)
                              }));
                              generateReportCardPDF(student, school, reportData);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="Generate Official Report Card PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setTargetStudent(student);
                              setPromoteGradeId(student.gradeLevelId);
                              setPromoteSectionId(student.sectionId);
                              setShowPromoteModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-purple-600 transition-colors"
                            title="Promote or Transfer Student"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Register New Student</h3>
                <p className="text-xs text-slate-500">Ethiopian Full Naming Convention (First / Father / Grandfather)</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Name (ስም)*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dawit"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Father's Name (የአባት ስም)*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tesfaye"
                    value={formData.middleName}
                    onChange={e => setFormData({ ...formData, middleName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Grandfather's Name (የአያት ስም)*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wolde"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="male">Male (ወንድ)</option>
                    <option value="female">Female (ሴት)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Grade</label>
                  <select
                    value={formData.gradeLevelId}
                    onChange={e => setFormData({ ...formData, gradeLevelId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    {gradeLevels.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ato Tesfaye Wolde"
                    value={formData.parentName}
                    onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent Phone (for SMS notifications)</label>
                  <input
                    type="tel"
                    placeholder="+251 91 123 4567"
                    value={formData.parentPhone}
                    onChange={e => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save & Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promotion / Transfer Modal */}
      {showPromoteModal && targetStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Promote / Transfer Student</h3>
              <button onClick={() => setShowPromoteModal(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <p className="font-bold text-blue-900">
                  {targetStudent.firstName} {targetStudent.middleName} {targetStudent.lastName}
                </p>
                <p className="text-[11px] text-blue-700 font-mono mt-0.5">{targetStudent.admissionNumber}</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Grade Level</label>
                <select
                  value={promoteGradeId}
                  onChange={e => setPromoteGradeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  {gradeLevels.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Section</label>
                <select
                  value={promoteSectionId}
                  onChange={e => setPromoteSectionId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Confirm Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
