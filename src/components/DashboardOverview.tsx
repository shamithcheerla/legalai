import React from 'react';
import { DocumentAnalysis } from '../types/legal';
import {
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  FileCheck2,
  GitCompare,
  FileDown,
  Info,
} from 'lucide-react';

interface DashboardOverviewProps {
  analysis: DocumentAnalysis | null;
  documentCount?: number;
  onNavigateTab: (tab: string) => void;
  onSelectClause: (clauseId: string) => void;
  onOpenUpload?: () => void;
  onOpenJudgeTour?: () => void;
  explain15Global?: boolean;
  onToggleExplain15?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  analysis,
  documentCount = 1,
  onNavigateTab,
  onSelectClause,
  onOpenUpload,
  onOpenJudgeTour,
  explain15Global = false,
  onToggleExplain15,
}) => {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-700 mb-4">
          <FileText className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Document Loaded</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Select a sample document from the demo repository or upload your own contract to inspect the dashboard.
        </p>
        <button
          onClick={onOpenUpload}
          className="mt-4 rounded-xl bg-indigo-950 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-indigo-900"
        >
          Analyze a Document
        </button>
      </div>
    );
  }

  const highAttentionCount = analysis.attentionItems.filter(
    (a) => a.attentionLevel === 'High Attention' || a.attentionLevel === 'Important'
  ).length;

  const totalFinancialAmount = analysis.financialItems.reduce((acc, curr) => {
    return acc;
  }, '');

  // Group clauses by category
  const categories = Array.from(new Set(analysis.clauses.map((c) => c.category)));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner: Active Document Summary */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Legal Intelligence Brief</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">{analysis.overview.type}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            {analysis.overview.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Parties: {analysis.overview.parties.join(' vs ')} • Jurisdiction: {analysis.overview.jurisdiction || 'General'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('xray')}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2 text-xs font-semibold text-indigo-900 hover:bg-indigo-100 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Document X-Ray</span>
          </button>

          <button
            onClick={() => onNavigateTab('documents')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition"
          >
            <span>Open Document Viewer</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Metric 1: Clauses */}
        <div
          onClick={() => onNavigateTab('clauses')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300 hover:shadow transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-500">Clauses Identified</span>
            <Layers className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{analysis.clauses.length}</span>
            <span className="text-[10px] text-indigo-600 font-medium">{categories.length} categories</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Click to inspect breakdown</p>
        </div>

        {/* Metric 2: Attention Items */}
        <div
          onClick={() => onNavigateTab('attention')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-amber-300 hover:shadow transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-500">Review Items</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{analysis.attentionItems.length}</span>
            <span className="text-[10px] text-amber-700 font-medium">{highAttentionCount} High/Imp</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Review areas of friction</p>
        </div>

        {/* Metric 3: Obligations */}
        <div
          onClick={() => onNavigateTab('obligations')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-500">Obligations</span>
            <Clock className="h-4 w-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{analysis.obligations.length}</span>
            <span className="text-[10px] text-sky-600 font-medium">Mapped to triggers</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Timeline & responsibility</p>
        </div>

        {/* Metric 4: Financial Commitments */}
        <div
          onClick={() => onNavigateTab('financials')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-300 hover:shadow transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-500">Financial Terms</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{analysis.financialItems.length}</span>
            <span className="text-[10px] text-emerald-600 font-medium">Fees & deposits</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Recurring & penalty terms</p>
        </div>

        {/* Metric 5: Contradictions & Missing */}
        <div
          onClick={() => onNavigateTab('inconsistencies')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-rose-300 hover:shadow transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-slate-500">Inconsistencies</span>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">
              {analysis.inconsistencies.length + analysis.missingInformation.length}
            </span>
            <span className="text-[10px] text-rose-700 font-medium">
              {analysis.inconsistencies.length} conflicts
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Conflicts & missing exhibits</p>
        </div>
      </div>

      {/* Main Grid: Executive Summary + Key Attention Highlights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Executive Plain-Language Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-indigo-700" />
              <span>Plain-Language Executive Summary</span>
            </h3>
            <button
              onClick={onToggleExplain15}
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition ${
                explain15Global
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {explain15Global ? "Explain Like I'm 15: ON" : "Explain Like I'm 15: OFF"}
            </button>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
              <span className="font-semibold text-slate-800">What This Document Is: </span>
              {analysis.executiveSummary.whatThisIs}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="font-semibold text-slate-800 block mb-1">Financial Commitments:</span>
                {analysis.executiveSummary.financialSummary}
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="font-semibold text-slate-800 block mb-1">Duration & Expiry:</span>
                {analysis.executiveSummary.durationAndTerm}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="font-semibold text-slate-800 block mb-1">How Termination Works:</span>
                {analysis.executiveSummary.howTerminationWorks}
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <span className="font-semibold text-slate-800 block mb-1">Consequences of Failure:</span>
                {analysis.executiveSummary.failureConsequences}
              </div>
            </div>

            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 text-amber-900">
              <span className="font-semibold block mb-0.5">Key Things to Clarify:</span>
              {analysis.executiveSummary.keyThingsToReview}
            </div>
          </div>
        </div>

        {/* Right Col: Attention Items Preview & Quick Actions */}
        <div className="space-y-6">
          {/* Top Priority Attention Items */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                <span>Top Review Items</span>
              </h4>
              <button
                onClick={() => onNavigateTab('attention')}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900"
              >
                View all ({analysis.attentionItems.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {analysis.attentionItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('attention')}
                  className="group cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-indigo-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-900">
                      {item.title}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        item.attentionLevel === 'High Attention'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.attentionLevel}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {item.detectedIssue}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launchers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Instant Intelligence Tools
            </h4>

            <button
              onClick={() => onNavigateTab('ask')}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-700" />
                <span>Ask Legalens Grounded Q&A</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('compare')}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition"
            >
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-violet-700" />
                <span>Contract Change Impact (Diff)</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('lawyer')}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 transition"
            >
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-700" />
                <span>Consultation Brief for Lawyer</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
