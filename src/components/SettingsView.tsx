import React, { useState } from 'react';
import { RiskSettings } from '../types';
import { COUNSELORS } from '../data/mockData';

interface SettingsViewProps {
  settings: RiskSettings;
  onUpdateSettings: (newSettings: RiskSettings) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [currentSettings, setCurrentSettings] = useState<RiskSettings>(settings);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    onUpdateSettings(currentSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings: RiskSettings = {
      attendanceWeight: 40,
      academicWeight: 35,
      feeWeight: 15,
      engagementWeight: 10,
      highRiskThreshold: 75,
      mediumRiskThreshold: 50,
      emailAlertsEnabled: true,
      smsAlertsEnabled: true,
      autoAssignCounselor: true,
    };
    setCurrentSettings(defaultSettings);
    onUpdateSettings(defaultSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-5 pb-24 md:pb-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">System Settings</span>
        <h2 className="text-xl font-bold text-slate-900">
          Risk Engine Configuration &amp; Rules
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure multi-factor risk weights, alert escalation rules, and notification rosters.
        </p>
      </div>

      {/* Interface Theme / Appearance */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg border border-blue-100">
            <span className="material-symbols-outlined text-[22px]">
              palette
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Application Theme</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Light workspace interface with accessible high-contrast slate aesthetics.
            </p>
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          {isDarkMode ? 'Switch to Dark' : 'Switch Theme'}
        </button>
      </section>

      {/* AI Risk Model Weighting Section */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <span className="material-symbols-outlined text-blue-600">tune</span>
            Risk Calculation Heuristic Weights
          </h3>
          <span className="text-xs text-blue-600 font-bold bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            Total: {currentSettings.attendanceWeight + currentSettings.academicWeight + currentSettings.feeWeight + currentSettings.engagementWeight}%
          </span>
        </div>

        <div className="space-y-4 text-xs">
          {/* Attendance Weight */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-semibold text-slate-700">Attendance Deficit Coefficient</span>
              <span className="font-bold text-blue-600">{currentSettings.attendanceWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={currentSettings.attendanceWeight}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, attendanceWeight: Number(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>

          {/* Academic Weight */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-semibold text-slate-700">Midterm &amp; Academic Scores</span>
              <span className="font-bold text-blue-600">{currentSettings.academicWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={currentSettings.academicWeight}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, academicWeight: Number(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>

          {/* Fee Weight */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-semibold text-slate-700">Bursar &amp; Financial Overdue</span>
              <span className="font-bold text-blue-600">{currentSettings.feeWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={currentSettings.feeWeight}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, feeWeight: Number(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>

          {/* Engagement Weight */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="font-semibold text-slate-700">LMS &amp; Portal Activity</span>
              <span className="font-bold text-blue-600">{currentSettings.engagementWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={currentSettings.engagementWeight}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, engagementWeight: Number(e.target.value) })
              }
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Escalation & Automation Rules */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-blue-600">notifications_active</span>
          Automated Escalation Protocols
        </h3>

        <div className="space-y-3 text-xs divide-y divide-slate-100">
          <label className="flex items-center justify-between pt-2 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Auto-Assign Counselor on Critical Anomalies</p>
              <p className="text-slate-500 text-xs mt-0.5">Directly routes critical risk alerts to departmental faculty advisors.</p>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.autoAssignCounselor}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, autoAssignCounselor: e.target.checked })
              }
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between pt-3 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Parent SMS Escalation on Midterm Deficit</p>
              <p className="text-slate-500 text-xs mt-0.5">Sends instant SMS notification to guardians when ≥ 2 subjects are failed.</p>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.smsAlertsEnabled}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, smsAlertsEnabled: e.target.checked })
              }
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between pt-3 cursor-pointer">
            <div>
              <p className="font-semibold text-slate-800 text-sm">Weekly Executive Dean Risk Digest</p>
              <p className="text-slate-500 text-xs mt-0.5">Dispatches summary reports to Deans every Monday 08:00 UTC.</p>
            </div>
            <input
              type="checkbox"
              checked={currentSettings.emailAlertsEnabled}
              onChange={(e) =>
                setCurrentSettings({ ...currentSettings, emailAlertsEnabled: e.target.checked })
              }
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* Counselor Roster Overview */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-blue-600">badge</span>
          Active Counselor Roster
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {COUNSELORS.map((c) => (
            <div
              key={c.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{c.dept}</p>
              </div>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold text-xs">
                {c.activeCases} Cases
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Save / Reset buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleReset}
          className="flex-1 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer active:scale-95 shadow-xs"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
        >
          Save Configuration
        </button>
      </div>

      {/* Toast */}
      {saveToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl z-50 animate-bounce">
          Configuration saved and applied successfully.
        </div>
      )}
    </div>
  );
};
