import { Test, TestingModule } from '@nestjs/testing';
import { RatingsService } from './ratings.service';
import { RatingsRepository } from './repository/ratings.repository';
import { Rating } from './domain/rating.domain';
import {
  CreateRatingDto,
  CreateRatingResponseDto,
} from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Score } from './domain/ratin.value-object';
import { RatingException } from './exeption/ratings.exeption';
import { HttpStatus } from '@nestjs/common';

// Mock implementation of RatingsRepository
const mockRatingsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('RatingsService', () => {
  let service: RatingsService;
  let repository: RatingsRepository; // To access the mock repository methods

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        {
          provide: RatingsRepository,
          useValue: mockRatingsRepository, // Provide the mock repository
        },
      ],
    }).compile();

    service = module.get<RatingsService>(RatingsService);
    repository = module.get<RatingsRepository>(RatingsRepository); // Get the mock instance

    // Reset all mocks before each test
    for (const key in mockRatingsRepository) {
      if (Object.prototype.hasOwnProperty.call(mockRatingsRepository, key)) {
        (mockRatingsRepository[key] as jest.Mock).mockReset();
      }
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Create Rating Tests ---
  describe('create', () => {
    it('should successfully create a rating', async () => {
      const createRatingDto: CreateRatingDto = {
        movieId: 'movie-uuid-123',
        score: new Score(7),
        comment: 'A good movie.',
      };

      const createdRatingDomain = Rating.create(
        {
          ...createRatingDto,
          score: new Score(createRatingDto.score.getValue()),
        },
        'new-rating-uuid-456',
      );

      mockRatingsRepository.create.mockResolvedValue(createdRatingDomain);

      const result = await service.create(createRatingDto);

      expect(result).toBeInstanceOf(CreateRatingResponseDto);
      expect(result.rating.id).toEqual('new-rating-uuid-456');
      expect(result.rating.score).toEqual(7);
      expect(result.rating.comment).toEqual('A good movie.');
    });

    it('should throw RatingException if repository creation fails', async () => {
      const createRatingDto: CreateRatingDto = {
        movieId: 'movie-uuid-123',
        score: new Score(5),
      };
      mockRatingsRepository.create.mockRejectedValue(
        new Error('DB connection error'),
      );

      await expect(service.create(createRatingDto)).rejects.toThrow(
        RatingException,
      );
      await expect(service.create(createRatingDto)).rejects.toHaveProperty(
        'message',
        'Error creating rating',
      );
      await expect(service.create(createRatingDto)).rejects.toHaveProperty(
        'status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  });

  // --- Find All Ratings Tests ---
  describe('findAll', () => {
    it('should return an array of ratings', async () => {
      const rating1 = Rating.create(
        { movieId: 'm1', score: new Score(8) },
        'r1',
      );
      const rating2 = Rating.create(
        { movieId: 'm2', score: new Score(6) },
        'r2',
      );
      mockRatingsRepository.findAll.mockResolvedValue([rating1, rating2]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([rating1, rating2]); // Service returns raw domain objects for findAll
      expect(result).toHaveLength(2);
    });

    it('should return an empty array if no ratings are found', async () => {
      mockRatingsRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw RatingException if repository findAll fails', async () => {
      mockRatingsRepository.findAll.mockRejectedValue(
        new Error('Network issue'),
      );

      await expect(service.findAll()).rejects.toThrow(RatingException);
      await expect(service.findAll()).rejects.toHaveProperty(
        'message',
        'Error fetching ratings',
      );
    });
  });

  // --- Find One Rating Tests ---
  describe('findOne', () => {
    it('should return a single rating by ID', async () => {
      const ratingId = 'existing-rating-id';
      const mockRating = Rating.create(
        { movieId: 'movie-id', score: new Score(9), comment: 'Awesome' },
        ratingId,
      );
      mockRatingsRepository.findById.mockResolvedValue(mockRating);

      const result = await service.findOne(ratingId);

      expect(repository.findById).toHaveBeenCalledWith(ratingId);
      expect(result).toEqual(mockRating);
      expect(result.id).toEqual(ratingId);
    });

    it('should throw RatingException (404) if rating is not found', async () => {
      const ratingId = 'non-existent-id';
      mockRatingsRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(ratingId)).rejects.toThrow(RatingException);
      await expect(service.findOne(ratingId)).rejects.toHaveProperty(
        'message',
        `Rating with ID ${ratingId} not found`,
      );
      await expect(service.findOne(ratingId)).rejects.toHaveProperty(
        'status',
        HttpStatus.NOT_FOUND,
      );
    });

    it('should throw RatingException if repository findById fails', async () => {
      const ratingId = 'error-id';
      mockRatingsRepository.findById.mockRejectedValue(
        new Error('DB read error'),
      );

      await expect(service.findOne(ratingId)).rejects.toThrow(RatingException);
      await expect(service.findOne(ratingId)).rejects.toHaveProperty(
        'message',
        `Rating with ID ${ratingId} not found`, // Service's catch block re-throws 404
      );
    });
  });

  // --- Update Rating Tests ---
  describe('update', () => {
    const existingRatingId = 'update-rating-id';
    const existingRating = Rating.create(
      {
        movieId: 'movie-xyz',
        score: new Score(7),
        comment: 'Original comment',
      },
      existingRatingId,
    );

    it('should successfully update a rating with all fields', async () => {
      const updateRatingDto: UpdateRatingDto = {
        score: new Score(9),
        comment: 'Updated comment',
      };
      const updatedRatingDomain = Rating.create(
        {
          movieId: 'movie-xyz',
          score: new Score(9),
          comment: 'Updated comment',
        },
        existingRatingId,
      );

      mockRatingsRepository.findById.mockResolvedValue(existingRating);
      mockRatingsRepository.update.mockResolvedValue(updatedRatingDomain);

      const result = (await service.update(
        existingRatingId,
        updateRatingDto,
      )) as Rating;

      expect(repository.findById).toHaveBeenCalledWith(existingRatingId);

      expect(result).toEqual(updatedRatingDomain);
      expect(result.id).toEqual(existingRatingId);
      expect(result.score.getValue()).toEqual(9);
    });

    it('should successfully update a rating with partial fields (only score)', async () => {
      const updateRatingDto: UpdateRatingDto = {
        score: new Score(10),
      };
      const updatedRatingDomain = Rating.create(
        {
          movieId: 'movie-xyz',
          score: new Score(10),
          comment: 'Original comment', // Comment should remain unchanged
        },
        existingRatingId,
      );

      mockRatingsRepository.findById.mockResolvedValue(existingRating);
      mockRatingsRepository.update.mockResolvedValue(updatedRatingDomain);

      const result = (await service.update(
        existingRatingId,
        updateRatingDto,
      )) as Rating;

      expect(repository.findById).toHaveBeenCalledWith(existingRatingId);

      expect(result).toEqual(updatedRatingDomain);
      expect(result.score.getValue()).toEqual(10);
      expect(result.comment).toEqual('Original comment');
    });

    it('should successfully update a rating with partial fields (only comment)', async () => {
      const updateRatingDto: UpdateRatingDto = {
        comment: 'Only comment updated',
      };
      const updatedRatingDomain = Rating.create(
        {
          movieId: 'movie-xyz',
          score: new Score(7), // Score should remain unchanged
          comment: 'Only comment updated',
        },
        existingRatingId,
      );

      mockRatingsRepository.findById.mockResolvedValue(existingRating);
      mockRatingsRepository.update.mockResolvedValue(updatedRatingDomain);

      const result = (await service.update(
        existingRatingId,
        updateRatingDto,
      )) as Rating;

      expect(repository.findById).toHaveBeenCalledWith(existingRatingId);

      expect(result).toEqual(updatedRatingDomain);
      expect(result.score.getValue()).toEqual(7);
      expect(result.comment).toEqual('Only comment updated');
    });

    it('should throw RatingException (404) if rating to update is not found', async () => {
      const nonExistentId = 'non-existent-update-id';
      const updateRatingDto: UpdateRatingDto = { score: new Score(5) };
      mockRatingsRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(nonExistentId, updateRatingDto),
      ).rejects.toThrow(RatingException);
      await expect(
        service.update(nonExistentId, updateRatingDto),
      ).rejects.toHaveProperty(
        'message',
        `Rating with ID ${nonExistentId} not found`,
      );
      await expect(
        service.update(nonExistentId, updateRatingDto),
      ).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });

    it('should throw RatingException if repository update fails', async () => {
      const updateRatingDto: UpdateRatingDto = { score: new Score(5) };
      mockRatingsRepository.findById.mockResolvedValue(existingRating);
      mockRatingsRepository.update.mockRejectedValue(
        new Error('Update failed in DB'),
      );

      await expect(
        service.update(existingRatingId, updateRatingDto),
      ).rejects.toThrow(RatingException);
      await expect(
        service.update(existingRatingId, updateRatingDto),
      ).rejects.toHaveProperty(
        'message',
        `Error updating rating with ID ${existingRatingId}: Update failed in DB`,
      );
      await expect(
        service.update(existingRatingId, updateRatingDto),
      ).rejects.toHaveProperty('status', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  // --- Remove Rating Tests ---
  describe('remove', () => {
    const ratingIdToDelete = 'delete-rating-id';
    const existingRatingToDelete = Rating.create(
      { movieId: 'movie-abc', score: new Score(5) },
      ratingIdToDelete,
    );

    it('should successfully remove a rating', async () => {
      mockRatingsRepository.findById.mockResolvedValue(existingRatingToDelete);
      mockRatingsRepository.delete.mockResolvedValue(true);

      const result = await service.remove(ratingIdToDelete);

      expect(repository.findById).toHaveBeenCalledWith(ratingIdToDelete);
      expect(repository.delete).toHaveBeenCalledWith(ratingIdToDelete);
      expect(result).toEqual({
        success: true,
        message: `Rating with ID ${ratingIdToDelete} deleted successfully`,
      });
    });

    it('should throw RatingException (404) if rating to remove is not found', async () => {
      mockRatingsRepository.findById.mockResolvedValue(null);

      await expect(service.remove(ratingIdToDelete)).rejects.toThrow(
        RatingException,
      );
      await expect(service.remove(ratingIdToDelete)).rejects.toHaveProperty(
        'message',
        `Rating with ID ${ratingIdToDelete} not found`,
      );
      await expect(service.remove(ratingIdToDelete)).rejects.toHaveProperty(
        'status',
        HttpStatus.NOT_FOUND,
      );
    });

    it('should throw RatingException (404) if repository findById fails during remove', async () => {
      // Note: your service's catch block for remove throws 404 regardless of the error,
      // so this test reflects that behavior.
      mockRatingsRepository.findById.mockRejectedValue(new Error('Find error'));

      await expect(service.remove(ratingIdToDelete)).rejects.toThrow(
        RatingException,
      );
      await expect(service.remove(ratingIdToDelete)).rejects.toHaveProperty(
        'message',
        `Rating with ID ${ratingIdToDelete} not found`,
      );
      await expect(service.remove(ratingIdToDelete)).rejects.toHaveProperty(
        'status',
        HttpStatus.NOT_FOUND,
      );
    });
  });
});
