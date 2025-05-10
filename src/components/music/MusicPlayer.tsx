"use client";

import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { urlFor } from "@/lib/sanity";
import { getAudioUrl, isMobileDataConnection } from "@/lib/sanity";
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
import Image from "next/image";
import LazyImage from "@/components/common/LazyImage";
import ReactHowler from "react-howler";

// Create a second Howler instance for preloading the next track
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

  const pathname = usePathname();
  const previousPath = useRef<string>(pathname);

  // State for the player
  const [dataSaverMode, setDataSaverMode] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [nextTrackUrl, setNextTrackUrl] = useState<string>("");

  // Refs
  const playerRef = useRef<ReactHowler | null>(null);
  const nextPlayerRef = useRef<ReactHowler | null>(null);
  const seekIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentTrackIdRef = useRef<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for data saver mode on initial load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDataSaverMode = () => {
      const onMobileData = isMobileDataConnection();
      const userPreference = localStorage.getItem("audioDataSaver");

      if (userPreference !== null) {
        setDataSaverMode(userPreference === "true");
      } else {
        setDataSaverMode(onMobileData);
      }
    };

    checkDataSaverMode();

    window.addEventListener("online", checkDataSaverMode);
    return () => window.removeEventListener("online", checkDataSaverMode);
  }, []);

  // Save data saver preference when changed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("audioDataSaver", dataSaverMode.toString());
    }
  }, [dataSaverMode]);

  // Track page navigation
  useEffect(() => {
    if (previousPath.current !== pathname) {
      console.log(
        `Navigation detected: ${previousPath.current} -> ${pathname}`
      );
      previousPath.current = pathname;
    }
  }, [pathname]);

  // Set up seek interval when playing
  useEffect(() => {
    if (state.isPlaying && !seeking && playerRef.current) {
      // Clear any existing interval
      if (seekIntervalRef.current) {
        clearInterval(seekIntervalRef.current);
      }

      // Create new interval to update the time display
      seekIntervalRef.current = setInterval(() => {
        try {
          if (playerRef.current) {
            const position = playerRef.current.seek();
            if (typeof position === "number") {
              setCurrentPosition(position);

              // Update the audio ref for any external components that need this info
              if (audioRef.current) {
                audioRef.current.currentTime = position;
              }
            }
          }
        } catch (error) {
          console.error("Error in seek interval:", error);
        }
      }, 250);
    } else if (!state.isPlaying && seekIntervalRef.current) {
      // Clear interval when paused
      clearInterval(seekIntervalRef.current);
      seekIntervalRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (seekIntervalRef.current) {
        clearInterval(seekIntervalRef.current);
        seekIntervalRef.current = null;
      }
    };
  }, [state.isPlaying, seeking, audioRef]);

  // Preload the next track when current track is playing
  useEffect(() => {
    if (!state.currentTrack || !state.isPlaying) return;

    // Get the next track if available
    const currentIndex = getCurrentTrackIndex();
    if (currentIndex >= 0 && currentIndex < state.queue.length - 1) {
      const nextTrack = state.queue[currentIndex + 1];
      if (nextTrack) {
        const url = getAudioUrl(nextTrack, {
          quality: dataSaverMode ? "low" : "high",
          dataSaver: dataSaverMode,
        });
        setNextTrackUrl(url);
      }
    }
  }, [state.currentTrack, state.isPlaying, state.queue, dataSaverMode]);

  // Track changes
  useEffect(() => {
    if (!state.currentTrack) return;

    // Generate a stable identifier for the track that includes album context
    const trackId =
      (state.currentTrack.id ||
        state.currentTrack._key ||
        state.currentTrack.title) +
      "-" +
      (state.currentAlbum?.id ||
        state.currentAlbum?._id ||
        state.currentAlbum?.title ||
        "no-album");

    if (currentTrackIdRef.current !== trackId) {
      console.log("Track changed or album context changed");
      currentTrackIdRef.current = trackId;

      // Reset current position when track changes
      setCurrentPosition(0);
      setTrackDuration(0);

      // Clear any existing loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      // Always reset to beginning when album context changes
      setTimeout(() => {
        if (playerRef.current) {
          // Force seek to beginning
          playerRef.current.seek(0);
          setCurrentPosition(0);
          seek(0);
        }
      }, 50);
    }
  }, [state.currentTrack, state.currentAlbum, state.lastPlaybackTime, seek]);

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
    pause(); // Update state
    toggleVisibility(); // Hide the player
  };

  // Handle play/pause actions
  const handlePlayPause = (shouldPlay: boolean) => {
    if (shouldPlay) {
      if (!state.isPlaying) {
        console.log("User requested play");
        resume();
      }
    } else {
      if (state.isPlaying) {
        console.log("User requested pause");
        pause();
      }
    }
  };

  // Handle seeking
  const handleSeek = (seekPosition: number) => {
    if (playerRef.current) {
      setSeeking(true);

      playerRef.current.seek(seekPosition);
      setCurrentPosition(seekPosition);
      seek(seekPosition);

      // Short delay to prevent UI jumps
      setTimeout(() => setSeeking(false), 50);
    }
  };

  // Handle when a track ends
  const handleOnEnd = () => {
    console.log("Track ended");
    if (hasNextTrack()) {
      handleNextTrack();
    } else {
      pause();
    }
  };

  // Handle when track loads
  const handleOnLoad = () => {
    console.log("Track loaded");
    if (playerRef.current) {
      const duration = playerRef.current.duration();
      setTrackDuration(duration);

      // If we had a previous playback position, seek to it
      if (state.lastPlaybackTime > 0 && state.lastPlaybackTime < duration) {
        playerRef.current.seek(state.lastPlaybackTime);
        setCurrentPosition(state.lastPlaybackTime);
      }
    }
  };

  // If no current track or player is not visible, don't render
  if (!state.currentTrack || !state.isVisible) return null;

  // Get the audio URL with quality based on data saver mode
  const audioUrl = state.currentTrack
    ? getAudioUrl(state.currentTrack, {
        quality: dataSaverMode ? "low" : "high",
        dataSaver: dataSaverMode,
      })
    : "";

  // Get current track position in queue
  const currentIndex = getCurrentTrackIndex();
  const trackPosition =
    currentIndex !== -1 ? `${currentIndex + 1} of ${state.queue.length}` : "";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark/95 backdrop-blur-lg border-t border-light/10 transition-all duration-300 z-[1000] shadow-lg">
      {/* Main player container */}
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full max-w-5xl mx-auto">
          {/* Hidden ReactHowler component for current track */}
          <ReactHowler
            key={`${state.currentTrack?.id || state.currentTrack?._key || ""}-${state.currentAlbum?.id || state.currentAlbum?._id || ""}`}
            src={audioUrl}
            playing={state.isPlaying}
            ref={playerRef}
            volume={state.volume}
            onEnd={handleOnEnd}
            onLoad={handleOnLoad}
            html5={true}
            preload={true}
            format={["mp3", "wav"]}
          />

          {/* Hidden ReactHowler component for preloading next track */}
          {nextTrackUrl && (
            <ReactHowler
              src={nextTrackUrl}
              playing={false}
              ref={nextPlayerRef}
              volume={0}
              html5={true}
              preload={true}
              format={["mp3", "wav"]}
            />
          )}

          {/* Album artwork and track info - visible on all devices */}
          <div className="flex items-center gap-3 sm:gap-4 w-full justify-between sm:justify-start sm:w-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-mid/20 rounded-md overflow-hidden flex-shrink-0 shadow-md">
                {state.currentAlbum?.artwork && (
                  <LazyImage
                    src={state.currentAlbum.artwork}
                    alt={state.currentAlbum.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    lowQuality={true}
                  />
                )}
              </div>

              <div className="truncate">
                <h4 className="text-sm sm:text-base font-medium text-light truncate max-w-[150px] sm:max-w-[200px]">
                  {state.currentTrack.title}
                </h4>
                <p className="text-xs text-light/70 truncate max-w-[150px] sm:max-w-[200px]">
                  {state.currentAlbum?.title || "Unknown Album"}
                </p>
              </div>
            </div>

            {/* Mobile-only controls */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                onClick={() => handlePlayPause(!state.isPlaying)}
                className="p-2 rounded-full bg-primary hover:bg-primary/90 text-light transition-colors"
                aria-label={state.isPlaying ? "Pause" : "Play"}
              >
                {state.isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button
                onClick={handleClose}
                className="text-light/70 hover:text-light transition-colors p-2 hover:bg-light/10 rounded-full"
                aria-label="Close player"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Player controls - main section */}
          <div className="w-full sm:flex-1 max-w-3xl">
            {/* Progress bar */}
            <div
              className="w-full h-2 sm:h-3 bg-light/10 rounded-full my-2 cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                handleSeek(pos * trackDuration);
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{
                  width: `${trackDuration > 0 ? (currentPosition / trackDuration) * 100 : 0}%`,
                }}
              ></div>
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full shadow-sm"
                style={{
                  left: `calc(${trackDuration > 0 ? (currentPosition / trackDuration) * 100 : 0}% - 6px)`,
                }}
              ></div>
            </div>

            {/* Time and controls on desktop */}
            <div className="hidden sm:flex justify-between items-center mt-2">
              {/* Time display */}
              <div className="text-xs text-light/70 w-20">
                {formatTime(currentPosition)}
              </div>

              {/* Main controls */}
              <div className="flex items-center gap-6">
                {/* Previous button */}
                {state.queue.length > 1 && (
                  <button
                    onClick={handlePrevTrack}
                    disabled={!hasPrevTrack()}
                    className={`text-light/80 hover:text-primary transition-colors ${
                      !hasPrevTrack() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Previous track"
                  >
                    <SkipBack size={24} />
                  </button>
                )}

                {/* Play/Pause button */}
                <button
                  onClick={() => handlePlayPause(!state.isPlaying)}
                  className="p-3 rounded-full bg-primary hover:bg-primary/90 text-light transition-colors shadow-md"
                  aria-label={state.isPlaying ? "Pause" : "Play"}
                >
                  {state.isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>

                {/* Next button */}
                {state.queue.length > 1 && (
                  <button
                    onClick={handleNextTrack}
                    disabled={!hasNextTrack()}
                    className={`text-light/80 hover:text-primary transition-colors ${
                      !hasNextTrack() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Next track"
                  >
                    <SkipForward size={24} />
                  </button>
                )}
              </div>

              {/* Duration display */}
              <div className="text-xs text-light/70 w-20 text-right">
                {formatTime(trackDuration)}
              </div>
            </div>

            {/* Mobile time display and track controls */}
            <div className="flex sm:hidden justify-between items-center mt-1">
              <div className="text-[10px] text-light/60 w-16">
                {formatTime(currentPosition)}
              </div>

              <div className="flex items-center gap-3">
                {state.queue.length > 1 && (
                  <button
                    onClick={handlePrevTrack}
                    disabled={!hasPrevTrack()}
                    className={`p-1 ${!hasPrevTrack() ? "opacity-50" : "text-light/80"}`}
                    aria-label="Previous track"
                  >
                    <SkipBack size={16} />
                  </button>
                )}

                {state.queue.length > 1 && (
                  <button
                    onClick={handleNextTrack}
                    disabled={!hasNextTrack()}
                    className={`p-1 ${!hasNextTrack() ? "opacity-50" : "text-light/80"}`}
                    aria-label="Next track"
                  >
                    <SkipForward size={16} />
                  </button>
                )}
              </div>

              <div className="text-[10px] text-light/60 w-16 text-right">
                {formatTime(trackDuration)}
              </div>
            </div>
          </div>

          {/* Right side controls - only on desktop */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Volume control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newVolume = state.volume > 0 ? 0 : 0.7;
                  setVolume(newVolume);
                }}
                className="text-light/80 hover:text-primary transition-colors"
                aria-label={state.volume > 0 ? "Mute" : "Unmute"}
              >
                {state.volume === 0 ? (
                  <VolumeX size={18} />
                ) : state.volume > 0.5 ? (
                  <Volume2 size={18} />
                ) : (
                  <Volume1 size={18} />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 slider-thumb accent-primary"
              />
            </div>

            {/* Data saver toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDataSaverMode(!dataSaverMode)}
                className={`text-xs px-2 py-1 rounded-md ${
                  dataSaverMode
                    ? "bg-primary/20 text-primary"
                    : "bg-light/5 text-light/60 hover:text-light/80"
                } transition-colors`}
                aria-label={dataSaverMode ? "Data saver on" : "Data saver off"}
              >
                {dataSaverMode ? "Data Saver: ON" : "Data Saver: OFF"}
              </button>
            </div>

            {/* Queue position */}
            <span className="text-xs text-light/70 min-w-[60px] text-right">
              {trackPosition}
            </span>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="text-light/70 hover:text-light transition-colors rounded-full p-1 hover:bg-light/10"
              aria-label="Close player"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom styles for slider */}
      <style jsx global>{`
        .slider-thumb {
          appearance: none;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          outline: none;
        }

        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--primary, #e63946);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .slider-thumb::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: var(--primary, #e63946);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

// Helper function to format time in mm:ss
function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}
