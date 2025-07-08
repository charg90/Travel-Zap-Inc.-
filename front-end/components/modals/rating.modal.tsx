import React from "react";

function RatingModal() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-slide-up overflow-hidden">
        <div className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Rate this movie
            </h3>
            <p className="text-gray-600">
              How would you rate &quot;{movie.title}&quot;?
            </p>

            <div className="flex justify-center py-4">
              <StarRating
                rating={userRating}
                onRatingChange={setUserRating}
                interactive={true}
              />
            </div>

            {userRating > 0 && (
              <p className="text-sm text-gray-500">
                You rated this movie {userRating} star
                {userRating !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                setShowRating(false);
                setUserRating(0);
                setHoverRating(0);
              }}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRatingSubmit}
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

export default RatingModal;
