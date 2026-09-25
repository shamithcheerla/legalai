import React from 'react';
import { DocumentAnalysis } from '../types/legal';
import {
  Scale,
  FileCheck2,
  HelpCircle,
  FolderOpen,
  Printer,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface PrepareLawyerProps {
  analysis: DocumentAnalysis;
  onNavigateTab: (tab: string) => void;
}

export const PrepareLawyer: React.FC<PrepareLawyerProps> = ({ analysis, onNavigateTab }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyQuestions = () => {
    const text = `LEGAL CONSULTATION BRIEF: ${analysis.overview.title}\n\nQUESTIONS FOR LAWYER:\n${analysis.lawyerQuestions
      .map((q, i) => `${i + 1}. [${q.priority} Priority] ${q.question}\nRationale: ${q.rationale}\nRelated Section: ${q.relatedSection}\n`)
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Scale className="h-4 w-4" />
            <span>Consultation Readiness Pack</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            What Should I Ask a Lawyer?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Structured briefing dossier to maximize your time and minimize billable hours with a qualified legal professional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyQuestions}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Questions'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Consultation Brief</span>
          </button>
        </div>
      </div>

      {/* 4 Structured Dossier Modules */}
      <div className="space-y-6">
        {/* Module 1: Key Facts to Tell Your Lawyer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-indigo-700" />
            <span>1. Essential Facts to Brief Your Attorney</span>
          </h3>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-700 space-y-2 leading-relaxed">
            <p>
              <strong className="text-slate-900">Document Type & Parties:</strong> {analysis.overview.type} between {analysis.overview.parties.join(' and ')}.
            </p>
            <p>
              <strong className="text-slate-900">Term & Financials:</strong> Active from {analysis.overview.effectiveDate || 'execution'} through {analysis.overview.expiryDate || 'indefinite'}. Monthly commitment of {analysis.executiveSummary.financialSummary}.
            </p>
            <p>
              <strong className="text-slate-900">Core Exposure:</strong> {analysis.executiveSummary.failureConsequences}
            </p>
          </div>
        </div>

        {/* Module 2: High-Value Questions to Ask */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-emerald-700" />
            <span>2. Recommended Questions to Ask Your Counsel</span>
          </h3>

          <div className="space-y-3">
            {analysis.lawyerQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                      q.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {q.priority} Priority
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{q.relatedSection}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">{q.question}</h4>
                <p className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Legal Rationale:</span> {q.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Module 3: Important Clauses to Show Them */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scale className="h-4 w-4 text-sky-700" />
            <span>3. Critical Clauses to Bring to Their Direct Attention</span>
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {analysis.clauses
              .filter((c) => c.attentionLevel === 'High Attention' || c.attentionLevel === 'Important')
              .map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 p-3.5 text-xs space-y-1 bg-slate-50/50">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-indigo-900">{c.section}</span>
                    <span className="text-slate-400">Page {c.page}</span>
                  </div>
                  <h5 className="font-bold text-slate-900">{c.title}</h5>
                  <p className="text-[11px] text-slate-600 line-clamp-2 italic font-mono bg-white p-1.5 rounded border border-slate-100">
                    "{c.evidence.sourceText}"
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Module 4: Documents and Exhibits to Gather First */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-amber-700" />
            <span>4. Supporting Documents & Attachments to Gather</span>
          </h3>

          <div className="space-y-2 text-xs">
            {analysis.missingInformation.map((m) => (
              <div key={m.id} className="flex items-start gap-2.5 rounded-xl bg-amber-50/50 p-3 border border-amber-100 text-amber-950">
                <span className="h-2 w-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold">{m.missingElement}: </span>
                  <span>{m.recommendation}</span>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-200 text-slate-700">
              <span className="h-2 w-2 rounded-full bg-slate-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold">Prior Communications & Written Notices: </span>
                <span>Compile all emails, text messages, and written notices sent between the parties.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
