import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesRepository } from '../movies.repository';
import { Movie as DomainMovie } from '../../domain/movie.domain';
import { Movie as TypeORMMovie } from '../../entities/movie.entity';
import { MovieMapper } from '../../mappers/movie.mapper';

@Injectable()
export class TypeORMMoviesRepository implements MoviesRepository {
  constructor(
    @InjectRepository(TypeORMMovie)
    private readonly typeOrmRepository: Repository<TypeORMMovie>,
  ) {}

  async create(movie: DomainMovie): Promise<DomainMovie> {
    const typeOrmMovie = MovieMapper.toTypeORM(movie);
    const savedMovie = await this.typeOrmRepository.save(typeOrmMovie);
    return MovieMapper.toDomain(savedMovie);
  }

  async findAll(): Promise<DomainMovie[]> {
    const movies = await this.typeOrmRepository.find({
      relations: ['actors', 'ratings'],
    });
    return movies.map((movie) => MovieMapper.toDomain(movie));
  }

  async findById(id: string): Promise<DomainMovie | null> {
    const movie = await this.typeOrmRepository.findOne({
      where: { id },
      relations: ['actors', 'ratings'],
    });

    if (!movie) {
      return null;
    }

    return MovieMapper.toDomain(movie);
  }

  async update(
    id: string,
    movie: Partial<DomainMovie>,
  ): Promise<DomainMovie | null> {
    // First check if movie exists
    const existingMovie = await this.typeOrmRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!existingMovie) {
      return null;
    }

    // Update only the allowed fields
    if (movie.title) {
      existingMovie.title = movie.title;
    }
    if (movie.description) {
      existingMovie.description = movie.description;
    }
    // Note: Updating actors and ratings would require additional logic
    // to handle the relationships properly

    // Save the updated movie
    const updatedMovie = await this.typeOrmRepository.save(existingMovie);

    // Return the updated movie
    return MovieMapper.toDomain(updatedMovie);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.typeOrmRepository.delete(parseInt(id, 10));
    return result.affected ? result.affected > 0 : false;
  }
}
