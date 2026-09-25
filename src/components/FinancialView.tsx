import React, { useState } from 'react';
import { FinancialItem } from '../types/legal';
import {
  DollarSign,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  PieChart,
  Copy,
  Check,
} from 'lucide-react';

interface FinancialViewProps {
  items: FinancialItem[];
  docTitle: string;
}

export const FinancialView: React.FC<FinancialViewProps> = ({ items, docTitle }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterOptions = [
    { id: 'all', label: 'All Financials' },
    { id: 'recurring', label: 'Recurring' },
    { id: 'one-time', label: 'One-Time' },
    { id: 'conditional', label: 'Conditional' },
    { id: 'penalties', label: 'Penalties' },
    { id: 'variable', label: 'Variable / Caps' },
  ];

  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.timingType === filterType;
  });

  const handleCopy = (item: FinancialItem) => {
    navigator.clipboard.writeText(
      `[Financial Commitment] ${item.label}: ${item.amount} (${item.timingType})\n${item.description}\nEvidence: "${item.evidence.sourceText}"`
    );
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <DollarSign className="h-4 w-4" />
          <span>Commercial & Financial Exposure</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
          Financial Obligations & Commitments ({items.length} Items Identified)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Comprehensive inventory of base charges, security deposits, late penalties, repair caps, and buyout costs.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilterType(opt.id)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 font-semibold transition ${
              filterType === opt.id
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Financial Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 hover:border-emerald-300 transition"
          >
            <div className="flex items-center justify-between">
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  item.timingType === 'penalties'
                    ? 'bg-rose-100 text-rose-800'
                    : item.timingType === 'recurring'
                    ? 'bg-indigo-100 text-indigo-800'
                    : item.timingType === 'one-time'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.timingType}
              </span>
              <span className="text-[11px] font-mono text-slate-400">{item.evidence.section}</span>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-slate-900">{item.amount}</div>
              <h3 className="text-sm font-bold text-slate-800 mt-1">{item.label}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{item.description}</p>
            </div>

            {/* Evidence quote */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                <span>Exact Text Quote</span>
                <button
                  onClick={() => handleCopy(item)}
                  className="flex items-center gap-1 text-[10px] text-indigo-700 hover:underline"
                >
                  {copiedId === item.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600 italic font-mono bg-white p-2 rounded border border-slate-100">
                "{item.evidence.sourceText}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
