import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Flag, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentReportsPage: React.FC = () => {
  const { user } = useAuth();
  const reports = db.getReports().filter(r => r.reporter_id === user?.id || user?.role === 'admin');

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
          <Flag className="w-4 h-4" />
          <span>Student Discrepancy Reports</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Notice Discrepancy Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Check the resolution status of reported outdated circulars, suspicious WhatsApp forwards, and conflicting dates.
        </p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Reports Filed Yet
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven't reported any notice discrepancies. You can report suspicious circulars directly from any Notice details page.
            </p>
          </div>
        ) : (
          reports.map(report => (
            <div
              key={report.id}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
                    {report.notice?.notice_id}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                    {report.report_type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    report.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    Status: {report.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Reported Observation:
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  "{report.description}"
                </p>
              </div>

              {report.resolution_notes && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-bold">Senate Officer Resolution: </span>
                  {report.resolution_notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
