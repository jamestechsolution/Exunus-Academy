export type UserRole =
  | 'super_admin'
  | 'school_admin'
  | 'principal'
  | 'vice_principal'
  | 'academic_director'
  | 'registrar'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'hr_manager'
  | 'librarian'
  | 'transport_manager'
  | 'store_manager'
  | 'staff';

export type LanguageCode = 'en' | 'am' | 'om';
export type CalendarType = 'ethiopian' | 'gregorian';

export interface User {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  linkedStudentIds?: string[]; // For parents
  teacherProfileId?: string;
  studentProfileId?: string;
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
  nameAm?: string;
  nameOm?: string;
  code: string;
  logo?: string;
  motto?: string;
  region: string;
  city: string;
  subcity?: string;
  woreda?: string;
  phone: string;
  email: string;
  website?: string;
  plan: 'free_trial' | 'basic' | 'standard' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired';
  currentAcademicYearId: string;
  defaultCalendar: CalendarType;
  defaultLanguage: LanguageCode;
  gradingSystemId: string;
  createdAt: string;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string; // e.g. "2017-2018 E.C. (2024-2025 G.C.)"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  terms: Term[];
}

export interface Term {
  id: string;
  name: string; // e.g. "Semester 1", "Semester 2", or "Quarter 1"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface GradeLevel {
  id: string;
  schoolId: string;
  name: string; // e.g. "Grade 9", "Grade 10", "Grade 11 Natural", "Grade 12 Social"
  level: number; // 9, 10, 11, 12
  stream?: 'general' | 'natural_science' | 'social_science';
}

export interface Section {
  id: string;
  schoolId: string;
  gradeLevelId: string;
  name: string; // e.g. "9-A", "10-B"
  roomNumber: string;
  capacity: number;
  homeroomTeacherId?: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  gradeLevelId: string;
  name: string; // e.g. "Mathematics", "Physics", "Amharic", "Afaan Oromoo"
  code: string; // e.g. "MATH9", "PHY10"
  creditHours: number;
  isMandatory: boolean;
  lmsCourseId?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  userId?: string;
  admissionNumber: string;
  nationalId?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  firstNameAm?: string;
  middleNameAm?: string;
  lastNameAm?: string;
  gender: 'male' | 'female';
  dateOfBirth: string; // YYYY-MM-DD
  gradeLevelId: string;
  sectionId: string;
  academicYearId: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  address: string;
  city: string;
  woreda?: string;
  photo?: string;
  status: 'enrolled' | 'promoted' | 'graduated' | 'transferred' | 'suspended' | 'withdrawn';
  enrollmentDate: string;
  bloodGroup?: string;
  emergencyContact?: string;
}

export interface Teacher {
  id: string;
  schoolId: string;
  userId: string;
  employeeId: string;
  fullName: string;
  fullNameAm?: string;
  gender: 'male' | 'female';
  qualification: string; // "B.Ed in Mathematics", "M.Sc Physics"
  department: string;
  phone: string;
  email: string;
  photo?: string;
  specialization: string[];
  assignedSubjectIds: string[];
  assignedSectionIds: string[];
  employmentType: 'full_time' | 'part_time' | 'contract';
  joinDate: string;
  salary: number;
}

export interface Parent {
  id: string;
  schoolId: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  occupation?: string;
  address: string;
  emergencyContact: string;
  linkedStudentIds: string[];
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  date: string; // YYYY-MM-DD
  sectionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedByUserId: string;
  remarks?: string;
  createdAt: string;
}

export interface GradeRule {
  minScore: number;
  maxScore: number;
  letter: string;
  gradePoint: number;
  description: string;
}

export interface GradingSystem {
  id: string;
  schoolId: string;
  name: string; // e.g. "Ethiopian National Standard (A+-F)"
  rules: GradeRule[];
}

export interface AssessmentType {
  id: string;
  name: string; // e.g. "Continuous Assessment 1", "Midterm Exam", "Final Exam", "Assignment"
  weight: number; // e.g. 20%, 30%, 50%
}

