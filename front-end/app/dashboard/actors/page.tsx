import { actorsApi } from "@/lib/api/actors";
import React from "react";
import ClientSideActors from "./components/client-side-actors";

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
  return (
    <ClientSideActors
      initialActors={actors}
      total={total}
      initialTotalPages={totalPages}
      page={1}
    />
  );
}

export default page;
