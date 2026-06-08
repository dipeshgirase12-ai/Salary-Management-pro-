// Local Storage Utility Functions with User Isolation and Guest Mode

import { getUserId, isGuestMode } from './auth';

const getUserKey = (baseKey) => {
  const userId = getUserId();
  if (isGuestMode()) {
    return `guest_${baseKey}`;
  }
  return userId ? `user_${userId}_${baseKey}` : baseKey;
};

// Keys
const WORKERS_KEY = 'workers';
const SALARIES_KEY = 'salaries';
const TRASH_KEY = 'trash';
const SETTINGS_KEY = 'settings';

// ==================== WORKERS ====================

export const getWorkers = () => {
  const key = getUserKey(WORKERS_KEY);
  const data = localStorage.getItem(key);
  if (isGuestMode()) {
    // Guest mode: load demo data if empty
    if (!data) {
      loadSampleData();
      return getWorkers();
    }
  }
  return data ? JSON.parse(data) : [];
};

export const saveWorkers = (workers) => {
  const key = getUserKey(WORKERS_KEY);
  localStorage.setItem(key, JSON.stringify(workers));
  if (!isGuestMode()) autoSaveDatabase();
};

export const addWorker = (worker) => {
  if (isGuestMode()) return null;
  const workers = getWorkers();
  const userId = getUserId();
  const newWorker = {
    ...worker,
    id: Date.now().toString(),
    userId,
    joiningDate: worker.joiningDate || new Date().toISOString().split('T')[0],
    status: worker.status || 'Active',
    createdAt: new Date().toISOString(),
  };
  workers.push(newWorker);
  saveWorkers(workers);
  return newWorker;
};

export const updateWorker = (id, updatedData) => {
  if (isGuestMode()) return null;
  const workers = getWorkers();
  const index = workers.findIndex((w) => w.id === id);
  if (index !== -1) {
    workers[index] = { ...workers[index], ...updatedData };
    saveWorkers(workers);
    autoUpdateExcel();
    return workers[index];
  }
  return null;
};

// ==================== SALARIES ====================

export const getSalaries = () => {
  const key = getUserKey(SALARIES_KEY);
  const data = localStorage.getItem(key);
  if (isGuestMode()) {
    if (!data) {
      loadSampleData();
      return getSalaries();
    }
  }
  return data ? JSON.parse(data) : [];
};

export const saveSalaries = (salaries) => {
  const key = getUserKey(SALARIES_KEY);
  localStorage.setItem(key, JSON.stringify(salaries));
  if (!isGuestMode()) autoSaveDatabase();
};

export const addSalary = (salary) => {
  if (isGuestMode()) return null;
  const salaries = getSalaries();
  const userId = getUserId();
  const newSalary = {
    ...salary,
    id: Date.now().toString(),
    userId,
    finalSalary: Number(salary.totalSalary) - Number(salary.advance),
    acStatus: salary.acStatus || 'Pending',
    confirm: salary.confirm || 'No',
    createdAt: new Date().toISOString(),
  };
  salaries.push(newSalary);
  saveSalaries(salaries);
  autoUpdateExcel();
  return newSalary;
};

export const updateSalary = (id, updatedData) => {
  if (isGuestMode()) return null;
  const salaries = getSalaries();
  const index = salaries.findIndex((s) => s.id === id);
  if (index !== -1) {
    const updated = {
      ...salaries[index],
      ...updatedData,
    };
    updated.finalSalary = Number(updated.totalSalary) - Number(updated.advance);
    salaries[index] = updated;
    saveSalaries(salaries);
    autoUpdateExcel();
    return updated;
  }
  return null;
};

// ==================== TRASH / RECYCLE BIN ====================

