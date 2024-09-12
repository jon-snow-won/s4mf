import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class BadRequestError {
  @ApiProperty({ example: 'Error description' })
  details: string;

  @ApiProperty({ example: 'Error reason' })
  reason: string;
}

export class DetailedBadRequestException extends BadRequestException {
  @ApiProperty({ example: 400 })
  code: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty({ type: [BadRequestError] })
  errors: BadRequestError[];

  constructor(errors: BadRequestError[]) {
    super({
      code: 400,
      message: 'Bad Request',
      errors,
    });
  }
}
