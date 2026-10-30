import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ShieldCheck, Sparkles, BookOpen, UserCheck, Shield, Crown, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    await login(email);
    showToast('success', 'Authenticated', `Welcome to NoticeTrust!`);
    navigate('/notices');
  };

  const handleQuickDemo = (role: UserRole) => {
    switchDemoRole(role);
    showToast('success', 'Logged in as Demo Persona', `Active role: ${role}`);
    switch (role) {
      case 'student': navigate('/student/dashboard'); break;
      case 'publisher': navigate('/publisher/dashboard'); break;
      case 'admin': navigate('/admin/dashboard'); break;
      case 'super_admin': navigate('/super-admin/institutions'); break;
    }
  };

  return (
    <div className="py-12 px-4 max-w-md mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/25">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sign In to NoticeTrust
        </h1>
        <p className="text-xs text-slate-500">
          Access verified campus circulars, revision timelines, and moderation tools.
        </p>
      </div>

      {/* Quick 1-Click Evaluator Buttons */}
      <div className="p-5 rounded-3xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/40 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-cyan-400">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>One-Click Evaluator Personas:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickDemo('student')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-left hover:border-brand-500 transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Priya Sharma</div>
              <div className="text-[10px] text-slate-500">Student (CSE)</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemo('publisher')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-left hover:border-brand-500 transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-violet-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Aris Thorne</div>
              <div className="text-[10px] text-slate-500">Exam Controller</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemo('admin')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-left hover:border-brand-500 transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-brand-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Prof. Neha Verma</div>
              <div className="text-[10px] text-slate-500">Dean Academics</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickDemo('super_admin')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 text-left hover:border-brand-500 transition-all flex items-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Dr. Radhakrishnan</div>
              <div className="text-[10px] text-slate-500">Super Administrator</div>
            </div>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleCustomLogin} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Institutional Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="e.g. priya.sharma@noticetrust.edu"
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20"
        >
          Sign In with Email
        </button>

        <div className="text-center pt-2">
          <Link to="/register" className="text-xs text-brand-600 dark:text-cyan-400 hover:underline">
            Don't have an account? Register as Student
          </Link>
        </div>
      </form>
    </div>
  );
};
