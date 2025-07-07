import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from '../auth.repository';
import { User as TypeORMUser } from '../../../users/entities/user.entity';
import { User } from '../../domain/user.domain';
import { UserMapper } from '../../mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { AuthException } from '../../exeptions/auth.exeptions';

@Injectable()
export class TypeOrmAuthRepository implements AuthRepository {
  constructor(
    @InjectRepository(TypeORMUser)
    private readonly userRepository: Repository<TypeORMUser>,
  ) {}

  async login(user: User): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!existingUser) {
      throw new AuthException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new AuthException('Invalid credentials', 401);
    }

    return UserMapper.toDomain(existingUser);
  }

  async register(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new AuthException('User already exists', 409);
    }

    const newUserEntity = this.userRepository.create({
      email: user.email,
      password: user.password,
    });

    const savedUserEntity = await this.userRepository.save(newUserEntity);
    return UserMapper.toDomain(savedUserEntity); // Map TypeORMUser to User domain object
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });
    if (!userEntity) {
      return null;
    }
    return UserMapper.toDomain(userEntity);
  }
}
