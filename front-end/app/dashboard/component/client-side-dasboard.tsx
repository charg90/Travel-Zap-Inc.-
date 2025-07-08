"use client";
import AddMovieModal from "@/components/modals/add-movie-modal";
import MovieCard from "@/components/movie-card";
import Pagination from "@/components/pagination";
import { Actor, Movie } from "@/types";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  initialMovies: Movie[];
  totalPagesDb: number;
  page: number;
  actors: Actor[];
};

function ClientSideDashboard({
  initialMovies,
  totalPagesDb,
  page,
  actors,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState(initialMovies);
  const [totalPages, setTotalPages] = useState(totalPagesDb);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOnSubmit = (movie: Omit<Movie, "id" | "ratings" | "actors">) => {
    console.log(movie);

    setMovies((prevMovies) => [
      ...prevMovies,
      { ...movie, id: Date.now().toString(), ratings: 0, actors: [] },
    ]);
  };
  useEffect(() => {
    setMovies(initialMovies);
  }, [initialMovies, totalPagesDb, page]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Movies</h1>
          <p className="text-gray-600 mt-1">
            Discover and explore amazing movies
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
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Movie</span>
          </button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        <AddMovieModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleOnSubmit}
          actors={actors}
        />
      </div>
    </>
  );
}

export default ClientSideDashboard;
