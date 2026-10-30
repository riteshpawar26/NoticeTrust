import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/db';
import { TrustPassportCard } from '../../components/notices/TrustPassportCard';
import { RevisionTimeline } from '../../components/notices/RevisionTimeline';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';

export const TrustPassportPage: React.FC = () => {
  const { noticeId } = useParams<{ noticeId: string }>();

  const notice = noticeId 
    ? (db.getNoticeByNoticeId(noticeId) || db.getNoticeById(noticeId))
    : undefined;

  if (!notice) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Trust Passport Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The specified Notice ID does not match any authenticated record.</p>
        <Link to="/notices" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Feed
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between no-print">
        <Link
          to={`/notices/${notice.notice_id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Notice Details</span>
        </Link>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 shadow-sm transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Official Passport</span>
        </button>
      </div>

      {/* Trust Passport Signature Card */}
      <TrustPassportCard notice={notice} />

      {/* Revision Timeline */}
      <div className="no-print">
        <RevisionTimeline notice={notice} />
      </div>
    </div>
  );
};
