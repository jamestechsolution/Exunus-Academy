import { Student, School, AppNotification, SMSNotificationLog } from '../types';

// Mock in-memory SMS logs store (with initial realistic seed alerts)
let smsLogsStore: SMSNotificationLog[] = [
  {
    id: 'sms-log-001',
    recipientPhone: '+251 91 188 9900',
    recipientName: 'Haile Kebede Mengistu',
    studentId: 'student-2',
    studentName: 'Selam Abera Tilahun',
    studentAdmissionNo: 'MILA-2024-0092',
    sectionName: 'Grade 11 Natural Science (Sec A)',
    message: '🇪🇹 [Ethio Telecom SMS Gateway (984)] Dear Parent/Guardian, your child Selam Abera was marked ABSENT today (Yekatit 17 / Feb 25) at Ethiopian National Millennium Academy. Please contact the school office if this is an error: +251 11 618 5555.',
    status: 'delivered',
    carrier: 'Ethio Telecom Enterprise SMS Gateway (Shortcode 984)',
    timestamp: '2025-02-25T08:35:12Z',
    deliveryTime: '2025-02-25T08:35:14Z',
    costEtb: 0.35,
    triggerType: 'absence'
  },
  {
    id: 'sms-log-002',
    recipientPhone: '+251 91 333 4455',
    recipientName: 'Tesfaye Wolde',
    studentId: 'student-4',
    studentName: 'Dawit Tesfaye Wolde',
    studentAdmissionNo: 'MILA-2024-0044',
    sectionName: 'Grade 11 Natural Science (Sec A)',
    message: '🇪🇹 [Ethio Telecom SMS Gateway (984)] Dear Parent, your student Dawit Tesfaye arrived LATE at school today at 8:40 AM. Please advise on punctuality.',
    status: 'delivered',
    carrier: 'Ethio Telecom Enterprise SMS Gateway (Shortcode 984)',
    timestamp: '2025-02-24T08:45:00Z',
    deliveryTime: '2025-02-24T08:45:02Z',
    costEtb: 0.35,
    triggerType: 'late'
  },
  {
    id: 'sms-log-003',
    recipientPhone: '+251 91 188 9900',
    recipientName: 'Haile Kebede Mengistu',
    studentId: 'student-1',
    studentName: 'Yonas Haile Kebede',
    studentAdmissionNo: 'MILA-2024-0089',
    sectionName: 'Grade 11 Natural Science (Sec A)',
    message: '🇪🇹 [Ethio Telecom SMS Gateway (984)] Official Report Card for Yonas Haile (Semester I) has been published. Download digital PDF: https://ethioschool.edu.et/r/MILA-0089',
    status: 'delivered',
    carrier: 'Ethio Telecom Enterprise SMS Gateway (Shortcode 984)',
    timestamp: '2025-02-24T15:00:00Z',
    deliveryTime: '2025-02-24T15:00:03Z',
    costEtb: 0.35,
    triggerType: 'report_card'
  }
];

export interface DispatchResult {
  success: boolean;
  smsLog: SMSNotificationLog;
  notification: AppNotification;
}

/**
 * Automated SMS & In-App Notification Dispatch Service
 */
