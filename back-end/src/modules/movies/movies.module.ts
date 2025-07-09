import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './repository/movies.repository';
import { TypeORMMoviesRepository } from './repository/type-orm/type-orm.repository';
import { Movie } from './entities/movie.entity';
import { Actor } from '../actors/entities/actor.entity';
import { Rating } from '../ratings/entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Actor, Rating]),
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    {
      provide: MoviesRepository,
      useClass: TypeORMMoviesRepository,
    },
  ],
  exports: [MoviesService],
})
export class MoviesModule {}
