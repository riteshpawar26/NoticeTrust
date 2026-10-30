import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  UploadCloud, 
  Radio, 
  History, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Lock,
  Layers,
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import { db } from '../../lib/db';
import { NoticeCard } from '../../components/notices/NoticeCard';
import { StatusBadge } from '../../components/common/StatusBadge';

export const HomePage: React.FC = () => {
  const { notices } = db.getNotices({ pageSize: 3 });
  const metrics = db.getDashboardMetrics();

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 p-8 sm:p-14 shadow-2xl">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/15 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Innovation Challenge Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-cyan-500/10 border border-brand-500/20 dark:border-cyan-500/20 text-brand-700 dark:text-cyan-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
            <span>Seva First Innovation Challenge 2026</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.15]">
            Verified & Time-Aware <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Local Information System
            </span>
          </h1>

          {/* Core Philosophy Quote */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            "A student should be able to identify the latest authorized notice and understand whether it is current, expired, cancelled, or replaced—<strong className="text-slate-900 dark:text-white font-semibold">without relying on a forwarded WhatsApp screenshot.</strong>"
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/notices"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all group"
            >
              <span>Explore Verified Notices</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/verify-upload"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-navy-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm transition-all"
            >
              <UploadCloud className="w-4 h-4 text-brand-500" />
              <span>Verify Screenshot / PDF</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 dark:border-slate-800 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">{metrics.totalPublished}</div>
              <div className="text-xs text-slate-500">Verified Notices</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-brand-600 dark:text-cyan-400">100%</div>
              <div className="text-xs text-slate-500">SHA-256 Hash Matching</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-amber-500">{metrics.openConflicts}</div>
              <div className="text-xs text-slate-500">Radar Conflicts Intercepted</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-500">{metrics.totalRevisions}</div>
              <div className="text-xs text-slate-500">Version Changes Tracked</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE INNOVATION PILLARS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-cyan-400">
            Institutional Trust Architecture
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Built to Eliminate Information Chaos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Notice Trust Passport
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every circular receives a permanent canonical Notice ID, verifiable QR code, approval audit record, and SHA-256 attachment fingerprint.
            </p>
            <Link
              to="/notices/NT-2026-EXAM-0101/verify"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-cyan-400 hover:underline"
            >
              Inspect Sample Passport <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Smart Revision Impact Detector
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deterministic comparison detects rescheduled exam dates, venue shifts, and deadlines side-by-side with automated change summaries.
            </p>
            <Link
              to="/notices/NT-2026-EXAM-0101/history"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              View Side-by-Side Diff <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Cross-Notice Conflict Radar
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated scanning intercepts conflicting notices, exam overlaps, and venue collisions before they disrupt campus operations.
            </p>
            <Link
              to="/admin/conflicts"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Open Conflict Radar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Forwarded Notice Authenticity
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Students upload suspicious WhatsApp PDFs or screenshots to verify against institutional records, identifying outdated or altered versions.
            </p>
            <Link
              to="/verify-upload"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-cyan-400 hover:underline"
            >
              Test Authenticity Checker <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SAMPLE VERIFIED NOTICES SHOWCASE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Latest Published Notices
            </h2>
            <p className="text-xs text-slate-500">
              Live updates directly from National Institute of Engineering & Technology
            </p>
          </div>

          <Link
            to="/notices"
            className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            View All Notices <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map(notice => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS / EVALUATION WALKTHROUGH CALLOUT */}
      <section className="p-8 rounded-3xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-r from-brand-50/50 via-white to-cyan-50/50 dark:from-brand-950/40 dark:via-navy-900 dark:to-cyan-950/40 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500 text-white text-[11px] font-bold">
            <Sparkles className="w-3 h-3" />
            Evaluator Demonstration Scenario
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How to Experience the NoticeTrust Complete Lifecycle:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <li>
              Use the top-right <strong className="text-brand-600 dark:text-cyan-400 font-bold">Demo Persona Switcher</strong> to switch between Student, Publisher, and Admin.
            </li>
            <li>
              Inspect notice <strong className="text-slate-900 dark:text-white font-mono">NT-2026-EXAM-0101</strong>: see how Version 1 was superseded by Revision 2, shifting the exam from Nov 10 to Nov 15.
            </li>
            <li>
              Open <Link to="/admin/conflicts" className="text-brand-600 dark:text-cyan-400 font-bold hover:underline">Conflict Radar</Link> to resolve a critical venue collision between the Theory Exam and Lab Viva.
            </li>
            <li>
              Visit <Link to="/verify-upload" className="text-brand-600 dark:text-cyan-400 font-bold hover:underline">Verify Upload</Link> to test file authenticity checking with real client-side hashing and text matching!
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
};
