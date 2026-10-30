import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Layers, PlusCircle, History, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PublisherNoticesPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'b3000000-0000-0000-0000-000000000003';
  const notices = db.getNotices().notices.filter(n => n.created_by === currentUserId || user?.role === 'admin');

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            <Layers className="w-4 h-4" />
            <span>Notice Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            My Published Notices & Drafts
          </h1>
        </div>

        <Link
          to="/publisher/notices/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Circular</span>
        </Link>
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
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
                  <td className="py-3 font-semibold text-slate-900 dark:text-white max-w-sm truncate">
                    {n.current_version?.title}
                  </td>
                  <td className="py-3 text-slate-500">{n.category}</td>
                  <td className="py-3 font-mono">v{n.current_version?.version_number || '1'}</td>
                  <td className="py-3"><StatusBadge status={n.status} size="sm" /></td>
                  <td className="py-3 text-right space-x-2">
                    <Link
                      to={`/publisher/notices/${n.id}/revisions`}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-500 font-bold text-[11px]"
                    >
                      Revise
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
