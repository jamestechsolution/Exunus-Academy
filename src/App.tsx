import React, { useState, useEffect } from 'react';
import {
  School,
  User,
  Student,
  Teacher,
  Parent,
  GradeLevel,
  Section,
  Subject,
  AttendanceRecord,
  Exam,
  ExamResult,
  FeeStructure,
  PaymentTransaction,
  LMSCourse,
  LMSAssignment,
  LMSSubmission,
  LMSQuiz,
  LMSLiveClass,
  LMSCertificate,
  LibraryBook,
  InventoryItem,
  TransportRoute,
  AdmissionApplication,
  Announcement,
  AuditLog,
  AppNotification,
  LanguageCode,
  CalendarType
} from './types';
import {
  INITIAL_SCHOOLS,
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_PARENTS,
  INITIAL_GRADE_LEVELS,
  INITIAL_SECTIONS,
  INITIAL_SUBJECTS,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_FEE_STRUCTURES,
  INITIAL_PAYMENTS,
  INITIAL_COURSES,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_QUIZZES,
  INITIAL_LIVE_CLASSES,
  INITIAL_CERTIFICATES,
  INITIAL_BOOKS,
  INITIAL_INVENTORY,
  INITIAL_TRANSPORT,
  INITIAL_ADMISSIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from './data/seedData';
import { apiService } from './services/api';
import { useTranslation } from './utils/i18n';
import { smsNotificationService } from './services/smsNotificationService';

// Components
import { Header } from './components/common/Header';
import { Sidebar, ROLE_SIDEBAR_THEMES } from './components/common/Sidebar';
import { MobileAppSimulator } from './components/common/MobileAppSimulator';
import { SchoolSetupWizard } from './components/common/SchoolSetupWizard';
import { AIAcademicAdvisor } from './components/lms/AIAcademicAdvisor';

// Dashboards
import { SuperAdminDashboard } from './components/dashboard/SuperAdminDashboard';
import { SchoolAdminDashboard } from './components/dashboard/SchoolAdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { ParentDashboard } from './components/dashboard/ParentDashboard';

// SMS Components
import { StudentList } from './components/sms/StudentList';
import { TeacherList } from './components/sms/TeacherList';
import { AttendanceManager } from './components/sms/AttendanceManager';
import { ExamsAndGrading } from './components/sms/ExamsAndGrading';
import { ReportCardGenerator } from './components/sms/ReportCardGenerator';
import { TimetableScheduler } from './components/sms/TimetableScheduler';
import { FinanceManager } from './components/sms/FinanceManager';
import { PayrollManager } from './components/sms/PayrollManager';
import { LibraryManager } from './components/sms/LibraryManager';
import { InventoryManager } from './components/sms/InventoryManager';
import { TransportManager } from './components/sms/TransportManager';
import { AdmissionsManager } from './components/sms/AdmissionsManager';
import { AnnouncementsList } from './components/sms/AnnouncementsList';
import { AuditLogsViewer } from './components/sms/AuditLogsViewer';

// LMS Components
import { CourseCatalog } from './components/lms/CourseCatalog';
import { CoursePlayer } from './components/lms/CoursePlayer';
import { AssignmentsManager } from './components/lms/AssignmentsManager';
import { QuizEngine } from './components/lms/QuizEngine';
import { LiveClassesManager } from './components/lms/LiveClassesManager';
import { CertificatesViewer } from './components/lms/CertificatesViewer';

// Auth Component
import { AuthScreen } from './components/auth/AuthScreen';

export default function App() {
  // State initialization with full seed defaults
  const [schools, setSchools] = useState<School[]>(INITIAL_SCHOOLS);
  const [currentSchoolId, setCurrentSchoolId] = useState<string>('school-1');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('user-admin');

  // Authentication State (Forced login for Exunus Academy)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem('exunus_auth_session') || sessionStorage.getItem('exunus_auth_session');
      return !!session;
    } catch {
      return false;
    }
  });

  // App settings
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [calendarType, setCalendarType] = useState<CalendarType>('ethiopian');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Domain state
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [parents, setParents] = useState<Parent[]>(INITIAL_PARENTS);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>(INITIAL_GRADE_LEVELS);
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [exams, setExams] = useState<Exam[]>(INITIAL_EXAMS);
  const [examResults, setExamResults] = useState<ExamResult[]>(INITIAL_RESULTS);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(INITIAL_FEE_STRUCTURES);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [courses, setCourses] = useState<LMSCourse[]>(INITIAL_COURSES);
  const [assignments, setAssignments] = useState<LMSAssignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<LMSSubmission[]>(INITIAL_SUBMISSIONS);
  const [quizzes, setQuizzes] = useState<LMSQuiz[]>(INITIAL_QUIZZES);
  const [liveClasses, setLiveClasses] = useState<LMSLiveClass[]>(INITIAL_LIVE_CLASSES);
  const [certificates, setCertificates] = useState<LMSCertificate[]>(INITIAL_CERTIFICATES);
  const [books, setBooks] = useState<LibraryBook[]>(INITIAL_BOOKS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>(INITIAL_TRANSPORT);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(INITIAL_ADMISSIONS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Active LMS course playing
  const [selectedLMSCourse, setSelectedLMSCourse] = useState<LMSCourse | null>(null);

  // Modals & Panels
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);

  const { t } = useTranslation(language);

  // Current entity lookups
  const currentSchool = schools.find(s => s.id === currentSchoolId) || schools[0];
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const currentTeacher = teachers.find(t => t.userId === currentUser.id) || teachers[0];
  const currentStudent = students.find(s => s.userId === currentUser.id) || students[0];
  const currentParent = parents.find(p => p.userId === currentUser.id) || parents[0];

  // Fetch initial data from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [
          schoolsRes,
          studentsRes,
          teachersRes,
          attendanceRes,
          examsRes,
          resultsRes,
          paymentsRes,
          coursesRes,
          assignmentsRes,
          quizzesRes,
          liveClassesRes,
          certRes,
          booksRes,
          invRes,
          routesRes,
          admissionsRes,
          annRes,
          logsRes
        ] = await Promise.all([
          apiService.getSchools(),
          apiService.getStudents(),
          apiService.getTeachers(),
          apiService.getAttendance(),
          apiService.getExams(),
          apiService.getExamResults(),
          apiService.getPayments(),
          apiService.getCourses(),
          apiService.getAssignments(),
          apiService.getQuizzes(),
          apiService.getLiveClasses(),
          apiService.getCertificates(),
          apiService.getBooks(),
          apiService.getInventory(),
          apiService.getTransportRoutes(),
          apiService.getAdmissions(),
          apiService.getAnnouncements(),
          apiService.getAuditLogs()
        ]);

        if (schoolsRes.data) setSchools(schoolsRes.data);
        if (studentsRes.data) setStudents(studentsRes.data);
        if (teachersRes.data) setTeachers(teachersRes.data);
        if (attendanceRes.data) setAttendance(attendanceRes.data);
        if (examsRes.data) setExams(examsRes.data);
        if (resultsRes.data) setExamResults(resultsRes.data);
        if (paymentsRes.data) setPayments(paymentsRes.data);
        if (coursesRes.data) setCourses(coursesRes.data);
        if (assignmentsRes.data) setAssignments(assignmentsRes.data);
        if (quizzesRes.data) setQuizzes(quizzesRes.data);
        if (liveClassesRes.data) setLiveClasses(liveClassesRes.data);
        if (certRes.data) setCertificates(certRes.data);
        if (booksRes.data) setBooks(booksRes.data);
        if (invRes.data) setInventory(invRes.data);
        if (routesRes.data) setTransportRoutes(routesRes.data);
        if (admissionsRes.data) setAdmissions(admissionsRes.data);
        if (annRes.data) setAnnouncements(annRes.data);
        if (logsRes.data) setAuditLogs(logsRes.data);
      } catch (e) {
        console.log('Using robust client seed state.');
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleLoginSuccess = (user: User, school: School, rememberMe: boolean) => {
    setCurrentUserId(user.id);
    setCurrentSchoolId(school.id);
    setIsAuthenticated(true);
    try {
      const sessionData = JSON.stringify({ userId: user.id, schoolId: school.id, timestamp: Date.now() });
      if (rememberMe) {
        localStorage.setItem('exunus_auth_session', sessionData);
      } else {
        sessionStorage.setItem('exunus_auth_session', sessionData);
      }
    } catch (err) {
      console.error('Session storage error:', err);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('exunus_auth_session');
      sessionStorage.removeItem('exunus_auth_session');
    } catch (err) {
      console.error('Session clear error:', err);
    }
    setIsAuthenticated(false);
  };

  const handleSwitchPersona = (userId: string) => {
    setCurrentUserId(userId);
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      if (targetUser.schoolId) setCurrentSchoolId(targetUser.schoolId);
    }
  };

  const handleCreateStudent = async (data: Partial<Student>) => {
    try {
      const res = await apiService.createStudent({
        ...data,
        schoolId: currentSchoolId,
        admissionNumber: `ES-STU-${String(students.length + 1).padStart(4, '0')}`,
        status: 'enrolled'
      });
      if (res.data) setStudents(prev => [res.data, ...prev]);
    } catch {
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        schoolId: currentSchoolId,
        admissionNumber: `ES-STU-${String(students.length + 1).padStart(4, '0')}`,
        firstName: data.firstName || 'Student',
        middleName: data.middleName || 'Middle',
        lastName: data.lastName || 'Last',
        gender: data.gender || 'male',
        dateOfBirth: data.dateOfBirth || '2008-01-01',
        gradeLevelId: data.gradeLevelId || 'gl-9',
        sectionId: data.sectionId || 'sec-9a',
        academicYearId: 'ay-2017',
        parentName: data.parentName || 'Parent',
        parentPhone: data.parentPhone || '+251 91 123 4567',
        city: 'Addis Ababa',
        address: 'Bole Subcity, Woreda 03',
        status: 'enrolled',
        enrollmentDate: new Date().toISOString().split('T')[0]
      };
      setStudents(prev => [newStudent, ...prev]);
    }
  };

  const handlePromoteStudent = (studentId: string, gradeId: string, sectionId: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, gradeLevelId: gradeId, sectionId, status: 'promoted' } : s))
    );
  };

  const handleCreateTeacher = (data: Partial<Teacher>) => {
    const newT: Teacher = {
      id: `teacher-${Date.now()}`,
      userId: data.userId || `user-${Date.now()}`,
      schoolId: currentSchoolId,
      employeeId: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
      fullName: data.fullName || 'Faculty Member',
      fullNameAm: data.fullNameAm || '',
      gender: data.gender || 'male',
      qualification: data.qualification || 'B.Ed in Science',
      department: data.department || 'Natural Sciences',
      specialization: data.specialization || ['Physics'],
      employmentType: 'full_time',
      phone: data.phone || '+251 91 123 4567',
      email: data.email || 'faculty@ethioschool.edu.et',
      joinDate: new Date().toISOString().split('T')[0],
      salary: data.salary || 20000,
      assignedSubjectIds: data.assignedSubjectIds || ['subj-phys-11'],
      assignedSectionIds: data.assignedSectionIds || ['sec-11na']
    };
    setTeachers(prev => [newT, ...prev]);
  };

  const handleSaveAttendance = async (date: string, sectionId: string, records: any[]) => {
    try {
      await apiService.recordAttendance({ date, sectionId, records });
    } catch {
      // Local sync fallback
    }
    const newRecords: AttendanceRecord[] = records.map((r, i) => ({
      id: `att-${Date.now()}-${i}`,
      schoolId: currentSchoolId,
      studentId: r.studentId,
      sectionId,
      date,
      status: r.status,
      remarks: r.remarks,
      markedByUserId: currentUser.id,
      createdAt: new Date().toISOString()
    }));
    setAttendance(prev => [...newRecords, ...prev.filter(a => a.date !== date || a.sectionId !== sectionId)]);

    // Dispatch automated SMS absence alerts and generate notifications
    const absentRecords = records.filter(r => r.status === 'absent');
    if (absentRecords.length > 0) {
      absentRecords.forEach(r => {
        const student = students.find(s => s.id === r.studentId);
        if (student) {
          const dispatch = smsNotificationService.dispatchAbsenceAlert(
            student,
            currentSchool,
            date,
            r.remarks
          );
          setNotifications(prev => [dispatch.notification, ...prev]);
        }
      });
    }
  };

  const handleSaveMarks = async (examId: string, subjectId: string, marks: any[]) => {
    try {
      await apiService.recordExamMarks({ examId, subjectId, marks });
    } catch {
      // Local sync fallback
    }
    const newResults: ExamResult[] = marks.map((m, i) => {
      const maxScore = 30;
      const percentage = Math.round((m.score / maxScore) * 100);
      let letter = 'A';
      let points = 4.0;
      if (percentage >= 90) { letter = 'A+'; points = 4.0; }
      else if (percentage >= 85) { letter = 'A'; points = 4.0; }
      else if (percentage >= 80) { letter = 'A-'; points = 3.75; }
      else if (percentage >= 75) { letter = 'B+'; points = 3.5; }
      else if (percentage >= 70) { letter = 'B'; points = 3.0; }
      else { letter = 'C'; points = 2.0; }

      return {
        id: `res-${Date.now()}-${i}`,
        schoolId: currentSchoolId,
        examId,
        studentId: m.studentId,
        subjectId,
        score: m.score,
        maxScore,
        percentage,
        letterGrade: letter,
        gradePoints: points,
        remarks: m.remarks,
        markedByTeacherId: currentUser.teacherProfileId || 'teacher-1',
        submittedAt: new Date().toISOString()
      };
    });
    setExamResults(prev => [...newResults, ...prev.filter(r => !(r.examId === examId && r.subjectId === subjectId))]);
  };

  const handleRecordPayment = async (paymentData: Partial<PaymentTransaction>) => {
    try {
      const res = await apiService.recordPayment({
        ...paymentData,
        schoolId: currentSchoolId
      });
      if (res.data) setPayments(prev => [res.data, ...prev]);
    } catch {
      const newP: PaymentTransaction = {
        id: `pay-${Date.now()}`,
        schoolId: currentSchoolId,
        studentId: paymentData.studentId || 'student-1',
        feeStructureId: 'fee-tuition-11',
        amount: paymentData.amount || 4800,
        paymentMethod: paymentData.paymentMethod || 'telebirr',
        referenceNumber: paymentData.referenceNumber || `TEL-${Date.now().toString().slice(-8)}`,
        receiptNumber: `REC-2025-${String(payments.length + 1).padStart(4, '0')}`,
        paymentDate: new Date().toISOString().split('T')[0],
        recordedByUserId: currentUser.id,
        status: 'completed',
        description: paymentData.description || 'Monthly Tuition Fee'
      };
      setPayments(prev => [newP, ...prev]);
    }
  };

  const handleCreateCourse = (courseData: Partial<LMSCourse>) => {
    const newC: LMSCourse = {
      id: `course-${Date.now()}`,
      schoolId: currentSchoolId,
      title: courseData.title || 'New Course',
      titleAm: courseData.titleAm,
      description: courseData.description || '',
      subjectId: courseData.subjectId || 'subj-phys-11',
      teacherId: courseData.teacherId || 'teacher-1',
      gradeLevelId: courseData.gradeLevelId || 'gl-11-nat',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600',
      academicYearId: 'ay-2017',
      totalModules: courseData.totalModules || 1,
      totalLessons: courseData.totalLessons || 3,
      enrolledStudentsCount: courseData.enrolledStudentsCount || 35,
      isPublished: true,
      modules: courseData.modules || []
    };
    setCourses(prev => [newC, ...prev]);
  };

  const handleSubmitAssignment = (assignmentId: string, content: string) => {
    const newSub: LMSSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId,
      studentId: currentStudent?.id || 'student-1',
      studentName: currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : 'Yonas Haile',
      submittedAt: new Date().toISOString(),
      textAnswer: content,
      status: 'submitted'
    };
    setSubmissions(prev => [newSub, ...prev]);
  };

  // Render active dashboard based on user role
  const renderDashboard = () => {
    if (currentUser.role === 'super_admin') {
      return (
        <SuperAdminDashboard
          schools={schools}
          language={language}
          onAddNewSchool={() => setIsSetupWizardOpen(true)}
          onSelectSchool={schoolId => {
            setCurrentSchoolId(schoolId);
            setActiveTab('dashboard');
          }}
        />
      );
    }
    if (currentUser.role === 'teacher') {
      return (
        <TeacherDashboard
          teacher={currentTeacher}
          sections={sections}
          subjects={subjects}
          courses={courses}
          assignments={assignments}
          liveClasses={liveClasses}
          language={language}
          calendarType={calendarType}
          onNavigate={tab => setActiveTab(tab)}
        />
      );
    }
    if (currentUser.role === 'student') {
      return (
        <StudentDashboard
          student={currentStudent}
          school={currentSchool}
          courses={courses}
          results={examResults}
          assignments={assignments}
          liveClasses={liveClasses}
          certificates={certificates}
          language={language}
          calendarType={calendarType}
          onNavigate={tab => setActiveTab(tab)}
          onSelectCourse={c => {
            setSelectedLMSCourse(c);
            setActiveTab('courses');
          }}
        />
      );
    }
    if (currentUser.role === 'parent') {
      return (
        <ParentDashboard
          parent={currentParent}
          students={students}
          school={currentSchool}
          results={examResults}
          attendance={attendance}
          payments={payments}
          language={language}
          calendarType={calendarType}
          onNavigate={tab => setActiveTab(tab)}
          onRecordPayment={handleRecordPayment}
        />
      );
    }
    // Default: School Admin / Principal / Registrar
    return (
      <SchoolAdminDashboard
        school={currentSchool}
        students={students}
        teachers={teachers}
        attendance={attendance}
        payments={payments}
        courses={courses}
        exams={exams}
        announcements={announcements}
        language={language}
        calendarType={calendarType}
        onNavigate={tab => setActiveTab(tab)}
      />
    );
  };

  // If user is not logged in, enforce the Exunus Academy authentication gate
  if (!isAuthenticated) {
    return (
      <AuthScreen
        schools={schools}
        users={users}
        language={language}
        calendarType={calendarType}
        onLanguageChange={setLanguage}
        onCalendarChange={setCalendarType}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Derive active persona role accent theme for Sidebar and navigation highlights
  const roleSidebarTheme =
    ROLE_SIDEBAR_THEMES[currentUser.role] ||
    ROLE_SIDEBAR_THEMES['school_admin'];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden antialiased">
      {/* Persistent Left Sidebar with Role-Distinct Color Accents */}
      <Sidebar
        activeTab={activeTab}
        userRole={currentUser.role}
        roleAccentOverride={roleSidebarTheme}
        language={language}
        onSelectTab={tab => {
          setActiveTab(tab);
          if (tab === 'courses') setSelectedLMSCourse(null);
        }}
        onOpenSetupWizard={() => setIsSetupWizardOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Header */}
        <Header
          currentUser={currentUser}
          currentSchool={currentSchool}
          schools={schools}
          language={language}
          calendarType={calendarType}
          notifications={notifications}
          isMobileSimulatorOpen={isMobileSimulatorOpen}
          isAIAdvisorOpen={isAIAdvisorOpen}
          onLanguageChange={setLanguage}
          onCalendarChange={setCalendarType}
          onSwitchPersona={handleSwitchPersona}
          onSwitchSchool={setCurrentSchoolId}
          onToggleMobileSimulator={() => setIsMobileSimulatorOpen(!isMobileSimulatorOpen)}
          onToggleAIAdvisor={() => setIsAIAdvisorOpen(!isAIAdvisorOpen)}
          onLogout={handleLogout}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}

            {activeTab === 'students' && (
              <StudentList
                students={students}
                gradeLevels={gradeLevels}
                sections={sections}
                school={currentSchool}
                language={language}
                calendarType={calendarType}
                onCreateStudent={handleCreateStudent}
                onPromoteStudent={handlePromoteStudent}
              />
            )}

            {activeTab === 'teachers' && (
              <TeacherList
                teachers={teachers}
                subjects={subjects}
                sections={sections}
                language={language}
                onCreateTeacher={handleCreateTeacher}
              />
            )}

            {activeTab === 'parents' && (
              <ParentDashboard
                parent={currentParent}
                students={students}
                school={currentSchool}
                results={examResults}
                attendance={attendance}
                payments={payments}
                language={language}
                calendarType={calendarType}
                onNavigate={tab => setActiveTab(tab)}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {activeTab === 'admissions' && (
              <AdmissionsManager
                applications={admissions}
                gradeLevels={gradeLevels}
                language={language}
                calendarType={calendarType}
                onUpdateStatus={(id, st) =>
                  setAdmissions(prev => prev.map(a => (a.id === id ? { ...a, status: st } : a)))
                }
              />
            )}

            {activeTab === 'attendance' && (
              <AttendanceManager
                students={students}
                sections={sections}
                attendanceRecords={attendance}
                school={currentSchool}
                language={language}
                calendarType={calendarType}
                onSaveAttendance={handleSaveAttendance}
              />
            )}

            {activeTab === 'exams' && (
              <ExamsAndGrading
                exams={exams}
                examResults={examResults}
                students={students}
                subjects={subjects}
                sections={sections}
                school={currentSchool}
                language={language}
                calendarType={calendarType}
                onSaveMarks={handleSaveMarks}
                onCreateExam={ex =>
                  setExams(prev => [
                    {
                      id: `exam-${Date.now()}`,
                      schoolId: currentSchoolId,
                      academicYear: 2017,
                      term: 'Semester 1',
                      title: ex.title || 'Exam',
                      examDate: ex.examDate || new Date().toISOString().split('T')[0],
                      maxMarks: ex.maxMarks || 30,
                      weightPercentage: ex.weightPercentage || 30,
                      durationMinutes: ex.durationMinutes || 60,
                      gradeLevelId: 'gl-11-nat',
                      subjectId: 'subj-phys-11'
                    },
                    ...prev
                  ])
                }
              />
            )}

            {activeTab === 'report-cards' && (
              <ReportCardGenerator
                students={students}
                school={currentSchool}
                subjects={subjects}
                examResults={examResults}
                language={language}
                calendarType={calendarType}
              />
            )}

            {activeTab === 'timetable' && (
              <TimetableScheduler
                slots={[
                  {
                    id: 'slot-1',
                    schoolId: currentSchoolId,
                    sectionId: 'sec-11na',
                    subjectId: 'subj-phys-11',
                    teacherId: 'teacher-1',
                    dayOfWeek: 'Monday',
                    periodNumber: 1,
                    startTime: '08:30',
                    endTime: '09:15',
                    roomNumber: 'Lab-102'
                  },
                  {
                    id: 'slot-2',
                    schoolId: currentSchoolId,
                    sectionId: 'sec-11na',
                    subjectId: 'subj-math-11',
                    teacherId: 'teacher-1',
                    dayOfWeek: 'Monday',
                    periodNumber: 2,
                    startTime: '09:15',
                    endTime: '10:00',
                    roomNumber: 'Room-204'
                  },
                  {
                    id: 'slot-3',
                    schoolId: currentSchoolId,
                    sectionId: 'sec-11na',
                    subjectId: 'subj-chem-11',
                    teacherId: 'teacher-1',
                    dayOfWeek: 'Tuesday',
                    periodNumber: 1,
                    startTime: '08:30',
                    endTime: '09:15',
                    roomNumber: 'Lab-103'
                  },
                  {
                    id: 'slot-4',
                    schoolId: currentSchoolId,
                    sectionId: 'sec-11na',
                    subjectId: 'subj-bio-11',
                    teacherId: 'teacher-1',
                    dayOfWeek: 'Wednesday',
                    periodNumber: 3,
                    startTime: '10:15',
                    endTime: '11:00',
                    roomNumber: 'Lab-101'
                  },
                  {
                    id: 'slot-5',
                    schoolId: currentSchoolId,
                    sectionId: 'sec-11na',
                    subjectId: 'subj-eng-11',
                    teacherId: 'teacher-1',
                    dayOfWeek: 'Thursday',
                    periodNumber: 4,
                    startTime: '11:00',
                    endTime: '11:45',
                    roomNumber: 'Room-201'
                  },
                  {
                    id: 'slot-6',
                    schoolId: currentSchoolId,
                    sectionId: 'sec-11na',
                    subjectId: 'subj-phys-11',
                    teacherId: 'teacher-1',
                    dayOfWeek: 'Friday',
                    periodNumber: 2,
                    startTime: '09:15',
                    endTime: '10:00',
                    roomNumber: 'Lab-102'
                  }
                ]}
                sections={sections}
                subjects={subjects}
                teachers={teachers}
                language={language}
                onAddSlot={() => {}}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceManager
                payments={payments}
                feeStructures={feeStructures}
                students={students}
                school={currentSchool}
                language={language}
                calendarType={calendarType}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {activeTab === 'payroll' && (
              <PayrollManager
                teachers={teachers}
                school={currentSchool}
                language={language}
                calendarType={calendarType}
              />
            )}

            {activeTab === 'library' && (
              <LibraryManager
                books={books}
                language={language}
                onCheckoutBook={bookId => {
                  setBooks(prev =>
                    prev.map(b =>
                      b.id === bookId && b.availableCopies > 0
                        ? { ...b, availableCopies: b.availableCopies - 1 }
                        : b
                    )
                  );
                }}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManager
                items={inventory}
                language={language}
                onAddItem={item =>
                  setInventory(prev => [
                    {
                      id: `inv-${Date.now()}`,
                      schoolId: currentSchoolId,
                      assetCode: `AST-2025-${String(inventory.length + 1).padStart(3, '0')}`,
                      name: item.name || 'New Equipment',
                      category: item.category || 'Laboratory',
                      quantity: item.quantity || 1,
                      condition: item.condition || 'good',
                      location: item.location || 'Science Lab',
                      purchaseDate: new Date().toISOString().split('T')[0],
                      purchasePrice: item.purchasePrice || 5000
                    },
                    ...prev
                  ])
                }
              />
            )}

            {activeTab === 'transport' && (
              <TransportManager routes={transportRoutes} language={language} />
            )}

            {activeTab === 'announcements' && (
              <AnnouncementsList
                announcements={announcements}
                language={language}
                calendarType={calendarType}
                onCreateAnnouncement={ann =>
                  setAnnouncements(prev => [
                    {
                      id: `ann-${Date.now()}`,
                      schoolId: currentSchoolId,
                      title: ann.title || 'Notice',
                      titleAm: ann.titleAm,
                      content: ann.content || '',
                      targetAudience: ann.targetAudience || 'all',
                      isPinned: ann.isPinned || false,
                      publishedAt: new Date().toISOString(),
                      authorName: currentUser.name,
                      authorRole: currentUser.role
                    },
                    ...prev
                  ])
                }
              />
            )}

            {activeTab === 'audit-logs' && (
              <AuditLogsViewer
                logs={auditLogs}
                language={language}
                calendarType={calendarType}
              />
            )}

            {/* LMS Tabs */}
            {(activeTab === 'lms-overview' || activeTab === 'courses') && (
              selectedLMSCourse ? (
                <CoursePlayer
                  course={selectedLMSCourse}
                  language={language}
                  onBack={() => setSelectedLMSCourse(null)}
                  onTakeQuiz={() => setActiveTab('quizzes')}
                />
              ) : (
                <CourseCatalog
                  courses={courses}
                  subjects={subjects}
                  teachers={teachers}
                  language={language}
                  onSelectCourse={c => setSelectedLMSCourse(c)}
                  onCreateCourse={handleCreateCourse}
                />
              )
            )}

            {activeTab === 'assignments' && (
              <AssignmentsManager
                assignments={assignments}
                submissions={submissions}
                language={language}
                calendarType={calendarType}
                onSubmitAssignment={handleSubmitAssignment}
              />
            )}

            {activeTab === 'quizzes' && (
              <QuizEngine
                quizzes={quizzes}
                language={language}
                onQuizCompleted={(quizId, score, maxScore) => {
                  console.log('Quiz scored:', score, '/', maxScore);
                }}
              />
            )}

            {activeTab === 'live-classes' && (
              <LiveClassesManager
                liveClasses={liveClasses}
                teachers={teachers}
                language={language}
                calendarType={calendarType}
                onScheduleClass={live =>
                  setLiveClasses(prev => [
                    {
                      id: `live-${Date.now()}`,
                      courseId: live.courseId || 'course-1',
                      teacherId: live.teacherId || 'teacher-1',
                      title: live.title || 'Live Session',
                      topic: live.topic || 'Curriculum Overview',
                      meetingUrl: live.meetingUrl || 'https://meet.google.com/abc-defg-hij',
                      platform: live.platform || 'google_meet',
                      scheduledAt: live.scheduledAt || new Date().toISOString(),
                      durationMinutes: live.durationMinutes || 45,
                      status: 'scheduled'
                    },
                    ...prev
                  ])
                }
              />
            )}

            {activeTab === 'certificates' && (
              <CertificatesViewer
                certificates={certificates}
                school={currentSchool}
                language={language}
                calendarType={calendarType}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Interactive Mobile Simulator */}
      {isMobileSimulatorOpen && (
        <MobileAppSimulator
          student={currentStudent}
          school={currentSchool}
          courses={courses}
          results={examResults}
          payments={payments}
          language={language}
          calendarType={calendarType}
          onClose={() => setIsMobileSimulatorOpen(false)}
        />
      )}

      {/* Slide-over AI Pedagogical Advisor */}
      {isAIAdvisorOpen && (
        <AIAcademicAdvisor
          students={students}
          results={examResults}
          attendance={attendance}
          language={language}
          onClose={() => setIsAIAdvisorOpen(false)}
        />
      )}

      {/* School Setup Wizard */}
      {isSetupWizardOpen && (
        <SchoolSetupWizard
          school={currentSchool}
          language={language}
          onClose={() => setIsSetupWizardOpen(false)}
          onSaveSetup={updated => {
            setSchools(prev =>
              prev.map(s => (s.id === currentSchool.id ? { ...s, ...updated } : s))
            );
          }}
        />
      )}
    </div>
  );
}
