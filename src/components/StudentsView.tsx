import React, { useState, useMemo } from 'react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onBulkAction?: () => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSelectStudent,
  onBulkAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string | null>(null);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string | null>(null);
  const [selectedYearFilter, setSelectedYearFilter] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Quick filter presets
  const filterChips = [
    { id: 'all_filters', label: 'ALL FILTERS', icon: 'tune', action: () => setShowFilterModal(true) },
    {
      id: 'high_risk',
      label: 'HIGH RISK',
      active: selectedRiskFilter === 'HIGH',
      action: () => setSelectedRiskFilter(selectedRiskFilter === 'HIGH' ? null : 'HIGH'),
    },
    {
      id: 'med_risk',
      label: 'MED RISK',
      active: selectedRiskFilter === 'MEDIUM',
      action: () => setSelectedRiskFilter(selectedRiskFilter === 'MEDIUM' ? null : 'MEDIUM'),
    },
    {
      id: 'dept_it',
      label: 'DEPT: IT',
      active: selectedDeptFilter === 'IT',
      action: () => setSelectedDeptFilter(selectedDeptFilter === 'IT' ? null : 'IT'),
    },
    {
      id: 'dept_cs',
      label: 'DEPT: CS',
      active: selectedDeptFilter === 'CS',
      action: () => setSelectedDeptFilter(selectedDeptFilter === 'CS' ? null : 'CS'),
    },
    {
      id: 'dept_mech',
      label: 'DEPT: MECH',
      active: selectedDeptFilter === 'Mech',
      action: () => setSelectedDeptFilter(selectedDeptFilter === 'Mech' ? null : 'Mech'),
    },
    {
      id: 'year_3',
      label: 'YEAR: 3RD',
      active: selectedYearFilter === 3,
      action: () => setSelectedYearFilter(selectedYearFilter === 3 ? null : 3),
    },
    {
      id: 'year_2',
      label: 'YEAR: 2ND',
      active: selectedYearFilter === 2,
      action: () => setSelectedYearFilter(selectedYearFilter === 2 ? null : 2),
    },
  ];

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesRoll = s.rollNo.toLowerCase().includes(q);
        const matchesDept = s.department.toLowerCase().includes(q);
        const matchesDegree = s.degree.toLowerCase().includes(q);
        const matchesTags = s.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesRoll && !matchesDept && !matchesDegree && !matchesTags) {
          return false;
        }
      }

      if (selectedRiskFilter && s.riskLevel !== selectedRiskFilter) {
        return false;
      }

      if (selectedDeptFilter && s.department.toLowerCase() !== selectedDeptFilter.toLowerCase()) {
        return false;
      }

      if (selectedYearFilter && s.year !== selectedYearFilter) {
        return false;
      }

      return true;
    });
  }, [students, searchQuery, selectedRiskFilter, selectedDeptFilter, selectedYearFilter]);

  const visibleStudents = filteredStudents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStudents.length;

  return (
    <div className="space-y-4">
      {/* Sticky Search and Filter Bar */}
      <div className="sticky top-16 bg-slate-50/95 backdrop-blur-md pt-2 pb-2 z-30 space-y-2 border-b border-slate-200">
        {/* Search input */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll ID, department, or keyword..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-xs md:text-sm text-slate-900 shadow-sm placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips carousel */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {filterChips.map((chip) => {
            const isAllFilters = chip.id === 'all_filters';
            const isActive = chip.active;
            const isHighRisk = chip.id === 'high_risk';

            return (
              <button
                key={chip.id}
                onClick={chip.action}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isAllFilters
                    ? 'bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 font-semibold'
                    : isHighRisk && isActive
                    ? 'bg-rose-600 text-white font-semibold shadow-xs'
                    : isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {chip.icon && (
                  <span className="material-symbols-outlined text-[16px]">{chip.icon}</span>
                )}
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-900">{visibleStudents.length}</strong> of{' '}
          <strong className="text-blue-600">{filteredStudents.length}</strong> students
        </span>
        {(selectedRiskFilter || selectedDeptFilter || selectedYearFilter || searchQuery) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRiskFilter(null);
              setSelectedDeptFilter(null);
              setSelectedYearFilter(null);
            }}
            className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Student List Cards */}
      <div className="flex flex-col gap-3">
        {visibleStudents.map((student) => {
          const isHigh = student.riskScore >= 75;
          const isMed = student.riskScore >= 50 && student.riskScore < 75;
          const isLow = student.riskScore < 50;
          const leftBarColor = isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500';
          const scoreTextColor = isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600';
          const initials = student.name
            .split(' ')
            .map((n) => n[0])
            .join('');

          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:border-blue-400 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
            >
              {/* Left Indicator Color Strip */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${leftBarColor}`}></div>

              {/* Top Row: Avatar, Name/ID, Score */}
              <div className="flex justify-between items-start pl-2">
                <div className="flex items-center gap-3">
                  {student.avatarUrl ? (
                    <img
                      src={student.avatarUrl}
                      alt={student.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                      {initials}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {student.rollNo} · {student.degree} · Year {student.year}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`text-xl font-extrabold ${scoreTextColor}`}>
                    {student.riskScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
                </div>
              </div>

              {/* Bottom Tag Chips */}
              <div className="pl-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 items-center">
                {isHigh && (
                  <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> High Risk
                  </span>
                )}
                {isMed && (
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Medium Risk
                  </span>
                )}
                {isLow && (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Low Risk
                  </span>
                )}

                {/* Specific reason tags */}
                {student.attendanceRate < 60 && (
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-rose-500">calendar_today</span> Low Attendance ({student.attendanceRate}%)
                  </span>
                )}
                {student.cgpa < 6.0 && (
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-amber-500">trending_down</span> CGPA {student.cgpa}
                  </span>
                )}
                {student.feeDueDays && student.feeDueDays > 0 ? (
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-rose-500">payments</span> Fees Due {student.feeDueDays}d
                  </span>
                ) : null}
                {student.primaryIssue.category === 'health' && (
                  <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-md text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-blue-500">medical_services</span> Medical Leave
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {visibleStudents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">
              person_search
            </span>
            <h4 className="text-sm font-bold text-slate-800">No Matching Students Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Adjust search keywords or filter criteria to expand your search.
            </p>
          </div>
        )}
      </div>

      {/* Load More Students Button */}
      {hasMore && (
        <div className="py-4 flex justify-center pb-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-slate-700 font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Load More ({filteredStudents.length - visibleStudents.length} Remaining)
          </button>
        </div>
      )}

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={onBulkAction}
        aria-label="Bulk Actions"
        className="md:hidden fixed bottom-20 right-4 z-30 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 cursor-pointer font-bold"
      >
        <span className="material-symbols-outlined text-[26px]">checklist</span>
      </button>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filter Students</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Risk Level */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Risk Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['HIGH', 'MEDIUM', 'LOW'].map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setSelectedRiskFilter(selectedRiskFilter === risk ? null : risk)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedRiskFilter === risk
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Faculty / Department
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['CS', 'IT', 'Mech', 'Commerce', 'Arts', 'Civil'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDeptFilter(selectedDeptFilter === dept ? null : dept)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedDeptFilter === dept
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Year */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Academic Year
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYearFilter(selectedYearFilter === year ? null : year)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      selectedYearFilter === year
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Year {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setSelectedRiskFilter(null);
                  setSelectedDeptFilter(null);
                  setSelectedYearFilter(null);
                }}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

