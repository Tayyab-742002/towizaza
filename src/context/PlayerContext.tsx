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
  
  // Effect to handle playing/pausing
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      // Set the audio source when the track changes
      if (state.isPlaying) {
        // Add media metadata for browser media controls
        if ('mediaSession' in navigator) {
          const trackUrl = getTrackAudioUrl(state.currentTrack);
          const isVideo = isMP4File(trackUrl);
          
          navigator.mediaSession.metadata = new MediaMetadata({
            title: state.currentTrack.title,
            artist: 'Towizaza',
            album: state.currentAlbum?.title || "Unknown Album",
            artwork: state.currentAlbum?.artwork ? [
              { 
                src: typeof state.currentAlbum.artwork === 'string' 
                  ? state.currentAlbum.artwork 
                  : urlFor(state.currentAlbum.artwork).width(300).url(),
                sizes: '300x300',
                type: 'image/jpeg' 
              }
            ] : []
          });

          // Set action handlers
          navigator.mediaSession.setActionHandler('play', resume);
          navigator.mediaSession.setActionHandler('pause', pause);
          navigator.mediaSession.setActionHandler('nexttrack', nextTrack);
          navigator.mediaSession.setActionHandler('previoustrack', prevTrack);
        }

        // Double check src is set
        const currentSrc = audioRef.current.src;
        const expectedSrc = getTrackAudioUrl(state.currentTrack);
        
        if (currentSrc !== expectedSrc && expectedSrc) {
          audioRef.current.src = expectedSrc;
          // This will trigger the loadedmetadata event
        }

        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          dispatch({ type: 'PAUSE' });
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack]);
  
  // Effect to update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);
  
  // Update progress during playback
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) {
        dispatch({ type: 'SET_PROGRESS', payload: { progress: audio.currentTime } });
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audio) {
        dispatch({ type: 'SET_DURATION', payload: { duration: audio.duration } });
        console.log("Audio loaded with duration:", audio.duration);
      }
    };
    
    const handleDurationChange = () => {
      if (audio && !isNaN(audio.duration)) {
        dispatch({ type: 'SET_DURATION', payload: { duration: audio.duration } });
        console.log("Duration changed to:", audio.duration);
      }
    };
    
    const handleEnded = () => {
      dispatch({ type: 'NEXT_TRACK' });
    };
    
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      // If audio is already loaded, set the duration
      if (audio.readyState >= 1 && !isNaN(audio.duration)) {
        dispatch({ type: 'SET_DURATION', payload: { duration: audio.duration } });
      }
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [dispatch]);
  
  // Effect that watches for track changes to reset progress and duration
  useEffect(() => {
    if (state.currentTrack) {
      dispatch({ type: 'SET_PROGRESS', payload: { progress: 0 } });
      dispatch({ type: 'SET_DURATION', payload: { duration: 0 } });
    }
  }, [state.currentTrack, dispatch]);
  
  // Player actions
  const play = (track: Track, album?: Album) => {
    dispatch({ type: 'PLAY', payload: { track, album } });
    
    // If album is provided, set queue to album tracks
    if (album && album.tracks && album.tracks.length > 0) {
      dispatch({ type: 'SET_QUEUE', payload: { tracks: album.tracks } });
    }
  };
  
  const pause = () => {
    dispatch({ type: 'PAUSE' });
  };
  
  const resume = () => {
    dispatch({ type: 'RESUME' });
  };
  
  const seek = (progress: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = progress;
    }
    dispatch({ type: 'SET_PROGRESS', payload: { progress } });
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
      {/* Audio element for playback */}
      {state.currentTrack && (
        <>
          {isMP4File(getTrackAudioUrl(state.currentTrack)) ? (
            <video
              ref={audioRef as any}
              src={getTrackAudioUrl(state.currentTrack)}
              style={{ display: 'none' }}
              crossOrigin="anonymous"
              playsInline
              onError={(e) => {
                console.error('Error loading audio file:', e);
                // Optionally display an error notification or try next track
                if (state.queue.length > 1) {
                  console.log('Attempting to play next track due to error');
                  nextTrack();
                } else {
                  pause();
                }
              }}
            />
          ) : (
            <audio
              ref={audioRef}
              src={getTrackAudioUrl(state.currentTrack)}
              style={{ display: 'none' }}
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Error loading audio file:', e);
                // Optionally display an error notification or try next track
                if (state.queue.length > 1) {
                  console.log('Attempting to play next track due to error');
                  nextTrack();
                } else {
                  pause();
                }
              }}
            />
          )}
        </>
      )}
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