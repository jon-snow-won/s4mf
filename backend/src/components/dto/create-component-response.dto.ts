import { Component } from '../entities/component.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentResponseDto {
  @ApiProperty()
  component: Component;
  @ApiProperty()
  uploadedFilesCount: number;

  constructor(partial?: Partial<CreateComponentResponseDto>) {
    Object.assign(this, partial);
  }
}
