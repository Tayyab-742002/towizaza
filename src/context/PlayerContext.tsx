"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { Album, Track } from "@/data/music";
import { urlFor, getAudioUrl } from "@/lib/sanity";

interface PlayerState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isVisible: boolean;
  queue: Track[];
  lastPlaybackTime: number;
}

type PlayerAction =
  | { type: "PLAY"; payload: { track: Track; album?: Album } }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "SET_PROGRESS"; payload: { progress: number } }
  | { type: "SET_DURATION"; payload: { duration: number } }
  | { type: "SET_VOLUME"; payload: { volume: number } }
  | { type: "TOGGLE_VISIBILITY" }
  | { type: "HIDE_PLAYER" }
  | { type: "SHOW_PLAYER" }
  | { type: "SET_QUEUE"; payload: { tracks: Track[] } }
  | { type: "NEXT_TRACK" }
  | { type: "PREV_TRACK" }
  | { type: "SAVE_PLAYBACK_TIME"; payload: { time: number } };

interface PlayerContextType {
  state: PlayerState;
  play: (track: Track, album?: Album) => void;
  pause: () => void;
  resume: () => void;
  seek: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleVisibility: () => void;
  hidePlayer: () => void;
  showPlayer: () => void;
  setQueue: (tracks: Track[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

// Initialize with default values
const initialState: PlayerState = {
  currentTrack: null,
  currentAlbum: null,
  isPlaying: false,
  volume: typeof window !== "undefined" ? getVolumeSettings() : 0.7,
  progress: 0,
  duration: 0,
  isVisible: false,
  queue: [],
  lastPlaybackTime: 0,
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PLAY":
      return {
        ...state,
        currentTrack: action.payload.track,
        currentAlbum: action.payload.album || null,
        isPlaying: true,
        progress: 0,
        isVisible: true, // Always show player when playing a track
      };

    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
      };

    case "RESUME":
      return {
        ...state,
        isPlaying: true,
        isVisible: true, // Ensure player is visible when resuming
      };

    case "SET_PROGRESS":
      return {
        ...state,
        progress: action.payload.progress,
      };

    case "SET_DURATION":
      return {
        ...state,
        duration: action.payload.duration,
      };

    case "SET_VOLUME":
      return {
        ...state,
        volume: action.payload.volume,
      };

    case "TOGGLE_VISIBILITY":
      return {
        ...state,
        isVisible: !state.isVisible,
      };

    case "HIDE_PLAYER":
      return {
        ...state,
        isVisible: false,
      };

    case "SHOW_PLAYER":
      return {
        ...state,
        isVisible: true,
      };

    case "SET_QUEUE":
      return {
        ...state,
        queue: action.payload.tracks,
      };

    case "SAVE_PLAYBACK_TIME":
      return {
        ...state,
        lastPlaybackTime: action.payload.time,
      };

    case "NEXT_TRACK": {
      if (!state.currentTrack || state.queue.length === 0) return state;

      // Find current track by id or by reference comparison if id is missing
      const currentIndex = state.queue.findIndex((track) =>
        track.id && state.currentTrack?.id
          ? track.id === state.currentTrack.id
          : track._key && state.currentTrack?._key
            ? track._key === state.currentTrack._key
            : track === state.currentTrack
      );

      // If track not found in queue or it's the last track and we don't loop
      if (
        currentIndex === -1 ||
        (currentIndex === state.queue.length - 1 && state.queue.length === 1)
      ) {
        return state;
      }

      const nextIndex = (currentIndex + 1) % state.queue.length;
      const nextTrack = state.queue[nextIndex];

      return {
        ...state,
        currentTrack: nextTrack,
        progress: 0,
        isPlaying: true, // Auto-play next track
        isVisible: true, // Ensure player is visible
      };
    }

    case "PREV_TRACK": {
      if (!state.currentTrack || state.queue.length === 0) return state;

      // If we're more than 3 seconds in, just restart the current track
      if (state.progress > 3) {
        return {
          ...state,
          progress: 0,
        };
      }

      // Find current track by id or by reference comparison if id is missing
      const currentIndex = state.queue.findIndex((track) =>
        track.id && state.currentTrack?.id
          ? track.id === state.currentTrack.id
          : track._key && state.currentTrack?._key
            ? track._key === state.currentTrack._key
            : track === state.currentTrack
      );

      // If track not found or it's the first track and we have only one track
      if (
        currentIndex === -1 ||
        (currentIndex === 0 && state.queue.length === 1)
      ) {
        return {
          ...state,
          progress: 0, // Just restart the current track
        };
      }

      const prevIndex =
        (currentIndex - 1 + state.queue.length) % state.queue.length;
      const prevTrack = state.queue[prevIndex];

      return {
        ...state,
        currentTrack: prevTrack,
        progress: 0,
        isPlaying: true, // Auto-play previous track
        isVisible: true, // Ensure player is visible
      };
    }

    default:
      return state;
  }
}

// Helper function to get the audio URL from a track
function getTrackAudioUrl(track: Track): string {
  return getAudioUrl(track);
}

// Helper function to check if a URL is an MP4 file
function isMP4File(url: string): boolean {
  return (
    url.toLowerCase().endsWith(".mp4") ||
    (url.includes(".r2.dev/") && !url.match(/\.(mp3|wav|ogg|webm)$/i))
  );
}

// Helper function to save volume settings
const saveVolumeSettings = (volume: number) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("playerVolume", volume.toString());
    } catch (error) {
      console.error("Error saving volume settings:", error);
    }
  }
};

