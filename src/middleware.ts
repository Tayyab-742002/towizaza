import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Different cache strategies for different routes
  if (pathname.startsWith("/api/")) {
    // API routes - no caching
    response.headers.set("Cache-Control", "no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  } else if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    // Static files - cache for 1 week
    response.headers.set("Cache-Control", "public, max-age=604800, immutable");
  } else {
    // Dynamic pages - cache for 1 minute
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, must-revalidate"
    );
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
