'use client';

import Link from "next/link";
import UpcomingReleaseItem from "@/components/music/UpcomingReleaseItem";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface UpcomingReleasesSectionProps {
  upcomingSongs: any[];
}

export default function UpcomingReleasesSection({ upcomingSongs }: UpcomingReleasesSectionProps) {
  const [upcomingRef, upcomingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark to-secondary/90" ref={upcomingRef}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-light">Upcoming <span className="text-primary">Releases</span></h2>
            <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
          </div>
          <Link href="/music?filter=upcoming" className="text-primary hover:text-accent transition-colors text-sm font-medium">
            View All
          </Link>
        </div>
        
        {upcomingSongs.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={upcomingInView ? "visible" : "hidden"}
          >
            {upcomingSongs.slice(0, 4).map((item, index) => (
              <motion.div key={item._id || index} variants={itemVariants}>
                <UpcomingReleaseItem album={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-dark/30 backdrop-blur-sm p-6 rounded-xl text-center">
            <p className="text-light/70">No upcoming releases at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
} 