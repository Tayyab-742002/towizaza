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
  const { play, pause, resume, state, setQueue } = usePlayer();
  
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

  // Check if this album is currently playing
  const isCurrentAlbum = (): boolean => {
    if (!state.currentAlbum || !album) return false;
    
    return (
      // Check ID match
      (state.currentAlbum.id && album.id && state.currentAlbum.id === album.id) ||
      // Check slug match
      (state.currentAlbum.slug && album.slug && state.currentAlbum.slug.current === album.slug.current) ||
      // Check title match as fallback
      (state.currentAlbum.title === album.title && state.currentAlbum.type === album.type)
    );
  };
  
  // Check if a specific track is playing
  const isCurrentTrack = (track: any): boolean => {
    if (!state.currentTrack || !track) return false;
    
    return (
      (track.id && state.currentTrack.id && track.id === state.currentTrack.id) ||
      (track._key && state.currentTrack._key && track._key === state.currentTrack._key) ||
      (track.title === state.currentTrack.title)
    );
  };

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
  
  // Handle play/pause for the album
  const handlePlayAlbum = () => {
    const firstPlayableTrack = getFirstPlayableTrack();
    if (!firstPlayableTrack) return;
    
    // Toggle play/pause if this is the current album
    if (isCurrentAlbum()) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Play the first track of this album and set queue
      play(firstPlayableTrack, album);
      // Only add tracks that have audio URLs to the queue
      const playableTracks = album.tracks.filter((track: any) => !!getAudioUrl(track));
      setQueue(playableTracks);
    }
  };
  
  // Handle track selection
  const handleTrackSelect = (track: any) => {
    if (!getAudioUrl(track)) return;
    
    if (isCurrentTrack(track)) {
      // Toggle play/pause if this is the current track
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Play this track and set the album queue
      play(track, album);
      const playableTracks = album.tracks.filter((t: any) => !!getAudioUrl(t));
      setQueue(playableTracks);
    }
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
              
              {/* Play button overlay */}
              <div 
                className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handlePlayAlbum}
              >
                <button 
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transform hover:scale-110 transition-transform"
                >
                  {isCurrentAlbum() && state.isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* "Now Playing" indicator */}
              {isCurrentAlbum() && (
                <div className="absolute top-2 right-2 bg-primary text-light text-xs font-bold py-1 px-2 rounded-full">
                  {state.isPlaying ? 'Now Playing' : 'Paused'}
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold">{album.title}</h1>
              <p className="text-light/70 mb-2">{album.type.charAt(0).toUpperCase() + album.type.slice(1)} • {album.year}</p>
              
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={handlePlayAlbum}
                  className={`bg-accent text-light px-4 py-2 rounded-full text-sm font-medium ${
                    hasPlayableTracks 
                      ? 'hover:bg-accent/90 transition-colors' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!hasPlayableTracks}
                >
                  {isCurrentAlbum() && state.isPlaying ? 'Pause' : 'Play Album'}
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
                  className={`flex items-center p-3 rounded-md ${
                    isCurrentTrack(track) 
                      ? 'bg-primary/20' 
                      : 'hover:bg-light/5'
                  } transition-colors ${
                    getAudioUrl(track) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60' 
                  }`}
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="w-8 text-light/50 text-sm flex items-center justify-center">
                    {isCurrentTrack(track) && state.isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className={`font-medium ${isCurrentTrack(track) ? 'text-primary' : ''}`}>
                      {track.title}
                    </p>
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