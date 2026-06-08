const AUTH_KEY = 'salary_manager_admin_auth_token';
const USER_ID_KEY = 'salary_manager_user_id';
const USER_NAME_KEY = 'salary_manager_user_name';
const GUEST_MODE_KEY = 'salary_manager_guest_mode';

// JWT-based auth (server issues JWT). Frontend stores ONLY token.
export const login = async ({ username, password }) => {
  const { adminLoginApi } = await import('./authApi.js');
  const res = await adminLoginApi({ username, password });

  if (!res.ok) return false;

  localStorage.setItem(AUTH_KEY, res.token);
  localStorage.setItem(USER_ID_KEY, res.userId || username);
  localStorage.setItem(USER_NAME_KEY, username);
  localStorage.removeItem(GUEST_MODE_KEY);
  return true;
};

export const loginAsGuest = () => {
  localStorage.setItem(GUEST_MODE_KEY, 'true');
  localStorage.setItem(USER_ID_KEY, 'guest');
  localStorage.setItem(USER_NAME_KEY, 'Guest');
  localStorage.removeItem(AUTH_KEY);
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(GUEST_MODE_KEY);
};

export const isLoggedIn = () => {
  try {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) return false;
    return true;
  } catch {
    return false;
  }
};

export const isGuestMode = () => {
  return localStorage.getItem(GUEST_MODE_KEY) === 'true';
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY) || null;
};

export const getUserName = () => {
  return localStorage.getItem(USER_NAME_KEY) || 'Guest';
};


