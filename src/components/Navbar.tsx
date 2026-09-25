import React from 'react';
import {
  Shield,
  Search,
  Sparkles,
  HelpCircle,
  FileText,
  CheckCircle2,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenJudgeTour?: () => void;
  onStartJudgeTour?: () => void;
  onOpenSettings?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  explain15Global: boolean;
  onToggleExplain15: () => void;
  currentDocumentTitle?: string;
  availableDocuments?: any[];
  onSelectDocument?: (docId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenUpload,
  onOpenJudgeTour,
  onStartJudgeTour,
  onOpenSettings,
  searchQuery = '',
  onSearchChange,
  explain15Global,
  onToggleExplain15,
  currentDocumentTitle,
  availableDocuments = [],
  onSelectDocument,
}) => {
  const triggerTour = onOpenJudgeTour || onStartJudgeTour || (() => {});

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* Left side: Brand or Active Doc Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left transition hover:opacity-80 md:hidden"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-900 text-white font-bold text-sm shadow-sm">
            L
          </div>
          <span className="font-bold text-slate-900 tracking-tight">LEGALENS</span>
        </button>

        {/* Document Selector Dropdown if available */}
        {availableDocuments && availableDocuments.length > 0 && onSelectDocument ? (
          <div className="hidden items-center gap-2 text-xs lg:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-400 font-medium">Document:</span>
            <select
              value={
                availableDocuments.find((d) => d.name === currentDocumentTitle)?.id ||
                availableDocuments[0].id
              }
              onChange={(e) => onSelectDocument(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-xs truncate cursor-pointer"
            >
              {availableDocuments.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
        ) : currentDocumentTitle ? (
          <div className="hidden items-center gap-2 text-xs text-slate-500 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-slate-700 max-w-[280px] truncate">
              {currentDocumentTitle}
            </span>
          </div>
        ) : null}
      </div>

      {/* Middle: Global Search */}
      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clauses, obligations, dates, or terms..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Explain Like I'm 15 global toggle */}
        <button
          id="btn-toggle-explain15"
          onClick={onToggleExplain15}
          title="Toggle Explain Like I'm 15 mode"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            explain15Global
              ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className={`h-3.5 w-3.5 ${explain15Global ? 'text-amber-600 fill-amber-500' : 'text-slate-500'}`} />
          <span className="hidden sm:inline font-semibold">Explain Like I'm 15</span>
          <span className="sm:hidden">ELI15</span>
        </button>

        {/* Judge Walkthrough Quick Button */}
        <button
          id="btn-judge-walkthrough"
          onClick={triggerTour}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-950 to-indigo-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-indigo-900 hover:to-indigo-700 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span>Judge Walkthrough</span>
        </button>

        {/* Privacy Indicator Badge */}
        <div
          title="Documents are processed ephemerally and securely. Not used for training."
          className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 xl:flex"
        >
          <Lock className="h-3 w-3 text-emerald-600" />
          <span>Privacy Shield Active</span>
        </div>
      </div>
    </header>
  );
};
