import { Entity } from 'src/modules/db/domain/entity';
import { Description, Title } from './movies.value-object';

export interface IMovieProps {
  title: Title;
  description: Description;
  actors: string[];
  ratings: number[];
}

export class Movie extends Entity<IMovieProps> {
  private constructor(props: IMovieProps, id?: string) {
    super(props, id);
  }

  get title(): Title {
    return this.props.title;
  }
  get description(): Description {
    return this.props.description;
  }
  get actors(): string[] {
    return this.props.actors;
  }
  get ratings(): number[] {
    return this.props.ratings;
  }
  set title(title: Title) {
    this.props.title = title;
  }
  set description(description: Description) {
    this.props.description = description;
  }
  set actors(actors: string[]) {
    this.props.actors = actors;
  }
  set ratings(ratings: number[]) {
    this.props.ratings = ratings;
  }
  static create(props: IMovieProps, id?: string): Movie {
    if (!(props.title instanceof Title)) {
      props.title = new Title(props.title);
    }
    if (!(props.description instanceof Description)) {
      props.description = new Description(props.description);
    }
    return new Movie(props, id);
  }
}
export interface JSONMovie {
  id: string;
  title: string;
  description: string;
  actors: string[];
  ratings: number[];
}
