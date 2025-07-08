"use client";

import type React from "react";

import { useState, useCallback, useMemo, useEffect } from "react";
import { FormModal } from "./modal";
import type { Actor, Movie } from "@/types";
import MultiSelect from "../multi-select";
import { useMoviesActors } from "@/context/actors-context";
import { actorsApi } from "@/lib/api/actors";
import { revalidateActors } from "@/actions/revalidate-actor";

interface EditActorModalProps {
  isOpen: boolean;
  onClose: () => void;
  actor: Actor;
}

export default function EditActorModal({
  isOpen,
  onClose,
  actor,
}: EditActorModalProps) {
  const { movies: movieFromContext } = useMoviesActors();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    movies: [] as Movie[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicializar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && actor && movieFromContext.length > 0) {
      // Encontrar las películas que coinciden con las del actor
      const actorMovies = actor.movies
        ? movieFromContext.filter((movie) =>
            actor.movies!.includes(movie.title)
          )
        : [];

      setFormData({
        name: actor.name || "",
        lastName: actor.lastName || "",
        movies: actorMovies,
      });
      setErrors({});
    }
  }, [isOpen, actor, movieFromContext]); // Usar actor en lugar de actor.id

  const movieOptions = useMemo(
    () =>
      movieFromContext.map((movie) => ({
        value: movie.id,
        label: movie.title,
        data: movie,
      })),
    [movieFromContext]
  );

  // Corregir el tipo: los IDs pueden ser number o string
  const selectedMovieValues = useMemo(
    () => formData.movies.map((movie) => movie.id),
    [formData.movies]
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name, formData.lastName]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);
      try {
        const updatedActor = {
          name: formData.name,
          lastName: formData.lastName,
          movies: formData.movies.map((movie) => movie.id),
        };

        const response = await actorsApi.updateActor(actor.id, updatedActor);

        await revalidateActors();
        console.log("Actor updated successfully:", response);

        handleClose();
      } catch (error) {
        console.error("Error updating actor:", error);
        setErrors({ submit: "An error occurred while updating the actor" });
      } finally {
        setIsSubmitting(false);
      }
    },
    [actor, formData, validateForm]
  );

  const handleClose = useCallback(() => {
    setFormData({ name: "", lastName: "", movies: [] });
    setErrors({});
    onClose();
  }, [onClose]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleMoviesChange = useCallback(
    (selectedIds: (string | number)[]) => {
      const selectedMovies = movieFromContext.filter((movie) =>
        selectedIds.includes(movie.id)
      );
      setFormData((prev) => ({
        ...prev,
        movies: selectedMovies,
      }));
    },
    [movieFromContext]
  );

  const currentActorInfo = useMemo(
    () => (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Current Actor Information
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <span className="font-medium">Name:</span> {actor.name}{" "}
            {actor.lastName}
          </p>
          <p>
            <span className="font-medium">Movies:</span>{" "}
            {actor.movies?.length || 0} movies
          </p>
          <p>
            <span className="font-medium">ID:</span> #{actor.id}
          </p>
        </div>
      </div>
    ),
    [actor]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Actor"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText="Update Actor"
      size="md"
    >
      <div className="space-y-6">
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`input-field ${
                errors.name ? "border-red-500 focus:ring-red-500" : ""
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
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`input-field ${
                errors.lastName ? "border-red-500 focus:ring-red-500" : ""
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
            options={movieOptions}
            value={selectedMovieValues}
            onChange={handleMoviesChange}
            placeholder="Select movies..."
            disabled={isSubmitting}
            error={errors.movies}
          />
          <p className="mt-1 text-sm text-gray-500">
            Select the movies this actor has appeared in
          </p>
        </div>

        {currentActorInfo}

        <div className="text-sm text-gray-500">* Required fields</div>
      </div>
    </FormModal>
  );
}
