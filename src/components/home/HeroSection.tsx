"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaYoutube,
  FaSpotify,
  FaSoundcloud,
} from "react-icons/fa";
import ScrollIndicator from "../common/Scroll-Indicator";

interface HeroSectionProps {
  artistInfo: any;
}

export default function HeroSection({ artistInfo }: HeroSectionProps) {
  console.log(artistInfo);
  // Animation variants for staggered animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const getImageUrl = (image: any) => {
    if (!image) {
      return "/images/fallback-hero-image.jpg";
    }
    if (typeof image === "string") {
      return image;
    }
    return urlFor(image).url();
  };
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        {artistInfo?.heroImage ? (
          <Image
            src={getImageUrl(artistInfo.heroImage)}
            alt="Towizaza"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-radial from-secondary/30 to-dark"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/60 to-dark/90 z-10"></div>
      </div>
      <div className="container mx-auto px-6 relative z-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-extrabold text-light mb-4"
          >
            TOWIZAZA
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl md:text-2xl text-light/80 mb-8 accent-text italic"
          >
            Experience the sound of tomorrow
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/music"
              className="bg-primary hover:bg-primary/90 text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Latest Release
            </Link>

            <Link
              href="/store"
              className="bg-transparent border-2 border-light/70 hover:border-light text-light font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
            >
              Merch Store
            </Link>
          </motion.div>

          {/* Social media links */}
          {artistInfo?.socialLinks && (
            <motion.div
              variants={fadeInUp}
              className="flex justify-center mt-10 space-x-4 "
            >
              {artistInfo.socialLinks.spotify && (
                <a
                  href={artistInfo.socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="Spotify"
                >
                  <FaSpotify className="h-6 w-6" />
                </a>
              )}

              {artistInfo.socialLinks.instagram && (
                <a
                  href={artistInfo.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram className="h-6 w-6" />
                </a>
              )}

              {artistInfo.socialLinks.youtube && (
                <a
                  href={artistInfo.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="YouTube"
                >
                  <FaYoutube className="h-6 w-6" />
                </a>
              )}

              {artistInfo.socialLinks.soundcloud && (
                <a
                  href={artistInfo.socialLinks.soundcloud}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light/70 hover:text-primary transition-colors"
                  aria-label="SoundCloud"
                >
                  <FaSoundcloud className="h-6 w-6" />
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      <motion.div
        variants={fadeInUp}
        className="absolute bottom-8 left-0 right-0 flex justify-center z-50"
      >
        <ScrollIndicator color="#ffffff" glowIntensity={10} />
      </motion.div>{" "}
    </section>
  );
}
