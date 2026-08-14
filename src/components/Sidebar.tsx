import React from 'react';
import { MainTab } from '../types';

interface SidebarProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  unreadAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount,
}) => {
  const navItems: { id: MainTab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'students', label: 'Students', icon: 'group' },
    { id: 'alerts', label: 'Alerts Center', icon: 'warning', badge: unreadAlertsCount },
    { id: 'reports', label: 'Reports', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-slate-200 z-30 p-4 justify-between select-none">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between px-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm">
                      {item.label}
                    </span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-rose-500 text-white font-bold text-xs px-2 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Telemetry / AI Risk Engine Widget */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              AI Prediction Model
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded-md">
              v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time scoring active across all enrolled student records.
          </p>
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/80">
            <span>Sync: Live</span>
            <span className="text-emerald-600 font-semibold">Model Status: 100%</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-0.5">
        <div className="flex justify-between items-center text-slate-700 font-medium">
          <span>EduGuard Portal</span>
          <span className="text-blue-600 font-bold">2026</span>
        </div>
        <p className="text-[11px] text-slate-400">Institutional Retention Suite</p>
      </div>
    </aside>
  );
};

