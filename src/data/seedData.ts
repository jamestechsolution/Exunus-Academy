import {
  School,
  AcademicYear,
  GradeLevel,
  Section,
  Subject,
  User,
  Student,
  Teacher,
  Parent,
  AttendanceRecord,
  GradingSystem,
  Exam,
  ExamResult,
  TimetableSlot,
  FeeStructure,
  PaymentTransaction,
  PayrollRecord,
  LibraryBook,
  BookLoan,
  SchoolAsset,
  TransportRoute,
  AdmissionApplication,
  LMSCourse,
  LMSAssignment,
  LMSAssignmentSubmission,
  LMSQuiz,
  LMSLiveClass,
  LMSCertificate,
  Announcement,
  AppNotification,
  AuditLog
} from '../types';

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'school-1',
    name: 'Exunus Academy',
    nameAm: 'ኤክሱነስ አካዳሚ አጠቃላይ ሁለተኛ ደረጃ ትምህርት ቤት',
    nameOm: 'Mana Barumsaa Sadarkaa 2ffaa Exunus Finfinnee',
    code: 'EXUNUS-01',
    logo: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80',
    motto: 'Excellence in Education, Integrity in Character (የላቀ ትምህርት ለነገው መሪ)',
    region: 'Addis Ababa',
    city: 'Addis Ababa',
    subcity: 'Bole',
    woreda: 'Woreda 03',
    phone: '+251 11 661 2345',
    email: 'info@exunus.edu.et',
    website: 'www.exunus.edu.et',
    plan: 'enterprise',
    subscriptionStatus: 'active',
    currentAcademicYearId: 'ay-2017',
    defaultCalendar: 'ethiopian',
    defaultLanguage: 'en',
    gradingSystemId: 'gs-ethiopian-std',
    createdAt: '2024-01-01'
  },
  {
    id: 'school-2',
    name: 'Oromia Excellence Model School',
    nameAm: 'ኦሮሚያ የልህቀት ሞዴል ትምህርት ቤት',
    nameOm: 'Mana Barumsaa Addaa Moodeela Oromiyaa',
    code: 'OEMS-002',
    logo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80',
    motto: 'Guddina fi Beekumsaaf (Towards Knowledge and Prosperity)',
    region: 'Oromia',
    city: 'Adama',
    phone: '+251 22 111 8899',
    email: 'contact@oromiaexcellence.edu.et',
    plan: 'standard',
    subscriptionStatus: 'active',
    currentAcademicYearId: 'ay-2017',
    defaultCalendar: 'ethiopian',
    defaultLanguage: 'om',
    gradingSystemId: 'gs-ethiopian-std',
    createdAt: '2024-02-15'
  }
];

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2017',
    schoolId: 'school-1',
    name: '2017/2018 E.C. (2024/2025 G.C.)',
    startDate: '2024-09-11',
    endDate: '2025-07-07',
    isCurrent: true,
    terms: [
      {
        id: 'term-1',
        name: 'Semester I (ሴሚስተር 1)',
        startDate: '2024-09-11',
        endDate: '2025-01-30',
        isCurrent: false
      },
      {
        id: 'term-2',
        name: 'Semester II (ሴሚስተር 2)',
        startDate: '2025-02-10',
        endDate: '2025-07-07',
        isCurrent: true
      }
    ]
  }
];

export const INITIAL_GRADE_LEVELS: GradeLevel[] = [
  { id: 'gl-9', schoolId: 'school-1', name: 'Grade 9 (9ኛ ክፍል)', level: 9, stream: 'general' },
  { id: 'gl-10', schoolId: 'school-1', name: 'Grade 10 (10ኛ ክፍል)', level: 10, stream: 'general' },
  { id: 'gl-11-nat', schoolId: 'school-1', name: 'Grade 11 Natural Science (11ኛ የተፈጥሮ ሳይንስ)', level: 11, stream: 'natural_science' },
  { id: 'gl-11-soc', schoolId: 'school-1', name: 'Grade 11 Social Science (11ኛ ማህበራዊ ሳይንስ)', level: 11, stream: 'social_science' },
  { id: 'gl-12-nat', schoolId: 'school-1', name: 'Grade 12 Natural Science (12ኛ የተፈጥሮ ሳይንስ)', level: 12, stream: 'natural_science' },
  { id: 'gl-12-soc', schoolId: 'school-1', name: 'Grade 12 Social Science (12ኛ ማህበራዊ ሳይንስ)', level: 12, stream: 'social_science' }
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 'sec-9a', schoolId: 'school-1', gradeLevelId: 'gl-9', name: 'Section 9-A', roomNumber: 'Block A - 101', capacity: 40, homeroomTeacherId: 'teacher-1' },
  { id: 'sec-9b', schoolId: 'school-1', gradeLevelId: 'gl-9', name: 'Section 9-B', roomNumber: 'Block A - 102', capacity: 40, homeroomTeacherId: 'teacher-2' },
  { id: 'sec-10a', schoolId: 'school-1', gradeLevelId: 'gl-10', name: 'Section 10-A', roomNumber: 'Block A - 201', capacity: 38, homeroomTeacherId: 'teacher-3' },
  { id: 'sec-11na', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Section 11-Nat-A', roomNumber: 'Block B - 101', capacity: 35, homeroomTeacherId: 'teacher-1' },
  { id: 'sec-12na', schoolId: 'school-1', gradeLevelId: 'gl-12-nat', name: 'Section 12-Nat-A', roomNumber: 'Block B - 201', capacity: 35, homeroomTeacherId: 'teacher-2' }
];

