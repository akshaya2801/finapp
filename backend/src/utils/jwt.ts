import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
  };
  return jwt.sign(payload, (process.env.JWT_SECRET || 'secret') as any, options);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  };
  return jwt.sign(payload, (process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any, options);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, (process.env.JWT_SECRET || 'secret') as any) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, (process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any) as TokenPayload;
};
