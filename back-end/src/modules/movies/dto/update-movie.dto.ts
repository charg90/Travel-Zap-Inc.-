import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { IMovieProps, JSONMovie, Movie } from '../domain/movie.domain';
import { MovieMapper } from '../mappers/movie.mapper';
import { Description, Title } from '../domain/movies.value-object';

export class UpdateMovieDto implements Partial<IMovieProps> {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: Title;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: Description;

  @IsArray()
  @IsOptional()
  actors?: string[];

  @IsArray()
  @IsOptional()
  ratings?: number[];
}
export class UpdateMovieResponseDto {
  readonly movie: JSONMovie;

  constructor(movie: Movie) {
    this.movie = MovieMapper.toJson(movie);
  }
}
