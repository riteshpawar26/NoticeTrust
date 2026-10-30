import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="w-14 h-14 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
        404 — Record Not Found
      </h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        The requested URL or Notice ID does not exist in the institutional registry or has been archived.
      </p>
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
