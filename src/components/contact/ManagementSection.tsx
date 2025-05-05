'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ManagementSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };
  
  const contacts = [
    {
      title: "Artist Management",
      name: "Maya Daniels",
      email: "management@towizaza.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Booking Agent",
      name: "Alex Rivera",
      email: "bookings@towizaza.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      title: "Press Inquiries",
      name: "Jamie Wong",
      email: "press@towizaza.com",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      )
    }
  ];
  
  return (
    <motion.section 
      id="contact-management"
      ref={ref}
      className="py-16"
    >
      <motion.div
        className="bg-dark/40 backdrop-blur-md border border-light/5 rounded-xl p-8 overflow-hidden relative"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-32 right-0 w-64 h-64 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">Management Team</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-accent to-primary rounded-full mb-6"></div>
          
          <p className="text-light/80 mb-8">
            Contact our team for various inquiries and collaborations. We're excited to hear from you!
          </p>
          
          <div className="space-y-6">
            {contacts.map((contact, index) => (
              <motion.div 
                key={index}
                className="flex gap-4 items-start p-4 bg-dark/20 rounded-lg backdrop-blur-sm border border-light/10 group"
                variants={itemVariants}
                whileHover="hover"
              >
                <div className="p-3 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full flex items-center justify-center">
                  <span className="text-light group-hover:text-white transition-colors">
                    {contact.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all">
                    {contact.title}
                  </h3>
                  <p className="text-light/80 mb-1">{contact.name}</p>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-primary hover:text-accent transition-colors flex items-center gap-1 group"
                  >
                    <span>{contact.email}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform">
                      <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Fan Mail Box */}
          <motion.div 
            className="mt-10 p-6 bg-gradient-to-br from-dark/60 to-dark/40 rounded-lg border border-light/10 backdrop-blur-md"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-light">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Fan Mail
              </h3>
            </div>
            
            <p className="text-light/80 mb-4">
              Want to send a message directly to Towizaza? Drop a note here and it will be personally read.
            </p>
            
            <div className="flex gap-3">
              <input 
                type="email" 
                placeholder="Your email"
                className="flex-1 bg-dark/70 border border-light/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors text-light"
              />
              <button 
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-light font-medium rounded-lg transition-all flex items-center gap-2"
              >
                <span>Contact</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
} 