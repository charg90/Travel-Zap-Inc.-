import { Entity } from 'src/modules/db/domain/entity';
import { Score } from './ratin.value-object';

export interface IRatingProps {
  score: Score;
  comment?: string;
  movieId: string;
}

export class Rating extends Entity<IRatingProps> {
  private constructor(props: IRatingProps, id?: string) {
    super(props, id);
  }

  get score(): Score {
    return this.props.score;
  }

  get comment(): string {
    if (!this.props.comment) {
      return '';
    }
    return this.props.comment;
  }

  get movieId(): string {
    return this.props.movieId;
  }
  set score(score: Score) {
    this.props.score = score;
  }
  set comment(comment: string) {
    this.props.comment = comment;
  }
  set movieId(movieId: string) {
    this.props.movieId = movieId;
  }

  static create(props: IRatingProps, id?: string): Rating {
    if (!(props.score instanceof Score)) {
      props.score = new Score(props.score);
    }
    return new Rating(props, id);
  }
}
export interface JSONRating {
  id: string;
  score: number;
  comment: string;
  movieId: string;
}
