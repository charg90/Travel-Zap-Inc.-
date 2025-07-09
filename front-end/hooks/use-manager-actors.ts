import { useCallback, useEffect, useState } from "react";
import { Actor } from "@/types";
import { actorsApi } from "@/lib/api/actors";
import { useDebounce } from "./use-debounce";
import { toast } from "sonner";

type UseManagerActorsOptions = {
  initialActors: Actor[];
  initialTotalPages: number;
  initialPage: number;
};

export function useManagerActors({
  initialActors,
  initialTotalPages,
  initialPage,
}: UseManagerActorsOptions) {
  const [actors, setActors] = useState(initialActors);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm);

  const fetchActors = useCallback(async () => {
    try {
      const { actors: loadedActors, totalPages: newTotalPages } =
        await actorsApi.getActors({
          search: debouncedSearchTerm,
          page: currentPage,
          limit: 8,
          sortBy: "name",
          sortOrder: "ASC",
        });

      setActors(loadedActors);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error("Error fetching actors:", error);
      toast.error("Error fetching actors");
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchActors();
  }, [fetchActors]);

  const updateActor = (updatedActor: Actor) => {
    setActors((prevActors) =>
      prevActors.map((actor) =>
        String(actor.id) === String(updatedActor.id)
          ? {
              ...updatedActor,
              movies: Array.isArray(updatedActor.movies)
                ? [...updatedActor.movies]
                : [],
            }
          : actor
      )
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
