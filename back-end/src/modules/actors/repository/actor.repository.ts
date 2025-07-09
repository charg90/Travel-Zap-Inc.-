import { Actor } from '../domain/actors.domain';

export abstract class ActorRepository {
  abstract create(actor: Actor): Promise<Actor>;
  abstract findAllPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder: 'ASC' | 'DESC';
  }): Promise<{ data: Actor[]; total: number }>;
  abstract findById(id: string): Promise<Actor | null>;
  abstract update(id: string, actor: Actor): Promise<Actor>;
  abstract delete(id: string): Promise<boolean>;
}
