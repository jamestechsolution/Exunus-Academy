import React from 'react';
import {
  Building2,
  Users,
  CreditCard,
  Server,
  Activity,
  PlusCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { School, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface SuperAdminDashboardProps {
  schools: School[];
  language: LanguageCode;
  onAddNewSchool: () => void;
  onSelectSchool: (schoolId: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  schools,
  language,
  onAddNewSchool,
  onSelectSchool
}) => {
  const { t } = useTranslation(language);

  const activeCount = schools.filter(s => s.subscriptionStatus === 'active').length;
  const totalRevenue = schools.length * 45000; // Sample aggregated ARR

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            EthioSchool Multi-Tenant SaaS Cloud
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Super Admin Platform Operations</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Centralized monitoring of all registered Ethiopian schools, subscription tiers, platform health, and tenant databases.
          </p>
        </div>
        <button
          onClick={onAddNewSchool}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Provision New School
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Schools</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{schools.length}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">100% cloud uptime</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Subscriptions</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{activeCount} / {schools.length}</p>
          <p className="text-xs text-slate-500 mt-1">Enterprise & Standard</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Network Students</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">1,840</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+12% from last academic term</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Platform SaaS Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{(totalRevenue || 0).toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 mt-1">Annual SaaS Recurring</p>
        </div>
      </div>

      {/* Tenant Schools Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Registered Ethiopian Schools & Campuses</h3>
            <p className="text-xs text-slate-500">Isolated database schemas with independent academic calendars</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md">
            {schools.length} Tenants Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {schools.map(school => (
            <div key={school.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-4">
                <img
                  src={school.logo || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100'}
                  alt={school.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{school.name}</h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {school.code}
                    </span>
                  </div>
                  {school.nameAm && (
                    <p className="text-xs text-slate-500 mt-0.5">{school.nameAm}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
                    <span>📍 {school.city}, {school.region}</span>
                    <span>📞 {school.phone}</span>
                    <span>✉️ {school.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  school.plan === 'enterprise'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {school.plan.toUpperCase()} PLAN
                </span>

                <button
                  onClick={() => onSelectSchool(school.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Manage School
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
