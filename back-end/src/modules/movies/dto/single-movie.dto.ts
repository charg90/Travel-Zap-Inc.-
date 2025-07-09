import { JSONMovie, Movie } from '../domain/movie.domain';
import { MovieMapper } from '../mappers/movie.mapper';

export class SingleMovieResponseDto {
  readonly movie: JSONMovie;

  constructor(movie: Movie) {
    this.movie = MovieMapper.toJson(movie);
  }
}
