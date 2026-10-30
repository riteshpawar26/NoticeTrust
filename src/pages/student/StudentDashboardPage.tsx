import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/db';
import { 
  BookOpen, 
  Clock, 
  Bookmark, 
  Bell, 
  History, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight,
  Calendar,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { NoticeCard } from '../../components/notices/NoticeCard';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || 'b5000000-0000-0000-0000-000000000005';

  // Personal relevant notices (CS & Sem 6 or All)
  const userDept = user?.department || 'Computer Science & Engineering';
  const userSem = user?.semester || 'Semester 6';

  const { notices: deptNotices } = db.getNotices({
    department: userDept,
    semester: userSem
  }, currentUserId);

  const savedNotices = db.getSavedNotices(currentUserId);
  const notifications = db.getUserNotifications(currentUserId);
  const unreadNotifs = notifications.filter(n => !n.is_read);

  // Upcoming deadlines
  const upcomingDeadlines = deptNotices
    .filter(n => n.current_version?.deadline || n.current_version?.exam_date)
    .slice(0, 3);

  return (
    <div className="space-y-8 py-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 text-white shadow-xl relative overflow-hidden">
        <div className="relative max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Information Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name || 'Priya Sharma'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Your personalized campus feed for <strong className="font-semibold text-white">{userDept}</strong> ({userSem}). All notices are verified with authoritative Senate approval records.
          </p>
        </div>
      </div>

      {/* Revision Alerts Banner (Personal Notice Impact) */}
      {unreadNotifs.length > 0 && (
        <div className="p-5 rounded-2xl border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Personal Notice Impact: {unreadNotifs.length} Critical Update(s) in Your Department</span>
          </div>

          <div className="space-y-2">
            {unreadNotifs.map(notif => (
              <div
                key={notif.id}
                className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {notif.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">
                    {notif.message}
                  </p>
                </div>
                {notif.notice_id && (
                  <Link
                    to={`/notices/${notif.notice_id}/verify`}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                  >
                    <span>Inspect Revision Diff</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Exam & Deadlines Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-500" />
              Relevant Department Notices ({userSem})
            </h2>
            <Link to="/notices" className="text-xs font-bold text-brand-600 dark:text-cyan-400 hover:underline">
              View All Feed
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deptNotices.slice(0, 4).map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Upcoming Dates & Saved */}
        <div className="space-y-6">
          {/* Upcoming Schedule Card */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-500" />
              Upcoming Academic Dates
            </h3>

            <div className="space-y-3">
              {upcomingDeadlines.map(notice => {
                const cur = notice.current_version;
                const dateVal = cur?.exam_date || cur?.deadline || cur?.event_date;

                return (
                  <div key={notice.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-mono text-[10px] text-brand-600 dark:text-cyan-400 font-bold block mb-1">
                      {notice.notice_id}
                    </span>
                    <Link to={`/notices/${notice.notice_id}`} className="font-bold text-slate-900 dark:text-white hover:underline line-clamp-1">
                      {cur?.title}
                    </Link>
                    <div className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateVal ? new Date(dateVal).toLocaleDateString() : 'Scheduled'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookmarks Quick Link */}
          <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-500" />
                Saved Notices ({savedNotices.length})
              </h3>
              <Link to="/student/saved" className="text-xs text-brand-600 dark:text-cyan-400 font-semibold hover:underline">
                View All
              </Link>
            </div>

            {savedNotices.length === 0 ? (
              <p className="text-xs text-slate-400">No saved notices yet.</p>
            ) : (
              <div className="space-y-2">
                {savedNotices.slice(0, 2).map(n => (
                  <Link
                    key={n.id}
                    to={`/notices/${n.notice_id}`}
                    className="block p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium truncate"
                  >
                    {n.current_version?.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
