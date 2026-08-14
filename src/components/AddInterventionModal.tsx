import React, { useState } from 'react';
import { Student, Intervention } from '../types';
import { COUNSELORS } from '../data/mockData';

interface AddInterventionModalProps {
  student: Student;
  onClose: () => void;
  onSaveIntervention: (studentId: string, intervention: Intervention, reduceRiskScore?: number) => void;
}

export const AddInterventionModal: React.FC<AddInterventionModalProps> = ({
  student,
  onClose,
  onSaveIntervention,
}) => {
  const [type, setType] = useState<Intervention['type']>('counseling');
  const [title, setTitle] = useState('1-on-1 Academic Counseling');
  const [counselor, setCounselor] = useState(COUNSELORS[0].name);
  const [notes, setNotes] = useState('');
  const [outcome, setOutcome] = useState('');
  const [remedialActionPlan, setRemedialActionPlan] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIntervention: Intervention = {
      id: `int-${Date.now()}`,
      studentId: student.id,
      type,
      title: title.trim() || 'Intervention Session',
      notes: notes.trim() || 'Counseling notes recorded. Follow-up scheduled in 14 days.',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      counselor,
      status: 'completed',
      outcome: outcome.trim() || (remedialActionPlan ? 'Remedial milestones established with mentor.' : undefined),
    };

    // Calculate a positive reduction in risk score (e.g. 5-10 points reduction)
    const riskReduction = remedialActionPlan ? Math.min(12, Math.round(student.riskScore * 0.15)) : 5;
    onSaveIntervention(student.id, newIntervention, riskReduction);
    onClose();
  };

  const interventionTypes: { id: Intervention['type']; label: string; icon: string; defaultTitle: string }[] = [
    { id: 'counseling', label: 'Counseling', icon: 'psychology', defaultTitle: '1-on-1 Academic Counseling' },
    { id: 'parent_contact', label: 'Parent Contact', icon: 'contact_phone', defaultTitle: 'Parent Warning Notice & Call' },
    { id: 'tutoring', label: 'Peer Tutoring', icon: 'school', defaultTitle: 'Department Peer Tutor Assigned' },
    { id: 'fee_extension', label: 'Fee Support', icon: 'payments', defaultTitle: 'Bursar Installment Plan' },
    { id: 'medical_leave', label: 'Medical Leave', icon: 'medical_services', defaultTitle: 'Medical Exemption Verification' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Intervention Action</span>
            <h3 className="font-bold text-base text-slate-900">
              Log Intervention Session
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Student: <span className="font-semibold text-slate-800">{student.name}</span> ({student.rollNo})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Type Selector Chips */}
          <div className="space-y-1.5">
            <label className="font-semibold text-xs text-slate-700">
              Intervention Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {interventionTypes.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    setType(t.id);
                    setTitle(t.defaultTitle);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer text-xs font-semibold ${
                    type === t.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${type === t.id ? 'text-blue-600' : 'text-slate-500'}`}>
                    {t.icon}
                  </span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Session Title / Protocol
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
            />
          </div>

          {/* Counselor Selection */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Assigned Counselor / Mentor
            </label>
            <select
              value={counselor}
              onChange={(e) => setCounselor(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
            >
              {COUNSELORS.map((c) => (
                <option key={c.id} value={c.name} className="bg-white text-slate-900">
                  {c.name} — {c.dept}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Counseling Notes &amp; Observations
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record diagnostic observations, attendance hurdles, academic interventions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs resize-none"
            />
          </div>

          {/* Outcome / Agreed Steps */}
          <div className="space-y-1">
            <label className="font-semibold text-xs text-slate-700">
              Agreed Outcome &amp; Milestones
            </label>
            <input
              type="text"
              placeholder="e.g. Student committed to 85%+ attendance in CS301 starting Monday."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs"
            />
          </div>

          {/* Recalculate Risk Option */}
          <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={remedialActionPlan}
              onChange={(e) => setRemedialActionPlan(e.target.checked)}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
            <span className="text-slate-700 text-xs font-medium">
              Apply immediate remedial risk score mitigation (-10 pts)
            </span>
          </label>

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
              Save Intervention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

