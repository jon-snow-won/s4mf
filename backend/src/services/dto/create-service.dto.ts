import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Setting } from '../../settings/entities/settings.entity';
import { ServiceType } from '../entities/service-type.entity';
import { Type } from 'class-transformer';
import { Role } from '../../roles/entities/role.entity';
import { Service } from '../entities/service.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => ServiceType)
  @ApiProperty({ type: Number })
  type: ServiceType;

  @IsNotEmpty()
  @Type(() => Role)
  @ApiProperty({ type: Number, isArray: true })
  roles: Role[];

  @IsNotEmpty()
  @Type(() => Setting)
  @ApiProperty({ type: Number, isArray: true })
  settings: Setting[];

  @IsOptional()
  @Type(() => Service)
  @ApiProperty({ type: Number, isArray: true })
  descendants?: Service[];
}
