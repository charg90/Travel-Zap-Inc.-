"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import type { Movie, Actor } from "@/types";

interface MoviesActorsContextValue {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  actors: Actor[];
  setActors: Dispatch<SetStateAction<Actor[]>>;
}

const MoviesActorsContext = createContext<MoviesActorsContextValue | undefined>(
  undefined
);

export function MoviesActorsProvider({
  children,
  initialMovies = [],
  initialActors = [],
}: {
  children: React.ReactNode;
  initialMovies?: Movie[];
  initialActors?: Actor[];
}) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [actors, setActors] = useState<Actor[]>(initialActors);

  return (
    <MoviesActorsContext.Provider
      value={{ movies, setMovies, actors, setActors }}
    >
      {children}
    </MoviesActorsContext.Provider>
  );
}

export function useMoviesActors() {
  const context = useContext(MoviesActorsContext);
  if (!context) {
    throw new Error(
      "useMoviesActors must be used within a MoviesActorsProvider"
    );
  }
  return context;
}
