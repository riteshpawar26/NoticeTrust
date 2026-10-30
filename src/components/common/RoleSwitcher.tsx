import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Shield, UserCheck, BookOpen, Crown, ChevronDown, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, role, switchDemoRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const rolesList: { role: UserRole; name: string; title: string; icon: any; color: string }[] = [
    {
      role: 'student',
      name: 'Priya Sharma',
      title: 'Student (CSE Sem 6)',
      icon: BookOpen,
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50'
    },
    {
      role: 'publisher',
      name: 'Dr. Aris Thorne',
      title: 'Authorized Publisher (Exam Cell)',
      icon: UserCheck,
      color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/50'
    },
    {
      role: 'admin',
      name: 'Prof. Neha Verma',
      title: 'Admin / Reviewer (Dean Academics)',
      icon: Shield,
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/50'
    },
    {
      role: 'super_admin',
      name: 'Dr. S. Radhakrishnan',
      title: 'Super Administrator (Directorate)',
      icon: Crown,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
    }
  ];

  const currentRoleConfig = rolesList.find(r => r.role === role) || rolesList[0];
  const IconComp = currentRoleConfig.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-xs font-medium hover:border-brand-500 transition-all shadow-sm"
        title="Quick Role Switcher for Innovation Challenge Evaluators"
      >
        <span className="flex items-center gap-1.5 text-brand-600 dark:text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3 h-3 text-brand-500 animate-pulse" />
          Demo Persona:
        </span>
        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
          <IconComp className="w-3.5 h-3.5 text-brand-500" />
          <span className="font-semibold">{currentRoleConfig.name}</span>
          <span className="hidden sm:inline text-slate-400">({currentRoleConfig.role})</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-2xl z-50 animate-slide-up">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Seva First Evaluator Switcher
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Instantly test any of the 4 role perspectives:
              </p>
            </div>

            <div className="space-y-1">
              {rolesList.map(item => {
                const ItemIcon = item.icon;
                const isSelected = item.role === role;

                return (
                  <button
                    key={item.role}
                    onClick={() => {
                      switchDemoRole(item.role);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/80'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md ${item.color} mt-0.5`}>
                      <ItemIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
