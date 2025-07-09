"use client";

import { useState, useEffect } from "react";
import { FormModal } from "./modal";
import type { Movie } from "@/types";
import { moviesApi } from "@/lib/api/movies";

interface EditMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onUpdate: (updatedMovie: Movie) => void;
}

export default function EditMovieModal({
  isOpen,
  onClose,
  movie,
  onUpdate,
}: EditMovieModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, movie]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const updatedMovie = {
        title: formData.title,
        description: formData.description,
      };

      await moviesApi.updateMovie(movie.id, updatedMovie);
      onUpdate({ ...movie, ...updatedMovie });

      onClose();
    } catch {
      setErrors({ title: "Failed to update movie" });
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Movie"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="edit-title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            id="edit-title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`input-field ${
              errors.title
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }`}
            placeholder="Enter movie title"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="edit-description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="edit-description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            className={`input-field resize-none ${
              errors.description
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }`}
            placeholder="Enter movie description"
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="text-sm text-gray-500">* Required fields</div>
      </div>
    </FormModal>
  );
}
