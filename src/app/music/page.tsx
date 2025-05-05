'use client';

import { useState, useEffect } from 'react'
import { getMusic } from '@/lib/sanity'
import { fallbackMusic } from '@/lib/fallbackData'
import { urlFor, getAudioUrl } from '@/lib/sanity'
import { usePlayer } from '@/context/PlayerContext'
import { Album } from '@/data/music'
import Image from 'next/image'
import Link from 'next/link'

export default function MusicPage() {
  const { play, pause, resume, state, setQueue } = usePlayer();
  const [musicData, setMusicData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchMusic() {
      try {
        const music = await getMusic();
        setMusicData(music || fallbackMusic);
      } catch (error) {
        console.error('Error fetching music data:', error);
        setMusicData(fallbackMusic);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMusic();
  }, []);
  
  // Check if a given album is the current album being played
  const isCurrentAlbum = (album: Album): boolean => {
    if (!state.currentAlbum) return false;
    
    return (
      // Check ID match
      (state.currentAlbum.id && album.id && state.currentAlbum.id === album.id) ||
      // Check slug match
      (state.currentAlbum.slug && album.slug && state.currentAlbum.slug.current === album.slug.current) ||
      // Check title match as fallback
      (state.currentAlbum.title === album.title && state.currentAlbum.type === album.type)
    );
  };
  
  // Play the first track and set the album queue
  const handlePlayAlbum = (album: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Filter tracks that have valid audio URLs
    const playableTracks = album.tracks.filter((track: any) => !!getAudioUrl(track));
    
    // Toggle play/pause if this is the current album
    if (isCurrentAlbum(album)) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Play the first track of this album and set queue
      if (playableTracks.length > 0) {
        play(playableTracks[0], album);
        setQueue(playableTracks);
      } else {
        // Alert or toast notification could be added here
        console.warn('No playable tracks found in this album');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-10">Music</h1>
        
        {/* Catalog Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button className="px-4 py-2 rounded bg-secondary/30 text-light">Grid</button>
            <button className="px-4 py-2 rounded text-light/70">List</button>
            
            <div className="relative">
              <select 
                className="bg-dark/70 border border-light/20 rounded px-3 py-2 appearance-none pr-8 focus:outline-none focus:border-accent"
                defaultValue="all"
              >
                <option value="all">All Albums</option>
                <option value="album">Albums</option>
                <option value="single">Singles</option>
                <option value="ep">EPs</option>
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
              placeholder="Search music..." 
              className="bg-dark/70 border border-light/20 rounded px-3 py-2 focus:outline-none focus:border-accent pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Music Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {musicData.map((album: any) => (
            <div 
              key={album._id || album.id}
              className="bg-dark/50 glass-dark rounded-lg overflow-hidden hover:transform hover:scale-[1.02] transition-all"
            >
              <div className="aspect-square bg-mid/20 relative">
                {album.artwork && (
                  <Image 
                    src={album._type === 'music' 
                      ? urlFor(album.artwork).url() 
                      : album.artwork}
                    alt={album.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-dark/60 transition-opacity">
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => handlePlayAlbum(album, e)}
                      className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      {isCurrentAlbum(album) && state.isPlaying ? (
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
                    <Link 
                      href={album._type === 'music' 
                        ? `/music/${album.slug.current}` 
                        : `/music/${album.id}`}
                      className="w-10 h-10 rounded-full bg-accent/90 flex items-center justify-center self-center hover:bg-accent transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </Link>
                  </div>
                </div>
                
                {/* "Now Playing" indicator */}
                {isCurrentAlbum(album) && (
                  <div className="absolute top-2 right-2 bg-primary text-light text-xs font-bold py-1 px-2 rounded-full">
                    {state.isPlaying ? 'Now Playing' : 'Paused'}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-light">{album.title}</h3>
                <p className="text-light/70 text-sm">
                  {album.year} • {album.tracks.length} tracks
                </p>
                <div className="flex mt-3 gap-2">
                  <button 
                    onClick={(e) => handlePlayAlbum(album, e)}
                    className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-sm hover:bg-accent/30 transition-colors"
                  >
                    {isCurrentAlbum(album) && state.isPlaying ? 'Pause' : 'Play Album'}
                  </button>
                  {album.downloadUrl && (
                    <a 
                      href={album.downloadUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-sm hover:bg-primary/30 transition-colors"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 