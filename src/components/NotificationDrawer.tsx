import React from 'react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectNotification: (notification: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex justify-end backdrop-blur-xs">
      <div className="bg-white border-l border-slate-200 w-full max-w-sm h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">notifications</span>
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.map((notif) => {
            const isCritical = notif.type === 'critical';
            const isAlert = notif.type === 'alert';

            return (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-4 cursor-pointer transition-colors ${
                  notif.read
                    ? 'bg-white hover:bg-slate-50'
                    : 'bg-blue-50/30 hover:bg-blue-50/60 border-l-3 border-blue-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg flex-shrink-0 border ${
                      isCritical
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : isAlert
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-blue-50 border-blue-200 text-blue-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isCritical ? 'error' : isAlert ? 'warning' : 'info'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap font-medium">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No new notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

