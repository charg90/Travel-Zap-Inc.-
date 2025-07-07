import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, CreateMovieResponseDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesRepository } from './repository/movies.repository';
import { Movie } from './domain/movie.domain';
import { MovieException } from './exceptions/movie.exeptions';

@Injectable()
export class MoviesService {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async create(
    createMovieDto: CreateMovieDto,
  ): Promise<CreateMovieResponseDto | MovieException> {
    try {
      const movie = Movie.create(createMovieDto);
      const createdMovie = await this.moviesRepository.create(movie);

      return new CreateMovieResponseDto(createdMovie);
    } catch (error) {
      return new MovieException(
        `Failed to create movie: ${error.message}`,
        500,
      );
    }
  }

  async findAll(): Promise<Movie[]> {
    try {
      return await this.moviesRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch movies: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  // async update(id: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
  //   // Check if movie exists
  //   const existingMovie = await this.moviesRepository.findById(id);
  //   if (!existingMovie) {
  //     throw new NotFoundException(`Movie with ID ${id} not found`);
  //   }

  //   // Update only the provided fields
  //   const updateData: Partial<Movie> = {};
  //   if (updateMovieDto.movie?.title !== undefined) {
  //     updateData.title = updateMovieDto.movie.title;
  //   }
  //   if (updateMovieDto.movie?.description !== undefined) {
  //     updateData.description = updateMovieDto.movie.description;
  //   }

  //   const updatedMovie = await this.moviesRepository.update(id, updateData);
  //   if (!updatedMovie) {
  //     throw new Error(`Failed to update movie with ID ${id}`);
  //   }
  //   return updatedMovie;
  // }

  async remove(id: string): Promise<{ success: boolean }> {
    const result = await this.moviesRepository.delete(id);
    if (!result) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return { success: true };
  }
}
