import { useState } from 'react';
import { getWorkers } from '../utils/storage';
import { isGuestMode } from '../utils/auth';

const Attendance = () => {
  const guestMode = isGuestMode();
  const workers = getWorkers();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});

  // Mock attendance data for demonstration
  const attendanceRecords = workers.map((worker) => ({
    workerId: worker.id,
    workerName: worker.name,
    date: selectedDate,
    status: Math.random() > 0.2 ? 'Present' : 'Absent',
    workingDays: Math.floor(Math.random() * 10 + 20),
  }));

  const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
  const absentCount = attendanceRecords.filter((a) => a.status === 'Absent').length;
  const presentPercentage = workers.length > 0 ? Math.round((presentCount / workers.length) * 100) : 0;

  const statusColors = {
    Present: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    Absent: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    'Half Day': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24 sm:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Track worker attendance</p>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{presentCount}</p>
          <p className="text-gray-500 text-xs font-medium uppercase mt-1">Present</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{absentCount}</p>
          <p className="text-gray-500 text-xs font-medium uppercase mt-1">Absent</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{presentPercentage}%</p>
          <p className="text-gray-500 text-xs font-medium uppercase mt-1">Rate</p>
        </div>
      </div>

      {/* Attendance Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Attendance Rate</span>
          <span className="font-semibold text-gray-800">{presentPercentage}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${presentPercentage}%` }}
          />
        </div>
      </div>

      {/* Attendance List - Mobile Cards */}
      <div className="space-y-3">
        <h2 className="font-semibold text-gray-800 text-lg">Today's Attendance</h2>
        {attendanceRecords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No workers found. Add workers first.</p>
          </div>
        ) : (
          attendanceRecords.map((record) => (
            <div key={record.workerId} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {record.workerName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{record.workerName}</p>
                    <p className="text-gray-500 text-xs">{record.workingDays} working days</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[record.status].bg} ${statusColors[record.status].text}`}>
                  {record.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Monthly Overview Card */}
      <div className="mt-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg p-5 text-white">
        <h3 className="font-bold text-lg mb-3">Monthly Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-purple-100 text-xs uppercase">Total Workers</p>
            <p className="text-2xl font-bold">{workers.length}</p>
          </div>
          <div>
            <p className="text-purple-100 text-xs uppercase">Avg. Attendance</p>
            <p className="text-2xl font-bold">{presentPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;