import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import * as bcrypt from 'bcrypt';
import { serialize, parse } from 'cookie';
import * as crypto from 'crypto';
import { createToken, setTokenCookie } from '../../../utils/jwt';

// Define timeout durations in milliseconds
const TIMEOUT_DURATIONS: Record<number, number> = {
  1: 10 * 60 * 1000,     // 10 minutes
  2: 30 * 60 * 1000,     // 30 minutes
  3: 60 * 60 * 1000,     // 1 hour
  4: 2 * 60 * 60 * 1000, // 2 hours
  5: 24 * 60 * 60 * 1000 // 24 hours
};

// Secret key for encryption (in production, use environment variables)
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'your-secret-key-change-in-production';

// Encrypt data for storage in cookie
function encryptData(data: any): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(COOKIE_SECRET.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

// Decrypt data from cookie
function decryptData(encryptedData: string): any {
  try {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(COOKIE_SECRET.padEnd(32).slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
}

// Define throttling data interface
interface ThrottleData {
  attempts: number;
  timeoutLevel: 0 | 1 | 2 | 3 | 4 | 5;
  timeoutUntil: number;
}

// Handle invalid login attempt
async function handleInvalidLogin(email: string, res: NextApiResponse, req: NextApiRequest): Promise<void> {
  const throttleCookieName = `admin_login_throttle_${email?.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const cookies = parse(req.headers.cookie || '');
  let throttleData = cookies[throttleCookieName] ? decryptData(cookies[throttleCookieName]) : null;
  
  // Initialize or update throttle data
  if (!throttleData) {
    throttleData = {
      attempts: 1,
      timeoutLevel: 0 as ThrottleData['timeoutLevel'],
      timeoutUntil: 0
    };
  } else {
    throttleData.attempts += 1;
  }
  
  // Check if we need to implement a timeout
  if (throttleData.attempts >= 3) {
    // Increase timeout level after each set of 3 attempts
    const newLevel = Math.min(5, Math.floor(throttleData.attempts / 3)) as ThrottleData['timeoutLevel'];
    throttleData.timeoutLevel = newLevel;
    
    // Only apply timeout if level is 1-5
    if (throttleData.timeoutLevel > 0) {
      throttleData.timeoutUntil = Date.now() + TIMEOUT_DURATIONS[throttleData.timeoutLevel];
    }
    
    // Reset attempts counter but maintain timeout level
    throttleData.attempts = 0;
  }
  
  // Set the throttle cookie
  const encryptedData = encryptData(throttleData);
  const maxAge = 24 * 60 * 60; // Store for 24 hours
  
  const cookie = serialize(throttleCookieName, encryptedData, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge,
    path: '/',
  });
  
  res.setHeader('Set-Cookie', cookie);
}

// Reset throttle cookie on successful login
function resetThrottleCookie(email: string, res: NextApiResponse, req: NextApiRequest): void {
  const throttleCookieName = `admin_login_throttle_${email?.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const cookies = parse(req.headers.cookie || '');
  let throttleData = cookies[throttleCookieName] ? decryptData(cookies[throttleCookieName]) : null;
  
  // Keep the timeout level but reset attempts
  if (throttleData) {
    throttleData.attempts = 0;
    
    // Set the updated cookie
    const encryptedData = encryptData(throttleData);
    const cookie = serialize(throttleCookieName, encryptedData, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });
    
    res.setHeader('Set-Cookie', cookie);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Check if the user is currently blocked
    const throttleCookieName = `admin_login_throttle_${email?.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const cookies = parse(req.headers.cookie || '');
    const throttleCookie = cookies[throttleCookieName];
    
    if (throttleCookie) {
      const throttleData = decryptData(throttleCookie);
      
      // If there's valid throttling data
      if (throttleData) {
        const { attempts, timeoutLevel, timeoutUntil } = throttleData;
        
        // Check if the user is still in timeout
        if (timeoutUntil > Date.now()) {
          const remainingTime = Math.ceil((timeoutUntil - Date.now()) / (60 * 1000)); // in minutes
          return res.status(429).json({
            message: `Too many failed login attempts. Please try again in ${remainingTime} minute(s).`,
            lockedUntil: timeoutUntil
          });
        }
      }
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the admin by email
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    console.log('Admin found:', admin);

    if (!admin) {
      // Handle invalid credentials - user not found
      await handleInvalidLogin(email, res, req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      // Handle invalid credentials - wrong password
      await handleInvalidLogin(email, res, req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // If we reach here, login is successful, reset the throttle cookie
    resetThrottleCookie(email, res, req);

    // Create a JWT token
    const token = createToken({ 
      id: admin.id, 
      email: admin.email,
      firstName: admin.firstName || null, // Include firstName, use null if undefined
      lastName: admin.lastName || null,   // Include lastName, use null if undefined
      role: 'admin'
    });

    // Set the cookie
    const cookie = setTokenCookie(token);

    res.setHeader('Set-Cookie', cookie);
    
    // Return success without exposing sensitive data
    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
