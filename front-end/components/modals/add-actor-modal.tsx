"use client";

import type React from "react";

import { useState } from "react";
import { FormModal } from "./modal";
import type { Actor } from "@/types";
import { actorsApi } from "@/lib/api/actors";

interface AddActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (actor: Omit<Actor, "id">) => void;
}

export default function AddActorModal({
  isOpen,
  onClose,
  onSubmit,
}: AddActorModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    movies: [] as string[],
  });
  const [movieInput, setMovieInput] = useState("");
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
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
      });
      console.log("Actor added successfully:", response);
      onSubmit(formData);

      setFormData({ name: "", lastName: "", movies: [] });
      setMovieInput("");
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error adding actor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMovie = () => {
    if (movieInput.trim() && !formData.movies.includes(movieInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        movies: [...prev.movies, movieInput.trim()],
      }));
      setMovieInput("");
    }
  };

  const removeMovie = (movieToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      movies: prev.movies.filter((movie) => movie !== movieToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMovie();
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
          <div className="flex gap-2 mb-3">
            <input
              id="movies"
              type="text"
              value={movieInput}
              onChange={(e) => setMovieInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field flex-1"
              placeholder="Enter movie name and press Enter"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={addMovie}
              disabled={!movieInput.trim() || isSubmitting}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>

          {formData.movies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.movies.map((movie, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {movie}
                  <button
                    type="button"
                    onClick={() => removeMovie(movie)}
                    disabled={isSubmitting}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">* Required fields</div>
      </div>
    </FormModal>
  );
}
