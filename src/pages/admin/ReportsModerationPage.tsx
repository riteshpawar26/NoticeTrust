import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReportsModerationPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [, setTick] = useState(0);

  const reports = db.getReports();
  const pendingReports = reports.filter(r => r.status === 'pending');
  const resolvedReports = reports.filter(r => r.status !== 'pending');

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed') => {
    if (!user) return;
    const notes = prompt(`Enter resolution statement for ${status}:`);
    if (!notes) return;
    try {
      db.resolveReport(reportId, user.id, notes, status);
      showToast('success', `Report ${status}`, notes);
      setTick(t => t + 1);
    } catch (err: any) {
      showToast('error', 'Error resolving report', err.message);
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
          <ShieldAlert className="w-4 h-4" />
          <span>Student Discrepancy Moderation Queue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Review Notice Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Investigate student reports regarding outdated WhatsApp forwards, altered screenshots, and conflicting schedules.
        </p>
      </div>

      <div className="space-y-4">
        {pendingReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Pending Discrepancy Reports
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              All reported notice discrepancies have been addressed by the Senate.
            </p>
          </div>
        ) : (
          pendingReports.map(report => (
            <div
              key={report.id}
              className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
                    {report.notice?.notice_id}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {report.report_type.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500">
                    Reported by: <strong>{report.reporter?.full_name}</strong>
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  {new Date(report.created_at).toLocaleString()}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Reported Discrepancy:
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  "{report.description}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  to={`/notices/${report.notice?.notice_id}/verify`}
                  className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  Inspect Official Passport <ArrowRight className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleResolve(report.id, 'dismissed')}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, 'resolved')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                  >
                    Mark Resolved & Notify Student
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {resolvedReports.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
            Resolved Discrepancy Archive ({resolvedReports.length})
          </h2>
          <div className="space-y-3">
            {resolvedReports.map(report => (
              <div
                key={report.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/20 text-xs flex items-center justify-between gap-4"
              >
                <div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300 mr-2">
                    {report.notice?.notice_id}
                  </span>
                  <span className="text-slate-500">{report.description}</span>
                  {report.resolution_notes && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      Resolution: {report.resolution_notes}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 capitalize shrink-0">
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
