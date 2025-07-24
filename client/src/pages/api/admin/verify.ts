import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { getToken, verifyToken } from '../../../utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ authenticated: false });
    }

    // Verify admin exists
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!admin) {
      return res.status(401).json({ authenticated: false });
    }

    return res.status(200).json({ 
      authenticated: true, 
      admin 
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
