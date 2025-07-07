import { JSONMovie, Movie } from '../domain/movie.domain';
import { MovieMapper } from '../mappers/movie.mapper';

export class GetAllMoviesResponseDto {
  readonly movies: JSONMovie[];

  constructor(movies: Movie[]) {
    this.movies = movies.map(MovieMapper.toJson);
  }
}
