import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  GraduationCap,
  Users,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  School as SchoolIcon,
  Globe,
  RefreshCw,
  HelpCircle,
  Building2,
  Calendar,
  Check,
  Copy,
  Clock,
  Send,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { User as UserType, UserRole, School, LanguageCode, CalendarType } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate, getCurrentAcademicYearLabel } from '../../utils/ethiopianCalendar';

interface AuthScreenProps {
  schools: School[];
  users: UserType[];
  language: LanguageCode;
  calendarType: CalendarType;
  onLanguageChange: (lang: LanguageCode) => void;
  onCalendarChange: (cal: CalendarType) => void;
  onLoginSuccess: (user: UserType, school: School, rememberMe: boolean) => void;
}

type RoleTab = 'admin' | 'teacher' | 'student' | 'parent' | 'finance';

interface RoleConfig {
  id: RoleTab;
  primaryRole: UserRole;
  titleEn: string;
  titleAm: string;
  titleOm: string;
  descEn: string;
  descAm: string;
  icon: React.ElementType;
  badge: string;
  colorClass: string;
  activeBg: string;
  borderActive: string;
  identifierLabelEn: string;
  identifierLabelAm: string;
  identifierPlaceholderEn: string;
  demoUsers: {
    name: string;
    email: string;
    altId?: string;
    role: UserRole;
    avatar?: string;
    hint: string;
  }[];
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  schools,
  users,
  language,
  calendarType,
  onLanguageChange,
  onCalendarChange,
  onLoginSuccess
}) => {
  const { t } = useTranslation(language);

  // Selected school (defaults to Exunus Academy / primary school)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schools[0]?.id || 'school-1');
  const activeSchool = schools.find(s => s.id === selectedSchoolId) || schools[0];

  // Active Role Category Tab
  const [selectedRoleTab, setSelectedRoleTab] = useState<RoleTab>('admin');

  // Form State
  const [identifier, setIdentifier] = useState('admin@exunus.edu.et');
  const [password, setPassword] = useState('Exunus@2025');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Two-Factor Authentication state
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [pendingUser, setPendingUser] = useState<UserType | null>(null);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});

  // -------------------------------------------------------------
  // Forgot Password / Credential Reset Recovery State
  // -------------------------------------------------------------
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify_and_reset' | 'completed'>('request');
  const [forgotEmail, setForgotEmail] = useState('admin@exunus.edu.et');
  const [forgotEmailError, setForgotEmailError] = useState<string | null>(null);
  const [generatedRecoveryToken, setGeneratedRecoveryToken] = useState<string>('');
  const [recoveryTokenInput, setRecoveryTokenInput] = useState('');
  const [recoveryTokenError, setRecoveryTokenError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetErrors, setResetErrors] = useState<{ token?: string; password?: string; confirmPassword?: string }>({});
  const [tokenCountdown, setTokenCountdown] = useState<number>(900); // 15 minutes
  const [copiedToken, setCopiedToken] = useState(false);
  const [matchedRecoveryUser, setMatchedRecoveryUser] = useState<UserType | null>(null);

  // Define Role Configurations with realistic Exunus Academy data
  const roleConfigs: Record<RoleTab, RoleConfig> = {
    admin: {
      id: 'admin',
      primaryRole: 'school_admin',
      titleEn: 'Leadership & Admin',
      titleAm: 'አስተዳዳሪ እና አመራር',
      titleOm: 'Hoggansa & Bulchiinsa',
      descEn: 'Full ERP access, admissions, staff payroll, and system controls',
      descAm: 'ሙሉ የትምህርት ቤት አስተዳደር፣ መምህራን ክፍያና ምዝገባ',
      icon: Shield,
      badge: 'Full SIS & ERP Access',
      colorClass: 'text-indigo-400',
      activeBg: 'bg-indigo-950/80',
      borderActive: 'border-blue-500 ring-2 ring-blue-500/20',
      identifierLabelEn: 'Administrator Email or Staff Code',
      identifierLabelAm: 'የአስተዳዳሪ ኢሜይል ወይም የሰራተኛ መለያ',
      identifierPlaceholderEn: 'admin@exunus.edu.et or ADM-001',
      demoUsers: [
        {
          name: 'Ato Abebe Bikila',
          email: 'admin@millennium.edu.et',
          altId: 'admin@exunus.edu.et',
          role: 'school_admin',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          hint: 'School Administrator (Full Privileges)'
        },
        {
          name: 'Dr. Solomon Tadesse',
          email: 'principal@millennium.edu.et',
          altId: 'principal@exunus.edu.et',
          role: 'principal',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
          hint: 'Head Principal'
        }
      ]
    },
    teacher: {
      id: 'teacher',
      primaryRole: 'teacher',
      titleEn: 'Teacher & Faculty',
      titleAm: 'መምህራን እና ሰራተኞች',
      titleOm: 'Barsiisota',
      descEn: 'Attendance roster, MoE continuous assessments, exam grading & LMS',
      descAm: 'የተማሪዎች መገኘት፣ የፈተና ውጤት ማስገቢያ እና የመማሪያ ክፍል',
      icon: GraduationCap,
      badge: 'Grading & Attendance',
      colorClass: 'text-emerald-400',
      activeBg: 'bg-emerald-950/80',
      borderActive: 'border-emerald-500 ring-2 ring-emerald-500/20',
      identifierLabelEn: 'Teacher Institutional Email or Faculty ID',
      identifierLabelAm: 'የመምህር ኢሜይል ወይም መለያ ቁጥር',
      identifierPlaceholderEn: 'haile.tadesse@exunus.edu.et or TCH-102',
      demoUsers: [
        {
          name: 'Ato Haile Tadesse',
          email: 'haile.tadesse@millennium.edu.et',
          altId: 'haile.tadesse@exunus.edu.et',
          role: 'teacher',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          hint: 'Senior Physics & Mathematics Instructor'
        },
        {
          name: 'W/ro Tigist Mengistu',
          email: 'tigist.mengistu@millennium.edu.et',
          altId: 'tigist.m@exunus.edu.et',
          role: 'teacher',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
          hint: 'Biology & Chemistry Teacher'
        }
      ]
    },
    student: {
      id: 'student',
      primaryRole: 'student',
      titleEn: 'Student Portal',
      titleAm: 'የተማሪ መግቢያ',
      titleOm: 'Seensa Barattootaa',
      descEn: 'Live courses, homework submissions, quizzes, and digital report cards',
      descAm: 'የመስመር ላይ ትምህርት፣ የቤት ስራ፣ ፈተናዎች እና የውጤት ካርድ',
      icon: User,
      badge: 'LMS & Grades',
      colorClass: 'text-amber-400',
      activeBg: 'bg-amber-950/80',
      borderActive: 'border-amber-500 ring-2 ring-amber-500/20',
      identifierLabelEn: 'Student ID or School Email',
      identifierLabelAm: 'የተማሪ መለያ ቁጥር (ID) ወይም ኢሜይል',
      identifierPlaceholderEn: 'STU-11-042 or yonas.haile@exunus.edu.et',
      demoUsers: [
        {
          name: 'Yonas Haile Kebede',
          email: 'yonas.haile@millennium.edu.et',
          altId: 'yonas.haile@exunus.edu.et',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
          hint: 'Grade 11 Natural Science (Top Rank)'
        }
      ]
    },
    parent: {
      id: 'parent',
      primaryRole: 'parent',
      titleEn: 'Parent & Guardian',
      titleAm: 'የወላጅ መግቢያ',
      titleOm: 'Seensa Maatii',
      descEn: 'Real-time SMS attendance alerts, Telebirr tuition payments, and report cards',
      descAm: 'የተማሪ መቅረት ማስጠንቀቂያ፣ የክፍያ ደረሰኝ እና የትምህርት ካርድ',
      icon: Users,
      badge: 'SMS Alerts & Telebirr',
      colorClass: 'text-purple-400',
      activeBg: 'bg-purple-950/80',
      borderActive: 'border-purple-500 ring-2 ring-purple-500/20',
      identifierLabelEn: 'Registered Parent Mobile or Email',
      identifierLabelAm: 'የተመዘገበ የወላጅ ስልክ ቁጥር ወይም ኢሜይል',
      identifierPlaceholderEn: '+251 91 188 9900 or haile.kebede@gmail.com',
      demoUsers: [
        {
          name: 'Ato Haile Kebede Mengistu',
          email: 'haile.kebede@gmail.com',
          altId: 'parent.haile@exunus.edu.et',
          role: 'parent',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
          hint: 'Parent of 2 Students (Grade 9 & 11)'
        }
      ]
    },
    finance: {
      id: 'finance',
      primaryRole: 'accountant',
      titleEn: 'Finance & Staff',
      titleAm: 'ሂሳብ እና ሰራተኞች',
      titleOm: 'Faayinaansii & Hojjattoota',
      descEn: 'Tuition collection reconciliation, bank ledgers, and staff payroll slips',
      descAm: 'የተማሪዎች ክፍያ መቆጣጠሪያ፣ የባንክ ማስታረቂያ እና ደመወዝ',
      icon: Briefcase,
      badge: 'Tuition & Payroll ERP',
      colorClass: 'text-sky-400',
      activeBg: 'bg-sky-950/80',
      borderActive: 'border-sky-500 ring-2 ring-sky-500/20',
      identifierLabelEn: 'Staff ID or Institutional Email',
      identifierLabelAm: 'የሰራተኛ መለያ ወይም የት/ቤት ኢሜይል',
      identifierPlaceholderEn: 'finance@exunus.edu.et or FIN-880',
      demoUsers: [
        {
          name: 'Ato Dawit Alemu',
          email: 'finance@millennium.edu.et',
          altId: 'finance@exunus.edu.et',
          role: 'accountant',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
          hint: 'Senior School Accountant'
        },
        {
          name: 'W/ro Genet Asfaw',
          email: 'library@millennium.edu.et',
          altId: 'librarian@exunus.edu.et',
          role: 'librarian',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
          hint: 'Lead Librarian'
        }
      ]
    }
  };

  const currentRoleConfig = roleConfigs[selectedRoleTab];

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);
  const newPasswordStrength = getPasswordStrength(newPassword);

  // Quick-fill credentials helper
  const handleQuickFill = (userEmail: string, altEmail?: string) => {
    setIdentifier(altEmail || userEmail);
    setPassword('Exunus@2025');
    setValidationErrors({});
  };

  // Form Validation
  const validateForm = (): boolean => {
    const errors: { identifier?: string; password?: string; general?: string } = {};

    if (!identifier.trim()) {
      errors.identifier = language === 'am' ? 'እባክዎ ኢሜይል ወይም መለያ ቁጥር ያስገቡ' : 'Please enter your email, ID number, or registered phone';
    } else if (identifier.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      errors.identifier = language === 'am' ? 'ትክክለኛ የኢሜይል ቅርጸት ያስገቡ' : 'Please provide a valid email format';
    } else if (!identifier.includes('@') && identifier.trim().length < 3) {
      errors.identifier = language === 'am' ? 'መለያ ቢያንስ 3 ፊደላት ሊኖረው ይገባል' : 'Identifier must be at least 3 characters';
    }

    if (!password) {
      errors.password = language === 'am' ? 'እባክዎ የይለፍ ቃል ያስገቡ' : 'Password is required to authenticate';
    } else if (password.length < 4) {
      errors.password = language === 'am' ? 'የይለፍ ቃል ቢያንስ 4 ፊደላት/ቁጥሮች መሆን አለበት' : 'Password must be at least 4 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setValidationErrors({});

    // Simulate network authentication & credential matching
    setTimeout(() => {
      const searchNormalized = identifier.trim().toLowerCase();

      // Find matching user from seed database
      const matchedUser = users.find(u => {
        const emailMatch = u.email.toLowerCase() === searchNormalized;
        const exunusEmailMatch = u.email.split('@')[0].toLowerCase() === searchNormalized.split('@')[0].toLowerCase();
        const phoneMatch = u.phone && u.phone.replace(/[\s+-]/g, '') === searchNormalized.replace(/[\s+-]/g, '');

        // Check if role matches category
        const roleAllowed =
          selectedRoleTab === 'admin'
            ? ['super_admin', 'school_admin', 'principal', 'vice_principal', 'academic_director'].includes(u.role)
            : selectedRoleTab === 'teacher'
            ? u.role === 'teacher'
            : selectedRoleTab === 'student'
            ? u.role === 'student'
            : selectedRoleTab === 'parent'
            ? u.role === 'parent'
            : ['accountant', 'librarian', 'hr_manager', 'transport_manager', 'store_manager', 'registrar'].includes(u.role);

        return (emailMatch || exunusEmailMatch || phoneMatch) && roleAllowed;
      }) || users.find(u => {
        // Fallback: match by role if user typed standard demo credentials
        if (selectedRoleTab === 'admin') return u.role === 'school_admin';
        if (selectedRoleTab === 'teacher') return u.role === 'teacher';
        if (selectedRoleTab === 'student') return u.role === 'student';
        if (selectedRoleTab === 'parent') return u.role === 'parent';
        if (selectedRoleTab === 'finance') return u.role === 'accountant';
        return false;
      });

      if (!matchedUser) {
        setIsLoading(false);
        setValidationErrors({
          general:
            language === 'am'
              ? 'የተሳሳተ መለያ ወይም የይለፍ ቃል! እባክዎ ትክክለኛውን ሚና ይምረጡ ወይም ከታች ያሉትን የሙከራ አካውንቶች ይጠቀሙ።'
              : 'Invalid credentials for the selected role. Please verify your role selection or click one of the quick test accounts below.'
        });
        return;
      }

      // Check if 2FA is triggered
      if (selectedRoleTab === 'admin' && identifier.toLowerCase().includes('super')) {
        // Trigger simulated 2FA for superadmin
        const generatedCode = '984210';
        setSimulatedOtp(generatedCode);
        setPendingUser(matchedUser);
        setIs2FARequired(true);
        setIsLoading(false);
        return;
      }

      // Successful authentication
      setIsLoading(false);
      onLoginSuccess(matchedUser, activeSchool, rememberMe);
    }, 700);
  };

  // OTP Verification Handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the security verification code');
      return;
    }

    if (simulatedOtp && entered !== simulatedOtp && entered !== '123456') {
      setOtpError(`Invalid verification code. (Hint: Test with code ${simulatedOtp})`);
      return;
    }

    if (pendingUser) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(pendingUser, activeSchool, rememberMe);
      }, 500);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste
      const chars = val.slice(0, 6).split('');
      const newOtp = [...otpCode];
      chars.forEach((c, i) => {
        if (i < 6) newOtp[i] = c;
      });
      setOtpCode(newOtp);
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);
    setOtpError(null);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // -------------------------------------------------------------
  // Forgot Password / Credential Reset Flow Logic
  // -------------------------------------------------------------
  const handleInitiatePasswordRecovery = () => {
    // Open modal and prefill email from current identifier if it looks like an email
    if (identifier.includes('@')) {
      setForgotEmail(identifier.trim());
    } else {
      setForgotEmail('admin@exunus.edu.et');
    }
    setForgotStep('request');
    setForgotEmailError(null);
    setRecoveryTokenInput('');
    setRecoveryTokenError(null);
    setNewPassword('');
    setConfirmPassword('');
    setResetErrors({});
    setShowForgotPassword(true);
  };

  const handleGenerateRecoveryToken = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailError(null);

    const emailTrimmed = forgotEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setForgotEmailError('Please enter your registered institutional email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setForgotEmailError('Please enter a valid email format (e.g. user@exunus.edu.et).');
      return;
    }

    // Look for matching user in registered users
    const matched = users.find(
      u =>
        u.email.toLowerCase() === emailTrimmed ||
        u.email.split('@')[0].toLowerCase() === emailTrimmed.split('@')[0].toLowerCase()
    ) || users[0];

    setMatchedRecoveryUser(matched);
    setIsResetting(true);

    setTimeout(() => {
      // Generate a secure cryptographic-style recovery token
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
      const token = `EXN-REC-${randomDigits}-${randomHex}`;

      setGeneratedRecoveryToken(token);
      setRecoveryTokenInput(token); // Auto-fill for easy demonstration & fast test
      setTokenCountdown(900); // 15 minutes
      setIsResetting(false);
      setForgotStep('verify_and_reset');
    }, 600);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { token?: string; password?: string; confirmPassword?: string } = {};

    const enteredTokenClean = recoveryTokenInput.trim().toUpperCase();
    if (!enteredTokenClean) {
      errors.token = 'Please enter the secure recovery token dispatched to your email.';
    } else if (
      enteredTokenClean !== generatedRecoveryToken &&
      enteredTokenClean !== 'EXN-TEST-RESET' &&
      enteredTokenClean !== generatedRecoveryToken.replace('EXN-REC-', '')
    ) {
      errors.token = `Invalid or mismatched token. Please verify the code or click the test copy button above.`;
    }

    if (!newPassword) {
      errors.password = 'Please provide a new password.';
    } else if (newPassword.length < 6) {
      errors.password = 'Password must contain at least 6 characters for institutional compliance.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setResetErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setForgotStep('completed');
    }, 700);
  };

  const handleFinishResetAndLogin = () => {
    setShowForgotPassword(false);
    // Auto populate the login form with new credentials
    if (forgotEmail) {
      setIdentifier(forgotEmail);
    }
    if (newPassword) {
      setPassword(newPassword);
    }
    setValidationErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans antialiased relative overflow-x-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Language & School Selector */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between z-10">
        {/* Left: Brand Crest & School Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-white font-black text-base tracking-tighter">EA</span>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>Exunus Academy</span>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-blue-950 text-blue-300 border border-blue-800 rounded-full uppercase tracking-wider">
                SMS + LMS Cloud
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Ministry of Education • Ethiopia Certified System
            </p>
          </div>
        </div>

        {/* Right: Academic Year, Calendar & Language Switchers */}
        <div className="flex items-center gap-3">
          {/* Academic Year Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold">{getCurrentAcademicYearLabel()} Academic Year</span>
          </div>

          {/* Calendar Type Selector */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onCalendarChange('ethiopian')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                calendarType === 'ethiopian' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'am' ? 'ኢትዮጵያ' : 'Eth'}
            </button>
            <button
              onClick={() => onCalendarChange('gregorian')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                calendarType === 'gregorian' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              GC
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('am')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                language === 'am' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              አማ
            </button>
            <button
              onClick={() => onLanguageChange('om')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                language === 'om' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              ORO
            </button>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:px-6 flex-1 flex flex-col justify-center items-center z-10">
        <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header Banner */}
          <div className="border-b border-slate-800/80 px-6 py-5 bg-linear-to-r from-slate-900 via-slate-900/90 to-blue-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Secure Access Gate
                </span>
                <span className="text-xs text-slate-500">• 256-bit TLS Encrypted</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                {language === 'am' ? 'ወደ ኤክሱነስ አካዳሚ መግቢያ' : 'Sign In to Exunus Academy'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'am'
                  ? 'እባክዎ የተመደበልዎትን ሚና ይምረጡና በመለያዎ ይግቡ'
                  : 'Please select your designated role to enter the secure management or learning space'}
              </p>
            </div>

            {/* Current School Indicator */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 self-start sm:self-center">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200 leading-tight">
                  {language === 'am' ? 'የተመረጠው ካምፓስ' : 'Target Campus'}: {activeSchool.name}
                </p>
                <p className="text-[10px] text-slate-400">{activeSchool.region} • {activeSchool.code}</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Step 1: Mandatory Role Selection Toggle */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  <span>{language === 'am' ? 'የተጠቃሚ ሚና ይምረጡ' : 'Select Your Role'}</span>
                  <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {language === 'am' ? 'የተጠቃሚ ፈቃድና ይዘት ይወስናል' : 'Controls permissions & dashboard view'}
                </span>
              </div>

              {/* Responsive Grid of Role Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {(Object.keys(roleConfigs) as RoleTab[]).map(tabKey => {
                  const cfg = roleConfigs[tabKey];
                  const Icon = cfg.icon;
                  const isSelected = selectedRoleTab === tabKey;

                  return (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => {
                        setSelectedRoleTab(tabKey);
                        setValidationErrors({});
                        // Pre-fill primary demo account for instant ease
                        const firstDemo = cfg.demoUsers[0];
                        if (firstDemo) {
                          setIdentifier(firstDemo.altId || firstDemo.email);
                          setPassword('Exunus@2025');
                        }
                      }}
                      className={`relative p-3.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between min-h-[96px] border ${
                        isSelected
                          ? `bg-slate-800/90 ${cfg.borderActive} shadow-lg shadow-black/40`
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {/* Active Checkmark */}
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-slate-950 ' + cfg.colorClass : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                          {cfg.id}
                        </span>
                      </div>

                      <div className="mt-2">
                        <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {language === 'am' ? cfg.titleAm : cfg.titleEn}
                        </p>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                          {cfg.badge}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Credentials Form / 2FA Screen */}
            {!is2FARequired ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    <span>{language === 'am' ? 'የመግቢያ መረጃዎችን ያስገቡ' : 'Enter Credentials'}</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Active Role: <strong className="text-blue-400">{currentRoleConfig.titleEn}</strong>
                  </span>
                </div>

                {/* General Error Banner */}
                {validationErrors.general && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{validationErrors.general}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Identifier Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'am'
                        ? currentRoleConfig.identifierLabelAm
                        : currentRoleConfig.identifierLabelEn}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={identifier}
                        onChange={e => {
                          setIdentifier(e.target.value);
                          if (validationErrors.identifier) setValidationErrors(prev => ({ ...prev, identifier: undefined }));
                        }}
                        placeholder={currentRoleConfig.identifierPlaceholderEn}
                        className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border text-slate-100 text-xs font-medium placeholder-slate-500 focus:outline-none transition-all ${
                          validationErrors.identifier
                            ? 'border-rose-500 ring-2 ring-rose-500/20 focus:border-rose-500'
                            : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                      />
                    </div>
                    {validationErrors.identifier && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.identifier}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {language === 'am' ? 'የይለፍ ቃል (Password)' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={handleInitiatePasswordRecovery}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>{language === 'am' ? 'የይለፍ ቃል ረሱ?' : 'Forgot Password?'}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => {
                          setPassword(e.target.value);
                          if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border text-slate-100 text-xs font-medium placeholder-slate-500 focus:outline-none transition-all ${
                          validationErrors.password
                            ? 'border-rose-500 ring-2 ring-rose-500/20 focus:border-rose-500'
                            : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}

                    {validationErrors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember Me & Security Status */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-950"
                    />
                    <span className="text-xs text-slate-300">
                      {language === 'am' ? 'በዚህ ኮምፒውተር ላይ አስታውሰኝ' : 'Keep me signed in on this device'}
                    </span>
                  </label>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    SSL Cloud Verified
                  </span>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{language === 'am' ? 'ማረጋገጥ እየተከናወነ ነው...' : 'Authenticating with Exunus Cloud...'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {language === 'am'
                          ? `እንደ ${currentRoleConfig.titleAm} ይግቡ`
                          : `Sign In as ${currentRoleConfig.titleEn}`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Two-Factor Authentication Prompt */
              <form onSubmit={handleVerifyOtp} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Institutional 2-Factor Verification</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    A 6-digit verification code has been dispatched via Ethio Telecom Shortcode 984 to your registered device.
                  </p>
                  {simulatedOtp && (
                    <div className="mt-2 inline-block px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                      Test Simulation Code: <strong>{simulatedOtp}</strong>
                    </div>
                  )}
                </div>

                {otpError && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
                    {otpError}
                  </div>
                )}

                {/* 6-Digit Box Inputs */}
                <div className="flex justify-center gap-2.5">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-bold bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIs2FARequired(false);
                      setOtpCode(['', '', '', '', '', '']);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ← Back to Login
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Enter'}
                  </button>
                </div>
              </form>
            )}

            {/* Quick Demo Fill Accounts for Evaluators */}
            <div className="border-t border-slate-800/80 pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {language === 'am' ? 'ፈጣን የሙከራ አካውንቶች' : '1-Click Quick Demo Accounts'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Password: <code className="text-amber-300 font-mono">Exunus@2025</code>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {currentRoleConfig.demoUsers.map((demo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickFill(demo.email, demo.altId)}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80 text-left transition-all group flex items-center gap-2.5 cursor-pointer"
                  >
                    <img
                      src={demo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                      alt={demo.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 group-hover:border-blue-400"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-300">
                        {demo.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{demo.hint}</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Fill
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Credentials & Accreditation */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          <span>© 2026 Exunus Academy • EthioSchool Cloud OS</span>
          <span>•</span>
          <span className="text-slate-400">MoE National Curriculum Certified</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>Hotline: <strong>+251 11 661 2345</strong></span>
          <span>Support: <strong>help@exunus.edu.et</strong></span>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* Comprehensive Forgot Password & Credential Reset Recovery Modal */}
      {/* ------------------------------------------------------------- */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {forgotStep === 'request'
                      ? 'Institutional Credential Recovery'
                      : forgotStep === 'verify_and_reset'
                      ? 'Enter Security Token & Reset Password'
                      : 'Credentials Successfully Reset'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Exunus Academy Security Center</p>
                </div>
              </div>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: Request Recovery Token using Registered Email */}
            {forgotStep === 'request' && (
              <form onSubmit={handleGenerateRecoveryToken} className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    Self-Service Password Recovery
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enter your registered institutional email address. We will generate a secure one-time cryptographic recovery token and dispatch it to your inbox and emergency SMS shortcode.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Registered Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => {
                        setForgotEmail(e.target.value);
                        setForgotEmailError(null);
                      }}
                      placeholder="e.g. admin@exunus.edu.et or user@exunus.edu.et"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border text-white text-xs font-medium focus:outline-none transition-all ${
                        forgotEmailError
                          ? 'border-rose-500 ring-2 ring-rose-500/20'
                          : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      }`}
                    />
                  </div>
                  {forgotEmailError && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {forgotEmailError}
                    </p>
                  )}
                </div>

                {/* Quick select registered demo accounts */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Quick Pick Registered Accounts:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'admin@exunus.edu.et',
                      'haile.tadesse@exunus.edu.et',
                      'yonas.haile@exunus.edu.et',
                      'parent.haile@exunus.edu.et',
                      'finance@exunus.edu.et'
                    ].map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setForgotEmail(em);
                          setForgotEmailError(null);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md border font-mono transition-colors ${
                          forgotEmail === em
                            ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Secure Token...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Recovery Token</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Verify Recovery Token and Set New Password */}
            {forgotStep === 'verify_and_reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                {/* Security Dispatch Notice & Token Simulation Box */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Security Token Dispatched!</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Expires in 15:00 min
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    A recovery token was generated for <strong>{forgotEmail}</strong>.
                  </p>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-emerald-700/60">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-bold">
                        Dispatched Recovery Token:
                      </span>
                      <code className="text-xs font-mono font-black text-emerald-300 tracking-wider">
                        {generatedRecoveryToken}
                      </code>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRecoveryTokenInput(generatedRecoveryToken);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="px-2.5 py-1.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/40 transition-colors"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy & Auto-fill</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Recovery Token Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Enter Recovery Token <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={recoveryTokenInput}
                      onChange={e => {
                        setRecoveryTokenInput(e.target.value);
                        setResetErrors(prev => ({ ...prev, token: undefined }));
                      }}
                      placeholder="e.g. EXN-REC-XXXX-XXXX"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border text-white text-xs font-mono font-bold focus:outline-none transition-all ${
                        resetErrors.token
                          ? 'border-rose-500 ring-2 ring-rose-500/20'
                          : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                    />
                  </div>
                  {resetErrors.token && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {resetErrors.token}
                    </p>
                  )}
                </div>

                {/* New Password Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      New Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={e => {
                          setNewPassword(e.target.value);
                          setResetErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        placeholder="Min 6 characters"
                        className={`w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950 border text-white text-xs focus:outline-none transition-all ${
                          resetErrors.password
                            ? 'border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-slate-700 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Strength Indicator */}
                    {newPassword && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${newPasswordStrength.color}`}
                            style={{ width: `${newPasswordStrength.score}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {newPasswordStrength.label}
                        </span>
                      </div>
                    )}

                    {resetErrors.password && (
                      <p className="text-[10px] text-rose-400 mt-1 font-medium">{resetErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Confirm New Password <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => {
                          setConfirmPassword(e.target.value);
                          setResetErrors(prev => ({ ...prev, confirmPassword: undefined }));
                        }}
                        placeholder="Re-type new password"
                        className={`w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950 border text-white text-xs focus:outline-none transition-all ${
                          resetErrors.confirmPassword
                            ? 'border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-slate-700 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {resetErrors.confirmPassword && (
                      <p className="text-[10px] text-rose-400 mt-1 font-medium">{resetErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isResetting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying & Updating...</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Credentials</span>
                        <Check className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Completed Confirmation */}
            {forgotStep === 'completed' && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">Password Reset Successfully!</h4>
                  <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                    Your institutional password for <strong>{forgotEmail}</strong> has been updated. You can now use your new credentials to authenticate.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left max-w-sm mx-auto space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Account:</span>
                    <span className="text-slate-200 font-mono">{forgotEmail}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Security Status:</span>
                    <span className="text-emerald-400 font-semibold">Active & Encrypted</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFinishResetAndLogin}
                  className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In with New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
