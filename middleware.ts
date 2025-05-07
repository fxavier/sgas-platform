import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define context keys for storing values in headers
export const TENANT_ID_HEADER = 'x-tenant-id';
export const PROJECT_ID_HEADER = 'x-project-id';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Only apply middleware to API routes and protected pages
  if (
    path.startsWith('/api/forms') ||
    path.startsWith('/api/projects') ||
    path.startsWith('/api/tenants') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/forms')
  ) {
    // Get tenant and project from URL query parameters
    const tenantId = request.nextUrl.searchParams.get('tenantId');
    const projectId = request.nextUrl.searchParams.get('projectId');

    // Create a new response
    const response = NextResponse.next();

    // Add context headers if they exist
    if (tenantId) {
      response.headers.set(TENANT_ID_HEADER, tenantId);
    }

    if (projectId) {
      response.headers.set(PROJECT_ID_HEADER, projectId);
    }

    return response;
  }

  // Skip middleware for all other requests
  return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    '/api/forms/:path*',
    '/api/projects/:path*',
    '/api/tenants/:path*',
    '/dashboard/:path*',
    '/forms/:path*',
  ],
};
