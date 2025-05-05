import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { Track } from '@/data/music'

// Cache storage for query results
// Using a Map allows us to use query + params as the key
const queryCache = new Map<string, { data: any; timestamp: number }>()

// Cache expiration time: 5 minutes in ms (adjust as needed)
const CACHE_EXPIRY = 5 * 60 * 1000

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-04-16', // Use today's date or the latest API version
  useCdn: true, // Always use CDN for better performance
  perspective: 'published',
})

// Create an image URL builder
const builder = imageUrlBuilder(client)

// Helper function to build image URLs
export function urlFor(source: any) {
  return builder.image(source)
}

// Wrapper for client.fetch with caching
async function cachedFetch(query: string, params?: any) {
  // Create a cache key from the query and params
  const cacheKey = JSON.stringify({ query, params })
  
  // Check if we have a valid cache entry
  const cached = queryCache.get(cacheKey)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp < CACHE_EXPIRY)) {
    console.log('Cache hit:', query.substring(0, 60) + '...')
    return cached.data
  }
  
  // No cache hit, fetch from Sanity
  console.log('Cache miss, fetching from Sanity:', query.substring(0, 60) + '...')
  const data = await client.fetch(query, params)
  
  // Store in cache
  queryCache.set(cacheKey, { data, timestamp: now })
  
  return data
}

// Function to fetch products
export async function getProducts() {
  return cachedFetch(`*[_type == "product"] | order(title asc)`)
}

// Function to fetch featured products
export async function getFeaturedProducts() {
  return cachedFetch(`*[_type == "product" && featured == true] | order(title asc)[0...4]`)
}

// Function to fetch a specific product by slug
export async function getProductBySlug(slug: string) {
  return cachedFetch(
    `*[_type == "product" && slug.current == $slug][0]{
      ...,
      "relatedProducts": relatedProducts[]->
    }`, 
    { slug }
  )
}

// Function to fetch all music
export async function getMusic() {
  return cachedFetch(`*[_type == "music" && (upcoming != true || !defined(upcoming))] | order(releaseDate desc)`)
}

// Function to fetch featured music
export async function getFeaturedMusic() {
  // Get music that is featured but not upcoming
  const musicQuery = `*[_type == "music" && featured == true && (upcoming != true || !defined(upcoming))] | order(releaseDate desc)[0...4]`;
  
  try {
    const music = await cachedFetch(musicQuery);
    return music || [];
  } catch (error) {
    console.error("Error fetching featured music:", error);
    return [];
  }
}

// Function to fetch a specific album by slug
export async function getMusicBySlug(slug: string) {
  return cachedFetch(`*[_type == "music" && slug.current == $slug][0]`, { slug })
}

// Function to fetch events
export async function getEvents() {
  return cachedFetch(`*[_type == "event" && date >= now()] | order(date asc)`)
}

// Function to fetch featured events
export async function getFeaturedEvents() {
  return cachedFetch(`*[_type == "event" && featured == true && date >= now()] | order(date asc)[0...3]`)
}

// Function to fetch artist info
export async function getArtistInfo() {
  return cachedFetch(`*[_type == "artist"][0]`)
}

// Helper function to safely get audio URL from various sources
export function getAudioUrl(track: Track): string {
  // First try external URL (Cloudflare)
  if (track.externalUrl) {
    // Check if the URL is a direct reference to Cloudflare R2 without extension
    if (track.externalUrl.includes('.r2.dev/') && 
        !track.externalUrl.match(/\.(mp3|mp4|wav|ogg|webm)$/i)) {
      // If it's an R2 URL without extension, try to infer it's MP4
      return `${track.externalUrl}`;
    }
    return track.externalUrl;
  }
  
  // Then try Sanity asset
  if (track.previewUrl && typeof track.previewUrl === 'object' && track.previewUrl.asset) {
    try {
      // Handle MP3 files
      if (track.previewUrl.asset._ref.includes('-mp3')) {
        return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${track.previewUrl.asset._ref.replace('file-', '').replace('-mp3', '.mp3')}`;
      }
      // Handle MP4 files
      else if (track.previewUrl.asset._ref.includes('-mp4')) {
        return `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${track.previewUrl.asset._ref.replace('file-', '').replace('-mp4', '.mp4')}`;
      }
      // Other file types would be handled similarly
    } catch (error) {
      console.error("Error creating Sanity audio URL:", error);
    }
  }
  
  // Then try URL string
  if (typeof track.previewUrl === 'string') {
    return track.previewUrl;
  }
  
  // Return empty string if no valid URL found
  return '';
}

// Function to fetch upcoming songs
export async function getUpcomingSongs() {
  console.log("Fetching upcoming songs...");
  
  const query = `*[_type == "upcomingSong"] | order(releaseDate asc)`;
  
  try {
    const upcomingSongs = await cachedFetch(query);
    
    if (!upcomingSongs || upcomingSongs.length === 0) {
      console.log("No upcoming songs found in Sanity, returning fallback data");
      // Import dynamically and use type assertion for fallback data
      const { musicCatalog } = await import('@/data/music');
      return musicCatalog.filter((item) => item.upcoming && item.featured);
    }
    
    return upcomingSongs;
  } catch (error) {
    console.error("Error fetching upcoming songs:", error);
    
    // Import dynamically and use type assertion for fallback data
    const { musicCatalog } = await import('@/data/music');
    return musicCatalog.filter((item) => item.upcoming && item.featured);
  }
}

// Function to manually clear cache if needed (e.g., after a mutation)
export function clearSanityCache() {
  queryCache.clear();
  console.log('Sanity cache cleared');
} 