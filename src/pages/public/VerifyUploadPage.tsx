import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Hash, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  Info,
  RefreshCw
} from 'lucide-react';
import { verifyUploadedNotice } from '../../lib/authenticity';
import { db } from '../../lib/db';
import { VerificationEvaluation } from '../../types';
import { Link } from 'react-router-dom';

export const VerifyUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [result, setResult] = useState<VerificationEvaluation | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setResult(null);

    try {
      setProcessingStep('Computing SHA-256 cryptographic hash...');
      await new Promise(r => setTimeout(r, 400));

      setProcessingStep('Extracting PDF text streams & metadata entities...');
      await new Promise(r => setTimeout(r, 450));

      setProcessingStep('Searching institutional notice registry & version timelines...');
      await new Promise(r => setTimeout(r, 400));

      const notices = db.getNotices().notices;
      const evaluation = await verifyUploadedNotice(uploadedFile, notices);
      setResult(evaluation);
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSample = (sampleType: 'outdated_v1' | 'approved_v2' | 'altered' | 'unknown') => {
    let mockContent = '';
    let mockName = '';

    if (sampleType === 'outdated_v1') {
      mockName = 'WhatsApp_Forward_CS_Exam_Nov10.pdf';
      mockContent = 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101\nSubject: Distributed Systems Theory Examination\nDate: Nov 10, 2026. Venue: Hall A';
    } else if (sampleType === 'approved_v2') {
      mockName = 'CS_Sem6_Exam_Schedule_v2_REVISED.pdf';
      mockContent = 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101 (REVISION 2)\nSubject: REVISED Distributed Systems Theory Examination\nDate: Nov 15, 2026. Venue: Auditorium Complex - Hall B';
    } else if (sampleType === 'altered') {
      mockName = 'Circulating_Tampered_Exam_Notice.pdf';
      mockContent = 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101\nSubject: Distributed Systems Theory Examination\nDate: Dec 25, 2026. Venue: Ground Floor Cafeteria';
    } else {
      mockName = 'Unrelated_Random_Doc.pdf';
      mockContent = 'Random scanned document with no institutional notice header or ID.';
    }

    const blob = new Blob([mockContent], { type: 'application/pdf' });
    const sampleFile = new File([blob], mockName, { type: 'application/pdf' });
    processFile(sampleFile);
  };

  const getVerdictStyle = (status: string) => {
    switch (status) {
      case 'exact_match_current':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
          badgeBg: 'bg-emerald-500 text-white',
          title: 'VERIFIED: Exact Match to Current Approved Notice',
          icon: CheckCircle2
        };
      case 'older_superseded_version':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200',
          badgeBg: 'bg-amber-500 text-white',
          title: 'OUTDATED: Document Matches an Older Superseded Revision',
          icon: AlertTriangle
        };
      case 'possible_mismatch':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200',
          badgeBg: 'bg-rose-500 text-white',
          title: 'ALERT: Key Metadata Diverges from Official Record',
          icon: ShieldAlert
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/30 text-slate-800 dark:text-slate-200',
          badgeBg: 'bg-slate-500 text-white',
          title: 'UNABLE TO VERIFY: No Institutional Record Found',
          icon: XCircle
        };
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-cyan-400">
          <UploadCloud className="w-4 h-4" />
          <span>Screenshot & PDF Authenticity Checker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Verify a Circulating Notice
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload any forwarded PDF, photo, or WhatsApp screenshot. NoticeTrust extracts text streams, calculates cryptographic SHA-256 hashes, and cross-references against official database versions.
        </p>
      </div>

      {/* Quick Interactive Samples Bar for Evaluators */}
      <div className="p-4 rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/30">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-cyan-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>One-Click Challenge Scenarios (Evaluator Test Files):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleSample('outdated_v1')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors text-left"
          >
            1. Outdated Forward (v1 Nov 10)
          </button>
          <button
            onClick={() => handleSample('approved_v2')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors text-left"
          >
            2. Current Active Revision (v2)
          </button>
          <button
            onClick={() => handleSample('altered')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500 transition-colors text-left"
          >
            3. Tampered Fake Date Copy
          </button>
          <button
            onClick={() => handleSample('unknown')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 transition-colors text-left"
          >
            4. Unregistered Document
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all text-center ${
          dragActive
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/50 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-900/60 hover:border-brand-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,image/png,image/jpeg,image/jpg"
          onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/60 text-brand-500 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Drop forwarded PDF or screenshot here
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Supports official PDF circulars, JPG/PNG screenshots from WhatsApp, Telegram, or camera captures.
        </p>

        <label
          htmlFor="file-upload"
          className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 cursor-pointer transition-all"
        >
          Select File from Device
        </label>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm text-center space-y-3 animate-fade-in">
          <RefreshCw className="w-6 h-6 text-brand-500 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {processingStep}
          </p>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {(() => {
            const style = getVerdictStyle(result.status);
            const IconComponent = style.icon;

            return (
              <div className={`p-6 sm:p-8 rounded-3xl border ${style.bg} space-y-5 shadow-lg`}>
                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-current/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-black/30 shrink-0">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badgeBg}`}>
                        Confidence: {result.confidence}%
                      </span>
                      <h3 className="text-lg font-extrabold mt-0.5 leading-snug">
                        {style.title}
                      </h3>
                    </div>
                  </div>

                  {result.matchedNotice && (
                    <Link
                      to={`/notices/${result.matchedNotice.notice_id}/verify`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-navy-900 text-xs font-bold text-slate-900 dark:text-white border shadow-sm hover:scale-105 transition-all"
                    >
                      <span>Open Trust Passport</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Explanation text */}
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {result.explanation}
                </p>

                {/* Detected Differences List */}
                {result.differences.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-current/10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Detected Forensic Differences:
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {result.differences.map((diff, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 shrink-0" />
                          <span>{diff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cryptographic Hash Details */}
                <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-black/20 border border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-mono truncate">
                    <Hash className="w-4 h-4 shrink-0" />
                    <span className="truncate">File SHA-256: {result.fileHash}</span>
                  </div>
                  <span className="font-bold text-[11px] shrink-0">
                    {result.exactHashMatch ? '✓ Exact Hash Match' : '≠ Divergent Re-encoded Hash'}
                  </span>
                </div>

                {/* Matched Notice Overview */}
                {result.matchedNotice && (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div>
                      <span>Official Registry Pointer: </span>
                      <strong className="font-mono">{result.matchedNotice.notice_id}</strong>
                      <span> • {result.matchedNotice.current_version?.title}</span>
                    </div>
                    <Link
                      to={`/notices/${result.matchedNotice.notice_id}`}
                      className="font-bold hover:underline flex items-center gap-1"
                    >
                      View Notice <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
