'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function FaqSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // State for tracking open FAQ items
  const [openItems, setOpenItems] = useState<number[]>([]);
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index) 
        : [...prev, index]
    );
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    }
  };
  
  // FAQ data
  const faqs = [
    {
      question: "How can I book Towizaza for an event?",
      answer: "To book Towizaza for your event, please fill out the booking inquiry form on our contact page with details about your event. Our booking team will reach out to you within 48 hours to discuss availability and requirements."
    },
    {
      question: "Does Towizaza offer private performances?",
      answer: "Yes, Towizaza is available for private events including corporate functions, weddings, and exclusive parties. Please contact our booking agent with your specific requirements for a customized quote."
    },
    {
      question: "Can I license Towizaza's music for commercial use?",
      answer: "For music licensing inquiries for commercials, films, or other commercial projects, please contact our management team directly at management@towizaza.com with details about your project."
    },
    {
      question: "How can I request a collaboration with Towizaza?",
      answer: "For collaboration requests, please reach out to our management team with a detailed proposal and samples of your work. While we can't respond to every request, we do review all submissions."
    },
    {
      question: "Where can I find Towizaza's tour schedule?",
      answer: "Towizaza's full tour schedule is available on the Events page of our website. You can also follow us on social media for the most up-to-date information about upcoming shows and special performances."
    }
  ];
  
  return (
    <section className="py-24 bg-gradient-to-b from-dark to-dark/90">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6"></div>
            <p className="text-light/80 max-w-2xl mx-auto">
              Find answers to common questions about bookings, performances, and collaboration opportunities.
            </p>
          </motion.div>
          
          <motion.div className="space-y-4" variants={itemVariants}>
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className={`bg-dark/40 backdrop-blur-md border border-light/5 rounded-xl overflow-hidden transition-all duration-300 ${
                  openItems.includes(index) ? 'shadow-lg shadow-primary/5' : ''
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <button
                  className="w-full text-left p-6 flex justify-between items-center"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-xl font-semibold pr-8 group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openItems.includes(index) 
                        ? 'bg-gradient-to-r from-primary to-accent rotate-180' 
                        : 'bg-light/10'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-light">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>
                
                <motion.div 
                  className="overflow-hidden"
                  initial={false}
                  animate={{ 
                    height: openItems.includes(index) ? 'auto' : 0,
                    opacity: openItems.includes(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  <div className="p-6 pt-0 text-light/70 border-t border-light/5">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center" 
            variants={itemVariants}
          >
            <p className="text-light/70 mb-6">
              Can't find the answer you're looking for?
            </p>
            <a 
              href="mailto:info@towizaza.com" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-light font-medium rounded-full transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              Email Us
            </a>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute left-0 right-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl"></div>
      </div>
    </section>
  );
} 