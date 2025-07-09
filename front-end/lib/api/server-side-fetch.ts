import { MovieFilters, MoviesResponse } from "./movies";
import type { ActorFilters, ActorsResponse } from "./actors";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getMovies(
  filters?: MovieFilters
): Promise<MoviesResponse> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  const res = await fetch(
    `${process.env.API_URL}/movies?${params.toString()}`,

    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      next: { tags: ["movies"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export async function getActors(
  filters?: ActorFilters
): Promise<ActorsResponse> {
  const params = new URLSearchParams();

  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  const res = await fetch(
    `${process.env.API_URL}/actors?${params.toString()}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      next: { tags: ["actors"] },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch actors");
  }

  return res.json();
}
