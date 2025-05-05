"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function ShoppingCart() {
  const { state, removeItem, updateQuantity, clearCart, closeCart, totalItems, subtotal } = useCart();
  
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
  
  if (!state.isOpen) return null;
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50"
        onClick={closeCart}
      ></div>
      
      {/* Cart panel */}
      <div className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-dark z-50 shadow-xl flex flex-col transition-transform transform translate-x-0">
        <div className="p-6 border-b border-light/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-light">Your Cart ({totalItems})</h2>
            <button 
              onClick={closeCart}
              className="text-light/70 hover:text-light transition-colors"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Cart items */}
        <div className="flex-grow overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="mt-4 text-light/70">Your cart is empty</p>
              <button 
                onClick={closeCart}
                className="mt-4 inline-block py-2 px-4 bg-primary text-light rounded-full font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-light/10">
                  {/* Product image */}
                  <div className="h-20 w-20 bg-mid/20 rounded-md overflow-hidden flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 && (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-grow">
                    <h3 className="text-light font-medium">{item.product.title}</h3>
                    {item.variant && (
                      <p className="text-light/70 text-sm">{item.variant.name}</p>
                    )}
                    {item.size && (
                      <p className="text-light/70 text-sm">Size: {item.size.label}</p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-light/20 text-light/70 hover:bg-light/10"
                          aria-label="Decrease quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-2 text-light min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-light/20 text-light/70 hover:bg-light/10"
                          aria-label="Increase quantity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-light font-medium">${((item.variant ? item.variant.price : item.product.price) * item.quantity).toFixed(2)}</span>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-light/50 hover:text-primary transition-colors"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={clearCart}
                className="text-sm text-light/70 hover:text-primary transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>
          )}
        </div>
        
        {/* Cart footer */}
        {state.items.length > 0 && (
          <div className="p-6 border-t border-light/10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-light">Subtotal</span>
              <span className="text-light text-xl font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={closeCart}
                className="py-3 px-4 rounded-full border border-light/20 text-light font-medium hover:bg-light/10 transition-colors"
              >
                Continue Shopping
              </button>
              <Link 
                href="/checkout" 
                className="py-3 px-4 rounded-full bg-primary text-light font-medium text-center hover:bg-primary/90 transition-colors"
                onClick={closeCart}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 