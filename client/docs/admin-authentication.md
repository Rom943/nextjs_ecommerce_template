# Admin Authentication System

This document outlines the JWT authentication system implemented for admin routes in the Next.js e-commerce template.

## Components

### JWT Utilities (`/src/utils/jwt.ts`)
- `createToken()`: Generates a JWT token with admin user payload
- `verifyToken()`: Validates JWT tokens and returns the decoded payload
- `getToken()`: Retrieves token from cookies or authorization header
- `setTokenCookie()`: Creates HTTP cookie with JWT token
- `clearTokenCookie()`: Clears the JWT authentication cookie

### Admin Auth Middleware (`/src/utils/adminAuthMiddleware.ts`)
- Server-side middleware function to protect API routes
- Verifies JWT tokens and adds admin user data to the request object
- Handles authentication errors with appropriate status codes

### API Route Handler (`/src/utils/apiHandler.ts`)
- Creates protected API endpoints with admin authentication
- Provides a clean way to define handlers for different HTTP methods
- Handles errors and ensures consistent API responses

### Admin API Utility (`/src/utils/adminApi.ts`)
- Client-side utility for making authenticated API requests
- Handles errors, authentication, and response parsing
- Provides a clean interface for React components to interact with the API

### Next.js Middleware (`/middleware.ts`)
- Global middleware to protect admin routes
- Redirects unauthenticated users to login page
- Returns 401 for unauthorized API requests

## Authentication Flow

1. **Login**:
   - User submits credentials to `/api/admin/login`
   - Server validates credentials and generates JWT token
   - Token is set as an HTTP-only cookie

2. **Protected Pages**:
   - `withAdminAuth` utility checks authentication on server-side
   - Redirects to login if token is invalid or missing
   - Provides admin user data to protected pages

3. **API Routes**:
   - Protected with `adminAuthMiddleware` or `createAdminProtectedHandler`
   - Validates JWT token before processing requests
   - Returns appropriate error responses for unauthorized requests

4. **Logout**:
   - Clears the authentication cookie
   - Redirects user to login page

## Security Features

- HTTP-only cookies to prevent JavaScript access to tokens
- Token expiration to limit session duration
- Server-side validation of tokens
- Protection against CSRF attacks with SameSite cookie policy
- Secure cookies in production environment

## Usage Examples

### Creating a protected API route:

```typescript
import { createAdminProtectedHandler } from '../../utils/apiHandler';
import { prisma } from '../../../lib/prisma';

export default createAdminProtectedHandler({
  // GET handler
  GET: async (req, res) => {
    const products = await prisma.product.findMany();
    return res.status(200).json({ products });
  },
  
  // POST handler
  POST: async (req, res) => {
    const { name, price } = req.body;
    const product = await prisma.product.create({
      data: { name, price }
    });
    return res.status(201).json({ product });
  }
});
```

### Making authenticated API requests from components:

```typescript
import { adminApiRequest } from '../../utils/adminApi';

// In a React component
const fetchProducts = async () => {
  const response = await adminApiRequest('/products');
  if (response.error) {
    console.error(response.error);
    return;
  }
  setProducts(response.data.products);
};
```

### Protecting a page with server-side authentication:

```typescript
import { GetServerSideProps } from 'next';
import { withAdminAuth } from '../utils/withAdminAuth';

export default function AdminDashboard({ admin }) {
  return (
    <div>
      <h1>Welcome, {admin.email}</h1>
      {/* Dashboard content */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withAdminAuth;
```
