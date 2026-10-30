import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useNotification } from '../../contexts/NotificationContext';
import { Settings, RotateCcw, Database, ShieldCheck, Download, Sparkles } from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const { showToast } = useNotification();
  const [resetting, setResetting] = useState(false);

  const handleResetDemoData = () => {
    if (!confirm('Reset NoticeTrust database to initial demonstration seed state? All newly created notices and test logs will be restored to default.')) {
      return;
    }
    setResetting(true);
    setTimeout(() => {
      db.resetToDefault();
      setResetting(false);
      showToast('success', 'Database Reset Complete', 'NoticeTrust factory demonstration seed data reloaded.');
      window.location.reload();
    }, 500);
  };

  const handleExportJson = () => {
    const store = db.getStore();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `NoticeTrust_Database_Dump_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('info', 'Database Dump Exported', 'Full JSON snapshot downloaded.');
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Settings className="w-4 h-4" />
          <span>Super Administrator Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          System Operations & State Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage operational environment, test scenarios, and reproducible seed data.
        </p>
      </div>

      {/* Database State Card */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-500">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              NoticeTrust Database Engine
            </h3>
            <p className="text-xs text-slate-500">
              Supabase PostgreSQL & Reactive Local Storage State Layer
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Configured Timezone:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Asia/Kolkata (IST)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Active Institution:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">National Institute of Engineering & Technology</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Row Level Security (RLS):</span>
            <span className="font-bold text-emerald-500">Enforced via 11 PostgreSQL Policies</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Document Cryptography:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Web Crypto API (SHA-256)</span>
          </div>
        </div>

        {/* Evaluator Reset & Export Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleExportJson}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors"
          >
            <Download className="w-4 h-4 text-brand-500" />
            <span>Export Database JSON Snapshot</span>
          </button>

          <button
            onClick={handleResetDemoData}
            disabled={resetting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo to Factory State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
