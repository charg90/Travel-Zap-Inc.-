import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorRepository } from '../actor.repository';
import { Actor as DomainActor } from '../../domain/actors.domain';
import { Actor as TypeORMActor } from '../../entities/actor.entity';
import { Movie as TypeORMMovie } from '../../../movies/entities/movie.entity';
import { ActorMapper } from '../../mappers/actor.mappers';

@Injectable()
export class TypeORMActorRepository implements ActorRepository {
  constructor(
    @InjectRepository(TypeORMActor)
    private readonly typeOrmRepository: Repository<TypeORMActor>,
  ) {}

  async create(actor: DomainActor): Promise<DomainActor> {
    const typeOrmActor = ActorMapper.toTypeORM(actor);

    await this.typeOrmRepository.save(typeOrmActor);
    const savedWithRelations = await this.typeOrmRepository.findOne({
      where: { id: typeOrmActor.id },
      relations: ['movies'],
    });
    if (!savedWithRelations) {
      throw new NotFoundException('Failed to load saved actor with relations');
    }
    return ActorMapper.toDomain(savedWithRelations);
  }

  async findAllPaginated({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
  }: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder: 'ASC' | 'DESC';
  }): Promise<{ data: DomainActor[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.typeOrmRepository
      .createQueryBuilder('actor')
      .leftJoinAndSelect('actor.movies', 'movies');

    if (search) {
      queryBuilder.where(
        'actor.name ILIKE :search OR actor.lastName ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (sortBy) {
      queryBuilder.orderBy(`actor.${sortBy}`, sortOrder);
    }

    const [actors, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: actors.map(ActorMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<DomainActor | null> {
    const actor = await this.typeOrmRepository.findOne({
      where: { id },
      relations: ['movies'],
    });
    if (!actor) {
      throw new NotFoundException(`Actor with id ${id} not found`);
    }
    return ActorMapper.toDomain(actor);
  }

  async update(id: string, actor: DomainActor): Promise<DomainActor> {
    const existingActor = await this.typeOrmRepository.findOne({
      where: { id },
      relations: ['movies'],
    });

    if (!existingActor) {
      throw new NotFoundException(`Actor with id ${id} not found`);
    }

    existingActor.name = actor.name.getValue();
    existingActor.lastName = actor.lastName.getValue();

    if (actor.movies && Array.isArray(actor.movies)) {
      const movies: TypeORMMovie[] = actor.movies.map((movieId: string) => {
        const movie = new TypeORMMovie();
        movie.id = movieId;
        return movie;
      });
      existingActor.movies = movies;
    }

    const updatedActor = await this.typeOrmRepository.save(existingActor);

    const reloadedActor = await this.typeOrmRepository.findOne({
      where: { id: updatedActor.id },
      relations: ['movies'],
    });

    if (!reloadedActor) {
      throw new NotFoundException(
        'Failed to load updated actor with relations',
      );
    }

    return ActorMapper.toDomain(reloadedActor);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.typeOrmRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
