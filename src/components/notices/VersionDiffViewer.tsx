import React from 'react';
import { NoticeVersion } from '../../types';
import { compareNoticeVersions, VersionComparisonResult } from '../../lib/revision-diff';
import { AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface VersionDiffViewerProps {
  oldVersion: NoticeVersion;
  newVersion: NoticeVersion;
}

export const VersionDiffViewer: React.FC<VersionDiffViewerProps> = ({ oldVersion, newVersion }) => {
  const comparison: VersionComparisonResult = compareNoticeVersions(oldVersion, newVersion);

  return (
    <div className="space-y-6">
      {/* Top Impact Banner */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        comparison.criticalChangesCount > 0
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : 'bg-brand-500/10 border-brand-500/30 text-brand-900 dark:text-brand-200'
      }`}>
        <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold flex items-center gap-2">
            Smart Revision Impact Detector:
            <span>
              {comparison.criticalChangesCount > 0 
                ? `${comparison.criticalChangesCount} Critical Schedule/Venue Shifts Detected` 
                : 'Minor Content Adjustments Detected'}
            </span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Deterministic comparison between <strong className="text-slate-900 dark:text-white">Version {oldVersion.version_number}</strong> and <strong className="text-slate-900 dark:text-white">Version {newVersion.version_number}</strong>.
          </p>
        </div>
      </div>

      {/* Summary Bullet List */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Automated Change Summary (Authoritative)
        </h4>
        <ul className="space-y-2">
          {comparison.summaryItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          <span>Metadata Entity</span>
          <div className="flex items-center gap-8 pr-4">
            <span className="text-rose-600 dark:text-rose-400">Previous (v{oldVersion.version_number})</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-emerald-600 dark:text-emerald-400">Revised (v{newVersion.version_number})</span>
          </div>
        </div>

        <div className="space-y-3">
          {comparison.diffs.map((diff, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all ${
                diff.isCritical
                  ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {diff.fieldLabel}
                  </span>
                  {diff.isCritical && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white">
                      CRITICAL SHIFT
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Old Value */}
                <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block mb-1">
                    Previous Value (v{oldVersion.version_number})
                  </span>
                  <div className="text-xs text-rose-900 dark:text-rose-200 line-through font-medium">
                    {diff.oldValue || 'None'}
                  </div>
                </div>

                {/* New Value */}
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 block mb-1">
                    Revised Authorized Value (v{newVersion.version_number})
                  </span>
                  <div className="text-xs text-emerald-900 dark:text-emerald-200 font-bold">
                    {diff.newValue || 'None'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
