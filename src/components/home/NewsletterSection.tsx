'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface NewsletterSectionProps {
  // Add props if needed
}

export default function NewsletterSection({}: NewsletterSectionProps) {
  const [newsletterRef, newsletterInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This would usually be an API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1000);
  };
  
  return (
    <section className="py-20 bg-secondary relative overflow-hidden" ref={newsletterRef}>
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-t border-light/10"></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={newsletterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-light mb-4">Stay <span className="text-primary">Connected</span></h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-light/80 mb-8 max-w-2xl mx-auto">
            Join the Towizaza community. Subscribe to get exclusive updates about new releases, behind-the-scenes content, and special offers.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-dark/30 backdrop-blur-md p-4 rounded-lg border border-light/5">
              <div className="text-primary font-bold text-2xl">10K+</div>
              <div className="text-light/60 text-sm">Subscribers</div>
            </div>
            <div className="bg-dark/30 backdrop-blur-md p-4 rounded-lg border border-light/5">
              <div className="text-primary font-bold text-2xl">Weekly</div>
              <div className="text-light/60 text-sm">Updates</div>
            </div>
            <div className="bg-dark/30 backdrop-blur-md p-4 rounded-lg border border-light/5">
              <div className="text-primary font-bold text-2xl">Early</div>
              <div className="text-light/60 text-sm">Access</div>
            </div>
            <div className="bg-dark/30 backdrop-blur-md p-4 rounded-lg border border-light/5">
              <div className="text-primary font-bold text-2xl">VIP</div>
              <div className="text-light/60 text-sm">Exclusives</div>
            </div>
          </div>
          
          {/* Subscription form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="flex-grow px-5 py-3 rounded-full border-2 border-light/20 bg-dark/40 text-light placeholder-light/40 focus:outline-none focus:border-primary w-full sm:w-auto"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-light font-bold rounded-full transition-all transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 w-full sm:w-auto"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              <p className="text-light/50 text-xs mt-3">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          ) : (
            <div className="bg-primary/20 border border-primary/30 text-light p-4 rounded-lg max-w-lg mx-auto">
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm text-light/70 mt-1">We've sent a confirmation email to your inbox.</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
} 