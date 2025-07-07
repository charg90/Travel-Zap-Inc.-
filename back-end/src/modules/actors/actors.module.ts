import { Module } from '@nestjs/common';
import { ActorsService } from './actors.service';
import { ActorsController } from './actors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './../movies/entities/movie.entity';
import { Actor } from './entities/actor.entity';
import { Rating } from '../ratings/entities/rating.entity';
import { ActorRepository } from './repository/actor.repository';
import { TypeORMActorRepository } from './repository/type-orm/type-orm-actor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Actor, Rating])],
  controllers: [ActorsController],
  providers: [
    ActorsService,
    {
      provide: ActorRepository,
      useClass: TypeORMActorRepository,
    },
  ],
})
export class ActorsModule {}
