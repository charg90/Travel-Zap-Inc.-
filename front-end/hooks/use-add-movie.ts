// hooks/useCreateMovie.ts

import { useState } from "react";
import { moviesApi } from "@/lib/api/movies";
import type { Movie } from "@/types";

export function useAddMovie(onSuccess?: (movie: Movie) => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: Omit<Movie, "id" | "actors" | "ratings">) => {
    const newErrors: Record<string, string> = {};

    if (!data.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!data.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMovie = async (data: Omit<Movie, "id" | "actors">) => {
    if (!validate(data)) return;

    setIsSubmitting(true);
    try {
      const created = await moviesApi.createMovie(data);
      onSuccess?.(created);
    } catch (error: unknown) {
      console.error("Error adding movie:", error);
      if (error && typeof error === "object" && "message" in error) {
        setErrors({ submit: String((error as { message: string }).message) });
      } else {
        setErrors({ submit: "An unexpected error occurred." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createMovie,
    isSubmitting,
    errors,
    setErrors, // optionally exposed if needed
  };
}
