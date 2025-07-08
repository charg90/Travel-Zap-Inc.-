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
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: Name;
}
export class CreateActorResponseDto {
  readonly actor: JSONActor;

  constructor(actor: Actor) {
    this.actor = ActorMapper.toJson(actor);
  }
}
