import { AppDataSource } from 'data-source';
import { Movie } from 'src/modules/movies/entities/movie.entity';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Actor } from 'src/modules/actors/entities/actor.entity';

import { v4 as uuidv4 } from 'uuid';
import { Rating } from 'src/modules/ratings/entities/rating.entity';

async function seed() {
  await AppDataSource.initialize();
  const movieRepository = AppDataSource.getRepository(Movie);
  const userRepository = AppDataSource.getRepository(User);
  const actorRepository = AppDataSource.getRepository(Actor);
  const ratingRepository = AppDataSource.getRepository(Rating);

  const userExists = await userRepository.findOneBy({
    email: 'admin@example.com',
  });

  if (!userExists) {
    const hashedPassword = await bcrypt.hash('12345678', 10);
    const user = userRepository.create({
      email: 'admin@example.com',
      password: hashedPassword,
    });
    await userRepository.save(user);
    console.log('User created:', user.email);
  } else {
    console.log('User already exists:', userExists.email);
  }
  const existingMovies = await movieRepository.count();
  if (existingMovies > 0) {
    console.log('Movies already seeded');
    await AppDataSource.destroy();
    return;
  }
  const actor1 = actorRepository.create({
    id: uuidv4(),
    name: 'Leonardo',
    lastName: 'DiCaprio',
  });
  const actor2 = actorRepository.create({
    id: uuidv4(),
    name: 'Kate',
    lastName: 'Winslet',
  });
  await actorRepository.save([actor1, actor2]);

  const movie1 = movieRepository.create({
    id: uuidv4(),
    title: 'Titanic',
    description: 'A tragic love story aboard the Titanic.',
    actors: [actor1, actor2],
  });
  const movie2 = movieRepository.create({
    id: uuidv4(),
    title: 'Inception',
    description: 'A mind-bending thriller about dreams within dreams.',
    actors: [actor1],
  });
  await movieRepository.save([movie1, movie2]);

  const rating1 = ratingRepository.create({
    score: 5,
    comment: 'Amazing movie!',
    movie: movie1,
  });
  const rating2 = ratingRepository.create({
    score: 4,
    comment: 'Very interesting plot.',
    movie: movie2,
  });

  await ratingRepository.save([rating1, rating2]);

  console.log('✅ Seeded users, movies, actors and ratings');
  await AppDataSource.destroy();
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
