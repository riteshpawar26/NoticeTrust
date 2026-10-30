import React, { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Notice } from '../../types';
import { NoticeCard } from '../../components/notices/NoticeCard';
import { Bookmark, Inbox, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SavedNoticesPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'b5000000-0000-0000-0000-000000000005';
  const [savedNotices, setSavedNotices] = useState<Notice[]>([]);

  const loadSaved = () => {
    setSavedNotices(db.getSavedNotices(currentUserId));
  };

  useEffect(() => {
    loadSaved();
  }, [currentUserId]);

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Bookmark className="w-4 h-4" />
          <span>Personal Bookmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Saved Notices
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Important circulars and timetables pinned for fast offline access.
        </p>
      </div>

      {savedNotices.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Saved Notices
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Click the bookmark icon on any notice card to save it to your personal dashboard.
          </p>
          <Link
            to="/notices"
            className="mt-4 inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
          >
            Explore Public Notices
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedNotices.map(notice => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onBookmarkToggled={loadSaved}
            />
          ))}
        </div>
      )}
    </div>
  );
};
