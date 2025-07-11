import ClientSideDashboard from "./component/client-side-dasboard";
import { actorsApi } from "@/lib/api/actors";
import { getMovies } from "@/lib/api/server-side-fetch";

export default async function Dashboard() {
  const { movies, page, totalPages } = await getMovies({
    page: 1,
    limit: 8,
    sortBy: "rating",
    sortOrder: "desc",
  });

  const { actors } = await actorsApi.getActors(
    {
      page: 1,
      limit: 100,
      sortBy: "name",
      sortOrder: "ASC",
    },
    true
  );

  return (
    <ClientSideDashboard
      initialMovies={movies}
      totalPagesDb={totalPages}
      page={page}
      actors={actors}
    />
  );
}
