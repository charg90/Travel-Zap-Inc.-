import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  handleGetStarted: () => void;
};

function HeroSection({ handleGetStarted }: Props) {
  return (
    <section className="relative px-4 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-8">
          <Sparkles className="size-4" />
          Discover Amazing Movies
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
          Your Ultimate
          <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Movie Experience
          </span>
        </h1>

        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto text-balance">
          Explore thousands of movies, discover new favorites, and keep track of
          what you love. Your personal cinema awaits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGetStarted}
            className="group px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
          >
            <Play className="size-5" />
            Get Started
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            href="#features"
            className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
