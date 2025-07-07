import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { TypeOrmAuthRepository } from './repositories/repository/type-orm-auth.repository';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],

  providers: [
    AuthService,
    AuthGuard,
    {
      provide: AuthRepository,
      useClass: TypeOrmAuthRepository,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
