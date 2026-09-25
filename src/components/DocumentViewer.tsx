import React, { useState } from 'react';
import { DocumentAnalysis, Clause } from '../types/legal';
import {
  FileText,
  Search,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
  DollarSign,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  Bookmark,
  Share2,
} from 'lucide-react';

interface DocumentViewerProps {
  analysis: DocumentAnalysis;
  selectedClauseId?: string;
  onSelectClause: (clauseId: string) => void;
  explain15Global: boolean;
  onToggleExplain15: () => void;
  onAddToActions: (title: string, category: 'review' | 'upcoming' | 'clarify', section?: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  analysis,
  selectedClauseId,
  onSelectClause,
  explain15Global,
  onToggleExplain15,
  onAddToActions,
}) => {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState('');

  const activeClause =
    analysis.clauses.find((c) => c.id === selectedClauseId) || analysis.clauses[0];

  const categories = ['All', ...Array.from(new Set(analysis.clauses.map((c) => c.category)))];

  const filteredClauses = analysis.clauses.filter((clause) => {
    const matchesCategory = filterCategory === 'All' || clause.category === filterCategory;
    const matchesSearch =
      localSearch === '' ||
      clause.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      clause.section.toLowerCase().includes(localSearch.toLowerCase()) ||
      clause.plainExplanation.toLowerCase().includes(localSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyCitation = (clause: Clause) => {
    const citationText = `[Evidence Citation] Document: ${analysis.overview.title} | Section: ${clause.section} | Page: ${clause.page}\n"${clause.evidence.sourceText}"`;
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-100">
      {/* LEFT PANEL: Document Navigation & Clause Directory */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
            <FileText className="h-3.5 w-3.5" />
            <span>Document Outline ({analysis.clauses.length} Clauses)</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 truncate" title={analysis.overview.title}>
            {analysis.overview.title}
          </h3>

          {/* Quick Search */}
          <div className="mt-3 relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter clauses..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category Pills */}
          <div className="mt-2.5 flex gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`whitespace-nowrap rounded-full px-2 py-0.5 font-medium transition ${
                  filterCategory === cat
                    ? 'bg-indigo-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clause List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredClauses.map((clause) => {
            const isSelected = activeClause?.id === clause.id;
            return (
              <button
                key={clause.id}
                onClick={() => onSelectClause(clause.id)}
                className={`w-full text-left rounded-xl p-3 transition border ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-600'
                    : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {clause.section}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                      clause.attentionLevel === 'High Attention'
                        ? 'bg-rose-100 text-rose-800'
                        : clause.attentionLevel === 'Important'
                        ? 'bg-amber-100 text-amber-800'
                        : clause.attentionLevel === 'Review'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {clause.attentionLevel}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                  {clause.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                  {clause.plainExplanation}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER PANEL: Original Document Text with Highlighted Evidence Excerpt */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="font-bold text-indigo-950">Original Legal Text</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">
              Showing excerpt for: <span className="text-indigo-900">{activeClause?.section}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold">
              Page {activeClause?.page || 1} of {analysis.overview.pageCount}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-3xl mx-auto w-full">
          {/* Document Content Display */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 font-serif text-sm leading-relaxed text-slate-800">
            <div className="border-b border-slate-200 pb-4 text-center font-sans">
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                {analysis.overview.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Effective: {analysis.overview.effectiveDate || 'Not specified'} • Expiration: {analysis.overview.expiryDate || 'N/A'}
              </p>
            </div>

            {/* Active Clause Highlight Box */}
            {activeClause && (
              <div className="rounded-xl border-2 border-indigo-500 bg-indigo-50/40 p-5 shadow-sm space-y-2.5 font-sans">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Target Evidence Citation: {activeClause.section}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-900">
                    Confidence: {Math.round(activeClause.evidence.confidence * 100)}%
                  </span>
                </div>
                <blockquote className="border-l-4 border-indigo-600 pl-3 italic text-xs font-serif text-slate-900 leading-relaxed bg-white/80 p-2.5 rounded">
                  "{activeClause.evidence.sourceText}"
                </blockquote>
              </div>
            )}

            {/* Full raw document text preview */}
            <div className="space-y-4 font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50/70 p-6 rounded-xl border border-slate-200">
              {analysis.overview.rawText}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: AI Legal Intelligence Inspector */}
      <div className="w-96 bg-white flex flex-col shrink-0 overflow-y-auto p-5 space-y-5 border-l border-slate-200">
        {activeClause ? (
          <>
            {/* Clause Header & Level */}
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                  {activeClause.category}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    activeClause.attentionLevel === 'High Attention'
                      ? 'bg-rose-100 text-rose-800'
                      : activeClause.attentionLevel === 'Important'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {activeClause.attentionLevel}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">
                {activeClause.title}
              </h3>
              <p className="text-xs text-slate-500">
                Source: {activeClause.section} (Page {activeClause.page})
              </p>
            </div>

            {/* Plain English Translation & Explain Like I'm 15 toggle */}
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  {explain15Global ? "Explain Like I'm 15" : 'Plain-Language Meaning'}
                </span>
                <button
                  onClick={onToggleExplain15}
                  className="text-[10px] font-semibold text-indigo-700 hover:underline"
                >
                  {explain15Global ? 'Switch to Standard' : "Switch to ELI15"}
                </button>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {explain15Global ? activeClause.explain15 : activeClause.plainExplanation}
              </p>
            </div>

            {/* Why It Matters */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800">Why It Matters</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeClause.whyItMatters}
              </p>
            </div>

            {/* Who It Affects & Obligations */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Parties Affected:</span>
                <span className="font-bold text-slate-800">{activeClause.affects}</span>
              </div>

              {activeClause.financialImpact && (
                <div className="flex items-start justify-between text-xs gap-2">
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    Financial Impact:
                  </span>
                  <span className="font-bold text-emerald-900 text-right">{activeClause.financialImpact}</span>
                </div>
              )}

              {activeClause.timeImpact && (
                <div className="flex items-start justify-between text-xs gap-2">
                  <span className="font-semibold text-sky-700 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Timeline / Duration:
                  </span>
                  <span className="font-bold text-sky-900 text-right">{activeClause.timeImpact}</span>
                </div>
              )}
            </div>

            {/* Grounded Evidence Box */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                <span>Verifiable Evidence Citation</span>
                <button
                  onClick={() => handleCopyCitation(activeClause)}
                  className="flex items-center gap-1 text-[10px] text-indigo-700 hover:text-indigo-900"
                >
                  {copiedCitation ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCitation ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600 italic font-mono bg-white p-2 rounded border border-slate-100">
                "{activeClause.evidence.sourceText}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{activeClause.evidence.section}</span>
                <span>Page {activeClause.evidence.page}</span>
              </div>
            </div>

            {/* Add to Action Center */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onAddToActions(activeClause.title, 'review', activeClause.section)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
              >
                <PlusCircle className="h-4 w-4 text-indigo-600" />
                <span>Add to Action Plan</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400">
            Select a clause on the left to view intelligence.
          </div>
        )}
      </div>
    </div>
  );
};
