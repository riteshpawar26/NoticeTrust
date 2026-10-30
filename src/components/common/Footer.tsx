import React from 'react';
import { ShieldCheck, Heart, ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand statement */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">
              NoticeTrust
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Verified & Time-Aware Local Information System. Built for the <strong className="text-brand-600 dark:text-cyan-400 font-semibold">Seva First Innovation Challenge 2026</strong>. Solving the epidemic of unverified WhatsApp forwarded notices, schedule conflicts, and altered screenshots.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span>Powered by cryptographic SHA-256 passports & version timelines.</span>
          </div>
        </div>

        {/* Core Innovation Modules */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            Innovation Modules
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>
              <Link to="/notices/NT-2026-EXAM-0101/verify" className="hover:text-brand-500 transition-colors">
                Notice Trust Passport
              </Link>
            </li>
            <li>
              <Link to="/notices/NT-2026-EXAM-0101/history" className="hover:text-brand-500 transition-colors">
                Revision Impact Detector
              </Link>
            </li>
            <li>
              <Link to="/admin/conflicts" className="hover:text-brand-500 transition-colors">
                Cross-Notice Conflict Radar
              </Link>
            </li>
            <li>
              <Link to="/verify-upload" className="hover:text-brand-500 transition-colors">
                PDF & Screenshot Authenticity Checker
              </Link>
            </li>
          </ul>
        </div>

        {/* Roles & Standards */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            System & Compliance
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>PostgreSQL Row Level Security (RLS)</li>
            <li>Immutable Version History</li>
            <li>Separation of Publishing & Approval Duties</li>
            <li>Client-Side Web Crypto SHA-256</li>
            <li>Accessible WCAG 2.1 Color Contrast</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div>
          &copy; 2026 NoticeTrust. Built with pride for Seva First Innovation Challenge.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/notices" className="hover:underline">Public Registry</Link>
          <Link to="/verify-upload" className="hover:underline">Verification Desk</Link>
          <Link to="/login" className="hover:underline">Institutional Login</Link>
        </div>
      </div>
    </footer>
  );
};
