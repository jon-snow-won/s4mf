import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class NotFoundError {
  @ApiProperty({ example: 'Error description' })
  details: string;

  @ApiProperty({ example: 'Resource id' })
  resourceId: string;

  @ApiProperty({ example: 'Resource name' })
  resourceName: string;
}

export class DetailedNotFoundException extends NotFoundException {
  @ApiProperty({ example: 404 })
  code: number;
  @ApiProperty({ example: 'Not Found' })
  message: string;
  @ApiProperty({ type: [NotFoundError] })
  errors: NotFoundError[];
  constructor(errors: NotFoundError[]) {
    super({
      code: 404,
      message: 'Not Found',
      errors,
    });
  }
}
