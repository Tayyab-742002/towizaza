export interface Track {
  id: string;
  title: string;
  duration: string;
  previewUrl?:
    | string
    | {
        asset?: {
          _ref: string;
        };
      };
  externalUrl?: string;
  _key?: string;
}

export interface Album {
  id: string;
  title: string;
  type: "album" | "ep" | "single";
  releaseDate: string;
  artwork: string;
  tracks: Track[];
  year: number;
  streamUrl: string;
  downloadUrl?: string;
  featured?: boolean;
  upcoming?: boolean;
  _type?: string;
  _id?: string;
  slug?: {
    current: string;
  };
}

export const musicCatalog: Album[] = [
  {
    id: "album-1",
    title: "Synthetic Memories",
    type: "album",
    releaseDate: "2020-08-14",
    artwork: "/images/albums/synthetic-memories.jpg",
    year: 2020,
    streamUrl: "https://open.spotify.com/album/example",
    downloadUrl: "https://towizaza.bandcamp.com/album/example",
    featured: true,
    tracks: [
      {
        id: "track-1-1",
        title: "Digital Dawn",
        duration: "3:45",
        externalUrl: "https://example-media.cloudflare.com/music/track-1-1.mp3",
      },
      {
        id: "track-1-2",
        title: "Neural Networks",
        duration: "4:12",
        externalUrl: "https://example-media.cloudflare.com/music/track-1-2.mp3",
      },
      {
        id: "track-1-3",
        title: "Social Media Safety",
        duration: "5:30",
        externalUrl:
          "https://pub-20f982007aa54df4849bcd969b89a1bf.r2.dev/social-media-safety.mp4",
      },
      { id: "track-1-4", title: "Retrograde", duration: "4:18" },
      { id: "track-1-5", title: "Quantum Resonance", duration: "6:24" },
      { id: "track-1-6", title: "Synthetic Soul", duration: "5:10" },
      { id: "track-1-7", title: "Ambient Echo", duration: "4:55" },
      { id: "track-1-8", title: "Temporal Drift", duration: "3:58" },
      { id: "track-1-9", title: "Electric Dreams", duration: "4:42" },
      { id: "track-1-10", title: "Memories (Outro)", duration: "2:35" },
    ],
  },
  {
    id: "album-2",
    title: "Harmonic Convergence",
    type: "album",
    releaseDate: "2022-03-25",
    artwork: "/images/albums/harmonic-convergence.jpg",
    year: 2022,
    streamUrl: "https://open.spotify.com/album/example2",
    downloadUrl: "https://towizaza.bandcamp.com/album/example2",
    featured: true,
    tracks: [
      { id: "track-2-1", title: "Convergence (Intro)", duration: "2:15" },
      { id: "track-2-2", title: "Harmonic Wave", duration: "4:30" },
      { id: "track-2-3", title: "Resonant Frequency", duration: "5:12" },
      { id: "track-2-4", title: "Oscillation", duration: "3:45" },
      { id: "track-2-5", title: "Phase Shift", duration: "4:58" },
      { id: "track-2-6", title: "Amplitude", duration: "5:22" },
      { id: "track-2-7", title: "Waveform", duration: "4:10" },
      { id: "track-2-8", title: "Synchronicity", duration: "6:35" },
      { id: "track-2-9", title: "Vibrational State", duration: "4:48" },
      { id: "track-2-10", title: "Unified Field", duration: "7:20" },
      { id: "track-2-11", title: "Cosmic Harmony", duration: "5:15" },
      { id: "track-2-12", title: "Convergence (Reprise)", duration: "2:30" },
    ],
  },
  {
    id: "ep-1",
    title: "Digital Dreams",
    type: "ep",
    releaseDate: "2018-05-11",
    artwork: "/images/albums/digital-dreams.jpg",
    year: 2018,
    streamUrl: "https://open.spotify.com/album/example3",
    downloadUrl: "https://towizaza.bandcamp.com/album/example3",
    tracks: [
      { id: "track-3-1", title: "Dream State", duration: "4:15" },
      { id: "track-3-2", title: "Digital Euphoria", duration: "3:58" },
      { id: "track-3-3", title: "Lucid", duration: "5:10" },
      { id: "track-3-4", title: "REM Cycle", duration: "4:22" },
      { id: "track-3-5", title: "Awakening", duration: "3:45" },
    ],
  },
  {
    id: "single-1",
    title: "Neon Echo",
    type: "single",
    releaseDate: "2019-02-18",
    artwork: "/images/albums/neon-echo.jpg",
    year: 2019,
    streamUrl: "https://open.spotify.com/album/example4",
    downloadUrl: "https://towizaza.bandcamp.com/album/example4",
    featured: true,
    tracks: [
      { id: "track-4-1", title: "Neon Echo", duration: "4:35" },
      { id: "track-4-2", title: "Neon Echo (Extended Mix)", duration: "6:20" },
      { id: "track-4-3", title: "Neon Echo (Instrumental)", duration: "4:32" },
    ],
  },
  {
    id: "single-2",
    title: "Celestial Journey",
    type: "single",
    releaseDate: "2021-07-09",
    artwork: "/images/albums/celestial-journey.jpg",
    year: 2021,
    streamUrl: "https://open.spotify.com/album/example5",
    downloadUrl: "https://towizaza.bandcamp.com/album/example5",
    tracks: [
      { id: "track-5-1", title: "Celestial Journey", duration: "5:24" },
      { id: "track-5-2", title: "Cosmic Voyage (B-Side)", duration: "4:48" },
    ],
  },
  {
    id: "single-3",
    title: "Ethereal Pulse",
    type: "single",
    releaseDate: "2023-01-20",
    artwork: "/images/albums/ethereal-pulse.jpg",
    year: 2023,
    streamUrl: "https://open.spotify.com/album/example6",
    downloadUrl: "https://towizaza.bandcamp.com/album/example6",
    featured: true,
    tracks: [
      { id: "track-6-1", title: "Ethereal Pulse", duration: "4:15" },
      { id: "track-6-2", title: "Ethereal Pulse (Club Mix)", duration: "5:40" },
      { id: "track-6-3", title: "Astral Projection", duration: "4:55" },
    ],
  },
  // Upcoming releases
  {
    id: "single-4",
    title: "Quantum Drift",
    type: "single",
    releaseDate: "2024-08-15", // Future date
    artwork: "/images/albums/quantum-drift.jpg",
    year: 2024,
    streamUrl: "https://open.spotify.com/album/upcoming1",
    upcoming: true,
    featured: true,
    tracks: [
      { id: "track-7-1", title: "Quantum Drift", duration: "3:45" },
      { id: "track-7-2", title: "Time Flux", duration: "4:20" },
    ],
  },
  {
    id: "single-5",
    title: "Neural Wave",
    type: "single",
    releaseDate: "2024-09-22", // Future date
    artwork: "/images/albums/neural-wave.jpg",
    year: 2024,
    streamUrl: "https://open.spotify.com/album/upcoming2",
    upcoming: true,
    featured: true,
    tracks: [
      { id: "track-8-1", title: "Neural Wave", duration: "4:12" },
      { id: "track-8-2", title: "Synaptic Connection", duration: "3:58" },
    ],
  },
  {
    id: "ep-2",
    title: "Cybernetic Dreams",
    type: "ep",
    releaseDate: "2024-11-05", // Future date
    artwork: "/images/albums/cybernetic-dreams.jpg",
    year: 2024,
    streamUrl: "https://open.spotify.com/album/upcoming3",
    upcoming: true,
    featured: true,
    tracks: [
      { id: "track-9-1", title: "Digital Consciousness", duration: "4:45" },
      { id: "track-9-2", title: "Neural Interface", duration: "5:10" },
      { id: "track-9-3", title: "Machine Learning", duration: "3:55" },
      { id: "track-9-4", title: "Algorithmic Beats", duration: "4:20" },
      { id: "track-9-5", title: "Cybernetic Evolution", duration: "6:15" },
    ],
  },
];
