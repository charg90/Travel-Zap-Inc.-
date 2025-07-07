export abstract class AuthRepository {
  abstract validateUser(username: string, password: string): Promise<any>;
  abstract login(user: any): Promise<any>;
  abstract register(user: any): Promise<any>;
}
