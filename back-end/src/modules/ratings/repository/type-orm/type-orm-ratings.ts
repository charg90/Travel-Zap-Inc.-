import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingsRepository } from '../ratings.repository';
import { Rating as DomainRating } from '../../domain/rating.domain';
import { Rating as TypeORMRating } from '../../entities/rating.entity';
import { Actor as TypeORMActor } from '../../../actors/entities/actor.entity';
import { Movie as TypeORMMovie } from '../../../movies/entities/movie.entity';
import { RatingMapper } from '../../mappers/ratings.mapper';

@Injectable()
export class TypeORMRatingsRepository implements RatingsRepository {
  constructor(
    @InjectRepository(TypeORMRating)
    private readonly typeOrmRepository: Repository<TypeORMRating>,
    @InjectRepository(TypeORMMovie)
    private readonly typeOrmMovieRepository: Repository<TypeORMMovie>,
    @InjectRepository(TypeORMActor)
    private readonly typeOrmActorRepository: Repository<TypeORMActor>,
  ) {}

  async create(rating: DomainRating) {
    const typeOrmRating = RatingMapper.toTypeORM(rating);
    const savedRating = await this.typeOrmRepository.save(typeOrmRating);
    return RatingMapper.toDomain(savedRating);
  }

  async findAll(): Promise<DomainRating[]> {
    const ratings = await this.typeOrmRepository.find();
    return ratings.map((rating) => RatingMapper.toDomain(rating));
  }

  async findById(id: string): Promise<DomainRating | null> {
    const rating = await this.typeOrmRepository.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating with id ${id} not found`);
    }
    return RatingMapper.toDomain(rating);
  }

  async update(id: string, rating: DomainRating): Promise<DomainRating | null> {
    const existingRating = await this.typeOrmRepository.findOne({
      where: { id },
    });

    if (!existingRating) {
      return null;
    }

    const relatedMovie = await this.typeOrmMovieRepository.findOne({
      where: { id: rating.movieId },
    });

    if (!relatedMovie) {
      throw new Error(`Movie with id ${rating.movieId} not found`);
    }

    existingRating.score = rating.score.getValue();
    existingRating.comment = rating.comment;
    existingRating.movie = relatedMovie;

    const savedRating = await this.typeOrmRepository.save(existingRating);
    return RatingMapper.toDomain(savedRating);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.typeOrmRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
