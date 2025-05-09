import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
    // Optimize image loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
  },

  // Set production environment variables
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NODE_ENV,
  },

  // Enable React strict mode
  reactStrictMode: true,

  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production

  // Configure webpack for optimizations
  webpack: (config, { dev, isServer }) => {
    // Only apply optimizations for production builds
    if (!dev) {
      // Set production mode explicitly
      config.mode = "production";

      // Add terser for minification
      if (!isServer) {
        config.optimization.minimize = true;
      }
    }

    return config;
  },

  // Configure headers for better caching
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            // Adjust depending on how often content changes
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=31536000",
          },
        ],
      },
      {
        // For static assets with longer cache time
        source: "/:path*.(jpg|jpeg|png|gif|webp|svg|mp3|wav|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
