import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingsRepository } from './repository/ratings.repository';
import { Rating } from './domain/rating.domain';

@Injectable()
export class RatingsService {
  constructor(private readonly ratingRepository: RatingsRepository) {}
  create(createRatingDto: CreateRatingDto) {
    const rating = Rating.create(createRatingDto);

    const ratingToCreate = this.ratingRepository.create(rating);
    return ratingToCreate;
  }

  findAll() {
    return `This action returns all ratings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
