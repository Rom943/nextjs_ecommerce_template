import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { JwtPayload } from './src/utils/jwt';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if the request is for an admin API route
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Skip the login endpoint
    if (request.nextUrl.pathname === '/api/admin/login') {
      return NextResponse.next();
    }
    
    // Check for token in cookies
    const token = request.cookies.get('admin_token')?.value;
    
    // If no token is found, return 401 Unauthorized
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }
  
  // Check if the request is for an admin page route
  if (
    request.nextUrl.pathname.startsWith('/admin_dashboard') ||
    request.nextUrl.pathname.startsWith('/admin/') 
  ) {
    // Check for token in cookies
    const token = request.cookies.get('admin_token')?.value;
    
    // If no token is found, redirect to login
    if (!token) {
      const url = new URL('/admin_login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Specify the paths for which this middleware will run
export const config = {
  matcher: [
    // Match all admin API routes
    '/api/admin/:path*', 
    // Match all admin frontend routes
    '/admin_dashboard/:path*',
    '/admin/:path*'
  ],
};
