import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout, isGuestMode } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const guestMode = isGuestMode();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
    }`;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between min-h-16 py-3 gap-4">
          <NavLink to="/" className="flex flex-col items-start gap-0 text-xl font-bold text-blue-700">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Salary Manager Pro
            </div>
            <span className="text-[10px] font-normal text-blue-500 -mt-1">Dipesh Developer</span>
          </NavLink>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap justify-end">
            {guestMode && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                DEMO MODE
              </span>
            )}
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/workers" className={linkClass}>
              Workers
            </NavLink>
            <NavLink to="/salaries" className={linkClass}>
              Salaries
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 py-2 pb-3">
            {guestMode && (
              <span className="inline-block mx-4 mb-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                DEMO MODE
              </span>
            )}
            <NavLink to="/" className={linkClass} end onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/workers" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
              Workers
            </NavLink>
            <NavLink to="/salaries" className={linkClass} onClick={() => setMobileMenuOpen(false)}>
              Salaries
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left mx-2 mt-2 px-4 py-3 rounded-lg text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
