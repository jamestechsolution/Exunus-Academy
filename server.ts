import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_SCHOOLS,
  INITIAL_ACADEMIC_YEARS,
  INITIAL_GRADE_LEVELS,
  INITIAL_SECTIONS,
  INITIAL_SUBJECTS,
  INITIAL_GRADING_SYSTEM,
  INITIAL_USERS,
  INITIAL_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_PARENTS,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_TIMETABLE,
  INITIAL_FEE_STRUCTURES,
  INITIAL_PAYMENTS,
  INITIAL_PAYROLL,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_BOOK_LOANS,
  INITIAL_ASSETS,
  INITIAL_TRANSPORT_ROUTES,
  INITIAL_ADMISSIONS,
  INITIAL_LMS_COURSES,
  INITIAL_LMS_ASSIGNMENTS,
  INITIAL_LMS_SUBMISSIONS,
  INITIAL_LMS_QUIZZES,
  INITIAL_LMS_LIVE_CLASSES,
  INITIAL_CERTIFICATES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './src/data/seedData';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// In-Memory Database Store (Initialized from Seed Data, allows full persistent state during session)
const db = {
  schools: [...INITIAL_SCHOOLS],
  academicYears: [...INITIAL_ACADEMIC_YEARS],
  gradeLevels: [...INITIAL_GRADE_LEVELS],
  sections: [...INITIAL_SECTIONS],
  subjects: [...INITIAL_SUBJECTS],
  gradingSystem: { ...INITIAL_GRADING_SYSTEM },
  users: [...INITIAL_USERS],
  teachers: [...INITIAL_TEACHERS],
  students: [...INITIAL_STUDENTS],
  parents: [...INITIAL_PARENTS],
  attendance: [...INITIAL_ATTENDANCE],
  exams: [...INITIAL_EXAMS],
  results: [...INITIAL_RESULTS],
  timetable: [...INITIAL_TIMETABLE],
  feeStructures: [...INITIAL_FEE_STRUCTURES],
  payments: [...INITIAL_PAYMENTS],
  payroll: [...INITIAL_PAYROLL],
  libraryBooks: [...INITIAL_LIBRARY_BOOKS],
  bookLoans: [...INITIAL_BOOK_LOANS],
  assets: [...INITIAL_ASSETS],
  transportRoutes: [...INITIAL_TRANSPORT_ROUTES],
  admissions: [...INITIAL_ADMISSIONS],
  lmsCourses: [...INITIAL_LMS_COURSES],
  lmsAssignments: [...INITIAL_LMS_ASSIGNMENTS],
  lmsSubmissions: [...INITIAL_LMS_SUBMISSIONS],
  lmsQuizzes: [...INITIAL_LMS_QUIZZES],
  lmsLiveClasses: [...INITIAL_LMS_LIVE_CLASSES],
  certificates: [...INITIAL_CERTIFICATES],
  announcements: [...INITIAL_ANNOUNCEMENTS],
  notifications: [...INITIAL_NOTIFICATIONS],
  auditLogs: [...INITIAL_AUDIT_LOGS]
};

