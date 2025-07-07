import { Actor } from '../domain/actors.domain';

export abstract class ActorRepository {
  abstract create(actor: Actor): Promise<Actor>;
  abstract findAll(): Promise<Actor[]>;
  abstract findById(id: string): Promise<Actor | null>;
  abstract update(id: string, actor: Actor): Promise<Actor>;
  abstract delete(id: string): Promise<boolean>;
}
