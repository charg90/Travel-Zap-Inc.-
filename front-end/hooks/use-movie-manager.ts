import { useEffect, useState } from "react";
import { moviesApi } from "@/lib/api/movies";
import type { Movie } from "@/types";
import { useDebounce } from "./use-debounce";

export function useMoviesManager(
  initialMovies: Movie[],
  initialTotalPages: number
) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  useEffect(() => {
    const fetchMovies = async () => {
      const { movies, totalPages } = await moviesApi.getMovies({
        page: currentPage,
        search: debouncedSearch,
        limit: 8,
        sortBy: "rating",
        sortOrder: "desc",
      });

      setMovies(movies);
      setTotalPages(totalPages);
    };

    fetchMovies();
  }, [debouncedSearch, currentPage]);

  const handleAddMovie = (movie: Omit<Movie, "id" | "ratings" | "actors">) => {
    setMovies((prev) => [
      ...prev,
      { ...movie, id: Date.now().toString(), ratings: 0, actors: [] },
    ]);
  };

  const handleUpdateMovie = (updatedMovie: Movie) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === updatedMovie.id ? { ...movie, ...updatedMovie } : movie
      )
    );
  };

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    movies,
    totalPages,
    handleAddMovie,
    handleUpdateMovie,
  };
}
