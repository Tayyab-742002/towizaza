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
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MusicDetailStyles from '@/components/music/MusicDetailStyles';

// Create a CSS animation for slow pulsing
const pulseStyles = `
  @keyframes pulse-slow {
    0% { opacity: 0.5; }
    50% { opacity: 0.8; }
    100% { opacity: 0.5; }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 4s infinite ease-in-out;
  }
`;

// Client component for music player functionality
export default function AlbumDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { play, pause, resume, state, setQueue } = usePlayer();
  
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('tracks');

  // Scroll animations
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.2]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95]);

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
      <div className="min-h-screen bg-dark text-light flex flex-col items-center justify-center">
        <MusicDetailStyles />
        
        {/* Background decorative elements */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-accent/10 blur-[80px] animate-pulse-slow opacity-70"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          {/* Animated vinyl record */}
          <motion.div 
            className="w-32 h-32 rounded-full bg-dark border-4 border-light/10 mb-8 relative overflow-hidden"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-[15%] rounded-full bg-dark border border-light/20"></div>
            <div className="absolute inset-[45%] rounded-full bg-primary/50"></div>
            
            {/* Record grooves */}
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute border border-light/10 rounded-full"
                style={{
                  top: `${10 + i * 15}%`,
                  left: `${10 + i * 15}%`,
                  right: `${10 + i * 15}%`,
                  bottom: `${10 + i * 15}%`,
                }}
              ></motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading Album
          </motion.div>
          
          <motion.div 
            className="flex gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-primary/50"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
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
      <MusicDetailStyles />
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-accent/10 blur-[80px] animate-pulse-slow opacity-70"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-10 relative z-10">
        <motion.div 
          className="flex items-center text-light/60 text-sm mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="hover:text-light transition-colors duration-200 hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.031-.028.061-.056.091-.086L12 5.43z" />
            </svg>
            Home
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mx-2 text-light/40">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
          <Link href="/music" className="hover:text-light transition-colors duration-200 hover:underline flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.403-4.909l2.311-.66a1.5 1.5 0 001.088-1.442V6.994l-9 2.572v9.737a3 3 0 01-2.176 2.884l-1.32.377a2.553 2.553 0 11-1.402-4.909l2.31-.66a1.5 1.5 0 001.088-1.442V5.25a.75.75 0 01.544-.721l10.5-3a.75.75 0 01.658.122z" clipRule="evenodd" />
            </svg>
            Music
          </Link>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 mx-2 text-light/40">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
          </svg>
          <span className="text-light/90 font-medium">{album?.title || 'Album'}</span>
        </motion.div>
      </div>
      
      {/* Hero header with album artwork background */}
      <motion.section 
        ref={headerRef}
        className="relative min-h-[60vh] flex items-end pb-16 pt-20 overflow-hidden"
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
            className="object-cover opacity-30 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/40"></div>
          <div className="absolute inset-0 backdrop-blur-3xl"></div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/5 w-80 h-80 rounded-full bg-accent/10 blur-[80px] animate-pulse-slow opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
            {/* Album cover */}
            <motion.div 
              className="w-64 md:w-72 aspect-square shrink-0 rounded-xl overflow-hidden shadow-2xl relative group perspective"
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ 
                rotateY: 15, 
                rotateX: 5,
                scale: 1.05,
                transition: { duration: 0.5 }
              }}
            >
              {/* Vinyl record effect behind album */}
              <motion.div 
                className="absolute inset-0 z-0 bg-gradient-to-br from-dark/80 to-dark/40 rounded-full scale-[0.85] opacity-0 group-hover:opacity-100 group-hover:scale-[0.95] transition-all duration-700"
                style={{ 
                  background: "conic-gradient(from 0deg, rgba(0,0,0,0.8), rgba(30,30,30,0.8), rgba(0,0,0,0.8), rgba(30,30,30,0.8), rgba(0,0,0,0.8))" 
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                {/* Vinyl grooves */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute border border-light/5 rounded-full"
                      style={{
                        top: `${10 + i * 10}%`,
                        left: `${10 + i * 10}%`,
                        right: `${10 + i * 10}%`,
                        bottom: `${10 + i * 10}%`,
                      }}
                    ></div>
                  ))}
                  {/* Vinyl center hole */}
                  <div className="absolute left-1/2 top-1/2 w-[10%] h-[10%] -translate-x-1/2 -translate-y-1/2 bg-dark/80 rounded-full border-2 border-light/10"></div>
                </div>
              </motion.div>
              
              {/* Album cover with shiny overlay */}
              <div className="relative z-10 w-full h-full">
                <Image 
                  src={getArtworkUrl()}
                  alt={album.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500" 
                     style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)" }}></div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/50 to-accent/50 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500 z-0"></div>
              
              {/* Play button overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-dark/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer"
                onClick={handlePlayAlbum}
              >
                <motion.button 
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-light shadow-lg"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCurrentAlbum() && state.isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
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
                  className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-light text-xs font-bold py-1.5 px-3.5 rounded-full shadow-lg z-20 backdrop-blur-md"
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
              <div className="inline-block mb-3 px-4 py-1.5 bg-dark/50 backdrop-blur-md border border-light/10 rounded-full text-xs font-medium text-light/90">
                {formatAlbumType(album.type)} • {album.year || 'Unknown Year'}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-light via-light/90 to-light/80 tracking-tight">
                {album.title}
              </h1>
              
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent rounded-full my-4"></div>
              
              {album.description && (
                <p className="text-light/90 max-w-2xl mb-8 text-lg leading-relaxed">
                  {album.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-4 mt-6">
                <motion.button 
                  onClick={handlePlayAlbum}
                  className={`px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-light font-medium rounded-full transition-all transform hover:shadow-lg hover:shadow-primary/20 ${
                    hasPlayableTracks 
                      ? 'hover:scale-105' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={hasPlayableTracks ? { scale: 1.05 } : {}}
                  whileTap={hasPlayableTracks ? { scale: 0.95 } : {}}
                  disabled={!hasPlayableTracks}
                >
                  <span className="flex items-center gap-2 font-medium">
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
                    className="px-8 py-3.5 bg-dark/40 backdrop-blur-sm hover:bg-dark/60 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/20 flex items-center gap-2"
                    whileHover={{ scale: 1.05, borderColor: "rgba(var(--light-rgb), 0.3)" }}
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
                    className="px-8 py-3.5 bg-dark/40 backdrop-blur-sm hover:bg-dark/60 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/20 flex items-center gap-2"
                    whileHover={{ scale: 1.05, borderColor: "rgba(var(--light-rgb), 0.3)" }}
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
        className="py-16"
        initial={{ opacity: 0 }}
        animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-light/10 mb-10 relative">
            <motion.button 
              onClick={() => setActiveTab('tracks')}
              className={`px-5 py-3 font-medium transition-all relative ${
                activeTab === 'tracks' 
                  ? 'text-light' 
                  : 'text-light/60 hover:text-light/80'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Tracklist
              {activeTab === 'tracks' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
            
            {album.lyrics && album.lyrics.length > 0 && (
              <motion.button 
                onClick={() => setActiveTab('lyrics')}
                className={`px-5 py-3 font-medium transition-all relative ${
                  activeTab === 'lyrics' 
                    ? 'text-light' 
                    : 'text-light/60 hover:text-light/80'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Lyrics
                {activeTab === 'lyrics' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            )}
            
            {album.credits && (
              <motion.button 
                onClick={() => setActiveTab('credits')}
                className={`px-5 py-3 font-medium transition-all relative ${
                  activeTab === 'credits' 
                    ? 'text-light' 
                    : 'text-light/60 hover:text-light/80'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Credits
                {activeTab === 'credits' && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            )}
          </div>
          
          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTab === 'tracks' && (
              <motion.div 
                key="tracks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto"
              >
                <div className="space-y-2">
                  {album.tracks.map((track: any, index: number) => {
                    const hasAudio = !!getAudioUrl(track);
                    const isPlaying = isCurrentTrack(track) && state.isPlaying;
                    
                    return (
                      <motion.div 
                        key={track._key || track.id || index}
                        className={`flex items-center gap-4 p-5 rounded-xl track-hover-glow ${
                          isCurrentTrack(track) 
                            ? 'bg-gradient-to-r from-dark/80 to-dark/50 shadow-lg shadow-primary/10 backdrop-blur-md border border-light/5' 
                            : 'hover:bg-dark/30 hover:backdrop-blur-sm'
                        } transition-all group ${hasAudio ? 'cursor-pointer' : 'opacity-60'}`}
                        onClick={() => hasAudio && handleTrackSelect(track)}
                        whileHover={hasAudio ? { 
                          scale: 1.01, 
                          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                          backdropFilter: "blur(12px)",
                          backgroundColor: "rgba(18, 18, 24, 0.3)" 
                        } : {}}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.05, duration: 0.3 }
                        }}
                      >
                        {/* Track number or play indicator */}
                        <div className="w-12 h-12 shrink-0 rounded-full bg-dark/50 border border-light/10 flex items-center justify-center relative overflow-hidden">
                          {/* Animated background for current track */}
                          {isCurrentTrack(track) && (
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 opacity-40"
                              animate={{ 
                                background: [
                                  "linear-gradient(90deg, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--accent-rgb), 0.4) 100%)",
                                  "linear-gradient(180deg, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--accent-rgb), 0.4) 100%)",
                                  "linear-gradient(270deg, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--accent-rgb), 0.4) 100%)",
                                  "linear-gradient(360deg, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--accent-rgb), 0.4) 100%)",
                                  "linear-gradient(90deg, rgba(var(--primary-rgb), 0.4) 0%, rgba(var(--accent-rgb), 0.4) 100%)"
                                ]
                              }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                          
                          {isCurrentTrack(track) ? (
                            <div className={`relative z-10 ${isPlaying ? 'animate-pulse' : ''}`}>
                              {isPlaying ? (
                                // Audio wave animation
                                <div className="flex items-center justify-center gap-0.5 h-3">
                                  {[1,2,3,4].map((i) => (
                                    <motion.div 
                                      key={i}
                                      className="w-0.5 bg-primary h-full rounded-full"
                                      animate={{ 
                                        height: ["30%", "85%", "40%", "70%", "30%"],
                                      }}
                                      transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        delay: i * 0.1
                                      }}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                                  <path d="M15.95 5.95c3.125 3.125 3.125 8.19 0 11.32-3.126 3.125-8.19 3.125-11.316 0-3.125-3.126-3.125-8.19 0-11.316 3.125-3.125 8.19-3.125 11.316 0z" />
                                </svg>
                              )}
                            </div>
                          ) : (
                            <motion.span 
                              className="text-sm text-light/70 font-medium group-hover:opacity-0 absolute inset-0 flex items-center justify-center"
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {index + 1}
                            </motion.span>
                          )}
                          
                          {/* Play button on hover */}
                          {hasAudio && !isCurrentTrack(track) && (
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileHover={{ scale: 1.1, opacity: 1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-light">
                                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Track info */}
                        <div className="flex-1 min-w-0">
                          <motion.h3 
                            className={`font-medium truncate ${isCurrentTrack(track) ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent' : 'group-hover:text-primary transition-colors'}`}
                            whileHover={{ x: hasAudio ? 3 : 0 }}
                          >
                            {track.title}
                          </motion.h3>
                          {track.featuring && (
                            <p className="text-sm text-light/60 mt-0.5">feat. {track.featuring}</p>
                          )}
                        </div>
                        
                        {/* Track duration with animated icon for playable tracks */}
                        <div className="flex items-center gap-2">
                          {hasAudio && !isCurrentTrack(track) && (
                            <motion.div 
                              className="w-5 h-5 text-light/40 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                              initial={{ rotate: 0 }}
                              whileHover={{ rotate: 15 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                <path d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                                <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
                              </svg>
                            </motion.div>
                          )}
                          {track.duration && (
                            <div className="text-sm text-light/60 font-medium">{track.duration}</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'lyrics' && album.lyrics && album.lyrics.length > 0 && (
              <motion.div 
                key="lyrics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto bg-dark/30 backdrop-blur-lg rounded-2xl p-8 border border-light/5"
              >
                <div className="space-y-10">
                  {album.lyrics.map((lyric: any, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.1, duration: 0.5 }
                      }}
                    >
                      <h3 className="text-xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-light to-light/70">{lyric.songTitle}</h3>
                      <div className="whitespace-pre-line text-light/90 leading-relaxed">
                        {lyric.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {activeTab === 'credits' && album.credits && (
              <motion.div 
                key="credits"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto bg-dark/30 backdrop-blur-lg rounded-2xl p-8 border border-light/5"
              >
                <div className="text-light/90 leading-relaxed whitespace-pre-line">
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