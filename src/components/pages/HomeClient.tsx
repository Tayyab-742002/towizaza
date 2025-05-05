'use client';

import { useState, useEffect } from "react";
import { getFeaturedMusic, getFeaturedProducts, getUpcomingSongs, getArtistInfo } from '@/lib/sanity';
import { fallbackMusic, fallbackProducts, fallbackArtistInfo } from '@/lib/fallbackData';

// Import all section components
import HeroSection from "@/components/home/HeroSection";
import LatestReleasesSection from "@/components/home/LatestReleasesSection";
import UpcomingReleasesSection from "@/components/home/UpcomingReleasesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FeaturedMerchSection from "@/components/home/FeaturedMerchSection";
import { Loading } from "../common/Loading";

export default function HomeClient() {
  const [featuredData, setFeaturedData] = useState<{
    music: any[];
    products: any[];
    upcomingSongs: any[];
    artistInfo: any;
  }>({
    music: [],
    products: [],
    upcomingSongs: [],
    artistInfo: null
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from different sources
        const [music, products, upcomingSongs, artistInfo] = await Promise.all([
          getFeaturedMusic(),
          getFeaturedProducts(),
          getUpcomingSongs(),
          getArtistInfo()
        ]);
        
        // Set default data if API returns empty
        let musicData = music?.length > 0 
          ? music 
          : fallbackMusic.filter(item => item.featured && !item.upcoming);
        
        setFeaturedData({
          music: musicData,
          products: products?.length > 0 ? products : fallbackProducts.filter(item => item.featured),
          upcomingSongs: upcomingSongs || [],
          artistInfo: artistInfo || fallbackArtistInfo
        });
      } catch (error) {
        console.error('Error fetching featured data:', error);
        // Fallback to mock data in case of error
        setFeaturedData({
          music: fallbackMusic.filter(item => item.featured && !item.upcoming),
          products: fallbackProducts.filter(item => item.featured),
          upcomingSongs: fallbackMusic.filter(item => item.upcoming && item.featured),
          artistInfo: fallbackArtistInfo
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
     <Loading message="Please Wait..."/>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <HeroSection artistInfo={featuredData.artistInfo} />
      
      {/* Latest Releases Section */}
      <LatestReleasesSection music={featuredData.music} />
      
      {/* Upcoming Releases Section */}
      <UpcomingReleasesSection upcomingSongs={featuredData.upcomingSongs} />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Newsletter Section */}
      <NewsletterSection />
      
      {/* Featured Merch Section */}
      <FeaturedMerchSection products={featuredData.products} />
    </div>
  );
} 