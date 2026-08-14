import React, { useState } from 'react';
import { Student } from '../types';
import { COUNSELORS } from '../data/mockData';

interface BulkActionModalProps {
  students: Student[];
  onClose: () => void;
  onApplyBulkAction: (actionType: string, count: number, message: string) => void;
}

export const BulkActionModal: React.FC<BulkActionModalProps> = ({
  students,
  onClose,
  onApplyBulkAction,
}) => {
  const highRiskStudents = students.filter((s) => s.riskScore >= 75);
  const medRiskStudents = students.filter((s) => s.riskScore >= 50 && s.riskScore < 75);

  const [targetGroup, setTargetGroup] = useState<'high' | 'med' | 'all'>('high');
  const [actionType, setActionType] = useState<'sms_warning' | 'assign_counselor' | 'exam_probation'>('assign_counselor');
  const [selectedCounselor, setSelectedCounselor] = useState(COUNSELORS[0].name);

  const affectedCount =
    targetGroup === 'high'
      ? highRiskStudents.length
      : targetGroup === 'med'
      ? medRiskStudents.length
      : students.length;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    const actionLabel =
      actionType === 'sms_warning'
        ? `Dispatched parent warning SMS notices to ${affectedCount} students.`
        : actionType === 'assign_counselor'
        ? `Assigned ${affectedCount} students to ${selectedCounselor}.`
        : `Applied Academic Probation status to ${affectedCount} students.`;

    onApplyBulkAction(actionType, affectedCount, actionLabel);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">checklist</span>
            <h3 className="font-bold text-base text-slate-900">
              Batch Intervention Dispatch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleExecute} className="p-5 space-y-4 text-xs">
          {/* Cohort selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-slate-700">
              Select Target Cohort
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetGroup('high')}
                className={`py-2 px-1 rounded-xl border text-center transition-all font-bold text-xs cursor-pointer ${
                  targetGroup === 'high'
                    ? 'bg-rose-50 border-rose-600 text-rose-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Critical ({highRiskStudents.length})
              </button>
              <button
                type="button"
                onClick={() => setTargetGroup('med')}
                className={`py-2 px-1 rounded-xl border text-center transition-all font-bold text-xs cursor-pointer ${
                  targetGroup === 'med'
                    ? 'bg-amber-50 border-amber-600 text-amber-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Moderate ({medRiskStudents.length})
              </button>
              <button
                type="button"
                onClick={() => setTargetGroup('all')}
                className={`py-2 px-1 rounded-xl border text-center transition-all font-bold text-xs cursor-pointer ${
                  targetGroup === 'all'
                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                All ({students.length})
              </button>
            </div>
          </div>

          {/* Action selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-slate-700">
              Action Protocol
            </label>
            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  actionType === 'assign_counselor'
                    ? 'bg-blue-50/60 border-blue-600 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="bulk_action"
                  checked={actionType === 'assign_counselor'}
                  onChange={() => setActionType('assign_counselor')}
                  className="accent-blue-600"
                />
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    Batch Assign to Counselor
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Assign selected student cohort to designated faculty advisor.
                  </p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  actionType === 'sms_warning'
                    ? 'bg-blue-50/60 border-blue-600 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="bulk_action"
                  checked={actionType === 'sms_warning'}
                  onChange={() => setActionType('sms_warning')}
                  className="accent-blue-600"
                />
                <div>
                  <p className="font-bold text-slate-900 text-xs">
                    Broadcast Parent SMS Alert
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Send automated attendance &amp; academic threshold notices.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {actionType === 'assign_counselor' && (
            <div className="space-y-1">
              <label className="font-semibold text-xs text-slate-700">
                Designated Counselor
              </label>
              <select
                value={selectedCounselor}
                onChange={(e) => setSelectedCounselor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
              >
                {COUNSELORS.map((c) => (
                  <option key={c.id} value={c.name} className="bg-white text-slate-900">
                    {c.name} ({c.dept})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Footer Actions */}
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
              Execute ({affectedCount} Students)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

