"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor, getAudioUrl } from "@/lib/sanity";
import { usePlayer } from "@/context/PlayerContext";
import { Album, Track } from "@/data/music";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface MusicCardProps {
  album: Album;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export default function MusicCard({
  album,
  variant = "default",
  className = "",
}: MusicCardProps) {
  const { play, pause, resume, state, setQueue } = usePlayer();
  const [isHovering, setIsHovering] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get all playable tracks for the album
  const playableTracks = album.tracks.filter((track) => !!getAudioUrl(track));
  const hasPlayableTracks = playableTracks.length > 0;

  // Check if this is the current album being played
  const isCurrentAlbum =
    state.currentAlbum &&
    // Check ID match
    ((state.currentAlbum.id &&
      album.id &&
      state.currentAlbum.id === album.id) ||
      // Check slug match
      (state.currentAlbum.slug &&
        album.slug &&
        state.currentAlbum.slug.current === album.slug.current) ||
      // Check title match as fallback
      (state.currentAlbum.title === album.title &&
        state.currentAlbum.type === album.type));

  // Reset loading state when album changes or playback changes
  useEffect(() => {
    if (isCurrentAlbum) {
      setIsLoading(false);
    }
  }, [isCurrentAlbum, state.isPlaying]);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasPlayableTracks) return;

    // Toggle play/pause if this is the current album
    if (isCurrentAlbum) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Show loading state while audio is being loaded
      setIsLoading(true);

      // Play the first track of this album and set queue
      play(playableTracks[0], album);
      setQueue(playableTracks);

      // If loading takes too long, automatically clear loading state after 3 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  // Get album artwork URL
  const getArtworkUrl = () => {
    if (!album.artwork) return "/images/placeholder-album.jpg";

    if (typeof album.artwork === "string") {
      return album.artwork;
    }

    // If it's a Sanity image
    return urlFor(album.artwork).url();
  };

  // Generate album URL
  const getAlbumUrl = () => {
    if (album._type === "music" && album.slug) {
      return `/music/${album.slug.current}`;
    }
    return `/music/${album.id}`;
  };

  // Tailwind classes based on variant
  const cardClasses = {
    default:
      "bg-dark/50 backdrop-blur-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300",
    compact: "bg-dark/50 backdrop-blur-lg rounded-lg overflow-hidden",
    featured:
      "bg-gradient-to-br from-dark/80 to-secondary/30 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg",
  };

  const imageContainerClasses = {
    default: "aspect-square relative overflow-hidden",
    compact: "aspect-[4/3] relative overflow-hidden",
    featured: "aspect-square relative overflow-hidden rounded-t-lg",
  };

  return (
    <motion.div
      className={`${cardClasses[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        scale: variant === "compact" ? 1.02 : 1.03,
        transition: { duration: 0.2 },
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={imageContainerClasses[variant]}>
        <div
          className={`w-full h-full ${!isImageLoaded ? "bg-dark/50 animate-pulse" : ""}`}
        >
          {album.artwork && (
            <Image
              src={getArtworkUrl()}
              alt={album.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={`object-cover transition-all duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}
        </div>

        {/* Play button overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent flex items-center justify-center transition-all duration-300 ${
            isHovering || (isCurrentAlbum && state.isPlaying) || isLoading
              ? "opacity-100"
              : "opacity-0"
          }`}
          onClick={hasPlayableTracks && !isLoading ? handlePlay : undefined}
          style={{
            cursor: hasPlayableTracks && !isLoading ? "pointer" : "default",
          }}
        >
          {hasPlayableTracks && (
            <button
              type="button"
              onClick={hasPlayableTracks && !isLoading ? handlePlay : undefined}
              className={`w-16 h-16 rounded-full ${
                isLoading
                  ? "bg-dark/70 border-2 border-primary/50"
                  : "bg-primary/90 hover:bg-primary"
              } flex items-center justify-center transform transition-all duration-300 shadow-xl`}
              aria-label={
                isLoading
                  ? "Loading..."
                  : isCurrentAlbum && state.isPlaying
                    ? "Pause"
                    : "Play Album"
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : isCurrentAlbum && state.isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-light"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8 text-light"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Album type badge */}
        <div className="absolute top-2 left-2 bg-dark/60 backdrop-blur-md text-light text-xs font-medium py-1 px-2 rounded-full">
          {album.type.charAt(0).toUpperCase() + album.type.slice(1)}
        </div>

        {/* "Now Playing" or "Loading" indicator */}
        {(isCurrentAlbum || isLoading) && (
          <div
            className={`absolute top-2 right-2 ${
              isLoading ? "bg-secondary/60" : "bg-primary"
            } text-light text-xs font-bold py-1 px-2 rounded-full ${
              !isLoading && "animate-pulse"
            } shadow-lg`}
          >
            {isLoading
              ? "Loading..."
              : state.isPlaying
                ? "Now Playing"
                : "Paused"}
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={getAlbumUrl()} className="group">
          <h3 className="text-lg font-medium text-light group-hover:text-primary transition-colors duration-200">
            {album.title}
          </h3>
          <div className="flex justify-between items-center mt-1">
            <p className="text-light/70 text-sm">
              {album.year} • {album.tracks.length}{" "}
              {album.tracks.length === 1 ? "track" : "tracks"}
            </p>

            {album.upcoming && (
              <div className="text-xs text-accent">
                {new Date(album.releaseDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>
        </Link>

        {variant !== "compact" && (
          <div className="flex mt-4 gap-2">
            {hasPlayableTracks && (
              <button
                onClick={handlePlay}
                disabled={isLoading}
                className={`flex-1 py-2 px-3 ${
                  isLoading
                    ? "bg-dark/50 cursor-not-allowed"
                    : "bg-primary/90 hover:bg-primary cursor-pointer"
                } text-light text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : isCurrentAlbum && state.isPlaying ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                    </svg>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                    <span>Play</span>
                  </>
                )}
              </button>
            )}

            <Link
              href={getAlbumUrl()}
              className="flex-1 py-2 px-3 bg-secondary/30 hover:bg-secondary/50 text-light text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Details</span>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
