"use client";
import type React from "react";
import { useState } from "react";
import { ArrowRight, Star, Calendar, Users, X, Edit } from "lucide-react";
import type { Movie } from "@/types";
import RatingModal from "./modals/rating-modal";
import EditMovieModal from "./modals/edit-movie.modal";

interface MovieCardProps {
  movie: Movie;
  onUpdate: (updatedMovie: Movie) => void;
}

export default function MovieCard({ movie, onUpdate }: MovieCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleRatingSubmit = () => {
    console.log("Rating submitted for movie:");
  };

  return (
    <>
      <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 h-36 flex flex-col">
        <div className="p-4 flex flex-col h-full">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
            {movie.title}
          </h3>
          <div className="flex-1"></div>
          <div className="mt-auto">
            <button
              onClick={() => setShowDetails(true)}
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">
                {movie.title}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-lg font-semibold text-gray-900">
                      {movie.ratings || 0}/10
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Synopsis
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {movie.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Cast
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{movie.actors}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Movie ID
                    </h4>
                    <p className="text-blue-700">#{movie.id}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-1">
                      Rating
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-green-700 font-medium">
                        {movie.ratings || 0}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRating(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Rate Movie
                  </button>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Movie
                  </button>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <RatingModal
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        movie={movie}
        onSubmitRating={handleRatingSubmit}
        onUpdateRating={(movieId, newRating) => {
          onUpdate({ ...movie, ratings: newRating });
        }}
      />
      <EditMovieModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        movie={movie}
        onUpdate={onUpdate}
      />
    </>
  );
}
