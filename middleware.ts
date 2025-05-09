import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Protect the checkout success route
  if (path === "/checkout/success") {
    // Check if the request has a valid token parameter
    const token = request.nextUrl.searchParams.get("token");

    // If there's no token and the request is direct (not from Stripe), redirect to home
    const referer = request.headers.get("referer") || "";
    const isFromStripe = referer.includes("stripe.com");

    if (!token && !isFromStripe) {
      // No token and not coming from Stripe, redirect to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Continue processing the request for all other routes
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ["/checkout/success"],
};
