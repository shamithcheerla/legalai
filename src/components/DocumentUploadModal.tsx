import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileCode,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  DEMO_RENTAL_AGREEMENT_TEXT,
  DEMO_SERVICE_V1_TEXT,
  DEMO_SERVICE_V2_TEXT,
} from '../data/demoDocuments';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeComplete?: (text: string, title: string, jurisdiction?: string) => Promise<void>;
  onAnalyze?: (title: string, text: string) => Promise<void>;
}

const PIPELINE_STEPS = [
  'Secure upload & sanitization',
  'Extracting document content',
  'Identifying sections & structure',
  'Detecting clauses & plain translations',
  'Extracting obligations & triggers',
  'Detecting attention items & contradictions',
  'Building document map & financial breakdown',
  'Preparing Q&A grounded index',
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeComplete,
  onAnalyze,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'presets'>('presets');
  const [docTitle, setDocTitle] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setErrorMessage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!docTitle) {
        setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setErrorMessage(null);
    }
  };

  const runAnalysis = async (text: string, title: string) => {
    if (!text || text.trim().length < 20) {
      setErrorMessage('Please provide a legal document with readable text (at least 20 characters).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStepIndex(0);

    // Realistic pipeline animation sequence
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      if (onAnalyzeComplete) {
        await onAnalyzeComplete(text, title, jurisdiction);
      } else if (onAnalyze) {
        await onAnalyze(title, text);
      }
      clearInterval(interval);
      setIsProcessing(false);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMessage(err.message || 'Failed to analyze document. Please check connection and try again.');
    }
  };

  const handleSubmit = async () => {
    if (activeTab === 'presets') {
      // Default to demo rental
      await runAnalysis(DEMO_RENTAL_AGREEMENT_TEXT, 'Residential Lease Agreement (742 Evergreen Terrace)');
      return;
    }

    if (activeTab === 'paste') {
      await runAnalysis(pastedText, docTitle || 'Pasted Legal Agreement');
      return;
    }

    if (activeTab === 'upload' && selectedFile) {
      try {
        const text = await selectedFile.text();
        await runAnalysis(text, docTitle || selectedFile.name);
      } catch (err) {
        setErrorMessage('Unable to read the selected file. Please ensure it is a valid text, markdown, or text-based document.');
      }
    } else {
      setErrorMessage('Please choose a file or select a preset to analyze.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-900">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Analyze a Legal Document</h2>
              <p className="text-xs text-slate-500">Extract clauses, obligations, deadlines, and plain-English breakdown</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Processing Pipeline Screen */}
        {isProcessing ? (
          <div className="py-10 px-4 space-y-6 flex-1 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-indigo-100 border-t-indigo-900 animate-spin" />
              <Sparkles className="absolute h-6 w-6 text-indigo-700 animate-pulse" />
            </div>

            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900">Running Legal Intelligence Engine</h3>
              <p className="text-xs text-slate-500 mt-1">Grounding clauses and cross-referencing citations...</p>
            </div>

            {/* Pipeline Step List */}
            <div className="w-full max-w-md space-y-2 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
              {PIPELINE_STEPS.map((step, idx) => {
                const isDone = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2.5 text-xs transition-colors ${
                      isDone
                        ? 'text-emerald-700 font-medium'
                        : isCurrent
                        ? 'text-indigo-900 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-indigo-600 animate-spin shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Normal Upload Form */
          <div className="overflow-y-auto py-4 space-y-4 flex-1">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tab Selection */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === 'presets'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sample Contracts (Instant)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === 'upload'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                  activeTab === 'paste'
                    ? 'bg-white text-indigo-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Paste Text
              </button>
            </div>

            {/* Tab 1: Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Select a realistic sample agreement to test without uploading your own document:
                </p>

                <div
                  onClick={() => runAnalysis(DEMO_RENTAL_AGREEMENT_TEXT, 'Residential Lease Agreement (742 Evergreen Terrace)')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 hover:border-indigo-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                      Residential Lease Agreement (Tenancy Contract)
                    </span>
                    <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Features real-world legal clauses: $2,400 rent, late fees, pet policy, broad indemnity, missing Schedule A, and notice contradiction (30 vs 60 days).
                  </p>
                </div>

                <div
                  onClick={() => runAnalysis(DEMO_SERVICE_V1_TEXT, 'Master Services Agreement v1.0')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 hover:border-indigo-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                      Master Services Agreement (Version 1.0 - Draft)
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      Commercial SaaS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    $25k/year analytics platform, Net 30, 30 days termination, mutual 1x liability cap, 99.5% SLA.
                  </p>
                </div>

                <div
                  onClick={() => runAnalysis(DEMO_SERVICE_V2_TEXT, 'Master Services Agreement v2.0')}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 hover:border-indigo-400 hover:bg-white transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                      Master Services Agreement (Version 2.0 - Final Negotiated)
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      Commercial SaaS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    $30k/year, Net 15, 60 days termination, automatic renewal, uncapped data breach & IP indemnity.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Upload File */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition"
                >
                  <Upload className="h-8 w-8 text-indigo-600 mb-3" />
                  <p className="text-xs font-bold text-slate-800">
                    {selectedFile ? selectedFile.name : 'Click to select or drag and drop your document'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports TXT, Markdown, PDF text, JSON contracts
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.text,.json,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Document Title (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Employment Contract 2026"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Jurisdiction (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. California, USA or India"
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Paste Text */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Document Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Commercial Lease Agreement"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Paste Full Legal Document Text
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste the contract, terms of service, NDA, or tenancy agreement here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        {!isProcessing && (
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Processed ephemerally. Never used for public training.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-950 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                <span>Start Legal Analysis</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
