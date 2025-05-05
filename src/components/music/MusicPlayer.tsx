"use client";

import { useState, useEffect, useRef } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { urlFor } from "@/lib/sanity";

export default function MusicPlayer() {
  const { state, pause, resume, seek, nextTrack, prevTrack, setVolume } = usePlayer();
  const [expanded, setExpanded] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [localVolume, setLocalVolume] = useState(state.volume);
  
  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Use local values for display during dragging
  const displayProgress = isDraggingProgress ? localProgress : state.progress;
  const displayVolume = isDraggingVolume ? localVolume : state.volume;
  
  // Calculate progress percentage safely
  const getProgressPercentage = (): number => {
    if (!state.duration || state.duration <= 0 || isNaN(state.duration)) return 0;
    const percentage = (displayProgress / state.duration) * 100;
    return isNaN(percentage) ? 0 : percentage;
  };
  
  // Update local states when their counterparts change (if not dragging)
  useEffect(() => {
    if (!isDraggingProgress) {
      setLocalProgress(state.progress);
    }
    if (!isDraggingVolume) {
      setLocalVolume(state.volume);
    }
  }, [state.progress, state.volume, isDraggingProgress, isDraggingVolume]);
  
  // Helper function to get album artwork URL
  const getArtworkUrl = () => {
    if (!state.currentAlbum?.artwork) return '/images/placeholder-album.jpg';
    
    if (typeof state.currentAlbum.artwork === 'string') {
      return state.currentAlbum.artwork;
    }
    
    // If it's a Sanity image
    return urlFor(state.currentAlbum.artwork).url();
  };
  
  // Helper function to check if current track is an MP4 video
  const isVideoTrack = (): boolean => {
    if (!state.currentTrack) return false;
    
    // Check if the URL contains .r2.dev/ and does not end with a common audio extension
    // or explicitly ends with .mp4
    const audioUrl = state.currentTrack.externalUrl || 
                    (typeof state.currentTrack.previewUrl === 'string' ? 
                     state.currentTrack.previewUrl : '');
                     
    return audioUrl.toLowerCase().endsWith('.mp4') || 
           (audioUrl.includes('.r2.dev/') && 
            !audioUrl.match(/\.(mp3|wav|ogg|webm)$/i));
  };
  
  // Handle clicks and drags on the progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newProgress = percentage * state.duration;
    
    setLocalProgress(newProgress);
    seek(newProgress);
  };
  
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDraggingProgress(true);
    handleProgressMove(e);
    
    // Add window event listeners for drag and release
    window.addEventListener('mousemove', handleProgressMove);
    window.addEventListener('mouseup', handleProgressMouseUp);
    
    // Prevent text selection during drag
    e.preventDefault();
  };
  
  const handleProgressMove = (e: MouseEvent | React.MouseEvent) => {
    if (!progressBarRef.current || !isDraggingProgress) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, position / rect.width));
    const newProgress = percentage * state.duration;
    
    setLocalProgress(newProgress);
  };
  
  const handleProgressMouseUp = (e: MouseEvent) => {
    if (isDraggingProgress) {
      setIsDraggingProgress(false);
      
      // Apply the seek
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const position = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, position / rect.width));
        const newProgress = percentage * state.duration;
        
        seek(newProgress);
      }
      
      // Remove window event listeners
      window.removeEventListener('mousemove', handleProgressMove);
      window.removeEventListener('mouseup', handleProgressMouseUp);
    }
  };
  
  // Handle touches on progress bar for mobile
  const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const touchPosition = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, touchPosition / rect.width));
    const newProgress = percentage * state.duration;
    
    setLocalProgress(newProgress);
    seek(newProgress);
  };

  // Handle clicks on the volume bar
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    // Ensure volume is between 0 and 1
    const newVolume = Math.max(0, Math.min(1, percentage));
    
    setLocalVolume(newVolume);
    setVolume(newVolume);
  };
  
  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDraggingVolume(true);
    handleVolumeMove(e);
    
    // Add window event listeners for drag and release
    window.addEventListener('mousemove', handleVolumeMove);
    window.addEventListener('mouseup', handleVolumeMouseUp);
    
    // Prevent text selection during drag
    e.preventDefault();
  };
  
  const handleVolumeMove = (e: MouseEvent | React.MouseEvent) => {
    if (!volumeBarRef.current || !isDraggingVolume) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, position / rect.width));
    
    setLocalVolume(percentage);
  };
  
  const handleVolumeMouseUp = (e: MouseEvent) => {
    if (isDraggingVolume) {
      setIsDraggingVolume(false);
      
      // Apply the volume
      if (volumeBarRef.current) {
        const rect = volumeBarRef.current.getBoundingClientRect();
        const position = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, position / rect.width));
        
        setVolume(percentage);
      }
      
      // Remove window event listeners
      window.removeEventListener('mousemove', handleVolumeMove);
      window.removeEventListener('mouseup', handleVolumeMouseUp);
    }
  };
  
  // Handle touches on volume bar for mobile
  const handleVolumeTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    const touchPosition = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, touchPosition / rect.width));
    
    setLocalVolume(percentage);
    setVolume(percentage);
  };
  
  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleProgressMove);
      window.removeEventListener('mouseup', handleProgressMouseUp);
      window.removeEventListener('mousemove', handleVolumeMove);
      window.removeEventListener('mouseup', handleVolumeMouseUp);
    };
  }, []);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else {
      resume();
    }
  };
  
  // Effect to hide player if no track selected
  useEffect(() => {
    if (!state.currentTrack) {
      setExpanded(false);
    }
  }, [state.currentTrack]);
  
  // If no current track, don't render player
  if (!state.currentTrack) return null;
  
  // Expanded view content
  if (expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-dark/90 backdrop-blur-md border-t border-light/10 transition-all duration-300 z-40 h-60 sm:h-80">
        <div className="container mx-auto px-6 h-full">
          {/* Collapsed view controls (still show when expanded) */}
          <div className="flex items-center gap-4 h-16 sm:h-20">
            {/* Album artwork */}
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-mid/20 rounded-md overflow-hidden flex-shrink-0"
              onClick={() => setExpanded(!expanded)}
            >
              {state.currentAlbum?.artwork && (
                <img 
                  src={getArtworkUrl()} 
                  alt={state.currentAlbum.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* Track info */}
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="truncate">
                  <h4 className="text-sm font-medium text-light truncate">{state.currentTrack.title}</h4>
                  <p className="text-xs text-light/70 truncate">{state.currentAlbum?.title || "Unknown Album"}</p>
                </div>
                
                {/* Controls for mobile */}
                <div className="flex items-center gap-3 sm:hidden">
                  <button 
                    className="text-light/70 hover:text-light transition-colors"
                    onClick={prevTrack}
                    aria-label="Previous track"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                    onClick={togglePlayPause}
                    aria-label={state.isPlaying ? "Pause" : "Play"}
                  >
                    {state.isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button 
                    className="text-light/70 hover:text-light transition-colors"
                    onClick={nextTrack}
                    aria-label="Next track"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Controls for desktop */}
                <div className="hidden sm:flex items-center gap-4">
                  <button 
                    className="text-light/70 hover:text-light transition-colors"
                    onClick={prevTrack}
                    aria-label="Previous track"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                    onClick={togglePlayPause}
                    aria-label={state.isPlaying ? "Pause" : "Play"}
                  >
                    {state.isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button 
                    className="text-light/70 hover:text-light transition-colors"
                    onClick={nextTrack}
                    aria-label="Next track"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Progress bar */}
              <div 
                className="relative h-2 bg-light/10 rounded-full overflow-hidden cursor-pointer" 
                ref={progressBarRef}
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
                onTouchMove={handleProgressTouch}
                onTouchStart={() => setIsDraggingProgress(true)}
                onTouchEnd={() => setIsDraggingProgress(false)}
              >
                <div 
                  className="absolute h-full bg-primary rounded-full" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
                <div 
                  className="absolute h-4 w-4 bg-primary rounded-full shadow-md -mt-1 -ml-2 cursor-grab"
                  style={{ 
                    left: `${getProgressPercentage()}%`,
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                ></div>
              </div>
              
              {/* Time display */}
              <div className="flex justify-between text-xs text-light/70 mt-1">
                <span>{formatTime(displayProgress)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
            </div>
            
            {/* Expand button */}
            <button 
              className="text-light/70 hover:text-light ml-2"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Collapse player" : "Expand player"}
            >
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="pt-4 pb-6 h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Album artwork (large) */}
              <div className="flex items-center justify-center">
                <div className="aspect-square w-full max-w-xs bg-mid/20 rounded-lg overflow-hidden shadow-lg">
                  {state.currentAlbum?.artwork && (
                    <img 
                      src={getArtworkUrl()} 
                      alt={state.currentAlbum.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              
              {/* Track info, volume and queue */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-light">{state.currentTrack?.title}</h3>
                  <p className="text-light/70">{state.currentAlbum?.title || "Unknown Album"}</p>
                </div>
                
                {/* Volume control */}
                <div className="mb-4">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    
                    <div 
                      className="relative h-2 bg-light/10 rounded-full overflow-hidden cursor-pointer flex-grow"
                      ref={volumeBarRef}
                      onClick={handleVolumeClick}
                      onMouseDown={handleVolumeMouseDown}
                      onTouchMove={handleVolumeTouch}
                      onTouchStart={() => setIsDraggingVolume(true)}
                      onTouchEnd={() => setIsDraggingVolume(false)}
                    >
                      <div 
                        className="absolute h-full bg-accent rounded-full" 
                        style={{ width: `${displayVolume * 100}%` }}
                      ></div>
                      <div 
                        className="absolute h-4 w-4 bg-accent rounded-full shadow-md -mt-1 -ml-2 cursor-grab"
                        style={{ 
                          left: `${displayVolume * 100}%`,
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      ></div>
                    </div>
                    
                    <span className="text-xs text-light/70">{Math.round(displayVolume * 100)}%</span>
                  </div>
                </div>
                
                {/* Queue */}
                <div className="flex-grow overflow-y-auto mt-2">
                  <h4 className="text-sm font-medium text-light/80 mb-2">Up Next</h4>
                  <div className="space-y-2">
                    {state.queue.map((track, index) => (
                      <div 
                        key={track.id || track._key}
                        className={`flex items-center p-2 rounded-md ${
                          state.currentTrack?.id === track.id ? "bg-primary/20" : "hover:bg-light/5"
                        }`}
                      >
                        <span className="w-6 text-center text-light/50 text-sm">{index + 1}</span>
                        <div className="ml-2">
                          <p className={`text-sm ${state.currentTrack?.id === track.id ? "text-primary font-medium" : "text-light"}`}>
                            {track.title}
                          </p>
                          <p className="text-xs text-light/60">{track.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Collapsed view (Default)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark/90 backdrop-blur-md border-t border-light/10 transition-all duration-300 z-40 h-16 sm:h-20">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center gap-4 h-full">
          {/* Album artwork */}
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 bg-mid/20 rounded-md overflow-hidden flex-shrink-0"
            onClick={() => setExpanded(true)}
          >
            {state.currentAlbum?.artwork && (
              <img 
                src={getArtworkUrl()} 
                alt={state.currentAlbum.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Track info */}
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
              <div className="truncate">
                <h4 className="text-sm font-medium text-light truncate">{state.currentTrack.title}</h4>
                <p className="text-xs text-light/70 truncate">{state.currentAlbum?.title || "Unknown Album"}</p>
              </div>
              
              {/* Controls for mobile */}
              <div className="flex items-center gap-3 sm:hidden">
                <button 
                  className="text-light/70 hover:text-light transition-colors"
                  onClick={prevTrack}
                  aria-label="Previous track"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  onClick={togglePlayPause}
                  aria-label={state.isPlaying ? "Pause" : "Play"}
                >
                  {state.isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
                <button 
                  className="text-light/70 hover:text-light transition-colors"
                  onClick={nextTrack}
                  aria-label="Next track"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Controls for desktop */}
              <div className="hidden sm:flex items-center gap-4">
                <button 
                  className="text-light/70 hover:text-light transition-colors"
                  onClick={prevTrack}
                  aria-label="Previous track"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                  onClick={togglePlayPause}
                  aria-label={state.isPlaying ? "Pause" : "Play"}
                >
                  {state.isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
                <button 
                  className="text-light/70 hover:text-light transition-colors"
                  onClick={nextTrack}
                  aria-label="Next track"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div 
              className="relative h-2 bg-light/10 rounded-full overflow-hidden cursor-pointer" 
              ref={progressBarRef}
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
              onTouchMove={handleProgressTouch}
              onTouchStart={() => setIsDraggingProgress(true)}
              onTouchEnd={() => setIsDraggingProgress(false)}
            >
              <div 
                className="absolute h-full bg-primary rounded-full" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
              <div 
                className="absolute h-4 w-4 bg-primary rounded-full shadow-md -mt-1 -ml-2 cursor-grab"
                style={{ 
                  left: `${getProgressPercentage()}%`,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              ></div>
            </div>
            
            {/* Time display */}
            <div className="flex justify-between text-xs text-light/70 mt-1">
              <span>{formatTime(displayProgress)}</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>
          
          {/* Expand button */}
          <button 
            className="text-light/70 hover:text-light ml-2"
            onClick={() => setExpanded(true)}
            aria-label="Expand player"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 