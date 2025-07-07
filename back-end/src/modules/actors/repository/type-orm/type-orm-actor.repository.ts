import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorRepository } from '../actor.repository';
import { Actor as DomainActor } from '../../domain/actors.domain';
import { Actor as TypeORMActor } from '../../entities/actor.entity';
import { ActorMapper } from '../../mappers/actor.mappers';

@Injectable()
export class TypeORMActorRepository implements ActorRepository {
  constructor(
    @InjectRepository(TypeORMActor)
    private readonly typeOrmRepository: Repository<TypeORMActor>,
  ) {}

  async create(actor: DomainActor): Promise<DomainActor> {
    const typeOrmActor = ActorMapper.toTypeORM(actor);
    const savedActor = await this.typeOrmRepository.save(typeOrmActor);
    return ActorMapper.toDomain(savedActor);
  }

  async findAll(): Promise<DomainActor[]> {
    const actors = await this.typeOrmRepository.find();
    return actors.map((actor) => ActorMapper.toDomain(actor));
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
    const typeOrmActor = ActorMapper.toTypeORM(actor);
    const updatedActor = await this.typeOrmRepository.save(typeOrmActor);

    return ActorMapper.toDomain(updatedActor);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.typeOrmRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
