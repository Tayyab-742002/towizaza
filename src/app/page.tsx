'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedMusic, getFeaturedProducts, getFeaturedEvents } from '@/lib/sanity';
import { fallbackMusic, fallbackProducts, fallbackEvents } from '@/lib/fallbackData';
import { urlFor } from '@/lib/sanity';
import FeaturedTrack from "@/components/music/FeaturedTrack";

export default function Home() {
  const [featuredData, setFeaturedData] = useState<{
    music: any[];
    products: any[];
    events: any[];
  }>({
    music: [],
    products: [],
    events: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [music, products, events] = await Promise.all([
          getFeaturedMusic(),
          getFeaturedProducts(),
          getFeaturedEvents()
        ]);
        
        setFeaturedData({
          music: music?.length > 0 ? music : fallbackMusic.filter(item => item.featured),
          products: products?.length > 0 ? products : fallbackProducts.filter(item => item.featured),
          events: events?.length > 0 ? events : fallbackEvents.filter(item => item.featured)
        });
      } catch (error) {
        console.error('Error fetching featured data:', error);
        setFeaturedData({
          music: fallbackMusic.filter(item => item.featured),
          products: fallbackProducts.filter(item => item.featured),
          events: fallbackEvents.filter(item => item.featured)
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

      {/* Featured Content Section */}
      <section className="py-20 bg-gradient-to-b from-dark to-secondary/90">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-light mb-12">Upcoming Shows</h2>
          
          {/* Events list */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData.events.map((event: any) => (
              <div key={event._id || event.id} className="glass p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-light">{event.title}</h3>
                    <p className="text-light/70">{event.venue}, {event.city}</p>
                  </div>
                  <div className="bg-primary/90 text-light p-2 rounded-md text-center min-w-[60px]">
                    <div className="text-2xl font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                    <div className="text-xs">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-light/80">{event.time}</span>
                  {event.ticketLink ? (
                    <a 
                      href={event.ticketLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      {event.soldOut ? 'Sold Out' : 'Get Tickets'}
                    </a>
                  ) : (
                    <span className="text-accent/60">Coming Soon</span>
                  )}
                </div>
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
