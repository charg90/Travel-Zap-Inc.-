import { Injectable } from '@nestjs/common';
import {
  CreateRatingDto,
  CreateRatingResponseDto,
} from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingsRepository } from './repository/ratings.repository';
import { Rating } from './domain/rating.domain';
import { RatingException } from './exeption/ratings.exeption';

@Injectable()
export class RatingsService {
  constructor(private readonly ratingRepository: RatingsRepository) {}
  async create(createRatingDto: CreateRatingDto) {
    try {
      const rating = Rating.create(createRatingDto);
      const ratingToCreate = await this.ratingRepository.create(rating);
      return new CreateRatingResponseDto(ratingToCreate);
    } catch (error) {
      throw new RatingException('Error creating rating', 500);
    }
  }

  async findAll() {
    try {
      const ratings = await this.ratingRepository.findAll();
      return ratings;
    } catch (error) {
      throw new RatingException('Error fetching ratings', 500);
    }
  }

  async findOne(id: string) {
    try {
      const rating = await this.ratingRepository.findById(id);
      if (!rating) {
        throw new RatingException(`Rating with ID ${id} not found`, 404);
      }
      return rating;
    } catch (error) {
      throw new RatingException(`Rating with ID ${id} not found`, 404);
    }
  }

  async update(id: string, updateRatingDto: UpdateRatingDto) {
    try {
      const existingRating = await this.ratingRepository.findById(id);
      if (!existingRating) {
        throw new RatingException(`Rating with ID ${id} not found`, 404);
      }

      const updateData: Partial<Rating> = {};
      if (updateRatingDto.score) {
        updateData.score = updateRatingDto.score;
      }
      if (updateRatingDto.comment) {
        updateData.comment = updateRatingDto.comment;
      }

      const ratingToUpdate = Rating.create({
        ...existingRating.props,
        ...updateData,
      });

      const updatedRating = await this.ratingRepository.update(
        id,
        ratingToUpdate,
      );

      return updatedRating;
    } catch (error) {
      throw new RatingException(
        `Error updating rating with ID ${id}: ${error.message}`,
        500,
      );
    }
  }

  async remove(id: string) {
    try {
      const existingRating = await this.ratingRepository.findById(id);
      if (!existingRating) {
        throw new RatingException(`Rating with ID ${id} not found`, 404);
      }
      const deleted = await this.ratingRepository.delete(id);
      if (!deleted) {
        throw new RatingException(`Failed to delete rating with ID ${id}`, 500);
      }
      return {
        success: true,
        message: `Rating with ID ${id} deleted successfully`,
      };
    } catch (error) {
      throw new RatingException(`Rating with ID ${id} not found`, 404);
    }
  }
}
