import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocalStrategy } from './strategies/local.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { TypeOrmAuthRepository } from './repositories/repository/type-orm-auth.repository';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]), // Register the User entity with TypeOrmModule
  ],
  providers: [
    AuthService,
    LocalStrategy,
    {
      provide: AuthRepository,
      useClass: TypeOrmAuthRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
