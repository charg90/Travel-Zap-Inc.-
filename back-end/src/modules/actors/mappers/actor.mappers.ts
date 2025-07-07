import { Actor as DomainActor } from '../domain/actors.domain';
import { Name } from '../domain/actor.value-object';
import { Actor as TypeORMActor } from '../entities/actor.entity';

export class ActorMapper {
  static toDomain(typeOrmActor: TypeORMActor): DomainActor {
    return DomainActor.create(
      {
        name: new Name(typeOrmActor.name),
        movies: [],
      },
      typeOrmActor.id,
    );
  }

  static toTypeORM(domainActor: DomainActor): TypeORMActor {
    const typeOrmActor = new TypeORMActor();
    typeOrmActor.id = domainActor.id;
    typeOrmActor.name = domainActor.name.getValue();
    typeOrmActor.movies = [];
    return typeOrmActor;
  }
  static toJson(domainActor: DomainActor) {
    return {
      id: domainActor.id,
      name: domainActor.name.getValue(),
      movies: domainActor.movies,
    };
  }
}
