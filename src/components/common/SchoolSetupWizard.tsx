import React, { useState } from 'react';
import {
  School as SchoolIcon,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { School, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface SchoolSetupWizardProps {
  school: School;
  language: LanguageCode;
  onClose: () => void;
  onSaveSetup: (updatedSchool: Partial<School>) => void;
}

export const SchoolSetupWizard: React.FC<SchoolSetupWizardProps> = ({
  school,
  language,
  onClose,
  onSaveSetup
}) => {
  const { t } = useTranslation(language);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: school.name,
    nameAm: school.nameAm || '',
    code: school.code,
    motto: school.motto || 'Excellence in Education and Character',
    region: school.region,
    city: school.city,
    subcity: school.subcity || 'Bole',
    phone: school.phone,
    email: school.email,
    plan: school.plan
  });

  const handleFinish = () => {
    onSaveSetup(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 my-8 border border-slate-200 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <SchoolIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">School Configuration Wizard</h2>
              <p className="text-xs text-slate-500">Step {step} of 4: Setup Ethiopian Academic Parameters</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'Academic Calendar' },
            { num: 3, label: 'Grades & Streams' },
            { num: 4, label: 'Grading Scale' }
          ].map(s => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= s.num ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {s.num}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${step >= s.num ? 'text-slate-900' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">School Name (English)*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">School Name (አማርኛ)</label>
                <input
                  type="text"
                  value={formData.nameAm}
                  onChange={e => setFormData({ ...formData, nameAm: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Region</label>
                <select
                  value={formData.region}
                  onChange={e => setFormData({ ...formData, region: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                  <option value="Oromia">Oromia (ኦሮሚያ)</option>
                  <option value="Amhara">Amhara (አማራ)</option>
                  <option value="Sidama">Sidama (ሲዳማ)</option>
                  <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">City / Subcity</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">School Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Calendar */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
              <h4 className="font-bold">Ethiopian Academic Calendar System (2017 E.C.)</h4>
              <p className="mt-1 text-[11px] text-blue-800">
                13 Months (Meskerem to Pagume). 30 days in 12 months + 5/6 days in Pagume.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Semester I (ሴሚስተር 1)</span>
                <p className="text-slate-500 mt-1 text-[11px]">Meskerem 15 - Tir 30 (Sep - Feb)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Semester II (ሴሚስተር 2)</span>
                <p className="text-slate-500 mt-1 text-[11px]">Yekatit 15 - Sene 30 (Feb - Jul)</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Grades & Streams */}
        {step === 3 && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Configured National Streams</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Secondary Natural Science Stream (የተፈጥሮ ሳይንስ)</p>
                  <p className="text-[11px] text-slate-500">Physics, Chemistry, Biology, Mathematics, English, ICT</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Secondary Social Science Stream (የማህበራዊ ሳይንስ)</p>
                  <p className="text-[11px] text-slate-500">History, Geography, Economics, General Business, English</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Grading Scale */}
        {step === 4 && (
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Ministry of Education Standard Letter Grading</h4>
            <p className="text-slate-500">A+ (90-100), A (85-89), A- (80-84), B+ (75-79), B (70-74), C (50-59), D (40-49), F (&lt;40)</p>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              ✓ Ready to deploy configurations to tenant database.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-slate-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              Next Step &rarr;
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save & Apply Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
