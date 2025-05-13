import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import "dotenv/config";
// import { processSuccessfulPayment, processFailedPayment } from "@/lib/orders";

import stripe from "@/lib/stripe";
import { processFailedPayment, processSuccessfulPayment } from "@/lib/sanity";
import { Currency } from "lucide-react";
import { sendOrderProcessingSucceededEmail } from "@/lib/utils";
// This disables the default body parser to receive the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle different event types
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PAYMENT INTENT SUCCEEDED : ", paymentIntent);
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(failedPaymentIntent);
        break;
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

// Event handlers
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  // Extract order ID from the payment intent metadata
  const orderId = paymentIntent.metadata.orderId;

  if (orderId) {
    await processSuccessfulPayment(paymentIntent.id, orderId);
  } else {
    console.warn(
      `PaymentIntent ${paymentIntent.id} has no associated orderId in metadata`
    );
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Extract order ID from the payment intent metadata
  const orderId = paymentIntent.metadata.orderId;

  if (orderId) {
    await processFailedPayment(paymentIntent.id);
  } else {
    console.warn(
      `Failed PaymentIntent ${paymentIntent.id} has no associated orderId in metadata`
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  // For checkout sessions, we need to extract order information and process accordingly
  console.log("🔴🔴🔴🔴🔴🔴🔴TRIGGERED CHECKOUT SESSION");

  // If the session has a payment_intent, we can retrieve that
  if (session.payment_intent && typeof session.payment_intent === "string") {
    console.log("🟢🟢🟢🟢🟢🟢🟢INSIDE IF ELSE");
    try {
      console.log("🟢🟢🟢🟢🟢🟢🟢INSIDE TRY CATCH");
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      );
      console.log("PAYMENT INTENT : ", paymentIntent);
      const orderId =
        paymentIntent.metadata.orderId || session.metadata?.orderId;
      console.log("ORDER ID : ", orderId);
      if (orderId) {
        const result = await processSuccessfulPayment(
          paymentIntent.id,
          orderId
        );
        if (result) {
          try {
            const customerEmail = session.customer_details?.email;
            const customerName = session.customer_details?.name || "Customer";
            const customerPhone = session.customer_details?.phone;
            const orderId = session.metadata?.orderId;
            const checkoutId = session.id;
            if (!customerEmail) {
              console.warn("No customer email found in session");
              return;
            }
            // Get line items from the session
            const lineItems = await stripe.checkout.sessions.listLineItems(
              session.id,
              {
                expand: ["data.price.product"],
              }
            );

            // Format items for the email template
            const items = lineItems.data.map((item) => {
              const product = item.price?.product as Stripe.Product;
              return {
                productId: item.id,
                productName: product.name || "Product",
                quantity: item.quantity || 1,
                price: (item.amount_total || 0) / 100,
                // You can add more data if available in your products
                image: product.images?.[0],
              };
            });

            // Extract shipping address from the session
            const shippingAddress = {
              line1: session.customer_details?.address?.line1 || "",
              line2: session?.customer_details?.address?.line1 || undefined,
              city: session.customer_details?.address?.city || "",
              state: session.customer_details?.address?.state || "",
              postalCode: session.customer_details?.address?.postal_code || "",
              country: session.customer_details?.address?.country || "",
            };

            // Calculate order totals
            const subtotal = (session.amount_subtotal || 0) / 100;
            const shippingCost = session.total_details?.amount_shipping
              ? session.total_details.amount_shipping / 100
              : 0;
            const tax = session.total_details?.amount_tax
              ? session.total_details.amount_tax / 100
              : 0;
            const total = (session.amount_total || 0) / 100;

            // Create an object
            const emailData = {
              orderId,
              customerInfo: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
              },
              items: items,
              subtotal,
              shippingCost,
              tax,
              total,
              currency: session.currency,
              checkoutId,
              shippingAddress,
            };

            await sendOrderProcessingSucceededEmail(emailData);
          } catch (error) {
            console.error("Error sending order confirmation email:", error);
            // Continue processing the webhook even if email fails
          }
        }
      } else {
        console.warn(
          `Checkout session ${session.id} has no associated orderId in metadata`
        );
      }
    } catch (error) {
      console.error(
        "Error retrieving payment intent from checkout session:",
        error
      );
    }
  } else {
    console.log(
      `Checkout session completed: ${session.id}, but no payment_intent found`
    );
  }
}
