import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Actor } from '../../actors/entities/actor.entity';
import { Rating } from '../../ratings/entities/rating.entity';

@Entity()
export class Movie {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => Actor, (actor) => actor.movies)
  @JoinTable()
  actors: Actor[];

  @OneToMany(() => Rating, (rating) => rating.movie)
  ratings: Rating[];
}
