"use client";

import type React from "react";

import { useState } from "react";
import { FormModal } from "./modal";
import type { Actor, Movie } from "@/types";
import { actorsApi } from "@/lib/api/actors";
import MultiSelect from "../multi-select";

interface AddActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (actor: Omit<Actor, "id">) => void;
  movies: Movie[];
}

export default function AddActorModal({
  isOpen,
  onClose,
  onSubmit,
  movies = [],
}: AddActorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    movies: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await actorsApi.createActor({
        name: formData.name,
        lastName: formData.lastName,
        movies: formData.movies.length > 0 ? formData.movies : undefined,
      });

      console.log("Actor created:", response);

      console.log("Actor added successfully:", response);

      onSubmit(formData);

      setFormData({ name: "", lastName: "", movies: [] });

      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error adding actor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Actor"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      size="md"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`input-field ${
                errors.name
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              placeholder="Enter first name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className={`input-field ${
                errors.lastName
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              placeholder="Enter last name"
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="movies"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Movies
          </label>
          <MultiSelect
            options={movies.map((movie) => ({
              value: movie.id,
              label: movie.title,
            }))}
            value={formData.movies}
            onChange={(movies) => setFormData((prev) => ({ ...prev, movies }))}
            placeholder="Select movies..."
            disabled={isSubmitting}
            error={errors.movies}
          />
        </div>

        <div className="text-sm text-gray-500">* Required fields</div>
      </div>
    </FormModal>
  );
}
