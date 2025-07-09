"use client";

import { useState } from "react";
import { ArrowRight, X, Film, User, Edit } from "lucide-react";
import type { Actor } from "@/types";
import EditActorModal from "./modals/edit-actor-modal";

interface ActorCardProps {
  actor: Actor;
  onUpdateActor?: (updatedActor: Actor) => void;
}

export default function ActorCard({ actor, onUpdateActor }: ActorCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <div className="card overflow-hidden hover:shadow-lg transition-all duration-300 h-36 flex flex-col">
        <div className="p-4 flex flex-col h-full">
          {/* Actor Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-lg">
            {actor.name} {actor.lastName}
          </h3>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* View Details Button */}
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
                {actor.name} {actor.lastName}
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
                {/* Actor Info */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <span className="text-lg font-semibold text-gray-900">
                      {actor.name} {actor.lastName}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Film className="w-5 h-5" />
                    Filmography ({actor.movies?.length || 0} movies)
                  </h3>
                  {actor.movies && actor.movies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {actor.movies.map((movie, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <Film className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-800">{movie}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-500 text-center">
                        No movies listed
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Actor ID
                    </h4>
                    <p className="text-blue-700">#{actor.id}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-1">
                      Movies Count
                    </h4>
                    <div className="flex items-center gap-1">
                      <Film className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">
                        {actor.movies?.length || 0} movies
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Full Name
                  </h4>
                  <p className="text-purple-800 text-lg">
                    {actor.name} {actor.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEdit(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Actor
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

      <EditActorModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        actor={actor}
        onUpdateActor={onUpdateActor}
      />
    </>
  );
}
