import { useState } from 'react';
import { getTrash, restoreFromTrash, permanentlyDeleteFromTrash, clearTrash } from '../utils/storage';
import { isGuestMode } from '../utils/auth';

const Trash = () => {
  const guestMode = isGuestMode();
  const [trash, setTrash] = useState(() => getTrash());
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadTrash = () => setTrash(getTrash());

  const handleRestore = (trashId) => {
    if (guestMode) return;
    restoreFromTrash(trashId);
    loadTrash();
  };

  const handlePermanentDelete = (trashId) => {
    if (guestMode) return;
    if (window.confirm('This item will be permanently deleted. Are you sure?')) {
      permanentlyDeleteFromTrash(trashId);
      loadTrash();
    }
  };

  const handleClearTrash = () => {
    if (guestMode) return;
    clearTrash();
    loadTrash();
    setShowClearConfirm(false);
  };

  const getIcon = (type) => {
    if (type === 'worker') {
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const workersInTrash = trash.filter((t) => t.itemType === 'worker');
  const salariesInTrash = trash.filter((t) => t.itemType === 'salary');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Trash</h1>
          <p className="text-gray-500 text-sm mt-1">{trash.length} items in trash</p>
        </div>
        {trash.length > 0 && !guestMode && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Empty State */}
      {trash.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">Trash is empty</p>
          <p className="text-gray-400 text-sm mt-1">Deleted items will appear here</p>
        </div>
      ) : (
        <>
          {/* Workers Section */}
          {workersInTrash.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-800 text-sm uppercase text-gray-500 mb-2 px-1">
                Workers ({workersInTrash.length})
              </h2>
              <div className="space-y-2">
                {workersInTrash.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                          {getIcon('worker')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-gray-500 text-xs">Deleted on {formatDate(item.trashedAt)}</p>
                        </div>
                      </div>
                      {!guestMode && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestore(item.id)}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item.id)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salaries Section */}
          {salariesInTrash.length > 0 && (
            <div>
              <h2 className="font-semibold text-gray-800 text-sm uppercase text-gray-500 mb-2 px-1">
                Salary Records ({salariesInTrash.length})
              </h2>
              <div className="space-y-2">
                {salariesInTrash.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                          {getIcon('salary')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">₹{Number(item.totalSalary).toLocaleString('en-IN')}</p>
                          <p className="text-gray-500 text-xs">Deleted on {formatDate(item.trashedAt)}</p>
                        </div>
                      </div>
                      {!guestMode && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRestore(item.id)}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(item.id)}
                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Clear Trash?</h2>
            </div>
            <p className="text-gray-600 mb-6">All {trash.length} items will be permanently deleted. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearTrash}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trash;