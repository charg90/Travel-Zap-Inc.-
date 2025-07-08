import { actorsApi } from "@/lib/api/actors";
import React from "react";
import ClientSideActors from "./components/client-side-actors";
import { moviesApi } from "@/lib/api/movies";

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
  console.log("Actors:", actors);
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
    <ClientSideActors
      initialActors={actors}
      total={total}
      initialTotalPages={totalPages}
      movies={movies}
      page={1}
    />
  );
}

export default page;
