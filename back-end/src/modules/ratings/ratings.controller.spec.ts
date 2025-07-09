import { Test, TestingModule } from '@nestjs/testing';
import { RatingsController } from './ratings.controller';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { CreateRatingResponseDto } from './dto/create-rating.dto';
import { Rating } from './domain/rating.domain';
import { Score } from './domain/ratin.value-object';
import { JSONRating } from './domain/rating.domain';
import { HttpStatus } from '@nestjs/common';

// Mock implementation of RatingsService
const mockRatingsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('RatingsController', () => {
  let controller: RatingsController;
  let service: RatingsService; // To access the mock service methods

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingsController],
      providers: [
        {
          provide: RatingsService,
          useValue: mockRatingsService, // Use the mock service
        },
      ],
    }).compile();

    controller = module.get<RatingsController>(RatingsController);
    service = module.get<RatingsService>(RatingsService); // Get the mock service instance

    // Reset all mocks before each test
    for (const key in mockRatingsService) {
      if (Object.prototype.hasOwnProperty.call(mockRatingsService, key)) {
        (mockRatingsService[key] as jest.Mock).mockReset();
      }
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Create Rating Tests ---
  describe('create', () => {
    it('should create a rating and return the response DTO', async () => {
      const createRatingDto: CreateRatingDto = {
        movieId: 'some-movie-uuid',
        score: new Score(8),
        comment: 'Great movie!',
      };

      const mockCreatedRatingDomain = Rating.create(
        {
          movieId: 'some-movie-uuid',
          score: new Score(8),
          comment: 'Great movie!',
        },
        'rating-id-1',
      );

      const mockResponseDto = new CreateRatingResponseDto(
        mockCreatedRatingDomain,
      );

      mockRatingsService.create.mockResolvedValue(mockResponseDto);

      const result = await controller.create(createRatingDto);

      expect(service.create).toHaveBeenCalledWith(createRatingDto);
      expect(result).toEqual(mockResponseDto);
      expect(result.rating.id).toEqual('rating-id-1');
      expect(result.rating.score).toEqual(8);
    });

    it('should throw an error if service creation fails', async () => {
      const createRatingDto: CreateRatingDto = {
        movieId: 'invalid-movie-id',
        score: new Score(5),
      };
      const errorMessage = 'Error creating rating';
      mockRatingsService.create.mockRejectedValue(
        new Error(errorMessage), // Simulate an error from the service
      );

      await expect(controller.create(createRatingDto)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  // --- Find All Ratings Tests ---
  describe('findAll', () => {
    it('should return an array of ratings', async () => {
      const mockRatings: Rating[] = [
        Rating.create(
          { movieId: 'movie-1', score: new Score(7) },
          'rating-id-1',
        ),
        Rating.create(
          { movieId: 'movie-2', score: new Score(9) },
          'rating-id-2',
        ),
      ];
      mockRatingsService.findAll.mockResolvedValue(mockRatings);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRatings);
      expect(result).toHaveLength(2);
      expect(result[0].id).toEqual('rating-id-1');
    });

    it('should return an empty array if no ratings are found', async () => {
      mockRatingsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw an error if service findAll fails', async () => {
      const errorMessage = 'Error fetching ratings';
      mockRatingsService.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll()).rejects.toThrow(errorMessage);
    });
  });

  // --- Find One Rating Tests ---
  describe('findOne', () => {
    it('should return a single rating by ID', async () => {
      const ratingId = 'test-rating-id';
      const mockRating = Rating.create(
        { movieId: 'movie-id', score: new Score(8), comment: 'Good' },
        ratingId,
      );
      mockRatingsService.findOne.mockResolvedValue(mockRating);

      const result = await controller.findOne(ratingId);

      expect(service.findOne).toHaveBeenCalledWith(ratingId);
      expect(result).toEqual(mockRating);
      expect(result.id).toEqual(ratingId);
      expect(result.score.getValue()).toEqual(8);
    });

    it('should throw an error if rating is not found', async () => {
      const ratingId = 'non-existent-id';
      const errorMessage = `Rating with ID ${ratingId} not found`;
      mockRatingsService.findOne.mockRejectedValue(
        new Error(errorMessage), // Simulate the service throwing an error
      );

      await expect(controller.findOne(ratingId)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if service findOne fails', async () => {
      const ratingId = 'error-id';
      const errorMessage = 'Database error';
      mockRatingsService.findOne.mockRejectedValue(new Error(errorMessage));

      await expect(controller.findOne(ratingId)).rejects.toThrow(errorMessage);
    });
  });

  // --- Update Rating Tests ---
  describe('update', () => {
    it('should update a rating and return the updated rating', async () => {
      const ratingId = 'update-rating-id';
      const updateRatingDto: UpdateRatingDto = {
        score: new Score(10),
        comment: 'Excellent!',
      };
      const mockUpdatedRating = Rating.create(
        { movieId: 'movie-id', score: new Score(10), comment: 'Excellent!' },
        ratingId,
      );
      mockRatingsService.update.mockResolvedValue(mockUpdatedRating);

      const result = (await controller.update(
        ratingId,
        updateRatingDto,
      )) as Rating;

      expect(service.update).toHaveBeenCalledWith(ratingId, updateRatingDto);
      expect(result).toEqual(mockUpdatedRating);
      expect(result.id).toEqual(ratingId);
      expect(result.score.getValue()).toEqual(10);
    });

    it('should throw an error if rating to update is not found', async () => {
      const ratingId = 'non-existent-update-id';
      const updateRatingDto: UpdateRatingDto = { score: new Score(5) };
      const errorMessage = `Rating with ID ${ratingId} not found`;
      mockRatingsService.update.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.update(ratingId, updateRatingDto),
      ).rejects.toThrow(errorMessage);
    });

    it('should throw an error if service update fails', async () => {
      const ratingId = 'error-update-id';
      const updateRatingDto: UpdateRatingDto = { score: new Score(5) };
      const errorMessage = 'Update failed';
      mockRatingsService.update.mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.update(ratingId, updateRatingDto),
      ).rejects.toThrow(errorMessage);
    });
  });

  // --- Remove Rating Tests ---
  describe('remove', () => {
    it('should remove a rating successfully', async () => {
      const ratingId = 'delete-rating-id';
      const successResponse = {
        success: true,
        message: `Rating with ID ${ratingId} deleted successfully`,
      };
      mockRatingsService.remove.mockResolvedValue(successResponse);

      const result = await controller.remove(ratingId);

      expect(service.remove).toHaveBeenCalledWith(ratingId);
      expect(result).toEqual(successResponse);
    });

    it('should throw an error if rating to remove is not found', async () => {
      const ratingId = 'non-existent-delete-id';
      const errorMessage = `Rating with ID ${ratingId} not found`;
      mockRatingsService.remove.mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(ratingId)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if service remove fails', async () => {
      const ratingId = 'error-delete-id';
      const errorMessage = 'Deletion failed';
      mockRatingsService.remove.mockRejectedValue(new Error(errorMessage));

      await expect(controller.remove(ratingId)).rejects.toThrow(errorMessage);
    });
  });
});
