import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Zap,
  Layers,
  AlertTriangle,
  Clock,
  DollarSign,
  ShieldAlert,
  MessageSquareText,
  GitCompare,
  Scale,
  CheckSquare,
  FileDown,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  onOpenUpload?: () => void;
  documentCount?: number;
  unresolvedAttentionCount?: number;
  stats?: {
    clausesCount: number;
    attentionCount: number;
    obligationsCount: number;
    inconsistenciesCount: number;
    actionCount: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onSelectTab,
  onOpenUpload,
  documentCount,
  unresolvedAttentionCount,
  stats,
}) => {
  const navigate = onNavigate || onSelectTab || (() => {});

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'viewer', label: 'Document Viewer (3-Panel)', icon: FileText },
    { id: 'xray', label: 'Document X-Ray', icon: Zap, isNew: true },
    {
      id: 'clauses',
      label: 'Clause Intelligence',
      icon: Layers,
      badge: stats?.clausesCount,
    },
    {
      id: 'attention',
      label: 'Attention / Risk Radar',
      icon: AlertTriangle,
      badge: stats?.attentionCount || unresolvedAttentionCount,
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'obligations',
      label: 'Obligation & Timeline',
      icon: Clock,
      badge: stats?.obligationsCount,
    },
    { id: 'financials', label: 'Financial Exposure', icon: DollarSign },
    {
      id: 'inconsistencies',
      label: 'Contradictions & Missing',
      icon: ShieldAlert,
      badge: stats?.inconsistenciesCount,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    { id: 'ask', label: 'Ask Legalens (Q&A)', icon: MessageSquareText },
    { id: 'compare', label: 'Version Comparison (Diff)', icon: GitCompare },
    { id: 'lawyer', label: 'What to Ask a Lawyer', icon: Scale },
    {
      id: 'actions',
      label: 'Legal Action Center',
      icon: CheckSquare,
      badge: stats?.actionCount,
      badgeColor: 'bg-indigo-100 text-indigo-800 font-bold',
    },
    { id: 'reports', label: 'Formal Legal Brief', icon: FileDown },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-950 to-indigo-800 text-white shadow-md shadow-indigo-950/20">
          <Scale className="h-5 w-5 text-indigo-200" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
            LEGALENS <span className="text-[10px] uppercase font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">AI</span>
          </h1>
          <p className="text-[10px] font-medium text-slate-500">Legal Document Intelligence</p>
        </div>
      </div>

      {/* Primary Action Button */}
      {onOpenUpload && (
        <div className="p-3 border-b border-slate-100 shrink-0">
          <button
            id="sidebar-btn-analyze-new"
            onClick={onOpenUpload}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-950 py-2.5 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-900 hover:shadow"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Analyze a Document</span>
          </button>
        </div>
      )}

      {/* Navigation list */}
      <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => navigate(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-900 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] shrink-0 font-mono ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Legal & Privacy Statement Footer */}
      <div className="border-t border-slate-200 p-3 shrink-0">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-[11px] text-slate-600 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-0.5">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span>Informational Assistance</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Legalens AI does not provide legal advice and does not replace a licensed legal professional.
          </p>
        </div>
      </div>
    </aside>
  );
};
