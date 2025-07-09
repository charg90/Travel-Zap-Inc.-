import { useCallback, useEffect, useState } from "react";
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

  const fetchActors = useCallback(async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "12",
    });

    if (searchTerm) {
      params.append("search", searchTerm);
    }

    try {
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
    } catch (error) {
      console.error("Error fetching actors:", error);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchActors();
  }, [currentPage, searchTerm, fetchActors]);

  const updateActor = (updatedActor: Actor) => {
    setActors((prevActors) =>
      prevActors.map((actor) => {
        const currentId = String(actor.id);
        const updatedId = String(updatedActor.id);

        return currentId === updatedId
          ? {
              ...updatedActor,
              id: updatedId,
              movies: Array.isArray(updatedActor.movies)
                ? [...updatedActor.movies]
                : [],
            }
          : actor;
      })
    );
  };

  return {
    actors,
    setActors,
    currentPage,
    totalPages,
    searchTerm,
    setCurrentPage,
    setSearchTerm,
    refreshActors: fetchActors,
    updateActor,
  };
}
