import { actorsApi } from "@/lib/api/actors";
import React from "react";
import ClientSideActors from "./components/client-side-actors";
import { moviesApi } from "@/lib/api/movies";
import { MoviesActorsProvider } from "@/context/actors-context";

async function page() {
  const { actors, total, totalPages } = await actorsApi.getActors(
    {
      page: 1,
      limit: 10,
      sortBy: "name",
      sortOrder: "asc",
    },
    true
  );
  const { movies } = await moviesApi.getMovies(
    {
      page: 1,
      limit: 8,
      sortBy: "rating",
      sortOrder: "desc",
    },
    true
  );
  return (
    <MoviesActorsProvider initialActors={actors} initialMovies={movies}>
      <ClientSideActors
        initialActors={actors}
        total={total}
        initialTotalPage={totalPages}
        movies={movies}
        page={1}
      />
    </MoviesActorsProvider>
  );
}

export default page;
