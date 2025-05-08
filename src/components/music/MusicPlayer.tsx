"use client";

import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { urlFor } from "@/lib/sanity";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { getAudioUrl } from "@/lib/sanity";

// Define proper types for the audio player events
interface AudioPlayerElement extends HTMLAudioElement {
  currentTime: number;
  duration: number;
  volume: number;
}

export default function MusicPlayer() {
  const {
    state,
    pause,
    resume,
    seek,
    nextTrack,
    prevTrack,
    setVolume,
    audioRef,
  } = usePlayer();
  const playerRef = useRef<any>(null);

  // Force play when a track is loaded initially
  useEffect(() => {
    if (playerRef.current && playerRef.current.audio.current) {
      if (state.isPlaying) {
        // Small timeout to ensure the audio element is fully initialized
        const playPromise = setTimeout(() => {
          if (playerRef.current && playerRef.current.audio.current) {
            const playPromise = playerRef.current.audio.current.play();

            if (playPromise !== undefined) {
              playPromise.catch((error: any) => {
                console.error("Playback failed:", error);
                // If autoplay is prevented, we need to update our state
                if (error.name === "NotAllowedError") {
                  pause();
                }
              });
            }
          }
        }, 100);

        return () => clearTimeout(playPromise);
      } else {
        // Handle pause state
        playerRef.current.audio.current.pause();
      }
    }
  }, [state.currentTrack, state.isPlaying, pause]);

  // Helper function to get album artwork URL
  const getArtworkUrl = () => {
    if (!state.currentAlbum?.artwork) return "/images/placeholder-album.jpg";

    if (typeof state.currentAlbum.artwork === "string") {
      return state.currentAlbum.artwork;
    }

    // If it's a Sanity image
    return urlFor(state.currentAlbum.artwork).url();
  };

  // Get current track index
  const getCurrentTrackIndex = () => {
    if (!state.currentTrack || state.queue.length === 0) return -1;

    return state.queue.findIndex((track) =>
      track.id && state.currentTrack?.id
        ? track.id === state.currentTrack.id
        : track._key && state.currentTrack?._key
          ? track._key === state.currentTrack._key
          : track === state.currentTrack
    );
  };

  // Check if there's a next track
  const hasNextTrack = () => {
    const currentIndex = getCurrentTrackIndex();
    return currentIndex >= 0 && currentIndex < state.queue.length - 1;
  };

  // Check if there's a previous track
  const hasPrevTrack = () => {
    const currentIndex = getCurrentTrackIndex();
    return currentIndex > 0;
  };

  // Handle next track
  const handleNextTrack = () => {
    if (hasNextTrack()) {
      nextTrack();
    }
  };

  // Handle previous track
  const handlePrevTrack = () => {
    if (hasPrevTrack()) {
      prevTrack();
    }
  };

  // If no current track, don't render player
  if (!state.currentTrack) return null;

  // Get the audio URL
  const audioUrl = state.currentTrack ? getAudioUrl(state.currentTrack) : "";

  // Get current track position in queue
  const currentIndex = getCurrentTrackIndex();
  const trackPosition =
    currentIndex !== -1 ? `${currentIndex + 1} of ${state.queue.length}` : "";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark/90 backdrop-blur-md border-t border-light/10 transition-all duration-300 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-5xl">
          {/* Album artwork and track info */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 bg-mid/20 rounded-md overflow-hidden flex-shrink-0">
              {state.currentAlbum?.artwork && (
                <img
                  src={getArtworkUrl()}
                  alt={state.currentAlbum.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="truncate">
              <h4 className="text-sm font-medium text-light truncate">
                {state.currentTrack.title}
              </h4>
              <p className="text-xs text-light/70 truncate">
                {state.currentAlbum?.title || "Unknown Album"}
              </p>
            </div>
          </div>

          {/* Audio Player - Full width on mobile, constrained on desktop */}
          <div className="w-full sm:flex-1 sm:max-w-2xl">
            <AudioPlayer
              ref={playerRef}
              src={audioUrl}
              showSkipControls={state.queue.length > 1}
              showJumpControls={false}
              onClickPrevious={handlePrevTrack}
              onClickNext={handleNextTrack}
              onPlay={() => {
                if (!state.isPlaying) resume();
              }}
              onPause={() => {
                if (state.isPlaying) pause();
              }}
              onListen={(e: any) => {
                if (audioRef.current && e.target) {
                  const target = e.target as AudioPlayerElement;
                  audioRef.current.currentTime = target.currentTime;
                }
              }}
              onLoadedMetaData={(e: any) => {
                if (audioRef.current && e.target) {
                  const target = e.target as AudioPlayerElement;
                  // Update our context with the duration
                  if (target.duration && !isNaN(target.duration)) {
                    seek(audioRef.current.currentTime); // Update with new duration
                  }
                }
              }}
              onVolumeChange={(e: any) => {
                if (e.target) {
                  const target = e.target as AudioPlayerElement;
                  setVolume(target.volume);
                }
              }}
              autoPlayAfterSrcChange={state.isPlaying}
              className="compact-player"
              style={{
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            />
          </div>

          {/* Queue indicator - Only visible on desktop */}
          <div className="hidden md:flex items-center gap-2 text-light/70">
            <span className="text-xs">{trackPosition}</span>
          </div>
        </div>
      </div>

      {/* Customized styling for the compact player */}
      <style jsx global>{`
        .compact-player .rhap_container {
          background-color: transparent;
          box-shadow: none;
          padding: 0;
        }

        .compact-player .rhap_controls-section {
          margin: 0;
        }

        .compact-player .rhap_main-controls-button {
          color: var(--light, #ffffff);
          font-size: 22px;
        }

        .compact-player .rhap_play-pause-button {
          font-size: 28px;
          width: 36px;
          height: 36px;
        }

        .rhap_container {
          background-color: rgba(30, 30, 30, 0.3);
          box-shadow: none;
        }

        .rhap_progress-bar {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .rhap_progress-filled {
          background-color: var(--primary, #e63946);
        }

        .rhap_progress-indicator {
          background-color: var(--primary, #e63946);
        }

        .rhap_volume-button,
        .rhap_main-controls-button,
        .rhap_time {
          color: var(--light, #ffffff);
        }

        .rhap_volume-indicator {
          background-color: var(--accent, #4361ee);
        }

        .rhap_volume-bar {
          background-color: rgba(255, 255, 255, 0.2);
        }

        /* Make the player more compact */
        .rhap_progress-section {
          margin-bottom: 4px;
        }

        /* Media query adjustments for mobile */
        @media (max-width: 640px) {
          .rhap_progress-section {
            margin-bottom: 2px;
          }

          .rhap_controls-section {
            margin-top: 0;
          }

          .rhap_controls-section .rhap_main-controls {
            margin-right: 8px;
          }

          .rhap_controls-section .rhap_volume-controls {
            justify-content: flex-end;
          }

          .rhap_time {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
