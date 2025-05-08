"use client";

import { useState, useEffect, useRef } from "react";
import { getMusic } from "@/lib/sanity";
import { fallbackMusic } from "@/lib/fallbackData";
import MusicCard from "@/components/music/MusicCard";
import { Album } from "@/data/music";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Loading } from "@/components/common/Loading";

// Categories for filter chips
const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "album", label: "Albums" },
  { value: "single", label: "Singles" },
  { value: "ep", label: "EPs" },
];

export default function MusicPage() {
  const [musicData, setMusicData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<
    "all" | "album" | "single" | "ep"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "a-z">("newest");

  // Intersection observer for hero section
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Intersection observer for content section
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchMusic() {
      try {
        const music = await getMusic();
        setMusicData(music || fallbackMusic);
      } catch (error) {
        console.error("Error fetching music data:", error);
        setMusicData(fallbackMusic);
      } finally {
        setLoading(false);
      }
    }

    fetchMusic();
  }, []);

  // Sort and filter music based on criteria
  const processedMusic = musicData
    // First filter by type and search
    .filter((album) => {
      const matchesSearch =
        searchQuery === "" ||
        album.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || album.type === filterType;

      return matchesSearch && matchesType;
    })
    // Then sort
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.releaseDate || b.year).getTime() -
          new Date(a.releaseDate || a.year).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.releaseDate || a.year).getTime() -
          new Date(b.releaseDate || b.year).getTime()
        );
      } else {
        // a-z
        return a.title.localeCompare(b.title);
      }
    });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setSortBy("newest");
  };

  if (loading) {
    return <Loading message="Loading Music Catelog" />;
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative py-24 bg-gradient-to-b from-secondary/20 to-dark overflow-hidden"
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30"></div>
          <div className="h-full w-full bg-grid-pattern"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              Music Catalog
            </h1>
            <p className="text-xl text-light/80 max-w-2xl">
              Explore Towizaza's discography, including albums, singles, and
              exclusive releases. Listen to previews and discover the complete
              catalog.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setFilterType("album");
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-light font-medium rounded-full transition-all transform hover:scale-105"
              >
                View Albums
              </button>
              <button
                onClick={() => {
                  setFilterType("single");
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-3 bg-dark/70 hover:bg-dark/50 text-light font-medium rounded-full transition-all transform hover:scale-105 border border-light/30"
              >
                Browse Singles
              </button>
            </div>
          </motion.div>

          {/* Album count stats */}
          <motion.div
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-dark/30 backdrop-blur-md px-4 py-3 rounded-lg border border-light/5 flex flex-col items-center justify-center text-center h-full">
              <div className="text-primary font-bold text-3xl">
                {musicData.filter((album) => album.type === "album").length}
              </div>
              <div className="text-light/70 text-sm sm:text-base">Albums</div>
            </div>
            <div className="bg-dark/30 backdrop-blur-md px-4 py-3 rounded-lg border border-light/5 flex flex-col items-center justify-center text-center h-full">
              <div className="text-primary font-bold text-3xl">
                {musicData.filter((album) => album.type === "single").length}
              </div>
              <div className="text-light/70 text-sm sm:text-base">Singles</div>
            </div>
            <div className="bg-dark/30 backdrop-blur-md px-4 py-3 rounded-lg border border-light/5 flex flex-col items-center justify-center text-center h-full">
              <div className="text-primary font-bold text-3xl">
                {musicData.filter((album) => album.type === "ep").length}
              </div>
              <div className="text-light/70 text-sm sm:text-base">EPs</div>
            </div>
            <div className="bg-dark/30 backdrop-blur-md px-4 py-3 rounded-lg border border-light/5 flex flex-col items-center justify-center text-center h-full">
              <div className="text-primary font-bold text-3xl">
                {musicData.reduce(
                  (total, album) => total + album.tracks.length,
                  0
                )}
              </div>
              <div className="text-light/70 text-sm sm:text-base">
                Total Tracks
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Catalog Section */}
      <motion.section
        id="catalog"
        ref={contentRef}
        className="py-16"
        initial={{ opacity: 0 }}
        animate={contentInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Music <span className="text-primary">Catalog</span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFilters}
                className="bg-dark/70 border border-light/20 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-dark/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {(searchQuery ||
                  filterType !== "all" ||
                  sortBy !== "newest") && (
                  <span className="bg-primary w-2 h-2 rounded-full"></span>
                )}
              </button>

              <div className="border-r border-light/20 h-8 mx-1"></div>

              <div className="flex rounded-lg border border-light/20 overflow-hidden">
                <button
                  className={`p-2 ${viewType === "grid" ? "bg-secondary/30 text-light" : "bg-dark/70 text-light/70"}`}
                  onClick={() => setViewType("grid")}
                  aria-label="Grid View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  className={`p-2 ${viewType === "list" ? "bg-secondary/30 text-light" : "bg-dark/70 text-light/70"}`}
                  onClick={() => setViewType("list")}
                  aria-label="List View"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                ref={filtersRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-dark/30 backdrop-blur-md border border-light/10 rounded-xl p-5">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="flex-1">
                      <label className="block text-light/70 text-sm mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by title..."
                          className="w-full bg-dark/70 border border-light/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-light/50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light/50 hover:text-light"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      <label className="block text-light/70 text-sm mb-2">
                        Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((category) => (
                          <button
                            key={category.value}
                            onClick={() => setFilterType(category.value as any)}
                            className={`px-4 py-2 rounded-lg text-sm ${
                              filterType === category.value
                                ? "bg-primary text-light font-medium"
                                : "bg-dark/50 text-light/70 hover:bg-dark/30"
                            } transition-colors`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      <label className="block text-light/70 text-sm mb-2">
                        Sort By
                      </label>
                      <select
                        className="bg-dark/70 border border-light/20 rounded-lg px-4 py-2.5 appearance-none pr-10 focus:outline-none focus:border-primary w-full md:w-auto"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">A-Z</option>
                      </select>
                    </div>

                    <div className="ml-auto">
                      <button
                        onClick={clearFilters}
                        className="bg-dark/50 hover:bg-dark/30 text-light/80 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="mb-8 text-light/70 text-sm">
            Showing {processedMusic.length}{" "}
            {processedMusic.length === 1 ? "result" : "results"}
            {filterType !== "all" &&
              ` • Type: ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
            {searchQuery && ` • Search: "${searchQuery}"`}
          </div>

          {/* Music Catalog Grid or List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewType + filterType + sortBy + searchQuery} // Force re-render on view change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {processedMusic.length > 0 ? (
                viewType === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {processedMusic.map((album: Album, index) => (
                      <motion.div
                        key={album._id || album.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <MusicCard album={album} variant="default" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {processedMusic.map((album: Album, index) => (
                      <motion.div
                        key={album._id || album.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <MusicCard
                          album={album}
                          variant="compact"
                          className="flex flex-col md:flex-row md:h-32 hover:bg-dark/40 transition-colors"
                        />
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <motion.div
                  className="bg-dark/20 backdrop-blur-md rounded-xl p-10 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-light/30 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl text-light mb-2">No music found</h3>
                  <p className="text-light/60 mb-6">
                    No music matches your search criteria. Try adjusting your
                    filters.
                  </p>
                  <button
                    className="px-6 py-2.5 bg-primary/80 hover:bg-primary text-light rounded-lg transition-colors inline-flex items-center gap-2"
                    onClick={clearFilters}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>
    </div>
  );
}
