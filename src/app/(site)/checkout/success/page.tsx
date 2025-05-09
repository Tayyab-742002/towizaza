"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { SuccessHandler } from "@/components/checkout/SuccessHandler";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationComplete, setValidationComplete] = useState(false);
  const [validatedOrderId, setValidatedOrderId] = useState<string | null>(null);

  // Check for valid checkout token
  useEffect(() => {
    // Get token from URL
    const token = searchParams.get("token");

    if (token) {
      // Valid token exists, set in sessionStorage so the page can't be accessed again after refresh/navigation
      sessionStorage.setItem("checkoutCompleteToken", token);
      setIsAuthorized(true);
    } else {
      // No token in URL, check if we have one in sessionStorage (for page refreshes)
      const storedToken = sessionStorage.getItem("checkoutCompleteToken");

      if (storedToken) {
        // We have a stored token, this is valid
        setIsAuthorized(true);
      } else {
        // No token in URL or storage, redirect to home
        router.replace("/");
      }
    }

    setIsLoading(false);
  }, [router, searchParams]);

  // Use useLayoutEffect to clear cart before paint
  useLayoutEffect(() => {
    if (isAuthorized && validationComplete && !hasCleared.current) {
      const timeoutId = setTimeout(() => {
        clearCart();
      }, 10);

      hasCleared.current = true;

      return () => clearTimeout(timeoutId);
    }
  }, [clearCart, isAuthorized, validationComplete]);

  // Handle successful order validation
  const handleValidOrder = (orderId: string) => {
    setValidatedOrderId(orderId);
    setValidationComplete(true);
    // Once validated, remove the token for added security
    sessionStorage.removeItem("checkoutCompleteToken");
  };

  // Handle invalid order
  const handleInvalidOrder = () => {
    // If validation fails, redirect to home
    router.replace("/");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Show loading state
  if (isLoading || !validationComplete) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-light text-xl">Confirming your order...</div>
        {isAuthorized && (
          <SuccessHandler
            onValidOrder={handleValidOrder}
            onInvalidOrder={handleInvalidOrder}
          />
        )}
      </div>
    );
  }

  // If not authorized, this will never render as we redirect in useEffect
  if (!isAuthorized || !validatedOrderId) {
    return null;
  }

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
            Thank you for your purchase. We have received your order #
            {validatedOrderId} and are processing it now.
          </motion.p>

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
