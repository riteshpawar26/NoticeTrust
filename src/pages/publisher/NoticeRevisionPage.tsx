import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { db } from '../../lib/db';
import { calculateFileHash } from '../../lib/pdf-extractor';
import { 
  History, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Hash, 
  Sparkles,
  AlertTriangle 
} from 'lucide-react';

export const NoticeRevisionPage: React.FC = () => {
  const { noticeId } = useParams<{ noticeId: string }>();
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const notice = noticeId 
    ? (db.getNoticeById(noticeId) || db.getNoticeByNoticeId(noticeId))
    : undefined;

  const curVer = notice?.current_version;

  const [title, setTitle] = useState(curVer ? `REVISED: ${curVer.title}` : '');
  const [description, setDescription] = useState(curVer?.description || '');
  const [venue, setVenue] = useState(curVer?.venue || '');
  const [examDate, setExamDate] = useState(curVer?.exam_date ? curVer.exam_date.slice(0, 16) : '');
  const [deadline, setDeadline] = useState(curVer?.deadline ? curVer.deadline.slice(0, 10) : '');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [reasonSummary, setReasonSummary] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!notice) {
    return <div className="py-16 text-center">Notice not found.</div>;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      const hash = await calculateFileHash(f);
      setFileHash(hash);
      showToast('info', 'File Fingerprint Computed', `SHA-256: ${hash.slice(0, 16)}...`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('error', 'Missing fields', 'Title and description are required.');
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      db.submitRevision(notice.id, {
        title,
        description,
        venue,
        exam_date: examDate ? new Date(examDate).toISOString() : undefined,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        effective_date: new Date(effectiveDate).toISOString(),
        changes_summary: reasonSummary,
        publisher_id: user.id,
        attachments: file ? [{
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          hash: fileHash
        }] : undefined
      });

      showToast('success', 'Revision Submitted for Approval', `New version registered for ${notice.notice_id}. Previous approved version remains active until Senate approves.`);
      navigate(`/notices/${notice.notice_id}/history`);
    } catch (err: any) {
      showToast('error', 'Error submitting revision', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to={`/notices/${notice.notice_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Notice Details</span>
        </Link>
        <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
          {notice.notice_id}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <History className="w-4 h-4" />
          <span>Immutable Version Chain</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Submit Official Notice Revision
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Creating a revision preserves the current approved version in history and attaches a new immutable version for Senate review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Revised Notice Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Official Reason for Revision / Change Summary
          </label>
          <input
            type="text"
            value={reasonSummary}
            onChange={e => setReasonSummary(e.target.value)}
            placeholder="e.g. Rescheduled exam date from Nov 10 to Nov 15; Changed venue to Auditorium Hall B due to NAAC inspection."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Updated Schedule & Venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
          <div>
            <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
              Revised Examination Date & Time
            </label>
            <input
              type="datetime-local"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Revised Venue Assignment
            </label>
            <input
              type="text"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="e.g. Auditorium Complex - Hall B"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Revised Notice Body Text
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        {/* Attachment */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Upload Revised PDF Document
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 dark:file:bg-violet-950 dark:file:text-cyan-400"
          />
          {fileHash && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Hash className="w-4 h-4 shrink-0" />
              <span className="truncate">New SHA-256 Digest: {fileHash}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-500/20 disabled:opacity-50"
          >
            {submitting ? 'Submitting Revision...' : 'Submit Revision for Senate Review'}
          </button>
        </div>
      </form>
    </div>
  );
};
