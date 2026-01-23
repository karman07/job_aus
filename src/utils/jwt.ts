import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

export const generateTokens = (userId: string, email?: string, role?: string) => {
  const payload = email && role ? { userId, email, role } : { userId };
  
  const accessToken = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  // The admin login creates tokens with a different format
  // We need to handle both formats
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

export const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateResetPasswordToken = () => {
  return crypto.randomBytes(32).toString('hex');
};