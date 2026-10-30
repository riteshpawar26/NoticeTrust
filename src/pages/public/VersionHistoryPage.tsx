import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { ArrowLeft, History, GitCompare, Sparkles } from 'lucide-react';
import { VersionDiffViewer } from '../../components/notices/VersionDiffViewer';
import { RevisionTimeline } from '../../components/notices/RevisionTimeline';

export const VersionHistoryPage: React.FC = () => {
  const { noticeId } = useParams<{ noticeId: string }>();

  const notice = noticeId 
    ? (db.getNoticeByNoticeId(noticeId) || db.getNoticeById(noticeId))
    : undefined;

  const versions = notice?.versions || (notice?.current_version ? [notice.current_version] : []);
  const sortedVersions = [...versions].sort((a, b) => a.version_number - b.version_number);

  const [oldVerNum, setOldVerNum] = useState<number>(sortedVersions[0]?.version_number || 1);
  const [newVerNum, setNewVerNum] = useState<number>(sortedVersions[sortedVersions.length - 1]?.version_number || 1);

  if (!notice) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notice Not Found</h2>
        <Link to="/notices" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Feed
        </Link>
      </div>
    );
  }

  const oldVer = versions.find(v => v.version_number === oldVerNum) || versions[0];
  const newVer = versions.find(v => v.version_number === newVerNum) || versions[versions.length - 1];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          to={`/notices/${notice.notice_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Notice Details</span>
        </Link>

        <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
          {notice.notice_id}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <History className="w-4 h-4" />
          <span>Smart Revision Impact Detector</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Compare Notice Revisions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Inspect deterministic field-by-field differences between historical and revised notice versions.
        </p>
      </div>

      {/* Version Selector Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-rose-500 mb-1">
              Base Version (Old)
            </label>
            <select
              value={oldVerNum}
              onChange={e => setOldVerNum(Number(e.target.value))}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
            >
              {sortedVersions.map(v => (
                <option key={v.id} value={v.version_number}>
                  Version {v.version_number} ({new Date(v.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 text-slate-400 font-bold">vs</div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-500 mb-1">
              Target Version (Revised)
            </label>
            <select
              value={newVerNum}
              onChange={e => setNewVerNum(Number(e.target.value))}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
            >
              {sortedVersions.map(v => (
                <option key={v.id} value={v.version_number}>
                  Version {v.version_number} ({v.id === notice.current_version_id ? 'Current Active' : new Date(v.created_at).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 text-right">
          Total Versions in Chain: <strong className="text-slate-900 dark:text-white font-mono">{versions.length}</strong>
        </div>
      </div>

      {/* Side-by-Side Diff Component */}
      {oldVer && newVer && (
        <VersionDiffViewer oldVersion={oldVer} newVersion={newVer} />
      )}

      {/* Revision Timeline */}
      <RevisionTimeline
        notice={notice}
        currentSelectedVersionId={newVer?.id}
      />
    </div>
  );
};
