import React, { useState } from 'react';
import { Box, Plus, Search, CheckCircle2, AlertCircle, Wrench } from 'lucide-react';
import { InventoryItem, LanguageCode } from '../../types';
import { useTranslation } from '../../utils/i18n';

interface InventoryManagerProps {
  items: InventoryItem[];
  language: LanguageCode;
  onAddItem?: (item: Partial<InventoryItem>) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  items,
  language,
  onAddItem
}) => {
  const { t } = useTranslation(language);
  const [search, setSearch] = useState('');

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.assetCode.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t('inventory')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            School assets, lab apparatus, IT computer labs, and maintenance records
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets, asset codes, categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Value (ETB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.assetCode}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                  <td className="py-3 px-4 text-slate-600">{item.category}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.quantity}</td>
                  <td className="py-3 px-4 text-slate-600">{item.location}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      item.condition === 'good'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.condition === 'fair'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.condition.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {(((item?.purchasePrice || 0) * (item?.quantity || 0)) || 0).toLocaleString()} ETB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
