import React, { useState } from 'react';
import {
  Bell,
  Search,
  Globe,
  Calendar,
  UserCheck,
  Smartphone,
  ChevronDown,
  ShieldCheck,
  CheckCircle,
  Wifi,
  Sparkles,
  School as SchoolIcon,
  LogOut
} from 'lucide-react';
import { User, School, LanguageCode, CalendarType, AppNotification } from '../../types';
import { useTranslation } from '../../utils/i18n';
import { formatEduDate, getCurrentAcademicYearLabel } from '../../utils/ethiopianCalendar';

interface HeaderProps {
  currentUser: User;
  currentSchool: School;
  schools: School[];
  language: LanguageCode;
  calendarType: CalendarType;
  notifications: AppNotification[];
  isMobileSimulatorOpen: boolean;
  isAIAdvisorOpen: boolean;
  onLanguageChange: (lang: LanguageCode) => void;
  onCalendarChange: (cal: CalendarType) => void;
  onSwitchPersona: (userId: string) => void;
  onSwitchSchool: (schoolId: string) => void;
  onToggleMobileSimulator: () => void;
  onToggleAIAdvisor: () => void;
  onLogout?: () => void;
  onNotificationClick?: (notif: AppNotification) => void;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentSchool,
  schools,
  language,
  calendarType,
  notifications,
  isMobileSimulatorOpen,
  isAIAdvisorOpen,
  onLanguageChange,
  onCalendarChange,
  onSwitchPersona,
  onSwitchSchool,
  onToggleMobileSimulator,
  onToggleAIAdvisor,
  onLogout,
  onNotificationClick,
  onSearchChange
}) => {
  const { t } = useTranslation(language);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const personas = [
    { id: 'user-superadmin', label: 'Super Admin (Dr. Zewdu)', role: 'Platform SaaS Super Admin' },
    { id: 'user-admin', label: 'School Admin (W/ro Aster)', role: 'Academy Administrator' },
    { id: 'user-principal', label: 'Principal (Ato Girma)', role: 'School Principal' },
    { id: 'user-teacher-1', label: 'Teacher (Ato Haile)', role: 'Physics & Math Faculty' },
    { id: 'user-student-1', label: 'Student (Yonas Haile)', role: 'Grade 11 Natural Science' },
    { id: 'user-parent-1', label: 'Parent (Ato Haile Kebede)', role: 'Parent of 2 Students' },
    { id: 'user-accountant-1', label: 'Accountant (Ato Dawit)', role: 'Finance & Payments' },
    { id: 'user-librarian-1', label: 'Librarian (W/ro Genet)', role: 'Library Manager' }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: School Selector & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        {/* School Badge Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSchoolMenu(!showSchoolMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-left"
            title="Switch School"
          >
            <div className="w-7 h-7 rounded-md bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              {currentSchool.code.slice(0, 2)}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800 truncate max-w-[160px] leading-tight">
                {language === 'am' && currentSchool.nameAm ? currentSchool.nameAm : currentSchool.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">{currentSchool.region} • {currentSchool.code}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showSchoolMenu && (
            <div className="absolute left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Schools & Campuses</p>
              </div>
              {schools.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    onSwitchSchool(s.id);
                    setShowSchoolMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                    s.id === currentSchool.id ? 'bg-blue-50/70' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.city}, {s.region} • Plan: {s.plan.toUpperCase()}</p>
                  </div>
                  {s.id === currentSchool.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            onChange={e => onSearchChange?.(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync / Live Status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
          <Wifi className="w-3.5 h-3.5 animate-pulse" />
          <span>Online (Sync Active)</span>
        </div>

        {/* AI Educational Advisor Launcher */}
        <button
          onClick={onToggleAIAdvisor}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isAIAdvisorOpen
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
          }`}
          title="AI Pedagogical Assistant"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Advisor</span>
        </button>

        {/* Mobile App Simulator Toggle */}
        <button
          onClick={onToggleMobileSimulator}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isMobileSimulatorOpen
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Toggle Mobile App Simulator"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mobile App</span>
        </button>

        {/* Calendar Switcher (EC / GC) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => onCalendarChange('ethiopian')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              calendarType === 'ethiopian'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Ethiopian Calendar (ዓመተ ምሕረት)"
          >
            E.C. (ዓ.ም)
          </button>
          <button
            onClick={() => onCalendarChange('gregorian')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              calendarType === 'gregorian'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Gregorian Calendar"
          >
            G.C.
          </button>
        </div>

        {/* Language Switcher (EN / AM / OM) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              language === 'en' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange('am')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              language === 'am' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="አማርኛ"
          >
            አማ
          </button>
          <button
            onClick={() => onLanguageChange('om')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              language === 'om' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Afaan Oromoo"
          >
            ORO
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount} new)</span>
                <span className="text-[11px] text-blue-600 font-medium cursor-pointer">Mark all as read</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNotificationClick?.(n);
                        setShowNotifs(false);
                      }}
                      className={`p-3 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {formatEduDate(n.createdAt, calendarType, language)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Demo Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-left"
            title="Switch Demo Role"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-blue-300"
            />
            <div className="hidden xl:block">
              <p className="text-xs font-bold text-blue-900 leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-blue-700 capitalize font-medium mt-0.5">{currentUser.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-blue-700" />
          </button>

          {showPersonaMenu && (
            <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
                <p className="text-xs font-bold text-slate-800">{t('quickPersonaSwitch')}</p>
                <p className="text-[11px] text-slate-500">Test every role with realistic permissions & live data</p>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {personas.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchPersona(p.id);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      currentUser.id === p.id ? 'bg-blue-50 font-medium' : ''
                    }`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{p.label}</p>
                      <p className="text-[10px] text-slate-500">{p.role}</p>
                    </div>
                    {currentUser.id === p.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>

              {onLogout && (
                <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-xl">
                  <button
                    onClick={() => {
                      setShowPersonaMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-700 hover:bg-rose-100/70 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Exunus Academy</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dedicated Logout Action */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
