const AUTH_KEY = 'salary_manager_admin_auth_token';
const USER_ID_KEY = 'salary_manager_user_id';
const USER_NAME_KEY = 'salary_manager_user_name';
const GUEST_MODE_KEY = 'salary_manager_guest_mode';

// Local credential check — no backend server needed
// Change these to set your own admin credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

export const login = async ({ username, password }) => {
  // Simple client-side credential check
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return false;
  }

  localStorage.setItem(AUTH_KEY, 'local-auth-token');
  localStorage.setItem(USER_ID_KEY, username);
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


