import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "stripeCheckoutId",
      title: "Stripe Checkout ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "customerInfo",
      title: "Customer Information",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
        }),
        defineField({
          name: "email",
          title: "Email",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "object",
      fields: [
        defineField({
          name: "line1",
          title: "Address Line 1",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "State/Province",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        defineField({
          name: "line1",
          title: "Address Line 1",
          type: "string",
        }),
        defineField({
          name: "line2",
          title: "Address Line 2",
          type: "string",
        }),
        defineField({
          name: "city",
          title: "City",
          type: "string",
        }),
        defineField({
          name: "state",
          title: "State/Province",
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: "Postal Code",
          type: "string",
        }),
        defineField({
          name: "country",
          title: "Country",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              weak: true,
            }),
            defineField({
              name: "productId",
              title: "Product ID",
              type: "string",
            }),
            defineField({
              name: "productName",
              title: "Product Name",
              type: "string",
            }),
            defineField({
              name: "variant",
              title: "Variant",
              type: "string",
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
            }),
            defineField({
              name: "price",
              title: "Price",
              type: "number",
            }),
            defineField({
              name: "image",
              title: "Product Image",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "tax",
      title: "Tax",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "USD",
    }),
    defineField({
      name: "notes",
      title: "Order Notes",
      type: "text",
    }),
    defineField({
      name: "emailsSent",
      title: "Emails Sent",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "type",
              title: "Email Type",
              type: "string",
            }),
            defineField({
              name: "sentAt",
              title: "Sent At",
              type: "datetime",
            }),
            defineField({
              name: "recipient",
              title: "Recipient",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "orderId",
      subtitle: "status",
      customerName: "customerInfo.name",
      customerEmail: "customerInfo.email",
      total: "total",
      currency: "currency",
    },
    prepare(selection) {
      const { title, subtitle, customerName, customerEmail, total, currency } =
        selection;
      return {
        title: `Order ${title || "New Order"}`,
        subtitle: `${subtitle} - ${customerName || ""} (${customerEmail || "No email"}) - ${
          currency
        }${total?.toFixed(2) || "0.00"}`,
      };
    },
  },
});
