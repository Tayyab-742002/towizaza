import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email address
const FROM_EMAIL = process.env.EMAIL_FROM || "orders@towizaza.com";

/**
 * Send an order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(
  order: any,
  customerEmail: string,
  customerName: string
) {
  try {
    // Format order items for email
    const formattedItems = order.items
      .map((item: any) => {
        return `${item.productName} ${item.variant ? `(${item.variant})` : ""} ${
          item.size ? `- Size: ${item.size}` : ""
        } - Qty: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      })
      .join("\n");

    // Format the email content
    const emailContent = `
      <h1>Thank you for your order!</h1>
      <p>Hi ${customerName},</p>
      <p>We've received your order and it's being processed. Here's a summary of your purchase:</p>

      <h2>Order #${order.orderId}</h2>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>

      <h3>Items:</h3>
      <ul>
        ${order.items
          .map(
            (item: any) => `
          <li>
            <strong>${item.productName}</strong>
            ${item.variant ? `(${item.variant})` : ""}
            ${item.size ? `- Size: ${item.size}` : ""}
            <br>
            Quantity: ${item.quantity}
            <br>
            Price: $${(item.price * item.quantity).toFixed(2)}
          </li>
        `
          )
          .join("")}
      </ul>

      <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
      <p><strong>Shipping:</strong> $${order.shippingCost.toFixed(2)}</p>
      <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>

      <hr>

      <h3>Shipping Address:</h3>
      <p>
        ${order.shippingAddress.line1}<br>
        ${order.shippingAddress.line2 ? order.shippingAddress.line2 + "<br>" : ""}
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>

      <p>We'll send you another email when your order ships. If you have any questions, please contact us at support@towizaza.com.</p>

      <p>Thank you for supporting Towizaza!</p>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation #${order.orderId} - Towizaza`,
      html: emailContent,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error };
  }
}

/**
 * Send a notification email to the store owner about a new order
 */
export async function sendOrderNotificationEmail(order: any) {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@towizaza.com";

    // Format the email content
    const emailContent = `
      <h1>New Order Received</h1>

      <h2>Order #${order.orderId}</h2>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
      <p><strong>Customer:</strong> ${order.customerInfo.name} (${order.customerInfo.email})</p>

      <h3>Items:</h3>
      <ul>
        ${order.items
          .map(
            (item: any) => `
          <li>
            <strong>${item.productName}</strong>
            ${item.variant ? `(${item.variant})` : ""}
            ${item.size ? `- Size: ${item.size}` : ""}
            <br>
            Quantity: ${item.quantity}
            <br>
            Price: $${(item.price * item.quantity).toFixed(2)}
          </li>
        `
          )
          .join("")}
      </ul>

      <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
      <p><strong>Shipping:</strong> $${order.shippingCost.toFixed(2)}</p>
      <p><strong>Tax:</strong> $${order.tax.toFixed(2)}</p>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>

      <hr>

      <h3>Shipping Address:</h3>
      <p>
        ${order.shippingAddress.line1}<br>
        ${order.shippingAddress.line2 ? order.shippingAddress.line2 + "<br>" : ""}
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>

      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/studio/desk/orders;${order._id}">View order in Sanity Studio</a></p>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order #${order.orderId} - Towizaza Store`,
      html: emailContent,
    });

    if (error) {
      console.error("Error sending admin notification email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    return { success: false, error };
  }
}

/**
 * Send a shipping confirmation email when an order ships
 */
export async function sendShippingConfirmationEmail(
  order: any,
  trackingNumber?: string,
  trackingUrl?: string
) {
  try {
    const emailContent = `
      <h1>Your order has shipped!</h1>
      <p>Hi ${order.customerInfo.name},</p>
      <p>Great news! Your order #${order.orderId} has been shipped and is on its way to you.</p>

      ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ""}
      ${trackingUrl ? `<p><a href="${trackingUrl}">Track your package</a></p>` : ""}

      <h3>Order Summary:</h3>
      <ul>
        ${order.items
          .map(
            (item: any) => `
          <li>
            <strong>${item.productName}</strong>
            ${item.variant ? `(${item.variant})` : ""}
            ${item.size ? `- Size: ${item.size}` : ""}
            - Qty: ${item.quantity}
          </li>
        `
          )
          .join("")}
      </ul>

      <p>Thank you for shopping with Towizaza!</p>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customerInfo.email,
      subject: `Your Order #${order.orderId} Has Shipped - Towizaza`,
      html: emailContent,
    });

    if (error) {
      console.error("Error sending shipping confirmation email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending shipping confirmation email:", error);
    return { success: false, error };
  }
}
