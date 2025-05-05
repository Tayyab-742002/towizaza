'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedMusic, getFeaturedProducts, getUpcomingReleases } from '@/lib/sanity';
import { fallbackMusic, fallbackProducts } from '@/lib/fallbackData';
import { urlFor } from '@/lib/sanity';
import FeaturedTrack from "@/components/music/FeaturedTrack";

export default function HomeClient() {
  const [featuredData, setFeaturedData] = useState<{
    music: any[];
    products: any[];
    upcomingSongs: any[];
  }>({
    music: [],
    products: [],
    upcomingSongs: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [music, products, upcomingReleases] = await Promise.all([
          getFeaturedMusic(),
          getFeaturedProducts(),
          getUpcomingReleases()
        ]);
        
        let musicData = music?.length > 0 ? music : fallbackMusic.filter(item => item.featured);
        let upcomingSongs = upcomingReleases?.length > 0 
          ? upcomingReleases 
          : fallbackMusic.filter(item => item.upcoming && item.featured);
        
        setFeaturedData({
          music: musicData.filter((item: any) => !item.upcoming),
          products: products?.length > 0 ? products : fallbackProducts.filter(item => item.featured),
          upcomingSongs: upcomingSongs
        });
      } catch (error) {
        console.error('Error fetching featured data:', error);
        setFeaturedData({
          music: fallbackMusic.filter(item => item.featured && !item.upcoming),
          products: fallbackProducts.filter(item => item.featured),
          upcomingSongs: fallbackMusic.filter(item => item.upcoming && item.featured)
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="text-2xl text-light">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* We'll add a video background here later */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/70 to-dark/30 z-10"></div>
        
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold text-light mb-4">
            TOWIZAZA
          </h1>
          <p className="text-xl md:text-2xl text-light/80 mb-8 accent-text italic">
            Experience the sound of tomorrow
          </p>
          <Link 
            href="/music" 
            className="bg-primary hover:bg-primary/90 text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
          >
            Latest Release
          </Link>
        </div>
      </section>

      {/* Latest Releases Section */}
      <section className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-light mb-12">Latest Releases</h2>
          
          {/* Music carousel */}
          <div className="flex overflow-x-auto pb-8 gap-6">
            {featuredData.music.map((album: any) => (
              <FeaturedTrack 
                key={album._id || album.id} 
                album={album}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Songs Section */}
      <section className="py-20 bg-gradient-to-b from-dark to-secondary/90">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-light mb-12">Upcoming Songs</h2>
          
          {/* Upcoming songs list */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData.upcomingSongs.map((album: any) => (
              <div key={album._id || album.id} className="glass p-6 rounded-lg">
                <div className="flex gap-4 items-start mb-4">
                  {/* Album artwork */}
                  <div className="w-20 h-20 flex-shrink-0 bg-dark/40 rounded overflow-hidden">
                    <img 
                      src={album._type === 'album' 
                        ? urlFor(album.artwork).url() 
                        : album.artwork} 
                      alt={album.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-light">{album.title}</h3>
                    <p className="text-light/70">
                      {album.type.charAt(0).toUpperCase() + album.type.slice(1)} • {album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'}
                    </p>
                    
                    <div className="mt-2 bg-primary/90 text-light px-2 py-1 rounded-md text-center inline-block">
                      <span className="text-sm font-medium">
                        {new Date(album.releaseDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* First track preview */}
                {album.tracks && album.tracks.length > 0 && (
                  <div className="text-light/80 text-sm">
                    <p className="mb-1">Featured track:</p>
                    <div className="flex items-center justify-between bg-dark/30 rounded p-2">
                      <span>{album.tracks[0].title}</span>
                      <span>{album.tracks[0].duration}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-light mb-4">Stay Connected</h2>
          <p className="text-light/80 max-w-2xl mx-auto mb-8">
            Subscribe to get exclusive updates, early access to new releases, and special offers.
          </p>
          
          <form className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow p-3 rounded-l-lg focus:outline-none bg-light text-dark"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-light font-bold py-3 px-6 rounded-r-lg transition-all"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
} 