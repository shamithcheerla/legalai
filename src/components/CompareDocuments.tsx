import React, { useState } from 'react';
import { ComparisonResult, ClauseDiff } from '../types/legal';
import {
  GitCompare,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Filter,
} from 'lucide-react';
import { DEMO_SERVICE_COMPARISON } from '../data/demoDocuments';

interface CompareDocumentsProps {
  comparison?: ComparisonResult;
  onRunCustomCompare?: (docAName: string, docAText: string, docBName: string, docBText: string) => Promise<void>;
}

export const CompareDocuments: React.FC<CompareDocumentsProps> = ({
  comparison = DEMO_SERVICE_COMPARISON,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const stats = comparison.stats;

  const filteredDiffs = comparison.differences.filter((diff) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'financial') return diff.category.toLowerCase().includes('payment') || Boolean(diff.financialImpact);
    if (filterCategory === 'term') return diff.category.toLowerCase().includes('term') || diff.category.toLowerCase().includes('renewal');
    if (filterCategory === 'liability') return diff.category.toLowerCase().includes('liability') || diff.category.toLowerCase().includes('indemnity');
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-700">
          <GitCompare className="h-4 w-4" />
          <span>Smart Contract Diff Engine</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
          Contract Change Impact & Version Comparison
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Comparing <span className="font-semibold text-slate-800">{comparison.docAName}</span> vs <span className="font-semibold text-slate-800">{comparison.docBName}</span>.
        </p>
      </div>

      {/* Overview Card */}
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-900 to-indigo-950 p-6 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-violet-200">
          <Sparkles className="h-3.5 w-3.5 text-violet-300" />
          <span>Executive Comparison Takeaways</span>
        </div>
        <p className="text-xs leading-relaxed text-violet-100 font-medium max-w-4xl">
          {comparison.overviewSummary}
        </p>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Negotiated Changes</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalChanges}</span>
          <span className="text-[10px] text-violet-700 font-medium">Substantive edits</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Financial Terms</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
            {stats.financialChanges} Changed
          </span>
          <span className="text-[10px] text-emerald-800 font-medium">Price & payment windows</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Deadline Adjustments</span>
          <span className="text-2xl font-extrabold text-sky-700 mt-1 block">
            {stats.deadlineChanges} Shifts
          </span>
          <span className="text-[10px] text-sky-800 font-medium">Net 15 vs Net 30</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Duration & Expiry</span>
          <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
            {stats.terminationChanges} Extended
          </span>
          <span className="text-[10px] text-amber-800 font-medium">12 mo &rarr; 24 mo + auto renew</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 block">Liability Rebalancing</span>
          <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">2 Carve-outs</span>
          <span className="text-[10px] text-indigo-700 font-medium">Uncapped Provider breach</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs">
        {[
          { id: 'all', label: 'All Substantive Differences' },
          { id: 'financial', label: 'Financial & Fees' },
          { id: 'term', label: 'Term & Renewal' },
          { id: 'liability', label: 'Liability & Indemnity' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`rounded-lg px-3.5 py-1.5 font-semibold transition ${
              filterCategory === tab.id
                ? 'bg-violet-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Differences List */}
      <div className="space-y-4">
        {filteredDiffs.map((diff) => (
          <div
            key={diff.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 hover:border-violet-300 transition"
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-900">
                  {diff.category}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    diff.changeType === 'modified'
                      ? 'bg-amber-100 text-amber-800'
                      : diff.changeType === 'added'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {diff.changeType}
                </span>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                  diff.attentionLevel === 'High Attention'
                    ? 'bg-rose-100 text-rose-800'
                    : diff.attentionLevel === 'Important'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {diff.attentionLevel}
              </span>
            </div>

            {/* Title & Summary */}
            <div>
              <h3 className="text-base font-bold text-slate-900">{diff.title}</h3>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
                {diff.summary}
              </p>
            </div>

            {/* Practical Operational Significance */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Practical & Commercial Impact:</span>
              <span className="text-slate-700">{diff.practicalSignificance}</span>
              {diff.financialImpact && (
                <span className="block mt-1 font-bold text-emerald-800">
                  Financial Impact: {diff.financialImpact}
                </span>
              )}
            </div>

            {/* Side-by-Side Before and After */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Document A (Before) */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 text-xs font-mono">
                <span className="text-[11px] font-sans font-bold text-slate-600 block">
                  Version 1.0 (Draft Baseline)
                </span>
                <p className="text-slate-600 italic bg-white p-2.5 rounded border border-slate-200/70">
                  {diff.beforeText ? `"${diff.beforeText}"` : '— Clause was not present —'}
                </p>
              </div>

              {/* Document B (After) */}
              <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4 space-y-1.5 text-xs font-mono">
                <span className="text-[11px] font-sans font-bold text-violet-900 block">
                  Version 2.0 (Negotiated)
                </span>
                <p className="text-violet-950 italic bg-white p-2.5 rounded border border-violet-200/80 font-medium">
                  "{diff.afterText}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
