import { EmailTemplate } from "@/components/email-templates/OrderConfirmation.email";
import { Resend } from "resend";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get order data
    const orderData = await request.json();

    const {
      orderId,
      customerInfo,
      items,
      subtotal,
      shippingCost,
      tax,
      total,
      currency,
      shippingAddress,
    } = orderData;

    if (!orderId || !customerInfo || !items || !shippingAddress) {
      return Response.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    // Send the order confirmation email
    const { data, error } = await resend.emails.send({
      // from: process.env.EMAIL_FROM || "Orders <orders@yourdomain.com>",
      from: "Orders <orders@resend.dev>",
      // to: [customerInfo.email],
      to: process.env.ADMIN_EMAIL! || "towizaza352@gmail.com",
      subject: `Order Confirmation #${orderId}`,
      react: EmailTemplate({
        orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        items,
        checkoutId: orderData?.checkoutId,
        subtotal,
        shippingCost,
        tax,
        total,
        currency,
        shippingAddress,
      }) as React.ReactNode,
    });

    // Record that the email was sent in your database if needed
    // This would be a good place to update the order record

    if (error) {
      console.error("Error sending email:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: "Order confirmation email sent",
      data,
    });
  } catch (error) {
    console.error("Error processing order confirmation:", error);
    return Response.json(
      { error: "Failed to process order confirmation" },
      { status: 500 }
    );
  }
}
