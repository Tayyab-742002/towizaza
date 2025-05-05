'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

interface StatsSectionProps {
  artistInfo: any;
}

export default function StatsSection({ artistInfo }: StatsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  const stats = [
    {
      value: artistInfo?.stats?.monthlyListeners || 1500000,
      label: 'Monthly listeners',
      prefix: '',
      suffix: '+',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      )
    },
    {
      value: artistInfo?.stats?.totalStreams || 50000000,
      label: 'Total streams',
      prefix: '',
      suffix: '+',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      value: artistInfo?.stats?.socialFollowers || 850000,
      label: 'Social followers',
      prefix: '',
      suffix: '+',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
          <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
          <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
        </svg>
      )
    },
    {
      value: artistInfo?.stats?.awards || 12,
      label: 'Industry awards',
      prefix: '',
      suffix: '',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
          <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743-.06l1.15-.239a.75.75 0 11.308 1.469l-1.15.239a8.25 8.25 0 01-3.351.073 8.25 8.25 0 01-7.5-6.843.75.75 0 01.584-.859c1.125-.248 2.278-.451 3.447-.602V2.62a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H6.666v-.379zm13.5 3.046a.75.75 0 10-1.08 1.043l.97 1.006-1.125.127a.75.75 0 00-.42 1.271l.82.749-.864.506a.75.75 0 10.756 1.298l.856-.5v1.027a.75.75 0 001.5 0v-1.027l.856.5a.75.75 0 10.756-1.298l-.864-.506.82-.749a.75.75 0 00-.42-1.271l-1.125-.127.97-1.006a.75.75 0 00-1.08-1.043l-1.004.973-.114-1.133a.75.75 0 10-1.493.15l.113 1.132-1.003-.973zM13.75 10.95a.75.75 0 00.75-.75v-2.5a.75.75 0 00-.75-.75h-3.5a.75.75 0 00-.75.75v2.5c0 .414.336.75.75.75h3.5z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-dark via-dark/95 to-dark/90" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center relative inline-block mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">
              By The Numbers
            </span>
            <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
          </h2>
          <p className="text-light/60 text-center max-w-xl">
            The impact of Towizaza's music across platforms and audiences worldwide.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-dark/50 backdrop-blur-md border border-light/5 rounded-2xl p-6 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              {/* Gradient background */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-accent/10 rounded-2xl transition-all duration-700"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {stat.icon}
                  </div>
                </div>
                
                <h3 className="font-bold text-3xl md:text-4xl text-light flex items-baseline">
                  <span className="text-primary">{stat.prefix}</span>
                  <AnimatedCounter targetValue={stat.value} inView={inView} />
                  <span className="text-primary">{stat.suffix}</span>
                </h3>
                
                <p className="text-light/60 mt-1.5">{stat.label}</p>
              </div>
              
              {/* Decorative orb */}
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-full group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-700"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface AnimatedCounterProps {
  targetValue: number;
  inView: boolean;
}

function AnimatedCounter({ targetValue, inView }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    let startValue = 0;
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms for smooth animation
    const steps = duration / interval;
    const increment = targetValue / steps;
    
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue > targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [inView, targetValue]);
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };
  
  return <>{formatNumber(count)}</>;
} 