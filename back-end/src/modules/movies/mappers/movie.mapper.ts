import { Movie as DomainMovie, JSONMovie, Movie } from '../domain/movie.domain';
import { Movie as TypeORMMovie } from '../entities/movie.entity';
import { Actor } from '../../actors/entities/actor.entity';
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
    return DomainMovie.create({
      id: typeORMMovie.id || '',
      title: new Title(typeORMMovie.title),
      description: new Description(typeORMMovie.description),
      actors: [],
      ratings: [],
    });
  }

  static toJson(movie: DomainMovie): JSONMovie {
    return {
      id: movie.id || '',
      title: movie.title.getValue(),
      description: movie.description.getValue(),
      actors: movie.actors,
      ratings: movie.ratings,
    };
  }
}
