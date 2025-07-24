import { NextApiResponse } from 'next';
import { adminAuthMiddleware, AuthenticatedRequest } from './adminAuthMiddleware';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ApiHandler = {
  [key in ApiMethod]?: (
    req: AuthenticatedRequest,
    res: NextApiResponse
  ) => Promise<void | NextApiResponse> | void | NextApiResponse;
};

/**
 * Creates a protected API route with admin authentication middleware
 * 
 * @param handlers Object containing handler functions for different HTTP methods
 * @returns Handler function for NextJS API routes
 */
export function createAdminProtectedHandler(handlers: ApiHandler) {
  return adminAuthMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const method = req.method as ApiMethod;
    
    // Check if the method is allowed
    if (!handlers[method]) {
      return res.status(405).json({ message: `Method ${method} not allowed` });
    }

    try {
      // Call the handler for the method
      return await handlers[method]!(req, res);
    } catch (error) {
      console.error(`Error in ${method} handler:`, error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      });
    }
  });
}
