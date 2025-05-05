'use client';

import { useState, useEffect, useRef } from 'react';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Categories for filter chips
const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'cd', label: 'CDs' },
  { value: 'accessories', label: 'Accessories' }
];

interface StoreClientProps {
  initialProducts: any[];
}

export default function StoreClient({ initialProducts }: StoreClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high'>('featured');
  const [isLoading, setIsLoading] = useState(false);
  
  const { addToCart, toggleCart } = useCart();
  const filtersRef = useRef<HTMLDivElement>(null);

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [productsRef, productsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'featured') {
        // Featured items first, then new items
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        if (a.new && !b.new) return -1;
        if (!a.new && b.new) return 1;
        return 0;
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt || '2023-01-01').getTime() - new Date(a.createdAt || '2023-01-01').getTime();
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) return;
    
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    setTimeout(() => {
      addToCart(product, 1);
      toggleCart();
      setIsLoading(false);
    }, 300);
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setSortBy('featured');
  };
  
  const getProductImageUrl = (product: any) => {
    try {
      if (!product.images || product.images.length === 0) {
        return '/images/placeholder-product.jpg';
      }
      
      if (typeof product.images[0] === 'string') {
        return product.images[0];
      }
      
      // If it's a Sanity image
      return urlFor(product.images[0]).url();
    } catch (error) {
      console.error("Error getting product image:", error);
      return '/images/placeholder-product.jpg';
    }
  };
  
  // Generate counts for stats
  const categoryStats = CATEGORIES.reduce((acc, category) => {
    if (category.value === 'all') return acc;
    
    acc[category.value] = products.filter(
      product => product.category === category.value
    ).length;
    
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative py-24 bg-gradient-to-b from-secondary/30 to-dark overflow-hidden"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
          <div className="h-full w-full bg-grid-pattern"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4">Official Merch</h1>
            <p className="text-xl text-light/80 max-w-2xl">
              Exclusive merchandise from Towizaza. Apparel, vinyl records, and accessories for true fans.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  setFilterCategory('apparel');
                  document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-light font-medium rounded-full transition-all transform hover:scale-105"
              >
                Shop Apparel
              </button>
              <button 
                onClick={() => {
                  setFilterCategory('vinyl');
                  document.getElementById('store')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-dark/70 hover:bg-dark/50 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/30"
              >
                Vinyl Collection
              </button>
            </div>
          </motion.div>
          
          {/* Product count stats */}
          <motion.div 
            className="mt-12 flex flex-wrap gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="bg-dark/30 backdrop-blur-md px-6 py-3 rounded-lg border border-light/5">
                <div className="text-primary font-bold text-3xl">{count}</div>
                <div className="text-light/70 capitalize">{category}</div>
              </div>
            ))}
            <div className="bg-dark/30 backdrop-blur-md px-6 py-3 rounded-lg border border-light/5">
              <div className="text-primary font-bold text-3xl">{products.length}</div>
              <div className="text-light/70">Total Items</div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Products Section */}
      <motion.section 
        id="store"
        ref={productsRef}
        className="py-16"
        initial={{ opacity: 0 }}
        animate={productsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Shop <span className="text-primary">Merchandise</span></h2>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleFilters}
                className="bg-dark/70 border border-light/20 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-dark/50 transition-colors"
                aria-label="Toggle filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {(searchQuery || filterCategory !== 'all' || sortBy !== 'featured') && (
                  <span className="bg-primary w-2 h-2 rounded-full"></span>
                )}
              </button>
            </div>
          </div>
          
          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                ref={filtersRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-dark/30 backdrop-blur-md border border-light/10 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1">
                      <label className="block text-light/70 text-sm mb-2">Search</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search products..." 
                          className="w-full bg-dark/70 border border-light/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light/50 hover:text-light"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto">
                      <label className="block text-light/70 text-sm mb-2">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(category => (
                          <button
                            key={category.value}
                            onClick={() => setFilterCategory(category.value)}
                            className={`px-4 py-2 rounded-lg text-sm ${
                              filterCategory === category.value 
                                ? 'bg-primary text-light font-medium' 
                                : 'bg-dark/50 text-light/70 hover:bg-dark/30'
                            } transition-colors`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="w-full md:w-auto">
                      <label className="block text-light/70 text-sm mb-2">Sort By</label>
                      <select 
                        className="bg-dark/70 border border-light/20 rounded-lg px-4 py-2.5 appearance-none pr-10 focus:outline-none focus:border-primary w-full md:w-auto"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                      </select>
                    </div>
                    
                    <div className="ml-auto mt-4 md:mt-0">
                      <button 
                        onClick={clearFilters}
                        className="bg-dark/50 hover:bg-dark/30 text-light/80 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results count */}
          <div className="mb-8 text-light/70 text-sm">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            {filterCategory !== 'all' && ` in ${filterCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
          
          {/* Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filterCategory + sortBy + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => {
                    // Determine if this product should be featured (taller)
                    const isFeatured = product.featured || (index % 8 === 0 && index !== 0);
                    
                    return (
                      <motion.div
                        key={product._id || product.id}
                        className={`group relative ${isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Link 
                          href={product._type === 'product' 
                            ? `/store/${product.slug.current}` 
                            : `/store/${product.id}`}
                          className="block h-full"
                        >
                          <div className="bg-dark/40 backdrop-blur-lg rounded-xl overflow-hidden border border-light/5 h-full flex flex-col">
                            <div className={`relative ${isFeatured ? 'aspect-square' : 'aspect-[4/3]'} overflow-hidden`}>
                              <Image 
                                src={getProductImageUrl(product)}
                                alt={product.title}
                                fill
                                sizes={isFeatured 
                                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw" 
                                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                                className="object-cover transition-all duration-700 group-hover:scale-110"
                              />
                              
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              
                              {/* Product badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-2">
                                {product.new && (
                                  <div className="bg-primary text-light text-xs font-bold py-1 px-2 rounded-md shadow-lg">
                                    NEW
                                  </div>
                                )}
                                {product.featured && (
                                  <div className="bg-accent text-light text-xs font-bold py-1 px-2 rounded-md shadow-lg">
                                    FEATURED
                                  </div>
                                )}
                                {!product.inStock && (
                                  <div className="bg-dark/80 text-light/90 text-xs font-medium py-1 px-2 rounded-md shadow-lg">
                                    OUT OF STOCK
                                  </div>
                                )}
                              </div>
                              
                              {/* Quick add button */}
                              <div className="absolute right-3 bottom-3 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                  onClick={(e) => handleAddToCart(product, e)}
                                  disabled={!product.inStock || isLoading}
                                  className={`p-3 rounded-full shadow-lg ${
                                    !product.inStock 
                                      ? 'bg-dark/70 text-light/50 cursor-not-allowed' 
                                      : 'bg-primary hover:bg-primary/90 text-light'
                                  } transition-colors`}
                                  aria-label={`Add ${product.title} to cart`}
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
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-4 flex-grow flex flex-col">
                              <div className="flex-grow">
                                <div className="text-xs text-light/60 uppercase tracking-wider mb-1">{product.category}</div>
                                <h3 className="font-bold text-light group-hover:text-primary transition-colors duration-300 mb-1">
                                  {product.title}
                                </h3>
                                {product.description && isFeatured && (
                                  <p className="text-light/70 text-sm line-clamp-2 mt-2">{product.description}</p>
                                )}
                              </div>
                              
                              <div className="mt-3 flex justify-between items-center">
                                <span className="text-xl font-bold text-light">${product.price.toFixed(2)}</span>
                                <span className="text-xs text-light/60 uppercase">
                                  {product.inStock ? 'In Stock' : 'Sold Out'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div 
                  className="bg-dark/20 backdrop-blur-md rounded-xl p-10 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-light/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl text-light mb-2">No products found</h3>
                  <p className="text-light/60 mb-6">We couldn't find any products matching your criteria. Try adjusting your filters.</p>
                  <button 
                    className="px-6 py-2.5 bg-primary/80 hover:bg-primary text-light rounded-lg transition-colors inline-flex items-center gap-2"
                    onClick={clearFilters}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
} 