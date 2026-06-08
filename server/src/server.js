import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';

// --- Admin user ---
// Store bcrypt hash ONLY on server.
// Set env ADMIN_USERNAME + ADMIN_PASSWORD_PLAIN to initialize once.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD_PLAIN;

let ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

async function ensureAdminHash() {
  if (ADMIN_PASSWORD_HASH) return;
  if (!ADMIN_PASSWORD_PLAIN) {
    throw new Error(
      'Missing ADMIN_PASSWORD_HASH or ADMIN_PASSWORD_PLAIN in environment.'
    );
  }
  const salt = await bcrypt.genSalt(12);
  ADMIN_PASSWORD_HASH = await bcrypt.hash(ADMIN_PASSWORD_PLAIN, salt);
}

function authFailure(res) {
  // Do not reveal whether username exists.
  return res.status(401).json({ error: 'Invalid username or password' });
}

app.post('/api/admin/login', async (req, res) => {
  try {
    await ensureAdminHash();

    const { username, password } = req.body || {};

    // Always run bcrypt comparison to avoid timing/enum leaks.
    // If username mismatch, compare password against a known hash anyway.
    const userMatch = String(username || '') === ADMIN_USERNAME;

    const safeHash = ADMIN_PASSWORD_HASH;
    const passwordMatches = await bcrypt.compare(String(password || ''), safeHash);

    if (!userMatch || !passwordMatches) {
      return authFailure(res);
    }

    const token = jwt.sign(
      { role: 'admin', username: ADMIN_USERNAME },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({ token });
  } catch (e) {
    console.error('Login error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});

