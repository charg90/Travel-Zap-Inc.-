"use client";

import { useState } from "react";
import { FormModal } from "./modal";
import type { Movie } from "@/types";
import { useAddMovie } from "@/hooks/use-add-movie";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movie: Omit<Movie, "id" | "ratings" | "actors">) => void;
}

export default function AddMovieModal({
  isOpen,
  onClose,
  onSubmit,
}: AddMovieModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ratings: 0,
  });
  const { createMovie, isSubmitting, errors } = useAddMovie(() => {
    onSubmit(formData);
    setFormData({ title: "", description: "", ratings: 0 });
    onClose();
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMovie(formData);
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Movie"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            id="title"
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
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
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
