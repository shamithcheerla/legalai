import React, { useState } from 'react';
import { AttentionItem, AttentionLevel } from '../types/legal';
import {
  AlertTriangle,
  HelpCircle,
  Scale,
  ShieldAlert,
  CheckCircle2,
  PlusCircle,
  Copy,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';

interface AttentionRadarProps {
  items: AttentionItem[];
  docTitle: string;
  onAddToActions: (title: string, category: 'review' | 'clarify' | 'ask_counsel', section?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const AttentionRadar: React.FC<AttentionRadarProps> = ({
  items,
  docTitle,
  onAddToActions,
  onNavigateTab,
}) => {
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesLevel = filterLevel === 'All' || item.attentionLevel === filterLevel;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detectedIssue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCopyCitation = (item: AttentionItem) => {
    const text = `[Review Item] Document: ${docTitle} | Section: ${item.evidence.section}\nIssue: ${item.detectedIssue}\nEvidence: "${item.evidence.sourceText}"`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
          <ShieldAlert className="h-4 w-4" />
          <span>Friction, Risk & Ambiguity Analysis</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
          Attention & Risk Radar ({items.length} Detected)
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Surfaces terms with potential asymmetry, steep penalties, automatic renewal traps, broad indemnities, or internal conflicts.
        </p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search review items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'High Attention', 'Important', 'Review'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterLevel === lvl
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Review Item Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border bg-white p-6 shadow-sm transition space-y-4 ${
              item.attentionLevel === 'High Attention'
                ? 'border-rose-200 ring-1 ring-rose-100'
                : item.attentionLevel === 'Important'
                ? 'border-amber-200'
                : 'border-slate-200'
            }`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800">
                  {item.category}
                </span>
                <span className="text-xs font-medium text-slate-500">• {item.evidence.section}</span>
              </div>

              <span
                className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase ${
                  item.attentionLevel === 'High Attention'
                    ? 'bg-rose-100 text-rose-800'
                    : item.attentionLevel === 'Important'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-sky-100 text-sky-800'
                }`}
              >
                {item.attentionLevel}
              </span>
            </div>

            {/* Title & Issue Description */}
            <div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block mb-0.5">Detected Friction:</span>
                {item.detectedIssue}
              </p>
            </div>

            {/* Why it deserves attention & What to clarify */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5 space-y-1">
                <span className="font-bold text-amber-950 block">Why It Deserves Attention</span>
                <p className="text-amber-900 leading-relaxed">{item.whyItDeservesAttention}</p>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 space-y-1">
                <span className="font-bold text-indigo-950 block">What You Should Clarify</span>
                <p className="text-indigo-900 leading-relaxed">{item.whatUserShouldClarify}</p>
              </div>
            </div>

            {/* Professional Review Advice */}
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 border border-slate-100">
              <Scale className="h-4 w-4 text-indigo-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Professional Review Suggestion: </span>
                {item.professionalReviewAdvice}
              </div>
            </div>

            {/* Grounded Citation Excerpt */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>Grounded Text Citation</span>
                <button
                  onClick={() => handleCopyCitation(item)}
                  className="flex items-center gap-1 text-[10px] text-indigo-700 hover:underline"
                >
                  {copiedId === item.id ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600 italic font-mono bg-white p-2 rounded border border-slate-100">
                "{item.evidence.sourceText}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <button
                onClick={() => onNavigateTab('lawyer')}
                className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
              >
                <span>Add to Consultation Brief</span>
                <PlusCircle className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onAddToActions(item.title, 'clarify', item.evidence.section)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                Add to Action Plan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
