import { getProducts } from '@/lib/sanity'
import { fallbackProducts } from '@/lib/fallbackData'
import StoreClient from '@/components/pages/StoreClient';



// Revalidation settings for the server component
export const revalidate = 3600

// Server component to fetch data
export default async function StorePage() {
  let products;

  try {
    products = await getProducts();
  } catch (error) {
    console.error('Error fetching product data:', error);
    products = fallbackProducts;
  }

  return <StoreClient initialProducts={products} />;
} 