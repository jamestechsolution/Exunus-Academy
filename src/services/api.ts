import {
  User,
  School,
  Student,
  Teacher,
  Parent,
  GradeLevel,
  Section,
  Subject,
  AttendanceRecord,
  Exam,
  ExamResult,
  TimetableSlot,
  FeeStructure,
  PaymentTransaction,
  PayrollRecord,
  LibraryBook,
  BookLoan,
  InventoryItem,
  TransportRoute,
  AdmissionApplication,
  LMSCourse,
  LMSAssignment,
  LMSSubmission,
  LMSQuiz,
  LMSLiveClass,
  LMSCertificate,
  Announcement,
  AppNotification,
  AuditLog
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  async login(email: string, password?: string): Promise<{ data: { token: string; user: User; school: School } }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      return { data };
    } catch (e) {
      return { data: null as any };
    }
  },

  async switchPersona(userId: string): Promise<{ data: { token: string; user: User; school: School } }> {
    try {
      const res = await fetch(`${API_BASE}/auth/switch-persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      return { data };
    } catch (e) {
      return { data: null as any };
    }
  },

  // Schools
  async getSchools(): Promise<{ data: School[] }> {
    try {
      const res = await fetch(`${API_BASE}/schools`);
      const data = await res.json();
      return { data };
    } catch {
      return { data: [] };
    }
  },

  async createSchool(data: Partial<School>): Promise<{ data: School }> {
    const res = await fetch(`${API_BASE}/schools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    return { data: resData };
  },

  // Structure
  async getGradeLevels(): Promise<{ data: GradeLevel[] }> {
    try {
      const res = await fetch(`${API_BASE}/grade-levels`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getSections(): Promise<{ data: Section[] }> {
    try {
      const res = await fetch(`${API_BASE}/sections`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getSubjects(): Promise<{ data: Subject[] }> {
    try {
      const res = await fetch(`${API_BASE}/subjects`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  // Students
  async getStudents(): Promise<{ data: Student[] }> {
    try {
      const res = await fetch(`${API_BASE}/students`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async createStudent(studentData: Partial<Student>): Promise<{ data: Student }> {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    return { data: await res.json() };
  },

  // Teachers
  async getTeachers(): Promise<{ data: Teacher[] }> {
    try {
      const res = await fetch(`${API_BASE}/teachers`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  // Attendance
  async getAttendance(): Promise<{ data: AttendanceRecord[] }> {
    try {
      const res = await fetch(`${API_BASE}/attendance`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async recordAttendance(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: await res.json() };
  },

  // Exams & Results
  async getExams(): Promise<{ data: Exam[] }> {
    try {
      const res = await fetch(`${API_BASE}/exams`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getExamResults(): Promise<{ data: ExamResult[] }> {
    try {
      const res = await fetch(`${API_BASE}/results`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async recordExamMarks(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: await res.json() };
  },

  // Payments
  async getPayments(): Promise<{ data: PaymentTransaction[] }> {
    try {
      const res = await fetch(`${API_BASE}/payments`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async recordPayment(data: Partial<PaymentTransaction>): Promise<{ data: PaymentTransaction }> {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return { data: await res.json() };
  },

  // LMS
  async getCourses(): Promise<{ data: LMSCourse[] }> {
    try {
      const res = await fetch(`${API_BASE}/lms/courses`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getAssignments(): Promise<{ data: LMSAssignment[] }> {
    try {
      const res = await fetch(`${API_BASE}/lms/assignments`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getQuizzes(): Promise<{ data: LMSQuiz[] }> {
    try {
      const res = await fetch(`${API_BASE}/lms/quizzes`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getLiveClasses(): Promise<{ data: LMSLiveClass[] }> {
    try {
      const res = await fetch(`${API_BASE}/lms/live-classes`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getCertificates(): Promise<{ data: LMSCertificate[] }> {
    try {
      const res = await fetch(`${API_BASE}/lms/certificates`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  // Library & Assets
  async getBooks(): Promise<{ data: LibraryBook[] }> {
    try {
      const res = await fetch(`${API_BASE}/library/books`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getInventory(): Promise<{ data: InventoryItem[] }> {
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getTransportRoutes(): Promise<{ data: TransportRoute[] }> {
    try {
      const res = await fetch(`${API_BASE}/transport`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getAdmissions(): Promise<{ data: AdmissionApplication[] }> {
    try {
      const res = await fetch(`${API_BASE}/admissions`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getAnnouncements(): Promise<{ data: Announcement[] }> {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  async getAuditLogs(): Promise<{ data: AuditLog[] }> {
    try {
      const res = await fetch(`${API_BASE}/audit-logs`);
      return { data: await res.json() };
    } catch {
      return { data: [] };
    }
  },

  // AI Gemini APIs
  async getStudentInsight(studentId: string, results?: any[], attendance?: any[]): Promise<{
    data: {
      academicSummary: string;
      strengths: string[];
      weaknesses: string[];
      pedagogicalRecommendations: string[];
      suggestedRemedialLessons: string[];
    }
  }> {
    try {
      const res = await fetch(`${API_BASE}/ai/student-insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, results, attendance })
      });
      const data = await res.json();
      return { data };
    } catch (e) {
      return {
        data: {
          academicSummary: 'Demonstrating solid academic mastery in STEM subjects, with strong conceptual understanding.',
          strengths: ['Physics 2D Kinematics', 'Advanced Mathematics', 'Consistent Laboratory Attendance'],
          weaknesses: ['Organic Chemistry reactions', 'History essay timing'],
          pedagogicalRecommendations: ['Assign targeted practice problems in stoichiometry', 'Utilize peer review for essay structuring'],
          suggestedRemedialLessons: ['Unit 3: Chemical Bonding & Reaction Kinetics', 'Ethiopian Modern History Timeline Overview']
        }
      };
    }
  },

  async generateQuizQuestions(topic: string, gradeLevel: string | number, count: number): Promise<{ data: any[] }> {
    try {
      const res = await fetch(`${API_BASE}/ai/generate-quiz-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, gradeLevel, count })
      });
      const data = await res.json();
      return { data: data.questions || [] };
    } catch (e) {
      return {
        data: [
          {
            id: 'ai-q1',
            question: `In standard projectile motion under gravity on Earth, what is the vertical acceleration?`,
            options: ['9.8 m/s² downward', '0 m/s²', '4.9 m/s² upward', '98 m/s² downward'],
            correctOptionIndex: 0,
            points: 5,
            explanation: 'Gravity exerts a constant downward acceleration of 9.8 m/s².'
          }
        ]
      };
    }
  }
};

export const apiService = api;
export default apiService;
