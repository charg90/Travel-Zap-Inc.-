import { moviesApi } from "@/lib/api/movies";
import ClientSideDashboard from "./component/client-side-dasboard";

export default async function Dashboard() {
  const { movies, totalPages, page } = await moviesApi.getMovies(
    {
      page: 1,
      limit: 8,
      sortBy: "rating",
      sortOrder: "desc",
    },
    true
  );

  return (
    <div className="space-y-6 w-full">
      <ClientSideDashboard
        initialMovies={movies}
        totalPagesDb={totalPages}
        page={page}
      />
    </div>
  );
}
