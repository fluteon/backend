// Production-safe logger utility
const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  info: (...args) => {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  },
  
  error: (...args) => {
    // Always log errors, but sanitize sensitive data
    const sanitizedArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        const { password, token, jwt, apiKey, ...rest } = arg;
        return rest;
      }
      return arg;
    });
    console.error('[ERROR]', ...sanitizedArgs);
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },
  
  debug: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  success: (...args) => {
    if (isDevelopment) {
      console.log('[SUCCESS]', ...args);
    }
  }
};

module.exports = logger;
