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

// Helper function to safely get audio URL from various sources with optimizations
export function getAudioUrl(track: Track, options?: { quality?: 'low' | 'medium' | 'high', dataSaver?: boolean }): string {
  const { quality = 'high', dataSaver = false } = options || {};

  // Check if in data saver mode - return lower quality by default
  const effectiveQuality = dataSaver ? 'low' : quality;

  // First try external URL (Cloudflare)
  if (track.externalUrl) {
    // Enhanced URL handling for R2/Cloudflare
    if (track.externalUrl.includes('.r2.dev/')) {
      const baseUrl = track.externalUrl.split('?')[0]; // Remove any existing query params

      // Add query parameters for optimized delivery based on quality
      if (effectiveQuality === 'low') {
        return `${baseUrl}?quality=low`;
      } else if (effectiveQuality === 'medium') {
        return `${baseUrl}?quality=medium`;
      }

      // For high quality, return the original URL
      return track.externalUrl;
    }

    return track.externalUrl;
  }

  // Then try Sanity asset with quality options
  if (track.previewUrl && typeof track.previewUrl === 'object' && track.previewUrl.asset) {
    try {
      let baseUrl = '';

      // Handle MP3 files
      if (track.previewUrl.asset._ref.includes('-mp3')) {
        baseUrl = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${track.previewUrl.asset._ref.replace('file-', '').replace('-mp3', '.mp3')}`;
      }
      // Handle MP4 files
      else if (track.previewUrl.asset._ref.includes('-mp4')) {
        baseUrl = `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${track.previewUrl.asset._ref.replace('file-', '').replace('-mp4', '.mp4')}`;
      }

      // Add quality parameters for CDN-based optimization
      if (baseUrl) {
        if (effectiveQuality === 'low') {
          return `${baseUrl}?dl=low-quality`;
        } else if (effectiveQuality === 'medium') {
          return `${baseUrl}?dl=medium-quality`;
        }
        return baseUrl;
      }
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

// Function to detect if user might be on mobile data connection
export function isMobileDataConnection(): boolean {
  if (typeof navigator === 'undefined') return false;

  const connection = (navigator as any).connection ||
                    (navigator as any).mozConnection ||
                    (navigator as any).webkitConnection;

  if (connection) {
    // If we can detect connection type directly
    if (connection.type === 'cellular' || connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' || connection.effectiveType === '3g') {
      return true;
    }

    // If the connection has a saveData property
    if (connection.saveData) {
      return true;
    }
  }

  return false;
}

// Preload audio file - useful for playlist preparation
export function preloadAudioFile(audioUrl: string): void {
  if (!audioUrl || typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'audio';
  link.href = audioUrl;
  document.head.appendChild(link);
}

// Preload the next track in a queue to improve playback transition
export function preloadNextTrack(currentTrack: Track, queue: Track[]): void {
  if (!queue?.length || typeof window === 'undefined') return;

  const currentIndex = queue.findIndex(track =>
    (track.id && currentTrack.id && track.id === currentTrack.id) ||
    (track._key && currentTrack._key && track._key === currentTrack._key) ||
    false
  );

  // If we found the current track and there's a next track
  if (currentIndex !== -1 && currentIndex < queue.length - 1) {
    const nextTrack = queue[currentIndex + 1];
    const audioUrl = getAudioUrl(nextTrack);
    preloadAudioFile(audioUrl);
  }
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
