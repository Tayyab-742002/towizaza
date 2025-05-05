import { getProducts } from '@/lib/sanity'
import { fallbackProducts } from '@/lib/fallbackData'
import { urlFor } from '@/lib/sanity'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'

// This ensures Next.js will attempt to re-generate the page:
// - When a request comes in
// - At most once every hour
export const revalidate = 3600

async function getProductData() {
  try {
    const products = await getProducts()
    return products
  } catch (error) {
    console.error('Error fetching product data:', error)
    return fallbackProducts
  }
}

export default async function StorePage() {
  const productData = await getProductData()
  
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-10">Merchandise</h1>
        
        {/* Store Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="relative">
              <select 
                className="bg-dark/70 border border-light/20 rounded px-3 py-2 appearance-none pr-8 focus:outline-none focus:border-accent"
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
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-dark/70 border border-light/20 rounded px-3 py-2 focus:outline-none focus:border-accent pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Store Products Masonry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productData.map((product: any, index: number) => {
            // Determine if this product should be displayed taller
            const isTall = index % 5 === 1 || index % 5 === 4
            
            return (
              <div 
                key={product._id || product.id}
                className={`bg-dark/50 glass-dark rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all ${isTall ? 'row-span-2' : ''}`}
              >
                <div className={`${isTall ? 'aspect-[3/4]' : 'aspect-square'} bg-mid/20 relative`}>
                  {product.images && product.images.length > 0 && (
                    <Image 
                      src={product._type === 'product' 
                        ? urlFor(product.images[0]).url() 
                        : product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
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
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-dark/60 transition-opacity">
                    <Link 
                      href={product._type === 'product' 
                        ? `/store/${product.slug.current}` 
                        : `/store/${product.id}`}
                      className="bg-accent/90 text-light font-medium py-2 px-4 rounded-full"
                    >
                      Quick View
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-light">{product.title}</h3>
                  <p className="text-light/70 text-sm mb-2">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    <button 
                      className="bg-primary hover:bg-primary/90 text-light p-2 rounded-full"
                      aria-label={`Add ${product.title} to cart`}
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
      
      {/* Cart button is handled by the CartContext/ShoppingCart component */}
    </div>
  );
} 