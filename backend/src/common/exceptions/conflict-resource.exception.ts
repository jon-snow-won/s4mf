import { ConflictException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

class ConflictResourceError {
  @ApiProperty({ example: 'CONFLICT_DESCRIPTION' })
  description: string;
  @ApiProperty({ example: '0' })
  conflictResourceId: string;
  @ApiProperty({ example: 'RESOURCE' })
  conflictResourceName: string;
}

export class ConflictResourceException extends ConflictException {
  @ApiProperty({ example: 409 })
  code: number;
  @ApiProperty({ example: 'Conflict resource' })
  message: string;
  @ApiProperty({ type: [ConflictResourceError] })
  errors: ConflictResourceError[];
  constructor(errors: ConflictResourceError[]) {
    super({
      code: 409,
      message: 'Conflict resource',
      errors,
    });
  }
}
