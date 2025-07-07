import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './repositories/auth.repository';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async validateUser(username: string, password: string): Promise<any> {}

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword };
    return this.authRepository.register(user);
  }
  async login(email: string, password: string) {
    const user = { email, password };
    return this.authRepository.login(user);
  }
}
