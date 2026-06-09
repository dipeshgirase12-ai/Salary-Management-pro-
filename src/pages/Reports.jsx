import { useState } from 'react';
import { getWorkers, getSalaries } from '../utils/storage';
import { exportToExcel } from '../utils/excelExport';
import { exportFullDatabasePDF, exportMonthlyPDF } from '../utils/pdfExport';
import { isGuestMode } from '../utils/auth';

const Reports = () => {
  const guestMode = isGuestMode();
  const [selectedReport, setSelectedReport] = useState('salary');
  const [exporting, setExporting] = useState(false);

  const workers = getWorkers();
  const salaries = getSalaries();

  const stats = {
    totalWorkers: workers.length,
    totalSalaries: salaries.length,
    totalSalaryAmount: salaries.reduce((sum, s) => sum + Number(s.totalSalary), 0),
    totalAdvance: salaries.reduce((sum, s) => sum + Number(s.advance), 0),
    totalFinalSalary: salaries.reduce((sum, s) => sum + Number(s.finalSalary), 0),
    activeWorkers: workers.filter((w) => w.status === 'Active').length,
    pendingPayments: salaries.filter((s) => s.acStatus === 'Pending').length,
  };

  const reportTypes = [
    {
      id: 'salary',
      title: 'Salary Reports',
      description: 'Export salary records to PDF or Excel',
      icon: 'salary',
      color: 'blue',
      actions: ['pdf', 'excel'],
    },
    {
      id: 'attendance',
      title: 'Attendance Reports',
      description: 'View attendance overview',
      icon: 'attendance',
      color: 'green',
      actions: ['view'],
    },
    {
      id: 'worker',
      title: 'Worker Reports',
      description: 'Export worker list with details',
      icon: 'worker',
      color: 'purple',
      actions: ['pdf', 'excel'],
    },
    {
      id: 'summary',
      title: 'Summary Reports',
      description: 'Complete database export',
      icon: 'summary',
      color: 'red',
      actions: ['pdf', 'excel'],
    },
  ];

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      if (selectedReport === 'salary' || selectedReport === 'attendance') {
        exportMonthlyPDF(salaries, workers);
      } else {
        exportFullDatabasePDF(workers, salaries);
      }
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      if (salaries.length > 0) {
        await exportToExcel(salaries, workers);
      }
    } finally {
      setExporting(false);
    }
  };

  const getIcon = (icon, className = 'w-8 h-8') => {
    const icons = {
      salary: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      attendance: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      worker: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      summary: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    };
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
    );
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Reports Center</h1>
        <p className="text-gray-500 text-sm mt-1">Generate and export reports</p>
      </div>

      {/* Quick Stats - Mobile Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-xs font-medium uppercase">Total Workers</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalWorkers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-xs font-medium uppercase">Active</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.activeWorkers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
          <p className="text-gray-500 text-xs font-medium uppercase">Total Salary</p>
          <p className="text-lg font-bold text-gray-800 mt-1">₹{stats.totalSalaryAmount.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
          <p className="text-gray-500 text-xs font-medium uppercase">Pending</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingPayments}</p>
        </div>
      </div>

      {/* Report Types - Mobile Cards */}
      <div className="space-y-3 mb-6">
        {reportTypes.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`bg-white rounded-xl shadow-sm p-4 border-2 transition-all ${
              selectedReport === report.id
                ? `${colorClasses[report.color].border} shadow-md`
                : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`${colorClasses[report.color].bg} ${colorClasses[report.color].text} p-3 rounded-lg`}>
                {getIcon(report.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{report.title}</h3>
                <p className="text-gray-500 text-sm mt-0.5">{report.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedReport === report.id
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedReport === report.id && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Actions */}
      {!guestMode && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Export Selected Report</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </button>
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
        <h3 className="font-bold text-lg mb-3">Quick Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-blue-100 text-xs uppercase">Total Salary Records</p>
            <p className="text-2xl font-bold">{stats.totalSalaries}</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs uppercase">Total Advance</p>
            <p className="text-2xl font-bold">₹{stats.totalAdvance.toLocaleString('en-IN')}</p>
          </div>
          <div className="col-span-2">
            <p className="text-blue-100 text-xs uppercase">Final Salary (After Advance)</p>
            <p className="text-3xl font-bold">₹{stats.totalFinalSalary.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;