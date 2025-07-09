import { HttpException, HttpStatus } from '@nestjs/common';

export class ActorException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
