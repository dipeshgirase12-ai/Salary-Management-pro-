import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, isGuestMode } from '../utils/auth';

const BottomNav = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const guestMode = isGuestMode();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { path: '/', icon: 'home', label: 'Home' },
    { path: '/workers', icon: 'workers', label: 'Workers' },
    { path: '/attendance', icon: 'attendance', label: 'Attendance' },
    { path: '/reports', icon: 'reports', label: 'Reports' },
  ];

  const moreItems = [
    { path: '/settings', icon: 'settings', label: 'Settings', show: true },
    { path: '/trash', icon: 'trash', label: 'Trash', show: !guestMode },
    { action: 'backup', icon: 'backup', label: 'Backup', show: !guestMode },
    { action: 'restore', icon: 'restore', label: 'Restore', show: !guestMode },
  ];

  const getIcon = (icon, className = 'w-6 h-6') => {
    const icons = {
      home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      workers: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
      attendance: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      reports: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
      trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
      backup: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />,
      restore: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
      more: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />,
    };
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
    );
  };

  return (
    <>
      {/* Desktop: No bottom nav */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[60px] ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {getIcon(item.icon, 'w-5 h-5')}
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[60px] ${
              showMore
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getIcon('more', 'w-5 h-5')}
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>

        {/* More Menu Dropup */}
        {showMore && (
          <div className="absolute bottom-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg pb-2">
            <div className="grid grid-cols-4 gap-1 p-2">
              {moreItems.map((item, index) => {
                if (item.show === false) return null;
                if (item.action) {
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setShowMore(false);
                        if (item.action === 'backup') {
                          import('../utils/storage').then(({ backupData }) => backupData());
                        } else if (item.action === 'restore') {
                          import('../utils/storage').then(({ restoreData }) => restoreData().then(() => window.location.reload()));
                        }
                      }}
                      className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
                    >
                      {getIcon(item.icon, 'w-5 h-5')}
                      <span className="text-[10px] font-medium text-center">{item.label}</span>
                    </button>
                  );
                }
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMore(false)}
                    className="flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
                  >
                    {getIcon(item.icon, 'w-5 h-5')}
                    <span className="text-[10px] font-medium text-center">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            {!guestMode && (
              <button
                onClick={() => {
                  setShowMore(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-all border-t border-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Spacer for fixed bottom nav on mobile */}
      <div className="sm:hidden h-14" />
    </>
  );
};

export default BottomNav;