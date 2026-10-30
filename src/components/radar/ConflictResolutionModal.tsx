import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { NoticeConflict } from '../../types';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface ConflictResolutionModalProps {
  conflict: NoticeConflict;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({ conflict, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [decision, setDecision] = useState<'resolved' | 'false_positive' | 'confirmed'>('resolved');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      showToast('error', 'Resolution Notes Required', 'Please explain the rationale for resolving this conflict.');
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      db.resolveConflict(conflict.id, user.id, decision, notes);
      showToast('success', 'Conflict Resolved', `Notice conflict marked as ${decision.replace('_', ' ')}.`);
      onSuccess();
    } catch (err: any) {
      showToast('error', 'Error resolving conflict', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-2xl p-6 sm:p-7 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Senate Conflict Resolution
            </h3>
            <p className="text-xs text-slate-500">
              Cross-Notice Conflict Radar Review
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Reviewer Decision
            </label>
            <select
              value={decision}
              onChange={e => setDecision(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              <option value="resolved">Resolved (Schedule Adjusted / Venue Reallocated)</option>
              <option value="false_positive">False Positive (Independent Slots / Distinct Cohorts)</option>
              <option value="confirmed">Confirmed Active Conflict (Publisher Must Revise)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Official Senate Resolution Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Examination Cell confirmed Theory Exam takes priority in Auditorium Hall B. HOD CS reallocated Lab Viva to Computing Lab 3."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              {submitting ? 'Recording...' : 'Commit Resolution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
