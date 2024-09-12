import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Service } from '../../services/entities/service.entity';
import { Setting } from '../../settings/entities/settings.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStructureDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @ApiProperty({ type: Number, isArray: true })
  services: Service[];

  @IsOptional()
  @ApiProperty({ type: Number, isArray: true })
  settings: Setting[];
}
