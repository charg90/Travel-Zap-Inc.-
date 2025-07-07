import { Movie } from '../domain/movie.domain';

export abstract class MoviesRepository {
  abstract create(movie: Movie): Promise<Movie>;
  abstract findAll(): Promise<Movie[]>;
  abstract findById(id: string): Promise<Movie | null>;
  abstract update(id: string, movie: Movie): Promise<Movie | null>;
  abstract delete(id: string): Promise<boolean>;
}
