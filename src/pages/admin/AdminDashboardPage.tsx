import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  CheckSquare, 
  Radio, 
  ShieldAlert, 
  Clock, 
  History, 
  AlertOctagon, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConflictCard } from '../../components/radar/ConflictCard';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [tick, setTick] = useState(0);

  const metrics = db.getDashboardMetrics();
  const store = db.getStore();
  const pendingVersions = store.versions.filter(v => v.review_status === 'pending');
  const conflicts = db.getConflicts();
  const activeConflicts = conflicts.filter(c => c.status === 'detected' || c.status === 'confirmed');
  const reports = db.getReports().filter(r => r.status === 'pending');

  const handleApprove = (noticeId: string, versionId: string) => {
    if (!user) return;
    try {
      db.approveNoticeVersion(noticeId, versionId, user.id, 'Verified and approved by Academic Senate.');
      showToast('success', 'Notice Version Approved', 'Notice updated and signed with cryptographic Trust Passport.');
      setTick(t => t + 1);
    } catch (err: any) {
      showToast('error', 'Approval Error', err.message);
    }
  };

  const handleReject = (noticeId: string, versionId: string) => {
    if (!user) return;
    const reason = prompt('Please enter the reason for rejection / changes requested:');
    if (!reason) return;
    try {
      db.rejectNoticeVersion(noticeId, versionId, user.id, reason);
      showToast('warning', 'Notice Rejected', reason);
      setTick(t => t + 1);
    } catch (err: any) {
      showToast('error', 'Rejection Error', err.message);
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
          <CheckSquare className="w-4 h-4" />
          <span>Academic Senate & Moderation Directorate</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Senate Moderation Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review publisher submissions, resolve Cross-Notice conflicts, investigate student discrepancy alerts, and enforce campus schedule integrity.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Approvals</div>
          <div className="text-3xl font-extrabold text-violet-500 mt-1">{metrics.pendingApprovals}</div>
          <p className="text-[11px] text-slate-500 mt-1">Require reviewer decision</p>
        </div>

        <div className="p-5 rounded-3xl border border-amber-300 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Radar Conflicts</span>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{metrics.openConflicts}</div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">Collisions flagged by Radar</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Reports</div>
          <div className="text-3xl font-extrabold text-rose-500 mt-1">{metrics.pendingReports}</div>
          <p className="text-[11px] text-slate-500 mt-1">Circulating forwards flagged</p>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Published</div>
          <div className="text-3xl font-extrabold text-emerald-500 mt-1">{metrics.totalPublished}</div>
          <p className="text-[11px] text-slate-500 mt-1">Active on canonical registry</p>
        </div>
      </div>

      {/* Priority 1: Cross-Notice Conflict Radar Alerts */}
      {activeConflicts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500 text-white">
                <Radio className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Cross-Notice Conflicts Intercepted ({activeConflicts.length})
              </h2>
            </div>
            <Link to="/admin/conflicts" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
              Open Full Radar
            </Link>
          </div>

          <div className="space-y-4">
            {activeConflicts.map(c => (
              <ConflictCard
                key={c.id}
                conflict={c}
                canModerate={true}
                onResolved={() => setTick(t => t + 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Priority 2: Pending Notice Approvals Queue */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-500" />
              Pending Senate Approvals Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review submissions before they appear as officially verified to students.
            </p>
          </div>
          <Link to="/admin/approvals" className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline">
            View All ({pendingVersions.length})
          </Link>
        </div>

        {pendingVersions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No pending submissions awaiting review. Queue is clear!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingVersions.map(ver => {
              const notice = store.notices.find(n => n.id === ver.notice_id);
              const creator = store.profiles.find(p => p.id === ver.created_by);

              return (
                <div
                  key={ver.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
                        {notice?.notice_id}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                        Version {ver.version_number}
                      </span>
                      <span className="text-xs text-slate-500">
                        Submitted by: <strong className="text-slate-800 dark:text-slate-200">{creator?.full_name}</strong>
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {ver.title}
                    </h4>

                    {ver.changes_summary && (
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Reason: {ver.changes_summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(ver.notice_id, ver.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(ver.notice_id, ver.id)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                    >
                      Approve & Sign Passport
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
