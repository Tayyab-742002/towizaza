'use client';

import { motion, useScroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useRef, useEffect, useState } from 'react';

// Timeline data
const TIMELINE_DATA = [
  {
    year: '2018',
    title: 'First EP Release',
    description: 'Debut EP "Digital Dreams" introduced Towizaza to the world with a blend of ambient textures and rhythmic innovation.'
  },
  {
    year: '2019',
    title: 'Breakthrough Single',
    description: 'The single "Neon Echo" reached top streaming charts and established Towizaza as an emerging voice in electronic music.'
  },
  {
    year: '2020',
    title: 'Studio Album Debut',
    description: 'First full-length album "Synthetic Memories" received critical acclaim for its emotional depth and technical brilliance.'
  },
  {
    year: '2021',
    title: 'World Tour',
    description: 'Performed across 15 countries, bringing the immersive audio-visual experience to fans worldwide.'
  },
  {
    year: '2022',
    title: 'Collaboration Album',
    description: 'Partnership with legendary artists resulted in the boundary-pushing "Harmonic Convergence" project.'
  },
  {
    year: '2023',
    title: 'Award-Winning Innovation',
    description: 'Received multiple awards for innovation in music production and live performance technology.'
  }
];

export default function TimelineSection() {
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Refs for each timeline item to track when they come into view
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    Array(TIMELINE_DATA.length).fill(false)
  );
  
  // Initialize observers for each timeline item
  useEffect(() => {
    if (!sectionInView) return;
    
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Mark this item as visible when it comes into view
            setVisibleItems(prev => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
            
            // Unobserve after it's been seen
            observer.unobserve(ref);
          }
        },
        { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
      );
      
      observer.observe(ref);
      return observer;
    });
    
    return () => {
      observers.forEach((observer, i) => {
        if (observer && itemRefs.current[i]) {
          observer.unobserve(itemRefs.current[i]!);
        }
      });
    };
  }, [sectionInView, itemRefs]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-gradient-to-t from-dark via-dark/95 to-dark"
    >
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center relative inline-block mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">
              The Story So Far
            </span>
            <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
          </h2>
          <p className="text-light/60 text-center max-w-xl">
            A journey through the key moments that have defined Towizaza's musical career.
          </p>
        </motion.div>
        
        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central line - animated on scroll */}
          <motion.div 
            className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 hidden md:block"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--primary-color) 5%, var(--accent-color) 95%, transparent)"
            }}
            initial={{ height: 0 }}
            animate={sectionInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          ></motion.div>
          
          {/* Mobile timeline line (left-aligned) */}
          <motion.div 
            className="absolute top-0 bottom-0 left-[20px] w-0.5 md:hidden"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--primary-color) 5%, var(--accent-color) 95%, transparent)"
            }}
            initial={{ height: 0 }}
            animate={sectionInView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          ></motion.div>
          
          {/* Timeline items */}
          <div className="relative z-10">
            {TIMELINE_DATA.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index} 
                  ref={el => itemRefs.current[index] = el}
                  className={`mb-16 md:mb-24 relative flex flex-col ${
                    isEven 
                      ? 'md:flex-row-reverse md:pl-12 items-start' 
                      : 'md:flex-row md:pr-12 items-start'
                  }`}
                >
                  {/* Year marker with pulsing effect for desktop */}
                  <motion.div
                    className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-dark bg-primary z-10 items-center justify-center`}
                    initial={{ scale: 0 }}
                    animate={visibleItems[index] ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <motion.div 
                      className="w-full h-full rounded-full bg-primary absolute"
                      animate={visibleItems[index] ? { scale: [1, 1.4, 1], opacity: [1, 0, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    ></motion.div>
                    <span className="relative z-10 text-light font-bold text-sm">{item.year}</span>
                  </motion.div>
                  
                  {/* Year marker for mobile */}
                  <motion.div
                    className={`md:hidden flex absolute left-[20px] -translate-x-1/2 w-10 h-10 rounded-full border-4 border-dark bg-primary z-10 items-center justify-center`}
                    initial={{ scale: 0 }}
                    animate={visibleItems[index] ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <span className="text-light font-bold text-xs">{item.year}</span>
                  </motion.div>
                  
                  {/* Content card */}
                  <motion.div 
                    className={`
                      pl-12 md:pl-0 md:w-[calc(50%-24px)] 
                      ${isEven ? 'md:text-right' : ''} 
                      relative
                    `}
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    animate={visibleItems[index] ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="bg-dark/50 backdrop-blur-md border border-light/5 p-6 rounded-xl hover:border-primary/30 transition-colors duration-300 relative overflow-hidden group">
                      {/* Background gradient on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-700 rounded-xl"></div>
                      
                      <h3 className="text-xl font-bold mb-3 text-light group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-light/70">{item.description}</p>
                      
                      {/* Connecting line for desktop */}
                      <motion.div 
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
                          isEven 
                            ? 'left-[calc(100%+12px)] w-12' 
                            : 'right-[calc(100%+12px)] w-12'
                        } h-0.5 bg-primary/50`}
                        initial={{ width: 0 }}
                        animate={visibleItems[index] ? { width: 48 } : { width: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 