import { HttpException, HttpStatus } from '@nestjs/common';

export class RatingException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
