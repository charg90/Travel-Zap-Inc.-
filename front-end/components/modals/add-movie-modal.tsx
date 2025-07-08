"use client";

import type React from "react";

import { useState } from "react";
import { FormModal } from "./modal";
import type { Movie } from "@/types";

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movie: Omit<Movie, "id" | "ratings">) => void;
}

export default function AddMovieModal({
  isOpen,
  onClose,
  onSubmit,
}: AddMovieModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    actors: "",
    rating: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.actors.trim()) {
      newErrors.actors = "At least one actor is required";
    }

    if (formData.rating < 0 || formData.rating > 10) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSubmit(formData);

      setFormData({ title: "", description: "", actors: "", rating: 0 });
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error adding movie:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Title */}
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

        {/* Description */}
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

        {/* Actors and Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="actors"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Actors *
            </label>
            <input
              id="actors"
              type="text"
              value={formData.actors}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, actors: e.target.value }))
              }
              className={`input-field ${
                errors.actors
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              placeholder="e.g., Tom Hanks, Meryl Streep"
              disabled={isSubmitting}
            />
            {errors.actors && (
              <p className="mt-1 text-sm text-red-600">{errors.actors}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rating *
            </label>
            <input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rating: Number.parseFloat(e.target.value) || 0,
                }))
              }
              className={`input-field ${
                errors.rating
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              placeholder="0.0"
              disabled={isSubmitting}
            />
            {errors.rating && (
              <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-500">* Required fields</div>
      </div>
    </FormModal>
  );
}
