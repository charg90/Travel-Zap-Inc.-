import { useEffect, useState } from "react";
import { moviesApi } from "@/lib/api/movies";
import type { Movie } from "@/types";
import { useDebounce } from "./use-debounce";
import { toast } from "sonner";

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

  const handleAddMovie = (movie: Omit<Movie, "ratings" | "actors">) => {
    setMovies((prev) => [
      ...prev,
      { ...movie, id: movie.id, ratings: 0, actors: [] },
    ]);
  };

  const handleUpdateMovie = (updatedMovie: Movie) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === updatedMovie.id ? { ...movie, ...updatedMovie } : movie
      )
    );
  };
  const createMovie = async (data: Omit<Movie, "id" | "actors">) => {
    try {
      const movieData = {
        title: data.title,
        description: data.description,
        ratings: data.ratings || 0,
      };
      const created = await moviesApi.createMovie(movieData);
      setMovies((prev) => [created, ...prev]);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        console.error("API Error:", (error as { message: string }).message);
        toast.error("API occurred");
      } else {
        console.error("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    }
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
    createMovie,
  };
}
