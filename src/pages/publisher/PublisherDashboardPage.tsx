import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/db';
import { 
  PlusCircle, 
  Layers, 
  FileClock, 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PublisherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'b3000000-0000-0000-0000-000000000003';
  const notices = db.getNotices().notices.filter(n => n.created_by === currentUserId || user?.role === 'admin');

  const pendingNotices = notices.filter(n => n.status === 'pending_review');
  const activeNotices = notices.filter(n => n.status === 'active');
  const cancelledNotices = notices.filter(n => n.status === 'cancelled');

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Layers className="w-4 h-4" />
            <span>Authorized Publisher Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Publisher Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create drafts, attach documents with SHA-256 integrity, and submit official revisions.
          </p>
        </div>

        <Link
          to="/publisher/notices/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Notice</span>
        </Link>
      </div>

      {/* Separation of Duties Policy Banner */}
      <div className="p-4 rounded-2xl border border-sky-300 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 dark:text-sky-200">
          <strong className="font-bold">Separation of Duties Enforced: </strong>
          Under institutional governance policy, publishers cannot approve their own submissions. All draft circulars and revisions undergo independent review by the Academic Senate before appearing as officially verified.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Published</div>
          <div className="text-3xl font-extrabold text-emerald-500 mt-1">{activeNotices.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Verified on institutional registry</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Senate Review</div>
          <div className="text-3xl font-extrabold text-violet-500 mt-1">{pendingNotices.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting reviewer decision</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Cancelled Circulars</div>
          <div className="text-3xl font-extrabold text-rose-500 mt-1">{cancelledNotices.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Archived with recorded reasons</p>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            My Circulars & Version Chain
          </h3>
          <Link to="/publisher/notices" className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline">
            Manage All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Notice ID</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Version</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {notices.map(n => (
                <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-brand-600 dark:text-cyan-400">
                    {n.notice_id}
                  </td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {n.current_version?.title}
                  </td>
                  <td className="py-3 text-slate-500">
                    {n.category}
                  </td>
                  <td className="py-3 font-mono">
                    v{n.current_version?.version_number || '1'}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={n.status} size="sm" />
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <Link
                      to={`/publisher/notices/${n.id}/revisions`}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-500 font-bold text-[11px]"
                    >
                      Submit Revision
                    </Link>
                    <Link
                      to={`/notices/${n.notice_id}/verify`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white font-bold text-[11px]"
                    >
                      Passport
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
