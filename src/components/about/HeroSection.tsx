'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface HeroSectionProps {
  artistInfo: any;
}

export default function HeroSection({ artistInfo }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  // Parallax effect values for background and text
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Get artwork URL with error handling
  const getArtistImageUrl = () => {
    if (!artistInfo?.profileImage) return '/images/artist-placeholder.jpg';
    
    try {
      if (typeof artistInfo.profileImage === 'string') {
        return artistInfo.profileImage;
      }
      
      // If it's a Sanity image
      return urlFor(artistInfo.profileImage).url();
    } catch (error) {
      console.error("Error getting artist image URL:", error);
      return '/images/artist-placeholder.jpg';
    }
  };

  // Text animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] } }
  };

  return (
    <motion.section 
      ref={containerRef}
      className="relative h-[90vh] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Background parallax effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <div className="relative w-full h-full brightness-[0.3]">
          <Image 
            src={getArtistImageUrl()}
            alt={artistInfo?.name || "Artist Profile"}
            fill
            className="object-cover object-center"
            priority
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/40 to-dark"></div>
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-20 bg-grid-pattern"></div>
        </div>
      </motion.div>
      
      {/* Hero content */}
      <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
        <motion.div 
          className="max-w-3xl"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ opacity }}
        >
          <motion.h1 
            className="text-7xl md:text-8xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-light via-light to-light/80"
            variants={item}
          >
            {artistInfo?.name || "Towizaza"}
          </motion.h1>
          
          <motion.div 
            className="h-1.5 w-40 bg-gradient-to-r from-primary to-accent rounded-full mb-6"
            variants={item}
          ></motion.div>
          
          <motion.p 
            className="text-xl text-light/90 max-w-2xl mb-8"
            variants={item}
          >
            {artistInfo?.tagline || "Creating sonic landscapes that blend electronic innovation with emotional depth."}
          </motion.p>
          
          <motion.div 
            className="flex space-x-4 items-center"
            variants={item}
          >
            {/* Social media links */}
            <div className="flex space-x-4">
              {artistInfo?.socialLinks?.spotify && (
                <a 
                  href={artistInfo.socialLinks.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark/50 backdrop-blur-md flex items-center justify-center text-light hover:bg-primary transition-colors duration-300 border border-light/10"
                  aria-label="Spotify"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/>
                  </svg>
                </a>
              )}
              
              {artistInfo?.socialLinks?.instagram && (
                <a 
                  href={artistInfo.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark/50 backdrop-blur-md flex items-center justify-center text-light hover:bg-primary transition-colors duration-300 border border-light/10"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
              )}
              
              {artistInfo?.socialLinks?.twitter && (
                <a 
                  href={artistInfo.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-dark/50 backdrop-blur-md flex items-center justify-center text-light hover:bg-primary transition-colors duration-300 border border-light/10"
                  aria-label="Twitter"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
              )}
            </div>
            
            <span className="w-px h-6 bg-light/30 mx-2"></span>
            
            {/* Scroll down indicator */}
            <motion.a 
              href="#biography"
              className="text-light/80 group flex items-center gap-2 hover:text-primary transition-colors"
              variants={item}
              whileHover={{ x: 5 }}
            >
              Learn More
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" height="16" 
                fill="currentColor" 
                className="group-hover:translate-x-1 transition-transform" 
                viewBox="0 0 16 16"
              >
                <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
              </svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div 
            className="w-1 h-16 relative overflow-hidden rounded-full bg-light/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-primary to-accent rounded-full"
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </motion.div>
          <motion.p 
            className="text-light/50 text-xs mt-2 font-medium uppercase tracking-widest"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
} 