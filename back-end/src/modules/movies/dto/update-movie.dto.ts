import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateMoviePropsDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsOptional()
  actors?: string[];

  @IsOptional()
  ratings?: number[];
}

export class UpdateMovieDto {
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateMoviePropsDto)
  @IsOptional()
  movie?: UpdateMoviePropsDto;
}
