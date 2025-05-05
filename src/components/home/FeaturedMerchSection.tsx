'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ProductCard from "@/components/store/ProductCard";

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
              <ProductCard
                key={product._id || index}
                product={product}
                index={index}
              />
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