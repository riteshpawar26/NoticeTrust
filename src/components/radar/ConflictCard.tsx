import React, { useState } from 'react';
import { 
  Radio, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  ArrowRight,
  ShieldAlert,
  Building
} from 'lucide-react';
import { NoticeConflict } from '../../types';
import { ConflictResolutionModal } from './ConflictResolutionModal';

interface ConflictCardProps {
  conflict: NoticeConflict;
  onResolved?: () => void;
  canModerate?: boolean;
}

export const ConflictCard: React.FC<ConflictCardProps> = ({ conflict, onResolved, canModerate = false }) => {
  const [showModal, setShowModal] = useState(false);

  const getSeverityBadge = (sev: string) => {
    switch (sev.toLowerCase()) {
      case 'critical':
        return 'bg-rose-500 text-white';
      case 'high':
        return 'bg-amber-500 text-white';
      case 'medium':
        return 'bg-sky-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
      case 'false_positive':
        return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 animate-pulse';
    }
  };

  return (
    <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm hover:shadow-md transition-all">
      {/* Header: Conflict Type & Severity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getSeverityBadge(conflict.severity)}`}>
                {conflict.severity} Severity
              </span>
              <span className="font-bold text-sm text-slate-900 dark:text-white capitalize">
                {conflict.conflict_type.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Detected on {new Date(conflict.detected_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${getStatusBadge(conflict.status)}`}>
            {conflict.status.replace('_', ' ')}
          </span>
          {canModerate && conflict.status === 'detected' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Resolve Conflict
            </button>
          )}
        </div>
      </div>

      {/* Conflicting Notices Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Notice A */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-xs font-bold text-brand-600 dark:text-cyan-400">
              {conflict.notice_a?.notice_id || 'Notice A'}
            </span>
            <span className="text-[10px] text-slate-400">
              v{conflict.version_a?.version_number || '1'}
            </span>
          </div>
          <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
            {conflict.version_a?.title || 'Notice Title'}
          </h5>

          <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{conflict.version_a?.exam_date ? new Date(conflict.version_a.exam_date).toLocaleString() : 'Date recorded'}</span>
            </div>
            {conflict.version_a?.venue && (
              <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Venue: {conflict.version_a.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notice B */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
              {conflict.notice_b?.notice_id || 'Notice B'}
            </span>
            <span className="text-[10px] text-slate-400">
              v{conflict.version_b?.version_number || '1'}
            </span>
          </div>
          <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
            {conflict.version_b?.title || 'Notice Title'}
          </h5>

          <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{conflict.version_b?.event_date ? new Date(conflict.version_b.event_date).toLocaleString() : 'Date recorded'}</span>
            </div>
            {conflict.version_b?.venue && (
              <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>Venue: {conflict.version_b.venue}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discrepancy Statement */}
      <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
        <span className="font-bold">Collision Root Cause: </span>
        {conflict.conflicting_fields?.nature || 'Direct resource booking or examination timing conflict.'}
      </div>

      {/* Resolution notes if resolved */}
      {conflict.resolution_notes && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200">
          <span className="font-bold">Senate Resolution Notes: </span>
          {conflict.resolution_notes}
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
            Resolved by {conflict.resolver?.full_name || 'Dean Academics'} on {conflict.resolved_at ? new Date(conflict.resolved_at).toLocaleDateString() : 'Recorded'}
          </div>
        </div>
      )}

      {/* Resolution Modal */}
      {showModal && (
        <ConflictResolutionModal
          conflict={conflict}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            onResolved?.();
          }}
        />
      )}
    </div>
  );
};
