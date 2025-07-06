import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  comment: string;

  @ManyToOne(() => Movie, (movie) => movie.ratings)
  movie: Movie;
}
