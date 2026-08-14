import React from 'react';
import { MainTab } from '../types';

interface BottomNavProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  unreadAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadAlertsCount,
}) => {
  const navItems: { id: MainTab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'students', label: 'Students', icon: 'group' },
    { id: 'alerts', label: 'Alerts', icon: 'warning', badge: unreadAlertsCount },
    { id: 'reports', label: 'Reports', icon: 'analytics' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200 fixed bottom-0 left-0 w-full z-40 flex justify-around items-center pt-2 pb-safe px-2 shadow-lg md:hidden">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all active:scale-95 relative ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                {item.icon}
              </span>
              {item.badge && item.badge > 0 && !isActive ? (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[11px] mt-0.5">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

