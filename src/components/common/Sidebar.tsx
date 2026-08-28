import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCheck,
  UserPlus,
  BookOpen,
  CalendarCheck,
  Award,
  FileText,
  Clock,
  DollarSign,
  Briefcase,
  Library,
  Box,
  Bus,
  Megaphone,
  ShieldAlert,
  Layers,
  BookMarked,
  FileEdit,
  HelpCircle,
  Video,
  CheckCircle2,
  Settings,
  ChevronRight,
  School as SchoolIcon,
  LogOut,
  Shield,
  Sparkles
} from 'lucide-react';
import { UserRole, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

export interface RoleTheme {
  name: string;
  roleBadge: string;
  gradient: string;
  activeItemBg: string;
  activeItemShadow: string;
  chevronColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  subtextColor: string;
  indicatorRing: string;
  glowBg: string;
  sidebarBorder: string;
}

export const ROLE_SIDEBAR_THEMES: Record<string, RoleTheme> = {
  // Admin & Leadership: Royal Blue / Indigo
  super_admin: {
    name: 'Super Admin',
    roleBadge: 'Platform Super Admin',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    activeItemBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    activeItemShadow: 'shadow-md shadow-blue-600/30',
    chevronColor: 'text-blue-200',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-800/80',
    subtextColor: 'text-blue-400',
    indicatorRing: 'ring-blue-500',
    glowBg: 'bg-blue-500/10',
    sidebarBorder: 'border-blue-900/30'
  },
  school_admin: {
    name: 'School Admin',
    roleBadge: 'Executive Leadership',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    activeItemBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    activeItemShadow: 'shadow-md shadow-blue-600/30',
    chevronColor: 'text-blue-200',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-800/80',
    subtextColor: 'text-blue-400',
    indicatorRing: 'ring-blue-500',
    glowBg: 'bg-blue-500/10',
    sidebarBorder: 'border-blue-900/30'
  },
  principal: {
    name: 'Principal',
    roleBadge: 'School Principal',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    activeItemBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    activeItemShadow: 'shadow-md shadow-blue-600/30',
    chevronColor: 'text-blue-200',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-800/80',
    subtextColor: 'text-blue-400',
    indicatorRing: 'ring-blue-500',
    glowBg: 'bg-blue-500/10',
    sidebarBorder: 'border-blue-900/30'
  },
  vice_principal: {
    name: 'Vice Principal',
    roleBadge: 'Academic Dean',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    activeItemBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    activeItemShadow: 'shadow-md shadow-blue-600/30',
    chevronColor: 'text-blue-200',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-800/80',
    subtextColor: 'text-blue-400',
    indicatorRing: 'ring-blue-500',
    glowBg: 'bg-blue-500/10',
    sidebarBorder: 'border-blue-900/30'
  },
  academic_director: {
    name: 'Academic Director',
    roleBadge: 'Curriculum Leadership',
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    activeItemBg: 'bg-blue-600 hover:bg-blue-500 text-white',
    activeItemShadow: 'shadow-md shadow-blue-600/30',
    chevronColor: 'text-blue-200',
    badgeBg: 'bg-blue-950/80',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-800/80',
    subtextColor: 'text-blue-400',
    indicatorRing: 'ring-blue-500',
    glowBg: 'bg-blue-500/10',
    sidebarBorder: 'border-blue-900/30'
  },

  // Teachers / Faculty: Emerald / Green
  teacher: {
    name: 'Teacher',
    roleBadge: 'Faculty & Instructor',
    gradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    activeItemBg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    activeItemShadow: 'shadow-md shadow-emerald-600/30',
    chevronColor: 'text-emerald-200',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-800/80',
    subtextColor: 'text-emerald-400',
    indicatorRing: 'ring-emerald-500',
    glowBg: 'bg-emerald-500/10',
    sidebarBorder: 'border-emerald-900/30'
  },

  // Parents: Purple / Violet
  parent: {
    name: 'Parent',
    roleBadge: 'Parent & Guardian Portal',
    gradient: 'from-purple-600 via-violet-600 to-purple-700',
    activeItemBg: 'bg-purple-600 hover:bg-purple-500 text-white',
    activeItemShadow: 'shadow-md shadow-purple-600/30',
    chevronColor: 'text-purple-200',
    badgeBg: 'bg-purple-950/80',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-800/80',
    subtextColor: 'text-purple-400',
    indicatorRing: 'ring-purple-500',
    glowBg: 'bg-purple-500/10',
    sidebarBorder: 'border-purple-900/30'
  },

  // Students: Amber / Golden Orange
  student: {
    name: 'Student',
    roleBadge: 'Student Learning Portal',
    gradient: 'from-amber-600 via-orange-600 to-amber-700',
    activeItemBg: 'bg-amber-600 hover:bg-amber-500 text-white',
    activeItemShadow: 'shadow-md shadow-amber-600/30',
    chevronColor: 'text-amber-200',
    badgeBg: 'bg-amber-950/80',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-800/80',
    subtextColor: 'text-amber-400',
    indicatorRing: 'ring-amber-500',
    glowBg: 'bg-amber-500/10',
    sidebarBorder: 'border-amber-900/30'
  },

  // Finance & Staff: Sky Blue / Cyan
  accountant: {
    name: 'Finance & Accounts',
    roleBadge: 'Finance & Tuition ERP',
    gradient: 'from-sky-600 via-cyan-600 to-sky-700',
    activeItemBg: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeItemShadow: 'shadow-md shadow-sky-600/30',
    chevronColor: 'text-sky-200',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/80',
    subtextColor: 'text-sky-400',
    indicatorRing: 'ring-sky-500',
    glowBg: 'bg-sky-500/10',
    sidebarBorder: 'border-sky-900/30'
  },
  librarian: {
    name: 'Librarian',
    roleBadge: 'Library & Media',
    gradient: 'from-sky-600 via-cyan-600 to-sky-700',
    activeItemBg: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeItemShadow: 'shadow-md shadow-sky-600/30',
    chevronColor: 'text-sky-200',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/80',
    subtextColor: 'text-sky-400',
    indicatorRing: 'ring-sky-500',
    glowBg: 'bg-sky-500/10',
    sidebarBorder: 'border-sky-900/30'
  },
  hr_manager: {
    name: 'HR & Payroll',
    roleBadge: 'Human Resources',
    gradient: 'from-sky-600 via-cyan-600 to-sky-700',
    activeItemBg: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeItemShadow: 'shadow-md shadow-sky-600/30',
    chevronColor: 'text-sky-200',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/80',
    subtextColor: 'text-sky-400',
    indicatorRing: 'ring-sky-500',
    glowBg: 'bg-sky-500/10',
    sidebarBorder: 'border-sky-900/30'
  },
  registrar: {
    name: 'Registrar',
    roleBadge: 'Admissions & Records',
    gradient: 'from-sky-600 via-cyan-600 to-sky-700',
    activeItemBg: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeItemShadow: 'shadow-md shadow-sky-600/30',
    chevronColor: 'text-sky-200',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/80',
    subtextColor: 'text-sky-400',
    indicatorRing: 'ring-sky-500',
    glowBg: 'bg-sky-500/10',
    sidebarBorder: 'border-sky-900/30'
  },
  transport_manager: {
    name: 'Transport Manager',
    roleBadge: 'Fleet & Logistics',
    gradient: 'from-sky-600 via-cyan-600 to-sky-700',
    activeItemBg: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeItemShadow: 'shadow-md shadow-sky-600/30',
    chevronColor: 'text-sky-200',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/80',
    subtextColor: 'text-sky-400',
    indicatorRing: 'ring-sky-500',
    glowBg: 'bg-sky-500/10',
    sidebarBorder: 'border-sky-900/30'
  },
  store_manager: {
    name: 'Store Manager',
    roleBadge: 'Inventory & Supplies',
    gradient: 'from-sky-600 via-cyan-600 to-sky-700',
    activeItemBg: 'bg-sky-600 hover:bg-sky-500 text-white',
    activeItemShadow: 'shadow-md shadow-sky-600/30',
    chevronColor: 'text-sky-200',
    badgeBg: 'bg-sky-950/80',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-800/80',
    subtextColor: 'text-sky-400',
    indicatorRing: 'ring-sky-500',
    glowBg: 'bg-sky-500/10',
    sidebarBorder: 'border-sky-900/30'
  }
};

interface SidebarProps {
  activeTab: string;
  userRole: UserRole;
  language: LanguageCode;
  onSelectTab: (tab: string) => void;
  onOpenSetupWizard?: () => void;
  onLogout?: () => void;
  roleAccentOverride?: RoleTheme;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  userRole,
  language,
  onSelectTab,
  onOpenSetupWizard,
  onLogout,
  roleAccentOverride
}) => {
  const { t } = useTranslation(language);

  // Derive active role theme
  const theme: RoleTheme =
    roleAccentOverride ||
    ROLE_SIDEBAR_THEMES[userRole] ||
    ROLE_SIDEBAR_THEMES['school_admin'];

  // SMS Navigation Items with role-based filtering
  const smsNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard, roles: ['all'] },
    { id: 'students', label: t('students'), icon: GraduationCap, roles: ['super_admin', 'school_admin', 'principal', 'vice_principal', 'registrar', 'teacher', 'accountant'] },
    { id: 'teachers', label: t('teachers'), icon: Users, roles: ['super_admin', 'school_admin', 'principal', 'vice_principal', 'academic_director', 'hr_manager'] },
    { id: 'parents', label: t('parents'), icon: UserCheck, roles: ['super_admin', 'school_admin', 'principal', 'registrar', 'teacher'] },
    { id: 'admissions', label: t('admissions'), icon: UserPlus, roles: ['super_admin', 'school_admin', 'principal', 'registrar'] },
    { id: 'classes', label: t('classesAndSections'), icon: Layers, roles: ['super_admin', 'school_admin', 'principal', 'academic_director', 'teacher'] },
    { id: 'subjects', label: t('subjects'), icon: BookOpen, roles: ['super_admin', 'school_admin', 'principal', 'academic_director', 'teacher'] },
    { id: 'attendance', label: t('attendance'), icon: CalendarCheck, roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'parent', 'student'] },
    { id: 'exams', label: t('examsAndAssessments'), icon: Award, roles: ['super_admin', 'school_admin', 'principal', 'academic_director', 'teacher', 'student', 'parent'] },
    { id: 'report-cards', label: t('reportCards'), icon: FileText, roles: ['super_admin', 'school_admin', 'principal', 'teacher', 'student', 'parent'] },
    { id: 'timetable', label: t('timetable'), icon: Clock, roles: ['all'] },
    { id: 'finance', label: t('financeAndFees'), icon: DollarSign, roles: ['super_admin', 'school_admin', 'accountant', 'parent', 'student'] },
    { id: 'payroll', label: t('hrAndPayroll'), icon: Briefcase, roles: ['super_admin', 'school_admin', 'hr_manager', 'accountant'] },
    { id: 'library', label: t('library'), icon: Library, roles: ['all'] },
    { id: 'inventory', label: t('inventory'), icon: Box, roles: ['super_admin', 'school_admin', 'store_manager', 'principal'] },
    { id: 'transport', label: t('transport'), icon: Bus, roles: ['super_admin', 'school_admin', 'transport_manager', 'parent', 'student'] },
    { id: 'announcements', label: t('announcements'), icon: Megaphone, roles: ['all'] },
    { id: 'audit-logs', label: t('auditLogs'), icon: ShieldAlert, roles: ['super_admin', 'school_admin', 'principal'] }
  ];

  // LMS Navigation Items
  const lmsNavItems = [
    { id: 'lms-overview', label: t('lmsDashboard'), icon: LayoutDashboard, roles: ['all'] },
    { id: 'courses', label: t('courses'), icon: BookMarked, roles: ['all'] },
    { id: 'assignments', label: t('assignments'), icon: FileEdit, roles: ['all'] },
    { id: 'quizzes', label: t('quizzesAndExams'), icon: HelpCircle, roles: ['all'] },
    { id: 'live-classes', label: t('liveClasses'), icon: Video, roles: ['all'] },
    { id: 'certificates', label: t('certificates'), icon: CheckCircle2, roles: ['all'] }
  ];

  const canAccess = (roles: string[]) => {
    if (roles.includes('all')) return true;
    if (userRole === 'super_admin' || userRole === 'school_admin') return true;
    return roles.includes(userRole);
  };

  return (
    <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r ${theme.sidebarBorder} select-none transition-colors duration-300`}>
      {/* Brand Header with Role Accent Crest */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-linear-to-tr ${theme.gradient} text-white flex items-center justify-center font-black text-base shadow-md`}>
            EA
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-white text-sm tracking-tight truncate">Exunus Academy</h1>
            <p className={`text-[10px] font-semibold truncate ${theme.subtextColor}`}>
              {theme.roleBadge}
            </p>
          </div>
        </div>
      </div>

      {/* Role Visual Identification Indicator Bar */}
      <div className="px-3 pt-2.5 pb-1">
        <div className={`px-2.5 py-1.5 rounded-lg ${theme.badgeBg} border ${theme.badgeBorder} flex items-center justify-between`}>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full bg-linear-to-tr ${theme.gradient} animate-pulse`} />
            <span className={`text-[10px] font-extrabold uppercase tracking-wider ${theme.badgeText}`}>
              {theme.name}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono">
            {userRole.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
        {/* Section 1: SMS (School Management) */}
        <div>
          <div className="px-3 mb-1.5 flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.subtextColor}`}>
              {t('schoolManagement')}
            </span>
            <span className={`text-[9px] ${theme.badgeBg} ${theme.badgeText} px-1.5 py-0.5 rounded font-mono border ${theme.badgeBorder}`}>
              ERP
            </span>
          </div>
          <div className="space-y-0.5">
            {smsNavItems.filter(item => canAccess(item.roles)).map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? `${theme.activeItemBg} ${theme.activeItemShadow} font-bold`
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className={`w-3.5 h-3.5 ${theme.chevronColor} shrink-0`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: LMS (Learning Management System) */}
        <div>
          <div className="px-3 mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('learningManagement')}
            </span>
            <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono border border-slate-700">
              LMS
            </span>
          </div>
          <div className="space-y-0.5">
            {lmsNavItems.filter(item => canAccess(item.roles)).map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? `${theme.activeItemBg} ${theme.activeItemShadow} font-bold`
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className={`w-3.5 h-3.5 ${theme.chevronColor} shrink-0`} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer / School Setup Button & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1.5">
        {(userRole === 'super_admin' || userRole === 'school_admin') && (
          <button
            onClick={onOpenSetupWizard}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
          >
            <Settings className="w-3.5 h-3.5 text-slate-300" />
            <span>School Setup Wizard</span>
          </button>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold transition-colors border border-rose-900/50"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
