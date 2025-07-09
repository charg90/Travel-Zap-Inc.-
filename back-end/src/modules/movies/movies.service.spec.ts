import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { MoviesRepository } from './repository/movies.repository';
import { IMovieProps, Movie } from './domain/movie.domain';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException, HttpStatus } from '@nestjs/common';
import { MovieException } from './exceptions/movie.exeptions';
import { Description, Title } from './domain/movies.value-object';
import { CreateMovieResponseDto } from './dto/create-movie.dto';
import { GetAllMoviesResponseDto } from './dto/get-all-dto';
import { SingleMovieResponseDto } from './dto/single-movie.dto';

// Mock implementation of MoviesRepository
const mockMoviesRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: MoviesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MoviesRepository,
          useValue: mockMoviesRepository, // Use the mock repository
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<MoviesRepository>(MoviesRepository);

    for (const key in mockMoviesRepository) {
      if (Object.prototype.hasOwnProperty.call(mockMoviesRepository, key)) {
        (mockMoviesRepository[key] as jest.Mock).mockReset();
      }
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Create Movie Tests ---
  describe('create', () => {
    it('should successfully create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: new Title('Test Movie'),
        description: new Description('A great test movie'),
        actors: ['Actor One', 'Actor Two'],
        ratings: 8.5,
      };

      const createdMovieDomain = Movie.create(
        {
          title: new Title('Test Movie'),
          description: new Description('A great test movie'),
          actors: ['Actor One', 'Actor Two'],
          ratings: 8.5,
        },
        'some-uuid-1',
      );

      mockMoviesRepository.create.mockResolvedValue(createdMovieDomain);

      const result = await service.create(createMovieDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.any(Movie), // We expect a Movie domain object
      );
      expect(result).toBeInstanceOf(CreateMovieResponseDto);
      expect(result.movie.title).toEqual('Test Movie');
      expect(result.movie.description).toEqual('A great test movie');
    });

    it('should throw MovieException if repository creation fails', async () => {
      const createMovieDto: CreateMovieDto = {
        title: new Title('Test Movie'),
        description: new Description('A great test movie'),
        actors: [],
        ratings: 0,
      };

      mockMoviesRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(createMovieDto)).rejects.toThrow(
        MovieException,
      );
      await expect(service.create(createMovieDto)).rejects.toHaveProperty(
        'message',
        'Failed to create movie: DB error',
      );
      await expect(service.create(createMovieDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  // --- Find All Movies Tests ---
  describe('findAll', () => {
    it('should return all movies', async () => {
      const movie1 = Movie.create(
        {
          title: new Title('Movie A'),
          description: new Description('Desc A'),
          actors: ['Actor A'],
          ratings: 7,
        },
        'id1',
      );
      const movie2 = Movie.create(
        {
          title: new Title('Movie B'),
          description: new Description('Desc B'),
          actors: ['Actor B'],
          ratings: 9,
        },
        'id2',
      );
      mockMoviesRepository.findAll.mockResolvedValue([movie1, movie2]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(GetAllMoviesResponseDto);
      expect(result.movies).toHaveLength(2);
      expect(result.movies[0].title).toEqual('Movie A');
      expect(result.movies[1].title).toEqual('Movie B');
    });

    it('should return an empty array if no movies are found', async () => {
      mockMoviesRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(GetAllMoviesResponseDto);
      expect(result.movies).toHaveLength(0);
    });

    it('should throw MovieException if repository findAll fails', async () => {
      mockMoviesRepository.findAll.mockRejectedValue(
        new Error('Network error'),
      );

      await expect(service.findAll()).rejects.toThrow(MovieException);
      await expect(service.findAll()).rejects.toHaveProperty(
        'message',
        'Failed to retrieve movies: Network error',
      );
    });
  });

  // --- Find One Movie Tests ---
  describe('findOne', () => {
    it('should return a single movie by ID', async () => {
      const movieId = 'test-id';
      const movie = Movie.create(
        {
          title: new Title('Single Movie'),
          description: new Description('Description'),
          actors: [],
          ratings: 0,
        },
        movieId,
      );
      mockMoviesRepository.findById.mockResolvedValue(movie);

      const result = await service.findOne(movieId);

      expect(repository.findById).toHaveBeenCalledWith(movieId);
      expect(result).toBeInstanceOf(SingleMovieResponseDto);
      expect(result.movie.id).toEqual(movieId);
      expect(result.movie.title).toEqual('Single Movie');
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const movieId = 'non-existent-id';
      mockMoviesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(movieId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(movieId)).rejects.toHaveProperty(
        'message',
        `Movie with ID ${movieId} not found`,
      );
    });

    it('should throw MovieException if repository findById fails', async () => {
      const movieId = 'error-id';
      mockMoviesRepository.findById.mockRejectedValue(
        new Error('DB connection lost'),
      );

      await expect(service.findOne(movieId)).rejects.toThrow(MovieException);
      await expect(service.findOne(movieId)).rejects.toHaveProperty(
        'message',
        `Failed to retrieve movie with ID ${movieId}: DB connection lost`,
      );
    });
  });

  // --- Update Movie Tests ---
  describe('update', () => {
    const movieId = 'update-id';
    const existingMovie = Movie.create(
      {
        title: new Title('Original Title'),
        description: new Description('Original Description'),
        actors: ['Actor X'],
        ratings: 5,
      },
      movieId,
    );

    it('should successfully update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: new Title('Updated Title'),
        actors: ['Actor Y'],
      };

      const updatedMovieDomain = Movie.create(
        {
          title: new Title('Updated Title'),
          description: new Description('Original Description'),
          actors: ['Actor Y'],
          ratings: 5,
        },
        movieId,
      );

      mockMoviesRepository.findById.mockResolvedValue(existingMovie);
      mockMoviesRepository.update.mockResolvedValue(updatedMovieDomain);

      const result = (await service.update(
        movieId,
        updateMovieDto,
      )) as SingleMovieResponseDto;

      expect(repository.findById).toHaveBeenCalledWith(movieId);
      expect(repository.update).toHaveBeenCalledWith(
        movieId,
        expect.objectContaining({
          props: expect.objectContaining({
            title: new Title('Updated Title'),
            actors: ['Actor Y'],
          }) as Partial<IMovieProps>,
        }),
      );
      expect(result).toBeInstanceOf(SingleMovieResponseDto);
      expect(result.movie.title).toEqual('Updated Title');
      expect(result.movie.actors).toEqual(['Actor Y']);
    });

    it('should update only specified fields', async () => {
      const updateMovieDto: UpdateMovieDto = {
        description: new Description('New Description Only'),
      };

      const updatedMovieDomain = Movie.create(
        {
          title: new Title('Original Title'),
          description: new Description('New Description Only'),
          actors: ['Actor X'],
          ratings: 5,
        },
        movieId,
      );

      mockMoviesRepository.findById.mockResolvedValue(existingMovie);
      mockMoviesRepository.update.mockResolvedValue(updatedMovieDomain);

      const result = (await service.update(
        movieId,
        updateMovieDto,
      )) as SingleMovieResponseDto;

      expect(repository.update).toHaveBeenCalledWith(
        movieId,
        expect.objectContaining({
          props: expect.objectContaining({
            title: new Title('Original Title'), // Should remain unchanged
            description: new Description('New Description Only'),
            actors: ['Actor X'],
          }) as Partial<IMovieProps>,
        }),
      );
      expect(result.movie.description).toEqual('New Description Only');
      expect(result.movie.title).toEqual('Original Title');
    });

    it('should throw MovieException if movie to update is not found', async () => {
      const nonExistentId = 'non-existent-update-id';
      const updateMovieDto: UpdateMovieDto = {
        title: new Title('New Title'),
      };
      mockMoviesRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(nonExistentId, updateMovieDto),
      ).rejects.toThrow(MovieException);
      await expect(
        service.update(nonExistentId, updateMovieDto),
      ).rejects.toHaveProperty(
        'message',
        `Movie with ID ${nonExistentId} not found`,
      );
      await expect(
        service.update(nonExistentId, updateMovieDto),
      ).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });

    it('should throw MovieException if repository update fails', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: new Title('Failing Update'),
      };
      mockMoviesRepository.findById.mockResolvedValue(existingMovie);
      mockMoviesRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.update(movieId, updateMovieDto)).rejects.toThrow(
        MovieException,
      );
      await expect(
        service.update(movieId, updateMovieDto),
      ).rejects.toHaveProperty(
        'message',
        `Failed to update movie with ID ${movieId}: Update failed`,
      );
    });
  });

  // --- Remove Movie Tests ---
  describe('remove', () => {
    it('should successfully remove a movie', async () => {
      const movieId = 'delete-id';
      const existingMovie = Movie.create(
        {
          title: new Title('Movie to Delete'),
          description: new Description('Desc'),
          actors: [],
          ratings: 0,
        },
        movieId,
      );
      mockMoviesRepository.findById.mockResolvedValue(existingMovie);
      mockMoviesRepository.delete.mockResolvedValue(true);

      const result = await service.remove(movieId);

      expect(repository.findById).toHaveBeenCalledWith(movieId);
      expect(repository.delete).toHaveBeenCalledWith(movieId);
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException if movie to remove is not found', async () => {
      const movieId = 'non-existent-delete-id';
      mockMoviesRepository.findById.mockResolvedValue(null);

      await expect(service.remove(movieId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(movieId)).rejects.toHaveProperty(
        'message',
        `Movie with ID ${movieId} not found`,
      );
    });

    it('should throw an error if repository delete fails (implicitly, as no specific MovieException for delete)', async () => {
      const movieId = 'failing-delete-id';
      const existingMovie = Movie.create(
        {
          title: new Title('Movie to Delete'),
          description: new Description('Desc'),
          actors: [],
          ratings: 0,
        },
        movieId,
      );
      mockMoviesRepository.findById.mockResolvedValue(existingMovie);
      mockMoviesRepository.delete.mockRejectedValue(new Error('Delete error'));

      // The original service code throws the underlying error if delete fails
      await expect(service.remove(movieId)).rejects.toThrow('Delete error');
    });
  });
});
