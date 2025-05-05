'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

export default function PressKitSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const pressResources = [
    {
      title: 'Official Biography',
      description: 'Download the complete artist biography, approved for press and media use.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15a3 3 0 01-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125zM12 9.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H12zm-.75-2.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75zM6 12.75a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H6zm-.75 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75zM6 6.75a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-.75a.75.75 0 00-.75-.75H6z" clipRule="evenodd" />
          <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 01-3 0V6.75z" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'Press Photos',
      description: 'High-resolution promotional images for publication and media coverage.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'Brand Assets',
      description: 'Logos, color palettes, and typography guidelines for consistent brand representation.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 00-3.471 2.987 10.04 10.04 0 014.815 4.815 18.748 18.748 0 002.987-3.472l3.386-5.079A1.902 1.902 0 0020.599 1.5zm-8.3 14.025a18.76 18.76 0 001.896-1.207 8.026 8.026 0 00-4.513-4.513A18.75 18.75 0 008.475 11.7l-.278.5a5.26 5.26 0 013.601 3.602l.502-.278zM6.75 13.5A3.75 3.75 0 003 17.25a1.5 1.5 0 01-1.601 1.497.75.75 0 00-.7 1.123 5.25 5.25 0 009.8-2.62 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'Tour & Performance Technical Rider',
      description: 'Technical specifications and requirements for live performances and venue setup.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
        </svg>
      ),
      link: '#'
    }
  ];

  const contactOptions = [
    {
      title: 'Media Inquiries',
      description: 'For interview requests and press features.',
      linkText: 'media@towizaza.com',
      link: 'mailto:media@towizaza.com'
    },
    {
      title: 'Management',
      description: 'For bookings and professional inquiries.',
      linkText: 'management@towizaza.com',
      link: 'mailto:management@towizaza.com'
    },
    {
      title: 'Collaboration Requests',
      description: 'For artists and creative projects.',
      linkText: 'collab@towizaza.com',
      link: 'mailto:collab@towizaza.com'
    }
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section ref={ref} className="py-20 bg-dark">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center relative inline-block mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">
              Press Kit & Contact
            </span>
            <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
          </h2>
          <p className="text-light/60 text-center max-w-xl">
            Official resources for media professionals and business inquiries.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Press Resources */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="bg-dark/40 backdrop-blur-md border border-light/5 rounded-xl p-8 overflow-hidden relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-xl"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-bl from-accent/10 to-primary/10 rounded-full blur-xl"></div>
            
            <motion.h3 
              className="text-2xl font-bold mb-6 text-light" 
              variants={itemVariants}
            >
              Media Resources
            </motion.h3>
            
            <div className="space-y-6 relative z-10">
              {pressResources.map((resource, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className="flex gap-4 group"
                >
                  <div className="p-3 rounded-lg bg-primary/10 self-start">
                    {resource.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-light group-hover:text-primary transition-colors duration-300">
                      {resource.title}
                    </h4>
                    <p className="text-light/60 mb-3">{resource.description}</p>
                    <Link 
                      href={resource.link}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-medium"
                    >
                      Download
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 0a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 12.293V.5A.5.5 0 0 1 8 0z"/>
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-10 pt-6 border-t border-light/10"
            >
              <Link
                href="#"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-light rounded-full font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Download Complete Press Kit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-dark/40 backdrop-blur-md border border-light/5 rounded-xl p-8 mb-8 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-xl"></div>
              
              <h3 className="text-2xl font-bold mb-6 text-light">Contact Information</h3>
              
              <div className="space-y-6 relative z-10">
                {contactOptions.map((option, index) => (
                  <div key={index} className="group">
                    <h4 className="text-lg font-semibold text-light group-hover:text-primary transition-colors duration-300">
                      {option.title}
                    </h4>
                    <p className="text-light/60 mb-2">{option.description}</p>
                    <a 
                      href={option.link}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors duration-300 font-medium"
                    >
                      {option.linkText}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="group-hover:translate-x-1 transition-transform">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Inquiry Form */}
            <div className="bg-dark/40 backdrop-blur-md border border-light/5 rounded-xl p-8 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-bl from-accent/10 to-primary/10 rounded-full blur-xl"></div>
              
              <h3 className="text-2xl font-bold mb-6 text-light relative z-10">Quick Inquiry</h3>
              
              <form className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-light/70 mb-2 text-sm">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary text-light"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-light/70 mb-2 text-sm">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary text-light"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-light/70 mb-2 text-sm">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary text-light appearance-none"
                  >
                    <option value="media">Media Inquiry</option>
                    <option value="booking">Booking Request</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-light/70 mb-2 text-sm">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full bg-dark/70 border border-light/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary text-light"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-light font-medium rounded-lg transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 