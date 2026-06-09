// Simple logger that suppresses noise in production.

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  info: (...args) => {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.log(...args);
  },
  warn: (...args) => {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.warn(...args);
  },
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};

