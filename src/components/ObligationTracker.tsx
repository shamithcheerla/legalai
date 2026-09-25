import React, { useState } from 'react';
import { Obligation, DeadlineItem } from '../types/legal';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  AlertCircle,
  DollarSign,
  Layers,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface ObligationTrackerProps {
  obligations: Obligation[];
  deadlines: DeadlineItem[];
  onToggleComplete: (id: string) => void;
}

export const ObligationTracker: React.FC<ObligationTrackerProps> = ({
  obligations,
  deadlines,
  onToggleComplete,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [partyFilter, setPartyFilter] = useState<string>('All');

  const parties = ['All', ...Array.from(new Set(obligations.map((o) => o.responsibleParty)))];

  const filteredObligations = obligations.filter((o) => {
    if (partyFilter === 'All') return true;
    return o.responsibleParty === partyFilter;
  });

  const completedCount = obligations.filter((o) => o.completed).length;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
            <Clock className="h-4 w-4" />
            <span>Contractual Responsibility Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Obligation Tracker & Timeline ({obligations.length} Active)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tracks who is responsible for what action, exact deadline triggers, and consequences of failure.
          </p>
        </div>

        {/* View mode toggle & Progress badge */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
            Progress: <span className="text-emerald-700 font-bold">{completedCount} of {obligations.length} Complete</span>
          </div>

          <div className="flex rounded-xl bg-slate-200/80 p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                viewMode === 'timeline' ? 'bg-white text-indigo-950 shadow-sm' : 'text-slate-600'
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Party Filter Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs overflow-x-auto">
        <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" />
          Filter by Party:
        </span>
        {parties.map((party) => (
          <button
            key={party}
            onClick={() => setPartyFilter(party)}
            className={`whitespace-nowrap rounded-lg px-3 py-1 font-medium transition ${
              partyFilter === party
                ? 'bg-indigo-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {party}
          </button>
        ))}
      </div>

      {/* VIEW 1: STRUCTURED TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                  <th className="py-3.5 pl-6 pr-3 w-12 text-center">Status</th>
                  <th className="py-3.5 px-3 font-semibold">Obligation & Task</th>
                  <th className="py-3.5 px-3 font-semibold">Responsible Party</th>
                  <th className="py-3.5 px-3 font-semibold">Deadline / Frequency</th>
                  <th className="py-3.5 px-3 font-semibold">Amount</th>
                  <th className="py-3.5 px-3 font-semibold">Consequence If Missed</th>
                  <th className="py-3.5 pr-6 pl-3 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredObligations.map((ob) => (
                  <tr
                    key={ob.id}
                    className={`transition hover:bg-slate-50/80 ${
                      ob.completed ? 'bg-emerald-50/30 text-slate-400' : ''
                    }`}
                  >
                    <td className="py-4 pl-6 pr-3 text-center">
                      <button
                        onClick={() => onToggleComplete(ob.id)}
                        className="rounded-full text-slate-400 hover:text-emerald-600 transition"
                      >
                        {ob.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-900 line-clamp-1">{ob.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Trigger: {ob.trigger}</div>
                    </td>

                    <td className="py-4 px-3 font-semibold text-slate-800">
                      {ob.responsibleParty}
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-bold text-slate-900 block">{ob.deadline}</span>
                      <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 mt-1 inline-block">
                        {ob.frequency}
                      </span>
                    </td>

                    <td className="py-4 px-3 font-bold text-emerald-900">
                      {ob.amount || '—'}
                    </td>

                    <td className="py-4 px-3 text-[11px] text-rose-800 max-w-xs">
                      {ob.consequence}
                    </td>

                    <td className="py-4 pr-6 pl-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {ob.sourceClause}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4 text-xs text-sky-900">
            <span className="font-bold">Timeline Intelligence: </span>
            Legal deadlines are categorized into strict calendar events (e.g. October 1, 2026) and relative milestones (e.g. 7 days from occupancy, 60 days before expiration).
          </div>

          <div className="relative border-l-2 border-slate-200 pl-6 space-y-6 ml-4">
            {deadlines.map((dl, index) => (
              <div key={dl.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-indigo-600 shadow-sm" />

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-indigo-300 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      {dl.dateOrTimeline}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                        dl.isRelative ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {dl.isRelative ? 'Relative Milestone' : 'Strict Calendar Date'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{dl.title}</h4>
                  <p className="text-xs text-slate-600">{dl.significance}</p>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{dl.section}</span>
                    <span>Citation: "{dl.evidence.sourceText.slice(0, 75)}..."</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
