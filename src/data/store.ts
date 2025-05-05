export type ProductCategory = 'apparel' | 'vinyl' | 'accessories';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export interface ProductSize {
  id: string;
  label: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  featured?: boolean;
  new?: boolean;
  variants?: ProductVariant[];
  sizes?: ProductSize[];
  inStock: boolean;
  relatedProducts?: string[];
}

export const products: Product[] = [
  {
    id: 'product-1',
    title: 'Synthetic Memories Vinyl',
    description: 'Limited edition 180g vinyl pressing of the debut album "Synthetic Memories". Includes gatefold cover with exclusive artwork and digital download code.',
    price: 29.99,
    images: [
      '/images/products/synthetic-memories-vinyl-1.jpg',
      '/images/products/synthetic-memories-vinyl-2.jpg',
      '/images/products/synthetic-memories-vinyl-3.jpg'
    ],
    category: 'vinyl',
    featured: true,
    inStock: true,
    relatedProducts: ['product-4', 'product-7']
  },
  {
    id: 'product-2',
    title: 'Logo T-Shirt',
    description: 'Classic black t-shirt featuring the Towizaza logo on the front. Made from 100% organic cotton.',
    price: 24.99,
    images: [
      '/images/products/logo-tshirt-1.jpg',
      '/images/products/logo-tshirt-2.jpg'
    ],
    category: 'apparel',
    inStock: true,
    sizes: [
      { id: 'size-s', label: 'S', inStock: true },
      { id: 'size-m', label: 'M', inStock: true },
      { id: 'size-l', label: 'L', inStock: true },
      { id: 'size-xl', label: 'XL', inStock: true },
      { id: 'size-xxl', label: 'XXL', inStock: false }
    ],
    relatedProducts: ['product-3', 'product-5']
  },
  {
    id: 'product-3',
    title: 'Tour Hoodie',
    description: 'Premium quality hoodie with "Harmonic Convergence Tour" design. Features tour dates on the back and a minimalist design on the front.',
    price: 49.99,
    images: [
      '/images/products/tour-hoodie-1.jpg',
      '/images/products/tour-hoodie-2.jpg',
      '/images/products/tour-hoodie-3.jpg'
    ],
    category: 'apparel',
    featured: true,
    inStock: true,
    sizes: [
      { id: 'size-s', label: 'S', inStock: true },
      { id: 'size-m', label: 'M', inStock: true },
      { id: 'size-l', label: 'L', inStock: true },
      { id: 'size-xl', label: 'XL', inStock: true },
      { id: 'size-xxl', label: 'XXL', inStock: true }
    ],
    relatedProducts: ['product-2', 'product-5']
  },
  {
    id: 'product-4',
    title: 'Harmonic Convergence Vinyl',
    description: 'Double LP vinyl featuring the critically acclaimed "Harmonic Convergence" album. Includes holographic artwork that changes in different lighting conditions.',
    price: 34.99,
    images: [
      '/images/products/harmonic-convergence-vinyl-1.jpg',
      '/images/products/harmonic-convergence-vinyl-2.jpg'
    ],
    category: 'vinyl',
    new: true,
    inStock: true,
    relatedProducts: ['product-1', 'product-7']
  },
  {
    id: 'product-5',
    title: 'Digital Dreams Long Sleeve',
    description: 'Long sleeve shirt featuring artwork from the "Digital Dreams" EP. Glow-in-the-dark print on sleeves.',
    price: 32.99,
    images: [
      '/images/products/digital-dreams-longsleeve-1.jpg',
      '/images/products/digital-dreams-longsleeve-2.jpg'
    ],
    category: 'apparel',
    inStock: true,
    sizes: [
      { id: 'size-s', label: 'S', inStock: true },
      { id: 'size-m', label: 'M', inStock: true },
      { id: 'size-l', label: 'L', inStock: false },
      { id: 'size-xl', label: 'XL', inStock: true },
      { id: 'size-xxl', label: 'XXL', inStock: true }
    ],
    relatedProducts: ['product-2', 'product-3']
  },
  {
    id: 'product-6',
    title: 'LED Sound Reactive Mask',
    description: 'Limited edition sound reactive LED mask, perfect for shows. The LED patterns react to music in real-time, creating a unique visual experience.',
    price: 59.99,
    images: [
      '/images/products/led-mask-1.jpg',
      '/images/products/led-mask-2.jpg',
      '/images/products/led-mask-3.jpg'
    ],
    category: 'accessories',
    featured: true,
    new: true,
    inStock: true,
    relatedProducts: ['product-8', 'product-9']
  },
  {
    id: 'product-7',
    title: 'Complete Vinyl Collection',
    description: 'The complete Towizaza discography on vinyl. Includes all albums and EPs in a custom designed box with exclusive artwork.',
    price: 129.99,
    images: [
      '/images/products/vinyl-collection-1.jpg',
      '/images/products/vinyl-collection-2.jpg'
    ],
    category: 'vinyl',
    inStock: false,
    relatedProducts: ['product-1', 'product-4']
  },
  {
    id: 'product-8',
    title: 'Geometric Logo Necklace',
    description: 'Sterling silver necklace featuring the geometric Towizaza logo. Handcrafted by artisan jewelers.',
    price: 79.99,
    images: [
      '/images/products/necklace-1.jpg',
      '/images/products/necklace-2.jpg'
    ],
    category: 'accessories',
    inStock: true,
    relatedProducts: ['product-6', 'product-9']
  },
  {
    id: 'product-9',
    title: 'Holographic Phone Case',
    description: 'Protective phone case with holographic Towizaza artwork that shifts colors as it moves. Available for various phone models.',
    price: 19.99,
    images: [
      '/images/products/phone-case-1.jpg',
      '/images/products/phone-case-2.jpg'
    ],
    category: 'accessories',
    inStock: true,
    variants: [
      { id: 'variant-1', name: 'iPhone 13/14', price: 19.99, inStock: true },
      { id: 'variant-2', name: 'iPhone 13/14 Pro', price: 19.99, inStock: true },
      { id: 'variant-3', name: 'iPhone 13/14 Pro Max', price: 24.99, inStock: true },
      { id: 'variant-4', name: 'Samsung Galaxy S22', price: 19.99, inStock: true },
      { id: 'variant-5', name: 'Samsung Galaxy S22 Ultra', price: 24.99, inStock: false },
      { id: 'variant-6', name: 'Google Pixel 6', price: 19.99, inStock: true }
    ],
    relatedProducts: ['product-6', 'product-8']
  }
]; 