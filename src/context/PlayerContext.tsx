"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
  useEffect,
  useState,
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
  isLoading: boolean;
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
  | { type: "SAVE_PLAYBACK_TIME"; payload: { time: number } }
  | { type: "SET_LOADING"; payload: { isLoading: boolean } };

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
  isLoading: false,
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
        isVisible: true,
        isLoading: false,
      };

    case "PAUSE":
      return {
        ...state,
        isPlaying: false,
        isLoading: false,
      };

    case "RESUME":
      return {
        ...state,
        isPlaying: true,
        isVisible: true,
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

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload.isLoading,
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
        isPlaying: true,
        isVisible: true,
        isLoading: true,
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
          progress: 0,
        };
      }

      const prevIndex =
        (currentIndex - 1 + state.queue.length) % state.queue.length;
      const prevTrack = state.queue[prevIndex];

      return {
        ...state,
        currentTrack: prevTrack,
        progress: 0,
        isPlaying: true,
        isVisible: true,
        isLoading: true,
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

// Helper function to safely load player state from localStorage during initialization
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
  // Initialize state with saved values where available but only on the client
  const [savedStateLoaded, setSavedStateLoaded] = useState(false);
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerMounted = useRef<boolean>(false);
  // Add a ref to track the active audio element
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  // Add a ref to track the last track change timestamp
  const lastTrackChangeRef = useRef<number>(0);
  // Add a ref to prevent rapid track changes
  const isChangingTrackRef = useRef<boolean>(false);
  // Add a timeout ref for debouncing track changes
  const trackChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to safely stop and clean up any audio element
  const cleanupAudio = (audio: HTMLAudioElement | null) => {
    if (!audio) return;

    try {
      // First pause the audio
      audio.pause();

      // Reset it
      audio.currentTime = 0;

      // Remove the source to fully release resources
      if (audio.src) {
        audio.src = "";
        audio.load(); // Forces the release of resources
      }
    } catch (error) {
      console.error("Error cleaning up audio:", error);
    }
  };

  // Load saved state from localStorage only on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = getSavedState();
      if (Object.keys(savedState).length > 0) {
        // Update state with saved values
        if (savedState.currentTrack) {
          dispatch({
            type: "PLAY",
            payload: {
              track: savedState.currentTrack,
              album: savedState.currentAlbum || undefined,
            },
          });
          if (!savedState.isPlaying) {
            dispatch({ type: "PAUSE" });
          }
        }

        if (savedState.volume !== undefined) {
          dispatch({
            type: "SET_VOLUME",
            payload: { volume: savedState.volume },
          });
        }

        if (savedState.isVisible) {
          dispatch({ type: "SHOW_PLAYER" });
        }

        if (savedState.queue?.length) {
          dispatch({
            type: "SET_QUEUE",
            payload: { tracks: savedState.queue },
          });
        }
      }
      setSavedStateLoaded(true);
    }
  }, []);

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
      // Cleanup any existing audio instance
      if (
        activeAudioRef.current &&
        activeAudioRef.current !== audioRef.current
      ) {
        cleanupAudio(activeAudioRef.current);
      }

      // Update the active audio reference
      activeAudioRef.current = audioRef.current;

      // Set a timeout to automatically clear loading state if it persists too long
      const timeoutId = setTimeout(() => {
        if (state.isLoading) {
          console.log(
            "Loading timeout reached, forcing loading state to false"
          );
        }
      }, 3000);
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [state.currentTrack, state.isLoading]);

  // Clear loading state when isPlaying changes to false or when playback actually starts
  useEffect(() => {
    // If track is playing and still in loading state, clear the loading state
    if (
      state.isPlaying &&
      state.isLoading &&
      audioRef.current &&
      !audioRef.current.paused
    ) {
      console.log("Playback detected, clearing loading state");
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }

    // If explicitly paused, ensure loading state is cleared
    if (!state.isPlaying && state.isLoading) {
      console.log("Pause detected, clearing loading state");
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }
  }, [state.isPlaying, state.isLoading, audioRef.current?.paused]);

  // Clear loading state immediately whenever track changes
  useEffect(() => {
    if (state.currentTrack && state.isLoading) {
      // Force loading state to false immediately
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }
  }, [state.currentTrack]);

  // Player actions with debounce protection
  const play = (track: Track, album?: Album) => {
    const now = Date.now();

    // Don't interrupt current playback if trying to play the same track in the same album
    if (state.currentTrack && track && state.currentAlbum && album) {
      const isSameTrack =
        ((track.id &&
          state.currentTrack.id &&
          track.id === state.currentTrack.id) ||
          (track._key &&
            state.currentTrack._key &&
            track._key === state.currentTrack._key) ||
          (track.title === state.currentTrack.title &&
            getAudioUrl(track) === getAudioUrl(state.currentTrack))) &&
        // Also check if it's the same album
        ((album.id &&
          state.currentAlbum.id &&
          album.id === state.currentAlbum.id) ||
          (album._id &&
            state.currentAlbum._id &&
            album._id === state.currentAlbum._id) ||
          album.title === state.currentAlbum.title);

      if (isSameTrack) {
        // If the same track in the same album is already playing, just resume it
        if (!state.isPlaying) {
          console.log("Resuming same track:", track.title);
          dispatch({ type: "RESUME" });
        }
        return;
      }
    }

    // Prevent rapid track changes (debounce)
    if (isChangingTrackRef.current || now - lastTrackChangeRef.current < 100) {
      console.log("Debouncing rapid track change");
      return;
    }

    // Set changing flag
    isChangingTrackRef.current = true;
    lastTrackChangeRef.current = now;

    // Stop any currently playing audio before starting a new one
    if (activeAudioRef.current) {
      cleanupAudio(activeAudioRef.current);
    }

    console.log(
      "Play track:",
      track.title,
      "from album:",
      album?.title || "unknown"
    );
    dispatch({ type: "PLAY", payload: { track, album } });

    // Immediately clear loading state for responsive playback
    dispatch({ type: "SET_LOADING", payload: { isLoading: false } });

    // If album is provided, set queue to album tracks
    if (album && album.tracks && album.tracks.length > 0) {
      const playableTracks = album.tracks.filter((t) => !!getAudioUrl(t));
      dispatch({ type: "SET_QUEUE", payload: { tracks: playableTracks } });
    } else if (
      !state.queue.length ||
      !state.queue.some(
        (t) =>
          (t.id && track.id && t.id === track.id) ||
          (t._key && track._key && t._key === track._key)
      )
    ) {
      // If no album and track not in queue, add it as single track in queue
      dispatch({ type: "SET_QUEUE", payload: { tracks: [track] } });
    }

    // Clear changing flag after a shorter delay
    if (trackChangeTimeoutRef.current) {
      clearTimeout(trackChangeTimeoutRef.current);
    }

    trackChangeTimeoutRef.current = setTimeout(() => {
      isChangingTrackRef.current = false;
    }, 500); // Reduced timeout for faster response
  };

  const pause = () => {
    console.log("Pause");
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }
    dispatch({ type: "PAUSE" });
  };

  const resume = () => {
    console.log("Resume");
    // Only resume if we're not already changing tracks
    if (!isChangingTrackRef.current) {
      dispatch({ type: "RESUME" });
    }
  };

  const seek = (progress: number) => {
    console.log("Seek to:", progress);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = progress;
        dispatch({ type: "SET_PROGRESS", payload: { progress } });
      } catch (error) {
        console.error("Error seeking:", error);
      }
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
    // Don't allow next track if we're still loading or changing tracks
    if (isChangingTrackRef.current) {
      console.log("Ignoring nextTrack while changing tracks");
      return;
    }

    // Reset last playback time to ensure track starts from beginning
    dispatch({ type: "SAVE_PLAYBACK_TIME", payload: { time: 0 } });
    dispatch({ type: "NEXT_TRACK" });
  };

  const prevTrack = () => {
    // Don't allow prev track if we're still loading or changing tracks
    if (isChangingTrackRef.current) {
      console.log("Ignoring prevTrack while changing tracks");
      return;
    }

    // Reset last playback time to ensure track starts from beginning
    dispatch({ type: "SAVE_PLAYBACK_TIME", payload: { time: 0 } });
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
