import React, { useState } from 'react';
import { SystemAlert, Student } from '../types';

interface AlertsViewProps {
  alerts: SystemAlert[];
  students: Student[];
  onSelectStudentById: (studentId: string) => void;
  onAssignCounselor: (alert: SystemAlert) => void;
  onResolveAlert: (alertId: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  students,
  onSelectStudentById,
  onAssignCounselor,
  onResolveAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'in_progress' | 'resolved'>('new');
  const [resolvedToast, setResolvedToast] = useState<string | null>(null);

  const newCount = alerts.filter((a) => a.status === 'new').length;
  const inProgressCount = alerts.filter((a) => a.status === 'in_progress').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  const currentAlerts = alerts.filter((a) => a.status === activeTab);

  const handleResolve = (alert: SystemAlert) => {
    onResolveAlert(alert.id);
    setResolvedToast(`Alert for ${alert.studentName} marked as resolved.`);
    setTimeout(() => setResolvedToast(null), 3000);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Risk Management</span>
          <h2 className="text-xl font-bold text-slate-900">
            Anomaly &amp; Early Warning Alerts
          </h2>
        </div>
        <div className="text-xs text-slate-500">
          Active Alerts: <span className="text-rose-600 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">{newCount} Unresolved</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {/* New Tab */}
        <button
          onClick={() => setActiveTab('new')}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer flex items-center gap-2 ${
            activeTab === 'new'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          New Untriaged
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'new' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {newCount}
          </span>
        </button>

        {/* In Progress Tab */}
        <button
          onClick={() => setActiveTab('in_progress')}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer flex items-center gap-2 ${
            activeTab === 'in_progress'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          In Remediation
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'in_progress' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {inProgressCount}
          </span>
        </button>

        {/* Resolved Tab */}
        <button
          onClick={() => setActiveTab('resolved')}
          className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer flex items-center gap-2 ${
            activeTab === 'resolved'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Resolved Archive
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'resolved' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* Alert Cards List */}
      <div className="flex flex-col gap-3 mt-2">
        {currentAlerts.map((alert) => {
          const isCritical = alert.riskLevel === 'CRITICAL';
          const isHigh = alert.riskLevel === 'HIGH';
          const isMed = alert.riskLevel === 'MEDIUM';

          return (
            <article
              key={alert.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 transition-all flex flex-col gap-3 shadow-sm relative overflow-hidden"
            >
              {/* Left Accent indicator */}
              <div
                className={`absolute top-0 left-0 w-1.5 h-full ${
                  isCritical ? 'bg-rose-500' : isHigh ? 'bg-rose-500' : 'bg-amber-500'
                }`}
              ></div>

              {/* Top metadata */}
              <div className="flex justify-between items-start pl-2">
                <div className="flex flex-col gap-1">
                  {/* Risk Badge */}
                  {isCritical ? (
                    <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                      Critical Anomaly
                    </span>
                  ) : isHigh ? (
                    <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                      High Risk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      Medium Risk
                    </span>
                  )}

                  <button
                    onClick={() => onSelectStudentById(alert.studentId)}
                    className="text-left font-bold text-base text-slate-900 hover:text-blue-600 transition-colors mt-0.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{alert.studentName}</span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      open_in_new
                    </span>
                  </button>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span>{alert.degree}</span>
                  </p>
                </div>

                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  {alert.timeAgo}
                </span>
              </div>

              {/* Alert Content Box */}
              <div className="bg-slate-50 rounded-r-lg p-3.5 pl-4 border-l-4 border-blue-600 ml-2">
                <p className="text-xs text-slate-900 font-bold">
                  {alert.title}
                </p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {alert.description}
                </p>
                {alert.assignedTo && (
                  <p className="text-xs text-blue-700 mt-2 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">assignment_ind</span>
                    Assigned Counselor: {alert.assignedTo}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-1 pl-2">
                {alert.status === 'new' && (
                  <button
                    onClick={() => onAssignCounselor(alert)}
                    className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-blue-600">person_add</span>
                    Assign Counselor
                  </button>
                )}

                {alert.status !== 'resolved' ? (
                  <button
                    onClick={() => handleResolve(alert)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Mark Resolved
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                    <span className="material-symbols-outlined text-[16px]">task_alt</span>
                    Anomaly Resolved &amp; Archived
                  </span>
                )}
              </div>
            </article>
          );
        })}

        {currentAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              notifications_off
            </span>
            <h4 className="text-sm font-bold text-slate-800">No Alerts in this Category</h4>
            <p className="text-xs text-slate-500 mt-1">
              All alerts in '{activeTab}' have been processed or resolved.
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {resolvedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl z-50 animate-bounce">
          {resolvedToast}
        </div>
      )}
    </div>
  );
};

