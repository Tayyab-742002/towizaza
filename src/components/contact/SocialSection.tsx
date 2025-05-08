"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaFacebook,
  FaInstagram,
  FaSpotify,
  FaTiktok,
  FaSoundcloud,
  FaTwitter,
  FaTwitch,
  FaYoutube,
  FaBandcamp,
} from "react-icons/fa";

export default function SocialSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  const socialLinks = [
    {
      name: "Instagram",
      icon: <FaInstagram className="text-2xl sm:text-3xl" />,
      link: "https://instagram.com/towizaza",
      color: "from-pink-600 to-purple-600",
      hoverColor: "group-hover:from-pink-500 group-hover:to-purple-500",
    },
    {
      name: "Twitter",
      icon: <FaTwitter className="text-2xl sm:text-3xl" />,
      link: "https://twitter.com/towizaza",
      color: "from-blue-500 to-blue-400",
      hoverColor: "group-hover:from-blue-400 group-hover:to-blue-300",
    },
    {
      name: "YouTube",
      icon: <FaYoutube className="text-2xl sm:text-3xl" />,
      link: "https://youtube.com/towizaza",
      color: "from-red-600 to-red-500",
      hoverColor: "group-hover:from-red-500 group-hover:to-red-400",
    },
    {
      name: "Spotify",
      icon: <FaSpotify className="text-2xl sm:text-3xl" />,
      link: "https://open.spotify.com/artist/towizaza",
      color: "from-green-500 to-green-400",
      hoverColor: "group-hover:from-green-400 group-hover:to-green-300",
    },
    {
      name: "SoundCloud",
      icon: <FaSoundcloud className="text-2xl sm:text-3xl" />,
      link: "https://soundcloud.com/towizaza",
      color: "from-orange-500 to-orange-400",
      hoverColor: "group-hover:from-orange-400 group-hover:to-orange-300",
    },
    {
      name: "TikTok",
      icon: <FaTiktok className="text-2xl sm:text-3xl" />,
      link: "https://tiktok.com/@towizaza",
      color: "from-black to-gray-800",
      hoverColor: "group-hover:from-black group-hover:to-gray-700",
    },
    {
      name: "Bandcamp",
      icon: <FaBandcamp className="text-2xl sm:text-3xl" />,
      link: "https://bandcamp.com/towizaza",
      color: "from-blue-700 to-blue-600",
      hoverColor: "group-hover:from-blue-600 group-hover:to-blue-500",
    },
    {
      name: "Twitch",
      icon: <FaTwitch className="text-2xl sm:text-3xl" />,
      link: "https://twitch.tv/towizaza",
      color: "from-purple-700 to-purple-600",
      hoverColor: "group-hover:from-purple-600 group-hover:to-purple-500",
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-2xl sm:text-3xl" />,
      link: "https://facebook.com/towizaza",
      color: "from-blue-600 to-blue-500",
      hoverColor: "group-hover:from-blue-500 group-hover:to-blue-400",
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="py-20 sm:py-28 bg-gradient-to-b from-dark/90 to-dark relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-1 bg-dark/50 backdrop-blur-md border border-light/10 rounded-full"
            variants={itemVariants}
          >
            <span className="text-sm font-medium text-light/80">
              Follow & Connect
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80"
            variants={itemVariants}
          >
            Connect With Towizaza
          </motion.h2>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6 sm:mb-8"
            variants={itemVariants}
          ></motion.div>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-light/80 max-w-3xl mx-auto mb-12 sm:mb-16"
            variants={itemVariants}
          >
            Follow Towizaza on social media to stay updated with latest music,
            events, and behind-the-scenes moments.
          </motion.p>

          <motion.div
            className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8"
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
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${social.color} ${social.hoverColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 mb-3 transform group-hover:-translate-y-1`}
                >
                  <span className="text-white">{social.icon}</span>
                </div>
                <span className="text-xs sm:text-sm text-light/80 group-hover:text-light transition-colors duration-300">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div
            className="mt-16 sm:mt-20 max-w-2xl mx-auto bg-dark/30 backdrop-blur-md border border-light/5 rounded-2xl p-6 sm:p-8"
            variants={itemVariants}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Join the Community
            </h3>
            <p className="text-sm sm:text-base text-light/80 mb-6">
              Subscribe to our newsletter for exclusive updates,
              behind-the-scenes content, and early access to new releases.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-dark/70 border border-light/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors text-light"
              />
              <button
                type="button"
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-light font-medium rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
