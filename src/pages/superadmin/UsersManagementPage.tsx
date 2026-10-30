import React from 'react';
import { db } from '../../lib/db';
import { Users, Shield, BookOpen, Crown, UserCheck } from 'lucide-react';

export const UsersManagementPage: React.FC = () => {
  const profiles = db.getProfiles();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      case 'admin':
        return 'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-cyan-300';
      case 'publisher':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300';
      default:
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300';
    }
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
          <Users className="w-4 h-4" />
          <span>Access Control Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          Authorized Accounts & Roles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review institutional roles and assigned publishing scopes.
        </p>
      </div>

      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {profiles.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                    {p.full_name}
                  </td>
                  <td className="py-3.5 font-mono text-slate-500">{p.email}</td>
                  <td className="py-3.5">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getRoleBadge(p.role)}`}>
                      {p.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300">{p.department}</td>
                  <td className="py-3.5 font-mono text-slate-400">{p.phone || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
