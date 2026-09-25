import React, { useState } from 'react';
import { DocumentAnalysis } from '../types/legal';
import {
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';

interface DocumentXRayProps {
  analysis: DocumentAnalysis;
  onNavigateTab: (tab: string) => void;
  onSelectClause: (clauseId: string) => void;
}

export const DocumentXRay: React.FC<DocumentXRayProps> = ({
  analysis,
  onNavigateTab,
  onSelectClause,
}) => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'clauses' | 'obligations' | 'dates' | 'money' | 'risks'>('all');

  const categories = Array.from(new Set(analysis.clauses.map((c) => c.category)));

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* X-Ray Header */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 mb-3 backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              <span>Legal Document X-Ray • Architectural Anatomy</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {analysis.overview.title}
            </h2>
            <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
              Deep scan completed with {Math.round(analysis.overview.confidence * 100)}% grounding confidence. All legal anatomy dissected into distinct functional layers below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('viewer')}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition backdrop-blur border border-white/20"
            >
              Open Full Document
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 transition shadow"
            >
              Export Report
            </button>
          </div>
        </div>

        {/* Anatomy Layer Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/10 text-xs">
          {[
            { id: 'all', label: 'Complete Anatomy' },
            { id: 'clauses', label: `1. Clauses (${analysis.clauses.length})` },
            { id: 'obligations', label: `2. Obligations (${analysis.obligations.length})` },
            { id: 'dates', label: `3. Dates & Milestones (${analysis.deadlines.length})` },
            { id: 'money', label: `4. Financial Terms (${analysis.financialItems.length})` },
            { id: 'risks', label: `5. Review Items (${analysis.attentionItems.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLayer(tab.id as any)}
              className={`rounded-lg px-3 py-1.5 font-medium transition ${
                activeLayer === tab.id
                  ? 'bg-white text-indigo-950 font-bold shadow'
                  : 'bg-white/10 text-indigo-100 hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Layer 1: Clauses Anatomy */}
      {(activeLayer === 'all' || activeLayer === 'clauses') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-700">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Layer 1: Identifiable Clauses</h3>
                <p className="text-xs text-slate-500">
                  {analysis.clauses.length} distinct contractual provisions organized across {categories.length} legal categories.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('clauses')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
            >
              <span>Explore all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.clauses.slice(0, 6).map((clause) => (
              <div
                key={clause.id}
                onClick={() => {
                  onSelectClause(clause.id);
                  onNavigateTab('viewer');
                }}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/70 p-4 hover:border-indigo-400 hover:bg-white transition"
              >
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-indigo-700">{clause.category}</span>
                  <span className="text-slate-400">{clause.section}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{clause.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{clause.plainExplanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 2: Obligations Anatomy */}
      {(activeLayer === 'all' || activeLayer === 'obligations') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-sky-50 p-2 text-sky-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Layer 2: Actionable Obligations</h3>
                <p className="text-xs text-slate-500">
                  Who must perform what action, under what trigger, and the stated consequence if missed.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('obligations')}
              className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline"
            >
              <span>View tracker</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            {analysis.obligations.slice(0, 4).map((ob) => (
              <div key={ob.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900">{ob.title}</span>
                  <p className="text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">{ob.responsibleParty}</span> • Deadline: {ob.deadline}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                    {ob.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 3: Financial Terms Anatomy */}
      {(activeLayer === 'all' || activeLayer === 'money') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Layer 3: Financial Architecture</h3>
                <p className="text-xs text-slate-500">
                  Fixed fees, deposits, penalties, repair caps, and recurring outlays.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('financials')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
            >
              <span>View breakdown</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.financialItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {item.timingType}
                </span>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">{item.amount}</div>
                <div className="text-xs font-bold text-slate-700 mt-1">{item.label}</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 4: Areas Requiring Attention & Inconsistencies */}
      {(activeLayer === 'all' || activeLayer === 'risks') && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Layer 4: Friction & Review Radar</h3>
                <p className="text-xs text-slate-500">
                  Clauses with asymmetry, steep penalties, automatic rollovers, or internal contradictions.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('attention')}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
            >
              <span>Radar view</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {analysis.attentionItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">{item.title}</span>
                  <span className="rounded bg-amber-200/70 px-2 py-0.5 text-[9px] font-bold text-amber-900 uppercase">
                    {item.attentionLevel}
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">{item.detectedIssue}</p>
                <div className="text-[11px] text-amber-800 font-medium pt-1">
                  <span className="font-bold">What to clarify:</span> {item.whatUserShouldClarify}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
