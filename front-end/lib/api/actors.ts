import { apiClient, serverApiClient } from "../api-client";
import type { Actor } from "@/types";

export interface ActorFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "lastName" | "id";
  sortOrder?: "ASC" | "DESC";
}

export interface ActorsResponse {
  actors: Actor[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateActorData {
  name: string;
  lastName: string;
  movies?: string[];
}

export interface UpdateActorData {
  name?: string;
  lastName?: string;
  movies?: string[];
}

class ActorsApi {
  private client = apiClient;
  private serverClient = serverApiClient;

  // Get all actors with filters
  async getActors(
    filters?: ActorFilters,
    isServer = false
  ): Promise<ActorsResponse> {
    const client = isServer ? this.serverClient : this.client;
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    return client.get<ActorsResponse>(`/actors?${params.toString()}`);
  }

  async getActor(id: number, isServer = false): Promise<Actor> {
    const client = isServer ? this.serverClient : this.client;
    return client.get<Actor>(`/actors/${id}`);
  }

  // Create new actor
  async createActor(data: CreateActorData): Promise<Actor> {
    const response = await this.client.post<{ actor: Actor }, CreateActorData>(
      "/actors",
      data
    );
    return response.actor;
  }

  // Update actor
  async updateActor(id: string, data: UpdateActorData): Promise<Actor> {
    return this.client.patch<Actor, UpdateActorData>(`/actors/${id}`, data);
  }

  // Delete actor
  async deleteActor(id: number): Promise<void> {
    return this.client.delete<void>(`/actors/${id}`);
  }

  // Search actors
  async searchActors(query: string, isServer = false): Promise<Actor[]> {
    const client = isServer ? this.serverClient : this.client;
    return client.get<Actor[]>(`/actors/search?q=${encodeURIComponent(query)}`);
  }

  // Get actors by movie
  async getActorsByMovie(movieId: number, isServer = false): Promise<Actor[]> {
    const client = isServer ? this.serverClient : this.client;
    return client.get<Actor[]>(`/actors/movie/${movieId}`);
  }
  // Add actor to movie
  async addActorToMovie(actorId: string, movieId: string): Promise<void> {
    return this.client.post<void>(
      `/actors/${actorId}/add-to-movie/${movieId}`,
      {}
    );
  }
}

export const actorsApi = new ActorsApi();
