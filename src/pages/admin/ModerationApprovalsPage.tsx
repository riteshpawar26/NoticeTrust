import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { CheckSquare, CheckCircle2, XCircle, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModerationApprovalsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [, setTick] = useState(0);

  const store = db.getStore();
  const pendingVersions = store.versions.filter(v => v.review_status === 'pending');

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
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
          <CheckSquare className="w-4 h-4" />
          <span>Reviewer Moderation Queue</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Pending Notice Approvals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Enforce institutional validation before notices become active or supersede older versions.
        </p>
      </div>

      <div className="space-y-4">
        {pendingVersions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              All Submissions Reviewed
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no pending notice drafts or revisions awaiting Senate decision.
            </p>
          </div>
        ) : (
          pendingVersions.map(ver => {
            const notice = store.notices.find(n => n.id === ver.notice_id);
            const creator = store.profiles.find(p => p.id === ver.created_by);

            return (
              <div
                key={ver.id}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
                      {notice?.notice_id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      Version {ver.version_number}
                    </span>
                    <span className="text-xs text-slate-500">
                      Published by: <strong>{creator?.full_name}</strong>
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(ver.created_at).toLocaleString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ver.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {ver.description}
                  </p>
                </div>

                {ver.changes_summary && (
                  <div className="p-3 rounded-2xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/60 text-xs">
                    <span className="font-bold text-brand-600 dark:text-cyan-400">Recorded Revision Summary: </span>
                    {ver.changes_summary}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleReject(ver.notice_id, ver.id)}
                    className="px-4 py-2 rounded-xl border border-rose-300 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50"
                  >
                    Reject Submission
                  </button>

                  <button
                    onClick={() => handleApprove(ver.notice_id, ver.id)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                  >
                    Approve Notice & Update Passport
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
