"use client";

import type React from "react";

import { useState } from "react";
import { moviesApi } from "@/lib/api/movies";
import type { Movie } from "@/types";

interface EditMovieFormData {
  title: string;
  description: string;
}

interface UseEditMovieReturn {
  formData: EditMovieFormData;
  setFormData: React.Dispatch<React.SetStateAction<EditMovieFormData>>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  handleSubmit: (
    e: React.FormEvent,
    movieId: string,
    onSuccess: (movie: Movie) => void
  ) => Promise<void>;
  resetForm: (movie: Movie) => void;
  updateField: (field: keyof EditMovieFormData, value: string | number) => void;
  initializeForm: (movie: Movie) => void;
}

export function useEditMovie(): UseEditMovieReturn {
  const [formData, setFormData] = useState<EditMovieFormData>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const initializeForm = (movie: Movie) => {
    setFormData({
      title: movie.title,
      description: movie.description,
    });
    setErrors({});
  };

  const resetForm = (movie: Movie) => {
    initializeForm(movie);
  };

  const updateField = (
    field: keyof EditMovieFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    movieId: string,
    onSuccess: (movie: Movie) => void
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await moviesApi.updateMovie(movieId, {
        title: formData.title,
        description: formData.description,
      });

      console.log("Movie updated successfully:", response);

      const updatedMovie: Movie = {
        id: movieId,
        title: formData.title,
        description: formData.description,
        actors: response.actors || [],
        ratings: response.ratings || 0,
      };

      onSuccess(updatedMovie);
    } catch (error) {
      console.error("Error updating movie:", error);

      if (error instanceof Error) {
        setErrors({ submit: error.message });
      } else if (typeof error === "string") {
        setErrors({ submit: error });
      } else {
        setErrors({ submit: "An error occurred while updating the movie" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    handleSubmit,
    resetForm,
    updateField,
    initializeForm,
  };
}
