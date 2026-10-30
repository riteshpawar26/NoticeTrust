import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FileText, 
  UploadCloud, 
  Bookmark, 
  Bell, 
  Flag, 
  PlusCircle, 
  CheckSquare, 
  Radio, 
  ShieldAlert, 
  Layers, 
  History, 
  Building2, 
  Users, 
  Settings, 
  Sparkles,
  LayoutDashboard,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { RoleSwitcher } from './RoleSwitcher';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();

  const studentLinks = [
    { to: '/notices', icon: FileText, label: 'Explore Notices' },
    { to: '/verify-upload', icon: UploadCloud, label: 'Verify Forwarded Notice' },
    { to: '/student/saved', icon: Bookmark, label: 'Saved Bookmarks' },
    { to: '/student/notifications', icon: Bell, label: 'Revision & Expiry Alerts' },
    { to: '/student/reports', icon: Flag, label: 'Report Discrepancy' },
  ];

  const publisherLinks = [
    { to: '/publisher/dashboard', icon: LayoutDashboard, label: 'Publisher Overview' },
    { to: '/publisher/notices', icon: Layers, label: 'My Notices & Drafts' },
    { to: '/publisher/notices/new', icon: PlusCircle, label: 'Publish New Notice' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Moderation Overview' },
    { to: '/admin/approvals', icon: CheckSquare, label: 'Pending Approvals' },
    { to: '/admin/conflicts', icon: Radio, label: 'Conflict Radar', badge: 'Active' },
    { to: '/admin/reports', icon: ShieldAlert, label: 'Student Reports' },
    { to: '/admin/notices', icon: Layers, label: 'All Notices Registry' },
    { to: '/admin/audit-logs', icon: History, label: 'Immutable Audit Trail' },
  ];

  const superAdminLinks = [
    { to: '/super-admin/institutions', icon: Building2, label: 'Institutions' },
    { to: '/super-admin/users', icon: Users, label: 'User Permissions' },
    { to: '/super-admin/settings', icon: Settings, label: 'System & Demo Reset' },
  ];

  interface SidebarLink { to: string; icon: any; label: string; badge?: string }

  const renderNavGroup = (title: string, links: SidebarLink[]) => (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </div>
      <div className="space-y-1">
        {links.map(link => {
          const IconComp = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-navy-900/95 p-4 flex flex-col justify-between overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Quick Demo Switcher on Mobile / Sidebar Top */}
          <div className="mb-4 sm:hidden">
            <RoleSwitcher />
          </div>

          {/* Current Institution Badge */}
          <div className="p-3 mb-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-cyan-400">
              Verified Institution
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
              NIET Pune Tech Campus
            </div>
            <div className="text-[10px] text-slate-400">
              Code: NIET-TECH
            </div>
          </div>

          {/* Navigation Items based on role */}
          {renderNavGroup('Public & Student View', studentLinks)}

          {(role === 'publisher' || role === 'admin' || role === 'super_admin') &&
            renderNavGroup('Publisher Operations', publisherLinks)}

          {(role === 'admin' || role === 'super_admin') &&
            renderNavGroup('Admin Moderation & Radar', adminLinks)}

          {role === 'super_admin' &&
            renderNavGroup('Super Admin Controls', superAdminLinks)}
        </div>

        {/* Footer info & Session */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Seva First 2026</span>
            <span className="font-mono text-[10px] text-brand-500">v1.0.0-rc</span>
          </div>
        </div>
      </aside>
    </>
  );
};
