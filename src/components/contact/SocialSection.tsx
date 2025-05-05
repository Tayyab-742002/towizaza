'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function SocialSection() {
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
        staggerChildren: 0.1,
        delayChildren: 0.2
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
  
  const socialLinks = [
    {
      name: "Instagram",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
      link: "https://instagram.com/towizaza",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Twitter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
      link: "https://twitter.com/towizaza",
      color: "from-blue-400 to-blue-600"
    },
    {
      name: "YouTube",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
      link: "https://youtube.com/towizaza",
      color: "from-red-600 to-red-700"
    },
    {
      name: "Spotify",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
      link: "https://open.spotify.com/artist/towizaza",
      color: "from-green-500 to-green-600"
    },
    {
      name: "SoundCloud",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.084-.1m-.899.828c-.06 0-.091.037-.1.094L0 14.479l.176 1.334c.01.06.042.097.1.097.052 0 .092-.037.102-.097l.207-1.334-.207-1.332c-.01-.06-.05-.094-.102-.094m3.157.099c-.066 0-.12.058-.127.128l-.176 2.152.183 2.058c.008.07.061.123.126.123.068 0 .12-.053.127-.123l.204-2.058-.204-2.152c-.007-.07-.059-.128-.127-.127-.128m.896-.789c-.077 0-.132.063-.14.14l-.157 2.929.157 1.889c.008.076.063.138.14.138.076 0 .138-.062.145-.138l.177-1.889-.177-2.929c-.007-.076-.069-.14-.145-.14m.906-1.677c-.085 0-.15.068-.16.154l-.196 4.592.197 1.793c.01.085.075.151.159.151.086 0 .15-.066.159-.151l.211-1.793-.211-4.592c-.01-.086-.074-.154-.159-.154m.99-.049c-.097 0-.171.079-.18.175l-.188 4.617.188 1.8c.009.096.083.173.18.173.096 0 .17-.077.178-.173l.213-1.8-.213-4.617c-.009-.096-.082-.175-.178-.175m.99.8c-.108 0-.187.084-.198.195l-.176 3.85.176 1.869c.01.107.09.188.198.188a.2.2 0 00.198-.188l.19-1.869-.19-3.85a.2.2 0 00-.198-.195m.99-2.525c-.12 0-.202.09-.21.21l-.164 6.164.164 1.85c.008.12.09.207.21.207.117 0 .204-.09.211-.207l.18-1.85-.18-6.164c-.007-.12-.094-.21-.211-.21m.912 7.263L10.148 24l.15-.002c.15-.003.24-.008.24-.007l.16-1.836-.161-6.163c-.008-.125-.097-.22-.222-.22s-.216.095-.222.22l-.148 6.164zm.92-7.922c-.028-.128-.11-.22-.231-.22-.123 0-.205.092-.231.22l-.142 6.853.142 1.825c.025.125.108.215.23.215a.234.234 0 00.23-.215l.15-1.825-.15-6.853zm.55-.4a.264.264 0 00-.26-.229c-.133 0-.239.096-.26.233l-.128 7.249.128 1.824c.021.136.127.231.26.231.129 0 .236-.095.26-.231l.143-1.824-.143-7.249zm.92-.495a.27.27 0 00-.27-.238c-.146 0-.26.1-.28.238l-.117 7.745.117 1.821c.02.143.134.243.281.243a.275.275 0 00.271-.243l.129-1.821-.129-7.745zm.976-1.228a.285.285 0 00-.289-.247c-.156 0-.282.11-.297.247l-.102 8.972.102 1.817c.015.148.141.255.297.255a.29.29 0 00.289-.255l.112-1.817-.112-8.972zm.522.883c-.008-.168-.133-.285-.3-.285-.168 0-.291.117-.302.285l-.094 8.09.094 1.815c.01.175.134.3.302.3.167 0 .292-.125.3-.3l.11-1.815c0-.001-.11-8.09-.11-8.09zm.533-1.737c-.181 0-.312.122-.322.307l-.085 9.521.085 1.812c.01.183.141.312.323.312.182 0 .313-.129.323-.312l.093-1.812-.093-9.521c-.01-.185-.142-.307-.324-.307zm1.48-1.089c-.2 0-.348.136-.354.336l-.065 10.28.065 1.809c.005.199.153.339.353.339.2 0 .348-.14.353-.339l.072-1.809-.072-10.28c-.005-.2-.15-.336-.353-.336zm.967-.434c-.108-.003-.21.057-.263.149-.028.048-.04.097-.04.15-.003.003-.066 10.9-.066 10.9l.066 1.806c.005.22.166.376.386.376.22 0 .382-.156.386-.376l.072-1.806-.072-10.893c-.008-.22-.169-.373-.389-.376-.002 0-.005 0-.008 0h-.072zm.906.003c-.01-.003-.02-.003-.03-.003-.226 0-.392.15-.402.375l-.06 10.576.06 1.808c.01.217.176.375.391.375h.024c.21 0 .375-.154.385-.37l.066-1.8-.066-10.585c-.01-.22-.175-.375-.368-.375zm1.836.219c-.01-.238-.196-.422-.434-.422-.248 0-.434.184-.44.422L18.29 18.48l.055 1.805c0 .243.187.435.434.435h.01c.237 0 .425-.186.44-.427v.002l.06-1.815-.06-10.562z" />
        </svg>
      ),
      link: "https://soundcloud.com/towizaza",
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "TikTok",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      link: "https://tiktok.com/@towizaza",
      color: "from-black to-gray-800"
    }
  ];
  
  return (
    <motion.section 
      ref={ref}
      className="py-28 bg-gradient-to-b from-dark/90 to-dark"
    >
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80"
            variants={itemVariants}
          >
            Connect With Towizaza
          </motion.h2>
          
          <motion.div 
            className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-8"
            variants={itemVariants}
          ></motion.div>
          
          <motion.p 
            className="text-xl text-light/80 max-w-3xl mx-auto mb-16"
            variants={itemVariants}
          >
            Follow Towizaza on social media to stay updated with latest music, events, and behind-the-scenes moments.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"
            variants={containerVariants}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3`}>
                  <span className="text-white">{social.icon}</span>
                </div>
                <span className="text-light/90 font-medium group-hover:text-primary transition-colors">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-20"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-2 text-light/60">
              <span className="text-sm">© {new Date().getFullYear()} Towizaza.</span>
              <span className="h-1 w-1 rounded-full bg-light/30"></span>
              <span className="text-sm">All Rights Reserved.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute top-40 right-1/4 w-60 h-60 rounded-full bg-accent/5 blur-3xl"></div>
      </div>
    </motion.section>
  );
} 