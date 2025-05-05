"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";

export default function ShoppingCart() {
  const { state, removeItem, updateQuantity, clearCart, closeCart, totalItems, subtotal } = useCart();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  
  // Prevent scrolling when cart is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [state.isOpen]);
  
  // Helper function to get image URL from product
  const getImageUrl = (product: any) => {
    if (!product || !product.images || product.images.length === 0) {
      return '/images/placeholder-product.jpg';
    }
    
    const image = product.images[0];
    
    if (typeof image === 'string') {
      return image;
    }
    
    // If it's a Sanity image
    return urlFor(image).url();
  };
  
  if (!state.isOpen) return null;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };
  
  const cartVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      x: "100%", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } }
  };
  
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div 
        className="fixed inset-0 bg-dark/60 backdrop-blur-md z-50"
        onClick={closeCart}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="backdrop"
      />
      
      {/* Cart panel */}
      <motion.div 
        className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-gradient-to-b from-dark/95 to-dark/90 z-50 shadow-xl flex flex-col"
        variants={cartVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="cart"
      >
        <div className="p-6 backdrop-blur-sm border-b border-light/10 bg-dark/40">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-light to-light/80">
              Your Cart 
              <span className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </h2>
            <motion.button 
              onClick={closeCart}
              className="p-2 text-light/70 hover:text-light transition-colors rounded-full hover:bg-light/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full bg-accent/5 blur-3xl"></div>
        </div>
        
        {/* Cart items */}
        <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-light/10 scrollbar-track-transparent">
          <AnimatePresence>
            {state.items.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-24 h-24 mx-auto bg-light/5 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-light/90 mb-2">Your cart is empty</h3>
                <p className="text-light/60 mb-6">Add items to your cart to see them here</p>
                <motion.button 
                  onClick={closeCart}
                  className="py-3 px-6 bg-gradient-to-r from-primary to-accent text-light rounded-full font-medium hover:shadow-lg hover:shadow-primary/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-5">
                {state.items.map((item, index) => (
                  <motion.div 
                    key={item.id} 
                    className={`flex gap-4 pb-5 ${index !== state.items.length - 1 ? 'border-b border-light/10' : ''}`}
                    variants={itemVariants}
                    initial="hidden"
                    animate={itemToRemove === item.id ? "exit" : "visible"}
                    transition={{ delay: index * 0.05 }}
                    onAnimationComplete={() => {
                      if (itemToRemove === item.id) {
                        removeItem(item.id);
                        setItemToRemove(null);
                      }
                    }}
                  >
                    {/* Product image */}
                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-dark/80 to-mid/20 p-1 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        <img 
                          src={getImageUrl(item.product)} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    </div>
                    
                    {/* Product details */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-light font-medium">{item.product.title}</h3>
                      {item.variant && (
                        <p className="text-light/70 text-sm">Option: {item.variant.name}</p>
                      )}
                      {item.size && (
                        <p className="text-light/70 text-sm">Size: {item.size.label}</p>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center bg-dark/40 backdrop-blur-sm rounded-full p-1 border border-light/5">
                          <motion.button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-light/70 hover:bg-light/10 transition-colors"
                            whileTap={{ scale: 0.9 }}
                            aria-label="Decrease quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </motion.button>
                          <span className="mx-2 text-light min-w-[24px] text-center font-medium">{item.quantity}</span>
                          <motion.button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-light/70 hover:bg-light/10 transition-colors"
                            whileTap={{ scale: 0.9 }}
                            aria-label="Increase quantity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </motion.button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-light font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            ${((item.variant ? item.variant.price : item.product.price) * item.quantity).toFixed(2)}
                          </span>
                          <motion.button 
                            onClick={() => setItemToRemove(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-light/50 hover:text-primary hover:bg-light/5 transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Remove item"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.button 
                  onClick={clearCart}
                  className="text-sm text-light/70 hover:text-primary transition-all flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-light/5 mt-4 group"
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Cart footer */}
        {state.items.length > 0 && (
          <div className="p-6 border-t border-light/10 backdrop-blur-sm bg-dark/40">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-light/70 text-sm mb-1">Cart Total</p>
                <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  ${subtotal.toFixed(2)}
                </p>
              </div>
              <div className="text-right text-sm text-light/60">
                <p>Shipping calculated at checkout</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button 
                onClick={closeCart}
                className="py-3 px-4 rounded-full border border-light/20 text-light font-medium bg-dark/40 backdrop-blur-sm hover:bg-light/10 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/checkout" 
                  className="block w-full py-3 px-4 rounded-full bg-gradient-to-r from-primary to-accent text-light font-medium text-center transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                  onClick={closeCart}
                >
                  Checkout
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 