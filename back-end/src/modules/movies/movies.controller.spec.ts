// src/modules/movies/movies.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto, CreateMovieResponseDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './domain/movie.domain';
import { Title, Description } from './domain/movies.value-object';
import { GetAllMoviesResponseDto } from './dto/get-all-dto';
import { SingleMovieResponseDto } from './dto/single-movie.dto';
import { NotFoundException, HttpStatus } from '@nestjs/common';
import { MovieException } from './exceptions/movie.exeptions';

// --- Mocks ---

interface MovieInternalPropsForComparison {
  title: Title;
  description: Description;
  actors: string[];
  ratings: number;
}

const mockMovieId = 'movie-123';
const mockMovieProps = {
  title: new Title('Mock Movie Title'),
  description: new Description('Mock Movie Description'),
  actors: ['Actor One', 'Actor Two'],
  ratings: 8,
};
const mockMovieDomain = Movie.create(mockMovieProps, mockMovieId);
const mockJsonMovie = {
  id: mockMovieId,
  title: mockMovieProps.title.getValue(),
  description: mockMovieProps.description.getValue(),
  actors: mockMovieProps.actors,
  ratings: mockMovieProps.ratings,
};

const mockMoviesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// --- Test Suite ---

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: typeof mockMoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<typeof mockMoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Create Movie Tests
  describe('create', () => {
    it('should create a movie and return a CreateMovieResponseDto', async () => {
      const createMovieDto: CreateMovieDto = {
        title: new Title('New Movie'),
        description: new Description('A brand new movie.'),
        actors: [],
        ratings: 0,
      };
      const expectedResponse = new CreateMovieResponseDto(mockMovieDomain);

      service.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(createMovieDto);

      expect(service.create).toHaveBeenCalledWith(createMovieDto);
      expect(result).toEqual(expectedResponse);
      expect(result).toBeInstanceOf(CreateMovieResponseDto);
    });

    it('should throw MovieException if service.create throws MovieException', async () => {
      // Renamed test for clarity
      const createMovieDto: CreateMovieDto = {
        title: new Title('New Movie'),
        description: new Description('A brand new movie.'),
        actors: [],
        ratings: 0,
      };
      const errorMessage = 'Failed to create movie: DB error';
      const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      // FIX THIS MOCK: Change from mockResolvedValue to mockRejectedValue
      service.create.mockRejectedValue(
        new MovieException(errorMessage, errorStatus),
      );

      // Call the controller method and assert that it rejects
      const promise = controller.create(createMovieDto); // Capture the promise once

      await expect(promise).rejects.toThrow(MovieException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  // Find All Movies Tests
  describe('findAll', () => {
    it('should return a list of movies in GetAllMoviesResponseDto', async () => {
      const moviesList = [
        mockMovieDomain,
        Movie.create(
          {
            title: new Title('Another Movie'),
            description: new Description('Another description'),
            actors: ['Actor Three'],
            ratings: 7,
          },
          'movie-456',
        ),
      ];
      const expectedResponse = new GetAllMoviesResponseDto(moviesList);

      service.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
      expect(result).toBeInstanceOf(GetAllMoviesResponseDto);
    });

    it('should throw MovieException if service.findAll throws MovieException', async () => {
      // Renamed test for clarity
      const errorMessage = 'Failed to retrieve movies: Network error';
      const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      // FIX THIS MOCK: Change from mockResolvedValue to mockRejectedValue
      service.findAll.mockRejectedValue(
        new MovieException(errorMessage, errorStatus),
      );

      const promise = controller.findAll(); // Capture the promise once

      await expect(promise).rejects.toThrow(MovieException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // Find One Movie Tests
  describe('findOne', () => {
    it('should return a single movie by ID in SingleMovieResponseDto', async () => {
      const expectedResponse = new SingleMovieResponseDto(mockMovieDomain);

      service.findOne.mockResolvedValue(expectedResponse);

      const result = await controller.findOne(mockMovieId);

      expect(service.findOne).toHaveBeenCalledWith(mockMovieId);
      expect(result).toEqual(expectedResponse);
      expect(result).toBeInstanceOf(SingleMovieResponseDto);
    });

    it('should throw NotFoundException if movie is not found by service', async () => {
      const errorMessage = `Movie with ID ${mockMovieId} not found`;
      const errorStatus = HttpStatus.NOT_FOUND;

      // FIX THIS MOCK: Change from mockResolvedValue to mockRejectedValue
      service.findOne.mockRejectedValue(new NotFoundException(errorMessage));

      const promise = controller.findOne(mockMovieId); // Capture the promise once

      await expect(promise).rejects.toThrow(NotFoundException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.findOne).toHaveBeenCalledWith(mockMovieId);
    });

    it('should throw MovieException if service.findOne throws MovieException', async () => {
      // Renamed test for clarity
      const errorMessage =
        'Failed to retrieve movie with ID movie-123: DB error';
      const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      // FIX THIS MOCK: Change from mockResolvedValue to mockRejectedValue
      service.findOne.mockRejectedValue(
        new MovieException(errorMessage, errorStatus),
      );

      const promise = controller.findOne(mockMovieId); // Capture the promise once

      await expect(promise).rejects.toThrow(MovieException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.findOne).toHaveBeenCalledWith(mockMovieId);
    });
  });

  // Update Movie Tests
  describe('update', () => {
    it('should update a movie and return SingleMovieResponseDto', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: new Title('Updated Title'),
      };
      const updatedMovieDomain = Movie.create(
        {
          ...mockMovieProps,
          title: new Title('Updated Title'),
        },
        mockMovieId,
      );
      const expectedResponse = new SingleMovieResponseDto(updatedMovieDomain);

      service.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(mockMovieId, updateMovieDto);

      expect(service.update).toHaveBeenCalledWith(mockMovieId, updateMovieDto);
      expect(result).toEqual(expectedResponse);
      expect(result).toBeInstanceOf(SingleMovieResponseDto);
    });

    it('should throw MovieException if movie is not found by service during update', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: new Title('Updated Title'),
      };
      const errorMessage = `Movie with ID ${mockMovieId} not found`;
      const errorStatus = HttpStatus.NOT_FOUND;

      // FIX THIS MOCK: Change from mockImplementation (throwing) to mockRejectedValue
      service.update.mockRejectedValue(
        new MovieException(errorMessage, errorStatus),
      );

      const promise = controller.update(mockMovieId, updateMovieDto); // Capture the promise once

      await expect(promise).rejects.toThrow(MovieException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.update).toHaveBeenCalledWith(mockMovieId, updateMovieDto);
    });

    it('should throw MovieException if service.update fails', async () => {
      const updateMovieDto: UpdateMovieDto = {
        title: new Title('Updated Title'),
      };
      const errorMessage = `Failed to update movie with ID ${mockMovieId}: DB error`;
      const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      // FIX THIS MOCK: Change from mockImplementation (throwing) to mockRejectedValue
      service.update.mockRejectedValue(
        new MovieException(errorMessage, errorStatus),
      );

      const promise = controller.update(mockMovieId, updateMovieDto); // Capture the promise once

      await expect(promise).rejects.toThrow(MovieException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.update).toHaveBeenCalledWith(mockMovieId, updateMovieDto);
    });
  });

  // Remove Movie Tests
  describe('remove', () => {
    it('should throw NotFoundException if movie to remove is not found by service', async () => {
      const errorMessage = `Movie with ID ${mockMovieId} not found`;
      const errorStatus = HttpStatus.NOT_FOUND;

      // FIX THIS MOCK: Change from mockImplementation (throwing) to mockRejectedValue
      service.remove.mockRejectedValue(new NotFoundException(errorMessage));

      const promise = controller.remove(mockMovieId); // Capture the promise once

      await expect(promise).rejects.toThrow(NotFoundException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.remove).toHaveBeenCalledWith(mockMovieId);
    });

    it('should throw MovieException if service.remove fails for other reasons', async () => {
      const errorMessage = `Failed to delete movie with ID ${mockMovieId}: DB error`;
      const errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      // FIX THIS MOCK: Change from mockImplementation (throwing) to mockRejectedValue
      service.remove.mockRejectedValue(
        new MovieException(errorMessage, errorStatus),
      );

      const promise = controller.remove(mockMovieId); // Capture the promise once

      await expect(promise).rejects.toThrow(MovieException);
      await expect(promise).rejects.toHaveProperty('message', errorMessage);
      await expect(promise).rejects.toHaveProperty('status', errorStatus);
      expect(service.remove).toHaveBeenCalledWith(mockMovieId);
    });
  });
});
