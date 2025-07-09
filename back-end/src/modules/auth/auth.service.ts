import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './repositories/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from './domain/user.domain';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = User.create({
        email: registerDto.email,
        password: hashedPassword,
      });
      return this.authRepository.register(user);
    } catch (err) {
      throw new HttpException(`Error registering user:${err}`, 500);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const isRegistered = await this.authRepository.findByEmail(
        loginDto.email,
      );
      if (!isRegistered) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const user = User.create(loginDto);
      const response = await this.authRepository.login(user);
      if (!response) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      const payload = { email: response.email, sub: response.id };
      const accessToken = this.jwtService.sign(payload);
      return {
        accessToken,
        user: {
          id: response.id,
          email: response.email,
        },
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        `Error logging in user: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return this.authRepository.findByEmail(email);
    } catch (err) {
      throw new HttpException(
        `Error finding user by email: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
