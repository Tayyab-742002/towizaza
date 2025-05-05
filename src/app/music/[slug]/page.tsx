'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getMusicBySlug } from '@/lib/sanity';
import { fallbackMusic } from '@/lib/fallbackData';
import { urlFor, getAudioUrl } from '@/lib/sanity';
import { usePlayer } from '@/context/PlayerContext';
import { Loading } from '@/components/common/Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Client component for music player functionality
export default function AlbumDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { play, pause, resume, state, setQueue } = usePlayer();
  
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tracks');

  // Intersection observers for animations
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    async function fetchAlbum() {
      try {
        setLoading(true);
        const data = await getMusicBySlug(slug);
        
        if (data) {
          setAlbum(data);
        } else {
          // If no Sanity data, try to find from fallback
          const fallbackAlbum = fallbackMusic.find(a => 
            a.id === slug || 
            (a.slug && a.slug.current === slug)
          );
          
          if (fallbackAlbum) {
            setAlbum(fallbackAlbum);
          } else {
            setError('Album not found');
          }
        }
      } catch (err) {
        console.error('Error fetching album:', err);
        setError('Failed to load album');
        
        // Try fallback data
        const fallbackAlbum = fallbackMusic.find(a => 
          a.id === slug || 
          (a.slug && a.slug.current === slug)
        );
        
        if (fallbackAlbum) {
          setAlbum(fallbackAlbum);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchAlbum();
  }, [slug]);

  // Check if this album is currently playing
  const isCurrentAlbum = (): boolean => {
    if (!state.currentAlbum || !album) return false;
    
    return (
      // Check ID match
      (state.currentAlbum.id && album.id && state.currentAlbum.id === album.id) ||
      // Check slug match
      (state.currentAlbum.slug && album.slug && state.currentAlbum.slug.current === album.slug.current) ||
      // Check title match as fallback
      (state.currentAlbum.title === album.title && state.currentAlbum.type === album.type)
    );
  };
  
  // Check if a specific track is playing
  const isCurrentTrack = (track: any): boolean => {
    if (!state.currentTrack || !track) return false;
    
    return (
      (track.id && state.currentTrack.id && track.id === state.currentTrack.id) ||
      (track._key && state.currentTrack._key && track._key === state.currentTrack._key) ||
      (track.title === state.currentTrack.title)
    );
  };

  if (loading) {
    return (
      <Loading message={`Loading Data`}/>
    );
  }

  if (error && !album) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">{error}</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold text-primary">Album not found</div>
      </div>
    );
  }

  // Helper function to get album artwork URL
  const getArtworkUrl = () => {
    if (!album.artwork) return '/images/placeholder-album.jpg';
    
    if (typeof album.artwork === 'string') {
      return album.artwork;
    }
    
    // If it's a Sanity image
    return urlFor(album.artwork).url();
  };

  // Check if album has playable tracks
  const hasPlayableTracks = album.tracks.some((track: any) => !!getAudioUrl(track));
  
  // Get the first playable track
  const getFirstPlayableTrack = () => {
    return album.tracks.find((track: any) => !!getAudioUrl(track));
  };
  
  // Handle play/pause for the album
  const handlePlayAlbum = () => {
    const firstPlayableTrack = getFirstPlayableTrack();
    if (!firstPlayableTrack) return;
    
    // Toggle play/pause if this is the current album
    if (isCurrentAlbum()) {
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Play the first track of this album and set queue
      play(firstPlayableTrack, album);
      // Only add tracks that have audio URLs to the queue
      const playableTracks = album.tracks.filter((track: any) => !!getAudioUrl(track));
      setQueue(playableTracks);
    }
  };
  
  // Handle track selection
  const handleTrackSelect = (track: any) => {
    if (!getAudioUrl(track)) return;
    
    if (isCurrentTrack(track)) {
      // Toggle play/pause if this is the current track
      if (state.isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // Play this track and set the album queue
      play(track, album);
      const playableTracks = album.tracks.filter((t: any) => !!getAudioUrl(t));
      setQueue(playableTracks);
    }
  };

  const formatAlbumType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'album': return 'Album';
      case 'ep': return 'EP';
      case 'single': return 'Single';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-10 relative z-10">
        <motion.div 
          className="flex items-center text-light/60 text-sm mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="hover:text-light transition-colors hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/music" className="hover:text-light transition-colors hover:underline">
            Music
          </Link>
          <span className="mx-2">/</span>
          <span className="text-light">{album?.title || 'Album'}</span>
        </motion.div>
      </div>
      
      {/* Hero header with album artwork background */}
      <motion.section 
        ref={headerRef}
        className="relative min-h-[50vh] flex items-end pb-12 pt-16 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background image with blur effect */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={getArtworkUrl()}
            alt={album.title}
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/30"></div>
          <div className="absolute inset-0 backdrop-blur-2xl"></div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/5 w-96 h-96 rounded-full bg-accent/10 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Album cover */}
            <motion.div 
              className="w-56 aspect-square shrink-0 rounded-lg overflow-hidden shadow-xl relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image 
                src={getArtworkUrl()}
                alt={album.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Play button overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                onClick={handlePlayAlbum}
              >
                <motion.button 
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-light shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCurrentAlbum() && state.isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  )}
                </motion.button>
              </div>
              
              {/* "Now Playing" indicator */}
              {isCurrentAlbum() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-light text-xs font-bold py-1 px-3 rounded-full shadow-lg"
                >
                  {state.isPlaying ? 'Now Playing' : 'Paused'}
                </motion.div>
              )}
            </motion.div>
            
            {/* Album info */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="inline-block mb-2 px-3 py-1 bg-dark/50 backdrop-blur-md border border-light/10 rounded-full text-xs font-medium text-light/80">
                {formatAlbumType(album.type)} • {album.year || 'Unknown Year'}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80">
                {album.title}
              </h1>
              
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full my-4"></div>
              
              {album.description && (
                <p className="text-light/80 max-w-2xl mb-6">
                  {album.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 mt-6">
                <motion.button 
                  onClick={handlePlayAlbum}
                  className={`px-6 py-3 bg-gradient-to-r from-primary to-accent text-light font-medium rounded-full transition-all transform hover:shadow-lg ${
                    hasPlayableTracks 
                      ? 'hover:scale-105' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={hasPlayableTracks ? { scale: 1.05 } : {}}
                  whileTap={hasPlayableTracks ? { scale: 0.95 } : {}}
                  disabled={!hasPlayableTracks}
                >
                  <span className="flex items-center gap-2">
                    {isCurrentAlbum() && state.isPlaying ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                        </svg>
                        Pause
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                        Play Album
                      </>
                    )}
                  </span>
                </motion.button>
                
                {album.downloadUrl && (
                  <motion.a 
                    href={album.downloadUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-dark/70 hover:bg-dark/50 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/30 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    Download
                  </motion.a>
                )}
                
                {album.buyUrl && (
                  <motion.a 
                    href={album.buyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-dark/70 hover:bg-dark/50 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/30 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                    </svg>
                    Buy Now
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Content tabs and tracks */}
      <motion.section 
        ref={contentRef}
        className="py-12"
        initial={{ opacity: 0 }}
        animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-light/10 mb-8">
            <button 
              onClick={() => setActiveTab('tracks')}
              className={`px-4 py-2 font-medium text-sm transition-all relative ${
                activeTab === 'tracks' 
                  ? 'text-light' 
                  : 'text-light/60 hover:text-light/80'
              }`}
            >
              Tracklist
              {activeTab === 'tracks' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  layoutId="activeTabIndicator"
                />
              )}
            </button>
            
            {album.lyrics && album.lyrics.length > 0 && (
              <button 
                onClick={() => setActiveTab('lyrics')}
                className={`px-4 py-2 font-medium text-sm transition-all relative ${
                  activeTab === 'lyrics' 
                    ? 'text-light' 
                    : 'text-light/60 hover:text-light/80'
                }`}
              >
                Lyrics
                {activeTab === 'lyrics' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                    layoutId="activeTabIndicator"
                  />
                )}
              </button>
            )}
            
            {album.credits && (
              <button 
                onClick={() => setActiveTab('credits')}
                className={`px-4 py-2 font-medium text-sm transition-all relative ${
                  activeTab === 'credits' 
                    ? 'text-light' 
                    : 'text-light/60 hover:text-light/80'
                }`}
              >
                Credits
                {activeTab === 'credits' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                    layoutId="activeTabIndicator"
                  />
                )}
              </button>
            )}
          </div>
          
          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'tracks' && (
              <motion.div 
                key="tracks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl"
              >
                <div className="space-y-2">
                  {album.tracks.map((track: any, index: number) => {
                    const hasAudio = !!getAudioUrl(track);
                    const isPlaying = isCurrentTrack(track) && state.isPlaying;
                    
                    return (
                      <motion.div 
                        key={track._key || track.id || index}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          isCurrentTrack(track) 
                            ? 'bg-dark/70 backdrop-blur-md border border-light/10' 
                            : 'hover:bg-dark/40 hover:backdrop-blur-sm'
                        } transition-all group ${hasAudio ? 'cursor-pointer' : 'opacity-60'}`}
                        onClick={() => hasAudio && handleTrackSelect(track)}
                        whileHover={hasAudio ? { scale: 1.01 } : {}}
                      >
                        {/* Track number or play indicator */}
                        <div className="w-10 h-10 shrink-0 rounded-full bg-dark/40 border border-light/5 flex items-center justify-center">
                          {isCurrentTrack(track) ? (
                            <div className={`${isPlaying ? 'animate-pulse' : ''}`}>
                              {isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                  <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                                  <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                  <path d="M17.5 4.75c0-1.657-1.343-3-3-3S11.5 3.093 11.5 4.75v14.5c0 1.657 1.343 3 3 3s3-1.343 3-3V4.75zM6.5 4.75c0-1.657-1.343-3-3-3S.5 3.093.5 4.75v14.5c0 1.657 1.343 3 3 3s3-1.343 3-3V4.75z" />
                                </svg>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-light/70 font-medium group-hover:opacity-0">
                              {index + 1}
                            </span>
                          )}
                          
                          {/* Play button on hover */}
                          {hasAudio && !isCurrentTrack(track) && (
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* Track info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{track.title}</h3>
                          {track.featuring && (
                            <p className="text-sm text-light/60">feat. {track.featuring}</p>
                          )}
                        </div>
                        
                        {/* Track duration */}
                        {track.duration && (
                          <div className="text-sm text-light/60">{track.duration}</div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'lyrics' && album.lyrics && album.lyrics.length > 0 && (
              <motion.div 
                key="lyrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl"
              >
                <div className="space-y-8">
                  {album.lyrics.map((lyric: any, index: number) => (
                    <div key={index}>
                      <h3 className="text-xl font-bold mb-4">{lyric.songTitle}</h3>
                      <div className="whitespace-pre-line text-light/80 leading-relaxed">
                        {lyric.text}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'credits' && album.credits && (
              <motion.div 
                key="credits"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl"
              >
                <div className="text-light/80 leading-relaxed whitespace-pre-line">
                  {album.credits}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
} 