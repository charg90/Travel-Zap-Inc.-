import { apiClient, serverApiClient } from "../api-client";
import type { Movie } from "@/types";

export interface MovieFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "title" | "rating" | "id";
  sortOrder?: "asc" | "desc";
}

export interface MoviesResponse {
  movies: Movie[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateMovieData {
  title: string;
  description: string;
  actors?: string;
  ratings: number;
}

export interface UpdateMovieData {
  title?: string;
  description?: string;
  actors?: string;
  rating?: number;
}

class MoviesApi {
  private client = apiClient;
  private serverClient = serverApiClient;

  async getMovies(
    filters?: MovieFilters,
    isServer = false
  ): Promise<MoviesResponse> {
    const client = isServer ? this.serverClient : this.client;
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    return client.get<MoviesResponse>(`/movies?${params.toString()}`);
  }

  async getMovie(id: number, isServer = false): Promise<Movie> {
    const client = isServer ? this.serverClient : this.client;
    return client.get<Movie>(`/movies/${id}`);
  }

  async createMovie(data: CreateMovieData): Promise<Movie> {
    return this.client.post<Movie, CreateMovieData>("/movies", data);
  }

  async updateMovie(id: string, data: UpdateMovieData): Promise<Movie> {
    return this.client.patch<Movie, UpdateMovieData>(`/movies/${id}`, data);
  }

  async deleteMovie(id: number): Promise<void> {
    return this.client.delete<void>(`/movies/${id}`);
  }

  async searchMovies(query: string, isServer = false): Promise<Movie[]> {
    const client = isServer ? this.serverClient : this.client;
    return client.get<Movie[]>(`/movies/search?q=${encodeURIComponent(query)}`);
  }

  async getMoviesByActor(actorId: number, isServer = false): Promise<Movie[]> {
    const client = isServer ? this.serverClient : this.client;
    return client.get<Movie[]>(`/movies/actor/${actorId}`);
  }
  async submitRating(movieId: string, score: number) {
    return this.client.post("ratings", {
      movieId,
      score,
    });
  }
}

export const moviesApi = new MoviesApi();
