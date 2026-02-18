// Sanitize error messages to prevent information leakage
const sanitizeError = (error, defaultMessage = 'An error occurred') => {
  // List of sensitive error patterns to hide
  const sensitivePatterns = [
    /user already exists/i,
    /user not found/i,
    /email.*exists/i,
    /blocked until/i,
    /too many attempts/i,
    /invalid.*key/i,
    /unauthorized/i
  ];

  const errorMessage = error.message || error;

  // Check if error contains sensitive information
  const isSensitive = sensitivePatterns.some(pattern => pattern.test(errorMessage));

  if (isSensitive) {
    // Return generic message for sensitive errors
    if (errorMessage.toLowerCase().includes('already exists') || 
        errorMessage.toLowerCase().includes('registered')) {
      return 'Unable to process request. Please try a different email or login.';
    }
    if (errorMessage.toLowerCase().includes('too many') || 
        errorMessage.toLowerCase().includes('blocked')) {
      return 'Too many requests. Please try again later.';
    }
    if (errorMessage.toLowerCase().includes('not found')) {
      return 'Invalid credentials provided.';
    }
    return defaultMessage;
  }

  // Return original message for non-sensitive errors
  return errorMessage;
};

// Generic error messages for different operations
const errorMessages = {
  otp: {
    send: 'Unable to send verification code. Please try again.',
    verify: 'Verification failed. Please check your code and try again.',
    expired: 'Verification code has expired. Please request a new one.',
    invalid: 'Invalid verification code. Please try again.',
  },
  auth: {
    login: 'Invalid email or password.',
    register: 'Registration failed. Please try again.',
    reset: 'Password reset failed. Please try again.',
  },
  general: 'An error occurred. Please try again later.'
};

module.exports = {
  sanitizeError,
  errorMessages
};
