import { products } from '@/data/store'
import { musicCatalog } from '@/data/music'
import { events } from '@/data/events'

// Type for the artist info
export type ArtistInfo = {
  name: string
  bio: any[] // Sanity block content
  profileImage?: any
  heroImage?: any
  socialLinks: {
    spotify?: string
    youtube?: string
    instagram?: string
    twitter?: string
    facebook?: string
    soundcloud?: string
    bandcamp?: string
  }
  email?: string
  bookingEmail?: string
}

// Fallback artist info
export const fallbackArtistInfo: ArtistInfo = {
  name: 'Towizaza',
  bio: [
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Towizaza is an electronic music producer known for blending futuristic soundscapes with emotive melodies. With a background spanning multiple genres, Towizaza creates immersive listening experiences that transport audiences to digital dreamscapes.'
        }
      ]
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Since debuting in 2018, Towizaza has released several critically acclaimed projects including the breakout album "Synthetic Memories" and the recent "Harmonic Convergence" which established a unique sonic identity in the electronic music scene.'
        }
      ]
    }
  ],
  socialLinks: {
    spotify: 'https://open.spotify.com/artist/example',
    youtube: 'https://youtube.com/@towizaza',
    instagram: 'https://instagram.com/towizaza',
    twitter: 'https://twitter.com/towizaza',
    facebook: 'https://facebook.com/towizaza',
    soundcloud: 'https://soundcloud.com/towizaza',
    bandcamp: 'https://towizaza.bandcamp.com'
  },
  email: 'contact@towizaza.com',
  bookingEmail: 'bookings@towizaza.com'
}

// Export the existing mock data as fallback data
export const fallbackProducts = products
export const fallbackMusic = musicCatalog
export const fallbackEvents = events 