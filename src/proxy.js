// This file is not needed since we're using localStorage for token storage
// which is client-side only. We handle authentication checks in:
// 1. Client-side route guards (dashboard/page.js)
// 2. API route protection (checking Authorization header)

import { NextResponse } from "next/server";

// If you want to use middleware, you would need to:
// 1. Store tokens in httpOnly cookies instead of localStorage
// 2. Rename this file to middleware.js
// 3. Update apiService to send cookies instead of localStorage

export function proxy(request) {
  // Currently disabled - using client-side auth checks
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
