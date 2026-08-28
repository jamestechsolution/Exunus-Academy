import React from 'react';
import { Bus, MapPin, Phone, Users, CheckCircle2 } from 'lucide-react';
import { TransportRoute, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface TransportManagerProps {
  routes: TransportRoute[];
  language: LanguageCode;
}

export const TransportManager: React.FC<TransportManagerProps> = ({ routes, language }) => {
  const { t } = useTranslation(language);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('transport')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            School bus fleet routing, pick-up stations across Addis Ababa, and driver contacts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {routes.map(route => (
          <div key={route.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{route.routeName}</h3>
                    <p className="font-mono text-xs text-slate-500">Plate: {route.vehiclePlateNumber}</p>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Capacity: {route.capacity} Seats
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Driver: <strong className="text-slate-900">{route.driverName}</strong></span>
                <span className="font-mono text-blue-700 font-semibold">{route.driverPhone}</span>
              </div>
              <p className="text-[11px] text-slate-500">Fee: {(route?.monthlyFee || 0).toLocaleString()} ETB / month</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Designated Stops & Stations</span>
              <div className="flex flex-wrap gap-1.5">
                {route.stops.map((stop, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {stop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
