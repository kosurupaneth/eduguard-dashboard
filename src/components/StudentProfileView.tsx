import React, { useState, useEffect } from 'react';
import { Student, Intervention } from '../types';

interface StudentProfileViewProps {
  student: Student;
  onBack: () => void;
  onAddIntervention: (student: Student) => void;
  onInterventionUpdated?: (updatedInterventions: Intervention[]) => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  onBack,
  onAddIntervention,
}) => {
  const [gaugeAnimated, setGaugeAnimated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setGaugeAnimated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [student.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isHigh = student.riskScore >= 75;
  const isMed = student.riskScore >= 50 && student.riskScore < 75;

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const score = student.riskScore;
  const dashOffset = gaugeAnimated ? `${score}, 100` : '0, 100';

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      {/* Top Header Bar for Profile Detail View */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all active:scale-95 focus:outline-none flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to List</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Student Dossier</span>
          <h1 className="font-bold text-base md:text-lg text-slate-900">
            {student.name}
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            aria-label="More options"
            className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 p-1.5 rounded-lg transition-all active:scale-95 focus:outline-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-50 text-xs text-slate-700">
              <button
                onClick={() => {
                  setShowMenu(false);
                  showToast('Risk factors recalculated using latest LMS metrics.');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:text-blue-600 font-medium rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-600">refresh</span>
                Recalculate Risk
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  showToast(`Student dossier for ${student.name} exported.`);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:text-blue-600 font-medium rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-600">download</span>
                Export PDF Dossier
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  showToast('Automated SMS notification dispatched to parent.');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 hover:text-blue-600 font-medium rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-blue-600">sms</span>
                Send Parent SMS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Student Identity Card & Risk Gauge Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Student Identity Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
          <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-slate-700">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 truncate">
              {student.name}
            </h2>
            <div className="mt-1.5 space-y-1 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Roll No:</span>
                <span>{student.rollNo}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Program:</span>
                <span className="truncate">{student.degree} · Sem {student.semester}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-700">Mentor:</span>
                <span>{student.mentorName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Risk Gauge Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center relative">
          <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Risk Assessment Score</span>
            {isHigh ? (
              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                High Risk
              </span>
            ) : isMed ? (
              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Medium Risk
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                Low Risk
              </span>
            )}
          </div>

          {/* Circular Gauge */}
          <div className="relative w-28 h-28 my-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Background Track */}
              <path
                className="text-slate-100 stroke-current"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.2"
                strokeDasharray="100, 100"
              />
              {/* Value Track */}
              <path
                className={`${
                  isHigh
                    ? 'text-rose-500'
                    : isMed
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                } stroke-current transition-all duration-1000 ease-out`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="3.2"
                strokeDasharray={dashOffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Center score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-extrabold ${
                isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
              }`}>
                {student.riskScore}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Risk Factor Breakdown */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Risk Factor Breakdown
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          {/* Attendance */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="text-slate-700 font-medium">Attendance Rate ({student.attendanceRate}%)</span>
              <span className="font-semibold text-slate-900">
                {student.riskBreakdown.attendance}% Weight
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${student.riskBreakdown.attendance}%` }}
              ></div>
            </div>
          </div>

          {/* Academics */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="text-slate-700 font-medium">Academics (CGPA {student.cgpa})</span>
              <span className="font-semibold text-slate-900">
                {student.riskBreakdown.academics}% Weight
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${student.riskBreakdown.academics}%` }}
              ></div>
            </div>
          </div>

          {/* Engagement */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="text-slate-700 font-medium">LMS &amp; Assignment Engagement</span>
              <span className="font-semibold text-slate-900">
                {student.riskBreakdown.engagement}% Weight
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${student.riskBreakdown.engagement}%` }}
              ></div>
            </div>
          </div>

          {/* Fees */}
          <div>
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="text-slate-700 font-medium">
                Bursar Dues &amp; Fees {student.feeDueDays ? `(${student.feeDueDays}d overdue)` : '(Clear)'}
              </span>
              <span className="font-semibold text-slate-900">
                {student.riskBreakdown.fees}% Weight
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${student.riskBreakdown.fees}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Intervention History */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Action Timeline &amp; History
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {student.interventions.length} Logged
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {student.interventions.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {student.interventions.map((item) => (
                <li
                  key={item.id}
                  className="p-4 flex items-start space-x-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg flex-shrink-0 mt-0.5 border border-blue-100">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.type === 'counseling'
                        ? 'psychology'
                        : item.type === 'parent_contact'
                        ? 'contact_phone'
                        : item.type === 'tutoring'
                        ? 'school'
                        : item.type === 'fee_extension'
                        ? 'payments'
                        : 'assignment_turned_in'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.notes}
                    </p>
                    {item.outcome && (
                      <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg">
                        <strong>Outcome:</strong> {item.outcome}
                      </div>
                    )}
                    <span className="text-[11px] text-slate-400 mt-1.5 block">
                      Counselor: {item.counselor}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No previous interventions recorded. Click below to log a session.
            </div>
          )}
        </div>
      </section>

      {/* Primary Action Button: Add Intervention */}
      <section>
        <button
          onClick={() => onAddIntervention(student)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-sm flex items-center justify-center transition-all active:scale-[0.98] focus:outline-none cursor-pointer gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          Log New Intervention
        </button>
      </section>

      {/* Section 4: Contact Information Panel */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Student &amp; Emergency Contacts
          </h3>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Student Mobile */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg flex-shrink-0 border border-blue-100">
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-medium">Student Mobile</span>
              <a
                href={`tel:${student.contact.studentPhone.replace(/\s+/g, '')}`}
                className="font-bold text-slate-900 hover:text-blue-600"
              >
                {student.contact.studentPhone}
              </a>
            </div>
          </div>

          {/* Student Email */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg flex-shrink-0 border border-blue-100">
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-medium">University Email</span>
              <a
                href={`mailto:${student.contact.studentEmail}`}
                className="font-bold text-slate-900 hover:text-blue-600 break-all"
              >
                {student.contact.studentEmail}
              </a>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 sm:col-span-2 w-full"></div>

          {/* Parent Contact */}
          <div className="flex items-center space-x-3 sm:col-span-2">
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg flex-shrink-0 border border-blue-100">
              <span className="material-symbols-outlined text-[20px]">family_restroom</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-medium">
                Parent / Guardian ({student.contact.parentRelation}: {student.contact.parentName})
              </span>
              <a
                href={`tel:${student.contact.parentPhone.replace(/\s+/g, '')}`}
                className="font-bold text-slate-900 hover:text-blue-600"
              >
                {student.contact.parentPhone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl z-50 animate-bounce">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

