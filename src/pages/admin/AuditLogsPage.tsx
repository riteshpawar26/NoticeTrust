import React from 'react';
import { db } from '../../lib/db';
import { History, Shield, Lock, Hash } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const logs = db.getAuditLogs();

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED')) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (action.includes('CANCELLED') || action.includes('REJECTED')) return 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
    if (action.includes('REVISION')) return 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    return 'text-brand-600 bg-brand-50 dark:bg-brand-950/60 border-brand-200 dark:border-brand-800';
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <History className="w-4 h-4" />
          <span>Security & Institutional Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Immutable Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Append-only cryptographic ledger of notice creations, revision approvals, cancellation decrees, and Senate conflict interventions.
        </p>
      </div>

      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        <Lock className="w-4 h-4 text-brand-500 shrink-0" />
        <span>
          Audit records are permanent and append-only. No application role (including Super Admin) is permitted to modify or delete historical audit entries.
        </span>
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Actor / Email</th>
                <th className="pb-3">Action Type</th>
                <th className="pb-3">Target Entity</th>
                <th className="pb-3">Metadata & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 text-slate-400 font-sans text-[11px] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 font-sans">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {log.actor?.full_name || 'System Authority'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {log.actor_email || 'internal@noticetrust.edu'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getActionColor(log.action_type)}`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 uppercase text-[10px]">
                    {log.target_type}
                  </td>
                  <td className="py-3 font-mono text-[10px] text-slate-600 dark:text-slate-300 max-w-sm truncate">
                    {JSON.stringify(log.metadata || {})}
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
