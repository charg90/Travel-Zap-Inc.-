"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import type { Movie } from "@/types";
import { moviesApi } from "@/lib/api/movies";
import { revalidateMovies } from "@/actions/revalidate-movies";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onSubmitRating: (movieId: string, rating: number) => void;
}

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  hoverRating?: number;
  onHoverChange?: (rating: number) => void;
}

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
  hoverRating = 0,
  onHoverChange,
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && onHoverChange?.(star)}
          onMouseLeave={() => interactive && onHoverChange?.(0)}
          disabled={!interactive}
          className={`${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          } transition-all duration-200`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= (interactive ? hoverRating || rating : rating)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function RatingModal({
  isOpen,
  onClose,
  movie,
}: RatingModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async () => {
    if (userRating === 0) return;

    try {
      console.log(movie.id, userRating);

      await moviesApi.submitRating(movie.id, userRating);

      await revalidateMovies();
      onClose();
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  const handleClose = () => {
    setUserRating(0);
    setHoverRating(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Rate this movie
          </h3>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close rating modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {movie.title}
              </h4>
              <p className="text-gray-600">How would you rate this movie?</p>
            </div>

            <div className="flex justify-center py-4">
              <StarRating
                rating={userRating}
                onRatingChange={setUserRating}
                interactive={true}
                hoverRating={hoverRating}
                onHoverChange={setHoverRating}
              />
            </div>

            {userRating > 0 && (
              <div className="bg-yellow-50 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  You rated this movie{" "}
                  <span className="font-semibold">{userRating}</span> star
                  {userRating !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={userRating === 0}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Rating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