export interface Exam {
  id: string;
  schoolId: string;
  academicYearId: string;
  termId: string;
  gradeLevelId: string;
  sectionId?: string;
  subjectId: string;
  title: string;
  type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'practical';
  maxScore: number;
  weightPercentage: number;
  examDate: string;
  startTime?: string;
  durationMinutes?: number;
  isOnline: boolean;
  isPublished: boolean;
  isLocked: boolean;
  questions?: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'short_answer' | 'essay' | 'matching';
  questionText: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

export interface ExamResult {
  id: string;
  schoolId: string;
  examId: string;
  studentId: string;
  subjectId: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  remarks?: string;
  markedByTeacherId: string;
  submittedAt?: string;
  answers?: Record<string, any>;
}

export interface TimetableSlot {
  id: string;
  schoolId: string;
  sectionId: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  roomNumber: string;
}

export interface FeeStructure {
  id: string;
  schoolId: string;
  academicYearId: string;
  gradeLevelId: string;
  title: string; // e.g. "Monthly Tuition Fee", "Registration Fee", "Lab Fee"
  amount: number; // in ETB (Ethiopian Birr)
  frequency: 'monthly' | 'termly' | 'annually' | 'one_time';
  dueDate: string;
}

export interface PaymentTransaction {
  id: string;
  schoolId: string;
  receiptNumber: string;
  studentId: string;
  feeStructureId?: string;
  amount: number;
  paymentMethod: 'telebirr' | 'cbe_birr' | 'chapa' | 'bank_transfer' | 'cash' | 'check';
  referenceNumber: string;
  status: 'completed' | 'pending' | 'failed';
  paymentDate: string;
  recordedByUserId: string;
  description: string;
  receiptUrl?: string;
}

export interface PayrollRecord {
  id: string;
  schoolId: string;
  employeeId: string;
  employeeName: string;
  role: string;
  month: string; // e.g. "Meskerem 2017" / "September 2024"
  year?: number;
  basicSalary: number;
  allowances: number;
  grossSalary: number;
  incomeTax: number;
  employeePension: number; // 7% in Ethiopia
  employerPension?: number;
  otherDeductions: number;
  netSalary: number;
  status: 'paid' | 'pending' | 'draft';
  paymentDate?: string;
}

export interface LibraryBook {
  id: string;
  schoolId: string;
  title: string;
  titleAm?: string;
  author: string;
  isbn: string;
  category: string;
  gradeLevel?: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage?: string;
}

export interface BookLoan {
  id: string;
  schoolId: string;
  bookId: string;
  borrowerType: 'student' | 'teacher';
  borrowerId: string;
  borrowerName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fineAmount?: number;
}

export interface SchoolAsset {
  id: string;
  schoolId: string;
  assetCode: string;
  name: string;
  category: 'it_equipment' | 'furniture' | 'lab_apparatus' | 'vehicle' | 'library' | 'sports';
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs_repair' | 'retired';
  purchaseDate: string;
  purchaseValue: number;
  assignedTo?: string;
}

export interface TransportRoute {
  id: string;
  schoolId: string;
  name: string; // e.g. "Route 1 - Bole / CMC / Ayat"
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  assignedStudentsCount: number;
  stops: { name: string; pickupTime: string; dropTime: string }[];
}

export interface AdmissionApplication {
  id: string;
  schoolId: string;
  applicantName: string;
  applicantNameAm?: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  applyingGradeId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  previousSchool?: string;
  status: 'pending' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected' | 'enrolled';
  submissionDate: string;
  interviewDate?: string;
  notes?: string;
}

// LMS Interfaces
export interface LMSCourse {
  id: string;
  schoolId: string;
  subjectId: string;
  gradeLevelId: string;
  teacherId: string;
  title: string;
  titleAm?: string;
  description: string;
  thumbnail: string;
  coverImage?: string;
  academicYearId: string;
  totalModules: number;
  totalLessons: number;
  enrolledStudentsCount: number;
  isPublished: boolean;
  modules: LMSModule[];
}

export interface LMSModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: LMSLesson[];
}

export interface LMSLesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  order: number;
  durationMinutes: number;
  content: string;
  contentType: 'video' | 'pdf' | 'document' | 'interactive' | 'audio';
  videoUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  isCompleted?: boolean;
}

export interface LMSAssignment {
  id: string;
  schoolId: string;
  courseId: string;
  teacherId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  attachments?: { name: string; url: string; size?: string }[];
  submissionsCount: number;
  totalAssignedCount: number;
}

export interface LMSAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  fileUrl?: string;
  fileName?: string;
  textAnswer?: string;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
}

export interface LMSQuiz {
  id: string;
  schoolId: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalPoints: number;
  passPercentage: number;
  questions: ExamQuestion[];
  isPublished: boolean;
}

export interface LMSQuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: Record<string, string | string[]>;
}

export interface LMSLiveClass {
  id: string;
  schoolId: string;
  courseId: string;
  teacherId: string;
  title: string;
  topic: string;
  scheduledAt: string;
  durationMinutes: number;
  platform: 'google_meet' | 'zoom' | 'teams' | 'in_app';
  meetingUrl: string;
  meetingPassword?: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  attendeesCount: number;
  recordingUrl?: string;
}

export interface LMSCertificate {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateNumber: string;
  verificationCode: string;
  signatureUrl?: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'staff';
  gradeLevelId?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  createdAt: string;
  attachments?: string[];
}

export interface SMSNotificationLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  studentId: string;
  studentName: string;
  studentAdmissionNo: string;
  sectionName?: string;
  message: string;
  status: 'delivered' | 'pending' | 'failed';
  carrier: string;
  timestamp: string;
  deliveryTime?: string;
  costEtb?: number;
  triggerType: 'absence' | 'late' | 'fee_reminder' | 'report_card' | 'manual';
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'academic' | 'fee' | 'attendance' | 'exam' | 'system' | 'message';
  isRead: boolean;
  createdAt: string;
  link?: string;
  smsLogId?: string;
  metadata?: Record<string, any>;
}

export interface AuditLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export type LMSSubmission = LMSAssignmentSubmission;
export type InventoryItem = SchoolAsset;
export type LMSQuizQuestion = ExamQuestion;
