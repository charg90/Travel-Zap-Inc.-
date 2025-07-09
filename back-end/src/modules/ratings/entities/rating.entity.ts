import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  score: number;

  @Column()
  comment: string;

  @ManyToOne(() => Movie, (movie) => movie.ratings)
  movie: Movie;
}
