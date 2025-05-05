'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import HeroSection from './HeroSection';
import BiographySection from './BiographySection';
import TimelineSection from './TimelineSection';
import StatsSection from './StatsSection';
import PressKitSection from './PressKitSection';
import { getArtistInfo } from '@/lib/sanity';
import { fallbackArtistInfo } from '@/lib/fallbackData';

export default function AboutClient() {
  const [artistInfo, setArtistInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const info = await getArtistInfo();
        setArtistInfo(info || fallbackArtistInfo);
      } catch (error) {
        console.error('Error fetching artist info:', error);
        setArtistInfo(fallbackArtistInfo);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-2xl text-light flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Hero Section with parallax effect */}
      <HeroSection artistInfo={artistInfo} />
      
      {/* Biography with animated elements */}
      <BiographySection artistInfo={artistInfo} />
      
      {/* Stats highlights */}
      <StatsSection artistInfo={artistInfo} />
      
      {/* Timeline with animation */}
      <TimelineSection />
      
      {/* Press Kit Section */}
      <PressKitSection />
    </div>
  );
} 