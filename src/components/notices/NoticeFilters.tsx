import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { NoticeFilterParams } from '../../types';

interface NoticeFiltersProps {
  filters: NoticeFilterParams;
  onChange: (updated: NoticeFilterParams) => void;
  onReset: () => void;
}

export const NoticeFilters: React.FC<NoticeFiltersProps> = ({ filters, onChange, onReset }) => {
  const categories = ['All', 'Examination', 'Timetable', 'Scholarships', 'Admissions', 'Events', 'Results', 'General'];
  const departments = ['All', 'Computer Science & Engineering', 'Examination Cell', 'Academic Affairs', 'All Departments'];
  const statuses = ['All', 'active', 'upcoming', 'expired', 'cancelled', 'pending_review'];

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4">
      {/* Top Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={filters.searchQuery || ''}
          onChange={e => onChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by Notice ID (e.g. NT-2026-EXAM-0101), title, venue, or keyword..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
        />
      </div>

      {/* Filter Chips & Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* Category */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Category
          </label>
          <select
            value={filters.category || 'All'}
            onChange={e => onChange({ ...filters, category: e.target.value })}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Department
          </label>
          <select
            value={filters.department || 'All'}
            onChange={e => onChange({ ...filters, department: e.target.value })}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Lifecycle Status
          </label>
          <select
            value={filters.status || 'All'}
            onChange={e => onChange({ ...filters, status: e.target.value })}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 capitalize"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:border-rose-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
