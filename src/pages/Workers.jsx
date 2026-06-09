import { useState } from 'react';
import { getWorkers, getSalaries, addWorker, updateWorker, deleteWorker, getTrash, restoreFromTrash, permanentlyDeleteFromTrash, deleteSelectedWorkers, deleteAllWorkers, clearTrash } from '../utils/storage';
import { exportWorkerPDF } from '../utils/pdfExport';
import { isGuestMode } from '../utils/auth';

const Workers = () => {
  const [workers, setWorkers] = useState(() => getWorkers());
  const [salaries, setSalaries] = useState(() => getSalaries());
  const [trashItems, setTrashItems] = useState(() => getTrash());
  const guestMode = isGuestMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [formData, setFormData] = useState({ name: '', mobile: '', joiningDate: '', status: 'Active' });
  const [error, setError] = useState('');
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [showTrash, setShowTrash] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const [profileTab, setProfileTab] = useState('salary');

  const loadData = () => {
    setWorkers(getWorkers());
    setSalaries(getSalaries());
    setTrashItems(getTrash());
  };

  const resetForm = () => {
    setFormData({ name: '', mobile: '', joiningDate: '', status: 'Active' });
    setEditingWorker(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (worker) => {
    setFormData({
      name: worker.name,
      mobile: worker.mobile,
      joiningDate: worker.joiningDate || '',
      status: worker.status || 'Active',
    });
    setEditingWorker(worker);
    setShowForm(true);
    setError('');
  };

  const handleDelete = (id, name) => {
    setShowConfirmDialog({
      title: 'Delete Worker',
      message: `Are you sure you want to delete "${name}"? This will also delete their salary records and move to trash.`,
      onConfirm: () => {
        deleteWorker(id);
        loadData();
        setShowConfirmDialog(null);
      },
    });
  };

  const handleDeleteSelected = () => {
    if (selectedWorkers.length === 0) return;
    setShowConfirmDialog({
      title: 'Delete Selected Workers',
      message: `Are you sure you want to delete ${selectedWorkers.length} selected worker(s)? They will move to trash.`,
      onConfirm: () => {
        deleteSelectedWorkers(selectedWorkers.map(id => id));
        setSelectedWorkers([]);
        loadData();
        setShowConfirmDialog(null);
      },
    });
  };

  const handleDeleteAll = () => {
    setShowConfirmDialog({
      title: 'Delete All Workers',
      message: 'Are you sure you want to delete ALL workers and their salary records? They will move to trash.',
      onConfirm: () => {
        deleteAllWorkers();
        loadData();
        setShowConfirmDialog(null);
      },
    });
  };

  const handleRestore = (trashId) => {
    restoreFromTrash(trashId);
    loadData();
  };

  const handlePermanentDelete = (trashId) => {
    setShowConfirmDialog({
      title: 'Permanently Delete',
      message: 'This action cannot be undone. The record will be permanently removed from trash.',
      onConfirm: () => {
        permanentlyDeleteFromTrash(trashId);
        loadData();
        setShowConfirmDialog(null);
      },
    });
  };

  const handleClearTrash = () => {
    setShowConfirmDialog({
      title: 'Clear Trash',
      message: 'Are you sure you want to permanently delete ALL items in trash? This cannot be undone.',
      onConfirm: () => {
        clearTrash();
        loadData();
        setShowConfirmDialog(null);
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.mobile.trim()) {
      setError('Name and Mobile Number are required.');
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (editingWorker) {
      updateWorker(editingWorker.id, formData);
    } else {
      addWorker(formData);
    }

    loadData();
    resetForm();
  };

  const toggleSelect = (id) => {
    setSelectedWorkers(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedWorkers.length === filteredWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(filteredWorkers.map(w => w.id));
    }
  };

  const handleViewProfile = (worker) => {
    setShowProfile(worker);
    setProfileTab('salary');
  };

  const filteredWorkers = workers.filter((worker) =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.mobile.includes(searchTerm)
  );

  const getWorkerSalaries = (workerId) => {
    return salaries.filter(s => s.workerId === workerId);
  };

  const getWorkerAttendance = (workerId) => {
    return salaries.filter(s => s.workerId === workerId).map(s => ({
      days: s.workingDays,
      month: s.createdAt ? new Date(s.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'N/A',
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Worker Management</h1>
        <div className="flex flex-wrap gap-2">
          {selectedWorkers.length > 0 && !guestMode && (
            <button onClick={handleDeleteSelected} className="bg-red-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-red-600 transition-colors font-medium text-xs sm:text-sm whitespace-nowrap">
              Delete ({selectedWorkers.length})
            </button>
          )}
          {!guestMode && (
            <button onClick={handleDeleteAll} className="bg-red-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              <span className="hidden sm:inline">Delete All</span>
              <span className="sm:hidden">Delete</span>
            </button>
          )}
          {!guestMode && (
            <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span className="hidden sm:inline">Add Worker</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
          {!guestMode && (
            <button onClick={() => setShowTrash(!showTrash)} className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${showTrash ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
              Trash ({trashItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search workers by name or mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-md mx-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{showConfirmDialog.title}</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">{showConfirmDialog.message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirmDialog(null)} className="flex-1 sm:flex-none px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
              <button onClick={showConfirmDialog.onConfirm} className="flex-1 sm:flex-none px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Worker Form Modal - Fullscreen Mobile */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen sm:min-h-0 sm:flex sm:items-center sm:justify-center sm:p-4">
            <div className="bg-white p-4 sm:p-6 w-full sm:max-w-md sm:rounded-xl sm:shadow-2xl sm:max-h-[90vh] sm:overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pt-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">{editingWorker ? 'Edit Worker' : 'Add Worker'}</h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter worker name" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input type="text" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Enter 10-digit mobile number" maxLength={10} />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                  <input type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-3 justify-end sticky bottom-0 bg-white pt-2 pb-2">
                  <button type="button" onClick={resetForm} className="flex-1 sm:flex-none px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Cancel</button>
                  <button type="submit" className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    {editingWorker ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Worker Profile Modal - Fullscreen Mobile */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen">
            <div className="bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 pt-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Worker Profile</h2>
                <button onClick={() => setShowProfile(null)} className="text-gray-400 hover:text-gray-600 p-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs sm:text-sm text-gray-500">Name</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{showProfile.name}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs sm:text-sm text-gray-500">Mobile</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{showProfile.mobile}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Joining Date</p>
                  <p className="text-base sm:text-lg font-semibold text-gray-800">{showProfile.joiningDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${showProfile.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {showProfile.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 sm:gap-2 mb-4 border-b border-gray-200 pb-2 overflow-x-auto">
                {['salary', 'attendance', 'advance'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setProfileTab(tab)}
                    className={`px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${profileTab === tab ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Export PDF Button - Mobile */}
              {!guestMode && (
                <button
                  onClick={() => exportWorkerPDF(showProfile, salaries)}
                  className="w-full mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                  Export PDF
                </button>
              )}

              {/* Salary History - Card */}
              {profileTab === 'salary' && (
                <div className="space-y-3">
                  {getWorkerSalaries(showProfile.id).length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No salary records found.</p>
                  ) : (
                    getWorkerSalaries(showProfile.id).map((s, i) => (
                      <div key={s.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-gray-500">#{i + 1}</span>
                          <span className="text-xs text-gray-400">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                          <div><span className="text-gray-500">Days: </span><span className="font-medium">{s.workingDays}</span></div>
                          <div><span className="text-gray-500">Total: </span><span className="font-medium">₹{Number(s.totalSalary).toLocaleString('en-IN')}</span></div>
                          <div><span className="text-gray-500">Advance: </span><span className="font-medium text-orange-600">₹{Number(s.advance).toLocaleString('en-IN')}</span></div>
                          <div><span className="text-gray-500">Final: </span><span className="font-bold text-green-700">₹{Number(s.finalSalary).toLocaleString('en-IN')}</span></div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Attendance History - Card */}
              {profileTab === 'attendance' && (
                <div className="space-y-3">
                  {getWorkerAttendance(showProfile.id).length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No attendance records found.</p>
                  ) : (
                    getWorkerAttendance(showProfile.id).map((a, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3 sm:p-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">#{i + 1}</span>
                        <span className="font-medium text-gray-900">{a.month}</span>
                        <span className="text-sm text-gray-600">{a.days} days</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Advance History - Card */}
              {profileTab === 'advance' && (
                <div className="space-y-3">
                  {getWorkerSalaries(showProfile.id).filter(s => Number(s.advance) > 0).length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No advance records found.</p>
                  ) : (
                    getWorkerSalaries(showProfile.id).filter(s => Number(s.advance) > 0).map((s, i) => (
                      <div key={s.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">#{i + 1}</span>
                        <span className="font-medium text-gray-900">{s.createdAt ? new Date(s.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        <span className="font-bold text-orange-600">₹{Number(s.advance).toLocaleString('en-IN')}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trash Modal */}
      {showTrash && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recycle Bin ({trashItems.length} items)</h2>
              <div className="flex gap-2">
                {trashItems.length > 0 && (
                  <button onClick={handleClearTrash} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">Clear All</button>
                )}
                <button onClick={() => setShowTrash(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {trashItems.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Trash is empty.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Deleted At</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {trashItems.map(item => (
                        <tr key={`${item.id}-${item.trashedAt}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.itemType === 'worker' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {item.itemType === 'worker' ? 'Worker' : 'Salary'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name || item.workerId || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{new Date(item.trashedAt).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => handleRestore(item.id)} className="text-green-600 hover:text-green-800 text-sm font-medium mr-3">Restore</button>
                            <button onClick={() => handlePermanentDelete(item.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Workers Table - Desktop */}
      <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {!guestMode && (
                  <th className="px-4 py-4 w-10">
                    <input type="checkbox" onChange={toggleSelectAll} checked={selectedWorkers.length === filteredWorkers.length && filteredWorkers.length > 0} className="rounded" />
                  </th>
                )}
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">#</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>No workers found.</p>
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker, index) => (
                  <tr key={worker.id} className="hover:bg-gray-50 transition-colors">
                    {!guestMode && (
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={selectedWorkers.includes(worker.id)} onChange={() => toggleSelect(worker.id)} className="rounded" />
                      </td>
                    )}
                    <td className="px-4 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{worker.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{worker.mobile}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {worker.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right whitespace-nowrap">
                      <button onClick={() => handleViewProfile(worker)} className="text-purple-600 hover:text-purple-800 font-medium text-sm mr-3">View</button>
                      {!guestMode && (
                        <>
                          <button onClick={() => handleEdit(worker)} className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3">Edit</button>
                          <button onClick={() => handleDelete(worker.id, worker.name)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workers Cards - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>No workers found.</p>
          </div>
        ) : (
          filteredWorkers.map((worker, index) => (
            <div key={worker.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {!guestMode && (
                    <input type="checkbox" checked={selectedWorkers.includes(worker.id)} onChange={() => toggleSelect(worker.id)} className="rounded mt-1" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{worker.name}</p>
                    <p className="text-sm text-gray-500">#{index + 1}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {worker.status || 'Active'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Mobile</p>
                  <p className="text-gray-900 font-medium">{worker.mobile}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Joined</p>
                  <p className="text-gray-900 font-medium">{worker.joiningDate || 'N/A'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleViewProfile(worker)} className="flex-1 min-w-[80px] text-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium">
                  View
                </button>
                {!guestMode && (
                  <>
                    <button onClick={() => handleEdit(worker)} className="flex-1 min-w-[80px] text-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(worker.id, worker.name)} className="flex-1 min-w-[80px] text-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Workers;
