import { NextRequest, NextResponse } from "next/server";
import { getOrderByOrderId } from "@/lib/sanity";

/**
 * API route to validate an order token
 * This endpoint checks if an order exists with the given token/ID
 */
export async function GET(request: NextRequest) {
  try {
    // Get the token from the query parameters
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Look up the order using the token (which is the order ID)
    const order = await getOrderByOrderId(token);

    if (!order) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 }
      );
    }

    // Return minimal order info to confirm it's valid
    // Don't return sensitive data
    return NextResponse.json({
      orderId: order.orderId,
      valid: true,
    });
  } catch (error) {
    console.error("Error validating order token:", error);
    return NextResponse.json(
      { error: "Failed to validate token" },
      { status: 500 }
    );
  }
}
