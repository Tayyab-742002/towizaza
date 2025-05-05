'use client';

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface TestimonialsSectionProps {
  // Add props if needed
}

export default function TestimonialsSection({}: TestimonialsSectionProps) {
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Sample testimonials data - in a real app, this would come from props
  const testimonials = [
    {
      id: 1,
      name: "Jessica M.",
      quote: "Towizaza's music changed my life. The beats are incredible and the lyrics speak directly to my soul.",
      location: "New York, USA",
      rating: 5
    },
    {
      id: 2,
      name: "Michael T.",
      quote: "I've been following Towizaza since day one. Every release is better than the last. Can't wait to see what's next!",
      location: "London, UK",
      rating: 5
    },
    {
      id: 3,
      name: "Aisha K.",
      quote: "The production quality is phenomenal. Towizaza really pushes the boundaries of modern music.",
      location: "Toronto, Canada",
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark to-secondary/30" ref={testimonialsRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-light mb-3">What <span className="text-primary">Fans</span> Say</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          <p className="text-light/70 mt-4 max-w-2xl mx-auto">Hear from the community of fans who have experienced Towizaza's music and live performances.</p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={testimonialsInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id} 
              className="bg-dark/40 backdrop-blur-md p-6 rounded-xl border border-light/5 relative"
              variants={itemVariants}
            >
              <div className="absolute -top-4 -left-2 text-primary text-5xl opacity-20">"</div>
              <div className="mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-primary">★</span>
                ))}
              </div>
              <p className="text-light/90 italic mb-4">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-light font-medium">{testimonial.name}</p>
                  <p className="text-light/60 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 