"use client";

import dynamic from "next/dynamic";
import { usePlayer } from "@/context/PlayerContext";
import { useEffect, useState } from "react";

// Import MusicPlayer with dynamic import and ssr: false
const MusicPlayer = dynamic(() => import("./MusicPlayer"), {
  ssr: false,
});

export function MusicPlayerWrapper() {
  const { state } = usePlayer();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render on the client side to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  // Only render the player if there's a track and it should be visible
  if (!state.currentTrack || !state.isVisible) {
    return null;
  }

  return <MusicPlayer />;
}
