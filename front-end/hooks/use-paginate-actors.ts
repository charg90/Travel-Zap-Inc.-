import { useEffect, useState } from "react";
import { Actor } from "@/types";
import { actorsApi } from "@/lib/api/actors";

type UsePaginatedActorsOptions = {
  initialActors: Actor[];
  initialTotalPages: number;
  initialPage: number;
};

export function usePaginatedActors({
  initialActors,
  initialTotalPages,
  initialPage,
}: UsePaginatedActorsOptions) {
  const [actors, setActors] = useState(initialActors);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchActors = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "12",
    });

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    const { actors: loadedActors, totalPages: newTotalPages } =
      await actorsApi.getActors({
        search: searchTerm,
        page: currentPage,
        limit: 8,
        sortBy: "name",
        sortOrder: "ASC",
      });

    setActors(loadedActors);
    setTotalPages(newTotalPages);
  };

  useEffect(() => {
    fetchActors();
  }, [currentPage, searchTerm]);

  return {
    actors,
    setActors,
    currentPage,
    totalPages,
    searchTerm,
    setCurrentPage,
    setSearchTerm,
    refreshActors: fetchActors,
  };
}
