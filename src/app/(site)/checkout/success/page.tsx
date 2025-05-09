"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  clearCart();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-6 py-24">
        <motion.div
          className="max-w-3xl mx-auto bg-dark/50 p-8 sm:p-12 rounded-xl border border-light/10 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <motion.div
            variants={fadeIn}
            className="text-center text-green-500 text-6xl mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <motion.h1
            variants={fadeIn}
            className="text-2xl sm:text-3xl font-bold text-light text-center mb-4"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            variants={fadeIn}
            className="text-light/80 text-center mb-8"
          >
            Thank you for your purchase. We have received your order and are
            processing it now.
          </motion.p>

          {sessionId && (
            <motion.div variants={fadeIn} className="mb-8 text-center">
              <p className="text-light/70 mb-1">Your session ID:</p>
              <p className="text-sm font-medium text-primary opacity-60 truncate max-w-full overflow-hidden">
                {sessionId}
              </p>
            </motion.div>
          )}

          <motion.div variants={fadeIn} className="mb-8">
            <p className="text-light/70 mb-2">
              We've sent a confirmation email to your email address.
            </p>
            <p className="text-light/70">
              If you have any questions about your order, please contact our
              customer support at{" "}
              <a
                href="mailto:support@towizaza.com"
                className="text-primary hover:underline"
              >
                support@towizaza.com
              </a>
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/store"
              className="inline-block bg-primary hover:bg-primary/90 text-light rounded-full px-8 py-3 font-medium transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-block border border-light/20 hover:border-light/40 text-light rounded-full px-8 py-3 font-medium transition-colors text-center"
            >
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
