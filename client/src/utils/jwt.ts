import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { serialize, parse } from 'cookie';

// JWT secret key - in production, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_NAME = 'admin_token';

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRY = 60 * 60 * 24;

export interface JwtPayload {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
}

// Generate JWT token
export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
}

// Verify JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

// Get token from request cookies
export function getTokenFromCookies(req: NextApiRequest): string | null {
  const cookies = parse(req.headers.cookie || '');
  return cookies[TOKEN_NAME] || null;
}

// Get token from authorization header
export function getTokenFromHeader(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
}

// Get token from either cookies or authorization header
export function getToken(req: NextApiRequest): string | null {
  return getTokenFromCookies(req) || getTokenFromHeader(req);
}

// Set JWT token as cookie
export function setTokenCookie(token: string) {
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: TOKEN_EXPIRY,
    path: '/',
  });
}

// Clear JWT token cookie
export function clearTokenCookie() {
  return serialize(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, // Delete the cookie
    path: '/',
  });
}
