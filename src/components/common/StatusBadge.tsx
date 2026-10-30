import React from 'react';
import { ShieldCheck, Clock, AlertOctagon, Hourglass, GitCommit, FileClock, XCircle } from 'lucide-react';
import { NoticeStatus, VersionReviewStatus } from '../../types';

interface StatusBadgeProps {
  status: NoticeStatus | VersionReviewStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const normalized = status.toLowerCase();

  const configs: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    active: {
      label: 'Verified & Active',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      icon: ShieldCheck
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      icon: ShieldCheck
    },
    upcoming: {
      label: 'Upcoming Scheduled',
      bg: 'bg-sky-50 dark:bg-sky-950/60',
      text: 'text-sky-700 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-800/80',
      icon: Clock
    },
    superseded: {
      label: 'Superseded (Older Version)',
      bg: 'bg-slate-100 dark:bg-slate-800/70',
      text: 'text-slate-700 dark:text-slate-400',
      border: 'border-slate-300 dark:border-slate-700',
      icon: GitCommit
    },
    cancelled: {
      label: 'Officially Cancelled',
      bg: 'bg-rose-50 dark:bg-rose-950/70',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/80',
      icon: AlertOctagon
    },
    expired: {
      label: 'Expired',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/80',
      icon: Hourglass
    },
    pending_review: {
      label: 'Pending Review',
      bg: 'bg-violet-50 dark:bg-violet-950/60',
      text: 'text-violet-700 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-800/80',
      icon: FileClock
    },
    pending: {
      label: 'Pending Review',
      bg: 'bg-violet-50 dark:bg-violet-950/60',
      text: 'text-violet-700 dark:text-violet-400',
      border: 'border-violet-200 dark:border-violet-800/80',
      icon: FileClock
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-800/80',
      icon: XCircle
    },
    draft: {
      label: 'Draft',
      bg: 'bg-slate-100 dark:bg-slate-800/50',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      icon: Clock
    }
  };

  const config = configs[normalized] || {
    label: status.replace(/_/g, ' '),
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    icon: Clock
  };

  const IconComp = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm transition-colors ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {showIcon && <IconComp className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span className="capitalize">{config.label}</span>
    </span>
  );
};
