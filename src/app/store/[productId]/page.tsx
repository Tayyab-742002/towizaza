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
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6 sm:mb-8 text-light/60 text-sm">
          <Link href="/store" className="hover:text-light transition-colors">Store</Link>
          <span className="mx-2">/</span>
          <span className="text-light">{product.title}</span>
        </div>
        
        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-mid/20 rounded-lg overflow-hidden">
              <img 
                src={getImageUrl(currentImageIndex)} 
                alt={product.title} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image: any, index: number) => (
                  <div 
                    key={index} 
                    className={`w-14 sm:w-16 h-14 sm:h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer transition-all duration-200 ${
                      index === currentImageIndex ? 'ring-2 ring-accent' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={typeof image === 'string' ? image : urlFor(image).url()} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{product.title}</h1>
            <p className="text-light/70 mb-4">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </p>
            
            <div className="mb-4 sm:mb-6">
              <span className="text-xl sm:text-2xl font-bold">${product.price.toFixed(2)}</span>
              
              {!product.inStock && (
                <span className="ml-3 sm:ml-4 text-primary">Out of Stock</span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-light/80">{product.description}</p>
            </div>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5 sm:mb-6">
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: ProductSize) => (
                    <button
                      key={size.id}
                      className={`px-3 py-1 border rounded-md transition-all duration-200 ${
                        selectedSize === size.id 
                          ? 'bg-accent text-light border-accent' 
                          : 'border-light/30 text-light/80'
                      } ${
                        !size.inStock ? 'opacity-40 cursor-not-allowed' : 'hover:border-accent'
                      }`}
                      onClick={() => size.inStock && setSelectedSize(size.id)}
                      disabled={!size.inStock}
                    >
                      {size.label}
                      {!size.inStock && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-5 sm:mb-6">
                <h3 className="font-medium mb-2">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant: ProductVariant) => (
                    <button
                      key={variant.id}
                      className={`px-3 py-1 border rounded-md transition-all duration-200 ${
                        selectedVariant === variant.id 
                          ? 'bg-accent text-light border-accent' 
                          : 'border-light/30 text-light/80'
                      } ${
                        !variant.inStock ? 'opacity-40 cursor-not-allowed' : 'hover:border-accent'
                      }`}
                      onClick={() => variant.inStock && setSelectedVariant(variant.id)}
                      disabled={!variant.inStock}
                    >
                      {variant.name}
                      {!variant.inStock && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div className="mb-5 sm:mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  className="w-8 h-8 flex items-center justify-center bg-mid/30 rounded-l-md hover:bg-mid/40 transition-colors"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <input 
                  type="number" 
                  className="w-12 h-8 text-center bg-mid/20 text-light border-none focus:outline-none focus:ring-0"
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <button 
                  className="w-8 h-8 flex items-center justify-center bg-mid/30 rounded-r-md hover:bg-mid/40 transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="mb-6 sm:mb-8">
              <button 
                className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                  product.inStock 
                    ? 'bg-primary hover:bg-primary/90 text-light' 
                    : 'bg-mid/30 text-light/50 cursor-not-allowed'
                }`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
            
            {/* Product Tags */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {product.featured && (
                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Featured</span>
              )}
              {product.new && (
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">New</span>
              )}
              <span className="px-2 py-1 bg-mid/20 text-light/70 rounded text-xs">
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((related: any) => (
                <Link 
                  key={related._id || related.id} 
                  href={`/store/${related.slug ? related.slug.current : related.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-mid/20 rounded-lg overflow-hidden mb-3">
                    {related.images && related.images.length > 0 && (
                      <img 
                        src={typeof related.images[0] === 'string' 
                          ? related.images[0] 
                          : urlFor(related.images[0]).url()} 
                        alt={related.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-light group-hover:text-accent transition-colors line-clamp-1">{related.title}</h3>
                  <p className="text-light/70 text-sm">${related.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 