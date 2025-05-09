"use client";

import { useState, useEffect, Suspense } from "react";
import {
  getFeaturedMusic,
  getFeaturedProducts,
  getUpcomingSongs,
  getArtistInfo,
} from "@/lib/sanity";
import {
  fallbackMusic,
  fallbackProducts,
  fallbackArtistInfo,
} from "@/lib/fallbackData";
import { Loading } from "../common/Loading";
import dynamic from "next/dynamic";

// Import the critical hero section normally
import HeroSection from "@/components/home/HeroSection";

// Dynamically import less critical sections
const LatestReleasesSection = dynamic(
  () => import("@/components/home/LatestReleasesSection"),
  { ssr: true, loading: () => <SectionPlaceholder /> }
);

const UpcomingReleasesSection = dynamic(
  () => import("@/components/home/UpcomingReleasesSection"),
  { ssr: true, loading: () => <SectionPlaceholder /> }
);

const TestimonialsSection = dynamic(
  () => import("@/components/home/TestimonialsSection"),
  { ssr: true, loading: () => <SectionPlaceholder /> }
);

const NewsletterSection = dynamic(
  () => import("@/components/home/NewsletterSection"),
  { ssr: true, loading: () => <SectionPlaceholder /> }
);

const FeaturedMerchSection = dynamic(
  () => import("@/components/home/FeaturedMerchSection"),
  { ssr: true, loading: () => <SectionPlaceholder /> }
);

// Simple placeholder for loading sections
function SectionPlaceholder() {
  return (
    <section className="py-20 bg-dark">
      <div className="container mx-auto px-6">
        <div className="w-full h-64 bg-dark/50 animate-pulse rounded-lg"></div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  const [featuredData, setFeaturedData] = useState<{
    music: any[];
    products: any[];
    upcomingSongs: any[];
    artistInfo: any;
  }>({
    music: [],
    products: [],
    upcomingSongs: [],
    artistInfo: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch data from different sources
        const [music, products, upcomingSongs, artistInfo] = await Promise.all([
          getFeaturedMusic(),
          getFeaturedProducts(),
          getUpcomingSongs(),
          getArtistInfo(),
        ]);

        // Set default data if API returns empty
        let musicData =
          music?.length > 0
            ? music
            : fallbackMusic.filter((item) => item.featured && !item.upcoming);

        setFeaturedData({
          music: musicData,
          products:
            products?.length > 0
              ? products
              : fallbackProducts.filter((item) => item.featured),
          upcomingSongs: upcomingSongs || [],
          artistInfo: artistInfo || fallbackArtistInfo,
        });
      } catch (error) {
        console.error("Error fetching featured data:", error);
        // Fallback to mock data in case of error
        setFeaturedData({
          music: fallbackMusic.filter(
            (item) => item.featured && !item.upcoming
          ),
          products: fallbackProducts.filter((item) => item.featured),
          upcomingSongs: fallbackMusic.filter(
            (item) => item.upcoming && item.featured
          ),
          artistInfo: fallbackArtistInfo,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <Loading message="Please Wait..." />;
  }

  return (
    <main>
      {/* Critical above-the-fold content */}
      <HeroSection artistInfo={featuredData.artistInfo} />

      {/* Less critical sections */}
      <Suspense fallback={<SectionPlaceholder />}>
        <LatestReleasesSection music={featuredData.music} />
      </Suspense>

      {featuredData.upcomingSongs.length > 0 && (
        <Suspense fallback={<SectionPlaceholder />}>
          <UpcomingReleasesSection upcomingSongs={featuredData.upcomingSongs} />
        </Suspense>
      )}

      <Suspense fallback={<SectionPlaceholder />}>
        <TestimonialsSection />
      </Suspense>

      {featuredData.products.length > 0 && (
        <Suspense fallback={<SectionPlaceholder />}>
          <FeaturedMerchSection products={featuredData.products} />
        </Suspense>
      )}

      <Suspense fallback={<SectionPlaceholder />}>
        <NewsletterSection />
      </Suspense>
    </main>
  );
}
