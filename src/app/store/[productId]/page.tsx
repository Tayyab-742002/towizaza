'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/sanity';
import { fallbackProducts } from '@/lib/fallbackData';
import { urlFor } from '@/lib/sanity';
import { Product, ProductSize, ProductVariant } from '@/data/store';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Loading } from '@/components/common/Loading';

export default function ProductPage() {
  const params = useParams();
  const productId = params.productId as string;
  const { addToCart, toggleCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [showImageZoom, setShowImageZoom] = useState(false);

  // Refs for animations
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [relatedRef, relatedInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductBySlug(productId);
        
        if (data) {
          setProduct(data);
          
          // If the product has sizes, preselect the first in-stock size
          if (data.sizes && data.sizes.length > 0) {
            const firstInStockSize = data.sizes.find((size: ProductSize) => size.inStock);
            if (firstInStockSize) {
              setSelectedSize(firstInStockSize.id);
            }
          }
          
          // If the product has variants, preselect the first in-stock variant
          if (data.variants && data.variants.length > 0) {
            const firstInStockVariant = data.variants.find((variant: ProductVariant) => variant.inStock);
            if (firstInStockVariant) {
              setSelectedVariant(firstInStockVariant.id);
            }
          }
          
          // Process related products if they exist
          if (data.relatedProducts && data.relatedProducts.length > 0) {
            setRelatedProducts(data.relatedProducts);
          }
        } else {
          // If no Sanity data, try to find from fallback
          const fallbackProduct = fallbackProducts.find(p => 
            p.id === productId || 
            (p.title && p.title.toLowerCase().replace(/\s+/g, '-') === productId)
          );
          
          if (fallbackProduct) {
            setProduct(fallbackProduct);
            
            // Handle sizes for fallback data
            if (fallbackProduct.sizes && fallbackProduct.sizes.length > 0) {
              const firstInStockSize = fallbackProduct.sizes.find(size => size.inStock);
              if (firstInStockSize) {
                setSelectedSize(firstInStockSize.id);
              }
            }
            
            // Handle variants for fallback data
            if (fallbackProduct.variants && fallbackProduct.variants.length > 0) {
              const firstInStockVariant = fallbackProduct.variants.find(variant => variant.inStock);
              if (firstInStockVariant) {
                setSelectedVariant(firstInStockVariant.id);
              }
            }
            
            // Get related products for fallback
            if (fallbackProduct.relatedProducts && fallbackProduct.relatedProducts.length > 0) {
              const related = fallbackProduct.relatedProducts
                .map(id => fallbackProducts.find(p => p.id === id))
                .filter(p => p !== undefined) as Product[];
              setRelatedProducts(related);
            }
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
        
        // Try fallback data
        const fallbackProduct = fallbackProducts.find(p => 
          p.id === productId || 
          (p.title && p.title.toLowerCase().replace(/\s+/g, '-') === productId)
        );
        
        if (fallbackProduct) {
          setProduct(fallbackProduct);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  // Helper to get image URL
  const getImageUrl = (index: number) => {
    if (!product || !product.images || product.images.length === 0) {
      return '/images/placeholder-product.jpg';
    }
    
    const image = product.images[index];
    
    if (typeof image === 'string') {
      return image;
    }
    
    // If it's a Sanity image
    return urlFor(image).url();
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Find the selected size object
    let size = null;
    if (selectedSize && product.sizes) {
      size = product.sizes.find((s: ProductSize) => s.id === selectedSize);
    }
    
    // Find the selected variant object
    let variant = null;
    if (selectedVariant && product.variants) {
      variant = product.variants.find((v: ProductVariant) => v.id === selectedVariant);
    }
    
    // Add to cart using the context
    addToCart(product, quantity, variant, size);
    
    // Show the cart
    toggleCart();
  };

  if (loading) {
    return <Loading message="Loading Product" />;
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">Product not found</div>
      </div>
    );
  }

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 }}
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        {/* Breadcrumbs */}
        <motion.div 
          className="flex items-center mb-8 sm:mb-10 text-light/60 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/store" className="hover:text-light transition-colors hover:underline">Store</Link>
          <span className="mx-2">/</span>
          <span className="text-light">{product.title}</span>
        </motion.div>
        
        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14">
          {/* Product Images */}
          <motion.div 
            ref={headerRef}
            className="space-y-4 sm:space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.7 }}
          >
            {/* Main Image */}
            <motion.div 
              className="aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-dark/80 to-mid/20 p-1 relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full rounded-xl overflow-hidden relative">
                <img 
                  src={getImageUrl(currentImageIndex)} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                
                {/* Zoom button */}
                <motion.button
                  className="absolute bottom-4 right-4 p-2.5 bg-dark/70 backdrop-blur-md rounded-full text-light/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImageZoom(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                    <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <motion.div 
                className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 hide-scrollbar"
                initial={{ opacity: 0, y: 20 }}
                animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {product.images.map((image: any, index: number) => (
                  <motion.div 
                    key={index} 
                    className={`w-16 sm:w-20 aspect-square flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    whileHover={{ scale: index !== currentImageIndex ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={typeof image === 'string' ? image : urlFor(image).url()} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
          
          {/* Product Info */}
          <motion.div 
            ref={infoRef}
            className="flex flex-col bg-dark/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-light/5 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={infoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.7 }}
            variants={containerVariants}
            initial="hidden"
            animate={infoInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium mb-3">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-light to-light/80">
                {product.title}
              </h1>
              
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-4"></div>
            </motion.div>
            
            <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
              <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ${product.price.toFixed(2)}
              </span>
              
              {!product.inStock && (
                <span className="ml-4 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">Out of Stock</span>
              )}
            </motion.div>
            
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
              <p className="text-light/80 leading-relaxed">{product.description}</p>
            </motion.div>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
                <h3 className="font-medium mb-3 text-light/90">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: ProductSize) => (
                    <motion.button
                      key={size.id}
                      className={`px-4 py-2 backdrop-blur-sm rounded-full transition-all duration-300 ${
                        selectedSize === size.id 
                          ? 'bg-gradient-to-r from-primary to-accent text-light shadow-md shadow-primary/30' 
                          : 'bg-mid/20 text-light/80 hover:bg-mid/30'
                      } ${
                        !size.inStock ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      onClick={() => size.inStock && setSelectedSize(size.id)}
                      disabled={!size.inStock}
                      whileHover={size.inStock ? { scale: 1.05 } : {}}
                      whileTap={size.inStock ? { scale: 0.95 } : {}}
                    >
                      {size.label}
                      {!size.inStock && ' (Out of Stock)'}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
                <h3 className="font-medium mb-3 text-light/90">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: ProductVariant) => (
                    <motion.button
                      key={variant.id}
                      className={`px-4 py-2 backdrop-blur-sm rounded-full transition-all duration-300 ${
                        selectedVariant === variant.id 
                          ? 'bg-gradient-to-r from-primary to-accent text-light shadow-md shadow-primary/30' 
                          : 'bg-mid/20 text-light/80 hover:bg-mid/30'
                      } ${
                        !variant.inStock ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      onClick={() => variant.inStock && setSelectedVariant(variant.id)}
                      disabled={!variant.inStock}
                      whileHover={variant.inStock ? { scale: 1.05 } : {}}
                      whileTap={variant.inStock ? { scale: 0.95 } : {}}
                    >
                      {variant.name}
                      {!variant.inStock && ' (Out of Stock)'}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Quantity Selection */}
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
              <h3 className="font-medium mb-3 text-light/90">Quantity</h3>
              <div className="flex items-center">
                <motion.button 
                  className="w-10 h-10 flex items-center justify-center bg-mid/30 rounded-l-full hover:bg-mid/40 transition-colors"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </motion.button>
                <input 
                  type="number" 
                  className="w-14 h-10 text-center bg-mid/20 text-light border-y border-light/10 focus:outline-none focus:ring-0"
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <motion.button 
                  className="w-10 h-10 flex items-center justify-center bg-mid/30 rounded-r-full hover:bg-mid/40 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Add to Cart Button */}
            <motion.div className="mb-8 sm:mb-10" variants={itemVariants}>
              <motion.button 
                className={`w-full py-4 px-6 rounded-full font-medium text-light transition-all duration-300 ${
                  product.inStock 
                    ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30' 
                    : 'bg-mid/30 text-light/50 cursor-not-allowed'
                }`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                whileHover={product.inStock ? { scale: 1.02 } : {}}
                whileTap={product.inStock ? { scale: 0.98 } : {}}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </motion.button>
            </motion.div>
            
            {/* Product Tags */}
            <motion.div className="flex flex-wrap gap-2 mt-auto" variants={itemVariants}>
              {product.featured && (
                <span className="px-3 py-1 bg-accent/20 backdrop-blur-sm text-accent rounded-full text-xs font-medium">Featured</span>
              )}
              {product.new && (
                <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary rounded-full text-xs font-medium">New</span>
              )}
              <span className="px-3 py-1 bg-light/10 backdrop-blur-sm text-light/70 rounded-full text-xs font-medium">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div 
            ref={relatedRef}
            className="mt-16 sm:mt-24"
            initial={{ opacity: 0, y: 40 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-light to-light/80">
                You May Also Like
              </h2>
              <div className="h-px flex-grow bg-gradient-to-r from-light/20 to-transparent ml-6"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedProducts.map((related: any, index: number) => (
                <motion.div
                  key={related._id || related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={relatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/store/${related.slug ? related.slug.current : related.id}`}
                    className="group block"
                  >
                    <div className="aspect-square bg-gradient-to-br from-dark/80 to-mid/20 p-1 rounded-xl overflow-hidden mb-4 shadow-lg">
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        {related.images && related.images.length > 0 && (
                          <img 
                            src={typeof related.images[0] === 'string' 
                              ? related.images[0] 
                              : urlFor(related.images[0]).url()} 
                            alt={related.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium text-light group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300 line-clamp-1">
                      {related.title}
                    </h3>
                    <p className="text-light/70 text-sm mt-1">${related.price.toFixed(2)}</p>
                    {related.new && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                        New
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Image zoom modal */}
      <AnimatePresence>
        {showImageZoom && (
          <motion.div 
            className="fixed inset-0 z-50 bg-dark/90 backdrop-blur-lg flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageZoom(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={getImageUrl(currentImageIndex)} 
                alt={product.title} 
                className="w-full h-full object-contain"
              />
              <button 
                className="absolute top-4 right-4 p-2 bg-dark/70 rounded-full text-light/90"
                onClick={() => setShowImageZoom(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 