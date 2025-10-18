import { signOut } from 'next-auth/react';
import { Middleware } from '../fetch/fetch';

// Response interceptor that auto-logs out on 401/403
const responseInterceptor: Middleware<Response> = async (response: Response) => {
  // Check for unauthorized or forbidden
  if (response.status === 401 || response.status === 403) {
    // 1. Clear NextAuth session cookies
    await signOut({ redirect: false });

    // 2. Navigate user to home/login page
    if (typeof window !== 'undefined') {
      window.location.href = '/'; // redirect immediately
    }

    // 3. Throw an error to stop request processing
    throw new Error('Unauthorized - logged out');
  }

  // Return response normally if no issue
  return response;
};

export default responseInterceptor;
