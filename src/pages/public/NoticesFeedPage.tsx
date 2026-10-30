import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Notice, NoticeFilterParams } from '../../types';
import { NoticeCard } from '../../components/notices/NoticeCard';
import { NoticeFilters } from '../../components/notices/NoticeFilters';
import { FileText, Inbox } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const NoticesFeedPage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<NoticeFilterParams>({
    category: 'All',
    department: 'All',
    status: 'All',
    searchQuery: ''
  });
  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchNotices = () => {
    const res = db.getNotices(filters, user?.id);
    setNotices(res.notices);
    setTotalCount(res.total);
  };

  useEffect(() => {
    fetchNotices();
  }, [filters, user]);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
          <FileText className="w-4 h-4" />
          <span>Institutional Notice Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Explore Published Notices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search authorized, active, and revised circulars with cryptographic verification.
        </p>
      </div>

      {/* Filter Component */}
      <NoticeFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ category: 'All', department: 'All', status: 'All', searchQuery: '' })}
      />

      {/* Notice Grid & Results */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-semibold text-slate-500">
            Showing <strong className="text-slate-900 dark:text-white">{notices.length}</strong> of {totalCount} records
          </span>
        </div>

        {notices.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Notices Match Your Filters
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or reset the filters to view all institutional announcements.
            </p>
            <button
              onClick={() => setFilters({ category: 'All', department: 'All', status: 'All', searchQuery: '' })}
              className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-sm hover:bg-brand-500"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map(notice => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onBookmarkToggled={fetchNotices}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
