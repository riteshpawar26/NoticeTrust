import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { Layers, AlertOctagon, History, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminNoticesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [, setTick] = useState(0);

  const notices = db.getNotices().notices;

  const handleCancelNotice = (noticeId: string, currentTitle: string) => {
    if (!user) return;
    const reason = prompt(`Enter official reason for cancelling "${currentTitle}":`);
    if (!reason || !reason.trim()) {
      showToast('error', 'Cancellation Aborted', 'A mandatory cancellation reason is required for institutional audit compliance.');
      return;
    }

    try {
      db.cancelNotice(noticeId, user.id, reason);
      showToast('warning', 'Notice Officially Cancelled', `Cancellation order executed and recorded on Trust Passport.`);
      setTick(t => t + 1);
    } catch (err: any) {
      showToast('error', 'Error cancelling notice', err.message);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
          <Layers className="w-4 h-4" />
          <span>Campus Authority Control</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Master Institutional Notice Registry
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete database registry. Execute cancellation orders with recorded audit explanations or inspect version timelines.
        </p>
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Notice ID</th>
                <th className="pb-3">Title</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Version</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Administrative Actions</th>
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
                  <td className="py-3 text-slate-500">{n.department}</td>
                  <td className="py-3 font-mono">v{n.current_version?.version_number || '1'}</td>
                  <td className="py-3"><StatusBadge status={n.status} size="sm" /></td>
                  <td className="py-3 text-right space-x-2">
                    <Link
                      to={`/notices/${n.notice_id}/verify`}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white font-bold text-[11px]"
                    >
                      Passport
                    </Link>
                    <Link
                      to={`/notices/${n.notice_id}/history`}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-500 font-bold text-[11px]"
                    >
                      Diff
                    </Link>
                    {n.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelNotice(n.id, n.current_version?.title || n.notice_id)}
                        className="px-2.5 py-1 rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold text-[11px]"
                      >
                        Cancel Notice
                      </button>
                    )}
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
