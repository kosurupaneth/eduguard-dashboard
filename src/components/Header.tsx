import React from 'react';
import { ADMIN_AVATAR } from '../data/mockData';
import { AppNotification } from '../types';

interface HeaderProps {
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  notifications,
  onOpenNotifications,
  onNavigateHome,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 fixed top-0 w-full z-40 h-16 pt-safe">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex justify-between items-center">
        {/* Left: User Avatar + App Title */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left focus:outline-none group active:scale-95 transition-transform cursor-pointer"
        >
          <div className="relative">
            <img
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
              src={ADMIN_AVATAR}
              alt="Administrator Avatar"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">
                EduGuard <span className="text-blue-600">AI</span>
              </h1>
              <span className="hidden sm:inline-block text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Early Warning System
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
              Student Retention &amp; Academic Intelligence
            </p>
          </div>
        </button>

        {/* Right: Notifications & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 border-r border-slate-200 pr-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">System Online &amp; Synced</span>
          </div>

          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all active:scale-95 p-2 rounded-lg text-slate-700 hover:text-blue-600 relative focus:outline-none cursor-pointer font-bold"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold px-1 rounded-full flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

