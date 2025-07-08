import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, CreateMovieResponseDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './repository/movies.repository';
import { IMovieProps, Movie } from './domain/movie.domain';
import { MovieException } from './exceptions/movie.exeptions';
import { GetAllMoviesResponseDto } from './dto/get-all-dto';
import { SingleMovieResponseDto } from './dto/single-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async create(
    createMovieDto: CreateMovieDto,
  ): Promise<CreateMovieResponseDto> {
    try {
      const movie = Movie.create(createMovieDto);

      const createdMovie = await this.moviesRepository.create(movie);

      return new CreateMovieResponseDto(createdMovie);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new MovieException(`Failed to create movie: ${errorMessage}`, 500);
    }
  }

  async findAll(): Promise<GetAllMoviesResponseDto> {
    try {
      const movies = await this.moviesRepository.findAll();

      return new GetAllMoviesResponseDto(movies);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new MovieException(
        `Failed to retrieve movies: ${errorMessage}`,
        500,
      );
    }
  }

  async findOne(id: string): Promise<SingleMovieResponseDto> {
    try {
      const movie = await this.moviesRepository.findById(id);

      if (!movie) {
        throw new NotFoundException(`Movie with ID ${id} not found`);
      }
      return new SingleMovieResponseDto(movie);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new MovieException(
        `Failed to retrieve movie with ID ${id}: ${errorMessage}`,
        500,
      );
    }
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<SingleMovieResponseDto | MovieException> {
    const existingMovie = await this.moviesRepository.findById(id);
    if (!existingMovie) {
      throw new MovieException(`Movie with ID ${id} not found`, 404);
    }

    try {
      const updateData: Partial<IMovieProps> = {};

      if (updateMovieDto.title !== undefined) {
        updateData.title = updateMovieDto.title;
      }
      if (updateMovieDto.description !== undefined) {
        updateData.description = updateMovieDto.description;
      }
      if (updateMovieDto.actors !== undefined) {
        updateData.actors = updateMovieDto.actors;
      }
      if (updateMovieDto.ratings !== undefined) {
        updateData.ratings = updateMovieDto.ratings;
      }

      const updatedMovie = Movie.create(
        {
          ...existingMovie.props,
          ...updateData,
        },
        existingMovie.id,
      );

      const result = await this.moviesRepository.update(id, updatedMovie);

      if (!result) {
        throw new MovieException(`Movie with ID ${id} not found`, 404);
      }

      return new SingleMovieResponseDto(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new MovieException(
        `Failed to update movie with ID ${id}: ${errorMessage}`,
        500,
      );
    }
  }
  async remove(id: string): Promise<{ success: boolean }> {
    const existingMovie = await this.moviesRepository.findById(id);
    if (!existingMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    await this.moviesRepository.delete(id);

    return { success: true };
  }
}
