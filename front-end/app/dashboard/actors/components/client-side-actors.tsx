"use client";
import ActorCard from "@/components/actor-card";
import AddActorModal from "@/components/modals/add-actor-modal";
import Pagination from "@/components/pagination";
import { useMoviesActors } from "@/context/actors-context";
import { usePaginatedActors } from "@/hooks/use-paginate-actors";
import { Actor, Movie } from "@/types";
import { Plus, Search, User } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  total: number;
  initialTotalPage: number;
  page: number;
  movies: Movie[];
};

function ClientSideActors({ initialTotalPage, page, movies }: Props) {
  const { actors: initialActors } = useMoviesActors();
  const {
    actors,
    setActors,
    currentPage,
    totalPages,
    searchTerm,
    setCurrentPage,
    setSearchTerm,
    refreshActors,
  } = usePaginatedActors({
    initialActors,
    initialTotalPages: initialTotalPage,
    initialPage: page,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const filteredActors = actors.filter((actor) => {
    const fullName = `${actor.name} ${actor.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      actor.movies?.some((movie) => movie.toLowerCase().includes(searchLower))
    );
  });
  const handleUpdateActor = (updatedActor: Actor) => {
    refreshActors();
    setActors((prev) =>
      prev.map((actor) =>
        actor.id === updatedActor.id ? { ...actor, ...updatedActor } : actor
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Actors</h1>
          <p className="text-gray-600 mt-1">
            Explore talented actors and their filmography
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search actors, movies, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Actor</span>
          </button>
        </div>
      </div>

      {filteredActors.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No actors found
          </h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                actor={actor}
                onUpdateActor={handleUpdateActor}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
      <AddActorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        movies={movies}
        onSubmit={(newActor) => {
          const actorWithId = { ...newActor, id: Date.now() };
          setActors((prev) => [...prev, actorWithId]);
        }}
      />
    </div>
  );
}

export default ClientSideActors;
