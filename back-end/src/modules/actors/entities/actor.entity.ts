import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @ManyToMany(() => Movie, (movie) => movie.actors, { cascade: true })
  movies: Movie[];
}
