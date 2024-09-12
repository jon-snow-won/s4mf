import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ToBoolean } from '../decorators/transform.decorator';

export class EntityDiffFieldsDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Only show fields that have changed',
    default: false,
  })
  @IsBoolean()
  @ToBoolean()
  onlyChanges?: boolean;
}
