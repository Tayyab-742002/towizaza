import Link from "next/link";
import * as React from "react";

interface OrderItem {
  productName: string;
  variant?: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface EmailTemplateProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  checkoutId: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  orderId,
  checkoutId,
  customerName,
  customerEmail,
  items,
  subtotal,
  shippingCost,
  tax,
  total,
  currency,
  shippingAddress,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  // Theme colors from your website
  const colors = {
    primary: "#E63946",
    secondary: "#6A0DAD",
    accent: "#4361EE",
    dark: "#121212",
    mid: "#717171",
    light: "#F8F9FA",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Arial', sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0",
        color: colors.dark,
        backgroundColor: colors.light,
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          padding: "30px 20px",
          backgroundColor: colors.dark,
          textAlign: "center",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            color: colors.light,
            letterSpacing: "1px",
            marginBottom: "10px",
          }}
        >
          TOWIZAZA
        </div>
        <div
          style={{
            width: "50px",
            height: "2px",
            backgroundColor: colors.primary,
            margin: "0 auto 10px",
          }}
        ></div>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "18px",
            fontStyle: "italic",
            color: colors.light,
          }}
        >
          Thanks for your order
        </div>
      </div>

      {/* Order Confirmation Banner */}
      <div
        style={{
          backgroundColor: colors.primary,
          color: colors.light,
          padding: "15px 20px",
          textAlign: "center",
          fontFamily: "'Montserrat', 'Arial', sans-serif",
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        Order Confirmation #{orderId}
      </div>

      {/* Main Content */}
      <div style={{ padding: "40px 30px" }}>
        <div style={{ marginBottom: "30px" }}>
          <h2
            style={{
              fontFamily: "'Montserrat', 'Arial', sans-serif",
              fontSize: "18px",
              color: colors.dark,
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: `2px solid ${colors.primary}`,
            }}
          >
            Hello, {customerName}!
          </h2>
          <p
            style={{
              color: colors.mid,
              lineHeight: "1.5",
              marginBottom: "15px",
            }}
          >
            Thank you for your purchase. We're excited to let you know that your
            order has been confirmed and is being processed.
          </p>
        </div>

        {/* Order Details Box */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', 'Arial', sans-serif",
              fontSize: "18px",
              color: colors.secondary,
              marginBottom: "20px",
            }}
          >
            Order Details
          </h2>

          {/* Items Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.accent}`,
                    fontFamily: "'Montserrat', 'Arial', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Product
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "left",
                    borderBottom: `2px solid ${colors.accent}`,
                    fontFamily: "'Montserrat', 'Arial', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Details
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "right",
                    borderBottom: `2px solid ${colors.accent}`,
                    fontFamily: "'Montserrat', 'Arial', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    padding: "12px 10px",
                    textAlign: "right",
                    borderBottom: `2px solid ${colors.accent}`,
                    fontFamily: "'Montserrat', 'Arial', sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "15px 10px", fontSize: "14px" }}>
                    {item.productName}
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      fontSize: "14px",
                      color: colors.mid,
                    }}
                  >
                    {item.variant && (
                      <span>
                        Variant: {item.variant}
                        <br />
                      </span>
                    )}
                    {item.size && <span>Size: {item.size}</span>}
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "right",
                      fontSize: "14px",
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: "15px 10px",
                      textAlign: "right",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {formatCurrency(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Order Summary */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "6px",
              padding: "15px 20px",
              marginTop: "25px",
            }}
          >
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "5px 0",
                      fontSize: "14px",
                      color: colors.mid,
                    }}
                  >
                    Subtotal
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "5px 0",
                      fontSize: "14px",
                    }}
                  >
                    {formatCurrency(subtotal)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "5px 0",
                      fontSize: "14px",
                      color: colors.mid,
                    }}
                  >
                    Shipping
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "5px 0",
                      fontSize: "14px",
                    }}
                  >
                    {formatCurrency(shippingCost)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "5px 0",
                      fontSize: "14px",
                      color: colors.mid,
                    }}
                  >
                    Tax
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "5px 0",
                      fontSize: "14px",
                    }}
                  >
                    {formatCurrency(tax)}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "12px 0 5px",
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "'Montserrat', 'Arial', sans-serif",
                      color: colors.dark,
                      borderTop: "2px solid #eee",
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "12px 0 5px",
                      fontSize: "16px",
                      fontWeight: 700,
                      fontFamily: "'Montserrat', 'Arial', sans-serif",
                      color: colors.primary,
                      borderTop: "2px solid #eee",
                    }}
                  >
                    {formatCurrency(total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ marginBottom: "30px" }}>
          <h2
            style={{
              fontFamily: "'Montserrat', 'Arial', sans-serif",
              fontSize: "18px",
              color: colors.secondary,
              marginBottom: "15px",
              paddingBottom: "10px",
              borderBottom: `2px solid ${colors.accent}`,
            }}
          >
            Shipping Information
          </h2>
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
              lineHeight: "1.5",
            }}
          >
            <p style={{ margin: "0 0 5px", fontSize: "14px" }}>
              <strong>Address:</strong>
            </p>
            <p style={{ margin: "0 0 2px", fontSize: "14px" }}>
              {shippingAddress.line1}
            </p>
            {shippingAddress.line2 && (
              <p style={{ margin: "0 0 2px", fontSize: "14px" }}>
                {shippingAddress.line2}
              </p>
            )}
            <p style={{ margin: "0 0 2px", fontSize: "14px" }}>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </p>
            <p style={{ margin: "0", fontSize: "14px" }}>
              {shippingAddress.country}
            </p>
          </div>
        </div>
        <a
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/track-order?orderId=${orderId}&checkoutId=${checkoutId}`}
          style={{
            display: "block",
            margin: "30px auto",
            padding: "15px 30px",
            backgroundColor: colors.primary,
            color: colors.light,
            textDecoration: "none",
            borderRadius: "8px",
            textAlign: "center",
            fontFamily: "'Montserrat', 'Arial', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            letterSpacing: "0.5px",
            boxShadow: "0 4px 6px rgba(230, 57, 70, 0.2)",
            transition: "all 0.3s ease",
            maxWidth: "250px",
            border: `2px solid ${colors.primary}`,
          }}
        >
          Track Your Order
        </a>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "25px 30px",
          backgroundColor: colors.dark,
          color: colors.light,
          textAlign: "center",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <p style={{ margin: "0 0 15px", fontSize: "14px" }}>
          Thank you for shopping with TOWIZAZA!
        </p>
        <div
          style={{
            width: "40px",
            height: "2px",
            backgroundColor: colors.primary,
            margin: "0 auto 15px",
          }}
        ></div>
        <p style={{ margin: "0", fontSize: "12px", color: "#aaa" }}>
          If you have any questions about your order, please contact our
          customer service at{" "}
          <a
            href="mailto:support@towizaza.com"
            style={{ color: colors.accent }}
          >
            support@towizaza.com
          </a>
        </p>
      </div>
    </div>
  );
};
