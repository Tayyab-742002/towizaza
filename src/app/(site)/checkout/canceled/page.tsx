'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CheckoutCanceledPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
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
          <motion.div variants={fadeIn} className="text-center text-amber-500 text-6xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-2xl sm:text-3xl font-bold text-light text-center mb-4">
            Order Canceled
          </motion.h1>

          <motion.p variants={fadeIn} className="text-light/80 text-center mb-8">
            Your order has been canceled and you have not been charged.
          </motion.p>

          <motion.div variants={fadeIn} className="mb-8 text-center">
            <p className="text-light/70">
              If you encountered any issues during checkout, please contact our customer support at{' '}
              <a href="mailto:support@towizaza.com" className="text-primary hover:underline">
                support@towizaza.com
              </a>
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="inline-block bg-primary hover:bg-primary/90 text-light rounded-full px-8 py-3 font-medium transition-colors text-center"
            >
              Return to Store
            </Link>
            <Link
              href="/cart"
              className="inline-block border border-light/20 hover:border-light/40 text-light rounded-full px-8 py-3 font-medium transition-colors text-center"
            >
              View Cart
            </Link>
          </motion.div>
        </motion.div>
