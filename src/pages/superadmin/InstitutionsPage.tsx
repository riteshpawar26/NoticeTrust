import React from 'react';
import { db } from '../../lib/db';
import { Building2, ShieldCheck, MapPin, Mail, Globe } from 'lucide-react';

export const InstitutionsPage: React.FC = () => {
  const institution = db.getInstitution();

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Building2 className="w-4 h-4" />
          <span>Multi-Tenant Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Registered Institutions
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage institutional authorization, domains, and localized timezone policies.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {institution.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {institution.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Verified Campus
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Institution Code: {institution.code}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Campus Address</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
              <span>{institution.address}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Official Domain</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <Globe className="w-4 h-4 text-brand-500 shrink-0" />
              <span>{institution.domain}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Registrar Contact</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
              <Mail className="w-4 h-4 text-brand-500 shrink-0" />
              <span>{institution.contact_email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
