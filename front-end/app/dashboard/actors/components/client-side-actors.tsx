"use client";
import ActorCard from "@/components/actor-card";
import AddActorModal from "@/components/modals/add-actor-modal";
import Pagination from "@/components/pagination";
import { useMoviesActors } from "@/context/actors-context";
import { useManagerActors } from "@/hooks/use-manager-actors";
import { actorsApi } from "@/lib/api/actors";
import { Actor, Movie } from "@/types";
import { Plus, Search, User } from "lucide-react";
import React, { useState } from "react";

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
    currentPage,
    totalPages,
    searchTerm,
    setCurrentPage,
    setSearchTerm,
    refreshActors,
    updateActor,
  } = useManagerActors({
    initialActors,
    initialTotalPages: initialTotalPage,
    initialPage: page,
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const handleUpdateActor = (updatedActor: Actor) => {
    const actorToUpdate: Actor = {
      ...updatedActor,
      id: String(updatedActor.id),
      movies: Array.isArray(updatedActor.movies)
        ? [...updatedActor.movies]
        : [],
    };
    updateActor(actorToUpdate);
    refreshActors();
  };

  const handleCreateActor = async (newActor: Omit<Actor, "id">) => {
    try {
      const createdActor = await actorsApi.createActor({
        name: newActor.name,
        lastName: newActor.lastName,
        movies: newActor.movies || [],
      });

      updateActor(createdActor);
      refreshActors();
    } catch (error) {
      console.error("Error al crear el actor:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
      </div>

      <div className="flex-1 px-6">
        {actors.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {actors.map((actor) => (
              <ActorCard
                key={actor.id}
                actor={actor}
                onUpdateActor={handleUpdateActor}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <AddActorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        movies={movies}
        onSubmit={handleCreateActor}
      />
    </div>
  );
}

export default ClientSideActors;
