/**
 * Performance Configuration
 *
 * This file contains settings for optimizing assets and performance
 * across the Towizaza website.
 */

// Default image quality for different screen sizes
export const IMAGE_QUALITY = {
  MOBILE: 80, // Lower quality for mobile to save bandwidth
  TABLET: 85, // Medium quality for tablets
  DESKTOP: 90, // Higher quality for desktop
};

// Image sizing presets for responsive images
export const IMAGE_SIZES = {
  THUMBNAIL: {
    width: 80,
    height: 80,
  },
  CARD: {
    width: 400,
    height: 400,
  },
  FEATURED: {
    width: 800,
    height: 800,
  },
  HERO: {
    width: 1920,
    height: 1080,
  },
};

// Audio quality settings for different connection types
export const AUDIO_QUALITY = {
  LOW: {
    bitrate: "96kbps", // Lower quality for data saving mode
    format: "mp3",
  },
  MEDIUM: {
    bitrate: "192kbps", // Medium quality for default mobile
    format: "mp3",
  },
  HIGH: {
    bitrate: "320kbps", // High quality for desktop/wifi
    format: "mp3",
  },
};

// Preloading settings
export const PRELOAD = {
  // Number of tracks to preload ahead in a playlist
  NEXT_TRACKS: 2,

  // Whether to preload videos
  VIDEOS: false,

  // Preload images
  IMAGES: true,

  // Preload critical CSS
  CRITICAL_CSS: true,
};

// Code splitting size limits
export const CODE_SPLITTING = {
  // Maximum size of a chunk in KB before it gets split
  MAX_CHUNK_SIZE: 500,

  // Maximum number of requests to make
  MAX_REQUESTS: 20,
};

// Feature detection helpers
export const CAPABILITIES = {
  // Check if user has a slow connection
  isSlowConnection: () => {
    if (typeof navigator === "undefined") return false;

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      // Check connection type
      if (
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      ) {
        return true;
      }

      // Check bandwidth
      if (connection.downlink < 1) {
        return true;
      }
    }

    return false;
  },

  // Check if device is low power
  isLowPowerDevice: () => {
    if (typeof navigator === "undefined") return false;

    // Check number of logical processors - fewer suggests a less powerful device
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      return true;
    }

    // Check for mobile user agent strings
    const ua = navigator.userAgent.toLowerCase();
    if (/(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(ua)) {
      return true;
    }

    return false;
  },

  // Check if user has enabled data saver mode
  isDataSaverEnabled: () => {
    if (typeof navigator === "undefined") return false;

    const connection = (navigator as any).connection;
    if (connection && connection.saveData) {
      return true;
    }

    return false;
  },
};

// Default performance settings based on capabilities
export const getOptimalSettings = () => {
  const isSlowConnection = CAPABILITIES.isSlowConnection();
  const isLowPower = CAPABILITIES.isLowPowerDevice();
  const isDataSaving = CAPABILITIES.isDataSaverEnabled();

  return {
    // Adjust image quality based on connection and device
    imageQuality:
      isSlowConnection || isDataSaving
        ? IMAGE_QUALITY.MOBILE
        : isLowPower
          ? IMAGE_QUALITY.TABLET
          : IMAGE_QUALITY.DESKTOP,

    // Adjust audio quality
    audioQuality:
      isSlowConnection || isDataSaving ? "low" : isLowPower ? "medium" : "high",

    // Enable or disable preloading
    enablePreloading: !(isSlowConnection || isDataSaving),

    // Enable or disable animations
    enableAnimations: !isLowPower,
  };
};
