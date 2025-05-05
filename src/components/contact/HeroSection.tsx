'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  // Parallax effect values
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
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
      className="relative h-[70vh] overflow-hidden bg-dark"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-primary/10 to-accent/20"></div>
        
        {/* Animated patterns */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Floating orbs/circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
        <motion.div 
          className="absolute top-1/2 left-2/3 w-40 h-40 rounded-full bg-secondary/20 blur-xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        ></motion.div>
      </motion.div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 h-full flex items-center">
        <motion.div 
          className="max-w-2xl"
          variants={container}
          initial="hidden"
          animate="show"
          style={{ opacity }}
        >
          <motion.div
            className="inline-block mb-2 px-3 py-1 bg-dark/50 backdrop-blur-md border border-light/10 rounded-full"
            variants={item}
          >
            <span className="text-sm font-medium text-light/80">Get in touch</span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-light via-light to-light/80"
            variants={item}
          >
            Connect With Us
          </motion.h1>
          
          <motion.div 
            className="h-1.5 w-40 bg-gradient-to-r from-primary to-accent rounded-full mb-8"
            variants={item}
          ></motion.div>
          
          <motion.p 
            className="text-xl text-light/90 max-w-xl mb-8"
            variants={item}
          >
            From booking inquiries to fan mail, we're here to listen. Reach out and let's create something extraordinary together.
          </motion.p>
          
          <motion.div
            className="flex gap-4"
            variants={item}
          >
            <a 
              href="#booking-form" 
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-light font-medium rounded-full transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
              Booking Inquiry
            </a>
            
            <a 
              href="#contact-management" 
              className="px-6 py-3 bg-dark/70 hover:bg-dark/50 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/30 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
              </svg>
              Contact Management
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
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