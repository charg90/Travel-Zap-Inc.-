import { Rating } from '../domain/rating.domain';

export abstract class RatingsRepository {
  abstract create(rating: Rating): Promise<Rating>;
  abstract findAll(): Promise<Rating[]>;
  abstract findById(id: string): Promise<Rating | null>;
  abstract update(id: string, rating: Rating): Promise<Rating | null>;
  abstract delete(id: string): Promise<boolean>;
}