export const INITIAL_SUBJECTS: Subject[] = [
  { id: 'sub-math-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Mathematics (ሒሳብ)', code: 'MATH-11', creditHours: 5, isMandatory: true, lmsCourseId: 'lms-math-11' },
  { id: 'sub-phy-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Physics (ፊዚክስ)', code: 'PHY-11', creditHours: 4, isMandatory: true, lmsCourseId: 'lms-phy-11' },
  { id: 'sub-chem-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Chemistry (ኬሚስትሪ)', code: 'CHEM-11', creditHours: 4, isMandatory: true, lmsCourseId: 'lms-chem-11' },
  { id: 'sub-bio-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Biology (ባዮሎጂ)', code: 'BIO-11', creditHours: 4, isMandatory: true, lmsCourseId: 'lms-bio-11' },
  { id: 'sub-eng-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'English (እንግሊዝኛ)', code: 'ENG-11', creditHours: 4, isMandatory: true, lmsCourseId: 'lms-eng-11' },
  { id: 'sub-amh-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Amharic (አማርኛ ቋንቋ)', code: 'AMH-11', creditHours: 3, isMandatory: true },
  { id: 'sub-it-11', schoolId: 'school-1', gradeLevelId: 'gl-11-nat', name: 'Information Technology (IT)', code: 'IT-11', creditHours: 3, isMandatory: false, lmsCourseId: 'lms-it-11' }
];

export const INITIAL_GRADING_SYSTEM: GradingSystem = {
  id: 'gs-ethiopian-std',
  schoolId: 'school-1',
  name: 'Ethiopian National Secondary Standard',
  rules: [
    { minScore: 90, maxScore: 100, letter: 'A+', gradePoint: 4.0, description: 'Excellent / እጅግ በጣም ጥሩ' },
    { minScore: 85, maxScore: 89.99, letter: 'A', gradePoint: 4.0, description: 'Very High / በጣም ጥሩ' },
    { minScore: 80, maxScore: 84.99, letter: 'A-', gradePoint: 3.75, description: 'High / ከፍተኛ' },
    { minScore: 75, maxScore: 79.99, letter: 'B+', gradePoint: 3.5, description: 'Good / ጥሩ' },
    { minScore: 70, maxScore: 74.99, letter: 'B', gradePoint: 3.0, description: 'Satisfactory / መካከለኛ' },
    { minScore: 65, maxScore: 69.99, letter: 'C+', gradePoint: 2.5, description: 'Average / አማካይ' },
    { minScore: 50, maxScore: 64.99, letter: 'C', gradePoint: 2.0, description: 'Pass / ማለፊያ' },
    { minScore: 0, maxScore: 49.99, letter: 'F', gradePoint: 0.0, description: 'Fail / የወደቀ' }
  ]
};

export const INITIAL_USERS: User[] = [
  {
    id: 'user-superadmin',
    schoolId: 'school-1',
    name: 'Dr. Zewdu Bekele',
    email: 'superadmin@ethioschool.edu.et',
    phone: '+251 91 122 3344',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-01-01'
  },
  {
    id: 'user-admin',
    schoolId: 'school-1',
    name: 'W/ro Aster Mamo',
    email: 'admin@millennium.edu.et',
    phone: '+251 91 234 5678',
    role: 'school_admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-01-02'
  },
  {
    id: 'user-principal',
    schoolId: 'school-1',
    name: 'Ato Girma Wolde',
    email: 'principal@millennium.edu.et',
    phone: '+251 91 345 6789',
    role: 'principal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-01-02'
  },
  {
    id: 'user-teacher-1',
    schoolId: 'school-1',
    name: 'Ato Haile Tadesse',
    email: 'haile.tadesse@millennium.edu.et',
    phone: '+251 91 456 7890',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    teacherProfileId: 'teacher-1',
    createdAt: '2024-01-05'
  },
  {
    id: 'user-teacher-2',
    schoolId: 'school-1',
    name: 'W/t Tigist Assefa',
    email: 'tigist.assefa@millennium.edu.et',
    phone: '+251 91 567 8901',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    teacherProfileId: 'teacher-2',
    createdAt: '2024-01-05'
  },
  {
    id: 'user-student-1',
    schoolId: 'school-1',
    name: 'Yonas Haile Kebede',
    email: 'yonas.haile@millennium.edu.et',
    phone: '+251 92 111 2233',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    studentProfileId: 'student-1',
    createdAt: '2024-09-01'
  },
  {
    id: 'user-parent-1',
    schoolId: 'school-1',
    name: 'Ato Haile Kebede Mengistu',
    email: 'haile.kebede@gmail.com',
    phone: '+251 91 188 9900',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    linkedStudentIds: ['student-1', 'student-3'],
    createdAt: '2024-09-01'
  },
  {
    id: 'user-accountant-1',
    schoolId: 'school-1',
    name: 'Ato Dawit Alemu',
    email: 'finance@millennium.edu.et',
    phone: '+251 91 789 0123',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-01-10'
  },
  {
    id: 'user-librarian-1',
    schoolId: 'school-1',
    name: 'W/ro Genet Teshome',
    email: 'librarian@millennium.edu.et',
    phone: '+251 91 890 1234',
    role: 'librarian',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    createdAt: '2024-01-10'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'teacher-1',
    schoolId: 'school-1',
    userId: 'user-teacher-1',
    employeeId: 'EMP-014',
    fullName: 'Haile Tadesse Desta',
    fullNameAm: 'ኃይሌ ታደሰ ደስታ',
    gender: 'male',
    qualification: 'M.Sc in Physics & Applied Mathematics (Addis Ababa University)',
    department: 'Natural Sciences',
    phone: '+251 91 456 7890',
    email: 'haile.tadesse@millennium.edu.et',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    specialization: ['Physics', 'Mathematics', 'Calculus'],
    assignedSubjectIds: ['sub-math-11', 'sub-phy-11'],
    assignedSectionIds: ['sec-11na', 'sec-12na'],
    employmentType: 'full_time',
    joinDate: '2021-09-01',
    salary: 22500
  },
  {
    id: 'teacher-2',
    schoolId: 'school-1',
    userId: 'user-teacher-2',
    employeeId: 'EMP-028',
    fullName: 'Tigist Assefa Negash',
    fullNameAm: 'ትዕግሥት አሰፋ ነጋሽ',
    gender: 'female',
    qualification: 'B.Ed in Chemistry & Biology (Hawassa University)',
    department: 'Natural Sciences',
    phone: '+251 91 567 8901',
    email: 'tigist.assefa@millennium.edu.et',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialization: ['Chemistry', 'Organic Chemistry'],
    assignedSubjectIds: ['sub-chem-11', 'sub-bio-11'],
    assignedSectionIds: ['sec-11na'],
    employmentType: 'full_time',
    joinDate: '2022-09-01',
    salary: 19500
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'student-1',
    schoolId: 'school-1',
    userId: 'user-student-1',
    admissionNumber: 'MILA-2024-0089',
    nationalId: 'ETH-90812445',
    firstName: 'Yonas',
    middleName: 'Haile',
    lastName: 'Kebede',
    firstNameAm: 'ዮናስ',
    middleNameAm: 'ኃይሌ',
    lastNameAm: 'ከበደ',
    gender: 'male',
    dateOfBirth: '2008-04-12',
    gradeLevelId: 'gl-11-nat',
    sectionId: 'sec-11na',
    academicYearId: 'ay-2017',
    parentId: 'parent-1',
    parentName: 'Haile Kebede Mengistu',
    parentPhone: '+251 91 188 9900',
    parentEmail: 'haile.kebede@gmail.com',
    address: 'Bole Subcity, Woreda 03, House #412',
    city: 'Addis Ababa',
    woreda: 'Woreda 03',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrollmentDate: '2024-09-10',
    bloodGroup: 'O+',
    emergencyContact: '+251 91 188 9900 (Father)'
  },
  {
    id: 'student-2',
    schoolId: 'school-1',
    admissionNumber: 'MILA-2024-0092',
    nationalId: 'ETH-90812478',
    firstName: 'Selam',
    middleName: 'Abera',
    lastName: 'Tilahun',
    firstNameAm: 'ሰላም',
    middleNameAm: 'አበራ',
    lastNameAm: ' ጥላሁን',
    gender: 'female',
    dateOfBirth: '2008-06-25',
    gradeLevelId: 'gl-11-nat',
    sectionId: 'sec-11na',
    academicYearId: 'ay-2017',
    parentName: 'Abera Tilahun Guta',
    parentPhone: '+251 91 222 3344',
    address: 'Yeka Subcity, Woreda 07',
    city: 'Addis Ababa',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrollmentDate: '2024-09-10',
    bloodGroup: 'A+'
  },
  {
    id: 'student-3',
    schoolId: 'school-1',
    admissionNumber: 'MILA-2024-0105',
    nationalId: 'ETH-90813110',
    firstName: 'Bethel',
    middleName: 'Haile',
    lastName: 'Kebede',
    firstNameAm: 'ቤቴል',
    middleNameAm: 'ኃይሌ',
    lastNameAm: 'ከበደ',
    gender: 'female',
    dateOfBirth: '2010-09-15',
    gradeLevelId: 'gl-9',
    sectionId: 'sec-9a',
    academicYearId: 'ay-2017',
    parentId: 'parent-1',
    parentName: 'Haile Kebede Mengistu',
    parentPhone: '+251 91 188 9900',
    address: 'Bole Subcity, Woreda 03, House #412',
    city: 'Addis Ababa',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrollmentDate: '2024-09-10'
  },
  {
    id: 'student-4',
    schoolId: 'school-1',
    admissionNumber: 'MILA-2024-0044',
    firstName: 'Dawit',
    middleName: 'Tesfaye',
    lastName: 'Wolde',
    firstNameAm: 'ዳዊት',
    middleNameAm: 'ተስፋዬ',
    lastNameAm: 'ወልደ',
    gender: 'male',
    dateOfBirth: '2008-01-18',
    gradeLevelId: 'gl-11-nat',
    sectionId: 'sec-11na',
    academicYearId: 'ay-2017',
    parentName: 'Tesfaye Wolde',
    parentPhone: '+251 91 333 4455',
    address: 'Bole Medhanealem',
    city: 'Addis Ababa',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrollmentDate: '2024-09-10'
  },
  {
    id: 'student-5',
    schoolId: 'school-1',
    admissionNumber: 'MILA-2024-0012',
    firstName: 'Kalkidan',
    middleName: 'Mulugeta',
    lastName: 'Kassahun',
    firstNameAm: 'ቃልኪዳን',
    middleNameAm: 'ሙሉጌታ',
    lastNameAm: 'ካሳሁን',
    gender: 'female',
    dateOfBirth: '2007-11-04',
    gradeLevelId: 'gl-12-nat',
    sectionId: 'sec-12na',
    academicYearId: 'ay-2017',
    parentName: 'Mulugeta Kassahun',
    parentPhone: '+251 91 444 5566',
    address: 'CMC Michael',
    city: 'Addis Ababa',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'enrolled',
    enrollmentDate: '2023-09-10'
  }
];

export const INITIAL_PARENTS: Parent[] = [
  {
    id: 'parent-1',
    schoolId: 'school-1',
    userId: 'user-parent-1',
    fullName: 'Haile Kebede Mengistu',
    phone: '+251 91 188 9900',
    email: 'haile.kebede@gmail.com',
    occupation: 'Senior Telecom Engineer (Ethio Telecom)',
    address: 'Bole Subcity, Woreda 03, House #412, Addis Ababa',
    emergencyContact: '+251 91 188 9900',
    linkedStudentIds: ['student-1', 'student-3']
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', schoolId: 'school-1', date: '2025-02-24', sectionId: 'sec-11na', studentId: 'student-1', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-24T08:15:00Z' },
  { id: 'att-2', schoolId: 'school-1', date: '2025-02-24', sectionId: 'sec-11na', studentId: 'student-2', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-24T08:15:00Z' },
  { id: 'att-3', schoolId: 'school-1', date: '2025-02-24', sectionId: 'sec-11na', studentId: 'student-4', status: 'late', markedByUserId: 'user-teacher-1', remarks: 'Arrived at 8:40 AM due to transport', createdAt: '2025-02-24T08:15:00Z' },
  { id: 'att-4', schoolId: 'school-1', date: '2025-02-25', sectionId: 'sec-11na', studentId: 'student-1', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-25T08:15:00Z' },
  { id: 'att-5', schoolId: 'school-1', date: '2025-02-25', sectionId: 'sec-11na', studentId: 'student-2', status: 'absent', markedByUserId: 'user-teacher-1', remarks: 'Parent notified via SMS', createdAt: '2025-02-25T08:15:00Z' },
  { id: 'att-6', schoolId: 'school-1', date: '2025-02-25', sectionId: 'sec-11na', studentId: 'student-4', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-25T08:15:00Z' },
  { id: 'att-7', schoolId: 'school-1', date: '2025-02-26', sectionId: 'sec-11na', studentId: 'student-1', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-26T08:15:00Z' },
  { id: 'att-8', schoolId: 'school-1', date: '2025-02-26', sectionId: 'sec-11na', studentId: 'student-2', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-26T08:15:00Z' },
  { id: 'att-9', schoolId: 'school-1', date: '2025-02-26', sectionId: 'sec-11na', studentId: 'student-4', status: 'present', markedByUserId: 'user-teacher-1', createdAt: '2025-02-26T08:15:00Z' }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-phy11-mid',
    schoolId: 'school-1',
    academicYearId: 'ay-2017',
    termId: 'term-2',
    gradeLevelId: 'gl-11-nat',
    sectionId: 'sec-11na',
    subjectId: 'sub-phy-11',
    title: 'Grade 11 Physics Semester II Midterm Examination',
    type: 'midterm',
    maxScore: 30,
    weightPercentage: 30,
    examDate: '2025-03-15',
    startTime: '09:00 AM',
    durationMinutes: 90,
    isOnline: true,
    isPublished: true,
    isLocked: false,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        questionText: 'Which of Newton’s laws describes the relationship between net force, mass, and acceleration (F = ma)?',
        options: ['First Law of Inertia', 'Second Law of Motion', 'Third Law of Action-Reaction', 'Law of Universal Gravitation'],
        correctAnswer: 'Second Law of Motion',
        points: 5,
        explanation: 'Newton’s second law states that the acceleration of an object is directly proportional to net force and inversely proportional to its mass.'
      },
      {
        id: 'q2',
        type: 'true_false',
        questionText: 'In a vacuum, all objects fall with the exact same gravitational acceleration regardless of their mass.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 5,
        explanation: 'Without air resistance, g is constant (~9.8 m/s² on Earth).'
      },
      {
        id: 'q3',
        type: 'mcq',
        questionText: 'What is the SI unit of electric potential difference (Voltage)?',
        options: ['Ampere (A)', 'Joule (J)', 'Volt (V)', 'Coulomb (C)'],
        correctAnswer: 'Volt (V)',
        points: 5
      },
      {
        id: 'q4',
        type: 'short_answer',
        questionText: 'State the law of conservation of momentum in one clear sentence.',
        correctAnswer: 'The total linear momentum of an isolated system remains constant if no external forces act upon it.',
        points: 15
      }
    ]
  },
  {
    id: 'exam-math11-quiz',
    schoolId: 'school-1',
    academicYearId: 'ay-2017',
    termId: 'term-2',
    gradeLevelId: 'gl-11-nat',
    sectionId: 'sec-11na',
    subjectId: 'sub-math-11',
    title: 'Grade 11 Calculus & Derivatives Continuous Assessment Quiz',
    type: 'quiz',
    maxScore: 20,
    weightPercentage: 20,
    examDate: '2025-02-28',
    startTime: '10:30 AM',
    durationMinutes: 45,
    isOnline: true,
    isPublished: true,
    isLocked: true
  }
];

export const INITIAL_RESULTS: ExamResult[] = [
  {
    id: 'res-1',
    schoolId: 'school-1',
    examId: 'exam-phy11-mid',
    studentId: 'student-1',
    subjectId: 'sub-phy-11',
    score: 28.5,
    maxScore: 30,
    percentage: 95.0,
    letterGrade: 'A+',
    remarks: 'Outstanding analytical capability and clear problem-solving steps.',
    markedByTeacherId: 'teacher-1',
    submittedAt: '2025-03-15T10:20:00Z'
  },
  {
    id: 'res-2',
    schoolId: 'school-1',
    examId: 'exam-phy11-mid',
    studentId: 'student-2',
    subjectId: 'sub-phy-11',
    score: 26.0,
    maxScore: 30,
    percentage: 86.7,
    letterGrade: 'A',
    remarks: 'Very solid understanding of vector mechanics.',
    markedByTeacherId: 'teacher-1',
    submittedAt: '2025-03-15T10:18:00Z'
  },
  {
    id: 'res-3',
    schoolId: 'school-1',
    examId: 'exam-phy11-mid',
    studentId: 'student-4',
    subjectId: 'sub-phy-11',
    score: 22.0,
    maxScore: 30,
    percentage: 73.3,
    letterGrade: 'B',
    remarks: 'Good effort, revise rotational kinematics questions.',
    markedByTeacherId: 'teacher-1',
    submittedAt: '2025-03-15T10:25:00Z'
  }
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  { id: 'tt-1', schoolId: 'school-1', sectionId: 'sec-11na', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30', endTime: '09:15', subjectId: 'sub-math-11', teacherId: 'teacher-1', roomNumber: 'Block B-101' },
  { id: 'tt-2', schoolId: 'school-1', sectionId: 'sec-11na', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:20', endTime: '10:05', subjectId: 'sub-phy-11', teacherId: 'teacher-1', roomNumber: 'Block B-101' },
  { id: 'tt-3', schoolId: 'school-1', sectionId: 'sec-11na', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:25', endTime: '11:10', subjectId: 'sub-chem-11', teacherId: 'teacher-2', roomNumber: 'Lab 2' },
  { id: 'tt-4', schoolId: 'school-1', sectionId: 'sec-11na', dayOfWeek: 'Tuesday', periodNumber: 1, startTime: '08:30', endTime: '09:15', subjectId: 'sub-bio-11', teacherId: 'teacher-2', roomNumber: 'Block B-101' },
  { id: 'tt-5', schoolId: 'school-1', sectionId: 'sec-11na', dayOfWeek: 'Wednesday', periodNumber: 2, startTime: '09:20', endTime: '10:05', subjectId: 'sub-it-11', teacherId: 'teacher-1', roomNumber: 'Computer Lab 1' }
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  { id: 'fee-1', schoolId: 'school-1', academicYearId: 'ay-2017', gradeLevelId: 'gl-11-nat', title: 'Monthly Tuition Fee (የወር የትምህርት ክፍያ)', amount: 4800, frequency: 'monthly', dueDate: '2025-03-05' },
  { id: 'fee-2', schoolId: 'school-1', academicYearId: 'ay-2017', gradeLevelId: 'gl-11-nat', title: 'Laboratory & Science Practical Fee', amount: 1500, frequency: 'termly', dueDate: '2025-02-15' },
  { id: 'fee-3', schoolId: 'school-1', academicYearId: 'ay-2017', gradeLevelId: 'gl-11-nat', title: 'School Bus Transport (Bole / CMC)', amount: 2200, frequency: 'monthly', dueDate: '2025-03-05' }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-001',
    schoolId: 'school-1',
    receiptNumber: 'RCP-ETH-2025-0089',
    studentId: 'student-1',
    feeStructureId: 'fee-1',
    amount: 4800,
    paymentMethod: 'telebirr',
    referenceNumber: 'TEL-90812377482',
    status: 'completed',
    paymentDate: '2025-02-03',
    recordedByUserId: 'user-accountant-1',
    description: 'Yekatit (February) Tuition Fee payment via Telebirr'
  },
  {
    id: 'pay-002',
    schoolId: 'school-1',
    receiptNumber: 'RCP-ETH-2025-0090',
    studentId: 'student-1',
    feeStructureId: 'fee-3',
    amount: 2200,
    paymentMethod: 'cbe_birr',
    referenceNumber: 'CBE-TX-44892110',
    status: 'completed',
    paymentDate: '2025-02-03',
    recordedByUserId: 'user-accountant-1',
    description: 'School Bus Monthly Transportation Service'
  },
  {
    id: 'pay-003',
    schoolId: 'school-1',
    receiptNumber: 'RCP-ETH-2025-0104',
    studentId: 'student-2',
    feeStructureId: 'fee-1',
    amount: 4800,
    paymentMethod: 'bank_transfer',
    referenceNumber: 'AWASH-FT-991204',
    status: 'completed',
    paymentDate: '2025-02-04',
    recordedByUserId: 'user-accountant-1',
    description: 'Awash Bank Direct Deposit'
  }
];

export const INITIAL_PAYROLL: PayrollRecord[] = [
  {
    id: 'pr-01',
    schoolId: 'school-1',
    employeeId: 'EMP-014',
    employeeName: 'Haile Tadesse Desta',
    role: 'Senior Teacher (Physics & Math)',
    month: 'Yekatit 2017 / February 2025',
    basicSalary: 22500,
    allowances: 3500,
    grossSalary: 26000,
    incomeTax: 5125, // Ethiopian income tax progressive formula
    employeePension: 1575, // 7% of basic salary in Ethiopia
    otherDeductions: 0,
    netSalary: 19300,
    status: 'paid',
    paymentDate: '2025-02-25'
  },
  {
    id: 'pr-02',
    schoolId: 'school-1',
    employeeId: 'EMP-028',
    employeeName: 'Tigist Assefa Negash',
    role: 'Teacher (Chemistry & Bio)',
    month: 'Yekatit 2017 / February 2025',
    basicSalary: 19500,
    allowances: 2500,
    grossSalary: 22000,
    incomeTax: 3950,
    employeePension: 1365,
    otherDeductions: 0,
    netSalary: 16685,
    status: 'paid',
    paymentDate: '2025-02-25'
  }
];

export const INITIAL_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: 'book-1',
    schoolId: 'school-1',
    title: 'Grade 11 Physics Ethiopian Student Textbook',
    titleAm: 'የ11ኛ ክፍል ፊዚክስ የተማሪው መማሪያ መጽሐፍ',
    author: 'Ministry of Education (MoE Ethiopia)',
    isbn: '978-99944-2-330-1',
    category: 'Science & Technology',
    gradeLevel: 'Grade 11',
    totalCopies: 80,
    availableCopies: 68,
    shelfLocation: 'Shelf S-04 / Row 2',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'book-2',
    schoolId: 'school-1',
    title: 'Fundamentals of Calculus and Analytical Geometry',
    author: 'Dr. Alemayehu Haile',
    isbn: '978-99944-1-884-0',
    category: 'Mathematics',
    gradeLevel: 'Grade 11-12',
    totalCopies: 45,
    availableCopies: 32,
    shelfLocation: 'Shelf M-02 / Row 1',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'book-3',
    schoolId: 'school-1',
    title: 'Fikir Eske Mekabir (ፍቅር እስከ መቃብር)',
    author: 'Haddis Alemayehu',
    isbn: '978-99944-0-001-2',
    category: 'Literature & Culture',
    gradeLevel: 'General',
    totalCopies: 30,
    availableCopies: 24,
    shelfLocation: 'Shelf LIT-01 / Row 3',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_BOOK_LOANS: BookLoan[] = [
  {
    id: 'loan-1',
    schoolId: 'school-1',
    bookId: 'book-2',
    borrowerType: 'student',
    borrowerId: 'student-1',
    borrowerName: 'Yonas Haile Kebede',
    borrowDate: '2025-02-15',
    dueDate: '2025-03-01',
    status: 'borrowed'
  }
];

export const INITIAL_ASSETS: SchoolAsset[] = [
  {
    id: 'asset-1',
    schoolId: 'school-1',
    assetCode: 'AST-LAB-019',
    name: 'Compound Optical Microscope (1000x)',
    category: 'lab_apparatus',
    location: 'Biology Laboratory Room B-02',
    condition: 'excellent',
    purchaseDate: '2023-10-15',
    purchaseValue: 34500,
    assignedTo: 'W/t Tigist Assefa'
  },
  {
    id: 'asset-2',
    schoolId: 'school-1',
    assetCode: 'AST-IT-084',
    name: 'Dell OptiPlex Core i7 Workstation',
    category: 'it_equipment',
    location: 'Computer Lab 1',
    condition: 'good',
    purchaseDate: '2023-11-20',
    purchaseValue: 62000,
    assignedTo: 'ICT Department'
  }
];

export const INITIAL_TRANSPORT_ROUTES: TransportRoute[] = [
  {
    id: 'route-1',
    schoolId: 'school-1',
    name: 'Route 1: Bole - Megenagna - CMC - Ayat',
    vehicleNumber: 'ET-3-A48291 (Toyota Coaster Bus)',
    driverName: 'Ato Solomon Kebede',
    driverPhone: '+251 91 199 4433',
    capacity: 32,
    assignedStudentsCount: 28,
    stops: [
      { name: 'Bole Medhanealem (ካቴድራል ፊት ለፊት)', pickupTime: '07:10 AM', dropTime: '04:15 PM' },
      { name: 'Megenagna Roundabout', pickupTime: '07:25 AM', dropTime: '03:55 PM' },
      { name: 'CMC Michael Gate 1', pickupTime: '07:40 AM', dropTime: '03:40 PM' },
      { name: 'Ayat Zone 3 Roundabout', pickupTime: '07:55 AM', dropTime: '03:25 PM' }
    ]
  }
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-001',
    schoolId: 'school-1',
    applicantName: 'Nebiyu Tadesse Girma',
    applicantNameAm: 'ነቢዩ ታደሰ ግርማ',
    gender: 'male',
    dateOfBirth: '2010-05-14',
    applyingGradeId: 'gl-9',
    parentName: 'Tadesse Girma',
    parentPhone: '+251 91 777 8899',
    parentEmail: 'tadesse.girma@gmail.com',
    previousSchool: 'Future Generation Primary School',
    status: 'interview_scheduled',
    submissionDate: '2025-02-18',
    interviewDate: '2025-03-02',
    notes: 'Strong 8th-grade national exam score (92%).'
  },
  {
    id: 'adm-002',
    schoolId: 'school-1',
    applicantName: 'Fasika Bekele Dagne',
    gender: 'female',
    dateOfBirth: '2008-08-20',
    applyingGradeId: 'gl-11-nat',
    parentName: 'Bekele Dagne',
    parentPhone: '+251 91 888 1122',
    parentEmail: 'bekele.dagne@yahoo.com',
    status: 'under_review',
    submissionDate: '2025-02-22'
  }
];

// LMS Initial Data
export const INITIAL_LMS_COURSES: LMSCourse[] = [
  {
    id: 'lms-phy-11',
    schoolId: 'school-1',
    subjectId: 'sub-phy-11',
    gradeLevelId: 'gl-11-nat',
    teacherId: 'teacher-1',
    title: 'Grade 11 Advanced Physics & Mechanics',
    titleAm: 'የ11ኛ ክፍል ከፍተኛ ፊዚክስ እና ሜካኒክስ',
    description: 'Comprehensive physics curriculum covering 2D Kinematics, Newton’s Laws, Rotational Motion, Work-Energy-Power, and Electrostatics according to the Ethiopian national curriculum.',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&auto=format&fit=crop&q=80',
    academicYearId: 'ay-2017',
    totalModules: 4,
    totalLessons: 12,
    enrolledStudentsCount: 35,
    isPublished: true,
    modules: [
      {
        id: 'mod-phy-1',
        courseId: 'lms-phy-11',
        title: 'Module 1: Vector Algebra & 2D Kinematics',
        order: 1,
        lessons: [
          {
            id: 'les-phy-1',
            moduleId: 'mod-phy-1',
            courseId: 'lms-phy-11',
            title: '1.1 Vector Operations and Resolution in Components',
            order: 1,
            durationMinutes: 45,
            content: 'In this lesson, we explore dot products, cross products, and resolving forces into Cartesian orthogonal vectors (i, j, k) with real-world engineering examples in Addis Ababa light rail mechanics.',
            contentType: 'video',
            videoUrl: 'https://www.youtube.com/watch?v=ihNZlp7iUHE',
            attachmentName: 'Lecture_01_Vectors_Summary.pdf',
            isCompleted: true
          },
          {
            id: 'les-phy-2',
            moduleId: 'mod-phy-1',
            courseId: 'lms-phy-11',
            title: '1.2 Projectile Motion and Trajectory Equations',
            order: 2,
            durationMinutes: 50,
            content: 'Detailed derivation of maximum height, flight time, and range for symmetrical and elevated projectile trajectories with air resistance considerations.',
            contentType: 'interactive',
            attachmentName: 'Interactive_Projectile_Formula_Sheet.pdf',
            isCompleted: true
          }
        ]
      },
      {
        id: 'mod-phy-2',
        courseId: 'lms-phy-11',
        title: 'Module 2: Dynamics & Circular Motion',
        order: 2,
        lessons: [
          {
            id: 'les-phy-3',
            moduleId: 'mod-phy-2',
            courseId: 'lms-phy-11',
            title: '2.1 Newton’s Laws and Free Body Diagrams',
            order: 1,
            durationMinutes: 40,
            content: 'Mastering multi-body pulley systems, friction coefficients on inclined planes, and normal forces.',
            contentType: 'pdf',
            attachmentName: 'Free_Body_Diagrams_Handbook.pdf',
            isCompleted: false
          }
        ]
      }
    ]
  },
  {
    id: 'lms-math-11',
    schoolId: 'school-1',
    subjectId: 'sub-math-11',
    gradeLevelId: 'gl-11-nat',
    teacherId: 'teacher-1',
    title: 'Grade 11 Pure Mathematics & Calculus',
    titleAm: 'የ11ኛ ክፍል ንጹሕ ሒሳብ እና ካልኩለስ',
    description: 'Master functions, limits, continuity, rate of change, derivatives, and integral foundations with rigorous Ethiopian national exam preparatory problems.',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    academicYearId: 'ay-2017',
    totalModules: 5,
    totalLessons: 16,
    enrolledStudentsCount: 35,
    isPublished: true,
    modules: []
  },
  {
    id: 'lms-chem-11',
    schoolId: 'school-1',
    subjectId: 'sub-chem-11',
    gradeLevelId: 'gl-11-nat',
    teacherId: 'teacher-2',
    title: 'Grade 11 Organic Chemistry & Reaction Mechanisms',
    titleAm: 'የ11ኛ ክፍል ኦርጋኒክ ኬሚስትሪ',
    description: 'Structure, nomenclature, synthesis, and electrophilic/nucleophilic reaction pathways of hydrocarbons, functional groups, and biomolecules.',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    academicYearId: 'ay-2017',
    totalModules: 3,
    totalLessons: 10,
    enrolledStudentsCount: 35,
    isPublished: true,
    modules: []
  }
];

export const INITIAL_LMS_ASSIGNMENTS: LMSAssignment[] = [
  {
    id: 'assign-1',
    schoolId: 'school-1',
    courseId: 'lms-phy-11',
    teacherId: 'teacher-1',
    title: 'Problem Set 3: 2D Projectile Range & Inclined Plane Dynamics',
    description: 'Complete questions 1 through 10 from Section 2.4 of the MoE textbook. Show all derivation steps, diagram free-body forces, and state units accurately in SI.',
    dueDate: '2025-03-04T23:59:00Z',
    maxScore: 20,
    attachments: [
      { name: 'Physics_Problem_Set_3_Instructions.pdf', url: '#', size: '1.2 MB' }
    ],
    submissionsCount: 24,
    totalAssignedCount: 35
  },
  {
    id: 'assign-2',
    schoolId: 'school-1',
    courseId: 'lms-chem-11',
    teacherId: 'teacher-2',
    title: 'Laboratory Report: Esterification & Organic Synthesis',
    description: 'Write a comprehensive 3-page scientific lab report summarizing the synthesis of Ethyl Ethanoate conducted in Laboratory 2.',
    dueDate: '2025-03-08T23:59:00Z',
    maxScore: 25,
    submissionsCount: 18,
    totalAssignedCount: 35
  }
];

export const INITIAL_LMS_SUBMISSIONS: LMSAssignmentSubmission[] = [
  {
    id: 'subm-1',
    assignmentId: 'assign-1',
    studentId: 'student-1',
    studentName: 'Yonas Haile Kebede',
    submittedAt: '2025-03-01T14:30:00Z',
    fileName: 'Yonas_Haile_Physics_PS3_Solutions.pdf',
    fileUrl: '#',
    textAnswer: 'I have attached my complete step-by-step mathematical solutions including vector diagrams for Question 7 & 8.',
    score: 19.5,
    feedback: 'Outstanding calculations! Just ensure you explicitly state significant figures in your final acceleration value.',
    status: 'graded'
  }
];

export const INITIAL_LMS_QUIZZES: LMSQuiz[] = [
  {
    id: 'quiz-1',
    schoolId: 'school-1',
    courseId: 'lms-phy-11',
    title: 'Self-Check Quiz: Vector Mechanics & Kinetic Energy',
    description: 'Test your understanding before the midterm examination. Instant score feedback with detailed explanations.',
    durationMinutes: 20,
    totalPoints: 15,
    passPercentage: 70,
    isPublished: true,
    questions: [
      {
        id: 'qz-q1',
        type: 'mcq',
        questionText: 'If kinetic energy of a moving vehicle is quadrupled, by what factor has its velocity increased?',
        options: ['2 times (Doubled)', '4 times', '16 times', 'No change'],
        correctAnswer: '2 times (Doubled)',
        points: 5,
        explanation: 'Because KE = 1/2 * m * v², doubling the velocity v results in (2)² = 4 times kinetic energy.'
      },
      {
        id: 'qz-q2',
        type: 'true_false',
        questionText: 'Work done by a perpendicular centripetal force in uniform circular motion is always zero.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 5,
        explanation: 'Work = F * d * cos(90°) = 0 J because the force is orthogonal to displacement.'
      },
      {
        id: 'qz-q3',
        type: 'mcq',
        questionText: 'What is the power required to lift a 50 kg load vertically by 10 meters in 5 seconds (assume g = 10 m/s²)?',
        options: ['100 Watts', '1,000 Watts', '2,500 Watts', '5,000 Watts'],
        correctAnswer: '1,000 Watts',
        points: 5,
        explanation: 'Work = m*g*h = 50 * 10 * 10 = 5000 J. Power = Work / Time = 5000 / 5 = 1000 W.'
      }
    ]
  }
];

export const INITIAL_LMS_LIVE_CLASSES: LMSLiveClass[] = [
  {
    id: 'live-1',
    schoolId: 'school-1',
    courseId: 'lms-phy-11',
    teacherId: 'teacher-1',
    title: 'Interactive Live Session: Complex Collision Problems & Momentum Conservation',
    topic: '2D Inelastic Collisions & Ballistic Pendulum Analysis',
    scheduledAt: '2025-03-02T16:00:00Z',
    durationMinutes: 60,
    platform: 'google_meet',
    meetingUrl: 'https://meet.google.com/abc-wxyz-eth',
    meetingPassword: 'ETH-PHY-2025',
    status: 'upcoming',
    attendeesCount: 32
  },
  {
    id: 'live-2',
    schoolId: 'school-1',
    courseId: 'lms-chem-11',
    teacherId: 'teacher-2',
    title: 'Live Q&A: Organic Reaction Mechanisms & Synthesis Strategies',
    topic: 'Alkenes, Alkynes and Markovnikov Rule Clarifications',
    scheduledAt: '2025-03-04T15:30:00Z',
    durationMinutes: 45,
    platform: 'zoom',
    meetingUrl: 'https://zoom.us/j/9081244589',
    status: 'upcoming',
    attendeesCount: 29
  }
];

export const INITIAL_CERTIFICATES: LMSCertificate[] = [
  {
    id: 'cert-001',
    schoolId: 'school-1',
    studentId: 'student-1',
    studentName: 'Yonas Haile Kebede',
    courseId: 'lms-phy-11',
    courseTitle: 'Grade 11 Advanced Physics & Mechanics',
    issueDate: '2025-02-20',
    certificateNumber: 'CERT-AAMA-2025-0019',
    verificationCode: 'ETH-VER-90812-PHY',
    signatureUrl: 'Ato Haile Tadesse (Instructor) & Ato Girma Wolde (Principal)'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    schoolId: 'school-1',
    title: 'Semester II Midterm Examination Schedule Released',
    content: 'All Grade 9 through 12 students and teachers are requested to review the Semester II Midterm examination timetable on the portal. Online examinations will be administered through the LMS test portal.',
    authorName: 'Ato Girma Wolde',
    authorRole: 'Principal',
    targetAudience: 'all',
    priority: 'high',
    createdAt: '2025-02-24T09:00:00Z'
  },
  {
    id: 'ann-2',
    schoolId: 'school-1',
    title: 'Parents-Teachers Academic Consultation Conference',
    content: 'The 2nd Term Parent-Teacher consultation will take place on Megabit 6 (March 15) in the school main assembly hall. All parents are warmly encouraged to attend.',
    authorName: 'W/ro Aster Mamo',
    authorRole: 'School Administrator',
    targetAudience: 'parents',
    priority: 'normal',
    createdAt: '2025-02-22T11:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'New Grade Published',
    message: 'Your Physics Midterm result has been graded and published (Score: 28.5 / 30 - Grade: A+).',
    type: 'exam',
    isRead: false,
    createdAt: '2025-02-26T10:00:00Z',
    link: 'exams'
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Live Online Class Starting Soon',
    message: 'Grade 11 Physics Live Session starts on Sunday at 4:00 PM via Google Meet.',
    type: 'academic',
    isRead: false,
    createdAt: '2025-02-26T08:30:00Z',
    link: 'live-classes'
  },
  {
    id: 'notif-3',
    userId: 'user-parent-1',
    title: 'Telebirr Payment Confirmed',
    message: 'Payment of 4,800 ETB for Yonas Haile (Receipt #RCP-ETH-2025-0089) verified successfully.',
    type: 'fee',
    isRead: true,
    createdAt: '2025-02-24T14:20:00Z',
    link: 'finance'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    schoolId: 'school-1',
    userId: 'user-admin',
    userName: 'W/ro Aster Mamo',
    userRole: 'school_admin',
    action: 'CREATE_EXAM_SCHEDULE',
    entity: 'Exam',
    entityId: 'exam-phy11-mid',
    details: 'Published Grade 11 Physics Midterm Examination timetable and online test configuration.',
    timestamp: '2025-02-24T09:12:00Z',
    ipAddress: '197.156.104.22 (Addis Ababa)'
  },
  {
    id: 'log-2',
    schoolId: 'school-1',
    userId: 'user-teacher-1',
    userName: 'Ato Haile Tadesse',
    userRole: 'teacher',
    action: 'UPDATE_EXAM_GRADE',
    entity: 'ExamResult',
    entityId: 'res-1',
    details: 'Graded student Yonas Haile Kebede with score 28.5/30.',
    timestamp: '2025-02-25T14:40:00Z',
    ipAddress: '197.156.104.45 (Addis Ababa)'
  },
  {
    id: 'log-3',
    schoolId: 'school-1',
    userId: 'user-accountant-1',
    userName: 'Ato Dawit Alemu',
    userRole: 'accountant',
    action: 'RECORD_PAYMENT',
    entity: 'PaymentTransaction',
    entityId: 'pay-001',
    details: 'Recorded 4,800 ETB tuition fee via Telebirr for Student Yonas Haile.',
    timestamp: '2025-02-24T14:20:00Z',
    ipAddress: '197.156.104.10'
  }
];

export const INITIAL_COURSES = INITIAL_LMS_COURSES;
export const INITIAL_ASSIGNMENTS = INITIAL_LMS_ASSIGNMENTS;
export const INITIAL_SUBMISSIONS = INITIAL_LMS_SUBMISSIONS;
export const INITIAL_QUIZZES = INITIAL_LMS_QUIZZES;
export const INITIAL_LIVE_CLASSES = INITIAL_LMS_LIVE_CLASSES;
export const INITIAL_BOOKS = INITIAL_LIBRARY_BOOKS;
export const INITIAL_INVENTORY = INITIAL_ASSETS;
export const INITIAL_TRANSPORT = INITIAL_TRANSPORT_ROUTES;
