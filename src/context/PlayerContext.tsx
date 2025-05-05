"use client";

import { createContext, useContext, useReducer, ReactNode, useRef, useEffect } from 'react';
import { Album, Track } from '@/data/music';
import { urlFor, getAudioUrl } from '@/lib/sanity';

interface PlayerState {
  currentTrack: Track | null;
  currentAlbum: Album | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isVisible: boolean;
  queue: Track[];
}

type PlayerAction =
  | { type: 'PLAY'; payload: { track: Track; album?: Album } }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_PROGRESS'; payload: { progress: number } }
  | { type: 'SET_DURATION'; payload: { duration: number } }
  | { type: 'SET_VOLUME'; payload: { volume: number } }
  | { type: 'TOGGLE_VISIBILITY' }
  | { type: 'SET_QUEUE'; payload: { tracks: Track[] } }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' };

interface PlayerContextType {
  state: PlayerState;
  play: (track: Track, album?: Album) => void;
  pause: () => void;
  resume: () => void;
  seek: (progress: number) => void;
  setVolume: (volume: number) => void;
  toggleVisibility: () => void;
  setQueue: (tracks: Track[]) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const initialState: PlayerState = {
  currentTrack: null,
  currentAlbum: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  isVisible: false,
  queue: []
};

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY':
      return {
        ...state,
        currentTrack: action.payload.track,
        currentAlbum: action.payload.album || null,
        isPlaying: true,
        progress: 0,
        isVisible: true
      };
    
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false
      };
    
    case 'RESUME':
      return {
        ...state,
        isPlaying: true
      };
    
    case 'SET_PROGRESS':
      return {
        ...state,
        progress: action.payload.progress
      };
    
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload.duration
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload.volume
      };
    
    case 'TOGGLE_VISIBILITY':
      return {
        ...state,
        isVisible: !state.isVisible
      };
    
    case 'SET_QUEUE':
      return {
        ...state,
        queue: action.payload.tracks
      };
    
    case 'NEXT_TRACK': {
      if (!state.currentTrack || state.queue.length === 0) return state;
      
      // Find current track by id or by reference comparison if id is missing
      const currentIndex = state.queue.findIndex(track => 
        (track.id && state.currentTrack?.id) 
          ? track.id === state.currentTrack.id
          : (track._key && state.currentTrack?._key)
            ? track._key === state.currentTrack._key
            : track === state.currentTrack
      );
      
      // If track not found in queue or it's the last track and we don't loop
      if (currentIndex === -1 || (currentIndex === state.queue.length - 1 && state.queue.length === 1)) {
        return state;
      }
      
      const nextIndex = (currentIndex + 1) % state.queue.length;
      const nextTrack = state.queue[nextIndex];
      
      return {
        ...state,
        currentTrack: nextTrack,
        progress: 0,
        isPlaying: true // Auto-play next track
      };
    }
    
    case 'PREV_TRACK': {
      if (!state.currentTrack || state.queue.length === 0) return state;
      
      // If we're more than 3 seconds in, just restart the current track
      if (state.progress > 3) {
        return {
          ...state,
          progress: 0
        };
      }
      
      // Find current track by id or by reference comparison if id is missing
      const currentIndex = state.queue.findIndex(track => 
        (track.id && state.currentTrack?.id) 
          ? track.id === state.currentTrack.id
          : (track._key && state.currentTrack?._key)
            ? track._key === state.currentTrack._key
            : track === state.currentTrack
      );
      
      // If track not found or it's the first track and we have only one track
      if (currentIndex === -1 || (currentIndex === 0 && state.queue.length === 1)) {
        return {
          ...state,
          progress: 0 // Just restart the current track
        };
      }
      
      const prevIndex = (currentIndex - 1 + state.queue.length) % state.queue.length;
      const prevTrack = state.queue[prevIndex];
      
      return {
        ...state,
        currentTrack: prevTrack,
        progress: 0,
        isPlaying: true // Auto-play previous track
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
  return url.toLowerCase().endsWith('.mp4') || url.includes('.r2.dev/') && !url.match(/\.(mp3|wav|ogg|webm)$/i);
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // This effect coordinates with the external audio player
  useEffect(() => {
    // When the currentTrack changes, make sure we reset our state appropriately
    if (state.currentTrack) {
      // The audio element from react-h5-audio-player will handle the actual audio
      // Our audioRef is just for tracking state now
      console.log("Track changed:", state.currentTrack.title);
    }
  }, [state.currentTrack]);
  
  // Player actions
  const play = (track: Track, album?: Album) => {
    console.log("Play track:", track.title);
    dispatch({ type: 'PLAY', payload: { track, album } });
    
    // If album is provided, set queue to album tracks
    if (album && album.tracks && album.tracks.length > 0) {
      const playableTracks = album.tracks.filter(t => !!getAudioUrl(t));
      dispatch({ type: 'SET_QUEUE', payload: { tracks: playableTracks } });
    }
  };
  
  const pause = () => {
    console.log("Pause");
    dispatch({ type: 'PAUSE' });
  };
  
  const resume = () => {
    console.log("Resume");
    dispatch({ type: 'RESUME' });
  };
  
  const seek = (progress: number) => {
    console.log("Seek to:", progress);
    if (audioRef.current) {
      audioRef.current.currentTime = progress;
      dispatch({ type: 'SET_PROGRESS', payload: { progress } });
    }
  };
  
  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: { volume } });
  };
  
  const toggleVisibility = () => {
    dispatch({ type: 'TOGGLE_VISIBILITY' });
  };
  
  const setQueue = (tracks: Track[]) => {
    dispatch({ type: 'SET_QUEUE', payload: { tracks } });
  };
  
  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };
  
  const prevTrack = () => {
    dispatch({ type: 'PREV_TRACK' });
  };
  
  const value = {
    state,
    play,
    pause,
    resume,
    seek,
    setVolume,
    toggleVisibility,
    setQueue,
    nextTrack,
    prevTrack,
    audioRef
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
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
} 