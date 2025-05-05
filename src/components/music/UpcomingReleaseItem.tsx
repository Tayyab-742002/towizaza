"use client";

import { useState } from 'react';
import Image from "next/image";
import { urlFor } from '@/lib/sanity';
import { Album } from '@/data/music';
import { motion } from 'framer-motion';

interface UpcomingReleaseItemProps {
  album: Album | any; // Allow any type to accommodate Sanity schema variations
  className?: string;
}

export default function UpcomingReleaseItem({ album, className = '' }: UpcomingReleaseItemProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Get album artwork URL with error handling
  const getArtworkUrl = () => {
    if (!album.artwork) return '/images/placeholder-album.jpg';
    
    try {
      if (typeof album.artwork === 'string') {
        return album.artwork;
      }
      
      // If it's a Sanity image
      return urlFor(album.artwork).url();
    } catch (error) {
      console.error("Error getting artwork URL:", error);
      return '/images/placeholder-album.jpg';
    }
  };

  // Format release date with error handling
  const formatReleaseDate = () => {
    try {
      const releaseDate = new Date(album.releaseDate);
      const now = new Date();
      
      // Validate date - if invalid, return empty string
      if (isNaN(releaseDate.getTime())) {
        return "Coming soon";
      }
      
      // Calculate difference in days
      const diffTime = releaseDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        return "Coming soon";
      } else if (diffDays <= 7) {
        return `${diffDays} days`;
      } else if (diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} weeks`;
      } else {
        return new Date(album.releaseDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (error) {
      console.error("Error formatting release date:", error);
      return "Coming soon";
    }
  };
  
  // Calculate progress percentage (how close to release date)
  const calculateProgress = () => {
    try {
      const releaseDate = new Date(album.releaseDate);
      const now = new Date();
      
      // Validate date
      if (isNaN(releaseDate.getTime())) {
        return 0;
      }
      
      // If the release date is in the past, show 100%
      if (releaseDate < now) {
        return 100;
      }
      
      const announcementDate = new Date(now);
      announcementDate.setDate(announcementDate.getDate() - 90); // Assuming announced 90 days before
      
      const totalTimespan = releaseDate.getTime() - announcementDate.getTime();
      const elapsedTime = now.getTime() - announcementDate.getTime();
      
      let progress = Math.min((elapsedTime / totalTimespan) * 100, 100);
      
      // Ensure it's between 0-100
      progress = Math.max(0, Math.min(progress, 100));
      
      return progress;
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  };
  
  // Safely get the number of tracks with error handling
  const getTracksCount = () => {
    try {
      return album.tracks?.length || 0;
    } catch (error) {
      return 0;
    }
  };
  
  // Get the first track safely
  const getFirstTrack = () => {
    try {
      return album.tracks && album.tracks.length > 0 ? album.tracks[0] : null;
    } catch (error) {
      return null;
    }
  };

  const firstTrack = getFirstTrack();
  const progress = calculateProgress();
  
  return (
    <motion.div 
      className={`group bg-dark/40 backdrop-blur-lg rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${className} max-w-[320px] border border-white/5`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Album art */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <div className={`w-full h-full ${!isImageLoaded ? 'bg-dark/50 animate-pulse' : ''}`}>
          <Image 
            src={getArtworkUrl()}
            alt={album.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className={`object-cover blur-sm brightness-95 transition-all duration-500 transform scale-110 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
        </div>
        
        {/* Album type badge */}
        <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-md text-light text-xs font-medium py-1 px-2.5 rounded-full">
          {(album.type || 'release').charAt(0).toUpperCase() + (album.type || 'release').slice(1)}
        </div>
        
        {/* Coming soon pill */}
        <div className="absolute bottom-3 left-3 bg-dark/80 backdrop-blur-md text-light text-xs font-semibold py-1 px-3 rounded-full border border-white/10 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          Coming Soon
        </div>
      </div>
      
      {/* Album info */}
      <div className="p-4 flex flex-col">
        <h3 className="text-base font-bold text-light group-hover:text-primary transition-colors duration-200">{album.title}</h3>
        <p className="text-light/70 text-sm mt-1 mb-3">
          {getTracksCount()} {getTracksCount() === 1 ? 'track' : 'tracks'} • {album.year || new Date(album.releaseDate).getFullYear()}
        </p>
        
        {/* Release date progress bar */}
        <div className="mb-3.5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-light/80">Release Countdown</span>
            <span className="text-xs text-primary font-medium">{formatReleaseDate()}</span>
          </div>
          <div className="w-full bg-dark/70 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-primary to-accent h-1.5 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
        
        {/* Featured track - Only show if there are tracks */}
        {firstTrack && (
          <div className="bg-dark/50 rounded-lg p-2.5 border border-white/5 mt-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-primary">
                    <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-light/60 mb-0.5">Featured Track</div>
                  <div className="font-medium text-sm text-light truncate max-w-[200px]">{firstTrack.title}</div>
                </div>
              </div>
              {firstTrack.duration && (
                <span className="text-light/50 text-xs">{firstTrack.duration}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}