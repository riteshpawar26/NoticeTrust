import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { scanCrossNoticeConflicts } from '../../lib/conflict-radar';
import { ConflictCard } from '../../components/radar/ConflictCard';
import { Radio, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

export const ConflictRadarPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [tick, setTick] = useState(0);
  const [scanning, setScanning] = useState(false);

  const conflicts = db.getConflicts();
  const activeConflicts = conflicts.filter(c => c.status === 'detected' || c.status === 'confirmed');
  const resolvedConflicts = conflicts.filter(c => c.status === 'resolved' || c.status === 'false_positive');

  const handleRunRadarScan = () => {
    setScanning(true);
    setTimeout(() => {
      const allNotices = db.getNotices().notices;
      const candidates = scanCrossNoticeConflicts(allNotices);
      setScanning(false);
      showToast('info', 'Radar Scan Complete', `Cross-Notice Conflict Radar analyzed active timetables and circulars.`);
      setTick(t => t + 1);
    }, 600);
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Campus Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Cross-Notice Conflict Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Proactively identifies exam date overlaps, venue booking collisions, and conflicting deadlines across institutional notices.
          </p>
        </div>

        <button
          onClick={handleRunRadarScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'Scanning Matrix...' : 'Run Radar Scan'}</span>
        </button>
      </div>

      {/* Innovation Radar Explanation Card */}
      <div className="p-5 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Deterministic Collision Rules in Operation:
        </h3>
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          The Conflict Radar scans across all approved active notices in the same institution. If two independent circulars schedule activities in the same venue on the same date, or assign overlapping examinations to the same cohort, an automatic high-severity alert is flagged for Senate resolution.
        </p>
      </div>

      {/* Active Interceptions */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Active Alerts</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
            {activeConflicts.length}
          </span>
        </h2>

        {activeConflicts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Active Conflicts Detected
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Campus schedule is clear of venue clashes and overlapping exams.
            </p>
          </div>
        ) : (
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
        )}
      </div>

      {/* Historical Resolved Conflicts */}
      {resolvedConflicts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-500">
            Resolution History & Senate Audit Trail ({resolvedConflicts.length})
          </h2>
          <div className="space-y-4">
            {resolvedConflicts.map(c => (
              <ConflictCard key={c.id} conflict={c} canModerate={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
