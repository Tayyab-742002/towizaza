'use client';

import Image from "next/image";
import Link from "next/link";
import { urlFor } from '@/lib/sanity';
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: any;
  isFeatured?: boolean;
  onAddToCart?: (product: any, e: React.MouseEvent) => void;
  isLoading?: boolean;
  index?: number;
}

export default function ProductCard({ 
  product, 
  isFeatured = false, 
  onAddToCart, 
  isLoading = false,
  index = 0
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Helper functions for product data
  const getProductUrl = () => {
    if (product._type === 'product' && product.slug?.current) {
      return `/store/${product.slug.current}`;
    }
    return `/store/${product.id || ''}`;
  };
  
  const getProductImageUrl = (product: any) => {
    try {
      // Check for different image locations in the product data
      if (!product.images || (Array.isArray(product.images) && product.images.length === 0)) {
        // Try alternate image field names
        const altImage = product.image || product.artwork || product.cover;
        if (!altImage) return '/images/placeholder-product.jpg';
        
        if (typeof altImage === 'string') return altImage;
        return urlFor(altImage).url();
      }
      
      const image = Array.isArray(product.images) ? product.images[0] : product.images;
      
      if (typeof image === 'string') {
        return image;
      }
      
      // If it's a Sanity image
      return urlFor(image).url();
    } catch (error) {
      console.error("Error getting product image:", error);
      return '/images/placeholder-product.jpg';
    }
  };

  const getProductName = () => {
    return product.title || product.name || "Untitled Product";
  };

  const getProductPrice = () => {
    if (typeof product.price !== 'number') return "N/A";
    return `$${product.price.toFixed(2)}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && product.inStock !== false) {
      onAddToCart(product, e);
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3) // Cap delay at 0.3s
      } 
    }
  };

  return (
    <motion.div
      className={`group relative ${isFeatured ? 'sm:col-span-2' : ''}`}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={getProductUrl()} className="block h-full">
        <div className="h-full flex flex-col">
          {/* Card background with gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark/5 to-accent/20 rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-dark/80 backdrop-blur-sm rounded-2xl" />
          </div>
          
          {/* Image container */}
          <div className={`relative z-10 ${isFeatured ? 'aspect-[16/10]' : 'aspect-square'} overflow-hidden rounded-t.5-xl`}>
            <div className="absolute inset-0 p-2">
              <div className="h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={getProductImageUrl(product)}
                  alt={getProductName()}
                  fill
                  sizes={isFeatured 
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 33vw" 
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"}
                  className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
              </div>
            </div>
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
            
            {/* Product badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.new && (
                <div className="bg-gradient-to-r from-primary to-primary/80 text-light text-xs font-bold py-1 px-2.5 rounded shadow-lg">
                  NEW
                </div>
              )}
              {product.featured && (
                <div className="bg-gradient-to-r from-accent to-accent/80 text-light text-xs font-bold py-1 px-2.5 rounded shadow-lg">
                  FEATURED
                </div>
              )}
              {product.inStock === false && (
                <div className="bg-dark/80 backdrop-blur-sm text-light/90 text-xs font-medium py-1 px-2.5 rounded shadow-lg">
                  OUT OF STOCK
                </div>
              )}
            </div>
            
            {/* Quick add button */}
            {onAddToCart && (
              <div className={`absolute right-4 bottom-4 transform transition-all duration-300 z-10 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <motion.button
                  onClick={handleAddToCart}
                  disabled={product.inStock === false || isLoading}
                  className={`p-3 rounded-full shadow-lg ${
                    product.inStock === false 
                      ? 'bg-dark/70 text-light/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-primary to-accent text-light'
                  } transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Add ${getProductName()} to cart`}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Product info */}
          <div className="relative z-10 p-4 flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center">
                <span className="px-2 py-0.5 text-xs text-primary/80 bg-primary/10 rounded-full uppercase tracking-wider">
                  {product.category || 'Product'}
                </span>
              </div>
              <h3 className="mt-2 font-medium text-light group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300 text-sm sm:text-base line-clamp-1">
                {getProductName()}
              </h3>
              {product.description && isFeatured && (
                <p className="text-light/70 text-xs line-clamp-2 mt-1.5">{product.description}</p>
              )}
            </div>
            
            <div className="mt-3 flex justify-between items-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-semibold">
                {getProductPrice()}
              </span>
              <span className="text-xs text-light/60 bg-dark/30 px-2 py-0.5 rounded-full">
                {product.inStock !== false ? 'In Stock' : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 