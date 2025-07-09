import { Actor, JSONActor } from '../domain/actors.domain';
import { ActorMapper } from '../mappers/actor.mappers';

export interface FindAllActorsOptions {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder: 'ASC' | 'DESC';
}
export class GetAllActorsResponseDto {
  readonly actors: JSONActor[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;

  constructor(actors: Actor[], total: number, page: number, limit: number) {
    this.actors = actors.map(ActorMapper.toJson);
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}
