"use client";

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { urlFor, getAudioUrl } from '@/lib/sanity';
import { usePlayer } from '@/context/PlayerContext';
import { Album, Track } from '@/data/music';

interface FeaturedTrackProps {
  album: Album;
}

export default function FeaturedTrack({ album }: FeaturedTrackProps) {
  const { play, pause, resume, state, setQueue } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);
  
  // Get the first playable track from the album
  const getFirstPlayableTrack = (): Track | null => {
    if (!album || !album.tracks || album.tracks.length === 0) return null;
    return album.tracks.find(track => !!getAudioUrl(track)) || null;
  };
  
  const firstPlayableTrack = getFirstPlayableTrack();
  
  // Check if this is the current album being played
  const isCurrentAlbum = state.currentAlbum && (
    // Check ID match
    (state.currentAlbum.id && album.id && state.currentAlbum.id === album.id) ||
    // Check slug match
    (state.currentAlbum.slug && album.slug && state.currentAlbum.slug.current === album.slug.current) ||
    // Check title match as fallback
    (state.currentAlbum.title === album.title && state.currentAlbum.type === album.type)
  );
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstPlayableTrack) return;
    
    // Get all playable tracks for the queue
    const playableTracks = album.tracks.filter(track => !!getAudioUrl(track));
    
    // Toggle play/pause if this is the current album
    if (isCurrentAlbum) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Play the first track of this album and set queue
      play(firstPlayableTrack, album);
      
      // Make sure we set the queue with all playable tracks
      if (playableTracks.length > 0) {
        setQueue(playableTracks);
      }
    }
  };
  
  // Get album artwork URL
  const getArtworkUrl = () => {
    if (!album.artwork) return '/images/placeholder-album.jpg';
    
    if (typeof album.artwork === 'string') {
      return album.artwork;
    }
    
    // If it's a Sanity image
    return urlFor(album.artwork).url();
  };
  
  return (
    <div 
      className="min-w-[250px] bg-dark/50 glass-dark rounded-lg p-4 hover:transform hover:scale-105 transition-all relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-square bg-mid/20 rounded-md mb-4 relative overflow-hidden">
        {album.artwork && (
          <Image 
            src={getArtworkUrl()}
            alt={album.title}
            fill
            className="object-cover"
          />
        )}
        
        {/* Play button overlay */}
        <div 
          className={`absolute inset-0 bg-dark/60 flex items-center justify-center ${
            isHovering || (isCurrentAlbum && state.isPlaying) ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 cursor-pointer`}
          onClick={handlePlay}
        >
          <button 
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center transform hover:scale-110 transition-transform"
            aria-label={isCurrentAlbum && state.isPlaying ? "Now Playing" : "Play Album"}
          >
            {isCurrentAlbum && state.isPlaying ? (
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
        {isCurrentAlbum && (
          <div className="absolute top-2 right-2 bg-primary text-light text-xs font-bold py-1 px-2 rounded-full">
            {state.isPlaying ? 'Now Playing' : 'Paused'}
          </div>
        )}
      </div>
      
      <Link href={`/music/${album._type === 'music' ? album.slug?.current : album.id}`}>
        <h3 className="text-light text-lg font-medium">{album.title}</h3>
        <p className="text-light/70 text-sm">{album.year}</p>
      </Link>
    </div>
  );
} 