import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Search,
  GitCompare,
  Scale,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface JudgeWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onToggleExplain15: (active: boolean) => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Welcome to Legalens AI',
    subtitle: 'PromptWars: Virtual Challenge — AI for Legal Assistance & Access',
    description:
      'Legalens AI is built around a single core conviction: Legal documents should not require a law degree to understand. We reject generic conversational chatbots in favor of evidence-traceable legal intelligence.',
    targetTab: 'dashboard',
    actionLabel: 'View Dashboard',
  },
  {
    step: 2,
    title: 'The Legal Document X-Ray',
    subtitle: 'Instant Architectural Breakdown',
    description:
      'Experience the progressive anatomy reveal: cleanly dissecting legal documents into distinct layers of clauses, obligations, calendar dates, financial commitments, and areas requiring review.',
    targetTab: 'xray',
    actionLabel: 'Open Document X-Ray',
  },
  {
    step: 3,
    title: "Explain Like I'm 15 Mode",
    subtitle: 'Zero Legalese, Exact Meaning Preserved',
    description:
      'Toggle our global "Explain Like I\'m 15" mode to transform intricate contractual legalese into relatable, everyday metaphors without altering the underlying legal reality.',
    targetTab: 'clauses',
    actionLabel: "Try Explain Like I'm 15",
    triggerExplain15: true,
  },
  {
    step: 4,
    title: 'Evidence-First Grounding',
    subtitle: 'Every Claim Traceable to Verifiable Text',
    description:
      'Inspect any clause or insight in our Three-Panel Viewer. Clicking an item instantly highlights the verbatim source quote, page number, and section in the center document view.',
    targetTab: 'viewer',
    actionLabel: 'Open Document Viewer',
  },
  {
    step: 5,
    title: 'Contradiction & Missing Info Detectors',
    subtitle: 'Catching Friction Before You Sign',
    description:
      'Our engine automatically identifies internal contradictions within the contract (such as Section 4 30-day notice vs Section 12 60-day default cure) and flags unattached exhibits like missing Schedule A.',
    targetTab: 'inconsistencies',
    actionLabel: 'View Contradictions',
  },
  {
    step: 6,
    title: 'Contract Change Impact (Smart Diff)',
    subtitle: 'Version 1.0 vs Version 2.0 Comparison',
    description:
      'Compare negotiated contract versions side-by-side. Our engine highlights operational changes in money, deadlines, evergreen renewals, and uncapped liability carve-outs.',
    targetTab: 'compare',
    actionLabel: 'Inspect Version Comparison',
  },
  {
    step: 7,
    title: 'Grounded Document Q&A',
    subtitle: 'Strict Anti-Hallucination Answers',
    description:
      'Ask any question and receive structured answers that clearly distinguish between explicit Document Facts, AI Interpretations, and items to review with an attorney—complete with verifiable quotes.',
    targetTab: 'ask',
    actionLabel: 'Try Grounded Q&A',
  },
  {
    step: 8,
    title: 'Prepare for Legal Consultation',
    subtitle: 'What Should I Ask a Lawyer?',
    description:
      'Generate a tailored briefing dossier containing essential facts to share, prioritized questions to ask, critical clauses to highlight, and supporting evidence to gather prior to a consultation.',
    targetTab: 'lawyer',
    actionLabel: 'View Consultation Brief',
  },
  {
    step: 9,
    title: 'Legal Action Center & Report Generation',
    subtitle: 'From Analysis to Execution',
    description:
      'Manage tasks with an actionable workflow, add personal notes, track upcoming obligations, and export a comprehensive, print-ready legal brief.',
    targetTab: 'actions',
    actionLabel: 'Explore Action Center',
  },
];

export const JudgeWalkthrough: React.FC<JudgeWalkthroughProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onToggleExplain15,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const nextStep = TOUR_STEPS[nextIdx];
      onNavigateTab(nextStep.targetTab);
      if (nextStep.triggerExplain15 !== undefined) {
        onToggleExplain15(nextStep.triggerExplain15);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const prevStep = TOUR_STEPS[prevIdx];
      onNavigateTab(prevStep.targetTab);
    }
  };

  const handleJumpToStep = (idx: number) => {
    setCurrentStepIndex(idx);
    const step = TOUR_STEPS[idx];
    onNavigateTab(step.targetTab);
    if (step.triggerExplain15 !== undefined) {
      onToggleExplain15(step.triggerExplain15);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-200 bg-white p-6 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Interactive Judge Walkthrough Tour</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">
              Step {currentStep.step} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tour Body */}
        <div className="py-6 space-y-4">
          <div className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-800 w-fit">
            {currentStep.subtitle}
          </div>

          <h3 className="text-xl font-bold text-slate-950">{currentStep.title}</h3>

          <p className="text-xs text-slate-600 leading-relaxed text-base sm:text-sm">
            {currentStep.description}
          </p>

          {/* Quick jump step dots */}
          <div className="flex items-center gap-1.5 pt-2">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => handleJumpToStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-indigo-900'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Jump to Step ${s.step}: ${s.title}`}
              />
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-950 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
