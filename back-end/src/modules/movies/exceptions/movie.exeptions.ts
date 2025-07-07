import { HttpException, HttpStatus } from '@nestjs/common';

export class MovieException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
