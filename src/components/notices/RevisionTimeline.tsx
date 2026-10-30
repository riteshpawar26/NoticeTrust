import React from 'react';
import { GitCommit, History, CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import { Notice, NoticeVersion } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Link } from 'react-router-dom';

interface RevisionTimelineProps {
  notice: Notice;
  currentSelectedVersionId?: string;
  onSelectVersion?: (version: NoticeVersion) => void;
}

export const RevisionTimeline: React.FC<RevisionTimelineProps> = ({ 
  notice, 
  currentSelectedVersionId, 
  onSelectVersion 
}) => {
  const versions = notice.versions || (notice.current_version ? [notice.current_version] : []);
  // Sort ascending by version number for chronological timeline display
  const chronological = [...versions].sort((a, b) => a.version_number - b.version_number);

  return (
    <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-brand-500" />
            Immutable Revision Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographically tracked version chain. Older versions are preserved and never silently overwritten.
          </p>
        </div>

        <Link
          to={`/notices/${notice.notice_id}/history`}
          className="text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          Detailed Comparison <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {chronological.map((ver, idx) => {
          const isLatest = ver.id === notice.current_version_id;
          const isSelected = currentSelectedVersionId === ver.id;

          return (
            <div key={ver.id} className="relative group">
              {/* Dot Icon */}
              <div 
                className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-navy-900 transition-colors ${
                  isLatest
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <GitCommit className="w-3 h-3" />
              </div>

              {/* Version Card */}
              <div
                onClick={() => onSelectVersion?.(ver)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      Version {ver.version_number}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        Current Approved Pointer
                      </span>
                    )}
                    <StatusBadge status={ver.review_status} size="sm" />
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(ver.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
                  {ver.title}
                </p>

                {/* Changes summary */}
                {ver.changes_summary && (
                  <div className="mt-2.5 p-2 rounded-xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold text-brand-600 dark:text-cyan-400">Change Record: </span>
                    {ver.changes_summary}
                  </div>
                )}

                {/* Key attributes diff snippet */}
                <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                  {ver.exam_date && (
                    <span>Exam: <strong className="text-slate-700 dark:text-slate-300">{new Date(ver.exam_date).toLocaleDateString()}</strong></span>
                  )}
                  {ver.venue && (
                    <span>Venue: <strong className="text-slate-700 dark:text-slate-300">{ver.venue}</strong></span>
                  )}
                  {ver.file_hash && (
                    <span className="font-mono text-[10px]">Hash: {ver.file_hash.slice(0, 8)}...</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