export const smsNotificationService = {
  /**
   * Get all SMS dispatch logs
   */
  getLogs(): SMSNotificationLog[] {
    return [...smsLogsStore];
  },

  /**
   * Dispatches automated absence SMS alert to a student's parent
   */
  dispatchAbsenceAlert(
    student: Student,
    school: School,
    date: string,
    remarks?: string
  ): DispatchResult {
    const parentPhone = student.parentPhone || '+251 91 188 9900';
    const parentName = student.parentName || 'Parent / Guardian';
    const parentUserId = student.parentId === 'parent-1' ? 'user-parent-1' : `user-parent-${student.id}`;

    const formattedDate = date || new Date().toISOString().split('T')[0];
    const logId = `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const message = `🇪🇹 [Ethio Telecom SMS Gateway (984)] ማሳሰቢያ፡ የተማሪ ${student.firstName} ${student.lastName} (${student.admissionNumber}) ወላጅ/አሳዳጊ፣ ተማሪው በዛሬው ዕለት (${formattedDate}) ከትምህርት ገበታ ቀሪ (Absent) ሆኖ ተመዝግቧል። ${remarks ? `ማስታወሻ፡ "${remarks}". ` : ''}ለጥያቄ በት/ቤቱ ስልክ ቁጥር ${school.phone || '+251 11 618 5555'} ይደውሉ። - ${school.name}`;

    const smsLog: SMSNotificationLog = {
      id: logId,
      recipientPhone: parentPhone,
      recipientName: parentName,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentAdmissionNo: student.admissionNumber,
      sectionName: 'Grade 11 Natural Science',
      message,
      status: 'delivered',
      carrier: 'Ethio Telecom Enterprise Gateway (Shortcode 984)',
      timestamp: new Date().toISOString(),
      deliveryTime: new Date(Date.now() + 1500).toISOString(),
      costEtb: 0.35,
      triggerType: 'absence'
    };

    smsLogsStore = [smsLog, ...smsLogsStore];

    const notification: AppNotification = {
      id: `notif-abs-${Date.now()}-${student.id}`,
      userId: parentUserId,
      title: `🚨 Absence SMS Alert: ${student.firstName} ${student.lastName}`,
      message: `Automated SMS delivered to ${parentPhone}: Student was marked ABSENT on ${formattedDate}.`,
      type: 'attendance',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: 'attendance',
      smsLogId: logId,
      metadata: {
        studentId: student.id,
        date: formattedDate,
        phone: parentPhone,
        remarks: remarks || ''
      }
    };

    return {
      success: true,
      smsLog,
      notification
    };
  },

  /**
   * Dispatches automated late arrival SMS alert to parent
   */
  dispatchLateAlert(
    student: Student,
    school: School,
    date: string,
    remarks?: string
  ): DispatchResult {
    const parentPhone = student.parentPhone || '+251 91 188 9900';
    const parentName = student.parentName || 'Parent / Guardian';
    const parentUserId = student.parentId === 'parent-1' ? 'user-parent-1' : `user-parent-${student.id}`;
    const logId = `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const message = `🇪🇹 [Ethio Telecom SMS Gateway (984)] Dear Parent, your student ${student.firstName} ${student.lastName} (${student.admissionNumber}) arrived LATE at ${school.name} today. ${remarks ? `Note: "${remarks}". ` : ''}Please ensure morning punctuality.`;

    const smsLog: SMSNotificationLog = {
      id: logId,
      recipientPhone: parentPhone,
      recipientName: parentName,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentAdmissionNo: student.admissionNumber,
      sectionName: 'Grade 11 Natural Science',
      message,
      status: 'delivered',
      carrier: 'Ethio Telecom Enterprise Gateway (Shortcode 984)',
      timestamp: new Date().toISOString(),
      deliveryTime: new Date(Date.now() + 1200).toISOString(),
      costEtb: 0.35,
      triggerType: 'late'
    };

    smsLogsStore = [smsLog, ...smsLogsStore];

    const notification: AppNotification = {
      id: `notif-late-${Date.now()}-${student.id}`,
      userId: parentUserId,
      title: `⏱️ Late Arrival Alert: ${student.firstName}`,
      message: `SMS delivered to ${parentPhone}: Student arrived late to class.`,
      type: 'attendance',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: 'attendance',
      smsLogId: logId
    };

    return {
      success: true,
      smsLog,
      notification
    };
  },

  /**
   * Dispatches Report Card to Parent via Email & SMS
   */
  dispatchReportCardNotification(
    student: Student,
    school: School,
    termName: string,
    emailAddress?: string,
    phoneNumber?: string
  ): DispatchResult {
    const parentPhone = phoneNumber || student.parentPhone || '+251 91 188 9900';
    const parentEmail = emailAddress || student.parentEmail || 'parent@gmail.com';
    const parentName = student.parentName || 'Parent / Guardian';
    const parentUserId = student.parentId === 'parent-1' ? 'user-parent-1' : `user-parent-${student.id}`;
    const logId = `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const message = `🇪🇹 [${school.name}] Official Report Card for ${student.firstName} ${student.lastName} (${termName}) has been generated and emailed to ${parentEmail}. You can also view and download the official PDF from the EthioSchool parent portal.`;

    const smsLog: SMSNotificationLog = {
      id: logId,
      recipientPhone: parentPhone,
      recipientName: parentName,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentAdmissionNo: student.admissionNumber,
      sectionName: 'Grade 11 Natural Science',
      message,
      status: 'delivered',
      carrier: 'Ethio Telecom Enterprise Gateway (Shortcode 984)',
      timestamp: new Date().toISOString(),
      deliveryTime: new Date().toISOString(),
      costEtb: 0.35,
      triggerType: 'report_card'
    };

    smsLogsStore = [smsLog, ...smsLogsStore];

    const notification: AppNotification = {
      id: `notif-rc-${Date.now()}-${student.id}`,
      userId: parentUserId,
      title: `📄 Official Report Card Dispatched (${termName})`,
      message: `Official signed report card for ${student.firstName} ${student.lastName} was sent to ${parentEmail} & SMS alert to ${parentPhone}.`,
      type: 'academic',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: 'report-cards',
      smsLogId: logId,
      metadata: {
        studentId: student.id,
        termName,
        email: parentEmail,
        phone: parentPhone
      }
    };

    return {
      success: true,
      smsLog,
      notification
    };
  }
};
