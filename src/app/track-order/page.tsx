"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { SanityImage } from "@/components/ui/SanityImage";

const TrackOrderContent = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const checkoutId = searchParams.get("checkoutId");
        const orderId = searchParams.get("orderId");

        if (!checkoutId) {
          setError("Missing checkout ID in the URL");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError("");
        setOrder(null);

        const res = await fetch(`/api/track-order?checkoutId=${checkoutId}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch order");
        }

        const { data } = result;
        if (!data || !data[0]) {
          throw new Error("Order not found");
        }

        setOrder(data[0]);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/30 to-dark bg-gradient-to-br from-dark via-dark/80 to-primary/10 px-4 py-10">
        <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-light/10">
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-primary mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-primary font-medium">
              Loading your order...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/30 to-dark bg-gradient-to-br from-dark via-dark/80 to-primary/10 px-4 py-10">
        <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-light/10">
          <div className="text-center text-red-500 font-semibold py-8">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-secondary/30 to-dark bg-gradient-to-br from-dark via-dark/80 to-primary/10 px-4 py-10">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-light/10">
        <div className="flex flex-col items-center mb-6">
          <div className="text-3xl font-bold text-primary mb-1 tracking-wide">
            Order Tracking
          </div>
          <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full mb-2"></div>
          <p className="text-gray-500 text-center text-sm max-w-xs">
            Your order status and details are shown below.
          </p>
        </div>
        <div>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 text-white rounded-lg p-4 mb-6">
            <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold text-white">Order ID:</span>{" "}
              <span className="text-yellow-500/50"> {order.orderId}</span>
            </div>
            {/* <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold">Checkout ID:</span>
              {order.stripeCheckoutId}
            </div> */}
            <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold text-white">Name: </span>
              <span className="text-yellow-500/50">
                {" "}
                {order.customerInfo?.name}
              </span>
            </div>
            <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold text-white">Email: </span>
              <span className="text-yellow-500/50">
                {" "}
                {order.customerInfo?.email}
              </span>
            </div>
            <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold text-white">Status: </span>
              <span className="text-primary font-semibold">
                {order.status || "Processing"}
              </span>
            </div>
            <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold text-white">Placed: </span>{" "}
              {/* We have to show here the formatted date */}
              <span className="text-yellow-500/50">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>
            <div className="mb-2 text-base text-gray-700">
              <span className="font-semibold text-blue-500">
                Shipping Address:{" "}
              </span>
              <br />
              <span className="text-sm">
                <span className="font-semibold text-white/50">line1: </span>
                <span className="text-yellow-500/50">
                  {order.shippingAddress?.line1}
                </span>
                <br />
                <span className="font-semibold text-white/50">line2: </span>
                <span className="text-yellow-500/50">
                  {order.shippingAddress?.line2
                    ? `, ${order.shippingAddress.line2}`
                    : ""}
                </span>
                ,<br />
                <span className="font-semibold text-white/50">state: </span>
                <span className="text-yellow-500/50">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode},<br />
                </span>
                <span className="font-semibold text-white/50">country: </span>
                <span className="text-yellow-500/50">
                  {order.shippingAddress?.country}
                </span>
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-accent">Items</h3>
            <ul className="divide-y divide-gray-200">
              {order.items?.map((item: any, idx: number) => (
                <li
                  key={idx}
                  className="py-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  {item.image && (
                    <div className="w-20 h-20 flex-shrink-0">
                      <SanityImage
                        image={item.image}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-medium text-light">
                          {item.productName}
                        </span>
                        {item.variant && (
                          <span className="ml-2 text-xs text-gray-400">
                            ({item.variant})
                          </span>
                        )}
                        {item.size && (
                          <span className="ml-2 text-xs text-gray-400">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 mt-2 md:mt-0">
                        Qty: {item.quantity} &nbsp;|&nbsp; {item.price}{" "}
                        {order.currency}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 border-t pt-4 text-sm">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>{" "}
              <span>
                {order.subtotal} {order.currency}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Shipping:</span>{" "}
              <span>
                {order.shippingCost} {order.currency}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax:</span>{" "}
              <span>
                {order.tax} {order.currency}
              </span>
            </div>
            <div className="flex justify-between font-bold text-primary">
              <span>Total:</span>{" "}
              <span>
                {order.total} {order.currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TrackOrder() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondary/30 to-dark bg-gradient-to-br from-dark via-dark/80 to-primary/10 px-4 py-10">
          <div className="w-full max-w-lg bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-light/10">
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-primary mb-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-primary font-medium">Loading...</span>
            </div>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
