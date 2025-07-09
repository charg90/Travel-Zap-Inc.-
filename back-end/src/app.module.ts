import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MoviesModule } from './modules/movies/movies.module';
import { ActorsModule } from './modules/actors/actors.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const type = configService.get<string>('DB_TYPE') as
          | 'postgres'
          | 'mysql'
          | 'sqlite';

        if (!type) {
          throw new Error('DB_TYPE not set in env');
        }

        return {
          type,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<number>('DB_PORT', 5432)),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
    MoviesModule,
    ActorsModule,
    RatingsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
