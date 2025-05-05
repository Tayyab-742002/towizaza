import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { Track } from '@/data/music'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-04-16', // Use today's date or the latest API version
  useCdn: process.env.NODE_ENV === 'production',
})

// Create an image URL builder
const builder = imageUrlBuilder(client)

// Helper function to build image URLs
export function urlFor(source: any) {
  return builder.image(source)
}

// Function to fetch products
export async function getProducts() {
  return client.fetch(`*[_type == "product"] | order(title asc)`)
}

// Function to fetch featured products
export async function getFeaturedProducts() {
  return client.fetch(`*[_type == "product" && featured == true] | order(title asc)[0...4]`)
}

// Function to fetch a specific product by slug
export async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      ...,
      "relatedProducts": relatedProducts[]->
    }`, 
    { slug }
  )
}

// Function to fetch all music
export async function getMusic() {
  return client.fetch(`*[_type == "music"] | order(releaseDate desc)`)
}

// Function to fetch featured music
export async function getFeaturedMusic() {
  return client.fetch(`*[_type == "music" && featured == true] | order(releaseDate desc)[0...4]`)
}

// Function to fetch a specific album by slug
export async function getMusicBySlug(slug: string) {
  return client.fetch(`*[_type == "music" && slug.current == $slug][0]`, { slug })
}

// Function to fetch events
export async function getEvents() {
  return client.fetch(`*[_type == "event" && date >= now()] | order(date asc)`)
}

// Function to fetch featured events
export async function getFeaturedEvents() {
  return client.fetch(`*[_type == "event" && featured == true && date >= now()] | order(date asc)[0...3]`)
}

// Function to fetch artist info
export async function getArtistInfo() {
  return client.fetch(`*[_type == "artist"][0]`)
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