import { v4 as uuid } from 'uuid';

export abstract class Entity<T> {
  protected readonly _id: string;
  public readonly props: T;

  constructor(props: T, id?: string) {
    this._id = id ?? uuid();
    this.props = props;
  }

  get id() {
    return this._id;
  }
}
