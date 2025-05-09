"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity";

interface LazyImageProps extends Omit<ImageProps, "src"> {
  src: string | any; // Support both string URLs and Sanity image references
  lowQuality?: boolean; // Option to load low quality version first
  aspectRatio?: number; // Optional aspect ratio to maintain
  containerClassName?: string;
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  lowQuality = false,
  aspectRatio,
  containerClassName = "",
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Process source for Sanity images
  const imageUrl = typeof src === "string" ? src : urlFor(src).url();

  // Create blur URL for Sanity images if lowQuality is true
  const blurUrl =
    lowQuality && typeof src !== "string"
      ? urlFor(src).width(20).height(20).blur(10).url()
      : undefined;

  // Create style for aspect ratio container if needed
  const containerStyle = aspectRatio
    ? {
        position: "relative" as const,
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
      }
    : { position: "relative" as const };

  return (
    <div
      className={`overflow-hidden ${containerClassName}`}
      style={containerStyle}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full"
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${className}`}
          onLoad={() => setIsLoaded(true)}
          placeholder={blurUrl ? "blur" : "empty"}
          blurDataURL={blurUrl}
          loading="lazy"
          {...props}
        />
      </motion.div>
    </div>
  );
}
