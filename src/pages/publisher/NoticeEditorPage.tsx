import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { db } from '../../lib/db';
import { calculateFileHash } from '../../lib/pdf-extractor';
import { 
  PlusCircle, 
  ArrowLeft, 
  UploadCloud, 
  Calendar, 
  MapPin, 
  Clock, 
  FileCheck,
  Hash,
  AlertTriangle
} from 'lucide-react';

export const NoticeEditorPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Examination');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [semester, setSemester] = useState('Semester 6');
  const [venue, setVenue] = useState('');
  const [examDate, setExamDate] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

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
      showToast('error', 'Missing Fields', 'Title and description are mandatory.');
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const newNotice = db.createNoticeDraft({
        title,
        description,
        category,
        department,
        semester,
        effective_date: new Date(effectiveDate).toISOString(),
        expiry_date: expiryDate ? new Date(expiryDate).toISOString() : undefined,
        exam_date: examDate ? new Date(examDate).toISOString() : undefined,
        event_date: eventDate ? new Date(eventDate).toISOString() : undefined,
        venue,
        publisher_id: user.id,
        attachments: file ? [{
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          hash: fileHash
        }] : undefined
      });

      showToast('success', 'Draft Notice Submitted for Review', `Notice ${newNotice.notice_id} queued for Senate approval.`);
      navigate('/publisher/notices');
    } catch (err: any) {
      showToast('error', 'Error submitting notice', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/publisher/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
          <PlusCircle className="w-4 h-4" />
          <span>New Institutional Circular Submission</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Compose Authorized Notice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Submitted notices undergo mandatory independent Senate review before being signed with a canonical Trust Passport.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-6">
        {/* Category & Scope */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Notice Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="Examination">Examination</option>
              <option value="Timetable">Timetable & Schedule</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Admissions">Admissions</option>
              <option value="Events">Campus Events</option>
              <option value="Results">Academic Results</option>
              <option value="General">General Administrative</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Examination Cell">Examination Cell</option>
              <option value="Academic Affairs">Academic Affairs</option>
              <option value="All Departments">All Departments (Institutional)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Semester Scope
            </label>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="Semester 6">Semester 6</option>
              <option value="Semester 4">Semester 4</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Semester 8">Semester 8</option>
              <option value="All">All Semesters</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Notice Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., End-Semester Distributed Systems Theory Examination Schedule"
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        {/* Description / Instructions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Instructions & Notice Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter the official details, guidelines, rules, reporting time, and necessary student instructions..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        {/* Critical Structured Fields (Dates, Venue, Deadline) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">
              Examination Date & Time
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
              Venue / Hall Assignment
            </label>
            <input
              type="text"
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder="e.g. Auditorium Complex - Hall B"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
              Submission Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* File Attachment & Cryptographic Hash */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-950 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Attach Official PDF Document
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-950 dark:file:text-cyan-400"
          />

          {fileHash && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Hash className="w-4 h-4 shrink-0" />
              <span className="truncate">Calculated SHA-256 Digest: {fileHash}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/publisher/dashboard"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
          >
            {submitting ? 'Submitting to Senate...' : 'Submit Notice for Senate Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};
