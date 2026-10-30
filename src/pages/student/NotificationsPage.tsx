import React, { useState } from 'react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, CheckCircle2, History, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'b5000000-0000-0000-0000-000000000005';
  const [, setTick] = useState(0);

  const notifications = db.getUserNotifications(currentUserId);

  const handleMarkAllRead = () => {
    notifications.forEach(n => db.markNotificationRead(n.id));
    setTick(t => t + 1);
  };

  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
            <Bell className="w-4 h-4" />
            <span>Time-Aware In-App Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Revision & Cancellation Alerts
          </h1>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-500 shadow-sm"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Alerts Currently
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              You will automatically receive alerts whenever exam dates, venues, or circulars are revised or cancelled.
            </p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all ${
                !n.is_read
                  ? 'border-brand-300 dark:border-brand-800/80 bg-brand-50/50 dark:bg-brand-950/40 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    n.type === 'revision'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {n.type === 'revision' ? <History className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {n.notice_id && (
                  <Link
                    to={`/notices/${n.notice_id}/verify`}
                    onClick={() => {
                      db.markNotificationRead(n.id);
                      setTick(t => t + 1);
                    }}
                    className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-sm"
                  >
                    <span>View Trust Passport</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
