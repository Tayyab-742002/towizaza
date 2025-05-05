'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getMusicBySlug } from '@/lib/sanity';
import { fallbackMusic } from '@/lib/fallbackData';
import { urlFor, getAudioUrl } from '@/lib/sanity';
import { usePlayer } from '@/context/PlayerContext';

// Client component for music player functionality
export default function AlbumDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { play, setQueue } = usePlayer();
  
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        setLoading(true);
        const data = await getMusicBySlug(slug);
        
        if (data) {
          setAlbum(data);
        } else {
          // If no Sanity data, try to find from fallback
          const fallbackAlbum = fallbackMusic.find(a => 
            a.id === slug || 
            (a.slug && a.slug.current === slug)
          );
          
          if (fallbackAlbum) {
            setAlbum(fallbackAlbum);
          } else {
            setError('Album not found');
          }
        }
      } catch (err) {
        console.error('Error fetching album:', err);
        setError('Failed to load album');
        
        // Try fallback data
        const fallbackAlbum = fallbackMusic.find(a => 
          a.id === slug || 
          (a.slug && a.slug.current === slug)
        );
        
        if (fallbackAlbum) {
          setAlbum(fallbackAlbum);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchAlbum();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error && !album) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">{error}</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">Album not found</div>
      </div>
    );
  }

  // Helper function to get album artwork URL
  const getArtworkUrl = () => {
    if (!album.artwork) return '/images/placeholder-album.jpg';
    
    if (typeof album.artwork === 'string') {
      return album.artwork;
    }
    
    // If it's a Sanity image
    return urlFor(album.artwork).url();
  };

  // Check if album has playable tracks
  const hasPlayableTracks = album.tracks.some((track: any) => !!getAudioUrl(track));
  
  // Get the first playable track
  const getFirstPlayableTrack = () => {
    return album.tracks.find((track: any) => !!getAudioUrl(track));
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Album Artwork and Info */}
          <div className="md:col-span-1">
            <div className="aspect-square bg-mid/20 glass-dark rounded-lg overflow-hidden relative">
              <Image 
                src={getArtworkUrl()}
                alt={album.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold">{album.title}</h1>
              <p className="text-light/70 mb-2">{album.type.charAt(0).toUpperCase() + album.type.slice(1)} • {album.year}</p>
              
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => {
                    const firstPlayableTrack = getFirstPlayableTrack();
                    if (firstPlayableTrack) {
                      play(firstPlayableTrack, album);
                      // Only add tracks that have audio URLs to the queue
                      const playableTracks = album.tracks.filter((track: any) => !!getAudioUrl(track));
                      setQueue(playableTracks);
                    }
                  }}
                  className={`bg-accent text-light px-4 py-2 rounded-full text-sm font-medium ${
                    hasPlayableTracks 
                      ? 'hover:bg-accent/90 transition-colors' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!hasPlayableTracks}
                >
                  Play Album
                </button>
                
                {album.downloadUrl && (
                  <a 
                    href={album.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-primary text-light px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Tracklist */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Tracklist</h2>
            
            <div className="space-y-1">
              {album.tracks.map((track: any, index: number) => (
                <div 
                  key={track.id || track._key}
                  className={`flex items-center p-3 rounded-md hover:bg-light/5 transition-colors ${
                    getAudioUrl(track) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60' 
                  }`}
                  onClick={() => getAudioUrl(track) ? play(track, album) : null}
                >
                  <div className="w-8 text-light/50 text-sm">{index + 1}</div>
                  <div className="flex-grow">
                    <p className="font-medium">{track.title}</p>
                    {!getAudioUrl(track) && (
                      <p className="text-xs text-red-400">Audio not available</p>
                    )}
                  </div>
                  <div className="text-light/70 text-sm">{track.duration}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 