import React, { useState } from 'react';
import { SystemAlert } from '../types';
import { COUNSELORS } from '../data/mockData';

interface AssignCounselorModalProps {
  alert: SystemAlert;
  onClose: () => void;
  onConfirmAssign: (alertId: string, counselorName: string, priority: string, notes: string) => void;
}

export const AssignCounselorModal: React.FC<AssignCounselorModalProps> = ({
  alert,
  onClose,
  onConfirmAssign,
}) => {
  const [selectedCounselor, setSelectedCounselor] = useState(COUNSELORS[0].name);
  const [priority, setPriority] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('HIGH');
  const [instructions, setInstructions] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmAssign(alert.id, selectedCounselor, priority, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Case Delegation</span>
            <h3 className="font-bold text-base text-slate-900">
              Assign to Counselor
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Student: <span className="font-semibold text-slate-800">{alert.studentName}</span> ({alert.degree})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Alert summary card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="font-bold text-slate-900 text-xs">{alert.title}</p>
            <p className="text-slate-600 text-xs mt-1">{alert.description}</p>
          </div>

          {/* Counselor select */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Select Faculty Advisor / Counselor
            </label>
            <select
              value={selectedCounselor}
              onChange={(e) => setSelectedCounselor(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
            >
              {COUNSELORS.map((c) => (
                <option key={c.id} value={c.name} className="bg-white text-slate-900">
                  {c.name} ({c.dept} — {c.activeCases} active cases)
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Case Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['URGENT', 'HIGH', 'NORMAL'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                    priority === p
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Briefing notes */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Counselor Briefing Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Please coordinate with parent before Friday mid-term review."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm cursor-pointer text-xs"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

