import { Search, Star, TrendingUp } from "lucide-react";
import React from "react";

function FeatureSection() {
  return (
    <section id="features" className="relative px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Movie App?
          </h2>
          <p className="text-white/80 text-lg">
            Everything you need to manage your movie collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center size-16 bg-blue-500/20 backdrop-blur-sm rounded-full mb-6">
              <Search className="size-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Smart Search</h3>
            <p className="text-white/70">
              Find movies instantly with our powerful search engine. Search by
              title, actor, genre, or rating.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center size-16 bg-purple-500/20 backdrop-blur-sm rounded-full mb-6">
              <Star className="size-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Rate & Review</h3>
            <p className="text-white/70">
              Rate your favorite movies and keep track of what you&lsquo;ve
              watched. Build your personal movie diary.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center size-16 bg-green-500/20 backdrop-blur-sm rounded-full mb-6">
              <TrendingUp className="size-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">
              Trending Movies
            </h3>
            <p className="text-white/70">
              Stay up to date with the latest and most popular movies. Never
              miss what&lsquo;s trending.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
