import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ToBoolean } from '../decorators/transform.decorator';

export class CommonDeleteQueryFieldsDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  @ToBoolean()
  readonly isHardDelete: boolean = false;
}
