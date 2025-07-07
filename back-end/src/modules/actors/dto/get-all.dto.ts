import { Actor, JSONActor } from '../domain/actors.domain';
import { ActorMapper } from '../mappers/actor.mappers';

export class GetAllActorsResponseDto {
  readonly actors: JSONActor[];

  constructor(actors: Actor[]) {
    this.actors = actors.map(ActorMapper.toJson);
  }
}
