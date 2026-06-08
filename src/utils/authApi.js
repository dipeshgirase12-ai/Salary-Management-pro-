const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:3001';

export async function adminLoginApi({ username, password }) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return { ok: false };
  }

  const data = await res.json();
  return { ok: true, token: data.token, userId: username };
}


