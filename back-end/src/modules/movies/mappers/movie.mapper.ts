import { Movie as DomainMovie, JSONMovie } from '../domain/movie.domain';
import { Movie as TypeORMMovie } from '../entities/movie.entity';
import { Description, Title } from '../domain/movies.value-object';

export class MovieMapper {
  static toTypeORM(domainMovie: DomainMovie): TypeORMMovie {
    const movie = new TypeORMMovie();
    movie.id = domainMovie.id;
    movie.title = domainMovie.title.getValue();
    movie.description = domainMovie.description.getValue();
    movie.actors = [];
    movie.ratings = [];
    return movie;
  }

  static toDomain(typeORMMovie: TypeORMMovie): DomainMovie {
    const scores = typeORMMovie.ratings?.map((rating) => rating.score) ?? [];
    const averageRating =
      scores.length === 0
        ? 0
        : scores.reduce((a, b) => a + b, 0) / scores.length;
    return DomainMovie.create(
      {
        title: new Title(typeORMMovie.title),
        description: new Description(typeORMMovie.description),
        actors:
          typeORMMovie.actors?.map((actor) =>
            [actor.name, actor.lastName].filter(Boolean).join(' '),
          ) ?? [],
        ratings: averageRating,
      },
      typeORMMovie.id,
    );
  }

  static toJson(movie: DomainMovie): JSONMovie {
    return {
      id: movie.id,
      title: movie.title.getValue(),
      description: movie.description.getValue(),
      actors: movie.actors,
      ratings: movie.ratings,
    };
  }
}