export const getTrash = () => {
  const key = getUserKey(TRASH_KEY);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveTrash = (items) => {
  const key = getUserKey(TRASH_KEY);
  localStorage.setItem(key, JSON.stringify(items));
};

// Move item to trash
const moveToTrash = (item, type) => {
  if (isGuestMode()) return;
  const trash = getTrash();
  trash.push({
    ...item,
    trashedAt: new Date().toISOString(),
    itemType: type,
  });
  saveTrash(trash);
};

// Delete worker (moves to trash)
export const deleteWorker = (id) => {
  if (isGuestMode()) return [];
  const workers = getWorkers();
  const worker = workers.find((w) => w.id === id);
  if (worker) {
    moveToTrash(worker, 'worker');
    // Also move associated salaries to trash
    const salaries = getSalaries();
    const associatedSalaries = salaries.filter((s) => s.workerId === id);
    associatedSalaries.forEach((s) => moveToTrash(s, 'salary'));
    const filteredSalaries = salaries.filter((s) => s.workerId !== id);
    saveSalaries(filteredSalaries);
  }
  const filtered = workers.filter((w) => w.id !== id);
  saveWorkers(filtered);
  return filtered;
};

// Delete salary record (moves to trash)
export const deleteSalary = (id) => {
  if (isGuestMode()) return [];
  const salaries = getSalaries();
  const salary = salaries.find((s) => s.id === id);
  if (salary) {
    moveToTrash(salary, 'salary');
  }
  const filtered = salaries.filter((s) => s.id !== id);
  saveSalaries(filtered);
  return filtered;
};

// Restore from trash
export const restoreFromTrash = (trashId) => {
  if (isGuestMode()) return null;
  const trash = getTrash();
  const item = trash.find((t) => t.id === trashId);
  if (!item) return null;

  const remainingTrash = trash.filter((t) => t.id !== trashId);
  saveTrash(remainingTrash);

  if (item.itemType === 'worker') {
    const workers = getWorkers();
    const workerData = { ...item };
    delete workerData.trashedAt;
    delete workerData.itemType;
    workers.push(workerData);
    saveWorkers(workers);
  } else if (item.itemType === 'salary') {
    const salaries = getSalaries();
    const salaryData = { ...item };
    delete salaryData.trashedAt;
    delete salaryData.itemType;
    salaries.push(salaryData);
    saveSalaries(salaries);
  }
  return item;
};

// Permanently delete from trash
export const permanentlyDeleteFromTrash = (trashId) => {
  if (isGuestMode()) return [];
  const trash = getTrash();
  const filtered = trash.filter((t) => t.id !== trashId);
  saveTrash(filtered);
  return filtered;
};

// ==================== DELETE OPTIONS ====================

// Delete selected workers
export const deleteSelectedWorkers = (ids) => {
  if (isGuestMode()) return [];
  ids.forEach((id) => deleteWorker(id));
  return getWorkers();
};

// Delete all workers and their salaries
export const deleteAllWorkers = () => {
  if (isGuestMode()) return [];
  const workers = getWorkers();
  const salaries = getSalaries();
  // Move all to trash
  workers.forEach((w) => moveToTrash(w, 'worker'));
  salaries.forEach((s) => moveToTrash(s, 'salary'));
  localStorage.removeItem(getUserKey(WORKERS_KEY));
  localStorage.removeItem(getUserKey(SALARIES_KEY));
  return [];
};

// Delete entire database
export const deleteEntireDatabase = () => {
  if (isGuestMode()) return false;
  const workers = getWorkers();
  const salaries = getSalaries();
  workers.forEach((w) => moveToTrash(w, 'worker'));
  salaries.forEach((s) => moveToTrash(s, 'salary'));
  localStorage.removeItem(getUserKey(WORKERS_KEY));
  localStorage.removeItem(getUserKey(SALARIES_KEY));
  localStorage.removeItem(getUserKey(SETTINGS_KEY));
  return true;
};

// ==================== BACKUP / RESTORE ====================

export const backupData = () => {
  if (isGuestMode()) return null;
  const data = {
    workers: getWorkers(),
    salaries: getSalaries(),
    settings: localStorage.getItem(getUserKey(SETTINGS_KEY)) ? JSON.parse(localStorage.getItem(getUserKey(SETTINGS_KEY))) : {},
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `SalaryManager_Backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  return data;
};

export const restoreData = () => {
  if (isGuestMode()) return Promise.reject('Guest mode cannot restore data');
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return reject('No file selected');
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.workers) {
            localStorage.setItem(getUserKey(WORKERS_KEY), JSON.stringify(data.workers));
          }
          if (data.salaries) {
            localStorage.setItem(getUserKey(SALARIES_KEY), JSON.stringify(data.salaries));
          }
          if (data.settings) {
            localStorage.setItem(getUserKey(SETTINGS_KEY), JSON.stringify(data.settings));
          }
          resolve(data);
        } catch {
          reject('Invalid backup file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
};

// ==================== AUTO SAVE / UPDATE ====================

let autoSaveEnabled = true;

export const setAutoSave = (enabled) => {
  if (isGuestMode()) return;
  autoSaveEnabled = enabled;
  if (enabled) {
    localStorage.setItem(getUserKey(SETTINGS_KEY), JSON.stringify({ autoSave: true }));
  } else {
    localStorage.setItem(getUserKey(SETTINGS_KEY), JSON.stringify({ autoSave: false }));
  }
};

export const isAutoSaveEnabled = () => {
  const settings = localStorage.getItem(getUserKey(SETTINGS_KEY));
  if (settings) {
    const parsed = JSON.parse(settings);
    return parsed.autoSave !== undefined ? parsed.autoSave : true;
  }
  return true;
};

const autoSaveDatabase = () => {
  if (!autoSaveEnabled) return;
};

let autoUpdateExcelEnabled = true;

export const setAutoUpdateExcel = (enabled) => {
  autoUpdateExcelEnabled = enabled;
};

const autoUpdateExcel = () => {
  if (!autoUpdateExcelEnabled) return;
};

// ==================== STATS HELPERS ====================

export const getStats = () => {
  const workers = getWorkers();
  const salaries = getSalaries();
  const totalSalary = salaries.reduce((sum, s) => sum + Number(s.totalSalary), 0);
  const totalAdvance = salaries.reduce((sum, s) => sum + Number(s.advance), 0);
  return {
    totalWorkers: workers.length,
    totalSalaryRecords: salaries.length,
    totalSalary,
    totalAdvance,
    totalFinalSalary: totalSalary - totalAdvance,
  };
};

// ==================== SAMPLE DATA (FOR GUEST MODE) ====================

export const loadSampleData = () => {
  const sampleWorkers = [];
  const sampleSalaries = [];

  const firstNames = ['Rahul', 'Amit', 'Sunil', 'Vijay', 'Rajesh', 'Deepak', 'Manish', 'Sanjay', 'Ravi', 'Prakash', 'Anil', 'Suresh', 'Vinod', 'Nitin', 'Kunal', 'Arvind', 'Dinesh', 'Mohan', 'Rakesh', 'Kishore'];
  const lastNames = ['Patel', 'Kumar', 'Sharma', 'Singh', 'Verma', 'Gupta', 'Yadav', 'Joshi', 'Pandey', 'Mishra', 'Saxena', 'Agarwal', 'Dubey', 'Tiwari', 'Trivedi', 'Dave', 'Shah', 'Mehta', 'Desai', 'Bhatt'];

  const statuses = ['Active', 'Active', 'Active', 'Inactive', 'Active'];
  const acStatuses = ['Paid', 'Pending', 'Partial Payment', 'Paid', 'Paid', 'Pending'];
  const confirms = ['Yes', 'No', 'Yes', 'Yes', 'No', 'Yes'];

  for (let i = 0; i < 50; i++) {
    const id = (i + 1).toString();
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;

    sampleWorkers.push({
      id,
      name,
      mobile: `98765${String(32100 + i).slice(0, 5)}`,
      joiningDate: `202${Math.floor(Math.random() * 5)}-0${Math.floor(Math.random() * 9) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
      createdAt: new Date().toISOString(),
    });

    const totalSalary = Math.floor(Math.random() * 15000 + 8000);
    const advance = Math.floor(Math.random() * 5000);
    const workingDays = Math.floor(Math.random() * 10 + 20);

    sampleSalaries.push({
      id: `s${i + 1}`,
      workerId: id,
      workingDays,
      totalSalary,
      advance,
      finalSalary: totalSalary - advance,
      acStatus: acStatuses[i % acStatuses.length],
      confirm: confirms[i % confirms.length],
      createdAt: new Date().toISOString(),
    });
  }

  localStorage.setItem('guest_workers', JSON.stringify(sampleWorkers));
  localStorage.setItem('guest_salaries', JSON.stringify(sampleSalaries));
  return { workers: sampleWorkers, salaries: sampleSalaries };
};

// Clear all trash
export const clearTrash = () => {
  if (isGuestMode()) return [];
  localStorage.removeItem(getUserKey(TRASH_KEY));
  return [];
};

// ==================== PERMISSION HELPERS ====================

export const canEdit = () => !isGuestMode();
export const canDelete = () => !isGuestMode();
export const canExport = () => !isGuestMode();
export const canBackup = () => !isGuestMode();
export const canRestore = () => !isGuestMode();
export const canAdd = () => !isGuestMode();
