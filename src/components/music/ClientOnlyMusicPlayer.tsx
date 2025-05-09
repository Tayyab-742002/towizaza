"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePlayer } from "@/context/PlayerContext";

// Import MusicPlayer with no SSR to avoid hydration errors
const MusicPlayer = dynamic(() => import("./MusicPlayer"), {
  ssr: false,
});

export function ClientOnlyMusicPlayer() {
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
