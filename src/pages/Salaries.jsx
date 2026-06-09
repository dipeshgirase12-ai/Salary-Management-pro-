import { useMemo, useState } from 'react';
import { getWorkers, getSalaries, addSalary, updateSalary, deleteSalary } from '../utils/storage';
import { exportToExcel } from '../utils/excelExport';
import { exportFullDatabasePDF, exportMonthlyPDF } from '../utils/pdfExport';
import { isGuestMode } from '../utils/auth';


const Salaries = () => {
  const [workers, setWorkers] = useState(() => getWorkers());
  const [salaries, setSalaries] = useState(() => getSalaries());
  const guestMode = isGuestMode();
  const [showForm, setShowForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [formData, setFormData] = useState({
    workerId: '',
    workingDays: '',
    totalSalary: '',
    advance: '0',
  });
  const [error, setError] = useState('');
  const calculatedFinal = useMemo(() => {
    const final = Number(formData.totalSalary) - Number(formData.advance);
    return final >= 0 ? final : 0;
  }, [formData.totalSalary, formData.advance]);

  const loadData = () => {
    setWorkers(getWorkers());
    setSalaries(getSalaries());
  };

  const resetForm = () => {
    setFormData({ workerId: '', workingDays: '', totalSalary: '', advance: '0' });
    setEditingSalary(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (salary) => {
    setFormData({
      workerId: salary.workerId,
      workingDays: salary.workingDays,
      totalSalary: salary.totalSalary,
      advance: salary.advance,
    });
    setEditingSalary(salary);
    setShowForm(true);
    setError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      deleteSalary(id);
      loadData();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.workerId || !formData.workingDays || !formData.totalSalary) {
      setError('Please fill in all required fields.');
      return;
    }

    if (Number(formData.workingDays) <= 0 || Number(formData.totalSalary) <= 0) {
      setError('Working days and total salary must be greater than 0.');
      return;
    }

    if (editingSalary) {
      updateSalary(editingSalary.id, formData);
    } else {
      addSalary(formData);
    }

    loadData();
    resetForm();
  };

  const getWorkerName = (workerId) => {
    const worker = workers.find((w) => w.id === workerId);
    return worker ? worker.name : 'Unknown Worker';
  };

  const handleExport = async () => {
    if (salaries.length === 0) {
      alert('No salary records to export.');
      return;
    }
    await exportToExcel(salaries, workers);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Salary Management</h1>
          <p className="mt-1 text-xs sm:text-sm font-semibold uppercase text-gray-300 select-none">
            Dipesh Development
          </p>
        </div>
        {!guestMode && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-blue-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add Salary</span>
              <span className="sm:hidden">Add</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>
            <button
              onClick={() => { salaries.length === 0 ? alert('No salary records to export.') : exportMonthlyPDF(salaries, workers); }}
              className="bg-purple-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              <span className="hidden sm:inline">PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={() => { salaries.length === 0 ? alert('No salary records to export.') : exportFullDatabasePDF(workers, salaries); }}
              className="bg-slate-800 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-1 sm:gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Full DB PDF</span>
              <span className="sm:hidden">Full PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Form Modal - Fullscreen Mobile */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pt-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {editingSalary ? 'Edit Salary' : 'Add Salary'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Worker *</label>
                <select
                  value={formData.workerId}
                  onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">-- Select a Worker --</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.mobile}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Days *</label>
                <input
                  type="number"
                  value={formData.workingDays}
                  onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter working days"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Salary *</label>
                <input
                  type="number"
                  value={formData.totalSalary}
                  onChange={(e) => setFormData({ ...formData, totalSalary: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter total salary"
                  min="0"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                <input
                  type="number"
                  value={formData.advance}
                  onChange={(e) => setFormData({ ...formData, advance: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter advance amount"
                  min="0"
                />
              </div>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Final Salary = Total Salary - Advance
                </p>
                <p className="text-lg font-bold text-blue-900 mt-1">
                  ₹ {calculatedFinal.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex gap-3 justify-end sticky bottom-0 bg-white pt-2 pb-2">
                <button type="button" onClick={resetForm} className="flex-1 sm:flex-none px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
                <button type="submit" className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{editingSalary ? 'Update' : 'Save'}</button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Salary Records Table - Desktop */}
      <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Days</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Advance</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Final</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No salary records found. Add your first salary record!</p>
                  </td>
                </tr>
              ) : (
                salaries.map((salary, index) => (
                  <tr key={salary.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getWorkerName(salary.workerId)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-center">{salary.workingDays}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right font-medium">₹ {Number(salary.totalSalary).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-orange-600 text-right font-medium">₹ {Number(salary.advance).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-green-700 text-right font-bold">₹ {Number(salary.finalSalary).toLocaleString('en-IN')}</td>
                    {!guestMode && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button onClick={() => handleEdit(salary)} className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edit</button>
                        <button onClick={() => handleDelete(salary.id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Records Cards - Mobile */}
      <div className="sm:hidden space-y-3">
        {salaries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No salary records found.</p>
          </div>
        ) : (
          salaries.map((salary, index) => (
            <div key={salary.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{getWorkerName(salary.workerId)}</p>
                  <p className="text-sm text-gray-500">#{index + 1}</p>
                </div>
                <span className="text-xs text-gray-400">{salary.createdAt ? new Date(salary.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-sm">
                <div><span className="text-gray-500">Days: </span><span className="font-medium">{salary.workingDays}</span></div>
                <div><span className="text-gray-500">Total: </span><span className="font-medium">₹{Number(salary.totalSalary).toLocaleString('en-IN')}</span></div>
                <div><span className="text-gray-500">Advance: </span><span className="font-medium text-orange-600">₹{Number(salary.advance).toLocaleString('en-IN')}</span></div>
                <div><span className="text-gray-500">Final: </span><span className="font-bold text-green-700">₹{Number(salary.finalSalary).toLocaleString('en-IN')}</span></div>
              </div>
              {!guestMode && (
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(salary)} className="flex-1 text-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">Edit</button>
                  <button onClick={() => handleDelete(salary.id)} className="flex-1 text-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Salaries;