// Helper for adding audit log
function addAuditLog(schoolId: string, userId: string, userName: string, userRole: string, action: string, entity: string, entityId: string, details: string) {
  const log = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    schoolId,
    userId,
    userName,
    userRole,
    action,
    entity,
    entityId,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: '197.156.104.22'
  };
  db.auditLogs.unshift(log);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // --- HEALTH & STATUS ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'EthioSchool OS ERP & LMS',
      timestamp: new Date().toISOString(),
      schoolsCount: db.schools.length,
      studentsCount: db.students.length
    });
  });

  // --- API AUTHENTICATION ---
  // All /api routes below this point require a valid Supabase access token and
  // an active provisioned profile. The health endpoint above remains public.
  app.use('/api', async (req, res, next) => {
    const authorization = req.header('authorization') || '';
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey =
      process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!match || !supabaseUrl || !publishableKey) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
      const token = match[1];
      const authClient = createClient(supabaseUrl, publishableKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: authData, error: authError } = await authClient.auth.getUser(token);
      if (authError || !authData.user) {
        return res.status(401).json({ error: 'Invalid or expired session.' });
      }

      const { data: profile, error: profileError } = await authClient
        .from('profiles')
        .select('id, app_role, school_id, is_active')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || !profile.is_active) {
        return res.status(403).json({ error: 'Active academy profile required.' });
      }

      (req as any).academyAuth = {
        userId: authData.user.id,
        role: profile.app_role,
        schoolId: profile.school_id,
      };
      return next();
    } catch {
      return res.status(401).json({ error: 'Unable to verify session.' });
    }
  });

  // --- SCHOOLS & SYSTEM SETUP ---
  app.get('/api/schools', (req, res) => {
    res.json(db.schools);
  });

  app.post('/api/schools', (req, res) => {
    const newSchool = {
      id: `school-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.schools.push(newSchool);
    res.status(201).json(newSchool);
  });

  app.put('/api/schools/:id', (req, res) => {
    const idx = db.schools.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'School not found' });
    db.schools[idx] = { ...db.schools[idx], ...req.body };
    res.json(db.schools[idx]);
  });

  // --- GRADE LEVELS & SECTIONS ---
  app.get('/api/academic-years', (req, res) => res.json(db.academicYears));
  app.get('/api/grade-levels', (req, res) => res.json(db.gradeLevels));
  app.get('/api/sections', (req, res) => res.json(db.sections));
  app.get('/api/subjects', (req, res) => res.json(db.subjects));

  app.post('/api/sections', (req, res) => {
    const newSection = {
      id: `sec-${Date.now()}`,
      schoolId: req.body.schoolId || 'school-1',
      ...req.body
    };
    db.sections.push(newSection);
    res.status(201).json(newSection);
  });

  // --- STUDENTS ---
  app.get('/api/students', (req, res) => {
    const { gradeId, sectionId, query } = req.query;
    let list = [...db.students];
    if (gradeId) list = list.filter(s => s.gradeLevelId === gradeId);
    if (sectionId) list = list.filter(s => s.sectionId === sectionId);
    if (query) {
      const q = String(query).toLowerCase();
      list = list.filter(s =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q)
      );
    }
    res.json(list);
  });

  app.get('/api/students/:id', (req, res) => {
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    const grade = db.gradeLevels.find(g => g.id === student.gradeLevelId);
    const section = db.sections.find(sec => sec.id === student.sectionId);
    const results = db.results.filter(r => r.studentId === student.id);
    const attendance = db.attendance.filter(a => a.studentId === student.id);
    const payments = db.payments.filter(p => p.studentId === student.id);
    res.json({
      student,
      grade,
      section,
      results,
      attendance,
      payments
    });
  });

  app.post('/api/students', (req, res) => {
    const count = db.students.length + 1;
    const admissionNo = req.body.admissionNumber || `MILA-2025-${String(count).padStart(4, '0')}`;
    const newStudent = {
      id: `student-${Date.now()}`,
      schoolId: req.body.schoolId || 'school-1',
      admissionNumber: admissionNo,
      status: 'enrolled' as const,
      enrollmentDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.students.unshift(newStudent);
    addAuditLog(newStudent.schoolId, 'admin', 'Administrator', 'school_admin', 'REGISTER_STUDENT', 'Student', newStudent.id, `Enrolled student ${newStudent.firstName} ${newStudent.lastName} (${admissionNo})`);
    res.status(201).json(newStudent);
  });

  app.put('/api/students/:id', (req, res) => {
    const idx = db.students.findIndex(s => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Student not found' });
    db.students[idx] = { ...db.students[idx], ...req.body };
    res.json(db.students[idx]);
  });

  app.post('/api/students/:id/promote', (req, res) => {
    const { targetGradeId, targetSectionId } = req.body;
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    student.gradeLevelId = targetGradeId;
    student.sectionId = targetSectionId;
    student.status = 'promoted';
    addAuditLog(student.schoolId, 'admin', 'Administrator', 'school_admin', 'PROMOTE_STUDENT', 'Student', student.id, `Promoted ${student.firstName} ${student.lastName} to new grade.`);
    res.json({ success: true, student });
  });

  // --- TEACHERS & STAFF ---
  app.get('/api/teachers', (req, res) => res.json(db.teachers));
  app.post('/api/teachers', (req, res) => {
    const newTeacher = {
      id: `teacher-${Date.now()}`,
      schoolId: req.body.schoolId || 'school-1',
      employeeId: `EMP-${String(db.teachers.length + 15).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.teachers.unshift(newTeacher);
    res.status(201).json(newTeacher);
  });

  // --- PARENTS ---
  app.get('/api/parents', (req, res) => res.json(db.parents));

  // --- ATTENDANCE ---
  app.get('/api/attendance', (req, res) => {
    const { sectionId, date } = req.query;
    let records = [...db.attendance];
    if (sectionId) records = records.filter(r => r.sectionId === sectionId);
    if (date) records = records.filter(r => r.date === date);
    res.json(records);
  });

  app.post('/api/attendance/bulk', (req, res) => {
    const { date, sectionId, records, markedByUserId } = req.body;
    // Remove existing for this date & section
    db.attendance = db.attendance.filter(a => !(a.date === date && a.sectionId === sectionId));
    const newRecords = (records || []).map((r: any) => ({
      id: `att-${Date.now()}-${Math.random()}`,
      schoolId: 'school-1',
      date,
      sectionId,
      studentId: r.studentId,
      status: r.status,
      remarks: r.remarks,
      markedByUserId: markedByUserId || 'user-teacher-1',
      createdAt: new Date().toISOString()
    }));
    db.attendance.push(...newRecords);
    addAuditLog('school-1', markedByUserId || 'teacher', 'Teacher', 'teacher', 'MARK_ATTENDANCE', 'Attendance', sectionId, `Recorded attendance for ${newRecords.length} students on ${date}`);
    res.json({ success: true, count: newRecords.length });
  });

  // --- EXAMS & GRADES ---
  app.get('/api/exams', (req, res) => res.json(db.exams));
  app.post('/api/exams', (req, res) => {
    const newExam = {
      id: `exam-${Date.now()}`,
      schoolId: 'school-1',
      isPublished: true,
      isLocked: false,
      questions: [],
      ...req.body
    };
    db.exams.unshift(newExam);
    res.status(201).json(newExam);
  });

  app.get('/api/results', (req, res) => {
    const { studentId, examId, subjectId } = req.query;
    let list = [...db.results];
    if (studentId) list = list.filter(r => r.studentId === studentId);
    if (examId) list = list.filter(r => r.examId === examId);
    if (subjectId) list = list.filter(r => r.subjectId === subjectId);
    res.json(list);
  });

  app.post('/api/results', (req, res) => {
    const { studentId, examId, subjectId, score, maxScore, letterGrade, remarks, markedByTeacherId } = req.body;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const existingIdx = db.results.findIndex(r => r.studentId === studentId && r.examId === examId);
    const resultObj = {
      id: existingIdx !== -1 ? db.results[existingIdx].id : `res-${Date.now()}`,
      schoolId: 'school-1',
      examId,
      studentId,
      subjectId,
      score,
      maxScore,
      percentage,
      letterGrade: letterGrade || (percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 50 ? 'C' : 'F'),
      remarks,
      markedByTeacherId: markedByTeacherId || 'user-teacher-1',
      submittedAt: new Date().toISOString()
    };
    if (existingIdx !== -1) {
      db.results[existingIdx] = resultObj;
    } else {
      db.results.push(resultObj);
    }
    res.json(resultObj);
  });

  // --- TIMETABLE ---
  app.get('/api/timetable', (req, res) => {
    const { sectionId } = req.query;
    if (sectionId) {
      return res.json(db.timetable.filter(t => t.sectionId === sectionId));
    }
    res.json(db.timetable);
  });

  // --- FINANCE & FEES ---
  app.get('/api/fee-structures', (req, res) => res.json(db.feeStructures));
  app.get('/api/payments', (req, res) => {
    const { studentId } = req.query;
    if (studentId) return res.json(db.payments.filter(p => p.studentId === studentId));
    res.json(db.payments);
  });

  app.post('/api/payments', (req, res) => {
    const receiptNo = `RCP-ETH-${new Date().getFullYear()}-${String(db.payments.length + 100).padStart(4, '0')}`;
    const newPayment = {
      id: `pay-${Date.now()}`,
      schoolId: 'school-1',
      receiptNumber: receiptNo,
      status: 'completed' as const,
      paymentDate: new Date().toISOString().split('T')[0],
      recordedByUserId: 'user-accountant-1',
      ...req.body
    };
    db.payments.unshift(newPayment);
    addAuditLog('school-1', 'accountant', 'Accountant', 'accountant', 'RECORD_PAYMENT', 'PaymentTransaction', newPayment.id, `Recorded payment of ${newPayment.amount} ETB for student ${newPayment.studentId} via ${newPayment.paymentMethod}`);
    res.status(201).json(newPayment);
  });

  // --- HR & PAYROLL ---
  app.get('/api/payroll', (req, res) => res.json(db.payroll));
  app.post('/api/payroll', (req, res) => {
    const newPayroll = {
      id: `pr-${Date.now()}`,
      schoolId: 'school-1',
      status: 'paid' as const,
      paymentDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.payroll.unshift(newPayroll);
    res.status(201).json(newPayroll);
  });

  // --- LIBRARY ---
  app.get('/api/library/books', (req, res) => res.json(db.libraryBooks));
  app.get('/api/library/loans', (req, res) => res.json(db.bookLoans));

  app.post('/api/library/borrow', (req, res) => {
    const { bookId, borrowerId, borrowerName, borrowerType } = req.body;
    const book = db.libraryBooks.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ error: 'Book is not available for borrowing' });
    }
    book.availableCopies -= 1;
    const loan = {
      id: `loan-${Date.now()}`,
      schoolId: 'school-1',
      bookId,
      borrowerType: borrowerType || 'student',
      borrowerId,
      borrowerName,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'borrowed' as const
    };
    db.bookLoans.unshift(loan);
    res.json({ success: true, loan, book });
  });

  app.post('/api/library/return', (req, res) => {
    const { loanId } = req.body;
    const loan = db.bookLoans.find(l => l.id === loanId);
    if (!loan) return res.status(404).json({ error: 'Loan record not found' });
    loan.status = 'returned';
    loan.returnDate = new Date().toISOString().split('T')[0];
    const book = db.libraryBooks.find(b => b.id === loan.bookId);
    if (book) book.availableCopies += 1;
    res.json({ success: true, loan });
  });

  // --- INVENTORY & ASSETS ---
  app.get('/api/inventory', (req, res) => res.json(db.assets));
  app.post('/api/inventory', (req, res) => {
    const asset = {
      id: `asset-${Date.now()}`,
      schoolId: 'school-1',
      assetCode: `AST-${String(db.assets.length + 100).padStart(4, '0')}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.assets.unshift(asset);
    res.status(201).json(asset);
  });

  // --- TRANSPORT ---
  app.get('/api/transport', (req, res) => res.json(db.transportRoutes));

  // --- ADMISSIONS ---
  app.get('/api/admissions', (req, res) => res.json(db.admissions));
  app.post('/api/admissions', (req, res) => {
    const application = {
      id: `adm-${Date.now()}`,
      schoolId: 'school-1',
      status: 'under_review' as const,
      submissionDate: new Date().toISOString().split('T')[0],
      ...req.body
    };
    db.admissions.unshift(application);
    res.status(201).json(application);
  });

  app.patch('/api/admissions/:id/status', (req, res) => {
    const { status, interviewDate, notes } = req.body;
    const adm = db.admissions.find(a => a.id === req.params.id);
    if (!adm) return res.status(404).json({ error: 'Admission not found' });
    adm.status = status;
    if (interviewDate) adm.interviewDate = interviewDate;
    if (notes) adm.notes = notes;

    // If enrolled, auto-create student record
    if (status === 'enrolled') {
      const names = adm.applicantName.split(' ');
      const newStudent = {
        id: `student-${Date.now()}`,
        schoolId: adm.schoolId,
        admissionNumber: `MILA-2025-${String(db.students.length + 1).padStart(4, '0')}`,
        firstName: names[0] || 'Student',
        middleName: names[1] || 'Middle',
        lastName: names[2] || 'Last',
        gender: adm.gender,
        dateOfBirth: adm.dateOfBirth,
        gradeLevelId: adm.applyingGradeId,
        sectionId: 'sec-9a',
        academicYearId: 'ay-2017',
        parentName: adm.parentName,
        parentPhone: adm.parentPhone,
        parentEmail: adm.parentEmail,
        address: 'Addis Ababa',
        city: 'Addis Ababa',
        status: 'enrolled' as const,
        enrollmentDate: new Date().toISOString().split('T')[0]
      };
      db.students.unshift(newStudent);
    }
    res.json(adm);
  });

  // --- LMS: COURSES, MODULES & LESSONS ---
  app.get('/api/lms/courses', (req, res) => res.json(db.lmsCourses));
  app.get('/api/lms/courses/:id', (req, res) => {
    const course = db.lmsCourses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  });

  app.post('/api/lms/courses', (req, res) => {
    const newCourse = {
      id: `lms-${Date.now()}`,
      schoolId: 'school-1',
      academicYearId: 'ay-2017',
      totalModules: 0,
      totalLessons: 0,
      enrolledStudentsCount: 35,
      isPublished: true,
      modules: [],
      ...req.body
    };
    db.lmsCourses.unshift(newCourse);
    res.status(201).json(newCourse);
  });

  app.post('/api/lms/courses/:id/modules', (req, res) => {
    const course = db.lmsCourses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    const newModule = {
      id: `mod-${Date.now()}`,
      courseId: course.id,
      title: req.body.title || 'New Module',
      order: course.modules.length + 1,
      lessons: []
    };
    course.modules.push(newModule);
    course.totalModules = course.modules.length;
    res.status(201).json(newModule);
  });

  app.post('/api/lms/modules/:moduleId/lessons', (req, res) => {
    for (const course of db.lmsCourses) {
      const moduleObj = course.modules.find(m => m.id === req.params.moduleId);
      if (moduleObj) {
        const newLesson = {
          id: `les-${Date.now()}`,
          moduleId: moduleObj.id,
          courseId: course.id,
          title: req.body.title || 'New Lesson',
          order: moduleObj.lessons.length + 1,
          durationMinutes: req.body.durationMinutes || 45,
          content: req.body.content || '',
          contentType: req.body.contentType || 'video',
          videoUrl: req.body.videoUrl,
          attachmentName: req.body.attachmentName,
          isCompleted: false
        };
        moduleObj.lessons.push(newLesson);
        course.totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
        return res.status(201).json(newLesson);
      }
    }
    res.status(404).json({ error: 'Module not found' });
  });

  // --- LMS: ASSIGNMENTS & SUBMISSIONS ---
  app.get('/api/lms/assignments', (req, res) => res.json(db.lmsAssignments));
  app.post('/api/lms/assignments', (req, res) => {
    const newAssignment = {
      id: `assign-${Date.now()}`,
      schoolId: 'school-1',
      teacherId: 'teacher-1',
      submissionsCount: 0,
      totalAssignedCount: 35,
      ...req.body
    };
    db.lmsAssignments.unshift(newAssignment);
    res.status(201).json(newAssignment);
  });

  app.get('/api/lms/submissions', (req, res) => res.json(db.lmsSubmissions));
  app.post('/api/lms/submissions', (req, res) => {
    const { assignmentId, studentId, studentName, textAnswer, fileName } = req.body;
    const submission = {
      id: `subm-${Date.now()}`,
      assignmentId,
      studentId: studentId || 'student-1',
      studentName: studentName || 'Yonas Haile',
      submittedAt: new Date().toISOString(),
      textAnswer,
      fileName: fileName || 'Submitted_Assignment.pdf',
      status: 'submitted' as const
    };
    db.lmsSubmissions.push(submission);
    const assign = db.lmsAssignments.find(a => a.id === assignmentId);
    if (assign) assign.submissionsCount += 1;
    res.status(201).json(submission);
  });

  app.post('/api/lms/submissions/:id/grade', (req, res) => {
    const { score, feedback } = req.body;
    const subm = db.lmsSubmissions.find(s => s.id === req.params.id);
    if (!subm) return res.status(404).json({ error: 'Submission not found' });
    subm.score = score;
    subm.feedback = feedback;
    subm.status = 'graded';
    res.json(subm);
  });

  // --- LMS: QUIZZES ---
  app.get('/api/lms/quizzes', (req, res) => res.json(db.lmsQuizzes));
  app.post('/api/lms/quizzes', (req, res) => {
    const quiz = {
      id: `quiz-${Date.now()}`,
      schoolId: 'school-1',
      isPublished: true,
      ...req.body
    };
    db.lmsQuizzes.unshift(quiz);
    res.status(201).json(quiz);
  });

  // --- LMS: LIVE CLASSES ---
  app.get('/api/lms/live-classes', (req, res) => res.json(db.lmsLiveClasses));
  app.post('/api/lms/live-classes', (req, res) => {
    const live = {
      id: `live-${Date.now()}`,
      schoolId: 'school-1',
      status: 'upcoming' as const,
      attendeesCount: 0,
      ...req.body
    };
    db.lmsLiveClasses.unshift(live);
    res.status(201).json(live);
  });

  // --- LMS: CERTIFICATES ---
  app.get('/api/lms/certificates', (req, res) => res.json(db.certificates));

  // --- ANNOUNCEMENTS & NOTIFICATIONS ---
  app.get('/api/announcements', (req, res) => res.json(db.announcements));
  app.post('/api/announcements', (req, res) => {
    const ann = {
      id: `ann-${Date.now()}`,
      schoolId: 'school-1',
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.announcements.unshift(ann);
    res.status(201).json(ann);
  });

  app.get('/api/notifications', (req, res) => res.json(db.notifications));
  app.patch('/api/notifications/:id/read', (req, res) => {
    const notif = db.notifications.find(n => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  });

  // --- AUDIT LOGS ---
  app.get('/api/audit-logs', (req, res) => res.json(db.auditLogs));

  // --- AI ASSISTANT (Gemini Integration with Fallback) ---
  app.post('/api/ai/student-insight', async (req, res) => {
    const { studentId, studentName, subjectScores } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `As an expert pedagogical advisor for Ethiopian high schools, analyze the following academic performance for Student ${studentName || 'Student'}:
${JSON.stringify(subjectScores || { Physics: '95%', Math: '88%', Chemistry: '74%', Biology: '82%' })}

Provide:
1. Academic strengths analysis.
2. Areas needing reinforcement in preparation for Ethiopian National Examination.
3. 3 concrete actionable study recommendations for the student and teacher.
Keep the output concise, supportive, and formatted in clean Markdown.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        return res.json({ insight: response.text });
      } catch (err: any) {
        console.error('Gemini API Error:', err);
      }
    }

    // Fallback smart pedagogical response if key not configured
    res.json({
      insight: `### 📊 Academic Performance Diagnostic for ${studentName || 'Yonas Haile'}
- **Top Strengths**: Exceptional mastery in **Physics (95.0%)** and **Mathematics (88%)**, demonstrating superior conceptual grasp of calculus and Newtonian mechanics.
- **Reinforcement Target**: Recommend additional focus on **Chemistry Organic Synthesis reactions** and lab practical write-ups.
- **Ethiopian National Exam Prep Recommendations**:
  1. Practice 5 past national matriculation exam problem sets for 2D kinematics weekly.
  2. Utilize the LMS Interactive Module on reaction pathways for Chemistry.
  3. Form a study group for peer explanation on vector physics derivations.`
    });
  });

  app.post('/api/ai/generate-quiz-questions', async (req, res) => {
    const { topic, gradeLevel, count } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Generate ${count || 3} multiple-choice quiz questions for Ethiopian Grade ${gradeLevel || 11} on the topic "${topic || 'Newtonian Mechanics'}".
Format as JSON array with properties:
- id (string)
- questionText (string)
- options (array of 4 strings)
- correctAnswer (string matching one option)
- points (number e.g. 5)
- explanation (string)`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });

        const parsed = JSON.parse(response.text || '[]');
        return res.json({ questions: parsed });
      } catch (err: any) {
        console.error('AI quiz generation error:', err);
      }
    }

    // High quality default question generation fallback
    res.json({
      questions: [
        {
          id: `ai-q-${Date.now()}-1`,
          type: 'mcq',
          questionText: `Which of the following principles best explains why an astronaut floats inside an orbiting space station regarding ${topic || 'Gravitation'}?`,
          options: ['There is zero gravity in orbit', 'The spacecraft and astronaut are in continuous free-fall together', 'Atmospheric buoyancy cancels mass', 'Centrifugal force eliminates gravity entirely'],
          correctAnswer: 'The spacecraft and astronaut are in continuous free-fall together',
          points: 5,
          explanation: 'Both the station and occupants accelerate toward Earth at the exact same rate under gravity.'
        },
        {
          id: `ai-q-${Date.now()}-2`,
          type: 'mcq',
          questionText: `What is the net work done on an object when it moves in a closed circular path returning to its starting point in a conservative field?`,
          options: ['Zero Joules', 'Equal to kinetic energy', 'F * 2 * pi * r', 'Infinite'],
          correctAnswer: 'Zero Joules',
          points: 5,
          explanation: 'In any conservative vector field, the line integral over a closed loop is exactly zero.'
        }
      ]
    });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EthioSchool OS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
