import { Entity } from 'src/modules/db/domain/entity';
import { Name } from './actor.value-object';

export interface IActorProps {
  name: Name;
  lastName: Name;
  movies?: string[];
}

export class Actor extends Entity<IActorProps> {
  private constructor(props: IActorProps, id?: string) {
    super(props, id);
  }

  get name(): Name {
    return this.props.name;
  }
  get movies(): string[] {
    return this.props.movies || [];
  }
  set name(name: Name) {
    this.props.name = name;
  }
  set movies(movies: string[]) {
    this.props.movies = movies;
  }
  get lastName(): Name {
    return this.props.lastName;
  }
  set lastName(lastName: Name) {
    this.props.lastName = lastName;
  }
  static create(props: IActorProps, id?: string): Actor {
    if (!(props.name instanceof Name)) {
      props.name = new Name(props.name);
    }
    if (!(props.lastName instanceof Name)) {
      props.lastName = new Name(props.lastName);
    }
    return new Actor(props, id);
  }
}
export interface JSONActor {
  id: string;
  name: string;
  lastName: string;
  movies: string[];
}
