import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false })
  roles?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ required: false })
  rolesOverride?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  updatedAt?: Date;
}
