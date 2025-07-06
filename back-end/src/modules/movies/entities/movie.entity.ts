import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'release_date' })
  releaseDate: Date;

  @Column({ name: 'movie_title' })
  movieTitle: string;

  @Column({ name: 'movie_description', nullable: true })
  movieDescription?: string;
}
