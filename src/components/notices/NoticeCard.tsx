import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Bookmark, 
  History, 
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Notice } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface NoticeCardProps {
  notice: Notice;
  onBookmarkToggled?: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onBookmarkToggled }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const curVer = notice.current_version;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast('info', 'Sign in required', 'Please sign in to save notices to your personal bookmarks.');
      return;
    }
    const isSaved = db.toggleSaveNotice(user.id, notice.id);
    showToast(isSaved ? 'success' : 'info', isSaved ? 'Notice Bookmarked' : 'Bookmark Removed', notice.notice_id);
    onBookmarkToggled?.();
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'examination': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900';
      case 'scholarships': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900';
      case 'timetable': return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900';
      case 'events': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900';
      case 'admissions': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const hasMultipleVersions = (notice.versions?.length || 1) > 1;

  return (
    <div className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-navy-900 shadow-sm hover:shadow-xl hover:border-brand-500/50 dark:hover:border-cyan-500/50 transition-all duration-300">
      <div>
        {/* Top Header: ID, Category & Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
              {notice.notice_id}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryColor(notice.category)}`}>
              {notice.category}
            </span>
            {hasMultipleVersions && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-200 dark:border-violet-900">
                <History className="w-2.5 h-2.5" />
                Rev {curVer?.version_number || '2'}
              </span>
            )}
          </div>

          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-lg border transition-colors ${
              notice.is_saved
                ? 'bg-amber-500 text-white border-amber-600'
                : 'text-slate-400 hover:text-amber-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={notice.is_saved ? 'Remove Bookmark' : 'Save Notice'}
            aria-label="Bookmark notice"
          >
            <Bookmark className={`w-3.5 h-3.5 ${notice.is_saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <Link to={`/notices/${notice.notice_id}`} className="block group-hover:text-brand-600 dark:group-hover:text-cyan-400 transition-colors">
          <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2">
            {curVer?.title || 'Notice Document'}
          </h3>
        </Link>

        {/* Target Dept & Semester */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
          {notice.department} • <span className="font-medium">{notice.semester}</span>
        </p>

        {/* Description snippet */}
        {curVer?.description && (
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
            {curVer.description}
          </p>
        )}

        {/* Highlighted Critical Information (Exam date / Venue / Deadline) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
          {curVer?.exam_date && (
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Exam: {new Date(curVer.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}

          {curVer?.venue && (
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Venue: {curVer.venue}</span>
            </div>
          )}

          {curVer?.deadline && (
            <div className="flex items-center gap-2 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Deadline: {new Date(curVer.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Verification status and CTA buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <StatusBadge status={notice.status} size="sm" />

        <div className="flex items-center gap-1.5">
          <Link
            to={`/notices/${notice.notice_id}/verify`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800 text-[11px] font-bold text-brand-700 dark:text-cyan-400 bg-brand-50/50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
            title="Inspect Official Notice Trust Passport"
          >
            <ShieldCheck className="w-3 h-3 text-brand-500" />
            Passport
          </Link>

          <Link
            to={`/notices/${notice.notice_id}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-bold hover:bg-brand-600 dark:hover:bg-cyan-400 transition-colors"
          >
            Details
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
