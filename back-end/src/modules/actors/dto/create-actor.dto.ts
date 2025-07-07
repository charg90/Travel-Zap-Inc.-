import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Actor, IActorProps, JSONActor } from '../domain/actors.domain';
import { Name } from '../domain/actor.value-object';
import { ActorMapper } from '../mappers/actor.mappers';

export class CreateActorDto implements IActorProps {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  name: Name;

  @IsArray({ message: 'Movies must be an array' })
  @IsOptional()
  movies?: string[];
}
export class CreateActorResponseDto {
  readonly movie: JSONActor;

  constructor(movie: Actor) {
    this.movie = ActorMapper.toJson(movie);
  }
}
