import { ForbiddenException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class ForbiddenError {
  @ApiProperty({ example: 'Error description' })
  details: string;
}

export class DetailedForbiddenException extends ForbiddenException {
  @ApiProperty({ example: 403 })
  code: number;

  @ApiProperty({ example: 'Forbidden' })
  message: string;

  @ApiProperty({ type: [ForbiddenError] })
  errors: ForbiddenError[];

  constructor(errors: ForbiddenError[]) {
    super({
      code: 403,
      message: 'Forbidden',
      errors,
    });
  }
}
