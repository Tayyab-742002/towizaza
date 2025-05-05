'use client';

import { useState, useEffect } from 'react'
import { getMusic } from '@/lib/sanity'
import { fallbackMusic } from '@/lib/fallbackData'
import MusicCard from '@/components/music/MusicCard';
import { Album } from '@/data/music'

export default function MusicPage() {
  const [musicData, setMusicData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'album' | 'single' | 'ep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    async function fetchMusic() {
      try {
        const music = await getMusic();
        setMusicData(music || fallbackMusic);
      } catch (error) {
        console.error('Error fetching music data:', error);
        setMusicData(fallbackMusic);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMusic();
  }, []);
  
  // Filter music based on search and filter type
  const filteredMusic = musicData.filter(album => {
    const matchesSearch = searchQuery === '' || 
      album.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || album.type === filterType;
    
    return matchesSearch && matchesType;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-light flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-10">Music</h1>
        
        {/* Catalog Controls */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button 
              className={`px-4 py-2 rounded ${viewType === 'grid' ? 'bg-secondary/30 text-light' : 'text-light/70'}`}
              onClick={() => setViewType('grid')}
            >
              Grid
            </button>
            <button 
              className={`px-4 py-2 rounded ${viewType === 'list' ? 'bg-secondary/30 text-light' : 'text-light/70'}`}
              onClick={() => setViewType('list')}
            >
              List
            </button>
            
            <div className="relative">
              <select 
                className="bg-dark/70 border border-light/20 rounded px-3 py-2 appearance-none pr-8 focus:outline-none focus:border-accent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
              >
                <option value="all">All Albums</option>
                <option value="album">Albums</option>
                <option value="single">Singles</option>
                <option value="ep">EPs</option>
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search music..." 
              className="bg-dark/70 border border-light/20 rounded px-3 py-2 focus:outline-none focus:border-accent pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-light/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Music Catalog Grid or List */}
        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMusic.map((album: Album) => (
              <MusicCard 
                key={album._id || album.id} 
                album={album}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMusic.map((album: Album) => (
              <MusicCard 
                key={album._id || album.id} 
                album={album}
                variant="compact"
                className="flex flex-col md:flex-row md:h-32 hover:bg-dark/40 transition-colors"
              />
            ))}
          </div>
        )}

        {filteredMusic.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl text-light/70">No music found matching your criteria</h3>
            <button 
              className="mt-4 px-6 py-2 bg-primary/80 hover:bg-primary text-light rounded-full transition-colors"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 