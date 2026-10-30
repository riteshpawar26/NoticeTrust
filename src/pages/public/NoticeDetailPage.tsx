import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  History, 
  FileText, 
  Calendar, 
  MapPin, 
  Clock, 
  Bookmark, 
  Share2, 
  Download, 
  Flag, 
  ArrowLeft,
  Hash,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RevisionTimeline } from '../../components/notices/RevisionTimeline';

export const NoticeDetailPage: React.FC = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('outdated');
  const [reportDesc, setReportDesc] = useState('');

  const notice = noticeId 
    ? (db.getNoticeByNoticeId(noticeId, user?.id) || db.getNoticeById(noticeId, user?.id))
    : undefined;

  if (!notice) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notice Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The specified Notice ID was not found in the institutional registry.</p>
        <Link to="/notices" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Notice Registry
        </Link>
      </div>
    );
  }

  const curVer = notice.current_version;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('success', 'Notice Link Copied', window.location.href);
  };

  const handleBookmark = () => {
    if (!user) {
      showToast('info', 'Sign in Required', 'Please log in to save notices.');
      return;
    }
    const isSaved = db.toggleSaveNotice(user.id, notice.id);
    showToast(isSaved ? 'success' : 'info', isSaved ? 'Notice Bookmarked' : 'Bookmark Removed');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) {
      showToast('error', 'Description required', 'Please describe the discrepancy.');
      return;
    }
    if (!user) {
      showToast('info', 'Sign in required', 'Please log in as a student to file a report.');
      return;
    }
    db.submitNoticeReport({
      notice_id: notice.id,
      version_id: curVer?.id,
      reporter_id: user.id,
      report_type: reportType as any,
      description: reportDesc
    });
    showToast('success', 'Report Submitted for Moderation', 'Senate officers will review this notice against historical records.');
    setReportModalOpen(false);
    setReportDesc('');
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Back button & top navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/notices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/notices/${notice.notice_id}/verify`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:scale-105 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Trust Passport</span>
          </Link>

          <button
            onClick={handleBookmark}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:text-amber-500"
            title="Bookmark Notice"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:text-brand-500"
            title="Copy Permanent Link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Notice Document Card */}
      <article className="p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-6">
        {/* Header Metadata */}
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
              {notice.notice_id}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {notice.category}
            </span>
            <StatusBadge status={notice.status} size="md" />
            <span className="text-xs text-slate-400 ml-auto">
              Current Version: <strong className="text-slate-700 dark:text-slate-200 font-mono">v{curVer?.version_number || '1'}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {curVer?.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-1">
            <span>Published: <strong className="text-slate-700 dark:text-slate-300">{new Date(notice.created_at).toLocaleDateString()}</strong></span>
            <span>Department: <strong className="text-slate-700 dark:text-slate-300">{notice.department}</strong></span>
            <span>Target: <strong className="text-slate-700 dark:text-slate-300">{notice.semester}</strong></span>
          </div>
        </div>

        {/* Cancellation Notice if Cancelled */}
        {notice.status === 'cancelled' && curVer?.cancellation_reason && (
          <div className="p-5 rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/60 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Official Cancellation Order
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                {curVer.cancellation_reason}
              </p>
              <p className="text-[10px] text-rose-500 mt-1">
                Order Executed: {curVer.cancelled_at ? new Date(curVer.cancelled_at).toLocaleString() : 'Senate Order'}
              </p>
            </div>
          </div>
        )}

        {/* Critical Information Box (Dates, Venue, Deadlines) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          {curVer?.exam_date && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-1">
                Examination Date & Time
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>{new Date(curVer.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          )}

          {curVer?.venue && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Assigned Venue / Hall
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 text-brand-500" />
                <span>{curVer.venue}</span>
              </div>
            </div>
          )}

          {curVer?.deadline && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
                Submission Deadline
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{new Date(curVer.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          )}
        </div>

        {/* Notice Description Body */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Text & Instructions
          </h3>
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {curVer?.description}
          </div>
        </div>

        {/* Official Attachments */}
        {curVer?.attachments && curVer.attachments.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Authorized Attachments & Cryptographic Fingerprints
            </h3>
            <div className="space-y-2">
              {curVer.attachments.map(att => (
                <div
                  key={att.id}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-brand-500 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {att.file_name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{(att.file_size ? (att.file_size / 1024).toFixed(1) : '240')} KB</span>
                        <span>•</span>
                        <span className="font-mono truncate max-w-xs">SHA-256: {att.sha256_hash.slice(0, 16)}...</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={att.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Discrepancy Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Found conflicting information or circulating altered forwards?
          </p>
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Discrepancy</span>
          </button>
        </div>
      </article>

      {/* Revision Timeline on this notice */}
      <RevisionTimeline notice={notice} />

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Report Notice Discrepancy
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Help campus administration detect altered WhatsApp forwards and conflicting dates.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Discrepancy Category
                </label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="outdated">Outdated / Superseded Version Circulating</option>
                  <option value="suspicious_altered">Suspicious / Potentially Altered Screenshot</option>
                  <option value="conflicting">Conflicting Exam Date or Venue</option>
                  <option value="duplicate">Duplicate Notice Overlap</option>
                  <option value="broken_link">Broken Attachment or QR Link</option>
                  <option value="other">Other Inaccuracy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description & Context <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  placeholder="e.g., A PDF on WhatsApp says the exam is in Hall A on Nov 10, but NoticeTrust shows Revision 2 in Hall B on Nov 15."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
