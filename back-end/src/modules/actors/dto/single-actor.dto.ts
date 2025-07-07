import { Actor, JSONActor } from '../domain/actors.domain';
import { ActorMapper } from '../mappers/actor.mappers';

export class SingleActorResponseDto {
  readonly actor: JSONActor;

  constructor(actor: Actor) {
    this.actor = ActorMapper.toJson(actor);
  }
}
