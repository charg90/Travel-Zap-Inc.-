import { Movie } from "@/types";
import { Star, Users } from "lucide-react";
import React from "react";

type Props = {
  featuredMovies: Movie[];
  isLoading: boolean;
};

function FeaturedMovies({ featuredMovies, isLoading }: Props) {
  return (
    <section className="relative px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Featured Movies
          </h2>
          <p className="text-white/80 text-lg">
            Discover the highest-rated movies in our collection
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 animate-pulse"
              >
                <div className="h-48 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-6 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {movie.title}
                </h3>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {movie.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">
                      {movie.ratings}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-white/60 text-sm">
                    <Users className="size-4" />
                    <span>{movie.actors.length} actors</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedMovies;
