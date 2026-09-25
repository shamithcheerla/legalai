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
          <MessageSquareText className="h-4 w-4" />
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
          <input
            type="text"
            placeholder="e.g. Can the landlord enter without notice? What is the penalty for late rent?"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuestion.trim()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-950 px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Quick Questions */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 block">
            Suggested Questions for this Contract:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((sq) => (
              <button
                key={sq}
                type="button"
                onClick={() => handleSubmit(sq)}
                disabled={isLoading}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-900 transition text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grounded Answers Stream */}
      <div className="space-y-4">
        {qaHistory.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 transition"
          >
            {/* Question Bar */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-700">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{item.question}</h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                    item.confidence === 'High'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.confidence === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Confidence: {item.confidence}
                </span>

                <button
                  onClick={() => handleCopy(item, index)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                  title="Copy question and answer"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Answer Body */}
            <div className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              {item.answer}
            </div>

            {/* Fact vs Interpretation Breakdown */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 space-y-1">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <FileCheck2 className="h-3.5 w-3.5 text-emerald-600" />
                  Document Facts (Explicit Text)
                </span>
                <ul className="list-disc list-inside text-emerald-900 space-y-1 text-[11px]">
                  {item.documentFacts.map((fact, fi) => (
                    <li key={fi}>{fact}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 space-y-1">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  AI Plain-Language Interpretation
                </span>
                <p className="text-indigo-900 text-[11px] leading-relaxed">
                  {item.aiInterpretation}
                </p>
              </div>
            </div>

            {/* Citations / Evidence Box */}
            {item.evidence && item.evidence.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Verifiable Document Citations ({item.evidence.length})
                </span>
                <div className="space-y-2">
                  {item.evidence.map((ev, ei) => (
                    <div
                      key={ei}
                      className="rounded-lg bg-white p-2.5 border border-slate-200/80 text-[11px] space-y-1 font-mono"
                    >
                      <div className="flex items-center justify-between text-indigo-900 font-sans font-bold">
                        <span>{ev.section}</span>
                        <span className="text-slate-400 font-normal">Page {ev.page}</span>
                      </div>
                      <p className="text-slate-600 italic">"{ev.sourceText}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legal Consultation Suggestion */}
            {item.reviewSuggested && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-50/60 border border-amber-200 p-3 text-xs text-amber-900">
                <Scale className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Recommendation for Counsel: </span>
                  {item.reviewSuggested}
                </div>
              </div>
            )}
          </div>
        ))}

        {qaHistory.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 space-y-2">
            <MessageSquareText className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No questions asked yet</p>
            <p>Type a question above or click one of the suggested prompts to see evidence-grounded answers.</p>
          </div>
        )}
      </div>
    </div>
  );
};
