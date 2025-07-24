import { NextApiRequest, NextApiResponse } from 'next';
import { clearTokenCookie } from '../../../utils/jwt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear the cookie
  const cookie = clearTokenCookie();

  res.setHeader('Set-Cookie', cookie);
  
  return res.status(200).json({ success: true });
}
