import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ToBoolean } from 'common/decorators/transform.decorator';

export class ActiveStructureDto {
  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Return only active structure' })
  onlyActive: boolean = false;
}
