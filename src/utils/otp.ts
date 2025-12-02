import crypto from 'crypto';

/**
 * Generate a random 6-digit OTP code
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate a random verification token (32 characters hex)
 */
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Get OTP expiration time (default 10 minutes)
 */
export const getOTPExpiration = (minutes: number = 10): Date => {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + minutes);
  return expiration;
};
