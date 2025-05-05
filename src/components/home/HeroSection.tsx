'use client';

import Image from "next/image";
import Link from "next/link";
import { urlFor } from '@/lib/sanity';
import { motion } from "framer-motion";

interface HeroSectionProps {
  artistInfo: any;
}

export default function HeroSection({ artistInfo }: HeroSectionProps) {
  // Animation variants for staggered animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        {artistInfo?.heroImage ? (
          <Image 
            src={
              typeof artistInfo.heroImage === 'string'
                ? artistInfo.heroImage
                : urlFor(artistInfo.heroImage).url()
            }
            alt="Towizaza"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-radial from-secondary/30 to-dark"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/90 z-10"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-extrabold text-light mb-4"
          >
            TOWIZAZA
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-light/80 mb-8 accent-text italic"
          >
            Experience the sound of tomorrow
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              href="/music" 
              className="bg-primary hover:bg-primary/90 text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Latest Release
            </Link>
            
            <Link 
              href="/store" 
              className="bg-transparent border-2 border-light/70 hover:border-light text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Merch Store
            </Link>
          </motion.div>
          
          {/* Social media links */}
          {artistInfo?.socialLinks && (
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center mt-10 space-x-4"
            >
              {artistInfo.socialLinks.spotify && (
                <a 
                  href={artistInfo.socialLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="Spotify"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </a>
              )}
              
              {artistInfo.socialLinks.instagram && (
                <a 
                  href={artistInfo.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              
              {artistInfo.socialLinks.youtube && (
                <a 
                  href={artistInfo.socialLinks.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              )}
              
              {artistInfo.socialLinks.soundcloud && (
                <a 
                  href={artistInfo.socialLinks.soundcloud} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="SoundCloud"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.05-1-.01v8.858zm-4 0h1v-7.02c-.312.458-.555.971-.692 1.535l-.308-.182v5.667zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z" />
                  </svg>
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-8 h-12 border-2 border-light/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-light/70 rounded-full animate-bounce mt-2"></div>
        </div>
      </div>
    </section>
  );
} 