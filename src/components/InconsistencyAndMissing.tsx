import React from 'react';
import { InconsistencyItem, MissingInformationItem } from '../types/legal';
import {
  ShieldAlert,
  AlertTriangle,
  FileQuestion,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Scale,
  CheckCircle2,
} from 'lucide-react';

interface InconsistencyAndMissingProps {
  inconsistencies: InconsistencyItem[];
  missingInformation: MissingInformationItem[];
  onAddToActions: (title: string, category: 'clarify' | 'gather' | 'ask_counsel') => void;
  onNavigateTab: (tab: string) => void;
}

export const InconsistencyAndMissing: React.FC<InconsistencyAndMissingProps> = ({
  inconsistencies,
  missingInformation,
  onAddToActions,
  onNavigateTab,
}) => {
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto w-full">
      {/* SECTION 1: CONTRADICTION & INCONSISTENCY DETECTOR */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
            <ShieldAlert className="h-4 w-4" />
            <span>Internal Conflict Engine</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Contradiction Detector ({inconsistencies.length} Detected)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Flags conflicting provisions, incompatible notice windows, or contradictory terms within the same agreement.
          </p>
        </div>

        {inconsistencies.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm space-y-5"
          >
            <div>
              <span className="rounded-full bg-rose-100 px-3 py-0.5 text-[10px] font-bold uppercase text-rose-800">
                Direct Contradiction
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-1">{item.description}</p>
            </div>

            {/* Side-by-Side Contradictory Provisions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Provision A */}
              <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-950">Provision A</span>
                  <span className="text-[10px] font-mono text-rose-700">
                    {item.provisionA.section} (Page {item.provisionA.page})
                  </span>
                </div>
                <blockquote className="border-l-2 border-rose-400 pl-2.5 text-xs italic text-slate-700 font-mono bg-white p-2.5 rounded border border-rose-100">
                  "{item.provisionA.text}"
                </blockquote>
              </div>

              {/* Provision B */}
              <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-950">Provision B</span>
                  <span className="text-[10px] font-mono text-rose-700">
                    {item.provisionB.section} (Page {item.provisionB.page})
                  </span>
                </div>
                <blockquote className="border-l-2 border-rose-400 pl-2.5 text-xs italic text-slate-700 font-mono bg-white p-2.5 rounded border border-rose-100">
                  "{item.provisionB.text}"
                </blockquote>
              </div>
            </div>

            {/* Why Inconsistent & Recommendation */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-900">Why This Is Confusing: </span>
                <span className="text-slate-700">{item.whyInconsistent}</span>
              </div>
              <div>
                <span className="font-bold text-indigo-900">Recommended Resolution: </span>
                <span className="text-slate-700">{item.recommendation}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => onAddToActions(item.title, 'clarify')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5 text-rose-600" />
                <span>Add Clarification to Action Plan</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 2: MISSING INFORMATION & UNATTACHED EXHIBITS */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
            <FileQuestion className="h-4 w-4" />
            <span>Completeness & Attachment Audit</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Missing Information & Exhibits ({missingInformation.length} Flagged)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Identifies referenced schedules not included with the agreement, undefined formulas, or omitted dates.
          </p>
        </div>

        <div className="space-y-4">
          {missingInformation.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <div className="mt-2 rounded-xl bg-amber-50/50 p-3.5 border border-amber-100 text-xs text-amber-950">
                  <span className="font-bold">Missing Element: </span>
                  {item.missingElement}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <div>
                  <span className="font-bold text-slate-800">Why It's Important: </span>
                  {item.whyImportant}
                </div>
                <div>
                  <span className="font-bold text-indigo-900">What To Do: </span>
                  {item.recommendation}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => onAddToActions(`Gather: ${item.missingElement}`, 'gather')}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Add to Document Gathering Checklist</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
