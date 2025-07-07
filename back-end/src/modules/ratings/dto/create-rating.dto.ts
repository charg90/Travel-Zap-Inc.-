import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { IRatingProps } from '../domain/rating.domain';
import { Score } from '../domain/ratin.value-object';

export class CreateRatingDto implements IRatingProps {
  @IsUUID('4', { message: 'Movie ID must be a valid UUID' })
  movieId: string;

  @IsInt({ message: 'Score must be an integer' })
  @Min(1, { message: 'Score must be at least 1' })
  @Max(10, { message: 'Score must be at most 10' })
  score: Score;
  @IsOptional()
  comment?: string;
}
