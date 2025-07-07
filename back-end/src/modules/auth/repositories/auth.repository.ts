import { User } from '../domain/user.domain';

export abstract class AuthRepository {
  abstract login(user: User): Promise<User | null>;
  abstract register(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
