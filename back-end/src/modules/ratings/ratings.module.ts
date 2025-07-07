import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { Rating } from './entities/rating.entity';
import { RatingsRepository } from './repository/ratings.repository';
import { TypeORMRatingsRepository } from './repository/type-orm/type-orm-ratings';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Actor, Rating])],
  controllers: [RatingsController],
  providers: [
    RatingsService,
    {
      provide: RatingsRepository,
      useClass: TypeORMRatingsRepository,
    },
  ],
})
export class RatingsModule {}
