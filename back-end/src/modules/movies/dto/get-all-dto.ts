import { JSONMovie, Movie } from '../domain/movie.domain';
import { MovieMapper } from '../mappers/movie.mapper';

export class GetAllMoviesResponseDto {
  readonly movies: JSONMovie[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;

  constructor(movies: Movie[], total: number, page: number, limit: number) {
    this.movies = movies.map(MovieMapper.toJson);
    this.total = movies.length;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
