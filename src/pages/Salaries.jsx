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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Salary Management</h1>
          <p className="mt-1 text-sm font-semibold uppercase text-gray-300 select-none">
            Dipesh Development
          </p>
        </div>
        {!guestMode && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Salary
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (salaries.length === 0) {
                    alert('No salary records to export.');
                    return;
                  }
                  exportMonthlyPDF(salaries, workers);
                }}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                Export to PDF
              </button>

              <button
                onClick={() => {
                  if (salaries.length === 0) {
                    alert('No salary records to export.');
                    return;
                  }
                  exportFullDatabasePDF(workers, salaries);
                }}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Export Full DB PDF
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingSalary ? 'Edit Salary Record' : 'Add New Salary Record'}
            </h2>
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
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingSalary ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Salary Records Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Worker</th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Days</th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Advance</th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Final</th>
                <th className="px-2 py-3 sm:px-6 sm:py-4 text-right text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
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
                    <td className="px-2 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-500">{index + 1}</td>
                    <td className="px-2 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      {getWorkerName(salary.workerId)}
                    </td>
                    <td className="px-2 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 text-center hidden sm:table-cell">{salary.workingDays}</td>
                    <td className="px-2 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-600 text-right font-medium">
                      ₹ {Number(salary.totalSalary).toLocaleString('en-IN')}
                    </td>
                    <td className="px-2 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-orange-600 text-right font-medium">
                      ₹ {Number(salary.advance).toLocaleString('en-IN')}
                    </td>
                    <td className="px-2 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm text-green-700 text-right font-bold">
                      ₹ {Number(salary.finalSalary).toLocaleString('en-IN')}
                    </td>
                    {!guestMode && (
                      <td className="px-2 py-3 sm:px-6 sm:py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(salary)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm mr-1 sm:mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(salary.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Salaries;
