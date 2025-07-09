"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types";
import { moviesApi } from "@/lib/api/movies";
import HeroSection from "@/components/hero-section";
import HomeNav from "@/components/home-nav";
import FeaturedMovies from "@/components/featured-movies";
import FeatureSection from "@/components/features-section";
import StadisticsSection from "@/components/stadistics-section";
import JourneySection from "@/components/journey-section";
import Footer from "@/components/footer";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      const movies = await moviesApi.getMovies({
        page: 1,
        limit: 3,
        sortBy: "rating",
        sortOrder: "desc",
      });
      setFeaturedMovies(movies.movies);
    };
    fetchFeaturedMovies();

    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <HomeNav session={session} />
      <HeroSection />

      <FeaturedMovies featuredMovies={featuredMovies} isLoading={isLoading} />

      <FeatureSection />

      <StadisticsSection />

      <JourneySection handleGetStarted={handleGetStarted} />

      <Footer />
    </div>
  );
}
