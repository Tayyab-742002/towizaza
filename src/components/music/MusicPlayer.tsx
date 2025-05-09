"use client";

import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { urlFor } from "@/lib/sanity";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { getAudioUrl } from "@/lib/sanity";
import {
  X,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Track } from "@/data/music";

// Define proper types for the audio player events
interface AudioPlayerElement extends HTMLAudioElement {
  currentTime: number;
  duration: number;
  volume: number;
}

// Define player control component props
interface PlayerControlsProps {
  audioUrl: string;
  handlePrevTrack: () => void;
  handleNextTrack: () => void;
  showSkipControls: boolean;
  playerRef: React.RefObject<any>;
  resumeCallback: () => void;
  pauseCallback: () => void;
  onListen: (e: any) => void;
  onLoadedMetaData: (e: any) => void;
  onVolumeChange: (e: any) => void;
  isPlaying: boolean;
}

// Additional props for mobile player
interface MobilePlayerProps extends PlayerControlsProps {
  currentTrack: Track;
  currentAlbum: any;
  handleClose: () => void;
}

// Custom mobile player with improved controls
const MobilePlayerControls = ({
  audioUrl,
  handlePrevTrack,
  handleNextTrack,
  showSkipControls,
  playerRef,
  resumeCallback,
  pauseCallback,
  onListen,
  onLoadedMetaData,
  onVolumeChange,
  isPlaying,
  currentTrack,
  currentAlbum,
  handleClose,
}: MobilePlayerProps) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0.7);

  // Update progress when player is active
  useEffect(() => {
    const updateProgress = () => {
      if (playerRef.current?.audio?.current) {
        const audio = playerRef.current.audio.current;
        setProgress(audio.currentTime);
        setDuration(audio.duration || 0);
      }
    };

    const interval = setInterval(updateProgress, 250);
    return () => clearInterval(interval);
  }, [playerRef]);

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current?.audio?.current) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;

    if (playerRef.current?.audio?.current) {
      playerRef.current.audio.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  // Toggle mute state
  const toggleMute = () => {
    if (playerRef.current?.audio?.current) {
      const audio = playerRef.current.audio.current;
      if (!isMuted) {
        setVolumeLevel(audio.volume);
        audio.volume = 0;
      } else {
        audio.volume = volumeLevel;
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full flex flex-col sm:hidden">
      {/* Track info and close button */}
      <div className="w-full flex justify-between items-center mb-2 px-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0 bg-dark/50">
            {currentAlbum?.artwork && (
              <img
                src={
                  typeof currentAlbum.artwork === "string"
                    ? currentAlbum.artwork
                    : urlFor(currentAlbum.artwork).url()
                }
                alt={currentAlbum.title || "Album art"}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-light truncate">
              {currentTrack?.title}
            </div>
            <div className="text-[10px] text-light/70 truncate">
              {currentAlbum?.title || "Unknown album"}
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-light/70 hover:text-light transition-colors rounded-full p-1 ml-2"
          aria-label="Close player"
        >
          <X size={16} />
        </button>
      </div>

      {/* Custom progress bar */}
      <div
        className="w-full h-1 bg-light/20 relative cursor-pointer mx-auto mb-1.5 px-2"
        onClick={handleProgressClick}
      >
        <div
          className="absolute top-0 left-0 h-full bg-primary"
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary"
          style={{ left: `calc(${progressPercentage}% - 5px)` }}
        />
      </div>

      {/* Time indicators */}
      <div className="flex justify-between px-2 mb-1">
        <div className="text-[10px] text-light/70">{formatTime(progress)}</div>
        <div className="text-[10px] text-light/70">{formatTime(duration)}</div>
      </div>

      {/* Custom controls */}
      <div className="flex items-center justify-center gap-2 py-1">
        {/* Previous button */}
        {showSkipControls && (
          <button
            onClick={handlePrevTrack}
            className="p-2 text-light/80 hover:text-primary transition-colors"
            aria-label="Previous track"
            disabled={!showSkipControls}
          >
            <SkipBack size={20} />
          </button>
        )}

        {/* Play/Pause button */}
        <button
          onClick={isPlaying ? pauseCallback : resumeCallback}
          className="p-2 rounded-full bg-primary/90 hover:bg-primary text-light transition-colors flex items-center justify-center"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        {/* Next button */}
        {showSkipControls && (
          <button
            onClick={handleNextTrack}
            className="p-2 text-light/80 hover:text-primary transition-colors"
            aria-label="Next track"
            disabled={!showSkipControls}
          >
            <SkipForward size={20} />
          </button>
        )}

        {/* Volume button */}
        <button
          onClick={toggleMute}
          className="p-2 text-light/80 hover:text-primary transition-colors ml-3"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={18} />
          ) : playerRef.current?.audio?.current?.volume > 0.5 ? (
            <Volume2 size={18} />
          ) : (
            <Volume1 size={18} />
          )}
        </button>
      </div>

      {/* Hidden audio player for mobile */}
      <div className="hidden">
        <AudioPlayer
          ref={playerRef}
          src={audioUrl}
          onPlay={resumeCallback}
          onPause={pauseCallback}
          onListen={onListen}
          onLoadedMetaData={onLoadedMetaData}
          onVolumeChange={onVolumeChange}
          autoPlayAfterSrcChange={isPlaying}
        />
      </div>
    </div>
  );
};

// Desktop player
const DesktopPlayerControls = ({
  audioUrl,
  handlePrevTrack,
  handleNextTrack,
  showSkipControls,
  playerRef,
  resumeCallback,
  pauseCallback,
  onListen,
  onLoadedMetaData,
  onVolumeChange,
  isPlaying,
}: PlayerControlsProps) => {
  return (
    <div className="hidden sm:block w-full sm:flex-1 sm:max-w-2xl">
      <AudioPlayer
        ref={playerRef}
        src={audioUrl}
        showSkipControls={showSkipControls}
        showJumpControls={false}
        onClickPrevious={handlePrevTrack}
        onClickNext={handleNextTrack}
        onPlay={resumeCallback}
        onPause={pauseCallback}
        onListen={onListen}
        onLoadedMetaData={onLoadedMetaData}
        onVolumeChange={onVolumeChange}
        autoPlayAfterSrcChange={isPlaying}
        className="compact-player"
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      />
    </div>
  );
};

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
    toggleVisibility,
  } = usePlayer();
  const playerRef = useRef<any>(null);
  const pathname = usePathname();
  const previousPath = useRef<string>(pathname);

  // Track page navigation
  useEffect(() => {
    if (previousPath.current !== pathname) {
      console.log(
        `Navigation detected: ${previousPath.current} -> ${pathname}`
      );

      // When navigation happens and the player was playing, ensure it continues
      if (state.isPlaying && playerRef.current?.audio?.current) {
        // We need to ensure the audio element keeps playing during navigation
        const currentAudio = playerRef.current.audio.current;

        // Small delay to ensure the audio keeps playing after route change
        setTimeout(() => {
          if (state.isPlaying && !currentAudio.paused) {
            console.log("Ensuring playback continues after navigation");
          } else if (state.isPlaying && currentAudio.paused) {
            console.log("Playback was interrupted, resuming...");
            currentAudio
              .play()
              .catch((err: Error) =>
                console.error("Failed to resume after navigation:", err)
              );
          }
        }, 100);
      }

      previousPath.current = pathname;
    }
  }, [pathname, state.isPlaying]);

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

  // If the audio player element changes (e.g., after navigation), restore state
  useEffect(() => {
    if (playerRef.current?.audio?.current && audioRef.current) {
      audioRef.current = playerRef.current.audio.current;

      // If we have a saved playback time, restore it
      if (state.lastPlaybackTime > 0) {
        playerRef.current.audio.current.currentTime = state.lastPlaybackTime;
      }
    }
  }, [playerRef.current, audioRef, state.lastPlaybackTime]);

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

  // Handle closing the player
  const handleClose = () => {
    pause(); // Pause the playback
    toggleVisibility(); // Hide the player
  };

  // Functions for audio player callbacks
  const handleListen = (e: any) => {
    if (audioRef.current && e.target) {
      const target = e.target as AudioPlayerElement;
      audioRef.current.currentTime = target.currentTime;
    }
  };

  const handleLoadedMetaData = (e: any) => {
    if (audioRef.current && e.target) {
      const target = e.target as AudioPlayerElement;
      // Update our context with the duration
      if (target.duration && !isNaN(target.duration)) {
        seek(audioRef.current.currentTime);
      }
    }
  };

  const handleVolumeChange = (e: any) => {
    if (e.target) {
      const target = e.target as AudioPlayerElement;
      setVolume(target.volume);
    }
  };

  // If no current track or player is not visible, don't render
  if (!state.currentTrack || !state.isVisible) return null;

  // Get the audio URL
  const audioUrl = state.currentTrack ? getAudioUrl(state.currentTrack) : "";

  // Get current track position in queue
  const currentIndex = getCurrentTrackIndex();
  const trackPosition =
    currentIndex !== -1 ? `${currentIndex + 1} of ${state.queue.length}` : "";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark/90 backdrop-blur-md border-t border-light/10 transition-all duration-300 z-40">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3 flex justify-center">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full max-w-5xl">
          {/* Album artwork for desktop */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-mid/20 rounded-md overflow-hidden flex-shrink-0">
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

            {/* Close button - Visible on desktop */}
            <div className="ml-2">
              <button
                onClick={handleClose}
                className="text-light/70 hover:text-light transition-colors rounded-full p-1 hover:bg-light/10"
                aria-label="Close player"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Mobile-optimized player */}
          <MobilePlayerControls
            audioUrl={audioUrl}
            handlePrevTrack={handlePrevTrack}
            handleNextTrack={handleNextTrack}
            showSkipControls={state.queue.length > 1}
            playerRef={playerRef}
            resumeCallback={() => {
              if (!state.isPlaying) resume();
            }}
            pauseCallback={() => {
              if (state.isPlaying) pause();
            }}
            onListen={handleListen}
            onLoadedMetaData={handleLoadedMetaData}
            onVolumeChange={handleVolumeChange}
            isPlaying={state.isPlaying}
            currentTrack={state.currentTrack}
            currentAlbum={state.currentAlbum}
            handleClose={handleClose}
          />

          {/* Desktop player */}
          <DesktopPlayerControls
            audioUrl={audioUrl}
            handlePrevTrack={handlePrevTrack}
            handleNextTrack={handleNextTrack}
            showSkipControls={state.queue.length > 1}
            playerRef={playerRef}
            resumeCallback={() => {
              if (!state.isPlaying) resume();
            }}
            pauseCallback={() => {
              if (state.isPlaying) pause();
            }}
            onListen={handleListen}
            onLoadedMetaData={handleLoadedMetaData}
            onVolumeChange={handleVolumeChange}
            isPlaying={state.isPlaying}
          />

          {/* Queue indicator - Only visible on desktop */}
          <div className="hidden md:flex items-center gap-4 text-light/70">
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
