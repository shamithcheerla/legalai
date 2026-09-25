import React from 'react';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  Search,
  GitCompare,
  CheckCircle2,
  HelpCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Lock,
  ChevronRight,
  Scale,
  Eye,
} from 'lucide-react';

interface LandingPageProps {
  onAnalyzeClick?: () => void;
  onExploreDemoClick?: () => void;
  onStartJudgeTour?: () => void;
  onStartDemo?: () => void;
  onUploadCustom?: () => void;
  onOpenJudgeTour?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAnalyzeClick,
  onExploreDemoClick,
  onStartJudgeTour,
  onStartDemo,
  onUploadCustom,
  onOpenJudgeTour,
}) => {
  const handleAnalyze = onAnalyzeClick || onUploadCustom || (() => {});
  const handleExplore = onExploreDemoClick || onStartDemo || (() => {});
  const handleTour = onStartJudgeTour || onOpenJudgeTour || (() => {});
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white px-6 pt-16 pb-20 sm:px-12 lg:pt-24 lg:pb-28">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-50/70 via-slate-50/20 to-transparent pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-900 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>AI for Legal Assistance & Access • PromptWars Exclusive</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.15]">
            Turn Legal Documents Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-700 bg-clip-text text-transparent">
              Clear Next Steps
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base text-slate-600 sm:text-lg leading-relaxed">
            Legal documents should not require a law degree to understand. Upload a contract, agreement, or policy to get plain-language explanations, clause breakdowns, obligation timelines, financial summaries, and answers with exact document citations.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              id="landing-btn-analyze"
              onClick={handleAnalyze}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-950 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-950/20 transition hover:bg-indigo-900 hover:shadow-lg sm:w-auto"
            >
              <FileText className="h-4 w-4" />
              <span>Analyze a Document</span>
            </button>

            <button
              id="landing-btn-demo"
              onClick={handleExplore}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Explore Demo (Instant Access)</span>
            </button>
          </div>

          {/* Core Philosophy Banner */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Every claim backed by exact citations
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Explain Like I'm 15 toggle
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Zero fabricated legal authorities
            </span>
          </div>

          {/* Privacy & Legal Safety Callout */}
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-left shadow-sm sm:flex sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-emerald-600 p-1.5 text-white">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Strict Privacy & Legal Safety</h4>
                <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                  Your documents are processed ephemerally. Legalens AI provides structured legal information and assistance—never a replacement for a qualified legal professional.
                </p>
              </div>
            </div>
            <button
              onClick={onStartJudgeTour}
              className="mt-3 flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition sm:mt-0 shrink-0"
            >
              <span>Judge Tour</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Why Legalens? 5 Core Pillars Section */}
      <section className="px-6 py-16 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700">The 5 Core Pillars</h2>
          <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl mt-1">
            Why Legalens AI is Evidence-First
          </p>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            We don't build generic chatbots that converse loosely about the law. We transform legal text into traceable, structured intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Understand */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 mb-4">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Understand</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Transform legalese into accessible plain English. Toggle into "Explain Like I'm 15" mode to understand complex indemnity, cure periods, or liquidated damages without changing their factual meaning.
            </p>
          </div>

          {/* Card 2: Compare */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 mb-4">
              <GitCompare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Compare</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Smart clause diff engine detects operational changes in money, deadlines, rights, restrictions, and liability across revisions (e.g. Contract v1 vs v2).
            </p>
          </div>

          {/* Card 3: Ask */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Ask</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Natural-language questions grounded strictly in the document text. Every factual response pins exact page numbers, section headers, and verifiable quotes.
            </p>
          </div>

          {/* Card 4: Track */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 mb-4">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">4. Track</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Automated obligation extraction surfaces who owes what, by when, under what trigger, and what penalty applies if missed. Includes an interactive timeline.
            </p>
          </div>

          {/* Card 5: Prepare */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-4">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">5. Prepare</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Generate structured briefing dossiers for a real lawyer: critical clauses to highlight, missing attachments to gather, and exact questions to ask.
            </p>
          </div>

          {/* Card 6: Document X-Ray Wow Moment */}
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 text-white shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-indigo-200 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">Document X-Ray</h3>
            <p className="text-xs text-indigo-100 leading-relaxed mt-2">
              Instant breakdown of document anatomy: identifiable clauses, active obligations, financial thresholds, and items requiring review.
            </p>
            <button
              onClick={onExploreDemoClick}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white"
            >
              <span>See X-Ray in action</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
