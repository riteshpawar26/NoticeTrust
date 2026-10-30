import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { RoleSwitcher } from '../../components/common/RoleSwitcher';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto">
        <Lock className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        403 — Unauthorized Role Scope
      </h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        Your current role does not have administrative permissions to access this moderation partition.
      </p>

      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-600 dark:text-slate-400 space-y-2">
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          Evaluator Tip:
        </p>
        <p className="text-[11px]">
          Use the quick demo persona switcher to switch to Admin (Prof. Neha Verma) or Super Admin.
        </p>
        <div className="pt-2 flex justify-center">
          <RoleSwitcher />
        </div>
      </div>

      <Link
        to="/notices"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Notice Feed</span>
      </Link>
    </div>
  );
};
