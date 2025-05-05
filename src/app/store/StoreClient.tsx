'use client';

import { useState } from 'react';
import { urlFor } from '@/lib/sanity'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

interface StoreClientProps {
  initialProducts: any[];
}

export default function StoreClient({ initialProducts }: StoreClientProps) {
  const [productData] = useState(initialProducts);
  const { addToCart, toggleCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toggleCart();
  };
  
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-10">Merchandise</h1>
        
        {/* Store Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <select 
                className="bg-dark/70 border border-light/20 rounded px-3 py-2 appearance-none pr-8 focus:outline-none focus:border-accent w-full sm:w-auto"
                defaultValue="all"
              >
                <option value="all">All Products</option>
                <option value="apparel">Apparel</option>
                <option value="vinyl">Vinyl</option>
                <option value="accessories">Accessories</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="relative w-full sm:w-auto max-w-xs sm:max-w-none ml-auto">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-dark/70 border border-light/20 rounded px-3 py-2 focus:outline-none focus:border-accent pl-10 w-full"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Store Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {productData.map((product: any, index: number) => {
            // Determine if this product should be displayed taller
            const isTall = index % 5 === 1 || index % 5 === 4
            
            return (
              <div 
                key={product._id || product.id}
                className={`bg-dark/50 glass-dark rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 ${isTall ? 'sm:row-span-2' : ''}`}
              >
                <div className={`${isTall ? 'aspect-square sm:aspect-[3/4]' : 'aspect-square'} bg-mid/20 relative`}>
                  {product.images && product.images.length > 0 && (
                    <Image 
                      src={product._type === 'product' 
                        ? urlFor(product.images[0]).url() 
                        : product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  
                  {(product.new || product.featured) && (
                    <div className="absolute top-3 right-3">
                      {product.new && (
                        <span className="bg-primary/90 text-light text-xs px-2 py-1 rounded">New</span>
                      )}
                      {product.featured && !product.new && (
                        <span className="bg-accent/90 text-light text-xs px-2 py-1 rounded">Featured</span>
                      )}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-dark/60 transition-opacity duration-300">
                    <Link 
                      href={product._type === 'product' 
                        ? `/store/${product.slug.current}` 
                        : `/store/${product.id}`}
                      className="bg-accent/90 text-light font-medium py-2 px-4 rounded-full hover:bg-accent transition-colors"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-medium text-light line-clamp-1">{product.title}</h3>
                  <p className="text-light/70 text-xs sm:text-sm mb-2">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-bold">${product.price.toFixed(2)}</span>
                    <button 
                      className="bg-primary hover:bg-primary/90 text-light p-2 rounded-full transition-colors"
                      aria-label={`Add ${product.title} to cart`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
} 