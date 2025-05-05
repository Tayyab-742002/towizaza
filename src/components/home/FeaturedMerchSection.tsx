'use client';

import Image from "next/image";
import Link from "next/link";
import { urlFor } from '@/lib/sanity';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface FeaturedMerchSectionProps {
  products: any[];
}

export default function FeaturedMerchSection({ products }: FeaturedMerchSectionProps) {
  const [productsRef, productsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  
  // Get product image URL with error handling
  const getProductImageUrl = (product: any) => {
    try {
      // Check for various possible image field names
      const imageField = product.image || product.images?.[0] || product.artwork;
      
      if (!imageField) {
        return '/images/placeholder-product.jpg';
      }
      
      if (typeof imageField === 'string') {
        return imageField;
      }
      
      // Handle Sanity image
      return urlFor(imageField).url();
    } catch (error) {
      console.error("Error resolving product image:", error);
      return '/images/placeholder-product.jpg';
    }
  };
  
  // Format price with error handling
  const formatPrice = (price: any) => {
    if (price === undefined || price === null) {
      return "N/A";
    }
    
    try {
      return `$${Number(price).toFixed(2)}`;
    } catch (error) {
      return `$${price}`;
    }
  };

  // Get product name with fallback
  const getProductName = (product: any) => {
    return product.name || product.title || "Untitled Product";
  };

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/90 to-dark" ref={productsRef}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-light">Featured <span className="text-primary">Merch</span></h2>
            <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
          </div>
          <Link href="/store" className="text-primary hover:text-accent transition-colors text-sm font-medium">
            Shop All
          </Link>
        </div>
        
        {products && products.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={productsInView ? "visible" : "hidden"}
          >
            {products.slice(0, 4).map((product, index) => (
              <motion.div 
                key={product._id || index} 
                className="group bg-dark/40 backdrop-blur-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-light/5"
                variants={itemVariants}
              >
                <div className="relative aspect-square">
                  <Image 
                    src={getProductImageUrl(product)}
                    alt={getProductName(product)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.inStock === false && (
                    <div className="absolute inset-0 bg-dark/60 flex items-center justify-center">
                      <div className="bg-primary/90 text-light text-sm font-bold py-1.5 px-3 rounded">
                        Sold Out
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-light group-hover:text-primary transition-colors">{getProductName(product)}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-light/90">{formatPrice(product.price)}</span>
                    <Link 
                      href={`/store/${product.slug?.current || product.id || '#'}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-dark/30 backdrop-blur-md p-6 rounded-xl text-center">
            <p className="text-light/70">No merchandise available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
} 