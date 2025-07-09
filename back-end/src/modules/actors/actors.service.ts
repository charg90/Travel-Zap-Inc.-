import { Injectable } from '@nestjs/common';
import { CreateActorDto, CreateActorResponseDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './domain/actors.domain';
import { ActorRepository } from './repository/actor.repository';
import { ActorException } from './exeptions/actor.exeption';
import {
  FindAllActorsOptions,
  GetAllActorsResponseDto,
} from './dto/get-all.dto';
import { SingleActorResponseDto } from './dto/single-actor.dto';

@Injectable()
export class ActorsService {
  constructor(private readonly actorRepository: ActorRepository) {}
  async create(createActorDto: CreateActorDto) {
    try {
      const actor = Actor.create(createActorDto);
      const actorCreated = await this.actorRepository.create(actor);
      return new CreateActorResponseDto(actorCreated);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new ActorException(`Failed to create actor: ${errorMessage}`, 500);
    }
  }

  async findAll(options: FindAllActorsOptions) {
    const { page, limit, search, sortBy, sortOrder } = options;
    try {
      const actors = await this.actorRepository.findAllPaginated({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      return new GetAllActorsResponseDto(
        actors.data,
        actors.total,
        page,
        limit,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new ActorException(
        `Failed to retrieve actors: ${errorMessage}`,
        500,
      );
    }
  }

  async findOne(id: string) {
    const actor = await this.actorRepository.findById(id);

    if (!actor) {
      throw new ActorException(`Actor with ID ${id} not found`, 404);
    }
    return new SingleActorResponseDto(actor);
  }

  async update(id: string, updateActorDto: UpdateActorDto) {
    const existingActor = await this.actorRepository.findById(id);
    if (!existingActor) {
      throw new ActorException(`Actor with ID ${id} not found`, 404);
    }

    try {
      const updateData: Partial<Actor> = {};
      if (updateActorDto.name) {
        updateData.name = updateActorDto.name;
      }
      if (updateActorDto.movies) {
        updateData.movies = updateActorDto.movies;
      }

      const actorToUpdate = Actor.create({
        ...existingActor.props,
        ...updateData,
      });

      const updatedActor = await this.actorRepository.update(id, actorToUpdate);
      return new SingleActorResponseDto(updatedActor);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new ActorException(`Failed to update actor: ${errorMessage}`, 500);
    }
  }

  remove(id: string) {
    const existingActor = this.actorRepository.findById(id);
    if (!existingActor) {
      throw new ActorException(`Actor with ID ${id} not found`, 404);
    }
    try {
      const deleted = this.actorRepository.delete(id);
      if (!deleted) {
        throw new ActorException(`Failed to delete actor with ID ${id}`, 500);
      }
      return { message: `Actor with ID ${id} deleted successfully` };
    } catch (error) {
      throw new ActorException(`Failed to delete actor: ${error.message}`, 500);
    }
  }

  async addActorToMovie(actorId: string, movieId: string) {
    console.log(`Adding movie ${movieId} to actor ${actorId}`);
    const actor = await this.actorRepository.findById(actorId);
    if (!actor) {
      throw new ActorException(`Actor with ID ${actorId} not found`, 404);
    }

    const updatedActor = Actor.create(
      {
        ...actor.props,
        movies: [...actor.movies, movieId],
      },
      actor.id,
    );

    const savedActor = await this.actorRepository.update(actorId, updatedActor);
    return new SingleActorResponseDto(savedActor);
  }
}
