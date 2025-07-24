import { NextApiRequest, NextApiResponse } from 'next';
import { getToken, verifyToken } from './jwt';
import { prisma } from '../../lib/prisma';

export interface AuthenticatedRequest extends NextApiRequest {
  admin?: {
    id: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
  };
}

type ApiHandler = (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void | NextApiResponse> | void | NextApiResponse;

export function adminAuthMiddleware(handler: ApiHandler): ApiHandler {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get the token from the request
      const token = getToken(req);

      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Verify the token
      const decodedToken = verifyToken(token);
      if (!decodedToken) {
        return res.status(401).json({ message: 'Invalid authentication token' });
      }

      // Check if the admin still exists
      const admin = await prisma.admin.findUnique({
        where: { id: decodedToken.id },
        select: { 
          id: true, 
          email: true,
          firstName: true,
          lastName: true
        }
      });

      if (!admin) {
        return res.status(401).json({ message: 'Admin user not found' });
      }

      // Add admin object to the request
      req.admin = {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'admin'
      };

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
