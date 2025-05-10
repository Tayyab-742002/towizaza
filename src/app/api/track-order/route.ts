import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  console.log("Search params:", searchParams);
  const checkoutId = searchParams.get("checkoutId");
  if (!checkoutId) {
    return NextResponse.json(
      { error: "Missing required parameters: checkoutId and orderId" },
      { status: 400 }
    );
  }

  try {
    // Fetch the order from Sanity using both orderId and checkoutId
    const order = await client.fetch(
      `*[_type == "order" && stripeCheckoutId == $checkoutId]`,
      { checkoutId }
    );
    console.log("Found order:", order);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Return order details (omit sensitive info if needed)
    return NextResponse.json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
