import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { nanoid } from "nanoid";
import { createOrder, updateOrder } from "@/lib/sanity";

// Define interfaces for request data
interface CustomerAddress {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: CustomerAddress;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  variant: string | null;
  size: string | null;
  image: string;
}

interface CheckoutRequestBody {
  cartItems: CartItem[];
  customerInfo: CustomerInfo;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as CheckoutRequestBody;
    const { cartItems, customerInfo } = body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid cart items" },
        { status: 400 }
      );
    }

    // Generate a unique order ID
    const orderId = nanoid(8).toUpperCase();

    // Prepare line items for Stripe
    const lineItems = cartItems.map((item) => {
      const unitAmount = Math.round(item.price * 100); // Convert to cents

      // Create the product data object
      const productData: any = {
        name: item.title,
        images: item.image ? [item.image] : [],
      };

      // Only add description if it's not empty
      const description =
        `${item.variant || ""} ${item.size ? `- Size: ${item.size}` : ""}`.trim();
      if (description) {
        productData.description = description;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: productData,
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Store initial order in Sanity with pending status
    const orderData = {
      orderId,
      status: "pending",
      createdAt: new Date().toISOString(),
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || "",
      },
      billingAddress: {
        line1: customerInfo.address.line1 || "",
        city: customerInfo.address.city || "",
        state: customerInfo.address.state || "",
        postalCode: customerInfo.address.postalCode || "",
        country: customerInfo.address.country || "US",
      },
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.title,
        variant: item.variant || null,
        size: item.size || null,
        quantity: item.quantity,
        price: item.price,
        image: item.image || null,
      })),
      subtotal,
      total: subtotal,
      currency: "USD",
    };
    const sanityOrder = await createOrder(orderData);

    // Create a Stripe Customer
    const customer = await stripe.customers.create({
      email: customerInfo.email,
      name: customerInfo.name,
      phone: customerInfo.phone,
      address: {
        line1: customerInfo.address.line1,
        city: customerInfo.address.city,
        state: customerInfo.address.state,
        postal_code: customerInfo.address.postalCode,
        country: customerInfo.address.country,
      },
      shipping: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address.line1,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postal_code: customerInfo.address.postalCode,
          country: customerInfo.address.country,
        },
      },
    });

    // Create a Checkout Session using the Customer ID
    const session = await stripe.checkout.sessions.create({
      customer: customer.id, // Link the customer to the session
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?token=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/canceled`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 500,
              currency: "usd",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 10,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Express Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        orderId: orderId,
        sanityOrderId: sanityOrder._id,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        line1: customerInfo.address.line1,
        city: customerInfo.address.city,
        state: customerInfo.address.state,
        postalCode: customerInfo.address.postalCode,
        country: customerInfo.address.country,
      },
    });
    if (session) {
      await updateOrder(sanityOrder._id, {
        stripeCheckoutId: session.id,
        stripePaymentIntentId: session.payment_intent,
        status: "paid",
        customerInfo: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
        },
        billingAddress: {
          line1: customerInfo.address.line1,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postalCode: customerInfo.address.postalCode,
          country: customerInfo.address.country,
        },
        shippingAddress: {
          line1: customerInfo.address.line1,
          line2: customerInfo.address.line1,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postalCode: customerInfo.address.postalCode,
          country: customerInfo.address.country,
        },
        items: cartItems.map((item) => ({
          _key: item.id,
          productId: item.id,
          productName: item.title,
          variant: item.variant || null,
          size: item.size || null,
          quantity: item.quantity,
          price: item.price,
          image: item.image || null,
        })),
        subtotal: session.amount_subtotal ? session.amount_subtotal / 100 : 0,
        shippingCost: session.total_details?.amount_shipping
          ? session.total_details?.amount_shipping / 100
          : 0,
        tax: session.total_details?.amount_tax
          ? session.total_details?.amount_tax / 100
          : 0,
        total: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        notes: `Order ID: ${orderId} \n Customer Name: ${customerInfo.name} \n Customer Email: ${customerInfo.email} \n Customer Phone: ${customerInfo.phone} \n Line 1: ${customerInfo.address.line1} \n City: ${customerInfo.address.city} \n State: ${customerInfo.address.state} \n Postal Code: ${customerInfo.address.postalCode} \n Country: ${customerInfo.address.country}`,
      });
    }
    // after this we need to send the order confirmation email to the customer
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/order-confirmation`, {
      method: "POST",
      body: JSON.stringify({
        orderId,
        customerInfo,
        items: cartItems,
        subtotal,
        shippingCost: session.total_details?.amount_shipping
          ? session.total_details?.amount_shipping / 100
          : 0,
        tax: session.total_details?.amount_tax
          ? session.total_details?.amount_tax / 100
          : 0,
        total: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        shippingAddress: {
          line1: customerInfo.address.line1,
          line2: customerInfo.address.line1,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          postalCode: customerInfo.address.postalCode,
          country: customerInfo.address.country,
        },
      }),
    });
    return NextResponse.json({ url: session.url, orderId });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
