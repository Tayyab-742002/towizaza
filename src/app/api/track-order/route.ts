import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkoutId = searchParams.get("checkoutId");
  const orderId = searchParams.get("orderId");

  // Set cache control headers
  const headers = {
    "Cache-Control": "no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  if (!checkoutId || !orderId) {
    return NextResponse.json(
      { error: "Missing required parameters: checkoutId and orderId" },
      { status: 400, headers }
    );
  }

  try {
    // Fetch the order from Sanity using both orderId and checkoutId
    const order = await client.fetch(
      `*[_type == "order" && stripeCheckoutId == $checkoutId && _id == $orderId][0]`,
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
        orderId: order._id,
        checkoutId: order.stripeCheckoutId,
        customerName: order.customerInfo?.name,
        customerEmail: order.customerInfo?.email,
        items: order.items,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        tax: order.tax,
        total: order.total,
        currency: order.currency,
        shippingAddress: order.shippingAddress,
        status: order.status,
        createdAt: order._createdAt,
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
