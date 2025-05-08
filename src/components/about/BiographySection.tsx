"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

interface BiographySectionProps {
  artistInfo: any;
}

export default function BiographySection({
  artistInfo,
}: BiographySectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Get alternate artist image URL with error handling
  const getAltImageUrl = () => {
    if (!artistInfo?.heroImage) return "/images/artist-alt-placeholder.jpg";

    try {
      if (typeof artistInfo.heroImage === "string") {
        return artistInfo.heroImage;
      }

      // If it's a Sanity image
      return urlFor(artistInfo.heroImage).url();
    } catch (error) {
      console.error("Error getting artist alt image URL:", error);
      return "/images/artist-alt-placeholder.jpg";
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="biography" className="py-20 bg-dark" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center relative inline-block mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">
              The Journey
            </span>
            <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full mt-2"></div>
          </h2>
          <p className="text-light/60 text-center max-w-xl">
            From beginnings to breakthroughs, explore the artistic evolution
            that defines Towizaza's unique sound.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Image column - Responsive layout with grid */}
          <motion.div
            className="lg:col-span-5 order-2 lg:order-1 relative"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl">
              <Image
                src={getAltImageUrl()}
                alt={artistInfo?.name || "Artist"}
                fill
                className="object-cover"
              />

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-primary/40 to-accent/30 rounded-full blur-[70px]"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-tr from-accent/30 to-primary/40 rounded-full blur-[70px]"></div>

              {/* Image overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-60"></div>

              {/* Year badge */}
              <div className="absolute top-4 right-4 bg-dark/60 backdrop-blur-md border border-light/10 py-1 px-4 rounded-full">
                <span className="text-sm font-medium text-light/90">
                  Est. {artistInfo?.foundingYear || "2018"}
                </span>
              </div>
            </div>

            {/* Quote overlay */}
            <div className="absolute -bottom-6 left-6 right-6 bg-dark/80 backdrop-blur-lg border border-light/10 p-5 rounded-xl">
              <motion.blockquote
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="relative z-10"
              >
                <svg
                  className="absolute -top-5 -left-2 w-10 h-10 text-primary/20 transform -scale-x-100"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="italic text-light/90 text-lg leading-relaxed pl-6">
                  {artistInfo?.quote ||
                    "Music is not just what I do—it's the lens through which I experience the world."}
                </p>
              </motion.blockquote>
            </div>
          </motion.div>

          {/* Text column */}
          <motion.div
            className="lg:col-span-7 order-1 lg:order-2"
            variants={container}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <motion.p
              className="text-light/90 mb-6 text-lg leading-relaxed"
              variants={item}
            >
              {artistInfo?.bio?.part1 ||
                "Born in the digital age yet nostalgic for analog warmth, Towizaza emerged from the fusion of classical training and electronic experimentation. With roots in both traditional composition and cutting-edge production techniques, the artist crafts soundscapes that defy conventional genre boundaries."}
            </motion.p>

            <motion.p
              className="text-light/90 mb-8 text-lg leading-relaxed"
              variants={item}
            >
              {artistInfo?.bio?.part2 ||
                "Since debuting in 2018, Towizaza has pushed the boundaries of sonic innovation while maintaining an emotional core that resonates with listeners worldwide. The music combines intricate layering with minimalist restraint, creating signature sounds that feel both familiar and revolutionary."}
            </motion.p>

            <motion.div
              className="mb-8 pl-4 border-l-2 border-primary"
              variants={item}
            >
              <p className="text-light/80 text-lg">
                {artistInfo?.bio?.part3 ||
                  "With each release, the project evolves, incorporating new influences while staying true to a distinctive aesthetic that fans have come to recognize and love. Collaborations with artists across genres have further expanded the sonic palette, creating unexpected fusions that challenge expectations."}
              </p>
            </motion.div>

            <motion.div className="flex flex-wrap gap-4 mt-8" variants={item}>
              {/* Achievement badges */}
              {[
                {
                  label: "Albums Released",
                  value: artistInfo?.stats?.albumsReleased || 5,
                },
                {
                  label: "Countries Toured",
                  value: artistInfo?.stats?.countriesVisited || 15,
                },
                {
                  label: "Collaborations",
                  value: artistInfo?.stats?.collaborations || 12,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-dark/40 backdrop-blur-sm border border-light/10 py-3 px-5 rounded-xl flex items-center gap-3"
                >
                  <span className="text-2xl font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-sm text-light/70">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
