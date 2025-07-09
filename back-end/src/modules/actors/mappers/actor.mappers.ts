import { Actor as DomainActor } from '../domain/actors.domain';
import { Name } from '../domain/actor.value-object';
import { Actor as TypeORMActor } from '../entities/actor.entity';
import { Movie as TypeORMMovie } from '../../movies/entities/movie.entity';

export class ActorMapper {
  static toDomain(typeOrmActor: TypeORMActor): DomainActor {
    return DomainActor.create(
      {
        name: new Name(typeOrmActor.name),
        lastName: new Name(typeOrmActor.lastName),
        movies: typeOrmActor.movies?.map((movie) => movie.title) ?? [],
      },
      typeOrmActor.id,
    );
  }

  static toTypeORM(domainActor: DomainActor): TypeORMActor {
    const typeOrmActor = new TypeORMActor();
    typeOrmActor.id = domainActor.id;
    typeOrmActor.name = domainActor.name.getValue();
    typeOrmActor.lastName = domainActor.lastName.getValue();
    typeOrmActor.movies =
      domainActor.movies?.map((movieId) => {
        const movie = new TypeORMMovie();
        movie.id = movieId;
        return movie;
      }) ?? [];

    return typeOrmActor;
  }
  static toJson(domainActor: DomainActor) {
    return {
      id: domainActor.id,
      name: domainActor.name.getValue(),
      lastName: domainActor.lastName.getValue(),
      movies: domainActor.movies,
    };
  }
}
