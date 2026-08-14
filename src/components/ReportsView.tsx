import React, { useState } from 'react';
import { Student } from '../types';

interface ReportsViewProps {
  students: Student[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ students }) => {
  const [downloadToast, setDownloadToast] = useState(false);

  const handleExport = (format: 'CSV' | 'PDF') => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3000);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-8">
      {/* Header with Export Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Analytics &amp; Forecasting</span>
          <h2 className="text-xl font-bold text-slate-900">
            Institutional Intelligence &amp; Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Student retention forecasts, intervention ROI, and department risk distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleExport('CSV')}
            className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-600">table_view</span>
            Export CSV
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Executive Brief
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Projected Retention
            </span>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">+2.4%</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">91.4%</p>
          <p className="text-xs text-slate-500 mt-1">Baseline threshold: 88.0%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avg Turnaround Time
            </span>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">-18 hrs</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">2.8 Days</p>
          <p className="text-xs text-slate-500 mt-1">From alert trigger to intervention</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Remedial Recovery Rate
            </span>
            <span className="text-blue-700 font-bold text-xs bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">78%</span>
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-blue-600 mt-2">398 / 510</p>
          <p className="text-xs text-slate-500 mt-1">Students returned to good standing</p>
        </div>
      </div>

      {/* Intervention Efficacy Analysis */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <span className="material-symbols-outlined text-blue-600">psychology</span>
            Intervention Channel Efficacy
          </h3>
          <span className="text-xs font-medium text-slate-500">Current Academic Term</span>
        </div>

        <div className="space-y-4 text-xs">
          {[
            { channel: '1-on-1 Wellness Counseling', success: 84, cases: 142, icon: 'psychology' },
            { channel: 'Department Academic Tutoring', success: 79, cases: 98, icon: 'school' },
            { channel: 'Parent-Faculty Escalation Call', success: 72, cases: 64, icon: 'contact_phone' },
            { channel: 'Bursar Installment Plan Support', success: 91, cases: 53, icon: 'payments' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold flex items-center gap-2 text-slate-800 text-xs">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">{item.icon}</span>
                  {item.channel}
                </span>
                <span className="font-bold text-slate-900">
                  <span className="text-blue-600">{item.success}%</span> Success ({item.cases} Cases)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${item.success}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Risk Comparison Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide border-b border-slate-100 pb-3">
          <span className="material-symbols-outlined text-blue-600">account_tree</span>
          Faculty &amp; Department Risk Distribution
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Faculty / Department</th>
                <th className="py-3 px-4">Enrolled Students</th>
                <th className="py-3 px-4">High Risk Rate</th>
                <th className="py-3 px-4">Avg Attendance</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {[
                { dept: 'Computer Science (CS)', total: 1120, high: '14%', att: '78%', status: 'Stable' },
                { dept: 'Information Technology (IT)', total: 840, high: '16%', att: '72%', status: 'Review' },
                { dept: 'Mechanical Engineering', total: 760, high: '18%', att: '69%', status: 'High Focus' },
                { dept: 'Commerce & Economics', total: 680, high: '9%', att: '84%', status: 'Optimal' },
                { dept: 'Civil Engineering', total: 510, high: '11%', att: '80%', status: 'Stable' },
                { dept: 'Arts & Humanities', total: 340, high: '8%', att: '86%', status: 'Optimal' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.dept}</td>
                  <td className="py-3 px-4 text-slate-600">{row.total}</td>
                  <td className="py-3 px-4 text-rose-600 font-bold">{row.high}</td>
                  <td className="py-3 px-4 text-slate-600">{row.att}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        row.status === 'Optimal'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : row.status === 'High Focus'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Toast */}
      {downloadToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl z-50 animate-bounce">
          Report dossier generated and downloaded successfully.
        </div>
      )}
    </div>
  );
};