// Helper function to load volume settings
function getVolumeSettings(): number {
  if (typeof window === "undefined") return 0.7; // Default volume

  try {
    const savedVolume = localStorage.getItem("playerVolume");
    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      return volume >= 0 && volume <= 1 ? volume : 0.7;
    }
  } catch (error) {
    console.error("Error loading volume settings:", error);
  }

  return 0.7; // Default volume if not saved or error
}

// Try to load player state from localStorage during initialization
function getSavedState(): Partial<PlayerState> {
  if (typeof window === "undefined") return {};

  try {
    const savedState = localStorage.getItem("playerState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading player state from localStorage:", error);
  }

  return {};
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  // Initialize state with saved values where available
  const savedState = typeof window !== "undefined" ? getSavedState() : {};
  const [state, dispatch] = useReducer(playerReducer, {
    ...initialState,
    ...savedState,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerMounted = useRef<boolean>(false);

  // Effect to handle browser navigation events (back/forward buttons)
  useEffect(() => {
    const handleRouteChange = () => {
      // Save current state before navigation
      if (state.currentTrack && state.isPlaying) {
        console.log("Route change detected, preserving player state");

        // Force player to remain visible during navigation
        if (!state.isVisible) {
          dispatch({ type: "SHOW_PLAYER" });
        }
      }
    };

    // Listen for navigation events in the Next.js app
    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
    };
  }, [state.currentTrack, state.isPlaying, state.isVisible]);

  // Handle player mount/unmount
  useEffect(() => {
    playerMounted.current = true;

    // On first mount, restore playing state if needed
    if (
      state.currentTrack &&
      state.isPlaying &&
      typeof window !== "undefined"
    ) {
      console.log("Player mounted, restoring playback state");
    }

    return () => {
      // Before unmount, save current playback time
      if (audioRef.current && state.currentTrack) {
        dispatch({
          type: "SAVE_PLAYBACK_TIME",
          payload: { time: audioRef.current.currentTime },
        });
      }
      playerMounted.current = false;
    };
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Only save essential state
        const stateToSave = {
          currentTrack: state.currentTrack,
          currentAlbum: state.currentAlbum,
          isPlaying: state.isPlaying,
          volume: state.volume,
          isVisible: state.isVisible,
          queue: state.queue,
          lastPlaybackTime: state.lastPlaybackTime,
        };
        localStorage.setItem("playerState", JSON.stringify(stateToSave));
      } catch (error) {
        console.error("Error saving player state to localStorage:", error);
      }
    }
  }, [state]);

  // This effect coordinates with the external audio player
  useEffect(() => {
    // When the currentTrack changes, make sure we reset our state appropriately
    if (state.currentTrack) {
      // Use setTimeout to ensure console.log doesn't happen during render
      // This prevents console logging during the render cycle
      setTimeout(() => {
        // The audio element from react-h5-audio-player will handle the actual audio
        // Our audioRef is just for tracking state now
        console.log("Track changed:", state.currentTrack.title);
      }, 0);
    }
  }, [state.currentTrack]);

  // Player actions
  const play = (track: Track, album?: Album) => {
    console.log("Play track:", track.title);
    dispatch({ type: "PLAY", payload: { track, album } });

    // If album is provided, set queue to album tracks
    if (album && album.tracks && album.tracks.length > 0) {
      const playableTracks = album.tracks.filter((t) => !!getAudioUrl(t));
      dispatch({ type: "SET_QUEUE", payload: { tracks: playableTracks } });
    }
  };

  const pause = () => {
    console.log("Pause");
    dispatch({ type: "PAUSE" });
  };

  const resume = () => {
    console.log("Resume");
    dispatch({ type: "RESUME" });
  };

  const seek = (progress: number) => {
    console.log("Seek to:", progress);
    if (audioRef.current) {
      audioRef.current.currentTime = progress;
      dispatch({ type: "SET_PROGRESS", payload: { progress } });
    }
  };

  const setVolume = (volume: number) => {
    // Save volume setting immediately for persistence
    saveVolumeSettings(volume);
    dispatch({ type: "SET_VOLUME", payload: { volume } });
  };

  const toggleVisibility = () => {
    dispatch({ type: "TOGGLE_VISIBILITY" });
  };

  const hidePlayer = () => {
    dispatch({ type: "HIDE_PLAYER" });
  };

  const showPlayer = () => {
    dispatch({ type: "SHOW_PLAYER" });
  };

  const setQueue = (tracks: Track[]) => {
    dispatch({ type: "SET_QUEUE", payload: { tracks } });
  };

  const nextTrack = () => {
    dispatch({ type: "NEXT_TRACK" });
  };

  const prevTrack = () => {
    dispatch({ type: "PREV_TRACK" });
  };

  const value = {
    state,
    play,
    pause,
    resume,
    seek,
    setVolume,
    toggleVisibility,
    hidePlayer,
    showPlayer,
    setQueue,
    nextTrack,
    prevTrack,
    audioRef,
  };

  return (
    <PlayerContext.Provider value={value}>
      {/* Audio element is now handled by the react-h5-audio-player component */}
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
