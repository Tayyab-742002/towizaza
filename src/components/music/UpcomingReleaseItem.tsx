"use client";

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
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
        return "Coming very soon";
      } else if (diffDays <= 7) {
        return `Coming in ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
      } else if (diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Coming in ${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      } else {
        return new Date(album.releaseDate).toLocaleDateString('en-US', { 
          month: 'long', 
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
  
  return (
    <motion.div 
      className={`bg-dark/40 backdrop-blur-lg rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left side - Album art */}
        <div className="md:w-1/3 relative">
          <div className="aspect-square md:h-full relative">
            <div className={`w-full h-full ${!isImageLoaded ? 'bg-dark/50 animate-pulse' : ''}`}>
              <Image 
                src={getArtworkUrl()}
                alt={album.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover transition-all duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            
            {/* Coming soon overlay with blur effect */}
            <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-primary/90 text-light text-lg font-bold py-2 px-4 rounded-lg shadow-lg transform rotate-12">
                Coming Soon
              </div>
            </div>
            
            {/* Album type badge */}
            <div className="absolute top-2 left-2 bg-dark/60 backdrop-blur-md text-light text-xs font-medium py-1 px-2 rounded-full">
              {(album.type || 'release').charAt(0).toUpperCase() + (album.type || 'release').slice(1)}
            </div>
          </div>
        </div>
        
        {/* Right side - Album info */}
        <div className="p-6 md:w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-light mb-1">{album.title}</h3>
            <p className="text-light/70 text-sm mb-4">
              {getTracksCount()} {getTracksCount() === 1 ? 'track' : 'tracks'} • {album.year || new Date(album.releaseDate).getFullYear()}
            </p>
            
            {/* Release date progress bar */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-light/80">Release Progress</span>
                <span className="text-sm text-primary font-medium">{formatReleaseDate()}</span>
              </div>
              <div className="w-full bg-dark/50 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Featured track - Only show if there are tracks */}
          {firstTrack && (
            <div className="mt-4">
              <div className="text-light/80 text-sm mb-2">Featured track:</div>
              <div className="bg-dark/70 rounded-lg p-3 border border-light/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-primary">
                        <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium text-light">{firstTrack.title}</span>
                  </div>
                  <span className="text-light/60">{firstTrack.duration}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 