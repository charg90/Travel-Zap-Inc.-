"use client";

import { Star } from "lucide-react";

import Link from "next/link";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/dashboard/movies/${movie.id}`}>
      <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <Star className="size-4 text-yellow-500" />
              <span className="text-sm font-medium">
                {movie.ratings || 0}/10
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {movie.description}
          </p>

          <div className="text-xs text-gray-500">
            <span className="font-medium">Cast:</span> {movie.actors.join(", ")}
          </div>
        </div>
      </div>
    </Link>
  );
}
