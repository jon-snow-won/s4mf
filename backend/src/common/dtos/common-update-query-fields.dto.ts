import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ToBoolean } from '../decorators/transform.decorator';

export class CommonUpdateQueryFieldsDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  @ToBoolean()
  readonly toReplace: boolean = false;
}
