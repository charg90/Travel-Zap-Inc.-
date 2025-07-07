import { Entity } from 'src/modules/db/domain/entity';

export interface IUserProps {
  email: string;
  password: string;
}

export class User extends Entity<IUserProps> {
  private constructor(props: IUserProps, id?: string) {
    super(props, id);
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  static create(props: IUserProps, id?: string): User {
    return new User(props, id);
  }
}
