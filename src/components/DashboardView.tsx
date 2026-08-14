import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface DashboardViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onIntervene: (student: Student) => void;
  onViewAllAlerts: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  onSelectStudent,
  onIntervene,
  onViewAllAlerts,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [showDonutDetails, setShowDonutDetails] = useState<boolean>(false);

  const departments = ['All', 'CS', 'Mech', 'Commerce', 'Arts', 'IT', 'Civil'];

  // Filter students based on selected department
  const filteredStudents = useMemo(() => {
    if (selectedDept === 'All') return students;
    return students.filter((s) => s.department.toLowerCase() === selectedDept.toLowerCase());
  }, [students, selectedDept]);

  // Derived metrics based on filtered data
  const totalStudentsCount = selectedDept === 'All' ? 4250 : filteredStudents.length * 280;
  const highRiskCount = filteredStudents.filter((s) => s.riskScore >= 75).length;
  const medRiskCount = filteredStudents.filter((s) => s.riskScore >= 50 && s.riskScore < 75).length;
  const lowRiskCount = filteredStudents.filter((s) => s.riskScore < 50).length;
  const totalCount = filteredStudents.length || 1;

  const highRiskPercent = Math.round((highRiskCount / totalCount) * 100) || 15;
  const medRiskPercent = Math.round((medRiskCount / totalCount) * 100) || 35;
  const lowRiskPercent = Math.max(0, 100 - highRiskPercent - medRiskPercent) || 50;

  // Key action required students
  const actionRequiredStudents = useMemo(() => {
    return filteredStudents
      .filter((s) => s.riskScore >= 60)
      .slice(0, 4);
  }, [filteredStudents]);

  return (
    <div className="space-y-6">
      {/* Quick Filter Department Chips */}
      <section aria-label="Department Filters">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 py-1">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block pr-1">
            Faculty:
          </span>
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {dept === 'All' ? 'All Departments' : dept}
              </button>
            );
          })}
        </div>
      </section>

      {/* Summary Grid */}
      <section className="grid grid-cols-2 gap-4" aria-label="Key Performance Indicators">
        {/* Total Students */}
        <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Total Enrolled Students
              </h3>
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {totalStudentsCount.toLocaleString()}
            </p>
            <span className="text-xs text-slate-500 mt-1 block">
              {selectedDept === 'All' ? 'Across all faculties · Academic Year 2025-2026' : `Faculty of ${selectedDept} · Active Roster`}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <span className="material-symbols-outlined text-[28px]">groups</span>
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              At-Risk Index
            </h3>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl md:text-4xl font-extrabold text-rose-600 tracking-tight">
              {selectedDept === 'All' ? '12%' : `${highRiskPercent}%`}
            </p>
            <p className="text-xs text-slate-500">
              ({selectedDept === 'All' ? '510' : highRiskCount * 28} students)
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full inline-block mt-3">
            Immediate Action Required
          </span>
        </div>

        {/* Flagged Week */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Weekly New Flags
            </h3>
          </div>
          <p className="text-3xl md:text-4xl font-extrabold text-amber-600 tracking-tight mt-1">
            {selectedDept === 'All' ? '42' : Math.max(4, Math.round(highRiskCount * 3.5))}
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-rose-600">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+5 vs Previous 7 Days</span>
          </div>
        </div>

        {/* Success Rate Banner */}
        <div className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                Intervention Success Rate
              </span>
              <span className="text-[11px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                Target Met
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">78.4% Retention Rate</p>
            <p className="text-xs text-blue-100">
              Students stabilized post-counseling and academic support interventions
            </p>
          </div>
          <div className="w-14 h-14 flex-shrink-0 bg-white/10 rounded-full p-1.5 flex items-center justify-center">
            <svg className="w-full h-full gauge-svg transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20 stroke-current"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="4"
              />
              <path
                className="text-white stroke-current"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeDasharray="78, 100"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Charts Section: Risk Distribution + 6-Month Trend */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Cohort Risk Distribution
            </h2>
          </div>
          <button
            onClick={() => setShowDonutDetails(!showDonutDetails)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg focus:outline-none cursor-pointer"
            title="Toggle Details"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
          {/* Conic Donut Chart */}
          <div
            className="w-32 h-32 relative rounded-full flex-shrink-0 flex items-center justify-center border-4 border-slate-50 shadow-inner"
            style={{
              background: `conic-gradient(#ef4444 0% ${highRiskPercent}%, #f59e0b ${highRiskPercent}% ${
                highRiskPercent + medRiskPercent
              }%, #10b981 ${highRiskPercent + medRiskPercent}% 100%)`,
            }}
          >
            <div className="w-22 h-22 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-[11px] text-slate-500 font-medium">
                Active
              </span>
              <span className="text-base font-bold text-slate-900">100%</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 w-full space-y-2 text-xs">
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-700 font-medium">High Risk (Score &gt;75)</span>
              </div>
              <span className="font-bold text-rose-600">{highRiskPercent}%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-700 font-medium">Medium Risk (Score 50-74)</span>
              </div>
              <span className="font-bold text-amber-600">{medRiskPercent}%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700 font-medium">Low / Safe (Score &lt;50)</span>
              </div>
              <span className="font-bold text-emerald-600">{lowRiskPercent}%</span>
            </div>
          </div>
        </div>

        {/* 6 Months Trend Bar Chart */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                6-Month At-Risk Trajectory
              </h3>
            </div>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span> 40% Risk Reduction
            </span>
          </div>

          <div className="h-28 flex items-end justify-between gap-2 w-full pt-4">
            {[
              { month: 'May', height: '100%', label: '20%' },
              { month: 'Jun', height: '95%', label: '19%' },
              { month: 'Jul', height: '85%', label: '17%' },
              { month: 'Aug', height: '90%', label: '18%' },
              { month: 'Sep', height: '70%', label: '14%' },
              { month: 'Oct', height: '60%', label: '12%', isCurrent: true },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                <div
                  className={`w-full rounded-t-md transition-all relative ${
                    bar.isCurrent
                      ? 'bg-blue-600 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  style={{ height: bar.height }}
                >
                  {bar.isCurrent && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                      12% Current
                    </div>
                  )}
                </div>
                <span className="text-xs text-slate-500 mt-1.5 group-hover:text-slate-900 font-medium">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Required Feed (Recent Critical Alerts) */}
      <section className="space-y-4 mb-6" aria-label="Action Required Alerts">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Critical Interventions Required
            </h2>
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2 py-0.5 rounded-full font-semibold">
              {actionRequiredStudents.length} Active
            </span>
          </div>
          <button
            onClick={onViewAllAlerts}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 focus:outline-none cursor-pointer flex items-center gap-1"
          >
            View All Alerts →
          </button>
        </div>

        {/* Student Alert Cards */}
        <div className="space-y-3">
          {actionRequiredStudents.map((student) => {
            const isHigh = student.riskScore >= 75;
            const isMed = student.riskScore >= 50 && student.riskScore < 75;
            const initials = student.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <div
                key={student.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-400 transition-all cursor-pointer"
                onClick={() => onSelectStudent(student)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {student.avatarUrl ? (
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {initials}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {student.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {student.rollNo} · {student.degree} · Year {student.year}
                      </p>
                    </div>
                  </div>

                  {/* Risk Badge */}
                  {isHigh ? (
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      High Risk ({student.riskScore})
                    </span>
                  ) : isMed ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Med Risk ({student.riskScore})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Low Risk ({student.riskScore})
                    </span>
                  )}
                </div>

                {/* Primary Issue Box */}
                <div className="p-3 rounded-lg mt-3 flex items-start gap-2.5 text-xs leading-relaxed bg-slate-50 border border-slate-100 text-slate-600">
                  <span
                    className={`material-symbols-outlined text-[18px] mt-0.5 flex-shrink-0 ${
                      isHigh ? 'text-rose-500' : isMed ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  >
                    {student.primaryIssue.icon}
                  </span>
                  <p>
                    <strong className="text-slate-800 mr-1">
                      {student.primaryIssue.title}:
                    </strong>
                    {student.primaryIssue.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onIntervene(student)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">support_agent</span>
                    Log Intervention
                  </button>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    View Dossier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

