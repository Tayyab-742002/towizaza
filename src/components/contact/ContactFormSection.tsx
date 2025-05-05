'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, FormEvent } from 'react';

interface ContactFormSectionProps {
  onFormSubmit: (status: 'success' | 'error', message: string) => void;
}

export default function ContactFormSection({ onFormSubmit }: ContactFormSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    eventDate: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      onFormSubmit('success', 'Your booking inquiry has been sent successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        eventType: '',
        eventDate: '',
        message: '',
      });
    }, 1500);
  };
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    },
  };
  
  const inputFieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * custom,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }),
    focus: {
      scale: 1.01,
      borderColor: 'var(--primary)',
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.section 
      id="booking-form"
      ref={ref}
      className="py-16"
    >
      <motion.div
        className="bg-dark/40 backdrop-blur-md border border-light/5 rounded-xl p-8 overflow-hidden relative"
        variants={formVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Decorative elements */}
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-bl from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">Booking Inquiry</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mb-6"></div>
          
          <p className="text-light/80 mb-8">
            Interested in booking Towizaza for a show, festival, or private event? Fill out the form below with your event details.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                custom={1}
                variants={inputFieldVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                whileFocus="focus"
              >
                <label className="block text-light/80 mb-2 text-sm" htmlFor="name">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light"
                  placeholder="Your name"
                />
              </motion.div>
              
              <motion.div 
                custom={2}
                variants={inputFieldVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                whileFocus="focus"
              >
                <label className="block text-light/80 mb-2 text-sm" htmlFor="email">
                  Email
                </label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light"
                  placeholder="Your email"
                />
              </motion.div>
            </div>
            
            <motion.div 
              custom={3}
              variants={inputFieldVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileFocus="focus"
            >
              <label className="block text-light/80 mb-2 text-sm" htmlFor="eventType">
                Event Type
              </label>
              <div className="relative">
                <select 
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light appearance-none"
                >
                  <option value="" disabled>Select event type</option>
                  <option value="festival">Festival</option>
                  <option value="club">Club Night</option>
                  <option value="private">Private Event</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light/50" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              custom={4}
              variants={inputFieldVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileFocus="focus"
            >
              <label className="block text-light/80 mb-2 text-sm" htmlFor="eventDate">
                Event Date
              </label>
              <input 
                type="date" 
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light"
              />
            </motion.div>
            
            <motion.div 
              custom={5}
              variants={inputFieldVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileFocus="focus"
            >
              <label className="block text-light/80 mb-2 text-sm" htmlFor="message">
                Event Details
              </label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                required
                className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light resize-none"
                placeholder="Tell us about your event..."
              ></textarea>
            </motion.div>
            
            <motion.div
              custom={6}
              variants={inputFieldVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <button 
                type="submit"
                disabled={isSubmitting}
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 flex justify-center"
              >
                <span className={`flex items-center gap-2 ${isSubmitting ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                  Submit Inquiry
                </span>
                
                {/* Loading spinner */}
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
                
                {/* Animated background on hover */}
                <span className="absolute bottom-0 left-0 h-1 w-full bg-light/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </motion.section>
  );
} 