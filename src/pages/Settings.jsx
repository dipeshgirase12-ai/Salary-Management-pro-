import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, isGuestMode } from '../utils/auth';
import { backupData, restoreData } from '../utils/storage';

const Settings = () => {
  const navigate = useNavigate();
  const guestMode = isGuestMode();
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const handleBackup = () => {
    if (guestMode) return;
    try {
      backupData();
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    } catch (error) {
      console.error('Backup failed:', error);
    }
  };

  const handleRestore = async () => {
    if (guestMode) return;
    try {
      await restoreData();
      setRestoreSuccess(true);
      setTimeout(() => {
        setRestoreSuccess(false);
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const settingsGroups = [
    {
      title: 'Data Management',
      items: [
        {
          icon: 'backup',
          label: 'Backup Data',
          description: 'Download all your data as JSON',
          action: handleBackup,
          show: !guestMode,
          color: 'blue',
        },
        {
          icon: 'restore',
          label: 'Restore Data',
          description: 'Import data from backup file',
          action: handleRestore,
          show: !guestMode,
          color: 'green',
        },
      ],
    },
    {
      title: 'Appearance',
      items: [
        {
          icon: 'theme',
          label: 'Dark Mode',
          description: 'Switch between light and dark theme',
          action: () => setDarkMode(!darkMode),
          show: true,
          color: 'purple',
          hasToggle: true,
          value: darkMode,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'logout',
          label: 'Logout',
          description: 'Sign out of your account',
          action: () => setShowLogoutConfirm(true),
          show: true,
          color: 'red',
        },
      ],
    },
  ];

  const getIcon = (icon, className = 'w-6 h-6') => {
    const icons = {
      backup: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
      restore: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
      theme: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
      logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
      warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    };
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
    );
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your app preferences</p>
      </div>

      {/* Success Messages */}
      {backupSuccess && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Backup downloaded successfully!
        </div>
      )}
      {restoreSuccess && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Data restored successfully!
        </div>
      )}

      {/* Settings Groups */}
      {settingsGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-6">
          <h2 className="font-semibold text-gray-800 text-sm uppercase text-gray-500 mb-2 px-1">
            {group.title}
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {group.items.map((item, itemIndex) => {
              if (item.show === false) return null;
              return (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className={`${colorClasses[item.color].bg} ${colorClasses[item.color].text} p-3 rounded-xl`}>
                    {getIcon(item.icon)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-800">{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                  {item.hasToggle ? (
                    <div className={`relative w-12 h-7 rounded-full transition-colors ${item.value ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                  ) : item.icon !== 'theme' ? (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* App Info */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold text-lg">Salary Manager Pro</h3>
            <p className="text-blue-100 text-xs">Dipesh Developer</p>
          </div>
        </div>
        <p className="text-blue-100 text-sm">Version 1.0.0</p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                {getIcon('warning', 'w-6 h-6 text-red-600')}
              </div>
              <h2 className="text-xl font-bold text-gray-800">Logout?</h2>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;