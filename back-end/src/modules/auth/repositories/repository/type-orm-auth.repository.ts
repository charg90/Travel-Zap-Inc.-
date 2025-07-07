import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from '../auth.repository';
import { User as TypeORMUser } from '../../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TypeOrmAuthRepository implements AuthRepository {
  constructor(
    @InjectRepository(TypeORMUser)
    private readonly userRepository: Repository<TypeORMUser>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    return null;
  }

  async login(user: {
    email: string;
    password: string;
  }): Promise<TypeORMUser | null> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!existingUser) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    ); // Compare hashed password
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return existingUser; // Return the authenticated user
  }

  async register(user: {
    email: string;
    password: string;
  }): Promise<TypeORMUser> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = this.userRepository.create({
      email: user.email,
      password: user.password,
    });

    return await this.userRepository.save(newUser);
  }
}
