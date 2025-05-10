"use client";

import { useState } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

interface SanityImageProps {
  image: any;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
}

export function SanityImage({
  image,
  alt = "Image",
  width = 800,
  height = 600,
  className,
  priority = false,
  quality = 85,
}: SanityImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!image) {
    return (
      <div
        className={cn(
          "bg-gray-200 dark:bg-gray-800 flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const imageUrl = urlForImage(image)
    ?.width(width)
    ?.height(height)
    ?.quality(quality)
    ?.url();

  if (!imageUrl) {
    return (
      <div
        className={cn(
          "bg-gray-200 dark:bg-gray-800 flex items-center justify-center",
          className
        )}
        style={{ width, height }}
      >
        <span className="text-gray-400">Invalid image URL</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isLoading && "animate-pulse bg-gray-200 dark:bg-gray-800",
        className
      )}
      style={{ width, height }}
    >
      {!error ? (
        <Image
          src={imageUrl}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          priority={priority}
          quality={quality}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      )}
    </div>
  );
}
