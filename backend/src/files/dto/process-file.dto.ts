import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProcessFileDto {
  @ApiProperty({
    type: 'number',
    description: 'ID of component',
  })
  @IsNotEmpty()
  componentId: number;
}
