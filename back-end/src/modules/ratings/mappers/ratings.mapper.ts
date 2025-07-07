import { Score } from '../domain/ratin.value-object';
import { Rating as DomainRating } from '../domain/rating.domain';
import { Rating as TypeORMRating } from '../entities/rating.entity';
import { Movie } from '../../movies/entities/movie.entity';

export class RatingMapper {
  static toDomain(typeOrmRating: TypeORMRating): DomainRating {
    return DomainRating.create(
      {
        score: new Score(typeOrmRating.score),
        comment: typeOrmRating.comment,
        movieId: typeOrmRating.movie?.id,
      },
      typeOrmRating.id,
    );
  }

  static toTypeORM(domainRating: DomainRating): TypeORMRating {
    const typeOrmRating = new TypeORMRating();
    typeOrmRating.id = domainRating.id;
    typeOrmRating.score = domainRating.score.getValue();
    typeOrmRating.comment = domainRating.comment;
    typeOrmRating.movie = new Movie();
    typeOrmRating.movie.id = domainRating.movieId;

    return typeOrmRating;
  }
  static toJson(domainRating: DomainRating) {
    return {
      id: domainRating.id,
      score: domainRating.score.getValue(),
      comment: domainRating.comment,
      movieId: domainRating.movieId,
    };
  }
}
