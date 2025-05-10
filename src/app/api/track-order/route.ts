import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkoutId = searchParams.get("checkoutId");
  const orderId = searchParams.get("orderId");
  console.log("orderId", orderId);
  console.log("checkoutId", checkoutId);
  // Set cache control headers
  const headers = {
    "Cache-Control": "no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (!checkoutId || !orderId) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers }
    );
  }

  try {
    // Fetch the order from Sanity using both orderId and checkoutId
    const order = await client.fetch(
      `*[_type == "order" && stripeCheckoutId == $checkoutId && orderId == $orderId]`,
      { checkoutId, orderId }
    );
    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404, headers }
      );
    }

    // Return order details with cache control headers
    return NextResponse.json(
      {
        message: "Order fetched successfully",
        data: order,
      },
      { headers }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500, headers }
    );
  }
}
