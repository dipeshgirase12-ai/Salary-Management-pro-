import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isGuestMode } from '../utils/auth';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const guestMode = isGuestMode();

  const actions = [
    {
      icon: 'worker',
      label: 'Add Worker',
      onClick: () => {
        setIsOpen(false);
        navigate('/workers?action=add');
      },
      show: !guestMode,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      icon: 'salary',
      label: 'Add Salary',
      onClick: () => {
        setIsOpen(false);
        navigate('/salaries?action=add');
      },
      show: !guestMode,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: 'attendance',
      label: 'Mark Attendance',
      onClick: () => {
        setIsOpen(false);
        navigate('/attendance?action=add');
      },
      show: !guestMode,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      icon: 'pdf',
      label: 'Generate PDF',
      onClick: () => {
        setIsOpen(false);
        navigate('/reports?action=pdf');
      },
      show: true,
      color: 'bg-red-500 hover:bg-red-600',
    },
  ];

  const getIcon = (icon) => {
    const icons = {
      worker: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
      salary: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
      attendance: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      pdf: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />,
      plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
      close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    };
    return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[icon]}</svg>;
  };

  return (
    <div className="sm:hidden fixed bottom-16 right-4 z-40">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Action buttons */}
      <div className={`flex flex-col-reverse items-end gap-2 mb-2 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {actions.map((action, index) => {
          if (action.show === false) return null;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`${action.color} text-white p-3 rounded-full shadow-lg flex items-center gap-2 transition-transform duration-200 hover:scale-110 active:scale-95`}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              {getIcon(action.icon)}
              <span className="text-sm font-medium pr-2 whitespace-nowrap bg-black/20 px-2 py-1 rounded-lg">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-700 rotate-45' : 'bg-blue-600'} text-white p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95`}
      >
        {getIcon(isOpen ? 'close' : 'plus')}
      </button>
    </div>
  );
};

export default FloatingActionButton;