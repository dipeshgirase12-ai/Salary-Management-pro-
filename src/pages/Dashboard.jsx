import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, loadSampleData } from '../utils/storage';
import { isGuestMode } from '../utils/auth';


const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getStats());
  const [showSampleConfirm, setShowSampleConfirm] = useState(false);
  const guestMode = isGuestMode();

  const refreshStats = () => {
    setStats(getStats());
  };

  const handleLoadSampleData = () => {
    loadSampleData();
    refreshStats();
    setShowSampleConfirm(false);
  };

  const cards = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue',
      onClick: () => navigate('/workers'),
    },
    {
      title: 'Total Salary Records',
      value: stats.totalSalaryRecords,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'green',
      onClick: () => navigate('/salaries'),
    },
    {
      title: 'Total Salary',
      value: `₹ ${stats.totalSalary.toLocaleString('en-IN')}`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'purple',
    },
    {
      title: 'Total Advance',
      value: `₹ ${stats.totalAdvance.toLocaleString('en-IN')}`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      color: 'orange',
    },
  ];

  const borderColors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
  };

  const bgColors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
  };

  const textColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {stats.totalWorkers === 0 && !guestMode && (
          <button
            onClick={() => setShowSampleConfirm(true)}
            className="bg-yellow-500 text-white px-6 py-2.5 rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-md"
          >
            Load Sample Data (50 Workers)
          </button>
        )}
      </div>

      {/* Sample Data Confirm Modal */}
      {showSampleConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Load Sample Data?</h2>
            <p className="text-gray-600 mb-6">This will load 50 sample workers with salary records. Existing data will be overwritten.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSampleConfirm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLoadSampleData}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
              >
                Load Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className={`bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 ${borderColors[card.color]} ${card.onClick ? 'cursor-pointer hover:shadow-lg' : ''} transition-shadow`}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 ${bgColors[card.color]} rounded-full`}>
                <div className={textColors[card.color]}>{card.icon}</div>
              </div>
              <div>
                <p className="text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wide">{card.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {!guestMode && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <button onClick={() => navigate('/workers')} className="flex items-center justify-center gap-1 sm:gap-2 bg-blue-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              <span className="hidden sm:inline">Add Worker</span>
              <span className="sm:hidden">Worker</span>
            </button>
            <button onClick={() => navigate('/salaries')} className="flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span className="hidden sm:inline">Add Salary</span>
              <span className="sm:hidden">Salary</span>
            </button>
            <button onClick={() => navigate('/salaries')} className="flex items-center justify-center gap-1 sm:gap-2 bg-purple-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium text-xs sm:text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>
            <button onClick={() => navigate('/workers')} className="flex items-center justify-center gap-1 sm:gap-2 bg-red-600 text-white px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-xs sm:text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="hidden sm:inline">Delete All</span>
              <span className="sm:hidden">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
