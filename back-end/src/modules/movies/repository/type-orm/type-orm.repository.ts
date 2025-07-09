import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MoviesRepository } from '../movies.repository';
import { Movie as DomainMovie } from '../../domain/movie.domain';
import { Movie as TypeORMMovie } from '../../entities/movie.entity';
import { Actor as TypeORMActor } from './../../../actors/entities/actor.entity';
import { MovieMapper } from '../../mappers/movie.mapper';

@Injectable()
export class TypeORMMoviesRepository implements MoviesRepository {
  constructor(
    @InjectRepository(TypeORMMovie)
    private readonly typeOrmRepository: Repository<TypeORMMovie>,
    @InjectRepository(TypeORMActor)
    private readonly typeOrmActorRepository: Repository<TypeORMActor>,
  ) {}

  async create(movie: DomainMovie): Promise<DomainMovie> {
    const typeOrmMovie = MovieMapper.toTypeORM(movie);
    const savedMovie = await this.typeOrmRepository.save(typeOrmMovie);
    return MovieMapper.toDomain(savedMovie);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ movies: DomainMovie[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { title: ILike(`%${search}%`) }, // podés agregar más campos si querés
        ]
      : {};

    const [movies, total] = await this.typeOrmRepository.findAndCount({
      where,
      relations: ['actors', 'ratings'],
      skip,
      take: limit,
    });

    return {
      movies: movies.map((movie) => MovieMapper.toDomain(movie)),
      total,
    };
  }

  async findById(id: string): Promise<DomainMovie | null> {
    try {
      const movie = await this.typeOrmRepository.findOne({
        where: { id },
        relations: ['actors', 'ratings'],
      });
      if (!movie) {
        throw new NotFoundException(`Movie with id ${id} not found`);
      }

      return MovieMapper.toDomain(movie);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
  }

  async update(id: string, movie: DomainMovie): Promise<DomainMovie | null> {
    const existingMovie = await this.typeOrmRepository.findOneBy({
      id,
    });
    if (!existingMovie) {
      return null;
    }
    if (movie.actors?.length) {
      const actors = await this.typeOrmActorRepository.findByIds(movie.actors);
      existingMovie.actors = actors;
    }

    existingMovie.title = movie.title.getValue();
    existingMovie.description = movie.description.getValue();

    const updatedMovie = await this.typeOrmRepository.save(existingMovie);
    return MovieMapper.toDomain(updatedMovie);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.typeOrmRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
