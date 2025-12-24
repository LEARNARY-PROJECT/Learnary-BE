import crypto from 'crypto';
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
export const getOTPExpiration = (minutes: number = 10): Date => {
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + minutes);
  return expiration;
};
