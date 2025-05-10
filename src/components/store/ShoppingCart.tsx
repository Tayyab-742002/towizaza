"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ShoppingCart() {
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    closeCart,
    totalItems,
    subtotal,
  } = useCart();
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Define interface for customer info
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

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: {
      line1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
    },
  });
  const router = useRouter();

  // Add a standalone function to toggle the form
  const toggleCustomerForm = () => {
    setShowCustomerForm(true);
  };

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
    try {
      if (!product || !product.images) {
        return "/images/placeholder-product.jpg";
      }

      // If images is an array, use the first item
      if (Array.isArray(product.images) && product.images.length > 0) {
        const image = product.images[0];
        if (typeof image === "string") {
          return image;
        }
        // If it's a Sanity image
        if (image && typeof urlFor === "function") {
          return urlFor(image).url();
        }
      } else if (typeof product.images === "string") {
        // Single image as string
        return product.images;
      }

      // Fallback
      return "/images/placeholder-product.jpg";
    } catch (error) {
      console.error("Error getting image URL:", error);
      return "/images/placeholder-product.jpg";
    }
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (state.items.length === 0) {
      return;
    }

    // If customer form isn't shown yet, show it
    if (!showCustomerForm) {
      // Force state update and log it
      setShowCustomerForm(true);
      return;
    }

    // Ensure customerInfo is defined
    if (!customerInfo) {
      setCheckoutError("Customer information is missing");
      return;
    }

    // Validate form
    if (!customerInfo.name || !customerInfo.email) {
      setCheckoutError("Please provide your name and email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      setCheckoutError("Please provide a valid email address");
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const cartItems = state.items.map((item) => {
        // Ensure product exists
        if (!item.product) {
          throw new Error("Invalid product in cart");
        }

        return {
          id: item.product._id || item.product.id || "",
          title: item.product.title || "Untitled Product",
          price: item.variant
            ? item.variant.price || 0
            : item.product.price || 0,
          quantity: item.quantity || 1,
          variant: item.variant ? item.variant.name || null : null,
          size: item.size ? item.size.label || null : null,
          image: getImageUrl(item.product),
        };
      });

      // Additional validation for cart items
      if (!cartItems.length) {
        throw new Error("Cart is empty");
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          customerInfo: customerInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during checkout");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setCheckoutError(
        error.message || "There was an error processing your checkout"
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCustomerInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      if (parent === "address") {
        setCustomerInfo({
          ...customerInfo,
          address: {
            ...customerInfo.address,
            [child]: value,
          },
        });
      }
    } else {
      setCustomerInfo({
        ...customerInfo,
        [name]: value,
      });
    }
  };

  const handleBackToCart = () => {
    setShowCustomerForm(false);
    setCheckoutError(null);
  };

  if (!state.isOpen) return null;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const cartVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-dark/60 backdrop-blur-md z-50"
        onClick={showCustomerForm ? undefined : closeCart}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="backdrop"
      />

      {/* Cart panel */}
      <motion.div
        className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-gradient-to-b from-dark/95 to-dark/90 z-[1000] shadow-xl flex flex-col"
        variants={cartVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        key="cart"
      >
        <div className="p-6 backdrop-blur-sm border-b border-light/10 bg-dark/40">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-light to-light/80">
              {showCustomerForm ? "Your Information" : "Your Cart"}
              {!showCustomerForm && (
                <span className="ml-2 px-2 py-1 bg-primary/20 text-primary rounded-full text-sm">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
            </h2>
            <motion.button
              onClick={showCustomerForm ? handleBackToCart : closeCart}
              className="p-2 text-light/70 hover:text-light transition-colors rounded-full hover:bg-light/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={showCustomerForm ? "Back to cart" : "Close cart"}
            >
              {showCustomerForm ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full bg-accent/5 blur-3xl"></div>
        </div>

        {/* Cart content or Customer form */}
        {showCustomerForm ? (
          <div
            className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-light/10 scrollbar-track-transparent debug-customer-form"
            style={{ border: "2px solid red", background: "rgba(255,0,0,0.1)" }}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              {/* Error message */}
              {checkoutError && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <p>{checkoutError}</p>
                </div>
              )}

              {/* Customer information form */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-light/80 text-sm mb-2"
                  >
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-light/80 text-sm mb-2"
                  >
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-light/80 text-sm mb-2"
                  >
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="pt-4 border-t border-light/10">
                  <h3 className="text-light/90 font-medium mb-4">
                    Billing Address
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="address.line1"
                        className="block text-light/80 text-sm mb-2"
                      >
                        Street Address (optional)
                      </label>
                      <input
                        type="text"
                        id="address.line1"
                        name="address.line1"
                        value={customerInfo.address.line1}
                        onChange={handleCustomerInfoChange}
                        className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="address.city"
                          className="block text-light/80 text-sm mb-2"
                        >
                          City (optional)
                        </label>
                        <input
                          type="text"
                          id="address.city"
                          name="address.city"
                          value={customerInfo.address.city}
                          onChange={handleCustomerInfoChange}
                          className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                          placeholder="New York"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="address.state"
                          className="block text-light/80 text-sm mb-2"
                        >
                          State (optional)
                        </label>
                        <input
                          type="text"
                          id="address.state"
                          name="address.state"
                          value={customerInfo.address.state}
                          onChange={handleCustomerInfoChange}
                          className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                          placeholder="NY"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="address.postalCode"
                          className="block text-light/80 text-sm mb-2"
                        >
                          Zip Code (optional)
                        </label>
                        <input
                          type="text"
                          id="address.postalCode"
                          name="address.postalCode"
                          value={customerInfo.address.postalCode}
                          onChange={handleCustomerInfoChange}
                          className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                          placeholder="10001"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="address.country"
                          className="block text-light/80 text-sm mb-2"
                        >
                          Country (optional)
                        </label>
                        <select
                          id="address.country"
                          name="address.country"
                          value={customerInfo.address.country}
                          onChange={(e) =>
                            setCustomerInfo({
                              ...customerInfo,
                              address: {
                                ...customerInfo.address,
                                country: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-dark/80 border border-light/20 rounded-lg text-light focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-light/60 text-xs mt-6">
                <p>* Required fields</p>
                <p className="mt-1">
                  Your information will only be used to process your order and
                  will not be shared with third parties.
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-light/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-light/90 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-light/60 mb-6">
                    Add items to your cart to see them here
                  </p>
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
                      className={`flex gap-4 pb-5 ${index !== state.items.length - 1 ? "border-b border-light/10" : ""}`}
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
                        <h3 className="text-light font-medium">
                          {item.product.title}
                        </h3>
                        {item.variant && (
                          <p className="text-light/70 text-sm">
                            Option: {item.variant.name}
                          </p>
                        )}
                        {item.size && (
                          <p className="text-light/70 text-sm">
                            Size: {item.size.label}
                          </p>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center bg-dark/40 backdrop-blur-sm rounded-full p-1 border border-light/5">
                            <motion.button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-full text-light/70 hover:bg-light/10 transition-colors"
                              whileTap={{ scale: 0.9 }}
                              aria-label="Decrease quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            </motion.button>
                            <span className="mx-2 text-light min-w-[24px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-full text-light/70 hover:bg-light/10 transition-colors"
                              whileTap={{ scale: 0.9 }}
                              aria-label="Increase quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-light font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                              $
                              {(
                                (item.variant
                                  ? item.variant.price
                                  : item.product.price) * item.quantity
                              ).toFixed(2)}
                            </span>
                            <motion.button
                              onClick={() => setItemToRemove(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-full text-light/50 hover:text-primary hover:bg-light/5 transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label="Remove item"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 group-hover:rotate-12 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Clear Cart
                  </motion.button>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Checkout section */}
        {state.items.length > 0 && (
          <div className="p-6 border-t border-light/10 bg-dark/40 backdrop-blur-sm">
            {/* Error message if checkout fails */}
            {!showCustomerForm && checkoutError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                <p>{checkoutError}</p>
              </div>
            )}

            {/* Subtotal and checkout button */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-light/80">Subtotal</span>
              <span className="text-xl font-bold text-light">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <div className="text-light/60 text-sm mb-4">
              <p>Shipping and taxes calculated at checkout</p>
            </div>

            <motion.button
              onClick={(e) => {
                console.log("Button clicked directly");
                if (!showCustomerForm && state.items.length > 0) {
                  toggleCustomerForm();
                } else {
                  handleCheckout();
                }
              }}
              disabled={isCheckingOut || state.items.length === 0}
              className={`w-full py-4 rounded-xl font-medium text-center transition-all duration-300
                ${
                  isCheckingOut
                    ? "bg-primary/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20"
                } text-white`}
              whileHover={!isCheckingOut ? { scale: 1.02 } : {}}
              whileTap={!isCheckingOut ? { scale: 0.98 } : {}}
            >
              {isCheckingOut ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : showCustomerForm ? (
                "Continue to Payment"
              ) : (
                "Checkout"
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
