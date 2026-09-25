import React, { useState } from 'react';
import { ActionItem } from '../types/legal';
import {
  CheckSquare,
  Clock,
  HelpCircle,
  FolderOpen,
  Scale,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Share2,
  Printer,
  Calendar,
} from 'lucide-react';

interface ActionCenterProps {
  actionItems: ActionItem[];
  onToggleStatus: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (title: string, category: ActionItem['category'], priority: ActionItem['priority'], notes?: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  actionItems,
  onToggleStatus,
  onDeleteItem,
  onAddItem,
  onUpdateNotes,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ActionItem['category']>('review');
  const [newPriority, setNewPriority] = useState<ActionItem['priority']>('High');
  const [isAdding, setIsAdding] = useState(false);

  const filterTabs = [
    { id: 'all', label: 'All Actions' },
    { id: 'review', label: 'Review Now' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'clarify', label: 'Clarify' },
    { id: 'gather', label: 'Gather Documents' },
    { id: 'ask_counsel', label: 'Ask Counsel' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredItems = actionItems.filter((item) => {
    if (activeFilter === 'all') return item.status !== 'dismissed';
    if (activeFilter === 'completed') return item.status === 'completed';
    return item.status !== 'completed' && item.category === activeFilter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddItem(newTitle, newCategory, newPriority);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleExport = () => {
    const text = `LEGAL ACTION PLAN\n\n${actionItems
      .filter((i) => i.status !== 'dismissed')
      .map(
        (i, idx) =>
          `${idx + 1}. [${i.status.toUpperCase()}] [${i.priority}] ${i.title} (${i.category})\nNotes: ${
            i.notes || 'None'
          }\n`
      )
      .join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('Action Plan copied to clipboard!');
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <CheckSquare className="h-4 w-4" />
            <span>Workflow & Task Orchestration</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Legal Action Center ({actionItems.filter((i) => i.status !== 'completed').length} Pending)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transform legal analysis into structured tasks, follow-up inquiries, and document gathering checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-950 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-900 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Action</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Export Checklist</span>
          </button>
        </div>
      </div>

      {/* New Action Inline Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm space-y-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950">Add Custom Action</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="text"
              placeholder="Action title, e.g. Request Schedule A inventory sheet"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-medium"
            >
              <option value="review">Review Now</option>
              <option value="upcoming">Upcoming Deadline</option>
              <option value="clarify">Clarify with Other Party</option>
              <option value="gather">Gather Document / Exhibit</option>
              <option value="ask_counsel">Ask Counsel</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-800"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Category Tabs */}
      <div className="flex gap-1.5 border-b border-slate-200 pb-3 text-xs overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 font-semibold transition ${
              activeFilter === tab.id
                ? 'bg-indigo-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl border bg-white p-4 shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.status === 'completed'
                ? 'border-slate-200 bg-slate-50/70 opacity-60'
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleStatus(item.id)}
                className="mt-0.5 rounded-full text-slate-400 hover:text-emerald-600 transition"
              >
                {item.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600 uppercase">
                    {item.category.replace('_', ' ')}
                  </span>
                  {item.sourceSection && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Ref: {item.sourceSection}
                    </span>
                  )}
                </div>

                <h4
                  className={`text-xs font-bold ${
                    item.status === 'completed'
                      ? 'line-through text-slate-500'
                      : 'text-slate-900'
                  }`}
                >
                  {item.title}
                </h4>

                {/* Inline Personal Notes */}
                <input
                  type="text"
                  placeholder="Add personal note or follow-up detail..."
                  defaultValue={item.notes || ''}
                  onBlur={(e) => onUpdateNotes(item.id, e.target.value)}
                  className="text-[11px] text-slate-600 placeholder-slate-400 bg-transparent border-b border-dashed border-slate-200 focus:border-indigo-500 focus:outline-none w-full max-w-lg mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onDeleteItem(item.id)}
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                title="Delete action"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500">
            No action items in this category.
          </div>
        )}
      </div>
    </div>
  );
};
