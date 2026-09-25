import React, { useState } from 'react';
import { QAAnswer, DocumentAnalysis } from '../types/legal';
import {
  MessageSquareText,
  Send,
  Sparkles,
  HelpCircle,
  FileCheck2,
  AlertTriangle,
  Scale,
  Clock,
  Loader2,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

interface AskLegalensProps {
  analysis: DocumentAnalysis;
  onAskQuestion: (question: string) => Promise<QAAnswer>;
  onSelectClause: (clauseId: string) => void;
  onNavigateTab: (tab: string) => void;
}

const SUGGESTED_QUESTIONS = [
  'Can I cancel early and how much does it cost?',
  'What are the penalties if rent is paid late?',
  'Who is responsible for repairs under $200?',
  'Does this lease automatically renew?',
  'What is the security deposit and when do I get it back?',
  'Are there any missing attachments or schedules referenced?',
];

export const AskLegalens: React.FC<AskLegalensProps> = ({
  analysis,
  onAskQuestion,
  onSelectClause,
  onNavigateTab,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<QAAnswer[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (queryText?: string) => {
    const q = queryText || inputQuestion;
    if (!q || q.trim().length < 3 || isLoading) return;

    setIsLoading(true);
    setInputQuestion('');

    try {
      const answer = await onAskQuestion(q);
      setQaHistory((prev) => [answer, ...prev]);
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (ans: QAAnswer, index: number) => {
    const text = `Q: ${ans.question}\n\nA: ${ans.answer}\n\nEvidence:\n${ans.evidence.map(e => `[${e.section}, Page ${e.page}]: "${e.sourceText}"`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
          <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          <span>Evidence-First Legal Q&A</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
          Ask Legalens AI
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Ask any question about <span className="font-semibold text-slate-700">"{analysis.overview.title}"</span>. Every fact is verified against exact clauses with verifiable page citations.
        </p>
      </div>

      {/* Question Input Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ask-legalens-question-input" className="sr-only">
            Ask a question about this legal document
          </label>
          <input
            id="ask-legalens-question-input"
            name="question"
            type="text"
            placeholder="e.g. Can the landlord enter without notice? What is the penalty for late rent?"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          />
          <button
            type="submit"
            aria-label="Submit question to Legalens AI"
            disabled={isLoading || !inputQuestion.trim()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-950 px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-label="Processing question..." />
            ) : (
              <>
                <span>Ask</span>
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Quick Questions */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Suggested High-Risk Questions:
          </span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Suggested legal questions">
            {SUGGESTED_QUESTIONS.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleSubmit(sq)}
                disabled={isLoading}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900 transition focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer History Feed */}
      <div className="space-y-4" role="feed" aria-label="Q&A conversation history">
        {qaHistory.length === 0 && !isLoading && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <HelpCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" aria-hidden="true" />
            <h3 className="text-xs font-bold text-slate-700">No Questions Asked Yet</h3>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
              Select one of the suggested questions above or type your own question to inspect grounded legal evidence.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 flex items-center justify-center gap-3 text-xs text-indigo-950 font-semibold" role="status" aria-live="polite">
            <Loader2 className="h-5 w-5 text-indigo-700 animate-spin" aria-hidden="true" />
            <span>Scanning contract clauses and cross-referencing citations...</span>
          </div>
        )}

        {qaHistory.map((item, idx) => (
          <article
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2"
          >
            {/* Question */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-900 font-bold text-xs shrink-0 mt-0.5" aria-hidden="true">
                  Q
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{item.question}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.confidence === 'High'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.confidence === 'Medium'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.confidence} Grounding Confidence
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(item, idx)}
                aria-label="Copy Q&A answer and evidence citations"
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Answer Body */}
            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50/80 p-3.5 text-xs text-slate-800 leading-relaxed font-normal">
                {item.answer}
              </div>

              {/* Explicit Facts vs AI Interpretation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {item.documentFacts && item.documentFacts.length > 0 && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <FileCheck2 className="h-3 w-3 text-emerald-600" aria-hidden="true" />
                      <span>Explicit Document Facts</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                      {item.documentFacts.map((fact, fIdx) => (
                        <li key={fIdx} className="leading-snug">{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.aiInterpretation && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-3 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-indigo-600" aria-hidden="true" />
                      <span>Practical AI Interpretation</span>
                    </span>
                    <p className="text-slate-700 text-[11px] leading-snug">
                      {item.aiInterpretation}
                    </p>
                  </div>
                )}
              </div>

              {/* Exact Evidence Citations */}
              {item.evidence && item.evidence.length > 0 && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block">
                    Verified Citation Evidence:
                  </span>
                  <div className="space-y-1.5">
                    {item.evidence.map((ev, evIdx) => (
                      <div
                        key={evIdx}
                        className="rounded-lg border border-indigo-100 bg-white p-2.5 text-xs shadow-xs"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-950 mb-1">
                          <span>{ev.section}</span>
                          <span className="text-slate-500 font-normal">Page {ev.page}</span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                          "{ev.sourceText}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What to Ask Lawyer Advice */}
              {item.reviewSuggested && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <Scale className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-[11px] block">Recommended Legal Counsel Inquiry:</span>
                    <p className="text-[11px] text-amber-800 mt-0.5">{item.reviewSuggested}</p>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
