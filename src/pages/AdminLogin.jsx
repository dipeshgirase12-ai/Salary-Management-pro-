import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginAsGuest, isLoggedIn, isGuestMode } from '../utils/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loggedIn = useMemo(() => isLoggedIn(), []);
  const guest = useMemo(() => isGuestMode(), []);

  useEffect(() => {
    if (loggedIn || guest) navigate('/');
  }, [loggedIn, guest, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const ok = await login({ username, password });
    if (!ok) {
      setError('Invalid username or password');
      return;
    }

    navigate('/');
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-sm text-gray-600 mt-1">Please enter the admin credentials to open the web.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
              <input
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}

                autoComplete="username"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

                autoComplete="current-password"
              />
            </div>

            {error && <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Credentials are stored only on-device (localStorage).
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

