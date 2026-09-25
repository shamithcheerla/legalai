import React, { useState } from 'react';
import { Clause, AttentionLevel } from '../types/legal';
import {
  Layers,
  Search,
  Sparkles,
  DollarSign,
  Clock,
  HelpCircle,
  Copy,
  Check,
  PlusCircle,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

interface ClauseIntelligenceProps {
  clauses: Clause[];
  docTitle: string;
  onSelectClause: (clauseId: string) => void;
  onNavigateTab: (tab: string) => void;
  explain15Global: boolean;
  onToggleExplain15: () => void;
  onAddToActions: (title: string, category: 'review' | 'upcoming' | 'clarify', section?: string) => void;
}

export const ClauseIntelligence: React.FC<ClauseIntelligenceProps> = ({
  clauses,
  docTitle,
  onSelectClause,
  onNavigateTab,
  explain15Global,
  onToggleExplain15,
  onAddToActions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(clauses.map((c) => c.category)))];
  const levels = ['All', 'High Attention', 'Important', 'Review', 'Informational'];

  const filteredClauses = clauses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || c.attentionLevel === selectedLevel;
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.plainExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.section.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesLevel && matchesSearch;
  });

  const handleCopyCitation = (clause: Clause) => {
    const text = `[Citation] Document: ${docTitle} | Section: ${clause.section} (Page ${clause.page})\n"${clause.evidence.sourceText}"`;
    navigator.clipboard.writeText(text);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-700" />
            <span>Clause Intelligence Library</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and inspect all {clauses.length} parsed contractual clauses with plain translations and exact citations.
          </p>
        </div>

        {/* Global Explain 15 Mode Switch */}
        <button
          onClick={onToggleExplain15}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
            explain15Global
              ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>{explain15Global ? "Explain Like I'm 15: Active" : "Explain Like I'm 15: Off"}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clauses by keyword or section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Attention Level Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Attention:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap rounded-lg px-3 py-1 font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Clauses Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClauses.map((clause) => (
          <div
            key={clause.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 transition space-y-4"
          >
            {/* Top row: Section + Category + Attention Level */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-900">
                  {clause.section}
                </span>
                <span className="text-xs font-medium text-slate-500">• {clause.category}</span>
                <span className="text-xs text-slate-400 font-mono">Page {clause.page}</span>
              </div>

              <span
                className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  clause.attentionLevel === 'High Attention'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : clause.attentionLevel === 'Important'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : clause.attentionLevel === 'Review'
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {clause.attentionLevel}
              </span>
            </div>

            {/* Title & Plain-Language Translation */}
            <div>
              <h3 className="text-base font-bold text-slate-900">{clause.title}</h3>
              <div className="mt-2 rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {explain15Global ? "Explain Like I'm 15 Interpretation" : "Plain-Language Breakdown"}
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {explain15Global ? clause.explain15 : clause.plainExplanation}
                </p>
              </div>
            </div>

            {/* Sub-attributes grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="font-semibold text-slate-600 block text-[11px]">Who It Affects</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{clause.affects}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600 block text-[11px]">Financial Impact</span>
                <span className="font-bold text-emerald-800 mt-0.5 block">
                  {clause.financialImpact || 'No direct fee specified'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-600 block text-[11px]">Time / Deadline Impact</span>
                <span className="font-bold text-sky-800 mt-0.5 block">
                  {clause.timeImpact || 'Standard contract term'}
                </span>
              </div>
            </div>

            {/* Why it Matters */}
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Why It Matters: </span>
              {clause.whyItMatters}
            </div>

            {/* Verifiable Grounded Citation Excerpt */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span className="flex items-center gap-1 text-indigo-950">
                  <span>Exact Document Excerpt (Evidence)</span>
                </span>
                <button
                  onClick={() => handleCopyCitation(clause)}
                  className="flex items-center gap-1 text-[10px] text-indigo-700 hover:text-indigo-900 font-medium"
                >
                  {copiedId === clause.id ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedId === clause.id ? 'Copied' : 'Copy Citation'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-700 italic font-mono bg-white p-2.5 rounded border border-slate-200/80">
                "{clause.evidence.sourceText}"
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <button
                onClick={() => {
                  onSelectClause(clause.id);
                  onNavigateTab('viewer');
                }}
                className="flex items-center gap-1 font-semibold text-indigo-700 hover:text-indigo-900"
              >
                <span>View in full document context</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onAddToActions(clause.title, 'review', clause.section)}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5 text-indigo-600" />
                <span>Add to Action Plan</span>
              </button>
            </div>
          </div>
        ))}

        {filteredClauses.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
            No clauses match your selected filters. Try choosing a different category or search term.
          </div>
        )}
      </div>
    </div>
  );
};
