// __tests__/useMoviesManager.test.tsx
import { renderHook, act } from "@testing-library/react";

import type { Movie } from "@/types";
import { moviesApi } from "@/lib/api/movies";
import { useMoviesManager } from "@/hooks/use-movie-manager";
import { waitFor } from "@testing-library/react";

// Mock del API
jest.mock("@/lib/api/movies", () => ({
  moviesApi: {
    getMovies: jest.fn(),
  },
}));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    description: "A mind-bending thriller",
    ratings: 9,
    actors: ["Leonardo DiCaprio"],
  },
  {
    id: "2",
    title: "The Matrix",
    description: "Sci-fi classic",
    ratings: 8.5,
    actors: ["Keanu Reeves"],
  },
];

describe("useMoviesManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with initial movies and pages", () => {
    const { result } = renderHook(() => useMoviesManager(mockMovies, 5));

    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.totalPages).toBe(5);
  });

  it("should update movies when handleUpdateMovie is called", () => {
    const { result } = renderHook(() => useMoviesManager(mockMovies, 1));

    const updatedMovie: Movie = {
      ...mockMovies[0],
      title: "Inception Updated",
    };

    act(() => {
      result.current.handleUpdateMovie(updatedMovie);
    });

    expect(result.current.movies[0].title).toBe("Inception Updated");
  });

  it("should add a movie with handleAddMovie", () => {
    const { result } = renderHook(() => useMoviesManager(mockMovies, 1));

    const newMovie = {
      title: "New Movie",
      description: "Test movie",
    };

    act(() => {
      result.current.handleAddMovie(newMovie);
    });

    expect(result.current.movies).toHaveLength(3);
    expect(result.current.movies[2].title).toBe("New Movie");
    expect(result.current.movies[2].ratings).toBe(0);
    expect(result.current.movies[2].actors).toEqual([]);
  });

  it("should fetch movies when search term changes (debounced)", async () => {
    const mockGetMovies = moviesApi.getMovies as jest.Mock;
    mockGetMovies.mockResolvedValue({
      movies: mockMovies,
      totalPages: 2,
    });

    const { result } = renderHook(() => useMoviesManager([], 1));

    act(() => {
      result.current.setSearchTerm("matrix");
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(moviesApi.getMovies).toHaveBeenCalledWith({
        page: 1,
        search: "matrix",
        limit: 8,
        sortBy: "rating",
        sortOrder: "desc",
      });
    });

    expect(result.current.movies).toEqual(mockMovies);
    expect(result.current.totalPages).toBe(2);
  });
});
