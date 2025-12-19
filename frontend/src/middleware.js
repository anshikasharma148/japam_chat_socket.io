import { NextResponse } from 'next/server';

export function middleware(request) {
  // This is a client-side check, so we'll handle auth in components
  // This middleware is a placeholder for future server-side auth checks
  return NextResponse.next();
}

export const config = {
  matcher: ['/chat/:path*'],
};


